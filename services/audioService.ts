class AudioService {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  private async initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private async loadSound(url: string): Promise<AudioBuffer> {
    await this.initAudioContext();
    
    if (this.sounds.has(url)) {
      return this.sounds.get(url)!;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.sounds.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error('Failed to load sound:', error);
      throw error;
    }
  }

  async playSound(soundName: string) {
    try {
      const soundUrl = `/sounds/${soundName}.mp3`;
      const audioBuffer = await this.loadSound(soundUrl);
      
      if (!this.audioContext) {
        await this.initAudioContext();
      }

      const source = this.audioContext!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext!.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  playQuizNotification() {
    this.playSound('quiz-notification');
  }

  playQuizCorrect() {
    this.playSound('quiz-correct');
  }

  playQuizWrong() {
    this.playSound('quiz-wrong');
  }

  playQuizWon() {
    this.playSound('quiz-won');
  }

  playQuizLoss() {
    this.playSound('quiz-loss');
  }
}

export const audioService = new AudioService();
