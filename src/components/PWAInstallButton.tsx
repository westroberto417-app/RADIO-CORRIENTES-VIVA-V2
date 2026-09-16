import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowGenericGuide(true);
    }
  };

  return (
    <>
      <button
        id="installPwaBtn"
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 hover:border-indigo-500/40 shadow-sm hover:shadow-indigo-500/20 backdrop-blur-md cursor-pointer"
        title="Instalar como aplicación en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5 text-indigo-400" />
        <span>Instalar App</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#121214] border border-white/10 p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-400" />
                Instalar en iPhone / iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  Toca el botón <strong className="text-white">Compartir</strong>{' '}
                  <Share className="inline w-4 h-4 text-indigo-400" /> en la barra inferior de Safari.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Desliza hacia abajo y selecciona{' '}
                  <strong className="text-white">Añadir a pantalla de inicio</strong>{' '}
                  <PlusSquare className="inline w-4 h-4 text-indigo-400" />.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <p>Toca «Añadir» en la esquina superior derecha y listo.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Android Guide if prompt is waiting */}
      {showGenericGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowGenericGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#121214] border border-white/10 p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-400" />
                Instalar Aplicación
              </h3>
              <button
                type="button"
                onClick={() => setShowGenericGuide(false)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isInIframe ? (
              <div className="mt-4 space-y-4 text-sm text-white/80 leading-relaxed">
                <p>
                  Estás viendo el reproductor dentro del editor de desarrollo. Si instalas desde la barra de tu navegador en esta pantalla, se instalará el entorno de programación de Google en vez de la radio.
                </p>
                <p className="text-xs text-white/60">
                  Para instalar la radio con su logo oficial y abrirla a pantalla completa como una aplicación independiente:
                </p>
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 text-center"
                >
                  <span>Abrir reproductor en pestaña nueva</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-white/80 leading-relaxed">
                  Puedes instalar este reproductor directamente desde la barra de direcciones de tu navegador
                  haciendo clic en el icono de instalación o seleccionando{' '}
                  <strong className="text-indigo-400">«Instalar Radio Corrientes Viva»</strong> en el menú del navegador.
                </p>
                <button
                  type="button"
                  onClick={() => setShowGenericGuide(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition cursor-pointer shadow-lg shadow-indigo-600/30"
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
