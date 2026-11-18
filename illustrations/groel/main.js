import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const UP = new THREE.Vector3(0, 1, 0);
const DIM = new THREE.Color(0x2a3644);
const TAU = Math.PI * 2;
const D2R = Math.PI / 180;

const el = {
  scene: document.getElementById('scene'),
  labels: document.getElementById('labels'),
  title: document.getElementById('stepTitle'),
  text: document.getElementById('stepText'),
  counter: document.getElementById('counter'),
  dots: document.getElementById('dots'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  badge: document.getElementById('badge'),
  badgeText: document.getElementById('badgeText'),
  loading: document.getElementById('loading'),
  err: document.getElementById('err'),
  hint: document.getElementById('hint'),
};

const mechToggle = document.getElementById('mechToggle');
const mechStored = localStorage.getItem('mechCard') === '1';
document.body.classList.toggle('show-mech', mechStored);
if (mechToggle) {
  mechToggle.classList.toggle('active', mechStored);
  mechToggle.setAttribute('aria-pressed', mechStored ? 'true' : 'false');
  mechToggle.addEventListener('click', () => {
    const on = document.body.classList.toggle('show-mech');
    mechToggle.classList.toggle('active', on);
    mechToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    localStorage.setItem('mechCard', on ? '1' : '0');
  });
}

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.02;
el.scene.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(160, 90, 420);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = false;
controls.minDistance = 90;
controls.maxDistance = 900;
controls.minPolarAngle = 0.12;
controls.maxPolarAngle = Math.PI - 0.12;
controls.rotateSpeed = 0.75;
controls.zoomSpeed = 0.65;

scene.add(new THREE.HemisphereLight(0xbfd8ee, 0x0a0f14, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 1.35);
key.position.set(260, 420, 320);
scene.add(key);
const fill = new THREE.DirectionalLight(0x8fb4d8, 0.5);
fill.position.set(-320, -120, -220);
scene.add(fill);
const rim = new THREE.DirectionalLight(0xffd9b0, 0.7);
rim.position.set(-80, 260, -420);
scene.add(rim);

function chainPoints(src, name) {
  const out = [];
  for (const seg of src.chains[name] || []) for (const p of seg) out.push(p);
  return out;
}

function centroidOf(src, names) {
  const p = new THREE.Vector3();
  let n = 0;
  for (const name of names) {
    for (const [r, x, y, z] of chainPoints(src, name)) { p.x += x; p.y += y; p.z += z; n++; }
  }
  return n ? p.multiplyScalar(1 / n) : p;
}

const params = new URLSearchParams(location.search);
const STYLE = params.get('style') || 'tube';
const SYSTEM = params.get('system') || 'groel';
const RIBBON_W = 3.1;
const RIBBON_T = 0.6;

function buildTube(seg) {
  const pts = seg.map(s => new THREE.Vector3(s[1], s[2], s[3]));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.4);
  return new THREE.TubeGeometry(curve, Math.max(12, pts.length * 2), 1.85, 5, false);
}

function buildRibbon(seg) {
  const n = seg.length;
  const P = seg.map(s => new THREE.Vector3(s[1], s[2], s[3]));

  const pos = new Float32Array(n * 4 * 3);
  const idx = [];
  let prevU = null;

  for (let i = 0; i < n; i++) {
    const p = P[i];
    const t = new THREE.Vector3();
    if (i === 0) t.copy(P[1]).sub(P[0]);
    else if (i === n - 1) t.copy(P[n - 1]).sub(P[n - 2]);
    else t.copy(P[i + 1]).sub(P[i - 1]);
    if (t.lengthSq() < 1e-6) t.set(0, 1, 0);
    t.normalize();

    let u;
    if (!prevU) {
      const ref = Math.abs(t.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      u = new THREE.Vector3().crossVectors(t, ref).normalize();
    } else {
      u = prevU.clone().addScaledVector(t, -prevU.dot(t));
      if (u.lengthSq() < 1e-4) u = prevU.clone();
      u.normalize();
      if (u.dot(prevU) < 0) u.negate();
    }
    prevU = u;

    const s = new THREE.Vector3().crossVectors(t, u).normalize();
    const hw = RIBBON_W / 2, ht = RIBBON_T / 2;
    const corners = [
      p.clone().addScaledVector(s, hw).addScaledVector(u, ht),
      p.clone().addScaledVector(s, -hw).addScaledVector(u, ht),
      p.clone().addScaledVector(s, -hw).addScaledVector(u, -ht),
      p.clone().addScaledVector(s, hw).addScaledVector(u, -ht),
    ];
    for (let k = 0; k < 4; k++) {
      const v = corners[k];
      const o = (i * 4 + k) * 3;
      pos[o] = v.x; pos[o + 1] = v.y; pos[o + 2] = v.z;
    }
  }

  for (let i = 0; i < n - 1; i++) {
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      const a = i * 4 + k, b = i * 4 + k2, c = (i + 1) * 4 + k2, d = (i + 1) * 4 + k;
      idx.push(a, b, c, a, c, d);
    }
  }
  idx.push(0, 2, 1, 0, 3, 2);
  const last = (n - 1) * 4;
  idx.push(last, last + 1, last + 2, last, last + 2, last + 3);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function buildModel(src, opts = {}) {
  const group = new THREE.Group();
  const capGroup = new THREE.Group();
  group.add(capGroup);
  const chains = {};          // name -> { material, points, worldPoints }
  const ring0 = src.rings ? src.rings[0] : [];
  const ring1 = src.rings ? src.rings[1] : [];
  const capSet = new Set(src.caps || []);
  const alphaSet = new Set(src.groups && src.groups.alpha ? src.groups.alpha : []);

  Object.entries(src.chains).forEach(([name, segments]) => {
    let base;
    if (src.rings) {
      const ringIdx = capSet.has(name) ? 2 : ring0.includes(name) ? 0 : 1;
      const idx = (ringIdx === 2 ? src.caps.indexOf(name) : (ringIdx === 0 ? ring0.indexOf(name) : ring1.indexOf(name)));
      const hue = ringIdx === 2 ? 0.068 + idx * 0.005 : ringIdx === 0 ? 0.470 + idx * 0.005 : 0.610 + idx * 0.005;
      base = new THREE.Color().setHSL(hue, ringIdx === 2 ? 0.88 : 0.68, ringIdx === 2 ? 0.55 : 0.43);
    } else {
      base = new THREE.Color().setHSL(alphaSet.has(name) ? 0.47 : 0.61, 0.68, 0.45);
    }
    const material = new THREE.MeshStandardMaterial({
      color: base.clone(),
      roughness: 0.52,
      metalness: 0.04,
      emissive: base.clone(),
      emissiveIntensity: 0.07,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    material.userData.base = base;
    material.userData.mix = 1;
    material.userData.targetMix = 1;
    material.userData.chainOpacity = 1;
    material.userData.targetOpacity = 1;

    const allPoints = [];
    for (const seg of segments) {
      if (seg.length < 2) continue;
      const geo = STYLE === 'ribbon' ? buildRibbon(seg) : buildTube(seg);
      if (!geo) continue;
      const mesh = new THREE.Mesh(geo, material);
      mesh.frustumCulled = false;
      if (capSet.has(name)) capGroup.add(mesh); else group.add(mesh);
      for (const rec of seg) allPoints.push(new THREE.Vector3(rec[1], rec[2], rec[3]));
    }
    chains[name] = { material, points: allPoints, world: null };
  });

  if (!src.rings) {
    // no ring symmetry: place the model with an explicit offset
    group.position.copy(opts.offset || new THREE.Vector3());
    group.updateMatrixWorld(true);
  } else {
    // orient: ring0 -> ring1 along +Y, cap on top
    const ringCenters = src.rings.map(names => centroidOf(src, names));
    const axis = ringCenters[1].clone().sub(ringCenters[0]).normalize();
    let quat = new THREE.Quaternion().setFromUnitVectors(axis, UP);

    if (src.caps && src.caps.length) {
      const capC = centroidOf(src, src.caps);
      const probe = capC.clone().sub(ringCenters[0].add(ringCenters[1]).multiplyScalar(0.5)).applyQuaternion(quat);
      if (probe.y < 0) {
        quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI).multiply(quat);
      }
    }

    const c = ringCenters[0].clone().add(ringCenters[1]).multiplyScalar(0.5).applyQuaternion(quat);
    group.quaternion.copy(quat);
    group.position.copy(c).multiplyScalar(-1);
    group.updateMatrixWorld(true);
  }

  const invWorld = group.matrixWorld.clone().invert();
  const centerLocal = new THREE.Vector3(0, 0, 0).applyMatrix4(invWorld);
  const worldXLocal = new THREE.Vector3(1, 0, 0).applyQuaternion(group.quaternion.clone().invert()).normalize();

  for (const [name, rec] of Object.entries(chains)) {
    rec.world = rec.points.map(p => p.clone().applyMatrix4(group.matrixWorld));
  }

  // colour by position, not by PDB chain label: the cis (top) ring is always teal
  let topRing = null;
  let capBottomShift = 0;
  if (src.rings && src.rings.length === 2) {
    const meanY = names => {
      let s = 0, n = 0;
      for (const nm of names) for (const w of chains[nm] ? chains[nm].world : []) { s += w.y; n++; }
      return n ? s / n : 0;
    };
    const y0 = meanY(src.rings[0]);
    const y1 = meanY(src.rings[1]);
    const top = new Set(y1 >= y0 ? src.rings[1] : src.rings[0]);
    topRing = [...top];
    for (const [name, rec] of Object.entries(chains)) {
      if (capSet.has(name)) continue;
      const inTop = top.has(name);
      const idx = Math.max(src.rings[0].indexOf(name), src.rings[1].indexOf(name));
      const base = new THREE.Color().setHSL(inTop ? 0.470 + idx * 0.005 : 0.610 + idx * 0.005, 0.68, 0.43);
      rec.material.userData.base.copy(base);
      rec.material.color.copy(base);
      rec.material.emissive.copy(base);
    }
  }

  if (src.rings && topRing) {
    let topMax = -Infinity, botMin = Infinity;
    for (const nm of topRing) for (const w of chains[nm].world) topMax = Math.max(topMax, w.y);
    for (const nm of src.rings.flat()) if (!topRing.includes(nm)) for (const w of chains[nm].world) botMin = Math.min(botMin, w.y);
    if (Number.isFinite(topMax) && Number.isFinite(botMin)) capBottomShift = topMax + botMin;
  }

  return { group, chains, capSet, capGroup, topRing, centerLocal, worldXLocal, capBottomShift };
}

function anchorsFor(model, src) {
  return {
    chainCenter(name) {
      const rec = model.chains[name];
      if (!rec || !rec.world.length) return new THREE.Vector3();
      const p = new THREE.Vector3();
      for (const w of rec.world) p.add(w);
      return p.multiplyScalar(1 / rec.world.length);
    },
    capCenter() {
      const p = new THREE.Vector3();
      let n = 0;
      for (const name of src.caps) {
        for (const w of model.chains[name]?.world || []) { p.add(w); n++; }
      }
      return n ? p.multiplyScalar(1 / n) : p;
    },
    residue(name, resi) {
      const rec = model.chains[name];
      if (!rec) return new THREE.Vector3();
      const raws = src.chains[name].flat();
      let best = null, bestD = Infinity;
      for (const [r, x, y, z] of raws) {
        const d = Math.abs(r - resi);
        if (d < bestD) { bestD = d; best = [x, y, z]; }
      }
      if (!best) return new THREE.Vector3();
      return new THREE.Vector3(...best).applyMatrix4(model.group.matrixWorld);
    },
  };
}

let DATA, MECH, models = {}, stepIndex = 0, currentState = null, prevState = null, blob, blobB, blobBase, blobAmount = 0, blobTarget = 0;
let blobBAmount = 0, blobBTarget = 0, blobBY = -74;
let linkLine = null, atpPulse = null, atpPulseB = null;
let morphGroup = null, morphSets = [], morphT = 0, morphActive = false;
let loopTimer = null, loopPhase = 0, blobYOverride = null;
const clock = new THREE.Clock();

function allCA(src) {
  const out = [];
  for (const segs of Object.values(src.chains)) for (const seg of segs) for (const p of seg) out.push(p);
  return out;
}

function centroidAll(src) {
  const pts = allCA(src);
  const p = new THREE.Vector3();
  for (const [r, x, y, z] of pts) { p.x += x; p.y += y; p.z += z; }
  return pts.length ? p.multiplyScalar(1 / pts.length) : p;
}

function residuePoint(src, chain, resi) {
  let best = null, bd = Infinity;
  for (const seg of src.chains[chain] || []) {
    for (const p of seg) {
      const d = Math.abs(p[0] - resi);
      if (d < bd) { bd = d; best = p; }
    }
  }
  return best ? new THREE.Vector3(best[1], best[2], best[3]) : new THREE.Vector3();
}

function frameOf(src, align) {
  const [r1, r2, r3] = align.residues;
  const p1 = residuePoint(src, align.chain, r1);
  const p2 = residuePoint(src, align.chain, r2);
  const p3 = residuePoint(src, align.chain, r3);
  const e1 = p2.clone().sub(p1).normalize();
  const e2 = new THREE.Vector3().crossVectors(e1, p3.clone().sub(p1)).normalize();
  const e3 = new THREE.Vector3().crossVectors(e1, e2);
  return { origin: p1, basis: new THREE.Matrix4().makeBasis(e1, e2, e3) };
}

function superposition(from, to) {
  const A = frameOf(from, DATA.align);
  const B = frameOf(to, DATA.align);
  const R = new THREE.Matrix4().multiplyMatrices(B.basis, A.basis.clone().transpose());
  const shifted = A.origin.clone().applyMatrix4(R);
  const M = R.clone();
  M.setPosition(B.origin.clone().sub(shifted));
  return M;
}

function transformChains(chains, M) {
  const out = {};
  for (const [name, segs] of Object.entries(chains)) {
    out[name] = segs.map(seg => seg.map(([r, x, y, z]) => {
      const v = new THREE.Vector3(x, y, z).applyMatrix4(M);
      return [r, +v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2)];
    }));
  }
  return out;
}

function worldCentroid(model, name) {
  const rec = model.chains[name];
  const p = new THREE.Vector3();
  let n = 0;
  for (const w of rec.world) { p.add(w); n++; }
  return n ? p.multiplyScalar(1 / n) : p;
}

function buildMorph() {
  if (!models.open || !models.closed) return;
  const aNames = models.open.topRing;
  const bNames = models.closed.topRing;
  if (!aNames || !bNames || aNames.length !== 7 || bNames.length !== 7) return;

  const ang = (m, name) => {
    const c = worldCentroid(m, name);
    return Math.atan2(c.x, c.z);
  };
  const as = [...aNames].sort((x, y) => ang(models.open, x) - ang(models.open, y));
  const bs = [...bNames].sort((x, y) => ang(models.closed, x) - ang(models.closed, y));

  let best = 0, bestD = Infinity;
  for (let off = 0; off < 7; off++) {
    let d = 0;
    for (let i = 0; i < 7; i++) {
      d += worldCentroid(models.open, as[i]).distanceTo(worldCentroid(models.closed, bs[(i + off) % 7]));
    }
    if (d < bestD) { bestD = d; best = off; }
  }

  const N = 480;
  morphGroup = new THREE.Group();
  morphGroup.visible = false;
  scene.add(morphGroup);

  for (let i = 0; i < 7; i++) {
    const an = as[i];
    const bn = bs[(i + best) % 7];
    const pa = models.open.chains[an].world;
    const pb = models.closed.chains[bn].world;
    if (pa.length < 10 || pb.length < 10) continue;

    const sa = new THREE.CatmullRomCurve3(pa.map(p => p.clone()), false, 'centripetal').getSpacedPoints(N);
    const sb = new THREE.CatmullRomCurve3(pb.map(p => p.clone()), false, 'centripetal').getSpacedPoints(N);
    const ga = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sa, false, 'centripetal'), N, 1.85, 6, false);
    const gb = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sb, false, 'centripetal'), N, 1.85, 6, false);
    const posA = Float32Array.from(ga.attributes.position.array);
    const posB = Float32Array.from(gb.attributes.position.array);
    if (posA.length !== posB.length) continue;

    const base = models.open.chains[an].material.userData.base.clone();
    const mat = new THREE.MeshStandardMaterial({
      color: base, emissive: base, emissiveIntensity: 0.07,
      roughness: 0.52, metalness: 0.04, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(ga, mat);
    mesh.frustumCulled = false;
    morphGroup.add(mesh);
    morphSets.push({ geo: ga, posA, posB });
  }
}

