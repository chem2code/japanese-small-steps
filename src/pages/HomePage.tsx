import { ArrowRight, BookOpen, Check, Clock3, Headphones, Languages, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { beginnerLessons, lessonKey } from '../data'
import { plainJapanese } from '../content'

interface Progress {
  completed: string[]
  toggle: (key: string) => void
}

export function HomePage({ progress }: { progress: Progress }) {
  const completedBeginner = beginnerLessons.filter((lesson) =>
    progress.completed.includes(lessonKey('beginner', lesson.id)),
  ).length
  const nextLesson = beginnerLessons.find(
    (lesson) => !progress.completed.includes(lessonKey('beginner', lesson.id)),
  ) || beginnerLessons[0]
  const percent = Math.round((completedBeginner / beginnerLessons.length) * 100)

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">日本語を、毎日の習慣に</span>
          <h1>轻松学日语，<br /><em>每天进步一点点。</em></h1>
          <p>为中文初学者重新设计的《标准日本语》学习体验。每次只学一个目标，把课文、句型与词汇真正串起来。</p>
          <div className="hero-actions">
            <Link className="button primary" to={`/lesson/beginner/${nextLesson.id}`}>
              {completedBeginner ? '继续学习' : '开始第一课'} <ArrowRight size={17} />
            </Link>
            <Link className="button secondary" to="/courses">查看学习路线</Link>
          </div>
          <div className="trust-row">
            <span><Check size={14} /> 无需注册</span>
            <span><Check size={14} /> 学习进度自动保存</span>
            <span><Check size={14} /> 中日双语内容</span>
          </div>
        </div>
        <div className="focus-card">
          <div className="focus-card-head">
            <span>今日学习</span><small>约 15 分钟</small>
          </div>
          <div className="lesson-number">LESSON {String(nextLesson.id).padStart(2, '0')}</div>
          <div className="focus-japanese" dangerouslySetInnerHTML={{ __html: plainJapanese(nextLesson.title) }} />
          <p>{nextLesson.id === 1 ? '学会自我介绍与第一次见面的表达' : '继续你的初级日语学习路线'}</p>
          <div className="focus-tasks">
            <span><BookOpen size={16} /> 理解核心句型</span>
            <span><Headphones size={16} /> 跟读应用课文</span>
            <span><Languages size={16} /> 复习本课词汇</span>
          </div>
          <Link to={`/lesson/beginner/${nextLesson.id}`} className="focus-play">
            <Play size={17} fill="currentColor" /> 开始今日学习
          </Link>
          <div className="progress-meta"><span>初级进度</span><b>{completedBeginner} / 48</b></div>
          <div className="progress-track"><i style={{ width: `${Math.max(percent, 2)}%` }} /></div>
        </div>
      </section>

      <section className="starter-strip">
        <div><span className="eyebrow">FIRST 15 MINUTES</span><h2>第一次来？今天只做三件事</h2></div>
        {[
          ['01', '认识句子', '3 分钟'],
          ['02', '跟读课文', '7 分钟'],
          ['03', '记住 5 个词', '5 分钟'],
        ].map(([number, title, time]) => (
          <div className="mini-step" key={number}><span>{number}</span><p><b>{title}</b><small>{time}</small></p></div>
        ))}
        <Link to="/lesson/beginner/1" aria-label="开始第一课"><ArrowRight /></Link>
      </section>

      <section className="content-section">
        <div className="section-title"><div><span className="eyebrow">LEARNING PATH</span><h2>清晰的初学路线</h2></div><Link to="/courses">全部课程 <ArrowRight size={15} /></Link></div>
        <div className="path-cards">
          <Link className="path-card coral" to="/lesson/beginner/1">
            <span className="path-icon">あ</span><small>STEP 01 · 现在开始</small><h3>初级日语</h3>
            <p>从基础句型、假名与生活会话开始。</p><b>48 课 <ArrowRight size={14} /></b>
          </Link>
          <Link className="path-card indigo" to="/courses#intermediate">
            <span className="path-icon">話</span><small>STEP 02 · 完成初级后</small><h3>中级进阶</h3>
            <p>提升阅读表达，理解自然的日语语境。</p><b>32 课 <ArrowRight size={14} /></b>
          </Link>
          <Link className="path-card mint" to="/courses">
            <span className="path-icon"><Clock3 size={22} /></span><small>DAILY · 每天复习</small><h3>短时学习</h3>
            <p>每次 15–25 分钟，减少记忆负担。</p><b>查看计划 <ArrowRight size={14} /></b>
          </Link>
        </div>
      </section>
    </div>
  )
}
