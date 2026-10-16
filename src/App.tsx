import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Shield,
  Zap,
  Radar as RadarIcon,
  Sparkles,
  Cpu,
  Layers,
  Radio,
  Volume2,
  AlertCircle,
  Smartphone,
  Sliders,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HudHeader } from './components/HudHeader';
import { ArcReactor } from './components/ArcReactor';
import { CommandCenter, ChatMessage } from './components/CommandCenter';
import { ArmoryModule } from './components/ArmoryModule';
import { PowerMatrixModule } from './components/PowerMatrixModule';
import { TacticalRadarModule } from './components/TacticalRadarModule';
import { ProtocolMatrixModal } from './components/ProtocolMatrixModal';
import { HandsFreeStudio } from './components/HandsFreeStudio';
import { MultiAiSearchModule } from './components/MultiAiSearchModule';
import { PhoneAccessHub } from './components/PhoneAccessHub';
import { VoiceBiometricGate } from './components/VoiceBiometricGate';
import { AdminAccountSettings } from './components/AdminAccountSettings';
import { sound } from './utils/soundEffects';
import { speech } from './utils/speech';
import { silentBiometrics } from './utils/silentBiometrics';

export default function App() {
  const [userTitle, setUserTitle] = useState('Peter');
  const [voicePersona, setVoicePersona] = useState<'EDITH' | 'JARVIS'>('EDITH');
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [suitModel, setSuitModel] = useState('Mark LXXXV');
  const [powerLevel, setPowerLevel] = useState(100);
  const [currentProtocol, setCurrentProtocol] = useState('Standard Operations');
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'multiai' | 'phonehub' | 'handsfree' | 'command' | 'armory' | 'power' | 'radar' | 'admin'
  >('multiai');

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);

  // Initial welcome message from E.D.I.T.H.
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'jarvis',
      text: `Hello, Peter. I am E.D.I.T.H., Tony Stark's augmented-reality security, defense, and tactical intelligence system. Even Dead, I'm The Hero. Tony loved his acronyms. All satellite telemetry and tactical defense drones are online and synced to your glasses. How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Execute silent background facial & biometric recognition on startup without on-screen prompts
  useEffect(() => {
    silentBiometrics.performSilentScan().then((res) => {
      if (res.recognized && res.profile) {
        setIsBiometricLocked(false);
        const firstName = res.profile.name.includes('Peter') ? 'Peter' : res.profile.name.split(' ')[0];
        setUserTitle(firstName);
      }
    });
  }, []);

  // Sync vocal state from speech controller
  useEffect(() => {
    const unsubscribe = speech.subscribeSpeaking((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  // Update speech controller configuration
  useEffect(() => {
    speech.voiceEnabled = voiceEnabled;
    speech.voicePersona = voicePersona;
  }, [voiceEnabled, voicePersona]);

  useEffect(() => {
    sound.isMuted = !soundEnabled;
  }, [soundEnabled]);

  // Send message to assistant backend
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          userTitle,
          suit: suitModel,
          protocol: currentProtocol,
          powerLevel,
          voicePersona,
        }),
      });

      if (!res.ok) {
        throw new Error('Server response error');
      }

      const data = await res.json();
      const replyText = data.reply || `Understood, ${userTitle}. Telemetry updated.`;

      const jarvisMsg: ChatMessage = {
        id: `msg-${Date.now()}-j`,
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      setIsProcessing(false);

      // Speak answer out loud
      if (voiceEnabled) {
        speech.speakText(replyText);
      }
    } catch (err) {
      console.error('Error communicating with JARVIS server:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'jarvis',
        text: `My apologies, ${userTitle}. Optical telemetry channels encountered a brief fluctuation, but auxiliary computational heuristics remain nominal.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setIsProcessing(false);
      if (voiceEnabled) {
        speech.speakText(fallbackMsg.text);
      }
    }
  };

  const handleExecuteProtocol = (protocol: any) => {
    setCurrentProtocol(protocol.name);
    setIsProtocolModalOpen(false);

    const protocolMsg: ChatMessage = {
      id: `msg-${Date.now()}-prot`,
      sender: 'jarvis',
      text: `${protocol.name} confirmed, ${userTitle}. Telemetry and defense relays have adjusted to designation ${protocol.designation}. All autonomous subroutines are executing per your authorization.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, protocolMsg]);

    if (voiceEnabled) {
      speech.speakText(protocolMsg.text);
    }
  };

  const handlePowerBoost = () => {
    setPowerLevel((prev) => Math.min(135, prev + 10));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-rajdhani bg-tech-grid relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* HUD Header */}
      <HudHeader
        userTitle={userTitle}
        onUserTitleChange={(title) => {
          setUserTitle(title);
          const notify: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'jarvis',
            text: `Preferred honorific updated to "${title}". At your service.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, notify]);
        }}
        voicePersona={voicePersona}
        onVoicePersonaChange={(persona) => {
          setVoicePersona(persona);
          speech.voicePersona = persona;
          const notify: ChatMessage = {
            id: `msg-${Date.now()}-vp`,
            sender: 'jarvis',
            text:
              persona === 'EDITH'
                ? `E.D.I.T.H. voice protocol online. "Even Dead, I'm The Hero." All orbital defense drones and augmented-reality telemetry are synced.`
                : `J.A.R.V.I.S. voice protocol restored. Standing by, Sir.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, notify]);
          if (voiceEnabled) {
            speech.speakText(notify.text);
          }
        }}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenProtocols={() => setIsProtocolModalOpen(true)}
        onLockSystem={() => setIsBiometricLocked(true)}
        onOpenAdmin={() => {
          sound.playClick();
          setActiveTab('admin');
        }}
        suitModel={suitModel}
        isMobileSimulator={isMobileSimulator}
        onToggleMobileSimulator={() => {
          sound.playClick();
          setIsMobileSimulator(!isMobileSimulator);
        }}
      />

      {/* Mobile Device Simulator Banner */}
      {isMobileSimulator && (
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-b border-cyan-400 py-1.5 px-4 text-center flex items-center justify-between text-xs font-mono-code text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold">INTERACTIVE MOBILE PHONE PREVIEW SIMULATOR (390px Viewport)</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setIsMobileSimulator(false);
            }}
            className="px-2.5 py-0.5 rounded bg-cyan-900 hover:bg-cyan-800 text-white font-bold border border-cyan-400 text-[11px] transition"
          >
            EXIT PREVIEW
          </button>
        </div>
      )}

      {/* Main HUD Viewport */}
      <main
        className={`flex-1 w-full mx-auto p-2 sm:p-4 md:p-6 pb-20 md:pb-6 flex flex-col gap-4 transition-all duration-300 ${
          isMobileSimulator
            ? 'max-w-[420px] border-4 border-slate-700 rounded-[44px] my-4 shadow-[0_0_50px_rgba(0,240,255,0.4)] p-3 bg-[#020611] relative'
            : 'max-w-7xl'
        }`}
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-cyan-500/20">
          {[
            { id: 'multiai', label: '✨ Omni-AI Multi-Search', icon: Sparkles },
            { id: 'phonehub', label: '📱 Phone Hub', icon: Smartphone },
            { id: 'handsfree', label: '🎙️ Hands-Free Studio', icon: Smartphone },
            { id: 'admin', label: '⚙️ Account & Admin', icon: Sliders },
            { id: 'command', label: 'Tactical Command', icon: Terminal },
            { id: 'armory', label: 'Stark Armory', icon: Shield },
            { id: 'power', label: 'Power Matrix', icon: Zap },
            { id: 'radar', label: 'Tactical Radar', icon: RadarIcon },
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
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-t-lg font-orbitron font-semibold text-xs tracking-wider uppercase transition border-t border-x whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900/95 text-cyan-300 border-cyan-400/60 shadow-[0_-4px_12px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-950/40 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="ml-auto hidden lg:flex items-center gap-3 text-xs font-mono-code text-cyan-400/80 pr-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              STATUS: <strong className="text-white">{currentProtocol}</strong>
            </span>
          </div>
        </div>

        {/* Tab Content Display with Sci-Fi Holographic Motion Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex-1 min-h-[520px] sm:min-h-[580px] grid grid-cols-1 gap-4"
          >
            {activeTab === 'multiai' && (
              <MultiAiSearchModule userTitle={userTitle} voicePersona={voicePersona} />
            )}

            {activeTab === 'phonehub' && (
              <PhoneAccessHub userTitle={userTitle} voicePersona={voicePersona} />
            )}

            {activeTab === 'handsfree' && <HandsFreeStudio />}

            {activeTab === 'admin' && (
              <AdminAccountSettings
                userTitle={userTitle}
                onUserTitleChange={(t) => setUserTitle(t)}
                voicePersona={voicePersona}
                onVoicePersonaChange={(vp) => setVoicePersona(vp)}
                onTriggerLockdown={(locked) => setIsBiometricLocked(locked)}
                isSystemLocked={isBiometricLocked}
              />
            )}

            {activeTab === 'command' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                {/* Left Column: Arc Reactor Core Telemetry Centerpiece */}
                <div className="lg:col-span-5 bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between items-center backdrop-blur-md shadow-2xl relative overflow-hidden">
                  {/* Corner decorative HUD brackets */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

                  {/* Sub-header */}
                  <div className="w-full flex items-center justify-between text-xs font-mono-code border-b border-cyan-500/20 pb-2">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" /> STARK ARC REACTOR MK IV
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                      CONTAINMENT: 100%
                    </span>
                  </div>

                  {/* The Holographic Arc Reactor */}
                  <div className="my-auto py-2">
                    <ArcReactor
                      isSpeaking={isSpeaking}
                      isProcessing={isProcessing}
                      isListening={isListening}
                      powerLevel={powerLevel}
                      onPowerBoost={handlePowerBoost}
                    />
                  </div>

                  {/* Bottom Quick Status & Instructions */}
                  <div className="w-full pt-3 border-t border-cyan-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-mono-code text-cyan-300/80">
                      <span>ACTIVE DEFENSE SHELL:</span>
                      <span className="text-white font-bold">{suitModel}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-code text-center">
                      Click Arc Reactor to pulse electromagnetic flux or overclock plasma output.
                    </div>
                  </div>
                </div>

                {/* Right Column: Conversational CommandCenter & Terminal */}
                <div className="lg:col-span-7 h-full min-h-[480px]">
                  <CommandCenter
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isProcessing={isProcessing}
                    isSpeaking={isSpeaking}
                    userTitle={userTitle}
                    suitModel={suitModel}
                    onInitiateProtocol={(name) => {
                      handleSendMessage(`Initiate ${name}`);
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'armory' && (
              <ArmoryModule
                selectedSuit={suitModel}
                onSelectSuit={(suit) => {
                  setSuitModel(suit);
                  const suitAlert: ChatMessage = {
                    id: `msg-${Date.now()}`,
                    sender: 'jarvis',
                    text: `Platform switched to ${suit}, ${userTitle}. Telemetry linked and pre-flight diagnostics verified.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };
                  setMessages((prev) => [...prev, suitAlert]);
                }}
              />
            )}

            {activeTab === 'power' && (
              <PowerMatrixModule
                powerLevel={powerLevel}
                onPowerChange={(level) => setPowerLevel(level)}
                userTitle={userTitle}
              />
            )}

            {activeTab === 'radar' && <TacticalRadarModule />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Floating Bottom Dock (Optimized for One-Hand Mobile Thumb Access) */}
      <nav
        className={`${
          isMobileSimulator ? 'flex max-w-[390px] mx-auto' : 'md:hidden flex'
        } fixed bottom-2 inset-x-2 z-40 bg-slate-950/90 backdrop-blur-lg border border-cyan-500/40 rounded-2xl px-2 py-1.5 shadow-[0_0_20px_rgba(0,240,255,0.25)] items-center justify-around`}
      >
        {[
          { id: 'multiai', label: 'Omni-AI', icon: Sparkles },
          { id: 'phonehub', label: 'Phone', icon: Smartphone },
          { id: 'command', label: 'Command', icon: Terminal },
          { id: 'admin', label: 'Admin', icon: Sliders },
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
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                isActive
                  ? 'text-cyan-300 bg-cyan-500/20 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-mono-code mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => {
            sound.playScanBlip();
            setIsProtocolModalOpen(true);
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-amber-300 hover:text-amber-200"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono-code mt-0.5">Protocols</span>
        </button>
      </nav>

      {/* Protocol Override Matrix Modal */}
      <ProtocolMatrixModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        onExecuteProtocol={handleExecuteProtocol}
        userTitle={userTitle}
      />

      {/* Voice Biometric Security Gate (Shown only if lockdown is active or intruder simulated) */}
      <VoiceBiometricGate
        isLocked={isBiometricLocked}
        onUnlock={() => setIsBiometricLocked(false)}
        userTitle={userTitle}
        voicePersona={voicePersona}
      />
    </div>
  );
}
