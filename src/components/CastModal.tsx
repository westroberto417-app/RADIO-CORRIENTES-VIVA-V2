import React, { useState } from 'react';
import { Cast, X, Smartphone, Tv, Volume2, Copy, Check, ExternalLink, Wifi } from 'lucide-react';

interface CastModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioElement: HTMLAudioElement | null;
  streamUrl: string;
}

export const CastModal: React.FC<CastModalProps> = ({
  isOpen,
  onClose,
  audioElement,
  streamUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [promptMessage, setPromptMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerNativeCast = async () => {
    setPromptMessage(null);
    if (audioElement && 'remote' in audioElement) {
      try {
        const remote = (audioElement as any).remote;
        if (remote && typeof remote.prompt === 'function') {
          await remote.prompt();
          setPromptMessage('¡Conexión iniciada con el dispositivo seleccionado!');
          return;
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // User dismissed picker
          return;
        }
        console.warn('Remote playback error:', err);
      }
    }

    setPromptMessage(
      'Usa el menú de opciones (⋮) de tu navegador Chrome o la opción "Emitir / Smart View" de la barra de tu teléfono Android.'
    );
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(streamUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy stream url:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="castModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[#0c0d12]/90 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0d12]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/90 flex items-center justify-center border border-indigo-400/40 shadow-md shadow-indigo-600/30">
              <Cast className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="castModalTitle" className="text-sm sm:text-base font-bold text-white">
                Transmitir a Dispositivos Android
              </h2>
              <p className="text-[11px] text-white/50">
                Chromecast, Smart TV, Google Nest y Parlantes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-white/80 max-h-[75vh] overflow-y-auto">
          {/* Action button: native trigger */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Wifi className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-xs sm:text-sm">
                  Detectar dispositivos cercanos
                </p>
                <p className="text-[11px] text-indigo-300/80">
                  Transmite el audio directamente por Wi-Fi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTriggerNativeCast}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
            >
              <Cast className="w-4 h-4" />
              <span>Conectar dispositivo</span>
            </button>
          </div>

          {promptMessage && (
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-indigo-300">
              {promptMessage}
            </div>
          )}

          {/* Guide for Android */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Opciones de transmisión en Android:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Chrome Cast */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Tv className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-xs">Smart TV / Chromecast</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  En Chrome, toca los tres puntos <strong>(⋮)</strong> arriba y elige <strong>«Transmitir»</strong>.
                </p>
              </div>

              {/* Option 2: Smart View / Screen Mirroring */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-xs">Smart View / Panel</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Baja la barra de notificaciones de tu Android y pulsa <strong>«Emitir / Smart View»</strong>.
                </p>
              </div>

              {/* Option 3: Bluetooth */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-xs">Parlantes Bluetooth</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Conecta tu celular a cualquier parlante o equipo para escuchar en alta fidelidad.
                </p>
              </div>
            </div>
          </div>

          {/* Direct Stream Link Copy for Apps */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs text-white/60">Enlace directo de streaming:</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar URL'}</span>
              </button>
            </div>
            <p className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-white/50 truncate select-all">
              {streamUrl}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-white/10 bg-[#0c0d12]/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition cursor-pointer"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
};
