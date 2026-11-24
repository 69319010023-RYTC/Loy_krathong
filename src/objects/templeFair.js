import * as THREE from 'three';

/**
 * Temple Fair Zone (Faithfully matching User Image 2 & Festival requirements):
 * - Aluminum metal truss canopy frame with cross-bracing (โครงสร้างทรัสเวทีเหมือนภาพที่ 2)
 * - Hanging colorful Lanna lanterns (โคมล้านนาหลากสี) with tassels under the truss grid
 * - Traditional Thai vertical banners (ตุงแขวนยาวสีสดใส)
 * - Stage Backdrop with Golden Twin Nagas (พญานาคคู่สีทอง) & Lotus center sign
 * - Giant Decorative Pink Lotus Installation (ดอกบัวยักษ์ประดับไฟเหมือนภาพที่ 2)
 * - Colorful triangle pennant bunting flags (ธงทิวริ้วหลากสี)
 * - 4 Thai Food Stalls & Multi-tier Sand Pagoda (เจดีย์ทราย)
 */

export class TempleFair {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(28, 1.8, -5); // Position on the right festival bank
    this.scene.add(this.group);

    this.spotlights = [];
    this.spotlightCones = [];

    this.createImage2StageAndTruss();
    this.createGiantLotusInstallation();
    this.createFoodStalls();
    this.createSandPagoda();
    this.createFairyStringLights();
  }

  createImage2StageAndTruss() {
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, 0, 0);

    // 1. Stage Elevated Deck (Width: 26m, Depth: 12m, Height: 1.2m)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333338, roughness: 0.7, metalness: 0.2 });
    const baseGeo = new THREE.BoxGeometry(26, 1.2, 12);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.6;
    base.castShadow = true;
    base.receiveShadow = true;
    stageGroup.add(base);

    // Paved patterned deck (like the checkered/tiled paving in Image 2)
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Slate paved festival floor
      roughness: 0.8,
      metalness: 0.1
    });
    const deckGeo = new THREE.BoxGeometry(25.6, 0.05, 11.6);
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 1.22;
    deck.receiveShadow = true;
    stageGroup.add(deck);

    // 2. Aluminum Metal Truss Canopy Frame (Image 2 signature feature)
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // Metallic silver aluminum truss
      roughness: 0.35,
      metalness: 0.85
    });

    const trussWidth = 22;
    const trussDepth = 10;
    const trussHeight = 7.5;
    const postCoords = [
      [-trussWidth / 2, -trussDepth / 2],
      [trussWidth / 2, -trussDepth / 2],
      [-trussWidth / 2, trussDepth / 2],
      [trussWidth / 2, trussDepth / 2],
      [0, -trussDepth / 2],
      [0, trussDepth / 2]
    ];

    // Vertical Truss Columns
    postCoords.forEach(([px, pz]) => {
      this.createTrussColumn(stageGroup, px, 1.2, pz, trussHeight, trussMat);
    });

    // Horizontal Overhead Truss Beams
    this.createTrussBeam(stageGroup, 0, 1.2 + trussHeight, -trussDepth / 2, trussWidth, 'X', trussMat);
    this.createTrussBeam(stageGroup, 0, 1.2 + trussHeight, trussDepth / 2, trussWidth, 'X', trussMat);
    this.createTrussBeam(stageGroup, -trussWidth / 2, 1.2 + trussHeight, 0, trussDepth, 'Z', trussMat);
    this.createTrussBeam(stageGroup, trussWidth / 2, 1.2 + trussHeight, 0, trussDepth, 'Z', trussMat);
    this.createTrussBeam(stageGroup, 0, 1.2 + trussHeight, 0, trussDepth, 'Z', trussMat);

    // 3. Rows of Hanging Colorful Lanna Lanterns (โคมล้านนาแขวนเหมือนภาพที่ 2)
    const lannaColors = [
      0x38bdf8, // Sky Blue
      0xfacc15, // Bright Yellow
      0xef4444, // Red
      0xf97316, // Orange
      0x22c55e, // Green
      0xa855f7, // Purple
      0xec4899  // Pink
    ];

    // Hang 3 rows of lanterns from the overhead truss beams
    for (let r = -3; r <= 3; r += 3) {
      const zPos = r;
      for (let c = -9.5; c <= 9.5; c += 1.6) {
        const color = lannaColors[Math.floor(Math.random() * lannaColors.length)];
        this.createHangingLannaLantern(stageGroup, c, 1.2 + trussHeight, zPos, color);
      }
    }

    // 4. Long Vertical Hanging Banners (ตุงล้านนาแขวนยาวสีสดใสเหมือนภาพที่ 2)
    const bannerColors = [0xec4899, 0xfacc15, 0x38bdf8, 0x22c55e, 0xf97316];
    [-10.8, -9.0, 9.0, 10.8].forEach((bx, idx) => {
      const bColor = bannerColors[idx % bannerColors.length];
      this.createVerticalTungBanner(stageGroup, bx, 1.2 + trussHeight, -trussDepth / 2 + 0.3, bColor);
    });

    // 5. Stage Backdrop with Golden Twin Nagas & Lotus Sign (เหมือนภาพที่ 2)
    this.createNagaBackdrop(stageGroup);

    // 6. Colorful Triangle Pennant Bunting (ธงทิวสามเหลี่ยมหลากสีเหมือนภาพที่ 2)
    this.createBuntingFlags(stageGroup, -trussWidth / 2, trussWidth / 2, 1.2 + trussHeight + 0.8, -trussDepth / 2);

    // 7. Spotlights along front truss
    this.createStageSpotlights(stageGroup);

    this.group.add(stageGroup);
  }

  createTrussColumn(parent, x, yBottom, z, height, mat) {
    const colGroup = new THREE.Group();
    colGroup.position.set(x, yBottom, z);

    // 4 Corner vertical pipes
    const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, height, 8);
    const pipeOffset = 0.22;
    [
      [-pipeOffset, -pipeOffset],
      [pipeOffset, -pipeOffset],
      [-pipeOffset, pipeOffset],
      [pipeOffset, pipeOffset]
    ].forEach(([cx, cz]) => {
      const pipe = new THREE.Mesh(pipeGeo, mat);
      pipe.position.set(cx, height / 2, cz);
      colGroup.add(pipe);
    });

    // Cross-braces along height
    const braceCount = 8;
    for (let b = 0; b < braceCount; b++) {
      const by = (b / braceCount) * height + 0.4;
      const braceGeo = new THREE.BoxGeometry(pipeOffset * 2.2, 0.03, pipeOffset * 2.2);
      const brace = new THREE.Mesh(braceGeo, mat);
      brace.position.set(0, by, 0);
      colGroup.add(brace);
    }

    parent.add(colGroup);
  }

  createTrussBeam(parent, x, y, z, length, axis, mat) {
    const beamGeo = axis === 'X'
      ? new THREE.BoxGeometry(length, 0.4, 0.4)
      : new THREE.BoxGeometry(0.4, 0.4, length);
    const beam = new THREE.Mesh(beamGeo, mat);
    beam.position.set(x, y, z);
    parent.add(beam);
  }

  createHangingLannaLantern(parent, x, yTruss, z, colorHex) {
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(x, yTruss, z);

    // Hanging wire
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const wireGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.6, 4);
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.y = -0.3;
    lanternGroup.add(wire);

    // Octagonal Lanna Lantern Body
    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.45, 8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 1.5,
      roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = -0.75;
    lanternGroup.add(body);

    // Top & bottom caps
    const capGeo = new THREE.ConeGeometry(0.27, 0.14, 8);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3 });
    const topCap = new THREE.Mesh(capGeo, capMat);
    topCap.position.y = -0.52;
    lanternGroup.add(topCap);

    const bottomCap = topCap.clone();
    bottomCap.rotation.z = Math.PI;
    bottomCap.position.y = -0.98;
    lanternGroup.add(bottomCap);

    // Hanging tail/tassel ribbon (พู่ห้อยล้านนา)
    const tailGeo = new THREE.PlaneGeometry(0.12, 0.7);
    tailGeo.translate(0, -0.35, 0);
    const tailMat = new THREE.MeshStandardMaterial({ color: colorHex, side: THREE.DoubleSide });
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.y = -1.05;
    lanternGroup.add(tail);

    parent.add(lanternGroup);
  }

  createVerticalTungBanner(parent, x, yTruss, z, colorHex) {
    const bannerGroup = new THREE.Group();
    bannerGroup.position.set(x, yTruss, z);

    // Long decorative hanging banner cloth (ตุง)
    const clothGeo = new THREE.PlaneGeometry(0.85, 4.2);
    clothGeo.translate(0, -2.1, 0);
    const clothMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.6,
      side: THREE.DoubleSide
    });
    const cloth = new THREE.Mesh(clothGeo, clothMat);
    bannerGroup.add(cloth);

    // Golden fringe at bottom
    const fringeGeo = new THREE.BoxGeometry(0.9, 0.15, 0.05);
    const fringeMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3 });
    const fringe = new THREE.Mesh(fringeGeo, fringeMat);
    fringe.position.set(0, -4.25, 0);
    bannerGroup.add(fringe);

    parent.add(bannerGroup);
  }

  createNagaBackdrop(parent) {
    const backdropGroup = new THREE.Group();
    backdropGroup.position.set(0, 1.2, -5.2);

    // Green / Gold Festive Backdrop Wall
    const wallGeo = new THREE.BoxGeometry(16, 5.5, 0.4);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f3822, roughness: 0.6 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 2.75;
    backdropGroup.add(wall);

    // Backdrop Banner Canvas: Twin Golden Nagas flanking pink lotus (Image 2)
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    // Rich emerald green Thai silk background
    ctx.fillStyle = '#0a2e1c';
    ctx.fillRect(0, 0, 1024, 384);

    // Gold ornate borders
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, 992, 352);
    ctx.strokeRect(28, 28, 968, 328);

    // Title banner text
    ctx.fillStyle = '#ffea77';
    ctx.font = 'bold 56px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ลอยกระทงประเพณีไทย ๒๕๖๙', 512, 130);

    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 38px Sarabun, sans-serif';
    ctx.fillText('เวทีประกวดนางนพมาศประจำปี', 512, 195);

    ctx.fillStyle = '#ffffff';
    ctx.font = '28px Sarabun, sans-serif';
    ctx.fillText('ขอขมาพระแม่คงคา บูชารอยพระพุทธบาท', 512, 260);

    // Twin Golden Naga Silhouettes & Lotus drawing in center
    ctx.fillStyle = '#ffd700';
    ctx.font = '58px sans-serif';
    ctx.fillText('🐉 🪷 🐉', 512, 335);

    const bannerTex = new THREE.CanvasTexture(canvas);
    const bannerGeo = new THREE.PlaneGeometry(15, 5.0);
    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 2.75, 0.22);
    backdropGroup.add(banner);

    parent.add(backdropGroup);
  }

  createGiantLotusInstallation() {
    // Giant Decorative Pink Lotus Flower moved to the temple lawn garden plaza (ไม่ขวางสะพาน)
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(6.0, 0.2, -26.0); // Placed gracefully beside the sand pagoda lawn garden

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0x661033,
      emissiveIntensity: 0.25,
      roughness: 0.55,
      side: THREE.DoubleSide
    });

    const goldCenterMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0x996600,
      emissiveIntensity: 0.5,
      roughness: 0.35
    });

    // 16 Giant Lotus Petals
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(1.2, 3.8, 4);
      petalGeo.scale(1.2, 0.3, 1);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 2.8, 1.4, Math.sin(angle) * 2.8);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.55;
      lotusGroup.add(petal);
    }

    // Inner petal ring
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + 0.3;
      const petalGeo = new THREE.ConeGeometry(0.9, 2.8, 4);
      petalGeo.scale(1.1, 0.3, 1);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 1.8, 1.8, Math.sin(angle) * 1.8);
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.x = 0.38;
      lotusGroup.add(petal);
    }

    // Glowing Golden Center Pod
    const centerGeo = new THREE.ConeGeometry(1.1, 2.2, 16);
    const center = new THREE.Mesh(centerGeo, goldCenterMat);
    center.position.y = 2.4;
    lotusGroup.add(center);

    const lotusLight = new THREE.PointLight(0xff4499, 0.85, 9, 1.8);
    lotusLight.position.set(0, 3.2, 0);
    lotusGroup.add(lotusLight);

    this.group.add(lotusGroup);
  }

  createBuntingFlags(parent, xStart, xEnd, y, z) {
    const buntingGroup = new THREE.Group();
    const flagColors = [0xef4444, 0xfacc15, 0x38bdf8, 0x22c55e, 0xec4899, 0xf97316];
    const flagCount = 28;
    const step = (xEnd - xStart) / flagCount;

    for (let i = 0; i < flagCount; i++) {
      const fx = xStart + i * step;
      // Catenary sag
      const sag = Math.sin((i / flagCount) * Math.PI) * 0.45;
      const fy = y - sag;

      const flagShape = new THREE.Shape();
      flagShape.moveTo(0, 0);
      flagShape.lineTo(step * 0.85, 0);
      flagShape.lineTo(step * 0.42, -0.6);
      flagShape.closePath();

      const flagGeo = new THREE.ShapeGeometry(flagShape);
      const flagMat = new THREE.MeshStandardMaterial({
        color: flagColors[i % flagColors.length],
        side: THREE.DoubleSide
      });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(fx, fy, z);
      buntingGroup.add(flag);
    }

    parent.add(buntingGroup);
  }

  createStageSpotlights(stageGroup) {
    const spotXPositions = [-8, -3, 3, 8];
    const initialColors = [0xff0077, 0x00f0ff, 0xffbb00, 0xa855f7];

    spotXPositions.forEach((sx, idx) => {
      const color = initialColors[idx];

      const fixtureGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.6, 12);
      fixtureGeo.rotateX(Math.PI / 2.6);
      const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(sx, 8.4, 5.0);
      stageGroup.add(fixture);

      const spotLight = new THREE.PointLight(color, 1.15, 12, 1.8);
      spotLight.position.set(sx, 6.5, 2.0);
      stageGroup.add(spotLight);

      const coneGeo = new THREE.ConeGeometry(2.4, 7.0, 16, 1, true);
      coneGeo.translate(0, -3.5, 0);
      coneGeo.rotateX(Math.PI / 6);

      const coneMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(sx, 8.3, 5.0);
      stageGroup.add(cone);

      this.spotlights.push({
        light: spotLight,
        fixture: fixture,
        baseX: sx,
        colorIndex: idx,
        phase: idx * 1.5
      });
      this.spotlightCones.push(cone);
    });
  }

  createFoodStalls() {
    const stallsConfig = [
      {
        z: 11,
        title: 'ลูกชิ้นปิ้ง & หมูปิ้งกะทิ',
        color1: '#ff4444',
        accentColor: 0xff3322
      },
      {
        z: 17.5,
        title: 'ขนมไทย & สายไหมแฟนซี',
        color1: '#ec4899',
        accentColor: 0xf472b6
      },
      {
        z: 24,
        title: 'น้ำสมุนไพร & มะพร้าวสด',
        color1: '#10b981',
        accentColor: 0x34d399
      },
      {
        z: 30.5,
        title: 'ผัดไทย & หอยทอดกระทะร้อน',
        color1: '#f59e0b',
        accentColor: 0xfbbf24
      }
    ];

    stallsConfig.forEach(cfg => this.buildSingleStall(cfg));
  }

  buildSingleStall({ z, title, accentColor }) {
    const stallGroup = new THREE.Group();
    stallGroup.position.set(-6.5, 0, z);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.8 });

    const tableGeo = new THREE.BoxGeometry(4.2, 1.0, 2.2);
    const table = new THREE.Mesh(tableGeo, woodMat);
    table.position.y = 0.5;
    table.castShadow = true;
    table.receiveShadow = true;
    stallGroup.add(table);

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x22150a, roughness: 0.9 });
    [
      [-1.9, -0.9], [1.9, -0.9],
      [-1.9, 0.9], [1.9, 0.9]
    ].forEach(([px, pz]) => {
      const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8);
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(px, 1.4, pz);
      pole.castShadow = true;
      stallGroup.add(pole);
    });

    const awningGeo = new THREE.ConeGeometry(2.6, 1.0, 4);
    awningGeo.scale(1.7, 1, 1.0);
    awningGeo.rotateY(Math.PI / 4);

    const awningMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.y = 2.9;
    awning.castShadow = true;
    stallGroup.add(awning);

    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const sCtx = signCanvas.getContext('2d');
    sCtx.fillStyle = '#1c1917';
    sCtx.fillRect(0, 0, 512, 128);
    sCtx.strokeStyle = '#ffd700';
    sCtx.lineWidth = 6;
    sCtx.strokeRect(6, 6, 500, 116);

    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 36px Sarabun, sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText(title, 256, 75);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signGeo = new THREE.PlaneGeometry(3.2, 0.8);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 2.3, 1.15);
    stallGroup.add(sign);

    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffeebb });
    const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 2.1, 0);
    stallGroup.add(bulb);

    const stallLight = new THREE.PointLight(0xffa834, 0.85, 6.5, 1.8);
    stallLight.position.set(0, 2.0, 0);
    stallGroup.add(stallLight);

    this.group.add(stallGroup);
  }

  createSandPagoda() {
    const sandGroup = new THREE.Group();
    sandGroup.position.set(-6.5, 0, -18);

    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xc4a36d,
      roughness: 0.95,
      metalness: 0.05
    });

    const sandTiers = [
      { rTop: 3.5, rBot: 4.6, h: 0.9, y: 0.45 },
      { rTop: 2.4, rBot: 3.5, h: 0.9, y: 1.35 },
      { rTop: 1.4, rBot: 2.4, h: 0.9, y: 2.25 },
      { rTop: 0.1, rBot: 1.4, h: 1.6, y: 3.5 }
    ];

    sandTiers.forEach(tier => {
      const geo = new THREE.CylinderGeometry(tier.rTop, tier.rBot, tier.h, 24);
      const mesh = new THREE.Mesh(geo, sandMat);
      mesh.position.y = tier.y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      sandGroup.add(mesh);
    });

    const flagColors = [0xff3344, 0x3388ff, 0xffcc00, 0x33cc66, 0xff66cc, 0xff8800];
    const flagCount = 38;

    for (let i = 0; i < flagCount; i++) {
      const angle = (i / flagCount) * Math.PI * 2 + Math.random() * 0.2;
      const tierIndex = i % 3;
      const radius = [3.8, 2.8, 1.8][tierIndex] + (Math.random() - 0.5) * 0.3;
      const py = [0.85, 1.75, 2.65][tierIndex];

      const flagGroup = new THREE.Group();
      flagGroup.position.set(Math.cos(angle) * radius, py, Math.sin(angle) * radius);
      flagGroup.rotation.y = angle + Math.PI / 2;
      flagGroup.rotation.z = (Math.random() - 0.5) * 0.2;

      const stickMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c, roughness: 0.9 });
      const stickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.65, 4);
      const stick = new THREE.Mesh(stickGeo, stickMat);
      stick.position.y = 0.32;
      flagGroup.add(stick);

      const flagMat = new THREE.MeshStandardMaterial({
        color: flagColors[i % flagColors.length],
        roughness: 0.6,
        side: THREE.DoubleSide
      });
      const flagShape = new THREE.Shape();
      flagShape.moveTo(0, 0);
      flagShape.lineTo(0.25, 0.15);
      flagShape.lineTo(0, 0.3);
      flagShape.closePath();
      const flagGeo = new THREE.ShapeGeometry(flagShape);
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(0.01, 0.32, 0);
      flagGroup.add(flagMesh);

      sandGroup.add(flagGroup);
    }

    const garlandCount = 32;
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.7 });
    for (let i = 0; i < garlandCount; i++) {
      const angle = (i / garlandCount) * Math.PI * 2;
      const marigoldGeo = new THREE.SphereGeometry(0.12, 6, 6);
      const marigold = new THREE.Mesh(marigoldGeo, garlandMat);
      marigold.position.set(Math.cos(angle) * 4.6, 0.12, Math.sin(angle) * 4.6);
      sandGroup.add(marigold);
    }

    const offeringMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 });
    const offeringTrayGeo = new THREE.CylinderGeometry(0.5, 0.3, 0.2, 12);
    const offeringTray = new THREE.Mesh(offeringTrayGeo, offeringMat);
    offeringTray.position.set(0, 0.2, 5.2);
    sandGroup.add(offeringTray);

    const offeringCandleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const offeringCandle = new THREE.Mesh(offeringCandleGeo, new THREE.MeshStandardMaterial({ color: 0xffdd66 }));
    offeringCandle.position.set(0, 0.4, 5.2);
    sandGroup.add(offeringCandle);

    const offeringLight = new THREE.PointLight(0xff9922, 1.4, 6, 1.8);
    offeringLight.position.set(0, 0.65, 5.2);
    sandGroup.add(offeringLight);

    this.group.add(sandGroup);
  }

  createFairyStringLights() {
    const stringGroup = new THREE.Group();
    const bulbColors = [0xff3355, 0xffd700, 0x00f0ff, 0x22c55e, 0xa855f7, 0xff8800];
    const bulbCount = 48;

    for (let i = 0; i < bulbCount; i++) {
      const t = i / bulbCount;
      const z = -20 + t * 52;
      const sag = Math.sin(t * Math.PI * 4) * 0.4;
      const y = 3.8 - sag;
      const x = -3.5 + Math.sin(t * Math.PI * 2) * 2.0;

      const bulbColor = bulbColors[i % bulbColors.length];
      const bulbGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const bulbMat = new THREE.MeshBasicMaterial({ color: bulbColor });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(x, y, z);
      stringGroup.add(bulb);
    }

    this.group.add(stringGroup);
  }

  update(time, delta) {
    const colors = [0xff0077, 0x00f0ff, 0xffbb00, 0xa855f7, 0x22c55e, 0xff4400];

    for (let i = 0; i < this.spotlights.length; i++) {
      const s = this.spotlights[i];
      const cone = this.spotlightCones[i];

      const sweepX = Math.sin(time * 1.5 + s.phase) * 3.5;
      const sweepZ = Math.cos(time * 1.2 + s.phase) * 1.5;

      s.light.position.x = s.baseX + sweepX * 0.5;
      s.light.position.z = 2.0 + sweepZ;

      if (cone) {
        cone.rotation.z = Math.sin(time * 1.5 + s.phase) * 0.18;
        cone.rotation.x = Math.PI / 6 + Math.cos(time * 1.2 + s.phase) * 0.08;
      }

      const colorStep = Math.floor((time * 0.5 + s.phase) % colors.length);
      s.light.color.setHex(colors[colorStep]);
      if (cone) cone.material.color.setHex(colors[colorStep]);
    }
  }
}
