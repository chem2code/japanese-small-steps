import { plainJapanese } from './content'
import type { Lesson } from './data'
import type { Grammar } from './lessonDetails'

export interface GrammarExample {
  sentence: string
  section: '基本课文' | '应用课文'
  audioPath?: string
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

function legacyExample(grammar: Grammar, lesson: Lesson): GrammarExample | null {
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

// Specific forms prevent common particles and polite endings from selecting
// an unrelated sentence. Existing recordings retain their original text mapping.
const patterns: Record<string, RegExp> = {
  '92': /は.+です[。？?]?$/, '97': /ではありません|じゃありません/,
  '3': /に.+が.+(?:あります|います)/, '120': /を.+ます/,
  '100': /くないです|くありません/, '106': /ほど.+(?:ない|ありません)/,
  '117': /より.+です/, '69': /なくても.+いい/, '70': /なければ.+なりません/,
  '107': /前に/, '1': /後で/, '151': /ことにし/, '152': /ことにな/,
  '158': /(?:る|い|だ|た|ない)そうです/, '159': /(?:そうです|そうな|そうに)/, '156': /しか.+(?:ない|ありません|ません)/,
}
export function grammarExampleForLesson(grammar: Grammar, lesson: Lesson): GrammarExample | null {
  const original = legacyExample(grammar, lesson)
  const pattern = patterns[grammar.idx]
  const distinctive = grammarAnchors(grammar.expression).filter((anchor) => anchor.length >= 2 && !['です', 'ます', 'ありません', 'ないです'].includes(anchor))
  const matches = (sentence: string) => {
    const normalized = sentence.replace(/\s/g, '')
    return pattern ? pattern.test(normalized) : distinctive.some((anchor) => normalized.includes(anchor.replace(/\s/g, '')))
  }
  if (original && matches(original.sentence)) return { ...original, audioPath: lesson.level === 'beginner' ? `/assets/audio/grammar-examples/g${grammar.idx}.mp3` : undefined }
  for (const [section, source] of [['基本课文', lesson.basic], ['应用课文', lesson.conversation]] as const) {
    const sentence = lines(source).find(matches)
    if (sentence) return { sentence, section }
  }
  return null
}

export const grammarPracticePattern = (grammar: Grammar) => grammar.expression
  .replace(/\[[^\]]*\]/g, '')
  .replace(/[～~]+/g, '＿＿')
  .trim()
