var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_http = __toESM(require("http"), 1);
var import_https = __toESM(require("https"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/data/newsData.ts
var REGIONAL_NEWS = [
  {
    id: "sm-patronal-2026",
    title: "San Miguel se prepara para la Novena y Fiesta Patronal de San Miguel Arc\xE1ngel",
    summary: "La parroquia San Miguel Arc\xE1ngel y la comunidad parroquial ultiman las celebraciones patronales que comenzar\xE1n este 20 de septiembre. Se espera la tradicional llegada de jinetes, peregrinos de parajes rurales y comunidades de Loreto y Ca\xE1 Cat\xED bajo el lema de fe y esperanza.",
    locality: "San Miguel",
    category: "Comunidad y Fe",
    sourceName: "Portal San Miguel Hoy",
    sourceUrl: "https://diarioepoca.com",
    publishedAt: "17 de septiembre 2026",
    relativeTime: "Hace 3 horas",
    imageUrl: "https://images.unsplash.com/photo-1548625361-195973059db5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sm-ecoturismo-2026",
    title: "Presentan el nuevo Corredor Ecotur\xEDstico de San Miguel y accesos al Iber\xE1",
    summary: "En el marco del 4\xB0 Encuentro de Ecoturismo del Litoral, referentes de turismo de San Miguel expusieron los avances del circuito que conecta el casco urbano con el Portal San Antonio a los Esteros del Iber\xE1, fomentando gu\xEDas locales y posadas de campo.",
    locality: "San Miguel",
    category: "Ecoturismo y Producci\xF3n",
    sourceName: "Red de Medios Iber\xE1",
    sourceUrl: "https://elportaldenoticias.com.ar",
    publishedAt: "16 de septiembre 2026",
    relativeTime: "Ayer",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sm-salud-rural-2026",
    title: "Operativo sanitario y entrega de botiquines en parajes rurales y zona de Monta\xF1a",
    summary: "El \xE1rea de Salud de San Miguel concret\xF3 una intensa jornada de atenci\xF3n primaria en el paraje Monta\xF1a y zonas aleda\xF1as, con vacunaci\xF3n, entrega de medicamentos esenciales y asistencia a familias de productores.",
    locality: "San Miguel",
    category: "Salud P\xFAblica",
    sourceName: "Diario \xC9poca",
    sourceUrl: "https://diarioepoca.com",
    publishedAt: "15 de septiembre 2026",
    relativeTime: "Hace 2 d\xEDas",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sm-colegio-steam-2026",
    title: "Alumnos del Colegio Madariaga de San Miguel clasifican a la Feria STEAM Provincial",
    summary: "Estudiantes secundarios de San Miguel obtuvieron el pase a la instancia provincial de la Feria de Ciencias y Tecnolog\xEDa con una propuesta innovadora de reforestaci\xF3n nativa y cuidado del humedal correntino.",
    locality: "San Miguel",
    category: "Educaci\xF3n",
    sourceName: "Portal San Miguel",
    sourceUrl: "https://elportaldenoticias.com.ar",
    publishedAt: "14 de septiembre 2026",
    relativeTime: "Hace 3 d\xEDas",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cc-peregrinacion-2026",
    title: "Ca\xE1 Cat\xED: Operativo especial y desv\xEDos sobre RP 5 por la Peregrinaci\xF3n Juvenil del NEA",
    summary: "Con motivo del paso masivo de j\xF3venes peregrinos hacia la Bas\xEDlica de Itat\xED, las fuerzas de seguridad y el municipio de Ca\xE1 Cat\xED coordinan puestos de hidrataci\xF3n, banderilleros y control de tr\xE1nsito pesado a lo largo de la Ruta Provincial 5.",
    locality: "Ca\xE1 Cat\xED",
    category: "Tr\xE1nsito y Seguridad",
    sourceName: "Radio Dos Ca\xE1 Cat\xED",
    sourceUrl: "https://radiodos.com.ar",
    publishedAt: "16 de septiembre 2026",
    relativeTime: "Ayer",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cc-documental-2026",
    title: 'Gran recepci\xF3n del documental "Regreso a Ca\xE1 Cat\xED" en homenaje a Las Hermanas Vera',
    summary: "La obra audiovisual que recorre la historia l\xEDrica y po\xE9tica del chamam\xE9 de Ca\xE1 Cat\xED convoc\xF3 a vecinos, m\xFAsicos y tradicionalistas de los departamentos vecinos de San Miguel y General Paz en una emotiva velada cultural.",
    locality: "Ca\xE1 Cat\xED",
    category: "Cultura y Chamam\xE9",
    sourceName: "El Litoral Corrientes",
    sourceUrl: "https://ellitoral.com.ar",
    publishedAt: "15 de septiembre 2026",
    relativeTime: "Hace 2 d\xEDas",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sr-hospital-brif-2026",
    title: "Santa Rosa: Puesta en marcha del Hospital Municipal y base de Bomberos Forestales BRIF",
    summary: 'Tras la inauguraci\xF3n encabezada por autoridades provinciales, el Hospital "Dra. Mar\xEDa del Carmen Casellas" incorpor\xF3 nuevos servicios de guardia las 24 horas y se reforz\xF3 la dotaci\xF3n del cuartel de respuesta inmediata a incendios de pastizales.',
    locality: "Santa Rosa",
    category: "Salud y Emergencias",
    sourceName: "FM Radio Sur Santa Rosa",
    sourceUrl: "https://fmradiosur.com.ar",
    publishedAt: "17 de septiembre 2026",
    relativeTime: "Hace 5 horas",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sr-parque-vial-2026",
    title: "El Municipio de Santa Rosa suma nuevo cami\xF3n volcador 0 km para obras barriales",
    summary: "La intendencia local recibi\xF3 una flamante unidad IVECO 0 km destinada al mejoramiento de calles, desag\xFCes pluviales y recolecci\xF3n diferenciada en los barrios Llamarada, Uni\xF3n y zonas suburbanas.",
    locality: "Santa Rosa",
    category: "Obras P\xFAblicas",
    sourceName: "Prensa Santa Rosa",
    sourceUrl: "https://santarosactes.gob.ar",
    publishedAt: "15 de septiembre 2026",
    relativeTime: "Hace 2 d\xEDas",
    imageUrl: "https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "lor-centro-interpretacion-2026",
    title: "Loreto: Avanza el proyecto del Centro de Interpretaci\xF3n Tur\xEDstica del Portal San Nicol\xE1s",
    summary: "Luego del 209\xB0 aniversario de Loreto, el municipio y Parques provinciales dieron inicio a los relevamientos t\xE9cnicos para el futuro Centro de Atenci\xF3n al Visitante, que integrar\xE1 el Museo de Arte Sacro Guaran\xED y el Museo Mario Bofill.",
    locality: "Loreto",
    category: "Ecoturismo y Patrimonio",
    sourceName: "El Pueblo Noticia Loreto",
    sourceUrl: "https://elpueblonoticia.com.ar",
    publishedAt: "16 de septiembre 2026",
    relativeTime: "Ayer",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "lor-asistencia-rural-2026",
    title: "Operativo de Garrafa Social y garrafas subsidiadas para familias de Loreto",
    summary: "El cronograma provincial de abastecimiento social confirm\xF3 su llegada a Loreto para beneficiar a productores, parajes y jubilados con precios de referencia en gas envasado antes de los primeros frentes fr\xEDos de primavera.",
    locality: "Loreto",
    category: "Servicios a la Comunidad",
    sourceName: "Corrientes al D\xEDa",
    sourceUrl: "https://corrientesaldia.info",
    publishedAt: "14 de septiembre 2026",
    relativeTime: "Hace 3 d\xEDas",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reg-clima-ibera-2026",
    title: "Pron\xF3stico y prevenci\xF3n de incendios para los departamentos San Miguel y Concepci\xF3n",
    summary: "Defensa Civil y el Servicio Meteorol\xF3gico emitieron un reporte especial para la regi\xF3n de los Esteros del Iber\xE1, advirtiendo vientos moderados y recordando la vigencia de la prohibici\xF3n de quema en toda la cuenca centro-norte.",
    locality: "Regi\xF3n Iber\xE1",
    category: "Medio Ambiente",
    sourceName: "Corrientes Hoy",
    sourceUrl: "https://corrienteshoy.com",
    publishedAt: "17 de septiembre 2026",
    relativeTime: "Hace 4 horas",
    imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80"
  }
];

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.get("/sw.js", (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
  res.setHeader("Service-Worker-Allowed", "/");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(import_path.default.join(process.cwd(), "public", "sw.js"));
});
app.get(["/manifest.webmanifest", "/manifest.json"], (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Content-Type", "application/manifest+json; charset=UTF-8");
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(import_path.default.join(process.cwd(), "public", "manifest.webmanifest"));
});
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
var coverArtCache = /* @__PURE__ */ new Map();
var lyricsCache = /* @__PURE__ */ new Map();
var activeLiveTrack = {
  rawTitle: "",
  title: "Transmisi\xF3n En Vivo",
  artist: "Radio Corrientes Viva",
  art: "/default-cover.jpg",
  album: "",
  startedAt: Date.now()
};
var liveHistoryList = [];
async function searchCoverArt(artist, title) {
  const query = `${artist} ${title}`.trim();
  if (!query || artist === "Radio Corrientes Viva") return null;
  const cacheKey = query.toLowerCase();
  if (coverArtCache.has(cacheKey)) {
    return coverArtCache.get(cacheKey);
  }
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0 && data.results[0].artworkUrl100) {
        const highRes = data.results[0].artworkUrl100.replace("100x100bb", "600x600bb");
        coverArtCache.set(cacheKey, highRes);
        return highRes;
      }
    }
  } catch {
  }
  try {
    const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`;
    const dRes = await fetch(deezerUrl, { signal: AbortSignal.timeout(3500) });
    if (dRes.ok) {
      const dData = await dRes.json();
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
  }
  return null;
}
function parseLiveStreamTitle(rawText) {
  let text = (rawText || "").trim();
  text = text.replace(/\.(mp3|wav|aac|ogg|flac)$/i, "").trim();
  let artist = "Radio Corrientes Viva";
  let title = text;
  if (text.includes(" - ")) {
    const parts = text.split(" - ");
    const p0 = parts[0].trim();
    const p1 = parts.slice(1).join(" - ").trim();
    if (/^\d+$/.test(p0)) {
      title = p1;
      artist = "Radio Corrientes Viva";
    } else {
      artist = p0;
      title = p1;
    }
  } else if (text.includes(" by ")) {
    const parts = text.split(" by ");
    title = parts[0].trim();
    artist = parts.slice(1).join(" by ").trim();
  }
  title = title.replace(/^\d+[\.\-\s_]+/, "").trim();
  if (!title || title.toLowerCase() === "radio corrientes viva" || title.toLowerCase() === "radioboss stream") {
    title = "Transmisi\xF3n En Vivo";
    artist = "Radio Corrientes Viva";
  }
  return { artist, title };
}
async function getLiveIcecastData() {
  try {
    const iceRes = await fetch("http://194.163.184.176:8070/status-json.xsl", {
      signal: AbortSignal.timeout(3e3),
      headers: { "User-Agent": "RadioCorrientesViva/2.0" }
    });
    if (iceRes.ok) {
      const iceData = await iceRes.json();
      const icestats = iceData?.icestats;
      if (!icestats) return null;
      let source = icestats.source;
      if (Array.isArray(source)) {
        source = source.find(
          (s) => s.listenurl?.includes("radio.mp3") || s.mount === "/radio.mp3" || s.title
        ) || source[0];
      }
      if (source) {
        const rawTitle = (source.title || source.yp_currently_playing || "").trim();
        return {
          rawTitle,
          listeners: typeof source.listeners === "number" ? source.listeners : 1,
          serverName: source.server_name || "Radio Corrientes Viva",
          bitrate: source.bitrate || 128
        };
      }
    }
  } catch {
  }
  return null;
}
async function getIcyStreamTitle() {
  return new Promise((resolve) => {
    try {
      const req = import_http.default.request(
        "http://194.163.184.176:8070/radio.mp3",
        {
          headers: { "Icy-MetaData": "1", "User-Agent": "RadioLiveChecker/1.0" },
          timeout: 3e3
        },
        (res) => {
          const metaInt = parseInt(res.headers["icy-metaint"], 10);
          if (!metaInt || isNaN(metaInt)) {
            req.destroy();
            return resolve(null);
          }
          let buffer = Buffer.alloc(0);
          res.on("data", (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
            if (buffer.length >= metaInt + 256) {
              const metaLen = buffer[metaInt] * 16;
              if (metaLen > 0 && metaInt + 1 + metaLen <= buffer.length) {
                const metaStr = buffer.slice(metaInt + 1, metaInt + 1 + metaLen).toString("utf8");
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
          res.on("error", () => resolve(null));
        }
      );
      req.on("timeout", () => {
        req.destroy();
        resolve(null);
      });
      req.on("error", () => resolve(null));
      req.end();
    } catch {
      resolve(null);
    }
  });
}
app.get("/api/nowplaying", async (_req, res) => {
  try {
    let liveData = await getLiveIcecastData();
    let rawLiveTitle = liveData?.rawTitle || "";
    if (!rawLiveTitle) {
      const icyTitle = await getIcyStreamTitle();
      if (icyTitle) {
        rawLiveTitle = icyTitle;
      }
    }
    let currentTitle = "Transmisi\xF3n En Vivo";
    let currentArtist = "Radio Corrientes Viva";
    let currentArt = "/default-cover.jpg";
    let stationName = liveData?.serverName || "Radio Corrientes Viva";
    let listeners = liveData?.listeners ?? 1;
    if (rawLiveTitle) {
      const parsed = parseLiveStreamTitle(rawLiveTitle);
      currentTitle = parsed.title;
      currentArtist = parsed.artist;
      const isSongChange = activeLiveTrack.rawTitle !== rawLiveTitle && (activeLiveTrack.title !== currentTitle || activeLiveTrack.artist !== currentArtist);
      if (isSongChange) {
        if (activeLiveTrack.title && activeLiveTrack.title !== "Transmisi\xF3n En Vivo" && activeLiveTrack.title !== "Cargando emisora...") {
          liveHistoryList.unshift({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            song: activeLiveTrack.title,
            artist: activeLiveTrack.artist,
            art: activeLiveTrack.art,
            playedAt: Math.floor(activeLiveTrack.startedAt / 1e3)
          });
          if (liveHistoryList.length > 8) {
            liveHistoryList.length = 8;
          }
        }
        const foundArt = await searchCoverArt(currentArtist, currentTitle);
        currentArt = foundArt || "/default-cover.jpg";
        activeLiveTrack = {
          rawTitle: rawLiveTitle,
          title: currentTitle,
          artist: currentArtist,
          art: currentArt,
          album: "",
          startedAt: Date.now()
        };
      } else {
        currentArt = activeLiveTrack.art || "/default-cover.jpg";
      }
    } else {
      try {
        const azuraRes = await fetch(
          "https://streaming.rf.com.ar/api/nowplaying/radiocorrientesviva",
          { signal: AbortSignal.timeout(3e3) }
        );
        if (azuraRes.ok) {
          const azuraData = await azuraRes.json();
          if (azuraData?.now_playing?.song) {
            const song = azuraData.now_playing.song;
            const parsed = parseLiveStreamTitle(song.title || "");
            currentTitle = parsed.title || song.title;
            currentArtist = song.artist || parsed.artist;
            currentArt = song.art || await searchCoverArt(currentArtist, currentTitle) || "/default-cover.jpg";
            stationName = azuraData.station?.name || stationName;
            listeners = azuraData.listeners?.current ?? listeners;
          }
        }
      } catch {
      }
    }
    return res.json({
      station: {
        name: stationName,
        isLive: true,
        streamer: "",
        listeners,
        streamUrl: "http://194.163.184.176:8070/radio.mp3"
      },
      nowPlaying: {
        title: currentTitle,
        artist: currentArtist,
        album: activeLiveTrack.album || "",
        art: currentArt,
        duration: 0,
        elapsed: 0
      },
      nextSong: null,
      history: liveHistoryList
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Error fetching live stream data" });
  }
});
app.all("/api/stream", (req, res) => {
  req.socket.setTimeout(0);
  req.socket.setKeepAlive(true, 2e3);
  if (res.socket) {
    res.socket.setTimeout(0);
    res.socket.setKeepAlive(true, 2e3);
  }
  if (req.method === "HEAD") {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Accept-Ranges", "none");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
    return res.status(200).end();
  }
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  let isClientClosed = false;
  let activeUpstreamReq = null;
  req.on("close", () => {
    isClientClosed = true;
    if (activeUpstreamReq) {
      activeUpstreamReq.destroy();
      activeUpstreamReq = null;
    }
  });
  const streamSources = [
    "https://streaming.rf.com.ar/listen/radiocorrientesviva/radio.mp3",
    "http://194.163.184.176:8070/radio.mp3"
  ];
  let sourceIndex = 0;
  const connectToUpstream = () => {
    if (isClientClosed || res.writableEnded) return;
    const streamUrl = streamSources[sourceIndex % streamSources.length];
    const isHttps = streamUrl.startsWith("https:");
    const client = isHttps ? import_https.default : import_http.default;
    const proxyReq = client.request(
      streamUrl,
      {
        method: "GET",
        headers: {
          "Icy-MetaData": "0",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) RadioCorrientesViva/2.0"
        }
      },
      (proxyRes) => {
        if (proxyRes.statusCode && proxyRes.statusCode >= 200 && proxyRes.statusCode < 400) {
          proxyRes.on("data", (chunk) => {
            if (!isClientClosed && !res.writableEnded) {
              res.write(chunk);
            }
          });
          proxyRes.on("end", () => {
            if (!isClientClosed && !res.writableEnded) {
              sourceIndex++;
              setTimeout(connectToUpstream, 100);
            }
          });
          proxyRes.on("error", () => {
            if (!isClientClosed && !res.writableEnded) {
              sourceIndex++;
              setTimeout(connectToUpstream, 250);
            }
          });
        } else {
          sourceIndex++;
          setTimeout(connectToUpstream, 500);
        }
      }
    );
    proxyReq.on("error", () => {
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
app.get("/api/lyrics", async (req, res) => {
  const artist = String(req.query.artist || "").trim();
  const title = String(req.query.title || "").trim();
  if (!title) {
    return res.json({ lyrics: null });
  }
  const cacheKey = `${artist} - ${title}`.toLowerCase();
  if (lyricsCache.has(cacheKey)) {
    return res.json({ lyrics: lyricsCache.get(cacheKey) });
  }
  let lyrics = null;
  try {
    const lrcUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(
      artist
    )}&track_name=${encodeURIComponent(title)}`;
    const lrcRes = await fetch(lrcUrl, { signal: AbortSignal.timeout(3500) });
    if (lrcRes.ok) {
      const data = await lrcRes.json();
      lyrics = data.plainLyrics || data.syncedLyrics || null;
    }
  } catch {
  }
  if (!lyrics && artist) {
    try {
      const searchUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(
        title
      )}&artist_name=${encodeURIComponent(artist)}`;
      const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(3500) });
      if (searchRes.ok) {
        const results = await searchRes.json();
        if (Array.isArray(results) && results.length > 0) {
          const hit = results.find((r) => r.plainLyrics || r.syncedLyrics);
          if (hit) lyrics = hit.plainLyrics || hit.syncedLyrics;
        }
      }
    } catch {
    }
  }
  if (!lyrics && artist) {
    try {
      const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(
        title
      )}`;
      const ovhRes = await fetch(ovhUrl, { signal: AbortSignal.timeout(3500) });
      if (ovhRes.ok) {
        const data = await ovhRes.json();
        if (data && data.lyrics) lyrics = data.lyrics;
      }
    } catch {
    }
  }
  lyricsCache.set(cacheKey, lyrics);
  res.json({ lyrics });
});
app.get("/api/news", (req, res) => {
  const locality = req.query.locality;
  const query = req.query.q?.toLowerCase();
  let filtered = [...REGIONAL_NEWS];
  if (locality && locality !== "Todas") {
    filtered = filtered.filter((n) => n.locality.toLowerCase() === locality.toLowerCase());
  }
  if (query) {
    filtered = filtered.filter(
      (n) => n.title.toLowerCase().includes(query) || n.summary.toLowerCase().includes(query) || n.locality.toLowerCase().includes(query) || n.category.toLowerCase().includes(query)
    );
  }
  res.json({ news: filtered });
});
async function startServer() {
  const server = import_http.default.createServer(app);
  server.timeout = 0;
  server.keepAliveTimeout = 0;
  server.headersTimeout = 0;
  server.requestTimeout = 0;
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Radio server listening at http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