async function init() {
  const dataUrl = SYSTEM === 'groel' ? 'data/structures.json' : 'data/hemoglobin.json';
  const mechUrl = 'data/mechanism-' + SYSTEM + '.json';
  const [data, mech] = await Promise.all([
    fetch(dataUrl, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('structures'); return r.json(); }),
    fetch(mechUrl, { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('mechanism'); return r.json(); }),
  ]);
  DATA = data;
  MECH = mech;

  let offset = null;
  if (DATA.align && DATA.reference) {
    const refKey = DATA.reference;
    const otherKey = Object.keys(DATA.states).find(k => k !== refKey);
    if (otherKey) {
      const M = superposition(DATA.states[otherKey], DATA.states[refKey]);
      DATA.states[otherKey].chains = transformChains(DATA.states[otherKey].chains, M);
    }
    offset = centroidAll(DATA.states[refKey]).multiplyScalar(-1);
  }

  if (SYSTEM === 'groel' && models.open) {
    const a = models.open.anchors.residue('A2', 87);
    const b = models.open.anchors.residue('A2', 220);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const radial = new THREE.Vector3(mid.x, 0, mid.z).normalize().multiplyScalar(36);
    const ctrl = mid.clone().add(radial);
    const curve = new THREE.QuadraticBezierCurve3(a, ctrl, b);
    linkLine = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 48, 0.8, 6, false),
      new THREE.MeshStandardMaterial({ color: 0xffc071, emissive: 0xff9a3c, emissiveIntensity: 1.6, transparent: true, opacity: 0.8 })
    );
    linkLine.visible = false;
    scene.add(linkLine);

    atpPulse = new THREE.Mesh(
      new THREE.SphereGeometry(3.0, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xffd08a, emissive: 0xffb347, emissiveIntensity: 1.8, transparent: true, opacity: 0.8 })
    );
    atpPulse.position.copy(a);
    atpPulse.visible = false;
    scene.add(atpPulse);

    atpPulseB = new THREE.Mesh(
      new THREE.SphereGeometry(3.0, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xffd08a, emissive: 0xffb347, emissiveIntensity: 1.8, transparent: true, opacity: 0.8 })
    );
    atpPulseB.position.copy(models.open.anchors.residue('A', 87));
    atpPulseB.visible = false;
    scene.add(atpPulseB);
  }

  document.querySelectorAll('.switcher a').forEach(a => a.classList.toggle('active', a.dataset.system === SYSTEM));
  document.getElementById('mechSvg').style.display = SYSTEM === 'hemoglobin' ? 'none' : 'block';
  const hbSvg = document.getElementById('hbSvg');
  if (hbSvg) hbSvg.style.display = SYSTEM === 'hemoglobin' ? 'block' : 'none';
  document.querySelector('.brand h1').textContent = MECH.title || 'Mechanism';
  document.querySelector('.brand p').textContent = MECH.subtitle || '';
  const keys = Object.keys(DATA.states);
  for (const key of keys) {
    const src = DATA.states[key];
    const model = buildModel(src, { offset });
    model.anchors = anchorsFor(model, src);
    model.group.visible = key === keys[0];
    model.opacity = key === keys[0] ? 1 : 0;
    scene.add(model.group);
    models[key] = model;
  }

  buildMorph();
  makeBlob();
  buildUI();
  const q = new URLSearchParams(location.search);
  const start = parseInt(q.get('step') || '1', 10);
  goTo(Number.isFinite(start) ? start - 1 : 0, true);
  if (params.get('autoplay') !== '0') setPlaying(true);
  if (params.get('probe') === '1') {
    const box = new THREE.Box3();
    for (const m of Object.values(models)) box.expandByObject(m.group);
    const f = v => v.toArray().map(n => n.toFixed(1)).join(',');
    let capInfo = '';
    if (models.closed && models.closed.capGroup) {
      models.closed.group.updateMatrixWorld(true);
      const cb = new THREE.Box3().setFromObject(models.closed.capGroup);
      capInfo = ' | cap ' + f(cb.min) + ' ; ' + f(cb.max);
    }
    document.title = 'BBOX ' + f(box.min) + ' | ' + f(box.max) + ' | states ' + Object.keys(models).join(',') + capInfo;
  }
  el.loading.classList.add('done');
  animate();
}

