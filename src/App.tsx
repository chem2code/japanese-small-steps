import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Bookmark,
  Brain,
  ChevronRight,
  Home,
  Sparkles,
} from 'lucide-react'
import { useProgress } from './useProgress'
import { useStudy } from './study'
import { beginnerLessons, lessonKey } from './data'
import { HomePage } from './screens/HomePage'
import { CoursesPage } from './screens/CoursesPage'
import { LessonPage } from './screens/LessonPage'
import { ReviewPage } from './screens/ReviewPage'
import { BookmarksPage } from './screens/BookmarksPage'

const nav = [
  { to: '/', label: '学习首页', icon: Home, end: true },
  { to: '/review', label: '智能复习', icon: Brain },
  { to: '/bookmarks', label: '重点单词', icon: Bookmark },
  { to: '/courses', label: '课程资料库', icon: BookOpen },
]

export default function App() {
  const location = useLocation()
  const progress = useProgress()
  const study = useStudy()
  const completedBeginner = beginnerLessons.filter((lesson) =>
    progress.completed.includes(lessonKey('beginner', lesson.id)),
  ).length
  const nextLesson =
    beginnerLessons.find((lesson) => !progress.completed.includes(lessonKey('beginner', lesson.id)))
    ?? beginnerLessons.at(-1)
    ?? beginnerLessons[0]!

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">跳到正文</a>
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark">歩</span>
          <span><strong>日语小步</strong><small>每天一小步，日语更进一步。</small></span>
        </Link>
        <nav className="sidebar-nav">
          <span className="nav-heading">学习</span>
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={18} /><span>{label}</span><ChevronRight className="nav-arrow" size={14} />
            </NavLink>
          ))}
        </nav>
        <div className="daily-card">
          <Sparkles size={16} />
          <span>学习进度</span>
          <strong>初级第 {nextLesson.id} 课</strong>
          <small>已完成 {completedBeginner} / {beginnerLessons.length} 课</small>
        </div>
      </aside>
      <div className="app-main">
        <header className="mobile-header">
          <Link to="/" className="mobile-brand"><span className="mobile-brand-mark">歩</span><strong>日语小步</strong></Link>
          <Link className="mobile-progress-pill" to={`/lesson/beginner/${nextLesson.id}`}>
            <span>继续学习</span><b>第 {nextLesson.id} 课</b>
          </Link>
        </header>
        <main id="main">
          <Routes>
            <Route path="/" element={<HomePage study={study} progress={progress} />} />
            <Route path="/plan" element={<Navigate to="/" replace />} />
            <Route path="/practice" element={<Navigate to="/" replace />} />
            <Route path="/review" element={<ReviewPage study={study} />} />
            <Route path="/bookmarks" element={<BookmarksPage study={study} />} />
            <Route path="/courses" element={<CoursesPage progress={progress} />} />
            <Route path="/lesson/:level/:id" element={<LessonPage progress={progress} study={study} />} />
            <Route path="/library" element={<Navigate to="/courses" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <nav className="mobile-tabbar" aria-label="主要导航">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive || (to === '/courses' && location.pathname.startsWith('/lesson')) ? 'active' : ''
              }
            >
              <Icon size={22} strokeWidth={2.1} />
              <span>{label === '学习首页' ? '学习' : label === '课程资料库' ? '课程' : label === '重点单词' ? '重点' : '复习'}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
