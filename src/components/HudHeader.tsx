import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  Radio,
  Shield,
  Activity,
  Sliders,
  Sparkles,
  Settings,
  HelpCircle,
  Glasses,
  Lock,
  Eye,
  UserCheck,
  Smartphone,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { PWAInstallButton } from './PWAInstallButton';
import { silentBiometrics, RecognizedIdentity } from '../utils/silentBiometrics';

interface HudHeaderProps {
  userTitle: string;
  onUserTitleChange: (title: string) => void;
  voicePersona: 'EDITH' | 'JARVIS';
  onVoicePersonaChange: (persona: 'EDITH' | 'JARVIS') => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProtocols: () => void;
  onLockSystem: () => void;
  onOpenAdmin: () => void;
  suitModel: string;
  isMobileSimulator?: boolean;
  onToggleMobileSimulator?: () => void;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  userTitle,
  onUserTitleChange,
  voicePersona,
  onVoicePersonaChange,
  voiceEnabled,
  onToggleVoice,
  soundEnabled,
  onToggleSound,
  onOpenProtocols,
  onLockSystem,
  onOpenAdmin,
  suitModel,
  isMobileSimulator,
  onToggleMobileSimulator,
}) => {
  const [time, setTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(384);
  const [showSettings, setShowSettings] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState<RecognizedIdentity | null>(silentBiometrics.getIdentity());

  useEffect(() => {
    const unsubscribe = silentBiometrics.subscribe((res) => {
      if (res.profile) setRecognizedUser(res.profile);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${s}`;
  };

  const titles = ['Peter', 'Sir', 'Boss', 'Tony', 'Doctor', 'Parker'];

  return (
    <header className="relative z-30 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Stark Brand & System ID */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center glow-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <span className="font-orbitron font-black text-lg text-cyan-300 tracking-tighter">
                {voicePersona === 'EDITH' ? 'E' : 'J'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white glow-text-cyan">
                  {voicePersona === 'EDITH' ? 'E.D.I.T.H.' : 'J.A.R.V.I.S.'}
                </h1>
              </div>
              <p className="text-[11px] font-rajdhani text-cyan-400/70 tracking-widest uppercase">
                {voicePersona === 'EDITH'
                  ? "Even Dead, I'm The Hero • Tactical AR Intelligence"
                  : 'Stark Industries Tactical Cybernetic Interface'}
              </p>
            </div>
          </div>

          {/* Mobile Quick Toggles */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => {
                sound.playClick();
                onVoicePersonaChange(voicePersona === 'EDITH' ? 'JARVIS' : 'EDITH');
              }}
              className="p-1.5 rounded border text-xs border-sky-400/50 bg-sky-950/60 text-sky-300"
              title={`Voice: ${voicePersona}`}
            >
              <Glasses className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onToggleVoice();
              }}
              className={`p-1.5 rounded border text-xs ${
                voiceEnabled
                  ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-300'
                  : 'border-slate-700 bg-slate-900 text-slate-500'
              }`}
              title={voiceEnabled ? 'Vocal Synthesis Active' : 'Vocal Synthesis Muted'}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onToggleSound();
              }}
              className={`p-1.5 rounded border text-xs ${
                soundEnabled
                  ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-300'
                  : 'border-slate-700 bg-slate-900 text-slate-500'
              }`}
              title={soundEnabled ? 'HUD Sounds Active' : 'HUD Sounds Muted'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Center: Mission Clock & Telemetry Badges */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-mono-code text-cyan-300/80">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">
              {voicePersona === 'EDITH' ? 'SATELLITE 418:' : 'UPLINK:'}
            </span>
            <span className="text-emerald-300 font-semibold">
              {voicePersona === 'EDITH' ? 'DRONE SWARM ONLINE' : 'STARKNET-SAT-8'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">ARMOR:</span>
            <span className="text-white font-semibold">{suitModel}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">MET:</span>
            <span className="text-cyan-200">{formatElapsedTime(elapsedSeconds)}</span>
          </div>

          <div className="text-slate-400">
            {time.toLocaleTimeString()} <span className="text-[10px] text-cyan-500">LOC</span>
          </div>
        </div>

        {/* Right: Voice Persona, User Salutation, Sound Toggles & Protocol Launcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Voice Persona Switcher */}
          <button
            onClick={() => {
              sound.playScanBlip();
              onVoicePersonaChange(voicePersona === 'EDITH' ? 'JARVIS' : 'EDITH');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code rounded border transition ${
              voicePersona === 'EDITH'
                ? 'bg-gradient-to-r from-sky-950 to-blue-950 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
            }`}
            title="Click to toggle Assistant Voice between E.D.I.T.H. (Spider-Man) and J.A.R.V.I.S."
          >
            <Glasses className="w-3.5 h-3.5 text-sky-300" />
            <span className="font-bold">
              VOICE: <span className="text-white">{voicePersona}</span>
            </span>
          </button>

          {/* Address honorific */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowSettings(!showSettings);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition"
              title="Change Form of Address"
            >
              <span className="text-slate-400 text-[10px]">ADDRESS:</span>
              <span className="font-semibold text-white">{userTitle}</span>
              <Settings className="w-3 h-3 text-cyan-400 ml-0.5" />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-1.5 w-40 bg-slate-950 border border-cyan-500/40 rounded shadow-xl p-2 z-50">
                <div className="text-[10px] font-mono-code uppercase text-cyan-400 mb-1.5 px-1">
                  Preferred Honorific
                </div>
                <div className="flex flex-col gap-1">
                  {titles.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        sound.playClick();
                        onUserTitleChange(t);
                        setShowSettings(false);
                      }}
                      className={`text-left px-2 py-1 text-xs rounded transition font-mono-code ${
                        userTitle === t
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-300 hover:bg-cyan-950/40 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Audio Controls */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                onToggleVoice();
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-mono-code transition ${
                voiceEnabled
                  ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
              title="Toggle JARVIS Speech Synthesis"
            >
              <Mic className="w-3 h-3" />
              <span className="text-[10px]">{voiceEnabled ? 'VOICE ON' : 'MUTED'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onToggleSound();
              }}
              className={`p-1.5 rounded border text-xs transition ${
                soundEnabled
                  ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
              title="Toggle HUD Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Silent Biometric Recognition Status Badge */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdmin();
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code hover:bg-emerald-900/60 transition shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            title="Silent Background Facial Recognition Active - Click for Admin Settings"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-bold">
              {recognizedUser?.name ? recognizedUser.name.split(' ')[0] : 'SAI'}
            </span>
            <span className="text-[10px] text-emerald-400/80 px-1 rounded bg-emerald-900/60 hidden md:inline">
              LVL 10
            </span>
          </button>

          {/* Admin & Account Tool Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdmin();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code transition shadow-sm"
            title="Open Account & Admin Command Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-bold">ADMIN</span>
          </button>

          {/* Mobile Phone Simulator Toggle */}
          {onToggleMobileSimulator && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleMobileSimulator();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-code transition border ${
                isMobileSimulator
                  ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle interactive mobile device mockup preview"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-bold">
                {isMobileSimulator ? 'EXIT PREVIEW' : 'PHONE PREVIEW'}
              </span>
            </button>
          )}

          {/* PWA Mobile App Install Button */}
          <PWAInstallButton />

          {/* Biometric Security Lock Button */}
          <button
            onClick={() => {
              sound.playScanBlip();
              onLockSystem();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-mono-code transition"
            title="Lock system with Voice Biometric Gate"
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold">LOCK</span>
          </button>

          {/* Protocol Matrix Button */}
          <button
            onClick={() => {
              sound.playScanBlip();
              onOpenProtocols();
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-900/70 to-blue-900/70 hover:from-cyan-800 hover:to-blue-800 text-cyan-200 border border-cyan-400/60 rounded text-xs font-mono-code transition glow-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="tracking-wider">PROTOCOLS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
