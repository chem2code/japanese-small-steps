import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Bookmark,
  Brain,
  ChevronRight,
  Clapperboard,
  Home,
} from 'lucide-react'
import { useStudy } from './study'
import { HomePage } from './screens/HomePage'
import { CoursesPage } from './screens/CoursesPage'
import { LessonPage } from './screens/LessonPage'
import { ReviewPage } from './screens/ReviewPage'
import { BookmarksPage } from './screens/BookmarksPage'
import { ShortsPage } from './screens/ShortsPage'

const nav = [
  { to: '/', label: '学习首页', icon: Home, end: true },
  { to: '/courses', label: '课程资料库', icon: BookOpen },
  { to: '/shorts', label: '刷课文', icon: Clapperboard },
  { to: '/review', label: '智能复习', icon: Brain },
  { to: '/bookmarks', label: '我的收藏', icon: Bookmark },
]

export default function App() {
  const location = useLocation()
  const study = useStudy()
  const shortsMode = location.pathname === '/shorts'
  const reviewMode = location.pathname === '/review'

  return (
    <div className={`app-shell ${shortsMode ? 'shorts-mode' : ''} ${reviewMode ? 'review-focus-mode' : ''}`}>
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
          <BookOpen size={16} />
          <span>在线教材</span>
          <strong>新标日初级 + 中级</strong>
          <small>80 课课文、语法、词汇与音频</small>
        </div>
      </aside>
      <div className="app-main">
        <header className="mobile-header">
          <Link to="/" className="mobile-brand"><span className="mobile-brand-mark">歩</span><strong>日语小步</strong></Link>
          <Link className="mobile-progress-pill" to="/courses">
            <span>打开教材</span><b>课程目录</b>
          </Link>
        </header>
        <main id="main">
          <Routes>
            <Route path="/" element={<HomePage study={study} />} />
            <Route path="/plan" element={<Navigate to="/" replace />} />
            <Route path="/practice" element={<Navigate to="/" replace />} />
            <Route path="/review" element={<ReviewPage study={study} />} />
            <Route path="/bookmarks" element={<BookmarksPage study={study} />} />
            <Route path="/shorts" element={<ShortsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/lesson/:level/:id" element={<LessonPage study={study} />} />
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
              <span>{label === '学习首页' ? '首页' : label === '课程资料库' ? '课程' : label === '刷课文' ? '刷课文' : label === '我的收藏' ? '收藏' : '复习'}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
