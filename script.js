import * as THREE from 'three';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass }      from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }      from 'three/addons/postprocessing/OutputPass.js';


/* ─── DATA ────────────────────────────────────────────────────────────────── */

const PRODUCTS = [

 // ── Pair 1: Face moisturizer ─────────────────────────────────────────────
  { brand: 'Tatcha', name: 'The Dewy Skin Cream', tier: 'Luxury', ppm: 1.44, price: 72, iqs: 16.58, finalScore: 25.2, grade: 'C', superstars: 1, goodies: 6, icky: 2, neutral: 32, total: 41 },
  { brand: 'e.l.f.', name: 'Hello Hydration Face Cream', tier: 'Affordable', ppm: 0.28, price: 14, iqs: 40.91, finalScore: 83.9, grade: 'S', superstars: 2, goodies: 8, icky: 1, neutral: 22, total: 33 },

  // ── Pair 2: Body moisturizer ─────────────────────────────────────────────
  { brand: "Trader Joe's", name: 'Brazil Nut Body Butter', tier: 'Affordable', ppm: 0.0254, price: 5.99, iqs: 22.3, finalScore: 40.7, grade: 'B', superstars: 1, goodies: 7, icky: 1, neutral: 29, total: 38 },
  { brand: 'Sol de Janeiro', name: 'Brazilian Bum Bum Cream', tier: 'Mid-range', ppm: 0.32, price: 24, iqs: 4.49, finalScore: 0.0, grade: 'D', superstars: 1, goodies: 4, icky: 9, neutral: 26, total: 40 },

  // ── Pair 3: Face moisturizer ─────────────────────────────────────────────
  { brand: 'La Mer', name: 'The New Moisturizing Soft Cream', tier: 'Luxury', ppm: 6.5937, price: 390, iqs: 23.24, finalScore: 28.1, grade: 'C', superstars: 1, goodies: 22, icky: 8, neutral: 55, total: 86 },
  { brand: 'CeraVe', name: 'Moisturizing Cream', tier: 'Affordable', ppm: 0.033, price: 14.99, iqs: 41.67, finalScore: 100.0, grade: 'S', superstars: 1, goodies: 7, icky: 0, neutral: 16, total: 24 },

  // ── Pair 4: Essence / toner ──────────────────────────────────────────────
  { brand: 'SK-II', name: 'Facial Treatment Essence', tier: 'Premium', ppm: 1.275, price: 190, iqs: 14.29, finalScore: 11.5, grade: 'D', superstars: 0, goodies: 1, icky: 0, neutral: 6, total: 7 },
  { brand: 'Missha', name: 'Time Revolution First Treatment Essence Intensive', tier: 'Affordable', ppm: 0.26, price: 39, iqs: 43.5, finalScore: 43.5, grade: 'B', superstars: 3, goodies: 14, icky: 1, neutral: 15, total: 33 },

  // ── Pair 5: Face moisturizer ─────────────────────────────────────────────
  { brand: 'Charlotte Tilbury', name: 'Magic Cream', tier: 'Luxury', ppm: 1.73, price: 260, iqs: 32.0, finalScore: 38.0, grade: 'C', superstars: 2, goodies: 11, icky: 4, neutral: 33, total: 50 },
  { brand: 'Olay', name: 'Regenerist Micro-Sculpting Cream', tier: 'Premium', ppm: 0.73, price: 36.65, iqs: 26.2, finalScore: 29.2, grade: 'C', superstars: 2, goodies: 7, icky: 1, neutral: 32, total: 42 },

  // ── Pair 6: Moisturizer ──────────────────────────────────────────────────
  { brand: 'SkinCeuticals', name: 'Triple Lipid Restore', tier: 'Luxury', ppm: 3.28, price: 155, iqs: 20.2, finalScore: 24.4, grade: 'C', superstars: 1, goodies: 6, icky: 5, neutral: 25, total: 37 },
  { brand: 'The Ordinary', name: 'Natural Moisturizing Factors + Phytoceramides', tier: 'Budget', ppm: 0.125, price: 12.5, iqs: 97.9, finalScore: 97.9, grade: 'S', superstars: 1, goodies: 24, icky: 0, neutral: 28, total: 53 },

  // ── Pair 7: Vitamin C serum ──────────────────────────────────────────────
  { brand: 'SkinCeuticals', name: 'C E Ferulic', tier: 'Luxury', ppm: 6.17, price: 185, iqs: 83.3, finalScore: 90.2, grade: 'S', superstars: 4, goodies: 8, icky: 0, neutral: 12, total: 24 },
  { brand: 'TruSkin', name: 'Vitamin C Super Serum+', tier: 'Premium', ppm: 0.74, price: 21.99, iqs: 76.4, finalScore: 80.6, grade: 'S', superstars: 4, goodies: 8, icky: 2, neutral: 10, total: 24 },

  // ── Pair 8: Anti-aging serum ─────────────────────────────────────────────
  { brand: 'La Prairie', name: 'Skin Caviar Liquid Lift', tier: 'Luxury', ppm: 18.17, price: 545, iqs: 8.97, finalScore: 11.05, grade: 'D', superstars: 1, goodies: 7, icky: 9, neutral: 62, total: 79 },
  { brand: 'The Ordinary', name: 'Argireline Solution 10%', tier: 'Mid-range', ppm: 0.32, price: 9.7, iqs: 9.09, finalScore: 9.09, grade: 'D', superstars: 0, goodies: 1, icky: 0, neutral: 10, total: 11 }
];

/* ─── CHART.JS GLOBAL TYPOGRAPHY ─────────────────────────────────────────── */
// Applied before any chart is created so all text uses the site font.
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Cormorant Garamond', Georgia, serif";
  Chart.defaults.font.size   = 13;
}

const PAIRS = [
  { label: 'Tatcha vs e.l.f.',                      l: 0,  r: 1  },
  { label: "Sol de Janeiro vs Trader Joe's",         l: 3,  r: 2  },
  { label: 'La Mer vs CeraVe',                      l: 4,  r: 5  },
  { label: 'SK-II vs Missha',                       l: 6,  r: 7  },
  { label: 'Charlotte Tilbury vs Olay',             l: 8,  r: 9  },
  { label: 'SkinCeuticals TLR vs The Ordinary NMF', l: 10, r: 11 },
  { label: 'SkinCeuticals CEF vs TruSkin',          l: 12, r: 13 },
  { label: 'La Prairie vs The Ordinary Argireline', l: 14, r: 15 }
];


/* ─── GRADE BADGE COLOURS ─────────────────────────────────────────────────── */

const GRADE_BADGE = {
  S: { pill: '#c4b5fd', pillText: '#1e1b4b' },
  A: { pill: '#6ee7b7', pillText: '#064e3b' },
  B: { pill: '#bef264', pillText: '#1a2e05' },
  C: { pill: '#fcd34d', pillText: '#451a03' },
  D: { pill: '#fca5a5', pillText: '#450a0a' }
};


/* ─── CONTINUOUS SCORE CONFIG ─────────────────────────────────────────────── */

function getScoreCfg(finalScore) {
  const t  = Math.max(0, Math.min(100, finalScore)) / 100;
  const t2 = Math.pow(t, 1.5);
  return {
    scatter:    0.32  - t2 * 0.31,
    spikeAmp:   0.28  - t2 * 0.28,
    uniformity: 0.18  + t2 * 0.82,
    shardScale: 0.68  + t2 * 0.42,
    rotSpeed:   0.007 - t2 * 0.004
  };
}


/* ─── COLOURS ─────────────────────────────────────────────────────────────── */

