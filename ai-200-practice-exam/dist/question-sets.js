// Session selection is shared by the standalone and embedded applications.
(() => {
  const data = window.AI200_DATA;
  const community = window.AI200_COMMUNITY || {sets: [], questions: []};
  const sets = [
    {id: 'curated', name: 'Original practice questions', group: 'Existing collection'},
    {id: 'microsoft-learn', name: 'Microsoft Learn module assessments', group: 'Existing collection'},
    {id: 'instructor', name: 'Instructor sample', group: 'Existing collection'},
    ...community.sets
  ];
  const groups = {'quizplay-set-3': 'QuizPlay', suralmk: 'Suralmk', bouvet: 'Bouvet'};
  sets.forEach(set => { set.group = groups[set.group] || set.group; });
  const groupOrder = ['Existing collection', 'QuizPlay', 'Suralmk', 'Bouvet'];
  sets.sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
  const tag = q => ({...q, setId: q.official ? 'microsoft-learn' : 'curated'});
  const questions = [
    ...data.QUESTION_BANK.map(tag),
    ...data.CASES.flatMap(c => c.questions.map(q => ({...tag(q), caseId: 'curated:' + c.title, caseTitle: c.title, caseData: c.tabs}))),
    ...data.LOCKED_SET.questions.map(q => ({...tag(q), scenario: data.LOCKED_SET.scenario})),
    ...(window.AI200_INSTRUCTOR_SAMPLE?.questions || []).map(q => ({...q, setId: 'instructor'})),
    ...community.questions
  ];
  const byId = new Map(sets.map(set => [set.id, set]));
  sets.forEach(set => { set.count = questions.filter(q => q.setId === set.id).length; });
  const defaults = sets.map(set => set.id);
  const normalize = ids => [...new Set(Array.isArray(ids) ? ids : defaults)].filter(id => byId.has(id));
  const pool = ids => { const chosen = new Set(normalize(ids)); return questions.filter(q => chosen.has(q.setId)); };
  const caseKey = q => q.caseId || q.caseTitle || q.scenarioText?.title;
  function caseGroups(input) {
    const groups = new Map();
    input.filter(caseKey).forEach(q => { const key = caseKey(q); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(q); });
    return [...groups.values()];
  }
  // Round-robin over independently shuffled sets avoids a large bank drowning out
  // a small selected set. Domain targets are applied before this selection.
  function take(input, count, shuffle) {
    const buckets = new Map();
    shuffle(input).forEach(q => { if (!buckets.has(q.setId)) buckets.set(q.setId, []); buckets.get(q.setId).push(q); });
    const queues = shuffle([...buckets.values()]), output = [];
    while (output.length < count && queues.some(q => q.length)) {
      for (const queue of queues) if (queue.length && output.length < count) output.push(queue.pop());
    }
    return output;
  }
  function weighted(input, count, shuffle, fixed = []) {
    const output = [...fixed], used = new Set(output.map(q => q.id));
    const available = () => input.filter(q => !used.has(q.id));
    const add = values => values.forEach(q => { if (!used.has(q.id)) { output.push(q); used.add(q.id); } });
    const unknown = input.filter(q => !data.EXAM_DOMAIN_COUNTS[q.domain]);
    const sourceCount = new Set(input.map(q => byId.get(q.setId).group)).size;
    const unknownCount = Math.min(unknown.length, sourceCount === 1 && unknown.length === input.length ? count : Math.round(count / Math.max(sourceCount, 2)));
    add(take(unknown, Math.min(unknownCount, count - output.length), shuffle));
    const knownTarget = count - unknownCount;
    const targets = Object.entries(data.EXAM_DOMAIN_COUNTS).map(([domain, weight]) => ({domain, count: Math.floor(knownTarget * weight / 50), fraction: knownTarget * weight / 50 % 1}));
    let remainder = knownTarget - targets.reduce((n, t) => n + t.count, 0);
    [...targets].sort((a, b) => b.fraction - a.fraction).forEach(t => { if (remainder > 0) { t.count++; remainder--; } });
    for (const target of targets) {
      const need = Math.max(0, target.count - output.filter(q => q.domain === target.domain).length);
      add(take(available().filter(q => q.domain === target.domain), Math.min(need, count - output.length), shuffle));
    }
    add(take(available(), count - output.length, shuffle));
    return shuffle(output);
  }
  function selectionInfo(mode, ids) {
    const input = pool(mode === 'sample' ? ['instructor'] : ids);
    const cases = caseGroups(input);
    const target = mode === 'exam' ? 50 : mode === 'quick' ? 20 : input.length;
    const count = mode === 'case' ? (cases.length ? Math.max(...cases.map(qs => qs.length)) : 0) : Math.min(target, input.length);
    const limited = mode === 'exam' && (input.some(q => !data.EXAM_DOMAIN_COUNTS[q.domain]) || Object.entries(data.EXAM_DOMAIN_COUNTS).some(([domain, n]) => input.filter(q => q.domain === domain).length < n));
    return {available: input.length, count, caseCount: cases.length, note: limited ? 'This selection cannot reproduce the full exam domain distribution. Instructor questions are not classified by domain.' : '', error: !input.length ? 'Select at least one question set.' : mode === 'case' && !cases.length ? 'The selected sets contain no case studies. Choose another set or session.' : ''};
  }
  function build(mode, ids, shuffle) {
    const info = selectionInfo(mode, ids);
    if (info.error) throw new Error(info.error);
    const selectedIds = normalize(mode === 'sample' ? ['instructor'] : ids);
    const input = pool(selectedIds);
    let selected, sections, seconds = 0;
    if (mode === 'case') {
      selected = shuffle(caseGroups(input))[0];
    } else if (mode === 'exam' || mode === 'quick') {
      let fixed = [];
      if (mode === 'exam' && selectedIds.includes('curated')) {
        const ownCases = caseGroups(input.filter(q => q.setId === 'curated'));
        fixed = [...(shuffle(ownCases)[0] || []), ...input.filter(q => q.locked)];
      }
      selected = weighted(input, info.count, shuffle, fixed);
      seconds = selected.length * 120;
    } else {
      selected = mode === 'sample' ? [...input].sort((a, b) => (a.number || 0) - (b.number || 0)) : shuffle(input);
    }
    const unlocked = q => ({...q, locked: false});
    if (mode === 'exam') {
      const general = selected.filter(q => !caseKey(q) && !q.locked);
      sections = general.length ? [{id: 'main', title: 'General questions', questions: general, reviewable: true}] : [];
      for (const [i, qs] of caseGroups(selected).entries()) sections.push({id: 'case-' + i, title: 'Case study: ' + (qs[0].caseTitle || qs[0].scenarioText.title), questions: qs, reviewable: true});
      const locked = selected.filter(q => q.locked).sort((a, b) => a.id.localeCompare(b.id));
      if (locked.length) sections.push({id: 'locked', title: data.LOCKED_SET.title, scenario: data.LOCKED_SET.scenario, questions: locked, reviewable: false});
    } else {
      // Keep each scenario contiguous, with its context also attached to each item.
      const grouped = [...selected.filter(q => !caseKey(q)), ...caseGroups(selected).flat()];
      sections = [{id: mode, title: {study: 'Study mode', quick: 'Quick assessment', case: 'Case study drill', sample: 'Instructor sample exam'}[mode] || mode, questions: grouped.map(unlocked), reviewable: true}];
    }
    const distribution = Object.fromEntries(Object.keys(data.EXAM_DOMAIN_COUNTS).map(d => [d, selected.filter(q => q.domain === d).length]));
    const balanced = selected.length === 50 && Object.entries(data.EXAM_DOMAIN_COUNTS).every(([d, n]) => distribution[d] === n);
    const note = mode === 'exam' && !balanced ? 'This selection does not reproduce the full exam domain distribution. Instructor questions are not classified by domain.' : '';
    return {sections, seconds, selectedSetIds: selectedIds, selectionNote: note};
  }
  window.AI200_SETS = {sets, questions, defaults, normalize, pool, selectionInfo, build, name: id => byId.get(id)?.name || id};
})();
