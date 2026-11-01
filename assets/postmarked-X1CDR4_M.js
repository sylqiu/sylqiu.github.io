import D from"./the-letters-DhjE48N1.js";import H from"./the-registry-Dgoxjvz2.js";const c=[{title:"The First Route",objective:"Deliver all three letters once, on time.",focus:"BASELINE · a plain delivery with no extras.",situation:"Three letters, three offices, one calm morning. Nothing goes wrong.",stake:"Someone is waiting. A late letter breaks the promise.",call:"Press Run and watch the route. Dots are offices; dashed lines are days.",trap:"Nothing is retried here, so the clock is the only pressure.",lesson:"A promise is a deadline, not a hope.",tutorial:!0,terms:["route","deadline"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,ruleGroups:[],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"off"},pass:"promise"}},{title:"Signed for the Record",objective:"Deliver all three letters and bring every signed slip home.",focus:"NEW · Receipts — a signed slip proves the letter arrived. It costs 0.4 coins per letter.",situation:"The same three letters, but now you must prove each one arrived.",stake:"Without proof, a customer can ask for a resend — and you pay for it twice.",call:"Choose no receipt or a signature, then run.",trap:"A letter can arrive and still be unprovable. “Sent” is not “delivered”.",lesson:"If you cannot prove delivery, you may have to deliver again.",terms:["receipt","proof"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,ruleGroups:["receipts"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"off"},pass:"proof"}},{title:"One Copy Only",objective:"Use the ledger to deliver each letter once, even after a resend.",focus:"NEW · The ledger — the receiving office’s list of letter numbers. It lets a repeat be dropped.",situation:"Alice’s bag is late, so the office sends it again. The first bag may still arrive.",stake:"Two copies means Alice acts twice — pays twice, signs twice.",call:"Turn the ledger on or off, run, and count the copies.",trap:"Without the list, the second copy looks like a brand-new letter.",lesson:"A resend is safe only if the receiver can spot the same letter twice.",terms:["ledger","duplicate"],scene:"letters",campaign:{scenario:1,morning:0,situations:1,ruleGroups:["ledger"],initialRules:{numbering:"serial",receipts:"none",retry:"quick",ledger:"off"},pass:"promise"}},{title:"One Deed, One Owner",objective:"Open the deed's single clean write and confirm its owner.",focus:"NEW · A shared record — a deed is a house-ownership record. All three offices read the same one.",situation:"A deed is a house-ownership record. All three offices share one copy.",stake:"If you cannot read the record, you cannot tell who owns the house.",call:"Click Open deed to read the record. There is nothing to change yet.",trap:"One visible copy is not proof that it is the only copy.",lesson:"Shared state begins with one record you can read.",tutorial:!0,terms:["deed","owner"],scene:"registry",campaign:{records:["deed"],worlds:[1],controls:[],initialPolicies:{deed:{quorum:1,conflict:"silent"}},goal:{kind:"audit"}}},{title:"The Stale Page",objective:"Stop a stale deed write from disappearing without a trace.",focus:"NEW · Conflict policy — when two clerks write at once, this decides what happens to the losing write.",situation:"Two clerks write the deed at the same moment. One page is out of date.",stake:"A write that vanishes can sell a house that still belongs to someone else.",call:"Choose what happens to the losing write: Silent, Notify, or Clerk.",trap:"Silent means the loser disappears and nobody is told.",lesson:"Letting the last write win is a choice — usually the costly one.",terms:["stale read","conflict"],scene:"registry",campaign:{records:["deed"],worlds:[0],controls:["conflict"],initialPolicies:{deed:{quorum:2,conflict:"silent"}},goal:{kind:"no-silent",record:"deed"}}},{title:"Majority Rules",objective:"Keep the deed accepted while Kyoto's road is cut.",focus:"NEW · Quorum — how many offices must agree before a write counts.",situation:"The road to Kyoto is cut. The deed must still be accepted.",stake:"If too many offices must agree, honest customers are turned away.",call:"Set how many offices must agree. One is fast; three is safe but refuses during a cut.",trap:"Most offices agreeing is not the same as the office being available.",lesson:"Safety and availability trade off. Pick what you can afford.",terms:["quorum","turned away"],scene:"registry",campaign:{records:["deed"],worlds:[3],controls:["quorum"],initialPolicies:{deed:{quorum:2,conflict:"notify"}},goal:{kind:"no-refused"}}},{title:"The Split Road",objective:"Keep parcel and deed damage at 13.0 or less through two cuts.",focus:"NEW · Damage is a budget — lost letters, turned-away customers, and slow days all add to one bill.",situation:"Parcel and deed share the roads, and the same damage bill.",stake:"Fixing one record’s policy can quietly hurt the other.",call:"Set both policies and keep total damage at 13.0 or less.",trap:"Tuning each record alone and ignoring the total.",lesson:"Availability is a budget, not a per-record setting.",terms:["availability","policy"],scene:"registry",campaign:{records:["parcel","deed"],worlds:[2,4],controls:["quorum","conflict"],initialPolicies:{parcel:{quorum:2,conflict:"notify"},deed:{quorum:2,conflict:"notify"}},goal:{kind:"damage",max:13}}},{title:"The Damage Bill",objective:"Bring the whole office under 70.0 damage.",focus:"NEW · The bill is global — three records share one office’s reputation.",situation:"Three records, ten worlds, one bill.",stake:"Lost letters, turned-away customers, and slow days all land on the same bill.",call:"Set all three policies and bring the office under 70.0.",trap:"A local fix can just move the damage to another record.",lesson:"When records share a system, the repair has to be shared too.",terms:["damage","stakes"],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:70}}},{title:"Repair the Sack",objective:"Resend the lost sack and deliver every letter once.",focus:"NEW · Retry — resend a lost sack without creating a second letter.",situation:"A sack is lost on the road. The customer still expects one letter.",stake:"No resend leaves the letter lost; a blind resend delivers it twice.",call:"Choose how the office retries, then run the route.",trap:"A fixed retry is a guess: too early or too late, you pay.",lesson:"A timeout is a guess; the ledger is what makes a retry safe.",terms:["retry","timeout"],scene:"letters",campaign:{scenario:1,morning:7,situations:1,ruleGroups:["retry"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"on"},pass:"promise"}},{title:"The Whole Office",objective:"Set one policy for all three records and keep damage under 62.0.",focus:"FINAL · One policy for the whole office.",situation:"One policy for all three records. No more local patches.",stake:"The office’s reputation is the sum of all three records.",call:"Set one policy for signup, parcel, and deed. Finish under 62.0.",trap:"Making one record cheap while the other two pay for it.",lesson:"A good policy is one the whole office can live with.",terms:[],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:62}}}],O="postmarked:campaign:v1",E="postmarked:brief:v1",F=`
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
`,U=`
<div class="game">
  <div class="masthead">
    <div class="seal">✉</div>
    <div>
      <div class="brand">POSTMARKED</div>
      <div class="tagline">A postal game of delivery, proof, and shared state</div>
    </div>
    <div class="campaign">CAMPAIGN<b>10 STOPS · ONE TRAIL</b></div>
  </div>
  <div class="intro" id="intro" hidden>
    <div class="intro-k">HOW THIS WORKS</div>
    <p>Think of the post office as several offices that must agree. A letter is a message. A signed slip proves it arrived. A ledger is the receiver’s list of letters it has already seen. The registry is the one shared record.</p>
    <p>Ten short stops. Each adds one tool for a different failure: lost letters, duplicates, out-of-date records, turned-away customers, and slow days. Keep the promise.</p>
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
`,_=k=>{const i=k.shadowRoot??k.attachShadow({mode:"open"});i.innerHTML="<style>"+F+"</style>"+U;const S=i.querySelector("#trail"),T=i.querySelector("#stage"),q=i.querySelector("#levelNo"),A=i.querySelector("#levelTitle"),j=i.querySelector("#objective"),R=i.querySelector("#situation"),I=i.querySelector("#focus"),L=i.querySelector("#stake"),W=i.querySelector("#call"),P=i.querySelector("#trapText"),M=i.querySelector("#terms"),m=i.querySelector("#nextLevel"),d=i.querySelector("#notice"),g=i.querySelector("#intro"),G=i.querySelector("#briefBtn"),K=i.querySelector("#briefClose");try{g.hidden=localStorage.getItem(E)==="seen"}catch{g.hidden=!0}K.addEventListener("click",()=>{g.hidden=!0;try{localStorage.setItem(E,"seen")}catch{}}),G.addEventListener("click",()=>{g.hidden=!g.hidden});let f=null,l=new Set,u={},n=0,h=null;function B(){try{const e=localStorage.getItem(O);if(!e)return;const t=JSON.parse(e),a=new Set;if(Array.isArray(t.completed))for(let o=0;o<c.length&&t.completed.includes(o);o++)a.add(o);if(l=a,t.details&&typeof t.details=="object")for(const[o,s]of Object.entries(t.details))typeof s=="string"&&Number(o)>=0&&Number(o)<c.length&&(u[o]=s);const r=typeof t.current=="number"?t.current:l.size;n=Math.max(0,Math.min(l.size,c.length-1,r))}catch{l=new Set,u={},n=0}}function b(){try{localStorage.setItem(O,JSON.stringify({completed:[...l],current:n,details:u}))}catch{}}function N(e){return e<=l.size}function x(){S.replaceChildren(),c.forEach((e,t)=>{const a=l.has(t),r=t===n,o=N(t),s=document.createElement("button");s.type="button",s.className="stop"+(a?" done":"")+(r?" current":"")+(o?"":" locked"),s.setAttribute("aria-label","Stop "+(t+1)+": "+e.title+" — "+(a?"completed":o?r?"current":"available":"locked")),r&&s.setAttribute("aria-current","step"),o||s.setAttribute("aria-disabled","true");const p=document.createElement("span");p.className="n",p.textContent=String(t+1).padStart(2,"0");const y=document.createElement("span");y.className="t",y.textContent=e.title;const w=document.createElement("span");w.className="state",w.textContent=a?"✓":o?r?"●":"·":"◇",s.append(p,w,y),s.addEventListener("click",()=>{o&&t!==n&&z(t)}),S.append(s)})}function v(){const e=c[n];q.textContent="STOP "+String(n+1).padStart(2,"0")+" OF "+String(c.length).padStart(2,"0")+(e.tutorial?" · TUTORIAL":""),A.textContent=e.title,j.textContent=e.objective,R.textContent=e.situation,I.textContent=e.focus,L.textContent=e.stake,W.textContent=e.call,P.textContent=e.trap,M.replaceChildren();const t=l.has(n),a=n<c.length-1,r=h,o=r?r.passed:t;if(m.hidden=!o||!a,m.textContent=a?"Next level →":"Trail complete",r)if(d.hidden=!1,d.className="notice "+(r.passed?"ok":"fail"),r.passed){const s=" · Remember: "+e.lesson;d.textContent=(a?"✓ Stop complete · ":"✓ Campaign complete · ")+r.detail+s}else d.textContent="✗ Not met · "+r.detail;else if(t){const s=u[String(n)]??"Objective met.",p=" · Remember: "+e.lesson;d.hidden=!1,d.className="notice ok",d.textContent=a?"✓ Stop complete · "+s+p:"✓ Campaign complete · "+s+p}else d.hidden=!0,d.className="notice",d.textContent=""}function C(e){f?.destroy(),T.replaceChildren();const t=c[e],a=document.createElement("div");a.className="scene",T.appendChild(a);const r=o=>{h=o,o.passed&&(e===l.size&&l.add(e),u[String(e)]=o.detail,b()),x(),v()};t.scene==="letters"?f=D(a,{campaign:{...t.campaign,onComplete:r}}):f=H(a,{campaign:{...t.campaign,onComplete:r}})}function z(e){N(e)&&(n=e,h=null,b(),x(),v(),C(e),A.focus({preventScroll:!0}))}return m.addEventListener("click",()=>{l.has(n)&&n<c.length-1&&z(n+1)}),B(),x(),v(),C(n),b(),{destroy(){f?.destroy(),i.innerHTML=""}}};export{_ as default};
