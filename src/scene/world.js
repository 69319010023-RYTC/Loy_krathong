import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // 1. Scene - Bright, vibrant nocturnal twilight sky (สว่างโปร่ง มีมิติสีน้ำเงินราตรีงดงามสมจริง)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x163866); // Luminous twilight blue night sky
    this.scene.fog = new THREE.FogExp2(0x183b6c, 0.0028); // Gentle airy atmospheric depth, not muddy or pitch dark

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 500);
    this.camera.position.set(4, 5.2, 11.5);

    // 3. Renderer - Smooth 60 FPS capped pixel ratio
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 140.0;
    this.controls.target.set(-2, 0.8, 0);

    // 5. Lighting
    this.setupLighting();

    // 6. Post-processing (Balanced UnrealBloomPass with active toggle)
    this.isBloomEnabled = true;
    this.setupPostProcessing();

    window.addEventListener('resize', () => this.onResize());
  }

  setupLighting() {
    // Ambient night sky light - bright soft twilight blue fill (สว่างพอดี เห็นรายละเอียดชัดเจนแม้ปิด Bloom)
    this.ambientLight = new THREE.AmbientLight(0x557cae, 1.35);
    this.scene.add(this.ambientLight);

    // Moonlight (Directional Light) from the full moon - clean 1024 shadow map for high FPS
    this.moonLight = new THREE.DirectionalLight(0xd2e5fc, 1.3);
    this.moonLight.position.set(-16, 32, -85);
    this.moonLight.castShadow = true;
    this.moonLight.shadow.mapSize.width = 1024;
    this.moonLight.shadow.mapSize.height = 1024;
    this.moonLight.shadow.camera.near = 10;
    this.moonLight.shadow.camera.far = 200;
    this.moonLight.shadow.camera.left = -45;
    this.moonLight.shadow.camera.right = 45;
    this.moonLight.shadow.camera.top = 45;
    this.moonLight.shadow.camera.bottom = -45;
    this.moonLight.shadow.bias = -0.0005;
    this.scene.add(this.moonLight);

    // Soft warm festival ground fill light
    this.festivalFillLight = new THREE.DirectionalLight(0xffc27a, 0.85);
    this.festivalFillLight.position.set(35, 20, 8);
    this.scene.add(this.festivalFillLight);

    // Hemisphere Light for balanced sky/ground contrast
    const hemiLight = new THREE.HemisphereLight(0x4a74a8, 0x2d3a2b, 0.8);
    this.scene.add(hemiLight);
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // UnrealBloomPass tuned to moderate, gentle glow (ไม่ขาวจ้า ไม่บดบังฉาก)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      0.45, // Soft strength (no blinding whiteout)
      0.35, // radius
      0.68  // High threshold: only intense light cores have subtle bloom
    );
    this.composer.addPass(this.bloomPass);
  }

  setBloomEnabled(enabled) {
    this.isBloomEnabled = !!enabled;
    if (this.bloomPass) {
      this.bloomPass.enabled = !!enabled;
    }
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.composer.setSize(this.width, this.height);
  }

  render() {
    this.controls.update();
    if (this.isBloomEnabled) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
