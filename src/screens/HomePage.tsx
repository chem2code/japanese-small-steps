import { useRef, useState } from 'react'
import { ArrowRight, BookOpen, Bookmark, Check, Download, Headphones, Languages, Play, Save, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { beginnerLessons, intermediateLessons } from '../data'
import { downloadProgressBackup, restoreProgressBackup } from '../progressBackup'
import type { StudyController } from '../study'

export function HomePage({ study }: { study: StudyController }) {
  const restoreInput = useRef<HTMLInputElement>(null)
  const [restoreError, setRestoreError] = useState(false)
  const lessonCount = beginnerLessons.length + intermediateLessons.length
  const importBackup = async (file?: File) => {
    if (!file) return
    setRestoreError(false)
    try { await restoreProgressBackup(file) } catch { setRestoreError(true) }
  }

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">新标准日本语 · 初级 + 中级 · 共 {lessonCount} 课</span>
          <h1>把《新标日》<br /><em>装进口袋。</em></h1>
          <p>一本随时打开的在线教材。按课查看课文、语法、生词、音频与配套视频，不设计划，也不追踪课程完成度。</p>
          <div className="hero-actions">
            <Link className="button primary" to="/courses">打开课程目录 <ArrowRight size={17} /></Link>
            <Link className="button secondary" to="/lesson/beginner/1">从第 1 课开始</Link>
          </div>
          <div className="trust-row">
            <span><BookOpen size={14} /> 新标日初级 + 中级</span><span><Check size={14} /> {lessonCount} 课完整内容</span><span><Bookmark size={14} /> 单词与例句可收藏</span>
          </div>
        </div>
        <div className="focus-card">
          <div className="focus-card-head"><span>教材导航</span><small>自由选课</small></div>
          <div className="lesson-number">ONLINE TEXTBOOK · {lessonCount} LESSONS</div>
          <div className="focus-japanese">新标准日本語</div>
          <p>按自己的节奏查阅任意一课，需要时将重点单词和例句收藏起来。</p>
          <div className="focus-tasks"><span><BookOpen size={16} /> 课文与中文译文</span><span><Headphones size={16} /> 课文、单词与例句发音</span><span><Languages size={16} /> 语法讲解与课文例句</span></div>
          <Link to="/courses" className="focus-play"><Play size={17} fill="currentColor" /> 进入教材</Link>
        </div>
      </section>

      <section className="starter-strip quick-navigation">
        <div><span className="eyebrow">QUICK ACCESS</span><h2>快速进入</h2></div>
        <Link className="mini-step" to="/courses"><span>課</span><p><b>课程目录</b><small>80 课自由选择</small></p></Link>
        <Link className="mini-step" to="/lesson/beginner/1"><span>初</span><p><b>初级第 1 课</b><small>零基础起步</small></p></Link>
        <Link className="mini-step" to="/bookmarks"><span>藏</span><p><b>我的收藏</b><small>{study.bookmarkedWords.length} 个单词 · {study.bookmarkedSentences.length} 条例句</small></p></Link>
        <Link className="starter-arrow" to="/courses" aria-label="打开课程目录"><ArrowRight /></Link>
      </section>

      <section className="content-section">
        <div className="section-title"><div><span className="eyebrow">TEXTBOOK & COLLECTIONS</span><h2>教材与收藏</h2></div><Link to="/courses">查看课程导航 <ArrowRight size={15} /></Link></div>
        <div className="progress-save">
          <div className="progress-save-copy"><span className="progress-save-icon"><Save size={20} /></span><div><strong>收藏保存在当前浏览器</strong><p>单词和例句收藏会自动保存。更换手机或电脑前，请下载备份，再在新设备上恢复。</p>{restoreError && <small role="alert">无法读取这个备份文件，请选择本站导出的 JSON 文件。</small>}</div></div>
          <div className="progress-save-actions"><button className="button secondary" type="button" onClick={downloadProgressBackup}><Download size={15} />备份收藏</button><button className="button secondary" type="button" onClick={() => restoreInput.current?.click()}><Upload size={15} />恢复收藏</button><input ref={restoreInput} type="file" accept="application/json,.json" hidden onChange={(event) => void importBackup(event.target.files?.[0])} /></div>
        </div>
        <div className="path-cards progress-path-cards">
          <Link className="path-card coral" to="/courses#beginner"><span className="path-icon">初</span><small>48 课</small><h3>新标日初级</h3><p>从基础表达开始，建立词汇与语法框架。</p><b>查看初级 <ArrowRight size={14} /></b></Link>
          <Link className="path-card indigo" to="/courses#intermediate"><span className="path-icon">中</span><small>32 课</small><h3>新标日中级</h3><p>提升阅读、会话与综合表达，系统衔接 JLPT N2。</p><b>查看中级 <ArrowRight size={14} /></b></Link>
          <Link className="path-card mint" to="/bookmarks"><span className="path-icon"><Bookmark size={22} /></span><small>随时回看</small><h3>我的收藏</h3><p>将重点单词与有用的课文例句集中在一起。</p><b>打开收藏 <ArrowRight size={14} /></b></Link>
        </div>
      </section>
    </div>
  )
}
