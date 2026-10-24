const C={A:{id:"A",name:"Retry until it works",tag:"naive",assumption:"A lost reply means the request never happened.",mechanism:"Resend every 150 ms, forever. New id each time.",fixes:"Nothing. This is what everyone writes first.",price:"One duplicate effect per lost reply.",stableId:!1,dedup:!1,backoff:!1,timeout:150,maxAttempts:40},B:{id:"B",name:"Retry with backoff",tag:"plausible",assumption:"Same as A, but polite about it.",mechanism:"Backoff 150 ms → 800 ms. Still a new id.",fixes:"Retry storms. Not duplicates.",price:"Higher tail latency; duplicates unchanged.",stableId:!1,dedup:!1,backoff:!0,timeout:150,maxAttempts:40},C:{id:"C",name:"Stable id + server dedup",tag:"correct",assumption:"The client can name a request; the server remembers names.",mechanism:"One id per operation; the server skips ids it has seen.",fixes:"Duplicate effects.",price:"Unbounded dedup table; retries still unbounded.",stableId:!0,dedup:!0,backoff:!1,timeout:150,maxAttempts:40},D:{id:"D",name:"Idempotency key + cached reply",tag:"production",assumption:"The server also remembers the reply it sent.",mechanism:"Stable id + cached reply; 800 ms deadline, 6 attempts.",fixes:"Duplicate effects; clients stuck on a lost reply.",price:"Real deadline failures; the table needs expiry.",stableId:!0,dedup:!0,backoff:!0,timeout:150,deadline:800,maxAttempts:6}},h=["alice","bob","carol","dave","erin"],_=4e5;function G(c){return c=c>>>0,function(){c=c+1831565813>>>0;let l=c;return l=Math.imul(l^l>>>15,1|l),l=l+Math.imul(l^l>>>7,61|l)^l,((l^l>>>14)>>>0)/4294967296}}function X(c={}){const l=(c.seed??1)>>>0,i=c.design??"A",t=C[i];if(!t)throw new Error("unknown design "+i);const m={reqDrop:c.faults?.reqDrop??.05,respDrop:c.faults?.respDrop??.05,dup:c.faults?.dup??.02},M=c.clients??3,D=c.opsPerClient??20,q=c.recordTrace!==!1,g=G(l^2654435769),S=G(l*2654435761>>>0);function I(e){if(e%3===0){const b=100+e;return{id:"o"+e,kind:"reserve",seat:b,from:"",to:"",amt:0,label:"reserve(seat "+b+")"}}let a=Math.floor(S()*h.length),o=Math.floor(S()*(h.length-1));o>=a&&(o+=1);const p=1+Math.floor(S()*5);return{id:"o"+e,kind:"transfer",from:h[a],to:h[o],amt:p,seat:0,label:"transfer("+h[a]+"→"+h[o]+", $"+p+")"}}const z=[];for(let e=0;e<M*D;e++)z.push(I(e));const A=[];for(let e=0;e<M;e++)A.push({id:"c"+(e+1),idx:0,ops:z.filter((a,o)=>o%M===e),current:null});const w={};h.forEach(e=>w[e]=100);const R=h.length*100,E={},s={},n={seen:new Map,applied:0,dedupHits:0},r={sent:0,applied:0,dedupHits:0,completed:0,failed:0,latencies:[]},u=[];let d=0,x=0;const f=[];function L(e){let a=0,o=f.length;for(;a<o;){const p=a+o>>1,b=f[p];b.t<e.t||b.t===e.t&&b.seq<e.seq?a=p+1:o=p}f.splice(a,0,e)}function y(e,a){L({t:d+Math.max(0,e),seq:x++,fn:a})}function v(e,a,o){q&&u.push({t:d,seq:x++,kind:e,node:a,text:o})}function J(e){s[e.id]=(s[e.id]||0)+1,n.applied++,r.applied++,e.kind==="transfer"?(w[e.from]-=e.amt,w[e.to]+=e.amt):E[e.seat]=(E[e.seat]||0)+1}function T(){return A.every(e=>e.idx>=e.ops.length)}function N(e){if(e.idx>=e.ops.length){e.current=null;return}const o={op:e.ops[e.idx],attempts:0,done:!1,firstAt:d,deadlineAt:d+(t.deadline??1/0),reqId:null};e.current=o,j(e,o)}function $(e,a,o){if(a.done)return;a.done=!0;const p=d-a.firstAt;o==="ok"?(r.completed++,r.latencies.push(p),v("done","client",a.op.label+" done in "+Math.round(p)+" ms, "+a.attempts+" attempt(s)")):o==="timeout"?(r.failed++,v("timeout","client",a.op.label+" gave up at the 800 ms deadline")):(r.failed++,v("timeout","client",a.op.label+" stuck after "+a.attempts+" attempts")),e.idx++,y(4+g()*10,()=>N(e))}function j(e,a){if(a.done)return;if(a.attempts++,a.attempts>t.maxAttempts){$(e,a,"stuck");return}const o=t.stableId?a.op.id:a.op.id+"#a"+a.attempts;a.reqId=o,r.sent++,v("send","client","→ "+a.op.label+"  ["+o+"]");const p=20+g()*40;g()<m.reqDrop?v("drop","net","request "+o+" lost in flight"):(g()<m.dup&&(v("dup","net","request "+o+" duplicated by the network"),y(p+18,()=>F({op:a.op,reqId:o},e,a))),y(p,()=>F({op:a.op,reqId:o},e,a)));const b=t.backoff?Math.min(800,t.timeout*Math.pow(2,a.attempts-1)):t.timeout;y(b,()=>{if(!a.done){if(t.deadline&&d>=a.deadlineAt){$(e,a,"timeout");return}v("retry","client","no reply after "+Math.round(b)+" ms → retry #"+(a.attempts+1)),j(e,a)}})}function F(e,a,o){if(v("recv","server","req "+e.reqId),t.dedup&&n.seen.has(e.reqId)){n.dedupHits++,r.dedupHits++,v("dedup","server","already applied "+e.reqId+" → resend cached reply"),B(e.reqId,a,o);return}J(e.op),t.dedup&&n.seen.set(e.reqId,{ok:!0}),v("apply","server",e.op.label+" applied  (effect #"+s[e.op.id]+")"),B(e.reqId,a,o)}function B(e,a,o){const p=20+g()*40;if(g()<m.respDrop){v("drop","net","reply for "+e+" lost in flight");return}g()<m.dup&&(v("dup","net","reply for "+e+" duplicated"),y(p+18,()=>P(e,a,o))),y(p,()=>P(e,a,o))}function P(e,a,o){if(o.done){v("recv","client","late reply "+e+" ignored");return}v("recv","client","← ok "+e),$(a,o,"ok")}function H(){if(!f.length||T())return!1;const e=f.shift();return d=e.t,e.fn(),!0}function K(e){let a=0;for(;f.length&&f[0].t<=e&&!T()&&a<_;)H(),a++;return T()&&(f.length=0),d}function Q(){let e=0;for(;f.length&&!T()&&e<_;)H(),e++;return f.length=0,W()}function U(e,a){if(!e.length)return 0;const o=[...e].sort((p,b)=>p-b);return o[Math.min(o.length-1,Math.floor(a/100*o.length))]}function W(){const e=Object.keys(s).length,a=Object.values(s).reduce((k,O)=>k+O,0)-e,o=Object.values(s).filter(k=>k>1).length,p=Object.values(w).reduce((k,O)=>k+O,0),b=Object.values(E).filter(k=>k>1).length;return{design:i,seed:l,ops:z.length,sent:r.sent,applied:r.applied,dedupHits:r.dedupHits,dupEffects:a,dupOps:o,completed:r.completed,failed:r.failed,dedupTable:n.seen.size,p50:Math.round(U(r.latencies,50)),p99:Math.round(U(r.latencies,99)),total:p,initialTotal:R,conserved:p===R,doubleBooked:b,done:r.completed+r.failed,ms:Math.round(d)}}return{get now(){return d},get trace(){return u},get done(){return T()},get server(){return n},stepEvent:H,runUntil:K,runAll:Q,summary:W,start:()=>{A.forEach(e=>y(0,()=>N(e)))}}}const V=`
:host { display: block; }
* { box-sizing: border-box; }
.wrap {
  --line: #242a34; --panel: #12151b; --panel2: #171b22;
  --text: #e6e9ef; --dim: #8b94a3; --dimmer: #5c6472;
  --blue: #58a6ff; --green: #3fb950; --red: #f85149; --amber: #d29922; --violet: #a371f7;
  color: var(--text);
  font: 13.5px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
  background: #0e1116;
}
.mono { font-family: "SF Mono", ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums; }
button {
  font: inherit; font-size: 12px; color: var(--text); background: var(--panel2);
  border: 1px solid var(--line); border-radius: 7px; padding: 6px 10px; cursor: pointer;
}
button:hover { border-color: #3a4350; }
button.primary { background: #17303f; border-color: #235068; color: #cdeaf7; }
button.primary:hover { background: #1b3a4c; }
button:disabled { opacity: .45; cursor: default; }
input[type="number"], select {
  font: inherit; font-size: 12px; color: var(--text); background: var(--panel2);
  border: 1px solid var(--line); border-radius: 7px; padding: 5px 7px;
}
input[type="range"] { accent-color: var(--blue); height: 18px; }

.bar { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; padding: 9px 12px; border-bottom: 1px solid var(--line); background: #0f1319; }
.bar .lbl { font-size: 9.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--dimmer); }
.bar #seed { width: 70px; }
.bar .spacer { flex: 1; }
.bar .speed { display: flex; align-items: center; gap: 6px; }
.bar .speed input { width: 82px; }
.bar .speed .val { font-size: 11px; color: var(--dim); width: 22px; }

.predictbar { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; padding: 8px 12px; border-bottom: 1px solid var(--line); background: #0c1015; font-size: 11.5px; }
.predictbar .tag { font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--blue); }
.predictbar .q { color: var(--dim); }
.predictbar .verdict { margin-left: auto; color: var(--text); }
.predictbar .verdict b { color: var(--blue); }
.miss { color: var(--amber); }

.shelf { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 11px 12px 4px; }
.card { border: 1px solid var(--line); background: var(--panel); border-radius: 9px; padding: 8px 10px; cursor: pointer; transition: border-color .12s, background .12s; }
.card:hover { border-color: #37404e; }
.card.on { border-color: var(--blue); background: #141c24; }
.card .top { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.card .id { font: 600 9.5px/1 "SF Mono", monospace; color: #0b0d10; background: var(--dim); width: 15px; height: 15px; display: grid; place-items: center; border-radius: 4px; flex: none; }
.card.on .id { background: var(--blue); }
.card .nm { font-size: 12px; font-weight: 560; }
.card .tag { font-size: 8.5px; color: var(--dimmer); text-transform: uppercase; letter-spacing: .08em; margin-left: auto; }
.card .body { font-size: 10.5px; color: var(--dim); line-height: 1.38; }
.card .body .k { color: var(--dimmer); font-size: 8.5px; text-transform: uppercase; letter-spacing: .06em; margin-right: 4px; }
.card .body .crow { margin-top: 2px; }

.faults { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 8px 12px 12px; }
.fault label { display: flex; justify-content: space-between; font-size: 11px; color: var(--dim); }
.fault label .val { color: var(--text); }
.fault input { width: 100%; }

.stage { border-top: 1px solid var(--line); }
.topo { position: relative; height: 84px; padding: 0 14px; background: #0c1016; border-bottom: 1px solid var(--line); }
.node { position: absolute; top: 22px; width: 104px; padding: 6px 9px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel); font-size: 11px; }
.node.left { left: 14px; }
.node.right { right: 14px; }
.node .n { font-weight: 600; font-size: 11.5px; }
.node .s { color: var(--dim); font-size: 10px; margin-top: 1px; }
.wire { position: absolute; left: 130px; right: 130px; height: 1px; background: #2a3140; transition: background .15s, box-shadow .15s; }
.wire.w1 { top: 42px; }
.wire.w2 { top: 62px; }
.wire .lab { position: absolute; left: 50%; transform: translate(-50%, -140%); font-size: 8.5px; letter-spacing: .09em; text-transform: uppercase; color: var(--dimmer); background: #0c1016; padding: 0 5px; }
.wire.pulse { background: var(--blue); box-shadow: 0 0 10px rgba(88,166,255,.5); }

.stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--line); border-bottom: 1px solid var(--line); }
.stat { background: var(--panel); padding: 9px 11px; }
.stat .k { font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: var(--dimmer); margin-bottom: 3px; }
.stat .v { font-size: 18px; font-weight: 520; letter-spacing: -.02em; }
.stat .v.bad { color: var(--red); }
.stat .v.good { color: var(--green); }
.stat .sub { font-size: 9.5px; color: var(--dimmer); }

.inv { padding: 9px 12px; }
.inv .line { display: flex; align-items: center; gap: 8px; font-size: 11.5px; padding: 3px 0; }
.pill { font: 600 8.5px/1 "SF Mono", monospace; letter-spacing: .06em; padding: 3px 5px; border-radius: 4px; flex: none; }
.pill.pass { color: #052e16; background: var(--green); }
.pill.fail { color: #450a0a; background: var(--red); }
.pill.note { color: var(--amber); background: transparent; border: 1px solid #4a3a12; }
.inv .txt { color: var(--dim); }
.inv .txt b { color: var(--text); font-weight: 500; }

.tracebox { border-top: 1px solid var(--line); }
.th { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 12px 6px; }
.th h3 { font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0; font-weight: 600; }
.th .clock { font-size: 10px; color: var(--dimmer); }
.rows { height: 230px; overflow-y: auto; padding: 0 12px 8px; font-size: 11px; }
.rows .empty { color: var(--dimmer); padding: 10px 0; }
.row { display: grid; grid-template-columns: 62px 46px 1fr; gap: 6px; padding: 1.5px 0; border-bottom: 1px solid #151a21; }
.row .t { color: var(--dimmer); font-size: 10px; }
.row .n { font-size: 8.5px; letter-spacing: .05em; text-transform: uppercase; color: var(--dimmer); padding-top: 1px; }
.row .x { color: #b6bec9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row.send .x { color: var(--blue); }
.row.drop .x { color: var(--red); }
.row.dup .x { color: var(--amber); }
.row.apply .x { color: var(--green); }
.row.dedup .x { color: var(--violet); }
.row.retry .x { color: var(--amber); }
.row.done .x { color: var(--green); }
.row.timeout .x { color: var(--red); }

.chart { border-top: 1px solid var(--line); padding: 11px 12px 14px; }
.ch { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 9px; }
.ch h3 { font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0; font-weight: 600; }
.bar-row { display: grid; grid-template-columns: 150px 1fr 46px; gap: 8px; align-items: center; margin-bottom: 6px; font-size: 11px; }
.bar-row .nm { color: var(--dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-row .nm b { color: var(--text); font-weight: 500; }
.bar-row .track { height: 13px; background: #171b22; border-radius: 3px; overflow: hidden; }
.bar-row .fill { height: 100%; background: #3b82f6; border-radius: 3px; transition: width .3s; }
.bar-row .fill.zero { background: var(--green); }
.bar-row .n { text-align: right; }
.hint { font-size: 10.5px; color: var(--dimmer); margin-top: 6px; line-height: 1.45; }

.lesson { margin-top: 13px; padding-top: 10px; border-top: 1px solid var(--line); }
.lesson h3 { font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0 0 6px; font-weight: 600; }
.lesson ul { margin: 0; padding-left: 15px; }
.lesson li { font-size: 11px; color: var(--dim); line-height: 1.5; margin-bottom: 3px; }
.lesson b { color: var(--text); font-weight: 500; }

@media (max-width: 640px) {
  .shelf { grid-template-columns: 1fr; }
  .faults { grid-template-columns: 1fr; gap: 8px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .predictbar .verdict { margin-left: 0; width: 100%; }
  .bar-row { grid-template-columns: 110px 1fr 40px; }
}
`,Y=`
<div class="wrap">
  <div class="bar">
    <span class="lbl">seed</span>
    <input type="number" id="seed" value="1" min="0" max="999999" />
    <button id="rand" title="Random seed">rnd</button>
    <button id="play" class="primary">▶ Run</button>
    <button id="step" title="Advance one event">›|</button>
    <button id="reset" title="Reset">↺</button>
    <span class="spacer"></span>
    <span class="speed"><input type="range" id="speed" min="0" max="4" value="1" step="1" /><span class="val mono" id="vSpeed">1×</span></span>
  </div>

  <div class="predictbar">
    <span class="tag">Predict</span>
    <span class="q">how many of the 60 operations get applied twice?</span>
    <select id="predict">
      <option value="0">0 — dedup is not needed</option>
      <option value="1">about 1</option>
      <option value="3" selected>about 3</option>
      <option value="6">about 6</option>
      <option value="12">about 12</option>
    </select>
    <span class="verdict" id="verdict"></span>
  </div>

  <div class="shelf" id="shelf"></div>

  <div class="faults">
    <div class="fault">
      <label for="reqDrop">Request loss <span class="val mono" id="vReq">5%</span></label>
      <input type="range" id="reqDrop" min="0" max="30" value="5" />
    </div>
    <div class="fault">
      <label for="respDrop">Reply loss <span class="val mono" id="vResp">5%</span></label>
      <input type="range" id="respDrop" min="0" max="30" value="5" />
    </div>
    <div class="fault">
      <label for="dup">Duplication <span class="val mono" id="vDup">2%</span></label>
      <input type="range" id="dup" min="0" max="20" value="2" />
    </div>
  </div>

  <div class="stage">
    <div class="topo">
      <div class="node left"><div class="n">client</div><div class="s" id="clientSub">idle</div></div>
      <div class="wire w1" id="wire1"><span class="lab">request</span></div>
      <div class="wire w2" id="wire2"><span class="lab">reply</span></div>
      <div class="node right"><div class="n">server</div><div class="s" id="serverSub">0 applied</div></div>
    </div>

    <div class="stats">
      <div class="stat"><div class="k">On the wire</div><div class="v mono" id="mSent">0</div><div class="sub">requests sent</div></div>
      <div class="stat"><div class="k">Applied</div><div class="v mono" id="mApplied">0</div><div class="sub">effects on state</div></div>
      <div class="stat"><div class="k">Duplicates</div><div class="v mono" id="mDup">0</div><div class="sub">extra effects</div></div>
      <div class="stat"><div class="k">p99</div><div class="v mono" id="mP99">—</div><div class="sub">completion</div></div>
      <div class="stat"><div class="k">Failed</div><div class="v mono" id="mFail">0</div><div class="sub">gave up</div></div>
    </div>

    <div class="inv" id="inv"></div>
  </div>

  <div class="tracebox">
    <div class="th"><h3>Trace</h3><span class="clock mono" id="clock">t = 0.000 s</span></div>
    <div class="rows" id="rows"><div class="empty">Press Run. Then switch designs with the seed fixed.</div></div>
  </div>

  <div class="chart">
    <div class="ch">
      <h3>Same workload, four designs · 60 seeds each</h3>
      <button id="sweep" style="padding:4px 9px;font-size:11px">Run sweep</button>
    </div>
    <div id="bars"><div class="empty" style="color:var(--dimmer);font-size:11px">Running the sweep…</div></div>
    <div class="hint" id="sweepNote"></div>

    <div class="lesson">
      <h3>What to notice</h3>
      <ul>
        <li><b>A and B</b> apply the same operation twice: backoff changes the timing, not the correctness.</li>
        <li><b>C and D</b> apply it once. The fix is the request's identity, not the retry policy.</li>
        <li><b>I1 stays green</b> while money is spent twice. A check only catches what it checks.</li>
      </ul>
    </div>
  </div>
</div>
`,Z=c=>{const l=c.shadowRoot??c.attachShadow({mode:"open"});l.innerHTML="<style>"+V+"</style>"+Y;const i=s=>l.querySelector("#"+s),t={design:"A",seed:1,speed:1,playing:!1,faults:{reqDrop:.05,respDrop:.05,dup:.02},sim:null,drawn:0,lastFrame:0,predicted:3,timer:null,flash:new Map};function m(){t.timer&&(clearInterval(t.timer),t.timer=null),t.sim=X({seed:t.seed,design:t.design,faults:t.faults}),t.sim.start(),t.drawn=0,t.playing=!1,i("play").textContent="▶ Run",i("rows").innerHTML='<div class="empty">Press Run. Then switch designs with the seed fixed.</div>',i("verdict").textContent="",M(),q()}function M(){i("shelf").innerHTML=Object.values(C).map(s=>`
      <div class="card ${t.design===s.id?"on":""}" data-d="${s.id}">
        <div class="top"><span class="id">${s.id}</span><span class="nm">${s.name}</span><span class="tag">${s.tag}</span></div>
        <div class="body">
          <div class="crow"><span class="k">assumes</span>${s.assumption}</div>
          <div class="crow"><span class="k">does</span>${s.mechanism}</div>
          <div class="crow"><span class="k">fixes</span>${s.fixes} <span class="k" style="margin-left:5px">costs</span>${s.price}</div>
        </div>
      </div>`).join(""),l.querySelectorAll(".card").forEach(s=>{s.addEventListener("click",()=>{t.design=s.dataset.d||"A",m()})})}const D=s=>(s/1e3).toFixed(3);function q(){const s=t.sim;if(!s)return;const n=s.summary();i("mSent").textContent=String(n.sent),i("mApplied").textContent=String(n.applied),i("mDup").textContent=String(n.dupEffects),i("mDup").className="v mono "+(n.dupEffects>0?"bad":"good"),i("mP99").textContent=n.completed?n.p99+" ms":"—",i("mFail").textContent=String(n.failed),i("clock").textContent="t = "+D(s.now)+" s",i("serverSub").textContent=n.applied+" applied",i("clientSub").textContent=s.done?"finished":t.playing?"running":s.now===0?"idle":"paused";const r=n.dupEffects>0?'<span class="pill note">check passed, system wrong</span>':"";i("inv").innerHTML=`
      <div class="line"><span class="pill ${n.conserved?"pass":"fail"}">${n.conserved?"PASS":"FAIL"}</span>
        <span class="txt"><b>I1</b> money is conserved — Σ balances = ${n.total}</span>${r}</div>
      <div class="line"><span class="pill ${n.doubleBooked?"fail":"pass"}">${n.doubleBooked?"FAIL":"PASS"}</span>
        <span class="txt"><b>I2</b> no seat is double-booked${n.doubleBooked?" — "+n.doubleBooked+" seats":""}</span></div>
      <div class="line"><span class="pill ${n.dupEffects?"fail":"pass"}">${n.dupEffects?"FAIL":"PASS"}</span>
        <span class="txt"><b>I5</b> each operation has exactly one effect${n.dupEffects?" — "+n.dupEffects+" extra":""}</span></div>`}function g(s){const n=i(s);n.classList.add("pulse");const r=t.flash.get(s);r&&clearTimeout(r),t.flash.set(s,setTimeout(()=>{n.classList.remove("pulse"),t.flash.delete(s)},180))}function S(){const s=t.sim;if(!s)return;const n=s.trace,r=i("rows");t.drawn===0&&(r.innerHTML="");for(let u=t.drawn;u<n.length;u++){const d=n[u],x=document.createElement("div");x.className="row "+d.kind,x.innerHTML='<span class="t mono">'+D(d.t)+'</span><span class="n">'+d.node+'</span><span class="x">'+d.text+"</span>",r.appendChild(x),d.kind==="send"&&g("wire1"),d.kind==="recv"&&d.node==="client"&&g("wire2")}t.drawn=n.length,n.length&&(r.scrollTop=r.scrollHeight)}function I(){const s=t.sim;if(!s)return;const n=s.summary(),r=Math.abs(n.dupEffects-t.predicted)<=1;i("verdict").innerHTML="predicted <b>"+t.predicted+"</b> · observed <b>"+n.dupEffects+"</b> "+(r?'<span style="color:var(--green)">— close</span>':'<span class="miss">— the gap is the lesson</span>')}function z(){if(!t.playing||!t.sim)return;const s=performance.now(),n=Math.min(100,s-t.lastFrame||16);t.lastFrame=s,t.sim.runUntil(t.sim.now+n*t.speed*.9),q(),S(),t.sim.done&&(t.playing=!1,t.timer&&(clearInterval(t.timer),t.timer=null),i("play").textContent="▶ Run",I())}function A(){t.sim&&(t.sim.done&&m(),t.playing=!0,i("play").textContent="⏸ Pause",t.lastFrame=performance.now(),t.timer&&clearInterval(t.timer),t.timer=setInterval(z,30))}function w(){const s={};for(const r of Object.keys(C)){const u=[];for(let x=1;x<=60;x++){const f=X({seed:x,design:r,faults:t.faults,recordTrace:!1});f.start(),u.push(f.runAll())}const d=x=>u.reduce((f,L)=>f+L[x],0)/u.length;s[r]={dup:d("dupEffects"),p99:Math.round(d("p99")),failed:d("failed")}}R(s)}function R(s){const n=Math.max(1,...Object.values(s).map(r=>r.dup));i("bars").innerHTML=Object.values(C).map(r=>{const u=s[r.id];return`<div class="bar-row">
          <div class="nm"><b>${r.id}</b> ${r.name}</div>
          <div class="track"><div class="fill ${u.dup<.05?"zero":""}" style="width:${Math.max(u.dup>0?2:0,u.dup/n*100)}%"></div></div>
          <div class="n mono">${u.dup.toFixed(1)}</div>
        </div>`}).join(""),i("sweepNote").innerHTML="Bars: mean duplicate effects over 60 seeds. "+Object.values(C).map(r=>r.id+" p99 "+s[r.id].p99+" ms").join(" · ")+". Backoff (B) buys politeness, not correctness: its duplicate count matches A."}i("play").addEventListener("click",()=>{t.playing?(t.playing=!1,t.timer&&(clearInterval(t.timer),t.timer=null),i("play").textContent="▶ Run"):A()}),i("step").addEventListener("click",()=>{t.playing=!1,t.timer&&(clearInterval(t.timer),t.timer=null),i("play").textContent="▶ Run";const s=t.sim?.stepEvent();q(),S(),s||I()}),i("reset").addEventListener("click",()=>m()),i("rand").addEventListener("click",()=>{t.seed=Math.floor(Math.random()*1e5),i("seed").value=String(t.seed),m()}),i("seed").addEventListener("input",s=>{const n=Number(s.target.value)||0;t.seed=n,m()}),i("reqDrop").addEventListener("input",s=>{const n=Number(s.target.value);t.faults.reqDrop=n/100,i("vReq").textContent=n+"%",m()}),i("respDrop").addEventListener("input",s=>{const n=Number(s.target.value);t.faults.respDrop=n/100,i("vResp").textContent=n+"%",m()}),i("dup").addEventListener("input",s=>{const n=Number(s.target.value);t.faults.dup=n/100,i("vDup").textContent=n+"%",m()}),i("speed").addEventListener("input",s=>{t.speed=Number(s.target.value)||1,i("vSpeed").textContent=t.speed+"×"}),i("predict").addEventListener("change",s=>{t.predicted=Number(s.target.value)}),i("sweep").addEventListener("click",()=>{const s=i("sweep");s.disabled=!0,s.textContent="Running…",setTimeout(()=>{w(),s.disabled=!1,s.textContent="Run sweep"},30)}),m();const E=setTimeout(w,80);return{destroy(){t.timer&&clearInterval(t.timer),clearTimeout(E),t.flash.forEach(s=>clearTimeout(s)),t.flash.clear(),l.innerHTML=""}}};export{Z as default};
