import L from"./the-letters-yCFbAT95.js";import R from"./the-registry-26mZaSLX.js";const d=[{title:"The First Route",objective:"Deliver all three letters once, on time.",terms:["route","deadline"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,ruleGroups:[],pass:"promise"}},{title:"Signed for the Record",objective:"Deliver all three letters and bring every signed slip home.",terms:["receipt","proof"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,ruleGroups:["receipts"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"off"},pass:"proof"}},{title:"One Copy Only",objective:"Use the ledger to deliver each letter once, even after a resend.",terms:["ledger","duplicate"],scene:"letters",campaign:{scenario:1,morning:0,situations:1,ruleGroups:["ledger"],initialRules:{numbering:"serial",receipts:"none",retry:"quick",ledger:"off"},pass:"promise"}},{title:"The Deed Ledger",objective:"Open the deed's single clean write and confirm its owner.",terms:["registry","record"],scene:"registry",campaign:{records:["deed"],worlds:[1],controls:[],initialPolicies:{deed:{quorum:1,conflict:"silent"}},goal:{kind:"audit"}}},{title:"The Stale Page",objective:"Stop a stale deed write from disappearing without a trace.",terms:["stale read","conflict"],scene:"registry",campaign:{records:["deed"],worlds:[0],controls:["conflict"],initialPolicies:{deed:{quorum:2,conflict:"silent"}},goal:{kind:"no-silent",record:"deed"}}},{title:"Majority Rules",objective:"Keep the deed accepted while Kyoto's road is cut.",terms:["quorum","turned away"],scene:"registry",campaign:{records:["deed"],worlds:[3],controls:["quorum"],initialPolicies:{deed:{quorum:2,conflict:"notify"}},goal:{kind:"no-refused"}}},{title:"The Split Road",objective:"Keep parcel and deed damage at 13.0 or less through two cuts.",terms:["availability","policy"],scene:"registry",campaign:{records:["parcel","deed"],worlds:[2,4],controls:["quorum","conflict"],initialPolicies:{parcel:{quorum:2,conflict:"notify"},deed:{quorum:2,conflict:"notify"}},goal:{kind:"damage",max:13}}},{title:"The Damage Bill",objective:"Bring the whole office under 70.0 damage.",terms:["damage","stakes"],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:70}}},{title:"Repair the Sack",objective:"Resend the lost sack and deliver every letter once.",terms:["retry","timeout"],scene:"letters",campaign:{scenario:1,morning:7,situations:1,ruleGroups:["retry"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"on"},pass:"promise"}},{title:"The Whole Office",objective:"Set one policy for all three records and keep damage under 62.0.",terms:[],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:62}}}],C="postmarked:campaign:v1",A=`
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
button { font:inherit; }
[hidden] { display:none !important; }
.masthead { display:flex; align-items:center; gap:12px; padding:14px 16px 10px; border-bottom:1px solid var(--line); }
.seal { width:38px; height:38px; border-radius:10px; display:grid; place-items:center; background:linear-gradient(145deg,#f0c75a,#b8871e); color:#191307; font-size:19px; transform:rotate(-4deg); box-shadow:0 6px 18px rgba(227,179,65,.18); animation:stampIn .6s ease-out both; flex:none; }
@keyframes stampIn { from { transform:rotate(-12deg) scale(.7); opacity:0; } to { transform:rotate(-4deg) scale(1); opacity:1; } }
.brand { font-size:18px; font-weight:700; letter-spacing:.14em; }
.tagline { font-size:10px; color:var(--dimmer); letter-spacing:.02em; margin-top:1px; }
.campaign { margin-left:auto; text-align:right; font-size:8.5px; letter-spacing:.13em; color:var(--dimmer); line-height:1.5; }
.campaign b { display:block; font-size:10px; letter-spacing:.04em; color:var(--gold); font-weight:600; }
.trailwrap { padding:9px 12px 0; border-bottom:1px solid var(--line); background:rgba(15,19,25,.58); }
.trail { display:flex; gap:4px; overflow-x:auto; padding:0 0 9px; scrollbar-width:thin; }
.stop {
  position:relative; flex:1 0 66px; min-width:66px; height:50px; padding:6px 7px;
  text-align:left; color:var(--ink); cursor:pointer; border:1px solid var(--line); border-radius:8px;
  background:linear-gradient(180deg,#151a22,#11151b); transition:border-color .15s, background .15s, transform .15s;
}
.stop:hover { border-color:#4a5362; transform:translateY(-1px); }
.stop:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
.stop .n { display:block; font-size:8px; letter-spacing:.12em; color:var(--dimmer); font-weight:700; }
.stop .t { display:block; margin-top:1px; padding-right:12px; font-size:9.5px; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.stop .state { position:absolute; right:6px; top:5px; font-size:9px; color:var(--dimmer); }
.stop.done { border-color:#2b5d3b; background:linear-gradient(180deg,#12241a,#101a14); }
.stop.done .state { color:var(--green); }
.stop.current { border-color:var(--gold); background:linear-gradient(180deg,#241f11,#17140d); box-shadow:0 0 0 1px rgba(227,179,65,.15) inset; }
.stop.current .n, .stop.current .state { color:var(--gold); }
.stop.locked { opacity:.42; cursor:not-allowed; }
.stop.locked:hover { border-color:var(--line); transform:none; }
.mission { display:flex; align-items:center; gap:16px; padding:10px 14px; border-bottom:1px solid var(--line); background:linear-gradient(180deg,#11161d,#0d1116); }
.mission-main { min-width:0; flex:1; }
.kicker { font-size:8.5px; letter-spacing:.14em; color:var(--gold); font-weight:600; }
.level-title { font-size:15px; font-weight:650; margin-top:1px; outline:none; }
.objective { font-size:10.5px; color:var(--dim); margin-top:1px; }
.mission-side { display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
.terms { display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end; }
.term { border:1px solid var(--line); border-radius:99px; padding:2px 7px; font-size:9px; color:var(--dim); }
.term b { color:var(--ink); font-weight:600; }
.next { border:1px solid #5a4a1c; border-radius:7px; background:#2a2413; color:#f0d78a; padding:5px 10px; font-size:10.5px; cursor:pointer; white-space:nowrap; }
.next:hover { border-color:var(--gold); }
.next:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
.notice { padding:7px 14px; font-size:10px; color:var(--green); border-bottom:1px solid #21402d; background:#0f1b14; }
#stage { padding:12px; }
.scene { border-radius:11px; overflow:hidden; }
.footer { padding:0 14px 11px; font-size:9px; color:var(--dimmer); letter-spacing:.02em; }
@media (max-width:760px) {
  .masthead { padding:12px; }
  .brand { font-size:15px; }
  .tagline { font-size:9px; }
  .campaign { display:none; }
  .trailwrap { padding:8px 8px 0; }
  .stop { flex-basis:76px; }
  .mission { align-items:flex-start; flex-direction:column; gap:7px; padding:9px 10px; }
  .mission-side { justify-content:flex-start; width:100%; }
  .terms { justify-content:flex-start; }
  #stage { padding:8px; }
}
`,P=`
<div class="game">
  <div class="masthead">
    <div class="seal">✉</div>
    <div>
      <div class="brand">POSTMARKED</div>
      <div class="tagline">A postal game of delivery, proof, and shared state</div>
    </div>
    <div class="campaign">CAMPAIGN<b>10 STOPS · ONE TRAIL</b></div>
  </div>
  <div class="trailwrap">
    <nav class="trail" id="trail" aria-label="Postmarked campaign trail"></nav>
  </div>
  <section class="mission" aria-labelledby="levelTitle">
    <div class="mission-main">
      <div class="kicker" id="levelNo"></div>
      <div class="level-title" id="levelTitle" tabindex="-1"></div>
      <div class="objective" id="objective"></div>
    </div>
    <div class="mission-side">
      <div class="terms" id="terms"></div>
      <button class="next" id="nextLevel" type="button" hidden>Next level →</button>
    </div>
  </section>
  <div class="notice" id="notice" role="status" aria-live="polite" hidden></div>
  <div id="stage"></div>
  <div class="footer">A bad day at the post office is a distributed systems lesson.</div>
</div>
`,G=y=>{const l=y.shadowRoot??y.attachShadow({mode:"open"});l.innerHTML="<style>"+A+"</style>"+P;const w=l.querySelector("#trail"),k=l.querySelector("#stage"),N=l.querySelector("#levelNo"),S=l.querySelector("#levelTitle"),E=l.querySelector("#objective"),j=l.querySelector("#terms"),g=l.querySelector("#nextLevel"),p=l.querySelector("#notice");let m=null,s=new Set,c={},r=0;function O(){try{const o=localStorage.getItem(C);if(!o)return;const e=JSON.parse(o),i=new Set;if(Array.isArray(e.completed))for(let t=0;t<d.length&&e.completed.includes(t);t++)i.add(t);if(s=i,e.details&&typeof e.details=="object")for(const[t,a]of Object.entries(e.details))typeof a=="string"&&Number(t)>=0&&Number(t)<d.length&&(c[t]=a);const n=typeof e.current=="number"?e.current:s.size;r=Math.max(0,Math.min(s.size,d.length-1,n))}catch{s=new Set,c={},r=0}}function u(){try{localStorage.setItem(C,JSON.stringify({completed:[...s],current:r,details:c}))}catch{}}function z(o){return o<=s.size}function f(){w.replaceChildren(),d.forEach((o,e)=>{const i=s.has(e),n=e===r,t=z(e),a=document.createElement("button");a.type="button",a.className="stop"+(i?" done":"")+(n?" current":"")+(t?"":" locked"),a.setAttribute("aria-label","Stop "+(e+1)+": "+o.title+" — "+(i?"completed":t?n?"current":"available":"locked")),n&&a.setAttribute("aria-current","step"),t||a.setAttribute("aria-disabled","true");const v=document.createElement("span");v.className="n",v.textContent=String(e+1).padStart(2,"0");const b=document.createElement("span");b.className="t",b.textContent=o.title;const h=document.createElement("span");h.className="state",h.textContent=i?"✓":t?n?"●":"·":"◇",a.append(v,h,b),a.addEventListener("click",()=>{t&&e!==r&&q(e)}),w.append(a)})}function x(){const o=d[r];N.textContent="STOP "+String(r+1).padStart(2,"0")+" OF "+String(d.length).padStart(2,"0"),S.textContent=o.title,E.textContent=o.objective,j.replaceChildren();for(const n of o.terms){const t=document.createElement("span");t.className="term";const a=document.createElement("b");a.textContent="NEW · ",t.append(a,document.createTextNode(n)),j.append(t)}const e=s.has(r),i=r<d.length-1;if(g.hidden=!e||!i,g.textContent=i?"Next level →":"Trail complete",e){const n=c[String(r)]??"Objective met.";p.hidden=!1,p.textContent=i?"✓ Stop complete · "+n:"✓ Campaign complete · "+n}else p.hidden=!0,p.textContent=""}function T(o){m?.destroy(),k.replaceChildren();const e=d[o],i=document.createElement("div");i.className="scene",k.appendChild(i);const n=t=>{t.passed&&(o===s.size&&s.add(o),c[String(o)]=t.detail,u(),f(),x())};e.scene==="letters"?m=L(i,{campaign:{...e.campaign,onComplete:n}}):m=R(i,{campaign:{...e.campaign,onComplete:n}})}function q(o){z(o)&&(r=o,u(),f(),x(),T(o),S.focus({preventScroll:!0}))}return g.addEventListener("click",()=>{s.has(r)&&r<d.length-1&&q(r+1)}),O(),f(),x(),T(r),u(),{destroy(){m?.destroy(),l.innerHTML=""}}};export{G as default};
