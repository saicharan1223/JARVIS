import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Flame,
  Shield,
  Zap,
  Users,
  Compass,
  CheckCircle,
  Lock,
  Unlock,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface Protocol {
  id: string;
  name: string;
  designation: string;
  desc: string;
  warningLevel: 'standard' | 'high' | 'critical';
  requiresOverride: boolean;
}

const PROTOCOLS: Protocol[] = [
  {
    id: 'house-party',
    name: 'House Party Protocol',
    designation: 'STARK-SEC-ALPHA-32',
    desc: 'Summons all thirty-two subterranean and orbital autonomous Iron Man armors to your exact GPS coordinates.',
    warningLevel: 'high',
    requiresOverride: false,
  },
  {
    id: 'clean-slate',
    name: 'Clean Slate Protocol',
    designation: 'STARK-FAILSAFE-OMEGA',
    desc: 'Terminal security failsafe. Overloads and vaporizes all auxiliary autonomous combat armors to prevent hostile reverse-engineering.',
    warningLevel: 'critical',
    requiresOverride: true,
  },
  {
    id: 'veronica',
    name: 'Veronica Orbital Deployment',
    designation: 'SATELLITE-PLATFORM-418',
    desc: 'Deploys Mark XLIV Hulkbuster reinforcement pod and replacement limb modules from low Earth orbit.',
    warningLevel: 'high',
    requiresOverride: false,
  },
  {
    id: 'stealth-recon',
    name: 'Stealth Cloak Subroutine',
    designation: 'OPTICAL-ABSORB-GRID',
    desc: 'Diverts primary power to visual cloaking refractors and suppresses thermal and radar exhaust signatures.',
    warningLevel: 'standard',
    requiresOverride: false,
  },
  {
    id: 'barnstormer',
    name: 'Barnstormer Evasive Protocol',
    designation: 'HIGH-G-VECTOR-ENGAGE',
    desc: 'Hands flight control to J.A.R.V.I.S. for extreme supersonic maneuvering and missile diversion.',
    warningLevel: 'standard',
    requiresOverride: false,
  },
  {
    id: 'neural-scan',
    name: 'Deep Neural & Core Diagnostic',
    designation: 'QUANTUM-OPTICAL-SWEEP',
    desc: 'Performs comprehensive bit-level integrity verification across all Stark subroutines and optical bus lines.',
    warningLevel: 'standard',
    requiresOverride: false,
  },
];

interface ProtocolMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteProtocol: (protocol: Protocol) => void;
  userTitle: string;
}

export const ProtocolMatrixModal: React.FC<ProtocolMatrixModalProps> = ({
  isOpen,
  onClose,
  onExecuteProtocol,
  userTitle,
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(PROTOCOLS[0]);
  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (p: Protocol) => {
    sound.playClick();
    setSelectedProtocol(p);
    setSecurityUnlocked(false);
    setExecutionMessage(null);
  };

  const handleExecute = () => {
    if (selectedProtocol.requiresOverride && !securityUnlocked) {
      sound.playProtocolAlert();
      return;
    }

    if (selectedProtocol.warningLevel === 'critical') {
      sound.playProtocolAlert();
    } else {
      sound.playReactorCharge();
    }

    setIsExecuting(true);
    setExecutionMessage(`Transmitting ${selectedProtocol.name} authorization codes, ${userTitle}...`);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionMessage(`Protocol engaged. Subroutines executing at nominal status.`);
      onExecuteProtocol(selectedProtocol);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-orbitron font-bold text-sm tracking-wider text-white">
                STARK PROTOCOL OVERRIDE MATRIX
              </h2>
              <p className="text-[10px] font-mono-code text-cyan-400/70">
                LEVEL 5 EXECUTIVE AUTHORIZATION REQUIRED
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Protocol List */}
          <div className="md:col-span-5 p-3 space-y-1.5 border-r border-cyan-500/20 bg-slate-950/50">
            <div className="text-[10px] font-mono-code uppercase text-slate-400 px-1 mb-2">
              Available Protocols:
            </div>
            {PROTOCOLS.map((p) => {
              const isSelected = p.id === selectedProtocol.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                      : 'bg-slate-900/40 border-cyan-900/40 text-slate-300 hover:border-cyan-600/50 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-cyan-200">{p.name}</span>
                    {p.warningLevel === 'critical' ? (
                      <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/50">
                        CRITICAL
                      </span>
                    ) : p.warningLevel === 'high' ? (
                      <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/50">
                        PRIORITY
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono-code text-cyan-400/70">STANDARD</span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono-code text-slate-400 mt-1">{p.designation}</div>
                </button>
              );
            })}
          </div>

          {/* Protocol Details & Execution View */}
          <div className="md:col-span-7 p-5 flex flex-col justify-between bg-slate-900/30 scanlines">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest">
                    DESIGNATION: {selectedProtocol.designation}
                  </span>
                  <h3 className="font-orbitron font-bold text-xl text-white glow-text-cyan mt-1">
                    {selectedProtocol.name}
                  </h3>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-cyan-900/50 text-xs font-rajdhani text-slate-200 leading-relaxed text-sm">
                {selectedProtocol.desc}
              </div>

              {selectedProtocol.warningLevel === 'critical' && (
                <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/60 text-red-200 text-xs font-mono-code flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold block text-red-300">IRREVERSIBLE SECURITY EVENT</span>
                    Requires biometric verification lock disengagement. Detonation sequence cannot be
                    halted once secondary relays trigger.
                  </div>
                </div>
              )}

              {/* Security Override Lock Switch for Critical Protocols */}
              {selectedProtocol.requiresOverride && (
                <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-cyan-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {securityUnlocked ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-xs font-mono-code text-slate-300">
                      {securityUnlocked ? 'Override Disengaged (Armed)' : 'Security Locks Engaged'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setSecurityUnlocked(!securityUnlocked);
                    }}
                    className={`px-3 py-1 text-xs font-mono-code rounded border transition ${
                      securityUnlocked
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {securityUnlocked ? 'DISARM' : 'DISENGAGE LOCK'}
                  </button>
                </div>
              )}

              {/* Feedback status */}
              {executionMessage && (
                <div className="mt-4 p-2.5 rounded bg-cyan-950/60 border border-cyan-400/50 text-cyan-200 text-xs font-mono-code flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>{executionMessage}</span>
                </div>
              )}
            </div>

            {/* Execution CTA */}
            <div className="mt-6 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-slate-400">
                AUTHORIZED USER: <span className="text-cyan-300">{userTitle}</span>
              </span>

              <button
                onClick={handleExecute}
                disabled={isExecuting || (selectedProtocol.requiresOverride && !securityUnlocked)}
                className={`px-5 py-2.5 rounded-lg font-orbitron font-bold text-xs uppercase tracking-wider transition border shadow-lg ${
                  selectedProtocol.warningLevel === 'critical'
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] disabled:opacity-40'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-40'
                }`}
              >
                {isExecuting ? 'TRANSMITTING...' : `EXECUTE ${selectedProtocol.name}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