function makeBlob() {
  const geo = new THREE.IcosahedronGeometry(1, 4);
  blobBase = Float32Array.from(geo.attributes.position.array);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf08a6a),
    roughness: 0.55,
    metalness: 0.05,
    emissive: new THREE.Color(0xff6a4a),
    emissiveIntensity: 1.7,
    transparent: true,
    opacity: 0.94,
  });
  blob = new THREE.Mesh(geo, mat);
  blob.position.set(0, 50, 0);
  blob.visible = false;
  scene.add(blob);

  blobB = new THREE.Mesh(geo, mat.clone());
  blobB.position.set(0, -74, 0);
  blobB.visible = false;
  scene.add(blobB);
}

let blobFrame = 0;
function updateBlob(dt, t) {
  if (!blob) return;
  blobAmount += (blobTarget - blobAmount) * Math.min(1, dt * 4);
  const visible = blobAmount > 0.02;
  blob.visible = visible;
  if (!visible) return;
  const radius = 15 + 11 * blobAmount;
  blob.scale.setScalar(radius);
  blob.material.opacity = 0.92 * blobAmount;
  const pos = blob.geometry.attributes.position;
  const arr = pos.array;
  const amp = 0.14 * blobAmount;
  for (let i = 0; i < arr.length; i += 3) {
    const x = blobBase[i], y = blobBase[i + 1], z = blobBase[i + 2];
    const n = Math.sin(x * 3.1 + t * 1.1) * Math.sin(y * 3.7 - t * 0.9) * Math.sin(z * 3.4 + t * 0.7);
    const m = 1 + amp * n + 0.05 * Math.sin(t * 0.8 + x * 2.0);
    arr[i] = x * m; arr[i + 1] = y * m; arr[i + 2] = z * m;
  }
  pos.needsUpdate = true;
  if (++blobFrame % 3 === 0) blob.geometry.computeVertexNormals();

  if (blobB) {
    blobBAmount += (blobBTarget - blobBAmount) * Math.min(1, dt * 4);
    const visB = blobBAmount > 0.02;
    blobB.visible = visB;
    if (visB) {
      blobB.scale.setScalar(15 + 11 * blobBAmount);
      blobB.material.opacity = 0.92 * blobBAmount;
      blobB.position.y += (blobBY - blobB.position.y) * Math.min(1, dt * 3);
    }
  }
}

