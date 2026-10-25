const X={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},W={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},I=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],q=20,J=[120,150,165,190],V=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function Z(v){let y=v>>>0;return function(){y=y+1831565813>>>0;let o=y;return o=Math.imul(o^o>>>15,1|o),o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function ee(v,y){const o=V[v],A=Z((v+1)*7919+y*104729+17),L=[],e=[];for(let w=1;w<=3;w++)A()<o.sack&&L.push({letter:w,attempt:1}),A()<o.slip&&e.push({letter:w});const T=A()<o.storm?2:0;return{lostBags:L,lostReceipts:e,delay:T}}const te=[.1,.25,.4],_=.4,G=.2,Q=.6;function oe(v,y){return I[v].remote?y==="relay"?3:4:2}function j(v,y){const o=W[v].find(A=>A.id===y);return o?o.cost:0}function ne(v={}){const y=I[v.scenario??0],o={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...v.rules||{}},A=o.ledger==="on"&&o.numbering!=="none",L=v.plan??null,e=L?L.lostBags:y.lostBags,T=L?L.lostReceipts:y.lostReceipts,w=oe(v.scenario??0,o.route)+(L?.delay??0),h=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(i=>({...i,number:o.numbering==="serial"?`${i.from}-${String(i.seq).padStart(2,"0")}`:o.numbering==="date"?"DAY-"+y.day:null,attempts:[],acked:!1,ackAt:null,slipLost:T.some(a=>a.letter===i.seq)})),S=[],R=[],E=[],B=new Set;let b=0,N=0,H=!1;const $=(i,a,g={})=>{E.push({t:b,kind:i,text:a,...g})};function F(i,a){const g={id:"a"+ ++N,letterId:i.id,number:i.number,from:i.from,to:i.to,attempt:a,start:b,delivered:!1,status:"moving",deliverAt:b+_+G+w+G+_,lost:e.some(r=>r.letter===i.seq&&r.attempt===a),lostAt:b+_+G+w*.55};return i.attempts.push(g),S.push(g),$("sent",`${i.label} left the desk${g.number?" ["+g.number+"]":""}`,{letter:i.id,attempt:g.id}),g}function z(i){const a=h.find(g=>g.id===i.letterId);if(A&&i.number&&B.has(i.number)){i.status="dropped",i.endedAt=b,$("dropped",`${i.number} already in the ledger — the copy is dropped`,{letter:i.letterId,attempt:i.id}),o.receipts==="sign"&&(a.ackAt=b+w+Q);return}A&&i.number&&B.add(i.number),i.status="delivered",i.delivered=!0,i.endedAt=b,R.push({letterId:i.letterId,number:i.number,at:b,attempt:i.id}),$("delivered",`${a.to==="A"?"Alice":a.to==="B"?"Bob":"Carol"} received ${i.number||"a letter"}`,{letter:i.letterId,attempt:i.id}),o.receipts==="sign"&&(a.ackAt=b+w+Q)}function P(i){if(!H){b+=i;for(const a of S)if(a.status==="moving"){if(a.lost&&b>=a.lostAt){a.status="lost",a.endedAt=b,$("lost",`the bag carrying ${a.number||"a letter"} is gone`,{letter:a.letterId,attempt:a.id});continue}b>=a.deliverAt&&z(a)}for(const a of h)!a.acked&&a.ackAt&&b>=a.ackAt&&(a.slipLost?(a.slipLost=!1,a.ackAt=null,$("lost",`the signed slip for ${a.number||a.label} never arrived`,{letter:a.id})):(a.acked=!0,$("ack",`the signed slip for ${a.number||a.label} reached the sender`,{letter:a.id})));if(o.retry!=="never"&&b>.01){const a=o.retry==="tuned"?2:3;for(const g of h){if(g.acked||g.attempts.length>=a)continue;const r=g.attempts[g.attempts.length-1];if(!r)continue;const t=o.retry==="tuned"?2*w+2.6:6.5;b>=r.start+t&&($("retry",`no slip from ${g.label} — sending again`,{letter:g.id}),F(g,g.attempts.length+1))}}}}function D(){const i=h.map(n=>{const c=R.filter(s=>s.letterId===n.id),f=c.length?Math.min(...c.map(s=>s.at)):null;return{id:n.id,label:n.label,number:n.number,delivered:c.length,first:f,onTime:f!==null&&f<=y.deadline,acked:n.acked,lost:n.attempts.length>0&&n.attempts.every(s=>s.status==="lost")}}),a=i.filter(n=>n.delivered===1).length,g=i.filter(n=>n.delivered===1&&n.onTime).length,r=i.reduce((n,c)=>n+Math.max(0,c.delivered-1),0),t=i.filter(n=>n.delivered===0).length,d=h.length*1+h.length*j("numbering",o.numbering)+h.length*j("receipts",o.receipts)+(A?h.length*j("ledger",o.ledger):0)+(o.retry!=="never"?h.length*j("retry",o.retry):0)+(y.remote&&o.route==="direct"?h.length*.5:0)+(S.length-h.length)*1;return{rows:i,exact:a,onTime:g,dupes:r,lost:t,total:h.length,cost:Math.round(d*10)/10,attempts:S.length,promise:g===h.length&&r===0&&i.every(n=>n.acked)}}function U(){for(;b<y.deadline+3;)P(.05);return H=!0,D()}return h.forEach((i,a)=>{b=te[a],F(i,1)}),b=0,{scenario:y,rules:o,letters:h,attempts:S,deliveries:R,events:E,flightDays:w,get now(){return b},tick:P,summary:D,runAll:U,get done(){return H}}}const re=`
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
`,se=`
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
    <svg id="map" viewBox="0 0 800 430" preserveAspectRatio="xMidYMid meet"></svg>
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
`,ie=v=>{const y=v.shadowRoot??v.attachShadow({mode:"open"});y.innerHTML="<style>"+re+"</style>"+se;const o=r=>y.querySelector("#"+r),A={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},L={x:470,y:62},e={day:0,rules:{numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct"},sim:null,days:[],index:0,results:[],playing:!1,speed:2,drawnLog:0,focus:null,ended:!1};let T=0,w=0;function h(r){return e.sim?.scenario.remote&&r==="B"?L:A[r]}function S(r,t){const d=h(r),n=h(t),c=n.x-d.x,f=n.y-d.y,s=Math.hypot(c,f)||1,l=r==="A"&&t==="C"?-54:42;return{p1:d,p2:n,c:{x:(d.x+n.x)/2-f/s*l,y:(d.y+n.y)/2+c/s*l}}}function R(r,t,d,n){const c=1-n;return{x:c*c*r.x+2*c*n*t.x+n*n*d.x,y:c*c*r.y+2*c*n*t.y+n*n*d.y}}function E(){e.playing=!1,cancelAnimationFrame(T)}function B(){E(),e.ended=!1,e.drawnLog=0,e.focus=null,e.results=[],e.index=0,e.days=Array.from({length:q},(r,t)=>ne({scenario:e.day,rules:e.rules,plan:ee(e.day,t)})),e.sim=e.days[0],o("verdict").classList.remove("show"),o("log").innerHTML="",o("run").textContent="▶ Run 20",z()}function b(){e.ended&&B(),e.playing=!0,o("run").textContent="⏸ Pause",w=performance.now(),cancelAnimationFrame(T),T=requestAnimationFrame(N)}function N(r){if(!e.playing||!e.sim)return;const t=Math.min(.06,(r-w)/1e3);if(w=r,e.sim.tick(t*e.speed*9),e.sim.now>=e.sim.scenario.deadline+2){if(e.results.push(e.sim.summary()),e.index++,e.index>=e.days.length){$();return}e.sim=e.days[e.index],o("log").innerHTML="",e.drawnLog=0,z(),T=requestAnimationFrame(N);return}z(),T=requestAnimationFrame(N)}function H(){const r=e.results,t=r.filter(f=>f.promise).length,d=Math.round(r.reduce((f,s)=>f+s.cost,0)*10)/10,n=J[e.day],c=["L1","L2","L3"].map(f=>{const s=e.days[0]?.letters.find(m=>m.id===f)?.label??f;let l=0,u=0;for(const m of r){const p=m.rows.find(x=>x.id===f);p&&p.delivered===1&&l++,p&&(u+=Math.max(0,p.delivered-1))}return{id:f,label:s,ok:l,dup:u}});return{kept:t,cost:d,budget:n,per:c,n:r.length}}function $(){E(),e.playing=!1,e.ended=!0;const r=H(),t=r.kept>=17&&r.cost<=r.budget;o("verdict").classList.add("show");const d=r.cost>r.budget;o("vt").innerHTML=t?'<span class="ok">Good enough: '+r.kept+" / "+q+" mornings.</span>":d?'<span class="bad">Over budget: '+r.cost+" / "+r.budget+" coins.</span>":'<span class="bad">Not yet: '+r.kept+" / "+q+" mornings.</span>";let n=-1,c=99;e.results.forEach((m,p)=>{const x=m.exact*2-m.dupes;x<c&&(c=x,n=p)});const f=e.results[n],s=f?f.rows.slice().sort((m,p)=>p.delivered-m.delivered)[0]:null,l=s&&s.delivered>1?" · worst: morning "+(n+1)+", "+s.delivered+" copies for "+s.label:f&&f.lost>0?" · worst: morning "+(n+1)+", a letter never arrived":" · every letter at most once";o("vs").textContent=r.cost+" / "+r.budget+" coins"+l;const u=o("next");u.disabled=e.day>=I.length-1,u.textContent=e.day>=I.length-1?"That is the whole slice":"Next day →",z()}function F(){E(),e.results=e.days.map(r=>r.runAll()),e.index=e.days.length,e.sim=e.days[e.days.length-1],$()}function z(){e.sim&&(P(),D(),U(),o("clock").textContent="morning "+Math.min(e.index+1,q)+"/"+q)}function P(){const r=o("map"),t=e.sim;if(!t)return;const d=t.flightDays,n=[];for(const[s,l]of[["A","B"],["B","C"],["A","C"]]){const u=S(s,l);n.push(`<path class="route" d="M ${u.p1.x} ${u.p1.y} Q ${u.c.x} ${u.c.y} ${u.p2.x} ${u.p2.y}" />`);const m=R(u.p1,u.c,u.p2,.5);n.push(`<text class="routelabel" x="${m.x}" y="${m.y-12}" text-anchor="middle">${d} days</text>`)}for(const s of["A","B","C"]){const l=h(s),u=X[s],m=t.deliveries.filter(x=>t.letters.find(k=>k.id===x.letterId).to===s),p=t.scenario.remote&&s==="B";n.push(`<g class="city">
        <circle cx="${l.x}" cy="${l.y}" r="28" fill="#0f141b" stroke="${u.color}" stroke-width="2" />
        <text class="name" x="${l.x}" y="${l.y+44}" text-anchor="middle">${u.friend}</text>
        <text class="place" x="${l.x}" y="${l.y+58}" text-anchor="middle">${p?"the mountains":u.city}</text>
        <g transform="translate(${l.x+30},${l.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),m.slice(0,4).forEach((x,k)=>{n.push(`<g class="stack" transform="translate(${l.x+38+k*13},${l.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${x.number?`<text x="7" y="-4" text-anchor="middle">${x.number}</text>`:""}
        </g>`)})}const c=1.2+d;n.push('<defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#1b2230"/></pattern></defs><rect x="0" y="0" width="800" height="430" fill="url(#dots)" opacity="0.65"/>');let f=0;for(const s of t.attempts){if(s.status!=="moving")continue;const l=Math.max(0,Math.min(1,(t.now-s.start)/c)),u=.6/c,m=(.6+d)/c;let p,x=0;if(l<=u)p=h(s.from),p={x:p.x-40-f++%3*7,y:p.y-2};else if(l>=m)p=h(s.to),p={x:p.x+12,y:p.y+34};else{const M=(l-u)/(m-u),C=S(s.from,s.to);p=R(C.p1,C.c,C.p2,M);const K=R(C.p1,C.c,C.p2,Math.min(1,M+.015));x=Math.max(-20,Math.min(20,Math.atan2(K.y-p.y,K.x-p.x)*180/Math.PI)),p.y-=8;for(let O=1;O<=2;O++){const Y=R(C.p1,C.c,C.p2,Math.max(0,M-O*.03));n.push('<rect x="'+(Y.x-8)+'" y="'+(Y.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/O+'" />')}}const k=e.focus===s.letterId;n.push('<g class="letter '+(k?"focus":"")+'" data-letter="'+s.letterId+'" style="cursor:pointer" transform="translate('+p.x+" "+p.y+") rotate("+x+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(s.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-x+' 0 -11)">'+s.number+"</text>":"")+"</g>")}for(const s of t.letters){const l=t.deliveries.find(M=>M.letterId===s.id);if(!l||t.rules.receipts!=="sign"||!s.ackAt||t.now<l.at||t.now>s.ackAt)continue;const u=(t.now-l.at)/(s.ackAt-l.at),m=t.scenario.lostReceipts.some(M=>M.letter===s.seq);if(m&&u>.55)continue;const p=S(s.to,s.from),x=R(p.p1,p.c,p.p2,u),k=m?Math.max(.15,1-Math.max(0,u-.3)/.25):1;n.push('<g transform="translate('+x.x+" "+(x.y-7)+')" opacity="'+k+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const s of t.deliveries){const l=t.now-s.at;if(l<0||l>1.1)continue;const u=t.letters.find(x=>x.id===s.letterId);if(!u)continue;const m=h(u.to),p=l/1.1;n.push('<circle cx="'+m.x+'" cy="'+m.y+'" r="'+(28+36*p)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-p)+'" opacity="'+.5*(1-p)+'" />');for(let x=0;x<6;x++){const k=Math.PI*2*x/6,M=26+30*p;n.push('<circle cx="'+(m.x+Math.cos(k)*M)+'" cy="'+(m.y+Math.sin(k)*M)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-p)+'" />')}}for(const s of t.attempts){if(s.status!=="moving")continue;const l=(t.now-s.start)/c,u=.6/c,m=.8/c;if(l<u||l>m+.08)continue;const p=h(s.from),k=.75+.25*Math.min(1,(l-u)/(m-u)),M=l>m?Math.max(0,1-(l-m)/.08):1;n.push('<g transform="translate('+(p.x-26)+" "+(p.y+24)+") scale("+k+')" opacity="'+.9*M+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}r.innerHTML=n.join(""),r.querySelectorAll(".letter").forEach(s=>{s.addEventListener("click",()=>{const l=s.getAttribute("data-letter");e.focus=e.focus===l?null:l,o("log").innerHTML="",e.drawnLog=0,z()})})}function D(){const r=e.sim;if(!r)return;const t=H();e.ended?o("promiseState").innerHTML='<span class="'+(t.kept>=17&&t.cost<=t.budget?"ok":"bad")+'">'+t.kept+" / "+q+"</span>":o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+t.kept+" / "+Math.max(t.n,1)+" so far</span>",o("cost").textContent=t.cost+" / "+t.budget+" coins",o("cost").className="mono"+(t.cost>t.budget?" bad":""),o("promise").innerHTML="Promise: every letter once, within "+r.scenario.deadline+" days, with a signed slip back.",o("rows").innerHTML=t.per.map(d=>'<div class="srow"><div class="l"><b>'+d.label+'</b></div><div class="c">'+(t.n?d.ok+"/"+t.n:"—")+'</div><div class="t mono">'+(d.dup?d.dup+" dup":"")+"</div></div>").join("")}function U(){const r=e.sim;if(!r)return;const t=r.events.filter(n=>!e.focus||n.letter===e.focus),d=o("log");for(let n=e.drawnLog;n<t.length;n++){const c=t[n],f=document.createElement("div");f.className="lrow "+c.kind,f.innerHTML='<span class="lt mono">'+c.t.toFixed(1)+'</span><span class="lx">'+c.text+"</span>",d.appendChild(f)}e.drawnLog=t.length,d.scrollTop=d.scrollHeight}function i(){const r=o("rules");r.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([t,d])=>{const n=W[t].map(c=>{const f=t==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[t]===c.id?"on":""} ${f?"off":""}" data-g="${t}" data-o="${c.id}" ${f?"disabled":""} title="${c.note}">
              <div class="row"><span class="nm">${c.label}</span><span class="pr mono">+${c.cost.toFixed(1)}</span></div>
              <div class="note">${f?"Needs a number on the envelope.":c.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${d}</h3>${n}</div>`}).join(""),r.querySelectorAll(".opt").forEach(t=>{t.addEventListener("click",()=>{const d=t.dataset.g;e.rules[d]=t.dataset.o,d==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),i(),B()})})}function a(r){e.day=r;const t=I[r];o("title").innerHTML=t.title+" <span>· day "+t.day+"  ·  "+q+" mornings</span>",o("days").innerHTML=I.map((d,n)=>'<button data-d="'+n+'" class="'+(n===r?"on":"")+'">'+d.day+"</button>").join(""),o("days").querySelectorAll("button").forEach(d=>{d.addEventListener("click",()=>a(Number(d.dataset.d)))}),i(),B()}o("run").addEventListener("click",()=>{e.playing?(E(),o("run").textContent="▶ Resume"):b()}),o("reset").addEventListener("click",()=>B()),o("skip").addEventListener("click",()=>F()),o("again").addEventListener("click",()=>B()),o("next").addEventListener("click",()=>{e.day<I.length-1&&a(e.day+1)}),a(0);const g=new URLSearchParams(location.search);if(g.has("tlauto")){const r=Math.max(0,Math.min(I.length-1,Number(g.get("tlauto"))||0)),t=(g.get("tl")||"").split(",");a(r),t.length===4&&(e.rules={numbering:t[0],receipts:t[1],retry:t[2],ledger:t[3],route:"direct"},i(),B());const d=Number(g.get("tlat"));if(d>0){for(;e.sim&&e.sim.now<d;)e.sim.tick(.05);z()}else F()}return{destroy(){E(),y.innerHTML=""}}};export{ie as default};
