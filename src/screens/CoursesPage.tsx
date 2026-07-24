import { Check, ChevronDown, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { beginnerLessons, intermediateLessons, lessonKey, type Lesson, type Level } from '../data'
import { plainJapanese } from '../content'

interface Progress { completed: string[]; toggle: (key: string) => void }

function LevelSection({ level, lessons, progress }: { level: Level; lessons: Lesson[]; progress: Progress }) {
  const isBeginner = level === 'beginner'
  const unitCount = Math.ceil(lessons.length / 4)
  return (
    <section id={level} className="course-level">
      <div className="level-heading">
        <span className={`level-mark ${isBeginner ? 'coral-bg' : 'indigo-bg'}`}>{isBeginner ? '初' : '中'}</span>
        <div><h2>{isBeginner ? '初级课程' : '中级课程'}</h2><p>{isBeginner ? '从基础句型到日常会话' : '提升阅读、会话与表达'}</p></div>
        {isBeginner && <b className="recommend">建议从这里开始</b>}
      </div>
      <div className="unit-grid">
        {Array.from({ length: unitCount }, (_, index) => {
          const unitLessons = lessons.slice(index * 4, index * 4 + 4)
          const done = unitLessons.filter((lesson) => progress.completed.includes(lessonKey(level, lesson.id))).length
          return (
            <details className="unit-card" key={index} open={index === 0}>
              <summary>
                <span>UNIT {String(index + 1).padStart(2, '0')}</span>
                <div><strong>{isBeginner ? '初级' : '中级'} 第 {index + 1} 单元</strong><small>{done} / {unitLessons.length} 课已完成</small></div>
                <ChevronDown size={18} />
              </summary>
              <div className="unit-lessons">
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
        <span className="eyebrow">COURSE MAP</span>
        <h1>你的日语学习路线</h1>
        <p>从初级第 1 单元开始，每个单元包含 4 课。初学阶段不求一次学完，稳定地完成每个小目标更重要。</p>
        <div className="course-facts">
          <span><Clock3 size={15} /><b>每日</b> 15–25 分钟</span>
          <span><b>建议</b> 每周 2 课</span>
          <span><b>完整内容</b> 80 课</span>
        </div>
      </header>
      <nav className="level-tabs"><a href="#beginner">初级课程 <small>48 课</small></a><a href="#intermediate">中级课程 <small>32 课</small></a></nav>
      <LevelSection level="beginner" lessons={beginnerLessons} progress={progress} />
      <LevelSection level="intermediate" lessons={intermediateLessons} progress={progress} />
    </div>
  )
}
