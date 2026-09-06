import { useEffect, useState } from 'react'
import { Bookmark, Check, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Grammar } from '../lessonDetails'
import type { Lesson } from '../data'
import type { StudyController } from '../study'
import { grammarNotes, grammarTitle, grammarMeaning, grammarTopic } from '../grammarGuide'
import { grammarExampleForLesson } from '../grammarExamples'
import { assetUrl } from '../assetUrl'
import { plainJapanese } from '../content'

let playing: HTMLAudioElement | null = null
let generation = 0
export function stopGrammarAudio() {
  generation += 1
  playing?.pause()
  window.speechSynthesis?.cancel()
}
export async function playGrammarAudio(text: string, path?: string, automatic = false) {
  stopGrammarAudio()
  document.querySelectorAll<HTMLMediaElement>('audio, video').forEach((media) => media.pause())
  const request = generation
  if (path) {
    playing = new Audio(assetUrl(path))
    try { await playing.play(); return } catch (error) {
      if (request !== generation) return
      if (automatic && error instanceof DOMException && error.name === 'NotAllowedError') throw error
    }
  }
  if (!('speechSynthesis' in window)) throw new Error('no-speech')
  const utterance = new SpeechSynthesisUtterance(plainJapanese(text).replace(/^[^：:]{1,12}[：:]\s*/, ''))
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith('ja'))
  utterance.voice = voices.find((voice) => /Nanami|Kyoko|Google|Natural/i.test(voice.name)) || voices[0] || null
  utterance.lang = 'ja-JP'
  utterance.rate = 0.85
  return new Promise<void>((resolve, reject) => {
    utterance.onstart = () => resolve()
    utterance.onerror = () => request === generation ? reject(new Error('speech-blocked')) : resolve()
    window.speechSynthesis.speak(utterance)
  })
}

export function GrammarDetail({ grammar, lesson, study, compact = false, onRelated }: { grammar: Grammar; lesson: Lesson; study: StudyController; compact?: boolean; onRelated?: () => void }) {
  const note = grammarNotes[grammar.idx]
  const example = grammarExampleForLesson(grammar, lesson)
  const bookmark = example ? { ...example, lessonId: lesson.id, level: lesson.level, grammarExpression: grammar.expression } : null
  const saved = study.bookmarkedGrammarIds.includes(grammar.idx)
  const [audioError, setAudioError] = useState(false)
  useEffect(() => () => stopGrammarAudio(), [grammar.idx])
  const play = (text: string, path?: string) => {
    setAudioError(false)
    void playGrammarAudio(text, path).catch(() => setAudioError(true))
  }
  return <article className={`grammar-detail ${compact ? 'compact' : ''}`}>
    <header className="grammar-detail-head"><div className="grammar-tags"><span>{grammarTopic(grammar)}</span><span>{lesson.level === 'beginner' ? '初级' : '中级'} · 第 {lesson.id} 课</span>{note && <span>{note.level} 参考</span>}</div><button type="button" className={`quiet-button ${saved ? 'is-saved' : ''}`} aria-pressed={saved} onClick={() => study.toggleGrammarBookmark(grammar.idx)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? '已收藏语法' : '收藏语法'}</button></header>
    {!compact && <h2 lang="ja">{grammarTitle(grammar)}</h2>}
    <p className="grammar-meaning">{grammarMeaning(grammar)}</p>
    {!note && grammar.shortexplain && grammar.explanation && <p className="grammar-meaning">{grammar.explanation.replace(/\\n/g, '\n')}</p>}
    {note && <><section className="grammar-connection"><h3>怎么接续</h3>{note.connection.map((line) => <p key={line}>{line}</p>)}</section>
      <div className="grammar-note-grid"><section><h3>记住这一点</h3><p>{note.tip}</p></section><section><h3>容易混淆</h3><p>{note.contrast}</p></section></div>
      <section className="grammar-sentence"><div className="sentence-toolbar"><span>用法例句 · 补充编写</span><button type="button" className="quiet-button" onClick={() => play(note.example)} aria-label="朗读补充例句"><Volume2 size={18} />听例句</button></div><p lang="ja">{note.example}</p><p className="sentence-translation">{note.translation}</p></section></>}
    {example && bookmark && <section className="grammar-sentence textbook-sentence"><div className="sentence-toolbar"><span>教材参考 · {lesson.level === 'intermediate' ? (example.section === '基本课文' ? '会话' : '课文') : example.section}</span><button type="button" className="quiet-button" onClick={() => play(example.sentence, example.audioPath)}><Volume2 size={18} />听原句</button></div><p lang="ja">{example.sentence}</p><div className="sentence-footer"><Link to={`/lesson/${lesson.level}/${lesson.id}#text`}>回到第 {lesson.id} 课 →</Link><button className="quiet-button" type="button" onClick={() => study.toggleSentenceBookmark(bookmark)}>{study.isSentenceBookmarked(bookmark) ? <Check size={16} /> : <Bookmark size={16} />}{study.isSentenceBookmarked(bookmark) ? '已收藏原句' : '收藏原句'}</button></div></section>}
    {!example && !note && <p className="grammar-empty-note">这条语法尚未匹配到可靠例句，可回到原课结合上下文查看。</p>}
    {audioError && <p className="audio-error" role="status">暂时无法播放，请再点一次；设备需要支持日语语音。</p>}
    {note && !compact && <nav className="related-grammar" aria-label="关联语法"><span>一起辨析</span>{note.related.map((id) => <Link key={id} onClick={onRelated} to={`/grammar?item=${id}`}>{grammarNotes[id]?.title || '相关表达'} →</Link>)}</nav>}
  </article>
}
