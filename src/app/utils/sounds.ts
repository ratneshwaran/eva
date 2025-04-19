class SoundManager {
  private static audioContext: AudioContext | null = null;

  private static getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private static async createSound(frequency: number, duration: number, volume: number) {
    const ctx = this.getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

    return new Promise(resolve => setTimeout(resolve, duration * 1000));
  }

  static async playSound(soundType: 'messageSent' | 'messageReceived' | 'notification', volume = 0.5) {
    try {
      switch (soundType) {
        case 'messageSent':
          // Higher pitch, shorter duration
          await this.createSound(880, 0.1, volume * 0.3); // A5 note
          break;
        case 'messageReceived':
          // Lower pitch, slightly longer duration
          await this.createSound(440, 0.15, volume * 0.4); // A4 note
          break;
        case 'notification':
          // Two-tone alert
          await this.createSound(587.33, 0.1, volume * 0.4); // D5 note
          await this.createSound(880, 0.1, volume * 0.4); // A5 note
          break;
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  // This method is kept for compatibility but now just initializes the audio context
  static preloadSounds() {
    this.getAudioContext();
  }
}

export default SoundManager; 