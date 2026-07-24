import { useState } from 'react'
import { ArrowRight, BookOpen, Check, Clock3, Flame, Headphones, Languages, MapPin, Play, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { beginnerLessons } from '../data'
import { plainJapanese } from '../content'
import type { StudyController, StudyGoal } from '../study'

const goals: { value: StudyGoal; icon: typeof MapPin; title: string; copy: string }[] = [
  { value: 'travel', icon: MapPin, title: '旅行交流', copy: '优先掌握问路、点餐与购物' },
  { value: 'daily', icon: Languages, title: '生活会话', copy: '建立日常开口表达的基础' },
  { value: 'exam', icon: Target, title: '系统入门', copy: '稳步打好词汇与语法基础' },
]

export function HomePage({ study }: { study: StudyController }) {
  const [goal, setGoal] = useState<StudyGoal>('daily')
  const [minutes, setMinutes] = useState<10 | 15 | 25>(15)
  const nextLesson = beginnerLessons[study.currentDay.lessonId - 1] || beginnerLessons[0]

  if (!study.profile) {
    return (
      <div className="page onboarding-page">
        <section className="onboarding-card">
          <div className="onboarding-copy">
            <span className="eyebrow">START YOUR 30 DAYS</span>
            <h1>先用一分钟，定制你的学习路线。</h1>
            <p>不需要一次学很多。选择目标和每天可投入的时间，我们会安排第一步。</p>
            <div className="onboarding-promise"><Sparkles size={18} /><span><b>第一天就能开口</b><small>完成自我介绍、听读和5词复习</small></span></div>
          </div>
          <div className="onboarding-form">
            <fieldset>
              <legend>你最想用日语做什么？</legend>
              <div className="goal-options">
                {goals.map(({ value, icon: Icon, title, copy }) => (
                  <button className={goal === value ? 'selected' : ''} key={value} onClick={() => setGoal(value)}>
                    <Icon size={19} /><span><b>{title}</b><small>{copy}</small></span>{goal === value && <Check size={16} />}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>每天准备学多久？</legend>
              <div className="minute-options">
                {[10, 15, 25].map((value) => <button className={minutes === value ? 'selected' : ''} key={value} onClick={() => setMinutes(value as 10 | 15 | 25)}><b>{value}</b><span>分钟</span>{value === 15 && <small>推荐</small>}</button>)}
              </div>
            </fieldset>
            <button className="button primary onboarding-submit" onClick={() => study.createProfile(goal, minutes)}>生成我的30天计划<ArrowRight size={17} /></button>
            <p className="privacy-note">当前为内测版，学习设置只保存在你的设备中。</p>
          </div>
        </section>
      </div>
    )
  }

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
