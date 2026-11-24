import * as THREE from 'three';
import { soundEngine } from '../audio/synth.js';

// Vibrant celebratory firework color palettes
const FIREWORK_COLORS = [
  0xff3366, // Rose Red
  0xffd700, // Golden Yellow
  0x00f0ff, // Electric Cyan
  0xa855f7, // Royal Purple
  0x22c55e, // Emerald Green
  0xff8800, // Vibrant Orange
  0xffffff  // Brilliant Silver
];

export class FireworksManager {
  constructor(scene) {
    this.scene = scene;
    this.fireworks = []; // Active rockets and explosion particle groups
    this.maxParticles = 600;

    // Shared particle geometry & texture
    this.particleGeo = new THREE.BufferGeometry();
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    this.sparkTexture = new THREE.CanvasTexture(particleCanvas);

    // Dynamic Flash Light for realistic scene illumination during explosion
    this.flashLight = new THREE.PointLight(0xffffff, 0, 80, 1.5);
    this.scene.add(this.flashLight);
    this.flashDecay = 0;
  }

  launch(targetPos = null, color = null) {
    // Default launch positions around river / festival
    const startX = -15 + Math.random() * 35;
    const startY = 1.0;
    const startZ = -30 + Math.random() * 60;

    // Target burst position high in the sky
    const endX = targetPos ? targetPos.x : startX + (Math.random() - 0.5) * 15;
    const endY = targetPos ? Math.max(22, targetPos.y) : 32 + Math.random() * 22;
    const endZ = targetPos ? targetPos.z : startZ + (Math.random() - 0.5) * 20;

    const chosenColor = color || FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

    // 1. Create Rocket Mesh (Bright glowing spark)
    const rocketMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const rocketGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const rocketMesh = new THREE.Mesh(rocketGeo, rocketMat);
    rocketMesh.position.set(startX, startY, startZ);
    this.scene.add(rocketMesh);

    // Play initial sound whistle & explosion via Web Audio
    soundEngine.playFireworkSound();

    this.fireworks.push({
      type: 'rocket',
      mesh: rocketMesh,
      pos: new THREE.Vector3(startX, startY, startZ),
      targetPos: new THREE.Vector3(endX, endY, endZ),
      color: chosenColor,
      progress: 0,
      duration: 0.6 + Math.random() * 0.15 // Time to reach burst altitude
    });
  }

  explode(pos, color) {
    const count = 140; // Number of sparks in explosion burst
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    // Spherical particle burst distribution
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      // Random spherical velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 7.0 + Math.random() * 14.0;

      velocities.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.cos(phi) * speed + 3.0, // slight upward boost
          Math.sin(phi) * Math.sin(theta) * speed
        )
      );
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.8,
      map: this.sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: color
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    // Trigger bright flash of light reflecting across river
    this.flashLight.color.setHex(color);
    this.flashLight.position.copy(pos);
    this.flashLight.intensity = 8.0;
    this.flashDecay = 1.0;

    this.fireworks.push({
      type: 'particles',
      points: points,
      velocities: velocities,
      life: 1.0,
      decay: 0.65 + Math.random() * 0.25
    });
  }

  update(delta) {
    // Update flash light decay
    if (this.flashDecay > 0) {
      this.flashDecay -= delta * 3.5;
      this.flashLight.intensity = Math.max(0, this.flashDecay * 7.0);
    }

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];

      if (fw.type === 'rocket') {
        fw.progress += delta / fw.duration;
        if (fw.progress >= 1.0) {
          // Explode rocket at peak
          this.scene.remove(fw.mesh);
          fw.mesh.geometry.dispose();
          this.explode(fw.targetPos, fw.color);
          this.fireworks.splice(i, 1);
        } else {
          // Quadratic ease-out ascent
          const t = fw.progress;
          fw.mesh.position.lerpVectors(fw.pos, fw.targetPos, t);
        }
      } else if (fw.type === 'particles') {
        fw.life -= delta * fw.decay;
        if (fw.life <= 0) {
          this.scene.remove(fw.points);
          fw.points.geometry.dispose();
          fw.points.material.dispose();
          this.fireworks.splice(i, 1);
        } else {
          const pos = fw.points.geometry.attributes.position;
          fw.points.material.opacity = fw.life;

          for (let p = 0; p < fw.velocities.length; p++) {
            const v = fw.velocities[p];
            // Apply gravity and air drag
            v.y -= 9.8 * delta * 0.9;
            v.multiplyScalar(0.96);

            pos.array[p * 3 + 0] += v.x * delta;
            pos.array[p * 3 + 1] += v.y * delta;
            pos.array[p * 3 + 2] += v.z * delta;
          }
          pos.needsUpdate = true;
        }
      }
    }
  }
}
