import { ChevronDown, Clock3 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { beginnerLessons, intermediateLessons, type Lesson, type Level } from '../data'
import { plainJapanese } from '../content'
import { UnitAudioPlayer } from '../components/UnitAudioPlayer'

function LevelSection({ level, lessons }: { level: Level; lessons: Lesson[] }) {
  const isBeginner = level === 'beginner'
  const unitCount = Math.ceil(lessons.length / 4)
  const [openUnits, setOpenUnits] = useState<Set<number>>(() => new Set([0]))
  const updateUnit = (index: number, open: boolean) => setOpenUnits((current) => {
    if (current.has(index) === open) return current
    const next = new Set(current)
    if (open) next.add(index); else next.delete(index)
    return next
  })
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
          return (
            <details className="unit-card" key={index} open={openUnits.has(index)} onToggle={(event) => updateUnit(index, event.currentTarget.open)}>
              <summary><span>UNIT {String(index + 1).padStart(2, '0')}</span><div><strong>{isBeginner ? '初级' : '中级'} 第 {index + 1} 单元</strong><small>{unitLessons.length} 课 · 课文 / 音频 / 语法 / 词汇</small></div><ChevronDown size={18} /></summary>
              <div className="unit-lessons">
                <UnitAudioPlayer level={level} lessons={unitLessons} />
                {unitLessons.map((lesson) => <Link to={`/lesson/${level}/${lesson.id}`} key={lesson.id}><span className="lesson-status">{lesson.id}</span><p><b>第 {lesson.id} 课</b><small>{plainJapanese(lesson.title || lesson.sceneTitle)}</small></p><span>→</span></Link>)}
              </div>
            </details>
          )
        })}
      </div>
    </section>
  )
}

export function CoursesPage() {
  return (
    <div className="page courses-page">
      <header className="course-hero"><span className="eyebrow">NEW STANDARD JAPANESE · 80 LESSONS</span><h1>新标准日本语在线教材</h1><p>按单元查阅初级 48 课与中级 32 课，每课包含课文、发音、语法、生词和配套视频。完成全部内容可系统衔接 JLPT N2。</p><div className="course-facts"><span><Clock3 size={15} /><b>初级</b> 48 课</span><span><b>中级</b> 32 课</span><span><b>用法</b> 随时查阅，自由选课</span></div></header>
      <nav className="level-tabs"><a href="#beginner">初级课程 <small>48 课</small></a><a href="#intermediate">中级课程 <small>32 课</small></a></nav>
      <LevelSection level="beginner" lessons={beginnerLessons} />
      <LevelSection level="intermediate" lessons={intermediateLessons} />
    </div>
  )
}
