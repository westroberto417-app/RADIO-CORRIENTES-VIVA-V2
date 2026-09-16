export interface StationInfo {
  name: string;
  isLive: boolean;
  streamer: string;
  listeners: number;
  streamUrl: string;
}

export interface NowPlayingSong {
  title: string;
  artist: string;
  album?: string;
  art: string;
  duration?: number;
  elapsed?: number;
}

export interface NextSong {
  title: string;
  artist: string;
  art?: string;
}

export interface HistoryItem {
  id: string | number;
  song: string;
  artist: string;
  art: string;
  playedAt?: number;
}

export interface RadioData {
  station: StationInfo;
  nowPlaying: NowPlayingSong;
  nextSong: NextSong | null;
  history: HistoryItem[];
}
