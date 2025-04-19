// This is a temporary file to generate sound files
// Run this in the browser console to generate and download the sound files

function generateSound(frequency, duration, volume, type = 'sine') {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);

  return audioContext;
}

// Generate message sent sound (higher pitch, shorter duration)
generateSound(880, 0.1, 0.3); // A5 note

// Generate message received sound (lower pitch, slightly longer duration)
generateSound(440, 0.15, 0.4); // A4 note

// Generate notification sound (two-tone alert)
const notificationContext = new (window.AudioContext || window.webkitAudioContext)();
generateSound(587.33, 0.1, 0.4); // D5 note
setTimeout(() => generateSound(880, 0.1, 0.4), 100); // A5 note 