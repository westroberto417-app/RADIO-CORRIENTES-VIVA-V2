import React from 'react';
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
} from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCast: () => void;
  onOpenLyrics: () => void;
  onOpenHistory: () => void;
  onOpenTimer?: () => void;
  onOpenNews?: () => void;
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
  onShare,
  streamUrl,
}) => {
  if (!isOpen) return null;

  return (
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
              "Porque esta vida la crucé, porque hay esperanza y fe"
            </p>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
              Tu Radio, Tu App, Tu Comunidad
            </p>
          </div>

          {/* Navigation Items */}
          <div className="mt-6 space-y-2">
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
  );
};
