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
  const siteRoot = path.dirname(root);
  const file = path.resolve(siteRoot, requested.startsWith('sources/') ? requested : 'ai-200-practice-exam/' + (requested || 'dist/index.html'));
  if (!file.startsWith(siteRoot + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
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
  const runtimeErrors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text);
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
  const home = async () => {
    await evaluate("localStorage.removeItem('ai200-active-session-v1'); true");
    await send('Page.navigate', {url: `http://127.0.0.1:${sitePort}/dist/index.html`});
    await waitFor('!!document.querySelector("#start")', 'Welcome screen missing');
  };
  const launch = async mode => {
    await evaluate(`document.querySelector('[data-mode="${mode}"]').click(); document.querySelector('#start').click(); document.querySelector('#ack').click(); document.querySelector('#launch').click(); true`);
    await waitFor('!!document.querySelector(".top-count")', 'Selected session did not launch');
    return evaluate("JSON.parse(localStorage.getItem('ai200-active-session-v1')).state");
  };
  const navigationState = () => evaluate(`(() => {
    const grid=document.querySelector('.nav-grid'), active=grid.querySelector('.current');
    const bounds=grid.getBoundingClientRect(), rect=active.getBoundingClientRect();
    const top=bounds.top+grid.clientTop, left=bounds.left+grid.clientLeft;
    return {
      scrollTop:grid.scrollTop,
      activeVisible:rect.top>=top+3 && rect.bottom<=top+grid.clientHeight-3,
      columnsFit:[...grid.children].every(button=>{
        const r=button.getBoundingClientRect();
        return r.left>=left+3 && r.right<=left+grid.clientWidth-3 && button.scrollWidth<=button.clientWidth;
      }),
      noHorizontalOverflow:grid.scrollWidth<=grid.clientWidth,
      current:Number(active.dataset.index),
      correct:active.classList.contains('answer-correct'),
      incorrect:active.classList.contains('answer-incorrect'),
      pageY:window.scrollY
    };
  })()`);
  const checkStudyNavigation = async session => {
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    // Reserve a classic scrollbar, as on Windows, even on overlay-scrollbar hosts.
    await evaluate(`(() => {
      const style=document.createElement('style');
      style.textContent='.nav-grid::-webkit-scrollbar{width:17px}';
      document.head.append(style);
      document.querySelector('[data-index="99"]').click();
      return true;
    })()`);
    let nav=await navigationState();
    assert.ok(nav.noHorizontalOverflow && nav.columnsFit,'All five columns fit beside a classic scrollbar, including four-digit numbers');
    assert.ok(nav.activeVisible && nav.scrollTop>0,'Question 100 is visible after jumping to it');
    // Use a nearby single-choice item to exercise both feedback colors and rerenders.
    const index=session.flat.findIndex((q,i)=>i>=99 && q.type==='single');
    assert.ok(index>=99);
    const q=session.flat[index];
    await evaluate(`document.querySelector('[data-index="${index}"]').click(); true`);
    const before=await navigationState();
    for (const [answer,expected] of [[q.answer,'correct'],[(q.answer+1)%q.options.length,'incorrect']]) {
      await evaluate(`document.querySelector('input[name="answer"][value="${answer}"]').click(); true`);
      nav=await navigationState();
      assert.equal(nav.scrollTop,before.scrollTop,'Selecting an answer preserves the navigation scroll position');
      await evaluate("document.querySelector('#check').click(); true");
      nav=await navigationState();
      assert.equal(nav.scrollTop,before.scrollTop,'Checking an answer preserves the navigation scroll position');
      assert.ok(nav.activeVisible && nav[expected],`${expected} question status stays visible`);
    }
    await evaluate("document.querySelector('#flag').click(); true");
    assert.equal((await navigationState()).scrollTop,before.scrollTop,'Flagging an answer preserves the navigation scroll position');
    const desktopNavigation=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
    fs.writeFileSync(path.join(os.tmpdir(),'ai200-study-navigation-desktop.png'),Buffer.from(desktopNavigation.data,'base64'));
    await evaluate("document.querySelector('#next').click(); true");
    nav=await navigationState();
    assert.equal(nav.current,index+1);
    assert.ok(nav.activeVisible && nav.scrollTop>0,'Next keeps the current row visible');
    assert.ok(await evaluate(`document.querySelector('[data-index="${index}"]').classList.contains('answer-incorrect')`));
    await evaluate("document.querySelector('#prev').click(); true");
    nav=await navigationState();
    assert.equal(nav.current,index);
    assert.ok(nav.activeVisible && nav.incorrect,'Previous keeps the graded question visible');
    await send('Page.reload');
    await waitFor('!!document.querySelector("#resumeSession")','Navigation session can be resumed');
    await evaluate("document.querySelector('#resumeSession').click(); true");
    nav=await navigationState();
    assert.equal(nav.current,index);
    assert.ok(nav.activeVisible && nav.incorrect && nav.scrollTop>0,'Resume reveals the current question and its feedback');
    for (const width of [1440,375,320]) {
      await send('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:false});
      await evaluate(`document.querySelector('[data-index="${session.flat.length-1}"]').click(); true`);
      nav=await navigationState();
      assert.ok(nav.activeVisible && nav.columnsFit && nav.noHorizontalOverflow,`${width}px: last question and every column fit: ${JSON.stringify(nav)}`);
      assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),`${width}px: page has no horizontal overflow`);
      if(width===375){
        await evaluate('window.scrollTo(0,0); true');
        const mobileNavigation=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
        fs.writeFileSync(path.join(os.tmpdir(),'ai200-study-navigation-mobile.png'),Buffer.from(mobileNavigation.data,'base64'));
      }
      await evaluate("document.querySelector('[data-index=\"0\"]').click(); true");
      nav=await navigationState();
      assert.ok(nav.activeVisible && nav.scrollTop===0,`${width}px: navigating back to the first question reveals it`);
      if(width<800){
        await evaluate("document.querySelector('.workspace').scrollIntoView(); true");
        const pageY=await evaluate('window.scrollY');
        assert.ok(pageY>0,'Mobile question is below the navigation');
        await evaluate("document.querySelector('#flag').click(); true");
        assert.equal(await evaluate('window.scrollY'),pageY,'Updating navigation does not pull the mobile page away from the question');
      }
    }
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  };
  await home();
  await evaluate("document.querySelector('#selectAllSets').click(); document.querySelector('#setPicker summary').focus(); true");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
  assert.ok(await evaluate("document.querySelector('#setPicker').open"),'Keyboard opens the set picker');
  assert.equal(await evaluate('document.querySelectorAll("[data-set]").length'),31);
  assert.match(await evaluate('document.querySelector("#setSummary").textContent'),/1357/);
  const homeScreenshot = await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,fromSurface:true});
  fs.writeFileSync(path.join(root,'docs/screenshots/exam-home.png'),Buffer.from(homeScreenshot.data,'base64'));
  await evaluate("document.querySelector('#clearSets').click(); true");
  assert.ok(await evaluate('document.querySelector("#start").disabled'),'Empty selection blocks start');
  const small = await evaluate("window.AI200_SETS.sets.find(s=>s.id.startsWith('suralmk:') && s.count<=10)");
  assert.ok(small,'Small set exists');
  await evaluate(`document.querySelector('[data-set="${small.id}"]').click(); true`);
  await send('Page.reload');
  await waitFor('!!document.querySelector("#start")', 'Selection reload failed');
  assert.deepEqual(await evaluate('[...document.querySelectorAll("[data-set]:checked")].map(e=>e.dataset.set)'),[small.id]);
  let session = await launch('study');
  assert.equal(session.flat.length,small.count);
  assert.ok(session.flat.every(q=>q.setId===small.id));
  const first=session.flat[0];
  await evaluate(`document.querySelector('input[name="answer"][value="${first.answer}"]').click(); document.querySelector('#next').click(); true`);
  assert.ok(await evaluate(`JSON.parse(localStorage.getItem('ai200-active-session-v1')).state.checked[${JSON.stringify(first.id)}]`));
  await home();
  session = await launch('exam');
  assert.equal(session.flat.length,small.count);
  assert.ok(session.flat.every(q=>q.setId===small.id));
  assert.equal(session.seconds,small.count*120);
  await home();
  await evaluate("document.querySelector('#selectAllSets').click(); true");
  session=await launch('study');
  await checkStudyNavigation(session);
  await home();
  await evaluate("document.querySelector('#clearSets').click(); document.querySelector('[data-set=\"quizplay-set-3\"]').click(); true");
  session = await launch('case');
  assert.ok(session.flat.every(q=>q.caseData && q.setId==='quizplay-set-3'));
  assert.ok(await evaluate('!!document.querySelector(".case-tabs") || !!document.querySelector("[data-tab]")'));
  await home();
  await evaluate("document.querySelector('#clearSets').click(); document.querySelector('[data-set=\"instructor\"]').click(); true");
  session = await launch('exam');
  assert.equal(session.flat.length,50);
  assert.ok(session.flat.every(q=>q.setId==='instructor'),'Instructor-only exam has no injected core questions');
  await home();
  await evaluate("document.querySelector('#clearSets').click(); document.querySelector('[data-set=\"topic-review-59\"]').click(); true");
  session=await launch('study');
  assert.equal(session.flat.length,59);
  assert.ok(session.flat.every(q=>q.setId==='topic-review-59'));
  // Exercise each native answer control with this set's new, longer scenarios.
  for (const id of ['TOPIC001','TOPIC002','TOPIC003','TOPIC004','TOPIC013','TOPIC040','TOPIC045']) {
    const index=session.flat.findIndex(q=>q.id===id);
    const q=session.flat[index];
    await evaluate(`(() => {
      document.querySelector('[data-index="${index}"]').click();
      const q=${JSON.stringify(q)};
      if (['single','yesno','multi'].includes(q.type)) {
        for (const answer of Array.isArray(q.answer)?q.answer:[q.answer]) document.querySelector('input[name="answer"][value="'+answer+'"]').click();
      } else if (['matrix','matching'].includes(q.type)) {
        q.answer.forEach((answer,i)=>{
          const select=document.querySelector('['+(q.type==='matrix'?'data-matrix-index':'data-match-index')+'="'+i+'"]');
          select.value=answer; select.dispatchEvent(new Event('change',{bubbles:true}));
        });
      } else if (q.type==='drag') {
        q.answer.forEach(answer=>[...document.querySelectorAll('[data-drag-choice]')].find(el=>el.dataset.dragChoice===answer).click());
      } else {
        q.answer.forEach((answer,target)=>{
          let position=[...document.querySelectorAll('[data-drag-index]')].findIndex(row=>row.children[2].textContent===answer);
          while(position>target) {document.querySelector('[data-move="up"][data-pos="'+position+'"]').click();position--;}
        });
      }
      document.querySelector('#check').click();
      return true;
    })()`);
    assert.equal(await evaluate('document.querySelector(".feedback h3")?.textContent'),'Correct',id + ': native scoring');
    for (const url of [q.source,...q.additionalSources]) assert.ok(await evaluate(`[...document.querySelectorAll('.feedback a')].some(a=>a.getAttribute('href')===${JSON.stringify(url)})`),id + ': primary reference');
  }
  const numericIndex=session.flat.findIndex(q=>q.id==='TOPIC025');
  await evaluate(`document.querySelector('[data-index="${numericIndex}"]').click(); document.querySelector('.workspace').scrollIntoView(); true`);
  const topicScreenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
  fs.writeFileSync(path.join(root,'docs/screenshots/topic-review.png'),Buffer.from(topicScreenshot.data,'base64'));
  await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:false});
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'Topic review answer area fits a narrow screen');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await home();
  session=await launch('exam');
  assert.equal(session.flat.length,50);
  assert.ok(session.flat.every(q=>q.setId==='topic-review-59'));
  for (const [domain,n] of Object.entries({containers:12,data:14,services:12,operations:12})) assert.equal(session.flat.filter(q=>q.domain===domain).length,n);
  await home();
  await send('Page.navigate',{url:`http://127.0.0.1:${sitePort}/ai-200-exam-form.html`});
  await waitFor('document.querySelectorAll("[data-set]").length===31','Inline catalog did not load');
  await evaluate("document.querySelector('#selectAllSets').click(); document.querySelector('#setPicker').open=true; true");
  await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:false});
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'Set picker fits a narrow screen');
  await evaluate("document.querySelector('#setPicker').scrollIntoView(); true");
  const mobileScreenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
  fs.writeFileSync(path.join(root,'docs/screenshots/set-picker-mobile.png'),Buffer.from(mobileScreenshot.data,'base64'));
  session = await launch('study');
  assert.equal(session.flat.length,1357,'Entire inline study session persists within browser storage limits');
  await checkStudyNavigation(session);
  await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:false});
  await send('Page.reload');
  await waitFor('!!document.querySelector("#resumeSession")','Full study session can be resumed');
  await evaluate("document.querySelector('#resumeSession').click(); true");
  await waitFor('document.querySelector(".top-count")?.textContent.includes("of 1357")','Full study session resumes');
  const inlineCase=await evaluate("JSON.parse(localStorage.getItem('ai200-active-session-v1')).state.flat.findIndex(q=>q.contextPage)");
  await evaluate(`document.querySelector('[data-index="${inlineCase}"]').click(); document.querySelector('.scenario-launch').click(); document.querySelector('[data-scenario-view="image"]').click(); true`);
  await waitFor('document.querySelector(".scenario-image-pane img")?.naturalWidth===1920','Embedded scenario image loads');
  await send('Page.navigate',{url:`http://127.0.0.1:${sitePort}/sources/index.html`});
  await waitFor('document.querySelectorAll(".guide").length===184','Library did not load');
  await evaluate("document.querySelector('#search').value='4.5'; document.querySelector('#search').dispatchEvent(new Event('input')); true");
  const visible = await evaluate('[...document.querySelectorAll(".guide:not([hidden])")].map(e=>e.textContent)');
  assert.ok(visible.some(text=>text.includes('Analyze logs')),'Lab search finds KQL lab');
  await evaluate("[...document.querySelectorAll('.guide')].find(e=>e.textContent.includes('Analyze logs')).open=true; true");
  await waitFor('!!document.querySelector(".guide[data-loaded] pre")','Lab code did not render');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'Library fits a narrow screen');
  assert.deepEqual(runtimeErrors,[],'Browser has no uncaught errors');
  console.log('PASS: browser walkthrough, answer review, resume, teacher scenarios, 31-set picker, keyboard access, persisted selection, small study/exam sessions, study navigation around question 100 and 1357 with classic scrollbars and narrow screens in both distributions, all seven topic-review controls and its 50-question exam, QuizPlay cases, instructor-only exam, inline app and searchable mobile library.');
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
