import { Music, Play, Pause, SkipBack, SkipForward, Volume2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMusicPlayer } from './useMusicPlayer';

function formatTime(secs: number): string {
  if (!isFinite(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    syncBpmEnabled,
    audioError,
    pause,
    resume,
    seek,
    setVolume,
    next,
    prev,
    toggleSyncBpm,
  } = useMusicPlayer();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <Card className="shadow-md border-t-4 border-t-purple-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-600">
          <Music className="h-4 w-4" />
          正在播放
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* 歌曲資訊 */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <Music className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {currentTrack.bpm} BPM
          </span>
        </div>

        {/* 音訊未就緒提示 */}
        {audioError && (
          <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
            <RefreshCw className="h-3 w-3 shrink-0" />
            <span>音訊檔案尚未就緒，BPM 已同步至節拍器</span>
          </div>
        )}

        {/* 進度條 */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 bg-muted"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span style={{ width: `${progressPercent.toFixed(0)}%` }} className="sr-only" />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 播放控制 */}
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev} title="上一首">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow"
            onClick={isPlaying ? pause : () => (currentTrack ? resume() : undefined)}
            title={isPlaying ? '暫停' : '播放'}
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next} title="下一首">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* 音量 */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 bg-muted"
          />
        </div>

        {/* BPM 聯動開關 */}
        <button
          type="button"
          onClick={toggleSyncBpm}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors
            ${syncBpmEnabled
              ? 'bg-purple-50 border-purple-200 text-purple-700'
              : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'
            }`}
        >
          <span className="font-medium">🎵 節拍器跟隨音樂</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full
            ${syncBpmEnabled ? 'bg-purple-600 text-white' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
            {syncBpmEnabled ? '開啟' : '關閉'}
          </span>
        </button>
      </CardContent>
    </Card>
  );
}
