import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Key,
  Lock,
  Unlock,
  Eye,
  Camera,
  Activity,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Plus,
  Download,
  CheckCircle2,
  XCircle,
  Radio,
  Smartphone,
  Cpu,
  Fingerprint,
  FileText,
  Volume2,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';
import { silentBiometrics, RecognizedIdentity } from '../utils/silentBiometrics';
import { motion, AnimatePresence } from 'motion/react';

interface AdminAccountSettingsProps {
  userTitle: string;
  onUserTitleChange: (title: string) => void;
  voicePersona: 'EDITH' | 'JARVIS';
  onVoicePersonaChange: (persona: 'EDITH' | 'JARVIS') => void;
  onTriggerLockdown: (locked: boolean) => void;
  isSystemLocked: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  eventType: string;
  identity: string;
  clearance: string;
  confidence: number;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'BREACH';
  ipAddress: string;
}

export const AdminAccountSettings: React.FC<AdminAccountSettingsProps> = ({
  userTitle,
  onUserTitleChange,
  voicePersona,
  onVoicePersonaChange,
  onTriggerLockdown,
  isSystemLocked,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'biometrics' | 'personnel' | 'audit' | 'subsystems'>('profile');
  const [recognizedUser, setRecognizedUser] = useState<RecognizedIdentity | null>(silentBiometrics.getIdentity());
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState(95);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [logFilter, setLogFilter] = useState<'ALL' | 'BREACH' | 'SUCCESS'>('ALL');

  // Personnel management
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Avenger Tactical Agent');
  const [newClearance, setNewClearance] = useState('Level 8 (Tactical)');

  // Subsystem permissions
  const [permissions, setPermissions] = useState({
    orbitalDrones: true,
    multiAiEngines: true,
    phoneRelays: true,
    reactorOverclock: true,
    cleanSlateReady: false,
    silentFacialRecognition: true,
  });

  // Load audit logs and profiles from backend
  const fetchAdminData = async () => {
    try {
      const [logsRes, profRes] = await Promise.all([
        fetch('/api/admin/audit-logs'),
        fetch('/api/admin/profiles'),
      ]);
      const logsData = await logsRes.json();
      const profData = await profRes.json();

      if (logsData.logs) setAuditLogs(logsData.logs);
      if (profData.profiles) setProfiles(profData.profiles);
    } catch (e) {
      console.warn('Failed to fetch admin data from backend', e);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const unsubscribe = silentBiometrics.subscribe((res) => {
      if (res.profile) setRecognizedUser(res.profile);
    });
    return () => unsubscribe();
  }, []);

  // Perform background facial scan
  const handleTriggerFacialScan = async (forceIntruder = false) => {
    setIsScanning(true);
    sound.playScanBlip();
    setScanStatusMessage(forceIntruder ? 'Simulating unknown facial scan...' : 'Executing silent background facial scan...');

    try {
      const result = await silentBiometrics.performSilentScan({ forceIntruder });
      setIsScanning(false);

      if (result.recognized && result.profile) {
        sound.playJarvisChime();
        setRecognizedUser(result.profile);
        setScanStatusMessage(`Identity Verified: ${result.profile.name} (Confidence: ${result.confidence}%)`);
        speech.speakText(
          voicePersona === 'EDITH'
            ? `Biometric scan complete. Welcome back, ${userTitle}. Identity verified.`
            : `Biometric confirmation accepted, ${userTitle}.`
        );
      } else {
        sound.playProtocolAlert();
        setScanStatusMessage(`Security Warning: Unrecognized facial geometry. Access Denied.`);
        speech.speakText(`Access denied. Unrecognized facial signature.`);
        if (forceIntruder) {
          onTriggerLockdown(true);
        }
      }
      fetchAdminData();
    } catch {
      setIsScanning(false);
      setScanStatusMessage('Scan finished with fallback token.');
    }
  };

  // Enroll new personnel
  const handleEnrollPersonnel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      sound.playClick();
      const res = await fetch('/api/admin/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole,
          clearanceLevel: newClearance,
        }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfiles((prev) => [...prev, data.profile]);
        setShowAddModal(false);
        setNewName('');
        setNewEmail('');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Export audit logs to JSON
  const handleExportLogs = () => {
    sound.playClick();
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stark-security-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.status === logFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner / Account Header */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-md p-4 sm:p-6 glow-cyan">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center glow-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <span className="font-orbitron font-black text-2xl text-cyan-300">
                  {recognizedUser?.avatarInitials || 'SP'}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-orbitron font-bold text-lg sm:text-2xl text-white tracking-wide">
                  {recognizedUser?.name || 'Sai (Peter Parker)'}
                </h2>
                <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {recognizedUser?.clearanceLevel || 'Level 10 (Director)'}
                </span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FACIAL SCAN VERIFIED
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-400/80 font-rajdhani mt-0.5">
                Stark Keyholder ID: <span className="text-slate-300 font-mono-code">{recognizedUser?.email || 'saiphotos1223@gmail.com'}</span> • Role: {recognizedUser?.role || 'Master Commander'}
              </p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => handleTriggerFacialScan(false)}
              disabled={isScanning}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/80 hover:border-cyan-400 text-xs font-rajdhani tracking-wider uppercase transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Silent Re-Scan'}</span>
            </button>

            <button
              onClick={() => onTriggerLockdown(!isSystemLocked)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-rajdhani tracking-wider uppercase transition shadow-sm ${
                isSystemLocked
                  ? 'bg-red-950/80 border-red-500 text-red-300 hover:bg-red-900'
                  : 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              {isSystemLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isSystemLocked ? 'Unlock Terminals' : 'Lockdown'}</span>
            </button>
          </div>
        </div>

        {scanStatusMessage && (
          <div className="mt-3 text-xs font-mono-code text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded px-3 py-1.5 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{scanStatusMessage}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-cyan-500/20">
        {[
          { id: 'profile', label: 'Operator Account', icon: User },
          { id: 'biometrics', label: 'Silent Facial Biometrics', icon: Eye },
          { id: 'personnel', label: 'Personnel & Clearance', icon: Users },
          { id: 'audit', label: 'Security Audit Logs', icon: FileText },
          { id: 'subsystems', label: 'Permissions & Subsystems', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-rajdhani font-medium tracking-wide whitespace-nowrap transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="tab-profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Account Info */}
            <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4 sm:p-5 space-y-4">
              <h3 className="font-orbitron font-semibold text-sm text-cyan-300 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Account Credentials & Identity
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="text-[11px] text-cyan-400/80 uppercase font-mono-code">Master Operator Name</label>
                  <input
                    type="text"
                    value={userTitle}
                    onChange={(e) => onUserTitleChange(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-cyan-500/40 rounded-lg px-3 py-2 text-white font-rajdhani focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">E.D.I.T.H. and J.A.R.V.I.S. will address you by this name in all vocal and text exchanges.</p>
                </div>

                <div>
                  <label className="text-[11px] text-cyan-400/80 uppercase font-mono-code">Registered Email Token</label>
                  <input
                    type="text"
                    readOnly
                    value={recognizedUser?.email || 'saiphotos1223@gmail.com'}
                    className="w-full mt-1 bg-slate-950/60 border border-cyan-500/20 rounded-lg px-3 py-2 text-slate-300 font-mono-code cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-cyan-400/80 uppercase font-mono-code">Assistant Voice Persona</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => onVoicePersonaChange('EDITH')}
                      className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
                        voicePersona === 'EDITH'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-orbitron text-xs font-bold">E.D.I.T.H.</span>
                      <span className="text-[10px] text-cyan-400 font-mono-code">Spider-Man AR</span>
                    </button>
                    <button
                      onClick={() => onVoicePersonaChange('JARVIS')}
                      className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
                        voicePersona === 'JARVIS'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-orbitron text-xs font-bold">J.A.R.V.I.S.</span>
                      <span className="text-[10px] text-cyan-400 font-mono-code">Iron Man Core</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Hardware & Relays */}
            <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4 sm:p-5 space-y-4">
              <h3 className="font-orbitron font-semibold text-sm text-cyan-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Connected Devices & Hardware Mesh
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    name: 'Primary Mobile Device',
                    status: 'Connected (PWA Standalone)',
                    type: 'Mobile Smartphone',
                    icon: Smartphone,
                    active: true,
                  },
                  {
                    name: 'Stark AR Tactical Glasses',
                    status: 'Telemetry Synced (120 FPS)',
                    type: 'E.D.I.T.H. Optical Relay',
                    icon: Eye,
                    active: true,
                  },
                  {
                    name: 'Satellite 418 Orbital Constellation',
                    status: 'Geo-synchronous Orbit Locked',
                    type: 'Orbital Drone Array',
                    icon: Radio,
                    active: true,
                  },
                  {
                    name: 'Arc Reactor Power Core',
                    status: 'Nominal 100% Output',
                    type: 'Clean Energy Matrix',
                    icon: Cpu,
                    active: true,
                  },
                ].map((dev, idx) => {
                  const DevIcon = dev.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                          <DevIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">{dev.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono-code">{dev.type}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {dev.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Biometrics Tab */}
        {activeTab === 'biometrics' && (
          <motion.div
            key="tab-biometrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
                <div>
                  <h3 className="font-orbitron font-semibold text-base text-cyan-300 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    Silent Background Facial Recognition Engine
                  </h3>
                  <p className="text-xs text-slate-400 font-rajdhani mt-1">
                    Continuous optical facial and retinal biometric authentication runs completely in the background without on-screen popups or blocking viewfinders.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono-code flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ENGINE ONLINE
                  </span>
                </div>
              </div>

              {/* Status & Sensitivity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 space-y-2">
                  <p className="text-[11px] text-cyan-400 font-mono-code uppercase">Active Identity</p>
                  <p className="text-lg font-orbitron font-bold text-white">{recognizedUser?.name || 'Sai (Peter Parker)'}</p>
                  <p className="text-xs text-slate-400 font-rajdhani">Confidence Match: <span className="text-emerald-400 font-mono-code font-bold">{recognizedUser?.confidenceScore || 99.4}%</span></p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 space-y-2">
                  <p className="text-[11px] text-cyan-400 font-mono-code uppercase">Biometric Channels</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">468 Mesh Points</span>
                    <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">Stark Iris 0x8F</span>
                    <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">Voiceprint Sync</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-mono-code">
                    <span className="text-cyan-400 uppercase">Threshold</span>
                    <span className="text-cyan-300">{sensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="99"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Strict mode prevents spoofing attacks.</p>
                </div>
              </div>

              {/* Action Tester Tools */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                <h4 className="text-xs font-orbitron uppercase text-cyan-300 tracking-wider">
                  Biometric Recognition Testing Deck
                </h4>
                <p className="text-xs text-slate-300 font-rajdhani">
                  Test how the system seamlessly admits verified keyholders or locks out unauthorized faces:
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleTriggerFacialScan(false)}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-rajdhani font-semibold uppercase tracking-wider transition shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Run Silent Background Scan (Recognize Sai)</span>
                  </button>

                  <button
                    onClick={() => handleTriggerFacialScan(true)}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-900 text-xs font-rajdhani font-semibold uppercase tracking-wider transition shadow-sm"
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Simulate Unknown Intruder Face (Test Lock)</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Personnel Tab */}
        {activeTab === 'personnel' && (
          <motion.div
            key="tab-personnel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
              <div>
                <h3 className="font-orbitron font-semibold text-base text-cyan-300 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Stark Authorized Personnel Database
                </h3>
                <p className="text-xs text-slate-400 font-rajdhani mt-0.5">
                  Identities authorized for facial and voice biometric recognition.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-rajdhani font-semibold uppercase tracking-wider transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll New Subject</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profiles.map((prof) => (
                <div
                  key={prof.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-400/50 flex items-center justify-center font-orbitron font-bold text-cyan-300">
                      {prof.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-white">{prof.name}</p>
                        {prof.isMaster && (
                          <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            MASTER
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-rajdhani">{prof.role}</p>
                      <p className="text-[10px] text-cyan-400/80 font-mono-code">{prof.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {prof.clearanceLevel}
                    </span>
                    <p className="text-[10px] text-emerald-400 font-mono-code mt-1">
                      {prof.confidenceScore}% Match
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Security Audit Tab */}
        {activeTab === 'audit' && (
          <motion.div
            key="tab-audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
              <div>
                <h3 className="font-orbitron font-semibold text-base text-cyan-300 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Live Security Telemetry & Audit Logs
                </h3>
                <p className="text-xs text-slate-400 font-rajdhani mt-0.5">
                  Timestamped records of silent optical facial scans, voiceprints, and subsystem access.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-950 rounded-lg p-0.5 border border-cyan-500/20 text-xs font-rajdhani">
                  {(['ALL', 'SUCCESS', 'BREACH'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setLogFilter(filter)}
                      className={`px-2.5 py-1 rounded-md transition ${
                        logFilter === filter ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleExportLogs}
                  className="p-2 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50"
                  title="Export JSON Log"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border text-xs font-mono-code transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    log.status === 'BREACH'
                      ? 'bg-red-950/40 border-red-500/40 text-red-200'
                      : 'bg-slate-950/70 border-cyan-500/20 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'BREACH'
                            ? 'bg-red-500/30 text-red-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {log.eventType}
                      </span>
                      <span className="font-semibold text-white">{log.identity}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-cyan-400">{log.clearance}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{log.details}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    <p className="text-[10px] text-cyan-400 font-bold">{log.confidence}% Confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Subsystems & Permissions Tab */}
        {activeTab === 'subsystems' && (
          <motion.div
            key="tab-subsystems"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4 sm:p-6 space-y-4"
          >
            <div className="border-b border-cyan-500/20 pb-4">
              <h3 className="font-orbitron font-semibold text-base text-cyan-300 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Tactical Subsystem Permissions & Security Overrides
              </h3>
              <p className="text-xs text-slate-400 font-rajdhani mt-0.5">
                Enable or restrict sensitive Stark modules for active operators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  key: 'silentFacialRecognition',
                  title: 'Silent Background Biometric Scan',
                  desc: 'Zero-prompt facial & retinal recognition running on backend neural processor.',
                },
                {
                  key: 'orbitalDrones',
                  title: 'Orbital Drone Strike Authorization',
                  desc: 'Authorize kinetic drone maneuvers from Satellite 418.',
                },
                {
                  key: 'multiAiEngines',
                  title: 'Multi-AI Simultaneous Query Relay',
                  desc: 'Run simultaneous queries across Gemini, Claude, GPT-4o, and Perplexity.',
                },
                {
                  key: 'phoneRelays',
                  title: 'Phone Telemetry & System Commands',
                  desc: 'Allow vocal execution of SMS, calls, camera triggers, and smart home actions.',
                },
                {
                  key: 'reactorOverclock',
                  title: 'Arc Reactor Overclock (Up to 135%)',
                  desc: 'Permit tactical power diversion beyond standard 100% capacity.',
                },
                {
                  key: 'cleanSlateReady',
                  title: 'Clean Slate Self-Destruct Arming',
                  desc: 'Emergency security detonate for auxiliary armor inventory.',
                },
              ].map((item) => {
                const isEnabled = (permissions as any)[item.key];
                return (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400 font-rajdhani">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setPermissions((prev) => ({
                          ...prev,
                          [item.key]: !isEnabled,
                        }));
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enroll Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/50 p-6 space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.3)] glow-cyan"
          >
            <h3 className="font-orbitron font-bold text-lg text-white">Enroll New Biometric Subject</h3>
            <p className="text-xs text-slate-400 font-rajdhani">
              Add personnel authorized for automatic optical recognition by E.D.I.T.H.
            </p>

            <form onSubmit={handleEnrollPersonnel} className="space-y-3">
              <div>
                <label className="text-xs font-mono-code text-cyan-400 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captain James Rhodes"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-white font-rajdhani text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono-code text-cyan-400 uppercase">Email / Transponder ID</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rhodey@starkindustries.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-white font-mono-code text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono-code text-cyan-400 uppercase">Role</label>
                <input
                  type="text"
                  placeholder="e.g. War Machine Pilot / Tactical Recon"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-white font-rajdhani text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono-code text-cyan-400 uppercase">Clearance Level</label>
                <select
                  value={newClearance}
                  onChange={(e) => setNewClearance(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-300 font-rajdhani text-sm"
                >
                  <option value="Level 10 (Director)">Level 10 (Director)</option>
                  <option value="Level 9 (Avenger Prime)">Level 9 (Avenger Prime)</option>
                  <option value="Level 8 (Tactical)">Level 8 (Tactical)</option>
                  <option value="Level 7 (Asset Mgmt)">Level 7 (Asset Mgmt)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 font-rajdhani text-sm hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-cyan-600 text-white font-rajdhani font-semibold text-sm hover:bg-cyan-500 shadow-md"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
