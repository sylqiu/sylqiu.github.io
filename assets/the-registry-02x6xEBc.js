const w=[{id:"signup",label:"Signup list",stakes:.5,refundable:!0},{id:"parcel",label:"Parcel order",stakes:3,refundable:!0},{id:"deed",label:"Land deed",stakes:5,refundable:!1}],S=[{id:0,cut:"none",two:!0,origin:null,seed:1},{id:1,cut:"none",two:!1,origin:"A",seed:2},{id:2,cut:"A",two:!0,origin:null,seed:3},{id:3,cut:"B",two:!1,origin:"B",seed:4},{id:4,cut:"C",two:!0,origin:null,seed:5},{id:5,cut:"all",two:!0,origin:null,seed:6},{id:6,cut:"B",two:!1,origin:"A",seed:7},{id:7,cut:"none",two:!0,origin:null,seed:8},{id:8,cut:"A",two:!1,origin:"C",seed:9},{id:9,cut:"C",two:!0,origin:null,seed:10}],k={A:0,B:6,C:2},y=["A","B","C"],C=1.8,A=3.9,M=.3;function F(a,r){return r==="all"||r===a?[a]:r==="none"?[...y]:y.filter(e=>e!==r)}function R(a,r,e){const o=F(a,e);if(o.length<r)return null;const f=o.filter(n=>n!==a).sort((n,u)=>k[n]-k[u]).slice(0,r-1);return Math.max(...[a,...f].map(n=>k[n]))}function q(a,r){switch(a){case"ok":return 0;case"refused":return C;case"lostSilent":return r.stakes*2;case"lostNotified":return r.refundable?1.5+.2*r.stakes:.8*r.stakes;case"clerk":return A;default:throw new Error(a)}}function v(a,r,e,o){if(r==="refused"){a.refused+=C;return}if(r==="ok"){a.slow+=M*o;return}a.lost+=q(r,e),a.slow+=M*o}function T(a,r,e){const o={lost:0,refused:0,slow:0},n=(e.two?["A","C"]:[e.origin??"A"]).map(i=>R(i,r.quorum,e.cut));let u="ok";if(!e.two)n[0]===null?(v(o,"refused",a,0),u="refused"):(v(o,"ok",a,n[0]),u="ok");else{const[i,d]=n;if(i===null&&d===null)v(o,"refused",a,0),v(o,"refused",a,0),u="both refused";else if(i!==null&&d!==null){const b=Math.max(i,d),m=r.conflict==="silent"?"lostSilent":r.conflict==="notify"?"lostNotified":"clerk";v(o,m,a,b),u=m}else{const b=i??d;v(o,"refused",a,0),v(o,"ok",a,b),u="one refused"}}return{outcome:u,damage:Math.round((o.lost+o.refused+o.slow)*10)/10,lost:Math.round(o.lost*10)/10,refused:Math.round(o.refused*10)/10,slow:Math.round(o.slow*10)/10,days:Math.max(...n.filter(i=>i!==null),0)}}function z(a){const r={signup:0,parcel:0,deed:0},e=S.map(i=>{const d={};let b=0,m=0,x=0,t=0;for(const s of w){const l=T(s,a[s.id],i);d[s.id]=l,b+=l.damage,m+=l.lost,x+=l.refused,t+=l.slow,r[s.id]+=l.damage}return{world:i,cells:d,total:Math.round(b*10)/10,lost:m,refused:x,slow:t}}),o=Math.round(e.reduce((i,d)=>i+d.total,0)*10)/10,f=Math.round(e.reduce((i,d)=>i+d.lost,0)*10)/10,n=Math.round(e.reduce((i,d)=>i+d.refused,0)*10)/10,u=Math.round(e.reduce((i,d)=>i+d.slow,0)*10)/10;for(const i of Object.keys(r))r[i]=Math.round(r[i]*10)/10;return{worlds:e,total:o,lost:f,refused:n,slow:u,perRecord:r}}const L=[];for(const a of[1,2,3])for(const r of["silent","notify","clerk"])L.push({quorum:a,conflict:r});let h=null;function E(){if(h!==null)return h;let a=0;for(const r of w){let e=1/0;for(const o of L){const n=z({signup:o,parcel:o,deed:o}).perRecord[r.id];n<e&&(e=n)}a+=e}return h=Math.round(a*10)/10,h}function B(a){const r=E(),e=r>0?(a-r)/r:0;return e<=.1?"S":e<=.3?"A":e<=.5?"B":"C"}function D(){return{signup:{quorum:2,conflict:"notify"},parcel:{quorum:2,conflict:"notify"},deed:{quorum:2,conflict:"notify"}}}const j=`
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
`,N=`
<div class="wrap">
  <div class="bar"><span class="title">The Registry <span>· three records, one damage bill</span></span><span class="spacer"></span><span class="clock mono">10 worlds</span></div>
  <div class="brief">
    <div class="brief-title">Choose a policy per record. Minimize damage.</div>
    <div class="brief-copy">You are Porto. Every world runs a write for the signup list, a parcel order, and a land deed. The same policy cannot be right for all three: a newsletter can lose a write silently, a parcel wants a refund, a deed needs a human clerk. Ten seeded worlds; six have conflicting writes and four have a single write.</div>
    <div class="brief-goal"><b>DAMAGE</b> lost + turned away + slow · <b>S</b> within 10% of the brute-forced optimum · no single right answer</div>
  </div>
  <div class="body">
    <div class="main">
      <div class="records" id="records"></div>
      <div class="rail"><span class="rail-label">Worlds</span><div class="tiles" id="tiles"></div><span class="hint">click a world to inspect</span></div>
      <div class="detail" id="detail"></div>
    </div>
    <div class="side">
      <div class="score">
        <div class="score-rank"><span class="rank" id="rank">—</span><div><div class="kicker">Damage</div><div class="big" id="total">—</div></div><div class="best"><span>BEST</span><b id="best">—</b></div></div>
        <div class="stat"><span>Brute-force optimum</span><b id="optimum">—</b></div>
        <div class="stat"><span>Best rank target</span><b id="target">—</b></div>
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
`,I=a=>{const r=a.shadowRoot??a.attachShadow({mode:"open"});r.innerHTML="<style>"+j+"</style>"+N;const e=t=>r.querySelector("#"+t),o={policies:D(),selected:0,best:null},f="registry:v2:best";function n(){try{const t=localStorage.getItem(f);if(t===null)return null;const s=Number(t);return Number.isFinite(s)&&s>=0?s:null}catch{return null}}function u(t){if(!(o.best!==null&&t>=o.best)){o.best=t;try{localStorage.setItem(f,String(t))}catch{}}}const i=t=>t==="none"?"roads open":t==="A"?"Porto isolated":t==="B"?"Kyoto isolated":t==="C"?"Denver isolated":"all roads cut",d=t=>t==="lostSilent"?"silent loss":t==="lostNotified"?"refunded":t==="clerk"?"human clerk":t==="one refused"?"one refused":t==="both refused"?"both refused":t==="refused"?"refused":"committed";function b(t){e("records").innerHTML=w.map(s=>{const l=o.policies[s.id],p=[1,2,3].map(c=>'<button class="chip'+(l.quorum===c?" on":"")+'" data-q="'+c+'" data-rec="'+s.id+'">'+c+"</button>").join(""),g=["silent","notify","clerk"].map(c=>'<button class="chip'+(l.conflict===c?" on":"")+'" data-c="'+c+'" data-rec="'+s.id+'">'+(c==="silent"?"Silent":c==="notify"?"Notify":"Clerk")+"</button>").join("");return'<div class="rec"><div class="rec-head"><b>'+s.label+"</b><span>stakes "+s.stakes+(s.refundable?" · refundable":" · no refund")+'</span></div><div class="grp">Write quorum</div><div class="seg">'+p+'</div><div class="grp">Conflict rule</div><div class="opts">'+g+'</div><div class="rec-dmg"><span>damage</span><b class="mono">'+t[s.id].toFixed(1)+"</b></div></div>"}).join(""),e("records").querySelectorAll("[data-q]").forEach(s=>s.addEventListener("click",()=>{o.policies[s.dataset.rec].quorum=Number(s.dataset.q),x()})),e("records").querySelectorAll("[data-c]").forEach(s=>s.addEventListener("click",()=>{o.policies[s.dataset.rec].conflict=s.dataset.c,x()}))}function m(t,s){const l=S[s],p=w.map(g=>{const c=t[g.id];return'<div class="drow"><span>'+g.label+'</span><span class="x">'+d(c.outcome)+(c.days?" · "+c.days+"d":"")+'</span><span class="d mono">'+c.damage.toFixed(1)+"</span></div>"}).join("");e("detail").innerHTML="<b>World "+(l.id+1)+" · "+i(l.cut)+" · "+(l.two?"two conflicting writes":"single write at "+(l.origin??"A"))+".</b>"+p}function x(){const t=z(o.policies),s=E(),l=B(t.total);u(t.total),e("rank").textContent=l,e("rank").className="rank "+l.toLowerCase(),e("total").textContent=t.total.toFixed(1),e("optimum").textContent=s.toFixed(1),e("target").textContent="≤ "+(s*1.1).toFixed(1),e("note").textContent="Damage = lost + turned away + slow. The optimum is recomputed from all nine policies per record; no single policy wins every record.",e("lost").textContent=t.lost.toFixed(1),e("refused").textContent=t.refused.toFixed(1),e("slow").textContent=t.slow.toFixed(1),e("barLost").style.width=Math.min(100,t.lost/Math.max(t.total,1)*100)+"%",e("barRefused").style.width=Math.min(100,t.refused/Math.max(t.total,1)*100)+"%",e("barSlow").style.width=Math.min(100,t.slow/Math.max(t.total,1)*100)+"%",e("best").textContent=o.best===null?"—":o.best.toFixed(1),e("perRecord").innerHTML=w.map(p=>'<div class="row"><span>'+p.label+'</span><b class="mono">'+t.perRecord[p.id].toFixed(1)+"</b></div>").join(""),b(t.perRecord),e("tiles").innerHTML=t.worlds.map((p,g)=>'<button class="tile '+(p.lost>0?"bad":p.refused>0?"warn":"ok")+(g===o.selected?" sel":"")+'" data-i="'+g+'" title="World '+(g+1)+'">'+p.total.toFixed(1)+"</button>").join(""),e("tiles").querySelectorAll("[data-i]").forEach(p=>p.addEventListener("click",()=>{o.selected=Number(p.dataset.i),x()})),m(t.worlds[o.selected].cells,o.selected)}return o.best=n(),x(),{destroy(){r.innerHTML=""}}};export{I as default};
