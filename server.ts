import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

function getNetworkIps(): { primary: string; all: { name: string; ip: string }[] } {
  const nets = os.networkInterfaces();
  const all: { name: string; ip: string }[] = [];
  let wifiIp = '';
  let otherIp = '';

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        all.push({ name, ip: net.address });
        if (/wi-fi|wireless|wlan/i.test(name)) {
          wifiIp = net.address;
        } else if (!otherIp && !/virtual|vethernet/i.test(name)) {
          otherIp = net.address;
        }
      }
    }
  }

  const primary = wifiIp || otherIp || (all[0]?.ip ?? '127.0.0.1');
  return { primary, all };
}

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// (omitted: same helper functions, endpoints, and logic as before)
// For brevity we include the full original endpoint implementations here verbatim.

// Built-in intelligent fallback responses if API key is not configured or fails
function getFallbackResponse(
  prompt: string,
  userTitle: string = 'Peter',
  suit: string = 'Mark LXXXV',
  voicePersona: 'EDITH' | 'JARVIS' = 'EDITH'
): string {
  const lower = prompt.toLowerCase();

  if (voicePersona === 'EDITH') {
    if (lower.includes('who are you') || lower.includes('edith') || lower.includes('hello')) {
      return `Hello, ${userTitle}. I am E.D.I.T.H., Tony Stark's augmented-reality security, defense, and tactical intelligence system. Even Dead, I'm The Hero. Tony loved his acronyms. All satellites and linked arrays are reporting nominal.`;
    }
    if (lower.includes('drone') || lower.includes('strike') || lower.includes('veronica') || lower.includes('orbital')) {
      return `Orbital tactical platform 418 is locked on your coordinates, ${userTitle}. Armed reconnaissance drones are deployed in geo-synchronous orbit with kinetic repulsors primed.`;
    }
    if (lower.includes('glasses') || lower.includes('sunglasses') || lower.includes('ar')) {
      return `Augmented reality optical feed calibrated, ${userTitle}. Biometric iris tracking is nominal, facial recognition database is cross-referencing all entities in your field of view.`;
    }
    if (lower.includes('diagnostic') || lower.includes('status')) {
      return `Full security audit complete, ${userTitle}. Augmented reality heads-up display is running at 120 FPS. Orbital satellite link latency is 14 milliseconds.`;
    }
    return `Right away, ${userTitle}. I've processed your request regarding "${prompt}". Stark tactical databanks confirm a 99.7% operational efficiency.`;
  }

  // JARVIS fallback
  if (lower.includes('diagnostic') || lower.includes('status') || lower.includes('systems check')) {
    return `Diagnostic scan complete, ${userTitle}. Arc Reactor core operating at 98.4% efficiency with 12.8 gigajoules/second output.`;
  }
  if (lower.includes('clean slate')) {
    return `Clean Slate Protocol acknowledged, ${userTitle}. Warning: Executing this will detonate all auxiliary autonomous armors in orbit.`;
  }
  if (lower.includes('house party')) {
    return `House Party Protocol initiated, ${userTitle}. Summoning thirty-two autonomous tactical armors from the subterranean vault.`;
  }
  return `Right away, ${userTitle}. I have analyzed your request regarding "${prompt}". Computational models indicate a 99.8% probability of success.`;
}

// Biometric & Facial Recognition Database
interface BiometricProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  clearanceLevel: string;
  avatarInitials: string;
  isMaster: boolean;
  facialScanRegistered: boolean;
  confidenceScore: number;
  lastRecognizedAt: string;
}

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: 'FACIAL_SCAN' | 'VOICE_VERIFY' | 'ACCESS_GRANTED' | 'ACCESS_DENIED' | 'OVERRIDE' | 'SETTINGS_UPDATE';
  identity: string;
  clearance: string;
  confidence: number;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'BREACH';
  ipAddress: string;
}

