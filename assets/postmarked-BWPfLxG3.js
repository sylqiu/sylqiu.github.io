import l from"./the-letters-C5LIX71l.js";import c from"./the-registry-BA8liSij.js";const g=`
:host { display: block; }
* { box-sizing: border-box; }
.game {
  --ink:#e6e9ef; --dim:#8b94a3; --dimmer:#5c6472; --line:#2a303a;
  --gold:#e3b341; --green:#3fb950; --red:#f85149; --paper:#0e1116;
  color:var(--ink); border:1px solid var(--line); border-radius:14px; overflow:hidden;
  background:
    radial-gradient(90% 80% at 10% -10%, rgba(227,179,65,.10), transparent 55%),
    radial-gradient(80% 70% at 110% 0%, rgba(88,166,255,.08), transparent 50%),
    #0e1116;
  font:13.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;
}
.masthead { display:flex; align-items:center; gap:12px; padding:14px 16px 10px; border-bottom:1px solid var(--line); }
.seal { width:38px; height:38px; border-radius:10px; display:grid; place-items:center; background:linear-gradient(145deg,#f0c75a,#b8871e); color:#191307; font-size:19px; transform:rotate(-4deg); box-shadow:0 6px 18px rgba(227,179,65,.18); animation:stampIn .6s ease-out both; flex:none; }
@keyframes stampIn { from { transform:rotate(-12deg) scale(.7); opacity:0; } to { transform:rotate(-4deg) scale(1); opacity:1; } }
.brand { font-size:18px; font-weight:700; letter-spacing:.14em; }
.tagline { font-size:10px; color:var(--dimmer); letter-spacing:.02em; margin-top:1px; }
.campaign { margin-left:auto; text-align:right; font-size:8.5px; letter-spacing:.13em; color:var(--dimmer); line-height:1.5; }
.campaign b { display:block; font-size:10px; letter-spacing:.04em; color:var(--gold); font-weight:600; }
.acts { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:10px 12px 12px; }
.act { text-align:left; background:linear-gradient(180deg,#151a22,#11151b); border:1px solid var(--line); border-radius:10px; padding:9px 11px; cursor:pointer; color:var(--ink); position:relative; transition:transform .15s ease, border-color .15s ease, background .15s ease; }
.act:hover { transform:translateY(-1px); border-color:#4a5362; }
.act.on { border-color:var(--gold); background:linear-gradient(180deg,#211d12,#17140d); box-shadow:0 0 0 1px rgba(227,179,65,.18) inset; }
.act .num { display:block; font-size:8.5px; letter-spacing:.15em; color:var(--dimmer); font-weight:600; }
.act.on .num { color:var(--gold); }
.act .nm { display:block; font-size:13px; font-weight:600; margin-top:1px; }
.act .sub { display:block; font-size:10px; color:var(--dim); margin-top:1px; }
.act .status { position:absolute; right:9px; top:10px; color:var(--dim); font-size:10px; }
.act.on .status { color:var(--gold); }
#stage { padding:0 12px 12px; }
.scene { border-radius:11px; overflow:hidden; }
.footer { padding:0 14px 11px; font-size:9px; color:var(--dimmer); letter-spacing:.02em; }
@media (max-width:640px) {
  .masthead { padding:12px; }
  .brand { font-size:15px; }
  .tagline { font-size:9px; }
  .campaign { display:none; }
  .acts { grid-template-columns:1fr; gap:6px; padding:8px 10px 10px; }
  #stage { padding:0 8px 8px; }
}
`,m=`
<div class="game">
  <div class="masthead">
    <div class="seal">✉</div>
    <div>
      <div class="brand">POSTMARKED</div>
      <div class="tagline">A postal game of delivery, proof, and shared state</div>
    </div>
    <div class="campaign">CAMPAIGN<b>2 ACTS · 20 WORLDS</b></div>
  </div>
  <div class="acts">
    <button class="act on" data-act="delivery"><span class="num">ACT I</span><span class="nm">Delivery</span><span class="sub">Keep the promise</span><span class="status">✉</span></button>
    <button class="act" data-act="registry"><span class="num">ACT II</span><span class="nm">The Registry</span><span class="sub">Keep the deed single-owner</span><span class="status">◈</span></button>
  </div>
  <div id="stage"></div>
  <div class="footer">A bad day at the post office is a distributed systems lesson.</div>
</div>
`,b=r=>{const t=r.shadowRoot??r.attachShadow({mode:"open"});t.innerHTML="<style>"+g+"</style>"+m;const o=t.querySelector("#stage"),n=[...t.querySelectorAll(".act")];let s=null;function i(a){s?.destroy(),o.innerHTML="";const e=document.createElement("div");e.className="scene",o.appendChild(e),s=a==="delivery"?l(e):c(e),n.forEach(d=>d.classList.toggle("on",d.dataset.act===a));try{sessionStorage.setItem("postmarked:act",a)}catch{}}const p=(()=>{const a=new URLSearchParams(location.search).get("act");if(a==="registry"||a==="delivery")return a;try{const e=sessionStorage.getItem("postmarked:act");if(e==="registry"||e==="delivery")return e}catch{}return"delivery"})();return n.forEach(a=>a.addEventListener("click",()=>i(a.dataset.act))),i(p),{destroy(){s?.destroy(),t.innerHTML=""}}};export{b as default};
