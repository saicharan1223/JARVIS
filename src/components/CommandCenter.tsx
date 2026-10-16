import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
  Sparkles,
  Bot,
  User,
  Radio,
  Flame,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  protocolAction?: string;
  isStreaming?: boolean;
}

interface CommandCenterProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  isSpeaking: boolean;
  userTitle: string;
  suitModel: string;
  onInitiateProtocol: (protocolName: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  isSpeaking,
  userTitle,
  suitModel,
  onInitiateProtocol,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    sound.playClick();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
      sound.playClick();
    } else {
      setRecognitionError(null);
      sound.playScanBlip();
      const started = speech.startListening({
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            onSendMessage(transcript.trim());
            setInputText('');
          }
        },
        onError: (err) => {
          setIsListening(false);
          setRecognitionError(err);
          setTimeout(() => setRecognitionError(null), 4000);
        },
        onEnd: () => setIsListening(false),
      });

      if (!started) {
        setIsListening(false);
      }
    }
  };

  const quickCommands = [
    { label: 'Run Full Diagnostic', action: 'Run full system diagnostic and check suit integrity' },
    { label: 'Mark 85 Status', action: `Check telemetry for ${suitModel}` },
    { label: 'House Party Protocol', action: 'Initiate House Party protocol' },
    { label: 'Clean Slate Protocol', action: 'Verify Clean Slate protocol security locks' },
    { label: 'Overclock Reactor', action: 'Overclock Arc Reactor power grid to 125%' },
    { label: 'Atmospheric Scan', action: 'Scan atmospheric conditions and satellite orbit' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl relative">
      {/* Module Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron font-semibold text-xs tracking-wider text-cyan-200 uppercase">
            Tactical Neural Terminal
          </span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono-code text-cyan-400/70">
          <span>BUFF: OPTICAL-QUANTUM</span>
          <span>//</span>
          <span className="text-emerald-400">ENCRYPTION: 4096-BIT</span>
        </div>
      </div>

      {/* Quick Action Protocol Chips */}
      <div className="px-3 py-2 bg-slate-900/40 border-b border-cyan-500/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono-code uppercase text-slate-400 whitespace-nowrap pl-1">
          Directives:
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd.label}
            onClick={() => {
              sound.playClick();
              onSendMessage(cmd.action);
            }}
            disabled={isProcessing}
            className="px-2.5 py-1 text-[11px] font-rajdhani font-semibold tracking-wider uppercase rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 whitespace-nowrap transition disabled:opacity-50"
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scanlines relative">
        {messages.map((msg) => {
          const isJarvis = msg.sender === 'jarvis';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isJarvis ? 'items-start' : 'items-end'} transition-all`}
            >
              {/* Sender Badge & Time */}
              <div className="flex items-center gap-2 mb-1 text-[10px] font-mono-code text-cyan-400/70">
                {isJarvis ? (
                  <>
                    <span className="flex items-center gap-1 text-cyan-300 font-bold">
                      <Bot className="w-3 h-3 text-cyan-400" /> J.A.R.V.I.S.
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <span>{msg.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <User className="w-3 h-3 text-amber-400" /> {userTitle}
                    </span>
                  </>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  isJarvis
                    ? 'bg-gradient-to-br from-cyan-950/70 via-slate-900/80 to-slate-950 border border-cyan-500/40 text-cyan-100 shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                    : 'bg-gradient-to-r from-blue-950/60 to-slate-900/80 border border-blue-500/40 text-slate-100'
                }`}
              >
                <div className="whitespace-pre-wrap font-rajdhani text-[15px] sm:text-[16px] tracking-wide">
                  {msg.text}
                </div>

                {/* Read aloud button for JARVIS messages */}
                {isJarvis && (
                  <div className="mt-2 pt-2 border-t border-cyan-500/20 flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-cyan-400/50 uppercase">
                      Neural Vocal Subroutine
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        speech.speakText(msg.text);
                      }}
                      className="p-1 rounded text-cyan-400/70 hover:text-cyan-200 hover:bg-cyan-950/50 transition"
                      title="Play Vocal Transmission"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono-code text-cyan-400/70">
              <Bot className="w-3 h-3 text-cyan-400" />
              <span>J.A.R.V.I.S. COMPUTING</span>
            </div>
            <div className="px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 text-cyan-300 text-xs font-mono-code">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Synthesizing tactical probability models, {userTitle}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recognition error toast */}
      {recognitionError && (
        <div className="px-4 py-1.5 bg-red-950/80 border-t border-red-500/50 text-red-300 text-xs font-mono-code flex items-center justify-between">
          <span>VOICE ERROR: {recognitionError}</span>
          <button onClick={() => setRecognitionError(null)} className="text-red-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-950/90 border-t border-cyan-500/30 flex items-center gap-2"
      >
        {/* Voice Dictation Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-2.5 rounded-lg border transition ${
            isListening
              ? 'bg-red-950 border-red-500 text-red-400 animate-pulse glow-crimson shadow-[0_0_15px_rgba(239,68,68,0.5)]'
              : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/50'
          }`}
          title={isListening ? 'Listening (Click to Stop)' : 'Voice Input (Click to Speak)'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? `Listening to you, ${userTitle}...`
                : `Enter command or ask J.A.R.V.I.S., ${userTitle}...`
            }
            className="w-full bg-slate-900/90 border border-cyan-500/40 focus:border-cyan-300 rounded-lg px-4 py-2 text-sm text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 font-rajdhani text-base"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-bold border border-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed glow-cyan shadow-[0_0_12px_rgba(0,240,255,0.4)]"
          title="Send Command"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
