import F from"./the-letters-DpD_z1vx.js";import Y from"./the-registry-DPDqXZfG.js";const g=[{title:"The First Route",objective:"Deliver both letters once, on time.",focus:"BASELINE · a plain delivery with no extras.",situation:"Two letters, two offices, one calm morning. Nothing goes wrong.",stake:"Someone is waiting. A late letter breaks the promise.",call:"Press Run and watch the route. Dots are offices; dashed lines are days.",trap:"Nothing is retried here, so the clock is the only pressure.",lesson:"A promise is a deadline, not a hope.",tutorial:!0,terms:["route","deadline"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,people:2,ruleGroups:[],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"off"},pass:"promise"}},{title:"Signed for the Record",objective:"Deliver both letters and bring both signed slips home.",focus:"NEW · Receipts — a signed slip proves the letter arrived. It costs 0.4 coins per letter.",situation:"The same two letters, but now you must prove each one arrived.",stake:"Without proof, a customer can ask for a resend — and you pay for it twice.",call:"Choose no receipt or a signature, then run.",trap:"A letter can arrive and still be unprovable. “Sent” is not “delivered”.",lesson:"If you cannot prove delivery, you may have to deliver again.",terms:["receipt","proof"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,people:2,ruleGroups:["receipts"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"off"},pass:"proof"}},{title:"One Copy Only",objective:"Use the ledger to deliver each letter once, even after a resend.",focus:"NEW · The ledger — the receiving office’s list of letter numbers. It lets a repeat be dropped.",situation:"Alice’s letter to Bob is late, so the office sends it again. The first bag may still arrive.",stake:"Two copies means Alice acts twice — pays twice, signs twice.",call:"Turn the ledger on or off, run, and count the copies.",trap:"Without the list, the second copy looks like a brand-new letter.",lesson:"A resend is safe only if the receiver can spot the same letter twice.",terms:["ledger","duplicate"],scene:"letters",campaign:{scenario:1,morning:0,situations:1,people:2,ruleGroups:["ledger"],initialRules:{numbering:"serial",receipts:"none",retry:"quick",ledger:"off"},pass:"promise"}},{title:"The Stale Page",objective:"Stop a stale deed write from disappearing without a trace.",focus:"NEW · Conflict policy — when two clerks write at once, this decides what happens to the losing write.",situation:"One deed, three offices. Two clerks write it at the same moment; one page is out of date.",stake:"A write that vanishes can sell a house that still belongs to someone else.",call:"Two clerks wrote the same deed. Choose what happens to the losing write: Silent, Notify, or Clerk.",trap:"Silent means the loser disappears and nobody is told.",lesson:"Letting the last write win is a choice — usually the costly one.",terms:["stale read","conflict"],scene:"registry",campaign:{records:["deed"],worlds:[0],controls:["conflict"],initialPolicies:{deed:{quorum:2,conflict:"silent"}},goal:{kind:"no-silent",record:"deed"}}},{title:"Majority Rules",objective:"Keep the deed accepted while Kyoto's road is cut.",focus:"NEW · Quorum — how many offices must agree before a write counts.",situation:"The road to Kyoto is cut. The deed must still be accepted.",stake:"If too many offices must agree, honest customers are turned away.",call:"Set how many offices must agree. One is fast; three is safe but refuses during a cut.",trap:"Most offices agreeing is not the same as the office being available.",lesson:"Safety and availability trade off. Pick what you can afford.",terms:["quorum","turned away"],scene:"registry",campaign:{records:["deed"],worlds:[3],controls:["quorum"],initialPolicies:{deed:{quorum:2,conflict:"notify"}},goal:{kind:"no-refused"}}},{title:"The Split Road",objective:"Keep parcel and deed damage at 13.0 or less through two cuts.",focus:"NEW · Damage is a budget — lost letters, turned-away customers, and slow days all add to one bill.",situation:"Parcel and deed share the roads, and the same damage bill.",stake:"Fixing one record’s policy can quietly hurt the other.",call:"Set both policies and keep total damage at 13.0 or less.",trap:"Tuning each record alone and ignoring the total.",lesson:"Availability is a budget, not a per-record setting.",terms:["availability","policy"],scene:"registry",campaign:{records:["parcel","deed"],worlds:[2,4],controls:["quorum","conflict"],initialPolicies:{parcel:{quorum:2,conflict:"notify"},deed:{quorum:2,conflict:"notify"}},goal:{kind:"damage",max:13}}},{title:"The Damage Bill",objective:"Bring the whole office under 70.0 damage.",focus:"NEW · The bill is global — three records share one office’s reputation.",situation:"Three records, ten worlds, one bill.",stake:"Lost letters, turned-away customers, and slow days all land on the same bill.",call:"Set all three policies and bring the office under 70.0.",trap:"A local fix can just move the damage to another record.",lesson:"When records share a system, the repair has to be shared too.",terms:["damage","stakes"],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:70}}},{title:"Repair the Sack",objective:"Resend the lost sack and deliver every letter once.",focus:"NEW · Retry — resend a lost sack without creating a second letter.",situation:"A sack is lost on the road. The customer still expects one letter.",stake:"No resend leaves the letter lost; a blind resend delivers it twice.",call:"Choose how the office retries, then run the route.",trap:"A fixed retry is a guess: too early or too late, you pay.",lesson:"A timeout is a guess; the ledger is what makes a retry safe.",terms:["retry","timeout"],scene:"letters",campaign:{scenario:1,morning:7,situations:1,ruleGroups:["retry"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"on"},pass:"promise"}},{title:"The Whole Office",objective:"Set one policy for all three records and keep damage under 62.0.",focus:"FINAL · One policy for the whole office.",situation:"One policy for all three records. No more local patches.",stake:"The office’s reputation is the sum of all three records.",call:"Set one policy for signup, parcel, and deed. Finish under 62.0.",trap:"Making one record cheap while the other two pay for it.",lesson:"A good policy is one the whole office can live with.",terms:[],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:62}}}],O="postmarked:campaign:v2",U="postmarked:campaign:v1",j="postmarked:brief:v1",_=`
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
.situation { font-size:10.5px; color:#b9c0cc; margin-top:3px; }
.focus { font-size:9.5px; color:#d8c48a; margin-top:2px; letter-spacing:.01em; }
.stakes { display:grid; grid-template-columns:1fr 1fr; gap:1px; border-bottom:1px solid var(--line); background:var(--line); }
.stake { padding:7px 14px; background:#0f1319; }
.stake span { display:block; font-size:8px; letter-spacing:.13em; color:var(--dimmer); font-weight:700; }
.stake p { margin:2px 0 0; font-size:10.5px; line-height:1.4; color:var(--dim); }
.stake.call p { color:#dcc98f; }
.trap { display:flex; gap:8px; padding:6px 14px; font-size:10px; line-height:1.4; color:#c9a0a0; background:#160f11; border-bottom:1px solid #2a1b1e; }
.trap b { color:#f0a0a0; font-size:8px; letter-spacing:.13em; flex:none; padding-top:2px; }
.intro { margin:12px 12px 0; padding:11px 13px; border:1px solid #3b3320; border-radius:10px; background:linear-gradient(180deg,#1c1810,#12110c); }
.intro-k { font-size:8.5px; letter-spacing:.15em; color:var(--gold); font-weight:700; }
.intro p { margin:6px 0 0; font-size:11px; color:#c7c0b2; line-height:1.5; }
.intro .chips { display:flex; gap:5px; flex-wrap:wrap; margin-top:8px; }
.intro .chips span { border:1px solid #3a3322; border-radius:99px; padding:2px 7px; font-size:9px; color:#a99a76; }
.intro-actions { display:flex; gap:8px; align-items:center; margin-top:8px; }
.briefbtn { border:1px solid var(--line); border-radius:7px; background:#151a22; color:var(--dim); padding:4px 9px; font-size:10px; cursor:pointer; white-space:nowrap; }
.briefbtn:hover { border-color:#4a5362; color:var(--ink); }
.mission-side { display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
.terms { display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end; }
.term { border:1px solid var(--line); border-radius:99px; padding:2px 7px; font-size:9px; color:var(--dim); }
.term b { color:var(--ink); font-weight:600; }
.next { border:1px solid #5a4a1c; border-radius:7px; background:#2a2413; color:#f0d78a; padding:5px 10px; font-size:10.5px; cursor:pointer; white-space:nowrap; }
.next:hover { border-color:var(--gold); }
.next:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
.notice { padding:7px 14px; font-size:10px; color:var(--green); border-bottom:1px solid #21402d; background:#0f1b14; }
.notice.fail { color:#f0a0a0; border-bottom-color:#3a1b1e; background:#1b0f12; }
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
  .stakes { grid-template-columns:1fr; }
  .intro { margin:8px 8px 0; }
  .mission-side { justify-content:flex-start; width:100%; }
  .terms { justify-content:flex-start; }
  #stage { padding:8px; }
}
`,J=`
<div class="game">
  <div class="masthead">
    <div class="seal">✉</div>
    <div>
      <div class="brand">POSTMARKED</div>
      <div class="tagline">A postal game of delivery, proof, and shared state</div>
    </div>
    <div class="campaign">CAMPAIGN<b>9 STOPS · ONE TRAIL</b></div>
  </div>
  <div class="intro" id="intro" hidden>
    <div class="intro-k">HOW THIS WORKS</div>
    <p>Think of the post office as several offices that must agree. A letter is a message. A signed slip proves it arrived. A ledger is the receiver’s list of letters it has already seen. The registry is the one shared record.</p>
    <p>Nine short stops. Each adds one tool for a different failure: lost letters, duplicates, out-of-date records, turned-away customers, and slow days. Keep the promise.</p>
    <div class="chips"><span>letter = message</span><span>signed slip = proof</span><span>ledger = seen letters</span><span>registry = shared record</span><span>damage = the bill</span></div>
    <div class="intro-actions"><button class="next" id="briefClose" type="button">Got it — start the route</button></div>
  </div>
  <div class="trailwrap">
    <nav class="trail" id="trail" aria-label="Postmarked campaign trail"></nav>
  </div>
  <section class="mission" aria-labelledby="levelTitle">
    <div class="mission-main">
      <div class="kicker" id="levelNo"></div>
      <div class="level-title" id="levelTitle" tabindex="-1"></div>
      <div class="objective" id="objective"></div>
      <div class="situation" id="situation"></div>
      <div class="focus" id="focus"></div>
    </div>
    <div class="mission-side">
      <div class="terms" id="terms"></div>
      <button class="briefbtn" id="briefBtn" type="button">Intro</button>
      <button class="next" id="nextLevel" type="button" hidden>Next level →</button>
    </div>
  </section>
  <div class="stakes">
    <div class="stake"><span>WHAT YOU LOSE</span><p id="stake"></p></div>
    <div class="stake call"><span>WHAT TO DO</span><p id="call"></p></div>
  </div>
  <div class="trap"><b>WHAT GOES WRONG</b><span id="trapText"></span></div>
  <div class="notice" id="notice" role="status" aria-live="polite" hidden></div>
  <div id="stage"></div>
  <div class="footer">A bad day at the post office is a distributed systems lesson.</div>
</div>
`,Q=S=>{const i=S.shadowRoot??S.attachShadow({mode:"open"});i.innerHTML="<style>"+_+"</style>"+J;const T=i.querySelector("#trail"),N=i.querySelector("#stage"),R=i.querySelector("#levelNo"),C=i.querySelector("#levelTitle"),I=i.querySelector("#objective"),L=i.querySelector("#situation"),W=i.querySelector("#focus"),P=i.querySelector("#stake"),M=i.querySelector("#call"),G=i.querySelector("#trapText"),K=i.querySelector("#terms"),x=i.querySelector("#nextLevel"),c=i.querySelector("#notice"),f=i.querySelector("#intro"),B=i.querySelector("#briefBtn"),H=i.querySelector("#briefClose");try{f.hidden=localStorage.getItem(j)==="seen"}catch{f.hidden=!0}H.addEventListener("click",()=>{f.hidden=!0;try{localStorage.setItem(j,"seen")}catch{}}),B.addEventListener("click",()=>{f.hidden=!f.hidden});let h=null,d=new Set,m={},s=0,v=null;function D(){try{const e=localStorage.getItem(O),o=!e,a=e??localStorage.getItem(U);if(!a)return;const t=JSON.parse(a),n=l=>o?l<3?l:l-1:l,r=new Set;if(Array.isArray(t.completed))for(const l of t.completed){if(o&&l===3)continue;const p=n(l);p>=0&&p<g.length&&r.add(p)}if(d=r,t.details&&typeof t.details=="object")for(const[l,p]of Object.entries(t.details)){if(typeof p!="string")continue;const q=Number(l);if(o&&q===3)continue;const k=n(q);k>=0&&k<g.length&&(m[String(k)]=p)}const u=typeof t.current=="number"?o?t.current<3?t.current:t.current===3?3:t.current-1:t.current:d.size;s=Math.max(0,Math.min(d.size,g.length-1,u)),o&&b()}catch{d=new Set,m={},s=0}}function b(){try{localStorage.setItem(O,JSON.stringify({completed:[...d],current:s,details:m}))}catch{}}function A(e){return e<=d.size}function y(){T.replaceChildren(),g.forEach((e,o)=>{const a=d.has(o),t=o===s,n=A(o),r=document.createElement("button");r.type="button",r.className="stop"+(a?" done":"")+(t?" current":"")+(n?"":" locked"),r.setAttribute("aria-label","Stop "+(o+1)+": "+e.title+" — "+(a?"completed":n?t?"current":"available":"locked")),t&&r.setAttribute("aria-current","step"),n||r.setAttribute("aria-disabled","true");const u=document.createElement("span");u.className="n",u.textContent=String(o+1).padStart(2,"0");const l=document.createElement("span");l.className="t",l.textContent=e.title;const p=document.createElement("span");p.className="state",p.textContent=a?"✓":n?t?"●":"·":"◇",r.append(u,p,l),r.addEventListener("click",()=>{n&&o!==s&&E(o)}),T.append(r)})}function w(){const e=g[s];R.textContent="STOP "+String(s+1).padStart(2,"0")+" OF "+String(g.length).padStart(2,"0")+(e.tutorial?" · TUTORIAL":""),C.textContent=e.title,I.textContent=e.objective,L.textContent=e.situation,W.textContent=e.focus,P.textContent=e.stake,M.textContent=e.call,G.textContent=e.trap,K.replaceChildren();const o=d.has(s),a=s<g.length-1,t=v,n=t?t.passed:o;if(x.hidden=!n||!a,x.textContent=a?"Next level →":"Trail complete",t)if(c.hidden=!1,c.className="notice "+(t.passed?"ok":"fail"),t.passed){const r=" · Remember: "+e.lesson;c.textContent=(a?"✓ Stop complete · ":"✓ Campaign complete · ")+t.detail+r}else c.textContent="✗ Not met · "+t.detail;else if(o){const r=m[String(s)]??"Objective met.",u=" · Remember: "+e.lesson;c.hidden=!1,c.className="notice ok",c.textContent=a?"✓ Stop complete · "+r+u:"✓ Campaign complete · "+r+u}else c.hidden=!0,c.className="notice",c.textContent=""}function z(e){h?.destroy(),N.replaceChildren();const o=g[e],a=document.createElement("div");a.className="scene",N.appendChild(a);const t=n=>{v=n,n.passed&&(e===d.size&&d.add(e),m[String(e)]=n.detail,b()),y(),w()};o.scene==="letters"?h=F(a,{campaign:{...o.campaign,onComplete:t}}):h=Y(a,{campaign:{...o.campaign,onComplete:t}})}function E(e){A(e)&&(s=e,v=null,b(),y(),w(),z(e),C.focus({preventScroll:!0}))}return x.addEventListener("click",()=>{d.has(s)&&s<g.length-1&&E(s+1)}),D(),y(),w(),z(s),b(),{destroy(){h?.destroy(),i.innerHTML=""}}};export{Q as default};
