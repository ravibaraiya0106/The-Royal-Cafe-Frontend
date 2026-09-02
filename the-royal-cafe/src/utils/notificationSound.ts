/**
 * Voice Alert Helper using Web Speech API with Chrome autoplay safeguards
 */
export const speakVoiceAlert = (message: string) => {
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech
      window.speechSynthesis.resume(); // Resume if suspended by browser policy

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice =
          voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ||
          voices.find((v) => v.lang.startsWith("en"));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      window.speechSynthesis.speak(utterance);

      // Chrome speech synthesis suspend workaround
      setTimeout(() => {
        if (window.speechSynthesis.paused || window.speechSynthesis.pending) {
          window.speechSynthesis.resume();
        }
      }, 100);
    }
  } catch (err) {
    console.error("Speech synthesis error:", err);
  }
};

/**
 * Plays an upbeat double-chime for incoming new orders (523.25Hz -> 659.25Hz -> 783.99Hz)
 */
export const playNewOrderChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // C5 (523.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // E5 (659.25Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.45);

    // G5 (783.99Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
    gain3.gain.setValueAtTime(0.4, ctx.currentTime + 0.3);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(ctx.currentTime + 0.3);
    osc3.stop(ctx.currentTime + 0.75);
  } catch (err) {
    console.error("Failed to play new order audio chime:", err);
  }
};

/**
 * Plays a warning chime for order cancellation (440Hz -> 349.23Hz downward alert)
 */
export const playOrderCancelledChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // A4 (440Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // F4 (349.23Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(349.23, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.error("Failed to play order cancelled audio chime:", err);
  }
};

/**
 * Backward compatibility alias for delivery assignment notifications
 */
export const playNotificationChime = playNewOrderChime;
