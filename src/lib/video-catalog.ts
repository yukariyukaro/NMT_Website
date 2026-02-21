export interface VideoMeta {
  id: string;
  title: string;
  author: string;
  category: string;
  src: string;
  posterSrc?: string;
  description?: string;
  durationLabel?: string;
  viewsLabel?: string;
  dateLabel?: string;
  tags?: string[];
}

function buildPublicVideoSrc(fileName: string) {
  // Ensure we use the correct base path for GitHub Pages deployment
  const baseUrl = import.meta.env.BASE_URL;
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}video/${encodeURIComponent(fileName)}`;
}

const VIDEO_CATALOG: VideoMeta[] = [
  {
    id: 'mit-aeiou',
    title: 'MIT aeiou 咬字訓練',
    author: 'NMT 團隊',
    category: '言語治療',
    src: buildPublicVideoSrc('MIT aeiou咬字訓練.mov'),
  },
  {
    id: 'mit-box-breathing',
    title: 'MIT Box Breathing',
    author: 'NMT 團隊',
    category: '呼吸訓練',
    src: buildPublicVideoSrc('MIT box breathing.mov'),
  },
  {
    id: 'mit-box-breathing-fast',
    title: 'MIT Box Breathing（加快版）',
    author: 'NMT 團隊',
    category: '呼吸訓練',
    src: buildPublicVideoSrc('MIT box breathing加快版.mov'),
  },
  {
    id: 'ras-level-1',
    title: 'RAS Level 1',
    author: 'NMT 團隊',
    category: '步態訓練',
    src: buildPublicVideoSrc('RAS level1.MOV'),
  },
  {
    id: 'ras-level-2',
    title: 'RAS Level 2',
    author: 'NMT 團隊',
    category: '步態訓練',
    src: buildPublicVideoSrc('RAS level2.mov'),
  },
  {
    id: 'ras-level-3',
    title: 'RAS Level 3',
    author: 'NMT 團隊',
    category: '步態訓練',
    src: buildPublicVideoSrc('RAS level3.mov'),
  },
  {
    id: 'ras-level-4',
    title: 'RAS Level 4',
    author: 'NMT 團隊',
    category: '步態訓練',
    src: buildPublicVideoSrc('RAS level4.mov'),
  },
  {
    id: 'timp-hand-level-1',
    title: '手部 TIMP Level 1',
    author: 'NMT 團隊',
    category: '上肢訓練',
    src: buildPublicVideoSrc('手部timp level1.mov'),
  },
  {
    id: 'timp-hand-level-2',
    title: '手部 TIMP Level 2',
    author: 'NMT 團隊',
    category: '上肢訓練',
    src: buildPublicVideoSrc('手部timp level2.mov'),
  },
  {
    id: 'timp-hand-level-3',
    title: '手部 TIMP Level 3',
    author: 'NMT 團隊',
    category: '上肢訓練',
    src: buildPublicVideoSrc('手部timp level3.mov'),
  },
  {
    id: 'timp-foot',
    title: '腳部 TIMP',
    author: 'NMT 團隊',
    category: '下肢訓練',
    src: buildPublicVideoSrc('脚部timp.mov'),
  },
];

export function listVideos() {
  return VIDEO_CATALOG;
}

export function getVideoById(id: string) {
  return VIDEO_CATALOG.find((video) => video.id === id);
}

export function getDefaultVideoId() {
  return VIDEO_CATALOG[0]?.id;
}

export function listVideoCategories() {
  const categories = new Set<string>();
  for (const video of VIDEO_CATALOG) {
    categories.add(video.category);
  }
  return ['全部', ...Array.from(categories)];
}

export function listRelatedVideos(currentId: string, limit = 6) {
  return VIDEO_CATALOG.filter((video) => video.id !== currentId).slice(0, limit);
}

