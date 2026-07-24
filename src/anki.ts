import type { Word } from './lessonDetails'
import type { Level } from './data'
import { japaneseMarkup, plainJapanese } from './content'

const cleanField = (value = '') => value.replace(/\t/g, ' ').replace(/\r?\n/g, '<br>')

export function exportLessonToAnki(
  words: Word[],
  level: Level,
  lessonId: number,
  lessonTitle: string,
) {
  const levelName = level === 'beginner' ? '初级' : '中级'
  const deckName = `日语小步::${levelName}::第${lessonId}课`
  const tags = `japanese_small_steps ${level} lesson_${lessonId}`
  const directives = [
    '#separator:Tab',
    '#html:true',
    '#notetype:Basic',
    `#deck:${deckName}`,
    `#tags:${tags}`,
  ]
  const cards = words.map((word) => {
    const display = word.word || word.kanji || word.kana
    const reading = word.kana.replace(/@\d*/g, '')
    const front = [
      `<div style="font-size:30px">${japaneseMarkup(display)}</div>`,
      `<div style="margin-top:10px;color:#777">${reading}</div>`,
    ].join('')
    const back = [
      `<div style="font-size:24px">${cleanField(word.desc)}</div>`,
      `<div style="margin-top:10px;color:#777">${cleanField(word.pos)}</div>`,
      `<div style="margin-top:14px;font-size:12px">${plainJapanese(lessonTitle)} · 第${lessonId}课</div>`,
    ].join('')
    return `${cleanField(front)}\t${cleanField(back)}`
  })

  const file = new Blob([`\uFEFF${[...directives, ...cards].join('\n')}`], {
    type: 'text/tab-separated-values;charset=utf-8',
  })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = `japanese-small-steps-${level}-lesson-${lessonId}-anki.txt`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
