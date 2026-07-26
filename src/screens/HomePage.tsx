import { useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Download,
  Flame,
  Headphones,
  Languages,
  Play,
  Save,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { plainJapanese } from '../content'
import { beginnerLessons, intermediateLessons, lessonKey } from '../data'
import { downloadProgressBackup, restoreProgressBackup } from '../progressBackup'
import type { StudyController } from '../study'

interface Progress {
  completed: string[]
}

export function HomePage({ study, progress }: { study: StudyController; progress: Progress }) {
  const restoreInput = useRef<HTMLInputElement>(null)
  const [restoreError, setRestoreError] = useState(false)
  const completedLessons = beginnerLessons.filter((lesson) =>
    progress.completed.includes(lessonKey('beginner', lesson.id)),
  )
  const nextLesson =
    beginnerLessons.find((lesson) => !progress.completed.includes(lessonKey('beginner', lesson.id)))
    ?? beginnerLessons.at(-1)
    ?? beginnerLessons[0]!
  const hasStarted = completedLessons.length > 0
  const isComplete = completedLessons.length === beginnerLessons.length
  const nextLabel = isComplete ? '重新查看最后一课' : hasStarted ? `继续第 ${nextLesson.id} 课` : '开始第一课'
  const progressPercent = (completedLessons.length / beginnerLessons.length) * 100

  const importBackup = async (file?: File) => {
    if (!file) return
    setRestoreError(false)
    try {
      await restoreProgressBackup(file)
    } catch {
      setRestoreError(true)
    }
  }

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">新标准日本语 · 初级 + 中级 · 共 {beginnerLessons.length + intermediateLessons.length} 课</span>
          <h1>{hasStarted ? '继续你的新标日学习，' : '从零基础开始，'}<br /><em>系统衔接 JLPT N2。</em></h1>
          <p>
            {hasStarted
              ? `你已经完成初级 ${completedLessons.length} 课。课程完整覆盖《新标准日本语》初级与中级，进度会自动保存，下次打开继续学习。`
              : '完整学习《新标准日本语》初级 48 课与中级 32 课，循序建立词汇、语法、听读与会话基础，为 JLPT N2 学习和备考打好框架。'}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={`/lesson/beginner/${nextLesson.id}`}>
              {nextLabel} <ArrowRight size={17} />
            </Link>
            <Link className="button secondary" to="/courses">查看全部课程</Link>
          </div>
          <div className="trust-row">
            <span><BookOpen size={14} /> 新标日初级 + 中级</span>
            <span><Check size={14} /> {beginnerLessons.length + intermediateLessons.length} 课完整内容</span>
            <span><Flame size={14} /> 学完系统衔接 N2</span>
          </div>
        </div>

        <div className="focus-card">
          <div className="focus-card-head">
            <span>继续学习</span><small>进度已自动保存</small>
          </div>
          <div className="lesson-number">LESSON {String(nextLesson.id).padStart(2, '0')} / {beginnerLessons.length}</div>
          <div className="focus-japanese" dangerouslySetInnerHTML={{ __html: plainJapanese(nextLesson.title) }} />
          <p>从你上次停下的位置继续，学完后标记完成即可。</p>
          <div className="focus-tasks">
            <span><BookOpen size={16} /> 阅读基本课文</span>
            <span><Headphones size={16} /> 点击词语听读音</span>
            <span><Languages size={16} /> 复习本课词汇</span>
          </div>
          <Link to={`/lesson/beginner/${nextLesson.id}`} className="focus-play">
            <Play size={17} fill="currentColor" /> {nextLabel}
          </Link>
          <div className="progress-meta"><span>初级课程进度</span><b>{completedLessons.length} / {beginnerLessons.length}</b></div>
          <div className="progress-track"><i style={{ width: `${Math.max(progressPercent, 2)}%` }} /></div>
        </div>
      </section>

      <section className="starter-strip quick-navigation">
        <div><span className="eyebrow">QUICK ACCESS</span><h2>快速进入</h2></div>
        <Link className="mini-step" to={`/lesson/beginner/${nextLesson.id}`}>
          <span>続</span><p><b>继续课程</b><small>第 {nextLesson.id} 课</small></p>
        </Link>
        <Link className="mini-step" to="/courses">
          <span>課</span><p><b>全部课程</b><small>自由选择</small></p>
        </Link>
        <Link className="mini-step" to="/review">
          <span>復</span><p><b>复习词汇</b><small>{study.dueWords.length} 个待复习</small></p>
        </Link>
        <Link className="starter-arrow" to={`/lesson/beginner/${nextLesson.id}`} aria-label={nextLabel}><ArrowRight /></Link>
      </section>

      <section className="content-section">
        <div className="section-title">
          <div><span className="eyebrow">PROGRESS</span><h2>个人学习进度</h2></div>
          <Link to="/courses">查看课程导航 <ArrowRight size={15} /></Link>
        </div>
        <div className="progress-save">
          <div className="progress-save-copy">
            <span className="progress-save-icon"><Save size={20} /></span>
            <div>
              <strong>已自动保存到当前浏览器</strong>
              <p>同一台设备再次打开会自动恢复。更换设备或清理浏览器前，请下载一份进度备份。</p>
              {restoreError && <small role="alert">无法读取这个备份文件，请选择本站导出的 JSON 文件。</small>}
            </div>
          </div>
          <div className="progress-save-actions">
            <button className="button secondary" type="button" onClick={downloadProgressBackup}>
              <Download size={15} /> 备份进度
            </button>
            <button className="button secondary" type="button" onClick={() => restoreInput.current?.click()}>
              <Upload size={15} /> 恢复进度
            </button>
            <input
              ref={restoreInput}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(event) => void importBackup(event.target.files?.[0])}
            />
          </div>
        </div>

        <div className="path-cards progress-path-cards">
          <Link className="path-card coral" to={`/lesson/beginner/${nextLesson.id}`}>
            <span className="path-icon">続</span><small>当前进度</small><h3>第 {nextLesson.id} 课</h3>
            <p>{isComplete ? '初级课程已全部完成，可以随时回看。' : `已完成 ${completedLessons.length} 课，继续学习下一课。`}</p>
            <b>{nextLabel} <ArrowRight size={14} /></b>
          </Link>
          <Link className="path-card indigo" to="/courses">
            <span className="path-icon">課</span><small>课程导航</small><h3>全部课程</h3>
            <p>按初级和中级浏览全部内容，随时跳转到任意课程。</p>
            <b>打开课程库 <ArrowRight size={14} /></b>
          </Link>
          <Link className="path-card mint" to="/review">
            <span className="path-icon"><Clock3 size={22} /></span><small>词汇复习</small><h3>智能复习</h3>
            <p>只复习已经学过和当前需要记忆的词汇。</p>
            <b>开始复习 <ArrowRight size={14} /></b>
          </Link>
        </div>
      </section>
    </div>
  )
}
