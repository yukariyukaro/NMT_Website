import { useState, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, ListMusic, X,
  Music, Footprints, Hand, Mic, Wind, Zap,
} from 'lucide-react';
import { useMusicPlayer } from './useMusicPlayer';
import {
  type Difficulty,
  type MusicTrack,
  type TrainingType,
} from '@/lib/music-catalog';

// ─────────────── helpers ───────────────

function formatTime(secs: number): string {
  if (!isFinite(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  beginner:     'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-sky-100    text-sky-700',
  advanced:     'bg-orange-100 text-orange-700',
};
const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: '初階', intermediate: '中階', advanced: '高階',
};
const TRAINING_ICON: Record<TrainingType, React.ReactNode> = {
  RAS:      <Footprints className="h-3 w-3" />,
  TIMP:     <Hand      className="h-3 w-3" />,
  MIT:      <Mic       className="h-3 w-3" />,
  breathing:<Wind      className="h-3 w-3" />,
  general:  <Music     className="h-3 w-3" />,
};

// ─────────────── Vinyl disc ───────────────

function VinylDisc({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="查看歌單"
      className={`relative h-14 w-14 rounded-full shadow-lg flex-shrink-0 flex items-center justify-center
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
                  ${isPlaying ? 'vinyl-spinning' : 'vinyl-paused'}`}
      style={{ background: 'conic-gradient(from 0deg, #1e1b4b, #312e81, #4c1d95, #1e1b4b)' }}
    >
      {/* outer groove ring */}
      <div className="absolute inset-[3px] rounded-full border border-white/10" />
      <div className="absolute inset-[7px] rounded-full border border-white/8" />
      <div className="absolute inset-[11px] rounded-full border border-white/6" />
      {/* center label */}
      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-inner z-10">
        <div className="h-2 w-2 rounded-full bg-white/80" />
      </div>
    </button>
  );
}

// ─────────────── Playlist row ───────────────

function PlaylistTrackRow({ track, isActive }: { track: MusicTrack; isActive: boolean }) {
  const { play } = useMusicPlayer();
  return (
    <button
      type="button"
      onClick={() => play(track)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
        ${isActive
          ? 'bg-purple-50 border-l-2 border-purple-500'
          : 'hover:bg-slate-50 border-l-2 border-transparent'
        }`}
    >      <div className={`shrink-0 h-10 w-10 rounded-full flex flex-col items-center justify-center text-xs font-bold leading-tight
        ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {isActive
          ? <Play className="h-4 w-4 fill-current" />
          : <><span className="text-sm font-black leading-none">{track.bpm}</span><span className="text-[10px]">BPM</span></>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-base font-semibold truncate ${isActive ? 'text-purple-700' : 'text-slate-800'}`}>
          {track.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
      </div>
      <div className="shrink-0 flex items-center gap-1.5">
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${DIFFICULTY_BADGE[track.difficulty]}`}>
          {DIFFICULTY_LABEL[track.difficulty]}
        </span>
        <div className="flex gap-0.5 text-muted-foreground/60">
          {track.trainingTypes.slice(0, 2).map(t => (
            <span key={t} title={t}>{TRAINING_ICON[t]}</span>
          ))}
        </div>
      </div>
    </button>
  );
}

// ─────────────── Main component ───────────────

export default function GlobalMusicBar() {
  const {
    currentTrack, playlist, isPlaying,
    currentTime, duration, volume, playbackRate,
    syncBpmEnabled, audioError,
    pause, resume, seek, setVolume, setPlaybackRate,
    next, prev, toggleSyncBpm,
  } = useMusicPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const progressRef = useRef<HTMLInputElement>(null);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isMuted = volume === 0;

  return (
    <>
      {/* ── Playlist panel (slides up) ── */}      <div
        className={`fixed bottom-[88px] left-0 right-0 z-40 transition-all duration-300 ease-out
          ${showPlaylist ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-2xl mx-auto mx-4 sm:mx-auto bg-white border border-slate-200 rounded-t-2xl shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.12)' }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-2">
              <ListMusic className="h-4 w-4 text-purple-600" />              <span className="text-base font-semibold text-purple-700">歌單</span>
              <span className="text-sm text-muted-foreground">({playlist.length} 首)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPlaylist(false)}
              className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Track list */}
          <div className="max-h-[40vh] overflow-y-auto overscroll-contain">
            {playlist.map(track => (
              <PlaylistTrackRow
                key={track.id}
                track={track}
                isActive={currentTrack.id === track.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom player bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200"
        style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}
      >
        {/* Progress bar (flush at top of bar) */}
        <div className="relative h-1 w-full bg-slate-100 group">
          <div
            className="absolute left-0 top-0 h-full bg-purple-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            ref={progressRef}
            type="range" min={0} max={duration || 100} value={currentTime} step={0.5}
            onChange={e => seek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="進度"
          />
        </div>

        {/* Bar body */}
        <div className="flex items-center gap-3 px-3 md:px-6 h-[84px]">

          {/* ── LEFT: Vinyl + Track info ── */}
          <div className="flex items-center gap-3 w-[28%] min-w-0">
            <VinylDisc isPlaying={isPlaying} onClick={() => setShowPlaylist(v => !v)} />
            <div className="min-w-0 flex-1">              <p className="text-base font-bold text-slate-900 truncate leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-sm text-slate-500 truncate">{currentTrack.artist}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-xs font-bold px-1.5 py-px rounded-full ${DIFFICULTY_BADGE[currentTrack.difficulty]}`}>
                  {DIFFICULTY_LABEL[currentTrack.difficulty]}
                </span>
                <span className="text-xs text-slate-400 font-mono">{currentTrack.bpm} BPM</span>
              </div>
            </div>
          </div>

          {/* ── CENTER: Controls + time ── */}
          <div className="flex-1 flex flex-col items-center gap-0.5">
            {/* Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button" onClick={prev}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="上一首"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={isPlaying ? pause : resume}
                className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all"
                title={isPlaying ? '暫停' : '播放'}
              >
                {isPlaying
                  ? <Pause className="h-5 w-5 fill-current" />
                  : <Play  className="h-5 w-5 fill-current ml-0.5" />
                }
              </button>
              <button
                type="button" onClick={next}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="下一首"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
            {/* Time */}
            <div className="flex items-center gap-1.5 text-sm text-slate-400 font-mono tabular-nums select-none">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
              {audioError && (
                <span className="text-amber-500 ml-1 font-sans">音訊未就緒</span>
              )}
            </div>
          </div>

          {/* ── RIGHT: Speed · Volume · BPM · Playlist ── */}
          <div className="flex items-center gap-2 w-[28%] justify-end">
            {/* Speed buttons */}
            <div className="hidden sm:flex items-center gap-px bg-slate-100 rounded-lg p-0.5">
              {SPEEDS.map(rate => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-1.5 py-1 text-xs font-bold rounded-md transition-colors
                    ${playbackRate === rate
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                    }`}
                  title={`播放速度 ${rate}×`}
                >
                  {rate}×
                </button>
              ))}
            </div>

            {/* BPM sync */}
            <button
              type="button"
              onClick={toggleSyncBpm}
              title={syncBpmEnabled ? 'BPM 同步節拍器（點擊關閉）' : '開啟 BPM 同步節拍器'}
              className={`hidden md:flex h-7 w-7 rounded-full items-center justify-center transition-colors
                ${syncBpmEnabled
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  : 'text-slate-400 hover:bg-slate-100'
                }`}
            >
              <Zap className="h-3.5 w-3.5" />
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVolume(isMuted ? 0.8 : 0)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
                title={isMuted ? '取消靜音' : '靜音'}
              >
                {isMuted
                  ? <VolumeX className="h-4 w-4" />
                  : <Volume2  className="h-4 w-4" />
                }
              </button>
              <input
                type="range" min={0} max={1} step={0.05} value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="w-20 h-1.5 rounded-full appearance-none cursor-pointer accent-purple-500 bg-slate-200"
                aria-label="音量"
              />
            </div>

            {/* Playlist toggle */}
            <button
              type="button"
              onClick={() => setShowPlaylist(v => !v)}
              title="歌單"
              className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors
                ${showPlaylist
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
            >
              <ListMusic className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Backdrop to close playlist */}
      {showPlaylist && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowPlaylist(false)}
          aria-hidden
        />
      )}
    </>
  );
}
