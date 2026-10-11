(()=>{
  const {DOMAINS}=window.AI200_DATA;
  const INSTRUCTOR_SAMPLE=(window.AI200_INSTRUCTOR_SAMPLE||{questions:[]}).questions;
  DOMAINS.sample="Instructor sample";
  const app=document.getElementById("app");
  const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ACTIVE_SESSION_KEY="ai200-active-session-v1",SESSION_VERSION=1;
  const catalog=window.AI200_SETS, SET_SELECTION_KEY="ai200-selected-sets-v1";
  function readSetSelection(){try{const value=JSON.parse(localStorage.getItem(SET_SELECTION_KEY)||"null");return catalog.normalize(value)}catch{return [...catalog.defaults]}}
  let state=null,timerId=null,selectedMode="exam",selectedSetIds=readSetSelection();
  const libraryUrl=window.AI200_LIBRARY_URL||"../../sources/index.html";
  const assetUrl=src=>window.AI200_ASSETS?.[src]||src;
  function saveSetSelection(){try{localStorage.setItem(SET_SELECTION_KEY,JSON.stringify(selectedSetIds))}catch{}}
  function selectedInfo(){return catalog.selectionInfo(selectedMode,selectedSetIds)}
  function setSummary(){const info=selectedInfo();return `${selectedSetIds.length} sets · ${info.available} questions available`}
  function updateSelection(){
    const info=selectedInfo();
    document.getElementById("setSummary").textContent=setSummary();
    const note=document.getElementById("selectionStatus");
    note.textContent=info.error||(selectedMode==="case"?`${info.caseCount} case studies available. One is selected for this drill.`:`${info.count} questions in this session${["exam","quick"].includes(selectedMode)?` · ${info.count*2} minutes`:""}. ${info.note}`);
    document.getElementById("start").disabled=!!info.error;
    document.querySelectorAll("[data-set]").forEach(input=>{input.checked=selectedSetIds.includes(input.dataset.set)});
    document.querySelectorAll(".mode-card").forEach(b=>b.classList.toggle("selected",b.dataset.mode===selectedMode));
    saveSetSelection();
  }

  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  function inlineText(text){return esc(text).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")}
  function promptMarkup(value){
    const lines=String(value??"").split(/\r?\n/),parts=[];let list=[],code=null;
    const flush=()=>{if(list.length){parts.push(`<ul>${list.map(x=>`<li>${inlineText(x)}</li>`).join("")}</ul>`);list=[]}};
    for(const raw of lines){const line=raw.trim();
      if(line.startsWith("```")){flush();if(code!==null){parts.push(`<pre class="native-code"><code>${esc(code.join("\n"))}</code></pre>`);code=null}else code=[];continue}
      if(code!==null){code.push(raw);continue}
      if(!line){flush();continue}
      if(/^[-*] /.test(line)){list.push(line.slice(2));continue}
      flush();
      if(/^(?:Series note|Note):/i.test(line))parts.push(`<p class="prompt-note"><em>${inlineText(line)}</em></p>`);
      else if(/^(Requirements|Proposed solution|Tasks|Configuration):$/.test(line))parts.push(`<p class="prompt-heading"><strong>${inlineText(line)}</strong></p>`);
      else parts.push(`<p>${inlineText(line)}</p>`);
    }
    flush();if(code!==null)parts.push(`<pre class="native-code"><code>${esc(code.join("\n"))}</code></pre>`);
    return `<div class="prompt">${parts.join("")}</div>`;
  }
  const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((v,i)=>v===b[i]):a===b;
  const fmt=t=>`${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`;
  function clearSavedSession(){localStorage.removeItem(ACTIVE_SESSION_KEY)}
  function loadSavedSession(){
    try{
      const saved=JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY)||"null"),s=saved?.state;
      if(saved?.version!==SESSION_VERSION||!s||!Array.isArray(s.sections)||!Array.isArray(s.flat)||!s.flat.length||!Number.isInteger(s.current)||s.current<0||s.current>=s.flat.length)throw new Error("Invalid saved session");
      return saved;
    }catch(error){clearSavedSession();return null}
  }
  function saveSession(){
    if(!state||state.mode==="audio"||!Array.isArray(state.flat)||!state.flat.length)return;
    try{localStorage.setItem(ACTIVE_SESSION_KEY,JSON.stringify({version:SESSION_VERSION,savedAt:Date.now(),selectedMode:state.mode,selectedSetIds:[...selectedSetIds],state}))}catch(error){console.warn("Unable to save the active session",error)}
  }
  function startTimer(){
    clearInterval(timerId);if(!state?.seconds)return;
    timerId=setInterval(()=>{if(!state)return;state.seconds=Math.max(0,state.seconds-1);const el=document.getElementById("timer");if(el)el.textContent=fmt(state.seconds);saveSession();if(state.seconds<=0){clearInterval(timerId);finish(true)}},1000);
  }
  function resumeSession(saved){
    selectedMode=saved.selectedMode||saved.state.mode||"study";selectedSetIds=catalog.normalize(saved.selectedSetIds||saved.state.selectedSetIds||selectedSetIds);saveSetSelection();state=saved.state;
    state.answers=state.answers||{};state.flags=state.flags||{};state.comments=state.comments||{};state.checked=state.checked||{};state.lockedBefore=Number.isInteger(state.lockedBefore)?state.lockedBefore:-1;
    startTimer();renderQuestion();
  }
  function welcome(){
    clearInterval(timerId);const savedSession=loadSavedSession();state=null;
    const history=JSON.parse(localStorage.getItem("ai200-history")||"[]");
    const savedState=savedSession?.state,savedAnswered=savedState?savedState.flat.filter(q=>{const value=savedState.answers?.[q.id];return Array.isArray(value)?value.length>0:value!==undefined&&value!==null&&value!==""}).length:0;
    app.innerHTML=`<main class="welcome"><section class="welcome-card">
      <header class="welcome-head"><div class="eyebrow">Microsoft-style practice environment</div><h1>AI-200 Exam Simulator</h1><p>Practice the decisions, timing, navigation, and question patterns used in role-based Microsoft certification exams.</p></header>
      <div class="welcome-body">
        ${savedSession?`<div class="notice"><h2>Continue your previous session?</h2><p><strong>${esc(savedState.mode)}</strong> · question ${savedState.current+1} of ${savedState.flat.length} · ${savedAnswered} answered${savedState.seconds?` · ${fmt(savedState.seconds)} remaining`:""}</p><p class="muted">Saved ${esc(new Date(savedSession.savedAt).toLocaleString())}</p><div class="actions"><button class="secondary" id="discardSession">Start a new session</button><button class="primary" id="resumeSession">Continue previous session</button></div></div>`:""}
        <h2>Choose a session</h2>
        <div class="notice"><strong>Exam-like, not an official Microsoft exam.</strong> A complete simulation has 50 questions in 100 minutes. Smaller selections produce shorter sessions. Available questions determine domain coverage and case studies.</div>
        <div class="mode-grid">
          <button class="mode-card selected" data-mode="exam"><strong>Official exam flow</strong><span>Up to 50 questions · 2 minutes each · selected sets · no lab</span></button>
          <button class="mode-card" data-mode="quick"><strong>Quick assessment</strong><span>Up to 20 questions · 2 minutes each · selected sets</span></button>
          <button class="mode-card" data-mode="case"><strong>Case study drill</strong><span>One case from your selected sets · scenario context · no timer</span></button>
          <button class="mode-card" data-mode="study"><strong>Study mode</strong><span>Selected sets · no timer · immediate explanations</span></button>
          <button class="mode-card" data-mode="sample"><strong>Instructor sample set</strong><span>All ${INSTRUCTOR_SAMPLE.length} supplied questions · case studies kept together · native controls</span></button>
          <button class="mode-card" data-mode="audio"><strong>Listen &amp; learn</strong><span>Every question read aloud · prompt + correct answer · randomized loop · hands-free, screen stays awake</span></button>
        </div>
        <details class="set-picker" id="setPicker"><summary>Question sets <span id="setSummary">${esc(setSummary())}</span></summary>
          <div class="set-picker-body"><p>Select the sets to use in Study mode, timed assessments, case drills, or audio practice. Your selection is saved on this device.</p>
          <div class="set-actions"><button class="secondary" id="selectAllSets">Select all</button><button class="secondary" id="clearSets">Clear selection</button><button class="secondary" id="coreSets">Original + Microsoft Learn</button></div>
          <div class="set-groups">${[...new Set(catalog.sets.map(s=>s.group))].map(group=>`<fieldset><legend>${esc(group)}</legend>${catalog.sets.filter(s=>s.group===group).map(set=>`<label class="set-option"><input type="checkbox" data-set="${esc(set.id)}" ${selectedSetIds.includes(set.id)?"checked":""}><span>${esc(set.name)} <small>${set.count} questions</small></span></label>`).join("")}</fieldset>`).join("")}</div></div>
        </details>
        <p id="selectionStatus" class="selection-status" role="status" aria-live="polite"></p>
        <p><a href="${esc(libraryUrl)}" target="_blank" rel="noopener">Open the study library and labs</a></p>
        <h3>What the simulator reproduces</h3>
        <ul><li>Question counter, timer, review flags, comments, section review, and exam summary</li><li>Single choice, multiple response, matching, drag-and-drop, build lists, case studies, and non-reviewable problem/solution items</li><li>Question selection aligned to exam domain ranges and a weak-area report</li><li>Optional Microsoft Learn reference panel while the clock continues</li></ul>
        ${history.length?`<p><strong>Last attempt:</strong> ${history[0].score}/1000 · ${history[0].passed?"Pass":"Not passed"} · ${esc(history[0].date)}</p>`:""}
        <div class="actions"><button id="start" class="primary">Begin session</button></div>
      </div></section></main>`;
    document.querySelectorAll(".mode-card").forEach(b=>b.onclick=()=>{selectedMode=b.dataset.mode;if(selectedMode==="sample")selectedSetIds=["instructor"];updateSelection()});
    const changeSets=ids=>{selectedSetIds=catalog.normalize(ids);if(selectedMode==="sample")selectedMode="study";updateSelection()};
    document.querySelectorAll("[data-set]").forEach(input=>input.onchange=()=>changeSets([...document.querySelectorAll("[data-set]:checked")].map(x=>x.dataset.set)));
    document.getElementById("selectAllSets").onclick=()=>changeSets(catalog.defaults);
    document.getElementById("clearSets").onclick=()=>changeSets([]);
    document.getElementById("coreSets").onclick=()=>changeSets(["curated","microsoft-learn"]);
    document.getElementById("start").onclick=()=>{if(selectedInfo().error){document.getElementById("setPicker").open=true;return}selectedMode==="audio"?startAudio():showInstructions()};
    updateSelection();
    const resume=document.getElementById("resumeSession");if(resume)resume.onclick=()=>resumeSession(savedSession);
    const discard=document.getElementById("discardSession");if(discard)discard.onclick=()=>{clearSavedSession();welcome()};
  }

  function showInstructions(){
    const isExam=selectedMode==="exam",info=selectedInfo();
    app.innerHTML=`<main class="welcome"><section class="welcome-card"><header class="welcome-head"><div class="eyebrow">Instructions</div><h1>${isExam?"Exam overview":"Practice overview"}</h1></header><div class="welcome-body">
      <p>This session is delivered in English. Read every instruction carefully before answering.</p><p><strong>Selected sets:</strong> ${selectedSetIds.map(id=>esc(catalog.name(id))).join(", ")}</p>
      ${info.note?`<p>${esc(info.note)}</p>`:""}
      <ul>
        <li>${isExam||selectedMode==="quick"?`You have ${info.count*2} minutes for ${info.count} questions from your selected sets.`:selectedMode==="case"?"This drill contains one selected case study and has no time limit.":`This session contains ${info.count} questions. There is no time limit and explanations are available as you work.`}</li>
        <li>Most questions can be reviewed until you leave their section.</li>
        <li>Case study details remain available in tabs while you answer that case.</li>
        <li>In a problem/solution set, selecting <strong>Next</strong> locks the answer. You cannot return.</li>
        ${selectedMode==="exam"||selectedMode==="quick"?"<li>A break keeps the clock running and locks all questions already viewed.</li>":""}
        <li>There is no penalty for guessing. Answer every question.</li>
      </ul>
      <div class="warning">The real exam can vary in question count, order, case studies, and labs. Microsoft reveals the exact structure on the introduction screen when the exam starts.</div>
      <label class="flag"><input id="ack" type="checkbox"> I have read the instructions.</label>
      <div class="actions"><button class="secondary" id="backWelcome">Back</button><button class="primary" id="launch" disabled>Start exam</button></div>
    </div></section></main>`;
    document.getElementById("backWelcome").onclick=welcome;
    document.getElementById("ack").onchange=e=>document.getElementById("launch").disabled=!e.target.checked;
    document.getElementById("launch").onclick=startSession;
  }

  function startSession(){
    const session=catalog.build(selectedMode,selectedSetIds,shuffle);
    clearSavedSession();
    let {sections,seconds}=session;
    sections=sections.map(section=>({...section,questions:section.questions.map(question=>window.AI200_DATA.prepareQuestion(question,shuffle))}));
    const flat=sections.flatMap((s,si)=>s.questions.map((x,qi)=>({...x,sectionIndex:si,indexInSection:qi,sectionTitle:s.title})));
    state={mode:selectedMode,selectedSetIds:session.selectedSetIds,selectionNote:session.selectionNote,sections,flat,current:0,answers:{},flags:{},comments:{},lockedBefore:-1,seconds,started:Date.now(),checked:{}};
    startTimer();
    renderQuestion();
  }

  function current(){return state.flat[state.current]}
  function sectionFor(q){return state.sections[q.sectionIndex]}
  function isAnswered(q){const a=state.answers[q.id];if(q.type==="matching"||q.type==="matrix")return Array.isArray(a)&&a.length===q.rows.length&&a.every(Boolean);if(q.type==="drag")return Array.isArray(a)&&a.length===q.answer.length;return Array.isArray(a)?a.length>0:a!==undefined&&a!==null&&a!==""}
  function isGradable(q){return !["sample","manual","manualText"].includes(q.type)}
  function isCorrect(q){if(!isGradable(q))return false;const a=state.answers[q.id];if(q.type==="multi"){return same([...(a||[])].sort(),[...q.answer].sort())}return same(a,q.answer)}

  function renderQuestion(){
    const qn=current(),section=sectionFor(qn),answered=Object.values(state.answers).filter((_,i)=>i>=0).length;
    app.innerHTML=`<div class="shell"><header class="topbar"><div class="brand">AI-200</div><div class="exam-name">Developing AI Cloud Solutions on Azure</div><div class="top-spacer"></div>${state.seconds?`<div id="timer" class="timer">${fmt(state.seconds)}</div>`:"<div class='timer'>Study mode</div>"}<div class="top-count">Question ${state.current+1} of ${state.flat.length}</div></header>
      <div class="exam-layout"><aside class="sidebar"><div class="section-label">${esc(section.title)}</div>${qn.scenarioText?`<div class="active-case"><span>Current case study</span><strong>${esc(qn.scenarioText.title)}</strong></div>`:""}<div>${answered} answered</div><div class="progress-line"><div class="progress-fill" style="width:${Math.round((state.current+1)/state.flat.length*100)}%"></div></div><div class="nav-grid">${state.flat.map((x,i)=>navDot(x,i)).join("")}</div>
      <div class="side-tools"><button id="learn">▤ Microsoft Learn</button>${state.mode==="exam"||state.mode==="quick"?'<button id="break">Ⅱ Take a break</button>':""}<button id="overview">☰ Exam overview</button></div></aside>
      <main class="workspace">${questionMarkup(qn,section)}</main></div>
      <footer class="bottombar"><label class="flag"><input id="flag" type="checkbox" ${state.flags[qn.id]?"checked":""} ${qn.locked?"disabled":""}> Mark for review</label><button class="quiet" id="comment">Comment</button><div class="bottom-spacer"></div><button class="secondary" id="prev" ${!canGo(state.current-1)?"disabled":""}>Previous</button>${state.mode==="study"||state.mode==="sample"?'<button class="secondary" id="check">Check answer</button>':""}<button class="primary" id="next">${state.current===state.flat.length-1?"Finish":"Next"}</button></footer></div>`;
    bindQuestion(qn);saveSession();
  }

  function navDot(qn,i){
    const futureLocked=qn.locked&&i>state.current;const pastLocked=i<=state.lockedBefore;
    const result=(state.mode==="study"||state.mode==="sample")&&state.checked[qn.id]&&isGradable(qn)?(isCorrect(qn)?"answer-correct":"answer-incorrect"):"";
    const resultLabel=result==="answer-correct"?", correct":result==="answer-incorrect"?", incorrect":"";
    const cls=["qdot",i===state.current?"current":"",isAnswered(qn)?"answered":"",result,state.flags[qn.id]?"flagged":"",futureLocked||pastLocked?"locked":""].join(" ");
    return `<button class="${cls}" data-index="${i}" ${!canGo(i)?"disabled":""} aria-label="Question ${i+1}${resultLabel}">${i+1}</button>`;
  }
  function canGo(i){if(i<0||i>=state.flat.length)return false;if(i<=state.lockedBefore)return false;const target=state.flat[i],now=current();if(target.locked&&i!==state.current)return false;return target.sectionIndex===now.sectionIndex}

  function questionMarkup(qn,section){
    const meta=`<div class="question-meta"><span>${esc(DOMAINS[qn.domain]||"Instructor sample")}</span><span>${esc(catalog.name(qn.setId))}</span><span class="pill">${labelType(qn)}</span></div>`;
    const context=qn.contextPage?`${qn.scenarioText?`<div class="case-identity"><span>Current case study</span><strong>${esc(qn.scenarioText.title)}</strong></div>`:""}<button type="button" class="scenario-launch" data-scenario-src="${esc(qn.contextPage)}"><span class="scenario-launch-icon" aria-hidden="true">▤</span><span><strong>${qn.scenarioText?`Open ${esc(qn.scenarioText.title)}`:"Open supplied scenario"}</strong><small>${qn.scenarioText?"Readable text and original image":"Original image"}</small></span><span class="scenario-launch-arrow" aria-hidden="true">↗</span></button>`:"";
    const visual=qn.type==="sample"?`<div class="sample-pages">${qn.questionPages.map((src,i)=>`<img src="${esc(src)}" alt="Original visual for instructor sample question ${qn.number}, page ${i+1}">`).join("")}</div>`:promptMarkup(qn.prompt);
    const code=qn.code?`<pre class="native-code"><code>${esc(qn.code)}</code></pre>`:"";
    const body=`<div class="question-title">Question ${state.current+1}</div>${(section.scenario||qn.scenario)?`<div class="notice"><strong>Scenario</strong><br>${esc(section.scenario||qn.scenario)}</div>`:""}${context}${visual}${code}<div class="instruction">${instruction(qn)}</div>${optionMarkup(qn)}${(state.mode==="study"||state.mode==="sample")&&state.checked[qn.id]?feedbackMarkup(qn):""}`;
    const caseData=section.caseData||qn.caseData;
    if(!caseData)return meta+body;
    const tabs=Object.keys(caseData);const active=(qn.caseData?qn.activeCaseTab:section.activeTab)||tabs[0];
    const identity=qn.caseTitle?`<div class="case-identity"><span>Current case study</span><strong>${esc(qn.caseTitle)}</strong></div>`:"";
    return `${meta}${identity}<div class="case-layout"><section class="case-panel"><div class="tabs">${tabs.map(t=>`<button class="tab ${t===active?"active":""}" data-tab="${esc(t)}">${esc(t)}</button>`).join("")}</div><div class="case-content"><h3>${esc(active)}</h3>${promptMarkup(caseData[active])}</div></section><section>${body}</section></div>`;
  }
  function labelType(qn){if(qn.type==="multi")return `Choose ${qn.choose||qn.answer.length}`;if(qn.type==="order"||qn.type==="drag")return "Drag and drop";if(qn.type==="matching"||qn.type==="matrix")return "Answer area";if(qn.type==="sample")return "Visual answer area";if(qn.type==="manualText")return "Manual response";if(qn.type==="manual")return qn.choose?`Choose ${qn.choose}`:"Single choice";return qn.type==="yesno"?"Yes / No":"Single choice"}
  function instruction(qn){if(qn.type==="multi"||(qn.type==="manual"&&qn.choose))return `Select ${qn.choose||qn.answer.length} answers.`;if(qn.type==="order")return "Drag the choices into the required order. You can also use the arrow buttons.";if(qn.type==="drag")return `Drag ${qn.answer.length} choices into the answer area in the correct order.`;if(qn.type==="matching"||qn.type==="matrix")return "Select the best answer for every row.";if(qn.type==="sample"||qn.type==="manualText")return "Enter your answer, then compare it with the supplied answer screen during review.";if(qn.type==="manual")return "Select the best answer, then compare it with the supplied answer screen.";if(qn.locked)return "You cannot return after selecting Next.";return "Select the best answer."}
  function optionMarkup(qn){
    if(qn.type==="order"){
      const arr=state.answers[qn.id]||shuffle(qn.options);if(!state.answers[qn.id])state.answers[qn.id]=arr;
      return `<div class="order-list">${arr.map((x,i)=>`<div class="order-row" draggable="true" data-drag-index="${i}"><div class="order-rank">${i+1}</div><div class="drag-handle" title="Drag to reorder">⋮⋮</div><div>${esc(x)}</div><div class="order-controls"><button data-move="up" data-pos="${i}" ${i===0?"disabled":""}>↑</button><button data-move="down" data-pos="${i}" ${i===arr.length-1?"disabled":""}>↓</button></div></div>`).join("")}</div>`;
    }
    if(qn.type==="drag"){
      const selected=state.answers[qn.id]||[],available=qn.options.filter(x=>!selected.includes(x));
      const slots=Array.from({length:qn.answer.length},(_,i)=>selected[i]||"");
      return `<div class="drag-task"><div><h3>Choices</h3><div class="choice-pool">${available.map(x=>`<button class="drag-choice" draggable="true" data-drag-choice="${esc(x)}">${esc(x)}</button>`).join("")||"<span class='muted'>All required choices are placed.</span>"}</div></div><div><h3>Answer area</h3><div class="drop-slots">${slots.map((x,i)=>`<div class="drop-slot ${x?"filled":""}" data-drop-slot="${i}"><span class="order-rank">${i+1}</span>${x?`<button class="placed-choice" draggable="true" data-placed-index="${i}">${esc(x)}<span aria-hidden="true"> ×</span></button>`:`<span>Drop a choice here</span>`}</div>`).join("")}</div></div></div>`;
    }
    if(qn.type==="matching"){
      const chosen=state.answers[qn.id]||Array(qn.rows.length).fill("");
      return `<div class="matching-list">${qn.rows.map((row,i)=>`<label class="matching-row"><span>${esc(row)}</span><select data-match-index="${i}"><option value="">Select an answer</option>${qn.options.map(o=>`<option value="${esc(o)}" ${chosen[i]===o?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`).join("")}</div>`;
    }
    if(qn.type==="matrix"){
      const chosen=state.answers[qn.id]||Array(qn.rows.length).fill("");
      return `<div class="matching-list matrix-list">${qn.rows.map((row,i)=>`<label class="matching-row"><span>${esc(row[0])}</span><select data-matrix-index="${i}"><option value="">Select an answer</option>${row[1].map(o=>`<option value="${esc(o)}" ${chosen[i]===o?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`).join("")}</div>`;
    }
    if(qn.type==="sample"||qn.type==="manualText")return `<label class="sample-response"><span>Your answer</span><textarea id="sampleResponse" rows="3" placeholder="For example: A, AC, or the values selected in the answer area">${esc(state.answers[qn.id]||"")}</textarea></label>`;
    const chosen=state.answers[qn.id],multi=qn.type==="multi"||(qn.type==="manual"&&qn.choose);return `<div class="options">${qn.options.map((o,i)=>{const sel=multi?(chosen||[]).includes(i):chosen===i;return `<label class="option ${sel?"selected":""}"><input type="${multi?"checkbox":"radio"}" name="answer" value="${i}" ${sel?"checked":""}><span class="letter">${letters[i]}.</span><span>${inlineText(o)}</span></label>`}).join("")}</div>`;
  }

  function scenarioMarkup(scenario){
    if(!scenario)return '<p class="muted">A text transcription is not available for this scenario. Use the original image.</p>';
    return `<article class="scenario-readable"><h2>${esc(scenario.title)}</h2>${scenario.sections.map(section=>`<section><h3>${esc(section.heading)}</h3>${(section.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join("")}${(section.groups||[]).map(group=>`<div class="scenario-group"><h4>${esc(group.heading)}</h4><ul>${group.items.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></div>`).join("")}${section.items?`<ul>${section.items.map(item=>`<li>${esc(item)}</li>`).join("")}</ul>`:""}</section>`).join("")}</article>`;
  }

  function openScenario(qn){
    const dialog=document.createElement("dialog");dialog.className="scenario-dialog";
    dialog.innerHTML=`<div class="scenario-window"><header class="scenario-header"><div><span class="eyebrow">Case study reference</span><h2>Supplied scenario</h2></div><button type="button" class="scenario-close" aria-label="Close supplied scenario">×</button></header><nav class="scenario-tabs" aria-label="Scenario view"><button type="button" class="scenario-tab active" data-scenario-view="text" ${qn.scenarioText?"":"disabled"}>Readable text</button><button type="button" class="scenario-tab" data-scenario-view="image">Original image</button></nav><div class="scenario-body"><div class="scenario-pane active" data-scenario-pane="text">${scenarioMarkup(qn.scenarioText)}</div><div class="scenario-pane scenario-image-pane" data-scenario-pane="image"><img src="${esc(assetUrl(qn.contextPage))}" alt="Original supplied scenario for question ${qn.number||state.current+1}"></div></div></div>`;
    document.body.appendChild(dialog);
    const close=()=>dialog.close();dialog.querySelector(".scenario-close").onclick=close;
    dialog.querySelectorAll("[data-scenario-view]").forEach(button=>button.onclick=()=>{dialog.querySelectorAll("[data-scenario-view]").forEach(x=>x.classList.toggle("active",x===button));dialog.querySelectorAll("[data-scenario-pane]").forEach(pane=>pane.classList.toggle("active",pane.dataset.scenarioPane===button.dataset.scenarioView))});
    dialog.onclick=e=>{if(e.target===dialog)close()};dialog.onclose=()=>dialog.remove();dialog.showModal();dialog.querySelector(".scenario-close").focus();
  }

  function bindQuestion(qn){
    document.querySelectorAll("[data-scenario-src]").forEach(button=>button.onclick=()=>openScenario(qn));
    document.querySelectorAll("input[name=answer]").forEach(el=>el.onchange=e=>{
      const v=+e.target.value;if(qn.type==="multi"||(qn.type==="manual"&&qn.choose)){let a=[...(state.answers[qn.id]||[])];a=e.target.checked?[...a,v]:a.filter(x=>x!==v);state.answers[qn.id]=a}else state.answers[qn.id]=v;renderQuestion();
    });
    document.querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>{const a=[...state.answers[qn.id]],i=+b.dataset.pos,j=b.dataset.move==="up"?i-1:i+1;[a[i],a[j]]=[a[j],a[i]];state.answers[qn.id]=a;renderQuestion()});
    let dragged=null;document.querySelectorAll("[data-drag-index]").forEach(row=>{row.ondragstart=()=>{dragged=+row.dataset.dragIndex;row.classList.add("dragging")};row.ondragend=()=>row.classList.remove("dragging");row.ondragover=e=>e.preventDefault();row.ondrop=e=>{e.preventDefault();const target=+row.dataset.dragIndex;if(dragged===null||dragged===target)return;const a=[...state.answers[qn.id]];const [item]=a.splice(dragged,1);a.splice(target,0,item);state.answers[qn.id]=a;renderQuestion()}});
    let dragChoice="";document.querySelectorAll("[data-drag-choice]").forEach(choice=>{choice.ondragstart=()=>dragChoice=choice.dataset.dragChoice;choice.onclick=()=>{const a=[...(state.answers[qn.id]||[])];if(a.length<qn.answer.length){a.push(choice.dataset.dragChoice);state.answers[qn.id]=a;renderQuestion()}}});
    document.querySelectorAll("[data-drop-slot]").forEach(slot=>{slot.ondragover=e=>{e.preventDefault();slot.classList.add("drag-over")};slot.ondragleave=()=>slot.classList.remove("drag-over");slot.ondrop=e=>{e.preventDefault();const i=+slot.dataset.dropSlot,a=[...(state.answers[qn.id]||[])];if(dragChoice){const old=a.indexOf(dragChoice);if(old>=0)a.splice(old,1);a.splice(i,0,dragChoice);state.answers[qn.id]=a.slice(0,qn.answer.length);renderQuestion()}}});
    document.querySelectorAll("[data-placed-index]").forEach(choice=>{choice.ondragstart=()=>dragChoice=(state.answers[qn.id]||[])[+choice.dataset.placedIndex];choice.onclick=()=>{const a=[...(state.answers[qn.id]||[])];a.splice(+choice.dataset.placedIndex,1);state.answers[qn.id]=a;renderQuestion()}});
    document.querySelectorAll("[data-match-index]").forEach(select=>select.onchange=e=>{const a=[...(state.answers[qn.id]||Array(qn.rows.length).fill(""))];a[+select.dataset.matchIndex]=e.target.value;state.answers[qn.id]=a;renderQuestion()});
    document.querySelectorAll("[data-matrix-index]").forEach(select=>select.onchange=e=>{const a=[...(state.answers[qn.id]||Array(qn.rows.length).fill(""))];a[+select.dataset.matrixIndex]=e.target.value;state.answers[qn.id]=a;renderQuestion()});
    const sampleResponse=document.getElementById("sampleResponse");if(sampleResponse)sampleResponse.oninput=e=>{state.answers[qn.id]=e.target.value;saveSession()};
    document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{if(qn.caseData)qn.activeCaseTab=b.dataset.tab;else sectionFor(qn).activeTab=b.dataset.tab;renderQuestion()});
    document.querySelectorAll("[data-index]").forEach(b=>b.onclick=()=>{state.current=+b.dataset.index;renderQuestion()});
    document.getElementById("flag").onchange=e=>{state.flags[qn.id]=e.target.checked;renderQuestion()};
    document.getElementById("prev").onclick=()=>{if(canGo(state.current-1)){state.current--;renderQuestion()}};
    document.getElementById("next").onclick=next;
    document.getElementById("comment").onclick=()=>commentModal(qn);
    document.getElementById("learn").onclick=learnDrawer;
    document.getElementById("overview").onclick=()=>reviewModal(false);
    const br=document.getElementById("break");if(br)br.onclick=breakModal;
    const chk=document.getElementById("check");if(chk)chk.onclick=()=>{if(!isAnswered(qn))return alert("Select an answer first.");state.checked[qn.id]=true;renderQuestion()};
  }

  function next(){
    const qn=current();if(qn.locked&&!isAnswered(qn))return alert("You must answer this question before continuing.");
    if((state.mode==="study"||state.mode==="sample")&&isAnswered(qn))state.checked[qn.id]=true;
    if(qn.locked)state.lockedBefore=state.current;
    if(state.current===state.flat.length-1)return reviewModal(true);
    const nextQ=state.flat[state.current+1];
    if(nextQ.sectionIndex!==qn.sectionIndex)return reviewModal(true);
    state.current++;renderQuestion();
  }

  function reviewModal(sectionEnd){
    const qn=current(),si=qn.sectionIndex,items=sectionEnd?state.flat.filter(x=>x.sectionIndex===si):state.flat;
    const unanswered=items.filter(x=>!isAnswered(x)).length,flagged=items.filter(x=>state.flags[x.id]).length;
    app.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><section class="modal"><h2>${sectionEnd?"Review this section":"Exam overview"}</h2><p>${unanswered} unanswered · ${flagged} marked for review</p><div class="review-list">${items.map(x=>{const i=state.flat.indexOf(x);return `<div class="review-row"><strong>Q${i+1}</strong><span>${esc(x.prompt.slice(0,76))}${x.prompt.length>76?"…":""}</span><span class="${!isAnswered(x)?"status-unanswered":state.flags[x.id]?"status-flagged":""}">${!isAnswered(x)?"Unanswered":state.flags[x.id]?"Review":"Answered"}</span></div>`}).join("")}</div><div class="actions"><button class="secondary" id="closeModal">Return</button>${sectionEnd?`<button class="primary" id="leaveSection">${state.current===state.flat.length-1?"Submit exam":"Finish section"}</button>`:""}</div></section></div>`);
    document.getElementById("closeModal").onclick=()=>document.getElementById("modal").remove();
    const leave=document.getElementById("leaveSection");if(leave)leave.onclick=()=>{
      if(state.current===state.flat.length-1)return finish(false);
      const end=Math.max(...state.flat.map((x,i)=>x.sectionIndex===si?i:-1));state.lockedBefore=Math.max(state.lockedBefore,end);state.current=end+1;renderQuestion();
    };
  }

  function commentModal(qn){
    app.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><section class="modal"><h2>Comment on question</h2><p>Your comment is stored only in this browser.</p><textarea id="commentText" rows="6" style="width:100%;padding:10px">${esc(state.comments[qn.id]||"")}</textarea><div class="actions"><button class="secondary" id="cancel">Cancel</button><button class="primary" id="saveComment">Save comment</button></div></section></div>`);
    document.getElementById("cancel").onclick=()=>document.getElementById("modal").remove();document.getElementById("saveComment").onclick=()=>{state.comments[qn.id]=document.getElementById("commentText").value;saveSession();document.getElementById("modal").remove()};
  }
  function breakModal(){
    app.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><section class="modal"><h2>Take a break</h2><p>The exam clock continues. You will not be able to return to any question you have already viewed, including unanswered or flagged questions.</p><div class="actions"><button class="secondary" id="cancel">Return to exam</button><button class="primary" id="startBreak">Start break</button></div></section></div>`);
    document.getElementById("cancel").onclick=()=>document.getElementById("modal").remove();document.getElementById("startBreak").onclick=()=>{state.lockedBefore=Math.max(state.lockedBefore,state.current);saveSession();document.getElementById("modal").innerHTML=`<section class="modal"><h2>Break in progress</h2><p>The clock is still running.</p><div class="timer">${fmt(state.seconds)}</div><div class="actions"><button class="primary" id="resume">Resume exam</button></div></section>`;document.getElementById("resume").onclick=()=>{if(state.current<state.flat.length-1)state.current++;renderQuestion()}};
  }
  function learnDrawer(){
    const source=current().source;const sourceLink=/^https?:\/\//.test(source||"")?`<a target="_blank" rel="noopener" href="${esc(source)}">${esc(source)}</a>`:`<p>${esc(source||"No technical reference supplied.")}</p>`;
    document.body.insertAdjacentHTML("beforeend",`<aside class="learn-drawer" id="drawer"><div class="actions"><button class="secondary" id="closeDrawer">Close</button></div><h2>Microsoft Learn references</h2><p>The real associate-level exam can provide Microsoft Learn in a split view. The timer continues while you browse.</p><a target="_blank" rel="noopener" href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200">https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200</a>${sourceLink}<p><strong>Exam strategy:</strong> use documentation for one precise lookup. Searching every answer usually costs too much time.</p></aside>`);document.getElementById("closeDrawer").onclick=()=>document.getElementById("drawer").remove();
  }

function referenceMarkup(x){const link=(label,url)=>/^https?:\/\//.test(url||"")?`<p><strong>${label}:</strong> <a target="_blank" rel="noopener" href="${esc(url)}">${esc(url)}</a></p>`:`<p><strong>${label}:</strong> ${esc(url||"Not supplied")}</p>`;return (x.assessmentSource?link(x.adapted?"Microsoft Learn module (adapted)":"Microsoft Learn module",x.assessmentSource):"")+(x.practiceSource?link("Practice source",x.practiceSource):"")+link("Technical reference",x.source)+(x.reviewNote?`<p><strong>Review note:</strong> ${esc(x.reviewNote)}</p>`:"")}
  function feedbackMarkup(qn){
    if(["sample","manual","manualText"].includes(qn.type))return `<div class="feedback manual"><h3>Compare with the supplied answer</h3><p><strong>Your answer:</strong> ${esc(answerText(qn,state.answers[qn.id]))}</p><div class="sample-pages answer-pages">${(qn.answerPages||[]).map((src,i)=>`<img src="${esc(src)}" alt="Answer for instructor sample question ${qn.number}, page ${i+1}">`).join("")}</div>${referenceMarkup(qn)}</div>`;
    const ok=isCorrect(qn);return `<div class="feedback ${ok?"":"bad"}"><h3>${ok?"Correct":"Review this answer"}</h3><p><strong>Your answer:</strong> ${esc(answerText(qn,state.answers[qn.id]))}</p><p><strong>Correct answer:</strong> ${esc(answerText(qn,qn.answer))}</p>${promptMarkup(qn.explanation)}${referenceMarkup(qn)}</div>`;
  }
  function answerText(qn,a){if(a===undefined||a===null||a===""||(Array.isArray(a)&&!a.length))return "No answer";if(qn.type==="sample"||qn.type==="manualText")return String(a);if(["order","drag"].includes(qn.type))return (a||[]).join(" → ");if(qn.type==="matching")return qn.rows.map((row,i)=>`${row}: ${(a||[])[i]||"No answer"}`).join("; ");if(qn.type==="matrix")return qn.rows.map((row,i)=>`${row[0]}: ${(a||[])[i]||"No answer"}`).join("; ");if(Array.isArray(a))return a.map(i=>`${letters[i]}. ${qn.options[i]}`).join("; ");return `${letters[a]}. ${qn.options[a]}`}

  function finish(auto){
    clearInterval(timerId);clearSavedSession();const gradable=state.flat.filter(isGradable),manual=state.flat.length-gradable.length,correct=gradable.filter(isCorrect).length,total=gradable.length,score=total?Math.round(correct/total*1000):0,passed=total&&score>=700;
    const domains=Object.keys(DOMAINS).map(d=>{const qs=gradable.filter(x=>x.domain===d),c=qs.filter(isCorrect).length;return {d,total:qs.length,correct:c,pct:qs.length?Math.round(c/qs.length*100):0}}).filter(x=>x.total);
    const history=JSON.parse(localStorage.getItem("ai200-history")||"[]");history.unshift({date:new Date().toLocaleString(),score,passed,mode:state.mode,selectedSetIds:state.selectedSetIds});localStorage.setItem("ai200-history",JSON.stringify(history.slice(0,10)));
    app.innerHTML=`<main class="results"><section class="score-card"><div class="score-hero"><div class="score-circle" style="--pct:${total?correct/total*360:0}deg"><strong>${total?score:"—"}</strong></div><div><div class="eyebrow">Practice score</div><h1 class="${passed?"pass":"fail"}">${total?(passed?"Pass":"Not passed"):"Manual review"}</h1><p>${correct} of ${total} automatically gradable questions correct. ${manual?`${manual} questions require comparison with the supplied answer screen. `:""}${auto?"Time expired and the session was submitted automatically.":""}</p><p>This scaled score is an estimate for practice. Microsoft does not publish a simple question-to-score conversion.</p></div></div>
      <table class="domain-table"><thead><tr><th>Skill area</th><th>Result</th><th>Performance</th></tr></thead><tbody>${domains.map(x=>`<tr><td>${esc(DOMAINS[x.d])}</td><td>${x.correct}/${x.total}</td><td><div class="bar"><span style="width:${x.pct}%"></span></div>${x.pct}%</td></tr>`).join("")}</tbody></table>
      <div class="actions"><button class="secondary" id="print">Print results</button><button class="primary" id="again">Start another session</button></div></section>
      ${state.selectionNote?`<p class="notice">${esc(state.selectionNote)}</p>`:""}<p><strong>Question sets:</strong> ${(state.selectedSetIds||[]).map(id=>esc(catalog.name(id))).join(", ")}</p><section class="history"><h2>Answer review</h2><p>Open a question to see the correct answer, explanation, and reference.</p>${state.flat.map((x,i)=>`<details class="review-answer"><summary class="${!isGradable(x)?"":isCorrect(x)?"answer-good":"answer-bad"}">Question ${i+1} · ${!isGradable(x)?"Manual review":isCorrect(x)?"Correct":"Incorrect"} · ${esc(DOMAINS[x.domain]||"Instructor sample")}</summary><div class="review-body">${x.type==="sample"?`<div class="sample-pages">${x.questionPages.map(src=>`<img src="${esc(src)}" alt="Question ${i+1}">`).join("")}</div>`:`<p>${esc(x.prompt)}</p>`}<p><strong>Your answer:</strong> ${esc(answerText(x,state.answers[x.id]))}</p>${!isGradable(x)?`<div class="sample-pages answer-pages">${(x.answerPages||[]).map(src=>`<img src="${esc(src)}" alt="Answer ${i+1}">`).join("")}</div>${promptMarkup(x.explanation)}`:`<p><strong>Correct answer:</strong> ${esc(answerText(x,x.answer))}</p>${promptMarkup(x.explanation)}`}${referenceMarkup(x)}${state.comments[x.id]?`<p><strong>Your comment:</strong> ${esc(state.comments[x.id])}</p>`:""}</div></details>`).join("")}</section></main>`;
    document.getElementById("again").onclick=welcome;document.getElementById("print").onclick=()=>window.print();
  }

  const speechReady="speechSynthesis"in window;
  let audioVoices=[],audioVoice=null,audioRate=parseFloat(localStorage.getItem("ai200-audio-rate"))||1.5,audioToken=0,wakeLock=null;
  // Respellings applied to spoken audio only (not the on-screen text). Add terms here as needed.
  const PRONUNCIATIONS={
    "Kubernetes":"koo-ber-net-eez","kubectl":"cube control","kubelet":"cube-let","kubeconfig":"cube config",
    "AKS":"A K S","ACR":"A C R","ACA":"A C A","AAD":"A A D","RBAC":"are-back","ABAC":"ay-back",
    "PostgreSQL":"Postgres Q L","psql":"P S Q L","pgvector":"P G vector","PgBouncer":"P G Bouncer",
    "nginx":"engine X","YAML":"yam-ul","JSON":"jason","SKU":"skew","SKUs":"skews","Redis":"reddiss",
    "gRPC":"G R P C","RRF":"R R F","Qdrant":"Q-drant","Cosmos DB":"Cosmos D B","NoSQL":"no-sequel","KEDA":"kee dah",
    "OIDC":"O I D C","JWT":"J W T","PaaS":"pass","SaaS":"sass","IaaS":"i-a-a-s","TTL":"T T L",
    "az":"A Z","CLI":"C L I","SDK":"S D K","API":"A P I","PVC":"P V C","CORS":"cores",
    "dataset":"data set","datasets":"data sets","containerapp":"container app","containerapps":"container apps"
  };
  const PRONUNCIATION_MAP={};Object.keys(PRONUNCIATIONS).forEach(k=>PRONUNCIATION_MAP[k.toLowerCase()]=PRONUNCIATIONS[k]);
  const PRONUNCIATION_RE=new RegExp("\\b("+Object.keys(PRONUNCIATIONS).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")\\b","gi");
  const pronounce=text=>String(text).replace(PRONUNCIATION_RE,m=>PRONUNCIATION_MAP[m.toLowerCase()]);
  function loadVoices(){
    if(!speechReady)return;
    audioVoices=speechSynthesis.getVoices()||[];
    if((!audioVoice||!audioVoices.includes(audioVoice))&&audioVoices.length){
      const saved=localStorage.getItem("ai200-audio-voice");
      audioVoice=(saved&&audioVoices.find(v=>v.name===saved))||audioVoices.find(v=>/^en[-_]/i.test(v.lang))||audioVoices[0];
    }
  }
  if(speechReady)speechSynthesis.addEventListener("voiceschanged",()=>{loadVoices();if(state&&state.mode==="audio")renderAudio()});
  function stopSpeech(){audioToken++;if(speechReady)try{speechSynthesis.cancel()}catch(e){}}
  // Builds the exact spoken string (with respellings) plus display tokens mapped to their spoken char ranges.
  // Backtick-delimited markdown code is stripped from speech and flagged so it renders as inline code.
  function buildSpokenTokens(text){
    const tokens=[];let spoken="",last=0,m,pending="",inCode=false;
    PRONUNCIATION_RE.lastIndex=0;
    const push=(display,spokenText,code)=>{const start=spoken.length;spoken+=spokenText;tokens.push({display,start,code,pre:pending});pending=""};
    const addLiteral=lit=>{lit.split("`").forEach((seg,gi)=>{if(gi>0)inCode=!inCode;const re=/(\s+)|(\S+)/g;let t;while((t=re.exec(seg))){if(t[1]){pending+=t[1];spoken+=t[1]}else{push(t[2],t[2],inCode)}}})};
    while((m=PRONUNCIATION_RE.exec(text))){addLiteral(text.slice(last,m.index));push(m[0],PRONUNCIATION_MAP[m[0].toLowerCase()],inCode);last=m.index+m[0].length}
    addLiteral(text.slice(last));
    return {spoken,tokens};
  }
  function tokenAt(tokens,ci){let idx=-1;for(let k=0;k<tokens.length;k++){if(tokens[k].start<=ci)idx=k;else break}return idx}
  function clearHighlight(){document.querySelectorAll(".aw.speaking").forEach(el=>el.classList.remove("speaking"))}
  function highlightWord(si,ti){clearHighlight();if(ti<0)return;const el=document.getElementById(`aw-${si}-${ti}`);if(el)el.classList.add("speaking")}
  function speakSegments(segments,onDone){
    if(!speechReady)return;
    const token=audioToken;let si=0;
    const step=()=>{
      if(token!==audioToken)return;
      clearHighlight();
      if(si>=segments.length){onDone&&onDone();return}
      const seg=segments[si],myIndex=si;si++;
      const u=new SpeechSynthesisUtterance(seg.spoken);
      if(audioVoice)u.voice=audioVoice;u.rate=audioRate;
      u.onboundary=e=>{if(token!==audioToken)return;if(e.name&&e.name!=="word"&&e.name!=="")return;highlightWord(myIndex,tokenAt(seg.tokens,e.charIndex||0))};
      u.onend=step;u.onerror=step;
      speechSynthesis.speak(u);
    };
    step();
  }
  async function acquireWakeLock(){
    if(!("wakeLock"in navigator))return;
    try{wakeLock=await navigator.wakeLock.request("screen");wakeLock.addEventListener("release",()=>{wakeLock=null})}catch(e){}
  }
  function releaseWakeLock(){if(wakeLock){try{wakeLock.release()}catch(e){}wakeLock=null}}
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&state&&state.mode==="audio"&&state.playing)acquireWakeLock()});

  function spokenAnswer(qn){
    const a=qn.answer;
    if(qn.type==="multi"||(qn.type==="manual"&&qn.choose))return(a||[]).map(i=>qn.options[i]).join("; ");
    if(qn.type==="order"||qn.type==="drag")return(a||[]).join(", then ");
    if(qn.type==="matching")return qn.rows.map((row,i)=>`${row}: ${(a||[])[i]}`).join("; ");
    if(qn.type==="matrix")return qn.rows.map((row,i)=>`${row[0]}: ${(a||[])[i]}`).join("; ");
    return qn.options[a];
  }
  function promptParts(text){return String(text??"").split(/\r?\n+|(?<=[.?!:])\s+/).map(s=>s.trim()).filter(Boolean)}
  function buildSegments(qn){
    const segs=promptParts(qn.prompt).map(t=>({area:"prompt",...buildSpokenTokens(t)}));
    segs.push({area:"label",...buildSpokenTokens("The correct answer is:")});
    segs.push({area:"answer",...buildSpokenTokens(spokenAnswer(qn))});
    return segs;
  }
  // Groups consecutive backtick-code words into one <code> box while keeping per-word spans for highlighting.
  const renderSeg=(seg,si)=>{
    let html="",inCode=false;
    seg.tokens.forEach((tok,ti)=>{
      const span=`<span class="aw" id="aw-${si}-${ti}">${esc(tok.display)}</span>`,pre=esc(tok.pre||"");
      if(tok.code){if(!inCode){html+=pre+'<code class="codewrap">'+span;inCode=true}else{html+=pre+span}}
      else{if(inCode){html+="</code>";inCode=false}html+=pre+span}
    });
    if(inCode)html+="</code>";
    return html;
  };

  function startAudio(){
    clearInterval(timerId);
    loadVoices();
    const all=catalog.pool(selectedSetIds);
    const pool=shuffle(all.map(q=>window.AI200_DATA.prepareQuestion(q,shuffle)).filter(q=>!["sample","manualText"].includes(q.type)));
    state={mode:"audio",pool,idx:0,playing:true};
    acquireWakeLock();
    renderAudio();
    speakCurrent();
  }
  function speakCurrent(){
    stopSpeech();
    speakSegments(state.segments,advanceAudio);
  }
  function advanceAudio(){
    if(!state||state.mode!=="audio"||!state.playing)return;
    state.idx++;
    if(state.idx>=state.pool.length){state.pool=shuffle(state.pool);state.idx=0}
    renderAudio();speakCurrent();
  }
  function audioPlay(){state.playing=true;acquireWakeLock();renderAudio();speakCurrent()}
  function audioPause(){state.playing=false;stopSpeech();releaseWakeLock();renderAudio()}
  function audioStep(delta){
    stopSpeech();
    state.idx+=delta;
    if(state.idx>=state.pool.length){state.pool=shuffle(state.pool);state.idx=0}else if(state.idx<0)state.idx=state.pool.length-1;
    renderAudio();if(state.playing)speakCurrent();
  }
  function audioReshuffle(){stopSpeech();state.pool=shuffle(state.pool);state.idx=0;renderAudio();if(state.playing)speakCurrent()}
  function exitAudio(){stopSpeech();releaseWakeLock();welcome()}

  function renderAudio(){
    loadVoices();
    const qn=state.pool[state.idx];
    const segs=buildSegments(qn);state.segments=segs;
    const promptHTML=segs.map((seg,si)=>seg.area==="prompt"?`<p class="audio-line">${renderSeg(seg,si)}</p>`:"").join("");
    const ai=segs.findIndex(s=>s.area==="answer");
    app.innerHTML=`<div class="shell"><header class="topbar"><div class="brand">AI-200</div><div class="exam-name">Listen &amp; learn</div><div class="top-spacer"></div><div class="top-count">${state.idx+1} of ${state.pool.length}</div></header>
      <main class="audio-stage"><section class="audio-player">
        <div class="question-meta"><span>${esc(DOMAINS[qn.domain]||"Instructor sample")}</span><span class="pill">${labelType(qn)}</span><span class="audio-state">${state.playing?"▶ Playing":"⏸ Paused"} · randomized loop</span></div>
        <div class="prompt audio-prompt">${promptHTML}</div>
        <div class="audio-answer"><span class="audio-answer-label">Correct answer</span><p class="audio-line">${renderSeg(segs[ai],ai)}</p></div>
        <div class="audio-controls"><button class="secondary" id="aPrev">⏮ Previous</button><button class="primary" id="aPlay">${state.playing?"⏸ Pause":"▶ Play"}</button><button class="secondary" id="aNext">Next ⏭</button><button class="secondary" id="aShuffle">⟳ Reshuffle</button><button class="quiet" id="aExit">Back to menu</button></div>
        <div class="audio-settings"><label>Voice <select id="aVoice" ${audioVoices.length?"":"disabled"}>${audioVoices.length?audioVoices.map((v,i)=>`<option value="${i}" ${v===audioVoice?"selected":""}>${esc(v.name)} (${esc(v.lang)})</option>`).join(""):"<option>System default</option>"}</select></label><label>Speed <select id="aRate">${[0.75,1,1.25,1.5,2].map(r=>`<option value="${r}" ${r===audioRate?"selected":""}>${r}×</option>`).join("")}</select></label></div>
        ${speechReady?"":'<p class="warning">This browser does not support in-browser speech synthesis. Open the app in Microsoft Edge or Chrome to hear questions.</p>'}
      </section></main></div>`;
    document.getElementById("aPlay").onclick=()=>state.playing?audioPause():audioPlay();
    document.getElementById("aPrev").onclick=()=>audioStep(-1);
    document.getElementById("aNext").onclick=()=>audioStep(1);
    document.getElementById("aShuffle").onclick=audioReshuffle;
    document.getElementById("aExit").onclick=exitAudio;
    document.getElementById("aVoice").onchange=e=>{audioVoice=audioVoices[+e.target.value]||audioVoice;if(audioVoice)localStorage.setItem("ai200-audio-voice",audioVoice.name);if(state.playing)speakCurrent()};
    document.getElementById("aRate").onchange=e=>{audioRate=+e.target.value;localStorage.setItem("ai200-audio-rate",audioRate);if(state.playing)speakCurrent()};
  }

  welcome();
})();
