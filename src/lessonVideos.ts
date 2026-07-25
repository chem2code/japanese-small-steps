import type { Level } from './data'

export interface LessonVideo {
  key: 'words' | 'grammar'
  label: string
  title: string
  bvid: string
  page: number
  duration: string
}

const beginnerVideos: Record<number, LessonVideo[]> = {
  1: [
    {
      key: 'words',
      label: '单词讲解',
      title: '第 1 课：小李是中国人（单词）',
      bvid: 'BV1Bp4y1D747',
      page: 10,
      duration: '约 21 分钟',
    },
    {
      key: 'grammar',
      label: '语法讲解',
      title: '第 1 课：小李是中国人（语法）',
      bvid: 'BV1Bp4y1D747',
      page: 11,
      duration: '约 32 分钟',
    },
  ],
}

export function videosForLesson(level: Level, lessonId: number) {
  return level === 'beginner' ? beginnerVideos[lessonId] || [] : []
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
