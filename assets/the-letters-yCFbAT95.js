const we={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},pe={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day retry",cost:.2,note:"Cheap and fixed. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},U=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],J=10,le=[60,75,105,150],ke=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function Ae(A){let v=A>>>0;return function(){v=v+1831565813>>>0;let d=v;return d=Math.imul(d^d>>>15,1|d),d=d+Math.imul(d^d>>>7,61|d)^d,((d^d>>>14)>>>0)/4294967296}}function Z(A,v){const d=ke[A],h=v*2,p=Ae((A+1)*7919+h*104729+17),$=[],S=[];for(let o=1;o<=3;o++)p()<d.sack&&$.push({letter:o,attempt:1}),p()<d.slip&&S.push({letter:o});const R=p()<d.storm?2:0;return{lostBags:$,lostReceipts:S,delay:R}}const Me=[.1,.25,.4],ne=.4,oe=.2,de=.6;function ue(A,v,d,h){return!A.remote||d!=="B"&&h!=="B"?2:v==="relay"?3:4}function V(A,v){const d=pe[A].find(h=>h.id===v);return d?d.cost:0}function ee(A={}){const v=U[A.scenario??0],d={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...A.rules||{}},h=d.ledger==="on"&&d.numbering!=="none",p=A.plan??null,$=p?p.lostBags:v.lostBags,S=p?p.lostReceipts:v.lostReceipts,R=p?.delay??0,o=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(a=>({...a,number:d.numbering==="serial"?`${a.from}-${String(a.seq).padStart(2,"0")}`:d.numbering==="date"?"DAY-"+v.day:null,attempts:[],acked:!1,ackAt:null,slipLost:S.some(c=>c.letter===a.seq)})),E=[],H=[],F=[],I=new Set;let x=0,te=0,t=!1;const M=(a,c,y={})=>{F.push({t:x,kind:a,text:c,...y})};function D(a,c){const y=ue(v,d.route,a.from,a.to)+R,L={id:"a"+ ++te,letterId:a.id,number:a.number,from:a.from,to:a.to,attempt:c,start:x,delivered:!1,status:"moving",deliverAt:x+ne+oe+y+oe+ne,lost:$.some(B=>B.letter===a.seq&&B.attempt===c),lostAt:x+ne+oe+y*.55,flightDays:y};return a.attempts.push(L),E.push(L),M("sent",`${a.label} left the desk${L.number?" ["+L.number+"]":""}`,{letter:a.id,attempt:L.id}),L}function G(a){const c=o.find(y=>y.id===a.letterId);if(h&&a.number&&I.has(a.number)){a.status="dropped",a.endedAt=x,M("dropped",`${a.number} already in the ledger — the copy is dropped`,{letter:a.letterId,attempt:a.id}),d.receipts==="sign"&&(c.ackAt=x+a.flightDays+de);return}h&&a.number&&I.add(a.number),a.status="delivered",a.delivered=!0,a.endedAt=x,H.push({letterId:a.letterId,number:a.number,at:x,attempt:a.id}),M("delivered",`${c.to==="A"?"Alice":c.to==="B"?"Bob":"Carol"} received ${a.number||"a letter"}`,{letter:a.letterId,attempt:a.id}),d.receipts==="sign"&&(c.ackAt=x+a.flightDays+de)}function C(a){if(!t){x+=a;for(const c of E)if(c.status==="moving"){if(c.lost&&x>=c.lostAt){c.status="lost",c.endedAt=x,M("lost",`the bag carrying ${c.number||"a letter"} is gone`,{letter:c.letterId,attempt:c.id});continue}x>=c.deliverAt&&G(c)}for(const c of o)!c.acked&&c.ackAt&&x>=c.ackAt&&(c.slipLost?(c.slipLost=!1,c.ackAt=null,M("lost",`the signed slip for ${c.number||c.label} never arrived`,{letter:c.id})):(c.acked=!0,M("ack",`the signed slip for ${c.number||c.label} reached the sender`,{letter:c.id})));if(d.retry!=="never"&&x>.01){const c=d.retry==="tuned"?2:3;for(const y of o){if(y.acked||y.attempts.length>=c)continue;const L=y.attempts[y.attempts.length-1];if(!L)continue;const B=d.retry==="tuned"?2*L.flightDays+2.6:6.5;x>=L.start+B&&(M("retry",`no slip from ${y.label} — sending again`,{letter:y.id}),D(y,y.attempts.length+1))}}}}function _(){const a=o.map(w=>{const N=H.filter(z=>z.letterId===w.id),j=N.length?Math.min(...N.map(z=>z.at)):null;return{id:w.id,label:w.label,number:w.number,delivered:N.length,first:j,onTime:j!==null&&j<=v.deadline,acked:w.acked,lost:w.attempts.length>0&&w.attempts.every(z=>z.status==="lost")}}),c=a.filter(w=>w.delivered===1).length,y=a.filter(w=>w.delivered===1&&w.onTime).length,L=a.reduce((w,N)=>w+Math.max(0,N.delivered-1),0),B=a.filter(w=>w.delivered===0).length,K=a.filter(w=>w.acked).length,re=o.length*1+o.length*V("numbering",d.numbering)+o.length*V("receipts",d.receipts)+(h?o.length*V("ledger",d.ledger):0)+(d.retry!=="never"?o.length*V("retry",d.retry):0)+(v.remote&&d.route==="direct"?o.length*.5:0)+(E.length-o.length)*1;return{rows:a,exact:c,onTime:y,dupes:L,lost:B,total:o.length,cost:Math.round(re*10)/10,attempts:E.length,promise:y===o.length&&L===0,signed:K,proof:K===o.length}}function O(){for(;x<v.deadline+3;)C(.05);return t=!0,_()}return o.forEach((a,c)=>{x=Me[c],D(a,1)}),x=0,{scenario:v,rules:d,letters:o,attempts:E,deliveries:H,events:F,plan:{lostBags:$,lostReceipts:S,delay:p?.delay??0},get now(){return x},tick:C,summary:_,runAll:O,get done(){return t}}}const ce=new Map;function Le(A){const v=ce.get(A);if(v!==void 0)return v;let d=1/0;const h=["none","date","serial"],p=["never","tuned","quick"];for(const S of h)for(const R of p)for(const o of["off","on"]){if(o==="on"&&S==="none")continue;const E={numbering:S,receipts:"sign",retry:R,ledger:o,route:"direct"};let H=0,F=!0;for(let I=0;I<J;I++){const x=ee({scenario:A,rules:E,plan:Z(A,I)}).runAll();if(!x.promise||!x.proof){F=!1;break}H+=x.cost}F&&(d=Math.min(d,H))}const $=Number.isFinite(d)?Math.round(d*10)/10:null;return ce.set(A,$),$}const Se=`
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
`,Te=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
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
`,$e=(A,v)=>{const d=A.shadowRoot??A.attachShadow({mode:"open"});d.innerHTML="<style>"+Se+"</style>"+Te;const h=v.campaign,p=Math.max(1,Math.min(J,h?.situations??J)),$=h?.ruleGroups??["numbering","receipts","retry","ledger"],S=d.querySelector(".wrap");h&&S.classList.add("campaign"),p===1&&S.classList.add("solo"),$.length||S.classList.add("no-rules");const R=e=>h?Math.min(J-1,(h.morning??0)+e):e,o=e=>d.querySelector("#"+e),E=d.querySelector("#map"),H=d.querySelector("#map-static"),F=d.querySelector("#map-dynamic");let I="";const x={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},te={x:470,y:62},t={day:h?.scenario??0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct",...h?.initialRules??{},...h?.fixedRules??{}},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1,best:null,sTarget:null};let M=0,D=0,G=0;function C(e){return t.sim?.scenario.remote&&e==="B"?te:x[e]}function _(e,r){const s=C(e),l=C(r),f=l.x-s.x,n=l.y-s.y,i=Math.hypot(f,n)||1,g=e==="A"&&r==="C"?-54:42;return{p1:s,p2:l,c:{x:(s.x+l.x)/2-n/i*g,y:(s.y+l.y)/2+f/i*g}}}function O(e,r,s,l){const f=1-l;return{x:f*f*e.x+2*f*l*r.x+l*l*s.x,y:f*f*e.y+2*f*l*r.y+l*l*s.y}}function a(){t.playing=!1,cancelAnimationFrame(M)}function c(){a(),G=0,t.ended=!0,t.single=!1,t.drawnLog=0,t.focus=null,t.index=0,t.days=Array.from({length:p},(e,r)=>ee({scenario:t.day,rules:t.rules,plan:Z(t.day,R(r))})),t.results=t.days.map((e,r)=>ee({scenario:t.day,rules:t.rules,plan:Z(t.day,R(r))}).runAll()),t.sTarget=Le(t.day),t.best=re(),t.best&&(t.sTarget===null||t.best.cost>t.sTarget+.05)&&(t.best=null),w(),t.sim=t.days[0],o("verdict").classList.remove("show"),o("log").innerHTML="",q()}function y(e=!1){if(t.ended&&c(),t.sim&&t.sim.now>=t.sim.scenario.deadline+2&&!e){let r=t.index+1;for(;r<p&&t.results[r];)r++;r<p&&(t.index=r,t.sim=t.days[r],o("log").innerHTML="",t.drawnLog=0,q())}t.playing=!0,t.single=e,D=performance.now(),cancelAnimationFrame(M),M=requestAnimationFrame(B)}function L(e){a(),o("verdict").classList.remove("show"),t.ended=!1,t.single=!1,t.playing=!1,t.index=e,t.days[e]=ee({scenario:t.day,rules:t.rules,plan:Z(t.day,R(e))}),t.sim=t.days[e],o("log").innerHTML="",t.drawnLog=0,q(),y(!0)}function B(e){if(!t.playing||!t.sim)return;if(e<G){M=requestAnimationFrame(B);return}const r=Math.min(.06,(e-D)/1e3);D=e;const s=t.single||t.index===0?2.2:4.2;if(t.sim.tick(r*t.speed*s),t.sim.now>=t.sim.scenario.deadline+2){if(t.results[t.index]=t.sim.summary(),t.single){t.playing=!1,t.single=!1,t.ended=!0,w(),cancelAnimationFrame(M),q();return}if(t.index++,t.results.every(Boolean)||t.index>=p){j();return}for(;t.index<p&&t.results[t.index];)t.index++;if(t.index>=p){j();return}t.sim=t.days[t.index],o("log").innerHTML="",t.drawnLog=0,q(),D=e,G=e+220,M=requestAnimationFrame(B);return}q(),M=requestAnimationFrame(B)}function K(){return"letters:best:"+t.day}function re(){if(h)return null;try{const e=localStorage.getItem(K());if(!e)return null;const r=JSON.parse(e);if(r&&typeof r.kept=="number"&&typeof r.cost=="number")return{kept:r.kept,signed:typeof r.signed=="number"?r.signed:0,cost:r.cost}}catch{}return null}function w(){if(h)return;const e=N();if(t.sTarget===null||e.kept<p||e.signed<p*3||e.cost>t.sTarget+.05)return;const r=t.best;if(!r||e.kept>r.kept||e.kept===r.kept&&e.signed>r.signed||e.kept===r.kept&&e.signed===r.signed&&e.cost<r.cost){t.best={kept:e.kept,signed:e.signed,cost:e.cost};try{localStorage.setItem(K(),JSON.stringify(t.best))}catch{}}}function N(){const e=t.results.filter(i=>!!i),r=e.filter(i=>i.promise).length,s=e.reduce((i,g)=>i+g.signed,0),l=Math.round(e.reduce((i,g)=>i+g.cost,0)*10)/10,f=le[t.day],n=["L1","L2","L3"].map(i=>{const g=t.days[0]?.letters.find(u=>u.id===i)?.label??i;let b=0,m=0;for(const u of e){const k=u.rows.find(T=>T.id===i);k&&k.delivered===1&&b++,k&&(m+=Math.max(0,k.delivered-1))}return{id:i,label:g,ok:b,dup:m}});return{kept:r,signed:s,cost:l,budget:f,per:n,n:e.length}}function j(){a(),t.playing=!1,t.single=!1,t.ended=!0;const e=N(),r=h?e.kept>=p&&e.cost<=e.budget&&(h.pass!=="proof"||e.signed>=p*3):e.kept>=z&&e.cost<=e.budget;o("verdict").classList.add("show");const s=e.cost>e.budget;o("vt").innerHTML=r?'<span class="ok">'+(h?"Objective met":"Good enough")+": "+e.kept+" / "+p+" situations.</span>":s?'<span class="bad">Over budget: '+e.cost+" / "+e.budget+" coins.</span>":'<span class="bad">Not yet: '+e.kept+" / "+p+" situations.</span>";let l=-1,f=99;t.results.forEach((m,u)=>{if(!m)return;const k=m.exact*2-m.dupes;k<f&&(f=k,l=u)});const n=l>=0?t.results[l]:null,i=n?n.rows.slice().sort((m,u)=>u.delivered-m.delivered)[0]:null,g=i&&i.delivered>1?" · worst: situation "+(l+1)+", "+i.delivered+" copies for "+i.label:n&&n.lost>0?" · worst: situation "+(l+1)+", a letter never arrived":" · every letter at most once";o("vs").textContent=e.cost+" / "+e.budget+" coins"+g;const b=o("next");if(b.disabled=t.day>=U.length-1,b.textContent=t.day>=U.length-1?"That is the whole slice":"Next day →",q(),h){const m=h.pass==="proof"?e.signed>=p*3&&r:r;h.onComplete?.({passed:m,detail:m?h.pass==="proof"?"All three letters delivered; all three signed slips returned.":"All three letters delivered once and on time.":s?"Postage exceeded the office budget. Adjust an add-on and run again.":h.pass==="proof"?"The delivery is not proven yet. Return receipts from every letter are still missing.":"The promise is still broken. Check lost, late, or duplicate letters and run again."})}}const z=h?p:Math.ceil(J*.85);function fe(){a(),t.results=t.days.map(e=>e.runAll()),t.index=t.days.length,t.sim=t.days[t.days.length-1],j()}function q(){if(!t.sim)return;ge(),ve(),ye();const e=Math.min(t.index+1,p),r=Math.min(t.sim.now,t.sim.scenario.deadline).toFixed(1);o("clock").textContent="situation "+e+"/"+p+" · day "+r+" / "+t.sim.scenario.deadline}function ge(){const e=t.sim;if(!e)return;const r=[],s=[];for(const[n,i]of[["A","B"],["B","C"],["A","C"]]){const g=_(n,i);r.push(`<path class="route" d="M ${g.p1.x} ${g.p1.y} Q ${g.c.x} ${g.c.y} ${g.p2.x} ${g.p2.y}" />`);const b=O(g.p1,g.c,g.p2,.5),m=ue(e.scenario,e.rules.route,n,i);r.push(`<text class="routelabel" x="${b.x}" y="${b.y-12}" text-anchor="middle">${m} days one-way</text>`)}for(const n of["A","B","C"]){const i=C(n),g=we[n],b=e.deliveries.filter(u=>e.letters.find(k=>k.id===u.letterId).to===n),m=e.scenario.remote&&n==="B";r.push(`<g class="city">
        <circle cx="${i.x}" cy="${i.y}" r="28" fill="#0f141b" stroke="${g.color}" stroke-width="2" />
        <text class="name" x="${i.x}" y="${i.y+44}" text-anchor="middle">${g.friend}</text>
        <text class="place" x="${i.x}" y="${i.y+58}" text-anchor="middle">${m?"the mountains":g.city}</text>
        <g transform="translate(${i.x+30},${i.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),b.slice(0,4).forEach((u,k)=>{s.push(`<g class="stack" transform="translate(${i.x+38+k*13},${i.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${u.number?`<text x="7" y="-4" text-anchor="middle">${u.number}</text>`:""}
        </g>`)})}let l=0;for(const n of e.attempts){if(n.status!=="moving")continue;const i=1.2+n.flightDays,g=Math.max(0,Math.min(1,(e.now-n.start)/i)),b=.6/i,m=(.6+n.flightDays)/i;let u,k=0;if(g<=b)u=C(n.from),u={x:u.x-40-l++%3*7,y:u.y-2};else if(g>=m)u=C(n.to),u={x:u.x+12,y:u.y+34};else{const Y=(g-b)/(m-b),P=_(n.from,n.to);u=O(P.p1,P.c,P.p2,Y);const ie=O(P.p1,P.c,P.p2,Math.min(1,Y+.015));k=Math.max(-20,Math.min(20,Math.atan2(ie.y-u.y,ie.x-u.x)*180/Math.PI)),u.y-=8;for(let X=1;X<=2;X++){const ae=O(P.p1,P.c,P.p2,Math.max(0,Y-X*.03));s.push('<rect x="'+(ae.x-8)+'" y="'+(ae.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/X+'" />')}}const T=t.focus===n.letterId;s.push('<g class="letter '+(T?"focus":"")+'" data-letter="'+n.letterId+'" style="cursor:pointer" transform="translate('+u.x+" "+u.y+") rotate("+k+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(n.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-k+' 0 -11)">'+n.number+"</text>":"")+"</g>")}for(const n of e.letters){const i=e.deliveries.find(T=>T.letterId===n.id);if(!i||e.rules.receipts!=="sign"||!n.ackAt||e.now<i.at||e.now>n.ackAt)continue;const g=(e.now-i.at)/(n.ackAt-i.at),b=e.plan.lostReceipts.some(T=>T.letter===n.seq);if(b&&g>.55)continue;const m=_(n.to,n.from),u=O(m.p1,m.c,m.p2,g),k=b?Math.max(.15,1-Math.max(0,g-.3)/.25):1;s.push('<g transform="translate('+u.x+" "+(u.y-7)+')" opacity="'+k+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const n of e.deliveries){const i=e.now-n.at;if(i<0||i>1.1)continue;const g=e.letters.find(u=>u.id===n.letterId);if(!g)continue;const b=C(g.to),m=i/1.1;s.push('<circle cx="'+b.x+'" cy="'+b.y+'" r="'+(28+36*m)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-m)+'" opacity="'+.5*(1-m)+'" />');for(let u=0;u<6;u++){const k=Math.PI*2*u/6,T=26+30*m;s.push('<circle cx="'+(b.x+Math.cos(k)*T)+'" cy="'+(b.y+Math.sin(k)*T)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-m)+'" />')}}for(const n of e.attempts){if(n.status!=="moving")continue;const i=1.2+n.flightDays,g=(e.now-n.start)/i,b=.6/i,m=.8/i;if(g<b||g>m+.08)continue;const u=C(n.from),T=.75+.25*Math.min(1,(g-b)/(m-b)),Y=g>m?Math.max(0,1-(g-m)/.08):1;s.push('<g transform="translate('+(u.x-26)+" "+(u.y+24)+") scale("+T+')" opacity="'+.9*Y+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const f=e.scenario.day+"|"+e.scenario.remote+"|"+e.rules.route;f!==I&&(H.innerHTML=r.join(""),I=f),F.innerHTML=s.join("")}function me(){const e=o("sitchips");e.children.length!==p&&(e.innerHTML=Array.from({length:p},(s,l)=>'<button class="sip" data-i="'+l+'" title="Situation '+(l+1)+'">'+(l+1)+"</button>").join(""));const r=t.ended?-1:t.index;e.querySelectorAll(".sip").forEach((s,l)=>{const f=t.results[l],n=f?f.promise?f.proof?"ok":"warn":"bad":"";s.className="sip "+[n,l===r?"sel":""].filter(Boolean).join(" "),s.title="Situation "+(l+1)+" — "+he(f)})}function he(e){if(!e)return"not run";if(e.promise&&e.proof)return"delivered · all slips back";if(e.promise)return"delivered · "+e.signed+"/"+e.total+" signed";const r=[];e.lost&&r.push(e.lost+" lost"),e.dupes&&r.push(e.dupes+" duplicate"+(e.dupes>1?"s":""));const s=e.rows.filter(f=>f.delivered===1&&!f.onTime).length;s&&r.push(s+" late");const l=e.rows.filter(f=>!f.acked).length;return l&&r.push(l+" unsigned"),r.length?r.join(" · "):"promise broken"}function be(e){const r=t.results.filter(b=>!!b),s=r.reduce((b,m)=>b+m.lost,0),l=r.reduce((b,m)=>b+m.dupes,0),f=r.reduce((b,m)=>b+m.rows.filter(u=>u.delivered===1&&!u.onTime).length,0),n=r.reduce((b,m)=>b+m.rows.filter(u=>u.delivered>0&&!u.acked).length,0),i=[];e.cost>e.budget&&i.push("over budget by "+(e.cost-e.budget).toFixed(1)+" coins"),s&&i.push(s+" never arrived"),l&&i.push(l+" duplicate"+(l>1?"s":"")),f&&i.push(f+" late"),(!h||h.pass==="proof")&&n&&i.push(n+" without a signed slip");const g=e.kept>=z&&e.cost<=e.budget;return i.length?g&&i.length===1&&n?"All delivered; "+n+" without a signed slip — no S rank.":"Why: "+i.join(" · "):h?r.length!==p?"":h.pass==="proof"?"All delivered; every signed slip returned.":"All delivered once and on time.":r.length===p&&e.signed===p*3&&t.sTarget!==null&&e.cost>t.sTarget+.05?"All delivered and signed; S needs the efficient book at ≤ "+t.sTarget+" coins.":r.length===p&&e.signed===p*3&&t.sTarget===null?"All delivered and signed; no all-proof book fits this day.":r.length===p?"All delivered; every slip made it back.":""}function xe(){const e=t.sim;if(!e)return"";const r=e.plan,s=[];return r.lostBags.length&&s.push(r.lostBags.length+(r.lostBags.length>1?" bags":" bag")+" lost"),r.lostReceipts.length&&s.push(r.lostReceipts.length+(r.lostReceipts.length>1?" slips":" slip")+" lost"),r.delay&&s.push("storm +"+r.delay+" days"),"Situation "+Math.min(t.index+1,p)+": "+(s.length?s.join(" · "):"nothing goes wrong")}function ve(){const e=t.sim;if(!e)return;const r=N(),s=h?r.kept>=p&&r.cost<=r.budget&&(h.pass!=="proof"||r.signed>=p*3):r.kept>=z&&r.cost<=r.budget,l=r.kept===p&&r.signed===p*3&&t.sTarget!==null&&r.cost<=t.sTarget+.05,f=l?"S":s?"A":r.kept>=z-2?"B":"C";if(o("rank").textContent=f,o("rank").className="rank "+f.toLowerCase(),o("best").textContent=t.best?t.best.kept+"/"+p+" · "+t.best.signed+"s · "+t.best.cost+"c":"—",o("budgetBar").style.width=Math.min(100,r.cost/r.budget*100)+"%",o("budgetBar").className=r.cost>r.budget?"over":"",o("starget").textContent=t.sTarget===null?"S: no all-proof book fits this day":"S: all slips at ≤ "+t.sTarget+" coins",o("starget").style.color=l?"var(--gold)":"var(--dimmer)",r.n===p){const n=r.cost>r.budget?"Over budget":r.kept+" / "+p;o("promiseState").innerHTML='<span class="'+(s?"ok":"bad")+'">'+n+"</span>"}else r.n===0?o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+r.kept+" / "+r.n+" so far</span>";o("cost").textContent=(r.n?r.cost:"—")+" / "+r.budget+" coins",o("cost").className="mono"+(r.cost>r.budget?" bad":""),o("promise").innerHTML=h?h.pass==="proof"?"Proof: every letter arrives once, and every signed slip returns within "+e.scenario.deadline+" days.":"Promise: every letter arrives once, within "+e.scenario.deadline+" days.":"Promise: every letter once, within "+e.scenario.deadline+" days. Signed slips are proof; all of them at the efficient price earn an S.",o("sitnote").textContent=xe(),o("why").textContent=be(r),o("why").style.color=l?"var(--green)":s?"var(--amber)":"var(--red)",me(),o("rows").innerHTML=r.per.map(n=>'<div class="srow"><div class="l"><b>'+n.label+'</b></div><div class="c">'+(r.n?n.ok+"/"+r.n:"—")+'</div><div class="t mono">'+(n.dup?n.dup+" dup":"")+"</div></div>").join("")}function ye(){const e=t.sim;if(!e)return;const r=e.events.filter(l=>!t.focus||l.letter===t.focus),s=o("log");for(let l=t.drawnLog;l<r.length;l++){const f=r[l],n=document.createElement("div");n.className="lrow "+f.kind,n.innerHTML='<span class="lt mono">'+f.t.toFixed(1)+'</span><span class="lx">'+f.text+"</span>",s.appendChild(n)}t.drawnLog=r.length,s.scrollTop=s.scrollHeight}function se(){const e=o("rules");e.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].filter(([r])=>$.includes(r)).map(([r,s])=>{const l=pe[r].map(f=>{const n=r==="ledger"&&t.rules.numbering==="none";return`<button class="opt ${t.rules[r]===f.id?"on":""} ${n?"off":""}" data-g="${r}" data-o="${f.id}" ${n?"disabled":""} title="${f.note}">
              <div class="row"><span class="nm">${f.label}</span><span class="pr mono">+${f.cost.toFixed(1)}</span></div>
              <div class="note">${n?"Needs a number on the envelope.":f.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${s}</h3>${l}</div>`}).join(""),e.querySelectorAll(".opt").forEach(r=>{r.addEventListener("click",()=>{const s=r.dataset.g;t.rules[s]=r.dataset.o,s==="numbering"&&t.rules.numbering==="none"&&(t.rules.ledger="off"),se(),c()})})}function W(e){t.day=e;const r=U[e];o("title").innerHTML=(h?.title??r.title)+" <span>· day "+r.day+"  ·  "+p+" situation"+(p===1?"":"s")+"</span>",o("briefBudget").textContent=String(le[e]),o("days").innerHTML=U.map((s,l)=>'<button data-d="'+l+'" class="'+(l===e?"on":"")+'">'+s.day+"</button>").join(""),o("days").querySelectorAll("button").forEach(s=>{s.addEventListener("click",()=>W(Number(s.dataset.d)))}),se(),c()}o("sitchips").addEventListener("click",e=>{const r=e.target?.closest?.(".sip");if(!r)return;const s=Number(r.getAttribute("data-i"));Number.isInteger(s)&&L(s)}),o("reset").addEventListener("click",()=>c()),o("again").addEventListener("click",()=>c()),o("next").addEventListener("click",()=>{t.day<U.length-1&&W(t.day+1)}),E.addEventListener("click",e=>{const r=e.target?.closest?.(".letter");if(!r)return;const s=r.getAttribute("data-letter");t.focus=t.focus===s?null:s,o("log").innerHTML="",t.drawnLog=0,q()}),W(0);const Q=new URLSearchParams(location.search);if(Q.has("tlauto")){const e=Math.max(0,Math.min(U.length-1,Number(Q.get("tlauto"))||0)),r=(Q.get("tl")||"").split(",");W(e),r.length===4&&(t.rules={numbering:r[0],receipts:r[1],retry:r[2],ledger:r[3],route:"direct"},se(),c());const s=Number(Q.get("tlat"));if(s>0){for(;t.sim&&t.sim.now<s;)t.sim.tick(.05);q()}else fe()}return{destroy(){a(),d.innerHTML=""}}};export{$e as default};
