import * as THREE from 'three';

/**
 * Procedural River Water System:
 * - Luminous Royal Sapphire Blue water (สีน้ำเงินครามแม่น้ำเจ้าพระยายามค่ำคืน)
 * - Ultra-smooth natural river ripples (คลื่นน้ำไหลลื่นไหลนุ่มนวล)
 * - Clean PBR specular reflections without harsh blown-out glare
 * - Soft golden candle glimmers
 */

export function getWaterHeight(x, z, time) {
  // Ultra-smooth, gentle fluid swells
  const wave1 = Math.sin(x * 0.22 + time * 1.0) * 0.05;
  const wave2 = Math.cos(z * 0.16 + time * 0.8) * 0.035;
  const wave3 = Math.sin((x * 0.3 + z * 0.3) + time * 1.2) * 0.02;
  const shoreFactor = Math.max(0.2, Math.min(1.0, (10 - x) * 0.2));

  return (wave1 + wave2 + wave3) * shoreFactor;
}

export function getWaterSlope(x, z, time) {
  const eps = 0.25;
  const hL = getWaterHeight(x - eps, z, time);
  const hR = getWaterHeight(x + eps, z, time);
  const hD = getWaterHeight(x, z - eps, time);
  const hU = getWaterHeight(x, z + eps, time);

  const slopeX = (hR - hL) / (2 * eps);
  const slopeZ = (hU - hD) / (2 * eps);

  return { slopeX, slopeZ };
}

export class RiverWater {
  constructor(scene) {
    this.scene = scene;
    this.width = 52;
    this.length = 220;
    // Optimized grid subdivision for buttery-smooth 60 FPS performance
    this.segX = 30;
    this.segZ = 64;

    this.geometry = new THREE.PlaneGeometry(this.width, this.length, this.segX, this.segZ);
    this.geometry.rotateX(-Math.PI / 2);

    this.basePositions = this.geometry.attributes.position.array.slice();

    // Vibrant Luminous Royal Sapphire Blue Water (สีน้ำเงินครามแม่น้ำสดใส สว่างพอดี)
    this.material = new THREE.MeshStandardMaterial({
      color: 0x1460ad, // Vibrant royal sapphire blue
      roughness: 0.22,
      metalness: 0.35,
      flatShading: false,
      transparent: true,
      opacity: 0.94
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(-12, -0.05, 0);
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Deep aquatic twilight river bed
    const bedGeo = new THREE.PlaneGeometry(this.width + 12, this.length, 8, 8);
    bedGeo.rotateX(-Math.PI / 2);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x0c335e,
      roughness: 0.85,
      metalness: 0.1
    });
    this.bedMesh = new THREE.Mesh(bedGeo, bedMat);
    this.bedMesh.position.set(-12, -2.4, 0);
    this.scene.add(this.bedMesh);

    // Subtle gentle water glimmers (soft & cozy)
    this.initWaterGlimmers();
  }

  initWaterGlimmers() {
    const count = 140;
    const glimmerGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = -32 + Math.random() * 38;
      positions[i * 3 + 1] = 0.02;
      positions[i * 3 + 2] = -95 + Math.random() * 190;
      scales[i] = 0.45 + Math.random() * 0.9;
    }

    glimmerGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    glimmerGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 240, 190, 0.55)');
    grad.addColorStop(0.4, 'rgba(255, 200, 100, 0.15)');
    grad.addColorStop(1, 'rgba(255, 190, 80, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const glimmerMat = new THREE.PointsMaterial({
      size: 0.75,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffeaae
    });

    this.glimmers = new THREE.Points(glimmerGeo, glimmerMat);
    this.scene.add(this.glimmers);
  }

  update(time) {
    const pos = this.geometry.attributes.position;
    const base = this.basePositions;
    const riverCenterX = this.mesh.position.x;
    const riverCenterZ = this.mesh.position.z;

    for (let i = 0; i < pos.count; i++) {
      const localX = base[i * 3];
      const localZ = base[i * 3 + 2];
      const worldX = localX + riverCenterX;
      const worldZ = localZ + riverCenterZ;

      pos.array[i * 3 + 1] = getWaterHeight(worldX, worldZ, time);
    }

    pos.needsUpdate = true;
    this.geometry.computeVertexNormals();

    if (this.glimmers) {
      const gPos = this.glimmers.geometry.attributes.position;
      for (let i = 0; i < gPos.count; i++) {
        const wx = gPos.array[i * 3];
        let wz = gPos.array[i * 3 + 2];
        wz += 0.05;
        if (wz > 95) wz = -95;
        gPos.array[i * 3 + 2] = wz;
        gPos.array[i * 3 + 1] = getWaterHeight(wx, wz, time) + 0.025;
      }
      gPos.needsUpdate = true;
    }
  }
}
