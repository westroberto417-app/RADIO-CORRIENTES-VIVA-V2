import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, ExternalLink, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const InstallPromptBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Check if dismissed in this session
  useEffect(() => {
    try {
      const wasDismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';
      if (wasDismissed) {
        setDismissed(true);
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  // Do not show if already installed or dismissed
  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('pwa_banner_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const accepted = await install();
        if (accepted) {
          setDismissed(true);
        }
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGenericModal(true);
    }
  };

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <>
      {/* Notice Banner */}
      <div
        id="pwaInstallNoticeBanner"
        role="region"
        aria-label="Aviso de instalación de la aplicación"
        className="w-full px-3 py-1.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0e0c24]/90 border border-pink-500/40 backdrop-blur-xl p-3 shadow-[0_4px_25px_rgba(236,72,153,0.25)] flex items-center justify-between gap-3">
          {/* Subtle neon corner sheen */}
          <div
            className="absolute -top-12 -left-12 w-24 h-24 bg-pink-500/20 rounded-full blur-xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Left: App Logo & Information */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/60 border border-pink-500/30 p-1 shrink-0 shadow-sm flex items-center justify-center">
              <img
                src="/radio-logo.png"
                alt="Radio Corrientes Viva"
                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white tracking-wide truncate">
                  Radio Corrientes Viva
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-pink-500/25 border border-pink-500/30 text-[9px] font-extrabold text-pink-300 uppercase shrink-0">
                  App PWA
                </span>
              </div>
              <p className="text-[11px] text-white/70 truncate">
                Instala la app oficial para escuchar sin cortes
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Custom 'Instalar App' Button */}
            <button
              type="button"
              id="btnCustomInstallApp"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-md shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
              title="Instalar Radio Corrientes Viva en tu dispositivo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App</span>
            </button>

            {/* Dismiss Button */}
            <button
              type="button"
              id="btnDismissInstallNotice"
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Cerrar sugerencia de instalación"
              aria-label="Cerrar sugerencia"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#121026] border border-pink-500/30 p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-pink-400" />
                Instalar en iPhone o iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  Toca el botón <strong className="text-white">Compartir</strong>{' '}
                  <Share className="inline w-4 h-4 text-pink-400" /> en la barra inferior de Safari.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Desliza hacia abajo y selecciona{' '}
                  <strong className="text-white">Añadir a pantalla de inicio</strong>{' '}
                  <PlusSquare className="inline w-4 h-4 text-pink-400" />.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <p>Toca «Añadir» en la esquina superior derecha y la app quedará instalada.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition cursor-pointer shadow-lg shadow-pink-600/30"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Guide Modal if prompt is not immediately available */}
      {showGenericModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowGenericModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#121026] border border-pink-500/30 p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-pink-400" />
                Instalar Aplicación
              </h3>
              <button
                type="button"
                onClick={() => setShowGenericModal(false)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isInIframe ? (
              <div className="mt-4 space-y-4 text-sm text-white/80 leading-relaxed">
                <p>
                  Para instalar la aplicación con su logo oficial y ventana completa independiente,
                  abre el reproductor directamente en tu navegador:
                </p>
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-pink-600/30 text-center"
                >
                  <span>Abrir en pestaña nueva</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="mt-4 space-y-4 text-sm text-white/80 leading-relaxed">
                <p>
                  En Google Chrome para Android, pulsa el menú de opciones (tres puntos <strong className="text-white">⋮</strong>) y selecciona <strong className="text-pink-400">«Instalar aplicación»</strong> o <strong className="text-pink-400">«Agregar a la pantalla principal»</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowGenericModal(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition cursor-pointer shadow-lg shadow-pink-600/30"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
