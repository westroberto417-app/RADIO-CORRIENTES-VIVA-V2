import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Music,
  Radio,
  Share2,
  WifiOff,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Cast,
  Menu,
  Bell,
  Timer,
  Volume2,
  VolumeX,
  Home,
  Newspaper,
  MoreHorizontal,
  X,
  Check,
} from 'lucide-react';
import { VolumeControl } from './components/VolumeControl';
import { LyricsModal } from './components/LyricsModal';
import { CastModal } from './components/CastModal';
import { AudioVisualizer } from './components/AudioVisualizer';
import { HistoryModal } from './components/HistoryModal';
import { SongRequestModal } from './components/SongRequestModal';
import { ListenerChatModal } from './components/ListenerChatModal';
import { MenuDrawer } from './components/MenuDrawer';
import { InstallPromptBanner } from './components/InstallPromptBanner';
import { SleepTimerModal } from './components/SleepTimerModal';
import { NewsModal } from './components/NewsModal';
import { SupportModal } from './components/SupportModal';
import { AnimatedCoffeeIcon } from './components/AnimatedCoffeeIcon';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { RadioData, NowPlayingSong, StationInfo, HistoryItem } from './types';

const DEFAULT_COVER = '/radio-logo.png';
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
    title: 'RADIO CORRIENTES VIVA',
    artist: '"Porque está viva la raíz, porque hay esperanza y fé"',
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
  const [prevVolume, setPrevVolume] = useState<number>(0.8);

  // Modals & Navigation state
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [activeLyrics, setActiveLyrics] = useState<string | null>(null);
  const [lyricsTarget, setLyricsTarget] = useState<{ title: string; artist: string }>({
    title: '',
    artist: '',
  });
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);

  const [isCastOpen, setIsCastOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Sleep Timer Interval Countdown
  useEffect(() => {
    if (sleepTimerRemaining === null || sleepTimerRemaining <= 0) return;

    const timer = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setIsPlaying(false);
          setSleepTimerMinutes(null);
          setActionFeedback('Temporizador finalizado: radio pausada');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerRemaining]);

  const handleSetSleepTimer = (mins: number) => {
    setSleepTimerMinutes(mins);
    setSleepTimerRemaining(mins * 60);
    setIsTimerModalOpen(false);
    setActionFeedback(`Temporizador: apagado en ${mins} min`);
  };

  const handleClearSleepTimer = () => {
    setSleepTimerMinutes(null);
    setSleepTimerRemaining(null);
    setActionFeedback('Temporizador cancelado');
  };

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<'inicio' | 'noticias' | 'apoyar' | 'mas'>('inicio');

  // Audio & Stream Health refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamAttemptRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const isManualPauseRef = useRef<boolean>(false);
  const lastPlaybackProgressRef = useRef<number>(Date.now());
  const lastPositionRef = useRef<number>(-1);
  const reconnectTimeoutRef = useRef<any>(null);

  const handleCast = async () => {
    if (audioRef.current && 'remote' in audioRef.current) {
      try {
        const remote = (audioRef.current as any).remote;
        if (remote && typeof remote.prompt === 'function') {
          await remote.prompt();
          return;
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    setIsCastOpen(true);
  };

  // Sync volume with audio element and save to localStorage
  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    localStorage.setItem('radio_volume', String(clamped));
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      handleVolumeChange(0);
    } else {
      handleVolumeChange(prevVolume > 0 ? prevVolume : 0.8);
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
        const title = data.nowPlaying.title || 'RADIO CORRIENTES VIVA';
        const artist = data.nowPlaying.artist || 'Tu Radio, Tu App, Tu Comunidad.';
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
      // Ignore temporary network issues
    }
  };

  // Initial metadata fetch & polling every 4 seconds for live song changes
  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 4000);
    return () => clearInterval(interval);
  }, []);

  // Keep isPlayingRef and MediaSession playbackState in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  // Handle PWA shortcut actions on initial launch (e.g. "Escuchar en vivo", "Noticias")
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const view = params.get('view');

    if (action === 'play' || params.get('play') === '1') {
      const timer = setTimeout(() => {
        handlePlay();
      }, 400);
      return () => clearTimeout(timer);
    } else if (view === 'news') {
      setIsNewsOpen(true);
    } else if (view === 'history') {
      setIsHistoryOpen(true);
    } else if (view === 'support' || view === 'cafecito') {
      setIsSupportOpen(true);
    }

    if (action || view || params.get('play')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Helper to obtain fresh stream URL with cache-busting timestamp
  // Stream 0: Direct Cloudflare HTTPS (continuous, never terminates with 5-min timeout)
  // Stream 1: Express proxy fallback
  const getStreamUrl = (streamIndex: number) => {
    const base = streamIndex === 0 ? STREAM_PRIMARY : STREAM_PROXY;
    return `${base}?_t=${Date.now()}`;
  };

  // Screen WakeLock to prevent mobile CPU/screen sleep during radio playback
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      }
    } catch {
      // Ignore if not supported or permission denied
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {
      // Ignore
    }
  };

  // Audio Context unlocker: activates real-time background audio thread on Android/MIUI
  const audioContextRef = useRef<AudioContext | null>(null);
  const unlockAudioContext = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current && AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch {
      // Ignore
    }
  };

  // Reconnect audio stream seamlessly if network drops or buffer starves
  const reconnectStream = (switchSource = false) => {
    if (isManualPauseRef.current) return;
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    if (switchSource) {
      streamAttemptRef.current = streamAttemptRef.current === 0 ? 1 : 0;
    }

    setIsBuffering(true);
    const audio = audioRef.current;
    if (!audio) return;

    try {
      const targetUrl = getStreamUrl(streamAttemptRef.current);
      audio.src = targetUrl;
      audio
        .play()
        .then(() => {
          setIsBuffering(false);
          setIsPlaying(true);
          setPlaybackError(null);
          lastPlaybackProgressRef.current = Date.now();
          lastPositionRef.current = audio.currentTime;
          requestWakeLock();
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return;
          console.warn('Playback reconnect failed, retrying in 2.5s...', err);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current && !isManualPauseRef.current) {
              reconnectStream(true);
            }
          }, 2500);
        });
    } catch {
      // Ignore sync throw
    }
  };

  // Stream Health Watchdog: monitors live stream with safety margins (avoids false drops on background tabs)
  useEffect(() => {
    const watchdogInterval = setInterval(() => {
      if (!isPlayingRef.current || isManualPauseRef.current) return;
      const audio = audioRef.current;
      if (!audio) return;

      const currentPos = audio.currentTime;

      if (!audio.paused && !audio.ended) {
        if (currentPos > 0 && currentPos === lastPositionRef.current) {
          // Stream buffer starved for > 16 seconds of verified silence
          if (Date.now() - lastPlaybackProgressRef.current > 16000) {
            console.warn('Live audio stall detected. Auto-reconnecting cleanly...');
            lastPlaybackProgressRef.current = Date.now();
            reconnectStream(false);
          }
        } else {
          lastPositionRef.current = currentPos;
          lastPlaybackProgressRef.current = Date.now();
        }
      } else if (audio.paused && !isManualPauseRef.current) {
        // Audio paused unexpectedly by OS interruption or temporary headphone disconnect
        if (Date.now() - lastPlaybackProgressRef.current > 8000) {
          console.warn('Live audio paused unexpectedly. Resuming playback...');
          lastPlaybackProgressRef.current = Date.now();
          audio.play().catch(() => {
            reconnectStream(false);
          });
        }
      }
    }, 4000);

    return () => clearInterval(watchdogInterval);
  }, []);

  // Visibility and Online change listeners: ensures instant recovery when user returns or network reconnects
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlayingRef.current && !isManualPauseRef.current) {
        const audio = audioRef.current;
        if (audio && audio.paused) {
          console.log('App returned to foreground, ensuring audio playback is active...');
          audio.play().catch(() => {});
        }
      }
    };

    const handleOnline = () => {
      if (isPlayingRef.current && !isManualPauseRef.current) {
        console.log('Network restored to online, refreshing stream...');
        reconnectStream(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
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

  // Configure Audio element and attach robust listeners
  const setupAudioElement = (): HTMLAudioElement => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto'; // Ensures ahead buffering for cellular stability
      audio.crossOrigin = 'anonymous';
      (audio as any).playsInline = true;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.volume = volume;

    audio.onplaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setPlaybackError(null);
      lastPlaybackProgressRef.current = Date.now();
      lastPositionRef.current = audio.currentTime;
      requestWakeLock();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };

    audio.onwaiting = () => {
      if (!isManualPauseRef.current) {
        setIsBuffering(true);
      }
    };

    audio.oncanplay = () => {
      if (isPlayingRef.current && !isManualPauseRef.current) {
        setIsBuffering(false);
      }
    };

    audio.onstalled = () => {
      if (!isManualPauseRef.current && isPlayingRef.current) {
        setIsBuffering(true);
        if (Date.now() - lastPlaybackProgressRef.current > 18000) {
          reconnectStream(false);
        }
      }
    };

    audio.onended = () => {
      // Live radio never ends naturally. Reconnect immediately!
      if (!isManualPauseRef.current && isPlayingRef.current) {
        reconnectStream(false);
      }
    };

    audio.onerror = () => {
      if (isManualPauseRef.current) return;
      setIsBuffering(true);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!isManualPauseRef.current) {
          reconnectStream(true);
        }
      }, 1500);
    };

    return audio;
  };

  // Audio Playback Controls
  const handlePlay = async () => {
    isManualPauseRef.current = false;
    setPlaybackError(null);
    setIsBuffering(true);

    unlockAudioContext();
    requestWakeLock();

    const audio = setupAudioElement();
    audio.volume = volume;

    try {
      // Prioritize direct live Cloudflare HTTPS stream (unlimited duration, zero proxy cutoff)
      const streamSource = getStreamUrl(streamAttemptRef.current);
      audio.src = streamSource;
      await audio.play();
      setIsPlaying(true);
      setIsBuffering(false);
      lastPlaybackProgressRef.current = Date.now();
      lastPositionRef.current = audio.currentTime;
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        // Fallback to secondary stream source
        streamAttemptRef.current = streamAttemptRef.current === 0 ? 1 : 0;
        try {
          audio.src = getStreamUrl(streamAttemptRef.current);
          await audio.play();
          setIsPlaying(true);
          setIsBuffering(false);
        } catch {
          setIsBuffering(false);
          setIsPlaying(false);
          setPlaybackError('Haz clic en el botón de reproducir para escuchar en vivo.');
        }
      } else {
        setIsBuffering(false);
      }
    }
  };

  const handlePause = () => {
    isManualPauseRef.current = true;
    releaseWakeLock();
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setIsBuffering(false);
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    }
  };

  const togglePlay = () => {
    if (isPlaying || isBuffering) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleReconnectLive = () => {
    setActionFeedback('Sincronizando señal en vivo...');
    setTimeout(() => setActionFeedback(null), 2500);
    streamAttemptRef.current = 0; // Prioritize direct live Cloudflare HTTPS stream
    isManualPauseRef.current = false;
    handlePlay();
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
        // Dismissed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070714] text-white flex flex-col font-['Poppins',sans-serif] selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* Radio Studio Background with 50% gentle blur to clearly distinguish the studio photograph */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Realistic radio broadcasting studio photograph - 50% blur for clear studio recognition */}
        <img
          src="/radio-studio-bg.jpg"
          alt="Estudio de Radio"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover object-center scale-105 filter blur-[3.5px] sm:blur-[4.5px] brightness-95 contrast-105 transition-transform duration-1000 transform-gpu"
          referrerPolicy="no-referrer"
        />
        {/* Dynamic music album glow blending gently with the studio lights */}
        <div
          id="bgCover"
          style={{ backgroundImage: `url(${nowPlaying.art || DEFAULT_COVER})` }}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 filter blur-[80px] opacity-35 mix-blend-screen transform-gpu will-change-transform"
        />
        {/* Atmospheric subtle glass tint allowing the studio details to show through */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/30" />
        {/* Subtle glass reflection sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
      </div>

      {/* Offline Toast Banner */}
      {!isOnline && (
        <div
          role="alert"
          className="relative z-50 bg-amber-500 text-black px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 backdrop-blur-md"
        >
          <WifiOff className="w-4 h-4" />
          Sin conexión a internet. La transmisión se reanudará al reconectar.
        </div>
      )}

      {/* Main App Container: Rounded Semi-Dark Border with Transparent Frosted Glassmorphism Base */}
      <div className="relative z-10 w-[calc(100%-14px)] sm:w-full max-w-md mx-auto my-2 sm:my-4 min-h-[calc(100vh-16px)] sm:min-h-[850px] rounded-[36px] sm:rounded-[44px] border-[2.5px] sm:border-[3px] border-black/70 bg-[#09081a]/30 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_45px_rgba(0,0,0,0.65),0_0_50px_rgba(236,72,153,0.15)] flex flex-col justify-between overflow-hidden transform-gpu animate-in fade-in duration-300 ease-out">
        
        {/* Top Header */}
        <header className="pt-4 px-5 pb-2 flex flex-col items-center shrink-0">
          {/* Status bar & Title Row */}
          <div className="w-full flex items-center justify-between">
            {/* Hamburger Menu Button */}
            <button
              type="button"
              id="menuButton"
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Abrir menú"
              title="Menú"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Station Title with Official Logo */}
            <div className="flex items-center gap-2.5">
              <img
                src="/radio-logo.png"
                alt="Logo Radio Corrientes Viva"
                className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(236,72,153,0.7)] transition-transform hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase drop-shadow-sm">
                RADIO CORRIENTES VIVA
              </h1>
            </div>

            {/* Notification / Bell Button */}
            <button
              type="button"
              id="bellButton"
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="relative p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Notificaciones"
              title="Notificaciones de la emisora"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500" />
            </button>
          </div>

          {/* Subtitle Pill Badge: DESDE SAN MIGUEL, CORRIENTES */}
          <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-pink-500/35 text-[11px] font-bold tracking-wider text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
            </span>
            <span className="uppercase">DESDE SAN MIGUEL, CORRIENTES</span>
          </div>
        </header>

        {/* Central Stage: Square Cover + Neon Frame + Symmetrical Waveform */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-2 w-full">
          
          {/* Square Neon Glowing Artwork Card */}
          <div className="relative group my-2 flex items-center justify-center">
            {/* Ambient neon pulse behind the square */}
            <div
              className={`absolute -inset-3 rounded-3xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 blur-xl opacity-60 transition-all duration-700 pointer-events-none transform-gpu will-change-transform ${
                isPlaying ? 'scale-105 opacity-80' : 'scale-95 opacity-40'
              }`}
              aria-hidden="true"
            />

            {/* Dual Neon Glowing Frame Border (Cyan at top-left, Pink at bottom-right) */}
            <div className="relative p-[3.5px] rounded-3xl bg-gradient-to-tr from-[#00e5ff] via-[#a855f7] to-[#ec4899] shadow-[0_0_35px_rgba(236,72,153,0.5),0_0_20px_rgba(0,229,255,0.4)] transform-gpu">
              {/* Inner dark spacer */}
              <div className="p-1 rounded-[22px] bg-[#0b081d]">
                {/* Square image frame */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border border-white/20 shadow-inner bg-black/60 aspect-square">
                  <img
                    id="currentCoverArt"
                    src={nowPlaying.art || DEFAULT_COVER}
                    alt={`${nowPlaying.title} - ${nowPlaying.artist}`}
                    loading="eager"
                    decoding="async"
                    className={`w-full h-full ${
                      !nowPlaying.art || nowPlaying.art === DEFAULT_COVER || nowPlaying.art === '/radio-logo.png'
                        ? 'object-contain p-2'
                        : 'object-cover'
                    } transition-transform duration-700 ${
                      isPlaying ? 'scale-105' : 'scale-100'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_COVER;
                    }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Crystal sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/20 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Symmetrical Musical Spectrum: Exactly matching ESPECTRO MUSICAL.png */}
          <div className="w-full max-w-sm my-1">
            <AudioVisualizer isPlaying={isPlaying} barCount={52} />
          </div>

          {/* Song Metadata Section */}
          <div className="text-center w-full mt-1 space-y-1">
            {/* Tag: AHORA SUENA */}
            <p className="text-xs font-extrabold tracking-widest uppercase text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
              AHORA SUENA
            </p>

            {/* Song Title (Dynamic or Default) */}
            <h2
              id="currentSong"
              className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight line-clamp-1 px-2"
              title={nowPlaying.title}
            >
              {nowPlaying.title || 'RADIO CORRIENTES VIVA'}
            </h2>

            {/* Artist / Slogan (Dynamic or Default) */}
            <p
              id="currentArtist"
              className="text-xs sm:text-sm text-white/70 font-medium line-clamp-1 px-2"
              title={nowPlaying.artist}
            >
              {nowPlaying.artist || 'Tu Radio, Tu App, Tu Comunidad.'}
            </p>

            {/* Badges: 128 kbps & EN VIVO */}
            <div className="pt-1.5 flex items-center justify-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-indigo-500/30 text-[11px] font-semibold text-indigo-300">
                128 kbps
              </span>

              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600/90 to-purple-600/90 backdrop-blur-md text-[11px] font-bold text-white shadow-[0_0_12px_rgba(236,72,153,0.5)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>EN VIVO</span>
              </span>
            </div>
          </div>

          {/* Error Message Toast */}
          {playbackError && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 w-full max-w-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="flex-1 text-[11px]">{playbackError}</span>
              <button
                type="button"
                onClick={handlePlay}
                className="p-1 rounded bg-red-500/30 hover:bg-red-500/50 text-white"
                title="Reintentar"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Action Feedback Toast */}
          {actionFeedback && (
            <div className="mt-2 px-3 py-1.5 rounded-full bg-pink-600 text-white text-[11px] font-bold shadow-lg animate-in fade-in">
              {actionFeedback}
            </div>
          )}

          {/* Controls Section */}
          <div className="w-full max-w-sm mt-3 space-y-3">
            {/* Playback Row: Sleep Timer + Big Gradient Play Button + Share */}
            <div className="flex items-center justify-center gap-8 sm:gap-10">
              {/* Sleep Timer Button (replaces SkipBack) */}
              <button
                type="button"
                onClick={() => setIsTimerModalOpen(true)}
                className={`relative p-2.5 transition cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center ${
                  sleepTimerRemaining !== null && sleepTimerRemaining > 0
                    ? 'text-pink-400'
                    : 'text-white/70 hover:text-white'
                }`}
                title={
                  sleepTimerRemaining !== null && sleepTimerRemaining > 0
                    ? `Temporizador activo: ${Math.ceil(sleepTimerRemaining / 60)}m restantes`
                    : 'Configurar temporizador de apagado'
                }
                aria-label="Temporizador de apagado"
              >
                <Timer className="w-6 h-6" />
                {sleepTimerRemaining !== null && sleepTimerRemaining > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-[9px] font-black text-white shadow-md shadow-pink-500/50 animate-pulse leading-none">
                    {Math.ceil(sleepTimerRemaining / 60)}m
                  </span>
                )}
              </button>

              {/* Big Central Play/Pause Button in Gradient Pink */}
              <button
                id="playerButton"
                type="button"
                onClick={togglePlay}
                disabled={!isOnline}
                aria-label={isPlaying ? 'Pausar transmisión' : 'Reproducir transmisión'}
                className="relative group w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#e11d48] via-[#ec4899] to-[#d946ef] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(236,72,153,0.7)] cursor-pointer"
              >
                {isBuffering ? (
                  <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-white" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white" />
                ) : (
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white ml-1" />
                )}

                {/* Subtle outer pulse when active */}
                {isPlaying && (
                  <span
                    className="absolute -inset-1.5 rounded-full border-2 border-pink-400/50 animate-ping opacity-40 pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Share Button (replaces SkipForward) */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 text-white/70 hover:text-white transition cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Compartir transmisión"
                aria-label="Compartir transmisión"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Horizontal Volume Bar matching PANTALLA DE LA APP.png */}
            <div className="w-full px-2 flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 text-white/80 hover:text-pink-400 transition cursor-pointer shrink-0"
                title={volume === 0 ? 'Activar sonido' : 'Silenciar'}
                aria-label="Control de volumen"
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-pink-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white/90" />
                )}
              </button>

              {/* Progress Slider Track with round white thumb */}
              <div className="relative flex-1 flex items-center h-6 cursor-pointer">
                {/* Background Track */}
                <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>

                {/* White Knob Thumb */}
                <div
                  className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none -translate-x-1/2 transition-transform"
                  style={{ left: `${volume * 100}%` }}
                />

                {/* Range Input for Touch & Click */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Ajustar volumen"
                />
              </div>

              {/* Quick Action: LETRA Button */}
              <button
                type="button"
                onClick={() => openLyrics(nowPlaying.artist, nowPlaying.title)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-pink-500/25 backdrop-blur-md text-white/90 hover:text-pink-300 border border-white/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition shrink-0 cursor-pointer shadow-sm"
                title="Ver letra de la canción actual"
              >
                <Music className="w-3.5 h-3.5 text-pink-400" />
                <span>LETRA</span>
              </button>
            </div>
          </div>
        </main>

        {/* PWA Install Notice Banner (surfaces when browser allows native installation on Android/Desktop) */}
        <InstallPromptBanner />

        {/* Bottom Navigation Bar with 3 Tabs (Glass Transparency) */}
        <nav
          aria-label="Navegación principal"
          className="mt-2 mx-3 mb-3 p-2 rounded-3xl bg-black/35 sm:bg-[#0e0c24]/40 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/50 flex items-center justify-around"
        >
          {/* Tab 1: Inicio */}
          <button
            type="button"
            onClick={() => setActiveTab('inicio')}
            className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition cursor-pointer ${
              activeTab === 'inicio'
                ? 'text-pink-400'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-bold">Inicio</span>
          </button>

          {/* Tab 2: Noticias (Sistema de Noticias Regionales) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('noticias');
              setIsNewsOpen(true);
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition cursor-pointer ${
              activeTab === 'noticias'
                ? 'text-pink-400'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Newspaper className="w-5 h-5" />
            <span className="text-[11px] font-bold">Noticias</span>
          </button>

          {/* Tab 3: Apoyar / Cafecito (Tacita de café animada) */}
          <button
            type="button"
            id="bottomNavSupportBtn"
            onClick={() => {
              setActiveTab('apoyar');
              setIsSupportOpen(true);
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition cursor-pointer relative group ${
              activeTab === 'apoyar' || isSupportOpen
                ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]'
                : 'text-white/50 hover:text-cyan-300'
            }`}
            title="Apoyá a Nuestra Radio (Doná un cafecito)"
          >
            <AnimatedCoffeeIcon
              className="w-5 h-5 text-cyan-400"
              isActive={activeTab === 'apoyar' || isSupportOpen}
            />
            <span className="text-[11px] font-bold">Apoyar</span>
          </button>

          {/* Tab 4: Más */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('mas');
              setIsMenuOpen(true);
            }}
            className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition cursor-pointer ${
              activeTab === 'mas'
                ? 'text-pink-400'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[11px] font-bold">Más</span>
          </button>
        </nav>
      </div>

      {/* Notifications Popover */}
      {isNotificationsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsNotificationsOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-[#0e0c24] border border-pink-500/30 p-5 shadow-2xl space-y-3 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
                <Bell className="w-4 h-4" />
                <span>Notificaciones</span>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-white/80">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="font-bold text-pink-300">¡Estamos En Vivo!</p>
                <p className="text-[11px] text-white/60">
                  Transmitiendo las 24 hs desde San Miguel, Corrientes.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="font-bold text-pink-300">Calidad Stereo HD</p>
                <p className="text-[11px] text-white/60">
                  Transmisión a 128 kbps de alta fidelidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Menu Drawer (Top-left hamburger) */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenCast={handleCast}
        onOpenLyrics={() => openLyrics(nowPlaying.artist, nowPlaying.title)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTimer={() => setIsTimerModalOpen(true)}
        onOpenNews={() => setIsNewsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onShare={handleShare}
        streamUrl={station.streamUrl}
      />

      {/* Lyrics Modal */}
      <LyricsModal
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        title={lyricsTarget.title}
        artist={lyricsTarget.artist}
        lyrics={activeLyrics}
        isLoading={isLoadingLyrics}
      />

      {/* Cast Modal (Transmitir a Android) */}
      <CastModal
        isOpen={isCastOpen}
        onClose={() => setIsCastOpen(false)}
        audioElement={audioRef.current}
        streamUrl={station.streamUrl}
      />

      {/* Song Request Modal */}
      <SongRequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
      />

      {/* Listener Chat Modal */}
      <ListenerChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Song History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onOpenLyrics={(artist, title) => openLyrics(artist, title)}
      />

      {/* Sistema de Noticias Regionales (San Miguel, Loreto, Caá Catí, Santa Rosa) */}
      <NewsModal
        isOpen={isNewsOpen}
        onClose={() => {
          setIsNewsOpen(false);
          setActiveTab('inicio');
        }}
      />

      {/* Pantalla Apoyá a Nuestra Radio (Mercado Pago, Cafecito & WhatsApp) */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => {
          setIsSupportOpen(false);
          setActiveTab('inicio');
        }}
      />

      {/* Temporizador de Apagado (Sleep Timer) */}
      <SleepTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        activeMinutes={sleepTimerMinutes}
        remainingSeconds={sleepTimerRemaining}
        onSetTimer={handleSetSleepTimer}
        onClearTimer={handleClearSleepTimer}
      />

      {/* Share Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-20 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-full bg-pink-600 text-white font-semibold text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2">
          ¡Enlace copiado al portapapeles!
        </div>
      )}
    </div>
  );
}
