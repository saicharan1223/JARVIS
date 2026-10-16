import React from 'react';
import { Shield, Zap, Wind, Cpu, Crosshair, CheckCircle2, ChevronRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export interface ArmorSuit {
  id: string;
  name: string;
  mark: string;
  designation: string;
  generation: string;
  description: string;
  integrity: number;
  naniteReserves: number;
  repulsorCharge: number;
  flightVelocity: string;
  specialAbility: string;
  colorTheme: string;
}

export const ARMOR_COLLECTION: ArmorSuit[] = [
  {
    id: 'mark-85',
    name: 'Mark LXXXV',
    mark: 'Mark 85',
    designation: 'Advanced Vibranium Nanotech',
    generation: 'Gen 8 Nanotechnology',
    description: 'Stark’s ultimate creation combining organic nanostructure with reinforced vibranium weave and nano-gauntlet conduit.',
    integrity: 98,
    naniteReserves: 96,
    repulsorCharge: 100,
    flightVelocity: 'Mach 8.5',
    specialAbility: 'Lightning Refocuser & Nano-Shield Bastion',
    colorTheme: 'from-amber-500/20 to-red-600/30 border-amber-400/50',
  },
  {
    id: 'mark-50',
    name: 'Mark L',
    mark: 'Mark 50',
    designation: 'Bleeding Edge Nanotech',
    generation: 'Gen 7 Nanotechnology',
    description: 'Rapid morphogenetic weapon synthesis, complete vacuum survival envelope, and high-energy unibeam cannon.',
    integrity: 94,
    naniteReserves: 88,
    repulsorCharge: 95,
    flightVelocity: 'Mach 7.2',
    specialAbility: 'Morphing Blade Array & Micro-Thruster Boots',
    colorTheme: 'from-red-500/20 to-amber-600/30 border-red-500/50',
  },
  {
    id: 'mark-44',
    name: 'Mark XLIV (Veronica)',
    mark: 'Mark 44',
    designation: 'Hulkbuster Heavy Combat',
    generation: 'Heavy Impact Platform',
    description: 'Orbital satellite drop armor with hydraulic impact dampening, multi-arc reactor array, and autonomous replacement modules.',
    integrity: 100,
    naniteReserves: 70,
    repulsorCharge: 100,
    flightVelocity: 'Mach 3.2',
    specialAbility: 'Hydraulic Pneumatic Jackhammer Clamps',
    colorTheme: 'from-red-700/30 to-amber-700/30 border-red-400/60',
  },
  {
    id: 'mark-42',
    name: 'Mark XLII',
    mark: 'Mark 42',
    designation: 'Autonomous Prehensile Propulsion',
    generation: 'Subdermal Locator Gen 4',
    description: 'Individual modular flight pieces equipped with separate micro-thrusters, responding to neural subdermal implants.',
    integrity: 86,
    naniteReserves: 0,
    repulsorCharge: 92,
    flightVelocity: 'Mach 5.0',
    specialAbility: 'Independent Segment Intercept & Remote Pilot',
    colorTheme: 'from-yellow-500/20 to-amber-700/20 border-yellow-400/50',
  },
  {
    id: 'mark-7',
    name: 'Mark VII',
    mark: 'Mark 7',
    designation: 'Rapid Deployment Pod Armor',
    generation: 'Tactical Kinetic Shell',
    description: 'Battle of New York veteran unit featuring heavy laser cutters, shoulder micro-missile pods, and triple-thruster stabilization.',
    integrity: 91,
    naniteReserves: 0,
    repulsorCharge: 89,
    flightVelocity: 'Mach 4.8',
    specialAbility: 'Tri-Laser Cutters & 92 Micro-Missiles',
    colorTheme: 'from-cyan-900/30 to-blue-900/30 border-cyan-400/50',
  },
];

interface ArmoryModuleProps {
  selectedSuit: string;
  onSelectSuit: (suitName: string) => void;
}

export const ArmoryModule: React.FC<ArmoryModuleProps> = ({ selectedSuit, onSelectSuit }) => {
  const currentSuit = ARMOR_COLLECTION.find((s) => s.name === selectedSuit) || ARMOR_COLLECTION[0];

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Title */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron font-semibold text-xs tracking-wider text-cyan-200 uppercase">
            Stark Armory // Vault Schematics
          </span>
        </div>
        <span className="text-[10px] font-mono-code text-cyan-400/80">5 ACTIVE PLATFORMS</span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
        {/* Suit selector list */}
        <div className="md:col-span-5 border-r border-cyan-500/20 p-3 space-y-2 bg-slate-950/40">
          <div className="text-[10px] font-mono-code uppercase text-slate-400 px-1 mb-2">
            Select Tactical Platform:
          </div>
          {ARMOR_COLLECTION.map((suit) => {
            const isSelected = suit.name === currentSuit.name;
            return (
              <button
                key={suit.id}
                onClick={() => {
                  sound.playClick();
                  onSelectSuit(suit.name);
                }}
                className={`w-full text-left p-3 rounded-lg border transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-900/40 border-cyan-900/40 text-slate-300 hover:border-cyan-600/60 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-bold text-sm text-cyan-300">{suit.mark}</span>
                    {isSelected && (
                      <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/50">
                        DEPLOYED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-rajdhani">{suit.designation}</div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Suit Deep Inspection */}
        <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-slate-900/30 scanlines">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest">
                  {currentSuit.generation}
                </span>
                <h3 className="font-orbitron font-bold text-xl sm:text-2xl text-white glow-text-cyan">
                  {currentSuit.name}
                </h3>
                <p className="text-xs font-rajdhani text-cyan-300/80 mt-0.5">{currentSuit.designation}</p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-right">
                <span className="text-[9px] font-mono-code text-slate-400 block">TOP VELOCITY</span>
                <span className="font-orbitron font-bold text-sm text-cyan-200">
                  {currentSuit.flightVelocity}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-rajdhani leading-relaxed mt-3 p-3 rounded bg-slate-950/60 border border-cyan-900/40">
              {currentSuit.description}
            </p>

            {/* Diagnostic bars */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2.5 rounded bg-slate-950/70 border border-cyan-900/40">
                <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-cyan-400" /> INTEGRITY
                  </span>
                  <span className="text-cyan-300 font-bold">{currentSuit.integrity}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded transition-all duration-500"
                    style={{ width: `${currentSuit.integrity}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950/70 border border-cyan-900/40">
                <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> REPULSOR CAP
                  </span>
                  <span className="text-amber-300 font-bold">{currentSuit.repulsorCharge}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded transition-all duration-500"
                    style={{ width: `${currentSuit.repulsorCharge}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Nanite & Weapons Specs */}
            <div className="mt-3 p-3 rounded bg-slate-950/70 border border-cyan-900/40 space-y-1.5 text-xs font-mono-code">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">NANITE REPLENISHMENT:</span>
                <span className="text-cyan-300 font-semibold">{currentSuit.naniteReserves}% CAPACITY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SIGNATURE ARMAMENT:</span>
                <span className="text-amber-300 font-semibold">{currentSuit.specialAbility}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-5 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> RECOGNITION TRANSPONDER VERIFIED
            </span>

            <button
              onClick={() => {
                sound.playReactorCharge();
                onSelectSuit(currentSuit.name);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded border border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)] transition"
            >
              Deploy {currentSuit.mark}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
