import express, { Request, Response } from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { REGIONAL_NEWS } from './src/data/newsData';

const app = express();
const PORT = 3000;

app.use(express.json());

// Service Worker and Manifest endpoints with explicit PWA headers
app.get('/sw.js', (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(process.cwd(), 'public', 'sw.js'));
});

app.get(['/manifest.webmanifest', '/manifest.json'], (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(process.cwd(), 'public', 'manifest.webmanifest'));
});

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// In-memory cache for artwork and lyrics to avoid hammering third-party APIs
const coverArtCache = new Map<string, string>();
const lyricsCache = new Map<string, string | null>();

interface RadioSong {
  title: string;
  artist: string;
  album?: string;
  art?: string;
}

interface SongHistoryItem {
  id: string | number;
  song: string;
  artist: string;
  art: string;
  playedAt?: number;
}

// In-memory state tracking the current live song and live history
interface LiveTrackState {
  rawTitle: string;
  title: string;
  artist: string;
  art: string;
  album: string;
  startedAt: number;
}

let activeLiveTrack: LiveTrackState = {
  rawTitle: '',
  title: 'Transmisión En Vivo',
  artist: 'Radio Corrientes Viva',
  art: '/default-cover.jpg',
  album: '',
  startedAt: Date.now(),
};

const liveHistoryList: SongHistoryItem[] = [];

