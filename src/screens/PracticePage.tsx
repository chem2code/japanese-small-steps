import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Circle, Headphones, RotateCcw } from 'lucide-react'
import { japaneseMarkup, plainJapanese } from '../content'
import type { StudyController } from '../study'

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

export function PracticePage({ study }: { study: StudyController }) {
  const words = study.currentWords
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState('')
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const word = words[step % Math.max(words.length, 1)]
  const choices = useMemo(() => {
    if (!word) return []
    const distractors = shuffle(words.filter((item) => item.desc !== word.desc)).slice(0, 3).map((item) => item.desc)
    return shuffle([word.desc, ...distractors])
  }, [step, word, words])
  const answered = Boolean(selected)

  const next = () => {
    if (selected === word.desc) setScore((current) => current + 1)
    if (step >= Math.min(words.length, 5) - 1) setFinished(true)
    else {
      setStep((current) => current + 1)
      setSelected('')
    }
  }

  if (!word) return <div className="page empty-state">完成一节课程后，就可以开始练习。</div>

  if (finished) {
    return (
      <div className="page review-page">
        <div className="review-complete">
          <span><CheckCircle2 size={34} /></span><p className="eyebrow">PRACTICE COMPLETE</p>
          <h1>完成今日小测</h1><p>你答对了 {score + (selected === word.desc ? 1 : 0)} / {Math.min(words.length, 5)} 题。错题会在复习队列里再次出现。</p>
          <button className="button primary" onClick={() => { setStep(0); setSelected(''); setScore(0); setFinished(false) }}><RotateCcw size={16} />重新练习</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page practice-page">
      <header className="product-page-head compact">
        <div><span className="eyebrow">QUICK PRACTICE</span><h1>5题即时练习</h1><p>从“看懂”走到“想得起来”。完成后马上知道哪里需要加强。</p></div>
        <div className="review-count"><Headphones size={22} /><strong>{step + 1}</strong><span>/ {Math.min(words.length, 5)}</span></div>
      </header>
      <section className="quiz-shell">
        <span className="quiz-label">选择最合适的中文意思</span>
        <h2 dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji || word.kana) }} />
        <p>{plainJapanese(word.kana.replace(/@\d*/g, ''))}</p>
        <div className="choice-list">
          {choices.map((choice) => {
            const correct = answered && choice === word.desc
            const wrong = answered && choice === selected && choice !== word.desc
            return <button className={`${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} disabled={answered} onClick={() => setSelected(choice)} key={choice}><Circle size={16} /><span>{choice}</span></button>
          })}
        </div>
        {answered && <div className={`answer-feedback ${selected === word.desc ? 'correct' : 'wrong'}`}><b>{selected === word.desc ? '回答正确' : '再记一次'}</b><span>{word.desc}</span></div>}
        <button className="button primary quiz-next" disabled={!answered} onClick={next}>{step >= Math.min(words.length, 5) - 1 ? '查看结果' : '下一题'}<ArrowRight size={16} /></button>
      </section>
    </div>
  )
}
