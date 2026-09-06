import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Search, X } from 'lucide-react'
import { beginnerLessons, intermediateLessons } from '../data'
import { grammarCatalog, grammarMeaning, grammarNotes, grammarTitle, grammarTopic, grammarTopics, grammarLesson, grammarLessonLabel, grammarLessonKeys } from '../grammarGuide'
import { GrammarDetail } from '../components/GrammarDetail'
import type { StudyController } from '../study'

export function GrammarPage({ study }: { study: StudyController }) {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [lessonId, setLessonId] = useState('all')
  const [topic, setTopic] = useState('all')
  const [level, setLevel] = useState('all')
  const [savedOnly, setSavedOnly] = useState(params.get('saved') === '1')
  const [mode, setMode] = useState<'read' | 'practice'>('read')
  const [answer, setAnswer] = useState<string | null>(null)
  const filtered = useMemo(() => grammarCatalog.filter((g) => {
    const note = grammarNotes[g.idx]
    return (lessonId === 'all' || grammarLessonKeys(g).includes(lessonId)) && (topic === 'all' || grammarTopic(g) === topic)
      && (level === 'all' || (level === 'notes' ? !!note : note?.level === level))
      && (!savedOnly || study.bookmarkedGrammarIds.includes(g.idx))
      && (!query.trim() || `${grammarTitle(g)} ${grammarMeaning(g)} ${g.explanation} ${note?.connection.join(' ') || ''}`.toLowerCase().includes(query.trim().toLowerCase()))
      && (mode !== 'practice' || !!note)
  }), [query, lessonId, topic, level, savedOnly, study.bookmarkedGrammarIds, mode])
  const selected = filtered.find((g) => g.idx === params.get('item')) || filtered[0]
  const lesson = selected ? grammarLesson(selected, lessonId) : undefined
  const note = selected && grammarNotes[selected.idx]
  const select = (id: string) => { setParams({ item: id }); setAnswer(null) }
  useEffect(() => setAnswer(null), [selected?.idx, mode])
  const reset = () => { setQuery(''); setLessonId('all'); setTopic('all'); setLevel('all'); setSavedOnly(false) }
  return <div className="page grammar-page">
    <header className="workbench-heading"><div><span className="eyebrow">文法ノート / GRAMMAR</span><h1>语法手册<span>把句型，放回语境。</span></h1><p>查接续、看辨析，再用完整句子确认自己是否理解。</p></div><Link className="button primary" to={`/review?kind=grammar&level=${lesson?.level || 'beginner'}&lesson=${lesson?.id || 1}`}>卡片复习 <ArrowRight size={18} /></Link></header>
    <section className="grammar-controls" aria-label="筛选语法"><label className="grammar-search"><Search size={19} /><input aria-label="搜索句型或中文含义" placeholder="搜索句型或中文含义，如：ほど、必须、传闻" value={query} onChange={(e) => setQuery(e.target.value)} />{query && <button type="button" aria-label="清空搜索" onClick={() => setQuery('')}><X size={16} /></button>}</label>
      <div className="grammar-filter-row"><label>课文<select value={lessonId} onChange={(e) => setLessonId(e.target.value)}><option value="all">初级 + 中级</option><optgroup label="初级">{beginnerLessons.map((l) => <option key={l.id} value={String(l.id).padStart(3, '0')}>初级第 {l.id} 课</option>)}</optgroup><optgroup label="中级">{intermediateLessons.map((l) => <option key={l.id} value={`m${String(l.id).padStart(2, '0')}`}>中级第 {l.id} 课</option>)}</optgroup></select></label><label>主题<select value={topic} onChange={(e) => setTopic(e.target.value)}><option value="all">全部主题</option>{grammarTopics.map((t) => <option key={t}>{t}</option>)}</select></label><label>学习范围<select value={level} onChange={(e) => setLevel(e.target.value)}><option value="all">全部语法</option><option value="notes">重点精讲</option><option value="N5">N5 参考</option><option value="N4">N4 参考</option><option value="N3">N3 参考</option><option value="N2">N2 参考</option></select></label><button className={`quiet-button ${savedOnly ? 'is-saved' : ''}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={17} />只看收藏</button></div>
    </section>
    <div className="grammar-mode-bar"><div className="segmented-control"><button className={mode === 'read' ? 'active' : ''} onClick={() => setMode('read')}>查阅讲解</button><button className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>辨析自测</button></div><span>{filtered.length} 条{mode === 'practice' ? '原创自测 · 非真题' : '语法'}</span></div>
    {selected && lesson ? <div className={`grammar-workbench ${params.has('item') ? 'detail-open' : ''}`}><aside className="grammar-index" aria-label="语法列表">{filtered.map((g) => <button key={g.idx} className={g.idx === selected.idx ? 'active' : ''} onClick={() => select(g.idx)} aria-current={g.idx === selected.idx ? 'true' : undefined}><span><small>{grammarLessonLabel(g)}{grammarNotes[g.idx] ? ' · 精讲' : ''}</small><strong lang="ja">{grammarTitle(g)}</strong><p>{grammarMeaning(g)}</p></span>{study.bookmarkedGrammarIds.includes(g.idx) ? <Bookmark size={16} fill="currentColor" /> : <ArrowRight size={16} />}</button>)}</aside>
      <section className="grammar-reading-pane" aria-label="语法讲解"><button className="grammar-mobile-back quiet-button" onClick={() => setParams({})}><ArrowLeft size={17} />返回语法列表</button>
        {mode === 'read' ? <GrammarDetail key={selected.idx} grammar={selected} lesson={lesson} study={study} onRelated={reset} /> : note && <article className="grammar-practice"><span className="eyebrow">想清楚接续与语义，再选择答案</span><h2>选出合适的表达</h2><p className="practice-question" lang="ja">{note.question}</p><div className="practice-options">{note.choices.map((choice, i) => <button key={choice} disabled={answer !== null} className={answer !== null ? (choice === note.answer ? 'correct' : choice === answer ? 'incorrect' : '') : ''} onClick={() => setAnswer(choice)}><span>{i + 1}</span>{choice}</button>)}</div>{answer !== null && <div className="practice-feedback" role="status"><h3>{answer === note.answer ? '答对了，接续和含义都要记住。' : `正确表达：${note.answer}`}</h3><p>{note.reason}</p><p>{note.contrast}</p><div><button className="quiet-button" onClick={() => study.toggleGrammarBookmark(selected.idx)}><Bookmark size={17} />{study.bookmarkedGrammarIds.includes(selected.idx) ? '已收藏语法' : '收藏这条语法'}</button><button className="button primary" onClick={() => select(filtered[(filtered.indexOf(selected) + 1) % filtered.length].idx)}>下一题 <ArrowRight size={17} /></button></div><button className="quiet-button" onClick={() => setMode('read')}>查看完整讲解</button></div>}</article>}
      </section></div> : <section className="grammar-no-results"><BookOpen size={32} /><h2>没有符合条件的语法</h2><p>{mode === 'practice' ? '自测目前覆盖重点精讲句型，可以放宽筛选范围。' : '换一个关键词，或取消筛选条件。'}</p><button className="button secondary" onClick={reset}>重置筛选</button></section>}
    <footer className="grammar-scope-note">当前语法库覆盖新标日初级 48 课、中级 32 课；{Object.keys(grammarNotes).length} 条重点句型含补充精讲与自测。N5–N2 标签仅用于已补充精讲的句型，是学习参考，非官方考纲或完整题库。备考还需结合阅读、听力与 <a href="https://www.jlpt.jp/e/samples/sampleindex.html" target="_blank" rel="noreferrer">JLPT 官方样题 ↗</a>。</footer>
  </div>
}