const AURA_STOPS = [
  { at: 0.00, c: new THREE.Color(0.98, 0.22, 0.44) },
  { at: 0.25, c: new THREE.Color(0.93, 0.63, 0.04) },
  { at: 0.50, c: new THREE.Color(0.92, 0.88, 0.75) },
  { at: 0.75, c: new THREE.Color(0.61, 0.78, 0.08) },
  { at: 1.00, c: new THREE.Color(0.47, 0.70, 0.65) },
];
function getAuraColor(t) {
  const tc = Math.max(0, Math.min(1, t));
  let lo = AURA_STOPS[0], hi = AURA_STOPS[AURA_STOPS.length - 1];
  for (let i = 0; i < AURA_STOPS.length - 1; i++) {
    if (tc >= AURA_STOPS[i].at && tc <= AURA_STOPS[i+1].at) { lo = AURA_STOPS[i]; hi = AURA_STOPS[i+1]; break; }
  }
  const f = lo.at === hi.at ? 0 : (tc - lo.at) / (hi.at - lo.at);
  return lo.c.clone().lerp(hi.c, f);
}

const TYPE_COLORS = {
  superstar: new THREE.Color("#FF10F0"), // neon pink
  goodie:    new THREE.Color("#39FF14"),
  icky:      new THREE.Color("#FF0000"),
  neutral:   new THREE.Color("#89CFF0") // kept more toned down
};

const TYPE_EMISSIVE = {
  superstar: new THREE.Color("#8A0080"),
  goodie:    new THREE.Color("#7D1708"),
  icky:      new THREE.Color("#7A1238"),
  neutral:   new THREE.Color("#1F165C")
};

// const TYPE_COLORS = {
//   superstar: new THREE.Color(1.000, 0.475, 0.667),  // #FF79AA
//   goodie:    new THREE.Color(0.071, 0.259, 0.122),  // #12421F
//   icky:      new THREE.Color(0.910, 0.455, 0.000),  // #E87400
//   neutral:   new THREE.Color(0.180, 0.333, 0.639)   // #2E55A3
// };

// const TYPE_EMISSIVE = {
//   superstar: new THREE.Color(0.45, 0.18, 0.28),  // #FF79AA ~45%
//   goodie:    new THREE.Color(0.03, 0.12, 0.05),  // #12421F ~40% — dark green, needs boost
//   icky:      new THREE.Color(0.40, 0.20, 0.00),  // #E87400 ~45%
//   neutral:   new THREE.Color(0.08, 0.14, 0.28)   // #2E55A3 ~45%
// };

// const TYPE_COLORS = {
//   superstar: new THREE.Color(0.169, 0.404, 0.380),  // #2B6761
//   goodie:    new THREE.Color(0.969, 0.282, 0.000),  // #F74800
//   icky:      new THREE.Color(0.412, 0.039, 0.078),  // #690A14
//   neutral:   new THREE.Color(0.212, 0.431, 0.816)   // #366ED0
// };

// const TYPE_EMISSIVE = {
//   superstar: new THREE.Color(0.07, 0.16, 0.15),  // #2B6761 ~40%
//   goodie:    new THREE.Color(0.40, 0.11, 0.00),  // #F74800 ~40%
//   icky:      new THREE.Color(0.17, 0.02, 0.03),  // #690A14 ~40%
//   neutral:   new THREE.Color(0.17, 0.27, 0.52)   // #366ED0 ~80% boosted
// };

const BLOOM_LAYER = 1;
const bloomLayer  = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER);


/* ─── LUMINOSITY ──────────────────────────────────────────────────────────── */

function getLuminosity(finalScore) {
  const t = Math.max(0, Math.min(100, finalScore)) / 100;
  return {
    t,
    bloomStrength: 0.14 + t * 0.50,
    emissiveScale: 0.06 + t * 0.36,
    ambientInt:    0.3  + t * 0.40,
    pointInt:      0.20 + t * 1.20
  };
}


/* ─── FILL LIGHT COLOUR ───────────────────────────────────────────────────── */

function getFillColor(finalScore) {
  const t = Math.max(0, Math.min(100, finalScore)) / 100;
  return getAuraColor(Math.min(1, t + 0.10));
}


/* ─── CORE GLOW COLOUR ────────────────────────────────────────────────────── */

function getCoreColor(finalScore) {
  const t = Math.max(0, Math.min(100, finalScore)) / 100;
  return getAuraColor(t).lerp(new THREE.Color(1.0, 0.98, 0.96), 0.75);
}


/* ─── GEOMETRY HELPERS ────────────────────────────────────────────────────── */

function buildShardGeometry() {
  const geo = new THREE.BufferGeometry();
  const s   = 0.5;
  const v   = new Float32Array([
     0,  s,  0,   -s*.6, -s*.4,  s*.4,    s*.6, -s*.4,  s*.4,
     0,  s,  0,    s*.6, -s*.4,  s*.4,    s*.6, -s*.4, -s*.4,
     0,  s,  0,    s*.6, -s*.4, -s*.4,   -s*.6, -s*.4, -s*.4,
     0,  s,  0,   -s*.6, -s*.4, -s*.4,   -s*.6, -s*.4,  s*.4,
    -s*.6, -s*.4,  s*.4,   s*.6, -s*.4,  s*.4,   s*.6, -s*.4, -s*.4,
    -s*.6, -s*.4,  s*.4,   s*.6, -s*.4, -s*.4,  -s*.6, -s*.4, -s*.4
  ]);
  geo.setAttribute('position', new THREE.BufferAttribute(v, 3));
  geo.computeVertexNormals();
  return geo;
}

function fibonacciSphere(n) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push([r * Math.cos(theta), y, r * Math.sin(theta)]);
  }
  return pts;
}

function buildProportionalPool(product, totalShards) {
  const { superstars, goodies, icky, neutral, total } = product;
  const counts = { superstar: superstars, goodie: goodies, icky, neutral };
  const types  = [];
  for (let i = 0; i < totalShards; i++) {
    const pos = (i / totalShards) * total;
    let cumulative = 0, assigned = 'neutral';
    for (const [type, count] of Object.entries(counts)) {
      cumulative += count;
      if (pos < cumulative) { assigned = type; break; }
    }
    types.push(assigned);
  }
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.abs(Math.sin(i * 9301 + 49297)) * types.length);
    [types[i], types[j]] = [types[j], types[i]];
  }
  return types;
}


/* ─── SHARD SPHERE WITH BLOOM ─────────────────────────────────────────────── */

class ShardSphere {
  constructor(canvasId, product) {
    this.canvas    = document.getElementById(canvasId);
    this.product   = product;
    this.group     = new THREE.Group();
    this.materials = {};
    this._init();
  }

  _init() {
    const p   = this.product;
    const cfg = getScoreCfg(p.finalScore);
    const lum = getLuminosity(p.finalScore);
    const W   = this.canvas.parentElement.clientWidth || 500;
    const H   = 400;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setSize(W, H);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x111111, 1);
    this.renderer.toneMapping         = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 0.98;

    this.scene  = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    this.camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 100);
    this.camera.position.z = 3.8;

    const shardGeo    = buildShardGeometry();
    const totalShards = Math.min(Math.max(p.total * 20, 300), 1800);
    const typePool    = buildProportionalPool(p, totalShards);
    const pts         = fibonacciSphere(totalShards);
    const shardScale  = cfg.shardScale * 0.11;

