import { useMemo, useState } from 'react'
import { Brain, CheckCircle2, RotateCcw, Volume2, X } from 'lucide-react'
import { japaneseMarkup } from '../content'
import { type ReviewGrade, type StudyController } from '../study'

const labels: Record<ReviewGrade, { title: string; hint: string }> = {
  again: { title: '忘了', hint: '10分钟后' },
  hard: { title: '困难', hint: '约1天' },
  good: { title: '记得', hint: '约3天' },
  easy: { title: '简单', hint: '约7天' },
}

export function ReviewPage({ study }: { study: StudyController }) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [sessionDone, setSessionDone] = useState(0)
  const queue = study.dueWords
  const word = queue[index % Math.max(queue.length, 1)]
  const progress = useMemo(() => Math.round((sessionDone / Math.max(queue.length, 1)) * 100), [queue.length, sessionDone])

  const speak = () => {
    if (!word || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance((word.word || word.kanji || word.kana).replace(/@\d*/g, ''))
    utterance.lang = 'ja-JP'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const grade = (value: ReviewGrade) => {
    if (!word) return
    study.gradeWord(word, value)
    setSessionDone((current) => current + 1)
    setIndex((current) => current + 1)
    setRevealed(false)
  }

  if (!word || sessionDone >= queue.length) {
    return (
      <div className="page review-page">
        <div className="review-complete">
          <span><CheckCircle2 size={34} /></span>
          <p className="eyebrow">SESSION COMPLETE</p>
          <h1>今天的复习完成了</h1>
          <p>你已经清空今日队列。明天回来，系统会按照记忆情况安排下一次复习。</p>
          <button className="button primary" onClick={() => { setSessionDone(0); setIndex(0) }}>再练一轮</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page review-page">
      <header className="product-page-head compact">
        <div><span className="eyebrow">SMART REVIEW</span><h1>今日复习</h1><p>先努力回忆，再翻面。诚实选择难度，比快速刷完更有效。</p></div>
        <div className="review-count"><Brain size={22} /><strong>{queue.length - sessionDone}</strong><span>张待复习</span></div>
      </header>

      <section className="srs-shell">
        <div className="srs-progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="srs-meta"><span>今日队列</span><b>{sessionDone + 1} / {queue.length}</b></div>
        <button className={`srs-card ${revealed ? 'revealed' : ''}`} onClick={() => setRevealed((value) => !value)}>
          <small>{revealed ? '答案' : '看到这个词，你能想起意思吗？'}</small>
          <strong dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji || word.kana) }} />
          <span>{word.kana.replace(/@\d*/g, '')}</span>
          {revealed && <div><em>{word.desc}</em><small>{word.pos}</small></div>}
        </button>
        <button className="speak-button" onClick={speak}><Volume2 size={17} />听读音</button>
        {!revealed ? (
          <button className="button primary reveal-button" onClick={() => setRevealed(true)}>显示答案</button>
        ) : (
          <div className="grade-grid">
            {(Object.keys(labels) as ReviewGrade[]).map((value) => (
              <button className={value} key={value} onClick={() => grade(value)}>
                {value === 'again' ? <RotateCcw size={15} /> : value === 'easy' ? <CheckCircle2 size={15} /> : <X size={15} />}
                <b>{labels[value].title}</b><small>{labels[value].hint}</small>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
