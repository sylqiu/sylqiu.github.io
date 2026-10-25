const ce={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},ae={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},F=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],w=10,pe=[60,75,105,150],ue=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function fe(A){let h=A>>>0;return function(){h=h+1831565813>>>0;let o=h;return o=Math.imul(o^o>>>15,1|o),o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function ee(A,h){const o=ue[A],T=h*2,M=fe((A+1)*7919+T*104729+17),E=[],I=[];for(let y=1;y<=3;y++)M()<o.sack&&E.push({letter:y,attempt:1}),M()<o.slip&&I.push({letter:y});const j=M()<o.storm?2:0;return{lostBags:E,lostReceipts:I,delay:j}}const ge=[.1,.25,.4],te=.4,se=.2,ie=.6;function le(A,h,o,T){return!A.remote||o!=="B"&&T!=="B"?2:h==="relay"?3:4}function X(A,h){const o=ae[A].find(T=>T.id===h);return o?o.cost:0}function oe(A={}){const h=F[A.scenario??0],o={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...A.rules||{}},T=o.ledger==="on"&&o.numbering!=="none",M=A.plan??null,E=M?M.lostBags:h.lostBags,I=M?M.lostReceipts:h.lostReceipts,j=M?.delay??0,y=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(i=>({...i,number:o.numbering==="serial"?`${i.from}-${String(i.seq).padStart(2,"0")}`:o.numbering==="date"?"DAY-"+h.day:null,attempts:[],acked:!1,ackAt:null,slipLost:I.some(c=>c.letter===i.seq)})),e=[],$=[],q=[],P=new Set;let m=0,O=0,B=!1;const L=(i,c,b={})=>{q.push({t:m,kind:i,text:c,...b})};function z(i,c){const b=le(h,o.route,i.from,i.to)+j,x={id:"a"+ ++O,letterId:i.id,number:i.number,from:i.from,to:i.to,attempt:c,start:m,delivered:!1,status:"moving",deliverAt:m+te+se+b+se+te,lost:E.some(C=>C.letter===i.seq&&C.attempt===c),lostAt:m+te+se+b*.55,flightDays:b};return i.attempts.push(x),e.push(x),L("sent",`${i.label} left the desk${x.number?" ["+x.number+"]":""}`,{letter:i.id,attempt:x.id}),x}function J(i){const c=y.find(b=>b.id===i.letterId);if(T&&i.number&&P.has(i.number)){i.status="dropped",i.endedAt=m,L("dropped",`${i.number} already in the ledger — the copy is dropped`,{letter:i.letterId,attempt:i.id}),o.receipts==="sign"&&(c.ackAt=m+i.flightDays+ie);return}T&&i.number&&P.add(i.number),i.status="delivered",i.delivered=!0,i.endedAt=m,$.push({letterId:i.letterId,number:i.number,at:m,attempt:i.id}),L("delivered",`${c.to==="A"?"Alice":c.to==="B"?"Bob":"Carol"} received ${i.number||"a letter"}`,{letter:i.letterId,attempt:i.id}),o.receipts==="sign"&&(c.ackAt=m+i.flightDays+ie)}function K(i){if(!B){m+=i;for(const c of e)if(c.status==="moving"){if(c.lost&&m>=c.lostAt){c.status="lost",c.endedAt=m,L("lost",`the bag carrying ${c.number||"a letter"} is gone`,{letter:c.letterId,attempt:c.id});continue}m>=c.deliverAt&&J(c)}for(const c of y)!c.acked&&c.ackAt&&m>=c.ackAt&&(c.slipLost?(c.slipLost=!1,c.ackAt=null,L("lost",`the signed slip for ${c.number||c.label} never arrived`,{letter:c.id})):(c.acked=!0,L("ack",`the signed slip for ${c.number||c.label} reached the sender`,{letter:c.id})));if(o.retry!=="never"&&m>.01){const c=o.retry==="tuned"?2:3;for(const b of y){if(b.acked||b.attempts.length>=c)continue;const x=b.attempts[b.attempts.length-1];if(!x)continue;const C=o.retry==="tuned"?2*x.flightDays+2.6:6.5;m>=x.start+C&&(L("retry",`no slip from ${b.label} — sending again`,{letter:b.id}),z(b,b.attempts.length+1))}}}}function H(){const i=y.map(v=>{const N=$.filter(D=>D.letterId===v.id),U=N.length?Math.min(...N.map(D=>D.at)):null;return{id:v.id,label:v.label,number:v.number,delivered:N.length,first:U,onTime:U!==null&&U<=h.deadline,acked:v.acked,lost:v.attempts.length>0&&v.attempts.every(D=>D.status==="lost")}}),c=i.filter(v=>v.delivered===1).length,b=i.filter(v=>v.delivered===1&&v.onTime).length,x=i.reduce((v,N)=>v+Math.max(0,N.delivered-1),0),C=i.filter(v=>v.delivered===0).length,V=y.length*1+y.length*X("numbering",o.numbering)+y.length*X("receipts",o.receipts)+(T?y.length*X("ledger",o.ledger):0)+(o.retry!=="never"?y.length*X("retry",o.retry):0)+(h.remote&&o.route==="direct"?y.length*.5:0)+(e.length-y.length)*1;return{rows:i,exact:c,onTime:b,dupes:x,lost:C,total:y.length,cost:Math.round(V*10)/10,attempts:e.length,promise:b===y.length&&x===0&&i.every(v=>v.acked)}}function G(){for(;m<h.deadline+3;)K(.05);return B=!0,H()}return y.forEach((i,c)=>{m=ge[c],z(i,1)}),m=0,{scenario:h,rules:o,letters:y,attempts:e,deliveries:$,events:q,plan:{lostBags:E,lostReceipts:I,delay:M?.delay??0},get now(){return m},tick:K,summary:H,runAll:G,get done(){return B}}}const me=`
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
`,he=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <div class="days" id="days"></div>
    <button id="reset" title="Recompute results">↺</button>
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
        <div class="head"><span class="big" id="promiseState">in progress</span><span class="mono" id="cost" style="font-size:10.5px;color:var(--dim)"></span></div>
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 3px"></div>
        <div id="sitnote" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:0 0 3px"></div>
        <div id="why" style="font-size:9.5px;line-height:1.35;margin:0 0 5px;color:var(--dimmer)"></div>
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`,xe=A=>{const h=A.shadowRoot??A.attachShadow({mode:"open"});h.innerHTML="<style>"+me+"</style>"+he;const o=t=>h.querySelector("#"+t),T=h.querySelector("#map"),M=h.querySelector("#map-static"),E=h.querySelector("#map-dynamic");let I="";const j={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},y={x:470,y:62},e={day:0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct"},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1};let $=0,q=0,P=0;function m(t){return e.sim?.scenario.remote&&t==="B"?y:j[t]}function O(t,s){const r=m(t),l=m(s),p=l.x-r.x,n=l.y-r.y,a=Math.hypot(p,n)||1,d=t==="A"&&s==="C"?-54:42;return{p1:r,p2:l,c:{x:(r.x+l.x)/2-n/a*d,y:(r.y+l.y)/2+p/a*d}}}function B(t,s,r,l){const p=1-l;return{x:p*p*t.x+2*p*l*s.x+l*l*r.x,y:p*p*t.y+2*p*l*s.y+l*l*r.y}}function L(){e.playing=!1,cancelAnimationFrame($)}function z(){L(),P=0,e.ended=!0,e.single=!1,e.drawnLog=0,e.focus=null,e.index=0,e.days=Array.from({length:w},(t,s)=>oe({scenario:e.day,rules:e.rules,plan:ee(e.day,s)})),e.results=e.days.map((t,s)=>oe({scenario:e.day,rules:e.rules,plan:ee(e.day,s)}).runAll()),e.sim=e.days[0],o("verdict").classList.remove("show"),o("log").innerHTML="",x()}function J(t=!1){if(e.ended&&z(),e.sim&&e.sim.now>=e.sim.scenario.deadline+2&&!t){let s=e.index+1;for(;s<w&&e.results[s];)s++;s<w&&(e.index=s,e.sim=e.days[s],o("log").innerHTML="",e.drawnLog=0,x())}e.playing=!0,e.single=t,q=performance.now(),cancelAnimationFrame($),$=requestAnimationFrame(H)}function K(t){L(),o("verdict").classList.remove("show"),e.ended=!1,e.single=!1,e.playing=!1,e.index=t,e.days[t]=oe({scenario:e.day,rules:e.rules,plan:ee(e.day,t)}),e.sim=e.days[t],o("log").innerHTML="",e.drawnLog=0,x(),J(!0)}function H(t){if(!e.playing||!e.sim)return;if(t<P){$=requestAnimationFrame(H);return}const s=Math.min(.06,(t-q)/1e3);q=t;const r=e.single||e.index===0?2.2:4.2;if(e.sim.tick(s*e.speed*r),e.sim.now>=e.sim.scenario.deadline+2){if(e.results[e.index]=e.sim.summary(),e.single){e.playing=!1,e.single=!1,e.ended=!0,cancelAnimationFrame($),x();return}if(e.index++,e.results.every(Boolean)||e.index>=w){i();return}for(;e.index<w&&e.results[e.index];)e.index++;if(e.index>=w){i();return}e.sim=e.days[e.index],o("log").innerHTML="",e.drawnLog=0,x(),q=t,P=t+220,$=requestAnimationFrame(H);return}x(),$=requestAnimationFrame(H)}function G(){const t=e.results.filter(n=>!!n),s=t.filter(n=>n.promise).length,r=Math.round(t.reduce((n,a)=>n+a.cost,0)*10)/10,l=pe[e.day],p=["L1","L2","L3"].map(n=>{const a=e.days[0]?.letters.find(g=>g.id===n)?.label??n;let d=0,f=0;for(const g of t){const u=g.rows.find(k=>k.id===n);u&&u.delivered===1&&d++,u&&(f+=Math.max(0,u.delivered-1))}return{id:n,label:a,ok:d,dup:f}});return{kept:s,cost:r,budget:l,per:p,n:t.length}}function i(){L(),e.playing=!1,e.single=!1,e.ended=!0;const t=G(),s=t.kept>=c&&t.cost<=t.budget;o("verdict").classList.add("show");const r=t.cost>t.budget;o("vt").innerHTML=s?'<span class="ok">Good enough: '+t.kept+" / "+w+" situations.</span>":r?'<span class="bad">Over budget: '+t.cost+" / "+t.budget+" coins.</span>":'<span class="bad">Not yet: '+t.kept+" / "+w+" situations.</span>";let l=-1,p=99;e.results.forEach((g,u)=>{if(!g)return;const k=g.exact*2-g.dupes;k<p&&(p=k,l=u)});const n=l>=0?e.results[l]:null,a=n?n.rows.slice().sort((g,u)=>u.delivered-g.delivered)[0]:null,d=a&&a.delivered>1?" · worst: situation "+(l+1)+", "+a.delivered+" copies for "+a.label:n&&n.lost>0?" · worst: situation "+(l+1)+", a letter never arrived":" · every letter at most once";o("vs").textContent=t.cost+" / "+t.budget+" coins"+d;const f=o("next");f.disabled=e.day>=F.length-1,f.textContent=e.day>=F.length-1?"That is the whole slice":"Next day →",x()}const c=Math.ceil(w*.85);function b(){L(),e.results=e.days.map(t=>t.runAll()),e.index=e.days.length,e.sim=e.days[e.days.length-1],i()}function x(){if(!e.sim)return;C(),D(),de();const t=Math.min(e.index+1,w),s=Math.min(e.sim.now,e.sim.scenario.deadline).toFixed(1);o("clock").textContent="situation "+t+"/"+w+" · day "+s+" / "+e.sim.scenario.deadline}function C(){const t=e.sim;if(!t)return;const s=[],r=[];for(const[n,a]of[["A","B"],["B","C"],["A","C"]]){const d=O(n,a);s.push(`<path class="route" d="M ${d.p1.x} ${d.p1.y} Q ${d.c.x} ${d.c.y} ${d.p2.x} ${d.p2.y}" />`);const f=B(d.p1,d.c,d.p2,.5),g=le(t.scenario,t.rules.route,n,a);s.push(`<text class="routelabel" x="${f.x}" y="${f.y-12}" text-anchor="middle">${g} days one-way</text>`)}for(const n of["A","B","C"]){const a=m(n),d=ce[n],f=t.deliveries.filter(u=>t.letters.find(k=>k.id===u.letterId).to===n),g=t.scenario.remote&&n==="B";s.push(`<g class="city">
        <circle cx="${a.x}" cy="${a.y}" r="28" fill="#0f141b" stroke="${d.color}" stroke-width="2" />
        <text class="name" x="${a.x}" y="${a.y+44}" text-anchor="middle">${d.friend}</text>
        <text class="place" x="${a.x}" y="${a.y+58}" text-anchor="middle">${g?"the mountains":d.city}</text>
        <g transform="translate(${a.x+30},${a.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),f.slice(0,4).forEach((u,k)=>{r.push(`<g class="stack" transform="translate(${a.x+38+k*13},${a.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${u.number?`<text x="7" y="-4" text-anchor="middle">${u.number}</text>`:""}
        </g>`)})}let l=0;for(const n of t.attempts){if(n.status!=="moving")continue;const a=1.2+n.flightDays,d=Math.max(0,Math.min(1,(t.now-n.start)/a)),f=.6/a,g=(.6+n.flightDays)/a;let u,k=0;if(d<=f)u=m(n.from),u={x:u.x-40-l++%3*7,y:u.y-2};else if(d>=g)u=m(n.to),u={x:u.x+12,y:u.y+34};else{const _=(d-f)/(g-f),R=O(n.from,n.to);u=B(R.p1,R.c,R.p2,_);const ne=B(R.p1,R.c,R.p2,Math.min(1,_+.015));k=Math.max(-20,Math.min(20,Math.atan2(ne.y-u.y,ne.x-u.x)*180/Math.PI)),u.y-=8;for(let Q=1;Q<=2;Q++){const re=B(R.p1,R.c,R.p2,Math.max(0,_-Q*.03));r.push('<rect x="'+(re.x-8)+'" y="'+(re.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/Q+'" />')}}const S=e.focus===n.letterId;r.push('<g class="letter '+(S?"focus":"")+'" data-letter="'+n.letterId+'" style="cursor:pointer" transform="translate('+u.x+" "+u.y+") rotate("+k+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(n.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-k+' 0 -11)">'+n.number+"</text>":"")+"</g>")}for(const n of t.letters){const a=t.deliveries.find(S=>S.letterId===n.id);if(!a||t.rules.receipts!=="sign"||!n.ackAt||t.now<a.at||t.now>n.ackAt)continue;const d=(t.now-a.at)/(n.ackAt-a.at),f=t.plan.lostReceipts.some(S=>S.letter===n.seq);if(f&&d>.55)continue;const g=O(n.to,n.from),u=B(g.p1,g.c,g.p2,d),k=f?Math.max(.15,1-Math.max(0,d-.3)/.25):1;r.push('<g transform="translate('+u.x+" "+(u.y-7)+')" opacity="'+k+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const n of t.deliveries){const a=t.now-n.at;if(a<0||a>1.1)continue;const d=t.letters.find(u=>u.id===n.letterId);if(!d)continue;const f=m(d.to),g=a/1.1;r.push('<circle cx="'+f.x+'" cy="'+f.y+'" r="'+(28+36*g)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-g)+'" opacity="'+.5*(1-g)+'" />');for(let u=0;u<6;u++){const k=Math.PI*2*u/6,S=26+30*g;r.push('<circle cx="'+(f.x+Math.cos(k)*S)+'" cy="'+(f.y+Math.sin(k)*S)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-g)+'" />')}}for(const n of t.attempts){if(n.status!=="moving")continue;const a=1.2+n.flightDays,d=(t.now-n.start)/a,f=.6/a,g=.8/a;if(d<f||d>g+.08)continue;const u=m(n.from),S=.75+.25*Math.min(1,(d-f)/(g-f)),_=d>g?Math.max(0,1-(d-g)/.08):1;r.push('<g transform="translate('+(u.x-26)+" "+(u.y+24)+") scale("+S+')" opacity="'+.9*_+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const p=t.scenario.day+"|"+t.scenario.remote+"|"+t.rules.route;p!==I&&(M.innerHTML=s.join(""),I=p),E.innerHTML=r.join("")}function V(){const t=o("sitchips");t.children.length!==w&&(t.innerHTML=Array.from({length:w},(r,l)=>'<button class="sip" data-i="'+l+'" title="Situation '+(l+1)+'">'+(l+1)+"</button>").join(""));const s=e.ended?-1:e.index;t.querySelectorAll(".sip").forEach((r,l)=>{const p=e.results[l];r.className="sip "+[p?p.promise?"ok":"bad":"",l===s?"sel":""].filter(Boolean).join(" "),r.title="Situation "+(l+1)+" — "+v(p)})}function v(t){if(!t)return"not run";if(t.promise)return"promise kept";const s=[];t.lost&&s.push(t.lost+" lost"),t.dupes&&s.push(t.dupes+" duplicate"+(t.dupes>1?"s":""));const r=t.rows.filter(p=>p.delivered===1&&!p.onTime).length;r&&s.push(r+" late");const l=t.rows.filter(p=>!p.acked).length;return l&&s.push(l+" unsigned"),s.length?s.join(" · "):"promise broken"}function N(){const t=e.results.filter(a=>!!a),s=t.reduce((a,d)=>a+d.lost,0),r=t.reduce((a,d)=>a+d.dupes,0),l=t.reduce((a,d)=>a+d.rows.filter(f=>f.delivered===1&&!f.onTime).length,0),p=t.reduce((a,d)=>a+d.rows.filter(f=>f.delivered>0&&!f.acked).length,0),n=[];return s&&n.push(s+" never arrived"),r&&n.push(r+" duplicate"+(r>1?"s":"")),l&&n.push(l+" late"),p&&n.push(p+" without a signed slip"),n.length?"Why: "+n.join(" · "):t.length===w?"All "+w+" situations kept the promise.":""}function U(){const t=e.sim;if(!t)return"";const s=t.plan,r=[];return s.lostBags.length&&r.push(s.lostBags.length+(s.lostBags.length>1?" bags":" bag")+" lost"),s.lostReceipts.length&&r.push(s.lostReceipts.length+(s.lostReceipts.length>1?" slips":" slip")+" lost"),s.delay&&r.push("storm +"+s.delay+" days"),"Situation "+Math.min(e.index+1,w)+": "+(r.length?r.join(" · "):"nothing goes wrong")}function D(){const t=e.sim;if(!t)return;const s=G();s.n===w?o("promiseState").innerHTML='<span class="'+(s.kept>=c&&s.cost<=s.budget?"ok":"bad")+'">'+s.kept+" / "+w+"</span>":s.n===0?o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+s.kept+" / "+s.n+" so far</span>",o("cost").textContent=(s.n?s.cost:"—")+" / "+s.budget+" coins",o("cost").className="mono"+(s.cost>s.budget?" bad":""),o("promise").innerHTML="Promise: every letter once, within "+t.scenario.deadline+" days, with a signed slip back.",o("sitnote").textContent=U(),o("why").textContent=N(),o("why").style.color=s.kept===w?"var(--green)":"var(--dim)",V(),o("rows").innerHTML=s.per.map(r=>'<div class="srow"><div class="l"><b>'+r.label+'</b></div><div class="c">'+(s.n?r.ok+"/"+s.n:"—")+'</div><div class="t mono">'+(r.dup?r.dup+" dup":"")+"</div></div>").join("")}function de(){const t=e.sim;if(!t)return;const s=t.events.filter(l=>!e.focus||l.letter===e.focus),r=o("log");for(let l=e.drawnLog;l<s.length;l++){const p=s[l],n=document.createElement("div");n.className="lrow "+p.kind,n.innerHTML='<span class="lt mono">'+p.t.toFixed(1)+'</span><span class="lx">'+p.text+"</span>",r.appendChild(n)}e.drawnLog=s.length,r.scrollTop=r.scrollHeight}function Z(){const t=o("rules");t.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([s,r])=>{const l=ae[s].map(p=>{const n=s==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[s]===p.id?"on":""} ${n?"off":""}" data-g="${s}" data-o="${p.id}" ${n?"disabled":""} title="${p.note}">
              <div class="row"><span class="nm">${p.label}</span><span class="pr mono">+${p.cost.toFixed(1)}</span></div>
              <div class="note">${n?"Needs a number on the envelope.":p.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${r}</h3>${l}</div>`}).join(""),t.querySelectorAll(".opt").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.g;e.rules[r]=s.dataset.o,r==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),Z(),z()})})}function W(t){e.day=t;const s=F[t];o("title").innerHTML=s.title+" <span>· day "+s.day+"  ·  "+w+" situations</span>",o("days").innerHTML=F.map((r,l)=>'<button data-d="'+l+'" class="'+(l===t?"on":"")+'">'+r.day+"</button>").join(""),o("days").querySelectorAll("button").forEach(r=>{r.addEventListener("click",()=>W(Number(r.dataset.d)))}),Z(),z()}o("sitchips").addEventListener("click",t=>{const s=t.target?.closest?.(".sip");if(!s)return;const r=Number(s.getAttribute("data-i"));Number.isInteger(r)&&K(r)}),o("reset").addEventListener("click",()=>z()),o("again").addEventListener("click",()=>z()),o("next").addEventListener("click",()=>{e.day<F.length-1&&W(e.day+1)}),T.addEventListener("click",t=>{const s=t.target?.closest?.(".letter");if(!s)return;const r=s.getAttribute("data-letter");e.focus=e.focus===r?null:r,o("log").innerHTML="",e.drawnLog=0,x()}),W(0);const Y=new URLSearchParams(location.search);if(Y.has("tlauto")){const t=Math.max(0,Math.min(F.length-1,Number(Y.get("tlauto"))||0)),s=(Y.get("tl")||"").split(",");W(t),s.length===4&&(e.rules={numbering:s[0],receipts:s[1],retry:s[2],ledger:s[3],route:"direct"},Z(),z());const r=Number(Y.get("tlat"));if(r>0){for(;e.sim&&e.sim.now<r;)e.sim.tick(.05);x()}else b()}return{destroy(){L(),h.innerHTML=""}}};export{xe as default};
