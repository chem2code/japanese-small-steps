import { Check, ChevronDown, Clock3 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { beginnerLessons, intermediateLessons, lessonKey, type Lesson, type Level } from '../data'
import { plainJapanese } from '../content'
import { UnitAudioPlayer } from '../components/UnitAudioPlayer'

interface Progress { completed: string[]; toggle: (key: string) => void }

function LevelSection({ level, lessons, progress }: { level: Level; lessons: Lesson[]; progress: Progress }) {
  const isBeginner = level === 'beginner'
  const unitCount = Math.ceil(lessons.length / 4)
  const [openUnits, setOpenUnits] = useState<Set<number>>(() => new Set([0]))

  const updateUnit = (index: number, open: boolean) => {
    setOpenUnits((current) => {
      if (current.has(index) === open) return current
      const next = new Set(current)
      if (open) next.add(index)
      else next.delete(index)
      return next
    })
  }

  return (
    <section id={level} className="course-level">
      <div className="level-heading">
        <span className={`level-mark ${isBeginner ? 'coral-bg' : 'indigo-bg'}`}>{isBeginner ? '初' : '中'}</span>
        <div><h2>{isBeginner ? '新标日初级' : '新标日中级'}</h2><p>{isBeginner ? '从零基础建立日语核心框架' : '提升阅读、会话与综合表达，衔接 N2'}</p></div>
        {isBeginner && <b className="recommend">建议从这里开始</b>}
      </div>
      <div className="unit-grid">
        {Array.from({ length: unitCount }, (_, index) => {
          const unitLessons = lessons.slice(index * 4, index * 4 + 4)
          const done = unitLessons.filter((lesson) => progress.completed.includes(lessonKey(level, lesson.id))).length
          return (
            <details
              className="unit-card"
              key={index}
              open={openUnits.has(index)}
              onToggle={(event) => updateUnit(index, event.currentTarget.open)}
            >
              <summary>
                <span>UNIT {String(index + 1).padStart(2, '0')}</span>
                <div><strong>{isBeginner ? '初级' : '中级'} 第 {index + 1} 单元</strong><small>{done} / {unitLessons.length} 课已完成</small></div>
                <ChevronDown size={18} />
              </summary>
              <div className="unit-lessons">
                <UnitAudioPlayer level={level} lessons={unitLessons} />
                {unitLessons.map((lesson) => {
                  const completed = progress.completed.includes(lessonKey(level, lesson.id))
                  return (
                    <Link to={`/lesson/${level}/${lesson.id}`} key={lesson.id}>
                      <span className={`lesson-status ${completed ? 'done' : ''}`}>{completed ? <Check size={14} /> : lesson.id}</span>
                      <p><b>第 {lesson.id} 课</b><small>{plainJapanese(lesson.title || lesson.sceneTitle)}</small></p>
                      <span>→</span>
                    </Link>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>
    </section>
  )
}

export function CoursesPage({ progress }: { progress: Progress }) {
  return (
    <div className="page courses-page">
      <header className="course-hero">
        <span className="eyebrow">NEW STANDARD JAPANESE · 80 LESSONS</span>
        <h1>新标准日本语完整学习路线</h1>
        <p>覆盖初级 48 课与中级 32 课。每 4 课组成一个单元，从零基础逐步建立词汇、语法、听读和会话能力，完成后可系统衔接 JLPT N2 学习与备考。</p>
        <div className="course-facts">
          <span><Clock3 size={15} /><b>初级</b> 48 课</span>
          <span><b>中级</b> 32 课</span>
          <span><b>学习目标</b> 系统衔接 JLPT N2</span>
        </div>
      </header>
      <nav className="level-tabs"><a href="#beginner">初级课程 <small>48 课</small></a><a href="#intermediate">中级课程 <small>32 课</small></a></nav>
      <LevelSection level="beginner" lessons={beginnerLessons} progress={progress} />
      <LevelSection level="intermediate" lessons={intermediateLessons} progress={progress} />
    </div>
  )
}
