import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, EyeOff, Volume2 } from 'lucide-react'
import {
  beginnerLessons,
  intermediateLessons,
  lessonKey,
  type Level,
} from '../data'
import { grammarForLesson, wordsForLesson } from '../lessonDetails'
import { japaneseMarkup, plainJapanese, renderContent } from '../content'

interface Progress { completed: string[]; toggle: (key: string) => void }

function ContentBlock({ source }: { source: string }) {
  return <div className="formatted-content" dangerouslySetInnerHTML={{ __html: renderContent(source) }} />
}

export function LessonPage({ progress }: { progress: Progress }) {
  const params = useParams()
  const level = (params.level === 'intermediate' ? 'intermediate' : 'beginner') as Level
  const id = Number(params.id || 1)
  const lessons = level === 'beginner' ? beginnerLessons : intermediateLessons
  const lesson = lessons.find((item) => item.id === id)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showRuby, setShowRuby] = useState(true)

  useEffect(() => { window.scrollTo(0, 0); setShowTranslation(false) }, [id, level])
  const lessonWords = useMemo(() => level === 'beginner' ? wordsForLesson(id).slice(0, 30) : [], [id, level])
  const lessonGrammar = useMemo(() => level === 'beginner' ? grammarForLesson(id) : [], [id, level])

  if (!lesson) return <div className="page empty-state">没有找到这节课程。<Link to="/courses">返回课程地图</Link></div>

  const key = lessonKey(level, id)
  const completed = progress.completed.includes(key)
  const previous = id > 1 ? id - 1 : null
  const next = id < lessons.length ? id + 1 : null

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
            <p>{level === 'beginner' ? '本课建议用 20 分钟完成：先理解句型，再跟读课文，最后复习词汇。' : `会话：${plainJapanese(lesson.sceneTitle)}`}</p>
            <div className="lesson-tools">
              <button onClick={() => setShowRuby((value) => !value)}>{showRuby ? <EyeOff size={16} /> : <Eye size={16} />}{showRuby ? '隐藏注音' : '显示注音'}</button>
              <button onClick={() => setShowTranslation((value) => !value)}><Eye size={16} />{showTranslation ? '隐藏译文' : '显示译文'}</button>
              <button onClick={() => speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(plainJapanese(lesson.title)), { lang: 'ja-JP' }))}><Volume2 size={16} />朗读标题</button>
            </div>
          </section>

          <section id="text" className="lesson-section">
            <div className="lesson-section-title"><span>01</span><div><h2>{level === 'beginner' ? '基本课文' : lesson.sceneTitle}</h2><p>先完整阅读，再逐句跟读</p></div></div>
            <ContentBlock source={lesson.basic} />
            {lesson.conversation && <ContentBlock source={lesson.conversation} />}
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
            <div className="word-grid">{lessonWords.map((word, index) => <button className="word-card" key={`${word.lesson}-${index}`} onClick={() => speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(plainJapanese(word.word || word.kana)), { lang: 'ja-JP' }))}><span dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji) }} /><small>{word.kana.replace(/@\d*/g, '')}</small><b>{word.desc}</b><Volume2 size={14} /></button>)}</div>
          </section>}

          <div className="lesson-finish">
            <div><CheckCircle2 size={29} /><span><strong>完成本课了吗？</strong><small>标记后，学习进度会保存在这台设备上。</small></span></div>
            <button className={completed ? 'completed' : ''} onClick={() => progress.toggle(key)}>{completed ? '取消完成' : '完成本课'}</button>
          </div>
          <nav className="lesson-pagination">
            {previous ? <Link to={`/lesson/${level}/${previous}`}><ArrowLeft />第 {previous} 课</Link> : <span />}
            {next ? <Link to={`/lesson/${level}/${next}`}>第 {next} 课<ArrowRight /></Link> : <Link to="/courses">返回课程地图<ArrowRight /></Link>}
          </nav>
        </article>
      </div>
    </div>
  )
}
