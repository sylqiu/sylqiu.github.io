const oe={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},te={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},q=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],F=20,ne=[120,150,165,190],re=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function se(w){let h=w>>>0;return function(){h=h+1831565813>>>0;let o=h;return o=Math.imul(o^o>>>15,1|o),o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function ie(w,h){const o=re[w],T=se((w+1)*7919+h*104729+17),S=[],P=[];for(let L=1;L<=3;L++)T()<o.sack&&S.push({letter:L,attempt:1}),T()<o.slip&&P.push({letter:L});const D=T()<o.storm?2:0;return{lostBags:S,lostReceipts:P,delay:D}}const ae=[.1,.25,.4],X=.4,J=.2,ee=.6;function le(w,h){return q[w].remote?h==="relay"?3:4:2}function Q(w,h){const o=te[w].find(T=>T.id===h);return o?o.cost:0}function de(w={}){const h=q[w.scenario??0],o={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...w.rules||{}},T=o.ledger==="on"&&o.numbering!=="none",S=w.plan??null,P=S?S.lostBags:h.lostBags,D=S?S.lostReceipts:h.lostReceipts,L=le(w.scenario??0,o.route)+(S?.delay??0),v=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(r=>({...r,number:o.numbering==="serial"?`${r.from}-${String(r.seq).padStart(2,"0")}`:o.numbering==="date"?"DAY-"+h.day:null,attempts:[],acked:!1,ackAt:null,slipLost:D.some(s=>s.letter===r.seq)})),e=[],R=[],H=[],O=new Set;let m=0,j=0,E=!1;const M=(r,s,x={})=>{H.push({t:m,kind:r,text:s,...x})};function z(r,s){const x={id:"a"+ ++j,letterId:r.id,number:r.number,from:r.from,to:r.to,attempt:s,start:m,delivered:!1,status:"moving",deliverAt:m+X+J+L+J+X,lost:P.some(B=>B.letter===r.seq&&B.attempt===s),lostAt:m+X+J+L*.55};return r.attempts.push(x),e.push(x),M("sent",`${r.label} left the desk${x.number?" ["+x.number+"]":""}`,{letter:r.id,attempt:x.id}),x}function W(r){const s=v.find(x=>x.id===r.letterId);if(T&&r.number&&O.has(r.number)){r.status="dropped",r.endedAt=m,M("dropped",`${r.number} already in the ledger — the copy is dropped`,{letter:r.letterId,attempt:r.id}),o.receipts==="sign"&&(s.ackAt=m+L+ee);return}T&&r.number&&O.add(r.number),r.status="delivered",r.delivered=!0,r.endedAt=m,R.push({letterId:r.letterId,number:r.number,at:m,attempt:r.id}),M("delivered",`${s.to==="A"?"Alice":s.to==="B"?"Bob":"Carol"} received ${r.number||"a letter"}`,{letter:r.letterId,attempt:r.id}),o.receipts==="sign"&&(s.ackAt=m+L+ee)}function N(r){if(!E){m+=r;for(const s of e)if(s.status==="moving"){if(s.lost&&m>=s.lostAt){s.status="lost",s.endedAt=m,M("lost",`the bag carrying ${s.number||"a letter"} is gone`,{letter:s.letterId,attempt:s.id});continue}m>=s.deliverAt&&W(s)}for(const s of v)!s.acked&&s.ackAt&&m>=s.ackAt&&(s.slipLost?(s.slipLost=!1,s.ackAt=null,M("lost",`the signed slip for ${s.number||s.label} never arrived`,{letter:s.id})):(s.acked=!0,M("ack",`the signed slip for ${s.number||s.label} reached the sender`,{letter:s.id})));if(o.retry!=="never"&&m>.01){const s=o.retry==="tuned"?2:3;for(const x of v){if(x.acked||x.attempts.length>=s)continue;const B=x.attempts[x.attempts.length-1];if(!B)continue;const _=o.retry==="tuned"?2*L+2.6:6.5;m>=B.start+_&&(M("retry",`no slip from ${x.label} — sending again`,{letter:x.id}),z(x,x.attempts.length+1))}}}}function U(){const r=v.map(b=>{const C=R.filter(n=>n.letterId===b.id),t=C.length?Math.min(...C.map(n=>n.at)):null;return{id:b.id,label:b.label,number:b.number,delivered:C.length,first:t,onTime:t!==null&&t<=h.deadline,acked:b.acked,lost:b.attempts.length>0&&b.attempts.every(n=>n.status==="lost")}}),s=r.filter(b=>b.delivered===1).length,x=r.filter(b=>b.delivered===1&&b.onTime).length,B=r.reduce((b,C)=>b+Math.max(0,C.delivered-1),0),_=r.filter(b=>b.delivered===0).length,G=v.length*1+v.length*Q("numbering",o.numbering)+v.length*Q("receipts",o.receipts)+(T?v.length*Q("ledger",o.ledger):0)+(o.retry!=="never"?v.length*Q("retry",o.retry):0)+(h.remote&&o.route==="direct"?v.length*.5:0)+(e.length-v.length)*1;return{rows:r,exact:s,onTime:x,dupes:B,lost:_,total:v.length,cost:Math.round(G*10)/10,attempts:e.length,promise:x===v.length&&B===0&&r.every(b=>b.acked)}}function K(){for(;m<h.deadline+3;)N(.05);return E=!0,U()}return v.forEach((r,s)=>{m=ae[s],z(r,1)}),m=0,{scenario:h,rules:o,letters:v,attempts:e,deliveries:R,events:H,flightDays:L,get now(){return m},tick:N,summary:U,runAll:K,get done(){return E}}}const ce=`
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
`,pe=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <div class="days" id="days"></div>
    <button id="run" class="primary">▶ Run</button>
    <button id="reset" title="Reset">↺</button>
    <button id="skip" title="Skip to results">⏭</button>
    <span class="clock mono"><b id="clock">morning 1/20</b></span>
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
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 5px"></div>
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`,ue=w=>{const h=w.shadowRoot??w.attachShadow({mode:"open"});h.innerHTML="<style>"+ce+"</style>"+pe;const o=t=>h.querySelector("#"+t),T=h.querySelector("#map"),S=h.querySelector("#map-static"),P=h.querySelector("#map-dynamic");let D="";const L={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},v={x:470,y:62},e={day:0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct"},sim:null,days:[],index:0,results:[],playing:!1,speed:1,drawnLog:0,focus:null,ended:!1};let R=0,H=0,O=0;function m(t){return e.sim?.scenario.remote&&t==="B"?v:L[t]}function j(t,n){const i=m(t),a=m(n),u=a.x-i.x,g=a.y-i.y,k=Math.hypot(u,g)||1,l=t==="A"&&n==="C"?-54:42;return{p1:i,p2:a,c:{x:(i.x+a.x)/2-g/k*l,y:(i.y+a.y)/2+u/k*l}}}function E(t,n,i,a){const u=1-a;return{x:u*u*t.x+2*u*a*n.x+a*a*i.x,y:u*u*t.y+2*u*a*n.y+a*a*i.y}}function M(){e.playing=!1,cancelAnimationFrame(R)}function z(){M(),O=0,e.ended=!1,e.drawnLog=0,e.focus=null,e.results=[],e.index=0,e.days=Array.from({length:F},(t,n)=>de({scenario:e.day,rules:e.rules,plan:ie(e.day,n)})),e.sim=e.days[0],o("verdict").classList.remove("show"),o("log").innerHTML="",o("run").textContent="▶ Run 20",s()}function W(){e.ended&&z(),e.playing=!0,o("run").textContent="⏸ Pause",H=performance.now(),cancelAnimationFrame(R),R=requestAnimationFrame(N)}function N(t){if(!e.playing||!e.sim)return;if(t<O){R=requestAnimationFrame(N);return}const n=Math.min(.06,(t-H)/1e3);H=t;const i=e.index===0?2.2:4.2;if(e.sim.tick(n*e.speed*i),e.sim.now>=e.sim.scenario.deadline+2){if(e.results.push(e.sim.summary()),e.index++,e.index>=e.days.length){K();return}e.sim=e.days[e.index],o("log").innerHTML="",e.drawnLog=0,s(),H=t,O=t+220,R=requestAnimationFrame(N);return}s(),R=requestAnimationFrame(N)}function U(){const t=e.results,n=t.filter(g=>g.promise).length,i=Math.round(t.reduce((g,k)=>g+k.cost,0)*10)/10,a=ne[e.day],u=["L1","L2","L3"].map(g=>{const k=e.days[0]?.letters.find(c=>c.id===g)?.label??g;let l=0,d=0;for(const c of t){const f=c.rows.find(p=>p.id===g);f&&f.delivered===1&&l++,f&&(d+=Math.max(0,f.delivered-1))}return{id:g,label:k,ok:l,dup:d}});return{kept:n,cost:i,budget:a,per:u,n:t.length}}function K(){M(),e.playing=!1,e.ended=!0;const t=U(),n=t.kept>=17&&t.cost<=t.budget;o("verdict").classList.add("show");const i=t.cost>t.budget;o("vt").innerHTML=n?'<span class="ok">Good enough: '+t.kept+" / "+F+" mornings.</span>":i?'<span class="bad">Over budget: '+t.cost+" / "+t.budget+" coins.</span>":'<span class="bad">Not yet: '+t.kept+" / "+F+" mornings.</span>";let a=-1,u=99;e.results.forEach((c,f)=>{const p=c.exact*2-c.dupes;p<u&&(u=p,a=f)});const g=e.results[a],k=g?g.rows.slice().sort((c,f)=>f.delivered-c.delivered)[0]:null,l=k&&k.delivered>1?" · worst: morning "+(a+1)+", "+k.delivered+" copies for "+k.label:g&&g.lost>0?" · worst: morning "+(a+1)+", a letter never arrived":" · every letter at most once";o("vs").textContent=t.cost+" / "+t.budget+" coins"+l;const d=o("next");d.disabled=e.day>=q.length-1,d.textContent=e.day>=q.length-1?"That is the whole slice":"Next day →",s()}function r(){M(),e.results=e.days.map(t=>t.runAll()),e.index=e.days.length,e.sim=e.days[e.days.length-1],K()}function s(){e.sim&&(x(),B(),_(),o("clock").textContent="morning "+Math.min(e.index+1,F)+"/"+F)}function x(){const t=e.sim;if(!t)return;const n=t.flightDays,i=[],a=[];for(const[l,d]of[["A","B"],["B","C"],["A","C"]]){const c=j(l,d);i.push(`<path class="route" d="M ${c.p1.x} ${c.p1.y} Q ${c.c.x} ${c.c.y} ${c.p2.x} ${c.p2.y}" />`);const f=E(c.p1,c.c,c.p2,.5);i.push(`<text class="routelabel" x="${f.x}" y="${f.y-12}" text-anchor="middle">${n} days</text>`)}for(const l of["A","B","C"]){const d=m(l),c=oe[l],f=t.deliveries.filter(y=>t.letters.find(A=>A.id===y.letterId).to===l),p=t.scenario.remote&&l==="B";i.push(`<g class="city">
        <circle cx="${d.x}" cy="${d.y}" r="28" fill="#0f141b" stroke="${c.color}" stroke-width="2" />
        <text class="name" x="${d.x}" y="${d.y+44}" text-anchor="middle">${c.friend}</text>
        <text class="place" x="${d.x}" y="${d.y+58}" text-anchor="middle">${p?"the mountains":c.city}</text>
        <g transform="translate(${d.x+30},${d.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),f.slice(0,4).forEach((y,A)=>{a.push(`<g class="stack" transform="translate(${d.x+38+A*13},${d.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${y.number?`<text x="7" y="-4" text-anchor="middle">${y.number}</text>`:""}
        </g>`)})}const u=1.2+n;let g=0;for(const l of t.attempts){if(l.status!=="moving")continue;const d=Math.max(0,Math.min(1,(t.now-l.start)/u)),c=.6/u,f=(.6+n)/u;let p,y=0;if(d<=c)p=m(l.from),p={x:p.x-40-g++%3*7,y:p.y-2};else if(d>=f)p=m(l.to),p={x:p.x+12,y:p.y+34};else{const $=(d-c)/(f-c),I=j(l.from,l.to);p=E(I.p1,I.c,I.p2,$);const V=E(I.p1,I.c,I.p2,Math.min(1,$+.015));y=Math.max(-20,Math.min(20,Math.atan2(V.y-p.y,V.x-p.x)*180/Math.PI)),p.y-=8;for(let Y=1;Y<=2;Y++){const Z=E(I.p1,I.c,I.p2,Math.max(0,$-Y*.03));a.push('<rect x="'+(Z.x-8)+'" y="'+(Z.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/Y+'" />')}}const A=e.focus===l.letterId;a.push('<g class="letter '+(A?"focus":"")+'" data-letter="'+l.letterId+'" style="cursor:pointer" transform="translate('+p.x+" "+p.y+") rotate("+y+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(l.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-y+' 0 -11)">'+l.number+"</text>":"")+"</g>")}for(const l of t.letters){const d=t.deliveries.find($=>$.letterId===l.id);if(!d||t.rules.receipts!=="sign"||!l.ackAt||t.now<d.at||t.now>l.ackAt)continue;const c=(t.now-d.at)/(l.ackAt-d.at),f=t.scenario.lostReceipts.some($=>$.letter===l.seq);if(f&&c>.55)continue;const p=j(l.to,l.from),y=E(p.p1,p.c,p.p2,c),A=f?Math.max(.15,1-Math.max(0,c-.3)/.25):1;a.push('<g transform="translate('+y.x+" "+(y.y-7)+')" opacity="'+A+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const l of t.deliveries){const d=t.now-l.at;if(d<0||d>1.1)continue;const c=t.letters.find(y=>y.id===l.letterId);if(!c)continue;const f=m(c.to),p=d/1.1;a.push('<circle cx="'+f.x+'" cy="'+f.y+'" r="'+(28+36*p)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-p)+'" opacity="'+.5*(1-p)+'" />');for(let y=0;y<6;y++){const A=Math.PI*2*y/6,$=26+30*p;a.push('<circle cx="'+(f.x+Math.cos(A)*$)+'" cy="'+(f.y+Math.sin(A)*$)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-p)+'" />')}}for(const l of t.attempts){if(l.status!=="moving")continue;const d=(t.now-l.start)/u,c=.6/u,f=.8/u;if(d<c||d>f+.08)continue;const p=m(l.from),A=.75+.25*Math.min(1,(d-c)/(f-c)),$=d>f?Math.max(0,1-(d-f)/.08):1;a.push('<g transform="translate('+(p.x-26)+" "+(p.y+24)+") scale("+A+')" opacity="'+.9*$+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const k=t.scenario.day+"|"+n+"|"+t.scenario.remote;k!==D&&(S.innerHTML=i.join(""),D=k),P.innerHTML=a.join("")}function B(){const t=e.sim;if(!t)return;const n=U();e.ended?o("promiseState").innerHTML='<span class="'+(n.kept>=17&&n.cost<=n.budget?"ok":"bad")+'">'+n.kept+" / "+F+"</span>":n.n===0?o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+n.kept+" / "+n.n+" so far</span>",o("cost").textContent=(n.n?n.cost:"—")+" / "+n.budget+" coins",o("cost").className="mono"+(n.cost>n.budget?" bad":""),o("promise").innerHTML="Promise: every letter once, within "+t.scenario.deadline+" days, with a signed slip back.",o("rows").innerHTML=n.per.map(i=>'<div class="srow"><div class="l"><b>'+i.label+'</b></div><div class="c">'+(n.n?i.ok+"/"+n.n:"—")+'</div><div class="t mono">'+(i.dup?i.dup+" dup":"")+"</div></div>").join("")}function _(){const t=e.sim;if(!t)return;const n=t.events.filter(a=>!e.focus||a.letter===e.focus),i=o("log");for(let a=e.drawnLog;a<n.length;a++){const u=n[a],g=document.createElement("div");g.className="lrow "+u.kind,g.innerHTML='<span class="lt mono">'+u.t.toFixed(1)+'</span><span class="lx">'+u.text+"</span>",i.appendChild(g)}e.drawnLog=n.length,i.scrollTop=i.scrollHeight}function G(){const t=o("rules");t.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([n,i])=>{const a=te[n].map(u=>{const g=n==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[n]===u.id?"on":""} ${g?"off":""}" data-g="${n}" data-o="${u.id}" ${g?"disabled":""} title="${u.note}">
              <div class="row"><span class="nm">${u.label}</span><span class="pr mono">+${u.cost.toFixed(1)}</span></div>
              <div class="note">${g?"Needs a number on the envelope.":u.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${i}</h3>${a}</div>`}).join(""),t.querySelectorAll(".opt").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.g;e.rules[i]=n.dataset.o,i==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),G(),z()})})}function b(t){e.day=t;const n=q[t];o("title").innerHTML=n.title+" <span>· day "+n.day+"  ·  "+F+" mornings</span>",o("days").innerHTML=q.map((i,a)=>'<button data-d="'+a+'" class="'+(a===t?"on":"")+'">'+i.day+"</button>").join(""),o("days").querySelectorAll("button").forEach(i=>{i.addEventListener("click",()=>b(Number(i.dataset.d)))}),G(),z()}o("run").addEventListener("click",()=>{e.playing?(M(),o("run").textContent="▶ Resume"):W()}),o("reset").addEventListener("click",()=>z()),o("skip").addEventListener("click",()=>r()),o("again").addEventListener("click",()=>z()),o("next").addEventListener("click",()=>{e.day<q.length-1&&b(e.day+1)}),T.addEventListener("click",t=>{const n=t.target?.closest?.(".letter");if(!n)return;const i=n.getAttribute("data-letter");e.focus=e.focus===i?null:i,o("log").innerHTML="",e.drawnLog=0,s()}),b(0);const C=new URLSearchParams(location.search);if(C.has("tlauto")){const t=Math.max(0,Math.min(q.length-1,Number(C.get("tlauto"))||0)),n=(C.get("tl")||"").split(",");b(t),n.length===4&&(e.rules={numbering:n[0],receipts:n[1],retry:n[2],ledger:n[3],route:"direct"},G(),z());const i=Number(C.get("tlat"));if(i>0){for(;e.sim&&e.sim.now<i;)e.sim.tick(.05);s()}else r()}return{destroy(){M(),h.innerHTML=""}}};export{ue as default};
