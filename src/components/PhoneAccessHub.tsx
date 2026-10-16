import React, { useState } from 'react';
import {
  Smartphone,
  Flashlight,
  Wifi,
  WifiOff,
  Bluetooth,
  Moon,
  Battery,
  Sun,
  Volume2,
  MessageSquare,
  Phone,
  Camera,
  Image as ImageIcon,
  Folder,
  Calendar,
  Compass,
  Mic,
  MicOff,
  CheckCircle2,
  Sliders,
  Send,
  UserCheck,
  Search,
  Eye,
  Crosshair,
  Shield,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatar: string;
}

const CONTACTS: Contact[] = [
  { id: '1', name: 'Pepper Potts', phone: '+1 (310) 555-0101', relation: 'Stark Industries CEO', avatar: 'P' },
  { id: '2', name: 'Happy Hogan', phone: '+1 (310) 555-0199', relation: 'Head of Asset Management', avatar: 'H' },
  { id: '3', name: 'Ned Leeds', phone: '+1 (212) 555-0142', relation: 'Guy in the Chair', avatar: 'N' },
  { id: '4', name: 'Aunt May', phone: '+1 (212) 555-0188', relation: 'Family', avatar: 'M' },
  { id: '5', name: 'Nick Fury', phone: '+1 (202) 555-0177', relation: 'Director', avatar: 'F' },
];

const PHOTOS = [
  { id: 'p1', title: 'Mark LXXXV Schematic', tag: 'blueprints', date: 'Oct 14', color: 'from-amber-600 to-red-800' },
  { id: 'p2', title: 'Venice Bridge Canal', tag: 'vacation', date: 'Oct 12', color: 'from-blue-600 to-cyan-800' },
  { id: 'p3', title: 'Stark AR Sunglasses', tag: 'edith', date: 'Oct 15', color: 'from-sky-500 to-slate-900' },
  { id: 'p4', title: 'Orbital Drone Platform 418', tag: 'drone', date: 'Oct 16', color: 'from-cyan-700 to-slate-950' },
  { id: 'p5', title: 'Hulkbuster Veronica Armory', tag: 'blueprints', date: 'Oct 10', color: 'from-red-700 to-amber-900' },
];

const MESSAGES = [
  { id: 'm1', sender: 'Happy Hogan', text: 'Where are you? The jet is waiting on the tarmac.', time: '10:42 AM' },
  { id: 'm2', sender: 'Ned Leeds', text: 'Dude! Did you see the news about the drone sightings?!', time: '9:15 AM' },
  { id: 'm3', sender: 'Pepper Potts', text: 'Tony left the security overrides in the glasses. Be careful.', time: 'Yesterday' },
];

interface PhoneAccessHubProps {
  userTitle: string;
  voicePersona: 'EDITH' | 'JARVIS';
}

