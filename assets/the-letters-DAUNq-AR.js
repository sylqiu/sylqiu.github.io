const le={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},ie={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},F=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],w=10,de=[60,75,105,150],ce=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function pe(L){let h=L>>>0;return function(){h=h+1831565813>>>0;let s=h;return s=Math.imul(s^s>>>15,1|s),s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}function se(L,h){const s=ce[L],$=h*2,M=pe((L+1)*7919+$*104729+17),q=[],I=[];for(let y=1;y<=3;y++)M()<s.sack&&q.push({letter:y,attempt:1}),M()<s.slip&&I.push({letter:y});const O=M()<s.storm?2:0;return{lostBags:q,lostReceipts:I,delay:O}}const ue=[.1,.25,.4],Z=.4,ee=.2,oe=.6;function ae(L,h,s,$){return!L.remote||s!=="B"&&$!=="B"?2:h==="relay"?3:4}function J(L,h){const s=ie[L].find($=>$.id===h);return s?s.cost:0}function re(L={}){const h=F[L.scenario??0],s={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...L.rules||{}},$=s.ledger==="on"&&s.numbering!=="none",M=L.plan??null,q=M?M.lostBags:h.lostBags,I=M?M.lostReceipts:h.lostReceipts,O=M?.delay??0,y=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(i=>({...i,number:s.numbering==="serial"?`${i.from}-${String(i.seq).padStart(2,"0")}`:s.numbering==="date"?"DAY-"+h.day:null,attempts:[],acked:!1,ackAt:null,slipLost:I.some(a=>a.letter===i.seq)})),e=[],S=[],H=[],P=new Set;let g=0,j=0,R=!1;const A=(i,a,b={})=>{H.push({t:g,kind:i,text:a,...b})};function T(i,a){const b=ae(h,s.route,i.from,i.to)+O,x={id:"a"+ ++j,letterId:i.id,number:i.number,from:i.from,to:i.to,attempt:a,start:g,delivered:!1,status:"moving",deliverAt:g+Z+ee+b+ee+Z,lost:q.some(z=>z.letter===i.seq&&z.attempt===a),lostAt:g+Z+ee+b*.55,flightDays:b};return i.attempts.push(x),e.push(x),A("sent",`${i.label} left the desk${x.number?" ["+x.number+"]":""}`,{letter:i.id,attempt:x.id}),x}function K(i){const a=y.find(b=>b.id===i.letterId);if($&&i.number&&P.has(i.number)){i.status="dropped",i.endedAt=g,A("dropped",`${i.number} already in the ledger — the copy is dropped`,{letter:i.letterId,attempt:i.id}),s.receipts==="sign"&&(a.ackAt=g+i.flightDays+oe);return}$&&i.number&&P.add(i.number),i.status="delivered",i.delivered=!0,i.endedAt=g,S.push({letterId:i.letterId,number:i.number,at:g,attempt:i.id}),A("delivered",`${a.to==="A"?"Alice":a.to==="B"?"Bob":"Carol"} received ${i.number||"a letter"}`,{letter:i.letterId,attempt:i.id}),s.receipts==="sign"&&(a.ackAt=g+i.flightDays+oe)}function G(i){if(!R){g+=i;for(const a of e)if(a.status==="moving"){if(a.lost&&g>=a.lostAt){a.status="lost",a.endedAt=g,A("lost",`the bag carrying ${a.number||"a letter"} is gone`,{letter:a.letterId,attempt:a.id});continue}g>=a.deliverAt&&K(a)}for(const a of y)!a.acked&&a.ackAt&&g>=a.ackAt&&(a.slipLost?(a.slipLost=!1,a.ackAt=null,A("lost",`the signed slip for ${a.number||a.label} never arrived`,{letter:a.id})):(a.acked=!0,A("ack",`the signed slip for ${a.number||a.label} reached the sender`,{letter:a.id})));if(s.retry!=="never"&&g>.01){const a=s.retry==="tuned"?2:3;for(const b of y){if(b.acked||b.attempts.length>=a)continue;const x=b.attempts[b.attempts.length-1];if(!x)continue;const z=s.retry==="tuned"?2*x.flightDays+2.6:6.5;g>=x.start+z&&(A("retry",`no slip from ${b.label} — sending again`,{letter:b.id}),T(b,b.attempts.length+1))}}}}function N(){const i=y.map(v=>{const D=S.filter(C=>C.letterId===v.id),U=D.length?Math.min(...D.map(C=>C.at)):null;return{id:v.id,label:v.label,number:v.number,delivered:D.length,first:U,onTime:U!==null&&U<=h.deadline,acked:v.acked,lost:v.attempts.length>0&&v.attempts.every(C=>C.status==="lost")}}),a=i.filter(v=>v.delivered===1).length,b=i.filter(v=>v.delivered===1&&v.onTime).length,x=i.reduce((v,D)=>v+Math.max(0,D.delivered-1),0),z=i.filter(v=>v.delivered===0).length,V=y.length*1+y.length*J("numbering",s.numbering)+y.length*J("receipts",s.receipts)+($?y.length*J("ledger",s.ledger):0)+(s.retry!=="never"?y.length*J("retry",s.retry):0)+(h.remote&&s.route==="direct"?y.length*.5:0)+(e.length-y.length)*1;return{rows:i,exact:a,onTime:b,dupes:x,lost:z,total:y.length,cost:Math.round(V*10)/10,attempts:e.length,promise:b===y.length&&x===0&&i.every(v=>v.acked)}}function Y(){for(;g<h.deadline+3;)G(.05);return R=!0,N()}return y.forEach((i,a)=>{g=ue[a],T(i,1)}),g=0,{scenario:h,rules:s,letters:y,attempts:e,deliveries:S,events:H,plan:{lostBags:q,lostReceipts:I,delay:M?.delay??0},get now(){return g},tick:G,summary:N,runAll:Y,get done(){return R}}}const fe=`
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
.sitchips .sip { width: 8px; height: 8px; padding: 0; border-radius: 50%; background: #242b36; border: 1px solid #333d4b; cursor: pointer; }
.sitchips .sip:hover { border-color: var(--text); }
.sitchips .sip.ok { background: var(--green); border-color: var(--green); }
.sitchips .sip.bad { background: var(--red); border-color: var(--red); }
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
`,ge=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <div class="days" id="days"></div>
    <span class="sitchips" id="sitchips"></span>
    <button id="run" class="primary">▶ Run 10</button>
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
`,me=L=>{const h=L.shadowRoot??L.attachShadow({mode:"open"});h.innerHTML="<style>"+fe+"</style>"+ge;const s=t=>h.querySelector("#"+t),$=h.querySelector("#map"),M=h.querySelector("#map-static"),q=h.querySelector("#map-dynamic");let I="";const O={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},y={x:470,y:62},e={day:0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct"},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1};let S=0,H=0,P=0;function g(t){return e.sim?.scenario.remote&&t==="B"?y:O[t]}function j(t,n){const r=g(t),d=g(n),u=d.x-r.x,o=d.y-r.y,l=Math.hypot(u,o)||1,p=t==="A"&&n==="C"?-54:42;return{p1:r,p2:d,c:{x:(r.x+d.x)/2-o/l*p,y:(r.y+d.y)/2+u/l*p}}}function R(t,n,r,d){const u=1-d;return{x:u*u*t.x+2*u*d*n.x+d*d*r.x,y:u*u*t.y+2*u*d*n.y+d*d*r.y}}function A(){e.playing=!1,cancelAnimationFrame(S)}function T(){A(),P=0,e.ended=!1,e.single=!1,e.drawnLog=0,e.focus=null,e.results=Array(w).fill(null),e.index=0,e.days=Array.from({length:w},(t,n)=>re({scenario:e.day,rules:e.rules,plan:se(e.day,n)})),e.sim=e.days[0],s("verdict").classList.remove("show"),s("log").innerHTML="",s("run").textContent="▶ Run "+w,x()}function K(t=!1){if(e.ended&&T(),e.sim&&e.sim.now>=e.sim.scenario.deadline+2&&!t){let n=e.index+1;for(;n<w&&e.results[n];)n++;n<w&&(e.index=n,e.sim=e.days[n],s("log").innerHTML="",e.drawnLog=0,x())}e.playing=!0,e.single=t,s("run").textContent="⏸ Pause",H=performance.now(),cancelAnimationFrame(S),S=requestAnimationFrame(N)}function G(t){A(),s("verdict").classList.remove("show"),e.ended=!1,e.single=!1,e.playing=!1,e.index=t,e.days[t]=re({scenario:e.day,rules:e.rules,plan:se(e.day,t)}),e.sim=e.days[t],e.results[t]=null,s("log").innerHTML="",e.drawnLog=0,x(),K(!0)}function N(t){if(!e.playing||!e.sim)return;if(t<P){S=requestAnimationFrame(N);return}const n=Math.min(.06,(t-H)/1e3);H=t;const r=e.single||e.index===0?2.2:4.2;if(e.sim.tick(n*e.speed*r),e.sim.now>=e.sim.scenario.deadline+2){if(e.results[e.index]=e.sim.summary(),e.single){e.playing=!1,e.single=!1,cancelAnimationFrame(S),s("run").textContent="▶ Run "+w,x();return}if(e.index++,e.results.every(Boolean)||e.index>=w){i();return}for(;e.index<w&&e.results[e.index];)e.index++;if(e.index>=w){i();return}e.sim=e.days[e.index],s("log").innerHTML="",e.drawnLog=0,x(),H=t,P=t+220,S=requestAnimationFrame(N);return}x(),S=requestAnimationFrame(N)}function Y(){const t=e.results.filter(o=>!!o),n=t.filter(o=>o.promise).length,r=Math.round(t.reduce((o,l)=>o+l.cost,0)*10)/10,d=de[e.day],u=["L1","L2","L3"].map(o=>{const l=e.days[0]?.letters.find(f=>f.id===o)?.label??o;let p=0,m=0;for(const f of t){const c=f.rows.find(k=>k.id===o);c&&c.delivered===1&&p++,c&&(m+=Math.max(0,c.delivered-1))}return{id:o,label:l,ok:p,dup:m}});return{kept:n,cost:r,budget:d,per:u,n:t.length}}function i(){A(),e.playing=!1,e.single=!1,e.ended=!0,s("run").textContent="▶ Run "+w;const t=Y(),n=t.kept>=a&&t.cost<=t.budget;s("verdict").classList.add("show");const r=t.cost>t.budget;s("vt").innerHTML=n?'<span class="ok">Good enough: '+t.kept+" / "+w+" situations.</span>":r?'<span class="bad">Over budget: '+t.cost+" / "+t.budget+" coins.</span>":'<span class="bad">Not yet: '+t.kept+" / "+w+" situations.</span>";let d=-1,u=99;e.results.forEach((f,c)=>{if(!f)return;const k=f.exact*2-f.dupes;k<u&&(u=k,d=c)});const o=d>=0?e.results[d]:null,l=o?o.rows.slice().sort((f,c)=>c.delivered-f.delivered)[0]:null,p=l&&l.delivered>1?" · worst: situation "+(d+1)+", "+l.delivered+" copies for "+l.label:o&&o.lost>0?" · worst: situation "+(d+1)+", a letter never arrived":" · every letter at most once";s("vs").textContent=t.cost+" / "+t.budget+" coins"+p;const m=s("next");m.disabled=e.day>=F.length-1,m.textContent=e.day>=F.length-1?"That is the whole slice":"Next day →",x()}const a=Math.ceil(w*.85);function b(){A(),e.results=e.days.map(t=>t.runAll()),e.index=e.days.length,e.sim=e.days[e.days.length-1],i()}function x(){if(!e.sim)return;z(),D(),U();const t=Math.min(e.index+1,w),n=Math.min(e.sim.now,e.sim.scenario.deadline).toFixed(1);s("clock").textContent="situation "+t+"/"+w+" · day "+n+" / "+e.sim.scenario.deadline}function z(){const t=e.sim;if(!t)return;const n=[],r=[];for(const[o,l]of[["A","B"],["B","C"],["A","C"]]){const p=j(o,l);n.push(`<path class="route" d="M ${p.p1.x} ${p.p1.y} Q ${p.c.x} ${p.c.y} ${p.p2.x} ${p.p2.y}" />`);const m=R(p.p1,p.c,p.p2,.5),f=ae(t.scenario,t.rules.route,o,l);n.push(`<text class="routelabel" x="${m.x}" y="${m.y-12}" text-anchor="middle">${f} days one-way</text>`)}for(const o of["A","B","C"]){const l=g(o),p=le[o],m=t.deliveries.filter(c=>t.letters.find(k=>k.id===c.letterId).to===o),f=t.scenario.remote&&o==="B";n.push(`<g class="city">
        <circle cx="${l.x}" cy="${l.y}" r="28" fill="#0f141b" stroke="${p.color}" stroke-width="2" />
        <text class="name" x="${l.x}" y="${l.y+44}" text-anchor="middle">${p.friend}</text>
        <text class="place" x="${l.x}" y="${l.y+58}" text-anchor="middle">${f?"the mountains":p.city}</text>
        <g transform="translate(${l.x+30},${l.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),m.slice(0,4).forEach((c,k)=>{r.push(`<g class="stack" transform="translate(${l.x+38+k*13},${l.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${c.number?`<text x="7" y="-4" text-anchor="middle">${c.number}</text>`:""}
        </g>`)})}let d=0;for(const o of t.attempts){if(o.status!=="moving")continue;const l=1.2+o.flightDays,p=Math.max(0,Math.min(1,(t.now-o.start)/l)),m=.6/l,f=(.6+o.flightDays)/l;let c,k=0;if(p<=m)c=g(o.from),c={x:c.x-40-d++%3*7,y:c.y-2};else if(p>=f)c=g(o.to),c={x:c.x+12,y:c.y+34};else{const _=(p-m)/(f-m),E=j(o.from,o.to);c=R(E.p1,E.c,E.p2,_);const te=R(E.p1,E.c,E.p2,Math.min(1,_+.015));k=Math.max(-20,Math.min(20,Math.atan2(te.y-c.y,te.x-c.x)*180/Math.PI)),c.y-=8;for(let X=1;X<=2;X++){const ne=R(E.p1,E.c,E.p2,Math.max(0,_-X*.03));r.push('<rect x="'+(ne.x-8)+'" y="'+(ne.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/X+'" />')}}const B=e.focus===o.letterId;r.push('<g class="letter '+(B?"focus":"")+'" data-letter="'+o.letterId+'" style="cursor:pointer" transform="translate('+c.x+" "+c.y+") rotate("+k+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(o.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-k+' 0 -11)">'+o.number+"</text>":"")+"</g>")}for(const o of t.letters){const l=t.deliveries.find(B=>B.letterId===o.id);if(!l||t.rules.receipts!=="sign"||!o.ackAt||t.now<l.at||t.now>o.ackAt)continue;const p=(t.now-l.at)/(o.ackAt-l.at),m=t.plan.lostReceipts.some(B=>B.letter===o.seq);if(m&&p>.55)continue;const f=j(o.to,o.from),c=R(f.p1,f.c,f.p2,p),k=m?Math.max(.15,1-Math.max(0,p-.3)/.25):1;r.push('<g transform="translate('+c.x+" "+(c.y-7)+')" opacity="'+k+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const o of t.deliveries){const l=t.now-o.at;if(l<0||l>1.1)continue;const p=t.letters.find(c=>c.id===o.letterId);if(!p)continue;const m=g(p.to),f=l/1.1;r.push('<circle cx="'+m.x+'" cy="'+m.y+'" r="'+(28+36*f)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-f)+'" opacity="'+.5*(1-f)+'" />');for(let c=0;c<6;c++){const k=Math.PI*2*c/6,B=26+30*f;r.push('<circle cx="'+(m.x+Math.cos(k)*B)+'" cy="'+(m.y+Math.sin(k)*B)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-f)+'" />')}}for(const o of t.attempts){if(o.status!=="moving")continue;const l=1.2+o.flightDays,p=(t.now-o.start)/l,m=.6/l,f=.8/l;if(p<m||p>f+.08)continue;const c=g(o.from),B=.75+.25*Math.min(1,(p-m)/(f-m)),_=p>f?Math.max(0,1-(p-f)/.08):1;r.push('<g transform="translate('+(c.x-26)+" "+(c.y+24)+") scale("+B+')" opacity="'+.9*_+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const u=t.scenario.day+"|"+t.scenario.remote+"|"+t.rules.route;u!==I&&(M.innerHTML=n.join(""),I=u),q.innerHTML=r.join("")}function V(){const t=s("sitchips");t.children.length!==w&&(t.innerHTML=Array.from({length:w},(r,d)=>'<button class="sip" data-i="'+d+'" title="Situation '+(d+1)+'"></button>').join(""));const n=e.ended?-1:e.index;t.querySelectorAll(".sip").forEach((r,d)=>{const u=e.results[d];r.className="sip "+[u?u.promise?"ok":"bad":"",d===n?"sel":""].filter(Boolean).join(" "),r.title="Situation "+(d+1)+(u?u.promise?" — promise kept":" — promise broken":" — pending")})}function v(){const t=e.sim;if(!t)return"";const n=t.plan,r=[];return n.lostBags.length&&r.push(n.lostBags.length+(n.lostBags.length>1?" bags":" bag")+" lost"),n.lostReceipts.length&&r.push(n.lostReceipts.length+(n.lostReceipts.length>1?" slips":" slip")+" lost"),n.delay&&r.push("storm +"+n.delay+" days"),"Situation "+Math.min(e.index+1,w)+": "+(r.length?r.join(" · "):"nothing goes wrong")}function D(){const t=e.sim;if(!t)return;const n=Y();e.ended?s("promiseState").innerHTML='<span class="'+(n.kept>=a&&n.cost<=n.budget?"ok":"bad")+'">'+n.kept+" / "+w+"</span>":n.n===0?s("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':s("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+n.kept+" / "+n.n+" so far</span>",s("cost").textContent=(n.n?n.cost:"—")+" / "+n.budget+" coins",s("cost").className="mono"+(n.cost>n.budget?" bad":""),s("promise").innerHTML="Promise: every letter once, within "+t.scenario.deadline+" days, with a signed slip back.",s("sitnote").textContent=v(),V(),s("rows").innerHTML=n.per.map(r=>'<div class="srow"><div class="l"><b>'+r.label+'</b></div><div class="c">'+(n.n?r.ok+"/"+n.n:"—")+'</div><div class="t mono">'+(r.dup?r.dup+" dup":"")+"</div></div>").join("")}function U(){const t=e.sim;if(!t)return;const n=t.events.filter(d=>!e.focus||d.letter===e.focus),r=s("log");for(let d=e.drawnLog;d<n.length;d++){const u=n[d],o=document.createElement("div");o.className="lrow "+u.kind,o.innerHTML='<span class="lt mono">'+u.t.toFixed(1)+'</span><span class="lx">'+u.text+"</span>",r.appendChild(o)}e.drawnLog=n.length,r.scrollTop=r.scrollHeight}function C(){const t=s("rules");t.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([n,r])=>{const d=ie[n].map(u=>{const o=n==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[n]===u.id?"on":""} ${o?"off":""}" data-g="${n}" data-o="${u.id}" ${o?"disabled":""} title="${u.note}">
              <div class="row"><span class="nm">${u.label}</span><span class="pr mono">+${u.cost.toFixed(1)}</span></div>
              <div class="note">${o?"Needs a number on the envelope.":u.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${r}</h3>${d}</div>`}).join(""),t.querySelectorAll(".opt").forEach(n=>{n.addEventListener("click",()=>{const r=n.dataset.g;e.rules[r]=n.dataset.o,r==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),C(),T()})})}function Q(t){e.day=t;const n=F[t];s("title").innerHTML=n.title+" <span>· day "+n.day+"  ·  "+w+" situations</span>",s("days").innerHTML=F.map((r,d)=>'<button data-d="'+d+'" class="'+(d===t?"on":"")+'">'+r.day+"</button>").join(""),s("days").querySelectorAll("button").forEach(r=>{r.addEventListener("click",()=>Q(Number(r.dataset.d)))}),C(),T()}s("run").addEventListener("click",()=>{if(e.playing){A(),s("run").textContent="▶ Resume";return}(e.ended||e.results.every(Boolean))&&T(),K(!1)}),s("sitchips").addEventListener("click",t=>{const n=t.target?.closest?.(".sip");if(!n)return;const r=Number(n.getAttribute("data-i"));Number.isInteger(r)&&G(r)}),s("reset").addEventListener("click",()=>T()),s("skip").addEventListener("click",()=>b()),s("again").addEventListener("click",()=>T()),s("next").addEventListener("click",()=>{e.day<F.length-1&&Q(e.day+1)}),$.addEventListener("click",t=>{const n=t.target?.closest?.(".letter");if(!n)return;const r=n.getAttribute("data-letter");e.focus=e.focus===r?null:r,s("log").innerHTML="",e.drawnLog=0,x()}),Q(0);const W=new URLSearchParams(location.search);if(W.has("tlauto")){const t=Math.max(0,Math.min(F.length-1,Number(W.get("tlauto"))||0)),n=(W.get("tl")||"").split(",");Q(t),n.length===4&&(e.rules={numbering:n[0],receipts:n[1],retry:n[2],ledger:n[3],route:"direct"},C(),T());const r=Number(W.get("tlat"));if(r>0){for(;e.sim&&e.sim.now<r;)e.sim.tick(.05);x()}else b()}return{destroy(){A(),h.innerHTML=""}}};export{me as default};
