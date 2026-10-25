const ge={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},de={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},F=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],v=10,ae=[60,75,105,150],me=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function be(A){let b=A>>>0;return function(){b=b+1831565813>>>0;let s=b;return s=Math.imul(s^s>>>15,1|s),s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}function te(A,b){const s=me[A],$=b*2,M=be((A+1)*7919+$*104729+17),N=[],R=[];for(let h=1;h<=3;h++)M()<s.sack&&N.push({letter:h,attempt:1}),M()<s.slip&&R.push({letter:h});const j=M()<s.storm?2:0;return{lostBags:N,lostReceipts:R,delay:j}}const he=[.1,.25,.4],re=.4,se=.2,le=.6;function ce(A,b,s,$){return!A.remote||s!=="B"&&$!=="B"?2:b==="relay"?3:4}function V(A,b){const s=de[A].find($=>$.id===b);return s?s.cost:0}function oe(A={}){const b=F[A.scenario??0],s={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...A.rules||{}},$=s.ledger==="on"&&s.numbering!=="none",M=A.plan??null,N=M?M.lostBags:b.lostBags,R=M?M.lostReceipts:b.lostReceipts,j=M?.delay??0,h=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(l=>({...l,number:s.numbering==="serial"?`${l.from}-${String(l.seq).padStart(2,"0")}`:s.numbering==="date"?"DAY-"+b.day:null,attempts:[],acked:!1,ackAt:null,slipLost:R.some(d=>d.letter===l.seq)})),t=[],B=[],q=[],O=new Set;let m=0,U=0,C=!1;const L=(l,d,x={})=>{q.push({t:m,kind:l,text:d,...x})};function E(l,d){const x=ce(b,s.route,l.from,l.to)+j,w={id:"a"+ ++U,letterId:l.id,number:l.number,from:l.from,to:l.to,attempt:d,start:m,delivered:!1,status:"moving",deliverAt:m+re+se+x+se+re,lost:N.some(S=>S.letter===l.seq&&S.attempt===d),lostAt:m+re+se+x*.55,flightDays:x};return l.attempts.push(w),t.push(w),L("sent",`${l.label} left the desk${w.number?" ["+w.number+"]":""}`,{letter:l.id,attempt:w.id}),w}function Z(l){const d=h.find(x=>x.id===l.letterId);if($&&l.number&&O.has(l.number)){l.status="dropped",l.endedAt=m,L("dropped",`${l.number} already in the ledger — the copy is dropped`,{letter:l.letterId,attempt:l.id}),s.receipts==="sign"&&(d.ackAt=m+l.flightDays+le);return}$&&l.number&&O.add(l.number),l.status="delivered",l.delivered=!0,l.endedAt=m,B.push({letterId:l.letterId,number:l.number,at:m,attempt:l.id}),L("delivered",`${d.to==="A"?"Alice":d.to==="B"?"Bob":"Carol"} received ${l.number||"a letter"}`,{letter:l.letterId,attempt:l.id}),s.receipts==="sign"&&(d.ackAt=m+l.flightDays+le)}function G(l){if(!C){m+=l;for(const d of t)if(d.status==="moving"){if(d.lost&&m>=d.lostAt){d.status="lost",d.endedAt=m,L("lost",`the bag carrying ${d.number||"a letter"} is gone`,{letter:d.letterId,attempt:d.id});continue}m>=d.deliverAt&&Z(d)}for(const d of h)!d.acked&&d.ackAt&&m>=d.ackAt&&(d.slipLost?(d.slipLost=!1,d.ackAt=null,L("lost",`the signed slip for ${d.number||d.label} never arrived`,{letter:d.id})):(d.acked=!0,L("ack",`the signed slip for ${d.number||d.label} reached the sender`,{letter:d.id})));if(s.retry!=="never"&&m>.01){const d=s.retry==="tuned"?2:3;for(const x of h){if(x.acked||x.attempts.length>=d)continue;const w=x.attempts[x.attempts.length-1];if(!w)continue;const S=s.retry==="tuned"?2*w.flightDays+2.6:6.5;m>=w.start+S&&(L("retry",`no slip from ${x.label} — sending again`,{letter:x.id}),E(x,x.attempts.length+1))}}}}function H(){const l=h.map(k=>{const P=B.filter(D=>D.letterId===k.id),_=P.length?Math.min(...P.map(D=>D.at)):null;return{id:k.id,label:k.label,number:k.number,delivered:P.length,first:_,onTime:_!==null&&_<=b.deadline,acked:k.acked,lost:k.attempts.length>0&&k.attempts.every(D=>D.status==="lost")}}),d=l.filter(k=>k.delivered===1).length,x=l.filter(k=>k.delivered===1&&k.onTime).length,w=l.reduce((k,P)=>k+Math.max(0,P.delivered-1),0),S=l.filter(k=>k.delivered===0).length,J=l.filter(k=>k.acked).length,z=h.length*1+h.length*V("numbering",s.numbering)+h.length*V("receipts",s.receipts)+($?h.length*V("ledger",s.ledger):0)+(s.retry!=="never"?h.length*V("retry",s.retry):0)+(b.remote&&s.route==="direct"?h.length*.5:0)+(t.length-h.length)*1;return{rows:l,exact:d,onTime:x,dupes:w,lost:S,total:h.length,cost:Math.round(z*10)/10,attempts:t.length,promise:x===h.length&&w===0,signed:J,proof:J===h.length}}function Y(){for(;m<b.deadline+3;)G(.05);return C=!0,H()}return h.forEach((l,d)=>{m=he[d],E(l,1)}),m=0,{scenario:b,rules:s,letters:h,attempts:t,deliveries:B,events:q,plan:{lostBags:N,lostReceipts:R,delay:M?.delay??0},get now(){return m},tick:G,summary:H,runAll:Y,get done(){return C}}}const xe=`
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
`,ve=`
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
    <div class="brief-goal"><b>PASS</b> 9 / 10 delivered within budget · <b>PERFECT</b> all slips back earns an S · best saved per day (<span id="briefBudget">60</span> coins)</div>
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
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 3px"></div>
        <div id="sitnote" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:0 0 3px"></div>
        <div id="why" style="font-size:9.5px;line-height:1.35;margin:0 0 5px;color:var(--dimmer)"></div>
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`,ye=A=>{const b=A.shadowRoot??A.attachShadow({mode:"open"});b.innerHTML="<style>"+xe+"</style>"+ve;const s=e=>b.querySelector("#"+e),$=b.querySelector("#map"),M=b.querySelector("#map-static"),N=b.querySelector("#map-dynamic");let R="";const j={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},h={x:470,y:62},t={day:0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct"},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1,best:null};let B=0,q=0,O=0;function m(e){return t.sim?.scenario.remote&&e==="B"?h:j[e]}function U(e,r){const n=m(e),a=m(r),p=a.x-n.x,o=a.y-n.y,i=Math.hypot(p,o)||1,u=e==="A"&&r==="C"?-54:42;return{p1:n,p2:a,c:{x:(n.x+a.x)/2-o/i*u,y:(n.y+a.y)/2+p/i*u}}}function C(e,r,n,a){const p=1-a;return{x:p*p*e.x+2*p*a*r.x+a*a*n.x,y:p*p*e.y+2*p*a*r.y+a*a*n.y}}function L(){t.playing=!1,cancelAnimationFrame(B)}function E(){L(),O=0,t.ended=!0,t.single=!1,t.drawnLog=0,t.focus=null,t.index=0,t.days=Array.from({length:v},(e,r)=>oe({scenario:t.day,rules:t.rules,plan:te(t.day,r)})),t.results=t.days.map((e,r)=>oe({scenario:t.day,rules:t.rules,plan:te(t.day,r)}).runAll()),t.best=l(),d(),t.sim=t.days[0],s("verdict").classList.remove("show"),s("log").innerHTML="",z()}function Z(e=!1){if(t.ended&&E(),t.sim&&t.sim.now>=t.sim.scenario.deadline+2&&!e){let r=t.index+1;for(;r<v&&t.results[r];)r++;r<v&&(t.index=r,t.sim=t.days[r],s("log").innerHTML="",t.drawnLog=0,z())}t.playing=!0,t.single=e,q=performance.now(),cancelAnimationFrame(B),B=requestAnimationFrame(H)}function G(e){L(),s("verdict").classList.remove("show"),t.ended=!1,t.single=!1,t.playing=!1,t.index=e,t.days[e]=oe({scenario:t.day,rules:t.rules,plan:te(t.day,e)}),t.sim=t.days[e],s("log").innerHTML="",t.drawnLog=0,z(),Z(!0)}function H(e){if(!t.playing||!t.sim)return;if(e<O){B=requestAnimationFrame(H);return}const r=Math.min(.06,(e-q)/1e3);q=e;const n=t.single||t.index===0?2.2:4.2;if(t.sim.tick(r*t.speed*n),t.sim.now>=t.sim.scenario.deadline+2){if(t.results[t.index]=t.sim.summary(),t.single){t.playing=!1,t.single=!1,t.ended=!0,d(),cancelAnimationFrame(B),z();return}if(t.index++,t.results.every(Boolean)||t.index>=v){w();return}for(;t.index<v&&t.results[t.index];)t.index++;if(t.index>=v){w();return}t.sim=t.days[t.index],s("log").innerHTML="",t.drawnLog=0,z(),q=e,O=e+220,B=requestAnimationFrame(H);return}z(),B=requestAnimationFrame(H)}function Y(){return"letters:best:"+t.day}function l(){try{const e=localStorage.getItem(Y());if(!e)return null;const r=JSON.parse(e);if(r&&typeof r.kept=="number"&&typeof r.cost=="number")return{kept:r.kept,signed:typeof r.signed=="number"?r.signed:0,cost:r.cost}}catch{}return null}function d(){const e=x();if(e.kept<S||e.cost>e.budget)return;const r=t.best;if(!r||e.kept>r.kept||e.kept===r.kept&&e.signed>r.signed||e.kept===r.kept&&e.signed===r.signed&&e.cost<r.cost){t.best={kept:e.kept,signed:e.signed,cost:e.cost};try{localStorage.setItem(Y(),JSON.stringify(t.best))}catch{}}}function x(){const e=t.results.filter(i=>!!i),r=e.filter(i=>i.promise).length,n=e.reduce((i,u)=>i+u.signed,0),a=Math.round(e.reduce((i,u)=>i+u.cost,0)*10)/10,p=ae[t.day],o=["L1","L2","L3"].map(i=>{const u=t.days[0]?.letters.find(c=>c.id===i)?.label??i;let g=0,f=0;for(const c of e){const y=c.rows.find(T=>T.id===i);y&&y.delivered===1&&g++,y&&(f+=Math.max(0,y.delivered-1))}return{id:i,label:u,ok:g,dup:f}});return{kept:r,signed:n,cost:a,budget:p,per:o,n:e.length}}function w(){L(),t.playing=!1,t.single=!1,t.ended=!0;const e=x(),r=e.kept>=S&&e.cost<=e.budget;s("verdict").classList.add("show");const n=e.cost>e.budget;s("vt").innerHTML=r?'<span class="ok">Good enough: '+e.kept+" / "+v+" situations.</span>":n?'<span class="bad">Over budget: '+e.cost+" / "+e.budget+" coins.</span>":'<span class="bad">Not yet: '+e.kept+" / "+v+" situations.</span>";let a=-1,p=99;t.results.forEach((f,c)=>{if(!f)return;const y=f.exact*2-f.dupes;y<p&&(p=y,a=c)});const o=a>=0?t.results[a]:null,i=o?o.rows.slice().sort((f,c)=>c.delivered-f.delivered)[0]:null,u=i&&i.delivered>1?" · worst: situation "+(a+1)+", "+i.delivered+" copies for "+i.label:o&&o.lost>0?" · worst: situation "+(a+1)+", a letter never arrived":" · every letter at most once";s("vs").textContent=e.cost+" / "+e.budget+" coins"+u;const g=s("next");g.disabled=t.day>=F.length-1,g.textContent=t.day>=F.length-1?"That is the whole slice":"Next day →",z()}const S=Math.ceil(v*.85);function J(){L(),t.results=t.days.map(e=>e.runAll()),t.index=t.days.length,t.sim=t.days[t.days.length-1],w()}function z(){if(!t.sim)return;k(),ue(),fe();const e=Math.min(t.index+1,v),r=Math.min(t.sim.now,t.sim.scenario.deadline).toFixed(1);s("clock").textContent="situation "+e+"/"+v+" · day "+r+" / "+t.sim.scenario.deadline}function k(){const e=t.sim;if(!e)return;const r=[],n=[];for(const[o,i]of[["A","B"],["B","C"],["A","C"]]){const u=U(o,i);r.push(`<path class="route" d="M ${u.p1.x} ${u.p1.y} Q ${u.c.x} ${u.c.y} ${u.p2.x} ${u.p2.y}" />`);const g=C(u.p1,u.c,u.p2,.5),f=ce(e.scenario,e.rules.route,o,i);r.push(`<text class="routelabel" x="${g.x}" y="${g.y-12}" text-anchor="middle">${f} days one-way</text>`)}for(const o of["A","B","C"]){const i=m(o),u=ge[o],g=e.deliveries.filter(c=>e.letters.find(y=>y.id===c.letterId).to===o),f=e.scenario.remote&&o==="B";r.push(`<g class="city">
        <circle cx="${i.x}" cy="${i.y}" r="28" fill="#0f141b" stroke="${u.color}" stroke-width="2" />
        <text class="name" x="${i.x}" y="${i.y+44}" text-anchor="middle">${u.friend}</text>
        <text class="place" x="${i.x}" y="${i.y+58}" text-anchor="middle">${f?"the mountains":u.city}</text>
        <g transform="translate(${i.x+30},${i.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),g.slice(0,4).forEach((c,y)=>{n.push(`<g class="stack" transform="translate(${i.x+38+y*13},${i.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${c.number?`<text x="7" y="-4" text-anchor="middle">${c.number}</text>`:""}
        </g>`)})}let a=0;for(const o of e.attempts){if(o.status!=="moving")continue;const i=1.2+o.flightDays,u=Math.max(0,Math.min(1,(e.now-o.start)/i)),g=.6/i,f=(.6+o.flightDays)/i;let c,y=0;if(u<=g)c=m(o.from),c={x:c.x-40-a++%3*7,y:c.y-2};else if(u>=f)c=m(o.to),c={x:c.x+12,y:c.y+34};else{const K=(u-g)/(f-g),I=U(o.from,o.to);c=C(I.p1,I.c,I.p2,K);const ne=C(I.p1,I.c,I.p2,Math.min(1,K+.015));y=Math.max(-20,Math.min(20,Math.atan2(ne.y-c.y,ne.x-c.x)*180/Math.PI)),c.y-=8;for(let X=1;X<=2;X++){const ie=C(I.p1,I.c,I.p2,Math.max(0,K-X*.03));n.push('<rect x="'+(ie.x-8)+'" y="'+(ie.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/X+'" />')}}const T=t.focus===o.letterId;n.push('<g class="letter '+(T?"focus":"")+'" data-letter="'+o.letterId+'" style="cursor:pointer" transform="translate('+c.x+" "+c.y+") rotate("+y+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(o.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-y+' 0 -11)">'+o.number+"</text>":"")+"</g>")}for(const o of e.letters){const i=e.deliveries.find(T=>T.letterId===o.id);if(!i||e.rules.receipts!=="sign"||!o.ackAt||e.now<i.at||e.now>o.ackAt)continue;const u=(e.now-i.at)/(o.ackAt-i.at),g=e.plan.lostReceipts.some(T=>T.letter===o.seq);if(g&&u>.55)continue;const f=U(o.to,o.from),c=C(f.p1,f.c,f.p2,u),y=g?Math.max(.15,1-Math.max(0,u-.3)/.25):1;n.push('<g transform="translate('+c.x+" "+(c.y-7)+')" opacity="'+y+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const o of e.deliveries){const i=e.now-o.at;if(i<0||i>1.1)continue;const u=e.letters.find(c=>c.id===o.letterId);if(!u)continue;const g=m(u.to),f=i/1.1;n.push('<circle cx="'+g.x+'" cy="'+g.y+'" r="'+(28+36*f)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-f)+'" opacity="'+.5*(1-f)+'" />');for(let c=0;c<6;c++){const y=Math.PI*2*c/6,T=26+30*f;n.push('<circle cx="'+(g.x+Math.cos(y)*T)+'" cy="'+(g.y+Math.sin(y)*T)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-f)+'" />')}}for(const o of e.attempts){if(o.status!=="moving")continue;const i=1.2+o.flightDays,u=(e.now-o.start)/i,g=.6/i,f=.8/i;if(u<g||u>f+.08)continue;const c=m(o.from),T=.75+.25*Math.min(1,(u-g)/(f-g)),K=u>f?Math.max(0,1-(u-f)/.08):1;n.push('<g transform="translate('+(c.x-26)+" "+(c.y+24)+") scale("+T+')" opacity="'+.9*K+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const p=e.scenario.day+"|"+e.scenario.remote+"|"+e.rules.route;p!==R&&(M.innerHTML=r.join(""),R=p),N.innerHTML=n.join("")}function P(){const e=s("sitchips");e.children.length!==v&&(e.innerHTML=Array.from({length:v},(n,a)=>'<button class="sip" data-i="'+a+'" title="Situation '+(a+1)+'">'+(a+1)+"</button>").join(""));const r=t.ended?-1:t.index;e.querySelectorAll(".sip").forEach((n,a)=>{const p=t.results[a],o=p?p.promise?p.proof?"ok":"warn":"bad":"";n.className="sip "+[o,a===r?"sel":""].filter(Boolean).join(" "),n.title="Situation "+(a+1)+" — "+_(p)})}function _(e){if(!e)return"not run";if(e.promise&&e.proof)return"delivered · all slips back";if(e.promise)return"delivered · "+e.signed+"/"+e.total+" signed";const r=[];e.lost&&r.push(e.lost+" lost"),e.dupes&&r.push(e.dupes+" duplicate"+(e.dupes>1?"s":""));const n=e.rows.filter(p=>p.delivered===1&&!p.onTime).length;n&&r.push(n+" late");const a=e.rows.filter(p=>!p.acked).length;return a&&r.push(a+" unsigned"),r.length?r.join(" · "):"promise broken"}function D(e){const r=t.results.filter(g=>!!g),n=r.reduce((g,f)=>g+f.lost,0),a=r.reduce((g,f)=>g+f.dupes,0),p=r.reduce((g,f)=>g+f.rows.filter(c=>c.delivered===1&&!c.onTime).length,0),o=r.reduce((g,f)=>g+f.rows.filter(c=>c.delivered>0&&!c.acked).length,0),i=[];e.cost>e.budget&&i.push("over budget by "+(e.cost-e.budget).toFixed(1)+" coins"),n&&i.push(n+" never arrived"),a&&i.push(a+" duplicate"+(a>1?"s":"")),p&&i.push(p+" late"),o&&i.push(o+" without a signed slip");const u=e.kept>=S&&e.cost<=e.budget;return i.length?u&&i.length===1&&o?"All delivered; "+o+" without a signed slip — no S rank.":"Why: "+i.join(" · "):r.length===v?"All delivered; every slip made it back.":""}function pe(){const e=t.sim;if(!e)return"";const r=e.plan,n=[];return r.lostBags.length&&n.push(r.lostBags.length+(r.lostBags.length>1?" bags":" bag")+" lost"),r.lostReceipts.length&&n.push(r.lostReceipts.length+(r.lostReceipts.length>1?" slips":" slip")+" lost"),r.delay&&n.push("storm +"+r.delay+" days"),"Situation "+Math.min(t.index+1,v)+": "+(n.length?n.join(" · "):"nothing goes wrong")}function ue(){const e=t.sim;if(!e)return;const r=x(),n=r.kept>=S&&r.cost<=r.budget,a=r.kept===v&&r.signed===v*3&&r.cost<=r.budget,p=a?"S":n?"A":r.kept>=S-2?"B":"C";if(s("rank").textContent=p,s("rank").className="rank "+p.toLowerCase(),s("best").textContent=t.best?t.best.kept+"/"+v+" · "+t.best.signed+"s · "+t.best.cost+"c":"—",s("budgetBar").style.width=Math.min(100,r.cost/r.budget*100)+"%",s("budgetBar").className=r.cost>r.budget?"over":"",r.n===v){const o=r.cost>r.budget?"Over budget":r.kept+" / "+v;s("promiseState").innerHTML='<span class="'+(n?"ok":"bad")+'">'+o+"</span>"}else r.n===0?s("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':s("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+r.kept+" / "+r.n+" so far</span>";s("cost").textContent=(r.n?r.cost:"—")+" / "+r.budget+" coins",s("cost").className="mono"+(r.cost>r.budget?" bad":""),s("promise").innerHTML="Promise: every letter once, within "+e.scenario.deadline+" days. Signed slips are proof; all of them earn an S.",s("sitnote").textContent=pe(),s("why").textContent=D(r),s("why").style.color=a?"var(--green)":n?r.signed<v*3?"var(--amber)":"var(--green)":"var(--red)",P(),s("rows").innerHTML=r.per.map(o=>'<div class="srow"><div class="l"><b>'+o.label+'</b></div><div class="c">'+(r.n?o.ok+"/"+r.n:"—")+'</div><div class="t mono">'+(o.dup?o.dup+" dup":"")+"</div></div>").join("")}function fe(){const e=t.sim;if(!e)return;const r=e.events.filter(a=>!t.focus||a.letter===t.focus),n=s("log");for(let a=t.drawnLog;a<r.length;a++){const p=r[a],o=document.createElement("div");o.className="lrow "+p.kind,o.innerHTML='<span class="lt mono">'+p.t.toFixed(1)+'</span><span class="lx">'+p.text+"</span>",n.appendChild(o)}t.drawnLog=r.length,n.scrollTop=n.scrollHeight}function ee(){const e=s("rules");e.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([r,n])=>{const a=de[r].map(p=>{const o=r==="ledger"&&t.rules.numbering==="none";return`<button class="opt ${t.rules[r]===p.id?"on":""} ${o?"off":""}" data-g="${r}" data-o="${p.id}" ${o?"disabled":""} title="${p.note}">
              <div class="row"><span class="nm">${p.label}</span><span class="pr mono">+${p.cost.toFixed(1)}</span></div>
              <div class="note">${o?"Needs a number on the envelope.":p.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${n}</h3>${a}</div>`}).join(""),e.querySelectorAll(".opt").forEach(r=>{r.addEventListener("click",()=>{const n=r.dataset.g;t.rules[n]=r.dataset.o,n==="numbering"&&t.rules.numbering==="none"&&(t.rules.ledger="off"),ee(),E()})})}function W(e){t.day=e;const r=F[e];s("title").innerHTML=r.title+" <span>· day "+r.day+"  ·  "+v+" situations</span>",s("briefBudget").textContent=String(ae[e]),s("days").innerHTML=F.map((n,a)=>'<button data-d="'+a+'" class="'+(a===e?"on":"")+'">'+n.day+"</button>").join(""),s("days").querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>W(Number(n.dataset.d)))}),ee(),E()}s("sitchips").addEventListener("click",e=>{const r=e.target?.closest?.(".sip");if(!r)return;const n=Number(r.getAttribute("data-i"));Number.isInteger(n)&&G(n)}),s("reset").addEventListener("click",()=>E()),s("again").addEventListener("click",()=>E()),s("next").addEventListener("click",()=>{t.day<F.length-1&&W(t.day+1)}),$.addEventListener("click",e=>{const r=e.target?.closest?.(".letter");if(!r)return;const n=r.getAttribute("data-letter");t.focus=t.focus===n?null:n,s("log").innerHTML="",t.drawnLog=0,z()}),W(0);const Q=new URLSearchParams(location.search);if(Q.has("tlauto")){const e=Math.max(0,Math.min(F.length-1,Number(Q.get("tlauto"))||0)),r=(Q.get("tl")||"").split(",");W(e),r.length===4&&(t.rules={numbering:r[0],receipts:r[1],retry:r[2],ledger:r[3],route:"direct"},ee(),E());const n=Number(Q.get("tlat"));if(n>0){for(;t.sim&&t.sim.now<n;)t.sim.tick(.05);z()}else J()}return{destroy(){L(),b.innerHTML=""}}};export{ye as default};
