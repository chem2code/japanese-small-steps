import YAML from 'yaml'
import lessonsSource from '../_data/lessons.yml?raw'
import middleLessonsSource from '../_data/mlessons.yml?raw'

export type Level = 'beginner' | 'intermediate'

export interface Lesson {
  id: number
  level: Level
  title: string
  sceneTitle: string
  basic: string
  conversation: string
  translation: string
  conversationTranslation: string
  textTitle?: string
  text?: string
}

type RawLesson = Record<string, string | undefined>

const beginnerRaw = YAML.parse(lessonsSource) as Record<string, RawLesson>
const intermediateRaw = YAML.parse(middleLessonsSource) as Record<string, RawLesson>

const cleanTitle = (value = '') =>
  value
    .replace(/>\s*\*\s*/g, '')
    .replace(/\n.*$/s, '')
    .replace(/。$/, '')
    .trim()

const mapLesson = (key: string, raw: RawLesson, level: Level): Lesson => {
  const id = Number(key.slice(1))
  if (level === 'beginner') {
    return {
      id,
      level,
      title: cleanTitle(raw.title || raw.basic4),
      sceneTitle: raw.contitle || '应用课文',
      basic: raw.basic4 || '',
      conversation: [raw.basicc, raw.context].filter(Boolean).join('\n\n'),
      translation: raw.basic4t || '',
      conversationTranslation: [raw.basicct, raw.contextt].filter(Boolean).join('\n\n'),
    }
  }
  return {
    id,
    level,
    title: cleanTitle(raw.contitle || `中级第 ${id} 课`),
    sceneTitle: raw.contitle || '会话',
    basic: raw.conversation || '',
    conversation: raw.text || '',
    translation: '',
    conversationTranslation: '',
    textTitle: raw.texttitle,
    text: raw.text,
  }
}

export const beginnerLessons = Object.entries(beginnerRaw).map(([key, value]) =>
  mapLesson(key, value, 'beginner'),
)
export const intermediateLessons = Object.entries(intermediateRaw).map(([key, value]) =>
  mapLesson(key, value, 'intermediate'),
)

export const allLessons = [...beginnerLessons, ...intermediateLessons]

export const lessonKey = (level: Level, id: number) => `${level}-${id}`
