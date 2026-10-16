import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Edit3,
  Plus,
  Trash2,
  Save,
  Volume2,
  VolumeX,
  MessageSquare,
  Phone,
  Home,
  Music,
  Calendar,
  ShoppingBag,
  Sliders,
  ChevronRight,
  Sparkles,
  Bot,
  User,
  Wand2,
  HelpCircle,
  Layers,
  ArrowRight,
  Glasses,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';

export interface ScenarioStep {
  userSpeech: string;
  agentThought: string;
  toolName: string;
  toolArgs: Record<string, any>;
  confirmationPrompt?: string;
  actionFeedback: string;
  notification: {
    app: string;
    icon: 'message' | 'phone' | 'home' | 'music' | 'calendar' | 'bag';
    title: string;
    body: string;
  };
}

export interface Scenario {
  id: string;
  title: string;
  category: 'Spider-Man Tactical' | 'Communication' | 'Smart Home' | 'Media' | 'Productivity' | 'Food & Tasks';
  description: string;
  iconName: 'message' | 'phone' | 'home' | 'music' | 'calendar' | 'bag';
  isCustom?: boolean;
  step: ScenarioStep;
}

const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: 'sc-edith-target',
    title: 'E.D.I.T.H. Tactical Drone Lock',
    category: 'Spider-Man Tactical',
    description: "Even Dead, I'm The Hero — Target reconnaissance and orbital drone lock from Tony Stark's sunglasses.",
    iconName: 'phone',
    step: {
      userSpeech: "E.D.I.T.H., scan the target and lock orbital surveillance drones.",
      agentThought: "Tactical defense protocol verified. Identity: E.D.I.T.H. (Even Dead, I'm The Hero). Synchronizing with Stark Satellite 418 orbital combat drones. Iris tracking calibrated on augmented reality display.",
      toolName: 'deploy_orbital_drones',
      toolArgs: { satellite: 'StarkSat-418', target: 'Designated Threat', authorization: 'Peter Parker' },
      confirmationPrompt: "Target acquired and tagged on your augmented-reality lenses. Ready to deploy orbital drones, Peter?",
      actionFeedback: "Orbital drone platform 418 deployed. Non-lethal EMP tracking beam locked.",
      notification: {
        app: 'E.D.I.T.H.',
        icon: 'phone',
        title: 'Target Acquired',
        body: 'StarkSat-418 • Tracking active on AR sunglasses',
      },
    },
  },
  {
    id: 'sc-1',
    title: 'Text Happy Hogan',
    category: 'Communication',
    description: 'Dictate and send an SMS update while driving or in the lab.',
    iconName: 'message',
    step: {
      userSpeech: "Hey Jarvis, text Happy I'm stuck in the lab and will be 20 minutes late.",
      agentThought: "Identified intent: send SMS message to contact 'Happy Hogan'. Extracted message: 'Stuck in the lab, running 20 mins late'. Confirmation required before sending external communication.",
      toolName: 'send_sms',
      toolArgs: { recipient: 'Happy Hogan', text: 'Stuck in the lab, running 20 mins late.' },
      confirmationPrompt: "Should I send this to Happy Hogan: 'Stuck in the lab, running 20 mins late'?",
      actionFeedback: "SMS dispatched to Happy Hogan. Delivery transponder confirmed.",
      notification: {
        app: 'Messages',
        icon: 'message',
        title: 'SMS Sent',
        body: 'To Happy Hogan: "Stuck in the lab, running 20 mins late."',
      },
    },
  },
  {
    id: 'sc-2',
    title: 'Call Pepper Potts',
    category: 'Communication',
    description: 'Hands-free voice dial with speakerphone confirmation.',
    iconName: 'phone',
    step: {
      userSpeech: "Jarvis, call Pepper on speaker.",
      agentThought: "Identified intent: place outgoing telephone call to Pepper Potts. Audio output set to speakerphone. Verifying dial request.",
      toolName: 'place_call',
      toolArgs: { contact: 'Pepper Potts', audioRoute: 'speakerphone' },
      confirmationPrompt: "Ready to call Pepper Potts on speakerphone. Shall I dial now?",
      actionFeedback: "Connecting call to Pepper Potts on speakerphone...",
      notification: {
        app: 'Phone',
        icon: 'phone',
        title: 'Outgoing Call',
        body: 'Pepper Potts • 00:03 (Speaker)',
      },
    },
  },
  {
    id: 'sc-3',
    title: 'Workshop Thermostat',
    category: 'Smart Home',
    description: 'Control room temperature with safety thresholds.',
    iconName: 'home',
    step: {
      userSpeech: "It's getting warm in here, drop the workshop to 68 degrees.",
      agentThought: "Smart Home HVAC request. Target zone: 'Workshop'. Target temperature: 68°F. Mode: Cooling. Confirmation requested for climate adjustment.",
      toolName: 'set_climate',
      toolArgs: { zone: 'Workshop', temperature: 68, mode: 'cooling' },
      confirmationPrompt: "Setting workshop climate control to 68° Fahrenheit. Confirm adjustment?",
      actionFeedback: "Workshop HVAC set to 68°F. Cool air circulating.",
      notification: {
        app: 'Stark Home',
        icon: 'home',
        title: 'Climate Updated',
        body: 'Workshop set to 68°F (Cooling Active)',
      },
    },
  },
  {
    id: 'sc-4',
    title: 'Play Garage Rock Playlist',
    category: 'Media',
    description: 'Stream music to high-output workshop speakers.',
    iconName: 'music',
    step: {
      userSpeech: "Jarvis, blast AC/DC in the garage.",
      agentThought: "Audio streaming query. Artist: 'AC/DC'. Speaker group: 'Garage Soundstage'. Volume set to 85%.",
      toolName: 'play_media',
      toolArgs: { artist: 'AC/DC', track: 'Back in Black', zone: 'Garage', volume: 85 },
      confirmationPrompt: "Queueing AC/DC 'Back in Black' in the garage at 85% volume. Blast it?",
      actionFeedback: "Now playing: AC/DC - Back in Black at high volume.",
      notification: {
        app: 'Spotify',
        icon: 'music',
        title: 'Now Playing',
        body: 'AC/DC • Back in Black (Garage 85%)',
      },
    },
  },
  {
    id: 'sc-5',
    title: 'Flight Test Calendar Event',
    category: 'Productivity',
    description: 'Schedule flight trials directly to your calendar.',
    iconName: 'calendar',
    step: {
      userSpeech: "Schedule a high-altitude flight trial for tomorrow at 4 PM.",
      agentThought: "Calendar scheduling request. Event: 'Mark 85 High-Altitude Flight Trial'. Time: Tomorrow at 16:00. Duration: 1 hour.",
      toolName: 'create_event',
      toolArgs: { title: 'Mark 85 Flight Trial', time: 'Tomorrow, 4:00 PM', duration: '60m' },
      confirmationPrompt: "Add 'Mark 85 Flight Trial' tomorrow at 4:00 PM to your calendar?",
      actionFeedback: "Event booked on your calendar for tomorrow at 4:00 PM.",
      notification: {
        app: 'Calendar',
        icon: 'calendar',
        title: 'Event Scheduled',
        body: 'Mark 85 Flight Trial • Tomorrow at 4:00 PM',
      },
    },
  },
  {
    id: 'sc-6',
    title: 'Order Shawarma Delivery',
    category: 'Food & Tasks',
    description: 'Confirm and place a delivery order to your location.',
    iconName: 'bag',
    step: {
      userSpeech: "Order the grand chicken shawarma platter from the place on 39th.",
      agentThought: "Food ordering intent. Vendor: Shawarma Palace (39th St). Item: Grand Chicken Platter. Total: $28.50. Financial authorization required.",
      toolName: 'order_food',
      toolArgs: { restaurant: 'Shawarma Palace', item: 'Grand Chicken Shawarma', total: '$28.50' },
      confirmationPrompt: "Place order for Grand Shawarma Platter from 39th St ($28.50 to Stark Card)?",
      actionFeedback: "Order placed! Delivery driver en route. Estimated arrival in 22 minutes.",
      notification: {
        app: 'Delivery',
        icon: 'bag',
        title: 'Order Placed',
        body: 'Shawarma Palace • Arriving in ~22 mins',
      },
    },
  },
];

