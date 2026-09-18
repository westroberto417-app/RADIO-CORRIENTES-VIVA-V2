import React from 'react';
import { Clock, X, Music, Radio, Sparkles } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onOpenLyrics: (artist: string, title: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onOpenLyrics,
}) => {
  if (!isOpen) return null;

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="historyModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[#0e0c24] border border-pink-500/30 shadow-2xl shadow-pink-950/50 p-5 flex flex-col max-h-[85vh] ring-1 ring-pink-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="historyModalTitle" className="text-base font-bold text-white">
                Canciones Recientes
              </h2>
              <p className="text-[11px] text-pink-300/70">
                Historial de temas emitidos por Radio Corrientes Viva
              </p>
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

        <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-white/50 text-xs">
              Cargando historial de temas...
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={`${item.song?.id || index}-${index}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] hover:bg-pink-500/10 border border-white/10 transition group"
              >
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                  <img
                    src={item.song?.art || '/default-cover.jpg'}
                    alt={item.song?.title || 'Canción'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-cover.jpg';
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-pink-300 transition">
                    {item.song?.title || 'Tema musical'}
                  </p>
                  <p className="text-[11px] text-white/50 truncate">
                    {item.song?.artist || 'Radio Corrientes Viva'}
                  </p>
                </div>

                {item.played_at && (
                  <span className="text-[10px] text-pink-400/80 font-mono shrink-0">
                    {formatTimestamp(item.played_at)}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() =>
                    onOpenLyrics(item.song?.artist || '', item.song?.title || '')
                  }
                  title="Ver letra"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-pink-500/20 text-white/60 hover:text-pink-300 transition shrink-0"
                >
                  <Music className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
