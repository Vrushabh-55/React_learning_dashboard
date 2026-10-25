import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import TodoPage from './pages/TodoPage'
import FormPage from './pages/FormPage'
import SearchPage from './pages/SearchPage'
import ApiPage from './pages/ApiPage'
import PerformancePage from './pages/PerformancePage'
import RefDemoPage from './pages/RefDemoPage'

// Components
import ThemeToggle from './components/ThemeToggle'


// Navigation config — single source of truth for routes + labels
const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '⚡', exact: true },
  { path: '/todo', label: 'Todo App', icon: '✅', badge: 'useState' },
  { path: '/form', label: 'Multi-Step Form', icon: '📋', badge: 'Forms' },
  { path: '/search', label: 'Search & Filter', icon: '🔍', badge: 'Perf' },
  { path: '/api', label: 'API Fetching', icon: '🌐', badge: 'Axios' },
  { path: '/performance', label: 'useMemo & useCallback', icon: '⚡', badge: 'Hooks' },
  { path: '/ref-demo', label: 'useRef Demo', icon: '🎯', badge: 'Ref' },
]

function Sidebar({ theme, onToggleTheme }) {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>REACT LEARNING<br />DASHBOARD</h1>
        <span>v1.0 · 7 modules</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Modules</div>

        {NAV_ITEMS.map(({ path, label, icon, badge, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-item-icon">{icon}</span>
            {label}
            {badge && <span className="nav-item-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </aside>
  )
}

export default function App() {
  // Theme state - lifted up to App level (no Context API)
  // Persisted to localStorage so preference survives refreshes
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('rld-theme') || 'dark'
  })

  // Apply theme to document element for CSS variable switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rld-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar theme={theme} onToggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/ref-demo" element={<RefDemoPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
