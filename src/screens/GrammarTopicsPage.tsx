import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Search, Volume2 } from 'lucide-react'
import { grammarTopicLessons, verbForms, verbModels, type GrammarTopicLesson } from '../grammarTopics'
import { japaneseMarkup } from '../content'
import { assetUrl } from '../assetUrl'
import './grammar-topics.css'

function VerbLab() {
  const [word, setWord] = useState(0)
  const [form, setForm] = useState(0)
  const [revealed, setRevealed] = useState(false)
  return <section className="topic-verb-lab"><span className="eyebrow">变形练习器</span><h2>选一个词，先自己变一次</h2><div className="topic-lab-selects"><label>辞书形<select value={word} onChange={(e) => { setWord(Number(e.target.value)); setRevealed(false) }}>{verbModels.map((v, i) => <option key={v.word} value={i}>{v.word} · {v.group}</option>)}</select></label><label>目标形式<select value={form} onChange={(e) => { setForm(Number(e.target.value)); setRevealed(false) }}>{verbForms.map((f, i) => <option value={i} key={f}>{f}</option>)}</select></label></div><div className="topic-transform"><strong lang="ja">{verbModels[word].word}</strong><ArrowRight size={22} /><button className="button secondary" onClick={() => setRevealed(!revealed)} aria-expanded={revealed}>{revealed ? verbModels[word].forms[form] : '想好后看答案'}</button></div><p>{verbModels[word].group} · {form > 3 ? '进阶形式：先看上面的接续规则。' : '遇到例外词，连同类别一起记。'}</p></section>
}

