/**
 * Web Audio ambient synthesizer for templates
 * Provides tranquil acoustic or ambient accompaniment without external file dependencies
 */

export type AmbientMusicStyle = 
  | 'temple' 
  | 'festive' 
  | 'celestial' 
  | 'jazz' 
  | 'orchestral' 
  | 'lullaby' 
  | 'shehnai' 
  | 'mantra' 
  | 'lounge';

class AmbientPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;

  public play(style: AmbientMusicStyle, customUrl?: string) {
    if (this.isPlaying) return;

    if (customUrl && customUrl !== '#' && customUrl.startsWith('http')) {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio(customUrl);
          this.audioElement.loop = true;
        }
        this.audioElement.play().catch(() => {});
        this.isPlaying = true;
        return;
      } catch {
        // Fall back to Web Audio
      }
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      // Gentle fade in
      this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2);
      this.gainNode.connect(this.ctx.destination);

      const chords: Record<AmbientMusicStyle, number[]> = {
        // C# tanpura / meditative temple drone
        temple: [138.59, 207.65, 277.18, 415.3],
        // Festive D major / bright festive raga harmonics
        festive: [146.83, 220.0, 293.66, 369.99, 440.0],
        // Midnight celestial / lush starlit ambient chord (F#m9 / sus)
        celestial: [92.5, 138.59, 185.0, 220.0, 277.18, 329.63],
        // Smooth jazz major 9th (Ebmaj9: Eb, G, Bb, D, F)
        jazz: [155.56, 196.0, 233.08, 293.66, 349.23],
        // Classical orchestral royal warmth (Gmaj7 / D)
        orchestral: [146.83, 196.0, 246.94, 293.66, 369.99],
        // Delicate baby lullaby pentatonic glockenspiel hum (C, E, G, A, C)
        lullaby: [261.63, 329.63, 392.0, 440.0, 523.25],
        // Sacred shehnai / auspicious Mangalya dhwani (B, E, G#, B)
        shehnai: [123.47, 164.81, 207.65, 246.94, 329.63],
        // Deep Vedic Om resonance / primordial chanting frequencies (108Hz / 136.1Hz Om)
        mantra: [108.0, 136.1, 216.0, 272.2, 432.0],
        // Deep soulful lounge pad / velvet synth chord (Abm9)
        lounge: [103.83, 155.56, 207.65, 261.63, 311.13]
      };

      const freqs = chords[style] || chords.temple;

      this.oscillators = freqs.map((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        // Varied wave types for rich acoustic texture
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        // Add gentle subtle chorusing detune
        osc.detune.setValueAtTime((i - 1) * 3, this.ctx!.currentTime);

        oscGain.gain.setValueAtTime(1 / freqs.length, this.ctx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.gainNode!);

        osc.start();
        return osc;
      });

      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio playback not supported:', e);
    }
  }

  public stop() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
      this.audioElement = null;
    }

    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          this.oscillators = [];
          if (this.ctx && this.ctx.state !== 'closed') {
            this.ctx.close().catch(() => {});
          }
          this.ctx = null;
          this.gainNode = null;
        }, 850);
      } catch {
        this.oscillators = [];
        this.ctx = null;
      }
    }
    this.isPlaying = false;
  }

  public toggle(style: AmbientMusicStyle, customUrl?: string): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play(style, customUrl);
      return true;
    }
  }
}

export function createAmbientPlayer() {
  return new AmbientPlayer();
}

