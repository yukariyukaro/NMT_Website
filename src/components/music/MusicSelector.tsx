import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Music, Footprints, Hand, Wind, Mic } from 'lucide-react';
import { listMusicTracks, getMusicForVideoCategory, type Difficulty, type MusicTrack, type TrainingType } from '@/lib/music-catalog';
import { useMusicPlayer } from './useMusicPlayer';

interface MusicSelectorProps {
  /** 若提供，在列表頂部顯示「適合此訓練」推薦區塊 */
  recommendedCategory?: string;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '初階',
  intermediate: '中階',
  advanced: '高階',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-orange-100 text-orange-700',
};

const TRAINING_ICONS: Record<TrainingType, React.ReactNode> = {
  RAS: <Footprints className="h-3 w-3" />,
  TIMP: <Hand className="h-3 w-3" />,
  MIT: <Mic className="h-3 w-3" />,
  breathing: <Wind className="h-3 w-3" />,
  general: <Music className="h-3 w-3" />,
};

type FilterKey = '全部' | '初階' | '中階' | '高階';

const FILTER_TABS: FilterKey[] = ['全部', '初階', '中階', '高階'];

const FILTER_TO_DIFFICULTY: Record<FilterKey, Difficulty | null> = {
  全部: null,
  初階: 'beginner',
  中階: 'intermediate',
  高階: 'advanced',
};

function TrackRow({ track, isActive }: { track: MusicTrack; isActive: boolean }) {
  const { play } = useMusicPlayer();

  return (
    <button
      type="button"
      onClick={() => play(track)}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors min-h-[52px]
        ${isActive
          ? 'bg-primary/10 border border-primary/30'
          : 'hover:bg-muted/60 border border-transparent'
        }`}
    >
      {/* BPM 圓圈 */}
      <div className={`shrink-0 h-10 w-10 rounded-full flex flex-col items-center justify-center text-[10px] font-bold leading-tight
        ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        <span className="text-sm font-black">{track.bpm}</span>
        <span className="text-[9px] font-medium opacity-80">BPM</span>
      </div>

      {/* 歌名 / 演唱者 */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-base truncate ${isActive ? 'text-primary' : ''}`}>
          {track.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>

      {/* 難度 + 訓練類型圖示 */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[track.difficulty]}`}>
          {DIFFICULTY_LABELS[track.difficulty]}
        </span>
        <div className="flex gap-1 text-muted-foreground">
          {track.trainingTypes.slice(0, 3).map((t) => (
            <span key={t} title={t}>{TRAINING_ICONS[t]}</span>
          ))}
        </div>
      </div>
    </button>
  );
}

export default function MusicSelector({ recommendedCategory }: MusicSelectorProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('全部');
  const { currentTrack } = useMusicPlayer();

  const difficulty = FILTER_TO_DIFFICULTY[activeFilter];
  const allTracks = listMusicTracks();
  const filteredTracks = difficulty ? allTracks.filter((t) => t.difficulty === difficulty) : allTracks;

  const recommendedTracks = recommendedCategory
    ? getMusicForVideoCategory(recommendedCategory)
    : [];

  return (
    <div className="space-y-3">
      {/* 難度篩選 Badge */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {FILTER_TABS.map((tab) => (
          <Badge
            key={tab}
            variant={activeFilter === tab ? 'default' : 'outline'}
            className="whitespace-nowrap cursor-pointer px-3 py-1 text-xs"
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </Badge>
        ))}
      </div>

      {/* 推薦區塊 */}
      {recommendedTracks.length > 0 && activeFilter === '全部' && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
            ✨ 適合此訓練
          </p>
          <div className="space-y-1 rounded-lg border border-dashed border-primary/30 p-1.5">
            {recommendedTracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                isActive={currentTrack?.id === track.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* 完整曲目列表 */}
      <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5">
        {filteredTracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            isActive={currentTrack?.id === track.id}
          />
        ))}
      </div>
    </div>
  );
}
