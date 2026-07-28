import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Clapperboard, Download, ExternalLink, Eye, EyeOff, Layers3, PlayCircle, Volume2 } from 'lucide-react'
import {
  beginnerLessons,
  intermediateLessons,
  lessonKey,
  type Level,
} from '../data'
import { grammarForLesson, wordsForLesson } from '../lessonDetails'
import { japaneseMarkup, plainJapanese, renderContent } from '../content'
import { exportLessonToAnki } from '../anki'
import { assetUrl } from '../assetUrl'
import { getLessonMedia } from '../lessonMedia'
import { bilibiliPlayerUrl, bilibiliVideoUrl, videosForLesson } from '../lessonVideos'
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
  const navigate = useNavigate()
  const level = (params.level === 'intermediate' ? 'intermediate' : 'beginner') as Level
  const id = Number(params.id || 1)
  const lessons = level === 'beginner' ? beginnerLessons : intermediateLessons
  const lesson = lessons.find((item) => item.id === id)
  const currentUnit = Math.ceil(id / 4)
  const unitCount = Math.ceil(lessons.length / 4)
  const unitLessons = lessons.filter((item) => Math.ceil(item.id / 4) === currentUnit)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showRuby, setShowRuby] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    setShowTranslation(false)
  }, [id])
  const lessonWords = useMemo(() => level === 'beginner' ? wordsForLesson(id) : [], [id, level])
  const lessonGrammar = useMemo(() => level === 'beginner' ? grammarForLesson(id) : [], [id, level])
  const lessonAudioRef = useRef<HTMLAudioElement>(null)
  const wordAudioRef = useRef<HTMLAudioElement>(null)
  const wordItemAudioRef = useRef<HTMLAudioElement>(null)
  const sceneVideoRef = useRef<HTMLVideoElement>(null)
  const [activeWord, setActiveWord] = useState<number | null>(null)
  const [studyOpen, setStudyOpen] = useState(false)
  const [exported, setExported] = useState(false)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [sceneVideoOpen, setSceneVideoOpen] = useState(false)
  const lessonVideos = useMemo(() => videosForLesson(level, id), [id, level])

  useEffect(() => {
    wordItemAudioRef.current?.pause()
    setActiveWord(null)
    setActiveVideo(null)
    setSceneVideoOpen(false)
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

  const toggleVideo = (videoKey: string) => {
    lessonAudioRef.current?.pause()
    wordAudioRef.current?.pause()
    sceneVideoRef.current?.pause()
    stopWordAudio()
    setSceneVideoOpen(false)
    setActiveVideo((current) => current === videoKey ? null : videoKey)
  }

  const toggleSceneVideo = () => {
    lessonAudioRef.current?.pause()
    wordAudioRef.current?.pause()
    stopWordAudio()
    setActiveVideo(null)
    if (sceneVideoOpen) sceneVideoRef.current?.pause()
    setSceneVideoOpen((current) => !current)
  }

  const handleSceneVideoPlay = () => {
    lessonAudioRef.current?.pause()
    wordAudioRef.current?.pause()
    stopWordAudio()
    setActiveVideo(null)
  }

  const exportAnki = () => {
    exportLessonToAnki(lessonWords, level, id, lesson.title)
    setExported(true)
    window.setTimeout(() => setExported(false), 2_500)
  }

  const toggleLessonCompletion = () => {
    progress.toggle(key)
    if (level === 'beginner') {
      const savedInStudy = study.completedDays.includes(id)
      if ((completed && savedInStudy) || (!completed && !savedInStudy)) study.toggleLesson(id)
    }
  }

  const completeLesson = () => {
    if (!completed) toggleLessonCompletion()
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const changeLevel = (nextLevel: Level) => {
    const nextLessons = nextLevel === 'beginner' ? beginnerLessons : intermediateLessons
    navigate(`/lesson/${nextLevel}/${Math.min(id, nextLessons.length)}`)
  }

  const changeUnit = (unit: number) => {
    navigate(`/lesson/${level}/${((unit - 1) * 4) + 1}`)
  }

  return (
    <div className={`lesson-page ${showRuby ? '' : 'hide-ruby'}`}>
      <header className="lesson-topbar">
        <Link className="lesson-map-link" to="/courses"><ArrowLeft size={17} /><span>课程地图</span></Link>
        <div className="lesson-mobile-title">
          <small>{level === 'beginner' ? '初级' : '中级'}</small>
          <strong>第 {id} 课</strong>
        </div>
        <div className="lesson-course-switcher" aria-label="快速切换课程">
          <label>
            <span>级别</span>
            <select aria-label="课程级别" value={level} onChange={(event) => changeLevel(event.target.value as Level)}>
              <option value="beginner">初级 · 48 课</option>
              <option value="intermediate">中级 · 32 课</option>
            </select>
          </label>
          <label>
            <span>单元</span>
            <select aria-label="课程单元" value={currentUnit} onChange={(event) => changeUnit(Number(event.target.value))}>
              {Array.from({ length: unitCount }, (_, index) => index + 1).map((unit) => (
                <option key={unit} value={unit}>第 {unit} 单元 · {((unit - 1) * 4) + 1}–{Math.min(unit * 4, lessons.length)} 课</option>
              ))}
            </select>
          </label>
          <label className="lesson-select">
            <span>课程</span>
            <select aria-label="当前课程" value={id} onChange={(event) => navigate(`/lesson/${level}/${event.target.value}`)}>
              {unitLessons.map((item) => (
                <option key={item.id} value={item.id}>第 {item.id} 课 · {plainJapanese(item.title)}</option>
              ))}
            </select>
          </label>
          <small>{id}/{lessons.length}</small>
        </div>
        <button className={completed ? 'completed' : ''} onClick={toggleLessonCompletion}>
          {completed ? <CheckCircle2 size={17} /> : <Check size={17} />}{completed ? '已完成' : '标记完成'}
        </button>
      </header>
      <div className="lesson-layout">
        <aside className="lesson-outline">
          <span>本课内容</span>
          <button type="button" onClick={() => scrollToSection('overview')}>课程概览</button>
          <button type="button" onClick={() => scrollToSection('text')}>基本课文</button>
          {lessonGrammar.length > 0 && <button type="button" onClick={() => scrollToSection('grammar')}>语法要点</button>}
          {lessonWords.length > 0 && <button type="button" onClick={() => scrollToSection('words')}>生词表</button>}
        </aside>
        <article className="lesson-article">
          <section id="overview" className="lesson-intro">
            <span className="eyebrow">LESSON {String(id).padStart(2, '0')}</span>
            <h1 dangerouslySetInnerHTML={{ __html: japaneseMarkup(lesson.title) }} />
            <p>{level === 'beginner' ? '本课建议用 20 分钟完成：先理解句型，再跟读课文，最后复习词汇。' : `会话：${plainJapanese(lesson.sceneTitle)}`}</p>
            {lessonMedia && (
              <figure className="lesson-visual">
                <img src={assetUrl(lessonMedia.src)} alt={lessonMedia.alt} loading="lazy" decoding="async" />
                <figcaption>{lessonMedia.caption}</figcaption>
              </figure>
            )}
            <div className="lesson-tools">
              <button onClick={() => setShowRuby((value) => !value)}>{showRuby ? <EyeOff size={16} /> : <Eye size={16} />}{showRuby ? '隐藏注音' : '显示注音'}</button>
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
            {lessonVideos.length > 0 && (
              <section className="lesson-videos" aria-labelledby="lesson-video-heading">
                <div className="lesson-videos-heading">
                  <div>
                    <span>VIDEO LESSON</span>
                    <h2 id="lesson-video-heading">配套视频讲解</h2>
                    <p>视频不会自动加载，确定观看后再点击展开。</p>
                  </div>
                  <small>来源：教日语的阿飞老师 · 哔哩哔哩</small>
                </div>
                <div className="lesson-video-options">
                  {lessonVideos.map((video) => (
                    <button
                      type="button"
                      className={activeVideo === video.key ? 'active' : ''}
                      key={video.key}
                      aria-expanded={activeVideo === video.key}
                      onClick={() => toggleVideo(video.key)}
                    >
                      <PlayCircle size={20} />
                      <span><strong>{video.label}</strong><small>{video.duration}</small></span>
                      <ChevronDown size={16} />
                    </button>
                  ))}
                </div>
                {lessonVideos.map((video) => activeVideo === video.key && (
                  <div className="lesson-video-player" key={video.key}>
                    <div className="lesson-video-frame">
                      <iframe
                        src={bilibiliPlayerUrl(video)}
                        title={video.title}
                        loading="lazy"
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                    <div className="lesson-video-meta">
                      <span>{video.title}</span>
                      <a href={bilibiliVideoUrl(video)} target="_blank" rel="noreferrer">
                        在哔哩哔哩打开 <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </section>

          <section id="text" className="lesson-section">
            <div className="lesson-section-title"><span>01</span><div><h2>{level === 'beginner' ? '基本课文' : lesson.sceneTitle}</h2><p>先完整阅读，再逐句跟读</p></div></div>
            {level === 'beginner' && (
              <section className={`scene-video-card ${sceneVideoOpen ? 'is-open' : ''}`} aria-label="课文情景视频">
                <button
                  type="button"
                  className="scene-video-trigger"
                  aria-expanded={sceneVideoOpen}
                  onClick={toggleSceneVideo}
                >
                  <span className="scene-video-icon"><Clapperboard size={19} /></span>
                  <span>
                    <small>VERTICAL STORY VIDEO · 第 {id} 课</small>
                    <strong>{plainJapanese(lesson.sceneTitle)} · 课文情景视频</strong>
                    <em>点击后加载竖屏视频，结合场景理解课文</em>
                  </span>
                  <ChevronDown size={18} />
                </button>
                {sceneVideoOpen && (
                  <div className="scene-video-content">
                    <div className="scene-video-phone">
                      <video
                        ref={sceneVideoRef}
                        controls
                        playsInline
                        preload="metadata"
                        src={assetUrl(`/assets/lesson-videos/l${id}.mp4`)}
                        onPlay={handleSceneVideoPlay}
                      >
                        你的浏览器不支持视频播放。
                      </video>
                    </div>
                    <div className="scene-video-guide">
                      <span className="eyebrow">SCENE FIRST</span>
                      <h3>先看场景，再读课文</h3>
                      <p>这段竖屏视频对应本课应用课文“{plainJapanese(lesson.sceneTitle)}”。建议先完整看一遍，再回到下方原文跟读。</p>
                      <ol>
                        <li><b>第一遍</b><span>只看情景和人物关系</span></li>
                        <li><b>第二遍</b><span>留意本课句型如何使用</span></li>
                        <li><b>最后</b><span>回到原文，尝试逐句跟读</span></li>
                      </ol>
                    </div>
                  </div>
                )}
              </section>
            )}
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
