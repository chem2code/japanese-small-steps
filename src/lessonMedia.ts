import type { Level } from './data'

export interface LessonMedia {
  src: string
  alt: string
  caption: string
}

const media: Partial<Record<`${Level}-${number}`, LessonMedia>> = {
  'beginner-10': {
    src: '/assets/lesson-images/beginner-10-kyoto-autumn.webp',
    alt: '秋日京都传统街道、町屋与红叶的课程场景插画',
    caption: '课文场景 · 京都的红叶与安静的传统街道',
  },
}

export const getLessonMedia = (level: Level, id: number) => media[`${level}-${id}`]
