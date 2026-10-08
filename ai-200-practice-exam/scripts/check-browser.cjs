const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const screenshotPath = path.join(root, 'docs', 'screenshots', 'results-screen.png');
const caseScreenshotPath = path.join(root, 'docs', 'screenshots', 'case-study-label.png');
const browserCandidates = process.platform === 'win32'
  ? [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ]
  : ['/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium'];
const browser = process.env.AI200_BROWSER || browserCandidates.find(fs.existsSync);
assert.ok(browser, 'Set AI200_BROWSER to a Chromium-based browser executable.');

const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ai200-browser-'));
const contentTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = http.createServer((request, response) => {
  const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/+/, '');
  const file = path.resolve(root, requested || 'dist/index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end('Not found'); return;
  }
  response.setHeader('Content-Type', contentTypes[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});
const child = spawn(browser, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  'about:blank'
], { stdio: 'ignore', windowsHide: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function retry(action, message, attempts = 100) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try { return await action(); } catch (error) { lastError = error; await delay(50); }
  }
  throw new Error(`${message}: ${lastError?.message || 'timed out'}`);
}

async function main() {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const sitePort = server.address().port;
  const pages = await retry(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/list`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const value = await response.json();
    if (!value.length) throw new Error('No debuggable page');
    return value;
  }, 'Browser did not expose the DevTools endpoint');

  const page = pages.find(target => target.type === 'page' && !target.url.startsWith('chrome-extension://'));
  assert.ok(page, 'No browser page target was available.');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let requestId = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = (expression, message) => retry(async () => {
    const value = await evaluate(expression);
    if (!value) throw new Error(message);
    return value;
  }, message);

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: 'Math.random = () => 0.1;' });
  await send('Page.navigate', { url: `http://127.0.0.1:${sitePort}/dist/index.html` });
  try {
    await waitFor('document.readyState === "complete" && !!document.querySelector("#start")', 'Welcome screen did not load');
  } catch (error) {
    const diagnostic = await evaluate(`JSON.stringify({ href: location.href, ready: document.readyState, title: document.title, text: document.body?.innerText?.slice(0, 500), scripts: [...document.scripts].map(s => s.src) })`);
    throw new Error(`${error.message}\n${diagnostic}`);
  }

  await evaluate(`document.querySelector('[data-mode="quick"]').click(); document.querySelector('#start').click(); true`);
  await waitFor('!!document.querySelector("#ack")', 'Instructions did not open');
  await evaluate(`document.querySelector('#ack').click(); document.querySelector('#launch').click(); true`);
  await waitFor('document.querySelector(".top-count")?.textContent.includes("Question 1 of 20")', 'Quick assessment did not start');

  await evaluate(`(() => {
    const choice = document.querySelector('input[name="answer"]');
    if (choice) choice.click();
    else {
      const selects = [...document.querySelectorAll('[data-match-index], [data-matrix-index]')];
      if (selects.length) selects.forEach(select => { select.selectedIndex = 1; select.dispatchEvent(new Event('change', { bubbles: true })); });
      else document.querySelector('[data-drag-choice]')?.click();
    }
    document.querySelector('#next').click();
    return true;
  })()`);
  await waitFor('document.querySelector(".top-count")?.textContent.includes("Question 2 of 20")', 'Second question did not render before reload');
  const savedSession = await evaluate(`(() => { const value=JSON.parse(localStorage.getItem('ai200-active-session-v1')||'null'); return value&&{current:value.state.current,answers:Object.keys(value.state.answers).length}; })()`);
  assert.equal(savedSession.current,1);
  assert.ok(savedSession.answers>=1);

  await send('Page.reload');
  await waitFor('!!document.querySelector("#resumeSession")', 'Resume-session prompt did not appear after reload');
  await evaluate(`document.querySelector('#resumeSession').click(); true`);
  await waitFor('document.querySelector(".top-count")?.textContent.includes("Question 2 of 20")', 'Saved session did not resume at question 2');

  for (let index = 1; index < 20; index++) {
    await evaluate(`(() => {
      const choice = document.querySelector('input[name="answer"]');
      if (choice) { choice.click(); return true; }
      const selects = [...document.querySelectorAll('[data-match-index], [data-matrix-index]')];
      if (selects.length) { selects.forEach(select => { select.selectedIndex = 1; select.dispatchEvent(new Event('change', { bubbles: true })); }); return true; }
      const drag = document.querySelector('[data-drag-choice]');
      if (drag) { drag.click(); return true; }
      const response = document.querySelector('#sampleResponse');
      if (response) { response.value = 'Browser smoke test'; response.dispatchEvent(new Event('input', { bubbles: true })); return true; }
      return !!document.querySelector('.order-list');
    })()`);
    await evaluate(`document.querySelector('#next').click(); true`);
    if (index < 19) {
      await waitFor(`document.querySelector('.top-count')?.textContent.includes('Question ${index + 2} of 20')`, `Question ${index + 2} did not render`);
    }
  }

  await waitFor('!!document.querySelector("#leaveSection")', 'Final review did not open');
  await evaluate(`document.querySelector('#leaveSection').click(); true`);
  const summary = await waitFor(`(() => {
    const results = document.querySelector('.results');
    if (!results) return null;
    return {
      score: document.querySelector('.score-circle strong')?.textContent,
      outcome: document.querySelector('.score-hero h1')?.textContent,
      reviews: document.querySelectorAll('details.review-answer').length,
      domains: document.querySelectorAll('.domain-table tbody tr').length,
      canRestart: !!document.querySelector('#again'),
      canPrint: !!document.querySelector('#print'),
      history: JSON.parse(localStorage.getItem('ai200-history') || '[]').length,
      activeSession: localStorage.getItem('ai200-active-session-v1')
    };
  })()`, 'Results screen did not render');
  assert.match(summary.score, /^\d+$/);
  assert.match(summary.outcome, /^(Pass|Not passed)$/);
  assert.equal(summary.reviews, 20);
  assert.ok(summary.domains >= 1);
  assert.ok(summary.canRestart && summary.canPrint);
  assert.equal(summary.history, 1);
  assert.equal(summary.activeSession, null);

  const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, fromSurface: true });
  fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  await evaluate(`document.querySelector('#again').click(); document.querySelector('[data-mode="sample"]').click(); document.querySelector('#start').click(); true`);
  await waitFor('!!document.querySelector("#ack")', 'Instructor sample instructions did not open');
  await evaluate(`document.querySelector('#ack').click(); document.querySelector('#launch').click(); true`);
  await waitFor('document.querySelector(".top-count")?.textContent.includes("of 174")', 'Instructor sample set did not start');
  const caseIndexes = await evaluate(`(() => {
    const questions = window.AI200_INSTRUCTOR_SAMPLE.questions;
    const general = questions.filter(q => !q.scenarioText).length;
    const fabrikam = questions.filter(q => q.scenarioText?.title === 'Fabrikam retail analytics platform').length;
    return { fabrikam: general, proseware: general + fabrikam };
  })()`);
  for (const [title, index] of [['Fabrikam retail analytics platform', caseIndexes.fabrikam], ['Proseware knowledge management platform', caseIndexes.proseware]]) {
    await evaluate(`document.querySelector('[data-index="${index}"]').click(); true`);
    const visibleCase = await waitFor(`document.querySelector('.active-case strong')?.textContent`, `${title} label did not render`);
    const visibleLauncher = await evaluate(`document.querySelector('.scenario-launch strong')?.textContent`);
    assert.equal(visibleCase, title);
    assert.equal(visibleLauncher, `Open ${title}`);
  }
  await evaluate('window.scrollTo(0, 0); true');
  const caseScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
  fs.writeFileSync(caseScreenshotPath, Buffer.from(caseScreenshot.data, 'base64'));
  console.log(`PASS: completed a 20-question browser session; results show ${summary.score}/1000 (${summary.outcome}), 20 review items, and ${summary.domains} skill areas; both instructor case-study labels render correctly.`);
  console.log(`Screenshot: ${screenshotPath}`);
  console.log(`Screenshot: ${caseScreenshotPath}`);
  socket.close();
}

main().finally(async () => {
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
  } else {
    child.kill('SIGKILL');
  }
  await new Promise(resolve => server.close(resolve));
  await delay(250);
  const resolvedProfile = path.resolve(profile);
  const resolvedTemp = path.resolve(os.tmpdir());
  assert.ok(resolvedProfile.startsWith(resolvedTemp + path.sep), 'Temporary browser profile escaped the system temp directory.');
  fs.rmSync(resolvedProfile, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
}).catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
