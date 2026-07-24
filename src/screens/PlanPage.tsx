import { Check, ChevronRight, Clock3, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { thirtyDayPlan, type StudyController } from '../study'

export function PlanPage({ study }: { study: StudyController }) {
  const percent = Math.round((study.completedDays.length / thirtyDayPlan.length) * 100)

  return (
    <div className="page plan-page">
      <header className="product-page-head">
        <div>
          <span className="eyebrow">30 DAY ROADMAP</span>
          <h1>30天日语入门计划</h1>
          <p>每天只完成一个明确目标。先理解、再开口，最后用间隔复习把它留下来。</p>
        </div>
        <div className="plan-summary">
          <strong>{percent}%</strong>
          <span>已完成 {study.completedDays.length} / 30 天</span>
          <i><b style={{ width: `${Math.max(percent, 3)}%` }} /></i>
        </div>
      </header>

      <div className="week-list">
        {Array.from({ length: 5 }, (_, weekIndex) => {
          const days = thirtyDayPlan.slice(weekIndex * 7, Math.min((weekIndex + 1) * 7, 30))
          return (
            <section className="week-block" key={weekIndex}>
              <header>
                <span>WEEK {String(weekIndex + 1).padStart(2, '0')}</span>
                <div><h2>第 {weekIndex + 1} 周</h2><p>{weekIndex === 0 ? '建立开口说日语的信心' : '用小步复习稳定累积'}</p></div>
              </header>
              <div className="day-list">
                {days.map((day) => {
                  const completed = study.completedDays.includes(day.day)
                  const current = study.currentDay.day === day.day
                  return (
                    <Link className={`day-row ${completed ? 'completed' : ''} ${current ? 'current' : ''}`} to={`/lesson/beginner/${day.lessonId}`} key={day.day}>
                      <span className="day-check">{completed ? <Check size={16} /> : day.day}</span>
                      <div><b>DAY {String(day.day).padStart(2, '0')} · {day.label}</b><strong>{day.focus}</strong></div>
                      <small><Clock3 size={13} /> {day.minutes} 分钟</small>
                      <ChevronRight size={17} />
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
      <aside className="beta-note"><Sparkles size={18} /><p><strong>开放说明</strong><span>全部课程、课文录音、单词录音、复习与 Anki 导出功能均免费开放。</span></p></aside>
    </div>
  )
}
