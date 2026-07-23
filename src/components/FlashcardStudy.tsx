import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import type { Word } from '../lessonDetails'
import { japaneseMarkup } from '../content'

export function FlashcardStudy({
  words,
  title,
  onClose,
}: {
  words: Word[]
  title: string
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<number>>(() => new Set())
  const word = words[index]
  const progress = useMemo(() => Math.round(((index + 1) / words.length) * 100), [index, words.length])

  const move = (direction: number) => {
    setIndex((current) => (current + direction + words.length) % words.length)
    setFlipped(false)
  }

  const remember = () => {
    setKnown((current) => new Set(current).add(index))
    move(1)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        setFlipped((value) => !value)
      }
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div className="study-overlay" role="dialog" aria-modal="true" aria-label={`${title} 闪卡复习`}>
      <div className="study-modal">
        <header>
          <div><span>ANKI MODE</span><strong>{title}</strong></div>
          <button onClick={onClose} aria-label="关闭闪卡"><X /></button>
        </header>
        <div className="study-progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="study-meta"><span>{index + 1} / {words.length}</span><span>已掌握 {known.size}</span></div>
        <button className={`flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((value) => !value)}>
          {!flipped ? (
            <span className="flashcard-front">
              <small>点击查看答案</small>
              <strong dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji || word.kana) }} />
              <span>{word.kana.replace(/@\d*/g, '')}</span>
            </span>
          ) : (
            <span className="flashcard-back">
              <small>{word.pos}</small>
              <strong>{word.desc}</strong>
              <span>按空格翻面 · 方向键切换</span>
            </span>
          )}
        </button>
        <div className="study-actions">
          <button onClick={() => move(-1)}><ArrowLeft />上一个</button>
          <button className="again" onClick={() => move(1)}><RotateCcw />还要复习</button>
          <button className="known" onClick={remember}><Check />已经掌握</button>
          <button onClick={() => move(1)}>下一个<ArrowRight /></button>
        </div>
      </div>
    </div>
  )
}
