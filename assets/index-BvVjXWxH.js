const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./kv-cache-BIlkrUSJ.js","./code-highlight-Ct8t2e3l.js","./flash-attention-C69Yt4C6.js","./postmarked-CW5wBveX.js","./the-letters-D9LN9mCN.js","./the-registry-26mZaSLX.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const Z="modulepreload",J=function(t,e){return new URL(t,e).href},j={},b=function(e,a,i){let n=Promise.resolve();if(a&&a.length>0){const l=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),d=r?.nonce||r?.getAttribute("nonce");n=Promise.allSettled(a.map(h=>{if(h=J(h,i),h in j)return;j[h]=!0;const c=h.endsWith(".css"),m=c?'[rel="stylesheet"]':"";if(!!i)for(let v=l.length-1;v>=0;v--){const x=l[v];if(x.href===h&&(!c||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${m}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":Z,c||(u.as="script"),u.crossOrigin="",u.href=h,d&&u.setAttribute("nonce",d),document.head.appendChild(u),c)return new Promise((v,x)=>{u.addEventListener("load",v),u.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${h}`)))})}))}function o(l){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=l,window.dispatchEvent(r),!r.defaultPrevented)throw l}return n.then(l=>{for(const r of l||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})},G={"hybrid-chain":()=>b(()=>import("./hybrid-chain-D5ew_OCj.js"),[],import.meta.url),"stat-vs-comp":()=>b(()=>import("./stat-vs-comp-DpDT9Loh.js"),[],import.meta.url),"prg-stretch":()=>b(()=>import("./prg-stretch-DHhopNnX.js"),[],import.meta.url),"kv-cache":()=>b(()=>import("./kv-cache-BIlkrUSJ.js"),__vite__mapDeps([0,1]),import.meta.url),"flash-attention":()=>b(()=>import("./flash-attention-C69Yt4C6.js"),__vite__mapDeps([2,1]),import.meta.url),"the-letters":()=>b(()=>import("./the-letters-D9LN9mCN.js"),[],import.meta.url),"the-registry":()=>b(()=>import("./the-registry-26mZaSLX.js"),[],import.meta.url),postmarked:()=>b(()=>import("./postmarked-CW5wBveX.js"),__vite__mapDeps([3,4,5]),import.meta.url)};function K(){return Object.keys(G)}async function V(t,e,a){const i=G[t];return i?(await i()).default(e,{beats:a}):(e.innerHTML=`<div class="scene-missing">Unknown scene <code>${t}</code>.<br>
      Known: ${K().map(o=>`<code>${o}</code>`).join(", ")}</div>`,null)}const U=380,q=2400;function N(t){const e=t.trim().split(/\s+/).filter(Boolean).length;return Math.max(q,Math.round(e*U))}class Y{constructor(e){this.opts=e;const a=this.opts.audio?.duration,i=e.beats;if(this.opts.audio&&Number.isFinite(a)&&a&&i.length){const n=i.map(l=>l.seconds?l.seconds*1e3:N(l.text)),o=n.reduce((l,r)=>l+r,0);this.beatMs=n.map(l=>l/o*a*1e3)}else this.beatMs=i.map(n=>n.seconds?n.seconds*1e3:N(n.text))}index=-1;timer=null;stopped=!1;beatMs;start(){this.index=-1,this.stopped=!1,this.advance()}stop(){this.stopped=!0,this.timer!==null&&clearTimeout(this.timer),this.timer=null}goto(e){this.stopped||(this.timer!==null&&clearTimeout(this.timer),this.setBeat(e),this.schedule())}advance(){this.stopped||(this.setBeat(this.index+1),this.schedule())}schedule(){if(this.stopped||this.index>=this.opts.beats.length-1)return;const e=this.beatMs[this.index]??q;this.timer=window.setTimeout(()=>this.advance(),e)}setBeat(e){e!==this.index&&(this.index=e,this.opts.onBeat(e,this.opts.beats.length),this.opts.onSceneBeat?.(e))}get current(){return this.index}}const W={name:"Di Qiu"},E={name:"ExploreFlow",tagline:"Interactive courses — visual, explorable, and steppable line by line.",blurb:"Each course pairs prose with live demos you can drag and step through, narrated beat by beat. No video: everything runs in the page."},X={experience:[{org:"Google XR",place:"",roles:[{title:"Software Developer (Canada)",dates:"Apr 2022 - present"},{title:"Research Intern → Student Researcher (remote)",dates:"Sep 2020 - Sep 2021"}]},{org:"SenseTime Research",place:"Hong Kong",roles:[{title:"Research Intern · Intern Star award",dates:"Jul 2018 - Aug 2019"}]}]},T=[{name:"Vision & Graphics",tags:["computer vision","computer graphics","imaging","machine learning"]},{name:"Numerical Methods & Optimization",tags:["cuhk.math3310","teaching","numerical methods","optimization"]},{name:"Analysis & PDE",tags:["real analysis","measure theory","functional analysis","harmonic analysis","Fourier analysis","PDE","elliptic theory"]},{name:"Geometry & Topology",tags:["differential geometry","discrete conformal geometry","algebraic topology","complex analysis"]},{name:"Algebra",tags:["algebra","linear algebra"]},{name:"Probability",tags:["probability theory","stochastic differential equation","statistical physics"]}],D=[{title:"GNM Head: A Generative aNthropometric Model of the Human Head",href:"https://arxiv.org/abs/2607.23687",authors:"Stylianos Ploumpis, Jan Bednarik, Gaspard Zoss, Ruslan Guseinov, Luca Prasso, Prashanth Chandran, Oliver Boyne, Vasileios Choutas, Timo Bolkart, Daoye Wang, Menglei Chai, Di Qiu, Sebastian Winberg, Gilles Rainer, Lewis Bridgeman, Leonhard Helminger, Edo Collins, Delio Vicini, Jérémy Riviere, Yannick Boetzel, Alexander Koumis, Stylianos Moschoglou, Jay Busch, Cynthia Herrera, Jacob Still, Scott Ysebert, Peter Lincoln, Sergio Orts Escolano, Christoph Rhemann, Erroll Wood, Thabo Beeler, Stefanos Zafeiriou",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"A publicly released parametric model of the human head - face, neck, eyeballs, teeth and tongue - for animation, rendering, and as conditioning for generative models."},{title:"Concurrent Image Understanding and Generation: Self-Correcting Coupled Markov Jump Processes",href:"https://arxiv.org/abs/2607.13188",authors:"Minh-Quan Le, Armand Comas, Alexandros Lattas, Stylianos Moschoglou, Pedro Vélez, Amit Raj, Aaron Germuth, Thabo Beeler, Dimitris Samaras, Di Qiu",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"Joint multimodal sampling where each modality's transition rates follow the other's confidence, with a remasking jump that retracts cross-modal contradictions."},{title:"MagicMirror: Fast and High-Quality Avatar Generation with a Constrained Search Space",href:"https://arxiv.org/abs/2404.01296",authors:"Armand Comas-Massagué, Di Qiu, Menglei Chai, Marcel Bühler, Amit Raj, Ruiqi Gao, Qiangeng Xu, Mark Matthews, Paulo Gotardo, Octavia Camps, Sergio Orts-Escolano, Thabo Beeler",venue:"ECCV, 2024",images:[],links:[],blurb:"Text-guided avatar generation and editing, using a parametric NeRF with a constrained search space for fast, high-quality results."},{title:"Loc3Diff: Local Diffusion for 3D Human Head Synthesis and Editing",href:"https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/08166.pdf",authors:"Yushi Lan, Feitong Tan, Qiangeng Xu, Di Qiu, Kyle Genova, Zeng Huang, Sean Fanello, Rohit Pandey, Thomas Funkhouser, Chen Change Loy, Yinda Zhang",venue:"ECCV, 2024",images:[],links:[],blurb:"Generates photorealistic 3D heads by diffusing UV-anchored local tri-planes, giving semantic-aligned local control for head synthesis and editing."},{title:"CHOSEN: Contrastive Hypothesis Selection for Multi-View Depth Refinement",href:"https://crv.pubpub.org/pub/dl70yq4c",authors:"Di Qiu, Yinda Zhang, Thabo Beeler, Vladimir Tankovich, Christian Häne, Sean Fanello, Christoph Rhemann, Sergio Orts Escolano",venue:"CRV, 2025 · Best Paper",images:[],links:[{label:"arXiv",href:"https://arxiv.org/abs/2404.02225"}],blurb:"Iteratively re-samples and selects the best depth hypotheses with contrastive learning; drops into any multi-view stereo pipeline."},{title:"MonoAvatar: Learning Personalized High Quality Volumetric Head Avatars from Monocular RGB Videos",href:"https://arxiv.org/abs/2304.01436",authors:"Ziqian Bai, Feitong Tan, Zeng Huang, Kripasindhu Sarkar, Danhang Tang, Di Qiu, Abhimitra Meka, Ruofei Du, Mingsong Dou, Sergio Orts-Escolano, Rohit Pandey, Ping Tan, Thabo Beeler, Sean Fanello, Yinda Zhang",venue:"CVPR, 2023",images:["images/pub/mono_avatar/mono_avatar.gif"],links:[{label:"project",href:"https://augmentedperception.github.io/monoavatar"}],blurb:"Builds an animatable 3D head avatar from monocular video, using a parametric head model equipped with learnable features."},{title:"Modal Uncertainty Estimation via Discrete Latent Representation",href:"https://arxiv.org/abs/2007.12858",authors:"Di Qiu, Lok Ming Lui",venue:"MICCAI UNSURE workshop, 2021",images:["images/pub/modal_uncertainty/1.png"],links:[{label:"code",href:"https://github.com/sylqiu/MUE"}],blurb:"Estimates the modal uncertainty of one-to-many mappings with a conditional variational auto-encoding framework over discrete latent modes."},{title:"Guided Collaborative Training for Pixel-wise Semi-Supervised Learning",href:"https://arxiv.org/abs/2008.05258",authors:"Zhanghan Ke, Di Qiu, Kaican Li, Qiong Yan, Rynson W. H. Lau",venue:"ECCV, 2020",images:[],links:[],blurb:"An ensemble of networks that learn from each other through a flaw-detection module; state-of-the-art pixel-wise semi-supervised segmentation, denoising and enhancement."},{title:"Towards Geometry Guided Neural Relighting with Flash Photography",authors:"Di Qiu, Jin Zeng, Zhanghan Ke, Wenxiu Sun, Chengxi Yang",venue:"3DV, 2020",images:["images/pub/relight/1.png","images/pub/relight/2.png"],links:[],blurb:"Directional relighting from a single co-located flash image and its depth map."},{title:"Inconsistent Surface Registration via Optimization of Mapping Distortions",href:"https://arxiv.org/abs/1908.09098",authors:"Di Qiu, Lok Ming Lui",venue:"Journal of Scientific Computing, 2020",images:["images/pub/incon_shape/1.png","images/pub/incon_shape/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/incon_reg"}],blurb:"Simultaneously finding the domain of correspondence and the registration by optimizing distortions in the mapping differential."},{title:"Adapting Object Detectors with Conditional Domain Normalization",href:"https://arxiv.org/abs/2003.07071",authors:"Peng Su, Kun Wang, Xingyu Zeng, Shixiang Tang, Dapeng Chen, Di Qiu, Xiaogang Wang",venue:"ECCV, 2020",images:[],links:[],blurb:"Aligns mini-batch feature statistics across domains for domain adaptation in object detection and segmentation."},{title:"Shape Analysis via Inconsistent Surface Registration",href:"https://arxiv.org/abs/2003.01357",authors:"Gary P. T. Choi, Di Qiu, Lok Ming Lui",venue:"Proceedings of the Royal Society A, 2020",images:[],links:[],blurb:"Inconsistent surface registration applied to shape analysis in tooth morphology."},{title:"Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules",href:"http://arxiv.org/abs/1909.07623",authors:"Di Qiu, Jiahao Pang, Chengxi Yang, Wenxiu Sun",venue:"ICCV, 2019 · Best Poster Award, HK Computer Vision Workshop",images:["images/pub/tof_align_refine/1.png","images/pub/tof_align_refine/2.png"],links:[{label:"code & dataset",href:"https://github.com/sylqiu/tof_rgbd_processing"}],blurb:"Cross-modal flow estimation and Time-of-Flight depth refinement using deep learning, with a physically accurate synthetic dataset."},{title:"Computing Quasiconformal Folds",href:"https://arxiv.org/abs/1804.03936",authors:"Di Qiu, Ka Chun Lam, Lok Ming Lui",venue:"SIAM Journal on Imaging Sciences, 2019",images:["images/pub/fold_map/1.png","images/pub/fold_map/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/Least-square-beltrami-solver"}],blurb:"Computing folding and unfolding maps via a generalized form of quasiconformal mapping and crease geometry inference."}];function F(t){const e=W.name;return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").split(", ").map(i=>i.trim()===e?`<strong>${i.trim()}</strong>`:i.trim()).join(", ")}const $=[{id:"flash-attention",category:"LLM foundation",title:"Why and how FlashAttention works",blurb:"We will see why the memory and communication cost of the naive implementation is high, and how efficient implementation like FlashAttention solves that.",scene:"flash-attention"},{id:"postmarked",category:"Distributed systems",title:"Postmarked",blurb:"A postal game of delivery, proof, and shared state. One trail, ten stops.",scene:"postmarked"},{id:"kv-cache",category:"LLM foundation",title:"Why and how KV cache works in an autoregressive LLM",blurb:"We will see why only KV of the dialog history is needed, and how to efficiently manage them in HBM",scene:"kv-cache"}],g=document.getElementById("app"),z=document.getElementById("topnav");let y=[];const H=new Map,I=new Map,A=new Set(JSON.parse(localStorage.getItem("exploreflow:progress")||"[]")),s=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),_=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");function ee(){localStorage.setItem("exploreflow:progress",JSON.stringify([...A]))}async function C(t){const e=await fetch(t);return e.ok?await e.json():null}const te=[{href:"#/",label:"Home",nav:"#/"},{href:"#/cv",label:"CV",nav:"#/cv"},{href:"#/illustrations",label:"Illustrations",nav:"#/illustrations"},{href:"#/blog",label:"Writing",nav:"#/blog"}];function ae(){z.innerHTML=te.map(t=>`<a href="${t.href}" data-nav="${t.nav}">${s(t.label)}</a>`).join("")}function ne(t){const e=t.split("?")[0]||"#/";z.querySelectorAll("a[data-nav]").forEach(a=>{const i=a.dataset.nav||"#/",n=i==="#/"?e==="#/":e===i||e.startsWith(i+"/");a.classList.toggle("active",n)})}const se=[{text:"Good morning",lang:"en",emoji:"☀️",parts:["morning"]},{text:"Morning",lang:"en",parts:["morning"]},{text:"Buenos días",lang:"es",parts:["morning"]},{text:"Bonjour",lang:"fr",parts:["morning","afternoon"]},{text:"Guten Morgen",lang:"de",parts:["morning"]},{text:"Buongiorno",lang:"it",parts:["morning"]},{text:"Bom dia",lang:"pt",parts:["morning"]},{text:"おはよう",lang:"ja",parts:["morning"]},{text:"早上好",lang:"zh",parts:["morning"]},{text:"좋은 아침",lang:"ko",parts:["morning"]},{text:"Доброе утро",lang:"ru",parts:["morning"]},{text:"Hello",lang:"en",emoji:"👋",parts:["morning","afternoon","evening","night"]},{text:"Hi there",lang:"en",parts:["afternoon"]},{text:"Good afternoon",lang:"en",parts:["afternoon"]},{text:"Buenas tardes",lang:"es",parts:["afternoon"]},{text:"Bon après-midi",lang:"fr",parts:["afternoon"]},{text:"Guten Tag",lang:"de",parts:["afternoon"]},{text:"Buon pomeriggio",lang:"it",parts:["afternoon"]},{text:"Boa tarde",lang:"pt",parts:["afternoon"]},{text:"こんにちは",lang:"ja",parts:["afternoon"]},{text:"你好",lang:"zh",parts:["afternoon"]},{text:"안녕하세요",lang:"ko",parts:["afternoon"]},{text:"Добрый день",lang:"ru",parts:["afternoon"]},{text:"Good evening",lang:"en",emoji:"🌆",parts:["evening"]},{text:"Evening",lang:"en",parts:["evening"]},{text:"Buenas noches",lang:"es",parts:["evening","night"]},{text:"Bonsoir",lang:"fr",parts:["evening"]},{text:"Guten Abend",lang:"de",parts:["evening"]},{text:"Buonasera",lang:"it",parts:["evening"]},{text:"Boa noite",lang:"pt",parts:["evening","night"]},{text:"こんばんは",lang:"ja",parts:["evening","night"]},{text:"晚上好",lang:"zh",parts:["evening"]},{text:"좋은 저녁",lang:"ko",parts:["evening"]},{text:"Добрый вечер",lang:"ru",parts:["evening"]},{text:"Still up?",lang:"en",emoji:"🌙",parts:["night"]},{text:"Up late",lang:"en",parts:["night"]},{text:"Bonne nuit",lang:"fr",parts:["night"]},{text:"Gute Nacht",lang:"de",parts:["night"]},{text:"おやすみ",lang:"ja",parts:["night"]},{text:"晚安",lang:"zh",parts:["night"]},{text:"잘 자",lang:"ko",parts:["night"]},{text:"Спокойной ночи",lang:"ru",parts:["night"]}],ie=[["Asia/Tokyo","ja"],["Asia/Shanghai","zh"],["Asia/Hong_Kong","zh"],["Asia/Taipei","zh"],["Asia/Seoul","ko"],["Europe/Paris","fr"],["Europe/Berlin","de"],["Europe/Vienna","de"],["Europe/Zurich","de"],["Europe/Madrid","es"],["Europe/Rome","it"],["Europe/Lisbon","pt"],["Europe/Moscow","ru"],["America/Sao_Paulo","pt"]];function oe(t){return t<5?"night":t<12?"morning":t<18?"afternoon":"evening"}function re(){const t=(navigator.languages?.length?navigator.languages:[navigator.language]).filter(Boolean).map(i=>i.toLowerCase().split("-")[0]),e=Intl.DateTimeFormat().resolvedOptions().timeZone||"",a=ie.find(([i])=>e===i||e.startsWith(i+"/"))?.[1];return new Set([...t,...a?[a]:[]])}function le(){const t=oe(new Date().getHours()),e=se.filter(r=>r.parts.includes(t)),a=e.filter(r=>re().has(r.lang)),i=a.length>0&&Math.random()<.65?a:e;let n="";try{n=sessionStorage.getItem("greeting:last")||""}catch{}const o=i.length>1?i.filter(r=>r.text!==n):i,l=o[Math.floor(Math.random()*o.length)]??e[0];try{sessionStorage.setItem("greeting:last",l.text)}catch{}return l}function ce(){const e=(Intl.DateTimeFormat().resolvedOptions().timeZone||"").split("/").pop()?.replace(/_/g," ")||"",a=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return e?`${a} · ${e}`:a}function ue(){const t=le(),e=ce(),a=Math.random()<.5?"rise":"pop";g.innerHTML=`
    <section class="landing">
      <h1 class="greeting ${a}" lang="${s(t.lang)}">${s(t.text)}${t.emoji?` <span class="greet-emoji" aria-hidden="true">${t.emoji}</span>`:""}</h1>
      ${e?`<p class="greet-meta">${s(e)}</p>`:""}
    </section>
  `}let R=null,O="";const P=6;function Q(t,e,a,i="← Prev",n="Next →",o={}){if(e<=1)return"";const l=c=>`${a}?${new URLSearchParams({...o,page:String(c)}).toString()}`,r=Array.from({length:e},(c,m)=>m+1).map(c=>c===t?`<span class="pager-num is-current" aria-current="page">${c}</span>`:`<a class="pager-num" href="${l(c)}">${c}</a>`).join(""),d=t>1?`<a class="pager-step" href="${l(t-1)}">${i}</a>`:`<span class="pager-step is-disabled">${i}</span>`,h=t<e?`<a class="pager-step" href="${l(t+1)}">${n}</a>`:`<span class="pager-step is-disabled">${n}</span>`;return`<nav class="pager" aria-label="Pagination">${d}<span class="pager-nums">${r}</span>${h}</nav>`}function he(t=1,e=""){const a=Array.from(new Set($.map(u=>u.category).filter(Boolean))),i=new Map(a.map(u=>[u,$.filter(v=>v.category===u).length])),n=a.find(u=>_(u)===e)||"",o=n?$.filter(u=>u.category===n):$,l=Math.max(1,Math.ceil(o.length/P)),r=Math.min(Math.max(1,t),l),h=o.slice((r-1)*P,r*P).map(u=>`<a class="ill-card-link" href="#/illustrations/${s(u.id)}">
        <h2>${s(u.title)}</h2>
        <p>${s(u.blurb)}</p>
        <span class="ill-open">Open →</span>
      </a>`).join(""),c=[`<a class="blog-cat-link${n?"":" is-active"}" href="#/illustrations">All<span>${$.length}</span></a>`,...a.map(u=>{const v=_(u);return`<a class="blog-cat-link${n===u?" is-active":""}" href="#/illustrations?category=${v}">${s(u)}<span>${i.get(u)}</span></a>`})].join(""),m=l>1?` · page ${r} of ${l}`:"",w=n?`${o.length} illustrations in ${n}${m}.`:`${$.length} illustrations${m}.`;g.innerHTML=`<article class="page">
    <header>
      <h1>Interactives</h1>
      <p class="reading">${w}</p>
    </header>
    <div class="blog-layout">
      <aside class="blog-side">
        <div class="blog-side-title">Topics</div>
        <nav class="blog-cats" aria-label="Topics">${c}</nav>
      </aside>
      <div class="blog-main">
        <nav class="ill-index">${h||'<p class="dim">Nothing here yet.</p>'}</nav>
        ${Q(r,l,"#/illustrations","← Prev","Next →",n?{category:e}:{})}
      </div>
    </div>
  </article>`}async function pe(t){const e=$.find(n=>n.id===t);if(!e){g.innerHTML=`<article class="page">
      <header><h1>Not here</h1></header>
      <p>No illustration <code>${s(t)}</code>.</p>
      <p><a href="#/illustrations">← All illustrations</a></p>
    </article>`;return}g.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/illustrations">← All illustrations</a>
      <h1>${s(e.title)}</h1>
    </header>
    <div class="ill-canvas" id="ill-stage"></div>
  </article>`;const a=g.querySelector("#ill-stage");if(!a)return;const i=await V(e.scene,a,[]);if(!document.contains(a)){i?.destroy();return}R=i}function de(){const t=X.experience.map(a=>{const i=a.roles.map(n=>`<div class="cv-role">
          <span class="cv-title">${s(n.title)}</span>
          <span class="cv-when">${s(n.dates)}</span>
        </div>`).join("");return`<div class="cv-org">
        <h3 class="cv-org-name">${s(a.org)}${a.place?` <span class="cv-place">${s(a.place)}</span>`:""}</h3>
        ${i}
      </div>`}).join(""),e=D.map(a=>{const i=a.href?`<a href="${s(a.href)}" target="_blank" rel="noopener">${s(a.title)}</a>`:s(a.title),n=a.links.map(o=>`<a href="${s(o.href)}" target="_blank" rel="noopener">${s(o.label)}</a>`).join(" · ");return`<article class="pub">
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${F(a.authors)}</p>
          <p class="pub-venue"><em>${s(a.venue)}</em></p>
          ${n?`<p class="pub-links">${n}</p>`:""}
          <p class="pub-blurb">${s(a.blurb)}</p>
        </div>
      </article>`}).join("");g.innerHTML=`<article class="page cv">
    <header>
      <h1>${s(W.name)}</h1>
    </header>

    <section class="cv-section">
      <h2>Experience</h2>
      ${t}
    </section>

    <section class="cv-section">
      <h2>Publications
        <a class="cv-scholar" href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar ↗</a>
      </h2>
      <div class="pubs">${e}</div>
    </section>

  </article>`}function ge(){const t=[{href:"#/research",title:"Research",blurb:`${D.length} publications — graphics, vision, geometry.`},{href:"#/blog",title:"Writing",blurb:"Notes on analysis, geometry, and numerical methods."},{href:"#/courses",title:"Courses",blurb:y.length?`${y.length} interactive course${y.length===1?"":"s"} with live demos and narration.`:"Interactive courses with live demos and narration."}].map(e=>`<a class="door" href="${e.href}">
        <span class="door-title">${s(e.title)}</span>
        <span class="door-blurb">${s(e.blurb)}</span>
      </a>`).join("");g.innerHTML=`<article class="page">
    <header>
      <h1>${s(E.name)}</h1>
      <p class="reading">${s(E.tagline)}</p>
    </header>
    <div class="doors">${t}</div>
  </article>`}function me(){const t=D.map(e=>{const a=e.images.map((l,r)=>`<img src="${s(l)}" alt="" class="${r===0?"pub-img primary":"pub-img secondary"}" loading="lazy" />`).join(""),i=e.href?`<a href="${s(e.href)}" target="_blank" rel="noopener">${s(e.title)}</a>`:s(e.title),n=e.links.map(l=>`<a href="${s(l.href)}" target="_blank" rel="noopener">[${s(l.label)}]</a>`).join(" ");return`<article class="pub">
        ${e.images.length?`<div class="pub-media${e.images.length>1?" swap":""}">${a}</div>`:""}
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${F(e.authors)}</p>
          <p class="pub-venue"><em>${s(e.venue)}</em></p>
          ${n?`<p class="pub-links">${n}</p>`:""}
          <p class="pub-blurb">${s(e.blurb)}</p>
        </div>
      </article>`}).join("");g.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Research</h1>
      <p class="reading">Selected publications. Full list on
      <a href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar</a>.</p>
    </header>
    <div class="pubs">${t}</div>
  </article>`}function fe(){if(!y.length){g.innerHTML=`<article class="page"><header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1></header>
      <p class="dim">No courses built yet.</p></article>`;return}const t=y.map(e=>{const a=e.modules.reduce((n,o)=>n+o.lessons.length,0),i=e.modules.flatMap(n=>n.lessons).filter(n=>A.has(n)).length;return`<a class="course-card" href="#/courses/${s(e.id)}">
        <span class="course-title">${s(e.title)}</span>
        ${e.subtitle?`<span class="course-sub">${s(e.subtitle)}</span>`:""}
        <span class="course-meta">${a} lesson${a===1?"":"s"}${i?` · ${i} done`:""}</span>
        <span class="door-arrow">→</span>
      </a>`}).join("");g.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1>
      <p class="reading">${s(E.blurb)}</p>
    </header>
    <div class="courses">${t}</div>
  </article>`}function ve(t){const e=y.find(i=>i.id===t);if(!e){g.innerHTML=`<article class="page"><header><h1>Not found</h1></header>
      <p>No course <code>${s(t)}</code>. <a href="#/courses">All courses</a></p></article>`;return}const a=e.modules.map(i=>`<section class="mod">
        <h2>${s(i.title)}</h2>
        ${i.lessons.length?`<ul>${i.lessons.map(n=>`<li><a href="#/lesson/${s(n)}">${s(n)}</a>${A.has(n)?' <span class="done">✓</span>':""}</li>`).join("")}</ul>`:'<p class="dim">Not written yet.</p>'}
      </section>`).join("");g.innerHTML=`<article class="page">
    <a class="back" href="#/courses">← ${s(E.name)}</a>
    <header><h1>${s(e.title)}</h1></header>
    ${e.subtitle?`<p class="sub">${s(e.subtitle)}</p>`:""}
    ${a}
  </article>`}async function be(t=1,e=""){const a=await C("./data/blog.json");if(!a){g.innerHTML='<article class="page"><header><h1>Writing</h1></header><p class="dim">Nothing built.</p></article>';return}const i=p=>{const f=`#/blog/${s(p.id)}`,L=(p.preview||[]).map(k=>`<p>${k}</p>`).join(""),S=(p.images||[]).map(k=>`<a class="post-thumb" href="${f}" title="${s(k.alt||"")}"><img src="${s(k.src)}" alt="${s(k.alt||"")}" loading="lazy" decoding="async"></a>`).join("");return`<li class="post">
        <div class="post-head">
          <a class="post-title" href="${f}">${s(p.title)}</a>
          <span class="post-date">${s(p.date)}</span>
        </div>
        ${L?`<div class="post-preview">${L}</div>`:""}
        ${S?`<div class="post-thumbs">${S}</div>`:""}
        <a class="post-more" href="${f}">Read →</a>
      </li>`},n=p=>{const f=T.find(L=>p.tags.some(S=>L.tags.includes(S)));return f?f.name:"Other"},o=new Map;for(const p of a){const f=n(p);o.set(f,(o.get(f)||0)+1)}const l=[...a].sort((p,f)=>p.date<f.date?1:-1),r=[...T.map(p=>p.name),"Other"].find(p=>_(p)===e)||"",d=r?l.filter(p=>n(p)===r):l,h=6,c=Math.max(1,Math.ceil(d.length/h)),m=Math.min(Math.max(1,t),c),w=d.slice((m-1)*h,m*h),u=[`<a class="blog-cat-link${r?"":" is-active"}" href="#/blog">All<span>${a.length}</span></a>`,...[...T.map(p=>p.name),"Other"].filter(p=>(o.get(p)||0)>0).map(p=>{const f=_(p);return`<a class="blog-cat-link${r===p?" is-active":""}" href="#/blog?category=${f}">${s(p)}<span>${o.get(p)}</span></a>`})].join(""),v=c>1?` · page ${m} of ${c}`:"",x=r?`${d.length} notes in ${r}, newest first${v}.`:`${a.length} notes, newest first${v}.`;g.innerHTML=`<article class="page">
    <header>
      <h1>Writing</h1>
      <p class="reading">${x}</p>
    </header>
    <div class="blog-layout">
      <aside class="blog-side">
        <div class="blog-side-title">Topics</div>
        <nav class="blog-cats" aria-label="Topics">${u}</nav>
      </aside>
      <div class="blog-main">
        <ul class="post-list">${w.map(i).join("")}</ul>
        ${d.length?"":'<p class="dim">No posts in this topic.</p>'}
        ${Q(m,c,"#/blog","← Newer","Older →",r?{category:e}:{})}
      </div>
    </div>
  </article>`}async function $e(t){let e=I.get(t);if(!e){const a=await C(`./data/blog/${t}.json`);if(!a){g.innerHTML=`<article class="page"><header><h1>Not found</h1></header><p>No post <code>${s(t)}</code>.</p></article>`;return}e=a,I.set(t,e)}g.innerHTML=`<article class="post-view">
    <a class="back" href="#/blog">← All posts</a>
    <header>
      <h1>${s(e.title)}</h1>
      <div class="meta">${s(e.date)}</div>
      <p class="post-tags">${e.tags.map(a=>`<span>${s(a)}</span>`).join("")}</p>
    </header>
    <div class="prose">${e.html}</div>
    ${e.source?`<footer class="post-source">Originally posted at <a href="${s(e.source)}" target="_blank" rel="noopener">blogspot</a>.</footer>`:""}
  </article>`}function ye(t){const e=t.title?`<div class="box-title">${t.title}</div>`:"";return`<section class="box box-${t.box}">${e}<div class="box-body">${t.html}</div></section>`}function we(t){const e=t.check.options.map((a,i)=>`<button class="opt" data-correct="${a.correct}" data-i="${i}">
          <span class="opt-mark"></span><span>${a.text}</span></button>`).join("");return`<section class="check" data-qid="${s(t.check.qid)}">
    <div class="check-q">${t.check.question}</div>
    <div class="check-opts">${e}</div>
    <div class="check-exp" hidden>${t.check.explanation}</div>
  </section>`}function xe(t){const e=t.beats.map((a,i)=>`<button class="beat" data-beat="${i}"><span class="beat-n">${i+1}</span>${s(a.text)}</button>`).join("");return`<section class="sceneblock" data-scene="${s(t.id)}" style="--scene-h:${t.height}px">
    <div class="scene-head">
      <span class="scene-id">${s(t.id)}</span>
      ${t.title?`<span class="scene-title">${s(t.title)}</span>`:""}
      <div class="scene-ctl">
        <button class="btn play" type="button">Play</button>
        <button class="btn reset" type="button">Reset</button>
      </div>
    </div>
    <div class="scene-canvas"></div>
    <div class="beats">${e||'<span class="dim">No narration beats.</span>'}</div>
  </section>`}function ke(t){return t.blocks.map(e=>{switch(e.kind){case"md":return`<div class="prose">${e.html}</div>`;case"box":return ye(e);case"scene":return xe(e);case"check":return we(e)}}).join("")}const B=new Map;async function Le(t,e,a){const i=t.querySelector(".scene-canvas"),n=[...t.querySelectorAll(".beat")],o=t.querySelector(".play"),l=t.querySelector(".reset"),r=a.audio?new Audio(`./media/${a.audio}`):null;r&&(r.preload="auto");const d=await V(e.id,i,e.beats.map(c=>c.text)),h=new Y({beats:e.beats,audio:r,onBeat:c=>{n.forEach((m,w)=>m.classList.toggle("active",w===c)),n[c]?.scrollIntoView({block:"nearest",behavior:"smooth"}),o.textContent=c>=e.beats.length-1?"Replay":"Playing…"},onSceneBeat:c=>d?.play?.(c)});B.set(t,{host:d,narration:h}),o.addEventListener("click",()=>{h.stop(),r?.pause(),r&&(r.currentTime=0,r.play()),h.start()}),l.addEventListener("click",()=>{h.stop(),r?.pause(),d?.reset?.(),n.forEach(c=>c.classList.remove("active")),o.textContent="Play"}),n.forEach(c=>c.addEventListener("click",()=>{r?.pause(),h.goto(Number(c.dataset.beat))}))}async function Se(t){let e=H.get(t);if(!e){const n=await C(`./data/lessons/${t}.json`);if(!n){g.innerHTML=`<article class="page"><header><h1>Not built yet</h1></header>
        <p>No lesson <code>${s(t)}</code>.</p>
        <p>Add <code>content/courses/&lt;course&gt;/**/${s(t)}.md</code>, set <code>publish: true</code>, then run <code>npm run build:lessons</code>.</p></article>`;return}e=n,H.set(t,e)}const a=e.reading?`<p class="reading">Reading: ${e.reading.url?`<a href="${s(e.reading.url)}" target="_blank" rel="noopener">${s(e.reading.text)}</a>`:s(e.reading.text)}</p>`:"",i=e.courseId?`<a class="back" href="#/courses/${s(e.courseId)}">← Course</a>`:"";g.innerHTML=`<article class="lesson">
    <header>
      ${i}
      <h1>${s(e.title)}</h1>
      <div class="meta">${s(e.module)} · ${s(e.kind)}</div>
      ${a}
    </header>
    ${ke(e)}
  </article>`;for(const n of e.blocks){if(n.kind!=="scene")continue;const o=g.querySelector(`[data-scene="${n.id}"]`);o&&await Le(o,n,e)}for(const n of g.querySelectorAll(".check"))n.addEventListener("click",o=>{const l=o.target.closest(".opt");if(!l||l.disabled)return;const r=l.dataset.correct==="true";l.classList.add(r?"ok":"bad"),n.querySelectorAll(".opt").forEach(d=>{d.dataset.correct==="true"&&d.classList.add("ok"),d.disabled=!0}),n.querySelector(".check-exp").hidden=!1,r&&(A.add(t),ee())})}function Me(){for(const[t,e]of B)try{e.narration.stop(),e.host?.destroy(),t.replaceWith(t.cloneNode(!1))}catch(a){console.warn("scene teardown failed",a)}B.clear();try{R?.destroy()}catch(t){console.warn("illustration teardown failed",t)}finally{R=null}}function M(){const t=location.hash||"#/",[e,a]=t.split("?"),i=new URLSearchParams(a||""),n=Math.max(1,Number(i.get("page"))||1),o=i.get("category")||"";if(window.scrollTo(0,0),t===O)return;O=t,Me(),ne(t);const l=e.match(/^#\/blog\/(.+)$/);if(l)return void $e(l[1]);const r=e.match(/^#\/lesson\/(.+)$/);if(r)return void Se(r[1]);const d=e.match(/^#\/courses\/(.+)$/);if(d)return void ve(d[1]);if(e.startsWith("#/exploreflow"))return void ge();if(e.startsWith("#/cv"))return void de();const h=e.match(/^#\/illustrations\/(.+)$/);if(h)return void pe(h[1]);if(e.startsWith("#/illustrations"))return void he(n,o);if(e.startsWith("#/blog"))return void be(n,o);if(e.startsWith("#/courses"))return void fe();if(e.startsWith("#/research"))return void me();ue(),window.scrollTo(0,0)}async function Ee(){y=await C("./data/courses.json")||[],ae(),document.addEventListener("click",t=>{const e=t.target?.closest('a[href^="#/"]');if(!e)return;const a=e.getAttribute("href");a&&(t.preventDefault(),location.hash===a||(location.hash=a),M())}),window.addEventListener("hashchange",M),M()}Ee();