//     for (let i = 0; i < totalShards; i++) {
//   const type   = typePool[i];
//   const baseCol     = TYPE_COLORS[type].clone();
//   const emissiveCol = TYPE_EMISSIVE[type].clone();
//   const emMult = lum.emissiveScale * (
//     type === 'superstar' ? 1.8 :
//     type === 'goodie'    ? 1.3 :
//     type === 'icky'      ? 0.9 :
//     /* neutral */          1.2
//   );
//   const mat = new THREE.MeshPhongMaterial({
//     color:       baseCol,
//     emissive:    emissiveCol.clone().multiplyScalar(emMult),
//     shininess:   60 + lum.t * 120,
//     flatShading: true
//   });
//   const mesh = new THREE.Mesh(shardGeo, mat);
//   let [x, y, z] = pts[i];
//   if (cfg.uniformity < 1.0) {
//     const j = (1 - cfg.uniformity) * 0.4;
//     x += (Math.random() - 0.5) * j;
//     y += (Math.random() - 0.5) * j;
//     z += (Math.random() - 0.5) * j;
//   }
//   const spike =
//     type === 'icky'      ? cfg.spikeAmp * (0.8 + Math.random() * 1.6) :
//     type === 'superstar' ? Math.random() * 0.04 - 0.02 :
//                            cfg.spikeAmp * Math.random() * 0.15;
//   const r = 1.0 + spike + cfg.scatter * (Math.random() - 0.5) * 0.5;
//   mesh.position.set(x * r, y * r, z * r);
//   const sizeBoost = type === 'superstar' ? 1.5 : type === 'goodie' ? 1.1 : type === 'neutral' ? 1.0 : 0.9;
//   mesh.scale.setScalar(shardScale * sizeBoost * (0.6 + Math.random() * 0.8));
//   mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
//   if (type === 'superstar' || type === 'goodie' || type === 'neutral') mesh.layers.enable(BLOOM_LAYER);
//   this.group.add(mesh);
// }

for (let i = 0; i < totalShards; i++) {
  const type   = typePool[i];
  const baseCol     = TYPE_COLORS[type].clone();
  const emissiveCol = TYPE_EMISSIVE[type].clone();
  const emMult = lum.emissiveScale * (
    type === 'superstar' ? 1.8 :
    type === 'goodie'    ? 2.0 :  // boosted — dark green needs extra emissive to read
    type === 'icky'      ? 1.3 :
    /* neutral */          1.4
  );
  const mat = new THREE.MeshPhongMaterial({
    color:       baseCol,
    emissive:    emissiveCol.clone().multiplyScalar(emMult),
    shininess:   60 + lum.t * 120,
    flatShading: true
  });
  const mesh = new THREE.Mesh(shardGeo, mat);
  let [x, y, z] = pts[i];
  if (cfg.uniformity < 1.0) {
    const j = (1 - cfg.uniformity) * 0.4;
    x += (Math.random() - 0.5) * j;
    y += (Math.random() - 0.5) * j;
    z += (Math.random() - 0.5) * j;
  }
  const spike =
    type === 'icky'      ? cfg.spikeAmp * (0.8 + Math.random() * 1.6) :
    type === 'superstar' ? Math.random() * 0.04 - 0.02 :
                           cfg.spikeAmp * Math.random() * 0.15;
  const r = 1.0 + spike + cfg.scatter * (Math.random() - 0.5) * 0.5;
  mesh.position.set(x * r, y * r, z * r);
  const sizeBoost = type === 'superstar' ? 1.5 : type === 'goodie' ? 1.1 : type === 'neutral' ? 1.0 : 0.9;
  mesh.scale.setScalar(shardScale * sizeBoost * (0.6 + Math.random() * 0.8));
  mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
  if (type === 'superstar' || type === 'goodie' || type === 'neutral') mesh.layers.enable(BLOOM_LAYER);
  this.group.add(mesh);
}


    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.70, 32, 32),
      new THREE.MeshBasicMaterial({ color: getCoreColor(p.finalScore), transparent: true, opacity: 0.14 + lum.t * 0.24 })
    );
    core.layers.enable(BLOOM_LAYER);
    this.group.add(core);
    this.scene.add(this.group);

    this.scene.add(new THREE.AmbientLight(0xffffff, lum.ambientInt));
    const key = new THREE.DirectionalLight(0xffffff, 0.6 + lum.t * 0.8);
    key.position.set(3, 4, 5);
    this.scene.add(key);
    const fill = new THREE.PointLight(getFillColor(p.finalScore), lum.pointInt, 12);
    fill.position.set(-1.5, -1, 2.5);
    this.scene.add(fill);
    const rim = new THREE.PointLight(0x88aaff, lum.t * 1.5, 8);
    rim.position.set(1, 2, -3);
    this.scene.add(rim);

    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass   = new UnrealBloomPass(new THREE.Vector2(W, H), lum.bloomStrength, 0.4, 0.0);
    const bloomRT     = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
    this.bloomComposer = new EffectComposer(this.renderer, bloomRT);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(renderScene);
    this.bloomComposer.addPass(bloomPass);

    const mixPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture:   { value: null },
          bloomTexture:  { value: this.bloomComposer.renderTarget2.texture },
          bloomStrength: { value: lum.bloomStrength }
        },
        vertexShader:   document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent
      }),
      'baseTexture'
    );
    mixPass.needsSwap = true;

    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.addPass(renderScene);
    this.finalComposer.addPass(mixPass);
    this.finalComposer.addPass(new OutputPass());

    this._darkMat = new THREE.MeshBasicMaterial({ color: 'black' });
    this._animate();
  }

  _darkenNonBloomed(obj) {
    if (obj.isMesh && !bloomLayer.test(obj.layers)) {
      this.materials[obj.uuid] = obj.material;
      obj.material = this._darkMat;
    }
  }

  _restoreMaterial(obj) {
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid];
      delete this.materials[obj.uuid];
    }
  }

  _render() {
    this.scene.traverse(obj => this._darkenNonBloomed(obj));
    this.bloomComposer.render();
    this.scene.traverse(obj => this._restoreMaterial(obj));
    this.finalComposer.render();
  }

  _animate() {
    const { rotSpeed } = getScoreCfg(this.product.finalScore);
    this.raf = requestAnimationFrame(() => this._animate());
    this.group.rotation.y += rotSpeed;
    this.group.rotation.x += rotSpeed * 0.25;
    this._render();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.bloomComposer.dispose();
    this.finalComposer.dispose();
    this.renderer.dispose();
  }
}


/* ─── UI ──────────────────────────────────────────────────────────────────── */

function gradeTag(grade) {
  const { pill, pillText } = GRADE_BADGE[grade];
  return `<span class="grade-pill" style="background:${pill}; color:${pillText}">${grade}</span>`;
}

let currentPairIdx = 0;

function setLabel(side, p, productIdx) {
  document.getElementById(`i${side}`).innerHTML = `
    <div class="brand-name">${p.tier} · $${p.ppm.toFixed(2)}/ml</div>
    <div class="prod-name prod-name-clickable" data-idx="${productIdx}" title="Click for ingredient breakdown">
      ${p.brand} ${p.name} ${gradeTag(p.grade)}
      <span class="prod-name-hint">↗</span>
    </div>
    <div class="stats">
      <div class="st">IQS <b>${p.iqs.toFixed(1)}</b></div>
      <div class="st">Final <b>${p.finalScore.toFixed(1)}</b></div>
      <div class="st">Superstars <b>${p.superstars}</b></div>
      <div class="st">Goodies <b>${p.goodies}</b></div>
      <div class="st">Icky <b>${p.icky}</b></div>
      <div class="st">Price <b>$${p.price}</b></div>
    </div>`;

  document.querySelector(`#i${side} .prod-name-clickable`).addEventListener('click', () => {
    openProductModal(productIdx);
  });
}


