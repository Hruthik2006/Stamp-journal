/**
 * Synthesizes a realistic paper rustle sound effect using the Web Audio API.
 * This does not rely on any external asset downloads, ensuring robust offline-capability.
 */
export const playPageTurnSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const duration = 0.35; // duration of the rustle in seconds
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Create a textured organic noise (filtered brown/pink sound)
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Lowpass/bandpass filter simulation for brownian noise
      data[i] = (lastOut + (0.02 * white)) / 1.018;
      lastOut = data[i];
      data[i] *= 4.5; // Scale volume slightly
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to limit frequencies to realistic paper rustling ranges (mid to high frequencies)
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(1200, ctx.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + duration * 0.7);
    filterNode.Q.setValueAtTime(2.0, ctx.currentTime);

    // Dynamic gain envelope to shape the volume arch of a physical turn
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04); // peak
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // fade-out

    // Connect node chain
    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play synthesized page turning audio
    noiseNode.start();
    noiseNode.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio page turn effect could not activate:', error);
  }
};
