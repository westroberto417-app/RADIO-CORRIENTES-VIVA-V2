import React from 'react';
import { Clock, Music, FileText, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelectSongForLyrics?: (artist: string, song: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectSongForLyrics,
}) => {
  if (!history || history.length === 0) {
    return null;
  }

  const formatPlayedAt = (timestamp?: number) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <section className="w-full bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl shadow-black/40 ring-1 ring-white/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          Recientemente Reproducido
        </h2>
        <span className="text-[11px] text-indigo-300 font-medium bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-400/30 backdrop-blur-md">
          En vivo
        </span>
      </div>

      <div className="space-y-3">
        {history.map((item, index) => {
          const timeStr = formatPlayedAt(item.playedAt);
          return (
            <article
              key={`${item.id}-${index}`}
              className="group flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 hover:border-indigo-500/40 transition-all duration-200 shadow-sm"
            >
              {/* Thumbnail */}
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10 shadow-md">
                <img
                  src={item.art || '/default-cover.jpg'}
                  alt={`${item.song} - ${item.artist}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-cover.jpg';
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                  {item.song || 'Canción'}
                </div>
                <div className="text-xs text-white/50 truncate font-light">
                  {item.artist || 'Radio Corrientes Viva'}
                </div>
              </div>

              {/* Time / Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {timeStr && (
                  <span className="text-[11px] text-white/30 font-mono hidden sm:inline-block mr-1">
                    {timeStr}
                  </span>
                )}

                {onSelectSongForLyrics && (
                  <button
                    type="button"
                    onClick={() => onSelectSongForLyrics(item.artist, item.song)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-indigo-400 hover:bg-white/10 transition cursor-pointer"
                    title={`Ver letra de ${item.song}`}
                    aria-label={`Ver letra de ${item.song}`}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${item.artist} ${item.song}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Buscar video en YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
