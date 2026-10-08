const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const assertScenarioBlocks = (questions, label) => {
  const firstScenario = questions.findIndex(q => q.scenarioText);
  if (firstScenario < 0) return;
  assert.ok(questions.slice(0, firstScenario).every(q => !q.scenarioText), `${label}: general questions precede the case studies`);
  assert.ok(questions.slice(firstScenario).every(q => q.scenarioText), `${label}: general questions do not interrupt a case study`);
  const titles = questions.slice(firstScenario).map(q => q.scenarioText.title);
  const runs = titles.filter((title, index) => index === 0 || title !== titles[index - 1]);
  assert.equal(runs.length, new Set(titles).size, `${label}: each case study is one contiguous block`);
};

// Run session startup, feedback and results with a small in-memory DOM facade.
for (const engine of ['dist', 'inline']) {
  for (const randomValue of [0.1, 0.9]) {
    const modes = engine === 'dist' ? [['exam',50],['quick',20],['case',5],['study',263],['sample',174]] : [['exam',50],['quick',20],['case',5],['study',263]];
    for (const [mode, total] of modes) {
      const elements = new Map();
      const element = id => {
        if (!elements.has(id)) elements.set(id, {innerHTML:'', querySelectorAll:()=>[], style:{}});
        return elements.get(id);
      };
      const storage = new Map();
      const math = Object.create(Math);
      math.random = () => randomValue;
      const context = {
        window:{}, Math:math,
        document:{getElementById:element, querySelectorAll:()=>[], addEventListener:()=>{}, visibilityState:'visible'},
        localStorage:{getItem:key=>storage.get(key)||null, setItem:(key,value)=>storage.set(key,value), removeItem:key=>storage.delete(key)},
        setInterval:()=>1, clearInterval:()=>{}
      };
      vm.runInNewContext(read('dist/questions.js'), context);
      if (engine === 'dist') vm.runInNewContext(read('dist/instructor-sample.js'), context);
      let script;
      if (engine === 'dist') {
        const original = read('dist/app.js');
        script = original.replace(/\n\s*welcome\(\);\s*\}\)\(\);\s*$/, '\nwindow.__review={start:(mode,source)=>{selectedMode=mode;if(source)selectedSource=source;startSession()},state:()=>state,feedback:feedbackMarkup,options:optionMarkup,answered:isAnswered,correct:isCorrect,finish,render:renderQuestion,next};welcome();\n})();');
        assert.notEqual(script, original);
      } else {
        const original = read('inline/runtime.part').replace(/<\/script>\s*$/, '');
        script = original.replace(/\nhome\(\);\s*\}\)\(\);\s*$/, '\nwindow.__review={start,state:()=>st,feedback,finish,render,next};home();\n})();');
        assert.notEqual(script, original);
      }
      vm.runInNewContext(script, context);
      const api = context.window.__review;
      api.start(mode);
      const state = api.state();
      const questions = state.flat || state.qs;
      assert.equal(questions.length, total, `${engine}/${mode}`);
      if (engine === 'dist') assert.ok(storage.has('ai200-active-session-v1'),`${mode}: active session is persisted`);
      if (engine === 'dist') assert.equal(element('app').innerHTML.includes('Take a break'),['exam','quick'].includes(mode),`${mode}: break control matches timed-session behavior`);
      if (engine === 'dist' && mode === 'exam') {
        assert.equal(questions.filter(q=>q.id.startsWith('INS')).length, 15, 'mixed official flow contains 15 instructor questions');
        assertScenarioBlocks(questions.filter(q=>q.id.startsWith('INS')), 'mixed official flow instructor questions');
      }
      if (engine === 'dist' && mode === 'sample') {
        const typeCounts = questions.reduce((counts,q)=>((counts[q.type]=(counts[q.type]||0)+1),counts),{});
        const ocrDebris = /(?:\n\s*Proposed\s*\n|\bapi'|\bretums\b|\bKOL\b|\bdese\b|\broling\b|\bVaut\b|\bforthe\b|\batleast\b|\battempis\b|\bupto\b|\bina\b|\bNo n\b|\brequest_ount\b|\bDefaultazure\b|\bvoult\b|\bthe\. change\b|solution NOTE|requirements Which|configuration Which|processing Authentication|To answer, move|Show List|\uFFFD)/i;
        const placeholderExplanation = /^(?:Compare the answer|Arrange the choices|Review the supplied)/i;
        assert.equal(typeCounts.sample||0, 0, 'no instructor question depends on a full question screenshot');
        assert.equal(typeCounts.matrix, 48, 'all former visual answer areas use native matrix controls');
        assert.equal(questions.length, 174, 'all instructor questions are natively rendered');
        assert.equal(questions.filter(q=>q.locked).length,0,'all instructor questions remain freely navigable in self-paced mode');
        assert.equal(questions.filter(q=>!['manual','manualText'].includes(q.type)).length,174,'all 174 instructor questions are automatically gradable');
        for (const q of questions) {
          assert.ok(!ocrDebris.test(JSON.stringify(q)), `${q.id}: known OCR debris must be removed`);
          assert.ok(!placeholderExplanation.test(q.explanation||''), `${q.id}: explanation must be useful`);
          if (['single','multi'].includes(q.type)) {
            for (const answer of (Array.isArray(q.answer)?q.answer:[q.answer])) assert.ok(Number.isInteger(answer)&&answer>=0&&answer<q.options.length,`${q.id}: answer index exists`);
          }
          if (['order','drag'].includes(q.type)) for (const answer of q.answer) assert.ok(q.options.includes(answer),`${q.id}: ordered answer exists in choices`);
          if (q.type==='matching') for (const answer of q.answer) assert.ok(q.options.includes(answer),`${q.id}: matching answer exists in choices`);
        }
        for (const q of questions.filter(q=>q.type==='matrix')) {
          assert.equal(q.rows.length,q.answer.length,`${q.id}: every matrix row has an answer`);
          q.rows.forEach((row,index)=>assert.ok(row[1].includes(q.answer[index]),`${q.id}: answer ${index+1} occurs in its native select`));
        }
        assert.ok(questions.filter(q=>q.code).length>=15,'code-based questions include native code snippets');
        const scenarios = questions.filter(q=>q.contextPage);
        assert.equal(scenarios.length,19,'only the 19 questions with an Overview control in the source are linked to a case study');
        assert.equal(scenarios.map(q=>q.number).join(','),'2,4,25,49,62,104,105,149,162,165,10,50,70,75,125,134,163,164,172','case questions retain their verified source membership and grouped order');
        assert.equal(scenarios.filter(q=>q.scenarioText.title==='Fabrikam retail analytics platform').length,10,'Fabrikam contains its 10 verified questions');
        assert.equal(scenarios.filter(q=>q.scenarioText.title==='Proseware knowledge management platform').length,9,'Proseware contains its 9 verified questions');
        assert.ok(!questions.find(q=>q.id==='INS003').scenarioText&&!questions.find(q=>q.id==='INS020').scenarioText,'ordinary App Configuration and Service Bus questions are not mislabeled as case questions');
        assert.equal(new Set(scenarios.map(q=>q.contextPage)).size,6,'all six supplied scenario images remain available');
        for (const imagePath of new Set(scenarios.map(q=>q.contextPage))) {
          const png=fs.readFileSync(path.join(root,'dist',imagePath));
          assert.equal(png.readUInt32BE(16),1920,`${imagePath}: cropped image width`);
          assert.equal(png.readUInt32BE(20),824,`${imagePath}: Avanset header and footer are cropped`);
        }
        assert.ok(scenarios.every(q=>q.scenarioText&&q.scenarioText.sections.length>=4),'every supplied scenario has readable structured text');
        assert.ok(scenarios.every(q=>q.scenarioText.sections[0].heading==='Case study instructions'),'readable scenarios include the case-study instructions');
        assert.ok(scenarios.every(q=>q.scenarioText.sections[0].paragraphs.some(p=>p.includes('cannot return'))),'readable scenarios retain the no-return warning');
        assert.equal(new Set(scenarios.map(q=>q.scenarioText.title)).size,2,'the two supplied case studies are transcribed once and reused');
        assertScenarioBlocks(questions, 'instructor sample mode');
        const scenarioRuns = scenarios.map(q=>q.scenarioText.title).filter((title,index,titles)=>index===0||title!==titles[index-1]);
        assert.equal(scenarioRuns.join(' | '),'Fabrikam retail analytics platform | Proseware knowledge management platform','instructor cases retain their intended order');
        state.current=questions.findIndex(q=>q.scenarioText?.title==='Fabrikam retail analytics platform');api.render();
        const fabrikamMarkup=element('app').innerHTML;
        assert.ok(fabrikamMarkup.includes('Current case study')&&fabrikamMarkup.includes('Fabrikam retail analytics platform'),'Fabrikam questions identify their current case study');
        assert.ok(fabrikamMarkup.includes('Open Fabrikam retail analytics platform'),'scenario launcher names the Fabrikam story');
        assert.ok(!fabrikamMarkup.includes('Proseware knowledge management platform'),'Fabrikam questions do not show the Proseware label');
        state.current=questions.findIndex(q=>q.scenarioText?.title==='Proseware knowledge management platform');api.render();
        const prosewareMarkup=element('app').innerHTML;
        assert.ok(prosewareMarkup.includes('Current case study')&&prosewareMarkup.includes('Proseware knowledge management platform'),'Proseware questions identify their current case study');
        assert.ok(prosewareMarkup.includes('Open Proseware knowledge management platform'),'scenario launcher names the Proseware story');
        assert.ok(!prosewareMarkup.includes('Fabrikam retail analytics platform'),'Proseware questions do not show the Fabrikam label');
        state.current=questions.findIndex(q=>q.prompt.includes('Requirements:\n-'));api.render();
        const sampleMarkup = element('app').innerHTML;
        assert.ok(sampleMarkup.includes('prompt-heading')&&sampleMarkup.includes('<ul>'),'structured prompts render headings and semantic lists');
        state.current=questions.indexOf(scenarios[0]);api.render();
        const scenarioLaunchMarkup = element('app').innerHTML;
        assert.ok(scenarioLaunchMarkup.includes('scenario-launch'),'scenario questions show a large popup launcher');
        assert.ok(scenarioLaunchMarkup.includes('Readable text and original image'),'launcher describes both scenario views');
        assert.ok(read('dist/app.js').includes('document.createElement("dialog")')&&read('dist/app.js').includes('dialog.showModal()'),'scenario viewer uses a native modal dialog');
        assert.equal(questions.find(q=>q.id==='INS129').answer[0],"Initialize the application's TracerProvider for tracing",'OpenTelemetry pipeline starts with the tracer provider');
        const drag = questions.find(q=>q.type==='drag');
        const matching = questions.find(q=>q.type==='matching');
        const matrix = questions.find(q=>q.type==='matrix'&&q.code);
        assert.ok(api.options(drag).includes('data-drop-slot'));
        assert.ok(api.options(drag).includes('data-drag-choice'));
        assert.ok(api.options(matching).includes('data-match-index'));
        assert.ok(api.options(matrix).includes('data-matrix-index'));
        state.answers[drag.id]=[...drag.answer];
        state.answers[matching.id]=[...matching.answer];
        state.answers[matrix.id]=[...matrix.answer];
        assert.ok(api.answered(drag)&&api.correct(drag));
        assert.ok(api.answered(matching)&&api.correct(matching));
        assert.ok(api.answered(matrix)&&api.correct(matrix));
      }
      if (mode === 'exam' && engine === 'inline') {
        for (const [domain,count] of Object.entries(context.window.AI200_DATA.EXAM_DOMAIN_COUNTS)) {
          assert.equal(questions.filter(q=>q.domain===domain).length, count);
        }
      }
      if (mode === 'study') {
        if (engine === 'dist') {
          const caseIndex = questions.findIndex(q=>q.id==='F05');
          assert.ok(caseIndex>=0,'Study mode contains the Fabrikam telemetry question');
          assert.equal(questions[caseIndex].caseTitle,'Fabrikam Claims','Study mode preserves the case-study identity');
          assert.ok(questions[caseIndex].caseData?.Overview?.includes('insurance claim documents'),'Study mode preserves the case-study text');
          state.current=caseIndex;api.render();
          const caseMarkup=element('app').innerHTML;
          assert.ok(caseMarkup.includes('Current case study')&&caseMarkup.includes('Fabrikam Claims'),'Study mode displays the case-study name');
          assert.ok(caseMarkup.includes('Fabrikam processes insurance claim documents'),'Study mode displays the case-study context');
          state.current=0;api.render();
        }
        const first = questions[0];
        if (first.type === 'order') {
          state.answers[first.id] = [...first.answer].reverse();
          if (JSON.stringify(state.answers[first.id]) === JSON.stringify(first.answer)) {
            [state.answers[first.id][0], state.answers[first.id][1]] = [state.answers[first.id][1], state.answers[first.id][0]];
          }
        } else if (first.type === 'multi') {
          const other = first.options.findIndex((_,index) => !first.answer.includes(index));
          state.answers[first.id] = other >= 0 ? [other] : first.answer.slice(1);
        } else {
          state.answers[first.id] = (first.answer + 1) % first.options.length;
        }
        api.next();
        assert.equal(state.checked[first.id], true, `${engine}: Next must check an answered Study mode question`);
        const studyMarkup = element(engine === 'dist' ? 'app' : 'ai200-screen').innerHTML;
        assert.ok(studyMarkup.includes('answer-incorrect'), `${engine}: incorrect Study mode question remains red`);
        assert.ok(studyMarkup.includes('incorrect'), `${engine}: incorrect state has an accessible label`);
      }
      if (engine === 'dist' && mode === 'quick' && randomValue === 0.1) {
        questions.slice(0, 10).forEach(q => { state.answers[q.id] = q.answer; });
        api.finish();
        const partialMarkup = element('app').innerHTML;
        assert.ok(partialMarkup.includes('<strong>500</strong>'), 'a half-correct quick session scores 500');
        assert.ok(partialMarkup.includes('<h1 class="fail">Not passed</h1>'), 'a score below 700 is not passed');
        assert.ok(partialMarkup.includes('10 of 20 automatically gradable questions correct'), 'results show the correct answer count');
        assert.equal((partialMarkup.match(/<details class="review-answer">/g)||[]).length,20,'results include every question in answer review');
      }
      for (const q of questions) state.answers[q.id] = q.answer;
      const adapted = questions.find(q=>q.adapted);
      if (adapted) {
        const feedback = api.feedback(adapted);
        assert.ok(feedback.includes('Microsoft Learn module (adapted)'));
        assert.ok(feedback.includes(adapted.assessmentSource));
        assert.ok(feedback.endsWith('</div>'));
      }
      api.finish();
      const markup = element(engine === 'dist' ? 'app' : 'ai200-screen').innerHTML;
      if (engine === 'dist') assert.ok(!storage.has('ai200-active-session-v1'),`${mode}: submitted session is cleared`);
      assert.ok(markup.includes('1000'));
      assert.ok(markup.includes('Answer review'));
      assert.ok(!markup.includes('{state.comments'));
      assert.ok(!/\}\/div>|\}\/details>/.test(markup));
      if (engine === 'dist' && mode === 'exam' && randomValue === 0.1) {
        api.start('exam','sample');
        assert.equal(api.state().flat.filter(q=>q.id.startsWith('INS')).length,41,'instructor-only official flow contains 41 instructor questions plus case and locked sections');
        assertScenarioBlocks(api.state().flat.filter(q=>q.id.startsWith('INS')),'instructor-only official flow');
      }
    }
  }
}
console.log('PASS: both runtimes start and score every mode; case studies stay grouped; all 174 instructor questions render natively; matrix, code, drag, matching, Study mode state, domain counts, feedback, and results checked.');
