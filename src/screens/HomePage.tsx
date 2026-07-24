import { ArrowRight, BookOpen, Check, Clock3, Flame, Headphones, Languages, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { beginnerLessons } from '../data'
import { plainJapanese } from '../content'
import type { StudyController } from '../study'

export function HomePage({ study }: { study: StudyController }) {
  const nextLesson = beginnerLessons[study.currentDay.lessonId - 1] || beginnerLessons[0]

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">DAY {String(study.currentDay.day).padStart(2, '0')} · 你的今日任务</span>
          <h1>每天15分钟，<br /><em>真正记住日语。</em></h1>
          <p>今天只完成一个明确目标：{study.currentDay.focus}。理解、练习、复习，形成完整学习闭环。</p>
          <div className="hero-actions">
            <Link className="button primary" to={`/lesson/beginner/${nextLesson.id}`}>
              {study.completedDays.length ? '继续学习' : '开始第一课'} <ArrowRight size={17} />
            </Link>
            <Link className="button secondary" to="/plan">查看30天计划</Link>
          </div>
          <div className="trust-row">
            <span><Flame size={14} /> 连续学习 {study.streak} 天</span>
            <span><Check size={14} /> 已完成 {study.completedDays.length} 天</span>
            <span><Check size={14} /> {study.dueWords.length} 个词待复习</span>
          </div>
        </div>
        <div className="focus-card">
          <div className="focus-card-head">
            <span>今日学习</span><small>约 15 分钟</small>
          </div>
          <div className="lesson-number">DAY {String(study.currentDay.day).padStart(2, '0')} · LESSON {String(nextLesson.id).padStart(2, '0')}</div>
          <div className="focus-japanese" dangerouslySetInnerHTML={{ __html: plainJapanese(nextLesson.title) }} />
          <p>{study.currentDay.focus}</p>
          <div className="focus-tasks">
            <span><BookOpen size={16} /> 理解核心句型</span>
            <span><Headphones size={16} /> 跟读应用课文</span>
            <span><Languages size={16} /> 复习本课词汇</span>
          </div>
          <Link to={`/lesson/beginner/${nextLesson.id}`} className="focus-play">
            <Play size={17} fill="currentColor" /> 开始今日学习
          </Link>
          <div className="progress-meta"><span>30天计划</span><b>{study.completedDays.length} / 30</b></div>
          <div className="progress-track"><i style={{ width: `${Math.max((study.completedDays.length / 30) * 100, 2)}%` }} /></div>
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
          <Link className="path-card mint" to="/review">
            <span className="path-icon"><Clock3 size={22} /></span><small>DAILY · 每天复习</small><h3>短时学习</h3>
            <p>根据记忆情况安排到期词汇，避免无效重复。</p><b>开始复习 <ArrowRight size={14} /></b>
          </Link>
        </div>
      </section>
    </div>
  )
}
