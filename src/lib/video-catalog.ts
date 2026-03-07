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
  const prefix = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${prefix}video/${encodeURIComponent(fileName)}`;
}

const VIDEO_CATALOG: VideoMeta[] = [
  {
    id: "mit-aeiou",
    title: "旋律語調療法 (MIT) 咬字訓練",
    author: "隨音而衡團隊",
    category: "言語訓練",
    src: buildPublicVideoSrc("MIT咬字訓練.MOV"),
  },
  {
    id: "mit-box-breathing",
    title: "旋律語調療法 (MIT) 呼吸訓練 階段一",
    author: "隨音而衡團隊",
    category: "呼吸訓練",
    src: buildPublicVideoSrc("MIT呼吸訓練 level1.MOV"),
  },
  {
    id: "mit-box-breathing-fast",
    title: "旋律語調療法 (MIT) 呼吸訓練 階段二",
    author: "隨音而衡團隊",
    category: "呼吸訓練",
    src: buildPublicVideoSrc("MIT呼吸訓練 level2.MOV"),
  },
  {
    id: "ras-level-1",
    title: "節律性聽覺刺激 (RAS) 階段一",
    author: "隨音而衡團隊",
    category: "步態訓練",
    src: buildPublicVideoSrc("RAS level1.MOV"),
  },
  {
    id: "ras-level-2",
    title: "節律性聽覺刺激 (RAS) 階段二",
    author: "隨音而衡團隊",
    category: "步態訓練",
    src: buildPublicVideoSrc("RAS level2.MOV"),
  },
  {
    id: "ras-level-3",
    title: "節律性聽覺刺激 (RAS) 階段三",
    author: "隨音而衡團隊",
    category: "步態訓練",
    src: buildPublicVideoSrc("RAS level3.MOV"),
  },
  {
    id: "ras-level-4",
    title: "節律性聽覺刺激 (RAS) 階段四",
    author: "隨音而衡團隊",
    category: "步態訓練",
    src: buildPublicVideoSrc("RAS level4.MOV"),
  },
  {
    id: "timp-hand-level-1",
    title: "手部音樂肌能節奏訓練 (TIMP) 階段一",
    author: "隨音而衡團隊",
    category: "上肢訓練",
    src: buildPublicVideoSrc("timp 手部 level1.MOV"),
  },
  {
    id: "timp-hand-level-2",
    title: "手部音樂肌能節奏訓練 (TIMP) 階段二",
    author: "隨音而衡團隊",
    category: "上肢訓練",
    src: buildPublicVideoSrc("timp 手部 level2.MOV"),
  },
  {
    id: "timp-hand-level-3",
    title: "手部音樂肌能節奏訓練 (TIMP) 階段三",
    author: "隨音而衡團隊",
    category: "上肢訓練",
    src: buildPublicVideoSrc("timp 手部 level3.MOV"),
  },
  {
    id: "timp-foot",
    title: "腳部音樂肌能節奏訓練 (TIMP)",
    author: "隨音而衡團隊",
    category: "下肢訓練",
    src: buildPublicVideoSrc("timp 腳部訓練.MOV"),
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
  return ["全部", ...Array.from(categories)];
}

export function listRelatedVideos(currentId: string, limit = 6) {
  return VIDEO_CATALOG.filter((video) => video.id !== currentId).slice(
    0,
    limit,
  );
}