/* ─── PRODUCT MODAL ───────────────────────────────────────────────────────── */

let modalChart = null;

function openProductModal(productIdx) {
  const p   = PRODUCTS[productIdx];
  const ing = INGREDIENTS[productIdx];
  const { pill, pillText } = GRADE_BADGE[p.grade];

  // Create modal if it doesn't exist
  let modal = document.getElementById('product-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop"></div>
      <div class="modal-panel">
        <button class="modal-close" id="modal-close">✕</button>
        <div class="modal-header">
          <div class="modal-tier" id="modal-tier"></div>
          <div class="modal-title" id="modal-title"></div>
          <div class="modal-meta" id="modal-meta"></div>
        </div>
        <div class="modal-ing-section" id="modal-ing-section"></div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('modal-close').onclick    = closeProductModal;
    document.getElementById('modal-backdrop').onclick = closeProductModal;
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProductModal(); });
  }

  // Populate header
  document.getElementById('modal-tier').textContent  = `${p.tier} · $${p.ppm.toFixed(2)}/ml`;
  document.getElementById('modal-title').innerHTML   = `${p.brand} <span style="font-weight:400;opacity:.7">${p.name}</span> <span class="grade-pill" style="background:${pill};color:${pillText}">${p.grade}</span>`;
  document.getElementById('modal-meta').innerHTML    = `
    <span>IQS <b>${p.iqs.toFixed(1)}</b></span>
    <span>Final Score <b>${p.finalScore.toFixed(1)}</b></span>
    <span>Total ingredients <b>${p.total}</b></span>
    <span>Price <b>$${p.price}</b></span>`;

  // Build chart
  // if (modalChart) { modalChart.destroy(); modalChart = null; }

  // const ctx = document.getElementById('modal-chart');
  // modalChart = new Chart(ctx, {
  //   type: 'bar',
  //   data: {
  //     labels: [`${p.brand} — ${p.name}`],
  //     datasets: [
  //       { label: `Superstar (${p.superstars})`, data: [p.superstars], backgroundColor: 'rgba(255,145,20,0.25)',  borderColor: 'rgba(255,145,20,0.65)',  borderWidth: 1 },
  //       { label: `Goodie (${p.goodies})`,        data: [p.goodies],    backgroundColor: 'rgba(230,55,30,0.25)',   borderColor: 'rgba(230,55,30,0.65)',   borderWidth: 1 },
  //       { label: `Icky (${p.icky})`,              data: [p.icky],       backgroundColor: 'rgba(210,30,90,0.25)',   borderColor: 'rgba(210,30,90,0.65)',   borderWidth: 1 },
  //       { label: `Neutral (${p.neutral})`,        data: [p.neutral],    backgroundColor: 'rgba(58,40,160,0.25)',   borderColor: 'rgba(58,40,160,0.65)',   borderWidth: 1 }
  //     ]
  //   },
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     indexAxis: 'y',
  //     scales: {
  //         x: { stacked: true, grid: { color: 'rgba(20,20,20,0.08)' }, ticks: { color: 'rgba(20,20,20,0.55)', font: { size: 11, family: "'Cormorant Garamond', Georgia, serif"} }, title: { display: true, text: 'Number of ingredients', color: 'rgba(20,20,20,0.38)', font: { size: 10, family: "'Cormorant Garamond', Georgia, serif"} } },
  //         y: { stacked: true, grid: { display: false }, ticks: { color: 'rgba(20,20,20,0.60)', font: { size: 11, family: "'Cormorant Garamond', Georgia, serif"} } }
  //       },
  //     plugins: {
  //       legend: {
  //         display: true,
  //         position: 'bottom',
  //         labels: { color: 'rgba(20,20,20,0.65)', font: { size: 11, family: "'Cormorant Garamond', Georgia, serif"}, boxWidth: 12, padding: 16 }
  //       },
  //       tooltip: {
  //         backgroundColor: 'rgba(252,248,246,0.97)',
  //         titleColor: 'rgba(20,20,20,0.85)',
  //         bodyColor: 'rgba(20,20,20,0.60)',
  //         borderColor: 'rgba(140,110,90,0.20)',
  //         borderWidth: 1,
  //         padding: 10,
  //         callbacks: {
  //           label: ctx => ` ${ctx.dataset.label}: ${ctx.raw} ingredients`
  //         }
  //       }
  //     }
  //   }
  // });

  // Ingredient tags by category
  const section = document.getElementById('modal-ing-section');
  const cats = [
  { key: 'icky',      label: 'Icky — what to avoid', color: '#FF0000', cls: 'ing-tag-icky'      },
  { key: 'superstar', label: 'Superstar actives',     color: '#FF10F0', cls: 'ing-tag-superstar' },
  { key: 'goodie',    label: 'Goodies',               color: '#39FF14', cls: 'ing-tag-goodie'    },
  { key: 'neutral',   label: 'Neutral',               color: '#89CFF0', cls: 'ing-tag-neutral'   },
];

  section.innerHTML = cats.map(cat => `
    <div class="modal-ing-category">
      <div class="modal-ing-label">
        <div class="ing-category-dot" style="background:${cat.color}"></div>
        ${cat.label}
        <span class="modal-ing-count">${ing[cat.key].length}</span>
      </div>
      <div class="ing-tags">
        ${ing[cat.key].length
          ? ing[cat.key].map(i => `<span class="ing-tag ${cat.cls}">${i}</span>`).join('')
          : `<span class="ing-empty">None</span>`}
      </div>
    </div>
  `).join('');

  // Show modal
  modal.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('modal-open');
  document.body.style.overflow = '';
}


/* ─── PAIR LOADER ─────────────────────────────────────────────────────────── */

let viewers = [];

function loadPair(idx) {
  currentPairIdx = idx;
  viewers.forEach(v => v.destroy());
  viewers = [];
  document.querySelectorAll('.pb').forEach((btn, i) => btn.classList.toggle('active', i === idx));
  const { l, r } = PAIRS[idx];
  viewers.push(new ShardSphere('cl', PRODUCTS[l]));
  viewers.push(new ShardSphere('cr', PRODUCTS[r]));
  setLabel('l', PRODUCTS[l], l);
  setLabel('r', PRODUCTS[r], r);
  updateAnalysis(idx);
}


let barChart = null;

/* ─── INGREDIENT LISTS PER PRODUCT ───────────────────────────────────────── */
/*
 * Data sourced from long format CSV — INCIDecoder ratings.
 * Index matches PRODUCTS array order exactly.
 */

