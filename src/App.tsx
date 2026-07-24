import { lazy, Suspense, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  CircleHelp,
  Home,
  LibraryBig,
  Menu,
  Sparkles,
  X,
} from 'lucide-react'
import { useProgress } from './useProgress'

const HomePage = lazy(() => import('./screens/HomePage').then((module) => ({ default: module.HomePage })))
const CoursesPage = lazy(() => import('./screens/CoursesPage').then((module) => ({ default: module.CoursesPage })))
const LessonPage = lazy(() => import('./screens/LessonPage').then((module) => ({ default: module.LessonPage })))

const nav = [
  { to: '/', label: '学习首页', icon: Home, end: true },
  { to: '/courses', label: '全部课程', icon: BookOpen },
  { to: '/courses#beginner', label: '初级路线', icon: ChartNoAxesColumnIncreasing },
  { to: '/library', label: '资料库', icon: LibraryBig },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const progress = useProgress()

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
          <a href="https://github.com/wizicer/LearnJapan" target="_blank" rel="noreferrer">
            <CircleHelp size={18} /><span>项目说明</span><ChevronRight className="nav-arrow" size={14} />
          </a>
        </nav>
        <div className="daily-card">
          <Sparkles size={16} />
          <span>每日一句</span>
          <strong>継続は力なり</strong>
          <small>坚持就是力量。</small>
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
              <Route path="/" element={<HomePage progress={progress} />} />
              <Route path="/courses" element={<CoursesPage progress={progress} />} />
              <Route path="/lesson/:level/:id" element={<LessonPage progress={progress} />} />
              <Route path="/library" element={<Navigate to="/courses" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