/* ---------- camera choreography ---------- */

function sphericalVec(r, polar, azim) {
  const sp = Math.sin(polar);
  return new THREE.Vector3(sp * Math.sin(azim), Math.cos(polar), sp * Math.cos(azim)).multiplyScalar(r);
}

function currentSpherical() {
  const off = camera.position.clone().sub(controls.target);
  const r = Math.max(off.length(), 1);
  return {
    target: controls.target.clone(),
    r,
    polar: Math.acos(THREE.MathUtils.clamp(off.y / r, -1, 1)),
    azim: Math.atan2(off.x, off.z),
  };
}

let tween = null;
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function resolveTarget(spec) {
  if (!spec) return new THREE.Vector3();
  if (Array.isArray(spec)) return new THREE.Vector3(spec[0], spec[1], spec[2]);
  if (typeof spec === 'string') {
    if (spec === 'cap') {
      const m = models[currentState] || Object.values(models)[0];
      return m.anchors.capCenter();
    }
    if (spec.startsWith('chain:')) {
      const name = spec.slice(6);
      const preferred = models[currentState];
      const model = preferred && preferred.chains[name] ? preferred : Object.values(models).find(m => m.chains[name]);
      return model ? model.anchors.chainCenter(name) : new THREE.Vector3();
    }
  }
  return new THREE.Vector3();
}

