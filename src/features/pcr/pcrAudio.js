/**
 * pcrAudio.js — metrônomo (Web Audio API) + TTS (SpeechSynthesis).
 *
 * Golden pcr.js iniciarMetronomo · pararMetronomo · falar.
 * Mantido fora do useState pra não conflitar com React 19 strict mode (impure call).
 *
 * Anti-spam TTS: as flags `avisou*` ficam no useState do PCRState · este módulo só
 * dispara o áudio quando chamado.
 */

let audioCtx = null;
let metroIntervalId = null;

function getCtx() {
  if (!audioCtx && typeof window !== 'undefined' && window.AudioContext) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/** Tick simples 1000Hz · 30ms · gain 0.05 (golden). */
function tick() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.frequency.value = 1000;
  gain.gain.value = 0.05;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.03);
}

/** Inicia metrônomo no BPM dado. Reinicia se já estiver rodando. */
export function iniciarMetronomo(bpm = 110) {
  pararMetronomo();
  const intervalMs = 60000 / bpm;
  metroIntervalId = setInterval(tick, intervalMs);
}

export function pararMetronomo() {
  if (metroIntervalId) {
    clearInterval(metroIntervalId);
    metroIntervalId = null;
  }
}

export function isMetronomoAtivo() {
  return metroIntervalId !== null;
}

/** TTS pt-BR · respeita audioOn flag externamente. */
export function falar(texto) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR';
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch {
    // Speech synthesis bloqueado · ignora silenciosamente.
  }
}

/** Cancela qualquer TTS em andamento. */
export function pararFala() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
