import React, { useState } from 'react';
import {
  X,
  Radio,
  MapPin,
  Share2,
  Cast,
  Download,
  ExternalLink,
  MessageCircle,
  Clock,
  Music,
  Timer,
  Newspaper,
  CheckCircle,
  Smartphone,
  Coffee,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCast: () => void;
  onOpenLyrics: () => void;
  onOpenHistory: () => void;
  onOpenTimer?: () => void;
  onOpenNews?: () => void;
  onOpenSupport?: () => void;
  onOpenApk?: () => void;
  onShare: () => void;
  streamUrl: string;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCast,
  onOpenLyrics,
  onOpenHistory,
  onOpenTimer,
  onOpenNews,
  onOpenSupport,
  onOpenApk,
  onShare,
  streamUrl,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  if (!isOpen) return null;

  const handleInstall = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) onClose();
    } else {
      setShowInstallGuide(true);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="menuDrawerTitle"
        className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-lg animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xs h-full bg-[#0d0a21]/85 backdrop-blur-2xl border-r border-pink-500/30 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 flex items-center justify-center p-0.5 drop-shadow-[0_0_12px_rgba(236,72,153,0.7)]">
                  <img
                    src="/radio-logo.png"
                    alt="Radio Corrientes Viva"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h2 id="menuDrawerTitle" className="text-sm font-extrabold text-white tracking-wide">
                    RADIO CORRIENTES VIVA
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] text-pink-400">
                    <MapPin className="w-3 h-3" />
                    <span>San Miguel, Corrientes</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slogan */}
            <div className="mt-4 p-3 rounded-2xl bg-white/[0.04] border border-pink-500/20 text-center">
              <p className="text-xs italic text-pink-300 font-medium">
                "Porque está viva la raíz, porque hay esperanza y fé"
              </p>
              <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
                Tu Radio, Tu App, Tu Comunidad
              </p>
            </div>

            {/* Navigation Items */}
            <div className="mt-5 space-y-2">
              {/* SPOTLIGHT: Direct Native Android APK Download */}
              <div className="p-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                <div className="rounded-[14px] bg-[#0d0a21] p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Smartphone className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>App Android (.APK)</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase">
                            OFICIAL
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-300/80">Instalador nativo (11.2 MB)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <a
                      href="/RadioCorrientesViva.apk"
                      download="RadioCorrientesViva.apk"
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/30 transition cursor-pointer"
                      title="Descargar archivo .apk directo"
                    >
                      <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                      <span>Descargar APK</span>
                    </a>

                    {onOpenApk && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenApk();
                        }}
                        className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition cursor-pointer"
                        title="Ver instrucciones de instalación paso a paso"
                      >
                        Guía
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Install PWA Option / Status */}
              {isInstalled ? (
                <div className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5 text-xs font-semibold text-emerald-300 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>App PWA instalada</span>
                </div>
              ) : (
                <button
                  type="button"
                  id="installPwaDrawerBtn"
                  onClick={handleInstall}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 text-white hover:text-pink-300 border border-white/10 flex items-center justify-between text-xs font-semibold transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-pink-400" />
                    <span>Instalar versión PWA (Web)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white/80 uppercase">
                    PWA
                  </span>
                </button>
              )}


              {onOpenNews && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNews();
                  }}
                  className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 text-white hover:text-pink-300 border border-white/10 flex items-center gap-3 text-xs font-semibold transition"
                >
                  <Newspaper className="w-4 h-4 text-pink-400" />
                  <span>Noticias de San Miguel y Región</span>
                </button>
              )}

              {onOpenSupport && (
                <button
                  type="button"
                  id="menuDrawerSupportBtn"
                  onClick={() => {
                    onClose();
                    onOpenSupport();
                  }}
                  className="w-full px-3.5 py-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-sky-950/40 hover:from-cyan-900/50 hover:to-sky-900/50 text-white border border-cyan-500/40 flex items-center justify-between text-xs font-bold transition shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Apoyá a Nuestra Radio</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    Cafecito
                  </span>
                </button>
              )}

            {onOpenTimer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTimer();
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 text-white hover:text-pink-300 border border-white/10 flex items-center gap-3 text-xs font-semibold transition"
              >
                <Timer className="w-4 h-4 text-pink-400" />
                <span>Temporizador de Apagado</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCast();
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 text-white hover:text-pink-300 border border-white/10 flex items-center gap-3 text-xs font-semibold transition"
            >
              <Cast className="w-4 h-4 text-pink-400" />
              <span>Transmitir a Dispositivos Android</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLyrics();
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 text-white hover:text-pink-300 border border-white/10 flex items-center gap-3 text-xs font-semibold transition"
            >
              <Music className="w-4 h-4 text-pink-400" />
              <span>Ver Letra de Canción en Vivo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHistory();
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 text-white hover:text-pink-300 border border-white/10 flex items-center gap-3 text-xs font-semibold transition"
            >
              <Clock className="w-4 h-4 text-pink-400" />
              <span>Historial de Canciones</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onShare();
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-pink-500/20 text-white hover:text-pink-300 border border-white/10 flex items-center gap-3 text-xs font-semibold transition"
            >
              <Share2 className="w-4 h-4 text-pink-400" />
              <span>Compartir la Emisora</span>
            </button>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-3.5 py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-200 border border-emerald-500/30 flex items-center gap-3 text-xs font-semibold transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp de la Radio</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">Radio Corrientes Viva © 2026</p>
          <p className="text-[10px] text-pink-400/80 font-mono mt-0.5">128 kbps • MP3 Stereo</p>
        </div>
      </div>
    </div>

    {/* Install Guide Modal */}
    {showInstallGuide && (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
        onClick={() => setShowInstallGuide(false)}
      >
        <div
          className="w-full max-w-sm rounded-3xl bg-[#120f26] border border-pink-500/40 p-6 text-white shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-pink-400" />
              Instalar Aplicación
            </h3>
            <button
              type="button"
              onClick={() => setShowInstallGuide(false)}
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5 text-xs text-white/80 leading-relaxed">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <p className="font-semibold text-pink-300 mb-1 flex items-center gap-1.5">
                <span>🤖 En Android (Google Chrome)</span>
              </p>
              <p>
                1. Toca los <strong className="text-white">tres puntos (⋮)</strong> en la esquina superior derecha del navegador.
              </p>
              <p className="mt-1">
                2. Selecciona <strong className="text-white">«Instalar aplicación»</strong> o <strong className="text-white">«Instalar Radio Corrientes Viva»</strong>.
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-amber-300/90 leading-tight">
                <strong>¿Dice "No se puede instalar esta app"? (Xiaomi / Redmi / POCO):</strong>
                <p className="mt-0.5 text-white/70">
                  Ve a <em>Ajustes &gt; Aplicaciones &gt; Chrome &gt; Instalar aplicaciones desconocidas</em> y activa <em>Permitir</em>.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <p className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                <span>🍎 En iPhone / iPad (Safari)</span>
              </p>
              <p>
                1. Toca el botón <strong className="text-white">Compartir</strong> (icono de cuadrado con flecha hacia arriba).
              </p>
              <p className="mt-1">
                2. Elige <strong className="text-white">«Añadir a pantalla de inicio»</strong> y presiona Añadir.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowInstallGuide(false)}
            className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs hover:brightness-110 transition cursor-pointer shadow-lg shadow-pink-500/20"
          >
            Entendido
          </button>
        </div>
      </div>
    )}
  </>
);
};
