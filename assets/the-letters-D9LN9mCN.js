const we={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},ue={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day retry",cost:.2,note:"Cheap and fixed. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},U=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],Y=10,de=[60,75,105,150],ke=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function Ae(A){let y=A>>>0;return function(){y=y+1831565813>>>0;let d=y;return d=Math.imul(d^d>>>15,1|d),d=d+Math.imul(d^d>>>7,61|d)^d,((d^d>>>14)>>>0)/4294967296}}function Z(A,y){const d=ke[A],g=y*2,p=Ae((A+1)*7919+g*104729+17),C=[],T=[];for(let s=1;s<=3;s++)p()<d.sack&&C.push({letter:s,attempt:1}),p()<d.slip&&T.push({letter:s});const R=p()<d.storm?2:0;return{lostBags:C,lostReceipts:T,delay:R}}const Le=[.1,.25,.4],ne=.4,oe=.2,ce=.6;function fe(A,y,d,g){return!A.remote||d!=="B"&&g!=="B"?2:y==="relay"?3:4}function V(A,y){const d=ue[A].find(g=>g.id===y);return d?d.cost:0}function ee(A={}){const y=U[A.scenario??0],d={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...A.rules||{}},g=d.ledger==="on"&&d.numbering!=="none",p=A.plan??null,C=p?p.lostBags:y.lostBags,T=p?p.lostReceipts:y.lostReceipts,R=p?.delay??0,s=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(a=>({...a,number:d.numbering==="serial"?`${a.from}-${String(a.seq).padStart(2,"0")}`:d.numbering==="date"?"DAY-"+y.day:null,attempts:[],acked:!1,ackAt:null,slipLost:T.some(c=>c.letter===a.seq)})),E=[],P=[],F=[],I=new Set;let x=0,te=0,e=!1;const L=(a,c,v={})=>{F.push({t:x,kind:a,text:c,...v})};function D(a,c){const v=fe(y,d.route,a.from,a.to)+R,M={id:"a"+ ++te,letterId:a.id,number:a.number,from:a.from,to:a.to,attempt:c,start:x,delivered:!1,status:"moving",deliverAt:x+ne+oe+v+oe+ne,lost:C.some(B=>B.letter===a.seq&&B.attempt===c),lostAt:x+ne+oe+v*.55,flightDays:v};return a.attempts.push(M),E.push(M),L("sent",`${a.label} left the desk${M.number?" ["+M.number+"]":""}`,{letter:a.id,attempt:M.id}),M}function G(a){const c=s.find(v=>v.id===a.letterId);if(g&&a.number&&I.has(a.number)){a.status="dropped",a.endedAt=x,L("dropped",`${a.number} already in the ledger — the copy is dropped`,{letter:a.letterId,attempt:a.id}),d.receipts==="sign"&&(c.ackAt=x+a.flightDays+ce);return}g&&a.number&&I.add(a.number),a.status="delivered",a.delivered=!0,a.endedAt=x,P.push({letterId:a.letterId,number:a.number,at:x,attempt:a.id}),L("delivered",`${c.to==="A"?"Alice":c.to==="B"?"Bob":"Carol"} received ${a.number||"a letter"}`,{letter:a.letterId,attempt:a.id}),d.receipts==="sign"&&(c.ackAt=x+a.flightDays+ce)}function $(a){if(!e){x+=a;for(const c of E)if(c.status==="moving"){if(c.lost&&x>=c.lostAt){c.status="lost",c.endedAt=x,L("lost",`the bag carrying ${c.number||"a letter"} is gone`,{letter:c.letterId,attempt:c.id});continue}x>=c.deliverAt&&G(c)}for(const c of s)!c.acked&&c.ackAt&&x>=c.ackAt&&(c.slipLost?(c.slipLost=!1,c.ackAt=null,L("lost",`the signed slip for ${c.number||c.label} never arrived`,{letter:c.id})):(c.acked=!0,L("ack",`the signed slip for ${c.number||c.label} reached the sender`,{letter:c.id})));if(d.retry!=="never"&&x>.01){const c=d.retry==="tuned"?2:3;for(const v of s){if(v.acked||v.attempts.length>=c)continue;const M=v.attempts[v.attempts.length-1];if(!M)continue;const B=d.retry==="tuned"?2*M.flightDays+2.6:6.5;x>=M.start+B&&(L("retry",`no slip from ${v.label} — sending again`,{letter:v.id}),D(v,v.attempts.length+1))}}}}function _(){const a=s.map(w=>{const N=P.filter(z=>z.letterId===w.id),j=N.length?Math.min(...N.map(z=>z.at)):null;return{id:w.id,label:w.label,number:w.number,delivered:N.length,first:j,onTime:j!==null&&j<=y.deadline,acked:w.acked,lost:w.attempts.length>0&&w.attempts.every(z=>z.status==="lost")}}),c=a.filter(w=>w.delivered===1).length,v=a.filter(w=>w.delivered===1&&w.onTime).length,M=a.reduce((w,N)=>w+Math.max(0,N.delivered-1),0),B=a.filter(w=>w.delivered===0).length,K=a.filter(w=>w.acked).length,re=s.length*1+s.length*V("numbering",d.numbering)+s.length*V("receipts",d.receipts)+(g?s.length*V("ledger",d.ledger):0)+(d.retry!=="never"?s.length*V("retry",d.retry):0)+(y.remote&&d.route==="direct"?s.length*.5:0)+(E.length-s.length)*1;return{rows:a,exact:c,onTime:v,dupes:M,lost:B,total:s.length,cost:Math.round(re*10)/10,attempts:E.length,promise:v===s.length&&M===0,signed:K,proof:K===s.length}}function O(){for(;x<y.deadline+3;)$(.05);return e=!0,_()}return s.forEach((a,c)=>{x=Le[c],D(a,1)}),x=0,{scenario:y,rules:d,letters:s,attempts:E,deliveries:P,events:F,plan:{lostBags:C,lostReceipts:T,delay:p?.delay??0},get now(){return x},tick:$,summary:_,runAll:O,get done(){return e}}}const pe=new Map;function Me(A){const y=pe.get(A);if(y!==void 0)return y;let d=1/0;const g=["none","date","serial"],p=["never","tuned","quick"];for(const T of g)for(const R of p)for(const s of["off","on"]){if(s==="on"&&T==="none")continue;const E={numbering:T,receipts:"sign",retry:R,ledger:s,route:"direct"};let P=0,F=!0;for(let I=0;I<Y;I++){const x=ee({scenario:A,rules:E,plan:Z(A,I)}).runAll();if(!x.promise||!x.proof){F=!1;break}P+=x.cost}F&&(d=Math.min(d,P))}const C=Number.isFinite(d)?Math.round(d*10)/10:null;return pe.set(A,C),C}const Te=`
:host { display: block; }
* { box-sizing: border-box; }
.wrap {
  --line: #242a34; --panel: #12151b; --panel2: #171b22;
  --text: #e6e9ef; --dim: #8b94a3; --dimmer: #5c6472;
  --blue: #58a6ff; --green: #3fb950; --red: #f85149; --amber: #d29922;
  --violet: #a371f7; --teal: #39c5cf; --gold: #e3b341;
  color: var(--text);
  font: 13.5px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #0e1116;
}
.mono { font-family: "SF Mono", ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums; }
button { font: inherit; color: var(--text); background: var(--panel2); border: 1px solid var(--line); border-radius: 7px; padding: 5px 9px; cursor: pointer; font-size: 12px; }
button:hover { border-color: #3a4350; }
button.primary { background: #2a2413; border-color: #5a4a1c; color: #f0d78a; }
button:disabled { opacity: .4; cursor: default; }

.bar { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-bottom: 1px solid var(--line); background: #0f1319; flex-wrap: wrap; }
.bar .title { font-size: 12.5px; font-weight: 560; }
.bar .title span { color: var(--dimmer); font-weight: 400; }
.bar .spacer { flex: 1; }
.days { display: flex; gap: 3px; }
.days button { padding: 4px 7px; font-size: 11px; }
.days button.on { border-color: var(--gold); color: var(--gold); }
.clock { font-size: 11px; color: var(--dim); }
.clock b { color: var(--text); font-weight: 500; }
.rail { display: flex; align-items: center; gap: 9px; padding: 8px 12px; border-top: 1px solid var(--line); background: #0f1319; flex-wrap: wrap; }
.rail .rail-label { font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--dimmer); }
.rail .rail-hint { font-size: 9.5px; color: var(--dimmer); }
.sitchips { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.sitchips .sip { width: 30px; height: 24px; padding: 0; border-radius: 6px; background: #1a2029; border: 1px solid #333d4b; color: var(--dim); font-size: 10.5px; font-weight: 600; cursor: pointer; display: grid; place-items: center; }
.sitchips .sip:hover { border-color: var(--text); color: var(--text); }
.sitchips .sip.ok { background: #102219; border-color: #2b5d3b; color: #7ee2a8; }
.sitchips .sip.bad { background: #2a1316; border-color: #6e2b31; color: #ff9b9b; }
.sitchips .sip.warn { background: #221d10; border-color: #5a4a1c; color: #e3c37a; }
.sitchips .sip.bad:hover { border-color: var(--red); }
.sitchips .sip.sel { box-shadow: 0 0 0 1px var(--gold); }

.mapwrap { position: relative; height: 420px; background: radial-gradient(120% 100% at 50% 0%, #10151d 0%, #0b0d10 70%); }
svg { width: 100%; height: 100%; display: block; }
.route { fill: none; stroke: #36405a; stroke-width: 1.5; stroke-dasharray: 3 6; }
.routelabel { fill: var(--dimmer); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
.city text.name { fill: var(--text); font-size: 13px; font-weight: 560; }
.city text.place { fill: var(--dimmer); font-size: 10.5px; }
.office { fill: #1a2029; stroke: #2f3a49; stroke-width: 1; }
.office.flag { fill: var(--gold); }
.letter rect { fill: #f2e6c8; stroke: #b99a52; }
.letter path { stroke: #b99a52; fill: none; }
.letter text { fill: #f0e6c8; font-size: 8px; font-weight: 700; }
.letter { filter: drop-shadow(0 2px 4px rgba(0,0,0,.45)); }
.letter.focus rect { stroke: var(--gold); stroke-width: 2.2; }
.stack text { fill: #f0e6c8; font-size: 7.5px; font-weight: 700; }
.lostmark { fill: none; stroke: var(--red); stroke-width: 2; }

.panels { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }
.panels > div { padding: 12px; min-width: 0; }
.panels > div + div { border-left: 1px solid var(--line); }
h3.grp { font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0 0 6px; font-weight: 600; }
.rulegrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
.opt { display: block; width: 100%; text-align: left; background: var(--panel); border: 1px solid var(--line); border-radius: 7px; padding: 5px 7px; margin-bottom: 4px; cursor: pointer; font: inherit; color: var(--text); }
.opt:hover { border-color: #3a4350; }
.opt.on { border-color: var(--gold); background: #1c1a12; }
.opt .row { display: flex; justify-content: space-between; gap: 6px; align-items: baseline; }
.opt .nm { font-size: 11px; font-weight: 520; }
.opt .pr { font-size: 10px; color: var(--gold); }
.opt .note { font-size: 9.5px; color: var(--dimmer); line-height: 1.3; margin-top: 1px; display: none; }
.opt.on .note { display: block; }
.opt.off { opacity: .38; cursor: not-allowed; }

.brief { padding: 10px 14px 9px; border-bottom: 1px solid var(--line); background: linear-gradient(180deg, #11161d, #0d1116); }
.brief-title { font-size: 12px; font-weight: 600; letter-spacing: .01em; }
.brief-copy { font-size: 10.5px; color: var(--dim); line-height: 1.5; margin-top: 3px; max-width: 760px; }
.brief-goal { font-size: 9.5px; color: var(--dimmer); margin-top: 5px; }
.brief-goal b { color: var(--gold); font-weight: 600; letter-spacing: .04em; }
.score-rank { display: flex; align-items: center; gap: 9px; margin-bottom: 4px; }
.rank { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; font-size: 17px; font-weight: 650; border: 1px solid var(--line); background: #141922; color: var(--dim); flex: none; }
.rank.s { background: var(--gold); border-color: var(--gold); color: #0d1117; }
.rank.a { background: #102219; border-color: #2b5d3b; color: #7ee2a8; }
.rank.b { background: #221d10; border-color: #5a4a1c; color: var(--amber); }
.rank.c { background: #2a1316; border-color: #6e2b31; color: #ff9b9b; }
.rank-body { flex: 1; min-width: 0; }
.rank-title { font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--dimmer); }
.rank-body .big { font-size: 16px; }
.best { text-align: right; font-size: 8.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--dimmer); line-height: 1.45; flex: none; }
.best b { display: block; font-size: 10.5px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--text); }
.budget-line { display: flex; justify-content: space-between; font-size: 8.5px; letter-spacing: .1em; color: var(--dimmer); }
.budget-track { height: 4px; border-radius: 999px; background: #1b222c; overflow: hidden; margin: 3px 0 5px; }
.budget-track i { display: block; height: 100%; width: 0; background: var(--green); transition: width .3s; }
.budget-track i.over { background: var(--red); }
.starget { font-size: 9px; color: var(--dimmer); margin: 0 0 4px; line-height: 1.35; }
.score .head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.score .big { font-size: 15px; font-weight: 560; }
.ok { color: var(--green); } .bad { color: var(--red); }
.srow { display: grid; grid-template-columns: 1fr 76px 40px; gap: 6px; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #171d26; align-items: center; }
.srow .l { color: var(--dim); }
.srow .l b { color: var(--text); font-weight: 500; }
.srow .c { text-align: right; }
.srow .t { text-align: right; color: var(--dimmer); font-size: 10px; }

.log { margin-top: 10px; height: 200px; overflow-y: auto; font-size: 10.5px; border-top: 1px solid var(--line); padding-top: 6px; }
.log .lrow { display: grid; grid-template-columns: 34px 1fr; gap: 6px; padding: 1.5px 0; border-bottom: 1px solid #141a22; }
.log .lt { color: var(--dimmer); font-size: 9.5px; }
.log .lx { color: #b6bec9; }
.log .sent .lx { color: var(--blue); }
.log .delivered .lx { color: var(--green); }
.log .dropped .lx { color: var(--violet); }
.log .lost .lx { color: var(--red); }
.log .retry .lx { color: var(--amber); }
.log .ack .lx { color: var(--teal); }

.verdict { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); background: #12151bee; border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; width: min(420px, 90%); box-shadow: 0 12px 40px rgba(0,0,0,.5); display: none; }
.verdict.show { display: block; }
.verdict .vt { font-size: 12.5px; font-weight: 560; margin-bottom: 3px; }
.verdict .vs { font-size: 11px; color: var(--dim); margin-bottom: 8px; }
.verdict .va { display: flex; gap: 6px; }

@media (max-width: 640px) {
  .panels { grid-template-columns: 1fr; }
  .panels > div + div { border-left: none; border-top: 1px solid var(--line); }
  .mapwrap { height: 340px; }
}
.wrap.campaign .days, .wrap.campaign #next { display: none; }
.wrap.campaign .brief { display: none; }
.wrap.campaign .brief-goal { display: none; }
.wrap.solo .rail { display: none; }
.wrap.no-rules .panels { grid-template-columns: 1fr; }
.wrap.no-rules .panels > div:first-child { display: none; }
.wrap.no-rules .panels > div + div { border-left: none; }
.wrap.campaign .best, .wrap.campaign .starget { display: none; }
#run { display: none; }
.wrap.campaign #run { display: inline-block; }
`,Se=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <button id="run" class="primary" title="Watch this stop play out">Run route →</button>
    <div class="days" id="days"></div>
    <button id="reset" title="Recompute results">↺</button>
    <span class="clock mono"><b id="clock">situation 1/10 · day 0.0</b></span>
  </div>

  <div class="brief">
    <div class="brief-title">Your job: keep the promise</div>
    <div class="brief-copy">Deliver every letter once, on time — across ten independent weather worlds. Pick the post-office add-ons; postage comes out of a fixed budget. Signed slips are proof: they cost extra and earn the S. Click a red result to replay its failure.</div>
    <div class="brief-goal"><b>PASS</b> 9 / 10 delivered within budget · <b>PERFECT</b> all slips at the efficient price earns an S · best saved per day (<span id="briefBudget">60</span> coins)</div>
  </div>

  <div class="mapwrap">
    <svg id="map" viewBox="0 0 800 430" preserveAspectRatio="xMidYMid meet">
      <defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#1b2230"/></pattern></defs>
      <rect x="0" y="0" width="800" height="430" fill="url(#dots)" opacity="0.65" />
      <g id="map-static"></g>
      <g id="map-dynamic"></g>
    </svg>
    <div class="verdict" id="verdict">
      <div class="vt" id="vt"></div>
      <div class="vs" id="vs"></div>
      <div class="va"><button id="next" class="primary">Next day →</button><button id="again">Run again</button></div>
    </div>
  </div>

  <div class="rail">
    <span class="rail-label">Results</span>
    <div class="sitchips" id="sitchips"></div>
    <span class="rail-hint">click any result to replay · amber = delivered, unsigned · red = broken</span>
  </div>

  <div class="panels">
    <div>
      <h3 class="grp" style="margin-bottom:8px">Post office add-ons</h3>
      <div class="rulegrid" id="rules"></div>
      <div style="font-size:9.5px;color:var(--dimmer);margin-top:6px;line-height:1.4">Add-ons apply to all three offices. Priced per letter, in postage.</div>
    </div>
    <div>
      <div class="score">
        <div class="score-rank">
          <span class="rank" id="rank" title="S = perfect · A = pass · B = close · C = fail">—</span>
          <div class="rank-body">
            <div class="rank-title">Scoreboard</div>
            <div class="big" id="promiseState">in progress</div>
          </div>
          <div class="best"><span>BEST</span><b id="best">—</b></div>
        </div>
        <div class="budget-line"><span>POSTAGE</span><span class="mono" id="cost" style="font-size:10.5px;color:var(--dim)"></span></div>
        <div class="budget-track"><i id="budgetBar"></i></div>
        <div class="starget" id="starget"></div>
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 3px"></div>
        <div id="sitnote" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:0 0 3px"></div>
        <div id="why" style="font-size:9.5px;line-height:1.35;margin:0 0 5px;color:var(--dimmer)"></div>
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`,Ce=(A,y)=>{const d=A.shadowRoot??A.attachShadow({mode:"open"});d.innerHTML="<style>"+Te+"</style>"+Se;const g=y.campaign,p=Math.max(1,Math.min(Y,g?.situations??Y)),C=g?.ruleGroups??["numbering","receipts","retry","ledger"],T=d.querySelector(".wrap");g&&T.classList.add("campaign"),p===1&&T.classList.add("solo"),C.length||T.classList.add("no-rules");const R=t=>g?Math.min(Y-1,(g.morning??0)+t):t,s=t=>d.querySelector("#"+t),E=d.querySelector("#map"),P=d.querySelector("#map-static"),F=d.querySelector("#map-dynamic");let I="";const x={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},te={x:470,y:62},e={day:g?.scenario??0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct",...g?.initialRules??{},...g?.fixedRules??{}},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1,started:!1,best:null,sTarget:null};let L=0,D=0,G=0;function $(t){return e.sim?.scenario.remote&&t==="B"?te:x[t]}function _(t,r){const n=$(t),l=$(r),f=l.x-n.x,o=l.y-n.y,i=Math.hypot(f,o)||1,m=t==="A"&&r==="C"?-54:42;return{p1:n,p2:l,c:{x:(n.x+l.x)/2-o/i*m,y:(n.y+l.y)/2+f/i*m}}}function O(t,r,n,l){const f=1-l;return{x:f*f*t.x+2*f*l*r.x+l*l*n.x,y:f*f*t.y+2*f*l*r.y+l*l*n.y}}function a(){e.playing=!1,cancelAnimationFrame(L)}function c(){a(),G=0,e.ended=!0,e.started=!1,e.single=!1,s("run").disabled=!1,e.drawnLog=0,e.focus=null,e.index=0,e.days=Array.from({length:p},(t,r)=>ee({scenario:e.day,rules:e.rules,plan:Z(e.day,R(r))})),e.results=e.days.map((t,r)=>ee({scenario:e.day,rules:e.rules,plan:Z(e.day,R(r))}).runAll()),e.sTarget=Me(e.day),e.best=re(),e.best&&(e.sTarget===null||e.best.cost>e.sTarget+.05)&&(e.best=null),w(),e.sim=e.days[0],s("verdict").classList.remove("show"),s("log").innerHTML="",q()}function v(t=!1){if(e.ended&&c(),g&&(e.started=!0),e.sim&&e.sim.now>=e.sim.scenario.deadline+2&&!t){let r=e.index+1;for(;r<p&&e.results[r];)r++;r<p&&(e.index=r,e.sim=e.days[r],s("log").innerHTML="",e.drawnLog=0,q())}e.playing=!0,e.single=t,D=performance.now(),cancelAnimationFrame(L),L=requestAnimationFrame(B)}function M(t){a(),s("verdict").classList.remove("show"),e.ended=!1,e.single=!1,e.playing=!1,e.index=t,e.days[t]=ee({scenario:e.day,rules:e.rules,plan:Z(e.day,R(t))}),e.sim=e.days[t],s("log").innerHTML="",e.drawnLog=0,q(),v(!0)}function B(t){if(!e.playing||!e.sim)return;if(t<G){L=requestAnimationFrame(B);return}const r=Math.min(.06,(t-D)/1e3);D=t;const n=e.single||e.index===0?2.2:4.2;if(e.sim.tick(r*e.speed*n),e.sim.now>=e.sim.scenario.deadline+2){if(e.results[e.index]=e.sim.summary(),e.single){e.playing=!1,e.single=!1,e.ended=!0,w(),cancelAnimationFrame(L),q();return}if(e.index++,e.results.every(Boolean)||e.index>=p){j();return}for(;e.index<p&&e.results[e.index];)e.index++;if(e.index>=p){j();return}e.sim=e.days[e.index],s("log").innerHTML="",e.drawnLog=0,q(),D=t,G=t+220,L=requestAnimationFrame(B);return}q(),L=requestAnimationFrame(B)}function K(){return"letters:best:"+e.day}function re(){if(g)return null;try{const t=localStorage.getItem(K());if(!t)return null;const r=JSON.parse(t);if(r&&typeof r.kept=="number"&&typeof r.cost=="number")return{kept:r.kept,signed:typeof r.signed=="number"?r.signed:0,cost:r.cost}}catch{}return null}function w(){if(g)return;const t=N();if(e.sTarget===null||t.kept<p||t.signed<p*3||t.cost>e.sTarget+.05)return;const r=e.best;if(!r||t.kept>r.kept||t.kept===r.kept&&t.signed>r.signed||t.kept===r.kept&&t.signed===r.signed&&t.cost<r.cost){e.best={kept:t.kept,signed:t.signed,cost:t.cost};try{localStorage.setItem(K(),JSON.stringify(e.best))}catch{}}}function N(){const t=e.results.filter(i=>!!i),r=t.filter(i=>i.promise).length,n=t.reduce((i,m)=>i+m.signed,0),l=Math.round(t.reduce((i,m)=>i+m.cost,0)*10)/10,f=de[e.day],o=["L1","L2","L3"].map(i=>{const m=e.days[0]?.letters.find(u=>u.id===i)?.label??i;let h=0,b=0;for(const u of t){const k=u.rows.find(S=>S.id===i);k&&k.delivered===1&&h++,k&&(b+=Math.max(0,k.delivered-1))}return{id:i,label:m,ok:h,dup:b}});return{kept:r,signed:n,cost:l,budget:f,per:o,n:t.length}}function j(){a(),e.playing=!1,s("run").disabled=!1,e.single=!1,e.ended=!0;const t=N(),r=g?t.kept>=p&&t.cost<=t.budget&&(g.pass!=="proof"||t.signed>=p*3):t.kept>=z&&t.cost<=t.budget;s("verdict").classList.add("show");const n=t.cost>t.budget;s("vt").innerHTML=r?'<span class="ok">'+(g?"Objective met":"Good enough")+": "+t.kept+" / "+p+" situations.</span>":n?'<span class="bad">Over budget: '+t.cost+" / "+t.budget+" coins.</span>":'<span class="bad">Not yet: '+t.kept+" / "+p+" situations.</span>";let l=-1,f=99;e.results.forEach((b,u)=>{if(!b)return;const k=b.exact*2-b.dupes;k<f&&(f=k,l=u)});const o=l>=0?e.results[l]:null,i=o?o.rows.slice().sort((b,u)=>u.delivered-b.delivered)[0]:null,m=i&&i.delivered>1?" · worst: situation "+(l+1)+", "+i.delivered+" copies for "+i.label:o&&o.lost>0?" · worst: situation "+(l+1)+", a letter never arrived":" · every letter at most once";s("vs").textContent=t.cost+" / "+t.budget+" coins"+m;const h=s("next");if(h.disabled=e.day>=U.length-1,h.textContent=e.day>=U.length-1?"That is the whole slice":"Next day →",q(),g){const b=g.pass==="proof"?t.signed>=p*3&&r:r;g.onComplete?.({passed:b,detail:b?g.pass==="proof"?"All three letters delivered; all three signed slips returned.":"All three letters delivered once and on time.":n?"Postage exceeded the office budget. Adjust an add-on and run again.":g.pass==="proof"?"The delivery is not proven yet. Return receipts from every letter are still missing.":"The promise is still broken. Check lost, late, or duplicate letters and run again."})}}const z=g?p:Math.ceil(Y*.85);function ge(){a(),e.results=e.days.map(t=>t.runAll()),e.index=e.days.length,e.sim=e.days[e.days.length-1],j()}function q(){if(!e.sim)return;me(),ye(),ve();const t=Math.min(e.index+1,p),r=Math.min(e.sim.now,e.sim.scenario.deadline).toFixed(1);s("clock").textContent="situation "+t+"/"+p+" · day "+r+" / "+e.sim.scenario.deadline}function me(){const t=e.sim;if(!t)return;const r=[],n=[];for(const[o,i]of[["A","B"],["B","C"],["A","C"]]){const m=_(o,i);r.push(`<path class="route" d="M ${m.p1.x} ${m.p1.y} Q ${m.c.x} ${m.c.y} ${m.p2.x} ${m.p2.y}" />`);const h=O(m.p1,m.c,m.p2,.5),b=fe(t.scenario,t.rules.route,o,i);r.push(`<text class="routelabel" x="${h.x}" y="${h.y-12}" text-anchor="middle">${b} days one-way</text>`)}for(const o of["A","B","C"]){const i=$(o),m=we[o],h=t.deliveries.filter(u=>t.letters.find(k=>k.id===u.letterId).to===o),b=t.scenario.remote&&o==="B";r.push(`<g class="city">
        <circle cx="${i.x}" cy="${i.y}" r="28" fill="#0f141b" stroke="${m.color}" stroke-width="2" />
        <text class="name" x="${i.x}" y="${i.y+44}" text-anchor="middle">${m.friend}</text>
        <text class="place" x="${i.x}" y="${i.y+58}" text-anchor="middle">${b?"the mountains":m.city}</text>
        <g transform="translate(${i.x+30},${i.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),h.slice(0,4).forEach((u,k)=>{n.push(`<g class="stack" transform="translate(${i.x+38+k*13},${i.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${u.number?`<text x="7" y="-4" text-anchor="middle">${u.number}</text>`:""}
        </g>`)})}let l=0;for(const o of t.attempts){if(o.status!=="moving")continue;const i=1.2+o.flightDays,m=Math.max(0,Math.min(1,(t.now-o.start)/i)),h=.6/i,b=(.6+o.flightDays)/i;let u,k=0;if(m<=h)u=$(o.from),u={x:u.x-40-l++%3*7,y:u.y-2};else if(m>=b)u=$(o.to),u={x:u.x+12,y:u.y+34};else{const W=(m-h)/(b-h),H=_(o.from,o.to);u=O(H.p1,H.c,H.p2,W);const ae=O(H.p1,H.c,H.p2,Math.min(1,W+.015));k=Math.max(-20,Math.min(20,Math.atan2(ae.y-u.y,ae.x-u.x)*180/Math.PI)),u.y-=8;for(let X=1;X<=2;X++){const le=O(H.p1,H.c,H.p2,Math.max(0,W-X*.03));n.push('<rect x="'+(le.x-8)+'" y="'+(le.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/X+'" />')}}const S=e.focus===o.letterId;n.push('<g class="letter '+(S?"focus":"")+'" data-letter="'+o.letterId+'" style="cursor:pointer" transform="translate('+u.x+" "+u.y+") rotate("+k+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(o.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-k+' 0 -11)">'+o.number+"</text>":"")+"</g>")}for(const o of t.letters){const i=t.deliveries.find(S=>S.letterId===o.id);if(!i||t.rules.receipts!=="sign"||!o.ackAt||t.now<i.at||t.now>o.ackAt)continue;const m=(t.now-i.at)/(o.ackAt-i.at),h=t.plan.lostReceipts.some(S=>S.letter===o.seq);if(h&&m>.55)continue;const b=_(o.to,o.from),u=O(b.p1,b.c,b.p2,m),k=h?Math.max(.15,1-Math.max(0,m-.3)/.25):1;n.push('<g transform="translate('+u.x+" "+(u.y-7)+')" opacity="'+k+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const o of t.deliveries){const i=t.now-o.at;if(i<0||i>1.1)continue;const m=t.letters.find(u=>u.id===o.letterId);if(!m)continue;const h=$(m.to),b=i/1.1;n.push('<circle cx="'+h.x+'" cy="'+h.y+'" r="'+(28+36*b)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-b)+'" opacity="'+.5*(1-b)+'" />');for(let u=0;u<6;u++){const k=Math.PI*2*u/6,S=26+30*b;n.push('<circle cx="'+(h.x+Math.cos(k)*S)+'" cy="'+(h.y+Math.sin(k)*S)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-b)+'" />')}}for(const o of t.attempts){if(o.status!=="moving")continue;const i=1.2+o.flightDays,m=(t.now-o.start)/i,h=.6/i,b=.8/i;if(m<h||m>b+.08)continue;const u=$(o.from),S=.75+.25*Math.min(1,(m-h)/(b-h)),W=m>b?Math.max(0,1-(m-b)/.08):1;n.push('<g transform="translate('+(u.x-26)+" "+(u.y+24)+") scale("+S+')" opacity="'+.9*W+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const f=t.scenario.day+"|"+t.scenario.remote+"|"+t.rules.route;f!==I&&(P.innerHTML=r.join(""),I=f),F.innerHTML=n.join("")}function ie(){const t=s("sitchips");t.children.length!==p&&(t.innerHTML=Array.from({length:p},(n,l)=>'<button class="sip" data-i="'+l+'" title="Situation '+(l+1)+'">'+(l+1)+"</button>").join(""));const r=e.ended?-1:e.index;t.querySelectorAll(".sip").forEach((n,l)=>{const f=e.results[l],o=f?f.promise?f.proof?"ok":"warn":"bad":"";n.className="sip "+[o,l===r?"sel":""].filter(Boolean).join(" "),n.title="Situation "+(l+1)+" — "+be(f)})}function be(t){if(!t)return"not run";if(t.promise&&t.proof)return"delivered · all slips back";if(t.promise)return"delivered · "+t.signed+"/"+t.total+" signed";const r=[];t.lost&&r.push(t.lost+" lost"),t.dupes&&r.push(t.dupes+" duplicate"+(t.dupes>1?"s":""));const n=t.rows.filter(f=>f.delivered===1&&!f.onTime).length;n&&r.push(n+" late");const l=t.rows.filter(f=>!f.acked).length;return l&&r.push(l+" unsigned"),r.length?r.join(" · "):"promise broken"}function he(t){const r=e.results.filter(h=>!!h),n=r.reduce((h,b)=>h+b.lost,0),l=r.reduce((h,b)=>h+b.dupes,0),f=r.reduce((h,b)=>h+b.rows.filter(u=>u.delivered===1&&!u.onTime).length,0),o=r.reduce((h,b)=>h+b.rows.filter(u=>u.delivered>0&&!u.acked).length,0),i=[];t.cost>t.budget&&i.push("over budget by "+(t.cost-t.budget).toFixed(1)+" coins"),n&&i.push(n+" never arrived"),l&&i.push(l+" duplicate"+(l>1?"s":"")),f&&i.push(f+" late"),(!g||g.pass==="proof")&&o&&i.push(o+" without a signed slip");const m=t.kept>=z&&t.cost<=t.budget;return i.length?m&&i.length===1&&o?"All delivered; "+o+" without a signed slip — no S rank.":"Why: "+i.join(" · "):g?r.length!==p?"":g.pass==="proof"?"All delivered; every signed slip returned.":"All delivered once and on time.":r.length===p&&t.signed===p*3&&e.sTarget!==null&&t.cost>e.sTarget+.05?"All delivered and signed; S needs the efficient book at ≤ "+e.sTarget+" coins.":r.length===p&&t.signed===p*3&&e.sTarget===null?"All delivered and signed; no all-proof book fits this day.":r.length===p?"All delivered; every slip made it back.":""}function xe(){const t=e.sim;if(!t)return"";const r=t.plan,n=[];return r.lostBags.length&&n.push(r.lostBags.length+(r.lostBags.length>1?" bags":" bag")+" lost"),r.lostReceipts.length&&n.push(r.lostReceipts.length+(r.lostReceipts.length>1?" slips":" slip")+" lost"),r.delay&&n.push("storm +"+r.delay+" days"),"Situation "+Math.min(e.index+1,p)+": "+(n.length?n.join(" · "):"nothing goes wrong")}function ye(){const t=e.sim;if(!t)return;const r=N();if(g&&!e.started){s("rank").textContent="—",s("rank").className="rank",s("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">ready to run</span>',s("best").textContent="—",s("budgetBar").style.width="0%",s("budgetBar").className="",s("starget").textContent="",s("cost").textContent="— / "+r.budget+" coins",s("cost").className="mono",s("promise").innerHTML="",s("sitnote").textContent="",s("why").textContent="Press “Run route” to watch this stop.",s("why").style.color="var(--dimmer)",s("rows").innerHTML="",ie();return}const n=g?r.kept>=p&&r.cost<=r.budget&&(g.pass!=="proof"||r.signed>=p*3):r.kept>=z&&r.cost<=r.budget,l=r.kept===p&&r.signed===p*3&&e.sTarget!==null&&r.cost<=e.sTarget+.05,f=l?"S":n?"A":r.kept>=z-2?"B":"C";if(s("rank").textContent=f,s("rank").className="rank "+f.toLowerCase(),s("best").textContent=e.best?e.best.kept+"/"+p+" · "+e.best.signed+"s · "+e.best.cost+"c":"—",s("budgetBar").style.width=Math.min(100,r.cost/r.budget*100)+"%",s("budgetBar").className=r.cost>r.budget?"over":"",s("starget").textContent=e.sTarget===null?"S: no all-proof book fits this day":"S: all slips at ≤ "+e.sTarget+" coins",s("starget").style.color=l?"var(--gold)":"var(--dimmer)",r.n===p){const o=r.cost>r.budget?"Over budget":r.kept+" / "+p;s("promiseState").innerHTML='<span class="'+(n?"ok":"bad")+'">'+o+"</span>"}else r.n===0?s("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':s("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+r.kept+" / "+r.n+" so far</span>";s("cost").textContent=(r.n?r.cost:"—")+" / "+r.budget+" coins",s("cost").className="mono"+(r.cost>r.budget?" bad":""),s("promise").innerHTML=g?g.pass==="proof"?"Proof: every letter arrives once, and every signed slip returns within "+t.scenario.deadline+" days.":"Promise: every letter arrives once, within "+t.scenario.deadline+" days.":"Promise: every letter once, within "+t.scenario.deadline+" days. Signed slips are proof; all of them at the efficient price earn an S.",s("sitnote").textContent=xe(),s("why").textContent=he(r),s("why").style.color=l?"var(--green)":n?"var(--amber)":"var(--red)",ie(),s("rows").innerHTML=r.per.map(o=>'<div class="srow"><div class="l"><b>'+o.label+'</b></div><div class="c">'+(r.n?o.ok+"/"+r.n:"—")+'</div><div class="t mono">'+(o.dup?o.dup+" dup":"")+"</div></div>").join("")}function ve(){const t=e.sim;if(!t)return;const r=t.events.filter(l=>!e.focus||l.letter===e.focus),n=s("log");for(let l=e.drawnLog;l<r.length;l++){const f=r[l],o=document.createElement("div");o.className="lrow "+f.kind,o.innerHTML='<span class="lt mono">'+f.t.toFixed(1)+'</span><span class="lx">'+f.text+"</span>",n.appendChild(o)}e.drawnLog=r.length,n.scrollTop=n.scrollHeight}function se(){const t=s("rules");t.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].filter(([r])=>C.includes(r)).map(([r,n])=>{const l=ue[r].map(f=>{const o=r==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[r]===f.id?"on":""} ${o?"off":""}" data-g="${r}" data-o="${f.id}" ${o?"disabled":""} title="${f.note}">
              <div class="row"><span class="nm">${f.label}</span><span class="pr mono">+${f.cost.toFixed(1)}</span></div>
              <div class="note">${o?"Needs a number on the envelope.":f.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${n}</h3>${l}</div>`}).join(""),t.querySelectorAll(".opt").forEach(r=>{r.addEventListener("click",()=>{const n=r.dataset.g;e.rules[n]=r.dataset.o,n==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),se(),c()})})}function J(t){e.day=t;const r=U[t];s("title").innerHTML=(g?.title??r.title)+" <span>· day "+r.day+"  ·  "+p+" situation"+(p===1?"":"s")+"</span>",s("briefBudget").textContent=String(de[t]),s("days").innerHTML=U.map((n,l)=>'<button data-d="'+l+'" class="'+(l===t?"on":"")+'">'+n.day+"</button>").join(""),s("days").querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>J(Number(n.dataset.d)))}),se(),c()}s("sitchips").addEventListener("click",t=>{const r=t.target?.closest?.(".sip");if(!r)return;const n=Number(r.getAttribute("data-i"));Number.isInteger(n)&&M(n)}),s("reset").addEventListener("click",()=>c()),s("run").addEventListener("click",()=>{e.playing||(s("run").disabled=!0,v())}),s("again").addEventListener("click",()=>{g?v():c()}),s("next").addEventListener("click",()=>{e.day<U.length-1&&J(e.day+1)}),E.addEventListener("click",t=>{const r=t.target?.closest?.(".letter");if(!r)return;const n=r.getAttribute("data-letter");e.focus=e.focus===n?null:n,s("log").innerHTML="",e.drawnLog=0,q()}),J(0);const Q=new URLSearchParams(location.search);if(Q.has("tlauto")){const t=Math.max(0,Math.min(U.length-1,Number(Q.get("tlauto"))||0)),r=(Q.get("tl")||"").split(",");J(t),r.length===4&&(e.rules={numbering:r[0],receipts:r[1],retry:r[2],ledger:r[3],route:"direct"},se(),c());const n=Number(Q.get("tlat"));if(n>0){for(;e.sim&&e.sim.now<n;)e.sim.tick(.05);q()}else ge()}return{destroy(){a(),d.innerHTML=""}}};export{Ce as default};
