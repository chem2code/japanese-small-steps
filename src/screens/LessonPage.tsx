import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Download, Eye, EyeOff, Layers3, Volume2 } from 'lucide-react'
import {
  beginnerLessons,
  intermediateLessons,
  lessonKey,
  type Level,
} from '../data'
import { grammarForLesson, wordsForLesson } from '../lessonDetails'
import { japaneseMarkup, kanaReading, plainJapanese, renderContent } from '../content'
import { exportLessonToAnki } from '../anki'
import { assetUrl } from '../assetUrl'
import { getLessonMedia } from '../lessonMedia'
import { FlashcardStudy } from '../components/FlashcardStudy'
import type { StudyController } from '../study'

interface Progress { completed: string[]; toggle: (key: string) => void }

function ContentBlock({ source }: { source: string }) {
  return <div className="formatted-content" dangerouslySetInnerHTML={{ __html: renderContent(source) }} />
}

function LessonAudio({ src, label, helper, audioRef: providedRef, onPlay }: { src: string; label: string; helper: string; audioRef?: RefObject<HTMLAudioElement | null>; onPlay?: () => void }) {
  const internalRef = useRef<HTMLAudioElement>(null)
  const audioRef = providedRef || internalRef
  const [rate, setRate] = useState(1)

  const changeRate = (nextRate: number) => {
    setRate(nextRate)
    if (audioRef.current) audioRef.current.playbackRate = nextRate
  }

  return (
    <div className="lesson-audio">
      <div className="audio-heading">
        <span className="audio-icon"><Volume2 size={18} /></span>
        <div><strong>{label}</strong><small>{helper}</small></div>
        <div className="speed-control" aria-label="播放速度">
          {[0.8, 1, 1.2].map((value) => (
            <button className={rate === value ? 'active' : ''} key={value} onClick={() => changeRate(value)}>
              {value}×
            </button>
          ))}
        </div>
      </div>
      <audio ref={audioRef} controls preload="metadata" src={src} onPlay={onPlay}>你的浏览器不支持音频播放。</audio>
    </div>
  )
}

