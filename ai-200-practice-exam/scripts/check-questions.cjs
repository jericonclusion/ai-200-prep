const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const context = {window:{}};
vm.runInNewContext(read('dist/questions.js'), context);
const data = context.window.AI200_DATA;
const all = [...data.QUESTION_BANK, ...data.CASES.flatMap(c => c.questions), ...data.LOCKED_SET.questions];
assert.equal(all.length, 263);
assert.equal(new Set(all.map(q => q.id)).size, 263);
assert.equal(all.filter(q => q.official).length, 133);
assert.equal(all.filter(q => q.adapted).length, 34);
for (const q of all.filter(q => q.official)) {
  assert.ok(q.assessmentSource.startsWith('https://learn.microsoft.com/en-us/training/modules/'), q.id);
  assert.equal(q.practiceSource, undefined, q.id);
}
assert.ok(!all.some(q => JSON.stringify(q).includes('\uFFFD')), 'Question text must not contain replacement characters');
const original = JSON.stringify(all);
let seed = 123456;
function shuffle(input) {
  const output = [...input];
  for(let i=output.length-1;i>0;i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = Math.floor(seed / 4294967296 * (i+1));
    [output[i],output[j]] = [output[j],output[i]];
  }
  return output;
}
const answerText = q => (Array.isArray(q.answer) ? [...q.answer] : [q.answer]).map(i => q.options[i]).sort();
const positions = new Set();
for(let run=0;run<100;run++) {
  for(const q of all) {
    if(q.type==='multi') assert.equal(q.answer.length,q.choose);
    const prepared = data.prepareQuestion(q,shuffle);
    if(q.type==='single'||q.type==='multi') {
      assert.equal(JSON.stringify(answerText(prepared)),JSON.stringify(answerText(q)),q.id);
      if(q.type==='single') positions.add(prepared.answer);
      assert.equal(JSON.stringify([...prepared.options].sort()),JSON.stringify([...q.options].sort()));
    } else assert.equal(JSON.stringify(prepared),JSON.stringify(q));
  }
  for(const study of data.CASES) {
    const selected = [...data.selectExamQuestions(study,shuffle),...study.questions,...data.LOCKED_SET.questions];
    assert.equal(selected.length,50);
    assert.equal(new Set(selected.map(q=>q.id)).size,50);
    for(const [domain,count] of Object.entries(data.EXAM_DOMAIN_COUNTS)) assert.equal(selected.filter(q=>q.domain===domain).length,count);
  }
}
assert.equal(positions.size,4);
assert.equal(JSON.stringify(all),original,'Session randomization must not mutate the source bank');
const form = read('ai-200-exam-form.html');
assert.ok(form.includes(read('dist/questions.js').trimEnd()));
for (const script of ['community-questions.js','question-sets.js','app.js']) assert.ok(form.includes(read('dist/' + script).trim()));
const preview = read('inline-preview.html');
const escaped = form.trimEnd().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
assert.ok(preview.includes(escaped),'Preview must embed the current form');
for(const script of form.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
new vm.Script(read('dist/app.js'));
console.log('PASS: 263 questions (133 official Microsoft Learn module-assessment items); 100 randomized runs; both cases meet domain ranges; answer mappings, source immutability, inline parity and script syntax checked.');
