// Web Audio API tactile audio synthesizer for SkySwitch industrial and aerospace UI
// Lazy initialized to comply with browser autoplay security rules and prevent startup blocks.

let audioCtx: AudioContext | null = null;
let coilHumOsc: OscillatorNode | null = null;
let coilHumGain: GainNode | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (e.g. by browser user gesture policies)
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play a highly realistic physical relay open/close click.
 * Synthesizes the metal-on-metal spring contact snap.
 * @param type 'close' (energized) or 'open' (released)
 */
export const playRelayClick = (type: "close" | "open" = "close") => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Core impact - sharp metallic transient envelope
  const impactOsc = ctx.createOscillator();
  const impactGain = ctx.createGain();
  
  impactOsc.type = "sine";
  // Mechanical closing is tighter and higher-pitched; opening is a bit looser.
  const baseFreq = type === "close" ? 2200 : 1600;
  impactOsc.frequency.setValueAtTime(baseFreq, now);
  // Frequency decay to emulate metallic resonant ring down
  impactOsc.frequency.exponentialRampToValueAtTime(100, now + 0.015);

  impactGain.gain.setValueAtTime(0.12, now);
  impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

  // 2. High-frequency contact scrape/bounce friction (white noise band)
  // We can simulate this with a high frequency triangle/square short burst
  const noiseOsc = ctx.createOscillator();
  const noiseGain = ctx.createGain();
  noiseOsc.type = "triangle";
  noiseOsc.frequency.setValueAtTime(8000, now);
  
  noiseGain.gain.setValueAtTime(0.04, now);
  if (type === "close") {
    // Contact bounce - secondary micro-clicks
    noiseGain.gain.setValueAtTime(0.04, now);
    noiseGain.gain.setValueAtTime(0.005, now + 0.003);
    noiseGain.gain.setValueAtTime(0.02, now + 0.004); // bounce impact
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
  } else {
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
  }

  // Connect components
  impactOsc.connect(impactGain);
  noiseOsc.connect(noiseGain);
  
  impactGain.connect(ctx.destination);
  noiseGain.connect(ctx.destination);

  impactOsc.start(now);
  impactOsc.stop(now + 0.02);
  
  noiseOsc.start(now);
  noiseOsc.stop(now + 0.02);
};

/**
 * Premium technological micro-beep chime for buttons/tab changes.
 */
export const playTechBeep = (freq = 1200, duration = 0.06) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);
  
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.01);
};

/**
 * Synthesizes an overload spark crackle when contact failures occur.
 */
export const playSparkCrackle = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Create 3-4 random electrical discharge crackles in rapid succession
  for (let i = 0; i < 4; i++) {
    const triggerTime = now + (i * 0.04) + (Math.random() * 0.02);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Bandpass filtered spark sound represented by high band oscillator
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(4000 + Math.random() * 2000, triggerTime);
    osc.frequency.linearRampToValueAtTime(100, triggerTime + 0.012);

    gain.gain.setValueAtTime(0.07, triggerTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, triggerTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(triggerTime);
    osc.stop(triggerTime + 0.02);
  }
};

/**
 * Toggles continuous background electromagnetic coil/induction hum.
 * Perfect during active electromagnetic testing simulation modes.
 * @param state Whether the coil is powered on or active
 * @param frequency Base hum frequency, e.g., 50Hz, 120Hz
 */
export const setCoilHumActive = (state: boolean, frequency = 60) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (state) {
    // If already running, do nothing
    if (coilHumOsc) return;

    // Create low 60Hz induction sine wave + a 120Hz warm second harmonic
    try {
      const humOsc = ctx.createOscillator();
      const harmonicOsc = ctx.createOscillator();
      const mainGain = ctx.createGain();

      humOsc.type = "sine";
      humOsc.frequency.setValueAtTime(frequency, now);

      harmonicOsc.type = "triangle"; // richer profile
      harmonicOsc.frequency.setValueAtTime(frequency * 2, now); // 120Hz secondary harmonic

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.015, now); // low level relative to main base

      const humMixGain = ctx.createGain();
      humMixGain.gain.setValueAtTime(0.03, now); // extremely subtle background level

      // Node structure
      humOsc.connect(humMixGain);
      
      harmonicOsc.connect(harmonicGain);
      harmonicGain.connect(humMixGain);

      // Main level gain with smooth fade-in to prevent sharp pops
      mainGain.gain.setValueAtTime(0, now);
      mainGain.gain.linearRampToValueAtTime(1.0, now + 0.15);

      humMixGain.connect(mainGain);
      mainGain.connect(ctx.destination);

      humOsc.start(now);
      harmonicOsc.start(now);

      coilHumOsc = humOsc;
      coilHumGain = mainGain;

      // Keep reference to secondary to dispose of together
      (coilHumOsc as any)._harmonicOsc = harmonicOsc;
      (coilHumOsc as any)._harmonicGain = harmonicGain;
      (coilHumOsc as any)._humMixGain = humMixGain;
    } catch (e) {
      console.error("Failed to initialize physical coil hum synthesizer:", e);
    }
  } else {
    // Fade out and stop
    if (coilHumOsc && coilHumGain) {
      const gNode = coilHumGain;
      const oNode = coilHumOsc;
      const hNode = (oNode as any)._harmonicOsc;
      const hGainNode = (oNode as any)._harmonicGain;
      const mGainNode = (oNode as any)._humMixGain;

      try {
        gNode.gain.cancelScheduledValues(now);
        gNode.gain.setValueAtTime(gNode.gain.value, now);
        gNode.gain.linearRampToValueAtTime(0, now + 0.12);

        setTimeout(() => {
          try {
            oNode.stop();
            if (hNode) hNode.stop();
            oNode.disconnect();
            if (hNode) hNode.disconnect();
            if (hGainNode) hGainNode.disconnect();
            if (mGainNode) mGainNode.disconnect();
            gNode.disconnect();
          } catch (err) {}
        }, 150);
      } catch (err) {}

      coilHumOsc = null;
      coilHumGain = null;
    }
  }
};
