(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const J="modulepreload",K=function(t,e){return new URL(t,e).href},N={},k=function(e,a,i){let s=Promise.resolve();if(a&&a.length>0){const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");s=Promise.allSettled(a.map(u=>{if(u=K(u,i),u in N)return;N[u]=!0;const c=u.endsWith(".css"),m=c?'[rel="stylesheet"]':"";if(!!i)for(let v=o.length-1;v>=0;v--){const $=o[v];if($.href===u&&(!c||$.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${m}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":J,c||(f.as="script"),f.crossOrigin="",f.href=u,d&&f.setAttribute("nonce",d),document.head.appendChild(f),c)return new Promise((v,$)=>{f.addEventListener("load",v),f.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return s.then(o=>{for(const l of o||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},O={"hybrid-chain":()=>k(()=>import("./hybrid-chain-D5ew_OCj.js"),[],import.meta.url),"stat-vs-comp":()=>k(()=>import("./stat-vs-comp-DpDT9Loh.js"),[],import.meta.url),"prg-stretch":()=>k(()=>import("./prg-stretch-DHhopNnX.js"),[],import.meta.url),"kv-cache":()=>k(()=>import("./kv-cache-D-PuUmnV.js"),[],import.meta.url),"flash-attention":()=>k(()=>import("./flash-attention-yZGrR3f5.js"),[],import.meta.url)};function Z(){return Object.keys(O)}async function q(t,e,a){const i=O[t];return i?(await i()).default(e,{beats:a}):(e.innerHTML=`<div class="scene-missing">Unknown scene <code>${t}</code>.<br>
      Known: ${Z().map(r=>`<code>${r}</code>`).join(", ")}</div>`,null)}const z=380,V=2400;function H(t){const e=t.trim().split(/\s+/).filter(Boolean).length;return Math.max(V,Math.round(e*z))}class Y{constructor(e){this.opts=e;const a=this.opts.audio?.duration,i=e.beats;if(this.opts.audio&&Number.isFinite(a)&&a&&i.length){const s=i.map(o=>o.seconds?o.seconds*1e3:H(o.text)),r=s.reduce((o,l)=>o+l,0);this.beatMs=s.map(o=>o/r*a*1e3)}else this.beatMs=i.map(s=>s.seconds?s.seconds*1e3:H(s.text))}index=-1;timer=null;stopped=!1;beatMs;start(){this.index=-1,this.stopped=!1,this.advance()}stop(){this.stopped=!0,this.timer!==null&&clearTimeout(this.timer),this.timer=null}goto(e){this.stopped||(this.timer!==null&&clearTimeout(this.timer),this.setBeat(e),this.schedule())}advance(){this.stopped||(this.setBeat(this.index+1),this.schedule())}schedule(){if(this.stopped||this.index>=this.opts.beats.length-1)return;const e=this.beatMs[this.index]??V;this.timer=window.setTimeout(()=>this.advance(),e)}setBeat(e){e!==this.index&&(this.index=e,this.opts.onBeat(e,this.opts.beats.length),this.opts.onSceneBeat?.(e))}get current(){return this.index}}const G={name:"Di Qiu"},C={name:"ExploreFlow",tagline:"Interactive courses — visual, explorable, and steppable line by line.",blurb:"Each course pairs prose with live demos you can drag and step through, narrated beat by beat. No video: everything runs in the page."},X={experience:[{org:"Google XR",place:"",roles:[{title:"Software Developer (Canada)",dates:"Apr 2022 - present"},{title:"Research Intern → Student Researcher (remote)",dates:"Sep 2020 - Sep 2021"}]},{org:"SenseTime Research",place:"Hong Kong",roles:[{title:"Research Intern · Intern Star award",dates:"Jul 2018 - Aug 2019"}]}]},T=[{name:"Vision & Graphics",tags:["computer vision","computer graphics","imaging","machine learning"]},{name:"Numerical Methods & Optimization",tags:["cuhk.math3310","teaching","numerical methods","optimization"]},{name:"Analysis & PDE",tags:["real analysis","measure theory","functional analysis","harmonic analysis","Fourier analysis","PDE","elliptic theory"]},{name:"Geometry & Topology",tags:["differential geometry","discrete conformal geometry","algebraic topology","complex analysis"]},{name:"Algebra",tags:["algebra","linear algebra"]},{name:"Probability",tags:["probability theory","stochastic differential equation","statistical physics"]}],D=[{title:"GNM Head: A Generative aNthropometric Model of the Human Head",href:"https://arxiv.org/abs/2607.23687",authors:"Stylianos Ploumpis, Jan Bednarik, Gaspard Zoss, Ruslan Guseinov, Luca Prasso, Prashanth Chandran, Oliver Boyne, Vasileios Choutas, Timo Bolkart, Daoye Wang, Menglei Chai, Di Qiu, Sebastian Winberg, Gilles Rainer, Lewis Bridgeman, Leonhard Helminger, Edo Collins, Delio Vicini, Jérémy Riviere, Yannick Boetzel, Alexander Koumis, Stylianos Moschoglou, Jay Busch, Cynthia Herrera, Jacob Still, Scott Ysebert, Peter Lincoln, Sergio Orts Escolano, Christoph Rhemann, Erroll Wood, Thabo Beeler, Stefanos Zafeiriou",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"A publicly released parametric model of the human head - face, neck, eyeballs, teeth and tongue - for animation, rendering, and as conditioning for generative models."},{title:"Concurrent Image Understanding and Generation: Self-Correcting Coupled Markov Jump Processes",href:"https://arxiv.org/abs/2607.13188",authors:"Minh-Quan Le, Armand Comas, Alexandros Lattas, Stylianos Moschoglou, Pedro Vélez, Amit Raj, Aaron Germuth, Thabo Beeler, Dimitris Samaras, Di Qiu",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"Joint multimodal sampling where each modality's transition rates follow the other's confidence, with a remasking jump that retracts cross-modal contradictions."},{title:"MagicMirror: Fast and High-Quality Avatar Generation with a Constrained Search Space",href:"https://arxiv.org/abs/2404.01296",authors:"Armand Comas-Massagué, Di Qiu, Menglei Chai, Marcel Bühler, Amit Raj, Ruiqi Gao, Qiangeng Xu, Mark Matthews, Paulo Gotardo, Octavia Camps, Sergio Orts-Escolano, Thabo Beeler",venue:"ECCV, 2024",images:[],links:[],blurb:"Text-guided avatar generation and editing, using a parametric NeRF with a constrained search space for fast, high-quality results."},{title:"Loc3Diff: Local Diffusion for 3D Human Head Synthesis and Editing",href:"https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/08166.pdf",authors:"Yushi Lan, Feitong Tan, Qiangeng Xu, Di Qiu, Kyle Genova, Zeng Huang, Sean Fanello, Rohit Pandey, Thomas Funkhouser, Chen Change Loy, Yinda Zhang",venue:"ECCV, 2024",images:[],links:[],blurb:"Generates photorealistic 3D heads by diffusing UV-anchored local tri-planes, giving semantic-aligned local control for head synthesis and editing."},{title:"CHOSEN: Contrastive Hypothesis Selection for Multi-View Depth Refinement",href:"https://crv.pubpub.org/pub/dl70yq4c",authors:"Di Qiu, Yinda Zhang, Thabo Beeler, Vladimir Tankovich, Christian Häne, Sean Fanello, Christoph Rhemann, Sergio Orts Escolano",venue:"CRV, 2025 · Best Paper",images:[],links:[{label:"arXiv",href:"https://arxiv.org/abs/2404.02225"}],blurb:"Iteratively re-samples and selects the best depth hypotheses with contrastive learning; drops into any multi-view stereo pipeline."},{title:"MonoAvatar: Learning Personalized High Quality Volumetric Head Avatars from Monocular RGB Videos",href:"https://arxiv.org/abs/2304.01436",authors:"Ziqian Bai, Feitong Tan, Zeng Huang, Kripasindhu Sarkar, Danhang Tang, Di Qiu, Abhimitra Meka, Ruofei Du, Mingsong Dou, Sergio Orts-Escolano, Rohit Pandey, Ping Tan, Thabo Beeler, Sean Fanello, Yinda Zhang",venue:"CVPR, 2023",images:["images/pub/mono_avatar/mono_avatar.gif"],links:[{label:"project",href:"https://augmentedperception.github.io/monoavatar"}],blurb:"Builds an animatable 3D head avatar from monocular video, using a parametric head model equipped with learnable features."},{title:"Modal Uncertainty Estimation via Discrete Latent Representation",href:"https://arxiv.org/abs/2007.12858",authors:"Di Qiu, Lok Ming Lui",venue:"MICCAI UNSURE workshop, 2021",images:["images/pub/modal_uncertainty/1.png"],links:[{label:"code",href:"https://github.com/sylqiu/MUE"}],blurb:"Estimates the modal uncertainty of one-to-many mappings with a conditional variational auto-encoding framework over discrete latent modes."},{title:"Guided Collaborative Training for Pixel-wise Semi-Supervised Learning",href:"https://arxiv.org/abs/2008.05258",authors:"Zhanghan Ke, Di Qiu, Kaican Li, Qiong Yan, Rynson W. H. Lau",venue:"ECCV, 2020",images:[],links:[],blurb:"An ensemble of networks that learn from each other through a flaw-detection module; state-of-the-art pixel-wise semi-supervised segmentation, denoising and enhancement."},{title:"Towards Geometry Guided Neural Relighting with Flash Photography",authors:"Di Qiu, Jin Zeng, Zhanghan Ke, Wenxiu Sun, Chengxi Yang",venue:"3DV, 2020",images:["images/pub/relight/1.png","images/pub/relight/2.png"],links:[],blurb:"Directional relighting from a single co-located flash image and its depth map."},{title:"Inconsistent Surface Registration via Optimization of Mapping Distortions",href:"https://arxiv.org/abs/1908.09098",authors:"Di Qiu, Lok Ming Lui",venue:"Journal of Scientific Computing, 2020",images:["images/pub/incon_shape/1.png","images/pub/incon_shape/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/incon_reg"}],blurb:"Simultaneously finding the domain of correspondence and the registration by optimizing distortions in the mapping differential."},{title:"Adapting Object Detectors with Conditional Domain Normalization",href:"https://arxiv.org/abs/2003.07071",authors:"Peng Su, Kun Wang, Xingyu Zeng, Shixiang Tang, Dapeng Chen, Di Qiu, Xiaogang Wang",venue:"ECCV, 2020",images:[],links:[],blurb:"Aligns mini-batch feature statistics across domains for domain adaptation in object detection and segmentation."},{title:"Shape Analysis via Inconsistent Surface Registration",href:"https://arxiv.org/abs/2003.01357",authors:"Gary P. T. Choi, Di Qiu, Lok Ming Lui",venue:"Proceedings of the Royal Society A, 2020",images:[],links:[],blurb:"Inconsistent surface registration applied to shape analysis in tooth morphology."},{title:"Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules",href:"http://arxiv.org/abs/1909.07623",authors:"Di Qiu, Jiahao Pang, Chengxi Yang, Wenxiu Sun",venue:"ICCV, 2019 · Best Poster Award, HK Computer Vision Workshop",images:["images/pub/tof_align_refine/1.png","images/pub/tof_align_refine/2.png"],links:[{label:"code & dataset",href:"https://github.com/sylqiu/tof_rgbd_processing"}],blurb:"Cross-modal flow estimation and Time-of-Flight depth refinement using deep learning, with a physically accurate synthetic dataset."},{title:"Computing Quasiconformal Folds",href:"https://arxiv.org/abs/1804.03936",authors:"Di Qiu, Ka Chun Lam, Lok Ming Lui",venue:"SIAM Journal on Imaging Sciences, 2019",images:["images/pub/fold_map/1.png","images/pub/fold_map/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/Least-square-beltrami-solver"}],blurb:"Computing folding and unfolding maps via a generalized form of quasiconformal mapping and crease geometry inference."}];function F(t){const e=G.name;return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").split(", ").map(i=>i.trim()===e?`<strong>${i.trim()}</strong>`:i.trim()).join(", ")}const x=[{id:"flash-attention",title:"FlashAttention: From Attention to Kernels",blurb:"Attention by definition, the GPU and TPU memory hierarchies, tiling and online softmax with a focus on data movement, the variant landscape, and kernel code for PyTorch, CUDA, Triton, and TPU/Pallas.",scene:"flash-attention"},{id:"kv-cache",title:"How KV cache works in an autoregressive LLM",blurb:"From one transformer layer to prefill and decode: what a position computes for itself, the step where it reads its past, and how serving systems store, share, and schedule that past — paged blocks, copy-on-write, RadixAttention, disaggregated prefill/decode, and pseudocode linked to vLLM, SGLang, and TensorRT-LLM.",scene:"kv-cache"}],p=document.getElementById("app"),W=document.getElementById("topnav");let y=[];const B=new Map,j=new Map,E=new Set(JSON.parse(localStorage.getItem("exploreflow:progress")||"[]")),n=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function ee(){localStorage.setItem("exploreflow:progress",JSON.stringify([...E]))}async function A(t){const e=await fetch(t);return e.ok?await e.json():null}const te=[{href:"#/",label:"Home",nav:"#/"}];function ae(){W.innerHTML=te.map(t=>`<a href="${t.href}" data-nav="${t.nav}">${n(t.label)}</a>`).join("")}function se(t){const e=t.split("?")[0]||"#/";W.querySelectorAll("a[data-nav]").forEach(a=>{const i=a.dataset.nav||"#/",s=i==="#/"?e==="#/":e===i||e.startsWith(i+"/");a.classList.toggle("active",s)})}function ne(){const t=[{label:"Curriculum Vitae",href:"#/cv"},{label:"Interactive Illustrations",href:"#/illustrations"},{label:"Writing",href:"#/blog"}].sort((e,a)=>e.label.localeCompare(a.label)).map(e=>`<a href="${n(e.href)}">${n(e.label)}</a>`).join("");p.innerHTML=`
    <section class="landing">
      <nav class="landing-nav">${t}</nav>
    </section>
  `}let _=null,I="";const P=6;function Q(t,e,a,i="← Prev",s="Next →",r={}){if(e<=1)return"";const o=c=>`${a}?${new URLSearchParams({...r,page:String(c)}).toString()}`,l=Array.from({length:e},(c,m)=>m+1).map(c=>c===t?`<span class="pager-num is-current" aria-current="page">${c}</span>`:`<a class="pager-num" href="${o(c)}">${c}</a>`).join(""),d=t>1?`<a class="pager-step" href="${o(t-1)}">${i}</a>`:`<span class="pager-step is-disabled">${i}</span>`,u=t<e?`<a class="pager-step" href="${o(t+1)}">${s}</a>`:`<span class="pager-step is-disabled">${s}</span>`;return`<nav class="pager" aria-label="Pagination">${d}<span class="pager-nums">${l}</span>${u}</nav>`}function ie(t=1){const e=Math.max(1,Math.ceil(x.length/P)),a=Math.min(Math.max(1,t),e),s=x.slice((a-1)*P,a*P).map(l=>`<a class="ill-card-link" href="#/illustrations/${n(l.id)}">
        <h2>${n(l.title)}</h2>
        <p>${n(l.blurb)}</p>
        <span class="ill-open">Open →</span>
      </a>`).join(""),r=x.length,o=e>1?` · page ${a} of ${e}`:"";p.innerHTML=`<article class="page">
    <header>
      <h1>Interactive Illustrations</h1>
      <p class="reading">Small, self-contained pictures of ideas I keep re-deriving. Each one has
      its own page and is meant to be played with.${r?` ${r} illustrations${o}.`:""}</p>
    </header>
    <nav class="ill-index">${s||'<p class="dim">Nothing here yet.</p>'}</nav>
    ${Q(a,e,"#/illustrations")}
  </article>`}async function oe(t){const e=x.find(s=>s.id===t);if(!e){p.innerHTML=`<article class="page">
      <header><h1>Not here</h1></header>
      <p>No illustration <code>${n(t)}</code>.</p>
      <p><a href="#/illustrations">← All illustrations</a></p>
    </article>`;return}p.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/illustrations">← All illustrations</a>
      <h1>${n(e.title)}</h1>
    </header>
    <div class="ill-canvas" id="ill-stage"></div>
  </article>`;const a=p.querySelector("#ill-stage");if(!a)return;const i=await q(e.scene,a,[]);if(!document.contains(a)){i?.destroy();return}_=i}function re(){const t=X.experience.map(a=>{const i=a.roles.map(s=>`<div class="cv-role">
          <span class="cv-title">${n(s.title)}</span>
          <span class="cv-when">${n(s.dates)}</span>
        </div>`).join("");return`<div class="cv-org">
        <h3 class="cv-org-name">${n(a.org)}${a.place?` <span class="cv-place">${n(a.place)}</span>`:""}</h3>
        ${i}
      </div>`}).join(""),e=D.map(a=>{const i=a.href?`<a href="${n(a.href)}" target="_blank" rel="noopener">${n(a.title)}</a>`:n(a.title),s=a.links.map(r=>`<a href="${n(r.href)}" target="_blank" rel="noopener">${n(r.label)}</a>`).join(" · ");return`<article class="pub">
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${F(a.authors)}</p>
          <p class="pub-venue"><em>${n(a.venue)}</em></p>
          ${s?`<p class="pub-links">${s}</p>`:""}
          <p class="pub-blurb">${n(a.blurb)}</p>
        </div>
      </article>`}).join("");p.innerHTML=`<article class="page cv">
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

  </article>`}function le(){const t=[{href:"#/research",title:"Research",blurb:`${D.length} publications — graphics, vision, geometry.`},{href:"#/blog",title:"Writing",blurb:"Notes on analysis, geometry, and numerical methods."},{href:"#/courses",title:"Courses",blurb:y.length?`${y.length} interactive course${y.length===1?"":"s"} with live demos and narration.`:"Interactive courses with live demos and narration."}].map(e=>`<a class="door" href="${e.href}">
        <span class="door-title">${n(e.title)}</span>
        <span class="door-blurb">${n(e.blurb)}</span>
      </a>`).join("");p.innerHTML=`<article class="page">
    <header>
      <h1>${n(C.name)}</h1>
      <p class="reading">${n(C.tagline)}</p>
    </header>
    <div class="doors">${t}</div>
  </article>`}function ce(){const t=D.map(e=>{const a=e.images.map((o,l)=>`<img src="${n(o)}" alt="" class="${l===0?"pub-img primary":"pub-img secondary"}" loading="lazy" />`).join(""),i=e.href?`<a href="${n(e.href)}" target="_blank" rel="noopener">${n(e.title)}</a>`:n(e.title),s=e.links.map(o=>`<a href="${n(o.href)}" target="_blank" rel="noopener">[${n(o.label)}]</a>`).join(" ");return`<article class="pub">
        ${e.images.length?`<div class="pub-media${e.images.length>1?" swap":""}">${a}</div>`:""}
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${F(e.authors)}</p>
          <p class="pub-venue"><em>${n(e.venue)}</em></p>
          ${s?`<p class="pub-links">${s}</p>`:""}
          <p class="pub-blurb">${n(e.blurb)}</p>
        </div>
      </article>`}).join("");p.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Research</h1>
      <p class="reading">Selected publications. Full list on
      <a href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar</a>.</p>
    </header>
    <div class="pubs">${t}</div>
  </article>`}function he(){if(!y.length){p.innerHTML=`<article class="page"><header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1></header>
      <p class="dim">No courses built yet.</p></article>`;return}const t=y.map(e=>{const a=e.modules.reduce((s,r)=>s+r.lessons.length,0),i=e.modules.flatMap(s=>s.lessons).filter(s=>E.has(s)).length;return`<a class="course-card" href="#/courses/${n(e.id)}">
        <span class="course-title">${n(e.title)}</span>
        ${e.subtitle?`<span class="course-sub">${n(e.subtitle)}</span>`:""}
        <span class="course-meta">${a} lesson${a===1?"":"s"}${i?` · ${i} done`:""}</span>
        <span class="door-arrow">→</span>
      </a>`}).join("");p.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1>
      <p class="reading">${n(C.blurb)}</p>
    </header>
    <div class="courses">${t}</div>
  </article>`}function ue(t){const e=y.find(i=>i.id===t);if(!e){p.innerHTML=`<article class="page"><header><h1>Not found</h1></header>
      <p>No course <code>${n(t)}</code>. <a href="#/courses">All courses</a></p></article>`;return}const a=e.modules.map(i=>`<section class="mod">
        <h2>${n(i.title)}</h2>
        ${i.lessons.length?`<ul>${i.lessons.map(s=>`<li><a href="#/lesson/${n(s)}">${n(s)}</a>${E.has(s)?' <span class="done">✓</span>':""}</li>`).join("")}</ul>`:'<p class="dim">Not written yet.</p>'}
      </section>`).join("");p.innerHTML=`<article class="page">
    <a class="back" href="#/courses">← ${n(C.name)}</a>
    <header><h1>${n(e.title)}</h1></header>
    ${e.subtitle?`<p class="sub">${n(e.subtitle)}</p>`:""}
    ${a}
  </article>`}async function de(t=1,e=""){const a=await A("./data/blog.json");if(!a){p.innerHTML='<article class="page"><header><h1>Writing</h1></header><p class="dim">Nothing built.</p></article>';return}const i=h=>{const g=`#/blog/${n(h.id)}`,L=(h.preview||[]).map(w=>`<p>${w}</p>`).join(""),S=(h.images||[]).map(w=>`<a class="post-thumb" href="${g}" title="${n(w.alt||"")}"><img src="${n(w.src)}" alt="${n(w.alt||"")}" loading="lazy" decoding="async"></a>`).join("");return`<li class="post">
        <div class="post-head">
          <a class="post-title" href="${g}">${n(h.title)}</a>
          <span class="post-date">${n(h.date)}</span>
        </div>
        ${L?`<div class="post-preview">${L}</div>`:""}
        ${S?`<div class="post-thumbs">${S}</div>`:""}
        <a class="post-more" href="${g}">Read →</a>
      </li>`},s=h=>h.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),r=h=>{const g=T.find(L=>h.tags.some(S=>L.tags.includes(S)));return g?g.name:"Other"},o=new Map;for(const h of a){const g=r(h);o.set(g,(o.get(g)||0)+1)}const l=[...a].sort((h,g)=>h.date<g.date?1:-1),d=[...T.map(h=>h.name),"Other"].find(h=>s(h)===e)||"",u=d?l.filter(h=>r(h)===d):l,c=6,m=Math.max(1,Math.ceil(u.length/c)),b=Math.min(Math.max(1,t),m),f=u.slice((b-1)*c,b*c),v=[`<a class="blog-cat-link${d?"":" is-active"}" href="#/blog">All<span>${a.length}</span></a>`,...[...T.map(h=>h.name),"Other"].filter(h=>(o.get(h)||0)>0).map(h=>{const g=s(h);return`<a class="blog-cat-link${d===h?" is-active":""}" href="#/blog?category=${g}">${n(h)}<span>${o.get(h)}</span></a>`})].join(""),$=m>1?` · page ${b} of ${m}`:"",U=d?`${u.length} notes in ${d}, newest first${$}.`:`${a.length} notes, newest first${$}.`;p.innerHTML=`<article class="page">
    <header>
      <h1>Writing</h1>
      <p class="reading">${U}</p>
    </header>
    <div class="blog-layout">
      <aside class="blog-side">
        <div class="blog-side-title">Topics</div>
        <nav class="blog-cats" aria-label="Topics">${v}</nav>
      </aside>
      <div class="blog-main">
        <ul class="post-list">${f.map(i).join("")}</ul>
        ${u.length?"":'<p class="dim">No posts in this topic.</p>'}
        ${Q(b,m,"#/blog","← Newer","Older →",d?{category:e}:{})}
      </div>
    </div>
  </article>`}async function pe(t){let e=j.get(t);if(!e){const a=await A(`./data/blog/${t}.json`);if(!a){p.innerHTML=`<article class="page"><header><h1>Not found</h1></header><p>No post <code>${n(t)}</code>.</p></article>`;return}e=a,j.set(t,e)}p.innerHTML=`<article class="post-view">
    <a class="back" href="#/blog">← All posts</a>
    <header>
      <h1>${n(e.title)}</h1>
      <div class="meta">${n(e.date)}</div>
      <p class="post-tags">${e.tags.map(a=>`<span>${n(a)}</span>`).join("")}</p>
    </header>
    <div class="prose">${e.html}</div>
    ${e.source?`<footer class="post-source">Originally posted at <a href="${n(e.source)}" target="_blank" rel="noopener">blogspot</a>.</footer>`:""}
  </article>`}function ge(t){const e=t.title?`<div class="box-title">${t.title}</div>`:"";return`<section class="box box-${t.box}">${e}<div class="box-body">${t.html}</div></section>`}function me(t){const e=t.check.options.map((a,i)=>`<button class="opt" data-correct="${a.correct}" data-i="${i}">
          <span class="opt-mark"></span><span>${a.text}</span></button>`).join("");return`<section class="check" data-qid="${n(t.check.qid)}">
    <div class="check-q">${t.check.question}</div>
    <div class="check-opts">${e}</div>
    <div class="check-exp" hidden>${t.check.explanation}</div>
  </section>`}function fe(t){const e=t.beats.map((a,i)=>`<button class="beat" data-beat="${i}"><span class="beat-n">${i+1}</span>${n(a.text)}</button>`).join("");return`<section class="sceneblock" data-scene="${n(t.id)}" style="--scene-h:${t.height}px">
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
  </section>`}function be(t){return t.blocks.map(e=>{switch(e.kind){case"md":return`<div class="prose">${e.html}</div>`;case"box":return ge(e);case"scene":return fe(e);case"check":return me(e)}}).join("")}const R=new Map;async function ve(t,e,a){const i=t.querySelector(".scene-canvas"),s=[...t.querySelectorAll(".beat")],r=t.querySelector(".play"),o=t.querySelector(".reset"),l=a.audio?new Audio(`./media/${a.audio}`):null;l&&(l.preload="auto");const d=await q(e.id,i,e.beats.map(c=>c.text)),u=new Y({beats:e.beats,audio:l,onBeat:c=>{s.forEach((m,b)=>m.classList.toggle("active",b===c)),s[c]?.scrollIntoView({block:"nearest",behavior:"smooth"}),r.textContent=c>=e.beats.length-1?"Replay":"Playing…"},onSceneBeat:c=>d?.play?.(c)});R.set(t,{host:d,narration:u}),r.addEventListener("click",()=>{u.stop(),l?.pause(),l&&(l.currentTime=0,l.play()),u.start()}),o.addEventListener("click",()=>{u.stop(),l?.pause(),d?.reset?.(),s.forEach(c=>c.classList.remove("active")),r.textContent="Play"}),s.forEach(c=>c.addEventListener("click",()=>{l?.pause(),u.goto(Number(c.dataset.beat))}))}async function $e(t){let e=B.get(t);if(!e){const s=await A(`./data/lessons/${t}.json`);if(!s){p.innerHTML=`<article class="page"><header><h1>Not built yet</h1></header>
        <p>No lesson <code>${n(t)}</code>.</p>
        <p>Add <code>content/courses/&lt;course&gt;/**/${n(t)}.md</code>, set <code>publish: true</code>, then run <code>npm run build:lessons</code>.</p></article>`;return}e=s,B.set(t,e)}const a=e.reading?`<p class="reading">Reading: ${e.reading.url?`<a href="${n(e.reading.url)}" target="_blank" rel="noopener">${n(e.reading.text)}</a>`:n(e.reading.text)}</p>`:"",i=e.courseId?`<a class="back" href="#/courses/${n(e.courseId)}">← Course</a>`:"";p.innerHTML=`<article class="lesson">
    <header>
      ${i}
      <h1>${n(e.title)}</h1>
      <div class="meta">${n(e.module)} · ${n(e.kind)}</div>
      ${a}
    </header>
    ${be(e)}
  </article>`;for(const s of e.blocks){if(s.kind!=="scene")continue;const r=p.querySelector(`[data-scene="${s.id}"]`);r&&await ve(r,s,e)}for(const s of p.querySelectorAll(".check"))s.addEventListener("click",r=>{const o=r.target.closest(".opt");if(!o||o.disabled)return;const l=o.dataset.correct==="true";o.classList.add(l?"ok":"bad"),s.querySelectorAll(".opt").forEach(d=>{d.dataset.correct==="true"&&d.classList.add("ok"),d.disabled=!0}),s.querySelector(".check-exp").hidden=!1,l&&(E.add(t),ee())})}function ye(){for(const[t,e]of R)try{e.narration.stop(),e.host?.destroy(),t.replaceWith(t.cloneNode(!1))}catch(a){console.warn("scene teardown failed",a)}R.clear();try{_?.destroy()}catch(t){console.warn("illustration teardown failed",t)}finally{_=null}}function M(){const t=location.hash||"#/",[e,a]=t.split("?"),i=new URLSearchParams(a||""),s=Math.max(1,Number(i.get("page"))||1),r=i.get("category")||"";if(window.scrollTo(0,0),t===I)return;I=t,ye(),se(t);const o=e.match(/^#\/blog\/(.+)$/);if(o)return void pe(o[1]);const l=e.match(/^#\/lesson\/(.+)$/);if(l)return void $e(l[1]);const d=e.match(/^#\/courses\/(.+)$/);if(d)return void ue(d[1]);if(e.startsWith("#/exploreflow"))return void le();if(e.startsWith("#/cv"))return void re();const u=e.match(/^#\/illustrations\/(.+)$/);if(u)return void oe(u[1]);if(e.startsWith("#/illustrations"))return void ie(s);if(e.startsWith("#/blog"))return void de(s,r);if(e.startsWith("#/courses"))return void he();if(e.startsWith("#/research"))return void ce();ne(),window.scrollTo(0,0)}async function we(){y=await A("./data/courses.json")||[],ae(),document.addEventListener("click",t=>{const e=t.target?.closest('a[href^="#/"]');if(!e)return;const a=e.getAttribute("href");a&&(t.preventDefault(),location.hash===a||(location.hash=a),M())}),window.addEventListener("hashchange",M),M()}we();
