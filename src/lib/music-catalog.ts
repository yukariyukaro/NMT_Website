export type TrainingType = "RAS" | "TIMP" | "MIT" | "breathing" | "general";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  /** 音訊來源路徑，指向 public/music/<fileName>.mp3；檔案未就緒時為空字串 */
  src: string;
  durationSecs?: number;
  difficulty: Difficulty;
  trainingTypes: TrainingType[];
  /** 對應 video-catalog 的 category 欄位，用於推薦 */
  recommendedVideoCategories: string[];
}

function buildPublicMusicSrc(fileName: string): string {
  const baseUrl = import.meta.env.BASE_URL;
  const prefix = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  // 檔案未就緒時返回佔位路徑；HTMLAudioElement 觸發 error 事件由 Provider 處理
  return `${prefix}music/${encodeURIComponent(fileName)}`;
}

const MUSIC_CATALOG: MusicTrack[] = [
  {
    id: "fuji-mountain",
    title: "富士山下",
    artist: "陳奕迅",
    bpm: 53,
    src: buildPublicMusicSrc("富士山下.mp3"),
    difficulty: "beginner",
    trainingTypes: ["breathing", "MIT"],
    recommendedVideoCategories: ["呼吸訓練", "言語訓練"],
  },
  {
    id: "red-sun",
    title: "紅日",
    artist: "李克勤",
    bpm: 60,
    src: buildPublicMusicSrc("红日.mp3"),
    difficulty: "beginner",
    trainingTypes: ["breathing", "RAS"],
    recommendedVideoCategories: ["呼吸訓練", "步態訓練"],
  },
  {
    id: "love-is-eternal",
    title: "愛是永恆",
    artist: "張學友",
    bpm: 60,
    src: buildPublicMusicSrc("爱是永恒.mp3"),
    difficulty: "beginner",
    trainingTypes: ["breathing", "RAS"],
    recommendedVideoCategories: ["呼吸訓練", "步態訓練"],
  },
  {
    id: "monica",
    title: "Monica",
    artist: "張國榮",
    bpm: 75,
    src: buildPublicMusicSrc("Monica.mp3"),
    difficulty: "intermediate",
    trainingTypes: ["RAS", "TIMP"],
    recommendedVideoCategories: ["步態訓練", "上肢訓練"],
  },
  {
    id: "boundless-oceans",
    title: "海闊天空",
    artist: "Beyond",
    bpm: 75,
    src: buildPublicMusicSrc("海阔天空.mp3"),
    difficulty: "intermediate",
    trainingTypes: ["RAS", "TIMP"],
    recommendedVideoCategories: ["步態訓練", "上肢訓練"],
  },
  {
    id: "growing-up",
    title: "我們都是這樣長大的",
    artist: "鄭秀文",
    bpm: 80,
    src: buildPublicMusicSrc("我们都是这样长大的.mp3"),
    difficulty: "intermediate",
    trainingTypes: ["RAS", "TIMP"],
    recommendedVideoCategories: ["步態訓練", "下肢訓練"],
  },
  {
    id: "heart-debt",
    title: "心債",
    artist: "梅艷芳",
    bpm: 85,
    src: buildPublicMusicSrc("心债.mp3"),
    difficulty: "intermediate",
    trainingTypes: ["RAS", "TIMP"],
    recommendedVideoCategories: ["步態訓練"],
  },
  {
    id: "chase",
    title: "追",
    artist: "張國榮",
    bpm: 90,
    src: buildPublicMusicSrc("追.mp3"),
    difficulty: "intermediate",
    trainingTypes: ["RAS", "TIMP"],
    recommendedVideoCategories: ["步態訓練"],
  },
  {
    id: "need-you-every-minute",
    title: "分分鐘需要你",
    artist: "張國榮",
    bpm: 115,
    src: buildPublicMusicSrc("分分钟需要你.mp3"),
    difficulty: "advanced",
    trainingTypes: ["RAS"],
    recommendedVideoCategories: ["步態訓練"],
  },
  {
    id: "same-day-next-year",
    title: "明年今日",
    artist: "陳奕迅",
    bpm: 125,
    src: buildPublicMusicSrc("明年今日.mp3"),
    difficulty: "advanced",
    trainingTypes: ["RAS", "general"],
    recommendedVideoCategories: ["步態訓練"],
  },
];

export function listMusicTracks(): MusicTrack[] {
  return MUSIC_CATALOG;
}

export function getMusicByDifficulty(difficulty: Difficulty): MusicTrack[] {
  return MUSIC_CATALOG.filter((t) => t.difficulty === difficulty);
}

export function getMusicForTrainingType(type: TrainingType): MusicTrack[] {
  return MUSIC_CATALOG.filter((t) => t.trainingTypes.includes(type));
}

export function getMusicForVideoCategory(category: string): MusicTrack[] {
  return MUSIC_CATALOG.filter((t) =>
    t.recommendedVideoCategories.includes(category)
  ).sort((a, b) => a.bpm - b.bpm);
}

export function getMusicTrackById(id: string): MusicTrack | undefined {
  return MUSIC_CATALOG.find((t) => t.id === id);
}
