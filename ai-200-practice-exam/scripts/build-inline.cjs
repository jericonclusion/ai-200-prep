const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const oldForm = read('ai-200-exam-form.html').trimEnd();
// Both distributions use exactly the same application and selection engine.
// Embed the scenario images as well, so the form works without adjacent assets.
const inlineScript = source => source.replace(/<\/script/gi, '<\\/script');
const assets = {};
for (const [file] of read('dist/instructor-sample.js').matchAll(/instructor-sample\/contexts\/[^"\s]+\.png/g)) {
  assets[file] = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'dist', file)).toString('base64');
}
let form = read('dist/index.html').replace('<link rel="stylesheet" href="styles.css">', `<style>${read('dist/styles.css')}</style>`);
form = form.replace(/<script src="([^"]+)"><\/script>/g, (_, name) => {
  let source = read('dist/' + name);
  return `<script>${inlineScript(source)}</script>`;
});
form = form.replace('<div id="app"></div>', () => '<div id="app"></div><script>window.AI200_LIBRARY_URL="../sources/index.html";window.AI200_ASSETS=' + JSON.stringify(assets) + ';</script>');
let preview = read('inline-preview.html');
const oldEmbedded = escape(oldForm);
if (!preview.includes(oldEmbedded)) throw new Error('Preview does not contain the existing form; refusing to replace unrelated content');
preview = preview.replace(oldEmbedded, () => escape(form.trimEnd()));
fs.writeFileSync(path.join(root, 'ai-200-exam-form.html'), form);
fs.writeFileSync(path.join(root, 'inline-preview.html'), preview);
