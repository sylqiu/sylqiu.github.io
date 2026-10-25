const h=["no cut","no cut","Porto–Kyoto cut","Porto–Kyoto cut","Porto–Denver cut","Porto–Denver cut","Kyoto–Denver cut","Kyoto–Denver cut","Porto isolated","Denver isolated"];function q(s,r,e){return s===r||e==="no cut"?!0:e==="Porto isolated"?s===r||s!=="A"&&r!=="A":e==="Denver isolated"?s===r||s!=="C"&&r!=="C":e==="Porto–Kyoto cut"?!(s==="A"&&r==="B"||s==="B"&&r==="A"):e==="Porto–Denver cut"?!(s==="A"&&r==="C"||s==="C"&&r==="A"):e==="Kyoto–Denver cut"?!(s==="B"&&r==="C"||s==="C"&&r==="B"):!0}function w(s,r){return["A","B","C"].filter(e=>q(s,e,r)).length}function A(s,r){const e=h[s%h.length],a=r.quorum<=w("A",e),p=r.quorum<=w("C",e);let c=a,d=p,n=!0,i="";c&&d?r.quorum===1?(n=!1,r.conflict==="lww"?i="Both offices acknowledged the deed. On reconnect, last-writer-wins kept one sale and silently dropped the other acknowledged transfer.":(d=!1,i="Both offices acknowledged the deed. On reconnect the conflicting Denver transfer was rejected, so one acknowledged sale was lost.")):(d=!1,i="Porto met its quorum and accepted. Denver refused the conflicting write because a majority was already committed."):c?i="Porto met its quorum and accepted. Denver refused: no quorum on its side of the cut.":d?i="Denver met its quorum and accepted. Porto refused: no quorum on your side of the cut.":i="Neither office had a quorum. Both transfers were refused; the deed did not move.";const v=(c?1:0)+(d?1:0),u=Math.round(r.quorum*1.2*10)/10;return{id:s,cut:e,aCommitted:c,cCommitted:d,safe:n,available:v,cost:u,detail:i}}function C(s){return Array.from({length:10},(r,e)=>A(e,s))}function k(s,r=40){const e=s.filter(n=>n.safe).length,a=s.reduce((n,i)=>n+i.available,0),p=Math.round(s.reduce((n,i)=>n+i.cost,0)*10)/10,c=e===10&&a>=10&&p<=r,d=e===10&&a>=10&&p<=24?"S":c?"A":e>=9?"B":"C";return{safe:e,available:a,cost:p,pass:c,rank:d}}const T=`
:host { display: block; }
* { box-sizing: border-box; }
.wrap { --line:#242a34; --panel:#12151b; --panel2:#171b22; --text:#e6e9ef; --dim:#8b94a3; --dimmer:#5c6472; --blue:#58a6ff; --green:#3fb950; --red:#f85149; --amber:#d29922; --violet:#a371f7; --gold:#e3b341; color:var(--text); font:13.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; border:1px solid var(--line); border-radius:12px; overflow:hidden; background:#0e1116; }
.mono { font-family:"SF Mono",ui-monospace,Menlo,monospace; font-variant-numeric:tabular-nums; }
button { font:inherit; color:var(--text); background:var(--panel2); border:1px solid var(--line); border-radius:7px; padding:5px 9px; cursor:pointer; font-size:12px; }
button:hover { border-color:#3a4350; }
button:disabled { opacity:.4; cursor:default; }
.bar { display:flex; align-items:center; gap:8px; padding:9px 12px; border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.bar .title { font-size:12.5px; font-weight:560; }
.bar .title span { color:var(--dimmer); font-weight:400; }
.bar .spacer { flex:1; }
.clock { font-size:10.5px; color:var(--dim); }
.brief { padding:10px 14px 9px; border-bottom:1px solid var(--line); background:linear-gradient(180deg,#11161d,#0d1116); }
.brief-title { font-size:12px; font-weight:600; }
.brief-copy { font-size:10.5px; color:var(--dim); line-height:1.5; margin-top:3px; max-width:760px; }
.brief-goal { font-size:9.5px; color:var(--dimmer); margin-top:5px; }
.brief-goal b { color:var(--gold); font-weight:600; letter-spacing:.04em; }
.body { display:grid; grid-template-columns:1fr 340px; }
.main { min-width:0; border-right:1px solid var(--line); }
.side { min-width:0; }
.worldhead { padding:12px 14px 6px; display:flex; justify-content:space-between; gap:10px; align-items:baseline; }
.worldhead b { font-size:13px; font-weight:560; }
.worldhead span { font-size:10.5px; color:var(--dimmer); }
.offices { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; padding:4px 14px 10px; }
.office { border:1px solid var(--line); border-radius:9px; background:var(--panel); padding:9px 10px; min-width:0; }
.office.you { border-color:#5a4a1c; background:#1c1a12; }
.office .tag { font-size:8px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); }
.office.you .tag { color:var(--gold); }
.office .name { font-size:13px; font-weight:560; margin-top:1px; }
.office .status { font-size:10px; color:var(--dim); margin-top:4px; line-height:1.4; }
.office .status.ok { color:var(--green); }
.office .status.bad { color:var(--red); }
.detail { margin:0 14px 10px; border:1px solid var(--line); border-radius:9px; background:#10151d; padding:10px 12px; min-height:58px; font-size:10.5px; color:var(--dim); line-height:1.5; }
.detail b { color:var(--text); font-weight:560; }
.rail { display:flex; align-items:center; gap:8px; padding:8px 12px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.rail-label { font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); }
.hint { font-size:9.5px; color:var(--dimmer); }
.tiles { display:flex; gap:4px; flex-wrap:wrap; }
.tile { width:30px; height:24px; padding:0; border-radius:6px; background:#1a2029; border:1px solid #333d4b; color:var(--dim); font-size:10.5px; font-weight:600; display:grid; place-items:center; }
.tile.ok { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.tile.bad { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.tile.sel { box-shadow:0 0 0 1px var(--gold); }
.score { padding:12px; border-bottom:1px solid var(--line); }
.score-rank { display:flex; align-items:center; gap:9px; margin-bottom:5px; }
.rank { width:34px; height:34px; border-radius:9px; display:grid; place-items:center; font-size:17px; font-weight:650; border:1px solid var(--line); background:#141922; color:var(--dim); flex:none; }
.rank.s { background:var(--gold); border-color:var(--gold); color:#0d1117; }
.rank.a { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.rank.b { background:#221d10; border-color:#5a4a1c; color:var(--amber); }
.rank.c { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.kicker { font-size:8.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--dimmer); }
.big { font-size:16px; font-weight:560; }
.best { margin-left:auto; text-align:right; font-size:8.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--dimmer); line-height:1.45; flex:none; }
.best b { display:block; font-size:10px; font-weight:500; letter-spacing:0; text-transform:none; color:var(--text); }
.stat { display:flex; justify-content:space-between; gap:8px; font-size:10.5px; color:var(--dim); padding:3px 0; border-bottom:1px solid #171d26; }
.stat b { color:var(--text); font-weight:500; }
.track { height:4px; border-radius:999px; background:#1b222c; overflow:hidden; margin:7px 0 5px; }
.track i { display:block; height:100%; width:0; background:var(--green); }
.track i.over { background:var(--red); }
.why { font-size:9.5px; color:var(--dimmer); line-height:1.4; margin-top:4px; }
.rules { padding:12px; }
.grp { font-size:9px; letter-spacing:.13em; text-transform:uppercase; color:var(--dimmer); margin:8px 0 5px; font-weight:600; }
.opt { display:block; width:100%; text-align:left; background:var(--panel); border:1px solid var(--line); border-radius:7px; padding:5px 7px; margin-bottom:4px; cursor:pointer; color:var(--text); }
.opt.on { border-color:var(--gold); background:#1c1a12; }
.opt .row { display:flex; justify-content:space-between; gap:6px; align-items:baseline; }
.opt .nm { font-size:11px; font-weight:520; }
.opt .pr { font-size:10px; color:var(--gold); }
.opt .note { font-size:9.5px; color:var(--dimmer); line-height:1.3; margin-top:1px; display:none; }
.opt.on .note { display:block; }
@media (max-width:760px) { .body { grid-template-columns:1fr; } .main { border-right:none; border-bottom:1px solid var(--line); } .offices { grid-template-columns:1fr; } }
`,z=`
<div class="wrap">
  <div class="bar">
    <span class="title">The Registry <span>· one deed, three offices</span></span>
    <span class="spacer"></span>
    <span class="clock mono" id="clock">10 worlds</span>
  </div>
  <div class="brief">
    <div class="brief-title">Keep the deed single-owner.</div>
    <div class="brief-copy">You are the postmaster in Porto. A deed can be sold once. Two buyers, two offices, and a road that can be cut. Choose a write quorum and a conflict rule; ten worlds are scored at once, and you can click a result to see what happened.</div>
    <div class="brief-goal"><b>PASS</b> deed intact 10 / 10 · ≥10 acknowledged writes · ≤40 postage · <b>S</b> for a clean, available run</div>
  </div>
  <div class="body">
    <div class="main">
      <div class="worldhead"><b id="worldTitle">World 1</b><span id="worldSub"></span></div>
      <div class="offices" id="offices"></div>
      <div class="detail" id="detail"></div>
      <div class="rail"><span class="rail-label">Results</span><div class="tiles" id="tiles"></div><span class="hint">click a result to inspect</span></div>
    </div>
    <div class="side">
      <div class="score">
        <div class="score-rank"><span class="rank" id="rank">—</span><div><div class="kicker">Scoreboard</div><div class="big" id="safe">—</div></div><div class="best"><span>BEST</span><b id="best">—</b></div></div>
        <div class="stat"><span>Deed intact</span><b id="safe2">—</b></div>
        <div class="stat"><span>Acknowledged writes</span><b id="avail">—</b></div>
        <div class="stat"><span>Postage</span><b id="cost">—</b></div>
        <div class="track"><i id="bar"></i></div>
        <div class="why" id="why"></div>
      </div>
      <div class="rules" id="rules"></div>
    </div>
  </div>
</div>
`,L=s=>{const r=s.shadowRoot??s.attachShadow({mode:"open"});r.innerHTML="<style>"+T+"</style>"+z;const e=t=>r.querySelector("#"+t),a={policy:{quorum:2,conflict:"lww"},results:[],selected:0,best:null},p="registry:best";function c(){try{const t=localStorage.getItem(p);if(!t)return null;const o=JSON.parse(t);if(o&&typeof o.safe=="number"&&typeof o.available=="number"&&typeof o.cost=="number")return o}catch{}return null}function d(t){if(!t.pass)return;const o=a.best;if(!o||t.safe>o.safe||t.safe===o.safe&&t.available>o.available||t.safe===o.safe&&t.available===o.available&&t.cost<o.cost){a.best={safe:t.safe,available:t.available,cost:t.cost};try{localStorage.setItem(p,JSON.stringify(a.best))}catch{}}}function n(){a.results=C(a.policy);const t=k(a.results);a.selected>=a.results.length&&(a.selected=0),d(t),u()}function i(){const t=[{q:1,label:"One office",note:"Accept locally. Fast, but a partition can acknowledge two conflicting sales."},{q:2,label:"Majority (2 of 3)",note:"Balanced. One side of a cut may refuse, but conflicts cannot both commit."},{q:3,label:"All three",note:"Safest, but a single cut makes every transfer wait."}];e("rules").innerHTML='<div class="grp">Write quorum</div>'+t.map(o=>'<button class="opt '+(a.policy.quorum===o.q?"on":"")+'" data-q="'+o.q+'"><div class="row"><span class="nm">'+o.label+'</span><span class="pr mono">'+o.q+" ack"+(o.q>1?"s":"")+'</span></div><div class="note">'+o.note+"</div></button>").join("")+'<div class="grp" style="margin-top:10px">Conflict rule</div>'+[["lww","Last writer wins","On reconnect, the newest postmark wins; the other acknowledged sale is lost."],["reject","Reject conflicts","On reconnect, conflicting writes are refused; an acknowledged sale can still be lost at quorum 1."]].map(([o,l,f])=>'<button class="opt '+(a.policy.conflict===o?"on":"")+'" data-c="'+o+'"><div class="row"><span class="nm">'+l+'</span></div><div class="note">'+f+"</div></button>").join(""),e("rules").querySelectorAll("[data-q]").forEach(o=>o.addEventListener("click",()=>{a.policy.quorum=Number(o.dataset.q),n()})),e("rules").querySelectorAll("[data-c]").forEach(o=>o.addEventListener("click",()=>{a.policy.conflict=o.dataset.c,n()}))}function v(t){const o=t.cut,l=(f,y,m,x,D)=>{const S=m?"YOU · PORTO":D?"REMOTE":"NOTARY";let b="",g="";return x===!0?(b="Accepted a transfer.",g="ok"):x===!1?(b="Refused: no quorum.",g="bad"):b="Holds a replica of the deed.",'<div class="office '+(m?"you":"")+'"><div class="tag">'+S+'</div><div class="name">'+y+'</div><div class="status '+g+'">'+b+"</div></div>"};e("offices").innerHTML=l("A","Porto",!0,t.aCommitted,!1)+l("B","Kyoto",!1,null,!0)+l("C","Denver",!1,t.cCommitted,!0),e("worldTitle").textContent="World "+(t.id+1),e("worldSub").textContent=o==="no cut"?"roads open":o}function u(){const t=k(a.results),o=a.results[a.selected]??a.results[0];v(o),e("safe").textContent=t.safe+" / 10",e("safe2").textContent=t.safe+" / 10",e("avail").textContent=t.available+" / "+10*2,e("cost").textContent=t.cost+" / 40",e("cost").className=t.cost>40?"bad":"",e("bar").style.width=Math.min(100,t.cost/40*100)+"%",e("bar").className=t.cost>40?"over":"",e("rank").textContent=t.rank,e("rank").className="rank "+t.rank.toLowerCase(),e("best").textContent=a.best?a.best.safe+"/10 · "+a.best.available+"/20 · "+a.best.cost+"c":"—",e("why").textContent=t.pass?"Deed intact and the office stayed useful.":t.safe<10?10-t.safe+" worlds acknowledged a transfer that was later lost.":t.available<10?"Safe, but too many transfers were refused. A quorum that is never available is not useful.":"Over the postage budget.",e("why").style.color=t.pass?"var(--green)":"var(--red)",e("detail").innerHTML="<b>World "+(o.id+1)+" · "+o.cut+".</b> "+o.detail,e("tiles").innerHTML=a.results.map((l,f)=>'<button class="tile '+(l.safe?"ok":"bad")+(f===a.selected?" sel":"")+'" data-i="'+f+'" title="'+(l.safe?"deed intact":"lost acknowledged write")+'">'+(f+1)+"</button>").join(""),e("tiles").querySelectorAll("[data-i]").forEach(l=>l.addEventListener("click",()=>{a.selected=Number(l.dataset.i),u()})),i()}return a.best=c(),n(),{destroy(){r.innerHTML=""}}};export{L as default};
