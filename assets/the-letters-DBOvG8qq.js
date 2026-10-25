const ie={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},re={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},N=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],T=10,ae=[60,75,105,150],le=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function de(M){let x=M>>>0;return function(){x=x+1831565813>>>0;let n=x;return n=Math.imul(n^n>>>15,1|n),n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function ce(M,x){const n=le[M],B=x*2,A=de((M+1)*7919+B*104729+17),F=[],H=[];for(let b=1;b<=3;b++)A()<n.sack&&F.push({letter:b,attempt:1}),A()<n.slip&&H.push({letter:b});const R=A()<n.storm?2:0;return{lostBags:F,lostReceipts:H,delay:R}}const pe=[.1,.25,.4],ee=.4,te=.2,se=.6;function ue(M,x){return N[M].remote?x==="relay"?3:4:2}function J(M,x){const n=re[M].find(B=>B.id===x);return n?n.cost:0}function fe(M={}){const x=N[M.scenario??0],n={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...M.rules||{}},B=n.ledger==="on"&&n.numbering!=="none",A=M.plan??null,F=A?A.lostBags:x.lostBags,H=A?A.lostReceipts:x.lostReceipts,R=ue(M.scenario??0,n.route)+(A?.delay??0),b=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(r=>({...r,number:n.numbering==="serial"?`${r.from}-${String(r.seq).padStart(2,"0")}`:n.numbering==="date"?"DAY-"+x.day:null,attempts:[],acked:!1,ackAt:null,slipLost:H.some(a=>a.letter===r.seq)})),e=[],C=[],P=[],j=new Set;let g=0,U=0,E=!1;const L=(r,a,h={})=>{P.push({t:g,kind:r,text:a,...h})};function I(r,a){const h={id:"a"+ ++U,letterId:r.id,number:r.number,from:r.from,to:r.to,attempt:a,start:g,delivered:!1,status:"moving",deliverAt:g+ee+te+R+te+ee,lost:F.some(w=>w.letter===r.seq&&w.attempt===a),lostAt:g+ee+te+R*.55};return r.attempts.push(h),e.push(h),L("sent",`${r.label} left the desk${h.number?" ["+h.number+"]":""}`,{letter:r.id,attempt:h.id}),h}function V(r){const a=b.find(h=>h.id===r.letterId);if(B&&r.number&&j.has(r.number)){r.status="dropped",r.endedAt=g,L("dropped",`${r.number} already in the ledger — the copy is dropped`,{letter:r.letterId,attempt:r.id}),n.receipts==="sign"&&(a.ackAt=g+R+se);return}B&&r.number&&j.add(r.number),r.status="delivered",r.delivered=!0,r.endedAt=g,C.push({letterId:r.letterId,number:r.number,at:g,attempt:r.id}),L("delivered",`${a.to==="A"?"Alice":a.to==="B"?"Bob":"Carol"} received ${r.number||"a letter"}`,{letter:r.letterId,attempt:r.id}),n.receipts==="sign"&&(a.ackAt=g+R+se)}function _(r){if(!E){g+=r;for(const a of e)if(a.status==="moving"){if(a.lost&&g>=a.lostAt){a.status="lost",a.endedAt=g,L("lost",`the bag carrying ${a.number||"a letter"} is gone`,{letter:a.letterId,attempt:a.id});continue}g>=a.deliverAt&&V(a)}for(const a of b)!a.acked&&a.ackAt&&g>=a.ackAt&&(a.slipLost?(a.slipLost=!1,a.ackAt=null,L("lost",`the signed slip for ${a.number||a.label} never arrived`,{letter:a.id})):(a.acked=!0,L("ack",`the signed slip for ${a.number||a.label} reached the sender`,{letter:a.id})));if(n.retry!=="never"&&g>.01){const a=n.retry==="tuned"?2:3;for(const h of b){if(h.acked||h.attempts.length>=a)continue;const w=h.attempts[h.attempts.length-1];if(!w)continue;const K=n.retry==="tuned"?2*R+2.6:6.5;g>=w.start+K&&(L("retry",`no slip from ${h.label} — sending again`,{letter:h.id}),I(h,h.attempts.length+1))}}}}function O(){const r=b.map(y=>{const D=C.filter(z=>z.letterId===y.id),G=D.length?Math.min(...D.map(z=>z.at)):null;return{id:y.id,label:y.label,number:y.number,delivered:D.length,first:G,onTime:G!==null&&G<=x.deadline,acked:y.acked,lost:y.attempts.length>0&&y.attempts.every(z=>z.status==="lost")}}),a=r.filter(y=>y.delivered===1).length,h=r.filter(y=>y.delivered===1&&y.onTime).length,w=r.reduce((y,D)=>y+Math.max(0,D.delivered-1),0),K=r.filter(y=>y.delivered===0).length,Z=b.length*1+b.length*J("numbering",n.numbering)+b.length*J("receipts",n.receipts)+(B?b.length*J("ledger",n.ledger):0)+(n.retry!=="never"?b.length*J("retry",n.retry):0)+(x.remote&&n.route==="direct"?b.length*.5:0)+(e.length-b.length)*1;return{rows:r,exact:a,onTime:h,dupes:w,lost:K,total:b.length,cost:Math.round(Z*10)/10,attempts:e.length,promise:h===b.length&&w===0&&r.every(y=>y.acked)}}function Y(){for(;g<x.deadline+3;)_(.05);return E=!0,O()}return b.forEach((r,a)=>{g=pe[a],I(r,1)}),g=0,{scenario:x,rules:n,letters:b,attempts:e,deliveries:C,events:P,flightDays:R,plan:{lostBags:F,lostReceipts:H,delay:A?.delay??0},get now(){return g},tick:_,summary:O,runAll:Y,get done(){return E}}}const ge=`
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
.sitchips { display: flex; gap: 3px; align-items: center; }
.sitchips i { width: 7px; height: 7px; border-radius: 50%; background: #242b36; border: 1px solid #333d4b; }
.sitchips i.cur { background: var(--gold); border-color: var(--gold); }
.sitchips i.ok { background: var(--green); border-color: var(--green); }
.sitchips i.bad { background: var(--red); border-color: var(--red); }

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
`,me=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <div class="days" id="days"></div>
    <span class="sitchips" id="sitchips"></span>
    <button id="step" class="primary" title="Run one situation">Step →</button>
    <button id="run">▶ Run 10</button>
    <button id="reset" title="Reset">↺</button>
    <button id="skip" title="Skip to results">⏭</button>
    <span class="clock mono"><b id="clock">situation 1/10 · day 0.0</b></span>
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

  <div class="panels">
    <div>
      <h3 class="grp" style="margin-bottom:8px">Post office add-ons</h3>
      <div class="rulegrid" id="rules"></div>
      <div style="font-size:9.5px;color:var(--dimmer);margin-top:6px;line-height:1.4">Add-ons apply to all three offices. Priced per letter, in postage.</div>
    </div>
    <div>
      <div class="score">
        <div class="head"><span class="big" id="promiseState">in progress</span><span class="mono" id="cost" style="font-size:10.5px;color:var(--dim)"></span></div>
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 3px"></div>
        <div id="sitnote" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:0 0 5px"></div>
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`,he=M=>{const x=M.shadowRoot??M.attachShadow({mode:"open"});x.innerHTML="<style>"+ge+"</style>"+me;const n=t=>x.querySelector("#"+t),B=x.querySelector("#map"),A=x.querySelector("#map-static"),F=x.querySelector("#map-dynamic");let H="";const R={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},b={x:470,y:62},e={day:0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct"},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1};let C=0,P=0,j=0;function g(t){return e.sim?.scenario.remote&&t==="B"?b:R[t]}function U(t,o){const s=g(t),i=g(o),d=i.x-s.x,m=i.y-s.y,k=Math.hypot(d,m)||1,l=t==="A"&&o==="C"?-54:42;return{p1:s,p2:i,c:{x:(s.x+i.x)/2-m/k*l,y:(s.y+i.y)/2+d/k*l}}}function E(t,o,s,i){const d=1-i;return{x:d*d*t.x+2*d*i*o.x+i*i*s.x,y:d*d*t.y+2*d*i*o.y+i*i*s.y}}function L(){e.playing=!1,cancelAnimationFrame(C)}function I(){L(),j=0,e.ended=!1,e.single=!1,e.drawnLog=0,e.focus=null,e.results=[],e.index=0,e.days=Array.from({length:T},(t,o)=>fe({scenario:e.day,rules:e.rules,plan:ce(e.day,o)})),e.sim=e.days[0],n("verdict").classList.remove("show"),n("log").innerHTML="",n("run").textContent="▶ Run "+T,n("step").textContent="Step →",w()}function V(){e.index>=e.days.length||(e.sim=e.days[e.index],n("log").innerHTML="",e.drawnLog=0,w())}function _(t=!1){e.ended&&I(),e.sim&&e.sim.now>=e.sim.scenario.deadline+2&&e.index<e.days.length&&V(),e.playing=!0,e.single=t,n("run").textContent="⏸ Pause",n("step").textContent="Step →",P=performance.now(),cancelAnimationFrame(C),C=requestAnimationFrame(O)}function O(t){if(!e.playing||!e.sim)return;if(t<j){C=requestAnimationFrame(O);return}const o=Math.min(.06,(t-P)/1e3);P=t;const s=e.index===0?2.2:4.2;if(e.sim.tick(o*e.speed*s),e.sim.now>=e.sim.scenario.deadline+2){if(e.results.push(e.sim.summary()),e.index++,e.index>=e.days.length){r();return}if(e.single){e.playing=!1,e.single=!1,cancelAnimationFrame(C),n("run").textContent="▶ Run "+T,n("step").textContent="Next situation →",w();return}e.sim=e.days[e.index],n("log").innerHTML="",e.drawnLog=0,w(),P=t,j=t+220,C=requestAnimationFrame(O);return}w(),C=requestAnimationFrame(O)}function Y(){const t=e.results,o=t.filter(m=>m.promise).length,s=Math.round(t.reduce((m,k)=>m+k.cost,0)*10)/10,i=ae[e.day],d=["L1","L2","L3"].map(m=>{const k=e.days[0]?.letters.find(p=>p.id===m)?.label??m;let l=0,c=0;for(const p of t){const f=p.rows.find(u=>u.id===m);f&&f.delivered===1&&l++,f&&(c+=Math.max(0,f.delivered-1))}return{id:m,label:k,ok:l,dup:c}});return{kept:o,cost:s,budget:i,per:d,n:t.length}}function r(){L(),e.playing=!1,e.single=!1,e.ended=!0,n("run").textContent="▶ Run "+T,n("step").textContent="Step →";const t=Y(),o=t.kept>=a&&t.cost<=t.budget;n("verdict").classList.add("show");const s=t.cost>t.budget;n("vt").innerHTML=o?'<span class="ok">Good enough: '+t.kept+" / "+T+" situations.</span>":s?'<span class="bad">Over budget: '+t.cost+" / "+t.budget+" coins.</span>":'<span class="bad">Not yet: '+t.kept+" / "+T+" situations.</span>";let i=-1,d=99;e.results.forEach((p,f)=>{const u=p.exact*2-p.dupes;u<d&&(d=u,i=f)});const m=e.results[i],k=m?m.rows.slice().sort((p,f)=>f.delivered-p.delivered)[0]:null,l=k&&k.delivered>1?" · worst: situation "+(i+1)+", "+k.delivered+" copies for "+k.label:m&&m.lost>0?" · worst: situation "+(i+1)+", a letter never arrived":" · every letter at most once";n("vs").textContent=t.cost+" / "+t.budget+" coins"+l;const c=n("next");c.disabled=e.day>=N.length-1,c.textContent=e.day>=N.length-1?"That is the whole slice":"Next day →",w()}const a=Math.ceil(T*.85);function h(){L(),e.results=e.days.map(t=>t.runAll()),e.index=e.days.length,e.sim=e.days[e.days.length-1],r()}function w(){if(!e.sim)return;K(),D(),G();const t=e.sim.now>=e.sim.scenario.deadline+2,o=Math.min(t?Math.max(1,e.index):e.index+1,T),s=Math.min(e.sim.now,e.sim.scenario.deadline).toFixed(1);n("clock").textContent="situation "+o+"/"+T+" · day "+s+" / "+e.sim.scenario.deadline}function K(){const t=e.sim;if(!t)return;const o=t.flightDays,s=[],i=[];for(const[l,c]of[["A","B"],["B","C"],["A","C"]]){const p=U(l,c);s.push(`<path class="route" d="M ${p.p1.x} ${p.p1.y} Q ${p.c.x} ${p.c.y} ${p.p2.x} ${p.p2.y}" />`);const f=E(p.p1,p.c,p.p2,.5);s.push(`<text class="routelabel" x="${f.x}" y="${f.y-12}" text-anchor="middle">${o} days</text>`)}for(const l of["A","B","C"]){const c=g(l),p=ie[l],f=t.deliveries.filter(v=>t.letters.find($=>$.id===v.letterId).to===l),u=t.scenario.remote&&l==="B";s.push(`<g class="city">
        <circle cx="${c.x}" cy="${c.y}" r="28" fill="#0f141b" stroke="${p.color}" stroke-width="2" />
        <text class="name" x="${c.x}" y="${c.y+44}" text-anchor="middle">${p.friend}</text>
        <text class="place" x="${c.x}" y="${c.y+58}" text-anchor="middle">${u?"the mountains":p.city}</text>
        <g transform="translate(${c.x+30},${c.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),f.slice(0,4).forEach((v,$)=>{i.push(`<g class="stack" transform="translate(${c.x+38+$*13},${c.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${v.number?`<text x="7" y="-4" text-anchor="middle">${v.number}</text>`:""}
        </g>`)})}const d=1.2+o;let m=0;for(const l of t.attempts){if(l.status!=="moving")continue;const c=Math.max(0,Math.min(1,(t.now-l.start)/d)),p=.6/d,f=(.6+o)/d;let u,v=0;if(c<=p)u=g(l.from),u={x:u.x-40-m++%3*7,y:u.y-2};else if(c>=f)u=g(l.to),u={x:u.x+12,y:u.y+34};else{const S=(c-p)/(f-p),q=U(l.from,l.to);u=E(q.p1,q.c,q.p2,S);const ne=E(q.p1,q.c,q.p2,Math.min(1,S+.015));v=Math.max(-20,Math.min(20,Math.atan2(ne.y-u.y,ne.x-u.x)*180/Math.PI)),u.y-=8;for(let X=1;X<=2;X++){const oe=E(q.p1,q.c,q.p2,Math.max(0,S-X*.03));i.push('<rect x="'+(oe.x-8)+'" y="'+(oe.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/X+'" />')}}const $=e.focus===l.letterId;i.push('<g class="letter '+($?"focus":"")+'" data-letter="'+l.letterId+'" style="cursor:pointer" transform="translate('+u.x+" "+u.y+") rotate("+v+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(l.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-v+' 0 -11)">'+l.number+"</text>":"")+"</g>")}for(const l of t.letters){const c=t.deliveries.find(S=>S.letterId===l.id);if(!c||t.rules.receipts!=="sign"||!l.ackAt||t.now<c.at||t.now>l.ackAt)continue;const p=(t.now-c.at)/(l.ackAt-c.at),f=t.scenario.lostReceipts.some(S=>S.letter===l.seq);if(f&&p>.55)continue;const u=U(l.to,l.from),v=E(u.p1,u.c,u.p2,p),$=f?Math.max(.15,1-Math.max(0,p-.3)/.25):1;i.push('<g transform="translate('+v.x+" "+(v.y-7)+')" opacity="'+$+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const l of t.deliveries){const c=t.now-l.at;if(c<0||c>1.1)continue;const p=t.letters.find(v=>v.id===l.letterId);if(!p)continue;const f=g(p.to),u=c/1.1;i.push('<circle cx="'+f.x+'" cy="'+f.y+'" r="'+(28+36*u)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-u)+'" opacity="'+.5*(1-u)+'" />');for(let v=0;v<6;v++){const $=Math.PI*2*v/6,S=26+30*u;i.push('<circle cx="'+(f.x+Math.cos($)*S)+'" cy="'+(f.y+Math.sin($)*S)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-u)+'" />')}}for(const l of t.attempts){if(l.status!=="moving")continue;const c=(t.now-l.start)/d,p=.6/d,f=.8/d;if(c<p||c>f+.08)continue;const u=g(l.from),$=.75+.25*Math.min(1,(c-p)/(f-p)),S=c>f?Math.max(0,1-(c-f)/.08):1;i.push('<g transform="translate('+(u.x-26)+" "+(u.y+24)+") scale("+$+')" opacity="'+.9*S+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const k=t.scenario.day+"|"+o+"|"+t.scenario.remote;k!==H&&(A.innerHTML=s.join(""),H=k),F.innerHTML=i.join("")}function Z(){const t=!!e.sim&&e.sim.now>=e.sim.scenario.deadline+2,o=e.ended||t?-1:e.index;n("sitchips").innerHTML=e.days.map((s,i)=>{const d=e.results[i],m=d?d.promise?"ok":"bad":i===o?"cur":"",k="Situation "+(i+1)+(d?d.promise?" — promise kept":" — promise broken":" — pending");return'<i class="'+m+'" title="'+k+'"></i>'}).join("")}function y(){const t=e.sim;if(!t)return"";const o=t.plan,s=[];o.lostBags.length&&s.push(o.lostBags.length+(o.lostBags.length>1?" bags":" bag")+" lost"),o.lostReceipts.length&&s.push(o.lostReceipts.length+(o.lostReceipts.length>1?" slips":" slip")+" lost"),o.delay&&s.push("storm +"+o.delay+" days");const i=t.now>=t.scenario.deadline+2;return"Situation "+Math.min(i?Math.max(1,e.index):e.index+1,T)+": "+(s.length?s.join(" · "):"nothing goes wrong")}function D(){const t=e.sim;if(!t)return;const o=Y();e.ended?n("promiseState").innerHTML='<span class="'+(o.kept>=a&&o.cost<=o.budget?"ok":"bad")+'">'+o.kept+" / "+T+"</span>":o.n===0?n("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':n("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+o.kept+" / "+o.n+" so far</span>",n("cost").textContent=(o.n?o.cost:"—")+" / "+o.budget+" coins",n("cost").className="mono"+(o.cost>o.budget?" bad":""),n("promise").innerHTML="Promise: every letter once, within "+t.scenario.deadline+" days, with a signed slip back.",n("sitnote").textContent=y(),Z(),n("rows").innerHTML=o.per.map(s=>'<div class="srow"><div class="l"><b>'+s.label+'</b></div><div class="c">'+(o.n?s.ok+"/"+o.n:"—")+'</div><div class="t mono">'+(s.dup?s.dup+" dup":"")+"</div></div>").join("")}function G(){const t=e.sim;if(!t)return;const o=t.events.filter(i=>!e.focus||i.letter===e.focus),s=n("log");for(let i=e.drawnLog;i<o.length;i++){const d=o[i],m=document.createElement("div");m.className="lrow "+d.kind,m.innerHTML='<span class="lt mono">'+d.t.toFixed(1)+'</span><span class="lx">'+d.text+"</span>",s.appendChild(m)}e.drawnLog=o.length,s.scrollTop=s.scrollHeight}function z(){const t=n("rules");t.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([o,s])=>{const i=re[o].map(d=>{const m=o==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[o]===d.id?"on":""} ${m?"off":""}" data-g="${o}" data-o="${d.id}" ${m?"disabled":""} title="${d.note}">
              <div class="row"><span class="nm">${d.label}</span><span class="pr mono">+${d.cost.toFixed(1)}</span></div>
              <div class="note">${m?"Needs a number on the envelope.":d.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${s}</h3>${i}</div>`}).join(""),t.querySelectorAll(".opt").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.g;e.rules[s]=o.dataset.o,s==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),z(),I()})})}function Q(t){e.day=t;const o=N[t];n("title").innerHTML=o.title+" <span>· day "+o.day+"  ·  "+T+" situations</span>",n("days").innerHTML=N.map((s,i)=>'<button data-d="'+i+'" class="'+(i===t?"on":"")+'">'+s.day+"</button>").join(""),n("days").querySelectorAll("button").forEach(s=>{s.addEventListener("click",()=>Q(Number(s.dataset.d)))}),z(),I()}n("run").addEventListener("click",()=>{e.playing?(L(),n("run").textContent="▶ Resume"):_(!1)}),n("step").addEventListener("click",()=>{e.playing&&L(),_(!0)}),n("reset").addEventListener("click",()=>I()),n("skip").addEventListener("click",()=>h()),n("again").addEventListener("click",()=>I()),n("next").addEventListener("click",()=>{e.day<N.length-1&&Q(e.day+1)}),B.addEventListener("click",t=>{const o=t.target?.closest?.(".letter");if(!o)return;const s=o.getAttribute("data-letter");e.focus=e.focus===s?null:s,n("log").innerHTML="",e.drawnLog=0,w()}),Q(0);const W=new URLSearchParams(location.search);if(W.has("tlauto")){const t=Math.max(0,Math.min(N.length-1,Number(W.get("tlauto"))||0)),o=(W.get("tl")||"").split(",");Q(t),o.length===4&&(e.rules={numbering:o[0],receipts:o[1],retry:o[2],ledger:o[3],route:"direct"},z(),I());const s=Number(W.get("tlat"));if(s>0){for(;e.sim&&e.sim.now<s;)e.sim.tick(.05);w()}else h()}return{destroy(){L(),x.innerHTML=""}}};export{he as default};
