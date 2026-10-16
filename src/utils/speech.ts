/**
 * Speech Recognition (STT) and Vocal Synthesis (TTS) module for J.A.R.V.I.S.
 */

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

class SpeechController {
  private recognition: any = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  public voiceEnabled: boolean = true;
  public voicePersona: 'EDITH' | 'JARVIS' = 'EDITH';
  private onSpeakingChangeCallbacks: Set<(speaking: boolean) => void> = new Set();

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  public isRecognitionSupported(): boolean {
    return Boolean(this.recognition);
  }

  public subscribeSpeaking(callback: (speaking: boolean) => void): () => void {
    this.onSpeakingChangeCallbacks.add(callback);
    return () => {
      this.onSpeakingChangeCallbacks.delete(callback);
    };
  }

  private setSpeaking(speaking: boolean): void {
    this.isSpeaking = speaking;
    this.onSpeakingChangeCallbacks.forEach((cb) => cb(speaking));
  }

  public startListening(handlers: SpeechRecognitionHandlers): boolean {
    if (!this.recognition) {
      handlers.onError?.('Speech recognition is not supported in this browser.');
      return false;
    }

    try {
      this.stopSpeaking();

      this.recognition.onstart = () => {
        handlers.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        handlers.onResult?.(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        handlers.onError?.(event.error || 'Speech recognition encountered an issue.');
      };

      this.recognition.onend = () => {
        handlers.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      handlers.onError?.(err?.message || 'Failed to start microphone.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public stopSpeaking(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.setSpeaking(false);
  }

  /**
   * Speak response using Gemini audio endpoint or browser speech synthesis
   */
  public async speakText(text: string): Promise<void> {
    if (!this.voiceEnabled || !text.trim()) return;

    this.stopSpeaking();
    this.setSpeaking(true);

    try {
      // 1. Try server-side Gemini TTS with E.D.I.T.H. (Kore) or JARVIS (Charon)
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voicePersona: this.voicePersona,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audio = new Audio(data.audio);
          this.currentAudio = audio;

          audio.onended = () => {
            this.setSpeaking(false);
            this.currentAudio = null;
          };

          audio.onerror = () => {
            this.speakWithBrowserSynthesis(text);
          };

          await audio.play();
          return;
        }
      }
    } catch (err) {
      // Fallback below
    }

    // 2. Fallback to browser SpeechSynthesis
    this.speakWithBrowserSynthesis(text);
  }

  private speakWithBrowserSynthesis(text: string): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.setSpeaking(false);
      return;
    }

    try {
      // Clean text from markdown characters for speech
      const cleanText = text
        .replace(/[*#_`~[\]]/g, '')
        .replace(/\n+/g, '. ')
        .slice(0, 350);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();

      if (this.voicePersona === 'EDITH') {
        // Look for calm, articulate female voice (Samantha, Victoria, Karen, Moira, Zira, Jenny, or female en-US)
        const edithVoice = voices.find(
          (v) =>
            v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Karen') ||
            v.name.includes('Moira') ||
            v.name.includes('Zira') ||
            v.name.includes('Jenny') ||
            v.name.includes('Google US English') ||
            v.name.includes('Natural') ||
            (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
        ) || voices.find((v) => v.lang.startsWith('en-US')) || voices[0];

        if (edithVoice) {
          utterance.voice = edithVoice;
        }
        utterance.pitch = 1.04;
        utterance.rate = 1.02;
      } else {
        // JARVIS: British male voice
        const britishVoice = voices.find(
          (v) =>
            v.lang.includes('en-GB') ||
            v.name.includes('Daniel') ||
            v.name.includes('Oliver') ||
            v.name.includes('UK English') ||
            v.name.includes('Arthur')
        ) || voices.find((v) => v.lang.startsWith('en'));

        if (britishVoice) {
          utterance.voice = britishVoice;
        }
        utterance.pitch = 0.95;
        utterance.rate = 1.05;
      }

      utterance.onend = () => {
        this.setSpeaking(false);
      };

      utterance.onerror = () => {
        this.setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.setSpeaking(false);
    }
  }
}

export const speech = new SpeechController();
