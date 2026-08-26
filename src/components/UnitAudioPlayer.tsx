import { useEffect, useRef, useState, type RefObject } from 'react'
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { assetUrl } from '../assetUrl'
import { plainJapanese } from '../content'
import type { Lesson, Level } from '../data'

export function UnitAudioPlayer({
  level,
  lessons,
  audioRef: providedRef,
  onPlay,
}: {
  level: Level
  lessons: Lesson[]
  audioRef?: RefObject<HTMLAudioElement | null>
  onPlay?: () => void
}) {
  const internalRef = useRef<HTMLAudioElement>(null)
  const audioRef = providedRef || internalRef
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [continuePlayback, setContinuePlayback] = useState(false)
  const prefix = level === 'beginner' ? 'l' : 'm'
  const current = lessons[track]

  useEffect(() => {
    setTrack(0)
    setPlaying(false)
    setContinuePlayback(false)
  }, [level, lessons[0]?.id])

  useEffect(() => {
    if (!continuePlayback || !audioRef.current) return
    audioRef.current.load()
    void audioRef.current.play().catch(() => setPlaying(false))
    setContinuePlayback(false)
  }, [audioRef, continuePlayback, track])

  if (!current) return null

  const startUnit = () => {
    setTrack(0)
    setPlaying(true)
    setContinuePlayback(true)
  }

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  const changeTrack = (next: number, autoplay = playing) => {
    setTrack(Math.max(0, Math.min(next, lessons.length - 1)))
    setContinuePlayback(autoplay)
  }

  const handleEnded = () => {
    if (track < lessons.length - 1) changeTrack(track + 1, true)
    else setPlaying(false)
  }

  return (
    <section className="unit-audio-player" aria-label={`第 ${Math.ceil(current.id / 4)} 单元课文连播`}>
      <div className="unit-audio-head">
        <span className="unit-audio-icon"><Volume2 size={18} /></span>
        <div><strong>本单元课文连播</strong><small>第 {lessons[0].id}–{lessons.at(-1)?.id} 课 · 播完自动进入下一课</small></div>
        <button type="button" className="unit-start" onClick={startUnit}><RotateCcw size={14} />从头播放</button>
      </div>
      <div className="unit-now-playing">
        <button type="button" onClick={() => changeTrack(track - 1)} disabled={track === 0} aria-label="上一课"><SkipBack size={16} /></button>
        <button type="button" className="unit-play" onClick={togglePlayback} aria-label={playing ? '暂停' : '播放'}>{playing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}</button>
        <div><small>正在播放 · 第 {current.id} 课</small><strong>{plainJapanese(current.title || current.sceneTitle)}</strong></div>
        <button type="button" onClick={() => changeTrack(track + 1)} disabled={track === lessons.length - 1} aria-label="下一课"><SkipForward size={16} /></button>
      </div>
      <audio
        ref={audioRef}
        preload="metadata"
        src={assetUrl(`/assets/audio/lesson/${prefix}${current.id}.mp3`)}
        onPlay={() => { setPlaying(true); onPlay?.() }}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
      />
      <div className="unit-track-list">
        {lessons.map((lesson, index) => (
          <button type="button" className={index === track ? 'active' : ''} key={lesson.id} onClick={() => changeTrack(index)}>
            <span>{index === track && playing ? <Volume2 size={12} /> : lesson.id}</span>
            <small>第 {lesson.id} 课</small>
          </button>
        ))}
      </div>
    </section>
  )
}
