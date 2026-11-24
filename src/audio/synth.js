/**
 * Web Audio API Procedural Audio Synthesizer
 * Synthesizes "เพลงรำวงวันลอยกระทง" and Fireworks sound effects without external audio files.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;

    // Sequencer state
    this.tempo = 126; // Upbeat Ramwong tempo (BPM)
    this.step = 0;
    this.timerId = null;
    this.nextNoteTime = 0;
    this.lookahead = 25.0; // milliseconds
    this.scheduleAheadTime = 0.1; // seconds

    // Melodic notes mapping in C major (frequencies in Hz)
    this.notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
      C6: 1046.50, REST: 0
    };

    // Melody sequence: [note, durationInSteps (1 step = 16th note, 4 steps = quarter note)]
    // Full Thai "เพลงรำวงวันลอยกระทง"
    this.melodySequence = [
      // Verse 1: "วันเพ็ญเดือนสิบสอง น้ำนองเต็มตลิ่ง"
      ['G4', 2], ['C5', 2], ['C5', 2], ['C5', 2],
      ['D5', 2], ['C5', 2], ['A4', 2], ['G4', 2],
      ['G4', 2], ['A4', 2], ['C5', 2], ['D5', 2],
      ['E5', 4], ['D5', 2], ['C5', 2],

      // "เราทั้งหลายชายหญิง สนุกกันจริงวันลอยกระทง"
      ['E5', 2], ['G5', 2], ['G5', 2], ['G5', 2],
      ['A5', 2], ['G5', 2], ['E5', 2], ['D5', 2],
      ['C5', 2], ['D5', 2], ['E5', 2], ['D5', 2],
      ['C5', 4], ['A4', 2], ['C5', 2],

      // Chorus 1: "ลอย ลอยกระทง ลอย ลอยกระทง"
      ['G4', 2], ['G4', 2], ['C5', 2], ['D5', 2],
      ['E5', 6], ['REST', 2],
      ['G4', 2], ['G4', 2], ['C5', 2], ['D5', 2],
      ['E5', 6], ['REST', 2],

      // "ลอยกระทงกันแล้ว ขอเชิญน้องแก้วออกมารำวง"
      ['E5', 2], ['D5', 2], ['C5', 2], ['D5', 2],
      ['E5', 6], ['REST', 2],
      ['G5', 2], ['E5', 2], ['D5', 2], ['C5', 2],
      ['A4', 2], ['C5', 2], ['D5', 2], ['C5', 2],

      // Chorus 2: "รำวงวันลอยกระทง รำวงวันลอยกระทง"
      ['G4', 2], ['A4', 2], ['C5', 2], ['D5', 2],
      ['E5', 4], ['D5', 4],
      ['G4', 2], ['A4', 2], ['C5', 2], ['D5', 2],
      ['E5', 4], ['D5', 4],

      // "บุญจะส่งให้เราสุขใจ บุญจะส่งให้เราสุขใจ"
      ['C5', 2], ['D5', 2], ['E5', 2], ['D5', 2],
      ['C5', 2], ['A4', 2], ['G4', 4],
      ['C5', 2], ['D5', 2], ['E5', 2], ['D5', 2],
      ['C5', 2], ['A4', 2], ['C5', 4],
      ['REST', 4]
    ];

    // Chords progression for backing
    this.chordProgression = [
      ['C4', 'E4', 'G4'], // C
      ['C4', 'E4', 'G4'],
      ['F3', 'A3', 'C4'], // F
      ['C4', 'E4', 'G4'], // C
      ['A3', 'C4', 'E4'], // Am
      ['G3', 'B3', 'D4'], // G
      ['F3', 'A3', 'C4'], // F
      ['C4', 'E4', 'G4'], // C
      ['C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4'],
      ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4'],
      ['F3', 'A3', 'C4'],
      ['G3', 'B3', 'D4'],
      ['C4', 'E4', 'G4']
    ];

    this.expandedMelody = [];
    this.buildExpandedSequence();

    this.onStateChange = null;
  }

  buildExpandedSequence() {
    this.expandedMelody = [];
    for (const item of this.melodySequence) {
      const note = item[0];
      const duration = item[1]; // in 16th steps
      this.expandedMelody.push({ note, isStart: true });
      for (let i = 1; i < duration; i++) {
        this.expandedMelody.push({ note: 'REST', isStart: false });
      }
    }
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API not supported in this browser.');
        return;
      }
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Start ambient night sound (soft river flow & crickets)
      this.startAmbientNight();
    } catch (err) {
      console.warn('Web Audio init error:', err);
    }
  }

  startAmbientNight() {
    if (!this.ctx) return;
    try {
      // Gentle river brown noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.15; // Soft volume
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      const waterGain = this.ctx.createGain();
      waterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(waterGain);
      waterGain.connect(this.masterGain);
      whiteNoise.start();
    } catch (e) {
      console.warn('Could not start ambient water sound:', e);
    }
  }

  start() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;

    this.scheduler();

    if (this.onStateChange) this.onStateChange(true);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0.0 : 0.7;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  scheduler() {
    if (!this.isPlaying || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.step, this.nextNoteTime);
      this.advanceStep();
    }

    this.timerId = setTimeout(() => this.scheduler(), this.lookahead);
  }

  advanceStep() {
    // 16th note seconds = 60 / (BPM * 4)
    const secondsPer16th = 60.0 / (this.tempo * 4);
    this.nextNoteTime += secondsPer16th;
    this.step = (this.step + 1) % this.expandedMelody.length;
  }

  scheduleStep(stepIndex, time) {
    if (!this.ctx) return;

    // 1. Lead Melody Note (Thai Ranat / Marimba mallet synth)
    const currentNoteInfo = this.expandedMelody[stepIndex];
    if (currentNoteInfo && currentNoteInfo.isStart && currentNoteInfo.note !== 'REST') {
      const freq = this.notes[currentNoteInfo.note];
      if (freq) {
        this.playRanatMelodyNote(freq, time);
      }
    }

    // 2. Thai Rhythm Percussion
    // Quarter note beat: stepIndex % 4 === 0
    // Eighth note beat: stepIndex % 2 === 0
    const beat16th = stepIndex % 16;
    const isQuarter = stepIndex % 4 === 0;
    const quarterIndex = Math.floor(stepIndex / 4) % 4; // 0, 1, 2, 3 (beats 1, 2, 3, 4)

    // Ching (ฉิ่ง): beat 1 and 3 (chime, ring)
    // Chab (ฉับ): beat 2 and 4 (damped metallic clack)
    if (isQuarter) {
      if (quarterIndex === 0 || quarterIndex === 2) {
        this.playChing(time, true); // Ching (open)
      } else {
        this.playChing(time, false); // Chab (closed)
      }
    }

    // Klong Ramwong (กลองรำวง / โทน-รำมะนา)
    // Classic upbeat rhythm:
    // Beat 1: Thon bass drop
    // Beat 2: Chab + light tap
    // Beat 3: Rammana high slap
    // Beat 4: Double bounce (accent)
    if (beat16th === 0) {
      this.playDrumThon(time, 130, 48, 0.45);
    } else if (beat16th === 4) {
      this.playDrumRammana(time, 240, 0.25);
    } else if (beat16th === 8) {
      this.playDrumThon(time, 140, 52, 0.35);
    } else if (beat16th === 12) {
      this.playDrumRammana(time, 260, 0.3);
    } else if (beat16th === 14) {
      this.playDrumRammana(time, 210, 0.2); // Grace note
    }

    // 3. Harmonic backing chord (warm Thai acoustic organ/pad)
    if (stepIndex % 16 === 0) {
      const chordIndex = Math.floor(stepIndex / 16) % this.chordProgression.length;
      const chord = this.chordProgression[chordIndex];
      this.playPadChord(chord, time, (60.0 / this.tempo) * 4);
    }
  }

  // Synthesize Ranat Ek / Bamboo Mallet xylophone tone
  playRanatMelodyNote(freq, time) {
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Fundamental (sine) + overtone (wooden harmonic resonance)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 3.01, time); // Inharmonic overtone for wooden bar

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.2, time);
    osc2.connect(subGain);
    subGain.connect(gainNode);

    osc1.connect(gainNode);

    // Fast mallet attack + warm natural decay
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(0.35, time + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);

    gainNode.connect(this.bgmGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.46);
    osc2.stop(time + 0.46);
  }

  // Synthesize Ching (open chime) / Chab (damped clack)
  playChing(time, isOpen) {
    if (!this.ctx) return;

    if (isOpen) {
      // Ringing high metallic bell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2480, time);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(4950, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.65); // Long ring

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.bgmGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.66);
      osc2.stop(time + 0.66);
    } else {
      // Short damped Chab
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05); // Rapid stop

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.06);
    }
  }

  // Synthesize Thon drum (warm round bass punch)
  playDrumThon(time, startFreq, endFreq, vol) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.12);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + 0.29);
  }

  // Synthesize Rammana drum (tight slap/tap)
  playDrumRammana(time, freq, vol) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(120, time + 0.05);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + 0.09);
  }

  // Warm background chord pad
  playPadChord(chordNotes, time, duration) {
    if (!this.ctx || !chordNotes) return;

    for (const noteName of chordNotes) {
      const freq = this.notes[noteName];
      if (!freq) continue;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.045, time + 0.3);
      gain.gain.setValueAtTime(0.045, time + duration - 0.2);
      gain.gain.linearRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    }
  }

  /**
   * Synthesize Fireworks Sound Effect:
   * Whistle ascent + thunderous explosion + crackle sparkles
   */
  playFireworkSound() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    // 1. Rising rocket whistle
    const whistleOsc = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistleOsc.type = 'sine';
    whistleOsc.frequency.setValueAtTime(450, now);
    whistleOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.6);

    whistleGain.gain.setValueAtTime(0.001, now);
    whistleGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    whistleOsc.connect(whistleGain);
    whistleGain.connect(this.sfxGain);

    whistleOsc.start(now);
    whistleOsc.stop(now + 0.62);

    // 2. Detonation Boom (at now + 0.6)
    const boomTime = now + 0.6;

    // Low sub-bass body punch
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, boomTime);
    subOsc.frequency.exponentialRampToValueAtTime(32, boomTime + 0.6);

    subGain.gain.setValueAtTime(0.55, boomTime);
    subGain.gain.exponentialRampToValueAtTime(0.0001, boomTime + 0.95);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(boomTime);
    subOsc.stop(boomTime + 0.96);

    // Noise blast for explosion impact
    const blastBufferSize = Math.floor(this.ctx.sampleRate * 0.8);
    const blastBuffer = this.ctx.createBuffer(1, blastBufferSize, this.ctx.sampleRate);
    const blastData = blastBuffer.getChannelData(0);
    for (let i = 0; i < blastBufferSize; i++) {
      blastData[i] = Math.random() * 2 - 1;
    }

    const blastNode = this.ctx.createBufferSource();
    blastNode.buffer = blastBuffer;

    const blastFilter = this.ctx.createBiquadFilter();
    blastFilter.type = 'lowpass';
    blastFilter.frequency.setValueAtTime(800, boomTime);
    blastFilter.frequency.exponentialRampToValueAtTime(180, boomTime + 0.6);

    const blastGain = this.ctx.createGain();
    blastGain.gain.setValueAtTime(0.45, boomTime);
    blastGain.gain.exponentialRampToValueAtTime(0.0001, boomTime + 0.7);

    blastNode.connect(blastFilter);
    blastFilter.connect(blastGain);
    blastGain.connect(this.sfxGain);

    blastNode.start(boomTime);
    blastNode.stop(boomTime + 0.75);

    // 3. Crackling sparkle pops
    for (let i = 0; i < 6; i++) {
      const popTime = boomTime + 0.15 + i * 0.08 + Math.random() * 0.04;
      this.playCracklePop(popTime);
    }
  }

  playCracklePop(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200 + Math.random() * 1400, time);

    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.035);
  }

  // Play gentle water splash when krathong touches the river
  playWaterSplash() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }
}

export const soundEngine = new SoundEngine();