const INGREDIENTS = [

  // 0 — Tatcha The Dewy Skin Cream
  {
    superstar: ['Glycerin'],
    goodie:    ['Saccharomyces/Camellia Sinensis Leaf/Cladosiphon Okamuranus/Rice Ferment Filtrate*', 'Squalane', 'Chondrus Crispus Extract', 'Panax Ginseng Root Extract', 'Sodium Hyaluronate', 'Phytosteryl Macadamiate'],
    icky:      ['Parfum/Fragrance', 'Alcohol'],
    neutral:   ['Aqua/Water/Eau', 'Propanediol', 'Dimethicone', 'Diisostearyl Malate', 'Behenyl Alcohol', 'Myristyl Myristate', 'Dipentaerythrityl Hexahydroxystearate', 'Bis-Diglyceryl Polyacyladipate-2', 'Tridecyl Trimellitate', 'Betaphycus Gelatinum Extract', 'Eisenia Arborea Extract', 'Oryza Sativa (Rice) Bran Extract', 'Origanum Majorana Leaf Extract', 'Thymus Serpyllum Extract', 'Malva Sylvestris (Mallow) Flower Extract', 'Inositol', 'Gold', 'Sericin', 'Butylene Glycol', 'Beheneth-20', 'Sorbitan Tristearate', 'Disodium EDTA', 'Dimethicone/Vinyl Dimethicone Crosspolymer', 'Sodium Acrylate/Acryloyldimethyltaurate/Dimethylacrylamide Crosspolymer', 'Caprylyl/Capryl Glucoside', 'Sorbitan Isostearate', 'Ethylhexylglycerin', 'Phenoxyethanol', 'Mica (CI 77019)', 'Titanium Dioxide (CI 77891)', 'Tin Oxide (CI 77861)', 'Violet 2 (CI 60725)']
  },

  // 1 — e.l.f. Hello Hydration Face Cream
  {
    superstar: ['Glycerin', 'Niacinamide'],
    goodie:    ['Cetearyl Olivate', 'Trehalose', 'Squalane', 'Sodium Hyaluronate', 'Palmitoyl Tripeptide-1', 'Palmitoyl Tetrapeptide-7', 'Panthenol (Vb5)', 'Sorbitan Olivate'],
    icky:      ['Fragrance (Parfum)'],
    neutral:   ['Water (Aqua)', 'Isohexadecane', 'Stearyl Heptanoate', 'Butylene Glycol', 'Isopropyl Isostearate', 'Dimethicone', 'Stearic Acid', 'Aluminum Starch Octenylsuccinate', 'Polymethylsilsesquioxane', 'Silica', 'Cetearyl Alcohol', 'Glyceryl Stearate', 'PEG-100 Stearate', 'Polyethylene', 'Disodium EDTA', 'Polyacrylate-13', 'Polyisobutene', 'Polysorbate 20', 'Caprylyl Glycol', 'Phenoxyethanol', 'Ethylhexylglycerin', 'Carbomer']
  },

  // 2 — Trader Joe's Brazil Nut Body Butter
  {
    superstar: ['Glycerin'],
    goodie:    ['Cocos Nucifera (Coconut) Oil', 'Butyrospermum Parkii (Shea) Butter', 'Tocopherol', 'Aloe Barbadensis Leaf Extract', 'Centella Asiatica Extract', 'Chamomilla Recutita (Matricaria) Flower Extract', 'Rosmarinus Officinalis (Rosemary) Leaf Extract'],
    icky:      ['Fragrance'],
    neutral:   ['Water (Aqua)', 'Cetyl Alcohol', 'Caprylic/Capric Triglyceride', 'Glyceryl Stearate SE', 'Stearyl Alcohol', 'Bertholletia Excelsa Seed (Brazil Nut) Oil', 'Polysorbate 20', 'Euterpe Oleracea Fruit Extract', 'Dimethicone', 'Phenoxyethanol', 'Carbomer', 'Ethylhexylglycerin', 'Sodium Hydroxide', 'Sodium Benzoate', 'Paullinia Cupana Seed Extract', 'Potassium Sorbate', 'Maltodextrin', 'Disodium EDTA', 'Tocopheryl Acetate', 'Althaea Officinalis Root Extract', 'Citrus Aurantium Dulcis (Orange) Peel Extract', 'Citrus Grandis (Grapefruit) Fruit Extract', 'Citrus Limon (Lemon) Peel Extract', 'Cymbopogon Schoenanthus Leaf/Stem Extract', 'Equisetum Arvense Extract', 'Humulus Lupulus (Hops) Extract', 'Salvia Sclarea (Clary) Extract', 'Vaccinium Myrtillus Fruit/Leaf Extract', 'Yucca Schidigera Leaf/Root/Stem Extract']
  },

  // 3 — Sol de Janeiro Brazilian Bum Bum Cream
  {
    superstar: ['Glycerin'],
    goodie:    ['Sodium Hyaluronate', 'Cocos Nucifera (Coconut) Oil', 'Squalane', 'Tocopherol'],
    icky:      ['Parfum (Fragrance)', 'Benzyl Benzoate', 'Benzyl Salicylate', 'Citral', 'Coumarin', 'Eugenol', 'Butylphenyl Methylpropional', 'Limonene', 'Linalool'],
    neutral:   ['Aqua (Water, Eau)', 'Methyl Glucose Sesquistearate', 'Phenyl Trimethicone', 'Dodecane', 'Caprylic/Capric Triglyceride', 'Cetearyl Alcohol', 'Cetyl Alcohol', 'Glyceryl Stearate Citrate', 'Euterpe Oleracea (Açaí) Fruit Oil', 'Theobroma Grandiflorum (Cupuaçu) Seed Butter', 'Bertholletia Excelsa Seed Oil', 'Paullinia Cupana Seed Extract', 'Ilex Guayusa Leaf Extract', 'Ilex Paraguariensis Leaf Extract', 'Bixa Orellana Seed Extract', 'Daucus Carota Sativa (Carrot) Seed Oil', 'Sodium Phytate', 'Sodium Stearoyl Glutamate', 'Glyceryl Caprylate', 'Ethylhexylglycerin', 'Xanthan Gum', 'Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer', 'Sorbitan Isostearate', 'Phenoxyethanol', 'Mica', 'Benzyl Alcohol']
  },

  // 4 — La Mer The New Moisturizing Soft Cream
  {
    superstar: ['Glycerin'],
    goodie:    ['Algae Extract', 'Petrolatum', 'Cholesterol', 'Butyrospermum Parkii (Shea) Butter', 'Macadamia Integrifolia Seed Oil', 'Sesamum Indicum (Sesame) Seed Oil', 'Copper Gluconate', 'Zinc Gluconate', 'Salicornia Herbacea Extract', 'Rosmarinus Officinalis (Rosemary) Leaf Extract', 'Sodium Hyaluronate', 'Acetyl Hexapeptide-8', 'Caffeine', 'Tetrahexyldecyl Ascorbate', 'Palmitoyl Hexapeptide-12', 'Sodium PCA', 'Sucrose', 'Trehalose', 'Tetradecyl Aminobutyroylvalylaminobutyric Urea Trifluoroacetate', 'Urea', 'Glucose', 'Lecithin'],
    icky:      ['Eucalyptus Globulus (Eucalyptus) Leaf Oil', 'Alcohol Denat', 'Fragrance (Parfum)', 'Limonene', 'Linalool', 'Hydroxycitronellal', 'Citronellol', 'Geraniol'],
    neutral:   ['Cyclopentasiloxane', 'Glyceryl Distearate', 'Phenyl Trimethicone', 'Cyclohexasiloxane', 'Butylene Glycol', 'Steareth-10', 'Dimethicone', 'Glyceryl Stearate SE', 'Polysilicone-11', 'Glyceryl Triacetyl Ricinoleate', 'Medicago Sativa Seed Powder', 'Helianthus Annuus (Sunflower) Seedcake', 'Prunus Amygdalus Dulcis (Sweet Almond) Seed Meal', 'Sodium Gluconate', 'Calcium Gluconate', 'Magnesium Gluconate', 'Tocopheryl Succinate', 'Niacin', 'Sesamum Indicum (Sesame) Seed Powder', 'Water/Aqua/Eau', 'Citrus Aurantifolia (Lime) Peel Extract', 'Laminaria Digitata Extract', 'Crithmum Maritimum Extract', 'Plankton Extract', 'Chlorella Vulgaris Extract', 'Tocopheryl Acetate', 'Caprylic/Capric Triglyceride', 'Triethylhexanoin', 'Cetyl Alcohol', 'Diethylhexyl Succinate', 'Isocetyl Stearoyl Stearate', 'Cyanocobalamin', 'C13-14 Isoparaffin', 'Distearyldimonium Chloride', 'Dipalmitoyl Hydroxyproline', 'Hydrogenated Vegetable Oil', 'Hydrolyzed Algin', 'Micrococcus Lysate', 'Sea Salt/Maris Sal/Sel Marin', 'Lactoperoxidase', 'Glucose Oxidase', 'Polyacrylamide', 'Glyceryl Polymethacrylate', 'PEG-8', 'Laureth-7', 'Triacetin', 'Sodium Chloride', 'Polyquaternium-51', 'Potassium Phosphate', 'BHT', 'Disodium EDTA', 'Sorbic Acid', 'Chlorphenesin', 'Potassium Sorbate', 'Phenoxyethanol']
  },

  // 5 — CeraVe Moisturizing Cream
  {
    superstar: ['Glycerin'],
    goodie:    ['Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Phytosphingosine', 'Cholesterol', 'Hyaluronic Acid', 'Petrolatum'],
    icky:      [],
    neutral:   ['Aqua', 'Cetearyl Alcohol', 'Caprylic/Capric Triglyceride', 'Cetyl Alcohol', 'Ceteareth-20', 'Sodium Lauroyl Lactylate', 'Dimethicone', 'Behentrimonium Methosulfate', 'Potassium Phosphate', 'Dipotassium Phosphate', 'Phenoxyethanol', 'Methylparaben', 'Propylparaben', 'Disodium EDTA', 'Carbomer', 'Xanthan Gum']
  },

  // 6 — SK-II Facial Treatment Essence
  {
    superstar: [],
    goodie:    ['Galactomyces Ferment Filtrate'],
    icky:      [],
    neutral:   ['Butylene Glycol', 'Pentylene Glycol', 'Water', 'Sodium Benzoate', 'Methylparaben', 'Sorbic Acid']
  },

  // 7 — Missha Time Revolution First Treatment Essence Intensive
  {
    superstar: ['Niacinamide', 'Glycerin', 'Lactic Acid'],
    goodie:    ['Saccharomyces Ferment Filtrate', 'Bifida Ferment Lysate', 'Amaranthus Caudatus Seed Extract', 'Betaine', 'Ulmus Davidiana Root Extract', 'Trehalose', 'Hydrogenated Lecithin', 'Beta Vulgaris (Beet) Root Extract', 'Phellodendron Amurense Bark Extract', 'Cassia Alata Leaf Extract', 'Adenosine', 'Raffinose', 'Sodium Hyaluronate', 'Hexapeptide-9'],
    icky:      ['Piper Methysticum Leaf/Root/Stem Extract'],
    neutral:   ['Propanediol', 'Polyquaternium-51', 'Pentylene Glycol', 'Water', 'Hydrolyzed Corn Starch', 'Phenoxyethanol', 'Disodium Edta', 'Ethylhexylglycerin', 'Butylene Glycol', 'Tromethamine', 'Acetic Acid', '1,2-Hexanediol', 'Caprylyl Glycol', 'Potassium Sorbate']
  },

  // 8 — Charlotte Tilbury Magic Cream
  {
    superstar: ['Glycerin', 'Ascorbic Acid'],
    goodie:    ['Butyrospermum Parkii (Shea) Butter', 'Avena Sativa (Oat) Kernel Extract', 'Allantoin', 'Aloe Barbadensis Leaf Juice', 'Camellia Oleifera Seed Oil', 'Helianthus Annuus (Sunflower) Seed Oil', 'Sodium Lactate', 'Sodium Hyaluronate', 'Tocopherol', 'Palmitoyl Tetrapeptide-7', 'Palmitoyl Tripeptide-1'],
    icky:      ['Ascorbyl Palmitate', 'Linalool', 'Citronellol', 'Geraniol'],
    neutral:   ['Aqua/Water/Eau', 'C12-15 Alkyl Benzoate', 'Glyceryl Stearate SE', 'Butylene Glycol', 'Olus Oil/Vegetable Oil/Huile Végétale', 'Isononyl Isononanoate', 'Cetyl Alcohol', 'Ethylhexyl Palmitate', 'Cyclopentasiloxane', 'Dimethicone', 'Polyester-7', 'Phenoxyethanol', 'Neopentyl Glycol Diheptanoate', 'Steareth-21', 'Carbomer', 'Dimethiconol', 'Potassium Cetyl Phosphate', 'Chlorphenesin', 'Caprylyl Glycol', 'Xanthan Gum', 'Hydrolyzed Viola Tricolor Extract', 'Disodium EDTA', 'Tocopheryl Acetate', 'Rosa Canina Fruit Oil', 'Rosa Damascena Extract', 'Sodium Hydroxide', 'Michelia Alba Leaf Oil', 'Coco-Glucoside', 'PEG-8', 'Ethylhexylglycerin', 'Plumeria Rubra Flower Extract', 'Citric Acid', 'Nicotiana Sylvestris Leaf Cell Culture']
  },

  // 9 — Olay Regenerist Micro-Sculpting Cream
  {
    superstar: ['Glycerin', 'Niacinamide (Vitamin B3)'],
    goodie:    ['Panthenol (Pro-Vitamin B5)', 'Sodium Hyaluronate', 'Palmitoyl Pentapeptide-4 (Amino-Peptide)', 'Camellia Sinensis Leaf Extract (Green Tea)', 'Aloe Barbadensis Leaf Juice (Aloe Vera)', 'Allantoin', 'Titanium Dioxide'],
    icky:      ['Fragrance'],
    neutral:   ['Water', 'Isohexadecane', 'Isopropyl Isostearate', 'Aluminum Starch Octenylsuccinate', 'Nylon-12', 'Dimethicone', 'Tocopheryl Acetate (Vitamin E)', 'Stearyl Alcohol', 'Polyethylene', 'Cetyl Alcohol', 'Sodium Acrylates Copolymer', 'Behenyl Alcohol', 'Benzyl Alcohol', 'Acrylamide/Sodium Acryloyldimethyltaurate Copolymer', 'Dimethiconol', 'Sodium Peg-7 Olive Oil Carboxylate', 'Peucedanum Graveolens (Dill) Extract', 'Peg-100 Stearate', 'Stearic Acid', 'Disodium Edta', 'Cetearyl Glucoside', 'Cetearyl Alcohol', 'Citric Acid', 'C12-13 Pareth-3', 'Laureth-7', 'C13-14 Isoparaffin', 'Sodium Hydroxide', 'Caprylic/Capric Triglyceride', 'Ethylparaben', 'Methylparaben', 'Propylparaben', 'Mica']
  },

  // 10 — SkinCeuticals Triple Lipid Restore
  {
    superstar: ['Glycerin'],
    goodie:    ['Cholesterol', 'Ceramide 3', 'Helianthus Annuus Seed Oil Unsaponifiables/Sunflower Seed Oil Unsaponifiables', 'Adenosine', 'Ceramide Eop', 'Tocopherol'],
    icky:      ['Lavandula Angustifolia Oil/Lavender Oil', 'Rosmarinus Officinalis Leaf Oil/Rosemary Leaf Oil', 'Mentha Piperita Oil/Peppermint Oil', 'Linalool', 'Limonene'],
    neutral:   ['Aqua/Water/Eau', 'Dimethicone', 'Hydrogenated Polyisobutene', 'C12-15 Alkyl Benzoate', 'Bis-Peg-18 Methyl Ether Dimethyl Silane', 'Sodium Polyacrylate', 'Peg-10 Dimethicone', 'Nylon-12', 'Lauryl Peg-9 Polydimethylsiloxyethyl Dimethicone', 'Dimethicone/Peg-10/15 Crosspolymer', 'Phenoxyethanol', 'Disteardimonium Hectorite', 'Hydroxyethylpiperazine Ethane Sulfonic Acid', 'Ammonium Polyacryloyldimethyl Taurate', 'Chlorphenesin', 'Caprylyl Glycol', 'Peg/Ppg-18/18 Dimethicone', 'Propylene Carbonate', 'Disodium Edta', 'Acrylonitrile/Methyl Methacrylate/Vinylidene Chloride Copolymer', 'Dipropylene Glycol', 'T-Butyl Alcohol', 'Sodium Citrate', 'Isobutane', 'Bht']
  },

  // 11 — The Ordinary Natural Moisturizing Factors + Phytoceramides
  {
    superstar: ['Glycerin'],
    goodie:    ['Isosorbide Dicaprylate', 'Linoleic Acid', 'Arginine', 'Glycine', 'Alanine', 'Serine', 'Proline', 'Threonine', 'Betaine', 'Xylitylglucoside', 'Anhydroxylitol', 'Xylitol', 'Glucose', 'Fructose', 'Trehalose', 'Sodium PCA', 'Pca', 'Sodium Lactate', 'Urea', 'Allantoin', 'Sodium Hyaluronate', 'Lecithin', 'Tocopherol', 'Hydroxymethoxyphenyl Decanone'],
    icky:      [],
    neutral:   ['Aqua (Water)', 'Caprylic/Capric Triglyceride', 'Cetyl Ethylhexanoate', 'Isodecyl Neopentanoate', 'Propanediol', 'Polyglyceryl-6 Polyricinoleate', 'Hydrogenated Vegetable Oil', 'Polyglyceryl-2 Isostearate', 'Disteardimonium Hectorite', 'Phytosteryl Canola Glycerides', 'Glycosphingolipids', 'Glycolipids', 'Oleic Acid', 'Palmitic Acid', 'Stearic Acid', 'Glutamic Acid', 'Lysine Hcl', 'Maltose', 'Triolein', 'Dimethyl Isosorbide', 'Pentylene Glycol', 'Citric Acid', 'Trisodium Ethylenediamine Disuccinate', 'Magnesium Sulfate', 'Sodium Chloride', 'Sodium Hydroxide', 'Phenoxyethanol', 'Chlorphenesin']
  },

  // 12 — SkinCeuticals C E Ferulic
  {
    superstar: ['L Ascorbic Acid', 'Glycerin'],
    goodie:    ['Alpha Tocopherol', 'Ferulic Acid', 'Panthenol', 'Sodium Hyaluronate'],
    icky:      [],
    neutral:   ['Water', 'Ethoxydiglycol', 'Propylene Glycol', 'Laureth 23', 'Phenoxyethanol', 'Triethanolamine']
  },

  // 13 — TruSkin Vitamin C Super Serum+
  {
    superstar: ['Vitamin C (Sodium Ascorbyl Phosphate)', 'Retinol', 'Niacinamide (Vitamin B3)', 'Salicylic Acid'],
    goodie:    ['Aloe', 'Gotu Kola', 'Botanical Hyaluronic Acid', 'Organic Rosehip Seed Oil', 'Squalane (Olive Oil)', '(25)-2-Amino-5-Guanidinopentanoic Acid', 'Organic Aloe', 'Organic Gotu Kola'],
    icky:      ['Geranium', 'Essential Oils (Pink Grapefruit, Lavender, Ylang Ylang)'],
    neutral:   ['Water', 'Equisetum Arvense (Horsetail)', 'Dandelion', 'Dimethyl Sulfone (Msm)', 'Wildcrafted Horsetail Extract', 'Wildcrafted Dandelion', 'Wildcrafted Geranium Extract', 'Carbomer', 'Phenoxyethanol', 'Ethyl Hexyl Glycerine']
  },

  // 14 — La Prairie Skin Caviar Liquid Lift
  {
    superstar: ['Glycerin'],
    goodie:    ['Panax Ginseng Root Extract*', 'Sodium Hyaluronate', 'Avena Sativa (Oat) Kernel Extract', 'Palmitoyl Tripeptide-1', 'Palmitoyl Tetrapeptide-7', 'Ceramide NP', 'Tocopherol'],
    icky:      ['Sd Alcohol 40-B (Alcohol Denat.)', 'Alcohol', 'Fragrance (Parfum)', 'Linalool', 'Benzyl Salicylate', 'Citronellol', 'Geraniol', 'Alpha-Isomethyl Ionone', 'Limonene'],
    neutral:   ['Water (Aqua)', 'Sodium Citrate', 'Caprylic/Capric/Succinic Triglyceride', 'Propylheptyl Caprylate', 'Undecane', 'Glycoproteins*', 'Equisetum Arvense Extract*', 'Caviar Extract', 'Caviar Oil', 'Pullulan', 'Lactobacillus Ferment', 'Caulerpa Lentillifera Extract', 'Acmella Oleracea Extract', 'Paeonia Albiflora Root Extract', 'Saccharomyces Cerevisiae Extract', 'Sodium Dna', 'Rna', 'Hydrolyzed Rice Bran Protein', 'Tetrapeptide-3', 'Helianthus Annuus (Sunflower) Seed Oil', 'Caprylic/Capric Triglyceride', 'Glycine Soja (Soybean) Oil', 'Pentylene Glycol', 'Propanediol', 'Butylene Glycol', 'Propylene Glycol', 'Silica', 'Dimethicone', 'Tridecane', 'Arachidyl Alcohol', 'Sodium Stearoyl Glutamate', 'Behenyl Alcohol', 'Xanthan Gum', 'Arachidyl Glucoside', 'Hydroxyethylcellulose', 'Dimethicone Crosspolymer', 'Polysilicone-11', 'Carrageenan', 'Polyglyceryl-10 Stearate', 'Algin', 'Sodium Lactate', 'Mica (CI 77019)', 'Carbomer', 'Coco-Glucoside', 'Hydrogenated Lecithin', 'Sucrose Stearate', 'Alcaligenes Polysaccharides', 'Glycine', 'Polysorbate 80', 'Synthetic Fluorphlogopite', 'Sodium Lauryl Sulfate', 'Sodium Oleate', 'Tin Oxide', 'Ethylhexylglycerin', 'Sodium Hydroxide', 'Hydroxyethylpiperazine Ethane Sulfonic Acid', 'Disodium EDTA', 'Phenoxyethanol', 'Phenethyl Alcohol', 'Sodium Dehydroacetate', 'Titanium Dioxide (CI 77891)', 'Iron Oxides (CI 77491)']
  },

  // 15 — The Ordinary Argireline Solution 10%
  {
    superstar: [],
    goodie:    ['Acetyl Hexapeptide-8'],
    icky:      [],
    neutral:   ['Aqua (Water)', 'Propanediol', 'Trisodium Ethylenediamine Disuccinate', 'Gellan Gum', 'Sodium Chloride', 'Isoceteth-20', 'Dimethyl Isosorbide', 'Potassium Sorbate', 'Phenoxyethanol', 'Chlorphenesin']
  },

];


