import { beginnerLessons } from './data'
import { plainJapanese } from './content'
import type { Word } from './lessonDetails'

export interface WordExample {
  sentence: string
  lessonId: number
  section: '基本课文' | '应用课文'
}

const clean = (value = '') => plainJapanese(value)
  .replace(/^[Ａ-ＺA-Z]\s*[甲乙]?[：:]?\s*/, '')
  .replace(/^[甲乙][：:]\s*/, '')
  .replace(/^[-–—]+$/, '')
  .trim()

const candidatesForWord = (word: Word) => Array.from(new Set([
  clean(word.word),
  clean(word.kanji),
  clean(word.kana),
].filter((value) => value.length >= 2)))

const lines = (source: string) => source
  .split(/\r?\n/)
  .map(clean)
  .filter((line) => line.length > 1)

export function exampleForWord(word: Word): WordExample | null {
  const lessonId = Number(word.lesson.match(/\d+/)?.[0])
  const lesson = beginnerLessons.find((item) => item.id === lessonId)
  if (!lesson) return null

  const needles = candidatesForWord(word)
  const lessonsToSearch = [
    lesson,
    ...beginnerLessons.filter((item) => item.id !== lessonId),
  ]

  for (const sourceLesson of lessonsToSearch) {
    const sections = [
      { section: '基本课文' as const, source: sourceLesson.basic },
      { section: '应用课文' as const, source: sourceLesson.conversation },
    ]
    for (const { section, source } of sections) {
      const sentence = lines(source).find((line) => needles.some((needle) => line.includes(needle)))
      if (sentence) return { sentence, lessonId: sourceLesson.id, section }
    }
  }
  return null
}
