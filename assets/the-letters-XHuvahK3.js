const P={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},F={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day timeout",cost:1.1,note:"Impatient. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},h=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:10,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:10,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:12,remote:!0,lostBags:[],lostReceipts:[]}],D=[.1,.25,.4],H=.4,N=.2,j=.6;function O(b,g){return h[b].remote?g==="relay"?3:4:2}function I(b,g){const n=F[b].find(y=>y.id===g);return n?n.cost:0}function K(b={}){const g=h[b.scenario??0],n={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...b.rules||{}},y=n.ledger==="on"&&n.numbering!=="none",w=O(b.scenario??0,n.route),e=[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}].map(o=>({...o,number:n.numbering==="serial"?`${o.from}-${String(o.seq).padStart(2,"0")}`:n.numbering==="date"?"DAY-"+g.day:null,attempts:[],acked:!1,ackAt:null})),x=[],M=[],C=[],k=new Set;let p=0,R=0,S=!1;const v=(o,l,t={})=>{C.push({t:p,kind:o,text:l,...t})};function $(o,l){const t={id:"a"+ ++R,letterId:o.id,number:o.number,from:o.from,to:o.to,attempt:l,start:p,delivered:!1,status:"moving",deliverAt:p+H+N+w+N+H,lost:g.lostBags.some(r=>r.letter===o.seq&&r.attempt===l),lostAt:p+H+N+w*.55};return o.attempts.push(t),x.push(t),v("sent",`${o.label} left the desk${t.number?" ["+t.number+"]":""}`,{letter:o.id,attempt:t.id}),t}function q(o){const l=e.find(t=>t.id===o.letterId);if(y&&o.number&&k.has(o.number)){o.status="dropped",o.endedAt=p,v("dropped",`${o.number} already in the ledger — the copy is dropped`,{letter:o.letterId,attempt:o.id});return}y&&o.number&&k.add(o.number),o.status="delivered",o.delivered=!0,o.endedAt=p,M.push({letterId:o.letterId,number:o.number,at:p,attempt:o.id}),v("delivered",`${l.to==="A"?"Alice":l.to==="B"?"Bob":"Carol"} received ${o.number||"a letter"}`,{letter:o.letterId,attempt:o.id}),n.receipts==="sign"&&(l.ackAt=p+w+j)}function E(o){if(!S){p+=o;for(const l of x)if(l.status==="moving"){if(l.lost&&p>=l.lostAt){l.status="lost",l.endedAt=p,v("lost",`the bag carrying ${l.number||"a letter"} is gone`,{letter:l.letterId,attempt:l.id});continue}p>=l.deliverAt&&q(l)}for(const l of e)!l.acked&&l.ackAt&&p>=l.ackAt&&!g.lostReceipts.some(t=>t.letter===l.seq)&&(l.acked=!0,v("ack",`the signed slip for ${l.number||l.label} reached the sender`,{letter:l.id}));if(n.retry!=="never"&&p>.01){const l=n.retry==="tuned"?2:3;for(const t of e){if(t.acked||t.attempts.length>=l)continue;const r=t.attempts[t.attempts.length-1];if(!r)continue;const a=n.retry==="tuned"?2*w+2.6:6.5;p>=r.start+a&&(v("retry",`no slip from ${t.label} — sending again`,{letter:t.id}),$(t,t.attempts.length+1))}}}}function z(){const o=e.map(i=>{const f=M.filter(d=>d.letterId===i.id),c=f.length?Math.min(...f.map(d=>d.at)):null;return{id:i.id,label:i.label,number:i.number,delivered:f.length,first:c,onTime:c!==null&&c<=g.deadline,acked:i.acked,lost:i.attempts.length>0&&i.attempts.every(d=>d.status==="lost")}}),l=o.filter(i=>i.delivered===1).length,t=o.filter(i=>i.delivered===1&&i.onTime).length,r=o.reduce((i,f)=>i+Math.max(0,f.delivered-1),0),a=o.filter(i=>i.delivered===0).length,s=e.length*1+e.length*I("numbering",n.numbering)+e.length*I("receipts",n.receipts)+(y?e.length*I("ledger",n.ledger):0)+(n.retry!=="never"?e.length*I("retry",n.retry):0)+(g.remote&&n.route==="direct"?e.length*.5:0)+(x.length-e.length)*1;return{rows:o,exact:l,onTime:t,dupes:r,lost:a,total:e.length,cost:Math.round(s*10)/10,attempts:x.length,promise:t===e.length&&r===0}}function B(){for(;p<g.deadline+3;)E(.05);return S=!0,z()}return e.forEach((o,l)=>{p=D[l],$(o,1)}),p=0,{scenario:g,rules:n,letters:e,attempts:x,deliveries:M,events:C,flightDays:w,get now(){return p},tick:E,summary:z,runAll:B,get done(){return S}}}const U=`
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
`,_=`
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
      <h3 class="grp" style="margin-bottom:8px">Post office rules</h3>
      <div class="rulegrid" id="rules"></div>
      <div style="font-size:9.5px;color:var(--dimmer);margin-top:6px;line-height:1.4">Rules apply to all three offices. Prices are per letter, in postage.</div>
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
`,Y=b=>{const g=b.shadowRoot??b.attachShadow({mode:"open"});g.innerHTML="<style>"+U+"</style>"+_;const n=t=>g.querySelector("#"+t),y={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},w={x:470,y:62},e={day:0,rules:{numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct"},sim:null,playing:!1,speed:2,timer:null,drawnLog:0,focus:null,ended:!1};function x(t){return e.sim?.scenario.remote&&t==="B"?w:y[t]}function M(t,r){const a=x(t),s=x(r),i=s.x-a.x,f=s.y-a.y,c=Math.hypot(i,f)||1,d=t==="A"&&r==="C"?-54:42;return{p1:a,p2:s,c:{x:(a.x+s.x)/2-f/c*d,y:(a.y+s.y)/2+i/c*d}}}function C(t,r,a,s){const i=1-s;return{x:i*i*t.x+2*i*s*r.x+s*s*a.x,y:i*i*t.y+2*i*s*r.y+s*s*a.y}}function k(){e.playing=!1,e.timer&&(clearInterval(e.timer),e.timer=null)}function p(){k(),e.ended=!1,e.drawnLog=0,e.focus=null,e.sim=K({scenario:e.day,rules:e.rules}),n("verdict").classList.remove("show"),n("log").innerHTML="",n("run").textContent="▶ Run",$()}function R(){e.ended&&p(),e.playing=!0,n("run").textContent="⏸ Pause",e.timer&&clearInterval(e.timer),e.timer=setInterval(S,33)}function S(){!e.playing||!e.sim||(e.sim.tick(.033*e.speed*.9),$(),e.sim.now>=e.sim.scenario.deadline+2&&v())}function v(){if(k(),e.ended=!0,!e.sim)return;const t=e.sim.summary();n("verdict").classList.add("show"),n("vt").innerHTML=t.promise?'<span class="ok">Promise kept.</span>':'<span class="bad">Promise broken.</span>';const r=[];t.rows.forEach(s=>{s.delivered===0?r.push(s.label+" never arrived"):s.delivered>1?r.push(s.label+" arrived "+s.delivered+" times"):s.onTime||r.push(s.label+" arrived late")}),n("vs").textContent=(r.length?r.join(" · ")+". ":"All three letters, once each. ")+t.cost+" coins of postage.";const a=n("next");a.disabled=e.day>=h.length-1,a.textContent=e.day>=h.length-1?"That is the whole slice":"Next day →",$()}function $(){e.sim&&(q(),E(),z(),n("clock").textContent="day "+Math.min(e.sim.now,e.sim.scenario.deadline).toFixed(1))}function q(){const t=n("map"),r=e.sim;if(!r)return;const a=r.flightDays,s=[];for(const[c,d]of[["A","B"],["B","C"],["A","C"]]){const m=M(c,d);s.push(`<path class="route" d="M ${m.p1.x} ${m.p1.y} Q ${m.c.x} ${m.c.y} ${m.p2.x} ${m.p2.y}" />`);const A=C(m.p1,m.c,m.p2,.5);s.push(`<text class="routelabel" x="${A.x}" y="${A.y-12}" text-anchor="middle">${a} days</text>`)}for(const c of["A","B","C"]){const d=x(c),m=P[c],A=r.deliveries.filter(T=>r.letters.find(L=>L.id===T.letterId).to===c),u=r.scenario.remote&&c==="B";s.push(`<g class="city">
        <circle cx="${d.x}" cy="${d.y}" r="28" fill="#0f141b" stroke="${m.color}" stroke-width="2" />
        <text class="name" x="${d.x}" y="${d.y+44}" text-anchor="middle">${m.friend}</text>
        <text class="place" x="${d.x}" y="${d.y+58}" text-anchor="middle">${u?"the mountains":m.city}</text>
        <g transform="translate(${d.x+30},${d.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),A.slice(0,4).forEach((T,L)=>{s.push(`<g class="stack" transform="translate(${d.x+38+L*13},${d.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${T.number?`<text x="7" y="-4" text-anchor="middle">${T.number}</text>`:""}
        </g>`)})}const i=1.2+a;let f=0;for(const c of r.attempts){if(c.status!=="moving")continue;const d=Math.max(0,Math.min(1,(r.now-c.start)/i)),m=.6/i,A=(.6+a)/i;let u;if(d<=m)u=x(c.from),u={x:u.x-40-f++%3*7,y:u.y-2};else if(d>=A)u=x(c.to),u={x:u.x+12,y:u.y+34};else{const T=(d-m)/(A-m),L=M(c.from,c.to);u=C(L.p1,L.c,L.p2,T),u.y-=8}s.push(`<g class="letter" data-letter="${c.letterId}" style="cursor:pointer">
        <rect x="${u.x-10}" y="${u.y-7}" width="20" height="14" rx="2" />
        <path d="M ${u.x-10} ${u.y-7} L ${u.x} ${u.y} L ${u.x+10} ${u.y-7}" />
        ${c.number?`<text x="${u.x}" y="${u.y-11}" text-anchor="middle">${c.number}</text>`:""}
      </g>`)}t.innerHTML=s.join(""),t.querySelectorAll(".letter").forEach(c=>{c.addEventListener("click",()=>{const d=c.getAttribute("data-letter");e.focus=e.focus===d?null:d,n("log").innerHTML="",e.drawnLog=0,$()})})}function E(){const t=e.sim;if(!t)return;const r=t.summary();n("promiseState").innerHTML=e.ended?r.promise?'<span class="ok">Kept</span>':'<span class="bad">Broken</span>':'<span style="color:var(--dim);font-size:12px">in progress</span>',n("cost").textContent=r.cost+" coins",n("rows").innerHTML=r.rows.map(a=>{const s=a.delivered===0?e.ended?'<span class="bad">never</span>':'<span style="color:var(--dimmer)">in transit</span>':a.delivered>1?`<span class="bad">${a.delivered} copies</span>`:'<span class="ok">1 copy</span>';return`<div class="srow"><div class="l"><b>${a.label}</b></div><div class="c">${s}</div><div class="t mono">${a.first===null?"—":a.first.toFixed(1)+"d"}</div></div>`}).join("")}function z(){const t=e.sim;if(!t)return;const r=t.events.filter(s=>!e.focus||s.letter===e.focus),a=n("log");for(let s=e.drawnLog;s<r.length;s++){const i=r[s],f=document.createElement("div");f.className="lrow "+i.kind,f.innerHTML='<span class="lt mono">'+i.t.toFixed(1)+'</span><span class="lx">'+i.text+"</span>",a.appendChild(f)}e.drawnLog=r.length,a.scrollTop=a.scrollHeight}function B(){const t=n("rules");t.innerHTML=[["numbering","Numbering"],["receipts","Receipts"],["retry","If no receipt"],["ledger","At the far office"]].map(([r,a])=>{const s=F[r].map(i=>{const f=r==="ledger"&&e.rules.numbering==="none";return`<button class="opt ${e.rules[r]===i.id?"on":""} ${f?"off":""}" data-g="${r}" data-o="${i.id}" ${f?"disabled":""} title="${i.note}">
              <div class="row"><span class="nm">${i.label}</span><span class="pr mono">+${i.cost.toFixed(1)}</span></div>
              <div class="note">${f?"Needs a number on the envelope.":i.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${a}</h3>${s}</div>`}).join(""),t.querySelectorAll(".opt").forEach(r=>{r.addEventListener("click",()=>{const a=r.dataset.g;e.rules[a]=r.dataset.o,a==="numbering"&&e.rules.numbering==="none"&&(e.rules.ledger="off"),B(),p()})})}function o(t){e.day=t;const r=h[t];n("title").innerHTML=r.title+" <span>· day "+r.day+"</span>",n("limit").textContent=String(r.deadline),n("days").innerHTML=h.map((a,s)=>`<button data-d="${s}" class="${s===t?"on":""}">${a.day}</button>`).join(""),n("days").querySelectorAll("button").forEach(a=>{a.addEventListener("click",()=>o(Number(a.dataset.d)))}),B(),p()}n("run").addEventListener("click",()=>{e.playing?(k(),n("run").textContent="▶ Resume"):R()}),n("reset").addEventListener("click",()=>p()),n("again").addEventListener("click",()=>p()),n("next").addEventListener("click",()=>{e.day<h.length-1&&o(e.day+1)}),o(0);const l=new URLSearchParams(location.search);if(l.has("tlauto")){const t=Math.max(0,Math.min(h.length-1,Number(l.get("tlauto"))||0)),r=(l.get("tl")||"").split(",");o(t),r.length===4&&(e.rules={numbering:r[0],receipts:r[1],retry:r[2],ledger:r[3],route:"direct"},B(),p()),e.sim?.runAll(),v()}return{destroy(){k(),g.innerHTML=""}}};export{Y as default};
