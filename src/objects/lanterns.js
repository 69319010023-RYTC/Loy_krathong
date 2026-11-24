import * as THREE from 'three';

/**
 * Yi Peng Sky Lanterns (โคมยี่เป็งลอยฟ้า)
 * - 180 Background ambient lanterns via InstancedMesh & Object Pooling
 * - Player-released lanterns (ปล่อยโคมลอยเองได้) with glowing flame & custom wish badge
 */

export class LanternSky {
  constructor(scene) {
    this.scene = scene;
    this.count = 180;

    // Ambient Instanced Lanterns
    const lanternGeo = new THREE.CylinderGeometry(0.42, 0.36, 1.1, 12, 1, true);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffe6a3,
      emissive: 0xff6600,
      emissiveIntensity: 2.2,
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    this.instancedMesh = new THREE.InstancedMesh(lanternGeo, lanternMat, this.count);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.instancedMesh);

    this.data = [];
    this.dummy = new THREE.Object3D();

    // Player Released Lanterns list
    this.playerLanterns = [];
    this.latestPlayerLantern = null;

    this.initLanterns();
  }

  initLanterns() {
    for (let i = 0; i < this.count; i++) {
      const x = -55 + Math.random() * 105;
      const y = 6 + Math.random() * 85;
      const z = -90 + Math.random() * 180;

      const speedY = 0.8 + Math.random() * 0.9;
      const swaySpeed = 0.4 + Math.random() * 0.6;
      const swayPhase = Math.random() * Math.PI * 2;
      const scale = 0.75 + Math.random() * 0.5;

      this.data.push({
        x,
        y,
        z,
        baseX: x,
        baseZ: z,
        speedY,
        swaySpeed,
        swayPhase,
        scale,
        rotY: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2
      });

      this.updateMatrix(i);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  updateMatrix(i) {
    const d = this.data[i];
    this.dummy.position.set(d.x, d.y, d.z);
    this.dummy.scale.set(d.scale, d.scale, d.scale);
    this.dummy.rotation.set(
      Math.sin(d.swayPhase) * 0.08,
      d.rotY,
      Math.cos(d.swayPhase) * 0.08
    );
    this.dummy.updateMatrix();
    this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
  }

  // Release a dedicated Player Sky Lantern (ปล่อยโคมลอยเอง)
  releasePlayerLantern(name = 'คุณ', wish = 'ขอให้มีแต่ความสุขความเจริญ') {
    const lanternGroup = new THREE.Group();
    // Launch from the Pier floating platform
    const startX = -2.5 + (Math.random() - 0.5) * 2;
    const startY = 1.6;
    const startZ = (Math.random() - 0.5) * 2;
    lanternGroup.position.set(startX, startY, startZ);

    // Glowing Lantern Body
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.46, 1.35, 16, 1, true);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffefb8,
      emissive: 0xff7700,
      emissiveIntensity: 2.8,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    lanternGroup.add(body);

    // Bamboo rim at base
    const rimGeo = new THREE.TorusGeometry(0.48, 0.03, 8, 16);
    rimGeo.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = -0.65;
    lanternGroup.add(rim);

    // Interior Bright Torch Flame
    const flameGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = -0.45;
    lanternGroup.add(flame);

    // Warm PointLight illuminating surrounding sky
    const lanternLight = new THREE.PointLight(0xff9922, 2.8, 14, 1.8);
    lanternLight.position.y = -0.45;
    lanternGroup.add(lanternLight);

    // 3D Billboard Wish Badge floating below the lantern
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 5;

    const x = 10, y = 10, w = 492, h = 160, r = 20;
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

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏮 โคมลอยของคุณ 🏮', 256, 44);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Sarabun, sans-serif';
    const displayName = name.length > 20 ? name.substring(0, 19) + '…' : name;
    ctx.fillText(`ผู้ปล่อย: ${displayName}`, 256, 85);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'italic 23px Sarabun, sans-serif';
    const displayWish = wish.length > 30 ? wish.substring(0, 29) + '…' : wish;
    ctx.fillText(`“${displayWish}”`, 256, 132);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.2, 0.85, 1);
    sprite.position.set(0, -1.3, 0);
    lanternGroup.add(sprite);

    this.scene.add(lanternGroup);

    const playerLanternData = {
      group: lanternGroup,
      baseX: startX,
      baseZ: startZ,
      speedY: 2.2, // Rises gracefully
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.6,
      rotY: Math.random() * Math.PI * 2,
      light: lanternLight
    };

    this.playerLanterns.push(playerLanternData);
    this.latestPlayerLantern = playerLanternData;

    return playerLanternData;
  }

  update(time, delta) {
    // 1. Update Ambient Instanced Lanterns
    for (let i = 0; i < this.count; i++) {
      const d = this.data[i];
      d.y += d.speedY * delta * 2.0;

      d.swayPhase += d.swaySpeed * delta;
      d.x = d.baseX + Math.sin(d.swayPhase) * 1.6 + Math.sin(time * 0.3) * 0.8;
      d.z = d.baseZ + Math.cos(d.swayPhase * 0.8) * 1.4;
      d.rotY += d.rotSpeed * delta;

      if (d.y > 95.0) {
        d.y = 5.0 + Math.random() * 8.0;
        d.baseX = -20 + Math.random() * 55;
        d.baseZ = -40 + Math.random() * 80;
        d.x = d.baseX;
        d.z = d.baseZ;
        d.speedY = 0.8 + Math.random() * 0.9;
      }

      this.updateMatrix(i);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;

    // 2. Update Player Released Lanterns
    for (let i = this.playerLanterns.length - 1; i >= 0; i--) {
      const pl = this.playerLanterns[i];
      pl.group.position.y += pl.speedY * delta;

      pl.swayPhase += pl.swaySpeed * delta;
      pl.group.position.x = pl.baseX + Math.sin(pl.swayPhase) * 2.2;
      pl.group.position.z = pl.baseZ + Math.cos(pl.swayPhase * 0.8) * 1.8;
      pl.group.rotation.y += 0.2 * delta;

      // Slight flicker
      if (pl.light) {
        pl.light.intensity = 2.8 + Math.sin(time * 15) * 0.4;
      }

      // Cleanup if reaches stratosphere
      if (pl.group.position.y > 140) {
        this.scene.remove(pl.group);
        this.playerLanterns.splice(i, 1);
      }
    }
  }
}
