import * as THREE from 'three';

export class CameraController {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;

    this.isTransitioning = false;
    this.transitionTime = 0;
    this.transitionDuration = 1.6;

    this.startCamPos = new THREE.Vector3();
    this.targetCamPos = new THREE.Vector3();
    this.startControlsTarget = new THREE.Vector3();
    this.targetControlsTarget = new THREE.Vector3();

    this.followingObject = null;

    // View presets
    this.views = {
      pier: {
        pos: new THREE.Vector3(4.5, 4.8, 10.5),
        target: new THREE.Vector3(-2.8, 0.5, 0.5)
      },
      stage: {
        pos: new THREE.Vector3(28, 5.5, 9.0),
        target: new THREE.Vector3(28, 4.4, -5.5)
      },
      fair: {
        pos: new THREE.Vector3(18.5, 4.8, -10.5),
        target: new THREE.Vector3(21.5, 2.8, -18.0)
      },
      overview: {
        pos: new THREE.Vector3(16, 28, 48),
        target: new THREE.Vector3(6, 2, 0)
      }
    };
  }

  warpTo(viewKey, duration = 1.6) {
    const view = this.views[viewKey];
    if (!view) return;

    this.followingObject = null;
    this.transitionTo(view.pos, view.target, duration);
  }

  transitionTo(endPos, endTarget, duration = 1.6) {
    this.isTransitioning = true;
    this.transitionTime = 0;
    this.transitionDuration = duration;

    this.startCamPos.copy(this.camera.position);
    this.targetCamPos.copy(endPos);

    this.startControlsTarget.copy(this.controls.target);
    this.targetControlsTarget.copy(endTarget);

    this.controls.enabled = false;
  }

  followObject(obj, type = 'krathong') {
    this.followingObject = obj;
    this.followingType = type;
  }

  stopFollowing() {
    this.followingObject = null;
    this.followingType = null;
  }

  update(delta) {
    // 1. Camera Transition Animation
    if (this.isTransitioning) {
      this.transitionTime += delta;
      const progress = Math.min(1.0, this.transitionTime / this.transitionDuration);

      // Smooth Hermite smoothstep easing
      const t = progress * progress * (3 - 2 * progress);

      this.camera.position.lerpVectors(this.startCamPos, this.targetCamPos, t);
      this.controls.target.lerpVectors(this.startControlsTarget, this.targetControlsTarget, t);

      if (progress >= 1.0) {
        this.isTransitioning = false;
        this.controls.enabled = true;
      }
    }

    // 2. Smoothly follow player krathong or sky lantern
    if (this.followingObject && !this.isTransitioning) {
      const objPos = this.followingObject.position;
      let desiredCamPos;

      if (this.followingType === 'lantern') {
        // Position camera below and behind rising lantern, looking upward into the starry sky
        desiredCamPos = new THREE.Vector3(
          objPos.x + 3.2,
          Math.max(2.5, objPos.y - 2.2),
          objPos.z + 5.5
        );
      } else {
        // Krathong on water
        desiredCamPos = new THREE.Vector3(
          objPos.x + 3.8,
          objPos.y + 2.8,
          objPos.z + 5.2
        );
      }

      this.camera.position.lerp(desiredCamPos, delta * 3.0);
      this.controls.target.lerp(objPos, delta * 4.0);
    }
  }
}