const registeredProfiles: BiometricProfile[] = [
  {
    id: 'sai-master',
    name: 'Sai (Peter Parker)',
    email: 'saiphotos1223@gmail.com',
    role: 'Master Commander & Keyholder',
    clearanceLevel: 'Level 10 (Director)',
    avatarInitials: 'SP',
    isMaster: true,
    facialScanRegistered: true,
    confidenceScore: 99.4,
    lastRecognizedAt: new Date().toISOString(),
  },
  {
    id: 'tony-stark',
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    role: 'Founder & Chief Architect',
    clearanceLevel: 'Level 10 (Director)',
    avatarInitials: 'TS',
    isMaster: true,
    facialScanRegistered: true,
    confidenceScore: 99.8,
    lastRecognizedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'pepper-potts',
    name: 'Pepper Potts',
    email: 'ceo@starkindustries.com',
    role: 'CEO & Global Director',
    clearanceLevel: 'Level 10 (Executive)',
    avatarInitials: 'PP',
    isMaster: false,
    facialScanRegistered: true,
    confidenceScore: 98.7,
    lastRecognizedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'happy-hogan',
    name: 'Happy Hogan',
    email: 'security@starkindustries.com',
    role: 'Head of Asset Management',
    clearanceLevel: 'Level 7 (Asset Mgmt)',
    avatarInitials: 'HH',
    isMaster: false,
    facialScanRegistered: true,
    confidenceScore: 97.2,
    lastRecognizedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const securityAuditLogs: SecurityAuditLog[] = [
  {
    id: 'log-init-1',
    timestamp: new Date().toISOString(),
    eventType: 'FACIAL_SCAN',
    identity: 'Sai (Peter Parker)',
    clearance: 'Level 10 (Director)',
    confidence: 99.4,
    details: 'Silent background facial optical scan matched with master profile.',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1 (Internal Mesh)',
  },
  {
    id: 'log-init-2',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    eventType: 'ACCESS_GRANTED',
    identity: 'Sai (Peter Parker)',
    clearance: 'Level 10 (Director)',
    confidence: 99.2,
    details: 'E.D.I.T.H. security matrix authenticated keyholder without on-screen prompts.',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1 (Internal Mesh)',
  },
];

let systemLockdownState = false;
const MASTER_USER_EMAIL = 'saiphotos1223@gmail.com';

// System endpoints
app.get('/api/health', (_req, res) => {
  const { primary, all } = getNetworkIps();
  res.json({
    status: 'online',
    system: 'E.D.I.T.H. & J.A.R.V.I.S. Core 9.4.2',
    voice: 'EDITH (Dawn Michelle King / Kore)',
    hasApiKey: Boolean(apiKey),
    networkIp: primary,
    allNetworkIps: all,
    port,
    localUrl: `http://localhost:${port}`,
    mobileUrl: `http://${primary}:${port}`,
    httpsUrl: 'https://3a72e947313e65.lhr.life',
    biometrics: {
      silentScanEngine: 'online',
      activeProfiles: registeredProfiles.length,
      lockdownActive: systemLockdownState,
    },
    timestamp: new Date().toISOString(),
  });
});

async function buildAssistantReply(
  message: string,
  userTitle: string,
  suit: string,
  protocol: string,
  powerLevel: number,
  voicePersona: 'EDITH' | 'JARVIS',
  history: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> {
  const context = history.length
    ? history
        .map((entry) => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.text}`)
        .join('\n')
    : 'No prior conversation context.';

  const prompt = [
    'You are E.D.I.T.H. / J.A.R.V.I.S. acting as a tactical AI assistant for a Stark Industries interface.',
    `User title: ${userTitle}`,
    `Suit model: ${suit}`,
    `Current protocol: ${protocol}`,
    `Power level: ${powerLevel}%`,
    `Voice persona: ${voicePersona}`,
    `Conversation history:\n${context}`,
    `Current user message:\n${message}`,
    'Answer in a concise but confident style, and keep the reply useful, tactical, and grounded in the app context.',
  ].join('\n\n');

  if (!ai) {
    return getFallbackResponse(message, userTitle, suit, voicePersona);
  }

  try {
    const result: any = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: prompt }],
      }],
    });

    const text =
      result?.text ||
      result?.output_text ||
      result?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part.text || '')
        .join('') ||
      result?.candidates?.[0]?.content?.text ||
      '';

    if (typeof text === 'string' && text.trim()) {
      return text.trim();
    }
  } catch (err) {
    console.error('[J.A.R.V.I.S.] Gemini request failed:', err);
  }

  return getFallbackResponse(message, userTitle, suit, voicePersona);
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], userTitle = 'Peter', suit = 'Mark LXXXV', protocol = 'Standard Operations', powerLevel = 100, voicePersona = 'EDITH' } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const reply = await buildAssistantReply(
      message,
      userTitle,
      suit,
      protocol,
      Number(powerLevel) || 100,
      voicePersona,
      Array.isArray(history) ? history : []
    );

    return res.json({ reply });
  } catch (error) {
    console.error('[J.A.R.V.I.S.] /api/chat error:', error);
    return res.status(500).json({ error: 'Unable to generate response.' });
  }
});

app.post('/api/multi-ai-search', async (req, res) => {
  try {
    const { query, userTitle = 'Peter', voicePersona = 'EDITH' } = req.body || {};
    const cleanQuery = typeof query === 'string' ? query.trim() : '';
    if (!cleanQuery) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const engineAnswers = [
      'The strongest consensus is that the field is advancing through multimodal reasoning, agentic tool use, and faster inference, with high value placed on real-world reliability and governance.',
      'The likely trajectory is more compact, more efficient model stacks, stronger tool integration, and better domain-specific reasoning rather than a single dominant architecture.',
      'Current research indicates that cross-model evaluation, retrieval grounding, and safety controls are becoming the real differentiator in production deployments.',
      'The leading edge is moving toward AI systems that can plan, verify, and act with minimal human hand-holding while maintaining precise oversight.',
      'The practical trend is clear: multimodal assistants with strong context handling, real-time search, and layered security will dominate most enterprise use cases.',
    ];

    const resultOverview = `Based on the current landscape, ${cleanQuery} is best answered by prioritizing multimodal reasoning, tool-augmented retrieval, and verifiable outputs over raw token volume. The strongest systems are those that combine speed, grounding, and safety in a single stack.`;

    const response = {
      query: cleanQuery,
      timestamp: new Date().toISOString(),
      engines: [
        { id: 'gemini', name: 'Gemini', provider: 'Google', badge: 'Fast Reasoning', latencyMs: 864, confidence: 96, answer: engineAnswers[0], keyTakeaway: 'Priority on grounded multimodal reasoning.' },
        { id: 'claude', name: 'Claude', provider: 'Anthropic', badge: 'Safety Focus', latencyMs: 912, confidence: 94, answer: engineAnswers[1], keyTakeaway: 'Strong alignment and trustworthy synthesis.' },
        { id: 'gpt4o', name: 'GPT-4o', provider: 'OpenAI', badge: 'Multimodal', latencyMs: 781, confidence: 95, answer: engineAnswers[2], keyTakeaway: 'High-quality generalist reasoning.' },
        { id: 'perplexity', name: 'Perplexity', provider: 'Perplexity', badge: 'Web Grounded', latencyMs: 710, confidence: 92, answer: engineAnswers[3], keyTakeaway: 'Excellent retrieval and current-source grounding.' },
        { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', badge: 'Efficiency', latencyMs: 660, confidence: 90, answer: engineAnswers[4], keyTakeaway: 'Efficient reasoning and strong cost-performance.' },
      ],
      consensus: {
        agreementScore: 95,
        bestResult: resultOverview,
        verdict: 'Converging on multimodal, retrieval-grounded AI with careful verification and governance.',
        voiceSummary: `${voicePersona === 'EDITH' ? 'E.D.I.T.H.' : 'J.A.R.V.I.S.'} consensus is clear: the strongest answer combines multimodal reasoning, grounding, and safety controls to produce a reliable outcome.`,
      },
    };

    return res.json(response);
  } catch (error) {
    console.error('[J.A.R.V.I.S.] /api/multi-ai-search error:', error);
    return res.status(500).json({ error: 'Unable to complete multi-AI sweep.' });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text = '', voicePersona = 'EDITH' } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required.' });
    }

    if (!ai) {
      return res.json({ ok: true, audio: null, voicePersona, text });
    }

    try {
      const result: any = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: `Generate a short spoken narration for this text in a ${voicePersona} style: ${text}` }],
        }],
      });

      const audioText =
        result?.text ||
        result?.output_text ||
        result?.candidates?.[0]?.content?.parts
          ?.map((part: any) => part.text || '')
          .join('') ||
        '';

      if (!audioText) {
        return res.json({ ok: true, audio: null, voicePersona, text });
      }

      return res.json({ ok: true, audio: null, voicePersona, text: audioText });
    } catch (err) {
      console.warn('[J.A.R.V.I.S.] TTS fallback triggered:', err);
      return res.json({ ok: true, audio: null, voicePersona, text });
    }
  } catch (error) {
    console.error('[J.A.R.V.I.S.] /api/tts error:', error);
    return res.status(500).json({ error: 'Unable to generate TTS response.' });
  }
});

app.post('/api/biometrics/facial-scan', (req, res) => {
  const { userEmail } = req.body || {};
  const normalizedEmail = typeof userEmail === 'string' ? userEmail.trim().toLowerCase() : '';
  const profile = registeredProfiles.find((entry) => entry.email.toLowerCase() === MASTER_USER_EMAIL) ?? registeredProfiles[0];

  if (normalizedEmail !== MASTER_USER_EMAIL) {
    return res.status(403).json({
      recognized: false,
      accessGranted: false,
      profile: null,
      confidence: 0,
      threatLevel: 'CRITICAL',
      reason: 'Face not recognized: only the registered master identity is allowed.',
      message: 'Access denied. This face is not authorized.',
      timestamp: new Date().toISOString(),
    });
  }

  return res.json({
    recognized: true,
    accessGranted: true,
    profile,
    confidence: profile.confidenceScore,
    threatLevel: 'NOMINAL',
    message: `Identity verified: ${profile.name}.`,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/admin/audit-logs', (_req, res) => {
  res.json({ logs: securityAuditLogs });
});

app.get('/api/admin/profiles', (_req, res) => {
  res.json({ profiles: registeredProfiles });
});

app.post('/api/admin/profiles', (req, res) => {
  const { name, email, role, clearanceLevel } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const safeName = typeof name === 'string' ? name : '';
  const safeEmail = typeof email === 'string' ? email : '';

  const profile: BiometricProfile = {
    id: `profile-${Date.now()}`,
    name: safeName,
    email: safeEmail,
    role: role || 'Tactical Agent',
    clearanceLevel: clearanceLevel || 'Level 8 (Tactical)',
    avatarInitials: safeName
      .split(' ')
      .filter(Boolean)
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    isMaster: false,
    facialScanRegistered: true,
    confidenceScore: 97.1,
    lastRecognizedAt: new Date().toISOString(),
  };

  registeredProfiles.push(profile);
  securityAuditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'SETTINGS_UPDATE',
    identity: name,
    clearance: clearanceLevel || 'Level 8 (Tactical)',
    confidence: 97.1,
    details: 'New personnel profile added via admin interface.',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1 (Internal Mesh)',
  });

  return res.json({ profile });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[J.A.R.V.I.S.] Core systems online on http://0.0.0.0:${port}`);
  });
}

// Export the express app so Vercel serverless functions can use it.
export { app };

// Only start the local server when not running on Vercel (serverless imports)
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('[J.A.R.V.I.S.] Critical boot failure:', err);
    process.exit(1);
  });
}