// Helper: search iTunes or Deezer for high-res album art
async function searchCoverArt(artist: string, title: string): Promise<string | null> {
  const query = `${artist} ${title}`.trim();
  if (!query || artist === 'Radio Corrientes Viva') return null;

  const cacheKey = query.toLowerCase();
  if (coverArtCache.has(cacheKey)) {
    return coverArtCache.get(cacheKey)!;
  }

  // 1. Try iTunes Search API
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = (await res.json()) as { results?: Array<{ artworkUrl100?: string; collectionName?: string }> };
      if (data.results && data.results.length > 0 && data.results[0].artworkUrl100) {
        const highRes = data.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
        coverArtCache.set(cacheKey, highRes);
        return highRes;
      }
    }
  } catch {
    // Continue to Deezer fallback
  }

  // 2. Try Deezer Search API (extensive catalog for Latin & Christian music)
  try {
    const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`;
    const dRes = await fetch(deezerUrl, { signal: AbortSignal.timeout(3500) });
    if (dRes.ok) {
      const dData = (await dRes.json()) as {
        data?: Array<{
          album?: { cover_big?: string; cover_medium?: string };
          artist?: { picture_big?: string };
        }>;
      };
      if (dData.data && dData.data.length > 0) {
        const item = dData.data[0];
        const art = item.album?.cover_big || item.album?.cover_medium || item.artist?.picture_big;
        if (art) {
          coverArtCache.set(cacheKey, art);
          return art;
        }
      }
    }
  } catch {
    // Both failed
  }

  return null;
}

// Clean and split raw Icecast / stream title into { artist, title }
function parseLiveStreamTitle(rawText: string): { artist: string; title: string } {
  let text = (rawText || '').trim();

  // Strip file extensions like .mp3, .wav
  text = text.replace(/\.(mp3|wav|aac|ogg|flac)$/i, '').trim();

  let artist = 'Radio Corrientes Viva';
  let title = text;

  if (text.includes(' - ')) {
    const parts = text.split(' - ');
    const p0 = parts[0].trim();
    const p1 = parts.slice(1).join(' - ').trim();

    // If first part is a track number (e.g. "06", "13"), treat p1 as title
    if (/^\d+$/.test(p0)) {
      title = p1;
      artist = 'Radio Corrientes Viva';
    } else {
      artist = p0;
      title = p1;
    }
  } else if (text.includes(' by ')) {
    const parts = text.split(' by ');
    title = parts[0].trim();
    artist = parts.slice(1).join(' by ').trim();
  }

  // Strip leading track numbers like "01. ", "13."
  title = title.replace(/^\d+[\.\-\s_]+/, '').trim();

  // If title is empty or just station name
  if (!title || title.toLowerCase() === 'radio corrientes viva' || title.toLowerCase() === 'radioboss stream') {
    title = 'Transmisión En Vivo';
    artist = 'Radio Corrientes Viva';
  }

  return { artist, title };
}

// Helper: Query Icecast directly from 194.163.184.176:8070
async function getLiveIcecastData(): Promise<{
  rawTitle: string;
  listeners: number;
  serverName: string;
  bitrate: number;
} | null> {
  try {
    const iceRes = await fetch('http://194.163.184.176:8070/status-json.xsl', {
      signal: AbortSignal.timeout(3000),
      headers: { 'User-Agent': 'RadioCorrientesViva/2.0' },
    });

    if (iceRes.ok) {
      const iceData = (await iceRes.json()) as any;
      const icestats = iceData?.icestats;
      if (!icestats) return null;

      let source = icestats.source;
      if (Array.isArray(source)) {
        // Pick the mountpoint matching radio.mp3 or the first one with a title
        source =
          source.find(
            (s) =>
              s.listenurl?.includes('radio.mp3') ||
              s.mount === '/radio.mp3' ||
              s.title
          ) || source[0];
      }

      if (source) {
        const rawTitle = (source.title || source.yp_currently_playing || '').trim();
        return {
          rawTitle,
          listeners: typeof source.listeners === 'number' ? source.listeners : 1,
          serverName: source.server_name || 'Radio Corrientes Viva',
          bitrate: source.bitrate || 128,
        };
      }
    }
  } catch {
    // Network or timeout error
  }
  return null;
}

// Helper: Query direct ICY stream metadata from 194.163.184.176:8070/radio.mp3
async function getIcyStreamTitle(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const req = http.request(
        'http://194.163.184.176:8070/radio.mp3',
        {
          headers: { 'Icy-MetaData': '1', 'User-Agent': 'RadioLiveChecker/1.0' },
          timeout: 3000,
        },
        (res: any) => {
          const metaInt = parseInt(res.headers['icy-metaint'], 10);
          if (!metaInt || isNaN(metaInt)) {
            req.destroy();
            return resolve(null);
          }

          let buffer = Buffer.alloc(0);
          res.on('data', (chunk: Buffer) => {
            buffer = Buffer.concat([buffer, chunk]);
            if (buffer.length >= metaInt + 256) {
              const metaLen = buffer[metaInt] * 16;
              if (metaLen > 0 && metaInt + 1 + metaLen <= buffer.length) {
                const metaStr = buffer.slice(metaInt + 1, metaInt + 1 + metaLen).toString('utf8');
                const m = metaStr.match(/StreamTitle='([^']*)'/);
                if (m && m[1]) {
                  req.destroy();
                  return resolve(m[1].trim());
                }
              }
              req.destroy();
              resolve(null);
            }
          });
          res.on('error', () => resolve(null));
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.on('error', () => resolve(null));
      req.end();
    } catch {
      resolve(null);
    }
  });
}

// API: Now Playing & Station Metadata
app.get('/api/nowplaying', async (_req: Request, res: Response) => {
  try {
    // 1. PRIORITY #1: Fetch directly from the LIVE Icecast server (194.163.184.176:8070)
    let liveData = await getLiveIcecastData();
    let rawLiveTitle = liveData?.rawTitle || '';

    // If status-json had no title, try reading directly from ICY stream
    if (!rawLiveTitle) {
      const icyTitle = await getIcyStreamTitle();
      if (icyTitle) {
        rawLiveTitle = icyTitle;
      }
    }

    // Determine current song & artist
    let currentTitle = 'Transmisión En Vivo';
    let currentArtist = 'Radio Corrientes Viva';
    let currentArt = '/default-cover.jpg';
    let stationName = liveData?.serverName || 'Radio Corrientes Viva';
    let listeners = liveData?.listeners ?? 1;

    if (rawLiveTitle) {
      const parsed = parseLiveStreamTitle(rawLiveTitle);
      currentTitle = parsed.title;
      currentArtist = parsed.artist;

      // Check if song changed from previous state
      const isSongChange =
        activeLiveTrack.rawTitle !== rawLiveTitle &&
        (activeLiveTrack.title !== currentTitle || activeLiveTrack.artist !== currentArtist);

      if (isSongChange) {
        // Push previously playing song to history if it had valid info
        if (
          activeLiveTrack.title &&
          activeLiveTrack.title !== 'Transmisión En Vivo' &&
          activeLiveTrack.title !== 'Cargando emisora...'
        ) {
          liveHistoryList.unshift({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            song: activeLiveTrack.title,
            artist: activeLiveTrack.artist,
            art: activeLiveTrack.art,
            playedAt: Math.floor(activeLiveTrack.startedAt / 1000),
          });
          if (liveHistoryList.length > 8) {
            liveHistoryList.length = 8;
          }
        }

        // Search artwork for the new live song
        const foundArt = await searchCoverArt(currentArtist, currentTitle);
        currentArt = foundArt || '/default-cover.jpg';

        // Update active live track state
        activeLiveTrack = {
          rawTitle: rawLiveTitle,
          title: currentTitle,
          artist: currentArtist,
          art: currentArt,
          album: '',
          startedAt: Date.now(),
        };
      } else {
        // Use cached artwork for current track
        currentArt = activeLiveTrack.art || '/default-cover.jpg';
      }
    } else {
      // Fallback only if 194.163.184.176 is completely unreachable:
      // Try AzuraCast API as a secondary fallback
      try {
        const azuraRes = await fetch(
          'https://streaming.rf.com.ar/api/nowplaying/radiocorrientesviva',
          { signal: AbortSignal.timeout(3000) }
        );
        if (azuraRes.ok) {
          const azuraData = (await azuraRes.json()) as any;
          if (azuraData?.now_playing?.song) {
            const song = azuraData.now_playing.song;
            const parsed = parseLiveStreamTitle(song.title || '');
            currentTitle = parsed.title || song.title;
            currentArtist = song.artist || parsed.artist;
            currentArt = song.art || (await searchCoverArt(currentArtist, currentTitle)) || '/default-cover.jpg';
            stationName = azuraData.station?.name || stationName;
            listeners = azuraData.listeners?.current ?? listeners;
          }
        }
      } catch {
        // Ignore fallback error
      }
    }

    return res.json({
      station: {
        name: stationName,
        isLive: true,
        streamer: '',
        listeners,
        streamUrl: 'http://194.163.184.176:8070/radio.mp3',
      },
      nowPlaying: {
        title: currentTitle,
        artist: currentArtist,
        album: activeLiveTrack.album || '',
        art: currentArt,
        duration: 0,
        elapsed: 0,
      },
      nextSong: null,
      history: liveHistoryList,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Error fetching live stream data' });
  }
});

// API: Stream Proxy with infinite keep-alive, resilient reconnection and zero-buffering
app.all('/api/stream', (req: Request, res: Response) => {
  // Disable socket timeouts for continuous radio streaming
  req.socket.setTimeout(0);
  req.socket.setKeepAlive(true, 2000);
  if (res.socket) {
    res.socket.setTimeout(0);
    res.socket.setKeepAlive(true, 2000);
  }

  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'none');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    return res.status(200).end();
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Accel-Buffering', 'no'); // Prevents Cloud Run / reverse proxies from buffering
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  let isClientClosed = false;
  let activeUpstreamReq: http.ClientRequest | null = null;

  req.on('close', () => {
    isClientClosed = true;
    if (activeUpstreamReq) {
      activeUpstreamReq.destroy();
      activeUpstreamReq = null;
    }
  });

  const streamSources = [
    'https://streaming.rf.com.ar/listen/radiocorrientesviva/radio.mp3',
    'http://194.163.184.176:8070/radio.mp3',
  ];
  let sourceIndex = 0;

  const connectToUpstream = () => {
    if (isClientClosed || res.writableEnded) return;

    const streamUrl = streamSources[sourceIndex % streamSources.length];
    const isHttps = streamUrl.startsWith('https:');
    const client = isHttps ? https : http;

    const proxyReq = client.request(
      streamUrl,
      {
        method: 'GET',
        headers: {
          'Icy-MetaData': '0',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RadioCorrientesViva/2.0',
        },
      },
      (proxyRes: http.IncomingMessage) => {
        if (proxyRes.statusCode && proxyRes.statusCode >= 200 && proxyRes.statusCode < 400) {
          proxyRes.on('data', (chunk: Buffer) => {
            if (!isClientClosed && !res.writableEnded) {
              res.write(chunk);
            }
          });

          proxyRes.on('end', () => {
            if (!isClientClosed && !res.writableEnded) {
              // Upstream ended (e.g. Connection: close from Icecast). Auto-reconnect seamlessly without closing res!
              sourceIndex++;
              setTimeout(connectToUpstream, 100);
            }
          });

          proxyRes.on('error', () => {
            if (!isClientClosed && !res.writableEnded) {
              sourceIndex++;
              setTimeout(connectToUpstream, 250);
            }
          });
        } else {
          // Upstream status not ok, try next source
          sourceIndex++;
          setTimeout(connectToUpstream, 500);
        }
      }
    );

    proxyReq.on('error', () => {
      if (!isClientClosed && !res.writableEnded) {
        sourceIndex++;
        setTimeout(connectToUpstream, 500);
      }
    });

    activeUpstreamReq = proxyReq;
    proxyReq.end();
  };

  connectToUpstream();
});

// API: Lyrics Lookup with LRCLIB and lyrics.ovh fallbacks
app.get('/api/lyrics', async (req: Request, res: Response) => {
  const artist = String(req.query.artist || '').trim();
  const title = String(req.query.title || '').trim();

  if (!title) {
    return res.json({ lyrics: null });
  }

  const cacheKey = `${artist} - ${title}`.toLowerCase();
  if (lyricsCache.has(cacheKey)) {
    return res.json({ lyrics: lyricsCache.get(cacheKey) });
  }

  let lyrics: string | null = null;

  // 1. Try LRCLIB
  try {
    const lrcUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(
      artist
    )}&track_name=${encodeURIComponent(title)}`;
    const lrcRes = await fetch(lrcUrl, { signal: AbortSignal.timeout(3500) });
    if (lrcRes.ok) {
      const data: any = await lrcRes.json();
      lyrics = data.plainLyrics || data.syncedLyrics || null;
    }
  } catch {
    // try fallback
  }

  // 2. Try LRCLIB search
  if (!lyrics && artist) {
    try {
      const searchUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(
        title
      )}&artist_name=${encodeURIComponent(artist)}`;
      const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(3500) });
      if (searchRes.ok) {
        const results: any = await searchRes.json();
        if (Array.isArray(results) && results.length > 0) {
          const hit = results.find((r) => r.plainLyrics || r.syncedLyrics);
          if (hit) lyrics = hit.plainLyrics || hit.syncedLyrics;
        }
      }
    } catch {
      // try fallback
    }
  }

  // 3. Try Lyrics.ovh
  if (!lyrics && artist) {
    try {
      const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(
        title
      )}`;
      const ovhRes = await fetch(ovhUrl, { signal: AbortSignal.timeout(3500) });
      if (ovhRes.ok) {
        const data: any = await ovhRes.json();
        if (data && data.lyrics) lyrics = data.lyrics;
      }
    } catch {
      // fallback failed
    }
  }

  lyricsCache.set(cacheKey, lyrics);
  res.json({ lyrics });
});

// Regional News Endpoint (San Miguel, Loreto, Caá Catí, Santa Rosa, Región Iberá)
app.get('/api/news', (req, res) => {
  const locality = req.query.locality as string | undefined;
  const query = (req.query.q as string | undefined)?.toLowerCase();

  let filtered = [...REGIONAL_NEWS];

  if (locality && locality !== 'Todas') {
    filtered = filtered.filter((n: any) => n.locality.toLowerCase() === locality.toLowerCase());
  }

  if (query) {
    filtered = filtered.filter(
      (n: any) =>
        n.title.toLowerCase().includes(query) ||
        n.summary.toLowerCase().includes(query) ||
        n.locality.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query)
    );
  }

  res.json({ news: filtered });
});

async function startServer() {
  const server = http.createServer(app);

  // Configure zero timeouts on Node HTTP server for continuous streaming
  server.timeout = 0;
  server.keepAliveTimeout = 0;
  server.headersTimeout = 0;
  server.requestTimeout = 0;

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Radio server listening at http://localhost:${PORT}`);
  });
}

startServer();
