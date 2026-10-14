import { useEffect, useRef, useState } from 'react'
import { Play, Square, Volume2 } from 'lucide-react'
import { lesson7Scenes, lesson7Lines } from '../lesson7Extension'
import { japaneseMarkup, plainJapanese } from '../content'
import { assetUrl } from '../assetUrl'
import './lesson-extension.css'

export function Lesson7Extension() {
  const audio = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [translation, setTranslation] = useState(true)
  const [error, setError] = useState(false)
  const [deviceVoice, setDeviceVoice] = useState(false)
  const request = useRef(0)
  const stop = () => { request.current++; audio.current?.pause(); window.speechSynthesis?.cancel(); setActive(null) }
  useEffect(() => () => { request.current++; audio.current?.pause(); window.speechSynthesis?.cancel() }, [])
  const play = async (id: string) => {
    stop()
    window.speechSynthesis?.cancel()
    document.querySelectorAll<HTMLMediaElement>('audio,video').forEach((media) => media.pause())
    const token = request.current
    const player = audio.current
    if (!player) return
    setError(false)
    setDeviceVoice(false)
    setActive(id)
    const speakLine = (index: number) => {
      if (token !== request.current) return
      setDeviceVoice(true)
      if (!window.speechSynthesis) { setError(true); setActive(null); return }
      const utterance = new SpeechSynthesisUtterance(plainJapanese(lesson7Lines[index][0]))
      utterance.lang = 'ja-JP'
      utterance.rate = 0.85
      const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith('ja'))
      utterance.voice = voices.find((voice) => /Nanami|Kyoko|Google|Natural/i.test(voice.name)) || voices[0] || null
      utterance.onend = () => { if (token !== request.current) return; if (id === 'full' && index + 1 < lesson7Lines.length) speakLine(index + 1); else setActive(null) }
      utterance.onerror = () => { if (token === request.current) { setError(true); setActive(null) } }
      window.speechSynthesis.speak(utterance)
    }
    player.src = assetUrl(`/assets/audio/lesson7-extension/${id}.mp3`)
    try { await player.play() } catch { if (token === request.current) speakLine(id === 'full' ? 0 : Number(id)) }
  }
  let index = 0
  return <section id="extension" className="lesson-section lesson-extension">
    <div className="lesson-section-title"><span>扩展</span><div><h2>小李的一天</h2><p>从早到晚，把日常动作放进生活里。</p></div></div>
    <p className="extension-source">根据第七课扩展表达原创编写，非教材原文。以「ます」句为主，按六个场景阅读。全文与逐句均使用 Nanami 日语神经语音；建议先听一遍，再隐藏中文跟读。</p>
    <div className="extension-controls"><button className="button primary" onClick={() => active === 'full' ? stop() : void play('full')}>{active === 'full' ? <Square size={18} /> : <Play size={18} />}{active === 'full' ? '停止全文' : '听完整的一天'}</button><button className="quiet-button" aria-pressed={translation} onClick={() => setTranslation(!translation)}>{translation ? '隐藏中文' : '显示中文'}</button>{active && active !== 'full' && <button className="quiet-button" onClick={stop}>停止播放</button>}</div>
    <audio ref={audio} preload="none" onEnded={() => setActive(null)} />
    {deviceVoice && <p role="status">预生成音频暂时不可用，当前使用设备日语语音，音色可能不同。可稍后重试。</p>}
    {error && <p role="alert">朗读暂时不可用，请确认设备已安装日语语音，或换用支持语音朗读的浏览器后重试。</p>}
    {lesson7Scenes.map((scene, sceneIndex) => <section className="extension-scene" key={scene.title}><h3><span>0{sceneIndex + 1}</span>{scene.title}</h3>{scene.lines.map(([jp, zh]) => { const id = String(index++); return <div className={`extension-line ${active === id ? 'is-playing' : ''}`} key={id}><div><p lang="ja" dangerouslySetInnerHTML={{ __html: japaneseMarkup(jp) }} />{translation && <p className="extension-translation">{zh}</p>}</div><button className="quiet-button" aria-label={`朗读第 ${Number(id) + 1} 句`} aria-pressed={active === id} onClick={() => active === id ? stop() : void play(id)}>{active === id ? <Square size={19} /> : <Volume2 size={19} />}</button></div> })}</section>)}
    <aside className="extension-tip"><strong>一起记，更不容易混淆</strong><p>服を着ます（穿衣）／靴をはきます（穿鞋）；どちらも脱ぎます（脱）。</p><p>かぎをかけます（锁门）／かぎを開けます（开锁）；電気をつけます（开灯）／消します（关灯）。</p><p>「頭を洗います」在这里是洗头，不是洗脸；洗脸用「顔を洗います」。</p></aside>
  </section>
}
