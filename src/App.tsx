import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Music,
  Radio,
  Share2,
  Users,
  WifiOff,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { VolumeControl } from './components/VolumeControl';
import { LyricsModal } from './components/LyricsModal';
import { AudioVisualizer } from './components/AudioVisualizer';
import { HistoryList } from './components/HistoryList';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { RadioData, NowPlayingSong, StationInfo, HistoryItem } from './types';

const DEFAULT_COVER = '/default-cover.jpg';
const STREAM_PRIMARY = 'https://streaming.rf.com.ar/listen/radiocorrientesviva/radio.mp3';
const STREAM_PROXY = '/api/stream';

export default function App() {
  const isOnline = useOnlineStatus();

  // Radio state
  const [station, setStation] = useState<StationInfo>({
    name: 'Radio Corrientes Viva',
    isLive: true,
    streamer: '',
    listeners: 0,
    streamUrl: STREAM_PRIMARY,
  });

  const [nowPlaying, setNowPlaying] = useState<NowPlayingSong>({
    title: 'Cargando emisora...',
    artist: 'Radio Corrientes Viva',
    album: '',
    art: DEFAULT_COVER,
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [nextSong, setNextSong] = useState<{ title: string; artist: string } | null>(null);

  // Audio Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('radio_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });

  // Lyrics modal state
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [activeLyrics, setActiveLyrics] = useState<string | null>(null);
  const [lyricsTarget, setLyricsTarget] = useState<{ title: string; artist: string }>({
    title: '',
    artist: '',
  });
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);

  // Shared toast
  const [shareToast, setShareToast] = useState(false);

  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamAttemptRef = useRef<number>(0);

  // Sync volume with audio element and save to localStorage
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    localStorage.setItem('radio_volume', String(newVol));
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  // Fetch Live Metadata from Server
  const fetchMetadata = async () => {
    try {
      const res = await fetch('/api/nowplaying');
      if (!res.ok) return;
      const data: RadioData = await res.json();

      if (data.station) {
        setStation((prev) => ({
          ...prev,
          name: data.station.name || prev.name,
          isLive: data.station.isLive ?? prev.isLive,
          listeners: data.station.listeners ?? prev.listeners,
        }));
      }

      if (data.nowPlaying) {
        const title = data.nowPlaying.title || 'Alabanza en Vivo';
        const artist = data.nowPlaying.artist || 'Radio Corrientes Viva';
        const art = data.nowPlaying.art || DEFAULT_COVER;

        setNowPlaying({
          title,
          artist,
          album: data.nowPlaying.album,
          art,
          duration: data.nowPlaying.duration,
          elapsed: data.nowPlaying.elapsed,
        });

        // Update Document Title
        document.title = `${title} — ${artist} | Radio Corrientes Viva`;

        // Update System Media Session for lockscreen & Bluetooth controls
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title,
            artist,
            album: data.nowPlaying.album || 'Radio Corrientes Viva',
            artwork: [
              { src: art, sizes: '96x96', type: 'image/jpeg' },
              { src: art, sizes: '128x128', type: 'image/jpeg' },
              { src: art, sizes: '192x192', type: 'image/jpeg' },
              { src: art, sizes: '256x256', type: 'image/jpeg' },
              { src: art, sizes: '512x512', type: 'image/jpeg' },
            ],
          });
        }
      }

      if (data.history) {
        setHistory(data.history);
      }

      if (data.nextSong) {
        setNextSong({
          title: data.nextSong.title,
          artist: data.nextSong.artist,
        });
      }
    } catch {
      // Ignore network hiccup
    }
  };

  // Initial metadata fetch & polling every 4 seconds for live song changes
  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 4000);
    return () => clearInterval(interval);
  }, []);

  // Setup MediaSession action handlers
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        handlePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        handlePause();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        handlePause();
      });
    }
  }, []);

  // Audio Playback Controls
  const handlePlay = async () => {
    setPlaybackError(null);
    setIsBuffering(true);

    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.volume = volume;

    // Attach listeners
    audio.onplaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setPlaybackError(null);
    };

    audio.onwaiting = () => {
      setIsBuffering(true);
    };

    audio.onerror = () => {
      setIsBuffering(false);
      setIsPlaying(false);

      // Try fallback if primary proxy fails
      if (streamAttemptRef.current === 0) {
        streamAttemptRef.current = 1;
        audio.src = `${STREAM_PRIMARY}?_t=${Date.now()}`;
        audio.load();
        audio.play().catch(() => {
          setPlaybackError('No se pudo conectar a la señal de streaming. Reintentando...');
        });
      } else {
        setPlaybackError('Error al reproducir la transmisión. Haz clic en el botón de recarga.');
      }
    };

    try {
      // Prioritize HTTPS stream proxy connected to 194.163.184.176:8070
      const streamSource =
        streamAttemptRef.current === 0
          ? `${STREAM_PROXY}?_t=${Date.now()}`
          : `${STREAM_PRIMARY}?_t=${Date.now()}`;

      audio.src = streamSource;
      audio.load();
      await audio.play();
    } catch (err: any) {
      setIsBuffering(false);
      setIsPlaying(false);
      // Not allowed error usually happens when browser blocks autoplay before user gesture
      if (err?.name !== 'AbortError') {
        setPlaybackError('Haz clic para autorizar la reproducción de audio.');
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Drop src to free socket and network bandwidth on mobile
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setIsBuffering(false);
  };

  const togglePlay = () => {
    if (isPlaying || isBuffering) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Open Lyrics modal
  const openLyrics = async (artist: string, title: string) => {
    setLyricsTarget({ title, artist });
    setIsLyricsOpen(true);
    setIsLoadingLyrics(true);
    setActiveLyrics(null);

    try {
      const res = await fetch(
        `/api/lyrics?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`
      );
      if (res.ok) {
        const data = await res.json();
        setActiveLyrics(data.lyrics || null);
      }
    } catch {
      setActiveLyrics(null);
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  // Share Station
  const handleShare = async () => {
    const shareData = {
      title: 'Radio Corrientes Viva | En Vivo',
      text: `Escucha en vivo ${nowPlaying.title} por Radio Corrientes Viva`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Ignored or dismissed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A0A0B] text-white flex flex-col font-['Poppins',sans-serif] selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Radio Studio Background with 65% clarity, soft frosted glass depth and ambient lighting */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Realistic radio broadcasting studio photograph at 65% clarity */}
        <img
          src="/radio-studio-bg.jpg"
          alt="Estudio de Radio"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 brightness-110 contrast-105"
          referrerPolicy="no-referrer"
        />
        {/* Dynamic music album glow blending gently with the studio lights */}
        <div
          id="bgCover"
          style={{ backgroundImage: `url(${nowPlaying.art || DEFAULT_COVER})` }}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 filter blur-[90px] opacity-15 mix-blend-screen"
        />
        {/* 65% clarity studio glass tint (only 35% darkening overlay) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/45" />
        {/* Subtle glass reflection sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.10),rgba(255,255,255,0))]" />
      </div>

      {/* Crystal Glass Filter Overlay with subtle 3-4px diffusion for 65% vivid clarity */}
      <div className="fixed inset-0 z-0 backdrop-blur-[3px] sm:backdrop-blur-[4px] pointer-events-none" aria-hidden="true" />

      {/* Offline Toast Banner */}
      {!isOnline && (
        <div
          role="alert"
          className="relative z-50 bg-amber-500/90 text-black px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 backdrop-blur-md"
        >
          <WifiOff className="w-4 h-4" />
          Sin conexión a internet. La transmisión se reanudará cuando vuelva la red.
        </div>
      )}

      {/* Top Header */}
      <header className="relative z-20 w-full border-b border-white/10 bg-[#0c0d12]/50 backdrop-blur-2xl shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-indigo-600/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 border border-indigo-400/40">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                  Transmisión en Vivo
                </span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                {station.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer border border-white/15 backdrop-blur-md shadow-sm"
              title="Compartir emisora"
              aria-label="Compartir emisora"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <PWAInstallButton />
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md hidden sm:block border border-white/20"
              title="Radio Corrientes Viva"
            />
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-3 sm:pt-4 pb-8 sm:pb-10">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Column 1: Artwork, Song Info & Controls */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            {/* Live Indicator Centered Above Artwork */}
            <div className="w-64 sm:w-72 md:w-80 lg:w-[340px] flex justify-center mb-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-wider text-white shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isPlaying ? 'bg-indigo-400' : 'bg-red-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isPlaying ? 'bg-indigo-400' : 'bg-red-500'
                    }`}
                  />
                </span>
                <span>EN VIVO</span>
              </div>
            </div>

            {/* Cover Art with Signature Ambient Glow & Glass Bevel */}
            <div className="relative group w-64 sm:w-72 md:w-80 lg:w-[340px]">
              <div
                className="absolute -inset-4 bg-indigo-500/25 rounded-[40px] blur-2xl group-hover:bg-indigo-500/35 transition-all duration-700 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className={`relative w-full aspect-square rounded-[32px] overflow-hidden bg-black/40 backdrop-blur-md shadow-2xl border border-white/20 ring-1 ring-white/10 transition-transform duration-500 ${
                  isPlaying ? 'scale-[1.01]' : 'scale-100'
                }`}
              >
                <img
                  id="currentCoverArt"
                  src={nowPlaying.art || DEFAULT_COVER}
                  alt={`${nowPlaying.title} - ${nowPlaying.artist}`}
                  className="w-full h-full object-cover transition-all duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_COVER;
                  }}
                  referrerPolicy="no-referrer"
                />
                {/* Subtle crystal gloss highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/10 pointer-events-none" />
              </div>

              {/* Listener Counter */}
              {station.listeners > 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-[11px] font-medium text-white/90 shadow-lg">
                  <Users className="w-3 h-3 text-indigo-400" />
                  <span>{station.listeners}</span>
                </div>
              )}
            </div>

            {/* Espectralizer suelto abajo de la carátula */}
            <div className="w-64 sm:w-72 md:w-80 lg:w-[340px] mt-2.5 sm:mt-3">
              <AudioVisualizer isPlaying={isPlaying} />
            </div>

            {/* Song Meta Information with enhanced contrast and crisp drop shadow */}
            <div className="mt-4 sm:mt-5 text-center lg:text-left w-full">
              <h2
                id="currentSong"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                title={nowPlaying.title}
              >
                {nowPlaying.title}
              </h2>
              <p
                id="currentArtist"
                className="text-base sm:text-lg text-white/90 font-medium mt-1 line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                title={nowPlaying.artist}
              >
                {nowPlaying.artist}
              </p>

              {nowPlaying.album && (
                <p className="text-xs text-white/70 mt-1 truncate drop-shadow-sm">
                  Álbum: {nowPlaying.album}
                </p>
              )}

              {/* Sector: Transmisión en Vivo con letras llamativas */}
              <div className="mt-4 flex items-center justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 shadow-lg shadow-red-950/20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-red-400">
                    Transmisión en Vivo
                  </span>
                  <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                </div>
              </div>

              {/* Next Song Preview */}
              {nextSong && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-xs text-white/60">
                  <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>A continuación:</span>
                  <span className="text-white font-medium truncate max-w-[200px]">
                    {nextSong.title}
                  </span>
                </div>
              )}
            </div>

            {/* Error Message Toast */}
            {playbackError && (
              <div className="mt-4 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 w-full max-w-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="flex-1">{playbackError}</span>
                <button
                  type="button"
                  onClick={handlePlay}
                  className="p-1 rounded bg-red-500/30 hover:bg-red-500/50 text-white cursor-pointer"
                  title="Reintentar"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Playback Controls Cluster */}
            <div className="mt-7 flex items-center justify-center lg:justify-start gap-6 w-full">
              {/* Volume control with popover */}
              <VolumeControl volume={volume} onChange={handleVolumeChange} />

              {/* Central Play / Pause Button */}
              <button
                id="playerButton"
                type="button"
                onClick={togglePlay}
                disabled={!isOnline}
                aria-label={isPlaying ? 'Pausar transmisión' : 'Reproducir transmisión'}
                className="relative group w-16 h-16 sm:w-20 sm:h-20 bg-white text-black hover:bg-white/90 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 cursor-pointer"
              >
                {isBuffering ? (
                  <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-black" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-black" />
                ) : (
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-black ml-1" />
                )}

                {/* Subtle outer pulse when active */}
                {isPlaying && (
                  <span
                    className="absolute -inset-1 rounded-full border border-indigo-500/40 animate-ping opacity-30 pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Lyrics Button */}
              <button
                type="button"
                onClick={() => openLyrics(nowPlaying.artist, nowPlaying.title)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-indigo-400 border border-white/10 transition-all duration-200 cursor-pointer"
                title="Ver letra de la canción actual"
                aria-label="Letra de la canción"
              >
                <Music className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Column 2: Studio Equalizer & Recently Played History */}
          <div className="lg:col-span-7 flex flex-col justify-center w-full">
            {/* Real-time Spectrum Analyzer Card with crystal frosted glass finish */}
            <div className="bg-white/[0.04] rounded-3xl p-6 sm:p-7 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/40 ring-1 ring-white/5">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  Ecualizador en Tiempo Real
                </h3>
                <span className="text-xs text-white/40 font-mono">194.163.184.176:8070</span>
              </div>
              <AudioVisualizer isPlaying={isPlaying} barCount={24} heightClass="h-32 sm:h-44" />
            </div>

            {/* History List ("Recientemente Reproducido") */}
            <HistoryList
              history={history}
              onSelectSongForLyrics={(artist, song) => openLyrics(artist, song)}
            />
          </div>
        </section>
      </main>

      {/* Footer in Crystal Glass */}
      <footer className="relative z-20 w-full h-24 bg-[#07070a]/60 backdrop-blur-2xl border-t border-white/10 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="font-semibold text-white/80">{station.name}</span>
          <span>• Señal Principal en Directo</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-white/40">
          <span>Icecast MP3</span>
          <span>192 kbps</span>
          <span className="text-indigo-400">© {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Lyrics Modal */}
      <LyricsModal
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        title={lyricsTarget.title}
        artist={lyricsTarget.artist}
        lyrics={activeLyrics}
        isLoading={isLoadingLyrics}
      />

      {/* Share Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2">
          ¡Enlace copiado al portapapeles!
        </div>
      )}
    </div>
  );
}
