import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Mic,
  MicOff,
  AlertTriangle,
  Key,
  RefreshCw,
  Sparkles,
  Volume2,
  Settings,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';

interface VoiceBiometricGateProps {
  isLocked: boolean;
  onUnlock: () => void;
  userTitle: string;
  voicePersona: 'EDITH' | 'JARVIS';
}

export const VoiceBiometricGate: React.FC<VoiceBiometricGateProps> = ({
  isLocked,
  onUnlock,
  userTitle,
  voicePersona,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'analyzing' | 'granted' | 'declined'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Custom enrolled voice passphrase (persists in localStorage)
  const [authorizedPassphrase, setAuthorizedPassphrase] = useState<string>(() => {
    try {
      return localStorage.getItem('stark_voiceprint_passphrase') || 'i am peter parker';
    } catch {
      return 'i am peter parker';
    }
  });

  const [showPinBackup, setShowPinBackup] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollText, setEnrollText] = useState('');

  // Audio frequency bars simulation
  const [freqBars, setFreqBars] = useState<number[]>([30, 60, 45, 90, 75, 40, 85, 55, 70, 95, 65, 40]);

  useEffect(() => {
    let interval: any;
    if (isListening || status === 'analyzing') {
      interval = setInterval(() => {
        setFreqBars(Array.from({ length: 12 }, () => Math.floor(Math.random() * 75) + 25));
      }, 90);
    } else {
      setFreqBars([20, 35, 25, 40, 30, 20, 45, 30, 35, 50, 30, 20]);
    }
    return () => clearInterval(interval);
  }, [isListening, status]);

  if (!isLocked) return null;

  const handleStartVoiceVerification = () => {
    sound.playScanBlip();
    setErrorMessage(null);
    setTranscript('');
    setStatus('listening');

    speech.startListening({
      onStart: () => setIsListening(true),
      onResult: (spoken, isFinal) => {
        setTranscript(spoken);
        if (isFinal && spoken.trim()) {
          setIsListening(false);
          verifyVoiceprint(spoken.trim());
        }
      },
      onError: (err) => {
        setIsListening(false);
        setStatus('idle');
        setErrorMessage('Microphone input failed. Please speak clearly or use Master PIN override.');
      },
      onEnd: () => setIsListening(false),
    });
  };

  const verifyVoiceprint = (spoken: string) => {
    setStatus('analyzing');
    sound.playClick();

    setTimeout(() => {
      const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
      const cleanTarget = authorizedPassphrase.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

      // Accepted matches: target passphrase, or Stark emergency passphrases
      const isMatch =
        cleanSpoken.includes(cleanTarget) ||
        cleanTarget.includes(cleanSpoken) ||
        cleanSpoken.includes('peter parker') ||
        cleanSpoken.includes('even dead') ||
        cleanSpoken.includes('edith') ||
        cleanSpoken.includes('tony stark') ||
        cleanSpoken.includes('jarvis');

      if (isMatch) {
        setStatus('granted');
        sound.playJarvisChime();
        const welcomeText =
          voicePersona === 'EDITH'
            ? `Voice biometric verified. Identity confirmed. Welcome back, ${userTitle}. Access granted.`
            : `Voiceprint confirmed. Access granted, ${userTitle}.`;
        speech.speakText(welcomeText);

        setTimeout(() => {
          onUnlock();
          setStatus('idle');
          setTranscript('');
          setFailedAttempts(0);
        }, 1600);
      } else {
        setStatus('declined');
        sound.playProtocolAlert();
        setFailedAttempts((prev) => prev + 1);
        const declineText = `Access Denied. Voice biometric signature does not match authorized profile. System locked.`;
        speech.speakText(declineText);
        setErrorMessage(`Voice biometric mismatch: "${spoken}". Authorization rejected.`);

        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      }
    }, 1200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1984' || pinInput === '4285' || pinInput === '2026') {
      sound.playJarvisChime();
      setStatus('granted');
      speech.speakText(`Master security override accepted. Access granted, ${userTitle}.`);
      setTimeout(() => {
        onUnlock();
        setShowPinBackup(false);
        setPinInput('');
      }, 1200);
    } else {
      sound.playProtocolAlert();
      setErrorMessage('Invalid Master Security PIN.');
      setPinInput('');
    }
  };

  const handleEnrollPassphrase = () => {
    if (!enrollText.trim()) return;
    const clean = enrollText.trim().toLowerCase();
    setAuthorizedPassphrase(clean);
    try {
      localStorage.setItem('stark_voiceprint_passphrase', clean);
    } catch {}
    sound.playJarvisChime();
    setIsEnrolling(false);
    speech.speakText(`Voiceprint passphrase updated to: "${enrollText}".`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl scanlines select-none overflow-y-auto">
      {/* Decorative Grid and Reticles */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* Main Lock Shield Box */}
      <div
        className={`relative w-full max-w-lg p-6 sm:p-8 rounded-2xl border-2 transition-all duration-500 shadow-2xl backdrop-blur-md ${
          status === 'granted'
            ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
            : status === 'declined'
            ? 'border-red-500 bg-red-950/50 shadow-[0_0_50px_rgba(239,68,68,0.4)]'
            : 'border-cyan-500/50 bg-slate-900/90 shadow-[0_0_40px_rgba(0,240,255,0.2)]'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-5">
          <div className="flex items-center gap-2">
            {status === 'granted' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : status === 'declined' ? (
              <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            ) : (
              <Lock className="w-5 h-5 text-cyan-400" />
            )}
            <div>
              <h2 className="font-orbitron font-bold text-sm tracking-wider text-white">
                STARK BIOMETRIC SECURITY GATE
              </h2>
              <p className="text-[10px] font-mono-code text-cyan-400/80">
                VOICEPRINT VERIFICATION REQUIRED // E.D.I.T.H. DEFENSE
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono-code px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300">
            {status === 'granted' ? (
              <span className="text-emerald-400 font-bold">UNLOCKED</span>
            ) : status === 'declined' ? (
              <span className="text-red-400 font-bold">ACCESS DENIED</span>
            ) : (
              <span>LOCKED</span>
            )}
          </div>
        </div>

        {/* Center Holographic Acoustic Visualizer */}
        <div className="flex flex-col items-center justify-center my-4 space-y-4">
          <div
            className={`w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative ${
              status === 'granted'
                ? 'border-emerald-400 bg-emerald-950/40 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                : status === 'declined'
                ? 'border-red-500 bg-red-950/60 scale-105 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                : isListening
                ? 'border-amber-400 bg-amber-950/40 animate-pulse scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'border-cyan-400/60 bg-cyan-950/30 glow-cyan'
            }`}
          >
            {status === 'granted' ? (
              <Unlock className="w-12 h-12 text-emerald-400" />
            ) : status === 'declined' ? (
              <ShieldAlert className="w-12 h-12 text-red-400" />
            ) : isListening ? (
              <Mic className="w-12 h-12 text-amber-400 animate-pulse" />
            ) : status === 'analyzing' ? (
              <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
            ) : (
              <Lock className="w-12 h-12 text-cyan-300" />
            )}
          </div>

          {/* Dynamic Frequency Bars */}
          <div className="flex items-center gap-1.5 h-12 px-4 py-1 rounded-xl bg-slate-950/80 border border-cyan-500/30">
            {freqBars.map((val, idx) => (
              <div
                key={idx}
                className={`w-2 rounded-full transition-all duration-100 ${
                  status === 'granted'
                    ? 'bg-emerald-400'
                    : status === 'declined'
                    ? 'bg-red-400'
                    : isListening
                    ? 'bg-amber-400'
                    : 'bg-cyan-400'
                }`}
                style={{ height: `${val}%` }}
              />
            ))}
          </div>

          {/* Spoken Feedback Transcript */}
          {transcript && (
            <div className="px-4 py-2 rounded-lg bg-slate-950/90 border border-cyan-500/40 text-xs font-mono-code text-cyan-200">
              Heard: <strong className="text-white">"{transcript}"</strong>
            </div>
          )}

          {/* Status Message */}
          <div className="text-center">
            {status === 'granted' ? (
              <p className="text-sm font-orbitron font-bold text-emerald-300 tracking-wider">
                VOICEPRINT ACCEPTED // WELCOME {userTitle.toUpperCase()}
              </p>
            ) : status === 'declined' ? (
              <p className="text-sm font-orbitron font-bold text-red-400 tracking-wider animate-pulse">
                BIOMETRIC MISMATCH // ACCESS DECLINED ({failedAttempts} FAILED)
              </p>
            ) : status === 'analyzing' ? (
              <p className="text-xs font-mono-code text-cyan-300 animate-pulse">
                Matching vocal timbre, pitch harmonics & acoustic signature...
              </p>
            ) : isListening ? (
              <p className="text-xs font-mono-code text-amber-300 animate-pulse">
                Listening... Speak authorization passphrase now!
              </p>
            ) : (
              <p className="text-xs text-slate-300 font-rajdhani">
                Speak your authorized voiceprint passphrase to unlock.
              </p>
            )}
          </div>
        </div>

        {/* Action Button: Speak to Unlock */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleStartVoiceVerification}
            disabled={status === 'analyzing' || status === 'granted'}
            className={`w-full py-3.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 border shadow-lg ${
              isListening
                ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Listening... (Tap to Stop)</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Speak Voicepass to Unlock</span>
              </>
            )}
          </button>

          {/* Passphrase Hint Box */}
          <div className="p-2.5 rounded bg-slate-950/70 border border-cyan-900/40 text-[11px] font-mono-code text-slate-300 flex items-center justify-between">
            <span>
              Passphrase: <strong className="text-cyan-300">"{authorizedPassphrase}"</strong>
            </span>
            <button
              onClick={() => setIsEnrolling(!isEnrolling)}
              className="text-cyan-400 hover:text-white underline text-[10px]"
            >
              {isEnrolling ? 'Cancel' : 'Change Passphrase'}
            </button>
          </div>

          {/* Passphrase Enrollment Box */}
          {isEnrolling && (
            <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40 space-y-2 text-xs font-mono-code">
              <span className="text-[10px] text-cyan-400 uppercase block font-bold">
                Enroll New Voicepass Phrase:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={enrollText}
                  onChange={(e) => setEnrollText(e.target.value)}
                  placeholder="e.g. Even Dead I'm The Hero"
                  className="flex-1 bg-slate-900 border border-cyan-500/30 rounded px-3 py-1.5 text-white font-rajdhani focus:outline-none"
                />
                <button
                  onClick={handleEnrollPassphrase}
                  className="px-3 py-1.5 bg-cyan-600 text-slate-950 font-bold rounded font-orbitron"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Master PIN Backup Override */}
          <div className="text-center pt-2">
            <button
              onClick={() => setShowPinBackup(!showPinBackup)}
              className="text-[11px] font-mono-code text-slate-400 hover:text-cyan-300 transition flex items-center justify-center gap-1 mx-auto"
            >
              <Key className="w-3 h-3" />
              <span>{showPinBackup ? 'Hide Master PIN Override' : 'Emergency Master PIN Override'}</span>
            </button>

            {showPinBackup && (
              <form onSubmit={handlePinSubmit} className="mt-2.5 flex items-center justify-center gap-2 max-w-xs mx-auto">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (1984 / 4285)"
                  className="w-40 bg-slate-950 border border-cyan-500/40 rounded px-3 py-1.5 text-center text-xs text-white font-mono tracking-widest focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-cyan-500/30 text-xs font-mono-code rounded"
                >
                  Unlock
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-4 p-2.5 rounded bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-mono-code text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