function TopicDetail({ topic }: { topic: GrammarTopicLesson }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [onlyQuestions, setOnlyQuestions] = useState<number[] | null>(null)
  const [activeAudio, setActiveAudio] = useState<number | null>(null)
  const [audioError, setAudioError] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)
  const playback = useRef(0)
  useEffect(() => { window.scrollTo(0, 0); return () => { playback.current++; audio.current?.pause() } }, [])
  const play = async (index: number) => {
    const token = ++playback.current
    const player = audio.current
    if (!player) return
    document.querySelectorAll<HTMLMediaElement>('audio,video').forEach((media) => media.pause())
    window.speechSynthesis?.cancel()
    if (activeAudio === index) { setActiveAudio(null); return }
    setAudioError(false); setActiveAudio(index)
    player.src = assetUrl(`/assets/audio/grammar-topics/${topic.id}-${index}.mp3`)
    try { await player.play() } catch { if (token === playback.current) { setActiveAudio(null); setAudioError(true) } }
  }
  const wrong = topic.quiz.map((q, i) => answers[i] && answers[i] !== q.answer ? i : -1).filter((i) => i >= 0)
  return <>
    <header className="topic-detail-heading"><Link to="/grammar/topics"><ArrowLeft size={17} />所有专题</Link><span className="eyebrow">{topic.subtitle}</span><h1>{topic.title}</h1><p>{topic.intro}</p></header>
    <nav className="topic-jump" aria-label="专题内导航">{[['rules','理解规则'],['examples','听场景例句'],['quiz','做辨析小测']].map(([id, label]) => <button key={id} onClick={() => document.getElementById(`topic-${id}`)?.scrollIntoView({ block: 'start' })}>{label}</button>)}</nav>
    <div className="topic-detail-grid"><article>
      <section id="topic-rules" className="topic-rules">{topic.sections.map((s, i) => <section key={s.title}><span className="topic-step">0{i + 1}</span><div><h2>{s.title}</h2>{s.body.map((p) => <p key={p}>{p}</p>)}</div></section>)}</section>
      <section className="topic-table-section"><h2>放在一起比较</h2><div className="topic-table-scroll" tabIndex={0} role="region" aria-label="语法变化对照表，可横向滚动"><table><thead><tr>{topic.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{topic.rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></section>
      {topic.id === 'verb-forms' && <VerbLab />}
      <section id="topic-examples" className="topic-examples"><h2>放进场景里听</h2><p className="topic-muted">原创教学例句 · Nanami 日语神经语音 · 汉字上方为假名</p><audio ref={audio} preload="none" onEnded={() => setActiveAudio(null)} />{audioError && <p role="alert">音频暂时无法播放，请检查网络后重试。为保持音色，不自动切换系统语音。</p>}{topic.examples.map((ex, i) => <figure key={ex.jp}><div><span>场景 0{i + 1}</span><button className="quiet-button" aria-pressed={activeAudio === i} onClick={() => void play(i)}><Volume2 size={18} />{activeAudio === i ? '停止' : '听例句'}</button></div><blockquote lang="ja" dangerouslySetInnerHTML={{ __html: japaneseMarkup(ex.jp) }} /><figcaption>{ex.zh}</figcaption><p>{ex.note}</p></figure>)}</section>
      <section id="topic-quiz" className="topic-quiz"><h2>不是背答案，是分清用法</h2><p className="topic-muted">原创辨析题，非 JLPT 真题。答错后看原因，再回到规则。</p><div className="topic-quiz-toolbar"><span aria-live="polite">已作答 {Object.keys(answers).length} / {topic.quiz.length} · 答对 {topic.quiz.filter((q, i) => answers[i] === q.answer).length}</span><button className="quiet-button" disabled={!wrong.length} onClick={() => { setOnlyQuestions(wrong); setAnswers((old) => Object.fromEntries(Object.entries(old).filter(([i]) => !wrong.includes(Number(i))))) }}>重练错题（{wrong.length}）</button><button className="quiet-button" onClick={() => { setAnswers({}); setOnlyQuestions(null) }}>重新练全部</button></div>{topic.quiz.map((q, i) => (onlyQuestions === null || onlyQuestions.includes(i)) && <fieldset key={q.prompt}><legend>{i + 1}. {q.prompt}</legend><div className="topic-options">{q.choices.map((choice) => <button key={choice} disabled={answers[i] !== undefined} aria-pressed={answers[i] === choice} className={answers[i] ? choice === q.answer ? 'correct' : answers[i] === choice ? 'incorrect' : '' : ''} onClick={() => setAnswers({ ...answers, [i]: choice })}>{choice}</button>)}</div>{answers[i] && <p className="topic-feedback" role="status"><strong>{answers[i] === q.answer ? '答对了。' : `正确答案：${q.answer}。`}</strong>{q.explanation}</p>}</fieldset>)}</section>
    </article><aside className="topic-related"><h2>回到教材看用法</h2><p>先理解专题，再结合课文复习。</p>{topic.lessons.map((id) => <Link key={id} to={`/lesson/beginner/${id}`}>初级 · 第 {id} 课 <ArrowRight size={16} /></Link>)}<Link to="/grammar">检索全部语法 <Search size={16} /></Link><h2>继续查其他专题</h2>{grammarTopicLessons.filter((t) => t.id !== topic.id).map((t) => <Link to={`/grammar/topics/${t.id}`} key={t.id}>{t.title}<ArrowRight size={16} /></Link>)}</aside></div>
    <footer className="topic-muted">本专题聚焦初级基础，不等同于完整考级大纲。规则参考：<a target="_blank" rel="noreferrer" href="https://www.irodori.jpf.go.jp/assets/data/Grammar_all.pdf">国际交流基金《いろどり》语法资料 ↗</a>。中文讲解、例句与练习为本站编写。</footer>
  </>
}

export function GrammarTopicsPage() {
  const { topicId } = useParams()
  const [query, setQuery] = useState('')
  const topic = grammarTopicLessons.find((t) => t.id === topicId)
  const filtered = grammarTopicLessons.filter((t) => `${t.title} ${t.subtitle} ${t.intro} ${t.sections.flatMap((s) => s.body).join(' ')}`.includes(query.trim()))
  return <div className="page topics-page">{topic ? <TopicDetail key={topic.id} topic={topic} /> : topicId ? <section className="empty-state"><h1>没有找到这个专题</h1><Link to="/grammar/topics">返回专题目录</Link></section> : <><header className="topic-hub-heading"><span className="eyebrow">文法の地図 / TOPICS</span><h1>把零散语法，连成一张地图。</h1><p>分不清词类、变不对词尾、选不准助词？从你遇到的问题开始。</p><Link to="/grammar">只想查一句型？打开语法手册 →</Link></header><label className="grammar-search topic-search"><Search size={19} /><input aria-label="搜索语法专题" placeholder="搜索：形容词、动词、て形、に、で……" value={query} onChange={(e) => setQuery(e.target.value)} /></label><section className="topic-card-grid" aria-label="专题目录">{filtered.map((t) => <Link key={t.id} className="topic-card" to={`/grammar/topics/${t.id}`}><span className="eyebrow">{t.subtitle}</span><h2>{t.title}</h2><p>{t.question}</p><div><span>规则 · 对照 · 例句 · {t.quiz.length} 道小测</span><ArrowRight size={20} /></div></Link>)}</section>{!filtered.length && <p role="status">暂未收录这个专题，试试“形容词”“动词”或“助词”。</p>}<aside className="topic-start"><h2>第一次学，怎么选？</h2><p>描述东西 → 一类／二类形容词；表达动作 → 动词变形；连接人、时间与地点 → 助词。无需按顺序完成，也不记录打卡进度。</p></aside></>}</div>
}
