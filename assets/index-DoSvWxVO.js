(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const j="modulepreload",q=function(t,e){return new URL(t,e).href},C={},b=function(e,n,i){let a=Promise.resolve();if(n&&n.length>0){const r=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");a=Promise.allSettled(n.map(h=>{if(h=q(h,i),h in C)return;C[h]=!0;const u=h.endsWith(".css"),w=u?'[rel="stylesheet"]':"";if(!!i)for(let m=r.length-1;m>=0;m--){const f=r[m];if(f.href===h&&(!u||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${w}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":j,u||(p.as="script"),p.crossOrigin="",p.href=h,d&&p.setAttribute("nonce",d),document.head.appendChild(p),u)return new Promise((m,f)=>{p.addEventListener("load",m),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${h}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return a.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})},R={"hybrid-chain":()=>b(()=>import("./hybrid-chain-D5ew_OCj.js"),[],import.meta.url),"stat-vs-comp":()=>b(()=>import("./stat-vs-comp-DpDT9Loh.js"),[],import.meta.url),"prg-stretch":()=>b(()=>import("./prg-stretch-DHhopNnX.js"),[],import.meta.url),"kv-cache":()=>b(()=>import("./kv-cache-1Fh0J9Ol.js"),[],import.meta.url)};function V(){return Object.keys(R)}async function D(t,e,n){const i=R[t];return i?(await i()).default(e,{beats:n}):(e.innerHTML=`<div class="scene-missing">Unknown scene <code>${t}</code>.<br>
      Known: ${V().map(o=>`<code>${o}</code>`).join(", ")}</div>`,null)}const O=380,P=2400;function M(t){const e=t.trim().split(/\s+/).filter(Boolean).length;return Math.max(P,Math.round(e*O))}class G{constructor(e){this.opts=e;const n=this.opts.audio?.duration,i=e.beats;if(this.opts.audio&&Number.isFinite(n)&&n&&i.length){const a=i.map(r=>r.seconds?r.seconds*1e3:M(r.text)),o=a.reduce((r,l)=>r+l,0);this.beatMs=a.map(r=>r/o*n*1e3)}else this.beatMs=i.map(a=>a.seconds?a.seconds*1e3:M(a.text))}index=-1;timer=null;stopped=!1;beatMs;start(){this.index=-1,this.stopped=!1,this.advance()}stop(){this.stopped=!0,this.timer!==null&&clearTimeout(this.timer),this.timer=null}goto(e){this.stopped||(this.timer!==null&&clearTimeout(this.timer),this.setBeat(e),this.schedule())}advance(){this.stopped||(this.setBeat(this.index+1),this.schedule())}schedule(){if(this.stopped||this.index>=this.opts.beats.length-1)return;const e=this.beatMs[this.index]??P;this.timer=window.setTimeout(()=>this.advance(),e)}setBeat(e){e!==this.index&&(this.index=e,this.opts.onBeat(e,this.opts.beats.length),this.opts.onSceneBeat?.(e))}get current(){return this.index}}const H={name:"Di Qiu"},v={name:"ExploreFlow",tagline:"Interactive courses — visual, explorable, and steppable line by line.",blurb:"Each course pairs prose with live demos you can drag and step through, narrated beat by beat. No video: everything runs in the page."},F={experience:[{org:"Google XR",place:"",roles:[{title:"Software Developer (Canada)",dates:"Apr 2022 - present"},{title:"Research Intern → Student Researcher (remote)",dates:"Sep 2020 - Sep 2021"}]},{org:"SenseTime Research",place:"Hong Kong",roles:[{title:"Research Intern · Intern Star award",dates:"Jul 2018 - Aug 2019"}]}]},E=[{name:"Vision & Graphics",tags:["computer vision","computer graphics","imaging","machine learning"]},{name:"Numerical Methods & Optimization",tags:["cuhk.math3310","teaching","numerical methods","optimization"]},{name:"Analysis & PDE",tags:["real analysis","measure theory","functional analysis","harmonic analysis","Fourier analysis","PDE","elliptic theory"]},{name:"Geometry & Topology",tags:["differential geometry","discrete conformal geometry","algebraic topology","complex analysis"]},{name:"Algebra",tags:["algebra","linear algebra"]},{name:"Probability",tags:["probability theory","stochastic differential equation","statistical physics"]}],L=[{title:"GNM Head: A Generative aNthropometric Model of the Human Head",href:"https://arxiv.org/abs/2607.23687",authors:"Stylianos Ploumpis, Jan Bednarik, Gaspard Zoss, Ruslan Guseinov, Luca Prasso, Prashanth Chandran, Oliver Boyne, Vasileios Choutas, Timo Bolkart, Daoye Wang, Menglei Chai, Di Qiu, Sebastian Winberg, Gilles Rainer, Lewis Bridgeman, Leonhard Helminger, Edo Collins, Delio Vicini, Jérémy Riviere, Yannick Boetzel, Alexander Koumis, Stylianos Moschoglou, Jay Busch, Cynthia Herrera, Jacob Still, Scott Ysebert, Peter Lincoln, Sergio Orts Escolano, Christoph Rhemann, Erroll Wood, Thabo Beeler, Stefanos Zafeiriou",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"A publicly released parametric model of the human head - face, neck, eyeballs, teeth and tongue - for animation, rendering, and as conditioning for generative models."},{title:"Concurrent Image Understanding and Generation: Self-Correcting Coupled Markov Jump Processes",href:"https://arxiv.org/abs/2607.13188",authors:"Minh-Quan Le, Armand Comas, Alexandros Lattas, Stylianos Moschoglou, Pedro Vélez, Amit Raj, Aaron Germuth, Thabo Beeler, Dimitris Samaras, Di Qiu",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"Joint multimodal sampling where each modality's transition rates follow the other's confidence, with a remasking jump that retracts cross-modal contradictions."},{title:"MagicMirror: Fast and High-Quality Avatar Generation with a Constrained Search Space",href:"https://arxiv.org/abs/2404.01296",authors:"Armand Comas-Massagué, Di Qiu, Menglei Chai, Marcel Bühler, Amit Raj, Ruiqi Gao, Qiangeng Xu, Mark Matthews, Paulo Gotardo, Octavia Camps, Sergio Orts-Escolano, Thabo Beeler",venue:"ECCV, 2024",images:[],links:[],blurb:"Text-guided avatar generation and editing, using a parametric NeRF with a constrained search space for fast, high-quality results."},{title:"Loc3Diff: Local Diffusion for 3D Human Head Synthesis and Editing",href:"https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/08166.pdf",authors:"Yushi Lan, Feitong Tan, Qiangeng Xu, Di Qiu, Kyle Genova, Zeng Huang, Sean Fanello, Rohit Pandey, Thomas Funkhouser, Chen Change Loy, Yinda Zhang",venue:"ECCV, 2024",images:[],links:[],blurb:"Generates photorealistic 3D heads by diffusing UV-anchored local tri-planes, giving semantic-aligned local control for head synthesis and editing."},{title:"CHOSEN: Contrastive Hypothesis Selection for Multi-View Depth Refinement",href:"https://crv.pubpub.org/pub/dl70yq4c",authors:"Di Qiu, Yinda Zhang, Thabo Beeler, Vladimir Tankovich, Christian Häne, Sean Fanello, Christoph Rhemann, Sergio Orts Escolano",venue:"CRV, 2025 · Best Paper",images:[],links:[{label:"arXiv",href:"https://arxiv.org/abs/2404.02225"}],blurb:"Iteratively re-samples and selects the best depth hypotheses with contrastive learning; drops into any multi-view stereo pipeline."},{title:"MonoAvatar: Learning Personalized High Quality Volumetric Head Avatars from Monocular RGB Videos",href:"https://arxiv.org/abs/2304.01436",authors:"Ziqian Bai, Feitong Tan, Zeng Huang, Kripasindhu Sarkar, Danhang Tang, Di Qiu, Abhimitra Meka, Ruofei Du, Mingsong Dou, Sergio Orts-Escolano, Rohit Pandey, Ping Tan, Thabo Beeler, Sean Fanello, Yinda Zhang",venue:"CVPR, 2023",images:["images/pub/mono_avatar/mono_avatar.gif"],links:[{label:"project",href:"https://augmentedperception.github.io/monoavatar"}],blurb:"Builds an animatable 3D head avatar from monocular video, using a parametric head model equipped with learnable features."},{title:"Modal Uncertainty Estimation via Discrete Latent Representation",href:"https://arxiv.org/abs/2007.12858",authors:"Di Qiu, Lok Ming Lui",venue:"MICCAI UNSURE workshop, 2021",images:["images/pub/modal_uncertainty/1.png"],links:[{label:"code",href:"https://github.com/sylqiu/MUE"}],blurb:"Estimates the modal uncertainty of one-to-many mappings with a conditional variational auto-encoding framework over discrete latent modes."},{title:"Guided Collaborative Training for Pixel-wise Semi-Supervised Learning",href:"https://arxiv.org/abs/2008.05258",authors:"Zhanghan Ke, Di Qiu, Kaican Li, Qiong Yan, Rynson W. H. Lau",venue:"ECCV, 2020",images:[],links:[],blurb:"An ensemble of networks that learn from each other through a flaw-detection module; state-of-the-art pixel-wise semi-supervised segmentation, denoising and enhancement."},{title:"Towards Geometry Guided Neural Relighting with Flash Photography",authors:"Di Qiu, Jin Zeng, Zhanghan Ke, Wenxiu Sun, Chengxi Yang",venue:"3DV, 2020",images:["images/pub/relight/1.png","images/pub/relight/2.png"],links:[],blurb:"Directional relighting from a single co-located flash image and its depth map."},{title:"Inconsistent Surface Registration via Optimization of Mapping Distortions",href:"https://arxiv.org/abs/1908.09098",authors:"Di Qiu, Lok Ming Lui",venue:"Journal of Scientific Computing, 2020",images:["images/pub/incon_shape/1.png","images/pub/incon_shape/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/incon_reg"}],blurb:"Simultaneously finding the domain of correspondence and the registration by optimizing distortions in the mapping differential."},{title:"Adapting Object Detectors with Conditional Domain Normalization",href:"https://arxiv.org/abs/2003.07071",authors:"Peng Su, Kun Wang, Xingyu Zeng, Shixiang Tang, Dapeng Chen, Di Qiu, Xiaogang Wang",venue:"ECCV, 2020",images:[],links:[],blurb:"Aligns mini-batch feature statistics across domains for domain adaptation in object detection and segmentation."},{title:"Shape Analysis via Inconsistent Surface Registration",href:"https://arxiv.org/abs/2003.01357",authors:"Gary P. T. Choi, Di Qiu, Lok Ming Lui",venue:"Proceedings of the Royal Society A, 2020",images:[],links:[],blurb:"Inconsistent surface registration applied to shape analysis in tooth morphology."},{title:"Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules",href:"http://arxiv.org/abs/1909.07623",authors:"Di Qiu, Jiahao Pang, Chengxi Yang, Wenxiu Sun",venue:"ICCV, 2019 · Best Poster Award, HK Computer Vision Workshop",images:["images/pub/tof_align_refine/1.png","images/pub/tof_align_refine/2.png"],links:[{label:"code & dataset",href:"https://github.com/sylqiu/tof_rgbd_processing"}],blurb:"Cross-modal flow estimation and Time-of-Flight depth refinement using deep learning, with a physically accurate synthetic dataset."},{title:"Computing Quasiconformal Folds",href:"https://arxiv.org/abs/1804.03936",authors:"Di Qiu, Ka Chun Lam, Lok Ming Lui",venue:"SIAM Journal on Imaging Sciences, 2019",images:["images/pub/fold_map/1.png","images/pub/fold_map/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/Least-square-beltrami-solver"}],blurb:"Computing folding and unfolding maps via a generalized form of quasiconformal mapping and crease geometry inference."}];function N(t){const e=H.name;return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").split(", ").map(i=>i.trim()===e?`<strong>${i.trim()}</strong>`:i.trim()).join(", ")}const B=[{id:"kv-cache",title:"How KV cache works in an autoregressive LLM",blurb:"From one transformer layer to prefill and decode: what a position computes for itself, the step where it reads its past, and how serving systems store, share, and schedule that past — paged blocks, copy-on-write, RadixAttention, disaggregated prefill/decode, and pseudocode linked to vLLM, SGLang, and TensorRT-LLM.",scene:"kv-cache"}],c=document.getElementById("app"),I=document.getElementById("topnav");let g=[];const A=new Map,T=new Map,y=new Set(JSON.parse(localStorage.getItem("exploreflow:progress")||"[]")),s=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Q(){localStorage.setItem("exploreflow:progress",JSON.stringify([...y]))}async function $(t){const e=await fetch(t);return e.ok?await e.json():null}const W=[{href:"#/",label:"Home"}];function J(){I.innerHTML=W.map(t=>`<a href="${t.href}" data-nav="${t.href}">${s(t.label)}</a>`).join("")}function Z(t){const e=/^#\/(exploreflow|research|courses|blog|lesson)/.test(t);I.querySelectorAll("a[data-nav]").forEach(n=>{const i=n.dataset.nav;n.classList.toggle("active",e?i==="#/exploreflow":i==="#/")})}function K(){const t=[{label:"Curriculum Vitae",href:"#/cv"},{label:"Interactive Illustrations",href:"#/illustrations"},{label:"Writing",href:"#/blog"}].sort((e,n)=>e.label.localeCompare(n.label)).map(e=>`<a href="${s(e.href)}">${s(e.label)}</a>`).join("");c.innerHTML=`
    <section class="landing">
      <nav class="landing-nav">${t}</nav>
    </section>
  `}let k=null;function U(){const t=B.map(e=>`<a class="ill-card-link" href="#/illustrations/${s(e.id)}">
        <h2>${s(e.title)}</h2>
        <p>${s(e.blurb)}</p>
        <span class="ill-open">Open →</span>
      </a>`).join("");c.innerHTML=`<article class="page">
    <header>
      <h1>Interactive Illustrations</h1>
      <p class="reading">Small, self-contained pictures of ideas I keep re-deriving. Each one has
      its own page and is meant to be played with.</p>
    </header>
    <nav class="ill-index">${t||'<p class="dim">Nothing here yet.</p>'}</nav>
  </article>`}async function Y(t){const e=B.find(a=>a.id===t);if(!e){c.innerHTML=`<article class="page">
      <header><h1>Not here</h1></header>
      <p>No illustration <code>${s(t)}</code>.</p>
      <p><a href="#/illustrations">← All illustrations</a></p>
    </article>`;return}c.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/illustrations">← All illustrations</a>
      <h1>${s(e.title)}</h1>
    </header>
    <div class="ill-canvas" id="ill-stage"></div>
  </article>`;const n=c.querySelector("#ill-stage");if(!n)return;const i=await D(e.scene,n,[]);if(!document.contains(n)){i?.destroy();return}k=i}function z(){const t=F.experience.map(n=>{const i=n.roles.map(a=>`<div class="cv-role">
          <span class="cv-title">${s(a.title)}</span>
          <span class="cv-when">${s(a.dates)}</span>
        </div>`).join("");return`<div class="cv-org">
        <h3 class="cv-org-name">${s(n.org)}${n.place?` <span class="cv-place">${s(n.place)}</span>`:""}</h3>
        ${i}
      </div>`}).join(""),e=L.map(n=>{const i=n.href?`<a href="${s(n.href)}" target="_blank" rel="noopener">${s(n.title)}</a>`:s(n.title),a=n.links.map(o=>`<a href="${s(o.href)}" target="_blank" rel="noopener">${s(o.label)}</a>`).join(" · ");return`<article class="pub">
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${N(n.authors)}</p>
          <p class="pub-venue"><em>${s(n.venue)}</em></p>
          ${a?`<p class="pub-links">${a}</p>`:""}
          <p class="pub-blurb">${s(n.blurb)}</p>
        </div>
      </article>`}).join("");c.innerHTML=`<article class="page cv">
    <header>
      <h1>${s(H.name)}</h1>
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

  </article>`}function X(){const t=[{href:"#/research",title:"Research",blurb:`${L.length} publications — graphics, vision, geometry.`},{href:"#/blog",title:"Writing",blurb:"Notes on analysis, geometry, and numerical methods."},{href:"#/courses",title:"Courses",blurb:g.length?`${g.length} interactive course${g.length===1?"":"s"} with live demos and narration.`:"Interactive courses with live demos and narration."}].map(e=>`<a class="door" href="${e.href}">
        <span class="door-title">${s(e.title)}</span>
        <span class="door-blurb">${s(e.blurb)}</span>
      </a>`).join("");c.innerHTML=`<article class="page">
    <header>
      <h1>${s(v.name)}</h1>
      <p class="reading">${s(v.tagline)}</p>
    </header>
    <div class="doors">${t}</div>
  </article>`}function ee(){const t=L.map(e=>{const n=e.images.map((r,l)=>`<img src="${s(r)}" alt="" class="${l===0?"pub-img primary":"pub-img secondary"}" loading="lazy" />`).join(""),i=e.href?`<a href="${s(e.href)}" target="_blank" rel="noopener">${s(e.title)}</a>`:s(e.title),a=e.links.map(r=>`<a href="${s(r.href)}" target="_blank" rel="noopener">[${s(r.label)}]</a>`).join(" ");return`<article class="pub">
        ${e.images.length?`<div class="pub-media${e.images.length>1?" swap":""}">${n}</div>`:""}
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${N(e.authors)}</p>
          <p class="pub-venue"><em>${s(e.venue)}</em></p>
          ${a?`<p class="pub-links">${a}</p>`:""}
          <p class="pub-blurb">${s(e.blurb)}</p>
        </div>
      </article>`}).join("");c.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Research</h1>
      <p class="reading">Selected publications. Full list on
      <a href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar</a>.</p>
    </header>
    <div class="pubs">${t}</div>
  </article>`}function te(){if(!g.length){c.innerHTML=`<article class="page"><header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1></header>
      <p class="dim">No courses built yet.</p></article>`;return}const t=g.map(e=>{const n=e.modules.reduce((a,o)=>a+o.lessons.length,0),i=e.modules.flatMap(a=>a.lessons).filter(a=>y.has(a)).length;return`<a class="course-card" href="#/courses/${s(e.id)}">
        <span class="course-title">${s(e.title)}</span>
        ${e.subtitle?`<span class="course-sub">${s(e.subtitle)}</span>`:""}
        <span class="course-meta">${n} lesson${n===1?"":"s"}${i?` · ${i} done`:""}</span>
        <span class="door-arrow">→</span>
      </a>`}).join("");c.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1>
      <p class="reading">${s(v.blurb)}</p>
    </header>
    <div class="courses">${t}</div>
  </article>`}function ae(t){const e=g.find(i=>i.id===t);if(!e){c.innerHTML=`<article class="page"><header><h1>Not found</h1></header>
      <p>No course <code>${s(t)}</code>. <a href="#/courses">All courses</a></p></article>`;return}const n=e.modules.map(i=>`<section class="mod">
        <h2>${s(i.title)}</h2>
        ${i.lessons.length?`<ul>${i.lessons.map(a=>`<li><a href="#/lesson/${s(a)}">${s(a)}</a>${y.has(a)?' <span class="done">✓</span>':""}</li>`).join("")}</ul>`:'<p class="dim">Not written yet.</p>'}
      </section>`).join("");c.innerHTML=`<article class="page">
    <a class="back" href="#/courses">← ${s(v.name)}</a>
    <header><h1>${s(e.title)}</h1></header>
    ${e.subtitle?`<p class="sub">${s(e.subtitle)}</p>`:""}
    ${n}
  </article>`}async function se(){const t=await $("./data/blog.json");if(!t){c.innerHTML='<article class="page"><header><h1>Writing</h1></header><p class="dim">Nothing built.</p></article>';return}const e=o=>`<li class="post">
        <a class="post-title" href="#/blog/${s(o.id)}">${s(o.title)}</a>
        <span class="post-date">${s(o.date)}</span>
      </li>`,n=E.map(o=>({name:o.name,posts:[]})),i=[];for(const o of t){const r=E.findIndex(l=>o.tags.some(d=>l.tags.includes(d)));r<0?i.push(o):n[r].posts.push(o)}i.length&&n.push({name:"Other",posts:i});const a=n.filter(o=>o.posts.length).map(o=>`<section class="blog-cat">
        <h2>${s(o.name)}<span class="blog-cat-count">${o.posts.length}</span></h2>
        <ul class="post-list">${o.posts.map(e).join("")}</ul>
      </section>`).join("");c.innerHTML=`<article class="page">
    <header>
      <h1>Writing</h1>
      <p class="reading">${t.length} notes, grouped by topic.</p>
    </header>
    ${a}
  </article>`}async function ne(t){let e=T.get(t);if(!e){const n=await $(`./data/blog/${t}.json`);if(!n){c.innerHTML=`<article class="page"><header><h1>Not found</h1></header><p>No post <code>${s(t)}</code>.</p></article>`;return}e=n,T.set(t,e)}c.innerHTML=`<article class="post-view">
    <a class="back" href="#/blog">← All posts</a>
    <header>
      <h1>${s(e.title)}</h1>
      <div class="meta">${s(e.date)}</div>
      <p class="post-tags">${e.tags.map(n=>`<span>${s(n)}</span>`).join("")}</p>
    </header>
    <div class="prose">${e.html}</div>
    ${e.source?`<footer class="post-source">Originally posted at <a href="${s(e.source)}" target="_blank" rel="noopener">blogspot</a>.</footer>`:""}
  </article>`}function ie(t){const e=t.title?`<div class="box-title">${t.title}</div>`:"";return`<section class="box box-${t.box}">${e}<div class="box-body">${t.html}</div></section>`}function oe(t){const e=t.check.options.map((n,i)=>`<button class="opt" data-correct="${n.correct}" data-i="${i}">
          <span class="opt-mark"></span><span>${n.text}</span></button>`).join("");return`<section class="check" data-qid="${s(t.check.qid)}">
    <div class="check-q">${t.check.question}</div>
    <div class="check-opts">${e}</div>
    <div class="check-exp" hidden>${t.check.explanation}</div>
  </section>`}function re(t){const e=t.beats.map((n,i)=>`<button class="beat" data-beat="${i}"><span class="beat-n">${i+1}</span>${s(n.text)}</button>`).join("");return`<section class="sceneblock" data-scene="${s(t.id)}" style="--scene-h:${t.height}px">
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
  </section>`}function le(t){return t.blocks.map(e=>{switch(e.kind){case"md":return`<div class="prose">${e.html}</div>`;case"box":return ie(e);case"scene":return re(e);case"check":return oe(e)}}).join("")}const S=new Map;async function ce(t,e,n){const i=t.querySelector(".scene-canvas"),a=[...t.querySelectorAll(".beat")],o=t.querySelector(".play"),r=t.querySelector(".reset"),l=n.audio?new Audio(`./media/${n.audio}`):null;l&&(l.preload="auto");const d=await D(e.id,i,e.beats.map(u=>u.text)),h=new G({beats:e.beats,audio:l,onBeat:u=>{a.forEach((w,x)=>w.classList.toggle("active",x===u)),a[u]?.scrollIntoView({block:"nearest",behavior:"smooth"}),o.textContent=u>=e.beats.length-1?"Replay":"Playing…"},onSceneBeat:u=>d?.play?.(u)});S.set(t,{host:d,narration:h}),o.addEventListener("click",()=>{h.stop(),l?.pause(),l&&(l.currentTime=0,l.play()),h.start()}),r.addEventListener("click",()=>{h.stop(),l?.pause(),d?.reset?.(),a.forEach(u=>u.classList.remove("active")),o.textContent="Play"}),a.forEach(u=>u.addEventListener("click",()=>{l?.pause(),h.goto(Number(u.dataset.beat))}))}async function ue(t){let e=A.get(t);if(!e){const a=await $(`./data/lessons/${t}.json`);if(!a){c.innerHTML=`<article class="page"><header><h1>Not built yet</h1></header>
        <p>No lesson <code>${s(t)}</code>.</p>
        <p>Add <code>content/courses/&lt;course&gt;/**/${s(t)}.md</code>, set <code>publish: true</code>, then run <code>npm run build:lessons</code>.</p></article>`;return}e=a,A.set(t,e)}const n=e.reading?`<p class="reading">Reading: ${e.reading.url?`<a href="${s(e.reading.url)}" target="_blank" rel="noopener">${s(e.reading.text)}</a>`:s(e.reading.text)}</p>`:"",i=e.courseId?`<a class="back" href="#/courses/${s(e.courseId)}">← Course</a>`:"";c.innerHTML=`<article class="lesson">
    <header>
      ${i}
      <h1>${s(e.title)}</h1>
      <div class="meta">${s(e.module)} · ${s(e.kind)}</div>
      ${n}
    </header>
    ${le(e)}
  </article>`;for(const a of e.blocks){if(a.kind!=="scene")continue;const o=c.querySelector(`[data-scene="${a.id}"]`);o&&await ce(o,a,e)}for(const a of c.querySelectorAll(".check"))a.addEventListener("click",o=>{const r=o.target.closest(".opt");if(!r||r.disabled)return;const l=r.dataset.correct==="true";r.classList.add(l?"ok":"bad"),a.querySelectorAll(".opt").forEach(d=>{d.dataset.correct==="true"&&d.classList.add("ok"),d.disabled=!0}),a.querySelector(".check-exp").hidden=!1,l&&(y.add(t),Q())})}function he(){for(const[t,e]of S)e.narration.stop(),e.host?.destroy(),t.replaceWith(t.cloneNode(!1));S.clear(),k?.destroy(),k=null}function _(){const t=location.hash||"#/";he(),Z(t);const e=t.match(/^#\/blog\/(.+)$/);if(e)return void ne(e[1]);const n=t.match(/^#\/lesson\/(.+)$/);if(n)return void ue(n[1]);const i=t.match(/^#\/courses\/(.+)$/);if(i)return void ae(i[1]);if(t.startsWith("#/exploreflow"))return void X();if(t.startsWith("#/cv"))return void z();const a=t.match(/^#\/illustrations\/(.+)$/);if(a)return void Y(a[1]);if(t.startsWith("#/illustrations"))return void U();if(t.startsWith("#/blog"))return void se();if(t.startsWith("#/courses"))return void te();if(t.startsWith("#/research"))return void ee();K(),window.scrollTo(0,0)}async function de(){g=await $("./data/courses.json")||[],J(),window.addEventListener("hashchange",_),_()}de();
