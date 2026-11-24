import * as THREE from 'three';
import { World } from './scene/world.js';
import { RiverWater } from './scene/water.js';
import { Environment } from './scene/environment.js';
import { KrathongManager } from './objects/krathongManager.js';
import { LanternSky } from './objects/lanterns.js';
import { FireworksManager } from './objects/fireworks.js';
import { TempleFair } from './objects/templeFair.js';
import { ContestantsGroup, LOY_KRATHONG_KNOWLEDGE } from './objects/contestants.js';
import { CameraController } from './utils/cameraController.js';
import { soundEngine } from './audio/synth.js';

class App {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.world = new World(this.canvas);
    this.water = new RiverWater(this.world.scene);
    this.environment = new Environment(this.world.scene);
    this.krathongManager = new KrathongManager(this.world.scene);
    this.lanternSky = new LanternSky(this.world.scene);
    this.fireworks = new FireworksManager(this.world.scene);
    this.templeFair = new TempleFair(this.world.scene);
    this.contestants = new ContestantsGroup(this.world.scene);
    this.cameraController = new CameraController(this.world.camera, this.world.controls);

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.selectedKrathongStyle = 'banana_leaf';
    this.userInteracted = false;

    this.initUI();
    this.initInteractionEvents();

    // Start render loop
    this.animate();
  }

  initUI() {
    // 1. Audio Controls
    const soundToggleBtn = document.getElementById('btn-sound-toggle');
    const audioTrackLabel = document.getElementById('audio-track-label');

    const updateAudioUI = () => {
      if (soundEngine.isMuted) {
        soundToggleBtn.innerHTML = `
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
          <span>เปิดเสียง</span>
        `;
        soundToggleBtn.classList.remove('active');
      } else {
        soundToggleBtn.innerHTML = `
          <svg class="icon pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          <span>ปิดเสียง</span>
        `;
        soundToggleBtn.classList.add('active');
      }
    };

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.ensureAudioStarted();
        soundEngine.toggleMute();
        updateAudioUI();
      });
    }

    // 2. Camera View Buttons
    const viewButtons = document.querySelectorAll('.nav-view-btn');
    viewButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.dataset.view;
        this.cameraController.warpTo(view);
      });
    });

    // 3. Fireworks Launch Button
    const fireworkBtn = document.getElementById('btn-launch-firework');
    if (fireworkBtn) {
      fireworkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.ensureAudioStarted();
        this.launchCelebrationFirework();
      });
    }

    // 4. Krathong Style Selection
    const styleOptions = document.querySelectorAll('.style-card');
    styleOptions.forEach((card) => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        styleOptions.forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedKrathongStyle = card.dataset.style;
      });
    });

    // 5. Quick Wish Preset Pills
    const wishPills = document.querySelectorAll('.wish-pill');
    const wishInput = document.getElementById('input-wish');
    wishPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wishInput) {
          wishInput.value = pill.innerText;
          wishInput.focus();
        }
      });
    });

    // 6. Release Krathong Button
    const releaseBtn = document.getElementById('btn-release-krathong');
    const nameInput = document.getElementById('input-name');
    const releaseSuccessToast = document.getElementById('release-toast');

    if (releaseBtn) {
      releaseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.ensureAudioStarted();

        const name = (nameInput && nameInput.value.trim()) || 'ผู้ร่วมลอยกระทง';
        const wish = (wishInput && wishInput.value.trim()) || 'ขอให้ชีวิตร่มเย็นเป็นสุข ปราศจากโรคภัย';
        const style = this.selectedKrathongStyle;

        // Warp camera to Pier view so the player sees their krathong release clearly
        this.cameraController.warpTo('pier', 1.0);

        setTimeout(() => {
          this.krathongManager.addPlayerKrathong(name, wish, style);
          try {
            soundEngine.playWaterSplash();
          } catch (err) {}

          // Launch celebratory fireworks for the player!
          setTimeout(() => this.fireworks.launch(), 400);
          setTimeout(() => this.fireworks.launch(), 900);

          // Show floating success toast
          if (releaseSuccessToast) {
            releaseSuccessToast.innerHTML = `
              <div class="toast-content">
                <span class="toast-icon">✨</span>
                <div>
                  <strong>ลอยกระทงสำเร็จแล้ว!</strong>
                  <p>ขอให้คำอธิษฐานของคุณสัมฤทธิ์ผล และเคราะห์ภัยลอยไปกับสายน้ำ 🌕🪷</p>
                </div>
              </div>
            `;
            releaseSuccessToast.classList.add('show');
            setTimeout(() => releaseSuccessToast.classList.remove('show'), 4000);
          }
        }, 500);
      });
    }

    // 7. Release Sky Lantern Button (ปล่อยโคมลอยเองได้)
    const releaseLanternBtn = document.getElementById('btn-release-lantern');
    if (releaseLanternBtn) {
      releaseLanternBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.ensureAudioStarted();

        const name = (nameInput && nameInput.value.trim()) || 'คุณและครอบครัว';
        const wish = (wishInput && wishInput.value.trim()) || 'ขอให้ชีวิตรุ่งโรจน์ โชติช่วงดั่งแสงประทีป';

        this.cameraController.warpTo('pier', 1.0);

        setTimeout(() => {
          const lantern = this.lanternSky.releasePlayerLantern(name, wish);

          // Follow lantern smoothly upward
          setTimeout(() => {
            this.cameraController.followObject(lantern.group, 'lantern');
          }, 300);

          // Celebratory firework launch
          setTimeout(() => this.fireworks.launch(), 500);

          if (releaseSuccessToast) {
            releaseSuccessToast.innerHTML = `
              <div class="toast-content">
                <span class="toast-icon">🏮</span>
                <div>
                  <strong>ปล่อยโคมลอยสำเร็จแล้ว!</strong>
                  <p>ขอให้คำอธิษฐานลอยขึ้นสู่สรวงสวรรค์ ดั่งแสงไฟสว่างไสว 🌕✨</p>
                </div>
              </div>
            `;
            releaseSuccessToast.classList.add('show');
            setTimeout(() => releaseSuccessToast.classList.remove('show'), 4000);
          }
        }, 500);
      });
    }

    // 8. Follow Player Krathong Button
    const followBtn = document.getElementById('btn-follow-krathong');
    if (followBtn) {
      followBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.krathongManager.latestPlayerKrathong) {
          this.cameraController.followObject(this.krathongManager.latestPlayerKrathong.group, 'krathong');
        }
      });
    }

    // 8. Contestants Info Modal
    const infoModal = document.getElementById('contestants-modal');
    const openInfoBtn = document.getElementById('btn-open-contestants');
    const closeInfoBtn = document.getElementById('btn-close-contestants');
    const contestantsGrid = document.getElementById('contestants-grid');

    if (openInfoBtn && infoModal && closeInfoBtn && contestantsGrid) {
      openInfoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.renderContestantsInfo(contestantsGrid);
        infoModal.classList.add('open');
      });

      closeInfoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        infoModal.classList.remove('open');
      });

      infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) infoModal.classList.remove('open');
      });
    }

    // 9. Floating Panel Collapse Toggle (for unobtrusive viewing)
    const collapseBtn = document.getElementById('btn-toggle-dock');
    const dockCard = document.getElementById('krathong-dock');
    if (collapseBtn && dockCard) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dockCard.classList.toggle('collapsed');
      });
    }

    // 10. Settings (Bloom toggle)
    const bloomToggle = document.getElementById('toggle-bloom');
    if (bloomToggle) {
      bloomToggle.addEventListener('change', (e) => {
        this.world.setBloomEnabled(e.target.checked);
      });
    }
  }

  renderContestantsInfo(container) {
    container.innerHTML = LOY_KRATHONG_KNOWLEDGE.map((c) => `
      <div class="contestant-card">
        <div class="card-header" style="border-left: 5px solid #${c.colorHex.toString(16).padStart(6, '0')}">
          <span class="badge">เรื่องที่ ${c.thaiNum}</span>
          <h3 class="card-title">${c.title}</h3>
        </div>
        <p class="contestant-name"><strong>${c.subtitle}</strong></p>
        <p class="dress-desc" style="white-space: pre-line;">${c.desc}</p>
      </div>
    `).join('');
  }

  ensureAudioStarted() {
    // 1. Immediately dismiss welcome overlay
    const firstTapOverlay = document.getElementById('first-tap-overlay');
    if (firstTapOverlay) {
      firstTapOverlay.classList.add('hidden');
      firstTapOverlay.style.pointerEvents = 'none';
      setTimeout(() => {
        firstTapOverlay.style.display = 'none';
      }, 400);
    }

    // 2. Start Web Audio safely
    if (!this.userInteracted) {
      this.userInteracted = true;
      try {
        soundEngine.start();
      } catch (err) {
        console.warn('Audio start error:', err);
      }
    }
  }

  launchCelebrationFirework() {
    this.fireworks.launch();
    setTimeout(() => this.fireworks.launch(), 350);
  }

  initInteractionEvents() {
    // Dismiss overlay on tap anywhere or direct click
    const firstTapOverlay = document.getElementById('first-tap-overlay');
    if (firstTapOverlay) {
      firstTapOverlay.addEventListener('click', () => this.ensureAudioStarted());
      firstTapOverlay.addEventListener('pointerdown', () => this.ensureAudioStarted());
    }

    // Global listener for first user interaction
    const onFirstUserClick = () => {
      this.ensureAudioStarted();
      window.removeEventListener('pointerdown', onFirstUserClick);
    };
    window.addEventListener('pointerdown', onFirstUserClick);

    // Click on canvas to launch fireworks (ignoring drag/orbit movements)
    let pointerDownPos = { x: 0, y: 0, time: 0 };
    this.canvas.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY, time: Date.now() };
    });

    this.canvas.addEventListener('pointerup', (e) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      const duration = Date.now() - pointerDownPos.time;

      // Only trigger if click/tap without dragging (less than 8px and within 400ms)
      if (dx < 8 && dy < 8 && duration < 500 && e.target === this.canvas) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.world.camera);
        const rayDir = this.raycaster.ray.direction.clone();

        // Calculate firework target point 42m ahead along the click ray
        const targetPos = this.world.camera.position.clone().add(rayDir.multiplyScalar(42));
        targetPos.y = Math.max(18, Math.min(65, targetPos.y));

        this.ensureAudioStarted();
        this.fireworks.launch(targetPos);
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1); // clamp delta
    const time = this.clock.getElapsedTime();

    // 1. Update Water mesh & caustics
    this.water.update(time);

    // 2. Update Krathongs (NPC + Player) with wave bobbing
    this.krathongManager.update(time, delta);

    // 3. Update Yi Peng Lanterns
    this.lanternSky.update(time, delta);

    // 4. Update Fireworks particles
    this.fireworks.update(delta);

    // 5. Update Temple Fair spotlights
    this.templeFair.update(time, delta);

    // 6. Update 8 Nang Noppamas animations
    this.contestants.update(time, delta);

    // 7. Update Camera Controller transitions
    this.cameraController.update(delta);

    // 8. Render Scene via Post-processing Bloom
    this.world.render();
  }
}

// Bootstrap application safely regardless of DOM state
let appInstance = null;
function startApp() {
  if (!appInstance) {
    appInstance = new App();
    window.appInstance = appInstance;
    window.dismissFirstTap = () => appInstance.ensureAudioStarted();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
