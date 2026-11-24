import * as THREE from 'three';
import { getWaterHeight, getWaterSlope } from '../scene/water.js';

/**
 * Procedural 3D Krathong Builder (Faithfully matching User Image 3 & Image 1):
 * - Faceted multi-tier folded banana leaf petals (กลีบผกาพับสามเหลี่ยมซ้อนชั้นเหมือนภาพที่ 3)
 * - Purple orchids (ดอกกล้วยไม้สีม่วง) & Golden marigolds (ดอกดาวเรือง)
 * - Tall slender white candle with teardrop flame & smoking incense stick
 * - Dynamic water reflection streak & 3D floating wish badge
 */

// PBR Materials tuned for Image 3 & Image 1
const materials = {
  bananaTrunk: new THREE.MeshStandardMaterial({ color: 0x2e4a1e, roughness: 0.85 }),
  // Faceted stylized leaf green (flatShading for the geometric faceted look in Image 3)
  bananaLeafOuter: new THREE.MeshStandardMaterial({
    color: 0x1f5c27,
    roughness: 0.55,
    flatShading: true,
    side: THREE.DoubleSide
  }),
  bananaLeafMid: new THREE.MeshStandardMaterial({
    color: 0x2e7838,
    roughness: 0.5,
    flatShading: true,
    side: THREE.DoubleSide
  }),
  bananaLeafInner: new THREE.MeshStandardMaterial({
    color: 0x1a4a1f,
    roughness: 0.6,
    flatShading: true,
    side: THREE.DoubleSide
  }),
  // Purple Orchid petals (Image 3: ดอกกล้วยไม้สีม่วงสด)
  orchidPurple: new THREE.MeshStandardMaterial({
    color: 0x9333ea,
    roughness: 0.45,
    side: THREE.DoubleSide
  }),
  orchidMagenta: new THREE.MeshStandardMaterial({
    color: 0xc026d3,
    roughness: 0.45,
    side: THREE.DoubleSide
  }),
  marigoldYellow: new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.65,
    flatShading: true
  }),
  marigoldOrange: new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.65,
    flatShading: true
  }),
  // Tall white candle (Image 3)
  whiteCandle: new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.05
  }),
  flameCore: new THREE.MeshBasicMaterial({ color: 0xffffff }),
  flameOuter: new THREE.MeshBasicMaterial({
    color: 0xffaa22,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  }),
  incenseStick: new THREE.MeshStandardMaterial({ color: 0x5c3d28, roughness: 0.9 }),
  incenseEmber: new THREE.MeshBasicMaterial({ color: 0xff2200 }),
  // Water reflection spotlight disc under the krathong (soft & moderate)
  waterReflection: new THREE.MeshBasicMaterial({
    color: 0xffb84d,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }),
  // Image 1 Glowing Lotus Lamp materials (สว่างพอดีๆ สบายตา)
  lotusLampOrange: new THREE.MeshStandardMaterial({
    color: 0xff7700,
    emissive: 0xff5500,
    emissiveIntensity: 0.75,
    roughness: 0.45,
    side: THREE.DoubleSide
  }),
  lotusLampPurple: new THREE.MeshStandardMaterial({
    color: 0x9911aa,
    emissive: 0x660088,
    emissiveIntensity: 0.65,
    roughness: 0.45,
    side: THREE.DoubleSide
  }),
  royalGold: new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85
  })
};

export class Krathong {
  constructor({
    name = 'ผู้มีจิตศรัทธา',
    wish = 'ขอให้มีความสุขความเจริญ',
    style = 'banana_leaf',
    isPlayer = false,
    position = new THREE.Vector3(0, 0, 0)
  }) {
    this.name = name;
    this.wish = wish;
    this.style = style;
    this.isPlayer = isPlayer;

    this.group = new THREE.Group();
    this.group.position.copy(position);

    this.driftSpeed = 0.75 + Math.random() * 0.45;
    this.driftXSpeed = (Math.random() - 0.5) * 0.08;
    this.seed = Math.random() * 1000;
    this.wobblePhase = Math.random() * Math.PI * 2;

    this.candleLight = null;
    this.flameMesh = null;
    this.tagSprite = null;
    this.waterReflectionDisc = null;
    this.smokeParticles = [];

    this.buildMesh();
    this.buildCandleAndIncense();
    this.buildWaterReflectionDisc();
    this.buildWishTag();
  }

