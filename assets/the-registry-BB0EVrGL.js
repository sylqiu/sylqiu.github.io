const B=[{id:"signup",label:"Signup list",stakes:.5,refundable:!0},{id:"parcel",label:"Parcel order",stakes:3,refundable:!0},{id:"deed",label:"Land deed",stakes:5,refundable:!1}],A=[{id:0,cut:"none",two:!0,origin:null,seed:1},{id:1,cut:"none",two:!1,origin:"A",seed:2},{id:2,cut:"A",two:!0,origin:null,seed:3},{id:3,cut:"B",two:!1,origin:"B",seed:4},{id:4,cut:"C",two:!0,origin:null,seed:5},{id:5,cut:"all",two:!0,origin:null,seed:6},{id:6,cut:"B",two:!1,origin:"A",seed:7},{id:7,cut:"none",two:!0,origin:null,seed:8},{id:8,cut:"A",two:!1,origin:"C",seed:9},{id:9,cut:"C",two:!0,origin:null,seed:10}],I={A:0,B:6,C:2},H=["A","B","C"],W=1.8,se=3.9,P=.3;function ae(i,r){return r==="all"||r===i?[i]:r==="none"?[...H]:H.filter(s=>s!==r)}function ne(i,r,s){const o=ae(i,s);if(o.length<r)return null;const n=o.filter(f=>f!==i).sort((f,c)=>I[f]-I[c]).slice(0,r-1);return Math.max(...[i,...n].map(f=>I[f]))}function le(i,r){switch(i){case"ok":return 0;case"refused":return W;case"lostSilent":return r.stakes*2;case"lostNotified":return r.refundable?1.5+.2*r.stakes:.8*r.stakes;case"clerk":return se;default:throw new Error(i)}}function S(i,r,s,o){if(r==="refused"){i.refused+=W;return}if(r==="ok"){i.slow+=P*o;return}i.lost+=le(r,s),i.slow+=P*o}function Y(i,r,s){const o={lost:0,refused:0,slow:0},f=(s.two?["A","C"]:[s.origin??"A"]).map(a=>ne(a,r.quorum,s.cut));let c="ok";if(!s.two)f[0]===null?(S(o,"refused",i,0),c="refused"):(S(o,"ok",i,f[0]),c="ok");else{const[a,p]=f;if(a===null&&p===null)S(o,"refused",i,0),S(o,"refused",i,0),c="both refused";else if(a!==null&&p!==null){const g=Math.max(a,p),h=r.conflict==="silent"?"lostSilent":r.conflict==="notify"?"lostNotified":"clerk";S(o,h,i,g),c=h}else{const g=a??p;S(o,"refused",i,0),S(o,"ok",i,g),c="one refused"}}return{outcome:c,damage:Math.round((o.lost+o.refused+o.slow)*10)/10,lost:Math.round(o.lost*10)/10,refused:Math.round(o.refused*10)/10,slow:Math.round(o.slow*10)/10,days:Math.max(...f.filter(a=>a!==null),0)}}function G(i){const r={signup:0,parcel:0,deed:0},s=A.map(a=>{const p={};let g=0,h=0,M=0,C=0;for(const u of B){const v=Y(u,i[u.id],a);p[u.id]=v,g+=v.damage,h+=v.lost,M+=v.refused,C+=v.slow,r[u.id]+=v.damage}return{world:a,cells:p,total:Math.round(g*10)/10,lost:h,refused:M,slow:C}}),o=Math.round(s.reduce((a,p)=>a+p.total,0)*10)/10,n=Math.round(s.reduce((a,p)=>a+p.lost,0)*10)/10,f=Math.round(s.reduce((a,p)=>a+p.refused,0)*10)/10,c=Math.round(s.reduce((a,p)=>a+p.slow,0)*10)/10;for(const a of Object.keys(r))r[a]=Math.round(r[a]*10)/10;return{worlds:s,total:o,lost:n,refused:f,slow:c,perRecord:r}}const K=[];for(const i of[1,2,3])for(const r of["silent","notify","clerk"])K.push({quorum:i,conflict:r});let F=null;function Q(){if(F!==null)return F;let i=0;for(const r of B){let s=1/0;for(const o of K){const f=G({signup:o,parcel:o,deed:o}).perRecord[r.id];f<s&&(s=f)}i+=s}return F=Math.round(i*10)/10,F}function de(i){const r=Q(),s=r>0?(i-r)/r:0;return s<=.1?"S":s<=.3?"A":s<=.5?"B":"C"}function ce(){return{signup:{quorum:2,conflict:"notify"},parcel:{quorum:2,conflict:"notify"},deed:{quorum:2,conflict:"notify"}}}const pe=`
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
.wrap.campaign .brief { display:none; }
.wrap.campaign .records { grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); }
.wrap.campaign .best { display:none; }
.wrap.inspect .body { grid-template-columns:1fr; }
.wrap.inspect .main { border-right:none; }
.wrap.inspect .side, .wrap.inspect .rec-dmg, .wrap.inspect .legend { display:none; }
.conflict-strip { display:none; margin:0 0 10px; border:1px solid var(--line); border-radius:8px; background:#10151c; padding:8px 10px; }
.wrap.focus .conflict-strip { display:block; }
.wrap.focus .body { grid-template-columns:1fr; }
.wrap.focus .main { border-right:none; }
.wrap.focus .side { display:none; }
.wrap.focus .legend { display:none; }
.write { display:flex; gap:8px; align-items:baseline; padding:3px 0; font-size:10px; color:var(--dim); }
.write .who { color:var(--text); font-weight:600; min-width:88px; }
.write .what { flex:1; }
.write .tag { font-size:8.5px; letter-spacing:.08em; text-transform:uppercase; }
.write .tag.ok { color:var(--green); }
.write .tag.bad { color:var(--red); }
.conflict-q { margin-top:6px; padding-top:6px; border-top:1px solid #1b2230; font-size:9.5px; color:var(--dimmer); }
`,ue=`
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
      <div class="conflict-strip" id="conflictStrip" hidden></div>
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
`,fe=(i,r)=>{const s=i.shadowRoot??i.attachShadow({mode:"open"});s.innerHTML="<style>"+pe+"</style>"+ue;const o=e=>s.querySelector("#"+e),n=r.campaign,f=n?.records?.length?n.records:B.map(e=>e.id),c=B.filter(e=>f.includes(e.id)),a=(n?.worlds?.length?n.worlds:A.map(e=>e.id)).map(e=>A[e]).filter(e=>!!e),p=new Set(n?.controls??["quorum","conflict"]),g=n?.goal?.kind==="audit",h=!!n&&!g&&c.length===1&&a.length===1&&p.size===1&&p.has("conflict"),M=s.querySelector(".wrap");if(n&&M.classList.add("campaign"),g&&M.classList.add("inspect"),h&&M.classList.add("focus"),n){const e=s.querySelector(".bar .title");e&&(e.innerHTML="The Registry <span>· "+c.length+(c.length===1?" record":" records")+" · "+a.length+(a.length===1?" write":" writes")+"</span>");const t=s.querySelector(".clock");t&&(t.textContent=a.length+(a.length===1?" world":" worlds"));const d=s.querySelector(".rail-label");d&&(d.textContent=g||h?"The write":"Worlds");const x=s.querySelector(".hint");x&&(x.textContent=g?"Click the deed write below to open the record.":h?"Click the write to see both versions.":"click a world to inspect")}const C=ce();if(n?.initialPolicies)for(const e of c)C[e.id]={...C[e.id],...n.initialPolicies[e.id]??{}};const u={policies:C,selected:a[0]?.id??0,best:null},v="registry:v2:best";function U(){if(n)return null;try{const e=localStorage.getItem(v);if(e===null)return null;const t=Number(e);return Number.isFinite(t)&&t>=0?t:null}catch{return null}}function _(e){if(!n&&!(u.best!==null&&e>=u.best)){u.best=e;try{localStorage.setItem(v,String(e))}catch{}}}const $=e=>e==="none"?"roads open":e==="A"?"Porto isolated":e==="B"?"Kyoto isolated":e==="C"?"Denver isolated":"all roads cut",J=e=>e==="lostSilent"?"both accepted; one lost silently":e==="lostNotified"?"both accepted; loser refunded":e==="clerk"?"both accepted; sent to a clerk":e==="one refused"?"one accepted; one turned away":e==="both refused"?"no quorum; both turned away":e==="refused"?"no quorum; turned away":"committed";function V(e){const t=e.quorum===1?"One office can accept alone.":e.quorum===2?"Two offices must agree.":"All three offices must agree.",d=e.conflict==="silent"?"A collision can vanish without telling the buyer.":e.conflict==="notify"?"A collision is refused and the buyer is refunded.":"A collision goes to a human clerk (slow, fee).";return t+" "+d}function X(e){o("records").innerHTML=c.map(t=>{const d=u.policies[t.id],x={1:"Fast; one office can accept alone.",2:"Majority; may refuse during a cut.",3:"All three; slow and often refuses."},b={silent:"Cheapest; a lost write is silent.",notify:"Refund the losing buyer.",clerk:"Keep both; a human resolves."},w=[1,2,3].map(m=>'<button class="chip'+(d.quorum===m?" on":"")+'" title="'+x[m]+'" data-q="'+m+'" data-rec="'+t.id+'">'+m+"</button>").join(""),z=["silent","notify","clerk"].map(m=>'<button class="chip'+(d.conflict===m?" on":"")+'" title="'+b[m]+'" data-c="'+m+'" data-rec="'+t.id+'">'+(m==="silent"?"Silent":m==="notify"?"Notify":"Clerk")+"</button>").join(""),l=p.has("quorum")?'<div class="grp">Quorum · offices that must agree</div><div class="seg">'+w+"</div>":"",y=p.has("conflict")?'<div class="grp">Conflict · what happens to the loser</div><div class="opts">'+z+"</div>":"",k=p.size?V(d):"One record, one owner. This stop only inspects the write.";return'<div class="rec"><div class="rec-head"><b>'+t.label+"</b><span>stakes "+t.stakes+(t.refundable?" · refundable":" · no refund")+"</span></div>"+l+y+'<div class="policy-line">'+k+'</div><div class="rec-dmg"><span>damage</span><b class="mono">'+e[t.id].toFixed(1)+"</b></div></div>"}).join(""),o("records").querySelectorAll("[data-q]").forEach(t=>t.addEventListener("click",()=>{q=!0,u.policies[t.dataset.rec].quorum=Number(t.dataset.q),T()})),o("records").querySelectorAll("[data-c]").forEach(t=>t.addEventListener("click",()=>{q=!0,u.policies[t.dataset.rec].conflict=t.dataset.c,T()}))}function Z(e,t){const d=A[t],x=c.map(b=>{const w=e[b.id];return'<div class="drow"><span>'+b.label+'</span><span class="x">'+J(w.outcome)+(w.days?" · "+w.days+"d":"")+"</span>"+(g?"":'<span class="d mono">'+w.damage.toFixed(1)+"</span>")+"</div>"}).join("");o("detail").innerHTML="<b>World "+(d.id+1)+" · "+$(d.cut)+" · "+(d.two?"two conflicting writes":"single write at "+(d.origin??"A"))+".</b>"+x}const N=[];for(const e of[1,2,3])for(const t of["silent","notify","clerk"])N.push({quorum:e,conflict:t});function ee(){const e=G(u.policies),t={signup:0,parcel:0,deed:0};let d=0,x=0,b=0,w=0;const z=a.map(l=>{const y=e.worlds[l.id],k={};let m=0,E=0,O=0,j=0;for(const D of c){const L=y.cells[D.id];k[D.id]=L,m+=L.damage,E+=L.lost,O+=L.refused,j+=L.slow,t[D.id]+=L.damage}return d+=m,x+=E,b+=O,w+=j,{world:l,cells:k,total:Math.round(m*10)/10,lost:E,refused:O,slow:j}});for(const l of Object.keys(t))t[l]=Math.round(t[l]*10)/10;return{worlds:z,total:Math.round(d*10)/10,lost:Math.round(x*10)/10,refused:Math.round(b*10)/10,slow:Math.round(w*10)/10,perRecord:t}}function te(){let e=0;for(const t of c){let d=1/0;for(const x of N){let b=0;for(const w of a)b+=Y(t,x,w).damage;b<d&&(d=b)}e+=d}return Math.round(e*10)/10}const oe=te();function re(){const e=n?.goal;return e?e.kind==="audit"?"Goal · inspect the write":e.kind==="damage"?"Goal · ≤ "+e.max.toFixed(1)+" damage":e.kind==="no-silent"?"Goal · no silent conflict":"Goal · 0 turned away":"S target"}function ie(e){const t=n?.goal;return!t||t.kind==="audit"?!1:t.kind==="damage"?e.total<=t.max+.05:t.kind==="no-silent"?u.policies[t.record].conflict!=="silent":e.refused<=.05}let R=!1,q=!1;function T(){const e=ee(),t=n?oe:Q(),d=t>0?(e.total-t)/t:0,x=ie(e),b=n?n.goal?.kind==="damage"?d<=.1?"S":d<=.3?"A":d<=.5?"B":"C":x?"✓":"—":de(e.total);_(e.total),o("rank").textContent=b,o("rank").className="rank "+(b==="✓"?"s":b.toLowerCase()),o("total").textContent=e.total.toFixed(1),o("optimum").textContent=t.toFixed(1),o("target").textContent=n?re():"≤ "+(t*1.1).toFixed(1);const w=e.total-t;if(o("note").textContent=n?c.length+(c.length===1?" record":" records")+" · "+a.length+(a.length===1?" world":" worlds")+". Lost hides a vanished write; turned away is an unserved buyer; slow is delay.":"Your bill "+e.total.toFixed(1)+". Best possible "+t.toFixed(1)+". S is ≤ "+(t*1.1).toFixed(1)+". Lost costs the most; turned away is an unserved customer; slow is delay."+(w>.05?" You are "+w.toFixed(1)+" above the optimum.":""),o("lost").textContent=e.lost.toFixed(1),o("refused").textContent=e.refused.toFixed(1),o("slow").textContent=e.slow.toFixed(1),o("barLost").style.width=Math.min(100,e.lost/Math.max(e.total,1)*100)+"%",o("barRefused").style.width=Math.min(100,e.refused/Math.max(e.total,1)*100)+"%",o("barSlow").style.width=Math.min(100,e.slow/Math.max(e.total,1)*100)+"%",o("best").textContent=u.best===null?"—":u.best.toFixed(1),o("perRecord").innerHTML=c.map(l=>'<div class="row"><span>'+l.label+'</span><b class="mono">'+e.perRecord[l.id].toFixed(1)+"</b></div>").join(""),X(e.perRecord),h){const l=o("conflictStrip");l.hidden=!1;const y=u.policies.deed,k=y.conflict==="silent"?"The stale write vanishes. Bob is never told.":y.conflict==="notify"?"The losing write is returned to Bob with a conflict notice.":"Both writes are kept for a clerk to resolve.";l.innerHTML='<div class="write"><span class="who">Alice’s office</span><span class="what">writes “owner: Alice” at 12:00</span><span class="tag ok">accepted</span></div><div class="write stale"><span class="who">Bob’s office</span><span class="what">writes “owner: Bob” at 12:01</span><span class="tag bad">stale</span></div><div class="conflict-q">'+k+"</div>"}o("tiles").innerHTML=e.worlds.map(l=>{const y=l.lost>0?"bad":l.refused>0?"warn":"ok",k=g?"Open deed":h?"Inspect":l.total.toFixed(1),m=g?"Deed write · single owner · click to open":h?"Two conflicting writes · click to inspect":"World "+(l.world.id+1)+" · total damage "+l.total.toFixed(1)+" · click to inspect";return'<button class="tile '+y+(l.world.id===u.selected?" sel":"")+'" data-i="'+l.world.id+'" title="'+m+'">'+k+"</button>"}).join(""),o("tiles").querySelectorAll("[data-i]").forEach(l=>l.addEventListener("click",()=>{q=!0,u.selected=Number(l.dataset.i),g&&n?.onComplete?.({passed:!0,detail:"The deed write is committed once, with one owner recorded."}),T()}));const z=e.worlds.find(l=>l.world.id===u.selected)??e.worlds[0];Z(z.cells,z.world.id),n&&!g&&(x?R||(R=!0,n.onComplete?.({passed:!0,detail:"Office damage is "+e.total.toFixed(1)+" with "+e.refused.toFixed(1)+" turned away."})):q&&(R=!1,n.onComplete?.({passed:!1,detail:"Office damage is "+e.total.toFixed(1)+" — still above the goal."})))}return u.best=U(),T(),{destroy(){s.innerHTML=""}}};export{fe as default};
