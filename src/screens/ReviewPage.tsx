import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, RotateCcw, Volume2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { japaneseMarkup, plainJapanese } from '../content'
import { type ReviewGrade, type StudyController, wordId } from '../study'
import { exampleForWord } from '../wordExamples'
import { wordsForLesson } from '../lessonDetails'
import { assetUrl } from '../assetUrl'
import { beginnerLessons } from '../data'

type ScopeMode = 'lesson' | 'unit'
type SwipeDirection = 'left' | 'right'

const lessonCount = beginnerLessons.length
const unitCount = Math.ceil(lessonCount / 4)

export function ReviewPage({ study }: { study: StudyController }) {
  const [scopeMode, setScopeMode] = useState<ScopeMode>('lesson')
  const [lessonId, setLessonId] = useState(1)
  const [unitId, setUnitId] = useState(1)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [sessionDone, setSessionDone] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [exiting, setExiting] = useState<SwipeDirection | null>(null)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const exitTimerRef = useRef<number | null>(null)
  const dragRef = useRef({ pointerId: -1, startX: 0, lastX: 0, lastTime: 0, velocity: 0, moved: false })

  const queue = useMemo(() => {
    if (scopeMode === 'lesson') return wordsForLesson(lessonId)
    const firstLesson = ((unitId - 1) * 4) + 1
    return Array.from({ length: 4 }, (_, offset) => wordsForLesson(firstLesson + offset)).flat()
  }, [lessonId, scopeMode, unitId])
  const word = queue[index]
  const progress = Math.round((sessionDone / Math.max(queue.length, 1)) * 100)
  const example = word ? exampleForWord(word) : null

  const stopAudio = () => {
    audioRef.current?.pause()
    window.speechSynthesis?.cancel()
  }

  const resetSession = () => {
    stopAudio()
    if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current)
    setIndex(0)
    setSessionDone(0)
    setRevealed(false)
    setDragX(0)
    setDragging(false)
    setExiting(null)
  }

  useEffect(() => {
    resetSession()
  }, [scopeMode, lessonId, unitId])

  useEffect(() => () => {
    stopAudio()
    if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current)
  }, [])

  const speakText = (text: string, rate = 0.86) => {
    if (!text || !('speechSynthesis' in window)) return
    stopAudio()
    window.speechSynthesis.cancel()
    const spokenText = text.replace(/^[^：:]{1,12}[：:]\s*/, '').replace(/@\d*/g, '').trim()
    const utterance = new SpeechSynthesisUtterance(spokenText)
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find((voice) => voice.lang === 'ja-JP' && /Kyoko|Nanami|Otoya|Haruka|Google.*日本語/i.test(voice.name))
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('ja'))
    if (preferredVoice) utterance.voice = preferredVoice
    utterance.lang = 'ja-JP'
    utterance.rate = rate
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const fallbackSpeak = (targetWord = word) => {
    if (!targetWord) return
    speakText(targetWord.word || targetWord.kanji || targetWord.kana, 0.85)
  }

  const speak = (targetWord = word, automatic = false) => {
    if (!targetWord) return
    const sourceLesson = Number(targetWord.lesson.match(/\d+/)?.[0])
    const wordIndex = Number.isFinite(sourceLesson)
      ? wordsForLesson(sourceLesson).findIndex((item) => wordId(item) === wordId(targetWord))
      : -1
    if (!sourceLesson || wordIndex < 0) { fallbackSpeak(targetWord); return }
    stopAudio()
    const audio = audioRef.current ?? new Audio()
    audio.src = assetUrl(`/assets/audio/word-items/l${sourceLesson}/${wordIndex}.mp3`)
    audio.preload = 'auto'
    audioRef.current = audio
    void audio.play()
      .then(() => setAudioBlocked(false))
      .catch(() => {
        if (automatic) setAudioBlocked(true)
        else fallbackSpeak(targetWord)
      })
  }

  const currentWordKey = word ? wordId(word) : ''

  useEffect(() => {
    if (!word) return
    const timer = window.setTimeout(() => speak(word, true), 80)
    return () => window.clearTimeout(timer)
  }, [currentWordKey])

  useEffect(() => {
    if (!audioBlocked || !word) return
    const unlockAudio = () => speak(word, true)
    window.addEventListener('pointerdown', unlockAudio, { once: true, capture: true })
    return () => window.removeEventListener('pointerdown', unlockAudio, { capture: true })
  }, [audioBlocked, currentWordKey])

  const advance = (grade: ReviewGrade) => {
    if (!word) return
    stopAudio()
    study.gradeWord(word, grade)
    setSessionDone((current) => current + 1)
    setIndex((current) => current + 1)
    setRevealed(false)
    setDragX(0)
    setExiting(null)
  }

  const commitSwipe = (direction: SwipeDirection) => {
    if (!word || exiting) return
    setDragging(false)
    setExiting(direction)
    setDragX((direction === 'right' ? 1 : -1) * Math.max(window.innerWidth, 720))
    if ('vibrate' in navigator) navigator.vibrate(12)
    exitTimerRef.current = window.setTimeout(() => {
      if (direction === 'right' && !study.isBookmarked(word)) study.toggleBookmark(word)
      advance(direction === 'left' ? 'good' : 'again')
    }, 240)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (exiting) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, moved: false }
    setDragging(true)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (drag.pointerId !== event.pointerId) return
    const nextX = event.clientX - drag.startX
    const elapsed = Math.max(event.timeStamp - drag.lastTime, 1)
    drag.velocity = ((event.clientX - drag.lastX) / elapsed) * 1000
    drag.lastX = event.clientX
    drag.lastTime = event.timeStamp
    if (Math.abs(nextX) > 9) drag.moved = true
    setDragX(nextX)
  }

  const finishPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (drag.pointerId !== event.pointerId) return
    const currentX = event.clientX - drag.startX
    const projectedX = currentX + (drag.velocity * 0.14)
    drag.pointerId = -1
    setDragging(false)
    if (Math.abs(projectedX) > 92) commitSwipe(projectedX > 0 ? 'right' : 'left')
    else setDragX(0)
  }

  const cancelPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    dragRef.current.pointerId = -1
    setDragging(false)
    setDragX(0)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!word || exiting) return
      if (event.key === 'ArrowLeft') { event.preventDefault(); commitSwipe('left') }
      if (event.key === 'ArrowRight') { event.preventDefault(); commitSwipe('right') }
      if (event.key === ' ') { event.preventDefault(); setRevealed((current) => !current) }
      if (event.key.toLowerCase() === 'b') study.toggleBookmark(word)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const scopeLabel = scopeMode === 'lesson'
    ? `第 ${lessonId} 课`
    : `第 ${unitId} 单元 · ${((unitId - 1) * 4) + 1}–${unitId * 4} 课`

  return (
    <div className="page review-page tinder-review">
      <header className="review-focus-topbar">
        <Link to="/" aria-label="退出卡片复习"><X size={21} /></Link>
        <div><strong>卡片复习</strong><small>左滑掌握 · 右滑收藏</small></div>
        <span className={audioBlocked ? 'waiting' : ''}><Volume2 size={15} />{audioBlocked ? '触碰后自动播放' : '自动读音已开启'}</span>
      </header>

      <section className="review-scope" aria-label="选择复习范围">
        <div className="scope-segments">
          <button className={scopeMode === 'lesson' ? 'active' : ''} type="button" onClick={() => setScopeMode('lesson')}>按课复习</button>
          <button className={scopeMode === 'unit' ? 'active' : ''} type="button" onClick={() => setScopeMode('unit')}>按单元复习</button>
        </div>
        <label>
          <span>{scopeMode === 'lesson' ? '选择课文' : '选择单元'}</span>
          {scopeMode === 'lesson' ? (
            <select value={lessonId} onChange={(event) => setLessonId(Number(event.target.value))}>
              {beginnerLessons.map((lesson) => <option key={lesson.id} value={lesson.id}>第 {lesson.id} 课 · {plainJapanese(lesson.title)}</option>)}
            </select>
          ) : (
            <select value={unitId} onChange={(event) => setUnitId(Number(event.target.value))}>
              {Array.from({ length: unitCount }, (_, value) => value + 1).map((unit) => <option key={unit} value={unit}>第 {unit} 单元 · {((unit - 1) * 4) + 1}–{unit * 4} 课</option>)}
            </select>
          )}
        </label>
        <div><strong>{scopeLabel}</strong><span>共 {queue.length} 个单词</span></div>
      </section>

      {!word || sessionDone >= queue.length ? (
        <section className="review-complete swipe-complete">
          <span><CheckCircle2 size={34} /></span><p className="eyebrow">SESSION COMPLETE</p><h2>{scopeLabel} 复习完成</h2><p>这一轮已经刷完。可以再来一轮，或在上方切换其他课文、单元。</p><button className="button primary" onClick={resetSession}><RotateCcw size={16} />再复习一轮</button>
        </section>
      ) : (
        <section className="swipe-review-shell">
          <div className="srs-progress"><i style={{ width: `${progress}%` }} /></div>
          <div className="srs-meta"><span>{scopeLabel}</span><b>{sessionDone + 1} / {queue.length}</b></div>
          <div className="swipe-deck">
            <div className="swipe-card-shadow second" /><div className="swipe-card-shadow first" />
            <article
              key={`${wordId(word)}-${index}`}
              className={`srs-card swipe-card ${revealed ? 'revealed' : ''} ${dragging ? 'dragging' : ''} ${exiting ? `exiting-${exiting}` : ''}`}
              style={{ transform: `translate3d(${dragX}px,0,0) rotate(${dragX / 24}deg)`, '--swipe-right-strength': dragX > 0 ? Math.min(dragX / 110, 1) : 0, '--swipe-left-strength': dragX < 0 ? Math.min(Math.abs(dragX) / 110, 1) : 0 } as React.CSSProperties}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={finishPointer}
              onPointerCancel={cancelPointer}
              onClick={() => { if (!dragRef.current.moved && !exiting) setRevealed((current) => !current) }}
              role="button"
              tabIndex={0}
              aria-label="点击查看答案，左滑标记已掌握，右滑收藏复习"
            >
              <div className="swipe-stamp known"><ArrowLeft />已掌握</div><div className="swipe-stamp save">收藏复习<ArrowRight /></div>
              <button className="card-audio" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); speak() }} aria-label="重播当前单词发音"><Volume2 size={20} /><span>重播发音</span></button>
              <button className={`card-bookmark ${study.isBookmarked(word) ? 'active' : ''}`} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); study.toggleBookmark(word) }} aria-label={study.isBookmarked(word) ? '取消收藏单词' : '收藏单词'}><Bookmark size={19} fill={study.isBookmarked(word) ? 'currentColor' : 'none'} /></button>
              <small>{revealed ? '答案' : '点击翻面查看释义'}</small>
              <strong dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji || word.kana) }} />
              <span>{word.kana.replace(/@\d*/g, '')}</span>
              {revealed && <div className="swipe-answer"><em>{word.desc}</em><small>{word.pos}</small>{example && <blockquote><div className="swipe-example-head"><span>课文原句</span><button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); speakText(example.sentence, 0.82) }} aria-label={`播放课文原句：${example.sentence}`}><Volume2 size={15} /><b>听整句</b></button></div><p>{example.sentence}</p><cite>第 {example.lessonId} 课 · {example.section}</cite></blockquote>}</div>}
            </article>
          </div>

          <div className="swipe-hint"><span><ArrowLeft size={14} />已掌握</span><span>点击卡片翻面</span><span>收藏复习<ArrowRight size={14} /></span></div>
          {revealed && example && (() => {
            const sentence = { sentence: example.sentence, lessonId: example.lessonId, section: example.section }
            const saved = study.isSentenceBookmarked(sentence)
            return <button className={`sentence-review-bookmark ${saved ? 'active' : ''}`} type="button" onClick={() => study.toggleSentenceBookmark(sentence)}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />{saved ? '已收藏例句' : '收藏这条例句'}</button>
          })()}
          <div className="swipe-actions">
            <button className="known" type="button" onClick={() => commitSwipe('left')}><ArrowLeft size={20} /><span><b>已掌握</b><small>左滑</small></span></button>
            <button className="save" type="button" onClick={() => commitSwipe('right')}><span><b>收藏复习</b><small>右滑</small></span><ArrowRight size={20} /></button>
          </div>
        </section>
      )}
    </div>
  )
}
