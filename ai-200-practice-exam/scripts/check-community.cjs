const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const context = {window:{}};
for (const name of ['questions','instructor-sample','community-questions','topic-review-questions','question-sets']) vm.runInNewContext(fs.readFileSync(path.join(root, 'dist', name + '.js'), 'utf8'), context);
const {AI200_SETS: catalog, AI200_DATA: data, AI200_COMMUNITY: community} = context.window;
assert.equal(community.questions.length, 861);
assert.equal(community.sets.length, 27);
assert.equal(catalog.questions.length, 1357);
assert.equal(catalog.sets.length, 31);
assert.equal(new Set(catalog.questions.map(q=>q.id)).size, 1357);
let seed = 812931;
function shuffle(input) {
  const output = [...input];
  for (let i = output.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = Math.floor(seed / 4294967296 * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}
const answerText = q => (Array.isArray(q.answer) ? q.answer : [q.answer]).map(i=>q.options[i]).sort().join('\n');
const original = JSON.stringify(catalog.questions);
for (const q of catalog.questions) {
  assert.ok(q.prompt && q.explanation, q.id + ': prompt and explanation');
  assert.ok(catalog.sets.some(set=>set.id===q.setId), q.id + ': known set');
  assert.ok(['single','multi','yesno','order','drag','matching','matrix'].includes(q.type), q.id + ': supported question type');
  if (['single','multi','yesno'].includes(q.type)) {
    for (const index of Array.isArray(q.answer) ? q.answer : [q.answer]) assert.ok(Number.isInteger(index) && index >= 0 && index < q.options.length, q.id);
    if (q.type==='multi') assert.equal(q.answer.length,q.choose,q.id);
    for (let i=0;i<20;i++) assert.equal(answerText(data.prepareQuestion(q,shuffle)),answerText(q),q.id + ': shuffled answer');
  } else if (q.type==='matrix') {
    assert.equal(q.rows.length,q.answer.length,q.id);
    q.rows.forEach((row,i)=>assert.ok(row[1].includes(q.answer[i]),q.id));
  } else {
    for (const answer of q.answer) assert.ok(q.options.includes(answer),q.id + ': answer occurs in choices');
    if (q.type==='matching') assert.equal(q.rows.length,q.answer.length,q.id);
  }
}
const match = community.questions.find(q=>q.type==='matching');
assert.ok(match.options.length > match.answer.length, 'QuizPlay matching decoy remains available');
for (const set of catalog.sets) {
  for (const mode of ['study','exam','quick']) {
    const session = catalog.build(mode,[set.id],shuffle);
    const qs = session.sections.flatMap(s=>s.questions);
    assert.equal(qs.length,Math.min(set.count,mode==='exam'?50:mode==='quick'?20:set.count),set.id + '/' + mode);
    assert.ok(qs.every(q=>q.setId===set.id),'Excluded sources cannot leak into ' + set.id + '/' + mode);
    assert.equal(session.seconds,['exam','quick'].includes(mode)?qs.length*120:0);
    assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
    if (mode==='study') assert.ok(qs.every(q=>!q.locked));
  }
}
for (let run=0;run<100;run++) {
  const ids = shuffle(catalog.defaults).slice(0,1+run%catalog.sets.length);
  const qs = catalog.build('exam',ids,shuffle).sections.flatMap(s=>s.questions);
  assert.ok(qs.every(q=>ids.includes(q.setId)));
  assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
  assert.equal(qs.length,Math.min(50,catalog.pool(ids).length));
  const core = catalog.build('exam',['curated','microsoft-learn'],shuffle).sections.flatMap(s=>s.questions);
  for (const [domain,n] of Object.entries(data.EXAM_DOMAIN_COUNTS)) assert.equal(core.filter(q=>q.domain===domain).length,n);
}
for (const mode of ['exam','quick','study','case']) assert.throws(()=>catalog.build(mode,[],shuffle),/Select at least/);
assert.throws(()=>catalog.build('case',['microsoft-learn'],shuffle),/no case studies/);
assert.ok(catalog.build('case',['quizplay-set-3'],shuffle).sections[0].questions.every(q=>q.caseData && q.setId==='quizplay-set-3'));
assert.equal(catalog.normalize(['instructor','instructor','missing']).join(','),'instructor');
assert.equal(JSON.stringify(catalog.questions),original,'Selection must never mutate the catalog');
const review = context.window.AI200_TOPIC_REVIEW;
assert.equal(review.questions.length,59);
assert.equal(review.questions.map(q=>q.userItem).join(','),Array.from({length:59},(_,i)=>i+1).join(','));
assert.equal(new Set(review.questions.filter(q=>q.caseId).map(q=>q.caseId)).size,2);
for (const q of review.questions) {
  assert.ok(q.source.startsWith('https://') && q.reviewDate && q.origin,q.id + ': documented provenance');
  assert.ok(q.additionalSources.every(url=>url.startsWith('https://')),q.id);
}
for (let run=0;run<100;run++) {
  const exam=catalog.build('exam',['topic-review-59'],shuffle);
  assert.equal(exam.selectionNote,'');
  const selected=exam.sections.flatMap(s=>s.questions);
  for (const [domain,n] of Object.entries(data.EXAM_DOMAIN_COUNTS)) assert.equal(selected.filter(q=>q.domain===domain).length,n);
}
const patches = JSON.parse(fs.readFileSync(path.join(root,'data/community-corrections.json')));
for (const [id,patch] of Object.entries(patches)) {
  const q = community.questions.find(q=>q.id===id);
  assert.ok(q && q.reviewNote===patch.reason && q.source.startsWith('https://'),id);
}
let files = 0;
for (const source of JSON.parse(fs.readFileSync(path.join(root,'../sources/manifest.json')))) {
  for (const file of source.files) {
    const contents = fs.readFileSync(path.join(root,'../sources',source.id,file.path));
    assert.equal(contents.length,file.bytes,file.path);
    assert.equal(crypto.createHash('sha256').update(contents).digest('hex'),file.sha256,file.path);
    files++;
  }
}
vm.runInNewContext(fs.readFileSync(path.join(root,'../sources/library-data.js'),'utf8'),context);
assert.equal(context.window.AI200_LIBRARY.length,184);
assert.equal(context.window.AI200_LIBRARY.filter(e=>e.id.startsWith('naytron:') && e.id!=='naytron:study-aid').length,23);
for (const guide of context.window.AI200_LIBRARY) assert.ok(fs.existsSync(path.join(root,'../sources',guide.path)),guide.path);
console.log(`PASS: 1357 questions, 31 sets, 184 guides/labs; all answer structures, shuffled answers, selection isolation, 100 mixed exams, domain quotas, ${Object.keys(patches).length} review records and ${files} source checksums.`);