  buildMesh() {
    switch (this.style) {
      case 'lotus_lamp_gold':
        this.buildGlowingLotusLamp('orange');
        break;
      case 'lotus_lamp_purple':
        this.buildGlowingLotusLamp('purple');
        break;
      case 'royal_swan':
        this.buildRoyalSwan();
        break;
      case 'banana_leaf':
      default:
        this.buildFacetedBananaLeaf(); // Exact match to Image 3
        break;
    }
  }

  // 1. Faceted Banana Leaf Krathong (Exactly matching Image 3)
  buildFacetedBananaLeaf() {
    // Sliced Banana Trunk Base Disc
    const baseGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.22, 24);
    const base = new THREE.Mesh(baseGeo, materials.bananaTrunk);
    base.position.y = 0.11;
    base.castShadow = true;
    this.group.add(base);

    // Multi-tier Folded Triangular Petals (กลีบผกาพับสามเหลี่ยมซ้อน 3 ชั้นเหมือนภาพที่ 3)
    // Tier 1: Outer wide folded leaves
    const numOuter = 16;
    for (let i = 0; i < numOuter; i++) {
      const angle = (i / numOuter) * Math.PI * 2;
      // Folded triangular petal geometry
      const petalGeo = new THREE.ConeGeometry(0.25, 0.75, 4);
      petalGeo.scale(1.1, 0.35, 1);
      const petal = new THREE.Mesh(petalGeo, materials.bananaLeafOuter);
      petal.position.set(Math.cos(angle) * 0.92, 0.22, Math.sin(angle) * 0.92);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.58; // flared outward
      petal.castShadow = true;
      this.group.add(petal);
    }

    // Tier 2: Mid folded leaves (staggered)
    const numMid = 14;
    for (let i = 0; i < numMid; i++) {
      const angle = (i / numMid) * Math.PI * 2 + 0.22;
      const petalGeo = new THREE.ConeGeometry(0.22, 0.65, 4);
      petalGeo.scale(1.0, 0.32, 1);
      const petal = new THREE.Mesh(petalGeo, materials.bananaLeafMid);
      petal.position.set(Math.cos(angle) * 0.72, 0.28, Math.sin(angle) * 0.72);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.42;
      this.group.add(petal);
    }

    // Tier 3: Inner folded leaves
    const numInner = 10;
    for (let i = 0; i < numInner; i++) {
      const angle = (i / numInner) * Math.PI * 2 + 0.12;
      const petalGeo = new THREE.ConeGeometry(0.18, 0.55, 4);
      petalGeo.scale(0.9, 0.3, 1);
      const petal = new THREE.Mesh(petalGeo, materials.bananaLeafInner);
      petal.position.set(Math.cos(angle) * 0.52, 0.32, Math.sin(angle) * 0.52);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.28;
      this.group.add(petal);
    }

