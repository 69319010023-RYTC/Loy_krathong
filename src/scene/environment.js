import * as THREE from 'three';

/**
 * Procedural Environment:
 * - Natural Full Moon & Starfield across twilight sky (มีดวงดาว ดวงจันทร์ชัดเจน ไม่มืดเกินไป)
 * - Authentic Thai Temple Complex on opposite bank (พระอุโบสถ เจดีย์ทอง ลานวัดหินทรายชัดเจน สว่างพอดีแม้ปิด Bloom)
 * - Sturdy Traditional Wooden Pier (สะพานไม้สักท่าน้ำต่อเชื่อมเรียบร้อยสวยงาม)
 * - Riverside warm festival bulbs along pier & water edge (ไฟสว่างตามแม่น้ำและท่าน้ำแบบพอดี)
 */

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.pierReleasePoint = new THREE.Vector3(-2.8, 0.25, 0);

    this.createTerrain();
    this.createCleanFullMoon();
    this.createThaiTempleAcrossRiver();
    this.createCleanWoodenPier();
    this.createTrees();
    this.createStarfield();
  }

  createTerrain() {
    // 1. Right Riverbank & Festival Plaza (Festival Lawn)
    const groundGeo = new THREE.PlaneGeometry(80, 220, 32, 64);
    groundGeo.rotateX(-Math.PI / 2);

    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      if (x < 10) {
        pos.setY(i, (x - 2) * 0.24);
      } else {
        pos.setY(i, 1.92 + Math.sin(x * 0.08) * 0.12 + Math.cos(z * 0.06) * 0.08);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1b3820, // Pleasant natural night grass green
      roughness: 0.85,
      metalness: 0.05
    });

    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.position.set(40, -0.4, 0);
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // 2. Sandy Shoreline strip along the water
    const sandGeo = new THREE.PlaneGeometry(8, 220, 16, 64);
    sandGeo.rotateX(-Math.PI / 2);
    const sandPos = sandGeo.attributes.position;
    for (let i = 0; i < sandPos.count; i++) {
      const x = sandPos.getX(i);
      sandPos.setY(i, Math.max(-0.25, (x + 2) * 0.15));
    }
    sandGeo.computeVertexNormals();

    const sandMat = new THREE.MeshStandardMaterial({
      color: 0x3d3326, // Warm wet river sand
      roughness: 0.85,
      metalness: 0.08
    });
    this.sandMesh = new THREE.Mesh(sandGeo, sandMat);
    this.sandMesh.position.set(4, -0.22, 0);
    this.sandMesh.receiveShadow = true;
    this.scene.add(this.sandMesh);

    // 3. Opposite Shore Ground where the Temple sits (ลานวัดฝั่งตรงข้าม สว่างพอดี ชัดเจน)
    const templeCourtyardGeo = new THREE.PlaneGeometry(75, 220, 16, 32);
    templeCourtyardGeo.rotateX(-Math.PI / 2);
    const templeCourtyardMat = new THREE.MeshStandardMaterial({
      color: 0x544a3d, // Warm distinct sandstone temple courtyard
      roughness: 0.82,
      metalness: 0.08
    });
    this.farShoreMesh = new THREE.Mesh(templeCourtyardGeo, templeCourtyardMat);
    this.farShoreMesh.position.set(-66, 0.45, 0);
    this.farShoreMesh.receiveShadow = true;
    this.scene.add(this.farShoreMesh);

    // Stone quay / steps along temple riverbank
    const quayGeo = new THREE.BoxGeometry(3.5, 0.8, 220);
    const quayMat = new THREE.MeshStandardMaterial({
      color: 0x665e52, // Ancient stone embankment
      roughness: 0.78
    });
    const quay = new THREE.Mesh(quayGeo, quayMat);
    quay.position.set(-29.5, 0.3, 0);
    this.scene.add(quay);
  }

  createCleanFullMoon() {
    // Generate detailed natural Moon Texture
    const moonCanvas = document.createElement('canvas');
    moonCanvas.width = 1024;
    moonCanvas.height = 512;
    const mCtx = moonCanvas.getContext('2d');

    const bgGrad = mCtx.createLinearGradient(0, 0, 1024, 512);
    bgGrad.addColorStop(0, '#eaf2fc');
    bgGrad.addColorStop(0.5, '#d4e2f2');
    bgGrad.addColorStop(1, '#c0d4ea');
    mCtx.fillStyle = bgGrad;
    mCtx.fillRect(0, 0, 1024, 512);

    // Lunar Maria
    mCtx.fillStyle = 'rgba(75, 95, 125, 0.32)';
    const maria = [
      { x: 380, y: 220, rx: 110, ry: 75, angle: 0.2 },
      { x: 580, y: 190, rx: 140, ry: 90, angle: -0.15 },
      { x: 490, y: 310, rx: 130, ry: 80, angle: 0.4 },
      { x: 260, y: 250, rx: 80, ry: 60, angle: 0 },
      { x: 670, y: 320, rx: 90, ry: 65, angle: -0.3 },
      { x: 780, y: 210, rx: 70, ry: 50, angle: 0.1 }
    ];

    maria.forEach(m => {
      mCtx.beginPath();
      mCtx.ellipse(m.x, m.y, m.rx, m.ry, m.angle, 0, Math.PI * 2);
      mCtx.fill();
    });

    for (let i = 0; i < 240; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 512;
      const cr = 2 + Math.random() * 12;
      mCtx.fillStyle = `rgba(55, 75, 105, ${0.08 + Math.random() * 0.14})`;
      mCtx.beginPath();
      mCtx.arc(cx, cy, cr, 0, Math.PI * 2);
      mCtx.fill();
    }

    const moonTexture = new THREE.CanvasTexture(moonCanvas);

    const moonGroup = new THREE.Group();
    moonGroup.position.set(-16, 34, -90);

    // Clean Moon Sphere (สว่างพอดี นุ่มนวล ไม่จ้าเกินไป)
    const moonGeo = new THREE.SphereGeometry(14.0, 48, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      color: 0xffffff,
      emissive: 0x90aed0,
      emissiveIntensity: 0.48, // Moderate natural glow
      roughness: 0.65,
      metalness: 0.05
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.rotation.y = -Math.PI / 2.2;
    moonGroup.add(moonMesh);

    // Soft Lunar Corona Disc (gentle, no additive whiteout)
    const haloGeo = new THREE.PlaneGeometry(42, 42);
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const hCtx = haloCanvas.getContext('2d');
    const grad = hCtx.createRadialGradient(128, 128, 50, 128, 128, 128);
    grad.addColorStop(0, 'rgba(215, 235, 255, 0.3)');
    grad.addColorStop(0.4, 'rgba(165, 205, 245, 0.12)');
    grad.addColorStop(1, 'rgba(100, 150, 220, 0)');
    hCtx.fillStyle = grad;
    hCtx.fillRect(0, 0, 256, 256);

    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.NormalBlending,
      opacity: 0.85,
      depthWrite: false
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.z = -1;
    moonGroup.add(haloMesh);

    this.scene.add(moonGroup);
  }

  createThaiTempleAcrossRiver() {
    // Beautiful Thai Temple Setting across the river (สว่างพอประมาณ ชัดเจนแม้ปิด Bloom)
    const templeGroup = new THREE.Group();
    templeGroup.position.set(-52, 0.5, -25);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdeb836,
      emissive: 0x8a6015,
      emissiveIntensity: 0.45, // Soft warm golden sheen
      roughness: 0.35,
      metalness: 0.8
    });

    const whiteWallMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.65,
      metalness: 0.05
    });

    const terracottaRoofMat = new THREE.MeshStandardMaterial({
      color: 0x9a3826,
      roughness: 0.6
    });

    // 1. Main Temple Ubosot (พระอุโบสถวัดไทย)
    const ubosotGroup = new THREE.Group();
    ubosotGroup.position.set(0, 0, 8);

    // Marble/Stone Podium base
    const podiumGeo = new THREE.BoxGeometry(22, 1.4, 13);
    const podium = new THREE.Mesh(podiumGeo, whiteWallMat);
    podium.position.y = 0.7;
    podium.castShadow = true;
    ubosotGroup.add(podium);

    // Main Hall Walls
    const hallGeo = new THREE.BoxGeometry(19, 5.2, 10);
    const hall = new THREE.Mesh(hallGeo, whiteWallMat);
    hall.position.y = 4.0;
    hall.castShadow = true;
    ubosotGroup.add(hall);

    // Colonnade pillars (เสาพาไลวัดไทย)
    for (let c = -8; c <= 8; c += 2.6) {
      const colGeo = new THREE.CylinderGeometry(0.24, 0.28, 5.2, 10);
      const col = new THREE.Mesh(colGeo, whiteWallMat);
      col.position.set(c, 4.0, 5.6);
      ubosotGroup.add(col);

      const colBack = new THREE.Mesh(colGeo, whiteWallMat);
      colBack.position.set(c, 4.0, -5.6);
      ubosotGroup.add(colBack);
    }

    // Triple Tier Curved Roof (หลังคาวัดไทยซ้อน ๓ ชั้น)
    const roofLevels = [
      { w: 23, d: 12.5, h: 2.2, y: 7.2 },
      { w: 18, d: 10.0, h: 2.0, y: 8.8 },
      { w: 13, d: 7.5, h: 1.8, y: 10.2 }
    ];

    roofLevels.forEach((rl, idx) => {
      const rGeo = new THREE.ConeGeometry(rl.w * 0.5, rl.h, 4);
      rGeo.scale(1, 0.6, rl.d / rl.w);
      rGeo.rotateY(Math.PI / 4);
      const rMesh = new THREE.Mesh(rGeo, idx === 2 ? goldMat : terracottaRoofMat);
      rMesh.position.y = rl.y;
      rMesh.castShadow = true;
      ubosotGroup.add(rMesh);

      const trimGeo = new THREE.BoxGeometry(rl.w * 0.9, 0.14, 0.14);
      const trim = new THREE.Mesh(trimGeo, goldMat);
      trim.position.set(0, rl.y + rl.h * 0.35, 0);
      ubosotGroup.add(trim);
    });

    // Chofa spires
    [-10.5, 10.5].forEach(cx => {
      const chofaGeo = new THREE.ConeGeometry(0.14, 1.4, 6);
      chofaGeo.rotateZ(cx > 0 ? -0.4 : 0.4);
      const chofa = new THREE.Mesh(chofaGeo, goldMat);
      chofa.position.set(cx, 8.2, 0);
      ubosotGroup.add(chofa);
    });

    templeGroup.add(ubosotGroup);

    // 2. Twin Golden Stupas (พระเจดีย์สีทอง)
    this.createThaiChedi(templeGroup, -16, 0, -8, 1.25, goldMat);
    this.createThaiChedi(templeGroup, 16, 0, -8, 0.95, goldMat);

    // 3. Temple Enclosure Wall & Arched Gate
    const wallGeo = new THREE.BoxGeometry(45, 1.6, 0.5);
    const wall = new THREE.Mesh(wallGeo, whiteWallMat);
    wall.position.set(0, 0.8, 16.5);
    templeGroup.add(wall);

    const gateGeo = new THREE.BoxGeometry(4.5, 4.5, 0.8);
    const gate = new THREE.Mesh(gateGeo, goldMat);
    gate.position.set(0, 2.25, 16.5);
    templeGroup.add(gate);

    const gateSpireGeo = new THREE.ConeGeometry(1.6, 3.2, 4);
    gateSpireGeo.rotateY(Math.PI / 4);
    const gateSpire = new THREE.Mesh(gateSpireGeo, goldMat);
    gateSpire.position.set(0, 5.8, 16.5);
    templeGroup.add(gateSpire);

    // 4. Soft Temple Illumination (สว่างพอดี นวลตา มีมิติสวยงาม)
    const templeLight = new THREE.PointLight(0xffbe60, 1.45, 45, 1.8);
    templeLight.position.set(0, 6, 11);
    templeGroup.add(templeLight);

    const chediLight = new THREE.PointLight(0xffb24e, 1.15, 36, 1.8);
    chediLight.position.set(-16, 7, -6);
    templeGroup.add(chediLight);

    this.scene.add(templeGroup);
  }

  createThaiChedi(parent, x, y, z, scale, mat) {
    const chediGroup = new THREE.Group();
    chediGroup.position.set(x, y, z);
    chediGroup.scale.setScalar(scale);

    for (let b = 0; b < 3; b++) {
      const size = 7.0 - b * 1.2;
      const bGeo = new THREE.BoxGeometry(size, 0.9, size);
      const bMesh = new THREE.Mesh(bGeo, mat);
      bMesh.position.y = 0.45 + b * 0.9;
      chediGroup.add(bMesh);
    }

    const tiers = [
      { rTop: 2.2, rBot: 2.7, h: 2.2, y: 3.8 },
      { rTop: 1.6, rBot: 2.2, h: 2.0, y: 5.9 },
      { rTop: 0.9, rBot: 1.6, h: 2.2, y: 8.0 },
      { rTop: 0.4, rBot: 0.9, h: 2.6, y: 10.4 },
      { rTop: 0.05, rBot: 0.4, h: 4.8, y: 14.1 }
    ];

    tiers.forEach(t => {
      const tGeo = new THREE.CylinderGeometry(t.rTop, t.rBot, t.h, 16);
      const tMesh = new THREE.Mesh(tGeo, mat);
      tMesh.position.y = t.y;
      tMesh.castShadow = true;
      chediGroup.add(tMesh);
    });

    parent.add(chediGroup);
  }

  createCleanWoodenPier() {
    // Sturdy, elegant, straight traditional Thai Teak Wood Pier (ต่อเชื่อมสวยงามเรียบร้อย ไม่แปลก)
    const pierGroup = new THREE.Group();
    pierGroup.position.set(0, 0, 0);

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2716, // Dark aged teak wood
      roughness: 0.75,
      metalness: 0.08
    });

    const plankMat = new THREE.MeshStandardMaterial({
      color: 0x4a321e,
      roughness: 0.7,
      metalness: 0.05
    });

    // Straight solid walkway: extends from x = 11 (riverbank ground) to x = -3.5 (over water)
    const pierStartX = 11.0;
    const pierEndX = -3.5;
    const pierLength = pierStartX - pierEndX; // 14.5m
    const numPlanks = 36;
    const plankWidth = pierLength / numPlanks;
    const pierWidth = 4.6;

    for (let i = 0; i < numPlanks; i++) {
      const px = pierStartX - i * plankWidth - plankWidth * 0.5;
      const plankGeo = new THREE.BoxGeometry(plankWidth * 0.94, 0.16, pierWidth);
      const plank = new THREE.Mesh(plankGeo, plankMat);

      // Smooth gentle slope from ground (1.8m) down to pier deck (0.55m)
      const t = i / numPlanks;
      const py = 1.6 - t * 1.05;
      plank.position.set(px, py, 0);
      plank.castShadow = true;
      plank.receiveShadow = true;
      pierGroup.add(plank);
    }

    // Sturdy Support Stilts in the water (aligned in pairs)
    const stiltXs = [9.5, 5.5, 1.5, -2.5];
    stiltXs.forEach(sx => {
      [-2.1, 2.1].forEach(sz => {
        const stiltGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.2, 12);
        const stilt = new THREE.Mesh(stiltGeo, woodMat);
        stilt.position.set(sx, 0.4, sz);
        stilt.castShadow = true;
        pierGroup.add(stilt);

        // Water moss ring at waterline
        const ringGeo = new THREE.TorusGeometry(0.24, 0.05, 8, 16);
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({ color: 0x1a3320 }));
        ring.position.set(sx, 0.04, sz);
        pierGroup.add(ring);
      });
    });

    // Handrails on left and right sides
    [-2.2, 2.2].forEach(rz => {
      // Top rail
      const railGeo = new THREE.BoxGeometry(pierLength, 0.1, 0.12);
      const rail = new THREE.Mesh(railGeo, woodMat);
      rail.position.set((pierStartX + pierEndX) / 2, 1.55, rz);
      rail.rotation.z = 0.072; // match walkway slope
      rail.castShadow = true;
      pierGroup.add(rail);

      // Mid rail
      const midRail = new THREE.Mesh(railGeo, woodMat);
      midRail.position.set((pierStartX + pierEndX) / 2, 1.15, rz);
      midRail.rotation.z = 0.072;
      pierGroup.add(midRail);

      // Baluster posts
      for (let bx = pierEndX + 0.4; bx <= pierStartX - 0.4; bx += 1.8) {
        const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.1, 8);
        const post = new THREE.Mesh(postGeo, woodMat);
        const t = (pierStartX - bx) / pierLength;
        post.position.set(bx, 1.6 - t * 1.05 + 0.55, rz);
        post.castShadow = true;
        pierGroup.add(post);
      }
    });

    // Floating Platform at tip (where player floats krathongs into water)
    const tipPlatformGeo = new THREE.BoxGeometry(3.2, 0.22, 6.0);
    const tipPlatform = new THREE.Mesh(tipPlatformGeo, plankMat);
    tipPlatform.position.set(-3.6, 0.45, 0);
    tipPlatform.castShadow = true;
    tipPlatform.receiveShadow = true;
    pierGroup.add(tipPlatform);

    // Warm Hanging Lanterns along the pier & river edge (สว่างพอดีๆ ไม่มากไม่น้อยเกินไป)
    const lanternSpots = [
      [-3.6, 1.9, -2.8],
      [-3.6, 1.9, 2.8],
      [3.0, 2.1, -2.4],
      [3.0, 2.1, 2.4],
      [10.0, 2.4, -2.4],
      [10.0, 2.4, 2.4]
    ];

    lanternSpots.forEach(([lx, ly, lz]) => {
      this.createWarmPierLantern(pierGroup, lx, ly, lz);
    });

    // Riverside walkway light poles (หลอดไฟสว่างตามแม่น้ำแบบพอดี)
    const riversideSpots = [
      [8.0, 1.8, -16.0],
      [8.0, 1.8, -32.0],
      [8.0, 1.8, 16.0],
      [8.0, 1.8, 32.0]
    ];

    riversideSpots.forEach(([rx, ry, rz]) => {
      this.createRiversideLightPole(pierGroup, rx, ry, rz);
    });

    this.scene.add(pierGroup);
  }

  createWarmPierLantern(parent, x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const postMat = new THREE.MeshStandardMaterial({ color: 0x22150a, roughness: 0.8 });
    const armGeo = new THREE.BoxGeometry(0.08, 0.08, 0.5);
    const arm = new THREE.Mesh(armGeo, postMat);
    arm.position.set(0, 0, z > 0 ? -0.2 : 0.2);
    group.add(arm);

    // Paper lantern body
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.38, 8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffb84d,
      emissive: 0xff8811,
      emissiveIntensity: 0.95, // Balanced pleasant glow
      roughness: 0.5,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, -0.38, 0);
    group.add(body);

    // Warm PointLight (สว่างพอดี ไม่จ้าเกินไป)
    const light = new THREE.PointLight(0xffa544, 0.75, 7.5, 1.8);
    light.position.set(0, -0.38, 0);
    group.add(light);

    parent.add(group);
  }

  createRiversideLightPole(parent, x, y, z) {
    const poleGroup = new THREE.Group();
    poleGroup.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x2c1d11, roughness: 0.85 });
    const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 2.8, 8);
    const post = new THREE.Mesh(postGeo, woodMat);
    post.position.y = 1.4;
    post.castShadow = true;
    poleGroup.add(post);

    // Hanging warm Edison bulb
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe6aa });
    const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 2.65, 0);
    poleGroup.add(bulb);

    const bulbLight = new THREE.PointLight(0xffa033, 0.7, 7.0, 1.8);
    bulbLight.position.set(0, 2.5, 0);
    poleGroup.add(bulbLight);

    parent.add(poleGroup);
  }

  createTrees() {
    const treePositions = [
      { x: 18, z: -35, type: 'banana', scale: 1.1 },
      { x: 24, z: -45, type: 'palm', scale: 1.3 },
      { x: 20, z: 32, type: 'banana', scale: 1.0 },
      { x: 26, z: 42, type: 'palm', scale: 1.4 },
      { x: 42, z: -25, type: 'palm', scale: 1.2 },
      { x: 45, z: 28, type: 'banana', scale: 1.2 }
    ];

    treePositions.forEach(tp => {
      if (tp.type === 'palm') {
        this.createPalmTree(tp.x, tp.z, tp.scale);
      } else {
        this.createBananaTree(tp.x, tp.z, tp.scale);
      }
    });
  }

  createPalmTree(x, z, scale) {
    const group = new THREE.Group();
    group.position.set(x, 1.0, z);
    group.scale.setScalar(scale);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3c2c, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x1d4a22,
      roughness: 0.6,
      side: THREE.DoubleSide
    });

    const trunkHeight = 7.5;
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.45, trunkHeight, 10);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, trunkHeight / 2, 0);
    trunk.rotation.z = (Math.random() - 0.5) * 0.15;
    trunk.castShadow = true;
    group.add(trunk);

    const frondCount = 9;
    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * Math.PI * 2;
      const frondGeo = new THREE.ConeGeometry(0.8, 4.0, 5);
      frondGeo.scale(1, 0.1, 1);
      frondGeo.translate(0, 2.0, 0);
      frondGeo.rotateX(Math.PI / 2.6);

      const frond = new THREE.Mesh(frondGeo, leafMat);
      frond.position.set(0, trunkHeight, 0);
      frond.rotation.y = angle;
      frond.castShadow = true;
      group.add(frond);
    }

    this.scene.add(group);
  }

  createBananaTree(x, z, scale) {
    const group = new THREE.Group();
    group.position.set(x, 1.2, z);
    group.scale.setScalar(scale);

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3d682e, roughness: 0.8 });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e8238,
      roughness: 0.5,
      side: THREE.DoubleSide
    });

    const stemGeo = new THREE.CylinderGeometry(0.18, 0.32, 4.2, 8);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 2.1, 0);
    stem.castShadow = true;
    group.add(stem);

    const leafCount = 6;
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2 + (i % 2) * 0.3;
      const leafGeo = new THREE.PlaneGeometry(1.2, 3.2, 4, 8);
      leafGeo.translate(0, 1.6, 0);
      leafGeo.rotateX(Math.PI / 3.0);

      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(0, 3.8, 0);
      leaf.rotation.y = angle;
      leaf.castShadow = true;
      group.add(leaf);
    }

    this.scene.add(group);
  }

  createStarfield() {
    // Starfield & Magical Fireflies across the sky (มีดวงดาวระยิบระยับชัดเจน)
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3 + 0] = -120 + Math.random() * 240;
      starPos[i * 3 + 1] = 12 + Math.random() * 95;
      starPos[i * 3 + 2] = -140 + Math.random() * 220;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.85,
      transparent: true,
      opacity: 0.95
    });

    const stars = new THREE.Points(starGeo, starMat);
    this.scene.add(stars);
  }
}
