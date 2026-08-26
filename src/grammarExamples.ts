import { plainJapanese } from './content'
import type { Lesson } from './data'
import type { Grammar } from './lessonDetails'

export interface GrammarExample {
  sentence: string
  section: '基本课文' | '应用课文'
}

const ignoredAnchors = new Set(['否定', '确认', '转折', '铺垫', '疑问', '关联', '属性', '从属机构', '国家'])

const cleanLine = (value = '') => plainJapanese(value)
  .replace(/^[Ａ-ＺA-Z]\s*[甲乙]?[：:]?\s*/, '')
  .replace(/^[甲乙][：:]\s*/, '')
  .trim()

const lines = (source: string) => source
  .split(/\r?\n/)
  .map(cleanLine)
  .filter((line) => line.length > 2 && !/^[-–—]+$/.test(line))

const grammarAnchors = (expression: string) => {
  const withoutNotes = cleanLine(expression).replace(/\[[^\]]*\]/g, '')
  return Array.from(new Set(
    withoutNotes
      .split(/[～~／/・,，。()（）]/)
      .map((item) => item.trim())
      .filter((item) => item && !ignoredAnchors.has(item))
      .filter((item) => /[ぁ-んァ-ヶ一-龠々ー]/.test(item)),
  ))
}

export function grammarExampleForLesson(grammar: Grammar, lesson: Lesson): GrammarExample | null {
  const anchors = grammarAnchors(grammar.expression)
  if (!anchors.length) return null

  const sections = [
    { section: '基本课文' as const, source: lesson.basic },
    { section: '应用课文' as const, source: lesson.conversation },
  ]

  let best: (GrammarExample & { score: number }) | undefined
  for (const { section, source } of sections) {
    for (const sentence of lines(source)) {
      const matched = anchors.filter((anchor) => sentence.includes(anchor))
      const score = matched.reduce((sum, anchor) => sum + Math.max(anchor.length, 1), 0)
      if (score > 0 && (!best || score > best.score)) best = { sentence, section, score }
    }
  }

  if (!best) return null
  return { sentence: best.sentence, section: best.section }
}

export const grammarPracticePattern = (grammar: Grammar) => grammar.expression
  .replace(/\[[^\]]*\]/g, '')
  .replace(/[～~]+/g, '＿＿')
  .trim()
