const ge={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},le={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},D=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],v=10,ie=[60,75,105,150],me=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function be(A){let h=A>>>0;return function(){h=h+1831565813>>>0;let o=h;return o=Math.imul(o^o>>>15,1|o),o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function ee(A,h){const o=me[A],T=h*2,S=be((A+1)*7919+T*104729+17),R=[],I=[];for(let y=1;y<=3;y++)S()<o.sack&&R.push({letter:y,attempt:1}),S()<o.slip&&I.push({letter:y});const O=S()<o.storm?2:0;return{lostBags:R,lostReceipts:I,delay:O}}const he=[.1,.25,.4],te=.4,se=.2,ae=.6;function de(A,h,o,T){return!A.remote||o!=="B"&&T!=="B"?2:h==="relay"?3:4}function Q(A,h){const o=le[A].find(T=>T.id===h);return o?o.cost:0}function oe(A={}){const h=D[A.scenario??0],o={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...A.rules||{}},T=o.ledger==="on"&&o.numbering!=="none",S=A.plan??null,R=S?S.lostBags:h.lostBags,I=S?S.lostReceipts:h.lostReceipts,O=S?.delay??0,y=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(a=>({...a,number:o.numbering==="serial"?`${a.from}-${String(a.seq).padStart(2,"0")}`:o.numbering==="date"?"DAY-"+h.day:null,attempts:[],acked:!1,ackAt:null,slipLost:I.some(c=>c.letter===a.seq)})),e=[],$=[],N=[],F=new Set;let m=0,j=0,z=!1;const L=(a,c,x={})=>{N.push({t:m,kind:a,text:c,...x})};function C(a,c){const x=de(h,o.route,a.from,a.to)+O,w={id:"a"+ ++j,letterId:a.id,number:a.number,from:a.from,to:a.to,attempt:c,start:m,delivered:!1,status:"moving",deliverAt:m+te+se+x+se+te,lost:R.some(M=>M.letter===a.seq&&M.attempt===c),lostAt:m+te+se+x*.55,flightDays:x};return a.attempts.push(w),e.push(w),L("sent",`${a.label} left the desk${w.number?" ["+w.number+"]":""}`,{letter:a.id,attempt:w.id}),w}function X(a){const c=y.find(x=>x.id===a.letterId);if(T&&a.number&&F.has(a.number)){a.status="dropped",a.endedAt=m,L("dropped",`${a.number} already in the ledger — the copy is dropped`,{letter:a.letterId,attempt:a.id}),o.receipts==="sign"&&(c.ackAt=m+a.flightDays+ae);return}T&&a.number&&F.add(a.number),a.status="delivered",a.delivered=!0,a.endedAt=m,$.push({letterId:a.letterId,number:a.number,at:m,attempt:a.id}),L("delivered",`${c.to==="A"?"Alice":c.to==="B"?"Bob":"Carol"} received ${a.number||"a letter"}`,{letter:a.letterId,attempt:a.id}),o.receipts==="sign"&&(c.ackAt=m+a.flightDays+ae)}function K(a){if(!z){m+=a;for(const c of e)if(c.status==="moving"){if(c.lost&&m>=c.lostAt){c.status="lost",c.endedAt=m,L("lost",`the bag carrying ${c.number||"a letter"} is gone`,{letter:c.letterId,attempt:c.id});continue}m>=c.deliverAt&&X(c)}for(const c of y)!c.acked&&c.ackAt&&m>=c.ackAt&&(c.slipLost?(c.slipLost=!1,c.ackAt=null,L("lost",`the signed slip for ${c.number||c.label} never arrived`,{letter:c.id})):(c.acked=!0,L("ack",`the signed slip for ${c.number||c.label} reached the sender`,{letter:c.id})));if(o.retry!=="never"&&m>.01){const c=o.retry==="tuned"?2:3;for(const x of y){if(x.acked||x.attempts.length>=c)continue;const w=x.attempts[x.attempts.length-1];if(!w)continue;const M=o.retry==="tuned"?2*w.flightDays+2.6:6.5;m>=w.start+M&&(L("retry",`no slip from ${x.label} — sending again`,{letter:x.id}),C(x,x.attempts.length+1))}}}}function q(){const a=y.map(b=>{const H=$.filter(P=>P.letterId===b.id),U=H.length?Math.min(...H.map(P=>P.at)):null;return{id:b.id,label:b.label,number:b.number,delivered:H.length,first:U,onTime:U!==null&&U<=h.deadline,acked:b.acked,lost:b.attempts.length>0&&b.attempts.every(P=>P.status==="lost")}}),c=a.filter(b=>b.delivered===1).length,x=a.filter(b=>b.delivered===1&&b.onTime).length,w=a.reduce((b,H)=>b+Math.max(0,H.delivered-1),0),M=a.filter(b=>b.delivered===0).length,V=y.length*1+y.length*Q("numbering",o.numbering)+y.length*Q("receipts",o.receipts)+(T?y.length*Q("ledger",o.ledger):0)+(o.retry!=="never"?y.length*Q("retry",o.retry):0)+(h.remote&&o.route==="direct"?y.length*.5:0)+(e.length-y.length)*1;return{rows:a,exact:c,onTime:x,dupes:w,lost:M,total:y.length,cost:Math.round(V*10)/10,attempts:e.length,promise:x===y.length&&w===0&&a.every(b=>b.acked)}}function G(){for(;m<h.deadline+3;)K(.05);return z=!0,q()}return y.forEach((a,c)=>{m=he[c],C(a,1)}),m=0,{scenario:h,rules:o,letters:y,attempts:e,deliveries:$,events:N,plan:{lostBags:R,lostReceipts:I,delay:S?.delay??0},get now(){return m},tick:K,summary:q,runAll:G,get done(){return z}}}const xe=`
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
`,ye=`
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
    <div class="brief-copy">Deliver every letter once, on time, with a signed slip — across ten independent weather worlds. Pick the post-office add-ons; postage comes out of a fixed budget. Click a red result to replay its failure.</div>
    <div class="brief-goal"><b>PASS</b> 9 / 10 kept and within budget · <b>PERFECT</b> 10 / 10 earns an S · best saved per day (<span id="briefBudget">60</span> coins)</div>
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
    <span class="rail-hint">click any result to replay · red = broken</span>
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
`,ve=A=>{const h=A.shadowRoot??A.attachShadow({mode:"open"});h.innerHTML="<style>"+xe+"</style>"+ye;const o=s=>h.querySelector("#"+s),T=h.querySelector("#map"),S=h.querySelector("#map-static"),R=h.querySelector("#map-dynamic");let I="";const O={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},y={x:470,y:62},e={day:0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct"},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1,best:null};let $=0,N=0,F=0;function m(s){return e.sim?.scenario.remote&&s==="B"?y:O[s]}function j(s,t){const n=m(s),l=m(t),p=l.x-n.x,r=l.y-n.y,i=Math.hypot(p,r)||1,d=s==="A"&&t==="C"?-54:42;return{p1:n,p2:l,c:{x:(n.x+l.x)/2-r/i*d,y:(n.y+l.y)/2+p/i*d}}}function z(s,t,n,l){const p=1-l;return{x:p*p*s.x+2*p*l*t.x+l*l*n.x,y:p*p*s.y+2*p*l*t.y+l*l*n.y}}function L(){e.playing=!1,cancelAnimationFrame($)}function C(){L(),F=0,e.ended=!0,e.single=!1,e.drawnLog=0,e.focus=null,e.index=0,e.days=Array.from({length:v},(s,t)=>oe({scenario:e.day,rules:e.rules,plan:ee(e.day,t)})),e.results=e.days.map((s,t)=>oe({scenario:e.day,rules:e.rules,plan:ee(e.day,t)}).runAll()),e.best=a(),c(),e.sim=e.days[0],o("verdict").classList.remove("show"),o("log").innerHTML="",b()}function X(s=!1){if(e.ended&&C(),e.sim&&e.sim.now>=e.sim.scenario.deadline+2&&!s){let t=e.index+1;for(;t<v&&e.results[t];)t++;t<v&&(e.index=t,e.sim=e.days[t],o("log").innerHTML="",e.drawnLog=0,b())}e.playing=!0,e.single=s,N=performance.now(),cancelAnimationFrame($),$=requestAnimationFrame(q)}function K(s){L(),o("verdict").classList.remove("show"),e.ended=!1,e.single=!1,e.playing=!1,e.index=s,e.days[s]=oe({scenario:e.day,rules:e.rules,plan:ee(e.day,s)}),e.sim=e.days[s],o("log").innerHTML="",e.drawnLog=0,b(),X(!0)}function q(s){if(!e.playing||!e.sim)return;if(s<F){$=requestAnimationFrame(q);return}const t=Math.min(.06,(s-N)/1e3);N=s;const n=e.single||e.index===0?2.2:4.2;if(e.sim.tick(t*e.speed*n),e.sim.now>=e.sim.scenario.deadline+2){if(e.results[e.index]=e.sim.summary(),e.single){e.playing=!1,e.single=!1,e.ended=!0,c(),cancelAnimationFrame($),b();return}if(e.index++,e.results.every(Boolean)||e.index>=v){w();return}for(;e.index<v&&e.results[e.index];)e.index++;if(e.index>=v){w();return}e.sim=e.days[e.index],o("log").innerHTML="",e.drawnLog=0,b(),N=s,F=s+220,$=requestAnimationFrame(q);return}b(),$=requestAnimationFrame(q)}function G(){return"letters:best:"+e.day}function a(){try{const s=localStorage.getItem(G());if(!s)return null;const t=JSON.parse(s);if(t&&typeof t.kept=="number"&&typeof t.cost=="number")return t}catch{}return null}function c(){const s=x();if(s.kept<M||s.cost>s.budget)return;const t=e.best;if(!t||s.kept>t.kept||s.kept===t.kept&&s.cost<t.cost){e.best={kept:s.kept,cost:s.cost};try{localStorage.setItem(G(),JSON.stringify(e.best))}catch{}}}function x(){const s=e.results.filter(r=>!!r),t=s.filter(r=>r.promise).length,n=Math.round(s.reduce((r,i)=>r+i.cost,0)*10)/10,l=ie[e.day],p=["L1","L2","L3"].map(r=>{const i=e.days[0]?.letters.find(f=>f.id===r)?.label??r;let d=0,g=0;for(const f of s){const u=f.rows.find(k=>k.id===r);u&&u.delivered===1&&d++,u&&(g+=Math.max(0,u.delivered-1))}return{id:r,label:i,ok:d,dup:g}});return{kept:t,cost:n,budget:l,per:p,n:s.length}}function w(){L(),e.playing=!1,e.single=!1,e.ended=!0;const s=x(),t=s.kept>=M&&s.cost<=s.budget;o("verdict").classList.add("show");const n=s.cost>s.budget;o("vt").innerHTML=t?'<span class="ok">Good enough: '+s.kept+" / "+v+" situations.</span>":n?'<span class="bad">Over budget: '+s.cost+" / "+s.budget+" coins.</span>":'<span class="bad">Not yet: '+s.kept+" / "+v+" situations.</span>";let l=-1,p=99;e.results.forEach((f,u)=>{if(!f)return;const k=f.exact*2-f.dupes;k<p&&(p=k,l=u)});const r=l>=0?e.results[l]:null,i=r?r.rows.slice().sort((f,u)=>u.delivered-f.delivered)[0]:null,d=i&&i.delivered>1?" · worst: situation "+(l+1)+", "+i.delivered+" copies for "+i.label:r&&r.lost>0?" · worst: situation "+(l+1)+", a letter never arrived":" · every letter at most once";o("vs").textContent=s.cost+" / "+s.budget+" coins"+d;const g=o("next");g.disabled=e.day>=D.length-1,g.textContent=e.day>=D.length-1?"That is the whole slice":"Next day →",b()}const M=Math.ceil(v*.85);function V(){L(),e.results=e.days.map(s=>s.runAll()),e.index=e.days.length,e.sim=e.days[e.days.length-1],w()}function b(){if(!e.sim)return;H(),ue(),fe();const s=Math.min(e.index+1,v),t=Math.min(e.sim.now,e.sim.scenario.deadline).toFixed(1);o("clock").textContent="situation "+s+"/"+v+" · day "+t+" / "+e.sim.scenario.deadline}function H(){const s=e.sim;if(!s)return;const t=[],n=[];for(const[r,i]of[["A","B"],["B","C"],["A","C"]]){const d=j(r,i);t.push(`<path class="route" d="M ${d.p1.x} ${d.p1.y} Q ${d.c.x} ${d.c.y} ${d.p2.x} ${d.p2.y}" />`);const g=z(d.p1,d.c,d.p2,.5),f=de(s.scenario,s.rules.route,r,i);t.push(`<text class="routelabel" x="${g.x}" y="${g.y-12}" text-anchor="middle">${f} days one-way</text>`)}for(const r of["A","B","C"]){const i=m(r),d=ge[r],g=s.deliveries.filter(u=>s.letters.find(k=>k.id===u.letterId).to===r),f=s.scenario.remote&&r==="B";t.push(`<g class="city">
        <circle cx="${i.x}" cy="${i.y}" r="28" fill="#0f141b" stroke="${d.color}" stroke-width="2" />
        <text class="name" x="${i.x}" y="${i.y+44}" text-anchor="middle">${d.friend}</text>
        <text class="place" x="${i.x}" y="${i.y+58}" text-anchor="middle">${f?"the mountains":d.city}</text>
        <g transform="translate(${i.x+30},${i.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),g.slice(0,4).forEach((u,k)=>{n.push(`<g class="stack" transform="translate(${i.x+38+k*13},${i.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${u.number?`<text x="7" y="-4" text-anchor="middle">${u.number}</text>`:""}
        </g>`)})}let l=0;for(const r of s.attempts){if(r.status!=="moving")continue;const i=1.2+r.flightDays,d=Math.max(0,Math.min(1,(s.now-r.start)/i)),g=.6/i,f=(.6+r.flightDays)/i;let u,k=0;if(d<=g)u=m(r.from),u={x:u.x-40-l++%3*7,y:u.y-2};else if(d>=f)u=m(r.to),u={x:u.x+12,y:u.y+34};else{const _=(d-g)/(f-g),E=j(r.from,r.to);u=z(E.p1,E.c,E.p2,_);const re=z(E.p1,E.c,E.p2,Math.min(1,_+.015));k=Math.max(-20,Math.min(20,Math.atan2(re.y-u.y,re.x-u.x)*180/Math.PI)),u.y-=8;for(let W=1;W<=2;W++){const ne=z(E.p1,E.c,E.p2,Math.max(0,_-W*.03));n.push('<rect x="'+(ne.x-8)+'" y="'+(ne.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/W+'" />')}}const B=e.focus===r.letterId;n.push('<g class="letter '+(B?"focus":"")+'" data-letter="'+r.letterId+'" style="cursor:pointer" transform="translate('+u.x+" "+u.y+") rotate("+k+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(r.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-k+' 0 -11)">'+r.number+"</text>":"")+"</g>")}for(const r of s.letters){const i=s.deliveries.find(B=>B.letterId===r.id);if(!i||s.rules.receipts!=="sign"||!r.ackAt||s.now<i.at||s.now>r.ackAt)continue;const d=(s.now-i.at)/(r.ackAt-i.at),g=s.plan.lostReceipts.some(B=>B.letter===r.seq);if(g&&d>.55)continue;const f=j(r.to,r.from),u=z(f.p1,f.c,f.p2,d),k=g?Math.max(.15,1-Math.max(0,d-.3)/.25):1;n.push('<g transform="translate('+u.x+" "+(u.y-7)+')" opacity="'+k+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const r of s.deliveries){const i=s.now-r.at;if(i<0||i>1.1)continue;const d=s.letters.find(u=>u.id===r.letterId);if(!d)continue;const g=m(d.to),f=i/1.1;n.push('<circle cx="'+g.x+'" cy="'+g.y+'" r="'+(28+36*f)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-f)+'" opacity="'+.5*(1-f)+'" />');for(let u=0;u<6;u++){const k=Math.PI*2*u/6,B=26+30*f;n.push('<circle cx="'+(g.x+Math.cos(k)*B)+'" cy="'+(g.y+Math.sin(k)*B)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-f)+'" />')}}for(const r of s.attempts){if(r.status!=="moving")continue;const i=1.2+r.flightDays,d=(s.now-r.start)/i,g=.6/i,f=.8/i;if(d<g||d>f+.08)continue;const u=m(r.from),B=.75+.25*Math.min(1,(d-g)/(f-g)),_=d>f?Math.max(0,1-(d-f)/.08):1;n.push('<g transform="translate('+(u.x-26)+" "+(u.y+24)+") scale("+B+')" opacity="'+.9*_+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const p=s.scenario.day+"|"+s.scenario.remote+"|"+s.rules.route;p!==I&&(S.innerHTML=t.join(""),I=p),R.innerHTML=n.join("")}function U(){const s=o("sitchips");s.children.length!==v&&(s.innerHTML=Array.from({length:v},(n,l)=>'<button class="sip" data-i="'+l+'" title="Situation '+(l+1)+'">'+(l+1)+"</button>").join(""));const t=e.ended?-1:e.index;s.querySelectorAll(".sip").forEach((n,l)=>{const p=e.results[l];n.className="sip "+[p?p.promise?"ok":"bad":"",l===t?"sel":""].filter(Boolean).join(" "),n.title="Situation "+(l+1)+" — "+P(p)})}function P(s){if(!s)return"not run";if(s.promise)return"promise kept";const t=[];s.lost&&t.push(s.lost+" lost"),s.dupes&&t.push(s.dupes+" duplicate"+(s.dupes>1?"s":""));const n=s.rows.filter(p=>p.delivered===1&&!p.onTime).length;n&&t.push(n+" late");const l=s.rows.filter(p=>!p.acked).length;return l&&t.push(l+" unsigned"),t.length?t.join(" · "):"promise broken"}function ce(s){const t=e.results.filter(d=>!!d),n=t.reduce((d,g)=>d+g.lost,0),l=t.reduce((d,g)=>d+g.dupes,0),p=t.reduce((d,g)=>d+g.rows.filter(f=>f.delivered===1&&!f.onTime).length,0),r=t.reduce((d,g)=>d+g.rows.filter(f=>f.delivered>0&&!f.acked).length,0),i=[];return s.cost>s.budget&&i.push("over budget by "+(s.cost-s.budget).toFixed(1)+" coins"),n&&i.push(n+" never arrived"),l&&i.push(l+" duplicate"+(l>1?"s":"")),p&&i.push(p+" late"),r&&i.push(r+" without a signed slip"),i.length?"Why: "+i.join(" · "):t.length===v?"All "+v+" situations kept the promise.":""}function pe(){const s=e.sim;if(!s)return"";const t=s.plan,n=[];return t.lostBags.length&&n.push(t.lostBags.length+(t.lostBags.length>1?" bags":" bag")+" lost"),t.lostReceipts.length&&n.push(t.lostReceipts.length+(t.lostReceipts.length>1?" slips":" slip")+" lost"),t.delay&&n.push("storm +"+t.delay+" days"),"Situation "+Math.min(e.index+1,v)+": "+(n.length?n.join(" · "):"nothing goes wrong")}function ue(){const s=e.sim;if(!s)return;const t=x(),n=t.kept>=M&&t.cost<=t.budget,p=t.kept===v&&t.cost<=t.budget?"S":n?"A":t.kept>=M-2?"B":"C";if(o("rank").textContent=p,o("rank").className="rank "+p.toLowerCase(),o("best").textContent=e.best?e.best.kept+"/"+v+" · "+e.best.cost+"c":"—",o("budgetBar").style.width=Math.min(100,t.cost/t.budget*100)+"%",o("budgetBar").className=t.cost>t.budget?"over":"",t.n===v){const r=t.cost>t.budget?"Over budget":t.kept+" / "+v;o("promiseState").innerHTML='<span class="'+(n?"ok":"bad")+'">'+r+"</span>"}else if(t.n===0){const r=t.kept>=M&&t.cost<=t.budget,i=t.cost>t.budget?"Over budget":t.kept+" / "+v;o("promiseState").innerHTML='<span class="'+(r?"ok":"bad")+'">'+i+"</span>"}else t.n===0?o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+t.kept+" / "+t.n+" so far</span>";o("cost").textContent=(t.n?t.cost:"—")+" / "+t.budget+" coins",o("cost").className="mono"+(t.cost>t.budget?" bad":""),o("promise").innerHTML="Promise: every letter once, within "+s.scenario.deadline+" days, with a signed slip back.",o("sitnote").textContent=pe(),o("why").textContent=ce(t),o("why").style.color=t.kept>=M&&t.cost<=t.budget?"var(--green)":"var(--red)",U(),o("rows").innerHTML=t.per.map(r=>'<div class="srow"><div class="l"><b>'+r.label+'</b></div><div class="c">'+(t.n?r.ok+"/"+t.n:"—")+'</div><div class="t mono">'+(r.dup?r.dup+" dup":"")+"</div></div>").join("")}function fe(){const s=e.sim;if(!s)return;const t=s.events.filter(l=>!e.focus||l.letter===e.focus),n=o("log");for(let l=e.drawnLog;l<t.length;l++){const p=t[l],r=document.createElement("div");r.className="lrow "+p.kind,r.innerHTML='<span class="lt mono">'+p.t.toFixed(1)+'</span><span class="lx">'+p.text+"</span>",n.appendChild(r)}e.drawnLog=t.length,n.scrollTop=n.scrollHeight}function Z(){const s=o("rules");s.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([t,n])=>{const l=le[t].map(p=>{const r=t==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[t]===p.id?"on":""} ${r?"off":""}" data-g="${t}" data-o="${p.id}" ${r?"disabled":""} title="${p.note}">
              <div class="row"><span class="nm">${p.label}</span><span class="pr mono">+${p.cost.toFixed(1)}</span></div>
              <div class="note">${r?"Needs a number on the envelope.":p.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${n}</h3>${l}</div>`}).join(""),s.querySelectorAll(".opt").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.g;e.rules[n]=t.dataset.o,n==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),Z(),C()})})}function Y(s){e.day=s;const t=D[s];o("title").innerHTML=t.title+" <span>· day "+t.day+"  ·  "+v+" situations</span>",o("briefBudget").textContent=String(ie[s]),o("days").innerHTML=D.map((n,l)=>'<button data-d="'+l+'" class="'+(l===s?"on":"")+'">'+n.day+"</button>").join(""),o("days").querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>Y(Number(n.dataset.d)))}),Z(),C()}o("sitchips").addEventListener("click",s=>{const t=s.target?.closest?.(".sip");if(!t)return;const n=Number(t.getAttribute("data-i"));Number.isInteger(n)&&K(n)}),o("reset").addEventListener("click",()=>C()),o("again").addEventListener("click",()=>C()),o("next").addEventListener("click",()=>{e.day<D.length-1&&Y(e.day+1)}),T.addEventListener("click",s=>{const t=s.target?.closest?.(".letter");if(!t)return;const n=t.getAttribute("data-letter");e.focus=e.focus===n?null:n,o("log").innerHTML="",e.drawnLog=0,b()}),Y(0);const J=new URLSearchParams(location.search);if(J.has("tlauto")){const s=Math.max(0,Math.min(D.length-1,Number(J.get("tlauto"))||0)),t=(J.get("tl")||"").split(",");Y(s),t.length===4&&(e.rules={numbering:t[0],receipts:t[1],retry:t[2],ledger:t[3],route:"direct"},Z(),C());const n=Number(J.get("tlat"));if(n>0){for(;e.sim&&e.sim.now<n;)e.sim.tick(.05);b()}else V()}return{destroy(){L(),h.innerHTML=""}}};export{ve as default};