export function LessonPage({ progress, study }: { progress: Progress; study: StudyController }) {
  const params = useParams()
  const level = (params.level === 'intermediate' ? 'intermediate' : 'beginner') as Level
  const id = Number(params.id || 1)
  const lessons = level === 'beginner' ? beginnerLessons : intermediateLessons
  const lesson = lessons.find((item) => item.id === id)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showRuby, setShowRuby] = useState(true)
  const [showReading, setShowReading] = useState(level === 'beginner')

  useEffect(() => {
    window.scrollTo(0, 0)
    setShowTranslation(false)
    setShowReading(level === 'beginner')
  }, [id, level])
  const lessonWords = useMemo(() => level === 'beginner' ? wordsForLesson(id) : [], [id, level])
  const lessonGrammar = useMemo(() => level === 'beginner' ? grammarForLesson(id) : [], [id, level])
  const lessonAudioRef = useRef<HTMLAudioElement>(null)
  const wordAudioRef = useRef<HTMLAudioElement>(null)
  const wordItemAudioRef = useRef<HTMLAudioElement>(null)
  const [activeWord, setActiveWord] = useState<number | null>(null)
  const [studyOpen, setStudyOpen] = useState(false)
  const [exported, setExported] = useState(false)

  useEffect(() => {
    wordItemAudioRef.current?.pause()
    setActiveWord(null)
  }, [id, level])

  if (!lesson) return <div className="page empty-state">没有找到这节课程。<Link to="/courses">返回课程地图</Link></div>

  const key = lessonKey(level, id)
  const audioPrefix = level === 'beginner' ? 'l' : 'm'
  const lessonMedia = getLessonMedia(level, id)
  const completed = progress.completed.includes(key)
  const previous = id > 1 ? id - 1 : null
  const next = id < lessons.length ? id + 1 : null

  const stopWordAudio = () => {
    const audio = wordItemAudioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setActiveWord(null)
  }

  const handleLessonTrackPlay = () => {
    wordAudioRef.current?.pause()
    stopWordAudio()
  }

  const handleWordTrackPlay = () => {
    lessonAudioRef.current?.pause()
    stopWordAudio()
  }

  const playLessonAudio = () => {
    const audio = lessonAudioRef.current
    if (!audio) return
    handleLessonTrackPlay()
    audio.currentTime = 0
    void audio.play()
  }

  const playWordAudio = (index: number) => {
    const word = lessonWords[index]
    const audio = wordItemAudioRef.current
    if (!word || !audio) return

    lessonAudioRef.current?.pause()
    wordAudioRef.current?.pause()
    stopWordAudio()
    audio.src = assetUrl(`/assets/audio/word-items/l${id}/${index}.mp3`)
    audio.playbackRate = 1
    setActiveWord(index)
    void audio.play().catch(() => setActiveWord(null))
  }

  const exportAnki = () => {
    exportLessonToAnki(lessonWords, level, id, lesson.title)
    setExported(true)
    window.setTimeout(() => setExported(false), 2_500)
  }

  const completeLesson = () => {
    if (!completed) progress.toggle(key)
    const planDay = Math.min(id, 30)
    if (!study.completedDays.includes(planDay)) study.toggleDay(planDay)
  }

  return (
    <div className={`lesson-page ${showRuby ? '' : 'hide-ruby'}`}>
      <header className="lesson-topbar">
        <Link to="/courses"><ArrowLeft size={17} />课程地图</Link>
        <div className="lesson-progress"><span>{level === 'beginner' ? '初级' : '中级'} · 第 {id} 课</span><i><b style={{ width: `${(id / lessons.length) * 100}%` }} /></i><small>{id}/{lessons.length}</small></div>
        <button className={completed ? 'completed' : ''} onClick={() => progress.toggle(key)}>
          {completed ? <CheckCircle2 size={17} /> : <Check size={17} />}{completed ? '已完成' : '标记完成'}
        </button>
      </header>
      <div className="lesson-layout">
        <aside className="lesson-outline">
          <span>本课内容</span>
          <a href="#overview">课程概览</a><a href="#text">基本课文</a>
          {lessonGrammar.length > 0 && <a href="#grammar">语法要点</a>}
          {lessonWords.length > 0 && <a href="#words">生词表</a>}
        </aside>
        <article className="lesson-article">
          <section id="overview" className="lesson-intro">
            <span className="eyebrow">LESSON {String(id).padStart(2, '0')}</span>
            <h1 dangerouslySetInnerHTML={{ __html: japaneseMarkup(lesson.title) }} />
            {showReading && level === 'beginner' && <div className="title-reading">{kanaReading(lesson.title)}</div>}
            <p>{level === 'beginner' ? '本课建议用 20 分钟完成：先理解句型，再跟读课文，最后复习词汇。' : `会话：${plainJapanese(lesson.sceneTitle)}`}</p>
            {lessonMedia && (
              <figure className="lesson-visual">
                <img src={assetUrl(lessonMedia.src)} alt={lessonMedia.alt} loading="lazy" decoding="async" />
                <figcaption>{lessonMedia.caption}</figcaption>
              </figure>
            )}
            <div className="lesson-tools">
              <button onClick={() => setShowRuby((value) => !value)}>{showRuby ? <EyeOff size={16} /> : <Eye size={16} />}{showRuby ? '隐藏注音' : '显示注音'}</button>
              {level === 'beginner' && <button onClick={() => setShowReading((value) => !value)}>{showReading ? <EyeOff size={16} /> : <Eye size={16} />}{showReading ? '隐藏整句读音' : '显示整句读音'}</button>}
              <button onClick={() => setShowTranslation((value) => !value)}><Eye size={16} />{showTranslation ? '隐藏译文' : '显示译文'}</button>
              <button onClick={playLessonAudio}><Volume2 size={16} />播放课文</button>
            </div>
            <LessonAudio
              audioRef={lessonAudioRef}
              onPlay={handleLessonTrackPlay}
              src={assetUrl(`/assets/audio/lesson/${audioPrefix}${id}.mp3`)}
              label="课文录音"
              helper="建议先听一遍，再用 0.8× 逐句跟读"
            />
          </section>

          <section id="text" className="lesson-section">
            <div className="lesson-section-title"><span>01</span><div><h2>{level === 'beginner' ? '基本课文' : lesson.sceneTitle}</h2><p>先完整阅读，再逐句跟读</p></div></div>
            <ContentBlock source={lesson.basic} />
            {lesson.conversation && <ContentBlock source={lesson.conversation} />}
            {showReading && level === 'beginner' && (
              <details className="reading-panel" open>
                <summary>整句假名读音 <small>先看原文，再用假名确认读法</small></summary>
                <ContentBlock source={kanaReading([lesson.basic, lesson.conversation].filter(Boolean).join('\n\n'))} />
              </details>
            )}
            {showTranslation && (lesson.translation || lesson.conversationTranslation) && (
              <div className="translation-box"><b>中文译文</b><ContentBlock source={[lesson.translation, lesson.conversationTranslation].join('\n\n')} /></div>
            )}
          </section>

          {lessonGrammar.length > 0 && <section id="grammar" className="lesson-section">
            <div className="lesson-section-title"><span>02</span><div><h2>语法要点</h2><p>本课需要掌握的核心表达</p></div></div>
            <div className="grammar-list">{lessonGrammar.map((item, index) => <div className="grammar-card" key={`${item.expression}-${index}`}><strong>{item.expression}</strong><p>{item.explanation.replace(/\\n/g, ' ')}</p></div>)}</div>
          </section>}

          {lessonWords.length > 0 && <section id="words" className="lesson-section">
            <div className="lesson-section-title"><span>03</span><div><h2>生词表</h2><p>先记住最常用的词，不必一次全部掌握</p></div></div>
            <div className="anki-actions">
              <div><span className="anki-mark">A</span><p><strong>Anki 学习</strong><small>站内复习，或导出到 Anki 桌面版</small></p></div>
              <button onClick={() => setStudyOpen(true)}><Layers3 size={16} />闪卡复习</button>
              <button onClick={exportAnki}><Download size={16} />{exported ? '已导出' : '导出 Anki'}</button>
            </div>
            <LessonAudio
              audioRef={wordAudioRef}
              onPlay={handleWordTrackPlay}
              src={assetUrl(`/assets/audio/word/${audioPrefix}${id}.mp3`)}
              label="整课单词录音"
              helper={activeWord === null ? '可连续听整课词表；点击下方单词可单独朗读' : `正在朗读：${plainJapanese(lessonWords[activeWord]?.word || lessonWords[activeWord]?.kana || '')}`}
            />
            <audio
              ref={wordItemAudioRef}
              preload="none"
              onEnded={() => setActiveWord(null)}
              onError={() => setActiveWord(null)}
            />
            <div className="word-grid">{lessonWords.map((word, index) => <button className={`word-card ${activeWord === index ? 'is-speaking' : ''}`} key={`${word.lesson}-${index}`} onClick={() => playWordAudio(index)}><span dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji) }} /><small>{word.kana.replace(/@\d*/g, '')}</small><b>{word.desc}</b><Volume2 size={14} /></button>)}</div>
          </section>}

          <div className="lesson-finish">
            <div><CheckCircle2 size={29} /><span><strong>完成本课了吗？</strong><small>标记后，学习进度会保存在这台设备上。</small></span></div>
            <button className={completed ? 'completed' : ''} onClick={completeLesson}>{completed ? '已完成本课' : '完成并进入练习'}</button>
          </div>
          <nav className="lesson-pagination">
            {previous ? <Link to={`/lesson/${level}/${previous}`}><ArrowLeft />第 {previous} 课</Link> : <span />}
            {next ? <Link to={`/lesson/${level}/${next}`}>第 {next} 课<ArrowRight /></Link> : <Link to="/courses">返回课程地图<ArrowRight /></Link>}
          </nav>
        </article>
      </div>
      {studyOpen && <FlashcardStudy words={lessonWords} title={`第 ${id} 课`} onClose={() => setStudyOpen(false)} />}
    </div>
  )
}
