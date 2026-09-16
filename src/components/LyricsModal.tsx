import React, { useState } from 'react';
import { X, Copy, Check, Music2, Loader2 } from 'lucide-react';

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  artist: string;
  lyrics: string | null;
  isLoading: boolean;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({
  isOpen,
  onClose,
  title,
  artist,
  lyrics,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!lyrics) return;
    navigator.clipboard.writeText(`${title} - ${artist}\n\n${lyrics}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lyricsSongTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-[#0c0d12]/85 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0d12]/60 backdrop-blur-md">
          <div className="min-w-0 pr-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5 text-indigo-400" /> Letra de la canción
            </span>
            <h3 id="lyricsSongTitle" className="text-base font-bold text-white truncate">
              {title}
            </h3>
            <p className="text-xs text-white/50 truncate font-light">{artist}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {lyrics && (
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl text-white/60 hover:text-indigo-400 hover:bg-white/10 transition cursor-pointer"
                title="Copiar letra"
              >
                {copied ? <Check className="w-4 h-4 text-indigo-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Cerrar letra"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-white/90">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/60">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-sm font-medium text-white/70">Buscando letra oficial...</p>
            </div>
          ) : lyrics ? (
            <div className="whitespace-pre-line text-center text-base sm:text-lg font-medium text-white/90 leading-loose">
              {lyrics}
            </div>
          ) : (
            <div className="text-center py-16 text-white/60 space-y-2">
              <Music2 className="w-10 h-10 mx-auto text-white/20" />
              <p className="font-semibold text-white/80">Letra no disponible aún</p>
              <p className="text-xs text-white/40 max-w-xs mx-auto">
                No encontramos la letra oficial para «{title}» de {artist}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-white/10 bg-[#0d0f14] flex items-center justify-between text-xs text-white/50">
          <span>Radio Corrientes Viva</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition cursor-pointer shadow-md shadow-indigo-600/20"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
};
