(() => {
  'use strict';
  const app = document.getElementById('app');
  let state = {screen:'intro',index:0,answers:Array(QUESTIONS.length).fill(null)};
  const letters = ['A','B','C','D'];
  const roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII'];
  const focusTitle=()=>{app.querySelector('h1,h2')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});};
  const done=()=>state.answers.filter(a=>a!==null).length;
  function readState(){
    const result={screen:state.screen,answered:done(),total:QUESTIONS.length};
    if(state.screen==='quiz') Object.assign(result,{questionNumber:state.index+1,question:QUESTIONS[state.index].title,context:QUESTIONS[state.index].context,options:QUESTIONS[state.index].options.map((o,i)=>({choice:letters[i],text:o[0],description:o[1]})),selected:state.answers[state.index]===null?null:letters[state.answers[state.index]]});
    if(state.screen==='result') result.matches=rankPathways(state.answers).slice(0,3).map(r=>({pathway:r.path.name,sequence9:r.path.sequence,resonance:r.score}));
    return result;
  }
  function start(){state={screen:'quiz',index:0,answers:Array(QUESTIONS.length).fill(null)};renderQuestion();return readState();}
  function select(choice){
    if(state.screen!=='quiz'||!Number.isInteger(choice)||choice<0||choice>3)throw new Error('请选择当前题目的 A、B、C 或 D。');
    state.answers[state.index]=choice;
    app.querySelectorAll('.answer').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===choice)));
    app.querySelector('#next').disabled=false;
    app.querySelector('#selection-note').textContent=`已选择 ${letters[choice]} · 可修改后再继续`;
    return readState();
  }
  function next(){
    if(state.screen!=='quiz'||state.answers[state.index]===null)throw new Error('请先选择一个答案。');
    if(state.index===QUESTIONS.length-1){state.screen='result';renderResult();}
    else{state.index++;renderQuestion();}
    return readState();
  }
  function previous(){
    if(state.screen!=='quiz'||state.index<1)throw new Error('已经是第一题。');
    state.index--;renderQuestion();return readState();
  }
  function renderQuestion(){
    const i=state.index,q=QUESTIONS[i],selected=state.answers[i],chapter=Math.floor(i/4),isLast=i===QUESTIONS.length-1;
    app.innerHTML=`<section class="quiz-shell fade-in" aria-labelledby="question-title"><div class="quiz-top"><span>仪式进行中</span><span><b style="color:var(--gold)">${String(i+1).padStart(2,'0')}</b> / ${QUESTIONS.length}</span></div><div class="progress-track" role="progressbar" aria-label="题目进度" aria-valuemin="0" aria-valuemax="16" aria-valuenow="${i}"><div style="width:${i/16*100}%"></div></div><div class="chapter-list">${CHAPTERS.map((s,j)=>`<span class="${j===chapter?'active':''}" ${j===chapter?'aria-current="step"':''}>${roman[j]} · ${s}</span>`).join('')}</div><div class="question-header"><p class="eyebrow"><span></span> 第${['一','二','三','四'][chapter]}章 · ${CHAPTERS[chapter]}</p><h1 class="question-title" id="question-title" tabindex="-1">${q.title}</h1><p class="question-context">${q.context}</p></div><div class="answers" role="group" aria-labelledby="question-title">${q.options.map((o,j)=>`<button class="answer" data-choice="${j}" aria-pressed="${selected===j}"><span class="answer-letter" aria-hidden="true">${letters[j]}</span><span><strong>${o[0]}</strong><small>${o[1]}</small></span></button>`).join('')}</div><div class="quiz-actions"><button class="text-button" id="previous" ${i===0?'disabled':''}>上一题</button><button class="primary" id="next" ${selected===null?'disabled':''}>${isLast?'揭晓我的途径':'继续仪式'}</button></div><p class="quiet-note" id="selection-note" role="status">${selected===null?'选择最接近你的做法，没有标准答案。':`已选择 ${letters[selected]} · 可修改后再继续`}</p></section>`;
    app.querySelectorAll('.answer').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.choice))));
    app.querySelector('#next').addEventListener('click',next);
    app.querySelector('#previous').addEventListener('click',previous);
    focusTitle();
  }
  function renderResult(){
    const ranked=rankPathways(state.answers),best=ranked[0],p=best.path;
    const evidence=[];
    for(let chapter=0;chapter<4;chapter++) {const m=best.matches.find(i=>Math.floor(i/4)===chapter);if(m!==undefined)evidence.push(m);}
    for(const i of best.matches)if(!evidence.includes(i))evidence.push(i);
    const topTies=ranked.filter(r=>r.raw===best.raw&&r.matches.length===best.matches.length);
    const close=ranked[1].raw>=best.raw-3;
    const note=topTies.length>1?`本次有 ${topTies.length} 条途径并列：${topTies.map(r=>r.path.name).join('、')}。以下按档案顺序展开其中一条，共鸣前三张卡也按此规则排列。`:close?'你与前两条途径的共鸣很接近；不同处境，可能唤醒不同的你。':'这是与你本次选择最契合的途径。你的选择可以变化，命运也并非定局。';
    app.innerHTML=`<section class="result fade-in" aria-labelledby="result-title"><div class="result-heading"><p class="eyebrow"><span></span> 仪式完成 · 灰雾中的回响 <span></span></p><h1 id="result-title" tabindex="-1">${topTies.length>1?'你的灵性，与多条途径产生共鸣':'你的灵性，回应了这条途径'}</h1><p>${note}</p></div><div class="result-grid"><div class="result-card"><span class="result-roman">ARCHIVE ${roman[p.number-1]}</span><span class="result-symbol" aria-hidden="true">${p.symbol}</span><h2>${p.name}</h2><span class="result-english">${p.english}</span><p class="sequence">序列 9 · ${p.sequence}</p><p class="result-tags">${p.tags}</p></div><div class="result-copy"><h2>“${p.quote}”</h2><p class="result-description">${p.description}</p><p class="section-label">你的选择，留下了这些线索</p><ul class="reasons">${evidence.slice(0,3).map(i=>`<li>第 ${i+1} 题，你选择了「${QUESTIONS[i].options[state.answers[i]][0]}」。${QUESTIONS[i].options[state.answers[i]][2]}</li>`).join('')}</ul><p class="risk"><b>给这条途径的你：</b>${p.risk}</p></div></div><p class="section-label">与你共鸣的三条途径</p><div class="resonance">${ranked.slice(0,3).map((r,i)=>`<div class="resonance-item"><div class="resonance-row"><strong>${r.path.name}</strong><span>${r.score}<small> / 100</small></span></div><div class="resonance-track"><div style="width:${r.score}%"></div></div><small>${i===0?'主要共鸣':'相近共鸣'} · ${r.path.sequence}</small></div>`).join('')}</div><div class="result-end"><p>共鸣指数仅表示本次答案与题库偏好的吻合程度，不是概率、能力评级或心理测量。途径结果不对应现实中的性别、善恶或命运。</p><button class="primary" id="restart">重新进行仪式</button></div><details class="method"><summary>这份结果如何产生？</summary><p>本测试为非官方同人创作，覆盖《诡秘之主》的 22 条标准非凡途径。16 道题与性格解读为原创设计，途径性格偏好并非原作设定。每条途径在每题有一个偏好选项：吻合得 4 分，相关选项得 1 分，其余得 0 分；总分换算为 0–100 的共鸣指数。总分相同时先比较完全吻合的题数，仍相同则按固定档案顺序展示，并明确提示并列。所有答案只在当前页面内存中计算，刷新或离开页面会清空，不上传答题内容。</p></details></section>`;
    const lore=PATHWAY_LORE[p.id];
    const loreSection=document.createElement('section');
    loreSection.className='pathway-lore';
    loreSection.setAttribute('aria-labelledby','lore-title');
    loreSection.innerHTML=`<div class="lore-heading"><div><p class="section-label">灰雾档案 / ${String(p.number).padStart(2,'0')}</p><h2 id="lore-title">${p.name}的来历</h2></div><span class="lore-seal" aria-hidden="true">${p.symbol}</span></div><p class="lore-domain">${lore.domain}</p><p class="lore-origin">${lore.origin}</p><details class="lore-history" open><summary>关联神明与历史 <span>含第一部人物身份剧透</span></summary><div class="lore-history-content"><h3>${lore.figure}</h3><p class="lore-identity">${lore.identity}</p><p>${lore.history}</p></div></details><figure class="lore-verse"><figcaption>属于这条途径的一句话</figcaption><blockquote>${lore.verse}</blockquote><p>同人原创寄语 · 非原作引文或角色原话</p></figure><p class="lore-note">背景按《诡秘之主》第一部设定概述；历史神位与代表人物不等同于现任唯一真神。</p>`;
    app.querySelector('.result-end').before(loreSection);
    app.querySelector('#restart').addEventListener('click',start);
    focusTitle();
  }
  app.querySelector('#start').addEventListener('click',start);
  const lifecycle=new AbortController();
  const context=document.modelContext;
  if(context?.registerTool){
    const tools=[
      {name:'read_pathway_quiz',title:'读取非凡途径测试',description:'Read the current quiz question, selected answer, progress, or completed result.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>readState()},
      {name:'start_pathway_quiz',title:'开始或重新开始测试',description:'Start a fresh 16-question quiz. Clears any existing answers and results.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:()=>start()},
      {name:'answer_pathway_question',title:'选择当前题目的答案',description:'Choose A, B, C, or D for the current question; optionally continue to the next question or reveal the result after question 16.',inputSchema:{type:'object',properties:{choice:{type:'string',enum:letters},continue:{type:'boolean'}},required:['choice'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{
        if(!input||typeof input!=='object'||Array.isArray(input)||!letters.includes(input.choice)||Object.keys(input).some(k=>!['choice','continue'].includes(k))||(input.continue!==undefined&&typeof input.continue!=='boolean')) throw new Error('答案格式无效；choice 应为 A、B、C 或 D，continue 应为布尔值。');
        select(letters.indexOf(input.choice));return input.continue?next():readState();
      }}
    ];
    for(const tool of tools)try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
  }
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
})();