type SimulationState = 'idle' | 'listening' | 'thinking' | 'confirming' | 'executing' | 'completed';

export const HandsFreeStudio: React.FC = () => {
  // Scenarios state loaded from localStorage or default
  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    try {
      const saved = localStorage.getItem('jarvis_custom_scenarios');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_SCENARIOS;
  });

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DEFAULT_SCENARIOS[0].id);
  const [simState, setSimState] = useState<SimulationState>('idle');
  const [userConfirmed, setUserConfirmed] = useState<boolean | null>(null);

  // Editor modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  // Save custom scenarios to localStorage
  const saveScenarios = (updated: Scenario[]) => {
    setScenarios(updated);
    try {
      localStorage.setItem('jarvis_custom_scenarios', JSON.stringify(updated));
    } catch {}
  };

  // Run scenario simulation
  const timerRef = useRef<any>(null);

  const clearSimTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startScenario = (scenario: Scenario = activeScenario) => {
    clearSimTimer();
    setUserConfirmed(null);
    setSimState('listening');
    sound.playClick();

    // 1. User speaks
    timerRef.current = setTimeout(() => {
      sound.playScanBlip();
      setSimState('thinking');

      // 2. Jarvis analyzes
      timerRef.current = setTimeout(() => {
        sound.playClick();
        if (scenario.step.confirmationPrompt) {
          setSimState('confirming');
          speech.speakText(scenario.step.confirmationPrompt);
        } else {
          executeAction(scenario);
        }
      }, 2000);
    }, 1800);
  };

  const handleUserConfirm = (confirmed: boolean) => {
    sound.playClick();
    setUserConfirmed(confirmed);
    if (confirmed) {
      executeAction(activeScenario);
    } else {
      setSimState('completed');
      speech.speakText("Understood. Action cancelled.");
    }
  };

  const executeAction = (scenario: Scenario) => {
    setSimState('executing');
    sound.playReactorCharge();

    timerRef.current = setTimeout(() => {
      setSimState('completed');
      speech.speakText(scenario.step.actionFeedback);
    }, 1600);
  };

  const resetSimulation = () => {
    clearSimTimer();
    setSimState('idle');
    setUserConfirmed(null);
    speech.stopSpeaking();
    sound.playClick();
  };

  // Scenario Editor Handlers
  const openEditorForScenario = (sc: Scenario) => {
    sound.playClick();
    setEditingScenario(JSON.parse(JSON.stringify(sc)));
    setIsEditing(true);
  };

  const openNewScenarioCreator = () => {
    sound.playClick();
    const newSc: Scenario = {
      id: `sc-custom-${Date.now()}`,
      title: 'New Custom Scenario',
      category: 'Communication',
      description: 'Custom trigger, reasoning and action created by you.',
      iconName: 'message',
      isCustom: true,
      step: {
        userSpeech: 'Jarvis, send report to the team.',
        agentThought: 'Identified custom intent: broadcast team report. Extracted parameters and verifying confirmation.',
        toolName: 'send_report',
        toolArgs: { target: 'Engineering Team', urgency: 'High' },
        confirmationPrompt: 'Ready to send team report to engineering. Shall I proceed?',
        actionFeedback: 'Team report transmitted successfully.',
        notification: {
          app: 'Stark Work',
          icon: 'message',
          title: 'Report Transmitted',
          body: 'Engineering Team • High Urgency',
        },
      },
    };
    setEditingScenario(newSc);
    setIsEditing(true);
  };

  const handleSaveEditedScenario = () => {
    if (!editingScenario) return;
    sound.playReactorCharge();

    const exists = scenarios.some((s) => s.id === editingScenario.id);
    let updated: Scenario[];
    if (exists) {
      updated = scenarios.map((s) => (s.id === editingScenario.id ? editingScenario : s));
    } else {
      updated = [editingScenario, ...scenarios];
    }

    saveScenarios(updated);
    setSelectedScenarioId(editingScenario.id);
    setIsEditing(false);
    setEditingScenario(null);

    // Prompt user with instant preview
    setTimeout(() => {
      startScenario(editingScenario);
    }, 400);
  };

  const handleDeleteScenario = (id: string) => {
    sound.playClick();
    const updated = scenarios.filter((s) => s.id !== id);
    if (updated.length === 0) return;
    saveScenarios(updated);
    setSelectedScenarioId(updated[0].id);
    if (editingScenario?.id === id) {
      setIsEditing(false);
      setEditingScenario(null);
    }
  };

  const handleResetToDefaults = () => {
    sound.playScanBlip();
    saveScenarios(DEFAULT_SCENARIOS);
    setSelectedScenarioId(DEFAULT_SCENARIOS[0].id);
    resetSimulation();
  };

  const renderIcon = (type: string, className = 'w-4 h-4') => {
    switch (type) {
      case 'phone':
        return <Phone className={className} />;
      case 'home':
        return <Home className={className} />;
      case 'music':
        return <Music className={className} />;
      case 'calendar':
        return <Calendar className={className} />;
      case 'bag':
        return <ShoppingBag className={className} />;
      default:
        return <MessageSquare className={className} />;
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Banner explaining the experience */}
      <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h2 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide">
              JARVIS HANDS-FREE MOBILE SIMULATOR & SCENARIO STUDIO
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-rajdhani mt-1 max-w-2xl leading-relaxed">
            Experience how the hands-free Android/Flutter application operates in real-time. Pick an existing
            scenario on the right or customize them with your own voice commands, agent reasoning, confirmation
            checks, and device actions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              sound.playScanBlip();
              speech.voicePersona = 'EDITH';
              speech.speakText(
                "Hello, Peter. I am E.D.I.T.H., Tony Stark's augmented-reality security, defense, and tactical intelligence system. Even Dead, I'm The Hero."
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-400 text-sky-200 font-mono-code text-xs transition shadow-[0_0_12px_rgba(56,189,248,0.3)]"
            title="Hear E.D.I.T.H.'s voice from Spider-Man Far From Home"
          >
            <Glasses className="w-3.5 h-3.5 text-sky-400" />
            <span>Test E.D.I.T.H. Voice</span>
          </button>

          <button
            onClick={openNewScenarioCreator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider transition glow-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Scenario</span>
          </button>

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono-code text-xs transition"
            title="Reset to default examples"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Defaults</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Mobile Phone Frame Simulator, Right = Scenario Picker & Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Phone Simulator Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Mobile Chassis Frame */}
          <div className="w-[330px] sm:w-[350px] bg-slate-950 border-4 border-slate-700/80 rounded-[44px] shadow-[0_0_40px_rgba(0,240,255,0.15)] p-3 relative overflow-hidden ring-1 ring-cyan-500/30">
            {/* Inner Phone Screen */}
            <div className="bg-slate-900 rounded-[34px] h-[610px] overflow-hidden flex flex-col justify-between border border-cyan-500/20 relative scanlines text-slate-100">
              {/* Phone Status Bar (Exact replica of user's screen) */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between text-xs font-mono-code text-slate-400 select-none border-b border-slate-800/60">
                <span className="font-semibold text-slate-200">9:00</span>
                <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-cyan-400 font-bold">5G</span>
                  <span>▮▮▮</span>
                </div>
              </div>

              {/* Phone App Header */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                <div>
                  <h1 className="font-orbitron font-bold text-xl text-white tracking-wide glow-text-cyan flex items-center gap-1.5">
                    <span># E.D.I.T.H.</span>
                  </h1>
                  <span className="text-[11px] font-mono-code text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 inline-block mt-0.5">
                    Hands-free • Far From Home
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      simState === 'idle'
                        ? 'bg-slate-500'
                        : simState === 'listening'
                        ? 'bg-amber-400 animate-ping'
                        : simState === 'confirming'
                        ? 'bg-purple-400 animate-pulse'
                        : 'bg-cyan-400 animate-pulse'
                    }`}
                  />
                  <span className="text-[11px] font-mono-code uppercase text-slate-300">
                    {simState === 'idle'
                      ? 'Idle'
                      : simState === 'listening'
                      ? 'Listening'
                      : simState === 'thinking'
                      ? 'Deciding'
                      : simState === 'confirming'
                      ? 'Confirming'
                      : simState === 'executing'
                      ? 'Acting'
                      : 'Done'}
                  </span>
                </div>
              </div>

              {/* Slide-down Notification Banner (when action executed) */}
              {simState === 'completed' && userConfirmed !== false && (
                <div className="mx-4 my-2 p-2.5 rounded-xl bg-slate-950/90 border border-cyan-400/60 shadow-[0_4px_20px_rgba(0,240,255,0.3)] animate-bounce duration-500 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-slate-950">
                    {renderIcon(activeScenario.step.notification.icon, 'w-4 h-4')}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-code text-cyan-400 font-bold uppercase">
                        {activeScenario.step.notification.app}
                      </span>
                      <span className="text-[9px] text-slate-400">now</span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {activeScenario.step.notification.title}
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">
                      {activeScenario.step.notification.body}
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content Area of the Phone Screen */}
              <div className="flex-1 px-4 py-2 overflow-y-auto space-y-3 flex flex-col justify-center">
                {/* Visualizer Wave when listening/active */}
                <div className="flex items-center justify-center py-2">
                  <div className="relative w-28 h-28 rounded-full border-2 border-cyan-500/40 flex items-center justify-center bg-cyan-950/20">
                    <div
                      className={`w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center transition-all ${
                        simState === 'listening'
                          ? 'scale-125 border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                          : simState === 'confirming'
                          ? 'scale-110 border border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                          : simState === 'thinking' || simState === 'executing'
                          ? 'scale-115 border border-cyan-400 animate-spin-slow shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                          : 'scale-100 border border-cyan-500/30'
                      }`}
                    >
                      <Bot
                        className={`w-10 h-10 ${
                          simState === 'listening'
                            ? 'text-amber-400'
                            : simState === 'confirming'
                            ? 'text-purple-400'
                            : 'text-cyan-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* State Transcript & Cards */}
                {simState === 'idle' && (
                  <div className="text-center p-3 rounded-xl bg-slate-950/60 border border-cyan-900/40">
                    <p className="text-xs text-slate-300 font-rajdhani">
                      Tap <strong className="text-cyan-300">"Watch Walkthrough"</strong> or select any scenario
                      on the right to watch the agent speak, decide, ask for confirmation, and act.
                    </p>
                  </div>
                )}

                {/* Step 1: User Speaking */}
                {(simState === 'listening' ||
                  simState === 'thinking' ||
                  simState === 'confirming' ||
                  simState === 'executing' ||
                  simState === 'completed') && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-amber-400">
                      <User className="w-3 h-3" />
                      <span>YOU SAID:</span>
                    </div>
                    <p className="text-xs text-white font-rajdhani leading-snug font-medium">
                      "{activeScenario.step.userSpeech}"
                    </p>
                  </div>
                )}

                {/* Step 2: Agent Reasoning */}
                {(simState === 'thinking' ||
                  simState === 'confirming' ||
                  simState === 'executing' ||
                  simState === 'completed') && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-cyan-400">
                      <span className="flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        <span>AGENT DECISION & TOOL:</span>
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {activeScenario.step.toolName}()
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-200 font-rajdhani leading-tight">
                      {activeScenario.step.agentThought}
                    </p>
                  </div>
                )}

                {/* Step 3: Confirmation Dialog (Interactive!) */}
                {simState === 'confirming' && (
                  <div className="p-3.5 rounded-xl bg-purple-950/70 border border-purple-500/60 space-y-2.5 animate-pulse-glow shadow-lg">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-purple-300 font-bold uppercase">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Phone asks for confirmation:</span>
                    </div>
                    <p className="text-xs text-white font-rajdhani leading-snug font-semibold">
                      "{activeScenario.step.confirmationPrompt}"
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleUserConfirm(true)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-orbitron transition flex items-center justify-center gap-1 shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm</span>
                      </button>
                      <button
                        onClick={() => handleUserConfirm(false)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-bold text-xs font-orbitron transition flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Execution Result */}
                {(simState === 'executing' || simState === 'completed') && (
                  <div
                    className={`p-3 rounded-xl border space-y-1 ${
                      userConfirmed === false
                        ? 'bg-red-950/40 border-red-500/40 text-red-200'
                        : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-code uppercase font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{userConfirmed === false ? 'Action Cancelled' : 'Device Action Executed:'}</span>
                    </div>
                    <p className="text-xs font-rajdhani leading-snug">
                      {userConfirmed === false
                        ? 'Action was aborted per user instructions.'
                        : activeScenario.step.actionFeedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Phone Action Bar */}
              <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startScenario(activeScenario)}
                    disabled={simState !== 'idle' && simState !== 'completed'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider transition disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch Walkthrough</span>
                  </button>

                  <button
                    onClick={resetSimulation}
                    className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Reset Simulation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Scenario Picker, Walkthrough Explanation, & "Make Changes for Me" */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section: What talking to it feels like (Exact match to prompt text) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
            <h3 className="font-orbitron font-bold text-sm text-cyan-200 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              What talking to it feels like
            </h3>
            <p className="text-xs text-slate-300 font-rajdhani mt-1.5 leading-relaxed">
              A scripted walkthrough of the Android app. Each scenario plays the exact flow the code runs:
              <strong> you speak, the agent decides, the phone asks you to confirm, then acts.</strong>
            </p>
            <div className="mt-2.5 p-2.5 rounded bg-cyan-950/30 border border-cyan-900/40 text-[11px] font-mono-code text-cyan-300/90">
              💡 <em>This simulation runs directly here in your browser with real vocal synthesis and sound effects. You can also edit and create custom scenarios below!</em>
            </div>
          </div>

          {/* Scenario Picker List: "Tap a scenario" */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs font-mono-code uppercase text-cyan-400 tracking-wider">
                <strong>Tap a scenario:</strong> Pick one to watch or edit
              </div>
              <span className="text-[10px] font-mono-code text-slate-400">
                {scenarios.length} scenarios ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenarios.map((sc) => {
                const isSelected = sc.id === activeScenario.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedScenarioId(sc.id);
                      resetSimulation();
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-slate-950/60 border-cyan-900/40 hover:border-cyan-600 hover:bg-slate-900/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'bg-cyan-950 text-cyan-400 border border-cyan-800/40'
                            }`}
                          >
                            {renderIcon(sc.iconName, 'w-3.5 h-3.5')}
                          </div>
                          <span className="font-orbitron font-semibold text-xs text-white">
                            {sc.title}
                          </span>
                        </div>
                        {sc.isCustom && (
                          <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/50">
                            CUSTOM
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300 font-rajdhani mt-2 line-clamp-2">
                        {sc.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono-code text-cyan-400/70">
                        TOOL: {sc.step.toolName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditorForScenario(sc);
                          }}
                          className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-900/50 transition text-[11px] font-mono-code flex items-center gap-1"
                          title="Edit Scenario"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScenarioId(sc.id);
                            startScenario(sc);
                          }}
                          className="p-1 rounded text-emerald-400 hover:text-white hover:bg-emerald-950/60 transition text-[11px] font-mono-code flex items-center gap-1"
                          title="Play Scenario"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Run</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Edit Card for the selected scenario ("Make changes of it for me") */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
                  Make Changes to "{activeScenario.title}"
                </h4>
              </div>
              <button
                onClick={() => openEditorForScenario(activeScenario)}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded transition"
              >
                Open Full Studio Editor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code">
              <div className="p-2.5 rounded bg-slate-900/70 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 block mb-1">USER VOICE INPUT:</span>
                <span className="text-white font-rajdhani text-sm">"{activeScenario.step.userSpeech}"</span>
              </div>

              <div className="p-2.5 rounded bg-slate-900/70 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 block mb-1">CONFIRMATION QUESTION:</span>
                <span className="text-amber-300 font-rajdhani text-sm">
                  "{activeScenario.step.confirmationPrompt || 'None (Instant Execution)'}"
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-slate-400 font-mono-code">
                Tool invoked: <strong className="text-cyan-300">{activeScenario.step.toolName}()</strong>
              </span>
              <button
                onClick={() => startScenario(activeScenario)}
                className="text-cyan-400 hover:text-white underline font-mono-code flex items-center gap-1"
              >
                <span>Test run this scenario in phone</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Full Scenario Editor ("Make changes of it for me") */}
      {isEditing && editingScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-sm text-white">
                  {editingScenario.isCustom ? 'CREATE CUSTOM SCENARIO' : 'EDIT SCENARIO & FLOW'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono-code">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Scenario Title</label>
                  <input
                    type="text"
                    value={editingScenario.title}
                    onChange={(e) =>
                      setEditingScenario({ ...editingScenario, title: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded px-3 py-2 text-white font-rajdhani text-sm focus:border-cyan-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase block mb-1">Category</label>
                  <select
                    value={editingScenario.category}
                    onChange={(e) =>
                      setEditingScenario({ ...editingScenario, category: e.target.value as any })
                    }
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded px-3 py-2 text-white font-rajdhani text-sm focus:border-cyan-300 focus:outline-none"
                  >
                    <option value="Communication">Communication</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Media">Media</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Food & Tasks">Food & Tasks</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1">Description</label>
                <input
                  type="text"
                  value={editingScenario.description}
                  onChange={(e) =>
                    setEditingScenario({ ...editingScenario, description: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded px-3 py-2 text-white font-rajdhani text-sm focus:border-cyan-300 focus:outline-none"
                />
              </div>

              {/* Step 1: User Voice Phrase */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 space-y-1">
                <label className="text-[10px] text-amber-400 uppercase block font-bold">
                  Step 1: What You Speak to Jarvis (Voice Input)
                </label>
                <input
                  type="text"
                  value={editingScenario.step.userSpeech}
                  onChange={(e) =>
                    setEditingScenario({
                      ...editingScenario,
                      step: { ...editingScenario.step, userSpeech: e.target.value },
                    })
                  }
                  placeholder="e.g., Jarvis, call Pepper on speaker."
                  className="w-full bg-slate-950 border border-amber-500/40 rounded px-3 py-2 text-amber-200 font-rajdhani text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Step 2: Agent Decision & Thought */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 space-y-2">
                <label className="text-[10px] text-cyan-400 uppercase block font-bold">
                  Step 2: Jarvis Reasoning & Tool Selected
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-0.5">Tool Invocation Name:</span>
                    <input
                      type="text"
                      value={editingScenario.step.toolName}
                      onChange={(e) =>
                        setEditingScenario({
                          ...editingScenario,
                          step: { ...editingScenario.step, toolName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-cyan-500/40 rounded px-3 py-1.5 text-cyan-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-0.5">Notification App Name:</span>
                    <input
                      type="text"
                      value={editingScenario.step.notification.app}
                      onChange={(e) =>
                        setEditingScenario({
                          ...editingScenario,
                          step: {
                            ...editingScenario.step,
                            notification: { ...editingScenario.step.notification, app: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-cyan-500/40 rounded px-3 py-1.5 text-cyan-200 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">Agent Internal Thought Process:</span>
                  <textarea
                    rows={2}
                    value={editingScenario.step.agentThought}
                    onChange={(e) =>
                      setEditingScenario({
                        ...editingScenario,
                        step: { ...editingScenario.step, agentThought: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-cyan-500/40 rounded px-3 py-1.5 text-slate-200 font-rajdhani text-sm"
                  />
                </div>
              </div>

              {/* Step 3: Phone Confirmation Question */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 space-y-1">
                <label className="text-[10px] text-purple-400 uppercase block font-bold">
                  Step 3: Confirmation Prompt (Phone asks for user confirmation)
                </label>
                <input
                  type="text"
                  value={editingScenario.step.confirmationPrompt || ''}
                  onChange={(e) =>
                    setEditingScenario({
                      ...editingScenario,
                      step: { ...editingScenario.step, confirmationPrompt: e.target.value },
                    })
                  }
                  placeholder="e.g. Ready to dial Pepper Potts. Shall I call now?"
                  className="w-full bg-slate-950 border border-purple-500/40 rounded px-3 py-2 text-purple-200 font-rajdhani text-sm focus:border-purple-400 focus:outline-none"
                />
                <span className="text-[9px] text-slate-500 block">
                  Leave empty if action executes immediately without confirmation.
                </span>
              </div>

              {/* Step 4: Action Feedback / Notification Body */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 space-y-2">
                <label className="text-[10px] text-emerald-400 uppercase block font-bold">
                  Step 4: Device Execution & Toast Message
                </label>
                <input
                  type="text"
                  value={editingScenario.step.actionFeedback}
                  onChange={(e) =>
                    setEditingScenario({
                      ...editingScenario,
                      step: { ...editingScenario.step, actionFeedback: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded px-3 py-2 text-emerald-200 font-rajdhani text-sm focus:border-emerald-400 focus:outline-none"
                />

                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">Notification Banner Preview Text:</span>
                  <input
                    type="text"
                    value={editingScenario.step.notification.body}
                    onChange={(e) =>
                      setEditingScenario({
                        ...editingScenario,
                        step: {
                          ...editingScenario.step,
                          notification: { ...editingScenario.step.notification, body: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-300 font-rajdhani text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-950 border-t border-cyan-500/30 flex items-center justify-between">
              {editingScenario.isCustom ? (
                <button
                  onClick={() => handleDeleteScenario(editingScenario.id)}
                  className="px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-mono-code flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-xs font-mono-code"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedScenario}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider transition glow-cyan"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Test Run</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
