const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./kv-cache-BIlkrUSJ.js","./code-highlight-Ct8t2e3l.js","./flash-attention-By3dFGKH.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const K="modulepreload",Z=function(t,e){return new URL(t,e).href},H={},L=function(e,s,i){let a=Promise.resolve();if(s&&s.length>0){const r=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),p=l?.nonce||l?.getAttribute("nonce");a=Promise.allSettled(s.map(u=>{if(u=Z(u,i),u in H)return;H[u]=!0;const c=u.endsWith(".css"),m=c?'[rel="stylesheet"]':"";if(!!i)for(let b=r.length-1;b>=0;b--){const w=r[b];if(w.href===u&&(!c||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${m}`))return;const h=document.createElement("link");if(h.rel=c?"stylesheet":K,c||(h.as="script"),h.crossOrigin="",h.href=u,p&&h.setAttribute("nonce",p),document.head.appendChild(h),c)return new Promise((b,w)=>{h.addEventListener("load",b),h.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${u}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return a.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})},q={"hybrid-chain":()=>L(()=>import("./hybrid-chain-D5ew_OCj.js"),[],import.meta.url),"stat-vs-comp":()=>L(()=>import("./stat-vs-comp-DpDT9Loh.js"),[],import.meta.url),"prg-stretch":()=>L(()=>import("./prg-stretch-DHhopNnX.js"),[],import.meta.url),"kv-cache":()=>L(()=>import("./kv-cache-BIlkrUSJ.js"),__vite__mapDeps([0,1]),import.meta.url),"flash-attention":()=>L(()=>import("./flash-attention-By3dFGKH.js"),__vite__mapDeps([2,1]),import.meta.url)};function U(){return Object.keys(q)}async function V(t,e,s){const i=q[t];return i?(await i()).default(e,{beats:s}):(e.innerHTML=`<div class="scene-missing">Unknown scene <code>${t}</code>.<br>
      Known: ${U().map(o=>`<code>${o}</code>`).join(", ")}</div>`,null)}const z=380,W=2400;function B(t){const e=t.trim().split(/\s+/).filter(Boolean).length;return Math.max(W,Math.round(e*z))}class Y{constructor(e){this.opts=e;const s=this.opts.audio?.duration,i=e.beats;if(this.opts.audio&&Number.isFinite(s)&&s&&i.length){const a=i.map(r=>r.seconds?r.seconds*1e3:B(r.text)),o=a.reduce((r,l)=>r+l,0);this.beatMs=a.map(r=>r/o*s*1e3)}else this.beatMs=i.map(a=>a.seconds?a.seconds*1e3:B(a.text))}index=-1;timer=null;stopped=!1;beatMs;start(){this.index=-1,this.stopped=!1,this.advance()}stop(){this.stopped=!0,this.timer!==null&&clearTimeout(this.timer),this.timer=null}goto(e){this.stopped||(this.timer!==null&&clearTimeout(this.timer),this.setBeat(e),this.schedule())}advance(){this.stopped||(this.setBeat(this.index+1),this.schedule())}schedule(){if(this.stopped||this.index>=this.opts.beats.length-1)return;const e=this.beatMs[this.index]??W;this.timer=window.setTimeout(()=>this.advance(),e)}setBeat(e){e!==this.index&&(this.index=e,this.opts.onBeat(e,this.opts.beats.length),this.opts.onSceneBeat?.(e))}get current(){return this.index}}const G={name:"Di Qiu"},C={name:"ExploreFlow",tagline:"Interactive courses — visual, explorable, and steppable line by line.",blurb:"Each course pairs prose with live demos you can drag and step through, narrated beat by beat. No video: everything runs in the page."},X={experience:[{org:"Google XR",place:"",roles:[{title:"Software Developer (Canada)",dates:"Apr 2022 - present"},{title:"Research Intern → Student Researcher (remote)",dates:"Sep 2020 - Sep 2021"}]},{org:"SenseTime Research",place:"Hong Kong",roles:[{title:"Research Intern · Intern Star award",dates:"Jul 2018 - Aug 2019"}]}]},T=[{name:"Vision & Graphics",tags:["computer vision","computer graphics","imaging","machine learning"]},{name:"Numerical Methods & Optimization",tags:["cuhk.math3310","teaching","numerical methods","optimization"]},{name:"Analysis & PDE",tags:["real analysis","measure theory","functional analysis","harmonic analysis","Fourier analysis","PDE","elliptic theory"]},{name:"Geometry & Topology",tags:["differential geometry","discrete conformal geometry","algebraic topology","complex analysis"]},{name:"Algebra",tags:["algebra","linear algebra"]},{name:"Probability",tags:["probability theory","stochastic differential equation","statistical physics"]}],D=[{title:"GNM Head: A Generative aNthropometric Model of the Human Head",href:"https://arxiv.org/abs/2607.23687",authors:"Stylianos Ploumpis, Jan Bednarik, Gaspard Zoss, Ruslan Guseinov, Luca Prasso, Prashanth Chandran, Oliver Boyne, Vasileios Choutas, Timo Bolkart, Daoye Wang, Menglei Chai, Di Qiu, Sebastian Winberg, Gilles Rainer, Lewis Bridgeman, Leonhard Helminger, Edo Collins, Delio Vicini, Jérémy Riviere, Yannick Boetzel, Alexander Koumis, Stylianos Moschoglou, Jay Busch, Cynthia Herrera, Jacob Still, Scott Ysebert, Peter Lincoln, Sergio Orts Escolano, Christoph Rhemann, Erroll Wood, Thabo Beeler, Stefanos Zafeiriou",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"A publicly released parametric model of the human head - face, neck, eyeballs, teeth and tongue - for animation, rendering, and as conditioning for generative models."},{title:"Concurrent Image Understanding and Generation: Self-Correcting Coupled Markov Jump Processes",href:"https://arxiv.org/abs/2607.13188",authors:"Minh-Quan Le, Armand Comas, Alexandros Lattas, Stylianos Moschoglou, Pedro Vélez, Amit Raj, Aaron Germuth, Thabo Beeler, Dimitris Samaras, Di Qiu",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"Joint multimodal sampling where each modality's transition rates follow the other's confidence, with a remasking jump that retracts cross-modal contradictions."},{title:"MagicMirror: Fast and High-Quality Avatar Generation with a Constrained Search Space",href:"https://arxiv.org/abs/2404.01296",authors:"Armand Comas-Massagué, Di Qiu, Menglei Chai, Marcel Bühler, Amit Raj, Ruiqi Gao, Qiangeng Xu, Mark Matthews, Paulo Gotardo, Octavia Camps, Sergio Orts-Escolano, Thabo Beeler",venue:"ECCV, 2024",images:[],links:[],blurb:"Text-guided avatar generation and editing, using a parametric NeRF with a constrained search space for fast, high-quality results."},{title:"Loc3Diff: Local Diffusion for 3D Human Head Synthesis and Editing",href:"https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/08166.pdf",authors:"Yushi Lan, Feitong Tan, Qiangeng Xu, Di Qiu, Kyle Genova, Zeng Huang, Sean Fanello, Rohit Pandey, Thomas Funkhouser, Chen Change Loy, Yinda Zhang",venue:"ECCV, 2024",images:[],links:[],blurb:"Generates photorealistic 3D heads by diffusing UV-anchored local tri-planes, giving semantic-aligned local control for head synthesis and editing."},{title:"CHOSEN: Contrastive Hypothesis Selection for Multi-View Depth Refinement",href:"https://crv.pubpub.org/pub/dl70yq4c",authors:"Di Qiu, Yinda Zhang, Thabo Beeler, Vladimir Tankovich, Christian Häne, Sean Fanello, Christoph Rhemann, Sergio Orts Escolano",venue:"CRV, 2025 · Best Paper",images:[],links:[{label:"arXiv",href:"https://arxiv.org/abs/2404.02225"}],blurb:"Iteratively re-samples and selects the best depth hypotheses with contrastive learning; drops into any multi-view stereo pipeline."},{title:"MonoAvatar: Learning Personalized High Quality Volumetric Head Avatars from Monocular RGB Videos",href:"https://arxiv.org/abs/2304.01436",authors:"Ziqian Bai, Feitong Tan, Zeng Huang, Kripasindhu Sarkar, Danhang Tang, Di Qiu, Abhimitra Meka, Ruofei Du, Mingsong Dou, Sergio Orts-Escolano, Rohit Pandey, Ping Tan, Thabo Beeler, Sean Fanello, Yinda Zhang",venue:"CVPR, 2023",images:["images/pub/mono_avatar/mono_avatar.gif"],links:[{label:"project",href:"https://augmentedperception.github.io/monoavatar"}],blurb:"Builds an animatable 3D head avatar from monocular video, using a parametric head model equipped with learnable features."},{title:"Modal Uncertainty Estimation via Discrete Latent Representation",href:"https://arxiv.org/abs/2007.12858",authors:"Di Qiu, Lok Ming Lui",venue:"MICCAI UNSURE workshop, 2021",images:["images/pub/modal_uncertainty/1.png"],links:[{label:"code",href:"https://github.com/sylqiu/MUE"}],blurb:"Estimates the modal uncertainty of one-to-many mappings with a conditional variational auto-encoding framework over discrete latent modes."},{title:"Guided Collaborative Training for Pixel-wise Semi-Supervised Learning",href:"https://arxiv.org/abs/2008.05258",authors:"Zhanghan Ke, Di Qiu, Kaican Li, Qiong Yan, Rynson W. H. Lau",venue:"ECCV, 2020",images:[],links:[],blurb:"An ensemble of networks that learn from each other through a flaw-detection module; state-of-the-art pixel-wise semi-supervised segmentation, denoising and enhancement."},{title:"Towards Geometry Guided Neural Relighting with Flash Photography",authors:"Di Qiu, Jin Zeng, Zhanghan Ke, Wenxiu Sun, Chengxi Yang",venue:"3DV, 2020",images:["images/pub/relight/1.png","images/pub/relight/2.png"],links:[],blurb:"Directional relighting from a single co-located flash image and its depth map."},{title:"Inconsistent Surface Registration via Optimization of Mapping Distortions",href:"https://arxiv.org/abs/1908.09098",authors:"Di Qiu, Lok Ming Lui",venue:"Journal of Scientific Computing, 2020",images:["images/pub/incon_shape/1.png","images/pub/incon_shape/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/incon_reg"}],blurb:"Simultaneously finding the domain of correspondence and the registration by optimizing distortions in the mapping differential."},{title:"Adapting Object Detectors with Conditional Domain Normalization",href:"https://arxiv.org/abs/2003.07071",authors:"Peng Su, Kun Wang, Xingyu Zeng, Shixiang Tang, Dapeng Chen, Di Qiu, Xiaogang Wang",venue:"ECCV, 2020",images:[],links:[],blurb:"Aligns mini-batch feature statistics across domains for domain adaptation in object detection and segmentation."},{title:"Shape Analysis via Inconsistent Surface Registration",href:"https://arxiv.org/abs/2003.01357",authors:"Gary P. T. Choi, Di Qiu, Lok Ming Lui",venue:"Proceedings of the Royal Society A, 2020",images:[],links:[],blurb:"Inconsistent surface registration applied to shape analysis in tooth morphology."},{title:"Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules",href:"http://arxiv.org/abs/1909.07623",authors:"Di Qiu, Jiahao Pang, Chengxi Yang, Wenxiu Sun",venue:"ICCV, 2019 · Best Poster Award, HK Computer Vision Workshop",images:["images/pub/tof_align_refine/1.png","images/pub/tof_align_refine/2.png"],links:[{label:"code & dataset",href:"https://github.com/sylqiu/tof_rgbd_processing"}],blurb:"Cross-modal flow estimation and Time-of-Flight depth refinement using deep learning, with a physically accurate synthetic dataset."},{title:"Computing Quasiconformal Folds",href:"https://arxiv.org/abs/1804.03936",authors:"Di Qiu, Ka Chun Lam, Lok Ming Lui",venue:"SIAM Journal on Imaging Sciences, 2019",images:["images/pub/fold_map/1.png","images/pub/fold_map/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/Least-square-beltrami-solver"}],blurb:"Computing folding and unfolding maps via a generalized form of quasiconformal mapping and crease geometry inference."}];function F(t){const e=G.name;return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").split(", ").map(i=>i.trim()===e?`<strong>${i.trim()}</strong>`:i.trim()).join(", ")}const v=[{id:"flash-attention",category:"LLM foundation",title:"Why and how FlashAttention works",blurb:"We will see why the memory and communication cost of the naive implementation is high, and how efficient implementation like FlashAttention solves that.",scene:"flash-attention"},{id:"kv-cache",category:"LLM foundation",title:"Why and how KV cache works in an autoregressive LLM",blurb:"We will see why only KV of the dialog history is needed, and how to efficiently manage them in HBM",scene:"kv-cache"}],g=document.getElementById("app"),Q=document.getElementById("topnav");let $=[];const j=new Map,I=new Map,A=new Set(JSON.parse(localStorage.getItem("exploreflow:progress")||"[]")),n=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),E=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");function ee(){localStorage.setItem("exploreflow:progress",JSON.stringify([...A]))}async function _(t){const e=await fetch(t);return e.ok?await e.json():null}const te=[{href:"#/",label:"Home",nav:"#/"}];function ae(){Q.innerHTML=te.map(t=>`<a href="${t.href}" data-nav="${t.nav}">${n(t.label)}</a>`).join("")}function se(t){const e=t.split("?")[0]||"#/";Q.querySelectorAll("a[data-nav]").forEach(s=>{const i=s.dataset.nav||"#/",a=i==="#/"?e==="#/":e===i||e.startsWith(i+"/");s.classList.toggle("active",a)})}function ne(){const t=[{label:"Curriculum Vitae",href:"#/cv"},{label:"Interactive Illustrations",href:"#/illustrations"},{label:"Writing",href:"#/blog"}].sort((e,s)=>e.label.localeCompare(s.label)).map(e=>`<a href="${n(e.href)}">${n(e.label)}</a>`).join("");g.innerHTML=`
    <section class="landing">
      <nav class="landing-nav">${t}</nav>
    </section>
  `}let R=null,O="";const P=6;function J(t,e,s,i="← Prev",a="Next →",o={}){if(e<=1)return"";const r=c=>`${s}?${new URLSearchParams({...o,page:String(c)}).toString()}`,l=Array.from({length:e},(c,m)=>m+1).map(c=>c===t?`<span class="pager-num is-current" aria-current="page">${c}</span>`:`<a class="pager-num" href="${r(c)}">${c}</a>`).join(""),p=t>1?`<a class="pager-step" href="${r(t-1)}">${i}</a>`:`<span class="pager-step is-disabled">${i}</span>`,u=t<e?`<a class="pager-step" href="${r(t+1)}">${a}</a>`:`<span class="pager-step is-disabled">${a}</span>`;return`<nav class="pager" aria-label="Pagination">${p}<span class="pager-nums">${l}</span>${u}</nav>`}function ie(t=1,e=""){const s=Array.from(new Set(v.map(h=>h.category).filter(Boolean))),i=new Map(s.map(h=>[h,v.filter(b=>b.category===h).length])),a=s.find(h=>E(h)===e)||"",o=a?v.filter(h=>h.category===a):v,r=Math.max(1,Math.ceil(o.length/P)),l=Math.min(Math.max(1,t),r),u=o.slice((l-1)*P,l*P).map(h=>`<a class="ill-card-link" href="#/illustrations/${n(h.id)}">
        <h2>${n(h.title)}</h2>
        <p>${n(h.blurb)}</p>
        <span class="ill-open">Open →</span>
      </a>`).join(""),c=[`<a class="blog-cat-link${a?"":" is-active"}" href="#/illustrations">All<span>${v.length}</span></a>`,...s.map(h=>{const b=E(h);return`<a class="blog-cat-link${a===h?" is-active":""}" href="#/illustrations?category=${b}">${n(h)}<span>${i.get(h)}</span></a>`})].join(""),m=r>1?` · page ${l} of ${r}`:"",y=a?`${o.length} illustrations in ${a}${m}.`:`${v.length} illustrations${m}.`;g.innerHTML=`<article class="page">
    <header>
      <h1>Interactive Illustrations</h1>
      <p class="reading">Small, self-contained pictures of ideas I keep re-deriving. Each one has
      its own page and is meant to be played with.</p>
      <p class="reading">${y}</p>
    </header>
    <div class="blog-layout">
      <aside class="blog-side">
        <div class="blog-side-title">Topics</div>
        <nav class="blog-cats" aria-label="Topics">${c}</nav>
      </aside>
      <div class="blog-main">
        <nav class="ill-index">${u||'<p class="dim">Nothing here yet.</p>'}</nav>
        ${J(l,r,"#/illustrations","← Prev","Next →",a?{category:e}:{})}
      </div>
    </div>
  </article>`}async function oe(t){const e=v.find(a=>a.id===t);if(!e){g.innerHTML=`<article class="page">
      <header><h1>Not here</h1></header>
      <p>No illustration <code>${n(t)}</code>.</p>
      <p><a href="#/illustrations">← All illustrations</a></p>
    </article>`;return}g.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/illustrations">← All illustrations</a>
      <h1>${n(e.title)}</h1>
    </header>
    <div class="ill-canvas" id="ill-stage"></div>
  </article>`;const s=g.querySelector("#ill-stage");if(!s)return;const i=await V(e.scene,s,[]);if(!document.contains(s)){i?.destroy();return}R=i}function re(){const t=X.experience.map(s=>{const i=s.roles.map(a=>`<div class="cv-role">
          <span class="cv-title">${n(a.title)}</span>
          <span class="cv-when">${n(a.dates)}</span>
        </div>`).join("");return`<div class="cv-org">
        <h3 class="cv-org-name">${n(s.org)}${s.place?` <span class="cv-place">${n(s.place)}</span>`:""}</h3>
        ${i}
      </div>`}).join(""),e=D.map(s=>{const i=s.href?`<a href="${n(s.href)}" target="_blank" rel="noopener">${n(s.title)}</a>`:n(s.title),a=s.links.map(o=>`<a href="${n(o.href)}" target="_blank" rel="noopener">${n(o.label)}</a>`).join(" · ");return`<article class="pub">
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${F(s.authors)}</p>
          <p class="pub-venue"><em>${n(s.venue)}</em></p>
          ${a?`<p class="pub-links">${a}</p>`:""}
          <p class="pub-blurb">${n(s.blurb)}</p>
        </div>
      </article>`}).join("");g.innerHTML=`<article class="page cv">
    <header>
      <h1>${n(G.name)}</h1>
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

  </article>`}function le(){const t=[{href:"#/research",title:"Research",blurb:`${D.length} publications — graphics, vision, geometry.`},{href:"#/blog",title:"Writing",blurb:"Notes on analysis, geometry, and numerical methods."},{href:"#/courses",title:"Courses",blurb:$.length?`${$.length} interactive course${$.length===1?"":"s"} with live demos and narration.`:"Interactive courses with live demos and narration."}].map(e=>`<a class="door" href="${e.href}">
        <span class="door-title">${n(e.title)}</span>
        <span class="door-blurb">${n(e.blurb)}</span>
      </a>`).join("");g.innerHTML=`<article class="page">
    <header>
      <h1>${n(C.name)}</h1>
      <p class="reading">${n(C.tagline)}</p>
    </header>
    <div class="doors">${t}</div>
  </article>`}function ce(){const t=D.map(e=>{const s=e.images.map((r,l)=>`<img src="${n(r)}" alt="" class="${l===0?"pub-img primary":"pub-img secondary"}" loading="lazy" />`).join(""),i=e.href?`<a href="${n(e.href)}" target="_blank" rel="noopener">${n(e.title)}</a>`:n(e.title),a=e.links.map(r=>`<a href="${n(r.href)}" target="_blank" rel="noopener">[${n(r.label)}]</a>`).join(" ");return`<article class="pub">
        ${e.images.length?`<div class="pub-media${e.images.length>1?" swap":""}">${s}</div>`:""}
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${F(e.authors)}</p>
          <p class="pub-venue"><em>${n(e.venue)}</em></p>
          ${a?`<p class="pub-links">${a}</p>`:""}
          <p class="pub-blurb">${n(e.blurb)}</p>
        </div>
      </article>`}).join("");g.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Research</h1>
      <p class="reading">Selected publications. Full list on
      <a href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar</a>.</p>
    </header>
    <div class="pubs">${t}</div>
  </article>`}function he(){if(!$.length){g.innerHTML=`<article class="page"><header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1></header>
      <p class="dim">No courses built yet.</p></article>`;return}const t=$.map(e=>{const s=e.modules.reduce((a,o)=>a+o.lessons.length,0),i=e.modules.flatMap(a=>a.lessons).filter(a=>A.has(a)).length;return`<a class="course-card" href="#/courses/${n(e.id)}">
        <span class="course-title">${n(e.title)}</span>
        ${e.subtitle?`<span class="course-sub">${n(e.subtitle)}</span>`:""}
        <span class="course-meta">${s} lesson${s===1?"":"s"}${i?` · ${i} done`:""}</span>
        <span class="door-arrow">→</span>
      </a>`}).join("");g.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1>
      <p class="reading">${n(C.blurb)}</p>
    </header>
    <div class="courses">${t}</div>
  </article>`}function ue(t){const e=$.find(i=>i.id===t);if(!e){g.innerHTML=`<article class="page"><header><h1>Not found</h1></header>
      <p>No course <code>${n(t)}</code>. <a href="#/courses">All courses</a></p></article>`;return}const s=e.modules.map(i=>`<section class="mod">
        <h2>${n(i.title)}</h2>
        ${i.lessons.length?`<ul>${i.lessons.map(a=>`<li><a href="#/lesson/${n(a)}">${n(a)}</a>${A.has(a)?' <span class="done">✓</span>':""}</li>`).join("")}</ul>`:'<p class="dim">Not written yet.</p>'}
      </section>`).join("");g.innerHTML=`<article class="page">
    <a class="back" href="#/courses">← ${n(C.name)}</a>
    <header><h1>${n(e.title)}</h1></header>
    ${e.subtitle?`<p class="sub">${n(e.subtitle)}</p>`:""}
    ${s}
  </article>`}async function de(t=1,e=""){const s=await _("./data/blog.json");if(!s){g.innerHTML='<article class="page"><header><h1>Writing</h1></header><p class="dim">Nothing built.</p></article>';return}const i=d=>{const f=`#/blog/${n(d.id)}`,S=(d.preview||[]).map(k=>`<p>${k}</p>`).join(""),M=(d.images||[]).map(k=>`<a class="post-thumb" href="${f}" title="${n(k.alt||"")}"><img src="${n(k.src)}" alt="${n(k.alt||"")}" loading="lazy" decoding="async"></a>`).join("");return`<li class="post">
        <div class="post-head">
          <a class="post-title" href="${f}">${n(d.title)}</a>
          <span class="post-date">${n(d.date)}</span>
        </div>
        ${S?`<div class="post-preview">${S}</div>`:""}
        ${M?`<div class="post-thumbs">${M}</div>`:""}
        <a class="post-more" href="${f}">Read →</a>
      </li>`},a=d=>{const f=T.find(S=>d.tags.some(M=>S.tags.includes(M)));return f?f.name:"Other"},o=new Map;for(const d of s){const f=a(d);o.set(f,(o.get(f)||0)+1)}const r=[...s].sort((d,f)=>d.date<f.date?1:-1),l=[...T.map(d=>d.name),"Other"].find(d=>E(d)===e)||"",p=l?r.filter(d=>a(d)===l):r,u=6,c=Math.max(1,Math.ceil(p.length/u)),m=Math.min(Math.max(1,t),c),y=p.slice((m-1)*u,m*u),h=[`<a class="blog-cat-link${l?"":" is-active"}" href="#/blog">All<span>${s.length}</span></a>`,...[...T.map(d=>d.name),"Other"].filter(d=>(o.get(d)||0)>0).map(d=>{const f=E(d);return`<a class="blog-cat-link${l===d?" is-active":""}" href="#/blog?category=${f}">${n(d)}<span>${o.get(d)}</span></a>`})].join(""),b=c>1?` · page ${m} of ${c}`:"",w=l?`${p.length} notes in ${l}, newest first${b}.`:`${s.length} notes, newest first${b}.`;g.innerHTML=`<article class="page">
    <header>
      <h1>Writing</h1>
      <p class="reading">${w}</p>
    </header>
    <div class="blog-layout">
      <aside class="blog-side">
        <div class="blog-side-title">Topics</div>
        <nav class="blog-cats" aria-label="Topics">${h}</nav>
      </aside>
      <div class="blog-main">
        <ul class="post-list">${y.map(i).join("")}</ul>
        ${p.length?"":'<p class="dim">No posts in this topic.</p>'}
        ${J(m,c,"#/blog","← Newer","Older →",l?{category:e}:{})}
      </div>
    </div>
  </article>`}async function pe(t){let e=I.get(t);if(!e){const s=await _(`./data/blog/${t}.json`);if(!s){g.innerHTML=`<article class="page"><header><h1>Not found</h1></header><p>No post <code>${n(t)}</code>.</p></article>`;return}e=s,I.set(t,e)}g.innerHTML=`<article class="post-view">
    <a class="back" href="#/blog">← All posts</a>
    <header>
      <h1>${n(e.title)}</h1>
      <div class="meta">${n(e.date)}</div>
      <p class="post-tags">${e.tags.map(s=>`<span>${n(s)}</span>`).join("")}</p>
    </header>
    <div class="prose">${e.html}</div>
    ${e.source?`<footer class="post-source">Originally posted at <a href="${n(e.source)}" target="_blank" rel="noopener">blogspot</a>.</footer>`:""}
  </article>`}function ge(t){const e=t.title?`<div class="box-title">${t.title}</div>`:"";return`<section class="box box-${t.box}">${e}<div class="box-body">${t.html}</div></section>`}function me(t){const e=t.check.options.map((s,i)=>`<button class="opt" data-correct="${s.correct}" data-i="${i}">
          <span class="opt-mark"></span><span>${s.text}</span></button>`).join("");return`<section class="check" data-qid="${n(t.check.qid)}">
    <div class="check-q">${t.check.question}</div>
    <div class="check-opts">${e}</div>
    <div class="check-exp" hidden>${t.check.explanation}</div>
  </section>`}function fe(t){const e=t.beats.map((s,i)=>`<button class="beat" data-beat="${i}"><span class="beat-n">${i+1}</span>${n(s.text)}</button>`).join("");return`<section class="sceneblock" data-scene="${n(t.id)}" style="--scene-h:${t.height}px">
    <div class="scene-head">
      <span class="scene-id">${n(t.id)}</span>
      ${t.title?`<span class="scene-title">${n(t.title)}</span>`:""}
      <div class="scene-ctl">
        <button class="btn play" type="button">Play</button>
        <button class="btn reset" type="button">Reset</button>
      </div>
    </div>
    <div class="scene-canvas"></div>
    <div class="beats">${e||'<span class="dim">No narration beats.</span>'}</div>
  </section>`}function be(t){return t.blocks.map(e=>{switch(e.kind){case"md":return`<div class="prose">${e.html}</div>`;case"box":return ge(e);case"scene":return fe(e);case"check":return me(e)}}).join("")}const N=new Map;async function ve(t,e,s){const i=t.querySelector(".scene-canvas"),a=[...t.querySelectorAll(".beat")],o=t.querySelector(".play"),r=t.querySelector(".reset"),l=s.audio?new Audio(`./media/${s.audio}`):null;l&&(l.preload="auto");const p=await V(e.id,i,e.beats.map(c=>c.text)),u=new Y({beats:e.beats,audio:l,onBeat:c=>{a.forEach((m,y)=>m.classList.toggle("active",y===c)),a[c]?.scrollIntoView({block:"nearest",behavior:"smooth"}),o.textContent=c>=e.beats.length-1?"Replay":"Playing…"},onSceneBeat:c=>p?.play?.(c)});N.set(t,{host:p,narration:u}),o.addEventListener("click",()=>{u.stop(),l?.pause(),l&&(l.currentTime=0,l.play()),u.start()}),r.addEventListener("click",()=>{u.stop(),l?.pause(),p?.reset?.(),a.forEach(c=>c.classList.remove("active")),o.textContent="Play"}),a.forEach(c=>c.addEventListener("click",()=>{l?.pause(),u.goto(Number(c.dataset.beat))}))}async function $e(t){let e=j.get(t);if(!e){const a=await _(`./data/lessons/${t}.json`);if(!a){g.innerHTML=`<article class="page"><header><h1>Not built yet</h1></header>
        <p>No lesson <code>${n(t)}</code>.</p>
        <p>Add <code>content/courses/&lt;course&gt;/**/${n(t)}.md</code>, set <code>publish: true</code>, then run <code>npm run build:lessons</code>.</p></article>`;return}e=a,j.set(t,e)}const s=e.reading?`<p class="reading">Reading: ${e.reading.url?`<a href="${n(e.reading.url)}" target="_blank" rel="noopener">${n(e.reading.text)}</a>`:n(e.reading.text)}</p>`:"",i=e.courseId?`<a class="back" href="#/courses/${n(e.courseId)}">← Course</a>`:"";g.innerHTML=`<article class="lesson">
    <header>
      ${i}
      <h1>${n(e.title)}</h1>
      <div class="meta">${n(e.module)} · ${n(e.kind)}</div>
      ${s}
    </header>
    ${be(e)}
  </article>`;for(const a of e.blocks){if(a.kind!=="scene")continue;const o=g.querySelector(`[data-scene="${a.id}"]`);o&&await ve(o,a,e)}for(const a of g.querySelectorAll(".check"))a.addEventListener("click",o=>{const r=o.target.closest(".opt");if(!r||r.disabled)return;const l=r.dataset.correct==="true";r.classList.add(l?"ok":"bad"),a.querySelectorAll(".opt").forEach(p=>{p.dataset.correct==="true"&&p.classList.add("ok"),p.disabled=!0}),a.querySelector(".check-exp").hidden=!1,l&&(A.add(t),ee())})}function ye(){for(const[t,e]of N)try{e.narration.stop(),e.host?.destroy(),t.replaceWith(t.cloneNode(!1))}catch(s){console.warn("scene teardown failed",s)}N.clear();try{R?.destroy()}catch(t){console.warn("illustration teardown failed",t)}finally{R=null}}function x(){const t=location.hash||"#/",[e,s]=t.split("?"),i=new URLSearchParams(s||""),a=Math.max(1,Number(i.get("page"))||1),o=i.get("category")||"";if(window.scrollTo(0,0),t===O)return;O=t,ye(),se(t);const r=e.match(/^#\/blog\/(.+)$/);if(r)return void pe(r[1]);const l=e.match(/^#\/lesson\/(.+)$/);if(l)return void $e(l[1]);const p=e.match(/^#\/courses\/(.+)$/);if(p)return void ue(p[1]);if(e.startsWith("#/exploreflow"))return void le();if(e.startsWith("#/cv"))return void re();const u=e.match(/^#\/illustrations\/(.+)$/);if(u)return void oe(u[1]);if(e.startsWith("#/illustrations"))return void ie(a,o);if(e.startsWith("#/blog"))return void de(a,o);if(e.startsWith("#/courses"))return void he();if(e.startsWith("#/research"))return void ce();ne(),window.scrollTo(0,0)}async function we(){$=await _("./data/courses.json")||[],ae(),document.addEventListener("click",t=>{const e=t.target?.closest('a[href^="#/"]');if(!e)return;const s=e.getAttribute("href");s&&(t.preventDefault(),location.hash===s||(location.hash=s),x())}),window.addEventListener("hashchange",x),x()}we();
