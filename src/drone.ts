// ── Tuning knobs ──────────────────────────────────────────────

export const ATTACK_TIME = 0.4;
export const RELEASE_TIME = 0.8;

const MASTER_VOLUME = 0.2;

const COMPRESSOR_THRESHOLD = -18;
const COMPRESSOR_KNEE = 6;
const COMPRESSOR_RATIO = 4;
const COMPRESSOR_ATTACK = 0.003;
const COMPRESSOR_RELEASE = 0.25;

const LPF_DEFAULT_FREQ = 1800;
const LPF_Q = 0.9;
const LPF_MIN_FREQ = 400;
const LPF_MAX_MULT = 20;

const DELAY_TIME = 0.15;
const DELAY_FEEDBACK = 0.2;
const WET_MIX = 0.18;
const DRY_MIX = 0.82;

const FILTER_LFO_RATE = 0.14;
const FILTER_LFO_DEPTH = 150;

const VIBRATO_RATE = 0.28;
const VIBRATO_DEPTH = 5;

const CHORUS_DETUNE_MIN = 0.2;
const CHORUS_DETUNE_MAX = 10.0;

const POINTER_SMOOTHING = 0.08;

// ── Chord: CMaj9 ─────────────────────────────────────────────

const C4 = 261.63;
const E4 = 329.63;
const G4 = 392.0;
const B4 = 493.88;
const D5 = 587.33;

type OscDef = { hz: number; det: number; amp: number; vibrato?: boolean };

const VOICES: OscDef[] = [
  { hz: C4, det: -8, amp: 0.26 },
  { hz: C4, det: 0, amp: 0.3, vibrato: true },
  { hz: C4, det: 8, amp: 0.26 },
  { hz: E4, det: -6, amp: 0.21 },
  { hz: E4, det: 6, amp: 0.21 },
  { hz: G4, det: -5, amp: 0.17 },
  { hz: G4, det: 5, amp: 0.17 },
  { hz: B4, det: -5, amp: 0.14 },
  { hz: B4, det: 5, amp: 0.14 },
  { hz: D5, det: -4, amp: 0.1 },
  { hz: D5, det: 4, amp: 0.1 },
];

// ── State ────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null;

interface DroneState {
  masterGain: GainNode;
  sources: AudioScheduledSourceNode[];
  lpf: BiquadFilterNode;
  detuneableOscs: Array<{ osc: OscillatorNode; baseDetune: number }>;
}

let droneState: DroneState | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// ── Start / Stop ─────────────────────────────────────────────

export function startDrone(): void {
  if (droneState) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, t);
  masterGain.gain.linearRampToValueAtTime(MASTER_VOLUME, t + ATTACK_TIME);
  masterGain.connect(ctx.destination);

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = COMPRESSOR_THRESHOLD;
  comp.knee.value = COMPRESSOR_KNEE;
  comp.ratio.value = COMPRESSOR_RATIO;
  comp.attack.value = COMPRESSOR_ATTACK;
  comp.release.value = COMPRESSOR_RELEASE;

  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = LPF_DEFAULT_FREQ;
  lpf.Q.value = LPF_Q;

  comp.connect(lpf);

  const delay = ctx.createDelay(2);
  delay.delayTime.value = DELAY_TIME;
  const fbGain = ctx.createGain();
  fbGain.gain.value = DELAY_FEEDBACK;
  const wetGain = ctx.createGain();
  wetGain.gain.value = WET_MIX;
  lpf.connect(delay);
  delay.connect(fbGain);
  fbGain.connect(delay);
  delay.connect(wetGain);
  wetGain.connect(masterGain);

  const dryGain = ctx.createGain();
  dryGain.gain.value = DRY_MIX;
  lpf.connect(dryGain);
  dryGain.connect(masterGain);

  const sources: AudioScheduledSourceNode[] = [];

  const fLFO = ctx.createOscillator();
  const fLFOGain = ctx.createGain();
  fLFO.type = "sine";
  fLFO.frequency.value = FILTER_LFO_RATE;
  fLFOGain.gain.value = FILTER_LFO_DEPTH;
  fLFO.connect(fLFOGain);
  fLFOGain.connect(lpf.frequency);
  fLFO.start(t);
  sources.push(fLFO);

  const vLFO = ctx.createOscillator();
  const vLFOGain = ctx.createGain();
  vLFO.type = "sine";
  vLFO.frequency.value = VIBRATO_RATE;
  vLFOGain.gain.value = VIBRATO_DEPTH;
  vLFO.connect(vLFOGain);
  vLFO.start(t);
  sources.push(vLFO);

  const detuneableOscs: DroneState["detuneableOscs"] = [];

  VOICES.forEach((def) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = def.hz;
    osc.detune.value = def.det;
    g.gain.value = def.amp;
    osc.connect(g);
    g.connect(comp);
    if (def.vibrato) vLFOGain.connect(osc.detune);
    if (def.det !== 0) detuneableOscs.push({ osc, baseDetune: def.det });
    osc.start(t);
    sources.push(osc);
  });

  droneState = { masterGain, sources, lpf, detuneableOscs };
}

export function stopDrone(): void {
  if (!droneState || !audioCtx) return;
  const { masterGain, sources } = droneState;
  const ctx = audioCtx;
  const t = ctx.currentTime;
  droneState = null;

  masterGain.gain.cancelScheduledValues(t);
  masterGain.gain.setValueAtTime(masterGain.gain.value, t);
  masterGain.gain.linearRampToValueAtTime(0, t + RELEASE_TIME);

  setTimeout(
    () => {
      sources.forEach((s) => {
        try {
          s.stop();
        } catch {}
      });
      masterGain.disconnect();
    },
    (RELEASE_TIME + 1) * 1000,
  );
}

// ── Pointer modulation ───────────────────────────────────────

export function setDronePointer(x: number, y: number): void {
  if (!droneState || !audioCtx) return;
  const t = audioCtx.currentTime;

  const nx = Math.max(0, Math.min(1, x / window.innerWidth));
  const ny = Math.max(0, Math.min(1, y / window.innerHeight));

  const targetFreq = LPF_MIN_FREQ * Math.pow(LPF_MAX_MULT, nx);
  droneState.lpf.frequency.setTargetAtTime(targetFreq, t, POINTER_SMOOTHING);

  const detuneScale =
    CHORUS_DETUNE_MIN + ny * (CHORUS_DETUNE_MAX - CHORUS_DETUNE_MIN);
  for (const { osc, baseDetune } of droneState.detuneableOscs) {
    osc.detune.setTargetAtTime(baseDetune * detuneScale, t, POINTER_SMOOTHING);
  }
}
