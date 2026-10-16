import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Smartphone,
  Download,
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  CheckCircle,
  Shield,
  Mic,
  Eye,
  Sparkles,
  ExternalLink,
  Laptop,
  Wifi,
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../utils/usePWAInstall';
import { sound } from '../utils/soundEffects';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLocal, setCopiedLocal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [networkInfo, setNetworkInfo] = useState<{ localUrl: string; mobileUrl: string; httpsUrl?: string } | null>(null);

  // Fetch LAN IP & secure HTTPS tunnel from backend so mobile phone can access with 1 tap
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.mobileUrl && data.localUrl) {
          setNetworkInfo({ localUrl: data.localUrl, mobileUrl: data.mobileUrl, httpsUrl: data.httpsUrl });
        }
      })
      .catch(() => {});
  }, []);

  const localUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const mobileUrl =
    networkInfo?.httpsUrl ||
    (networkInfo?.mobileUrl && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? networkInfo.mobileUrl
      : typeof window !== 'undefined'
      ? window.location.href
      : 'http://localhost:3000');

  useEffect(() => {
    if (showGuide && mobileUrl) {
      QRCode.toDataURL(mobileUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [showGuide, mobileUrl]);

  const handleCopyMobile = () => {
    sound.playClick();
    if (navigator.clipboard && mobileUrl) {
      navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyLocal = () => {
    sound.playClick();
    if (navigator.clipboard && localUrl) {
      navigator.clipboard.writeText(localUrl);
      setCopiedLocal(true);
      setTimeout(() => setCopiedLocal(false), 2500);
    }
  };

  const handleInstallClick = () => {
    sound.playClick();
    setShowGuide(true);
  };

  const handleNativeInstall = async () => {
    sound.playClick();
    if (isInstallable) {
      await install();
    }
  };

  // The modal rendered into document.body to break free from any parent backdrop-filter or z-index constraints
  const modalContent = showGuide && typeof document !== 'undefined' ? (
    createPortal(
      <div
        className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border-2 border-cyan-400 p-5 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.5)] text-slate-100 scanlines space-y-4 my-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Smartphone className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wider flex items-center gap-2">
                  LIVE APP PREVIEW & INSTALL
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/80 text-cyan-200 border border-cyan-400/50">
                    PWA APP
                  </span>
                </h3>
                <p className="text-[11px] font-mono-code text-cyan-400/90">
                  E.D.I.T.H. & J.A.R.V.I.S. Core 9.4.2
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setShowGuide(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Preview Links Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-code">
            {/* Desktop Preview */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-900/50 flex flex-col justify-between gap-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                  <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                  DESKTOP PREVIEW
                </span>
                <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">PC / MAC</span>
              </div>
              <div className="text-[11px] text-cyan-400 truncate">{localUrl}</div>
              <div className="flex gap-1.5">
                <a
                  href={localUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-center text-[10px] font-bold border border-cyan-500/40 flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  OPEN
                </a>
                <button
                  onClick={handleCopyLocal}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
                >
                  {copiedLocal ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            {/* Mobile Wi-Fi Preview */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-900/50 flex flex-col justify-between gap-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  MOBILE PREVIEW
                </span>
                <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-400">PHONE WI-FI</span>
              </div>
              <div className="text-[11px] text-emerald-400 truncate">{mobileUrl}</div>
              <div className="flex gap-1.5">
                <button
                  onClick={handleCopyMobile}
                  className="flex-1 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-center text-[10px] font-bold border border-emerald-500/40 flex items-center justify-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'LINK COPIED' : 'COPY MOBILE LINK'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* FRONT & CENTER: QR Code for Phone Preview & Install */}
          <div className="p-4 rounded-xl bg-slate-900/95 border border-cyan-500/40 flex flex-col sm:flex-row items-center gap-4">
            {/* High Contrast QR Code for instant phone camera scanning */}
            <div className="flex flex-col items-center justify-center bg-white p-2.5 rounded-xl border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Scan to preview on phone"
                  className="w-32 h-32 object-contain"
                />
              ) : (
                <div className="w-32 h-32 flex flex-col items-center justify-center text-slate-900 font-mono-code text-[11px] gap-2">
                  <QrCode className="w-10 h-10 animate-spin text-cyan-600" />
                  <span>GENERATING...</span>
                </div>
              )}
              <span className="text-[10px] font-mono-code text-slate-900 font-bold mt-1 tracking-tight">
                SCAN WITH PHONE CAMERA
              </span>
            </div>

            {/* Instruction and Link Copy Box */}
            <div className="flex-1 w-full space-y-2 text-left">
              <div className="text-xs font-orbitron font-bold text-cyan-300 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Instant Mobile Phone Preview</span>
              </div>
              <p className="text-xs font-rajdhani text-slate-200 leading-snug">
                1. Make sure your phone is connected to the same Wi-Fi.
                <br />
                2. Open your phone camera and point it at the QR code.
                <br />
                3. Tap the link to preview and install immediately!
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={mobileUrl}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono-code text-cyan-300 truncate selection:bg-cyan-900"
                />
                <button
                  onClick={handleCopyMobile}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono-code flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Direct 1-Tap Install Option if supported on current device */}
          {isInstallable && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-cyan-950 border border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <div className="text-left">
                <div className="text-xs font-bold font-orbitron text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  1-Tap Instant Install Available
                </div>
                <div className="text-[11px] font-mono-code text-slate-300">
                  This browser can install the app right now.
                </div>
              </div>
              <button
                onClick={handleNativeInstall}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                INSTALL TO THIS DEVICE
              </button>
            </div>
          )}

          {/* Operating System Tabs */}
          <div className="flex border-b border-slate-800 gap-1 text-xs font-orbitron">
            <button
              onClick={() => {
                sound.playClick();
                setActivePlatform('android');
              }}
              className={`flex-1 py-2 text-center rounded-t-lg transition border-b-2 flex items-center justify-center gap-1.5 ${
                activePlatform === 'android'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Android (Chrome / Edge / Samsung)</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActivePlatform('ios');
              }}
              className={`flex-1 py-2 text-center rounded-t-lg transition border-b-2 flex items-center justify-center gap-1.5 ${
                activePlatform === 'ios'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>iPhone / iPad (Safari)</span>
            </button>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="text-xs font-rajdhani text-slate-200 leading-relaxed">
            {activePlatform === 'android' ? (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold font-orbitron text-xs text-cyan-300">
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Android Installation (Chrome or Samsung Internet):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-xs">
                  <li>
                    Open <strong>{mobileUrl}</strong> in Google Chrome on your phone.
                  </li>
                  <li>
                    Tap the <strong>three vertical dots (⋮)</strong> in the top-right corner.
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>).
                  </li>
                  <li>
                    Tap <strong>"Install"</strong> to place the app on your home screen!
                  </li>
                </ol>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-2">
                <div className="flex items-center gap-1.5 font-bold font-orbitron text-xs text-sky-300">
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>iPhone / iPad Installation (Apple Safari):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-xs">
                  <li>
                    Open <strong>{mobileUrl}</strong> in Apple Safari on your iPhone.
                  </li>
                  <li>
                    Tap the <strong>Share button</strong> (square with upward arrow <span className="inline-block px-1 rounded bg-slate-800 text-[10px] font-mono-code border border-slate-700">⎋</span>).
                  </li>
                  <li>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> (<span className="text-cyan-300 font-bold">[+]</span> icon).
                  </li>
                  <li>
                    Tap <strong>"Add"</strong> in the top-right corner.
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono-code text-slate-300">
            <div className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Voice commands ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Background biometric scan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Full-screen standalone app</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowGuide(false);
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-orbitron font-semibold text-xs rounded-xl border border-slate-700 transition"
          >
            CLOSE
          </button>
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      {isInstalled ? (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono-code hover:bg-emerald-900/60 transition shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          title="Running in Standalone Mobile Mode. Click for preview & settings."
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold hidden xs:inline">APP INSTALLED</span>
          <span className="xs:hidden font-bold">INSTALLED</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-emerald-900/90 to-cyan-900/90 hover:from-emerald-800 hover:to-cyan-800 border border-emerald-400/60 text-emerald-200 text-xs font-mono-code transition shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95"
          title="Install as native Mobile App on your phone or view preview"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider">INSTALL ON MOBILE</span>
        </button>
      )}

      {modalContent}
    </>
  );
};
