import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Mic,
  MicOff,
  Cpu,
  Layers,
  CheckCircle2,
  Volume2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';

interface EngineResult {
  id: string;
  name: string;
  provider: string;
  badge: string;
  latencyMs: number;
  confidence: number;
  answer: string;
  keyTakeaway: string;
}

interface MultiAiSearchResponse {
  query: string;
  timestamp: string;
  engines: EngineResult[];
  consensus: {
    agreementScore: number;
    bestResult: string;
    verdict: string;
    voiceSummary: string;
  };
}

interface MultiAiSearchModuleProps {
  userTitle: string;
  voicePersona: 'EDITH' | 'JARVIS';
}

export const MultiAiSearchModule: React.FC<MultiAiSearchModuleProps> = ({
  userTitle,
  voicePersona,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<MultiAiSearchResponse | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<string>('all');

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || isSearching) return;
    sound.playScanBlip();
    setIsSearching(true);
    setResults(null);

    try {
      const res = await fetch('/api/multi-ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          userTitle,
          voicePersona,
        }),
      });

      if (!res.ok) throw new Error('Failed to query multi-AI engine');

      const data: MultiAiSearchResponse = await res.json();
      setResults(data);
      sound.playReactorCharge();

      // Read aloud the E.D.I.T.H. synthesized voice summary
      if (data.consensus?.voiceSummary) {
        speech.speakText(data.consensus.voiceSummary);
      }
    } catch (err) {
      console.error('Multi-AI search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
      sound.playClick();
    } else {
      sound.playScanBlip();
      speech.startListening({
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setQuery(transcript);
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            executeSearch(transcript.trim());
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  const samplePrompts = [
    'What are the breakthrough AI advancements expected in 2026?',
    'Explain how quantum entanglement communication functions',
    'Compare React 19 vs Flutter vs Swift for production apps',
    'What are the strongest defenses against adversarial AI attacks?',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-sky-950/60 to-cyan-950/60 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h3 className="font-orbitron font-semibold text-xs tracking-wider text-white uppercase">
            Omni-AI Parallel Consensus Engine // 5-Way Neural Sweep
          </h3>
        </div>
        <span className="text-[10px] font-mono-code text-sky-300 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40">
          GEMINI • CLAUDE • GPT-4O • PERPLEXITY • DEEPSEEK
        </span>
      </div>

      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5 scanlines">
        {/* Search Input Box */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeSearch(query);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Ask anything to query all top AIs simultaneously, ${userTitle}...`}
                className="w-full bg-slate-950 border border-cyan-500/40 rounded-lg pl-10 pr-4 py-2.5 text-sm text-cyan-100 placeholder-cyan-500/40 font-rajdhani text-base focus:border-cyan-300 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-lg border transition ${
                isListening
                  ? 'bg-red-950 border-red-500 text-red-300 animate-pulse glow-crimson'
                  : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:border-cyan-300'
              }`}
              title={isListening ? 'Listening (Click to Stop)' : 'Voice Input (Click to Speak)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg border border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)] transition disabled:opacity-40"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sweep All AIs'}
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[10px] font-mono-code text-slate-400 uppercase whitespace-nowrap">
              Try Query:
            </span>
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setQuery(p);
                  executeSearch(p);
                }}
                className="px-2.5 py-1 text-[11px] font-rajdhani rounded bg-slate-950/80 text-cyan-300 border border-cyan-900/50 hover:border-cyan-400 whitespace-nowrap transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Searching Animation */}
        {isSearching && (
          <div className="p-8 rounded-xl bg-slate-900/50 border border-cyan-500/20 text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
              <span className="font-orbitron font-bold text-sm text-cyan-200 uppercase tracking-wider">
                Simultaneously Querying 5 Neural Networks...
              </span>
            </div>

            <div className="max-w-md mx-auto grid grid-cols-5 gap-2 text-[10px] font-mono-code">
              {['Gemini 3.8', 'Claude 3.7', 'GPT-4o', 'Perplexity', 'DeepSeek R1'].map((name, i) => (
                <div
                  key={name}
                  className="p-2 rounded bg-slate-950 border border-cyan-500/30 animate-pulse text-cyan-300"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <Cpu className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-400" />
                  <span className="block truncate">{name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-rajdhani text-slate-400">
              Cross-validating facts, evaluating logical consistency, and synthesizing the single best result.
            </p>
          </div>
        )}

        {/* Search Results Display */}
        {results && (
          <div className="space-y-5">
            {/* 1. MASTER BEST RESULT (Stark Unified Intelligence Consensus) */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-cyan-950/40 border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.2)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h4 className="font-orbitron font-bold text-sm text-amber-300 uppercase tracking-wider">
                    E.D.I.T.H. Master Consensus // Best Synthesized Result
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-bold">
                    {results.consensus.agreementScore}% MODEL CONVERGENCE
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      speech.speakText(results.consensus.bestResult);
                    }}
                    className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:text-white transition"
                    title="Read Aloud with E.D.I.T.H. Voice"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/70 border border-amber-500/30 text-white font-rajdhani text-base sm:text-lg leading-relaxed font-medium">
                {results.consensus.bestResult}
              </div>

              <div className="text-xs font-mono-code text-cyan-300/80 flex items-center justify-between pt-1">
                <span>
                  <strong>VERDICT:</strong> {results.consensus.verdict}
                </span>
                <span className="text-slate-400 text-[10px]">PARALLEL LATENCY: ~410ms</span>
              </div>
            </div>

            {/* 2. SIDE-BY-SIDE ALL 5 AI RESPONSES */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-mono-code uppercase text-cyan-400 tracking-wider">
                  Individual Model Breakdown ({results.engines.length} AI Engines):
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono-code">
                  <button
                    onClick={() => setSelectedEngine('all')}
                    className={`px-2 py-0.5 rounded ${
                      selectedEngine === 'all'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                        : 'text-slate-400'
                    }`}
                  >
                    All
                  </button>
                  {results.engines.map((eng) => (
                    <button
                      key={eng.id}
                      onClick={() => setSelectedEngine(eng.id)}
                      className={`px-2 py-0.5 rounded ${
                        selectedEngine === eng.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                          : 'text-slate-400'
                      }`}
                    >
                      {eng.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.engines
                  .filter((e) => selectedEngine === 'all' || selectedEngine === e.id)
                  .map((eng) => (
                    <div
                      key={eng.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 hover:border-cyan-500/60 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-orbitron font-bold text-xs text-white block">
                              {eng.name}
                            </span>
                            <span className="text-[10px] font-mono-code text-slate-400">
                              {eng.provider}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                            {eng.badge}
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 font-rajdhani leading-relaxed mt-2.5">
                          "{eng.answer}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-cyan-500/10 space-y-1.5 text-[10px] font-mono-code">
                        <div className="text-cyan-400/90 font-semibold">{eng.keyTakeaway}</div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>SPEED: {eng.latencyMs}ms</span>
                          <span className="text-emerald-400 font-bold">
                            CONFIDENCE: {eng.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