function tweenTo(cam, instant = false) {
  const to = {
    target: resolveTarget(cam.target),
    r: cam.r,
    polar: cam.polar * D2R,
    azim: cam.azim * D2R,
  };
  if (instant) {
    controls.target.copy(to.target);
    camera.position.copy(to.target).add(sphericalVec(to.r, to.polar, to.azim));
    controls.update();
    tween = null;
    return;
  }
  const from = currentSpherical();
  let d = to.azim - from.azim;
  d = ((d + Math.PI) % TAU + TAU) % TAU - Math.PI;
  to.azim = from.azim + d;
  tween = { from, to, t: 0, dur: 1.7 };
}

function updateTween(dt) {
  if (!tween) return;
  tween.t = Math.min(1, tween.t + dt / tween.dur);
  const e = easeInOut(tween.t);
  const target = tween.from.target.clone().lerp(tween.to.target, e);
  const r = THREE.MathUtils.lerp(tween.from.r, tween.to.r, e);
  const polar = THREE.MathUtils.lerp(tween.from.polar, tween.to.polar, e);
  const azim = THREE.MathUtils.lerp(tween.from.azim, tween.to.azim, e);
  controls.target.copy(target);
  camera.position.copy(target).add(sphericalVec(r, polar, azim));
  if (tween.t >= 1) tween = null;
}

