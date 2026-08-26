import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, ListVideo, Pause, Play, Volume2, VolumeX, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { assetUrl } from '../assetUrl'
import { plainJapanese } from '../content'
import { beginnerLessons } from '../data'

export function ShortsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedLesson = Number(searchParams.get('lesson') || 1)
  const initialIndex = Math.max(0, Math.min(beginnerLessons.length - 1, requestedLesson - 1))
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLElement | null>>([])
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  const goTo = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const next = Math.max(0, Math.min(beginnerLessons.length - 1, index))
    slideRefs.current[next]?.scrollIntoView({ behavior, block: 'start' })
    setActiveIndex(next)
    setSearchParams({ lesson: String(next + 1) }, { replace: true })
    setPickerOpen(false)
  }, [setSearchParams])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => goTo(initialIndex, 'auto'))
    return () => window.cancelAnimationFrame(frame)
  }, []) // Initial deep link only.

  useEffect(() => {
    const root = feedRef.current
    if (!root) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible || visible.intersectionRatio < 0.6) return
      const index = Number((visible.target as HTMLElement).dataset.index)
      setActiveIndex(index)
      setSearchParams({ lesson: String(index + 1) }, { replace: true })
      videoRefs.current.forEach((video, videoIndex) => {
        if (!video) return
        if (videoIndex === index) {
          video.muted = muted
          void video.play().catch(() => setPlaying(false))
        } else {
          video.pause()
        }
      })
    }, { root, threshold: [0.6, 0.85] })
    slideRefs.current.forEach((slide) => slide && observer.observe(slide))
    return () => observer.disconnect()
  }, [muted, setSearchParams])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (pickerOpen) return
      if (event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); goTo(activeIndex + 1) }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); goTo(activeIndex - 1) }
      if (event.key === ' ') { event.preventDefault(); togglePlayback() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const togglePlayback = () => {
    const video = videoRefs.current[activeIndex]
    if (!video) return
    if (video.paused) void video.play(); else video.pause()
  }

  const toggleSound = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    const video = videoRefs.current[activeIndex]
    if (video) { video.muted = nextMuted; if (!nextMuted) void video.play() }
  }

  return (
    <div className="shorts-page">
      <header className="shorts-topbar">
        <Link to="/" aria-label="退出小视频模式"><X size={21} /></Link>
        <button type="button" onClick={() => setPickerOpen(true)}><ListVideo size={17} /><span>初级 · 第 {activeIndex + 1} 课</span><ChevronDown size={15} /></button>
        <span>{activeIndex + 1} / {beginnerLessons.length}</span>
      </header>

      <div className="shorts-feed" ref={feedRef} aria-label="课文场景小视频">
        {beginnerLessons.map((lesson, index) => (
          <section className="shorts-slide" data-index={index} key={lesson.id} ref={(node) => { slideRefs.current[index] = node }}>
            <div className="shorts-stage" onClick={togglePlayback}>
              <video
                ref={(node) => { videoRefs.current[index] = node }}
                src={assetUrl(`/assets/lesson-videos/l${lesson.id}.mp4`)}
                muted={muted}
                playsInline
                preload={Math.abs(index - activeIndex) <= 1 ? 'metadata' : 'none'}
                onPlay={() => index === activeIndex && setPlaying(true)}
                onPause={() => index === activeIndex && setPlaying(false)}
                onEnded={() => index < beginnerLessons.length - 1 && goTo(index + 1)}
              />
              <div className="shorts-shade" />
              {!playing && index === activeIndex && <span className="shorts-paused"><Play size={30} fill="currentColor" /></span>}
              <div className="shorts-caption">
                <span>LESSON {String(lesson.id).padStart(2, '0')} · 课文场景</span>
                <h1>{plainJapanese(lesson.sceneTitle || lesson.title)}</h1>
                <p>{plainJapanese(lesson.title)}</p>
              </div>
              <aside className="shorts-actions" onClick={(event) => event.stopPropagation()}>
                <button type="button" onClick={toggleSound} aria-label={muted ? '打开声音' : '静音'}>{muted ? <VolumeX /> : <Volume2 />}<span>{muted ? '开声音' : '已开声'}</span></button>
                <button type="button" onClick={togglePlayback} aria-label={playing ? '暂停' : '播放'}>{playing ? <Pause /> : <Play />}<span>{playing ? '暂停' : '播放'}</span></button>
                <Link to={`/lesson/beginner/${lesson.id}#text`}><BookOpen /><span>看课文</span></Link>
              </aside>
              {index === 0 && <div className="shorts-hint"><ChevronUp size={18} /><span>上滑切换下一课</span></div>}
            </div>
          </section>
        ))}
      </div>

      {pickerOpen && <div className="shorts-picker-backdrop" onClick={() => setPickerOpen(false)}>
        <section className="shorts-picker" role="dialog" aria-modal="true" aria-label="选择课文" onClick={(event) => event.stopPropagation()}>
          <header><div><span>CHOOSE A LESSON</span><h2>选择课文场景</h2></div><button type="button" onClick={() => setPickerOpen(false)} aria-label="关闭"><X size={20} /></button></header>
          <div className="shorts-picker-units">
            {Array.from({ length: 12 }, (_, unit) => <div className="shorts-picker-unit" key={unit}><strong>第 {unit + 1} 单元</strong><div>{beginnerLessons.slice(unit * 4, unit * 4 + 4).map((lesson) => <button className={lesson.id === activeIndex + 1 ? 'active' : ''} type="button" key={lesson.id} onClick={() => goTo(lesson.id - 1)}><span>{lesson.id}</span><small>{plainJapanese(lesson.sceneTitle || lesson.title)}</small></button>)}</div></div>)}
          </div>
        </section>
      </div>}
    </div>
  )
}
