import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { listMusicTracks, type MusicTrack } from '@/lib/music-catalog';

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  isPlaying: boolean;  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  /** 是否將節拍器 BPM 鎖定至當前曲目 BPM */
  syncBpmEnabled: boolean;
  /** 音訊檔案是否載入失敗（佔位期間為 true） */
  audioError: boolean;
}

export interface MusicPlayerActions {
  play: (track: MusicTrack) => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;  setVolume: (vol: number) => void;
  setPlaybackRate: (rate: number) => void;
  next: () => void;
  prev: () => void;
  toggleSyncBpm: () => void;
}

export type MusicPlayerContextValue = MusicPlayerState & MusicPlayerActions;

export const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export default function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [playlist] = useState<MusicTrack[]>(() => listMusicTracks());

  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);  const [volume, setVolumeState] = useState(0.8);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [syncBpmEnabled, setSyncBpmEnabled] = useState(true);
  const [audioError, setAudioError] = useState(false);

  // 同步 audio 元素事件 → React 狀態
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onError = () => {
      setIsPlaying(false);
      setAudioError(true);
      console.warn('[MusicPlayerProvider] audio error – file may not exist yet', audio.src);
    };
    const onCanPlay = () => setAudioError(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('canplay', onCanPlay);
    };
    // volume 変更時也需重新繫結，但只需在掛載時設定一次即可
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 音量變更即時同步至 audio 元素
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // 播放速度變更即時同步至 audio 元素
  useEffect(() => {
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const play = useCallback((track: MusicTrack) => {
    const audio = audioRef.current;
    setAudioError(false);
    setCurrentTrack(track);
    audio.src = track.src;
    audio.currentTime = 0;
    audio.play().then(() => setIsPlaying(true)).catch(() => {
      // 瀏覽器自動播放策略阻擋或檔案不存在
      setIsPlaying(false);
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const seek = useCallback((seconds: number) => {
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);
  const setVolume = useCallback((vol: number) => {
    const clamped = Math.min(1, Math.max(0, vol));
    setVolumeState(clamped);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const clamped = Math.min(2, Math.max(0.5, rate));
    setPlaybackRateState(clamped);
  }, []);

  const next = useCallback(() => {
    if (!currentTrack) return;
    const idx = playlist.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = playlist[(idx + 1) % playlist.length];
    if (nextTrack) play(nextTrack);
  }, [currentTrack, playlist, play]);

  const prev = useCallback(() => {
    if (!currentTrack) return;
    const idx = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = playlist[(idx - 1 + playlist.length) % playlist.length];
    if (prevTrack) play(prevTrack);
  }, [currentTrack, playlist, play]);

  const toggleSyncBpm = useCallback(() => {
    setSyncBpmEnabled((v) => !v);
  }, []);

  // 卸載時釋放 audio
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  const value: MusicPlayerContextValue = {
    currentTrack,
    playlist,
    isPlaying,    currentTime,
    duration,
    volume,
    playbackRate,
    syncBpmEnabled,
    audioError,
    play,
    pause,
    resume,
    seek,
    setVolume,
    setPlaybackRate,
    next,
    prev,
    toggleSyncBpm,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}