renderer.domElement.addEventListener('pointerdown', () => { tween = null; });

/* ---------- steps ---------- */

const playBtn = document.getElementById('play');
let playing = false;
let playTimer = null;
const STEP_MS = 8000;

function setPlaying(on) {
  playing = on;
  if (playBtn) {
    playBtn.textContent = on ? '❚❚' : '▶';
    playBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  if (playTimer) { clearInterval(playTimer); playTimer = null; }
  if (on) {
    playTimer = setInterval(() => {
      if (stepIndex >= MECH.steps.length - 1) return;
      goTo(stepIndex + 1);
    }, STEP_MS);
  }
}

function buildUI() {
  el.dots.innerHTML = '';
  MECH.steps.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'step ' + (i + 1));
    b.addEventListener('click', () => { setPlaying(false); goTo(i); });
    el.dots.appendChild(b);
  });
  el.prev.addEventListener('click', () => { setPlaying(false); goTo(stepIndex - 1); });
  el.next.addEventListener('click', () => { setPlaying(false); goTo(stepIndex + 1); });
  if (playBtn) playBtn.addEventListener('click', () => setPlaying(!playing));
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setPlaying(false); goTo(stepIndex + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPlaying(false); goTo(stepIndex - 1); }
  });
}

const sch = {
  stage: document.getElementById('mechStage'),
  rings: document.getElementById('rings'),
  subunit: document.getElementById('subunit'),
  cap: document.getElementById('cap'),
  atp: document.getElementById('atp'),
  substrate: document.getElementById('substrate'),
  squiggle: document.getElementById('squiggle'),
  folded: document.getElementById('folded'),
  arrow: document.getElementById('arrowDown'),
};

const STAGE_NAMES = ['open', 'docked', 'ATP', 'rotation', 'GroES', 'folding', 'release'];

function updateSchematic(i) {
  if (SYSTEM === 'hemoglobin') { updateHbSchematic(i); return; }
  const e = sch;
  if (!e.stage) return;
  e.stage.textContent = STAGE_NAMES[i] || '';
  const isDomain = i === 2;
  e.subunit.style.opacity = isDomain ? '1' : '0';
  e.rings.style.opacity = isDomain ? '0.35' : '1';
  e.cap.style.opacity = i >= 4 ? (i === 6 ? '0.3' : '1') : '0';
  e.cap.style.transform = (i === 4 || i === 5) ? 'translateY(0)' : 'translateY(-42px)';
  e.atp.style.opacity = i >= 2 ? (i === 6 ? '0.35' : '1') : '0';
  e.substrate.style.opacity = i >= 1 ? '1' : '0';
  e.squiggle.style.opacity = (i >= 1 && i <= 3) ? '1' : '0';
  e.folded.style.opacity = i === 5 ? '1' : '0';
  e.folded.style.transform = i === 6 ? 'translateY(-44px)' : 'translateY(0)';
  e.arrow.style.opacity = i === 1 ? '1' : '0';
}

const HB_STAGES = ['two dimers', 'heme', 'O₂ binds', 'T state', 'rotation', 'R state'];

function updateHbSchematic(i) {
  const stage = document.getElementById('mechStage');
  if (stage) stage.textContent = HB_STAGES[i] || '';
  const top = document.getElementById('hbTop');
  const arc = document.getElementById('hbArc');
  if (top) top.setAttribute('transform', i >= 4 ? 'rotate(9 132 74)' : 'rotate(0 132 74)');
  if (arc) arc.style.opacity = (i === 3 || i === 4) ? '1' : '0';
  const n = i <= 1 ? 0 : i === 2 ? 1 : i === 3 ? 2 : 4;
  document.querySelectorAll('#hbSvg .o2').forEach((el, k) => { el.style.opacity = k < n ? '1' : '0'; });
}

