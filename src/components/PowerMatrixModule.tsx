import React, { useState } from 'react';
import { Zap, Gauge, Flame, AlertTriangle, ShieldCheck, BatteryCharging, Radio } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface PowerMatrixProps {
  powerLevel: number;
  onPowerChange: (level: number) => void;
  userTitle: string;
}

export const PowerMatrixModule: React.FC<PowerMatrixProps> = ({
  powerLevel,
  onPowerChange,
  userTitle,
}) => {
  const [channels, setChannels] = useState({
    repulsors: 30,
    thrusters: 25,
    unibeam: 20,
    lifeSupport: 15,
    sensors: 10,
  });

  const handleChannelChange = (channel: keyof typeof channels, val: number) => {
    sound.playClick();
    setChannels((prev) => ({
      ...prev,
      [channel]: val,
    }));
  };

  const applyPreset = (name: string) => {
    sound.playReactorCharge();
    if (name === 'firepower') {
      setChannels({ repulsors: 35, thrusters: 15, unibeam: 40, lifeSupport: 5, sensors: 5 });
      onPowerChange(115);
    } else if (name === 'flight') {
      setChannels({ repulsors: 10, thrusters: 55, unibeam: 10, lifeSupport: 15, sensors: 10 });
      onPowerChange(105);
    } else if (name === 'stealth') {
      setChannels({ repulsors: 10, thrusters: 15, unibeam: 5, lifeSupport: 20, sensors: 50 });
      onPowerChange(90);
    } else {
      // Balanced
      setChannels({ repulsors: 30, thrusters: 25, unibeam: 20, lifeSupport: 15, sensors: 10 });
      onPowerChange(100);
    }
  };

  const totalChannelPercent = Object.values(channels).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Title */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron font-semibold text-xs tracking-wider text-cyan-200 uppercase">
            Arc Reactor Power Routing Matrix
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono-code">
          <span className="text-slate-400">TOTAL OUTPUT:</span>
          <span className={powerLevel > 110 ? 'text-amber-400 font-bold' : 'text-cyan-300 font-bold'}>
            {powerLevel}%
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5 scanlines">
        {/* Overclock & Master Surge Control */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-orbitron font-bold text-sm text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>CORE OUTPUT THROTTLE</span>
              </div>
              <p className="text-xs text-slate-400 font-rajdhani mt-0.5">
                Regulate magnetic plasma throughput in the Arc Reactor core
              </p>
            </div>
            <div className="text-right">
              <span className="font-orbitron font-bold text-xl text-cyan-300">
                {(12.4 * (powerLevel / 100)).toFixed(2)}
              </span>
              <span className="text-[10px] font-mono-code text-slate-400 block">GIGAJOULES / SEC</span>
            </div>
          </div>

          <input
            type="range"
            min="50"
            max="140"
            value={powerLevel}
            onChange={(e) => {
              const val = Number(e.target.value);
              onPowerChange(val);
              if (val > 120) sound.playProtocolAlert();
              else sound.playClick();
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
          />

          <div className="flex justify-between text-[10px] font-mono-code text-slate-400 mt-1">
            <span>50% (ECO CONSERVE)</span>
            <span className="text-cyan-400">100% (STABLE OPTIMAL)</span>
            <span className="text-amber-400">140% (OVERCLOCK LIMIT)</span>
          </div>

          {powerLevel > 110 && (
            <div className="mt-3 p-2.5 rounded bg-amber-950/50 border border-amber-500/50 text-amber-300 text-xs font-mono-code flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
              <span>
                Caution {userTitle}: Thermal threshold exceeded by {powerLevel - 100}%. Diverting magnetic
                shunts to prevent containment breach.
              </span>
            </div>
          )}
        </div>

        {/* Tactical Routing Presets */}
        <div>
          <div className="text-[10px] font-mono-code uppercase text-slate-400 mb-2">
            Combat & Mission Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'standard', name: 'Balanced Standard', desc: '100% Core Load' },
              { id: 'firepower', name: 'Max Firepower', desc: 'Heavy Unibeam Focus' },
              { id: 'flight', name: 'Mach 7 Intercept', desc: 'Thruster Overdrive' },
              { id: 'stealth', name: 'Stealth Recon', desc: 'Sensor Grid Cloak' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-cyan-800/40 hover:border-cyan-400 text-left transition group"
              >
                <div className="text-xs font-orbitron font-semibold text-cyan-200 group-hover:text-white">
                  {p.name}
                </div>
                <div className="text-[10px] font-mono-code text-slate-400">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Granular Subsystem Power Channels */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono-code uppercase text-slate-400 flex items-center justify-between">
            <span>Subsystem Bus Allocation</span>
            <span className={totalChannelPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}>
              ALLOCATION: {totalChannelPercent}%
            </span>
          </div>

          {[
            { key: 'repulsors', label: 'Repulsor Cannons', val: channels.repulsors, color: 'accent-cyan-400' },
            { key: 'thrusters', label: 'Supersonic Thrusters', val: channels.thrusters, color: 'accent-blue-400' },
            { key: 'unibeam', label: 'Unibeam Projector', val: channels.unibeam, color: 'accent-amber-400' },
            { key: 'lifeSupport', label: 'Cockpit Life Support', val: channels.lifeSupport, color: 'accent-emerald-400' },
            { key: 'sensors', label: 'Targeting & HUD Array', val: channels.sensors, color: 'accent-purple-400' },
          ].map((item) => (
            <div key={item.key} className="p-2.5 rounded bg-slate-950/60 border border-cyan-900/30">
              <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                <span className="text-cyan-200 font-semibold">{item.label}</span>
                <span className="text-white font-bold">{item.val}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={item.val}
                onChange={(e) => handleChannelChange(item.key as any, Number(e.target.value))}
                className={`w-full ${item.color} h-1.5 bg-slate-900 rounded cursor-pointer`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