/* ─── BOOT ────────────────────────────────────────────────────────────────── */

const controls = document.getElementById('controls');
PAIRS.forEach((pair, i) => {
  const btn       = document.createElement('button');
  btn.className   = 'pb';
  btn.textContent = pair.label;
  btn.onclick     = () => loadPair(i);
  controls.appendChild(btn);
});
loadPair(0);




/* ─── ANALYSIS FUNCTIONS ──────────────────────────────────────────────────── */

function renderChart(left, right) {
  const ctx = document.getElementById('stackedBar');
  if (!ctx) return;
  if (barChart) { barChart.destroy(); barChart = null; }

  const labels = [
    `${left.brand} — ${left.name}`,
    `${right.brand} — ${right.name}`
  ];

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
       { label: 'Superstar',   data: [left.superstars,    right.superstars],    backgroundColor: '#C44ABC',  borderColor: '#9E3D97', borderWidth: 0.1 },
      { label: 'Goodie',    data: [left.goodies,    right.goodies],    backgroundColor: '#60C64E',  borderColor: '#4DA13E',  borderWidth: 0.1 },
      { label: 'Icky',      data: [left.icky,       right.icky],       backgroundColor: '#C13E3E',  borderColor: '#953A3A',   borderWidth: 0.1 },
      { label: 'Neutral', data: [left.neutral, right.neutral], backgroundColor: '#A3C6D7', borderColor: '#A3C6D7', borderWidth: 0.1 }
            ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: { stacked: true, grid: { color: 'rgba(20,20,20,0.08)' }, ticks: { color: 'rgba(20,20,20,0.55)', font: { size: 11, family: "'Cormorant Garamond', Georgia, serif"} }, title: { display: true, text: 'Number of ingredients', color: 'rgba(20,20,20,0.40)', font: { size: 10, family: "'Cormorant Garamond', Georgia, serif"} } },
        y: { stacked: true, grid: { display: false }, ticks: { color: 'rgba(20,20,20,0.65)', font: { size: 11, family: "'Cormorant Garamond', Georgia, serif"} } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(252,248,246,0.97)', titleColor: 'rgba(20,20,20,0.85)', bodyColor: 'rgba(20,20,20,0.60)',
          borderColor: 'rgba(140,110,90,0.20)', borderWidth: 1, padding: 10,
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw} ingredients` }
        }
      }
    }
  });
}

function renderIngredientLists(leftP, rightP, leftIdx, rightIdx) {
  const el = document.getElementById('analysis-lists');
  if (!el) return;

  el.innerHTML = [
    { p: leftP,  ing: INGREDIENTS[leftIdx],  idx: leftIdx  },
    { p: rightP, ing: INGREDIENTS[rightIdx], idx: rightIdx }
  ].map(({ p, ing, idx }) => `
    <div class="ing-list-col">
      <div class="ing-list-product-name ing-name-clickable" data-idx="${idx}">${p.brand} — ${p.name} <span class="prod-name-hint">↗</span></div>

      <div class="ing-category">
        <div class="ing-category-label">
          <div class="ing-category-dot" style="background:#FF10F0"></div>
          Superstar
        </div>
        <div class="ing-tags">
          ${ing.superstar.length
            ? ing.superstar.map(i => `<span class="ing-tag ing-tag-superstar">${i}</span>`).join('')
            : '<span class="ing-empty">None</span>'}
        </div>
      </div>

      <div class="ing-category">
        <div class="ing-category-label">
         <div class="ing-category-dot" style="background:#39FF14"></div>
          Goodie
        </div>
        <div class="ing-tags">
          ${ing.goodie.length
            ? ing.goodie.map(i => `<span class="ing-tag ing-tag-goodie">${i}</span>`).join('')
            : '<span class="ing-empty">None</span>'}
        </div>
      </div>

      <div class="ing-category">
        <div class="ing-category-label">
         <div class="ing-category-dot" style="background:#FF0000"></div>
            Icky — what to avoid
        </div>
        <div class="ing-tags">
          ${ing.icky.length
            ? ing.icky.map(i => `<span class="ing-tag ing-tag-icky">${i}</span>`).join('')
            : '<span class="ing-empty">None — no flagged ingredients</span>'}
        </div>
      </div>

      <div class="ing-category">
        <div class="ing-category-label">
          <<div class="ing-category-dot" style="background:#89CFF0"></div>
          Neutral
        </div>
        <div class="ing-tags">
          ${ing.neutral.length
            ? ing.neutral.map(i => `<span class="ing-tag ing-tag-neutral">${i}</span>`).join('')
            : '<span class="ing-empty">None</span>'}
        </div>
      </div>

    </div>
  `).join('');

  el.querySelectorAll('.ing-name-clickable').forEach(node => {
    node.addEventListener('click', () => openProductModal(+node.dataset.idx));
  });
}

/*
 * Renders prominent highlight cards for icky, goodie, superstar —
 * the most visually interesting part for consumers.
 */
function renderIngredientHighlights(leftP, rightP, leftIdx, rightIdx) {
  const el = document.getElementById('ingredient-highlights');
  if (!el) return;

  el.innerHTML = [
    { p: leftP,  ing: INGREDIENTS[leftIdx],  idx: leftIdx  },
    { p: rightP, ing: INGREDIENTS[rightIdx], idx: rightIdx }
  ].map(({ p, ing, idx }) => `
    <div class="highlight-col">
      <div class="highlight-product-name ing-name-clickable" data-idx="${idx}">${p.brand} — ${p.name} <span class="prod-name-hint">↗</span></div>

      <!-- ICKY — shown first, most important for consumers -->
      <div class="highlight-card highlight-card-icky highlight-card-icky-bg">
        <div class="highlight-card-header">
          <div class="highlight-card-dot" style="background:#FF0000"></div>
          <span class="highlight-card-title">Icky — what to avoid</span>
          <span class="highlight-card-count">${ing.icky.length} flagged</span>
        </div>
        <div class="ing-tags">
          ${ing.icky.length
            ? ing.icky.map(i => `<span class="ing-tag ing-tag-icky">${i}</span>`).join('')
            : '<span class="ing-empty">None — clean formula ✓</span>'}
        </div>
      </div>

      <!-- SUPERSTAR -->
      <div class="highlight-card highlight-card-superstar">
        <div class="highlight-card-header">
         <div class="highlight-card-dot" style="background:#FF10F0"></div>
          <span class="highlight-card-title">Superstar actives</span>
          <span class="highlight-card-count">${ing.superstar.length} found</span>
        </div>
        <div class="ing-tags">
          ${ing.superstar.length
            ? ing.superstar.map(i => `<span class="ing-tag ing-tag-superstar">${i}</span>`).join('')
            : '<span class="ing-empty">None</span>'}
        </div>
      </div>

      <!-- GOODIE -->
      <div class="highlight-card highlight-card-goodie">
        <div class="highlight-card-header">
         <div class="highlight-card-dot" style="background:#148700"></div>
          <span class="highlight-card-title">Goodies</span>
          <span class="highlight-card-count">${ing.goodie.length} found</span>
        </div>
        <div class="ing-tags">
          ${ing.goodie.length
            ? ing.goodie.map(i => `<span class="ing-tag ing-tag-goodie">${i}</span>`).join('')
            : '<span class="ing-empty">None</span>'}
        </div>
      </div>

    </div>
  `).join('');

  el.querySelectorAll('.ing-name-clickable').forEach(node => {
    node.addEventListener('click', () => openProductModal(+node.dataset.idx));
  });
}

function updateAnalysis(pairIdx) {
  const { l, r } = PAIRS[pairIdx];
  renderChart(PRODUCTS[l], PRODUCTS[r]);
  renderIngredientHighlights(PRODUCTS[l], PRODUCTS[r], l, r);
}