function stopCycleLoop() {
  if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
  blobYOverride = null;
}

function applyCyclePhase() {
  const closed = loopPhase % 2 === 0;
  const bottom = loopPhase >= 2;
  for (const [k, m] of Object.entries(models)) {
    m.targetOpacity = k === (closed ? 'closed' : 'open') ? 1 : 0;
  }
  if (models.closed && models.closed.capGroup) {
    const m = models.closed;
    const cg = m.capGroup;
    if (bottom && closed) {
      const q = new THREE.Quaternion().setFromAxisAngle(m.worldXLocal, Math.PI);
      cg.quaternion.copy(q);
      cg.position.copy(m.centerLocal).sub(m.centerLocal.clone().applyQuaternion(q));
      const upLocal = new THREE.Vector3(0, 1, 0).applyQuaternion(m.group.quaternion.clone().invert());
      cg.position.addScaledVector(upLocal, m.capBottomShift);
      m.capTargetY = cg.position.y;
    } else if (closed) {
      cg.quaternion.identity();
      cg.position.set(0, 0, 0);
      m.capTargetY = 0;
    } else {
      m.capTargetY = 70;
    }
  }
  blobTarget = bottom ? 0 : (closed ? 0.35 : 0.45);
  blobYOverride = closed ? 44 : 108;
  if (blobB) {
    blobBTarget = bottom ? (closed ? 0.35 : 0.45) : 0.45;
    blobBY = bottom ? (closed ? -44 : -108) : -74;
  }
  tweenTo({ target: [0, bottom ? -20 : 0, 0], r: 560, polar: bottom ? 108 : 74, azim: 20 }, false);
}

function startCycleLoop() {
  stopCycleLoop();
  const forced = parseInt(params.get('loopPhase') || '', 10);
  loopPhase = Number.isFinite(forced) ? forced : 1;
  applyCyclePhase();
  if (Number.isFinite(forced)) return;
  loopTimer = setInterval(() => {
    loopPhase = (loopPhase + 1) % 4;
    applyCyclePhase();
  }, 2600);
}

function goTo(i, instant = false) {
  const steps = MECH.steps;
  stepIndex = THREE.MathUtils.clamp(i, 0, steps.length - 1);
  const step = steps[stepIndex];
  currentState = step.state;

  if (linkLine) linkLine.visible = SYSTEM === 'groel' && stepIndex === 2;
  if (atpPulse) atpPulse.visible = SYSTEM === 'groel' && (stepIndex === 2 || stepIndex === 5);
  if (atpPulseB) atpPulseB.visible = SYSTEM === 'groel' && stepIndex === 6;
  if (models.closed && models.closed.capGroup) {
    const cg = models.closed.capGroup;
    if (step.state === 'closed' && prevState !== 'closed') {
      cg.position.y = 70;
      models.closed.capTargetY = 0;
    } else if (step.state === 'open') {
      models.closed.capTargetY = 70;
    }
  }
  prevState = step.state;

  el.title.innerHTML = step.title;
  el.text.innerHTML = step.text;
  el.counter.textContent = String(stepIndex + 1).padStart(2, '0') + ' / ' + String(steps.length).padStart(2, '0');
  [...el.dots.children].forEach((d, k) => d.classList.toggle('active', k === stepIndex));
  el.prev.disabled = stepIndex === 0;
  el.next.disabled = stepIndex === steps.length - 1;
  el.badgeText.textContent = step.badge || '';
  el.badge.classList.toggle('closed', step.state === 'closed');

  for (const [k, m] of Object.entries(models)) {
    m.targetOpacity = k === step.state ? 1 : 0;
    if (instant) m.opacity = m.targetOpacity;
  }
  applyFocus(step, instant);
  if (morphGroup) {
    const on = SYSTEM === 'groel' && stepIndex === 3;
    morphGroup.visible = on;
    if (on) {
      morphT = 0;
      morphActive = true;
      for (const s of morphSets) {
        s.geo.attributes.position.array.set(s.posA);
        s.geo.attributes.position.needsUpdate = true;
      }
    } else {
      morphActive = false;
    }
  }
  if (SYSTEM === 'groel' && models.open && models.open.topRing && stepIndex === 3) {
    for (const nm of models.open.topRing) {
      models.open.chains[nm].material.userData.targetOpacity = 0;
    }
  }
  blobTarget = step.blob || 0;
  if (blobB && stepIndex !== MECH.steps.length - 1) blobBTarget = 0;
  if (stepIndex === MECH.steps.length - 1) startCycleLoop(); else stopCycleLoop();
  tweenTo(step.cam, instant);
  renderLabels(step);
  updateSchematic(stepIndex);
  hideHint();
}

