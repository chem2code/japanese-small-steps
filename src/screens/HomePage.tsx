import { useRef, useState } from 'react'
import { ArrowRight, BookOpen, Bookmark, Clapperboard, Download, Layers3, Languages, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { downloadProgressBackup, restoreProgressBackup } from '../progressBackup'
import type { StudyController } from '../study'
import { grammarCatalog } from '../grammarGuide'

export function HomePage({ study }: { study: StudyController }) {
  const restoreInput = useRef<HTMLInputElement>(null)
  const [restoreError, setRestoreError] = useState(false)
  const importBackup = async (file?: File) => {
    if (!file) return
    setRestoreError(false)
    try { await restoreProgressBackup(file) } catch { setRestoreError(true) }
  }
  return <div className="page notebook-home">
    <header className="notebook-heading"><div><span className="eyebrow">日本語のある毎日 / 日语小步</span><h1>今天，从哪里读起？</h1><p>新标日在线教材与语法手册。自由选课，随时查阅。</p></div><Link className="home-collection" to="/bookmarks"><Bookmark size={20} /><strong>{study.bookmarkedWords.length + study.bookmarkedSentences.length + study.bookmarkedGrammarIds.length}</strong><span>项收藏</span></Link></header>
    <section className="desk-grid" aria-label="学习入口">
      <Link className="desk-card textbook-desk" to="/courses"><span className="desk-card-top"><BookOpen size={24} /><span>TEXTBOOK / 01</span></span><h2>打开教材</h2><p>初级 48 课 · 中级 32 课<br />课文、单词、音频与配套视频</p><span className="desk-card-bottom">按单元选课 <ArrowRight size={22} /></span></Link>
      <Link className="desk-card grammar-desk" to="/grammar"><span className="desk-card-top"><Languages size={24} /><span>GRAMMAR / 02</span></span><h2>查一条语法</h2><p>{grammarCatalog.length} 条语法索引<br />从接续、例句到易混辨析</p><span className="desk-card-bottom">打开语法手册 <ArrowRight size={22} /></span></Link>
      <div className="desk-secondary"><Link to="/review"><Layers3 size={24} /><div><h2>卡片复习</h2><p>单词与语法 · 按课或单元</p></div><ArrowRight size={20} /></Link><Link to="/shorts"><Clapperboard size={24} /><div><h2>刷课文场景</h2><p>看场景，听日语</p></div><ArrowRight size={20} /></Link></div>
    </section>
    <section className="notebook-bottom"><div className="lesson-shelves"><div className="workbook-section-title"><h2>你的教材书架</h2><span>无需计划，直接阅读</span></div><Link to="/courses#beginner"><span className="book-spine">初</span><div><strong>新标准日本语 · 初级</strong><p>从基础句型到日常交流</p></div><span>48 课 <ArrowRight size={17} /></span></Link><Link to="/courses#intermediate"><span className="book-spine intermediate">中</span><div><strong>新标准日本语 · 中级</strong><p>阅读与表达进阶，衔接 N2 备考</p></div><span>32 课 <ArrowRight size={17} /></span></Link><Link className="first-lesson-link" to="/lesson/beginner/1">第一次来？从第 1 课开始 <ArrowRight size={17} /></Link></div>
      <aside className="grammar-preview-note"><span className="eyebrow">容易混淆 / 比较句</span><h2 lang="ja">「より」と「ほど」</h2><p>“比……更……”与“没有……那么……”<br />比较的方向，你分清了吗？</p><div lang="ja">A は B <mark>より</mark> 高い。<br />A は B <mark>ほど</mark> 高くない。</div><Link to="/grammar?item=106">读懂这一组句型 <ArrowRight size={18} /></Link></aside></section>
    <details className="collection-backup"><summary>收藏与设备备份 <span>保存在当前浏览器</span></summary><div><p>更换手机或电脑前，下载备份；在新设备恢复后即可继续使用收藏。</p><button className="quiet-button" onClick={downloadProgressBackup}><Download size={16} />下载备份</button><button className="quiet-button" onClick={() => restoreInput.current?.click()}><Upload size={16} />恢复备份</button><Link className="quiet-button" to="/grammar?saved=1">我的语法收藏 →</Link><input ref={restoreInput} type="file" accept="application/json,.json" hidden onChange={(event) => void importBackup(event.target.files?.[0])} />{restoreError && <p role="alert">无法读取这个备份，请选择本站导出的 JSON 文件。</p>}</div></details>
  </div>
}
