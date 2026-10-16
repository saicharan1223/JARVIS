import React, { useState } from 'react';
import { Zap, Flame, ShieldAlert, Cpu } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ArcReactorProps {
  isSpeaking: boolean;
  isProcessing: boolean;
  isListening: boolean;
  powerLevel: number;
  onPowerBoost?: () => void;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  isSpeaking,
  isProcessing,
  isListening,
  powerLevel,
  onPowerBoost,
}) => {
  const [isCharging, setIsCharging] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const handleReactorClick = () => {
    sound.playReactorCharge();
    setIsCharging(true);
    setPulseCount((prev) => prev + 1);
    onPowerBoost?.();
    setTimeout(() => setIsCharging(false), 800);
  };

  // State-based glow color and activity
  let coreColor = 'text-cyan-400';
  let glowClass = 'glow-cyan';
  let ringSpeed = 'animate-spin-slow';
  let innerSpeed = 'animate-spin-reverse';

  if (isSpeaking) {
    coreColor = 'text-cyan-300';
    glowClass = 'glow-cyan-lg';
    ringSpeed = 'animate-spin';
  } else if (isListening) {
    coreColor = 'text-amber-400';
    glowClass = 'glow-amber';
  } else if (isProcessing) {
    coreColor = 'text-sky-300';
    glowClass = 'glow-cyan-lg';
  } else if (powerLevel > 110) {
    coreColor = 'text-amber-400';
    glowClass = 'glow-amber';
  }

  // Generate 10 coil blocks around the ring
  const coils = Array.from({ length: 10 });

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Visualizer and Reactor Container */}
      <div
        onClick={handleReactorClick}
        className="relative group cursor-pointer w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center select-none"
        title="Arc Reactor Core - Click to Pulse"
      >
        {/* Ambient background glow */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            isSpeaking || isCharging
              ? 'bg-cyan-500/30 scale-110'
              : isListening
              ? 'bg-amber-500/25 scale-105'
              : 'bg-cyan-600/15 scale-95'
          }`}
        />

        {/* Outer Tech Ring with radial calibration notches */}
        <div
          className={`absolute w-full h-full rounded-full border border-cyan-500/30 border-dashed ${ringSpeed} duration-[25s] pointer-events-none`}
        />

        {/* Outer Angular Segments Ring */}
        <svg
          className="absolute w-full h-full pointer-events-none animate-spin-slow duration-[30s]"
          viewBox="0 0 300 300"
        >
          <circle
            cx="150"
            cy="150"
            r="138"
            fill="none"
            stroke="rgba(0, 240, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <circle
            cx="150"
            cy="150"
            r="128"
            fill="none"
            stroke="rgba(0, 240, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="40 20 10 20"
          />
          <circle
            cx="150"
            cy="150"
            r="108"
            fill="none"
            stroke="rgba(0, 240, 255, 0.15)"
            strokeWidth="1"
          />
        </svg>

        {/* Counter-rotating Inner Telemetry Ring */}
        <svg
          className={`absolute w-52 h-52 pointer-events-none ${innerSpeed}`}
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="16 12 32 8"
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="rgba(14, 165, 233, 0.25)"
            strokeWidth="1"
            strokeDasharray="8 4"
          />
        </svg>

        {/* Electromagnetic Coils Assembly (10 radially spaced blocks) */}
        <div className="absolute w-44 h-44 rounded-full flex items-center justify-center pointer-events-none">
          {coils.map((_, i) => {
            const angle = i * 36;
            return (
              <div
                key={i}
                className="absolute w-4 h-7 bg-gradient-to-t from-cyan-950 via-cyan-800 to-cyan-500 rounded-sm border border-cyan-400/60 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                style={{
                  transform: `rotate(${angle}deg) translateY(-64px)`,
                  opacity: isCharging || isSpeaking ? 1 : 0.8,
                }}
              >
                {/* Copper winding look inside */}
                <div className="w-full h-1 bg-amber-400/70 mt-1" />
                <div className="w-full h-1 bg-amber-400/70 mt-1" />
              </div>
            );
          })}
        </div>

        {/* Pulsing Audio/Reactive Ring */}
        <div
          className={`absolute w-36 h-36 rounded-full border-2 border-cyan-400/80 transition-transform duration-300 pointer-events-none ${
            isSpeaking
              ? 'scale-110 shadow-[0_0_20px_rgba(0,240,255,0.8)]'
              : isListening
              ? 'scale-105 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
              : 'scale-100 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
          } ${isCharging ? 'scale-125 !border-white' : ''}`}
        />

        {/* Inner Core Housing with Vibranium Triangular/Hexagonal Core */}
        <div
          className={`relative z-10 w-24 h-24 rounded-full bg-radial from-cyan-200 via-cyan-500 to-slate-950 border-2 border-cyan-300 flex items-center justify-center transition-all duration-300 ${glowClass} ${
            isCharging ? 'scale-110 brightness-150' : 'group-hover:scale-105'
          }`}
        >
          {/* Triangular Stark Core Geometry */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-white/80 rotate-0 rounded-sm shadow-[0_0_12px_#fff]" />
            <div className="absolute inset-0 border border-cyan-200/90 rotate-45 rounded-sm" />
            <div className="w-6 h-6 rounded-full bg-white shadow-[0_0_15px_#ffffff] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-900 fill-cyan-900" />
            </div>
          </div>
        </div>

        {/* Audio Waveform Arc Indicators when speaking or listening */}
        {(isSpeaking || isListening) && (
          <div className="absolute -inset-2 flex items-center justify-center pointer-events-none">
            <span className="absolute w-full h-full rounded-full border border-cyan-400/50 animate-ping opacity-60" />
          </div>
        )}
      </div>

      {/* Core Telemetry Readout */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono-code text-cyan-400/80">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/40">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>OUTPUT:</span>
          <span className="text-white font-bold">{(12.4 * (powerLevel / 100)).toFixed(1)} GJ/s</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/40">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>CORE TEMP:</span>
          <span className={powerLevel > 110 ? 'text-amber-300 font-bold' : 'text-cyan-200'}>
            {Math.round(3800 + (powerLevel - 100) * 45)} K
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/40">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>FLUX:</span>
          <span className="text-emerald-400 font-bold">99.4% NOMINAL</span>
        </div>
      </div>
    </div>
  );
};
