const Y={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},_={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},S=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:10,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:10,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:12,remote:!0,lostBags:[],lostReceipts:[]}],Q=[.1,.25,.4],j=.4,O=.2,W=.6;function X(k,b){return S[k].remote?b==="relay"?3:4:2}function P(k,b){const r=_[k].find(B=>B.id===b);return r?r.cost:0}function G(k={}){const b=S[k.scenario??0],r={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...k.rules||{}},B=r.ledger==="on"&&r.numbering!=="none",E=X(k.scenario??0,r.route),e=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(s=>({...s,number:r.numbering==="serial"?`${s.from}-${String(s.seq).padStart(2,"0")}`:r.numbering==="date"?"DAY-"+b.day:null,attempts:[],acked:!1,ackAt:null})),$=[],z=[],A=[],I=new Set;let m=0,R=0,M=!1;const T=(s,l,p={})=>{A.push({t:m,kind:s,text:l,...p})};function q(s,l){const p={id:"a"+ ++R,letterId:s.id,number:s.number,from:s.from,to:s.to,attempt:l,start:m,delivered:!1,status:"moving",deliverAt:m+j+O+E+O+j,lost:b.lostBags.some(v=>v.letter===s.seq&&v.attempt===l),lostAt:m+j+O+E*.55};return s.attempts.push(p),$.push(p),T("sent",`${s.label} left the desk${p.number?" ["+p.number+"]":""}`,{letter:s.id,attempt:p.id}),p}function F(s){const l=e.find(p=>p.id===s.letterId);if(B&&s.number&&I.has(s.number)){s.status="dropped",s.endedAt=m,T("dropped",`${s.number} already in the ledger — the copy is dropped`,{letter:s.letterId,attempt:s.id});return}B&&s.number&&I.add(s.number),s.status="delivered",s.delivered=!0,s.endedAt=m,z.push({letterId:s.letterId,number:s.number,at:m,attempt:s.id}),T("delivered",`${l.to==="A"?"Alice":l.to==="B"?"Bob":"Carol"} received ${s.number||"a letter"}`,{letter:s.letterId,attempt:s.id}),r.receipts==="sign"&&(l.ackAt=m+E+W)}function C(s){if(!M){m+=s;for(const l of $)if(l.status==="moving"){if(l.lost&&m>=l.lostAt){l.status="lost",l.endedAt=m,T("lost",`the bag carrying ${l.number||"a letter"} is gone`,{letter:l.letterId,attempt:l.id});continue}m>=l.deliverAt&&F(l)}for(const l of e)!l.acked&&l.ackAt&&m>=l.ackAt&&!b.lostReceipts.some(p=>p.letter===l.seq)&&(l.acked=!0,T("ack",`the signed slip for ${l.number||l.label} reached the sender`,{letter:l.id}));if(r.retry!=="never"&&m>.01){const l=r.retry==="tuned"?2:3;for(const p of e){if(p.acked||p.attempts.length>=l)continue;const v=p.attempts[p.attempts.length-1];if(!v)continue;const i=r.retry==="tuned"?2*E+2.6:6.5;m>=v.start+i&&(T("retry",`no slip from ${p.label} — sending again`,{letter:p.id}),q(p,p.attempts.length+1))}}}}function H(){const s=e.map(o=>{const n=z.filter(h=>h.letterId===o.id),c=n.length?Math.min(...n.map(h=>h.at)):null;return{id:o.id,label:o.label,number:o.number,delivered:n.length,first:c,onTime:c!==null&&c<=b.deadline,acked:o.acked,lost:o.attempts.length>0&&o.attempts.every(h=>h.status==="lost")}}),l=s.filter(o=>o.delivered===1).length,p=s.filter(o=>o.delivered===1&&o.onTime).length,v=s.reduce((o,n)=>o+Math.max(0,n.delivered-1),0),i=s.filter(o=>o.delivered===0).length,t=e.length*1+e.length*P("numbering",r.numbering)+e.length*P("receipts",r.receipts)+(B?e.length*P("ledger",r.ledger):0)+(r.retry!=="never"?e.length*P("retry",r.retry):0)+(b.remote&&r.route==="direct"?e.length*.5:0)+($.length-e.length)*1;return{rows:s,exact:l,onTime:p,dupes:v,lost:i,total:e.length,cost:Math.round(t*10)/10,attempts:$.length,promise:p===e.length&&v===0}}function D(){for(;m<b.deadline+3;)C(.05);return M=!0,H()}return e.forEach((s,l)=>{m=Q[l],q(s,1)}),m=0,{scenario:b,rules:r,letters:e,attempts:$,deliveries:z,events:A,flightDays:E,get now(){return m},tick:C,summary:H,runAll:D,get done(){return M}}}const J=`
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
`,V=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <div class="days" id="days"></div>
    <button id="run" class="primary">▶ Run</button>
    <button id="reset" title="Reset">↺</button>
    <span class="clock mono"><b id="clock">day 0.0</b> / <span id="limit">5</span></span>
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
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`,Z=k=>{const b=k.shadowRoot??k.attachShadow({mode:"open"});b.innerHTML="<style>"+J+"</style>"+V;const r=i=>b.querySelector("#"+i),B={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},E={x:470,y:62},e={day:0,rules:{numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct"},sim:null,playing:!1,speed:2,drawnLog:0,focus:null,ended:!1};let $=0,z=0;function A(i){return e.sim?.scenario.remote&&i==="B"?E:B[i]}function I(i,t){const o=A(i),n=A(t),c=n.x-o.x,h=n.y-o.y,a=Math.hypot(c,h)||1,d=i==="A"&&t==="C"?-54:42;return{p1:o,p2:n,c:{x:(o.x+n.x)/2-h/a*d,y:(o.y+n.y)/2+c/a*d}}}function m(i,t,o,n){const c=1-n;return{x:c*c*i.x+2*c*n*t.x+n*n*o.x,y:c*c*i.y+2*c*n*t.y+n*n*o.y}}function R(){e.playing=!1,cancelAnimationFrame($)}function M(){R(),e.ended=!1,e.drawnLog=0,e.focus=null,e.sim=G({scenario:e.day,rules:e.rules}),r("verdict").classList.remove("show"),r("log").innerHTML="",r("run").textContent="▶ Run",C()}function T(){e.ended&&M(),e.playing=!0,r("run").textContent="⏸ Pause",z=performance.now(),cancelAnimationFrame($),$=requestAnimationFrame(q)}function q(i){if(!e.playing||!e.sim)return;const t=Math.min(.06,(i-z)/1e3);if(z=i,e.sim.tick(t*e.speed*1.8),C(),e.sim.now>=e.sim.scenario.deadline+2){F();return}$=requestAnimationFrame(q)}function F(){if(R(),e.ended=!0,!e.sim)return;const i=e.sim.summary();r("verdict").classList.add("show"),r("vt").innerHTML=i.promise?'<span class="ok">Promise kept.</span>':'<span class="bad">Promise broken.</span>';const t=[];i.rows.forEach(n=>{n.delivered===0?t.push(n.label+" never arrived"):n.delivered>1?t.push(n.label+" arrived "+n.delivered+" times"):n.onTime||t.push(n.label+" arrived late")}),r("vs").textContent=(t.length?t.join(" · ")+". ":"All three letters, once each. ")+i.cost+" coins of postage.";const o=r("next");o.disabled=e.day>=S.length-1,o.textContent=e.day>=S.length-1?"That is the whole slice":"Next day →",C()}function C(){e.sim&&(H(),D(),s(),r("clock").textContent="day "+Math.min(e.sim.now,e.sim.scenario.deadline).toFixed(1))}function H(){const i=r("map"),t=e.sim;if(!t)return;const o=t.flightDays,n=[];for(const[a,d]of[["A","B"],["B","C"],["A","C"]]){const u=I(a,d);n.push(`<path class="route" d="M ${u.p1.x} ${u.p1.y} Q ${u.c.x} ${u.c.y} ${u.p2.x} ${u.p2.y}" />`);const g=m(u.p1,u.c,u.p2,.5);n.push(`<text class="routelabel" x="${g.x}" y="${g.y-12}" text-anchor="middle">${o} days</text>`)}for(const a of["A","B","C"]){const d=A(a),u=Y[a],g=t.deliveries.filter(x=>t.letters.find(y=>y.id===x.letterId).to===a),f=t.scenario.remote&&a==="B";n.push(`<g class="city">
        <circle cx="${d.x}" cy="${d.y}" r="28" fill="#0f141b" stroke="${u.color}" stroke-width="2" />
        <text class="name" x="${d.x}" y="${d.y+44}" text-anchor="middle">${u.friend}</text>
        <text class="place" x="${d.x}" y="${d.y+58}" text-anchor="middle">${f?"the mountains":u.city}</text>
        <g transform="translate(${d.x+30},${d.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),g.slice(0,4).forEach((x,y)=>{n.push(`<g class="stack" transform="translate(${d.x+38+y*13},${d.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${x.number?`<text x="7" y="-4" text-anchor="middle">${x.number}</text>`:""}
        </g>`)})}const c=1.2+o;n.push('<defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#1b2230"/></pattern></defs><rect x="0" y="0" width="800" height="430" fill="url(#dots)" opacity="0.65"/>');let h=0;for(const a of t.attempts){if(a.status!=="moving")continue;const d=Math.max(0,Math.min(1,(t.now-a.start)/c)),u=.6/c,g=(.6+o)/c;let f,x=0;if(d<=u)f=A(a.from),f={x:f.x-40-h++%3*7,y:f.y-2};else if(d>=g)f=A(a.to),f={x:f.x+12,y:f.y+34};else{const w=(d-u)/(g-u),L=I(a.from,a.to);f=m(L.p1,L.c,L.p2,w);const U=m(L.p1,L.c,L.p2,Math.min(1,w+.015));x=Math.max(-20,Math.min(20,Math.atan2(U.y-f.y,U.x-f.x)*180/Math.PI)),f.y-=8;for(let N=1;N<=2;N++){const K=m(L.p1,L.c,L.p2,Math.max(0,w-N*.03));n.push('<rect x="'+(K.x-8)+'" y="'+(K.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/N+'" />')}}const y=e.focus===a.letterId;n.push('<g class="letter '+(y?"focus":"")+'" data-letter="'+a.letterId+'" style="cursor:pointer" transform="translate('+f.x+" "+f.y+") rotate("+x+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(a.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-x+' 0 -11)">'+a.number+"</text>":"")+"</g>")}for(const a of t.letters){const d=t.deliveries.find(w=>w.letterId===a.id);if(!d||t.rules.receipts!=="sign"||!a.ackAt||t.now<d.at||t.now>a.ackAt)continue;const u=(t.now-d.at)/(a.ackAt-d.at),g=t.scenario.lostReceipts.some(w=>w.letter===a.seq);if(g&&u>.55)continue;const f=I(a.to,a.from),x=m(f.p1,f.c,f.p2,u),y=g?Math.max(.15,1-Math.max(0,u-.3)/.25):1;n.push('<g transform="translate('+x.x+" "+(x.y-7)+')" opacity="'+y+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const a of t.deliveries){const d=t.now-a.at;if(d<0||d>1.1)continue;const u=t.letters.find(x=>x.id===a.letterId);if(!u)continue;const g=A(u.to),f=d/1.1;n.push('<circle cx="'+g.x+'" cy="'+g.y+'" r="'+(28+36*f)+'" fill="none" stroke="#3fb950" stroke-width="'+2.2*(1-f)+'" opacity="'+.5*(1-f)+'" />');for(let x=0;x<6;x++){const y=Math.PI*2*x/6,w=26+30*f;n.push('<circle cx="'+(g.x+Math.cos(y)*w)+'" cy="'+(g.y+Math.sin(y)*w)+'" r="1.7" fill="#3fb950" opacity="'+.75*(1-f)+'" />')}}for(const a of t.attempts){if(a.status!=="moving")continue;const d=(t.now-a.start)/c,u=.6/c,g=.8/c;if(d<u||d>g+.08)continue;const f=A(a.from),y=.75+.25*Math.min(1,(d-u)/(g-u)),w=d>g?Math.max(0,1-(d-g)/.08):1;n.push('<g transform="translate('+(f.x-26)+" "+(f.y+24)+") scale("+y+')" opacity="'+.9*w+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}i.innerHTML=n.join(""),i.querySelectorAll(".letter").forEach(a=>{a.addEventListener("click",()=>{const d=a.getAttribute("data-letter");e.focus=e.focus===d?null:d,r("log").innerHTML="",e.drawnLog=0,C()})})}function D(){const i=e.sim;if(!i)return;const t=i.summary();r("promiseState").innerHTML=e.ended?t.promise?'<span class="ok">Kept</span>':'<span class="bad">Broken</span>':'<span style="color:var(--dim);font-size:12px">in progress</span>',r("cost").textContent=t.cost+" coins",r("rows").innerHTML=t.rows.map(o=>{const n=o.delivered===0?e.ended?'<span class="bad">never</span>':'<span style="color:var(--dimmer)">in transit</span>':o.delivered>1?`<span class="bad">${o.delivered} copies</span>`:'<span class="ok">1 copy</span>';return`<div class="srow"><div class="l"><b>${o.label}</b></div><div class="c">${n}</div><div class="t mono">${o.first===null?"—":o.first.toFixed(1)+"d"}</div></div>`}).join("")}function s(){const i=e.sim;if(!i)return;const t=i.events.filter(n=>!e.focus||n.letter===e.focus),o=r("log");for(let n=e.drawnLog;n<t.length;n++){const c=t[n],h=document.createElement("div");h.className="lrow "+c.kind,h.innerHTML='<span class="lt mono">'+c.t.toFixed(1)+'</span><span class="lx">'+c.text+"</span>",o.appendChild(h)}e.drawnLog=t.length,o.scrollTop=o.scrollHeight}function l(){const i=r("rules");i.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].map(([t,o])=>{const n=_[t].map(c=>{const h=t==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[t]===c.id?"on":""} ${h?"off":""}" data-g="${t}" data-o="${c.id}" ${h?"disabled":""} title="${c.note}">
              <div class="row"><span class="nm">${c.label}</span><span class="pr mono">+${c.cost.toFixed(1)}</span></div>
              <div class="note">${h?"Needs a number on the envelope.":c.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${o}</h3>${n}</div>`}).join(""),i.querySelectorAll(".opt").forEach(t=>{t.addEventListener("click",()=>{const o=t.dataset.g;e.rules[o]=t.dataset.o,o==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),l(),M()})})}function p(i){e.day=i;const t=S[i];r("title").innerHTML=t.title+" <span>· day "+t.day+"</span>",r("limit").textContent=String(t.deadline),r("days").innerHTML=S.map((o,n)=>`<button data-d="${n}" class="${n===i?"on":""}">${o.day}</button>`).join(""),r("days").querySelectorAll("button").forEach(o=>{o.addEventListener("click",()=>p(Number(o.dataset.d)))}),l(),M()}r("run").addEventListener("click",()=>{e.playing?(R(),r("run").textContent="▶ Resume"):T()}),r("reset").addEventListener("click",()=>M()),r("again").addEventListener("click",()=>M()),r("next").addEventListener("click",()=>{e.day<S.length-1&&p(e.day+1)}),p(0);const v=new URLSearchParams(location.search);if(v.has("tlauto")){const i=Math.max(0,Math.min(S.length-1,Number(v.get("tlauto"))||0)),t=(v.get("tl")||"").split(",");p(i),t.length===4&&(e.rules={numbering:t[0],receipts:t[1],retry:t[2],ledger:t[3],route:"direct"},l(),M());const o=Number(v.get("tlat"));if(o>0){for(;e.sim&&e.sim.now<o;)e.sim.tick(.05);C()}else e.sim?.runAll(),F()}return{destroy(){R(),b.innerHTML=""}}};export{Z as default};
