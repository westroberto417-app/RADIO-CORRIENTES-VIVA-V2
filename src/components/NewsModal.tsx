import React, { useState, useMemo } from 'react';
import { Newspaper, X, Search, MapPin, Share2, ExternalLink, RefreshCw, Sparkles, Calendar, Tag } from 'lucide-react';
import { RegionalNewsItem } from '../types';
import { REGIONAL_NEWS } from '../data/newsData';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
  const [selectedLocality, setSelectedLocality] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newsList, setNewsList] = useState<RegionalNewsItem[]>(REGIONAL_NEWS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const localities = ['Todas', 'San Miguel', 'Caá Catí', 'Santa Rosa', 'Loreto', 'Región Iberá'];

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      const matchesLocality =
        selectedLocality === 'Todas' ||
        item.locality.toLowerCase() === selectedLocality.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.locality.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q);

      return matchesLocality && matchesSearch;
    });
  }, [newsList, selectedLocality, searchQuery]);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (data.news && Array.isArray(data.news)) {
          setNewsList(data.news);
        }
      }
    } catch {
      // Keep existing data
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleShareNews = async (item: RegionalNewsItem) => {
    const shareText = `*${item.title}*\n📍 ${item.locality} — ${item.publishedAt}\n${item.summary}\n\n📻 Vía Radio Corrientes Viva`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // dismissed
      }
    }
    await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getLocalityColor = (loc: string) => {
    switch (loc) {
      case 'San Miguel':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      case 'Caá Catí':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Santa Rosa':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Loreto':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] rounded-[36px] bg-[#0c0920]/95 backdrop-blur-2xl border border-pink-500/30 shadow-[0_0_60px_rgba(236,72,153,0.35)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 shadow-lg shadow-pink-500/30">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 id="newsModalTitle" className="text-lg font-bold text-white tracking-wide">
                  Noticias Regionales
                </h2>
                <p className="text-xs text-pink-300 font-medium">
                  San Miguel, Loreto, Caá Catí, Santa Rosa y zonas aledañas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRefresh}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Actualizar noticias"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-pink-400' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Cerrar noticias"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Timeframe Banner */}
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Novedades e informaciones de los últimos 5 días
            </span>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-[10px] font-bold text-pink-300">
              En tiempo real
            </span>
          </div>

          {/* Search Input */}
          <div className="relative mt-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar noticias, localidades, eventos..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Locality Filter Chips */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {localities.map((loc) => {
              const isActive = selectedLocality === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocality(loc)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-sm'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* News List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-white/5">
          {filteredNews.length === 0 ? (
            <div className="py-12 text-center text-white/50">
              <Newspaper className="w-10 h-10 mx-auto mb-2 text-white/20" />
              <p className="text-sm font-semibold">No se encontraron noticias con ese criterio.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedLocality('Todas');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold hover:bg-pink-500/30 transition"
              >
                Ver todas las noticias
              </button>
            </div>
          ) : (
            filteredNews.map((item) => (
              <article
                key={item.id}
                className="pt-3.5 first:pt-0 group flex flex-col gap-2.5 rounded-2xl p-3 hover:bg-white/[0.03] transition border border-transparent hover:border-white/10"
              >
                {/* Meta Row: Locality badge, Category & Time */}
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getLocalityColor(
                        item.locality
                      )}`}
                    >
                      <MapPin className="w-3 h-3" />
                      {item.locality}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-white/50 font-medium">
                      <Tag className="w-3 h-3 text-white/40" />
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[11px] text-pink-300/90 font-medium">
                    {item.relativeTime} • {item.publishedAt}
                  </span>
                </div>

                {/* News Title */}
                <h3 className="text-base font-bold text-white group-hover:text-pink-200 transition leading-snug">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-white/75 leading-relaxed font-normal">
                  {item.summary}
                </p>

                {/* Source & Actions Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-white/40">Fuente:</span>
                    <span className="font-semibold text-white/80 text-[11px]">
                      {item.sourceName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share News Button */}
                    <button
                      type="button"
                      onClick={() => handleShareNews(item)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 text-white/80 hover:text-pink-300 border border-white/10 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                      title="Compartir noticia"
                    >
                      <Share2 className="w-3 h-3 text-pink-400" />
                      <span>{copiedId === item.id ? '¡Copiado!' : 'Compartir'}</span>
                    </button>

                    {/* External Link */}
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg text-white/50 hover:text-white transition cursor-pointer"
                        title="Ver en portal oficial"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-black/40 border-t border-white/10 text-center text-[10px] text-white/40 shrink-0">
          Servicio informativo regional — Radio Corrientes Viva 99.7 FM
        </div>
      </div>
    </div>
  );
};
