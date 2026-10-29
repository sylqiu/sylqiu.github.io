const w=[{id:"signup",label:"Signup list",stakes:.5,refundable:!0},{id:"parcel",label:"Parcel order",stakes:3,refundable:!0},{id:"deed",label:"Land deed",stakes:5,refundable:!1}],L=[{id:0,cut:"none",two:!0,origin:null,seed:1},{id:1,cut:"none",two:!1,origin:"A",seed:2},{id:2,cut:"A",two:!0,origin:null,seed:3},{id:3,cut:"B",two:!1,origin:"B",seed:4},{id:4,cut:"C",two:!0,origin:null,seed:5},{id:5,cut:"all",two:!0,origin:null,seed:6},{id:6,cut:"B",two:!1,origin:"A",seed:7},{id:7,cut:"none",two:!0,origin:null,seed:8},{id:8,cut:"A",two:!1,origin:"C",seed:9},{id:9,cut:"C",two:!0,origin:null,seed:10}],S={A:0,B:6,C:2},C=["A","B","C"],F=1.8,R=3.9,M=.3;function T(a,r){return r==="all"||r===a?[a]:r==="none"?[...C]:C.filter(t=>t!==r)}function B(a,r,t){const o=T(a,t);if(o.length<r)return null;const b=o.filter(n=>n!==a).sort((n,p)=>S[n]-S[p]).slice(0,r-1);return Math.max(...[a,...b].map(n=>S[n]))}function j(a,r){switch(a){case"ok":return 0;case"refused":return F;case"lostSilent":return r.stakes*2;case"lostNotified":return r.refundable?1.5+.2*r.stakes:.8*r.stakes;case"clerk":return R;default:throw new Error(a)}}function v(a,r,t,o){if(r==="refused"){a.refused+=F;return}if(r==="ok"){a.slow+=M*o;return}a.lost+=j(r,t),a.slow+=M*o}function N(a,r,t){const o={lost:0,refused:0,slow:0},n=(t.two?["A","C"]:[t.origin??"A"]).map(i=>B(i,r.quorum,t.cut));let p="ok";if(!t.two)n[0]===null?(v(o,"refused",a,0),p="refused"):(v(o,"ok",a,n[0]),p="ok");else{const[i,l]=n;if(i===null&&l===null)v(o,"refused",a,0),v(o,"refused",a,0),p="both refused";else if(i!==null&&l!==null){const g=Math.max(i,l),m=r.conflict==="silent"?"lostSilent":r.conflict==="notify"?"lostNotified":"clerk";v(o,m,a,g),p=m}else{const g=i??l;v(o,"refused",a,0),v(o,"ok",a,g),p="one refused"}}return{outcome:p,damage:Math.round((o.lost+o.refused+o.slow)*10)/10,lost:Math.round(o.lost*10)/10,refused:Math.round(o.refused*10)/10,slow:Math.round(o.slow*10)/10,days:Math.max(...n.filter(i=>i!==null),0)}}function q(a){const r={signup:0,parcel:0,deed:0},t=L.map(i=>{const l={};let g=0,m=0,y=0,x=0;for(const e of w){const s=N(e,a[e.id],i);l[e.id]=s,g+=s.damage,m+=s.lost,y+=s.refused,x+=s.slow,r[e.id]+=s.damage}return{world:i,cells:l,total:Math.round(g*10)/10,lost:m,refused:y,slow:x}}),o=Math.round(t.reduce((i,l)=>i+l.total,0)*10)/10,b=Math.round(t.reduce((i,l)=>i+l.lost,0)*10)/10,n=Math.round(t.reduce((i,l)=>i+l.refused,0)*10)/10,p=Math.round(t.reduce((i,l)=>i+l.slow,0)*10)/10;for(const i of Object.keys(r))r[i]=Math.round(r[i]*10)/10;return{worlds:t,total:o,lost:b,refused:n,slow:p,perRecord:r}}const A=[];for(const a of[1,2,3])for(const r of["silent","notify","clerk"])A.push({quorum:a,conflict:r});let k=null;function E(){if(k!==null)return k;let a=0;for(const r of w){let t=1/0;for(const o of A){const n=q({signup:o,parcel:o,deed:o}).perRecord[r.id];n<t&&(t=n)}a+=t}return k=Math.round(a*10)/10,k}function D(a){const r=E(),t=r>0?(a-r)/r:0;return t<=.1?"S":t<=.3?"A":t<=.5?"B":"C"}function I(){return{signup:{quorum:2,conflict:"notify"},parcel:{quorum:2,conflict:"notify"},deed:{quorum:2,conflict:"notify"}}}const H=`
:host { display: block; }
* { box-sizing: border-box; }
.wrap { --line:#242a34; --panel:#12151b; --panel2:#171b22; --text:#e6e9ef; --dim:#8b94a3; --dimmer:#5c6472; --blue:#58a6ff; --green:#3fb950; --red:#f85149; --amber:#d29922; --violet:#a371f7; --gold:#e3b341; color:var(--text); font:13.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; border:1px solid var(--line); border-radius:12px; overflow:hidden; background:#0e1116; }
.mono { font-family:"SF Mono",ui-monospace,Menlo,monospace; font-variant-numeric:tabular-nums; }
button { font:inherit; color:var(--text); background:var(--panel2); border:1px solid var(--line); border-radius:6px; padding:4px 7px; cursor:pointer; font-size:11px; }
button:hover { border-color:#3a4350; }
button.on { border-color:var(--gold); background:#211d12; color:var(--gold); }
.bar { display:flex; align-items:center; gap:8px; padding:9px 12px; border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.bar .title { font-size:12.5px; font-weight:560; }
.bar .title span { color:var(--dimmer); font-weight:400; }
.bar .spacer { flex:1; }
.clock { font-size:10.5px; color:var(--dim); }
.brief { padding:10px 14px 9px; border-bottom:1px solid var(--line); background:linear-gradient(180deg,#11161d,#0d1116); }
.brief-title { font-size:12px; font-weight:600; }
.brief-copy { font-size:10.5px; color:var(--dim); line-height:1.5; margin-top:3px; max-width:800px; }
.brief-goal { font-size:9.5px; color:var(--dimmer); margin-top:5px; }
.brief-goal b { color:var(--gold); font-weight:600; letter-spacing:.04em; }
.guide { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:8px; }
.gstep { border:1px solid var(--line); border-radius:7px; background:#10151d; padding:6px 8px; }
.gstep b { display:block; font-size:10px; color:var(--gold); font-weight:600; }
.gstep span { display:block; font-size:9.5px; color:var(--dim); line-height:1.4; margin-top:2px; }
.terms { display:flex; gap:6px; flex-wrap:wrap; margin-top:7px; }
.term { font-size:9.5px; color:var(--dim); border:1px solid var(--line); border-radius:99px; padding:2px 7px; }
.term b { color:var(--text); font-weight:600; }
.hintline { font-size:9.5px; color:var(--dimmer); line-height:1.4; margin-top:6px; }
.policy-line { font-size:9px; color:var(--dim); line-height:1.4; margin-top:5px; min-height:26px; }
.legend { font-size:8.5px; color:var(--dimmer); flex-basis:100%; margin-top:1px; }
@media (max-width:800px) { .guide { grid-template-columns:1fr; } }
.body { display:grid; grid-template-columns:1fr 330px; }
.main { min-width:0; border-right:1px solid var(--line); }
.side { min-width:0; }
.records { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; padding:12px 12px 8px; }
.rec { border:1px solid var(--line); border-radius:9px; background:var(--panel); padding:9px 9px 7px; min-width:0; }
.rec-head { display:flex; justify-content:space-between; gap:6px; align-items:baseline; }
.rec-head b { font-size:12px; font-weight:560; }
.rec-head span { font-size:8.5px; color:var(--dimmer); text-align:right; }
.grp { font-size:8.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); margin:7px 0 3px; font-weight:600; }
.seg, .opts { display:flex; gap:3px; flex-wrap:wrap; }
.chip { flex:1; min-width:0; text-align:center; font-size:10px; padding:3px 4px; }
.rec-dmg { display:flex; justify-content:space-between; margin-top:7px; border-top:1px solid #171d26; padding-top:5px; font-size:9.5px; color:var(--dim); }
.rec-dmg b { color:var(--text); font-weight:500; }
.rail { display:flex; align-items:center; gap:8px; padding:8px 12px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.rail-label { font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); }
.hint { font-size:9.5px; color:var(--dimmer); }
.tiles { display:flex; gap:4px; flex-wrap:wrap; }
.tile { width:38px; height:28px; padding:0; border-radius:6px; background:#1a2029; border:1px solid #333d4b; color:var(--dim); font-size:9.5px; font-weight:600; display:grid; place-items:center; }
.tile.ok { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.tile.warn { background:#221d10; border-color:#5a4a1c; color:#e3c37a; }
.tile.bad { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.tile.sel { box-shadow:0 0 0 1px var(--gold); }
.detail { margin:0 12px 12px; border:1px solid var(--line); border-radius:9px; background:#10151d; padding:9px 11px; font-size:10px; color:var(--dim); line-height:1.45; }
.detail b { color:var(--text); font-weight:560; }
.drow { display:grid; grid-template-columns:78px 1fr 58px; gap:7px; padding:3px 0; border-top:1px solid #171d26; }
.drow .x { color:var(--text); }
.drow .d { text-align:right; color:var(--text); }
.score { padding:12px; }
.score-rank { display:flex; align-items:center; gap:9px; margin-bottom:6px; }
.rank { width:34px; height:34px; border-radius:9px; display:grid; place-items:center; font-size:17px; font-weight:650; border:1px solid var(--line); background:#141922; color:var(--dim); flex:none; }
.rank.s { background:var(--gold); border-color:var(--gold); color:#0d1117; }
.rank.a { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.rank.b { background:#221d10; border-color:#5a4a1c; color:var(--amber); }
.rank.c { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.kicker { font-size:8.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--dimmer); }
.big { font-size:20px; font-weight:600; }
.best { margin-left:auto; text-align:right; font-size:8.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--dimmer); line-height:1.45; flex:none; }
.best b { display:block; font-size:10px; font-weight:500; letter-spacing:0; text-transform:none; color:var(--text); }
.stat { display:flex; justify-content:space-between; gap:8px; font-size:10px; color:var(--dim); padding:2px 0; border-bottom:1px solid #171d26; }
.stat b { color:var(--text); font-weight:500; }
.target { font-size:9.5px; color:var(--dimmer); margin:6px 0 2px; line-height:1.35; }
.bars { margin-top:8px; }
.brow { display:grid; grid-template-columns:64px 1fr 44px; gap:6px; align-items:center; font-size:9px; color:var(--dim); margin:4px 0; }
.track { height:5px; border-radius:999px; background:#1b222c; overflow:hidden; }
.track i { display:block; height:100%; width:0; }
.track i.lost { background:var(--red); }
.track i.refused { background:var(--amber); }
.track i.slow { background:var(--blue); }
.per { margin-top:8px; border-top:1px solid var(--line); padding-top:5px; }
.per .row { display:flex; justify-content:space-between; font-size:9.5px; color:var(--dim); padding:2px 0; }
.per .row b { color:var(--text); font-weight:500; }
@media (max-width:800px) { .body { grid-template-columns:1fr; } .main { border-right:none; border-bottom:1px solid var(--line); } .records { grid-template-columns:1fr; } }
`,O=`
<div class="wrap">
  <div class="bar"><span class="title">The Registry <span>· three records, one damage bill</span></span><span class="spacer"></span><span class="clock mono">10 worlds</span></div>
  <div class="brief">
    <div class="brief-title">Your job: run Porto's record office. Lower the damage bill.</div>
    <div class="brief-copy">Every world tries a write for all three records. Three decisions explain the whole game:</div>
    <div class="guide">
      <div class="gstep"><b>1 · Quorum</b><span>How many offices must confirm before a write counts. 1 is fast and brittle; 3 is safe but slow and often unavailable.</span></div>
      <div class="gstep"><b>2 · Conflict</b><span>What happens when two writes collide: silent last-writer-wins, refund the loser, or send both to a human clerk.</span></div>
      <div class="gstep"><b>3 · Damage</b><span>Lost + turned away + slow. Lower is better. S is within 10% of the best possible policy set.</span></div>
    </div>
    <div class="terms"><span class="term"><b>Silent</b> cheapest; a lost write is invisible.</span><span class="term"><b>Notify</b> refund the losing buyer; safe, costs more.</span><span class="term"><b>Clerk</b> keep both; a human resolves; fee + delay.</span></div>
    <div class="hintline">The signup list can tolerate a silent loss. The land deed cannot. That is why one policy does not fit all three records.</div>
  </div>
  <div class="body">
    <div class="main">
      <div class="records" id="records"></div>
      <div class="rail"><span class="rail-label">Worlds</span><div class="tiles" id="tiles"></div><span class="hint">click a world to inspect</span><span class="legend">tile = total damage · green clean · amber turned away · red lost</span></div>
      <div class="detail" id="detail"></div>
    </div>
    <div class="side">
      <div class="score">
        <div class="score-rank"><span class="rank" id="rank">—</span><div><div class="kicker">Damage</div><div class="big" id="total">—</div></div><div class="best"><span>BEST</span><b id="best">—</b></div></div>
        <div class="stat"><span>Best possible</span><b id="optimum">—</b></div>
        <div class="stat"><span>S target</span><b id="target">—</b></div>
        <div class="target" id="note"></div>
        <div class="bars">
          <div class="brow"><span>Lost</span><div class="track"><i class="lost" id="barLost"></i></div><span class="mono" id="lost">0</span></div>
          <div class="brow"><span>Turned away</span><div class="track"><i class="refused" id="barRefused"></i></div><span class="mono" id="refused">0</span></div>
          <div class="brow"><span>Slow</span><div class="track"><i class="slow" id="barSlow"></i></div><span class="mono" id="slow">0</span></div>
        </div>
        <div class="per" id="perRecord"></div>
      </div>
    </div>
  </div>
</div>
`,P=a=>{const r=a.shadowRoot??a.attachShadow({mode:"open"});r.innerHTML="<style>"+H+"</style>"+O;const t=e=>r.querySelector("#"+e),o={policies:I(),selected:0,best:null},b="registry:v2:best";function n(){try{const e=localStorage.getItem(b);if(e===null)return null;const s=Number(e);return Number.isFinite(s)&&s>=0?s:null}catch{return null}}function p(e){if(!(o.best!==null&&e>=o.best)){o.best=e;try{localStorage.setItem(b,String(e))}catch{}}}const i=e=>e==="none"?"roads open":e==="A"?"Porto isolated":e==="B"?"Kyoto isolated":e==="C"?"Denver isolated":"all roads cut",l=e=>e==="lostSilent"?"both accepted; one lost silently":e==="lostNotified"?"both accepted; loser refunded":e==="clerk"?"both accepted; sent to a clerk":e==="one refused"?"one accepted; one turned away":e==="both refused"?"no quorum; both turned away":e==="refused"?"no quorum; turned away":"committed";function g(e){const s=e.quorum===1?"One office can accept alone.":e.quorum===2?"Two offices must agree.":"All three offices must agree.",c=e.conflict==="silent"?"A collision can vanish without telling the buyer.":e.conflict==="notify"?"A collision is refused and the buyer is refunded.":"A collision goes to a human clerk (slow, fee).";return s+" "+c}function m(e){t("records").innerHTML=w.map(s=>{const c=o.policies[s.id],h={1:"Fast; one office can accept alone.",2:"Majority; may refuse during a cut.",3:"All three; slow and often refuses."},d={silent:"Cheapest; a lost write is silent.",notify:"Refund the losing buyer.",clerk:"Keep both; a human resolves."},u=[1,2,3].map(f=>'<button class="chip'+(c.quorum===f?" on":"")+'" title="'+h[f]+'" data-q="'+f+'" data-rec="'+s.id+'">'+f+"</button>").join(""),z=["silent","notify","clerk"].map(f=>'<button class="chip'+(c.conflict===f?" on":"")+'" title="'+d[f]+'" data-c="'+f+'" data-rec="'+s.id+'">'+(f==="silent"?"Silent":f==="notify"?"Notify":"Clerk")+"</button>").join("");return'<div class="rec"><div class="rec-head"><b>'+s.label+"</b><span>stakes "+s.stakes+(s.refundable?" · refundable":" · no refund")+'</span></div><div class="grp">Quorum · offices that must agree</div><div class="seg">'+u+'</div><div class="grp">Conflict · what happens to the loser</div><div class="opts">'+z+'</div><div class="policy-line">'+g(c)+'</div><div class="rec-dmg"><span>damage</span><b class="mono">'+e[s.id].toFixed(1)+"</b></div></div>"}).join(""),t("records").querySelectorAll("[data-q]").forEach(s=>s.addEventListener("click",()=>{o.policies[s.dataset.rec].quorum=Number(s.dataset.q),x()})),t("records").querySelectorAll("[data-c]").forEach(s=>s.addEventListener("click",()=>{o.policies[s.dataset.rec].conflict=s.dataset.c,x()}))}function y(e,s){const c=L[s],h=w.map(d=>{const u=e[d.id];return'<div class="drow"><span>'+d.label+'</span><span class="x">'+l(u.outcome)+(u.days?" · "+u.days+"d":"")+'</span><span class="d mono">'+u.damage.toFixed(1)+"</span></div>"}).join("");t("detail").innerHTML="<b>World "+(c.id+1)+" · "+i(c.cut)+" · "+(c.two?"two conflicting writes":"single write at "+(c.origin??"A"))+".</b>"+h}function x(){const e=q(o.policies),s=E(),c=D(e.total);p(e.total),t("rank").textContent=c,t("rank").className="rank "+c.toLowerCase(),t("total").textContent=e.total.toFixed(1),t("optimum").textContent=s.toFixed(1),t("target").textContent="≤ "+(s*1.1).toFixed(1);const h=e.total-s;t("note").textContent="Your bill "+e.total.toFixed(1)+". Best possible "+s.toFixed(1)+". S is ≤ "+(s*1.1).toFixed(1)+". Lost costs the most; turned away is an unserved customer; slow is delay."+(h>.05?" You are "+h.toFixed(1)+" above the optimum.":""),t("lost").textContent=e.lost.toFixed(1),t("refused").textContent=e.refused.toFixed(1),t("slow").textContent=e.slow.toFixed(1),t("barLost").style.width=Math.min(100,e.lost/Math.max(e.total,1)*100)+"%",t("barRefused").style.width=Math.min(100,e.refused/Math.max(e.total,1)*100)+"%",t("barSlow").style.width=Math.min(100,e.slow/Math.max(e.total,1)*100)+"%",t("best").textContent=o.best===null?"—":o.best.toFixed(1),t("perRecord").innerHTML=w.map(d=>'<div class="row"><span>'+d.label+'</span><b class="mono">'+e.perRecord[d.id].toFixed(1)+"</b></div>").join(""),m(e.perRecord),t("tiles").innerHTML=e.worlds.map((d,u)=>'<button class="tile '+(d.lost>0?"bad":d.refused>0?"warn":"ok")+(u===o.selected?" sel":"")+'" data-i="'+u+'" title="World '+(u+1)+" · total damage "+d.total.toFixed(1)+' · click to inspect">'+d.total.toFixed(1)+"</button>").join(""),t("tiles").querySelectorAll("[data-i]").forEach(d=>d.addEventListener("click",()=>{o.selected=Number(d.dataset.i),x()})),y(e.worlds[o.selected].cells,o.selected)}return o.best=n(),x(),{destroy(){r.innerHTML=""}}};export{P as default};