function applyFocus(step, instantView = false) {
  const focus = step.focus;
  for (const [stateKey, m] of Object.entries(models)) {
    for (const [name, rec] of Object.entries(m.chains)) {
      const inFocus = !Array.isArray(focus) || focus.includes(name);
      rec.material.userData.targetMix = inFocus ? 1 : 0.12;
      const isCap = m.capSet.has(name);
      const cut = step.cutaway && isCap ? 0.12 : 1;
      const ghost = Array.isArray(focus) && !inFocus ? 0.05 : 1;
      rec.material.userData.targetOpacity = cut * ghost; // multiplied with state fade later
      if (instantView) {
        rec.material.userData.chainOpacity = cut * ghost;
        rec.material.userData.mix = rec.material.userData.targetMix;
      }
    }
  }
}

/* ---------- labels ---------- */

let activeLabels = [];
function renderLabels(step) {
  el.labels.innerHTML = '';
  activeLabels = [];
  const model = models[step.state];
  for (const spec of step.labels || []) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = spec.text;
    el.labels.appendChild(div);
    let world;
    if (spec.target === 'cap') world = model.anchors.capCenter();
    else if (spec.chain) world = model.anchors.residue(spec.chain, spec.resi);
    else if (spec.point) world = new THREE.Vector3(...spec.point);
    else continue;
    activeLabels.push({ div, world });
    requestAnimationFrame(() => div.style.opacity = '1');
  }
}

const tmpVec = new THREE.Vector3();
function updateLabels() {
  const w = window.innerWidth, h = window.innerHeight;
  for (const { div, world } of activeLabels) {
    tmpVec.copy(world).project(camera);
    if (tmpVec.z > 1) { div.style.opacity = '0'; continue; }
    div.style.opacity = '1';
    div.style.left = ((tmpVec.x * 0.5 + 0.5) * w) + 'px';
    div.style.top = ((-tmpVec.y * 0.5 + 0.5) * h) + 'px';
  }
}

/* ---------- frame ---------- */

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  updateTween(dt);

  for (const m of Object.values(models)) {
    m.opacity += (m.targetOpacity - m.opacity) * Math.min(1, dt * 5);
    m.group.visible = m.opacity > 0.015;
    for (const rec of Object.values(m.chains)) {
      const u = rec.material.userData;
      u.mix += (u.targetMix - u.mix) * Math.min(1, dt * 6);
      u.chainOpacity += (u.targetOpacity - u.chainOpacity) * Math.min(1, dt * 5);
      rec.material.color.copy(u.base).lerp(DIM, 1 - u.mix);
      rec.material.emissive.copy(u.base);
      rec.material.emissiveIntensity = 0.03 + 0.13 * u.mix;
      rec.material.opacity = THREE.MathUtils.clamp(m.opacity * u.chainOpacity, 0.02, 1);
      rec.material.depthWrite = rec.material.opacity > 0.75;
    }
  }

  for (const m of Object.values(models)) {
    if (m.capGroup && m.capTargetY != null) {
      m.capGroup.position.y += (m.capTargetY - m.capGroup.position.y) * Math.min(1, dt * 2.2);
    }
  }
  if (linkLine && linkLine.visible) linkLine.material.opacity = 0.5 + 0.4 * Math.sin(t * 2.4);
  if (atpPulse && atpPulse.visible) {
    const p = 1 + 0.22 * Math.sin(t * 3.2);
    atpPulse.scale.setScalar(p);
    atpPulse.material.opacity = 0.55 + 0.4 * Math.sin(t * 3.2);
  }
  if (atpPulseB && atpPulseB.visible) {
    const p = 1 + 0.22 * Math.sin(t * 3.0 + 1);
    atpPulseB.scale.setScalar(p);
    atpPulseB.material.opacity = 0.55 + 0.4 * Math.sin(t * 3.0 + 1);
  }

  if (morphActive) {
    morphT = Math.min(1, morphT + dt / 2.8);
    const e = easeInOut(morphT);
    for (const s of morphSets) {
      const arr = s.geo.attributes.position.array;
      for (let i = 0; i < arr.length; i++) arr[i] = s.posA[i] + (s.posB[i] - s.posA[i]) * e;
      s.geo.attributes.position.needsUpdate = true;
    }
    if (morphT >= 1) {
      morphActive = false;
      for (const s of morphSets) s.geo.computeVertexNormals();
    }
  }

  updateBlob(dt, t);
  if (blob) {
    const targetY = blobYOverride != null ? blobYOverride : (MECH.steps[stepIndex].blobY != null ? MECH.steps[stepIndex].blobY : 50);
    blob.position.y += (targetY - blob.position.y) * Math.min(1, dt * 3);
  }

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}

function hideHint() {
  el.hint.style.opacity = '0';
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setTimeout(hideHint, 9000);

init().catch(err => {
  console.error(err);
  el.err.style.display = 'grid';
  el.err.textContent = 'Load error: ' + (err && err.message ? err.message : String(err));
  el.loading.classList.add('done');
});