export const PhoneAccessHub: React.FC<PhoneAccessHubProps> = ({ userTitle, voicePersona }) => {
  // Device Settings States
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(80);

  // Active Subsystem App
  const [activeApp, setActiveApp] = useState<
    'controls' | 'messages' | 'phone' | 'camera' | 'photos' | 'files'
  >('controls');

  // Interactive Voice Command State
  const [voiceQuery, setVoiceQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastActionResult, setLastActionResult] = useState<string | null>(null);

  // New message input
  const [newMsgText, setNewMsgText] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact>(CONTACTS[0]);
  const [photoSearchFilter, setPhotoSearchFilter] = useState('');

  // Process Voice Commands to control the phone
  const processPhoneVoiceCommand = (cmdText: string) => {
    const lower = cmdText.toLowerCase();
    sound.playClick();

    if (lower.includes('flashlight on') || lower.includes('turn on flashlight') || lower.includes('light on')) {
      setFlashlightOn(true);
      const msg = `Flashlight activated at maximum lumens, ${userTitle}.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('flashlight off') || lower.includes('turn off flashlight') || lower.includes('light off')) {
      setFlashlightOn(false);
      const msg = `Flashlight deactivated, ${userTitle}.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('wifi') || lower.includes('wi-fi')) {
      const next = !wifiOn;
      setWifiOn(next);
      const msg = `Wi-Fi ${next ? 'connected to StarkNet 5G' : 'disabled'}, ${userTitle}.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('bluetooth')) {
      const next = !bluetoothOn;
      setBluetoothOn(next);
      const msg = `Bluetooth ${next ? 'synced with Stark AR sunglasses' : 'disabled'}, ${userTitle}.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('camera') || lower.includes('scan') || lower.includes('optical')) {
      setActiveApp('camera');
      const msg = `Augmented reality camera feed online. Object recognition active.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('message') || lower.includes('text') || lower.includes('sms')) {
      setActiveApp('messages');
      const msg = `Opening messaging subsystem. 3 unread communications.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('call') || lower.includes('contact') || lower.includes('phone')) {
      setActiveApp('phone');
      const msg = `Phone contacts subsystem open. Standing by to dial.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('photo') || lower.includes('gallery') || lower.includes('picture')) {
      setActiveApp('photos');
      const msg = `Photo gallery decrypted. Displaying Stark media archives.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }
    if (lower.includes('volume')) {
      setVolume(90);
      const msg = `Master volume raised to 90%, ${userTitle}.`;
      setLastActionResult(msg);
      speech.speakText(msg);
      return;
    }

    // Default assistant response
    const msg = `Phone command processed: "${cmdText}". All subsystem permissions verified, ${userTitle}.`;
    setLastActionResult(msg);
    speech.speakText(msg);
  };

  const handleMicToggle = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
      sound.playClick();
    } else {
      sound.playScanBlip();
      speech.startListening({
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setVoiceQuery(transcript);
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            processPhoneVoiceCommand(transcript.trim());
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl relative">
      {/* Flashlight Screen Glow Beam if flashlight is ON */}
      {flashlightOn && (
        <div className="fixed inset-0 z-40 bg-white/90 pointer-events-none flex items-center justify-center transition-all duration-300">
          <div className="text-center font-orbitron font-black text-slate-950 text-2xl tracking-widest animate-pulse">
            🔦 FLASHLIGHT ACTIVE // HIGH-LUMEN BEAM
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <h3 className="font-orbitron font-semibold text-xs tracking-wider text-cyan-200 uppercase">
            Universal Phone Control Hub // Voice Access to Everything
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono-code text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ALL PERMISSIONS GRANTED</span>
        </div>
      </div>

      {/* Voice Phone Command Bar */}
      <div className="p-3 bg-slate-900/60 border-b border-cyan-500/20 flex items-center gap-2">
        <button
          onClick={handleMicToggle}
          className={`p-2.5 rounded-lg border transition ${
            isListening
              ? 'bg-red-950 border-red-500 text-red-300 animate-pulse glow-crimson'
              : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 hover:border-cyan-300'
          }`}
          title="Speak phone command"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={voiceQuery}
          onChange={(e) => setVoiceQuery(e.target.value)}
          placeholder={`Speak or type command (e.g. "turn on flashlight", "call Ned", "open camera", "search photos")...`}
          className="flex-1 bg-slate-950 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-cyan-100 placeholder-cyan-500/40 font-rajdhani focus:outline-none focus:border-cyan-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && voiceQuery.trim()) {
              processPhoneVoiceCommand(voiceQuery.trim());
            }
          }}
        />

        <button
          onClick={() => {
            if (voiceQuery.trim()) processPhoneVoiceCommand(voiceQuery.trim());
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg transition"
        >
          Execute
        </button>
      </div>

      {/* Action feedback banner */}
      {lastActionResult && (
        <div className="px-4 py-2 bg-cyan-950/70 border-b border-cyan-500/30 text-xs font-mono-code text-cyan-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            {lastActionResult}
          </span>
          <button onClick={() => setLastActionResult(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Subsystem Nav & Viewport */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
        {/* Subsystem App Navigation */}
        <div className="md:col-span-4 border-r border-cyan-500/20 p-3 space-y-1.5 bg-slate-950/50">
          <div className="text-[10px] font-mono-code uppercase text-slate-400 px-1 mb-2">
            Phone Apps & Hardware:
          </div>

          {[
            { id: 'controls', name: 'Quick System Controls', desc: 'Flashlight, Wi-Fi, Volume', icon: Sliders },
            { id: 'camera', name: 'AR Optical Camera Feed', desc: 'Facial recognition & scan', icon: Camera },
            { id: 'messages', name: 'Messages & SMS', desc: 'Voice messaging & inbox', icon: MessageSquare },
            { id: 'phone', name: 'Phone Calls & Contacts', desc: 'Voice dial & directory', icon: Phone },
            { id: 'photos', name: 'Photos & Media Gallery', desc: 'Voice search & albums', icon: ImageIcon },
            { id: 'files', name: 'Files & Storage', desc: 'Downloads & blueprints', icon: Folder },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeApp === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveApp(item.id as any);
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition flex items-center gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/40 border-cyan-900/30 text-slate-300 hover:border-cyan-600/50'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-cyan-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-orbitron font-semibold text-xs text-cyan-200">{item.name}</div>
                  <div className="text-[10px] font-mono-code text-slate-400">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Subsystem Detail Display */}
        <div className="md:col-span-8 p-4 sm:p-5 overflow-y-auto scanlines bg-slate-900/30">
          {/* 1. SYSTEM CONTROLS & TOGGLES */}
          {activeApp === 'controls' && (
            <div className="space-y-4">
              <div className="text-xs font-mono-code uppercase text-cyan-400">
                Hardware & Toggles (Controlled by Voice or Tap)
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Flashlight */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setFlashlightOn(!flashlightOn);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    flashlightOn
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-950/70 border-cyan-900/40 text-slate-400'
                  }`}
                >
                  <Flashlight className={`w-5 h-5 mb-2 ${flashlightOn ? 'text-amber-300' : 'text-slate-500'}`} />
                  <div className="font-orbitron font-bold text-xs text-white">FLASHLIGHT</div>
                  <div className="text-[10px] font-mono-code mt-0.5">
                    {flashlightOn ? 'ACTIVE (ON)' : 'OFF'}
                  </div>
                </button>

                {/* Wi-Fi */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setWifiOn(!wifiOn);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    wifiOn
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/70 border-cyan-900/40 text-slate-400'
                  }`}
                >
                  {wifiOn ? (
                    <Wifi className="w-5 h-5 mb-2 text-cyan-400" />
                  ) : (
                    <WifiOff className="w-5 h-5 mb-2 text-slate-500" />
                  )}
                  <div className="font-orbitron font-bold text-xs text-white">WI-FI (5G)</div>
                  <div className="text-[10px] font-mono-code mt-0.5">
                    {wifiOn ? 'StarkNet 5G' : 'Disconnected'}
                  </div>
                </button>

                {/* Bluetooth */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setBluetoothOn(!bluetoothOn);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    bluetoothOn
                      ? 'bg-blue-950/80 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-slate-950/70 border-cyan-900/40 text-slate-400'
                  }`}
                >
                  <Bluetooth className={`w-5 h-5 mb-2 ${bluetoothOn ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div className="font-orbitron font-bold text-xs text-white">BLUETOOTH</div>
                  <div className="text-[10px] font-mono-code mt-0.5">
                    {bluetoothOn ? 'AR Glasses Synced' : 'Disabled'}
                  </div>
                </button>

                {/* Do Not Disturb */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setDoNotDisturb(!doNotDisturb);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    doNotDisturb
                      ? 'bg-purple-950/80 border-purple-400 text-purple-200'
                      : 'bg-slate-950/70 border-cyan-900/40 text-slate-400'
                  }`}
                >
                  <Moon className="w-5 h-5 mb-2 text-purple-400" />
                  <div className="font-orbitron font-bold text-xs text-white">DO NOT DISTURB</div>
                  <div className="text-[10px] font-mono-code mt-0.5">
                    {doNotDisturb ? 'Silence Active' : 'Off'}
                  </div>
                </button>

                {/* Battery Status */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-900/40">
                  <Battery className="w-5 h-5 mb-2 text-emerald-400" />
                  <div className="font-orbitron font-bold text-xs text-white">BATTERY</div>
                  <div className="text-[10px] font-mono-code text-emerald-400 mt-0.5">88% (Healthy)</div>
                </div>
              </div>

              {/* Sliders: Brightness & Volume */}
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-900/40">
                  <div className="flex justify-between text-xs font-mono-code mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" /> SCREEN BRIGHTNESS
                    </span>
                    <span className="text-cyan-300 font-bold">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-900 rounded"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-900/40">
                  <div className="flex justify-between text-xs font-mono-code mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> MASTER VOLUME
                    </span>
                    <span className="text-cyan-300 font-bold">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. AR CAMERA VIEWFINDER */}
          {activeApp === 'camera' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono-code text-cyan-400 uppercase">
                  E.D.I.T.H. Augmented Reality Optical Viewfinder
                </span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  IRIS RECOGNITION: ACTIVE
                </span>
              </div>

              {/* Simulated Camera Feed Viewport */}
              <div className="relative w-full h-72 rounded-xl bg-slate-950 border-2 border-cyan-500/50 overflow-hidden flex items-center justify-center glow-cyan">
                {/* Background optical grid */}
                <div className="absolute inset-0 bg-tech-grid opacity-30" />

                {/* AR Crosshair Reticle in Center */}
                <div className="relative w-36 h-36 border border-cyan-400/40 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                  <Crosshair className="w-8 h-8 text-cyan-400/80 animate-spin-slow" />
                </div>

                {/* AR Object Bounding Box Tracking */}
                <div className="absolute top-8 left-10 p-2 border border-emerald-400/80 rounded bg-emerald-950/40 text-[10px] font-mono-code text-emerald-300">
                  <div className="font-bold">TARGET: HUMAN (PETER PARKER)</div>
                  <div>FACIAL MATCH: 99.8%</div>
                  <div>THREAT LEVEL: LOW (FRIENDLY)</div>
                </div>

                <div className="absolute bottom-8 right-10 p-2 border border-sky-400/80 rounded bg-sky-950/40 text-[10px] font-mono-code text-sky-300">
                  <div className="font-bold">DEVICE: AR SUNGLASSES</div>
                  <div>STARK SAT-418: LINKED</div>
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-slate-400 text-center">
                Say "E.D.I.T.H., scan target" or "E.D.I.T.H., take a photo" to capture high-resolution imagery.
              </div>
            </div>
          )}

          {/* 3. MESSAGES SUBSYSTEM */}
          {activeApp === 'messages' && (
            <div className="space-y-4">
              <div className="text-xs font-mono-code text-cyan-400 uppercase">
                Messages Inbox (Voice Dictation Supported)
              </div>

              {/* Message List */}
              <div className="space-y-2">
                {MESSAGES.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg bg-slate-950/70 border border-cyan-900/40 space-y-1"
                  >
                    <div className="flex justify-between text-xs font-mono-code">
                      <span className="font-bold text-cyan-300">{m.sender}</span>
                      <span className="text-slate-400">{m.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-rajdhani">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Send New Message Box */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase block">
                  Quick Voice or Text Reply:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMsgText}
                    onChange={(e) => setNewMsgText(e.target.value)}
                    placeholder="Type or dictate message..."
                    className="flex-1 bg-slate-900 border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-white font-rajdhani focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!newMsgText.trim()) return;
                      sound.playScanBlip();
                      speech.speakText(`Message sent to ${selectedContact.name}: "${newMsgText}"`);
                      setNewMsgText('');
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs uppercase rounded transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. PHONE & CONTACTS */}
          {activeApp === 'phone' && (
            <div className="space-y-3">
              <div className="text-xs font-mono-code text-cyan-400 uppercase">
                Contacts Directory & Speed Dial
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CONTACTS.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-cyan-900/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold font-orbitron text-xs">
                        {c.avatar}
                      </div>
                      <div>
                        <div className="font-orbitron font-bold text-xs text-white">{c.name}</div>
                        <div className="text-[10px] font-mono-code text-slate-400">{c.phone}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sound.playScanBlip();
                        speech.speakText(`Dialing ${c.name} on speakerphone...`);
                      }}
                      className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-mono-code flex items-center gap-1 transition"
                      title={`Call ${c.name}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PHOTOS & GALLERY */}
          {activeApp === 'photos' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-cyan-400 uppercase">
                  Photo Gallery Media Search
                </span>
                <input
                  type="text"
                  value={photoSearchFilter}
                  onChange={(e) => setPhotoSearchFilter(e.target.value)}
                  placeholder="Filter by keyword (e.g. blueprints)..."
                  className="bg-slate-950 border border-cyan-900/50 rounded px-2.5 py-1 text-xs text-white font-rajdhani focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PHOTOS.filter(
                  (p) =>
                    !photoSearchFilter ||
                    p.title.toLowerCase().includes(photoSearchFilter.toLowerCase()) ||
                    p.tag.toLowerCase().includes(photoSearchFilter.toLowerCase())
                ).map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 group cursor-pointer"
                    onClick={() => {
                      sound.playClick();
                      speech.speakText(`Viewing ${photo.title}.`);
                    }}
                  >
                    <div className={`h-24 bg-gradient-to-br ${photo.color} flex items-center justify-center p-2`}>
                      <ImageIcon className="w-8 h-8 text-white/50 group-hover:scale-110 transition" />
                    </div>
                    <div className="p-2 text-[10px] font-mono-code">
                      <div className="font-bold text-white truncate">{photo.title}</div>
                      <div className="text-slate-400 flex justify-between mt-0.5">
                        <span>#{photo.tag}</span>
                        <span>{photo.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. FILES & STORAGE */}
          {activeApp === 'files' && (
            <div className="space-y-3">
              <div className="text-xs font-mono-code text-cyan-400 uppercase">
                Stark Local Files & Encrypted Storage
              </div>

              {[
                { name: 'Mark_85_Flight_Parameters.dwg', size: '42.8 MB', date: 'Today' },
                { name: 'Orbital_Satellite_418_Telemetry.dat', size: '128.4 MB', date: 'Yesterday' },
                { name: 'EDITH_Firmware_v4.2.bin', size: '1.2 GB', date: 'Oct 14' },
                { name: 'Stark_Nano_Gauntlet_Schematic.pdf', size: '18.1 MB', date: 'Oct 11' },
              ].map((f) => (
                <div
                  key={f.name}
                  className="p-3 rounded-xl bg-slate-950/70 border border-cyan-900/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-mono-code font-bold text-xs text-white">{f.name}</div>
                      <div className="text-[10px] font-mono-code text-slate-400">{f.size} • {f.date}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      speech.speakText(`Opening ${f.name}`);
                    }}
                    className="text-xs font-mono-code text-cyan-300 hover:text-white underline"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
