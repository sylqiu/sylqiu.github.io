const Me={A:{id:"A",friend:"Alice",city:"Porto",x:175,y:620,color:"#58a6ff"},B:{id:"B",friend:"Bob",city:"Kyoto",x:390,y:300,color:"#3fb950"},C:{id:"C",friend:"Carol",city:"Denver",x:610,y:600,color:"#d2a8ff"}},he={numbering:[{id:"none",label:"No number",cost:0,note:"Cheapest. Nothing can be matched to anything."},{id:"date",label:"Date stamp",cost:.1,note:"One stamp for the whole day — not unique."},{id:"serial",label:"Sender + serial",cost:.3,note:"A-01, A-02… unique per letter."}],receipts:[{id:"none",label:"No receipt",cost:0,note:"The sender never learns what happened."},{id:"sign",label:"Signature back",cost:.4,note:"The receiver signs; the slip returns."}],retry:[{id:"never",label:"Never resend",cost:0,note:"One attempt, whatever happens."},{id:"tuned",label:"Round-trip timeout",cost:.6,note:"Resend once, but only after the route could have delivered and returned."},{id:"quick",label:"Fixed 6.5-day retry",cost:.2,note:"Cheap and fixed. Right for a 2-day route; wrong when the route grows."}],ledger:[{id:"off",label:"No ledger",cost:0,note:"Every copy that arrives is delivered."},{id:"on",label:"Ledger of numbers",cost:.3,note:"Drops a copy whose number is already delivered."}]},K=[{day:1,title:"A calm day",blurb:"Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.",deadline:5,remote:!1,lostBags:[],lostReceipts:[]},{day:2,title:"A sack goes missing",blurb:"One courier bag never arrives. The letter inside is gone — not delayed, gone.",deadline:12,remote:!1,lostBags:[{letter:1,attempt:1}],lostReceipts:[]},{day:3,title:"The receipt never arrives",blurb:"The letter arrived. The signed slip did not. The sender cannot tell the difference.",deadline:12,remote:!1,lostBags:[],lostReceipts:[{letter:1}]},{day:4,title:"Bob moves to the mountains",blurb:"Bob is four days away now. Every slip takes the slow road back.",deadline:14,remote:!0,lostBags:[],lostReceipts:[]}],V=10,fe=[60,75,105,150],Te=[{sack:0,slip:0,storm:0},{sack:.07,slip:0,storm:0},{sack:.05,slip:.2,storm:.05},{sack:.05,slip:.1,storm:.25}];function Se(k){let v=k>>>0;return function(){v=v+1831565813>>>0;let d=v;return d=Math.imul(d^d>>>15,1|d),d=d+Math.imul(d^d>>>7,61|d)^d,((d^d>>>14)>>>0)/4294967296}}function re(k,v){const d=Te[k],f=v*2,p=Se((k+1)*7919+f*104729+17),z=[],I=[];for(let R=1;R<=3;R++)p()<d.sack&&z.push({letter:R,attempt:1}),p()<d.slip&&I.push({letter:R});const O=p()<d.storm?2:0;return{lostBags:z,lostReceipts:I,delay:O}}const Be=[.1,.25,.4],le=.4,de=.2,ge=.6;function be(k,v,d,f){return!k.remote||d!=="B"&&f!=="B"?2:v==="relay"?3:4}function se(k,v){const d=he[k].find(f=>f.id===v);return d?d.cost:0}function ne(k={}){const v=K[k.scenario??0],d={numbering:"none",receipts:"none",retry:"never",ledger:"off",route:"direct",...k.rules||{}},f=d.ledger==="on"&&d.numbering!=="none",p=k.plan??null,z=p?p.lostBags:v.lostBags,I=p?p.lostReceipts:v.lostReceipts,O=p?.delay??0,A=(Math.max(2,Math.min(3,k.people??3))===2?[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"A",label:"Bob → Alice"}]:[{id:"L1",seq:1,from:"A",to:"B",label:"Alice → Bob"},{id:"L2",seq:2,from:"B",to:"C",label:"Bob → Carol"},{id:"L3",seq:3,from:"C",to:"A",label:"Carol → Alice"}]).map(i=>({...i,number:d.numbering==="serial"?`${i.from}-${String(i.seq).padStart(2,"0")}`:d.numbering==="date"?"DAY-"+v.day:null,attempts:[],acked:!1,ackAt:null,slipLost:I.some(c=>c.letter===i.seq)})),q=[],P=[],D=[],Q=new Set;let w=0,t=0,N=!1;const E=(i,c,y={})=>{D.push({t:w,kind:i,text:c,...y})};function Y(i,c){const y=be(v,d.route,i.from,i.to)+O,S={id:"a"+ ++t,letterId:i.id,number:i.number,from:i.from,to:i.to,attempt:c,start:w,delivered:!1,status:"moving",deliverAt:w+le+de+y+de+le,lost:z.some($=>$.letter===i.seq&&$.attempt===c),lostAt:w+le+de+y*.55,flightDays:y};return i.attempts.push(S),q.push(S),E("sent",`${i.label} left the desk${S.number?" ["+S.number+"]":""}`,{letter:i.id,attempt:S.id}),S}function oe(i){const c=A.find($=>$.id===i.letterId);if(f&&i.number&&Q.has(i.number)){i.status="dropped",i.endedAt=w,E("dropped",`${i.number} already in the ledger — the copy is dropped`,{letter:i.letterId,attempt:i.id}),d.receipts==="sign"&&(c.ackAt=w+i.flightDays+ge);return}f&&i.number&&Q.add(i.number),i.status="delivered",i.delivered=!0,i.endedAt=w;const y=P.filter($=>$.letterId===i.letterId).length,S=c.to==="A"?"Alice":c.to==="B"?"Bob":"Carol";P.push({letterId:i.letterId,number:i.number,at:w,attempt:i.id,duplicate:y>0}),E(y>0?"duplicate":"delivered",y>0?`${S} received ${i.number||"a letter"} again — duplicate copy`:`${S} received ${i.number||"a letter"}`,{letter:i.letterId,attempt:i.id}),d.receipts==="sign"&&(c.ackAt=w+i.flightDays+ge)}function H(i){if(!N){w+=i;for(const c of q)if(c.status==="moving"){if(c.lost&&w>=c.lostAt){c.status="lost",c.endedAt=w,E("lost",`the bag carrying ${c.number||"a letter"} is gone`,{letter:c.letterId,attempt:c.id});continue}w>=c.deliverAt&&oe(c)}for(const c of A)!c.acked&&c.ackAt&&w>=c.ackAt&&(c.slipLost?(c.slipLost=!1,c.ackAt=null,E("lost",`the signed slip for ${c.number||c.label} never arrived`,{letter:c.id})):(c.acked=!0,E("ack",`the signed slip for ${c.number||c.label} reached the sender`,{letter:c.id})));if(d.retry!=="never"&&w>.01){const c=d.retry==="tuned"?2:3;for(const y of A){if(y.acked||y.attempts.length>=c)continue;const S=y.attempts[y.attempts.length-1];if(!S)continue;const $=d.retry==="tuned"?2*S.flightDays+2.6:6.5;w>=S.start+$&&(E("retry",`no slip from ${y.label} — sending again`,{letter:y.id}),Y(y,y.attempts.length+1))}}}}function J(){const i=A.map(L=>{const j=P.filter(F=>F.letterId===L.id),W=j.length?Math.min(...j.map(F=>F.at)):null;return{id:L.id,label:L.label,number:L.number,delivered:j.length,first:W,onTime:W!==null&&W<=v.deadline,acked:L.acked,lost:L.attempts.length>0&&L.attempts.every(F=>F.status==="lost")}}),c=i.filter(L=>L.delivered===1).length,y=i.filter(L=>L.delivered===1&&L.onTime).length,S=i.reduce((L,j)=>L+Math.max(0,j.delivered-1),0),$=i.filter(L=>L.delivered===0).length,X=i.filter(L=>L.acked).length,ie=A.length*1+A.length*se("numbering",d.numbering)+A.length*se("receipts",d.receipts)+(f?A.length*se("ledger",d.ledger):0)+(d.retry!=="never"?A.length*se("retry",d.retry):0)+(v.remote&&d.route==="direct"?A.length*.5:0)+(q.length-A.length)*1;return{rows:i,exact:c,onTime:y,dupes:S,lost:$,total:A.length,cost:Math.round(ie*10)/10,attempts:q.length,promise:y===A.length&&S===0,signed:X,proof:X===A.length}}function G(){for(;w<v.deadline+3;)H(.05);return N=!0,J()}return A.forEach((i,c)=>{w=Be[c],Y(i,1)}),w=0,{scenario:v,rules:d,letters:A,attempts:q,deliveries:P,events:D,plan:{lostBags:z,lostReceipts:I,delay:p?.delay??0},get now(){return w},tick:H,summary:J,runAll:G,get done(){return N}}}const me=new Map;function $e(k){const v=me.get(k);if(v!==void 0)return v;let d=1/0;const f=["none","date","serial"],p=["never","tuned","quick"];for(const I of f)for(const O of p)for(const R of["off","on"]){if(R==="on"&&I==="none")continue;const o={numbering:I,receipts:"sign",retry:O,ledger:R,route:"direct"};let A=0,q=!0;for(let P=0;P<V;P++){const D=ne({scenario:k,rules:o,plan:re(k,P)}).runAll();if(!D.promise||!D.proof){q=!1;break}A+=D.cost}q&&(d=Math.min(d,A))}const z=Number.isFinite(d)?Math.round(d*10)/10:null;return me.set(k,z),z}const Ce=`
:host { display: block; }
* { box-sizing: border-box; }
.wrap {
  --line: #242a34; --panel: #12151b; --panel2: #171b22;
  --text: #e6e9ef; --dim: #8b94a3; --dimmer: #5c6472;
  --blue: #58a6ff; --green: #3fb950; --red: #f85149; --amber: #d29922;
  --violet: #a371f7; --teal: #39c5cf; --gold: #e3b341;
  color: var(--text);
  font: 13.5px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #0e1116;
}
.mono { font-family: "SF Mono", ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums; }
button { font: inherit; color: var(--text); background: var(--panel2); border: 1px solid var(--line); border-radius: 7px; padding: 5px 9px; cursor: pointer; font-size: 12px; }
button:hover { border-color: #3a4350; }
button.primary { background: #2a2413; border-color: #5a4a1c; color: #f0d78a; }
button:disabled { opacity: .4; cursor: default; }

.bar { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-bottom: 1px solid var(--line); background: #0f1319; flex-wrap: wrap; }
.bar .title { font-size: 12.5px; font-weight: 560; }
.bar .title span { color: var(--dimmer); font-weight: 400; }
.bar .spacer { flex: 1; }
.days { display: flex; gap: 3px; }
.days button { padding: 4px 7px; font-size: 11px; }
.days button.on { border-color: var(--gold); color: var(--gold); }
.clock { font-size: 11px; color: var(--dim); }
.clock b { color: var(--text); font-weight: 500; }
.rail { display: flex; align-items: center; gap: 9px; padding: 8px 12px; border-top: 1px solid var(--line); background: #0f1319; flex-wrap: wrap; }
.rail .rail-label { font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--dimmer); }
.rail .rail-hint { font-size: 9.5px; color: var(--dimmer); }
.sitchips { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.sitchips .sip { width: 30px; height: 24px; padding: 0; border-radius: 6px; background: #1a2029; border: 1px solid #333d4b; color: var(--dim); font-size: 10.5px; font-weight: 600; cursor: pointer; display: grid; place-items: center; }
.sitchips .sip:hover { border-color: var(--text); color: var(--text); }
.sitchips .sip.ok { background: #102219; border-color: #2b5d3b; color: #7ee2a8; }
.sitchips .sip.bad { background: #2a1316; border-color: #6e2b31; color: #ff9b9b; }
.sitchips .sip.warn { background: #221d10; border-color: #5a4a1c; color: #e3c37a; }
.sitchips .sip.bad:hover { border-color: var(--red); }
.sitchips .sip.sel { box-shadow: 0 0 0 1px var(--gold); }

.mapwrap { position: relative; height: 420px; background: radial-gradient(120% 100% at 50% 0%, #10151d 0%, #0b0d10 70%); }
svg { width: 100%; height: 100%; display: block; }
.route { fill: none; stroke: #36405a; stroke-width: 1.5; stroke-dasharray: 3 6; }
.routelabel { fill: var(--dimmer); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
.city text.name { fill: var(--text); font-size: 13px; font-weight: 560; }
.city text.place { fill: var(--dimmer); font-size: 10.5px; }
.office { fill: #1a2029; stroke: #2f3a49; stroke-width: 1; }
.office.flag { fill: var(--gold); }
.letter rect { fill: #f2e6c8; stroke: #b99a52; }
.letter path { stroke: #b99a52; fill: none; }
.letter text { fill: #f0e6c8; font-size: 8px; font-weight: 700; }
.letter { filter: drop-shadow(0 2px 4px rgba(0,0,0,.45)); }
.letter.focus rect { stroke: var(--gold); stroke-width: 2.2; }
.stack text { fill: #f0e6c8; font-size: 7.5px; font-weight: 700; }
.lostmark { fill: none; stroke: var(--red); stroke-width: 2; }

.panels { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }
.panels > div { padding: 12px; min-width: 0; }
.panels > div + div { border-left: 1px solid var(--line); }
h3.grp { font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0 0 6px; font-weight: 600; }
.rulegrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
.opt { display: block; width: 100%; text-align: left; background: var(--panel); border: 1px solid var(--line); border-radius: 7px; padding: 5px 7px; margin-bottom: 4px; cursor: pointer; font: inherit; color: var(--text); }
.opt:hover { border-color: #3a4350; }
.opt.on { border-color: var(--gold); background: #1c1a12; }
.opt .row { display: flex; justify-content: space-between; gap: 6px; align-items: baseline; }
.opt .nm { font-size: 11px; font-weight: 520; }
.opt .pr { font-size: 10px; color: var(--gold); }
.opt .note { font-size: 9.5px; color: var(--dimmer); line-height: 1.3; margin-top: 1px; display: none; }
.opt.on .note { display: block; }
.opt.off { opacity: .38; cursor: not-allowed; }

.brief { padding: 10px 14px 9px; border-bottom: 1px solid var(--line); background: linear-gradient(180deg, #11161d, #0d1116); }
.brief-title { font-size: 12px; font-weight: 600; letter-spacing: .01em; }
.brief-copy { font-size: 10.5px; color: var(--dim); line-height: 1.5; margin-top: 3px; max-width: 760px; }
.brief-goal { font-size: 9.5px; color: var(--dimmer); margin-top: 5px; }
.brief-goal b { color: var(--gold); font-weight: 600; letter-spacing: .04em; }
.score-rank { display: flex; align-items: center; gap: 9px; margin-bottom: 4px; }
.rank { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; font-size: 17px; font-weight: 650; border: 1px solid var(--line); background: #141922; color: var(--dim); flex: none; }
.rank.s { background: var(--gold); border-color: var(--gold); color: #0d1117; }
.rank.a { background: #102219; border-color: #2b5d3b; color: #7ee2a8; }
.rank.b { background: #221d10; border-color: #5a4a1c; color: var(--amber); }
.rank.c { background: #2a1316; border-color: #6e2b31; color: #ff9b9b; }
.rank-body { flex: 1; min-width: 0; }
.rank-title { font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--dimmer); }
.rank-body .big { font-size: 16px; }
.best { text-align: right; font-size: 8.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--dimmer); line-height: 1.45; flex: none; }
.best b { display: block; font-size: 10.5px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--text); }
.budget-line { display: flex; justify-content: space-between; font-size: 8.5px; letter-spacing: .1em; color: var(--dimmer); }
.budget-track { height: 4px; border-radius: 999px; background: #1b222c; overflow: hidden; margin: 3px 0 5px; }
.budget-track i { display: block; height: 100%; width: 0; background: var(--green); transition: width .3s; }
.budget-track i.over { background: var(--red); }
.starget { font-size: 9px; color: var(--dimmer); margin: 0 0 4px; line-height: 1.35; }
.score .head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.score .big { font-size: 15px; font-weight: 560; }
.ok { color: var(--green); } .bad { color: var(--red); }
.srow { display: grid; grid-template-columns: 1fr 76px 40px; gap: 6px; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #171d26; align-items: center; }
.srow .l { color: var(--dim); }
.srow .l b { color: var(--text); font-weight: 500; }
.srow .c { text-align: right; }
.srow .t { text-align: right; color: var(--dimmer); font-size: 10px; }

.log { margin-top: 10px; height: 200px; overflow-y: auto; font-size: 10.5px; border-top: 1px solid var(--line); padding-top: 6px; }
.log .lrow { display: grid; grid-template-columns: 34px 1fr; gap: 6px; padding: 1.5px 0; border-bottom: 1px solid #141a22; }
.log .lt { color: var(--dimmer); font-size: 9.5px; }
.log .lx { color: #b6bec9; }
.log .sent .lx { color: var(--blue); }
.log .delivered .lx { color: var(--green); }
.log .dropped .lx { color: var(--violet); }
.log .lost .lx { color: var(--red); }
.log .retry .lx { color: var(--amber); }
.log .duplicate .lx { color: var(--red); }
.log .ack .lx { color: var(--teal); }

.verdict { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); background: #12151bee; border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; width: min(420px, 90%); box-shadow: 0 12px 40px rgba(0,0,0,.5); display: none; }
.verdict.show { display: block; }
.verdict .vt { font-size: 12.5px; font-weight: 560; margin-bottom: 3px; }
.verdict .vs { font-size: 11px; color: var(--dim); margin-bottom: 8px; }
.verdict .va { display: flex; gap: 6px; }

@media (max-width: 640px) {
  .panels { grid-template-columns: 1fr; }
  .panels > div + div { border-left: none; border-top: 1px solid var(--line); }
  .mapwrap { height: 340px; }
}
.wrap.campaign .days, .wrap.campaign #next { display: none; }
.wrap.campaign .brief { display: none; }
.wrap.campaign .brief-goal { display: none; }
.wrap.solo .rail { display: none; }
.wrap.no-rules .panels { grid-template-columns: 1fr; }
.wrap.no-rules .panels > div:first-child { display: none; }
.wrap.no-rules .panels > div + div { border-left: none; }
.wrap.campaign .best, .wrap.campaign .starget { display: none; }
#run { display: none; }
.wrap.campaign #run { display: inline-block; }
`,ze=`
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <button id="run" class="primary" title="Watch this stop play out">Run route →</button>
    <div class="days" id="days"></div>
    <button id="reset" title="Recompute results">↺</button>
    <span class="clock mono"><b id="clock">situation 1/10 · day 0.0</b></span>
  </div>

  <div class="brief">
    <div class="brief-title">Your job: keep the promise</div>
    <div class="brief-copy">Deliver every letter once, on time — across ten independent weather worlds. Pick the post-office add-ons; postage comes out of a fixed budget. Signed slips are proof: they cost extra and earn the S. Click a red result to replay its failure.</div>
    <div class="brief-goal"><b>PASS</b> 9 / 10 delivered within budget · <b>PERFECT</b> all slips at the efficient price earns an S · best saved per day (<span id="briefBudget">60</span> coins)</div>
  </div>

  <div class="mapwrap">
    <svg id="map" viewBox="0 0 800 430" preserveAspectRatio="xMidYMid meet">
      <defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#1b2230"/></pattern></defs>
      <rect x="0" y="0" width="800" height="430" fill="url(#dots)" opacity="0.65" />
      <g id="map-static"></g>
      <g id="map-dynamic"></g>
    </svg>
    <div class="verdict" id="verdict">
      <div class="vt" id="vt"></div>
      <div class="vs" id="vs"></div>
      <div class="va"><button id="next" class="primary">Next day →</button><button id="again">Run again</button></div>
    </div>
  </div>

  <div class="rail">
    <span class="rail-label">Results</span>
    <div class="sitchips" id="sitchips"></div>
    <span class="rail-hint">click any result to replay · amber = delivered, unsigned · red = broken</span>
  </div>

  <div class="panels">
    <div>
      <h3 class="grp" style="margin-bottom:8px">Post office add-ons</h3>
      <div class="rulegrid" id="rules"></div>
      <div style="font-size:9.5px;color:var(--dimmer);margin-top:6px;line-height:1.4">Add-ons apply to every office. Priced per letter, in postage.</div>
    </div>
    <div>
      <div class="score">
        <div class="score-rank">
          <span class="rank" id="rank" title="S = perfect · A = pass · B = close · C = fail">—</span>
          <div class="rank-body">
            <div class="rank-title">Scoreboard</div>
            <div class="big" id="promiseState">in progress</div>
          </div>
          <div class="best"><span>BEST</span><b id="best">—</b></div>
        </div>
        <div class="budget-line"><span>POSTAGE</span><span class="mono" id="cost" style="font-size:10.5px;color:var(--dim)"></span></div>
        <div class="budget-track"><i id="budgetBar"></i></div>
        <div class="starget" id="starget"></div>
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 3px"></div>
        <div id="sitnote" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:0 0 3px"></div>
        <div id="why" style="font-size:9.5px;line-height:1.35;margin:0 0 5px;color:var(--dimmer)"></div>
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`,Re=(k,v)=>{const d=k.shadowRoot??k.attachShadow({mode:"open"});d.innerHTML="<style>"+Ce+"</style>"+ze;const f=v.campaign,p=Math.max(1,Math.min(V,f?.situations??V)),z=f?.people===2?2:3,I=f?.ruleGroups??["numbering","receipts","retry","ledger"],O=d.querySelector(".wrap");f&&O.classList.add("campaign"),p===1&&O.classList.add("solo"),I.length||O.classList.add("no-rules");const R=e=>f?Math.min(V-1,(f.morning??0)+e):e,o=e=>d.querySelector("#"+e),A=d.querySelector("#map"),q=d.querySelector("#map-static"),P=d.querySelector("#map-dynamic");let D="";const Q={A:{x:150,y:300},B:{x:415,y:120},C:{x:660,y:320}},w={x:470,y:62},t={day:f?.scenario??0,rules:{numbering:"serial",receipts:"sign",retry:"never",ledger:"off",route:"direct",...f?.initialRules??{},...f?.fixedRules??{}},sim:null,days:[],index:0,results:[],playing:!1,single:!1,speed:1,drawnLog:0,focus:null,ended:!1,started:!1,best:null,sTarget:null};let N=0,E=0,Y=0;const oe={A:{x:300,y:220},B:{x:520,y:220}};function H(e){return t.sim?.letters.length===2?oe[e]??Q[e]:t.sim?.scenario.remote&&e==="B"?w:Q[e]}function J(e,s){const r=H(e),l=H(s),g=l.x-r.x,x=l.y-r.y,T=Math.hypot(g,x)||1,a=e==="A"&&s==="C"?-54:42;return{p1:r,p2:l,c:{x:(r.x+l.x)/2-x/T*a,y:(r.y+l.y)/2+g/T*a}}}function G(e,s,r,l){const g=1-l;return{x:g*g*e.x+2*g*l*s.x+l*l*r.x,y:g*g*e.y+2*g*l*s.y+l*l*r.y}}function i(){t.playing=!1,cancelAnimationFrame(N)}function c(){i(),Y=0,t.ended=!0,t.started=!1,t.single=!1,o("run").disabled=!1,t.drawnLog=0,t.focus=null,t.index=0,t.days=Array.from({length:p},(e,s)=>ne({scenario:t.day,rules:t.rules,plan:re(t.day,R(s)),people:z})),t.results=t.days.map((e,s)=>ne({scenario:t.day,rules:t.rules,plan:re(t.day,R(s)),people:z}).runAll()),t.sTarget=$e(t.day),t.best=ie(),t.best&&(t.sTarget===null||t.best.cost>t.sTarget+.05)&&(t.best=null),L(),t.sim=t.days[0],o("verdict").classList.remove("show"),o("log").innerHTML="",U()}function y(e=!1){if(t.ended&&c(),f&&(t.started=!0),t.sim&&t.sim.now>=t.sim.scenario.deadline+2&&!e){let s=t.index+1;for(;s<p&&t.results[s];)s++;s<p&&(t.index=s,t.sim=t.days[s],o("log").innerHTML="",t.drawnLog=0,U())}t.playing=!0,t.single=e,E=performance.now(),cancelAnimationFrame(N),N=requestAnimationFrame($)}function S(e){i(),o("verdict").classList.remove("show"),t.ended=!1,t.single=!1,t.playing=!1,t.index=e,t.days[e]=ne({scenario:t.day,rules:t.rules,plan:re(t.day,R(e)),people:z}),t.sim=t.days[e],o("log").innerHTML="",t.drawnLog=0,U(),y(!0)}function $(e){if(!t.playing||!t.sim)return;if(e<Y){N=requestAnimationFrame($);return}const s=Math.min(.06,(e-E)/1e3);E=e;const r=t.single||t.index===0?2.2:4.2;if(t.sim.tick(s*t.speed*r),t.sim.now>=t.sim.scenario.deadline+2){if(t.results[t.index]=t.sim.summary(),t.single){t.playing=!1,t.single=!1,t.ended=!0,L(),cancelAnimationFrame(N),U();return}if(t.index++,t.results.every(Boolean)||t.index>=p){W();return}for(;t.index<p&&t.results[t.index];)t.index++;if(t.index>=p){W();return}t.sim=t.days[t.index],o("log").innerHTML="",t.drawnLog=0,U(),E=e,Y=e+220,N=requestAnimationFrame($);return}U(),N=requestAnimationFrame($)}function X(){return"letters:best:"+t.day}function ie(){if(f)return null;try{const e=localStorage.getItem(X());if(!e)return null;const s=JSON.parse(e);if(s&&typeof s.kept=="number"&&typeof s.cost=="number")return{kept:s.kept,signed:typeof s.signed=="number"?s.signed:0,cost:s.cost}}catch{}return null}function L(){if(f)return;const e=j();if(t.sTarget===null||e.kept<p||e.signed<p*e.letters||e.cost>t.sTarget+.05)return;const s=t.best;if(!s||e.kept>s.kept||e.kept===s.kept&&e.signed>s.signed||e.kept===s.kept&&e.signed===s.signed&&e.cost<s.cost){t.best={kept:e.kept,signed:e.signed,cost:e.cost};try{localStorage.setItem(X(),JSON.stringify(t.best))}catch{}}}function j(){const e=t.results.filter(n=>!!n),s=e.filter(n=>n.promise).length,r=e.reduce((n,u)=>n+u.signed,0),l=Math.round(e.reduce((n,u)=>n+u.cost,0)*10)/10,g=fe[t.day],T=(t.days[0]?.letters.map(n=>n.id)??["L1","L2","L3"]).map(n=>{const u=t.days[0]?.letters.find(M=>M.id===n)?.label??n;let h=0,b=0;for(const M of e){const B=M.rows.find(C=>C.id===n);B&&B.delivered===1&&h++,B&&(b+=Math.max(0,B.delivered-1))}return{id:n,label:u,ok:h,dup:b}}),a=t.days[0]?.letters.length??3,m=T.reduce((n,u)=>n+u.dup,0);return{kept:s,signed:r,cost:l,budget:g,per:T,n:e.length,letters:a,dupes:m}}function W(){i(),t.playing=!1,o("run").disabled=!1,t.single=!1,t.ended=!0;const e=j(),s=f?e.kept>=p&&e.cost<=e.budget&&(f.pass!=="proof"||e.signed>=p*e.letters):e.kept>=F&&e.cost<=e.budget;o("verdict").classList.add("show");const r=e.cost>e.budget;o("vt").innerHTML=s?'<span class="ok">'+(f?"Objective met":"Good enough")+": "+e.kept+" / "+p+" situations.</span>":e.dupes>0?'<span class="bad">Not yet: '+e.dupes+" duplicate deliveries.</span>":r?'<span class="bad">Over budget: '+e.cost+" / "+e.budget+" coins.</span>":'<span class="bad">Not yet: '+e.kept+" / "+p+" situations.</span>";let l=-1,g=99;t.results.forEach((n,u)=>{if(!n)return;const h=n.exact*2-n.dupes;h<g&&(g=h,l=u)});const x=l>=0?t.results[l]:null,T=x?x.rows.slice().sort((n,u)=>u.delivered-n.delivered)[0]:null,a=T&&T.delivered>1?" · worst: situation "+(l+1)+", "+T.delivered+" copies for "+T.label:x&&x.lost>0?" · worst: situation "+(l+1)+", a letter never arrived":" · every letter at most once";o("vs").textContent=e.cost+" / "+e.budget+" coins"+a;const m=o("next");if(m.disabled=t.day>=K.length-1,m.textContent=t.day>=K.length-1?"That is the whole slice":"Next day →",U(),f){const n=f.pass==="proof"?e.signed>=p*e.letters&&s:s,u=e.letters===2?"Both":"All "+e.letters,h=e.letters===2?"both":"all "+e.letters;f.onComplete?.({passed:n,detail:n?f.pass==="proof"?u+" letters delivered; "+h+" signed slips returned.":u+" letters delivered once and on time.":r?"Postage exceeded the office budget. Adjust an add-on and run again.":f.pass==="proof"?"The delivery is not proven yet. Return receipts from every letter are still missing.":"The promise is still broken. Check lost, late, or duplicate letters and run again."})}}const F=f?p:Math.ceil(V*.85);function xe(){i(),t.results=t.days.map(e=>e.runAll()),t.index=t.days.length,t.sim=t.days[t.days.length-1],W()}function U(){if(!t.sim)return;ye(),Ae(),Le();const e=Math.min(t.index+1,p),s=Math.min(t.sim.now,t.sim.scenario.deadline).toFixed(1);o("clock").textContent="situation "+e+"/"+p+" · day "+s+" / "+t.sim.scenario.deadline}function ye(){const e=t.sim;if(!e)return;const s=[],r=[],l=e.letters.length===2?["A","B"]:["A","B","C"],g=e.letters.length===2?[["A","B"]]:[["A","B"],["B","C"],["A","C"]];for(const[a,m]of g){const n=J(a,m);s.push(`<path class="route" d="M ${n.p1.x} ${n.p1.y} Q ${n.c.x} ${n.c.y} ${n.p2.x} ${n.p2.y}" />`);const u=G(n.p1,n.c,n.p2,.5),h=be(e.scenario,e.rules.route,a,m);s.push(`<text class="routelabel" x="${u.x}" y="${u.y-12}" text-anchor="middle">${h} days one-way</text>`)}for(const a of l){const m=H(a),n=Me[a],u=e.deliveries.filter(b=>e.letters.find(M=>M.id===b.letterId).to===a),h=e.scenario.remote&&a==="B";s.push(`<g class="city">
        <circle cx="${m.x}" cy="${m.y}" r="28" fill="#0f141b" stroke="${n.color}" stroke-width="2" />
        <text class="name" x="${m.x}" y="${m.y+44}" text-anchor="middle">${n.friend}</text>
        <text class="place" x="${m.x}" y="${m.y+58}" text-anchor="middle">${h?"the mountains":n.city}</text>
        <g transform="translate(${m.x+30},${m.y-32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`),u.slice(0,4).forEach((b,M)=>{const B=b.duplicate?"#f7d9d6":"#f2e6c8",C=b.duplicate?"#d9534f":"#b99a52";r.push(`<g class="stack" transform="translate(${m.x+38+M*13},${m.y-10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="${B}" stroke="${C}" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="${C}" />
          ${b.number?`<text x="7" y="-4" text-anchor="middle">${b.number}</text>`:""}
        </g>`)}),u.some(b=>b.duplicate)&&r.push('<text x="'+m.x+'" y="'+(m.y+74)+'" text-anchor="middle" fill="#f85149" font-size="11" font-weight="700">×2 duplicate</text>')}let x=0;for(const a of e.attempts){if(a.status!=="moving")continue;const m=1.2+a.flightDays,n=Math.max(0,Math.min(1,(e.now-a.start)/m)),u=.6/m,h=(.6+a.flightDays)/m;let b,M=0;if(n<=u)b=H(a.from),b={x:b.x-40-x++%3*7,y:b.y-2};else if(n>=h)b=H(a.to),b={x:b.x+12,y:b.y+34};else{const C=(n-u)/(h-u),_=J(a.from,a.to);b=G(_.p1,_.c,_.p2,C);const pe=G(_.p1,_.c,_.p2,Math.min(1,C+.015));M=Math.max(-20,Math.min(20,Math.atan2(pe.y-b.y,pe.x-b.x)*180/Math.PI)),b.y-=8;for(let te=1;te<=2;te++){const ue=G(_.p1,_.c,_.p2,Math.max(0,C-te*.03));r.push('<rect x="'+(ue.x-8)+'" y="'+(ue.y-13)+'" width="16" height="11" rx="2" fill="#f2e6c8" opacity="'+.18/te+'" />')}}const B=t.focus===a.letterId;r.push('<g class="letter '+(B?"focus":"")+'" data-letter="'+a.letterId+'" style="cursor:pointer" transform="translate('+b.x+" "+b.y+") rotate("+M+')"><rect x="-11" y="-7.5" width="22" height="15" rx="2" /><path d="M -11 -7.5 L 0 2 L 11 -7.5" /><circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />'+(a.number?'<text x="0" y="-11" text-anchor="middle" transform="rotate('+-M+' 0 -11)">'+a.number+"</text>":"")+"</g>")}for(const a of e.letters){const m=e.deliveries.find(B=>B.letterId===a.id);if(!m||e.rules.receipts!=="sign"||!a.ackAt||e.now<m.at||e.now>a.ackAt)continue;const n=(e.now-m.at)/(a.ackAt-m.at),u=e.plan.lostReceipts.some(B=>B.letter===a.seq);if(u&&n>.55)continue;const h=J(a.to,a.from),b=G(h.p1,h.c,h.p2,n),M=u?Math.max(.15,1-Math.max(0,n-.3)/.25):1;r.push('<g transform="translate('+b.x+" "+(b.y-7)+')" opacity="'+M+'"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" /><path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" /><circle cx="0" cy="2.4" r="1.5" fill="#b4453a" /></g>')}for(const a of e.deliveries){const m=e.now-a.at;if(m<0||m>1.1)continue;const n=e.letters.find(M=>M.id===a.letterId);if(!n)continue;const u=H(n.to),h=m/1.1,b=a.duplicate?"#f85149":"#3fb950";r.push('<circle cx="'+u.x+'" cy="'+u.y+'" r="'+(28+36*h)+'" fill="none" stroke="'+b+'" stroke-width="'+2.2*(1-h)+'" opacity="'+.5*(1-h)+'" />');for(let M=0;M<6;M++){const B=Math.PI*2*M/6,C=26+30*h;r.push('<circle cx="'+(u.x+Math.cos(B)*C)+'" cy="'+(u.y+Math.sin(B)*C)+'" r="1.7" fill="'+b+'" opacity="'+.75*(1-h)+'" />')}a.duplicate&&r.push('<text x="'+u.x+'" y="'+(u.y-40)+'" text-anchor="middle" fill="#f85149" font-size="12" font-weight="700" opacity="'+(1-h)+'">×2 duplicate</text>')}for(const a of e.attempts){if(a.status!=="moving")continue;const m=1.2+a.flightDays,n=(e.now-a.start)/m,u=.6/m,h=.8/m;if(n<u||n>h+.08)continue;const b=H(a.from),B=.75+.25*Math.min(1,(n-u)/(h-u)),C=n>h?Math.max(0,1-(n-h)/.08):1;r.push('<g transform="translate('+(b.x-26)+" "+(b.y+24)+") scale("+B+')" opacity="'+.9*C+'"><circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" /><path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" /></g>')}const T=e.scenario.day+"|"+e.scenario.remote+"|"+e.rules.route+"|"+e.letters.length;T!==D&&(q.innerHTML=s.join(""),D=T),P.innerHTML=r.join("")}function ce(){const e=o("sitchips");e.children.length!==p&&(e.innerHTML=Array.from({length:p},(r,l)=>'<button class="sip" data-i="'+l+'" title="Situation '+(l+1)+'">'+(l+1)+"</button>").join(""));const s=t.ended?-1:t.index;e.querySelectorAll(".sip").forEach((r,l)=>{const g=t.results[l],x=g?g.promise?g.proof?"ok":"warn":"bad":"";r.className="sip "+[x,l===s?"sel":""].filter(Boolean).join(" "),r.title="Situation "+(l+1)+" — "+ve(g)})}function ve(e){if(!e)return"not run";if(e.promise&&e.proof)return"delivered · all slips back";if(e.promise)return"delivered · "+e.signed+"/"+e.total+" signed";const s=[];e.lost&&s.push(e.lost+" lost"),e.dupes&&s.push(e.dupes+" duplicate"+(e.dupes>1?"s":""));const r=e.rows.filter(g=>g.delivered===1&&!g.onTime).length;r&&s.push(r+" late");const l=e.rows.filter(g=>!g.acked).length;return l&&s.push(l+" unsigned"),s.length?s.join(" · "):"promise broken"}function we(e){const s=t.results.filter(n=>!!n),r=t.days[0]?.letters.length??3,l=s.reduce((n,u)=>n+u.lost,0),g=s.reduce((n,u)=>n+u.dupes,0),x=s.reduce((n,u)=>n+u.rows.filter(h=>h.delivered===1&&!h.onTime).length,0),T=s.reduce((n,u)=>n+u.rows.filter(h=>h.delivered>0&&!h.acked).length,0),a=[];e.cost>e.budget&&a.push("over budget by "+(e.cost-e.budget).toFixed(1)+" coins"),l&&a.push(l+" never arrived"),g&&a.push(g+" duplicate"+(g>1?"s":"")),x&&a.push(x+" late"),(!f||f.pass==="proof")&&T&&a.push(T+" without a signed slip");const m=e.kept>=F&&e.cost<=e.budget;return a.length?m&&a.length===1&&T?"All delivered; "+T+" without a signed slip — no S rank.":"Why: "+a.join(" · "):f?s.length!==p?"":f.pass==="proof"?"All delivered; every signed slip returned.":"All delivered once and on time.":s.length===p&&e.signed===p*r&&t.sTarget!==null&&e.cost>t.sTarget+.05?"All delivered and signed; S needs the efficient book at ≤ "+t.sTarget+" coins.":s.length===p&&e.signed===p*r&&t.sTarget===null?"All delivered and signed; no all-proof book fits this day.":s.length===p?"All delivered; every slip made it back.":""}function ke(){const e=t.sim;if(!e)return"";const s=e.plan,r=[];return s.lostBags.length&&r.push(s.lostBags.length+(s.lostBags.length>1?" bags":" bag")+" lost"),s.lostReceipts.length&&r.push(s.lostReceipts.length+(s.lostReceipts.length>1?" slips":" slip")+" lost"),s.delay&&r.push("storm +"+s.delay+" days"),"Situation "+Math.min(t.index+1,p)+": "+(r.length?r.join(" · "):"nothing goes wrong")}function Ae(){const e=t.sim;if(!e)return;const s=j();if(f&&!t.started){o("rank").textContent="—",o("rank").className="rank",o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">ready to run</span>',o("best").textContent="—",o("budgetBar").style.width="0%",o("budgetBar").className="",o("starget").textContent="",o("cost").textContent="— / "+s.budget+" coins",o("cost").className="mono",o("promise").innerHTML="",o("sitnote").textContent="",o("why").textContent="Press “Run route” to watch this stop.",o("why").style.color="var(--dimmer)",o("rows").innerHTML="",ce();return}const r=f?s.kept>=p&&s.cost<=s.budget&&(f.pass!=="proof"||s.signed>=p*s.letters):s.kept>=F&&s.cost<=s.budget,l=s.kept===p&&s.signed===p*s.letters&&t.sTarget!==null&&s.cost<=t.sTarget+.05,g=l?"S":r?"A":s.kept>=F-2?"B":"C";if(o("rank").textContent=g,o("rank").className="rank "+g.toLowerCase(),o("best").textContent=t.best?t.best.kept+"/"+p+" · "+t.best.signed+"s · "+t.best.cost+"c":"—",o("budgetBar").style.width=Math.min(100,s.cost/s.budget*100)+"%",o("budgetBar").className=s.cost>s.budget?"over":"",o("starget").textContent=t.sTarget===null?"S: no all-proof book fits this day":"S: all slips at ≤ "+t.sTarget+" coins",o("starget").style.color=l?"var(--gold)":"var(--dimmer)",s.n===p){const x=s.cost>s.budget?"Over budget":s.kept+" / "+p;o("promiseState").innerHTML='<span class="'+(r?"ok":"bad")+'">'+x+"</span>"}else s.n===0?o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">in progress</span>':o("promiseState").innerHTML='<span style="color:var(--dim);font-size:12px">'+s.kept+" / "+s.n+" so far</span>";o("cost").textContent=(s.n?s.cost:"—")+" / "+s.budget+" coins",o("cost").className="mono"+(s.cost>s.budget?" bad":""),o("promise").innerHTML=f?f.pass==="proof"?"Proof: every letter arrives once, and every signed slip returns within "+e.scenario.deadline+" days.":"Promise: every letter arrives once, within "+e.scenario.deadline+" days.":"Promise: every letter once, within "+e.scenario.deadline+" days. Signed slips are proof; all of them at the efficient price earn an S.",o("sitnote").textContent=ke(),o("why").textContent=we(s),o("why").style.color=l?"var(--green)":r?"var(--amber)":"var(--red)",ce(),o("rows").innerHTML=s.per.map(x=>'<div class="srow"><div class="l"><b>'+x.label+'</b></div><div class="c">'+(s.n?x.ok+"/"+s.n:"—")+'</div><div class="t mono">'+(x.dup?x.dup+" dup":"")+"</div></div>").join("")}function Le(){const e=t.sim;if(!e)return;const s=e.events.filter(l=>!t.focus||l.letter===t.focus),r=o("log");for(let l=t.drawnLog;l<s.length;l++){const g=s[l],x=document.createElement("div");x.className="lrow "+g.kind,x.innerHTML='<span class="lt mono">'+g.t.toFixed(1)+'</span><span class="lx">'+g.text+"</span>",r.appendChild(x)}t.drawnLog=s.length,r.scrollTop=r.scrollHeight}function ae(){const e=o("rules");e.innerHTML=[["numbering","Registered post"],["receipts","Return receipt"],["retry","Automatic resend"],["ledger","Delivery ledger"]].filter(([s])=>I.includes(s)).map(([s,r])=>{const l=he[s].map(g=>{const x=s==="ledger"&&t.rules.numbering==="none";return`<button class="opt ${t.rules[s]===g.id?"on":""} ${x?"off":""}" data-g="${s}" data-o="${g.id}" ${x?"disabled":""} title="${g.note}">
              <div class="row"><span class="nm">${g.label}</span><span class="pr mono">+${g.cost.toFixed(1)}</span></div>
              <div class="note">${x?"Needs a number on the envelope.":g.note}</div>
            </button>`}).join("");return`<div><h3 class="grp">${r}</h3>${l}</div>`}).join(""),e.querySelectorAll(".opt").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.g;t.rules[r]=s.dataset.o,r==="numbering"&&t.rules.numbering==="none"&&(t.rules.ledger="off"),ae(),c()})})}function Z(e){t.day=e;const s=K[e];o("title").innerHTML=(f?.title??s.title)+" <span>· day "+s.day+"  ·  "+p+" situation"+(p===1?"":"s")+"</span>",o("briefBudget").textContent=String(fe[e]),o("days").innerHTML=K.map((r,l)=>'<button data-d="'+l+'" class="'+(l===e?"on":"")+'">'+r.day+"</button>").join(""),o("days").querySelectorAll("button").forEach(r=>{r.addEventListener("click",()=>Z(Number(r.dataset.d)))}),ae(),c()}o("sitchips").addEventListener("click",e=>{const s=e.target?.closest?.(".sip");if(!s)return;const r=Number(s.getAttribute("data-i"));Number.isInteger(r)&&S(r)}),o("reset").addEventListener("click",()=>c()),o("run").addEventListener("click",()=>{t.playing||(o("run").disabled=!0,y())}),o("again").addEventListener("click",()=>{f?y():c()}),o("next").addEventListener("click",()=>{t.day<K.length-1&&Z(t.day+1)}),A.addEventListener("click",e=>{const s=e.target?.closest?.(".letter");if(!s)return;const r=s.getAttribute("data-letter");t.focus=t.focus===r?null:r,o("log").innerHTML="",t.drawnLog=0,U()}),Z(f?.scenario??0);const ee=new URLSearchParams(location.search);if(ee.has("tlauto")){const e=Math.max(0,Math.min(K.length-1,Number(ee.get("tlauto"))||0)),s=(ee.get("tl")||"").split(",");Z(e),s.length===4&&(t.rules={numbering:s[0],receipts:s[1],retry:s[2],ledger:s[3],route:"direct"},ae(),c());const r=Number(ee.get("tlat"));if(r>0){for(;t.sim&&t.sim.now<r;)t.sim.tick(.05);U()}else xe()}return{destroy(){i(),d.innerHTML=""}}};export{Re as default};
