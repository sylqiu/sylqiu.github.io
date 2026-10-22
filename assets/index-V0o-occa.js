(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const W="modulepreload",Q=function(t,e){return new URL(t,e).href},T={},y=function(e,s,i){let a=Promise.resolve();if(s&&s.length>0){const r=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),p=l?.nonce||l?.getAttribute("nonce");a=Promise.allSettled(s.map(h=>{if(h=Q(h,i),h in T)return;T[h]=!0;const u=h.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!i)for(let c=r.length-1;c>=0;c--){const g=r[c];if(g.href===h&&(!u||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${f}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":W,u||(m.as="script"),m.crossOrigin="",m.href=h,p&&m.setAttribute("nonce",p),document.head.appendChild(m),u)return new Promise((c,g)=>{m.addEventListener("load",c),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${h}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return a.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})},j={"hybrid-chain":()=>y(()=>import("./hybrid-chain-D5ew_OCj.js"),[],import.meta.url),"stat-vs-comp":()=>y(()=>import("./stat-vs-comp-DpDT9Loh.js"),[],import.meta.url),"prg-stretch":()=>y(()=>import("./prg-stretch-DHhopNnX.js"),[],import.meta.url),"kv-cache":()=>y(()=>import("./kv-cache-D-PuUmnV.js"),[],import.meta.url),"flash-attention":()=>y(()=>import("./flash-attention-yZGrR3f5.js"),[],import.meta.url)};function J(){return Object.keys(j)}async function I(t,e,s){const i=j[t];return i?(await i()).default(e,{beats:s}):(e.innerHTML=`<div class="scene-missing">Unknown scene <code>${t}</code>.<br>
      Known: ${J().map(o=>`<code>${o}</code>`).join(", ")}</div>`,null)}const U=380,q=2400;function R(t){const e=t.trim().split(/\s+/).filter(Boolean).length;return Math.max(q,Math.round(e*U))}class K{constructor(e){this.opts=e;const s=this.opts.audio?.duration,i=e.beats;if(this.opts.audio&&Number.isFinite(s)&&s&&i.length){const a=i.map(r=>r.seconds?r.seconds*1e3:R(r.text)),o=a.reduce((r,l)=>r+l,0);this.beatMs=a.map(r=>r/o*s*1e3)}else this.beatMs=i.map(a=>a.seconds?a.seconds*1e3:R(a.text))}index=-1;timer=null;stopped=!1;beatMs;start(){this.index=-1,this.stopped=!1,this.advance()}stop(){this.stopped=!0,this.timer!==null&&clearTimeout(this.timer),this.timer=null}goto(e){this.stopped||(this.timer!==null&&clearTimeout(this.timer),this.setBeat(e),this.schedule())}advance(){this.stopped||(this.setBeat(this.index+1),this.schedule())}schedule(){if(this.stopped||this.index>=this.opts.beats.length-1)return;const e=this.beatMs[this.index]??q;this.timer=window.setTimeout(()=>this.advance(),e)}setBeat(e){e!==this.index&&(this.index=e,this.opts.onBeat(e,this.opts.beats.length),this.opts.onSceneBeat?.(e))}get current(){return this.index}}const O={name:"Di Qiu"},M={name:"ExploreFlow",tagline:"Interactive courses — visual, explorable, and steppable line by line.",blurb:"Each course pairs prose with live demos you can drag and step through, narrated beat by beat. No video: everything runs in the page."},Z={experience:[{org:"Google XR",place:"",roles:[{title:"Software Developer (Canada)",dates:"Apr 2022 - present"},{title:"Research Intern → Student Researcher (remote)",dates:"Sep 2020 - Sep 2021"}]},{org:"SenseTime Research",place:"Hong Kong",roles:[{title:"Research Intern · Intern Star award",dates:"Jul 2018 - Aug 2019"}]}]},D=[{name:"Vision & Graphics",tags:["computer vision","computer graphics","imaging","machine learning"]},{name:"Numerical Methods & Optimization",tags:["cuhk.math3310","teaching","numerical methods","optimization"]},{name:"Analysis & PDE",tags:["real analysis","measure theory","functional analysis","harmonic analysis","Fourier analysis","PDE","elliptic theory"]},{name:"Geometry & Topology",tags:["differential geometry","discrete conformal geometry","algebraic topology","complex analysis"]},{name:"Algebra",tags:["algebra","linear algebra"]},{name:"Probability",tags:["probability theory","stochastic differential equation","statistical physics"]}],P=[{title:"GNM Head: A Generative aNthropometric Model of the Human Head",href:"https://arxiv.org/abs/2607.23687",authors:"Stylianos Ploumpis, Jan Bednarik, Gaspard Zoss, Ruslan Guseinov, Luca Prasso, Prashanth Chandran, Oliver Boyne, Vasileios Choutas, Timo Bolkart, Daoye Wang, Menglei Chai, Di Qiu, Sebastian Winberg, Gilles Rainer, Lewis Bridgeman, Leonhard Helminger, Edo Collins, Delio Vicini, Jérémy Riviere, Yannick Boetzel, Alexander Koumis, Stylianos Moschoglou, Jay Busch, Cynthia Herrera, Jacob Still, Scott Ysebert, Peter Lincoln, Sergio Orts Escolano, Christoph Rhemann, Erroll Wood, Thabo Beeler, Stefanos Zafeiriou",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"A publicly released parametric model of the human head - face, neck, eyeballs, teeth and tongue - for animation, rendering, and as conditioning for generative models."},{title:"Concurrent Image Understanding and Generation: Self-Correcting Coupled Markov Jump Processes",href:"https://arxiv.org/abs/2607.13188",authors:"Minh-Quan Le, Armand Comas, Alexandros Lattas, Stylianos Moschoglou, Pedro Vélez, Amit Raj, Aaron Germuth, Thabo Beeler, Dimitris Samaras, Di Qiu",venue:"arXiv preprint, 2026",images:[],links:[],blurb:"Joint multimodal sampling where each modality's transition rates follow the other's confidence, with a remasking jump that retracts cross-modal contradictions."},{title:"MagicMirror: Fast and High-Quality Avatar Generation with a Constrained Search Space",href:"https://arxiv.org/abs/2404.01296",authors:"Armand Comas-Massagué, Di Qiu, Menglei Chai, Marcel Bühler, Amit Raj, Ruiqi Gao, Qiangeng Xu, Mark Matthews, Paulo Gotardo, Octavia Camps, Sergio Orts-Escolano, Thabo Beeler",venue:"ECCV, 2024",images:[],links:[],blurb:"Text-guided avatar generation and editing, using a parametric NeRF with a constrained search space for fast, high-quality results."},{title:"Loc3Diff: Local Diffusion for 3D Human Head Synthesis and Editing",href:"https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/08166.pdf",authors:"Yushi Lan, Feitong Tan, Qiangeng Xu, Di Qiu, Kyle Genova, Zeng Huang, Sean Fanello, Rohit Pandey, Thomas Funkhouser, Chen Change Loy, Yinda Zhang",venue:"ECCV, 2024",images:[],links:[],blurb:"Generates photorealistic 3D heads by diffusing UV-anchored local tri-planes, giving semantic-aligned local control for head synthesis and editing."},{title:"CHOSEN: Contrastive Hypothesis Selection for Multi-View Depth Refinement",href:"https://crv.pubpub.org/pub/dl70yq4c",authors:"Di Qiu, Yinda Zhang, Thabo Beeler, Vladimir Tankovich, Christian Häne, Sean Fanello, Christoph Rhemann, Sergio Orts Escolano",venue:"CRV, 2025 · Best Paper",images:[],links:[{label:"arXiv",href:"https://arxiv.org/abs/2404.02225"}],blurb:"Iteratively re-samples and selects the best depth hypotheses with contrastive learning; drops into any multi-view stereo pipeline."},{title:"MonoAvatar: Learning Personalized High Quality Volumetric Head Avatars from Monocular RGB Videos",href:"https://arxiv.org/abs/2304.01436",authors:"Ziqian Bai, Feitong Tan, Zeng Huang, Kripasindhu Sarkar, Danhang Tang, Di Qiu, Abhimitra Meka, Ruofei Du, Mingsong Dou, Sergio Orts-Escolano, Rohit Pandey, Ping Tan, Thabo Beeler, Sean Fanello, Yinda Zhang",venue:"CVPR, 2023",images:["images/pub/mono_avatar/mono_avatar.gif"],links:[{label:"project",href:"https://augmentedperception.github.io/monoavatar"}],blurb:"Builds an animatable 3D head avatar from monocular video, using a parametric head model equipped with learnable features."},{title:"Modal Uncertainty Estimation via Discrete Latent Representation",href:"https://arxiv.org/abs/2007.12858",authors:"Di Qiu, Lok Ming Lui",venue:"MICCAI UNSURE workshop, 2021",images:["images/pub/modal_uncertainty/1.png"],links:[{label:"code",href:"https://github.com/sylqiu/MUE"}],blurb:"Estimates the modal uncertainty of one-to-many mappings with a conditional variational auto-encoding framework over discrete latent modes."},{title:"Guided Collaborative Training for Pixel-wise Semi-Supervised Learning",href:"https://arxiv.org/abs/2008.05258",authors:"Zhanghan Ke, Di Qiu, Kaican Li, Qiong Yan, Rynson W. H. Lau",venue:"ECCV, 2020",images:[],links:[],blurb:"An ensemble of networks that learn from each other through a flaw-detection module; state-of-the-art pixel-wise semi-supervised segmentation, denoising and enhancement."},{title:"Towards Geometry Guided Neural Relighting with Flash Photography",authors:"Di Qiu, Jin Zeng, Zhanghan Ke, Wenxiu Sun, Chengxi Yang",venue:"3DV, 2020",images:["images/pub/relight/1.png","images/pub/relight/2.png"],links:[],blurb:"Directional relighting from a single co-located flash image and its depth map."},{title:"Inconsistent Surface Registration via Optimization of Mapping Distortions",href:"https://arxiv.org/abs/1908.09098",authors:"Di Qiu, Lok Ming Lui",venue:"Journal of Scientific Computing, 2020",images:["images/pub/incon_shape/1.png","images/pub/incon_shape/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/incon_reg"}],blurb:"Simultaneously finding the domain of correspondence and the registration by optimizing distortions in the mapping differential."},{title:"Adapting Object Detectors with Conditional Domain Normalization",href:"https://arxiv.org/abs/2003.07071",authors:"Peng Su, Kun Wang, Xingyu Zeng, Shixiang Tang, Dapeng Chen, Di Qiu, Xiaogang Wang",venue:"ECCV, 2020",images:[],links:[],blurb:"Aligns mini-batch feature statistics across domains for domain adaptation in object detection and segmentation."},{title:"Shape Analysis via Inconsistent Surface Registration",href:"https://arxiv.org/abs/2003.01357",authors:"Gary P. T. Choi, Di Qiu, Lok Ming Lui",venue:"Proceedings of the Royal Society A, 2020",images:[],links:[],blurb:"Inconsistent surface registration applied to shape analysis in tooth morphology."},{title:"Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules",href:"http://arxiv.org/abs/1909.07623",authors:"Di Qiu, Jiahao Pang, Chengxi Yang, Wenxiu Sun",venue:"ICCV, 2019 · Best Poster Award, HK Computer Vision Workshop",images:["images/pub/tof_align_refine/1.png","images/pub/tof_align_refine/2.png"],links:[{label:"code & dataset",href:"https://github.com/sylqiu/tof_rgbd_processing"}],blurb:"Cross-modal flow estimation and Time-of-Flight depth refinement using deep learning, with a physically accurate synthetic dataset."},{title:"Computing Quasiconformal Folds",href:"https://arxiv.org/abs/1804.03936",authors:"Di Qiu, Ka Chun Lam, Lok Ming Lui",venue:"SIAM Journal on Imaging Sciences, 2019",images:["images/pub/fold_map/1.png","images/pub/fold_map/2.png"],links:[{label:"code",href:"https://github.com/sylqiu/Least-square-beltrami-solver"}],blurb:"Computing folding and unfolding maps via a generalized form of quasiconformal mapping and crease geometry inference."}];function V(t){const e=O.name;return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").split(", ").map(i=>i.trim()===e?`<strong>${i.trim()}</strong>`:i.trim()).join(", ")}const L=[{id:"flash-attention",title:"FlashAttention: From Attention to Kernels",blurb:"Attention by definition, the GPU and TPU memory hierarchies, tiling and online softmax with a focus on data movement, the variant landscape, and kernel code for PyTorch, CUDA, Triton, and TPU/Pallas.",scene:"flash-attention"},{id:"kv-cache",title:"How KV cache works in an autoregressive LLM",blurb:"From one transformer layer to prefill and decode: what a position computes for itself, the step where it reads its past, and how serving systems store, share, and schedule that past — paged blocks, copy-on-write, RadixAttention, disaggregated prefill/decode, and pseudocode linked to vLLM, SGLang, and TensorRT-LLM.",scene:"kv-cache"}],d=document.getElementById("app"),G=document.getElementById("topnav");let v=[];const H=new Map,N=new Map,x=new Set(JSON.parse(localStorage.getItem("exploreflow:progress")||"[]")),n=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function z(){localStorage.setItem("exploreflow:progress",JSON.stringify([...x]))}async function C(t){const e=await fetch(t);return e.ok?await e.json():null}const Y=[{href:"#/",label:"Home",nav:"#/"}];function X(){G.innerHTML=Y.map(t=>`<a href="${t.href}" data-nav="${t.nav}">${n(t.label)}</a>`).join("")}function ee(t){const e=t.split("?")[0]||"#/";G.querySelectorAll("a[data-nav]").forEach(s=>{const i=s.dataset.nav||"#/",a=i==="#/"?e==="#/":e===i||e.startsWith(i+"/");s.classList.toggle("active",a)})}function te(){const t=[{label:"Curriculum Vitae",href:"#/cv"},{label:"Interactive Illustrations",href:"#/illustrations"},{label:"Writing",href:"#/blog"}].sort((e,s)=>e.label.localeCompare(s.label)).map(e=>`<a href="${n(e.href)}">${n(e.label)}</a>`).join("");d.innerHTML=`
    <section class="landing">
      <nav class="landing-nav">${t}</nav>
    </section>
  `}let A=null,B="";const E=6;function F(t,e,s,i="← Prev",a="Next →"){if(e<=1)return"";const o=h=>`${s}?page=${h}`,r=Array.from({length:e},(h,u)=>u+1).map(h=>h===t?`<span class="pager-num is-current" aria-current="page">${h}</span>`:`<a class="pager-num" href="${o(h)}">${h}</a>`).join(""),l=t>1?`<a class="pager-step" href="${o(t-1)}">${i}</a>`:`<span class="pager-step is-disabled">${i}</span>`,p=t<e?`<a class="pager-step" href="${o(t+1)}">${a}</a>`:`<span class="pager-step is-disabled">${a}</span>`;return`<nav class="pager" aria-label="Pagination">${l}<span class="pager-nums">${r}</span>${p}</nav>`}function ae(t=1){const e=Math.max(1,Math.ceil(L.length/E)),s=Math.min(Math.max(1,t),e),a=L.slice((s-1)*E,s*E).map(l=>`<a class="ill-card-link" href="#/illustrations/${n(l.id)}">
        <h2>${n(l.title)}</h2>
        <p>${n(l.blurb)}</p>
        <span class="ill-open">Open →</span>
      </a>`).join(""),o=L.length,r=e>1?` · page ${s} of ${e}`:"";d.innerHTML=`<article class="page">
    <header>
      <h1>Interactive Illustrations</h1>
      <p class="reading">Small, self-contained pictures of ideas I keep re-deriving. Each one has
      its own page and is meant to be played with.${o?` ${o} illustrations${r}.`:""}</p>
    </header>
    <nav class="ill-index">${a||'<p class="dim">Nothing here yet.</p>'}</nav>
    ${F(s,e,"#/illustrations")}
  </article>`}async function se(t){const e=L.find(a=>a.id===t);if(!e){d.innerHTML=`<article class="page">
      <header><h1>Not here</h1></header>
      <p>No illustration <code>${n(t)}</code>.</p>
      <p><a href="#/illustrations">← All illustrations</a></p>
    </article>`;return}d.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/illustrations">← All illustrations</a>
      <h1>${n(e.title)}</h1>
    </header>
    <div class="ill-canvas" id="ill-stage"></div>
  </article>`;const s=d.querySelector("#ill-stage");if(!s)return;const i=await I(e.scene,s,[]);if(!document.contains(s)){i?.destroy();return}A=i}function ne(){const t=Z.experience.map(s=>{const i=s.roles.map(a=>`<div class="cv-role">
          <span class="cv-title">${n(a.title)}</span>
          <span class="cv-when">${n(a.dates)}</span>
        </div>`).join("");return`<div class="cv-org">
        <h3 class="cv-org-name">${n(s.org)}${s.place?` <span class="cv-place">${n(s.place)}</span>`:""}</h3>
        ${i}
      </div>`}).join(""),e=P.map(s=>{const i=s.href?`<a href="${n(s.href)}" target="_blank" rel="noopener">${n(s.title)}</a>`:n(s.title),a=s.links.map(o=>`<a href="${n(o.href)}" target="_blank" rel="noopener">${n(o.label)}</a>`).join(" · ");return`<article class="pub">
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${V(s.authors)}</p>
          <p class="pub-venue"><em>${n(s.venue)}</em></p>
          ${a?`<p class="pub-links">${a}</p>`:""}
          <p class="pub-blurb">${n(s.blurb)}</p>
        </div>
      </article>`}).join("");d.innerHTML=`<article class="page cv">
    <header>
      <h1>${n(O.name)}</h1>
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

  </article>`}function ie(){const t=[{href:"#/research",title:"Research",blurb:`${P.length} publications — graphics, vision, geometry.`},{href:"#/blog",title:"Writing",blurb:"Notes on analysis, geometry, and numerical methods."},{href:"#/courses",title:"Courses",blurb:v.length?`${v.length} interactive course${v.length===1?"":"s"} with live demos and narration.`:"Interactive courses with live demos and narration."}].map(e=>`<a class="door" href="${e.href}">
        <span class="door-title">${n(e.title)}</span>
        <span class="door-blurb">${n(e.blurb)}</span>
      </a>`).join("");d.innerHTML=`<article class="page">
    <header>
      <h1>${n(M.name)}</h1>
      <p class="reading">${n(M.tagline)}</p>
    </header>
    <div class="doors">${t}</div>
  </article>`}function oe(){const t=P.map(e=>{const s=e.images.map((r,l)=>`<img src="${n(r)}" alt="" class="${l===0?"pub-img primary":"pub-img secondary"}" loading="lazy" />`).join(""),i=e.href?`<a href="${n(e.href)}" target="_blank" rel="noopener">${n(e.title)}</a>`:n(e.title),a=e.links.map(r=>`<a href="${n(r.href)}" target="_blank" rel="noopener">[${n(r.label)}]</a>`).join(" ");return`<article class="pub">
        ${e.images.length?`<div class="pub-media${e.images.length>1?" swap":""}">${s}</div>`:""}
        <div class="pub-body">
          <h3 class="pub-title">${i}</h3>
          <p class="pub-authors">${V(e.authors)}</p>
          <p class="pub-venue"><em>${n(e.venue)}</em></p>
          ${a?`<p class="pub-links">${a}</p>`:""}
          <p class="pub-blurb">${n(e.blurb)}</p>
        </div>
      </article>`}).join("");d.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Research</h1>
      <p class="reading">Selected publications. Full list on
      <a href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar</a>.</p>
    </header>
    <div class="pubs">${t}</div>
  </article>`}function re(){if(!v.length){d.innerHTML=`<article class="page"><header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1></header>
      <p class="dim">No courses built yet.</p></article>`;return}const t=v.map(e=>{const s=e.modules.reduce((a,o)=>a+o.lessons.length,0),i=e.modules.flatMap(a=>a.lessons).filter(a=>x.has(a)).length;return`<a class="course-card" href="#/courses/${n(e.id)}">
        <span class="course-title">${n(e.title)}</span>
        ${e.subtitle?`<span class="course-sub">${n(e.subtitle)}</span>`:""}
        <span class="course-meta">${s} lesson${s===1?"":"s"}${i?` · ${i} done`:""}</span>
        <span class="door-arrow">→</span>
      </a>`}).join("");d.innerHTML=`<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1>
      <p class="reading">${n(M.blurb)}</p>
    </header>
    <div class="courses">${t}</div>
  </article>`}function le(t){const e=v.find(i=>i.id===t);if(!e){d.innerHTML=`<article class="page"><header><h1>Not found</h1></header>
      <p>No course <code>${n(t)}</code>. <a href="#/courses">All courses</a></p></article>`;return}const s=e.modules.map(i=>`<section class="mod">
        <h2>${n(i.title)}</h2>
        ${i.lessons.length?`<ul>${i.lessons.map(a=>`<li><a href="#/lesson/${n(a)}">${n(a)}</a>${x.has(a)?' <span class="done">✓</span>':""}</li>`).join("")}</ul>`:'<p class="dim">Not written yet.</p>'}
      </section>`).join("");d.innerHTML=`<article class="page">
    <a class="back" href="#/courses">← ${n(M.name)}</a>
    <header><h1>${n(e.title)}</h1></header>
    ${e.subtitle?`<p class="sub">${n(e.subtitle)}</p>`:""}
    ${s}
  </article>`}async function ce(t=1){const e=await C("./data/blog.json");if(!e){d.innerHTML='<article class="page"><header><h1>Writing</h1></header><p class="dim">Nothing built.</p></article>';return}const s=c=>{const g=`#/blog/${n(c.id)}`,b=(c.preview||[]).map($=>`<p>${$}</p>`).join(""),k=(c.images||[]).map($=>`<a class="post-thumb" href="${g}" title="${n($.alt||"")}"><img src="${n($.src)}" alt="${n($.alt||"")}" loading="lazy" decoding="async"></a>`).join("");return`<li class="post">
        <div class="post-head">
          <a class="post-title" href="${g}">${n(c.title)}</a>
          <span class="post-date">${n(c.date)}</span>
        </div>
        ${b?`<div class="post-preview">${b}</div>`:""}
        ${k?`<div class="post-thumbs">${k}</div>`:""}
        <a class="post-more" href="${g}">Read →</a>
      </li>`},i=D.map(c=>({name:c.name,posts:[]})),a=[];for(const c of e){const g=D.findIndex(b=>c.tags.some(k=>b.tags.includes(k)));g<0?a.push(c):i[g].posts.push(c)}a.length&&i.push({name:"Other",posts:a});const o=i.flatMap(c=>c.posts.map(g=>({post:g,group:c.name}))),r=new Map(i.map(c=>[c.name,c.posts.length])),l=6,p=Math.max(1,Math.ceil(o.length/l)),h=Math.min(Math.max(1,t),p),u=o.slice((h-1)*l,h*l),f=[];for(const{post:c,group:g}of u){const b=f[f.length-1];b&&b.name===g?b.posts.push(c):f.push({name:g,posts:[c]})}const w=f.map(c=>`<section class="blog-cat">
        <h2>${n(c.name)}<span class="blog-cat-count">${r.get(c.name)??c.posts.length}</span></h2>
        <ul class="post-list">${c.posts.map(s).join("")}</ul>
      </section>`).join(""),m=p>1?` · page ${h} of ${p}`:"";d.innerHTML=`<article class="page">
    <header>
      <h1>Writing</h1>
      <p class="reading">${e.length} notes, grouped by topic${m}.</p>
    </header>
    ${w}
    ${F(h,p,"#/blog","← Newer","Older →")}
  </article>`}async function he(t){let e=N.get(t);if(!e){const s=await C(`./data/blog/${t}.json`);if(!s){d.innerHTML=`<article class="page"><header><h1>Not found</h1></header><p>No post <code>${n(t)}</code>.</p></article>`;return}e=s,N.set(t,e)}d.innerHTML=`<article class="post-view">
    <a class="back" href="#/blog">← All posts</a>
    <header>
      <h1>${n(e.title)}</h1>
      <div class="meta">${n(e.date)}</div>
      <p class="post-tags">${e.tags.map(s=>`<span>${n(s)}</span>`).join("")}</p>
    </header>
    <div class="prose">${e.html}</div>
    ${e.source?`<footer class="post-source">Originally posted at <a href="${n(e.source)}" target="_blank" rel="noopener">blogspot</a>.</footer>`:""}
  </article>`}function ue(t){const e=t.title?`<div class="box-title">${t.title}</div>`:"";return`<section class="box box-${t.box}">${e}<div class="box-body">${t.html}</div></section>`}function de(t){const e=t.check.options.map((s,i)=>`<button class="opt" data-correct="${s.correct}" data-i="${i}">
          <span class="opt-mark"></span><span>${s.text}</span></button>`).join("");return`<section class="check" data-qid="${n(t.check.qid)}">
    <div class="check-q">${t.check.question}</div>
    <div class="check-opts">${e}</div>
    <div class="check-exp" hidden>${t.check.explanation}</div>
  </section>`}function pe(t){const e=t.beats.map((s,i)=>`<button class="beat" data-beat="${i}"><span class="beat-n">${i+1}</span>${n(s.text)}</button>`).join("");return`<section class="sceneblock" data-scene="${n(t.id)}" style="--scene-h:${t.height}px">
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
  </section>`}function ge(t){return t.blocks.map(e=>{switch(e.kind){case"md":return`<div class="prose">${e.html}</div>`;case"box":return ue(e);case"scene":return pe(e);case"check":return de(e)}}).join("")}const _=new Map;async function me(t,e,s){const i=t.querySelector(".scene-canvas"),a=[...t.querySelectorAll(".beat")],o=t.querySelector(".play"),r=t.querySelector(".reset"),l=s.audio?new Audio(`./media/${s.audio}`):null;l&&(l.preload="auto");const p=await I(e.id,i,e.beats.map(u=>u.text)),h=new K({beats:e.beats,audio:l,onBeat:u=>{a.forEach((f,w)=>f.classList.toggle("active",w===u)),a[u]?.scrollIntoView({block:"nearest",behavior:"smooth"}),o.textContent=u>=e.beats.length-1?"Replay":"Playing…"},onSceneBeat:u=>p?.play?.(u)});_.set(t,{host:p,narration:h}),o.addEventListener("click",()=>{h.stop(),l?.pause(),l&&(l.currentTime=0,l.play()),h.start()}),r.addEventListener("click",()=>{h.stop(),l?.pause(),p?.reset?.(),a.forEach(u=>u.classList.remove("active")),o.textContent="Play"}),a.forEach(u=>u.addEventListener("click",()=>{l?.pause(),h.goto(Number(u.dataset.beat))}))}async function fe(t){let e=H.get(t);if(!e){const a=await C(`./data/lessons/${t}.json`);if(!a){d.innerHTML=`<article class="page"><header><h1>Not built yet</h1></header>
        <p>No lesson <code>${n(t)}</code>.</p>
        <p>Add <code>content/courses/&lt;course&gt;/**/${n(t)}.md</code>, set <code>publish: true</code>, then run <code>npm run build:lessons</code>.</p></article>`;return}e=a,H.set(t,e)}const s=e.reading?`<p class="reading">Reading: ${e.reading.url?`<a href="${n(e.reading.url)}" target="_blank" rel="noopener">${n(e.reading.text)}</a>`:n(e.reading.text)}</p>`:"",i=e.courseId?`<a class="back" href="#/courses/${n(e.courseId)}">← Course</a>`:"";d.innerHTML=`<article class="lesson">
    <header>
      ${i}
      <h1>${n(e.title)}</h1>
      <div class="meta">${n(e.module)} · ${n(e.kind)}</div>
      ${s}
    </header>
    ${ge(e)}
  </article>`;for(const a of e.blocks){if(a.kind!=="scene")continue;const o=d.querySelector(`[data-scene="${a.id}"]`);o&&await me(o,a,e)}for(const a of d.querySelectorAll(".check"))a.addEventListener("click",o=>{const r=o.target.closest(".opt");if(!r||r.disabled)return;const l=r.dataset.correct==="true";r.classList.add(l?"ok":"bad"),a.querySelectorAll(".opt").forEach(p=>{p.dataset.correct==="true"&&p.classList.add("ok"),p.disabled=!0}),a.querySelector(".check-exp").hidden=!1,l&&(x.add(t),z())})}function be(){for(const[t,e]of _)try{e.narration.stop(),e.host?.destroy(),t.replaceWith(t.cloneNode(!1))}catch(s){console.warn("scene teardown failed",s)}_.clear();try{A?.destroy()}catch(t){console.warn("illustration teardown failed",t)}finally{A=null}}function S(){const t=location.hash||"#/",[e,s]=t.split("?"),i=Math.max(1,Number(new URLSearchParams(s||"").get("page"))||1);if(window.scrollTo(0,0),t===B)return;B=t,be(),ee(t);const a=e.match(/^#\/blog\/(.+)$/);if(a)return void he(a[1]);const o=e.match(/^#\/lesson\/(.+)$/);if(o)return void fe(o[1]);const r=e.match(/^#\/courses\/(.+)$/);if(r)return void le(r[1]);if(e.startsWith("#/exploreflow"))return void ie();if(e.startsWith("#/cv"))return void ne();const l=e.match(/^#\/illustrations\/(.+)$/);if(l)return void se(l[1]);if(e.startsWith("#/illustrations"))return void ae(i);if(e.startsWith("#/blog"))return void ce(i);if(e.startsWith("#/courses"))return void re();if(e.startsWith("#/research"))return void oe();te(),window.scrollTo(0,0)}async function ve(){v=await C("./data/courses.json")||[],X(),document.addEventListener("click",t=>{const e=t.target?.closest('a[href^="#/"]');if(!e)return;const s=e.getAttribute("href");s&&(t.preventDefault(),location.hash===s||(location.hash=s),S())}),window.addEventListener("hashchange",S),S()}ve();
