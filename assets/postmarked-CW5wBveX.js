import F from"./the-letters-D9LN9mCN.js";import G from"./the-registry-26mZaSLX.js";const d=[{title:"The First Route",objective:"Deliver all three letters once, on time.",situation:"Three letters leave three offices on a calm morning. Nothing is wrong yet.",stake:"A customer is waiting; a late letter is a broken promise.",call:"Press Run and learn the board: dots are offices, dashed lines are days.",trap:"There is no retry here. Watch how quickly five days disappear.",lesson:"A promise is a deadline, not a wish.",tutorial:!0,terms:["route","deadline"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,ruleGroups:[],pass:"promise"}},{title:"Signed for the Record",objective:"Deliver all three letters and bring every signed slip home.",situation:"Same morning, but now every delivery must be provable.",stake:"Without proof, a customer can demand a resend and you pay twice.",call:"Buy no receipt or a signature, then run. Proof costs 0.4 coins a letter.",trap:"'Sent' is not 'delivered'. No receipt is the cheapest way to lose an argument.",lesson:"Delivery you cannot prove is delivery you may have to buy again.",terms:["receipt","proof"],scene:"letters",campaign:{scenario:0,morning:0,situations:1,ruleGroups:["receipts"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"off"},pass:"proof"}},{title:"One Copy Only",objective:"Use the ledger to deliver each letter once, even after a resend.",situation:"A bag is late, so the office resends it. The first bag may still arrive.",stake:"Two copies of one letter means the customer acts twice.",call:"Turn the ledger on or off, run, and compare duplicates.",trap:"Retrying without a ledger: the duplicate looks like a second delivery.",lesson:"Retries are safe only when the receiver can recognise a repeat.",terms:["ledger","duplicate"],scene:"letters",campaign:{scenario:1,morning:0,situations:1,ruleGroups:["ledger"],initialRules:{numbering:"serial",receipts:"none",retry:"quick",ledger:"off"},pass:"promise"}},{title:"The Deed Ledger",objective:"Open the deed's single clean write and confirm its owner.",situation:"One deed, one clean write, three offices. Open it and read the owner.",stake:"A deed with two owners is a lawsuit, not a record.",call:"Click the single deed write to audit it.",trap:"Assuming the copy you can see is the only copy.",lesson:"Before you fix shared state, learn to read one record.",terms:["registry","record"],scene:"registry",campaign:{records:["deed"],worlds:[1],controls:[],initialPolicies:{deed:{quorum:1,conflict:"silent"}},goal:{kind:"audit"}}},{title:"The Stale Page",objective:"Stop a stale deed write from disappearing without a trace.",situation:"Two clerks write the deed at once. One page is already stale.",stake:"A vanished write is a sold house that still belongs to someone else.",call:"Choose what happens to the losing write: Silent, Notify, or Clerk.",trap:"Silent conflict: the loser disappears and nobody is told.",lesson:"Last-write-wins is a choice, and usually the expensive one.",terms:["stale read","conflict"],scene:"registry",campaign:{records:["deed"],worlds:[0],controls:["conflict"],initialPolicies:{deed:{quorum:2,conflict:"silent"}},goal:{kind:"no-silent",record:"deed"}}},{title:"Majority Rules",objective:"Keep the deed accepted while Kyoto's road is cut.",situation:"Kyoto's road is cut. The deed must still be accepted.",stake:"Too much quorum and honest customers are turned away.",call:"Set the quorum. One office is fast; three is safe but refuses during a cut.",trap:"Confusing 'most offices agree' with 'the office is available'.",lesson:"Quorum buys safety with availability. Pick what you can afford.",terms:["quorum","turned away"],scene:"registry",campaign:{records:["deed"],worlds:[3],controls:["quorum"],initialPolicies:{deed:{quorum:2,conflict:"notify"}},goal:{kind:"no-refused"}}},{title:"The Split Road",objective:"Keep parcel and deed damage at 13.0 or less through two cuts.",situation:"Parcel and deed share the same roads and the same damage bill.",stake:"Fixing one record's policy can quietly break the other.",call:"Set both policies and keep total damage at 13.0 or less.",trap:"Tuning each record alone and ignoring the total.",lesson:"Availability is a budget, not a per-record setting.",terms:["availability","policy"],scene:"registry",campaign:{records:["parcel","deed"],worlds:[2,4],controls:["quorum","conflict"],initialPolicies:{parcel:{quorum:2,conflict:"notify"},deed:{quorum:2,conflict:"notify"}},goal:{kind:"damage",max:13}}},{title:"The Damage Bill",objective:"Bring the whole office under 70.0 damage.",situation:"The whole office: three records, ten worlds, one bill.",stake:"Every lost write, refusal, and slow day lands on the same bill.",call:"Set all three policies and bring the office under 70.0.",trap:"Local fixes that move damage from one record to another.",lesson:"Shared state fails globally; the repair has to be global too.",terms:["damage","stakes"],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:70}}},{title:"Repair the Sack",objective:"Resend the lost sack and deliver every letter once.",situation:"A sack is lost on the road. The customer still expects one letter.",stake:"No resend means a lost letter; a blind resend means a duplicate.",call:"Choose the retry policy, then run the route.",trap:"Fixed retry: resend too early or too late and you pay either way.",lesson:"Timeouts are guesses; the ledger is what makes a retry safe.",terms:["retry","timeout"],scene:"letters",campaign:{scenario:1,morning:7,situations:1,ruleGroups:["retry"],initialRules:{numbering:"serial",receipts:"none",retry:"never",ledger:"on"},pass:"promise"}},{title:"The Whole Office",objective:"Set one policy for all three records and keep damage under 62.0.",situation:"One policy for all three records. No more local patches.",stake:"The office's reputation is the sum of every record's damage.",call:"Set one policy across signup, parcel, and deed; finish under 62.0.",trap:"Optimising one record while the other two pay for it.",lesson:"A good policy is the one the whole office can live with.",terms:[],scene:"registry",campaign:{records:["signup","parcel","deed"],worlds:[0,1,2,3,4,5,6,7,8,9],controls:["quorum","conflict"],goal:{kind:"damage",max:62}}}],E="postmarked:campaign:v1",N="postmarked:brief:v1",D=`
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
`,H=`
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
    <div class="intro-k">THE BRIEF</div>
    <p>A post office is a distributed system. A letter is a write, a signed slip is an acknowledgement, the ledger is how you spot a repeat, and the registry is the shared truth.</p>
    <p>Ten stops. Each adds one failure mode: lost, duplicate, stale, refused, slow. Keep the promise by choosing what the office is allowed to do.</p>
    <div class="chips"><span>letter = write</span><span>slip = acknowledgement</span><span>ledger = dedupe</span><span>registry = shared truth</span><span>damage = the bill</span></div>
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
    </div>
    <div class="mission-side">
      <div class="terms" id="terms"></div>
      <button class="briefbtn" id="briefBtn" type="button">Brief</button>
      <button class="next" id="nextLevel" type="button" hidden>Next level →</button>
    </div>
  </section>
  <div class="stakes">
    <div class="stake"><span>AT STAKE</span><p id="stake"></p></div>
    <div class="stake call"><span>YOUR CALL</span><p id="call"></p></div>
  </div>
  <div class="trap"><b>THE TRAP</b><span id="trapText"></span></div>
  <div class="notice" id="notice" role="status" aria-live="polite" hidden></div>
  <div id="stage"></div>
  <div class="footer">A bad day at the post office is a distributed systems lesson.</div>
</div>
`,Y=w=>{const i=w.shadowRoot??w.attachShadow({mode:"open"});i.innerHTML="<style>"+D+"</style>"+H;const k=i.querySelector("#trail"),S=i.querySelector("#stage"),j=i.querySelector("#levelNo"),T=i.querySelector("#levelTitle"),O=i.querySelector("#objective"),L=i.querySelector("#situation"),R=i.querySelector("#stake"),P=i.querySelector("#call"),I=i.querySelector("#trapText"),C=i.querySelector("#terms"),m=i.querySelector("#nextLevel"),g=i.querySelector("#notice"),c=i.querySelector("#intro"),B=i.querySelector("#briefBtn"),M=i.querySelector("#briefClose");try{c.hidden=localStorage.getItem(N)==="seen"}catch{c.hidden=!0}M.addEventListener("click",()=>{c.hidden=!0;try{localStorage.setItem(N,"seen")}catch{}}),B.addEventListener("click",()=>{c.hidden=!c.hidden});let u=null,l=new Set,p={},a=0;function K(){try{const e=localStorage.getItem(E);if(!e)return;const o=JSON.parse(e),r=new Set;if(Array.isArray(o.completed))for(let t=0;t<d.length&&o.completed.includes(t);t++)r.add(t);if(l=r,o.details&&typeof o.details=="object")for(const[t,n]of Object.entries(o.details))typeof n=="string"&&Number(t)>=0&&Number(t)<d.length&&(p[t]=n);const s=typeof o.current=="number"?o.current:l.size;a=Math.max(0,Math.min(l.size,d.length-1,s))}catch{l=new Set,p={},a=0}}function f(){try{localStorage.setItem(E,JSON.stringify({completed:[...l],current:a,details:p}))}catch{}}function q(e){return e<=l.size}function h(){k.replaceChildren(),d.forEach((e,o)=>{const r=l.has(o),s=o===a,t=q(o),n=document.createElement("button");n.type="button",n.className="stop"+(r?" done":"")+(s?" current":"")+(t?"":" locked"),n.setAttribute("aria-label","Stop "+(o+1)+": "+e.title+" — "+(r?"completed":t?s?"current":"available":"locked")),s&&n.setAttribute("aria-current","step"),t||n.setAttribute("aria-disabled","true");const x=document.createElement("span");x.className="n",x.textContent=String(o+1).padStart(2,"0");const v=document.createElement("span");v.className="t",v.textContent=e.title;const y=document.createElement("span");y.className="state",y.textContent=r?"✓":t?s?"●":"·":"◇",n.append(x,y,v),n.addEventListener("click",()=>{t&&o!==a&&A(o)}),k.append(n)})}function b(){const e=d[a];j.textContent="STOP "+String(a+1).padStart(2,"0")+" OF "+String(d.length).padStart(2,"0")+(e.tutorial?" · TUTORIAL":""),T.textContent=e.title,O.textContent=e.objective,L.textContent=e.situation,R.textContent=e.stake,P.textContent=e.call,I.textContent=e.trap,C.replaceChildren();for(const s of e.terms){const t=document.createElement("span");t.className="term";const n=document.createElement("b");n.textContent="NEW · ",t.append(n,document.createTextNode(s)),C.append(t)}const o=l.has(a),r=a<d.length-1;if(m.hidden=!o||!r,m.textContent=r?"Next level →":"Trail complete",o){const s=p[String(a)]??"Objective met.",t=" · Lesson: "+e.lesson;g.hidden=!1,g.textContent=r?"✓ Stop complete · "+s+t:"✓ Campaign complete · "+s+t}else g.hidden=!0,g.textContent=""}function z(e){u?.destroy(),S.replaceChildren();const o=d[e],r=document.createElement("div");r.className="scene",S.appendChild(r);const s=t=>{t.passed&&(e===l.size&&l.add(e),p[String(e)]=t.detail,f(),h(),b())};o.scene==="letters"?u=F(r,{campaign:{...o.campaign,onComplete:s}}):u=G(r,{campaign:{...o.campaign,onComplete:s}})}function A(e){q(e)&&(a=e,f(),h(),b(),z(e),T.focus({preventScroll:!0}))}return m.addEventListener("click",()=>{l.has(a)&&a<d.length-1&&A(a+1)}),K(),h(),b(),z(a),f(),{destroy(){u?.destroy(),i.innerHTML=""}}};export{Y as default};