    // Floral Bed: Purple Orchids & Golden Marigolds (as in Image 3)
    this.createOrchidsAndMarigolds();
  }

  createOrchidsAndMarigolds() {
    // 8 Purple Orchids around the inner perimeter
    const orchidCount = 8;
    for (let i = 0; i < orchidCount; i++) {
      const angle = (i / orchidCount) * Math.PI * 2;
      const orchidGroup = new THREE.Group();
      orchidGroup.position.set(Math.cos(angle) * 0.42, 0.34, Math.sin(angle) * 0.42);
      orchidGroup.rotation.y = -angle;

      // 5 orchid petals
      for (let p = 0; p < 5; p++) {
        const pAngle = (p / 5) * Math.PI * 2;
        const petalGeo = new THREE.PlaneGeometry(0.14, 0.22);
        petalGeo.translate(0, 0.09, 0);
        petalGeo.rotateX(0.25);
        const petal = new THREE.Mesh(
          petalGeo,
          p % 2 === 0 ? materials.orchidPurple : materials.orchidMagenta
        );
        petal.rotation.z = pAngle;
        orchidGroup.add(petal);
      }

      // Yellow orchid center
      const centerGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const center = new THREE.Mesh(centerGeo, materials.marigoldYellow);
      center.position.z = 0.02;
      orchidGroup.add(center);

      this.group.add(orchidGroup);
    }

    // Golden Marigolds interspersed between orchids
    const marigoldCount = 8;
    for (let i = 0; i < marigoldCount; i++) {
      const angle = (i / marigoldCount) * Math.PI * 2 + 0.38;
      const flowerGeo = new THREE.SphereGeometry(0.1, 7, 7);
      flowerGeo.scale(1, 0.7, 1);
      const mat = i % 2 === 0 ? materials.marigoldYellow : materials.marigoldOrange;
      const marigold = new THREE.Mesh(flowerGeo, mat);
      marigold.position.set(Math.cos(angle) * 0.35, 0.33, Math.sin(angle) * 0.35);
      this.group.add(marigold);
    }
  }

  // 2. Glowing Lotus Candle Bowl Lamp (Matching Image 1)
  buildGlowingLotusLamp(colorType = 'orange') {
    const lampMat = colorType === 'orange' ? materials.lotusLampOrange : materials.lotusLampPurple;

    // Glowing Lotus Bowl
    const bowlGeo = new THREE.SphereGeometry(0.68, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bowl = new THREE.Mesh(bowlGeo, lampMat);
    bowl.position.y = 0.22;
    this.group.add(bowl);

    // Radiating Lotus Petals
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.24, 0.65, 4);
      petalGeo.scale(1, 0.3, 1);
      const petal = new THREE.Mesh(petalGeo, lampMat);
      petal.position.set(Math.cos(angle) * 0.68, 0.28, Math.sin(angle) * 0.68);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.55;
      this.group.add(petal);
    }
  }

  // 3. Royal Golden Swan Krathong (สุพรรณหงส์)
  buildRoyalSwan() {
    const baseGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.25, 20);
    baseGeo.scale(1.2, 1, 0.85);
    const base = new THREE.Mesh(baseGeo, materials.royalGold);
    base.position.y = 0.12;
    this.group.add(base);

    // Suphannahong Swan Neck & Head
    const swanNeckGroup = new THREE.Group();
    swanNeckGroup.position.set(0, 0.2, -0.9);

    const neckCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.45, -0.15),
      new THREE.Vector3(0, 0.9, -0.05),
      new THREE.Vector3(0, 1.15, 0.18)
    ]);
    const neckGeo = new THREE.TubeGeometry(neckCurve, 12, 0.08, 8, false);
    const neckMesh = new THREE.Mesh(neckGeo, materials.royalGold);
    swanNeckGroup.add(neckMesh);

    const headGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
    headGeo.rotateX(Math.PI / 2);
    const head = new THREE.Mesh(headGeo, materials.royalGold);
    head.position.set(0, 1.18, 0.26);
    swanNeckGroup.add(head);

    this.group.add(swanNeckGroup);
    this.createOrchidsAndMarigolds();
  }

  buildCandleAndIncense() {
    // Tall Slender White Candle (Matching Image 3)
    const candleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.65, 12);
    const candle = new THREE.Mesh(candleGeo, materials.whiteCandle);
    candle.position.set(0, 0.62, -0.04);
    candle.castShadow = true;
    this.group.add(candle);

    // Candle Wick
    const wickGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.08, 6);
    const wick = new THREE.Mesh(wickGeo, materials.incenseStick);
    wick.position.set(0, 0.96, -0.04);
    this.group.add(wick);

    // Dual-Layer Teardrop Candle Flame (Image 3)
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 1.02, -0.04);

    // Inner bright white core
    const coreGeo = new THREE.ConeGeometry(0.025, 0.14, 8);
    coreGeo.translate(0, 0.07, 0);
    const flameCore = new THREE.Mesh(coreGeo, materials.flameCore);
    flameGroup.add(flameCore);

    // Outer warm amber halo
    const outerGeo = new THREE.ConeGeometry(0.048, 0.22, 8);
    outerGeo.translate(0, 0.09, 0);
    this.flameMesh = new THREE.Mesh(outerGeo, materials.flameOuter);
    flameGroup.add(this.flameMesh);

    this.group.add(flameGroup);

    // Warm Candle PointLight (เฉพาะกระทงของผู้เล่นเพื่อความลื่นไหล 60 FPS ไม่แลค)
    if (this.isPlayer) {
      this.candleLight = new THREE.PointLight(0xffb84d, 1.25, 6.0, 1.8);
      this.candleLight.position.set(0, 1.05, -0.04);
      this.group.add(this.candleLight);
    }

    // Slender Incense Stick with Glowing Red Tip (Image 3)
    const stickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.78, 6);
    const stick = new THREE.Mesh(stickGeo, materials.incenseStick);
    stick.position.set(0.09, 0.7, 0.08);
    stick.rotation.z = -0.15;
    stick.rotation.x = 0.08;
    this.group.add(stick);

    const emberGeo = new THREE.SphereGeometry(0.018, 6, 6);
    const ember = new THREE.Mesh(emberGeo, materials.incenseEmber);
    ember.position.set(0.09, 1.09, 0.11);
    this.group.add(ember);
  }

  buildWaterReflectionDisc() {
    // Glowing specular ripple disc on water underneath candle (Matching Image 3 & Image 1)
    const discGeo = new THREE.PlaneGeometry(1.8, 1.8);
    discGeo.rotateX(-Math.PI / 2);
    this.waterReflectionDisc = new THREE.Mesh(discGeo, materials.waterReflection);
    this.waterReflectionDisc.position.set(0, 0.03, 0);
    this.group.add(this.waterReflectionDisc);
  }

  buildWishTag() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 190;
    const ctx = canvas.getContext('2d');

    // Elegant badge style matching Image 3 ("กระทงใบนี้...")
    ctx.fillStyle = this.isPlayer ? 'rgba(8, 20, 36, 0.88)' : 'rgba(15, 18, 25, 0.78)';
    ctx.strokeStyle = this.isPlayer ? '#ffd700' : '#e0a020';
    ctx.lineWidth = 5;

    const x = 10, y = 10, w = 492, h = 170, r = 24;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tag Header (Like Image 3: "กระทงใบนี้")
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.isPlayer ? '✨ กระทงของคุณ ✨' : 'กระทงใบนี้', 256, 46);

    // Name text
    ctx.fillStyle = this.isPlayer ? '#ffffff' : '#ffea99';
    ctx.font = 'bold 30px Sarabun, sans-serif';
    const displayName = this.name.length > 20 ? this.name.substring(0, 19) + '…' : this.name;
    ctx.fillText(displayName, 256, 88);

    // Wish text
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'italic 23px Sarabun, sans-serif';
    const displayWish = this.wish.length > 30 ? this.wish.substring(0, 29) + '…' : this.wish;
    ctx.fillText(`“${displayWish}”`, 256, 138);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });

    this.tagSprite = new THREE.Sprite(spriteMat);
    this.tagSprite.scale.set(this.isPlayer ? 2.4 : 1.8, this.isPlayer ? 0.9 : 0.68, 1);
    this.tagSprite.position.set(0, 2.0, 0);
    this.group.add(this.tagSprite);
  }

  update(time, delta) {
    this.group.position.z += this.driftSpeed * delta * 2.2;
    this.group.position.x += this.driftXSpeed * delta;

    const worldX = this.group.position.x;
    const worldZ = this.group.position.z;

    const waterY = getWaterHeight(worldX, worldZ, time);
    const { slopeX, slopeZ } = getWaterSlope(worldX, worldZ, time);

    this.group.position.y = waterY;

    // Smooth wave tilt & gentle yaw rotation
    this.group.rotation.x = slopeZ * 0.85 + Math.sin(time * 2.0 + this.wobblePhase) * 0.04;
    this.group.rotation.z = -slopeX * 0.85 + Math.cos(time * 1.8 + this.wobblePhase) * 0.04;
    this.group.rotation.y += Math.sin(time * 0.6 + this.seed) * 0.001;

    // Candle flame flicker & light pulsation (สว่างพอดี สบายตา)
    const flicker = Math.sin(time * 12.0 + this.seed) * 0.12 + Math.cos(time * 20.0 + this.seed) * 0.08;
    if (this.candleLight) {
      const baseIntensity = this.isPlayer ? 1.05 : 0.72;
      this.candleLight.intensity = Math.max(0.4, baseIntensity + flicker);
    }
    if (this.flameMesh) {
      this.flameMesh.scale.set(1 + flicker * 0.2, 1 + flicker * 0.25, 1 + flicker * 0.2);
    }

    // Water reflection disc animation
    if (this.waterReflectionDisc) {
      this.waterReflectionDisc.material.opacity = 0.20 + flicker * 0.05;
    }

    if (this.tagSprite) {
      this.tagSprite.position.y = 2.0 + Math.sin(time * 3.0 + this.wobblePhase) * 0.08;
    }
  }
}
