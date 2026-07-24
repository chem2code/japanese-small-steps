import { useState } from 'react'
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
import { HomePage } from './screens/HomePage'
import { CoursesPage } from './screens/CoursesPage'
import { LessonPage } from './screens/LessonPage'
import { PlanPage } from './screens/PlanPage'
import { ReviewPage } from './screens/ReviewPage'
import { PracticePage } from './screens/PracticePage'

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
          <span className="brand-mark">歩</span>
          <span><strong>日语小步</strong><small>每天一小步，日语更进一步。</small></span>
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
          <Link to="/" className="mobile-brand">日语<span>小步</span></Link>
          <button className="icon-button" onClick={() => setMenuOpen((value) => !value)} aria-label="打开菜单">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </header>
        <main id="main">
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
        </main>
      </div>
    </div>
  )
}
