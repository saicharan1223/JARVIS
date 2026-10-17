l# E.D.I.T.H. & J.A.R.V.I.S. Tactical AI Assistant

> *"Even Dead, I'm The Hero."* — Tony Stark's Augmented-Reality Security, Defense & Autonomous Intelligence System.

A responsive, voice-synthesized, multi-AI tactical assistant interface equipped with **silent background facial biometrics**, **phone subsystem controls**, **parallel multi-AI consensus search**, and **Progressive Web App (PWA)** mobile installation.

---

## ⚡ Key Capabilities

- **🎙️ Dual AI Voice Personas**: Toggle seamlessly between **E.D.I.T.H.** (*Dawn Michelle King / Kore*) and **J.A.R.V.I.S.** (*Paul Bettany / Fenrir*) with full speech synthesis and ambient sound effects.
- **👁️ Silent Background Facial Recognition**: Performs continuous optical and neural biometric authentication directly on the backend without intrusive camera viewfinders or blocking permission popups.
- **✨ Omni-AI Parallel Search Engine**: Queries multiple top-tier AI models simultaneously (Gemini 2.5 Flash, GPT-4o, Claude 3.5 Sonnet, and Grok 2) to build a unified cross-engine consensus.
- **📱 Phone Subsystem Hub**: Full remote hardware control simulation — battery telemetry, thermal diagnostics, network toggles, satellite GPS uplink, orbital defense drones, and emergency system lockdown.
- **⚙️ Executive Admin & Security Database**: Master keyholder settings, personnel clearance levels (Levels 1–10), live security audit stream, and intruder detection alarms.
- **📲 Progressive Web App (PWA)**: Installable directly onto Android and iOS mobile devices for a standalone, full-screen, native app experience with offline caching.
- **💻 Responsive Cockpit**: Adaptive HUD optimized for desktop monitors, iPads/tablets, and mobile phones with a dedicated thumb-friendly bottom dock.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 4. Launch the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📲 How to Install as a Native App on Mobile

1. Open the app URL on your phone:
   - **Android**: Use **Google Chrome** or **Samsung Internet**.
   - **iOS**: Use **Apple Safari**.
2. Tap the **"INSTALL ON MOBILE"** button in the header (or scan the on-screen QR code with your phone camera).
3. **Android**: Tap **"Install app"** / **"Add to Home screen"** from the Chrome menu (`⋮`).
4. **iPhone**: Tap the **Share** button (`⎋`), scroll down, and tap **"Add to Home Screen"** (`[+]`).
5. Launch the app from your home screen for full-screen tactical view and hands-free voice access.

---

## 🌐 Deploy to Production (Free 1-Click Hosting)

### Option A: Render.com (Recommended for Full-Stack Node + React)
1. Fork or push this repository to your GitHub account.
2. Sign in to [Render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your API key
   - `NODE_ENV` = `production`
6. Click **Create Web Service**. Your app will be live on a custom HTTPS domain with free SSL!

### Option B: Railway.app
1. Go to [Railway.app](https://railway.app) and select **New Project > Deploy from GitHub repo**.
2. Add your `GEMINI_API_KEY` in the project settings.
3. Railway automatically detects `server.ts` and deploys your full-stack app.

---

## 🔒 Security & Privacy Notice
All biometric facial scanning runs in private neural memory and logs to internal telemetry. Never commit your `.env` file containing private API keys to GitHub.

---

## 🛡️ License
MIT License. Inspired by Stark Industries & Marvel Cinematic Universe.
