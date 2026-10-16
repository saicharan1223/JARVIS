import React, { useState } from 'react';
import { Radar as RadarIcon, Compass, Radio, Wind, Thermometer, ShieldAlert, Navigation } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface RadarTarget {
  id: string;
  name: string;
  type: 'friendly' | 'orbital' | 'tracked' | 'beacon';
  bearing: number; // degrees
  distance: number; // km
  altitude: string;
  speed: string;
  coords: string;
}

const TARGETS: RadarTarget[] = [
  {
    id: 'veronica',
    name: 'Veronica Orbital Pod 418',
    type: 'orbital',
    bearing: 42,
    distance: 430,
    altitude: '210 km (LEO)',
    speed: '7.8 km/s',
    coords: '34°01’N 118°29’W',
  },
  {
    id: 'vault',
    name: 'Malibu Subterranean Vault',
    type: 'friendly',
    bearing: 215,
    distance: 14.2,
    altitude: '-12 m',
    speed: 'Stationary',
    coords: '34°00’N 118°48’W',
  },
  {
    id: 'sat',
    name: 'StarkNet Comms Relayer VII',
    type: 'friendly',
    bearing: 310,
    distance: 350,
    altitude: '35,786 km (GEO)',
    speed: '3.07 km/s',
    coords: '00°00’N 110°12’W',
  },
  {
    id: 'drone',
    name: 'High-Altitude Stratospheric Drone',
    type: 'tracked',
    bearing: 135,
    distance: 82.5,
    altitude: '18,500 m',
    speed: 'Mach 2.4',
    coords: '33°45’N 117°50’W',
  },
];

export const TacticalRadarModule: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget>(TARGETS[0]);

  const handleTargetClick = (target: RadarTarget) => {
    sound.playScanBlip();
    setSelectedTarget(target);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Title */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <RadarIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron font-semibold text-xs tracking-wider text-cyan-200 uppercase">
            Tactical Radar & Atmospheric Telemetry
          </span>
        </div>
        <span className="text-[10px] font-mono-code text-cyan-400/80">360° ACTIVE SWEEP</span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
        {/* Radar Graphic Viewport */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-950/50 border-r border-cyan-500/20 relative">
          {/* Radar Screen Circle */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-cyan-500/50 bg-cyan-950/20 flex items-center justify-center overflow-hidden glow-cyan">
            {/* Concentric distance rings */}
            <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-500/20 pointer-events-none" />
            <div className="absolute w-1/2 h-1/2 rounded-full border border-cyan-500/20 pointer-events-none" />
            <div className="absolute w-1/4 h-1/4 rounded-full border border-cyan-500/20 pointer-events-none" />

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-500/30 pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-cyan-500/30 pointer-events-none" />

            {/* Rotating Radar Sweep Needle with gradient tail */}
            <div className="absolute inset-0 animate-radar pointer-events-none origin-center">
              <div
                className="w-1/2 h-full ml-auto"
                style={{
                  background:
                    'conic-gradient(from 180deg at 0% 50%, rgba(0, 240, 255, 0.35) 0deg, transparent 60deg)',
                }}
              />
            </div>

            {/* Center Blip: User / J.A.R.V.I.S. */}
            <div className="relative z-10 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff] animate-pulse" />

            {/* Radar Target Blips */}
            {TARGETS.map((target) => {
              // Convert bearing and distance to position within circular radar
              const angleRad = (target.bearing - 90) * (Math.PI / 180);
              // Normalized radius: 0 to 110px
              const r = Math.min(100, Math.max(25, (target.distance / 450) * 95));
              const x = 120 + r * Math.cos(angleRad);
              const y = 120 + r * Math.sin(angleRad);
              const isSelected = selectedTarget.id === target.id;

              return (
                <button
                  key={target.id}
                  onClick={() => handleTargetClick(target)}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  style={{ left: `${x}px`, top: `${y}px` }}
                  title={target.name}
                >
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-400 scale-125 shadow-[0_0_10px_#f59e0b]'
                        : target.type === 'friendly' || target.type === 'orbital'
                        ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                        : 'bg-red-400 shadow-[0_0_8px_#ef4444]'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 absolute left-4 top-0 whitespace-nowrap bg-slate-950/90 text-cyan-200 text-[10px] font-mono-code px-1.5 py-0.5 rounded border border-cyan-500/40 pointer-events-none transition">
                    {target.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] font-mono-code text-cyan-400/80 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> FRIENDLY
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" /> TRACKED
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> SELECTED
            </span>
          </div>
        </div>

        {/* Target Details & Weather Matrix */}
        <div className="md:col-span-5 p-4 flex flex-col justify-between space-y-4 scanlines">
          {/* Target Inspector */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/30">
            <div className="text-[10px] font-mono-code uppercase text-cyan-400 mb-1">
              Selected Target Telemetry:
            </div>
            <div className="font-orbitron font-bold text-sm text-white">{selectedTarget.name}</div>
            <div className="text-xs font-mono-code text-cyan-300 mt-0.5">
              Type: {selectedTarget.type.toUpperCase()}
            </div>

            <div className="mt-3 space-y-1.5 text-xs font-mono-code">
              <div className="flex justify-between">
                <span className="text-slate-400">BEARING:</span>
                <span className="text-cyan-200 font-bold">{selectedTarget.bearing}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DISTANCE:</span>
                <span className="text-cyan-200 font-bold">{selectedTarget.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ALTITUDE:</span>
                <span className="text-cyan-200 font-bold">{selectedTarget.altitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">VELOCITY:</span>
                <span className="text-cyan-200 font-bold">{selectedTarget.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GRID COORDS:</span>
                <span className="text-cyan-200 font-bold">{selectedTarget.coords}</span>
              </div>
            </div>
          </div>

          {/* Environmental Matrix */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/30">
            <div className="text-[10px] font-mono-code uppercase text-cyan-400 mb-2">
              Atmospheric & Spatial Environment:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
              <div className="p-2 rounded bg-slate-950/60 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-400" /> WIND SHEAR
                </span>
                <span className="text-cyan-200 font-bold text-sm">24 kts WNW</span>
              </div>

              <div className="p-2 rounded bg-slate-950/60 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" /> AMBIENT TEMP
                </span>
                <span className="text-cyan-200 font-bold text-sm">18.4° C</span>
              </div>

              <div className="p-2 rounded bg-slate-950/60 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-emerald-400" /> PRESSURE
                </span>
                <span className="text-cyan-200 font-bold text-sm">1013.2 hPa</span>
              </div>

              <div className="p-2 rounded bg-slate-950/60 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-purple-400" /> GEOMAGNETIC
                </span>
                <span className="text-cyan-200 font-bold text-sm">Kp 1.8 STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
