import { lazy, Suspense, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  BookOpen,
  Brain,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  CircleHelp,
  Dumbbell,
  Home,
  Menu,
  Sparkles,
  X,
} from 'lucide-react'
import { useProgress } from './useProgress'
import { useStudy } from './study'

const HomePage = lazy(() => import('./screens/HomePage').then((module) => ({ default: module.HomePage })))
const CoursesPage = lazy(() => import('./screens/CoursesPage').then((module) => ({ default: module.CoursesPage })))
const LessonPage = lazy(() => import('./screens/LessonPage').then((module) => ({ default: module.LessonPage })))
const PlanPage = lazy(() => import('./screens/PlanPage').then((module) => ({ default: module.PlanPage })))
const ReviewPage = lazy(() => import('./screens/ReviewPage').then((module) => ({ default: module.ReviewPage })))
const PracticePage = lazy(() => import('./screens/PracticePage').then((module) => ({ default: module.PracticePage })))

const nav = [
  { to: '/', label: '学习首页', icon: Home, end: true },
  { to: '/plan', label: '30天计划', icon: ChartNoAxesColumnIncreasing },
  { to: '/practice', label: '即时练习', icon: Dumbbell },
  { to: '/review', label: '智能复习', icon: Brain },
  { to: '/courses', label: '课程资料库', icon: BookOpen },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const progress = useProgress()
  const study = useStudy()

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">跳到正文</a>
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">氷</span>
          <span><strong>氷河日本語</strong><small>Japanese, one day at a time.</small></span>
        </Link>
        <nav className="sidebar-nav">
          <span className="nav-heading">学习</span>
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)}>
              <Icon size={18} /><span>{label}</span><ChevronRight className="nav-arrow" size={14} />
            </NavLink>
          ))}
          <span className="nav-heading secondary">帮助</span>
          <Link to="/plan" onClick={() => setMenuOpen(false)}>
            <CircleHelp size={18} /><span>学习方法</span><ChevronRight className="nav-arrow" size={14} />
          </Link>
        </nav>
        <div className="daily-card">
          <Sparkles size={16} />
          <span>今日进度</span>
          <strong>DAY {String(study.currentDay.day).padStart(2, '0')}</strong>
          <small>{study.dueWords.length} 个词等待复习</small>
        </div>
      </aside>
      {menuOpen && <button className="menu-overlay" aria-label="关闭菜单" onClick={() => setMenuOpen(false)} />}
      <div className="app-main">
        <header className="mobile-header">
          <Link to="/" className="mobile-brand">氷河<span>日本語</span></Link>
          <button className="icon-button" onClick={() => setMenuOpen((value) => !value)} aria-label="打开菜单">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </header>
        <main id="main">
          <Suspense fallback={<div className="route-loading"><span>読み込み中</span><p>正在准备学习内容…</p></div>}>
            <Routes>
              <Route path="/" element={<HomePage study={study} />} />
              <Route path="/plan" element={<PlanPage study={study} />} />
              <Route path="/practice" element={<PracticePage study={study} />} />
              <Route path="/review" element={<ReviewPage study={study} />} />
              <Route path="/courses" element={<CoursesPage progress={progress} />} />
              <Route path="/lesson/:level/:id" element={<LessonPage progress={progress} study={study} />} />
              <Route path="/library" element={<Navigate to="/courses" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
