import type { Level } from './data'

export interface LessonVideo {
  key: string
  label: string
  title: string
  bvid: string
  page: number
  duration: string
}

const BVID = 'BV1Bp4y1D747'

// Explicit page mapping from the video's current multi-part episode titles.
// The extra entries in lessons 5, 14 and 33 are intentional topic lessons.
const beginnerPages: Record<number, number[]> = {
  1: [10, 11],
  2: [12, 13],
  3: [14, 15],
  4: [16, 17],
  5: [19, 20, 18],
  6: [21, 22],
  7: [23, 24],
  8: [25, 26],
  9: [27, 28],
  10: [29, 30],
  11: [31, 32],
  12: [33, 34],
  13: [35, 36],
  14: [38, 39, 37],
  15: [40, 41],
  16: [42, 43],
  17: [44, 45],
  18: [46, 47],
  19: [48, 49],
  20: [50, 51],
  21: [52, 53],
  22: [54, 55],
  23: [56, 57],
  24: [58, 59],
  25: [60, 61],
  26: [62, 63],
  27: [64, 65],
  28: [66, 67],
  29: [68, 69],
  30: [70, 71],
  31: [72, 73],
  32: [74, 75],
  33: [77, 78, 76],
  34: [79, 80],
  35: [81, 82],
  36: [83, 84],
  37: [85, 86],
  38: [87, 88],
  39: [89, 90],
  40: [91, 92],
  41: [93, 94],
  42: [95, 96],
  43: [97, 98],
  44: [99, 100],
  45: [101, 102],
  46: [103, 104],
  47: [105, 106],
  48: [107, 108],
}

// This album currently contains matching intermediate videos through lesson 19.
const intermediatePages: Record<number, number[]> = {
  1: [110, 111, 112, 113],
  2: [114, 115, 116, 117],
  3: [118, 119, 120, 121],
  4: [122, 123, 124, 125],
  5: [126, 127, 128, 129],
  6: [130, 131, 132, 133],
  7: [134, 135, 136, 137],
  8: [138, 139, 140, 141],
  9: [142, 143, 144, 145],
  10: [146, 147, 148, 149],
  11: [150, 151, 152, 153, 154],
  12: [155, 156, 157, 158],
  13: [159, 160, 161, 162],
  14: [163, 164, 165, 166],
  15: [167, 168, 169, 170],
  16: [171, 172, 173, 174],
  17: [176, 177, 178, 179],
  18: [180, 181, 182, 183, 184],
  19: [185, 186, 187, 188],
}

const beginnerExtraLabels: Record<number, string> = {
  5: '专项：动词三分类',
  14: '专项：て形、た形',
  33: '专项：自动词与他动词',
}

function labelsForLesson(level: Level, lessonId: number, count: number) {
  if (level === 'beginner') {
    const labels = ['单词讲解', '语法讲解']
    if (count > 2) labels.push(beginnerExtraLabels[lessonId])
    return labels
  }
  if (lessonId === 11) return ['单词讲解', '语法讲解（一）', '语法讲解（二）', '课文讲解（一）', '课文讲解（二）']
  if (lessonId === 18) return ['单词讲解', '语法讲解', '课文讲解（一）', '课文讲解（二·上）', '课文讲解（二·下）']
  return ['单词讲解', '语法讲解', '课文讲解（一）', '课文讲解（二）']
}

export function videosForLesson(level: Level, lessonId: number): LessonVideo[] {
  const pages = level === 'beginner' ? beginnerPages[lessonId] : intermediatePages[lessonId]
  if (!pages) return []
  const labels = labelsForLesson(level, lessonId, pages.length)
  const levelLabel = level === 'beginner' ? '初级' : '中级'

  return pages.map((page, index) => ({
    key: `${level}-${lessonId}-${page}`,
    label: labels[index],
    title: `${levelLabel}第 ${lessonId} 课 · ${labels[index]}`,
    bvid: BVID,
    page,
    duration: '点击后播放',
  }))
}

export function bilibiliVideoUrl(video: LessonVideo) {
  return `https://www.bilibili.com/video/${video.bvid}/?p=${video.page}`
}

export function bilibiliPlayerUrl(video: LessonVideo) {
  const params = new URLSearchParams({
    bvid: video.bvid,
    p: String(video.page),
    autoplay: '0',
    danmaku: '0',
    poster: '1',
  })
  return `https://player.bilibili.com/player.html?${params.toString()}`
}
