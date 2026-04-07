import { useState } from 'react';
import { Music, Play, ChevronDown, ChevronUp, Footprints, Hand, Mic, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from './useMusicPlayer';
import {
  listMusicTracks,
  type Difficulty,
  type MusicTrack,
  type TrainingType,
} from '@/lib/music-catalog';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '初階',
  intermediate: '中階',
  advanced: '高階',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
  advanced: 'bg-orange-100 text-orange-700 border-orange-200',
};

const TRAINING_ICONS: Record<TrainingType, React.ReactNode> = {
  RAS: <Footprints className="h-3 w-3" />,
  TIMP: <Hand className="h-3 w-3" />,
  MIT: <Mic className="h-3 w-3" />,
  breathing: <Wind className="h-3 w-3" />,
  general: <Music className="h-3 w-3" />,
};

const TRAINING_LABELS: Record<TrainingType, string> = {
  RAS: '步態',
  TIMP: '上肢',
  MIT: '言語',
  breathing: '呼吸',
  general: '通用',
};

interface TrackCardProps {
  track: MusicTrack;
  isActive: boolean;
  onPlay: (track: MusicTrack) => void;
}

function TrackCard({ track, isActive, onPlay }: TrackCardProps) {
  return (
    <button
      type="button"
      onClick={() => onPlay(track)}
      className={`w-full text-left rounded-xl border p-3 transition-all duration-200 group
        ${isActive
          ? 'bg-purple-50 border-purple-300 shadow-md shadow-purple-100'
          : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-sm hover:bg-purple-50/30'
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Play / BPM indicator */}
        <div className={`shrink-0 h-11 w-11 rounded-full flex flex-col items-center justify-center text-[10px] font-bold leading-tight transition-colors
          ${isActive
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-700'
          }`}
        >
          {isActive ? (
            <Play className="h-4 w-4 fill-current" />
          ) : (
            <>
              <span className="text-sm font-black leading-none">{track.bpm}</span>
              <span className="text-[9px] opacity-80">BPM</span>
            </>
          )}
        </div>

        {/* Title / artist */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${isActive ? 'text-purple-700' : 'text-slate-800'}`}>
            {track.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          {/* Training type icons */}
          <div className="flex gap-1 mt-1 text-muted-foreground">
            {track.trainingTypes.slice(0, 3).map((t) => (
              <span
                key={t}
                title={TRAINING_LABELS[t]}
                className="flex items-center gap-0.5 text-[10px] text-slate-400"
              >
                {TRAINING_ICONS[t]}
                <span>{TRAINING_LABELS[t]}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Difficulty + BPM badge */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[track.difficulty]}`}>
            {DIFFICULTY_LABELS[track.difficulty]}
          </span>
          {!isActive && (
            <span className="text-[10px] text-slate-400 font-medium tabular-nums">
              {track.bpm} BPM
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function HomeMusicSection() {
  const [showAll, setShowAll] = useState(false);
  const { currentTrack, play } = useMusicPlayer();

  const allTracks = listMusicTracks();
  const beginnerTracks = allTracks.filter((t) => t.difficulty === 'beginner');
  const displayedTracks = showAll ? allTracks : beginnerTracks;
  const hiddenCount = allTracks.length - beginnerTracks.length;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <Music className="h-4 w-4 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight">音樂治療伴練</h2>
          <p className="text-xs text-muted-foreground">選擇一首適合今日練習的音樂</p>
        </div>
      </div>      {/* Player - shown when a track is selected */}
      {currentTrack && (
        <div className="flex items-center gap-2 px-1 py-2 rounded-xl bg-purple-50 border border-purple-100 text-sm text-purple-700">
          <span className="inline-block h-2 w-2 rounded-full bg-purple-500 animate-pulse shrink-0 ml-1" />
          <span className="font-medium truncate">正在播放：{currentTrack.title}</span>
          <span className="text-xs text-purple-400 shrink-0">— 頁面底部可控制播放</span>
        </div>
      )}

      {/* Track List */}
      <Card className="border-purple-100 shadow-sm overflow-hidden">        {!currentTrack && (
          <CardHeader className="pb-2 pt-4 px-4 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              點擊曲目即可開始播放，頁面底部將出現播放器
            </CardTitle>
          </CardHeader>
        )}        <CardContent className="p-3">
          {currentTrack && (
            <p className="text-xs text-muted-foreground mb-3 px-1">切換曲目（底部播放器可控制播放）：</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayedTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={currentTrack?.id === track.id}
                onPlay={play}
              />
            ))}
          </div>

          {/* Show more / less */}
          {hiddenCount > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs h-8"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 mr-1" />
                    收起進階曲目
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 mr-1" />
                    查看更多曲目（{hiddenCount} 首進階）
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tip */}
      <p className="text-[11px] text-muted-foreground text-center px-2 leading-relaxed">
        💡 音樂 BPM 與節拍器同步，適配各階段的 NMT 神經音樂治療訓練
      </p>
    </section>
  );
}
