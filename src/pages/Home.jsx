import React from 'react'
import { Link } from 'react-router-dom'

const MODULES = [
  {
    path: '/todo',
    icon: '✅',
    title: 'Todo App',
    description: 'Add, edit, delete, complete todos. Full CRUD with local state.',
    tags: ['useState', 'list rendering', 'keys', 'CRUD'],
    color: '#e8ff47',
  },
  {
    path: '/form',
    icon: '📋',
    title: 'Multi-Step Form',
    description: 'Step-by-step form with validation, persistence across steps.',
    tags: ['controlled inputs', 'validation', 'conditional rendering'],
    color: '#47d4ff',
  },
  {
    path: '/search',
    icon: '🔍',
    title: 'Search & Debouncing',
    description: 'Search with debouncing to optimize performance.',
    tags: ['useDebounce', 'filtering', 'performance', 'useEffect'],
    color: '#a29bfe',
  },
  {
    path: '/api',
    icon: '🌐',
    title: 'API Data Fetching',
    description: 'Fetch real data from JSONPlaceholder API with loading/error states.',
    tags: ['Axios', 'useFetch', 'pagination', 'async'],
    color: '#2ed573',
  },
  {
    path: '/performance',
    icon: '⚡',
    title: 'useMemo & useCallback',
    description: 'See the difference optimization hooks make with render counters.',
    tags: ['useMemo', 'useCallback', 'optimization', 're-renders'],
    color: '#ffa502',
  },
  {
    path: '/ref-demo',
    icon: '🎯',
    title: 'useRef Demo',
    description: 'Focus inputs, track previous values without re-renders.',
    tags: ['useRef', 'DOM access', 'previous value'],
    color: '#ff4757',
  },
]

export default function Home() {
  return (
    <div className="page-container">
      {/* Hero section */}
      <div className="home-hero">
        <h1>
          Learn React<br />
          <em>by Building.</em>
        </h1>
        <p>
          7 hands-on modules covering core React concepts. Each module contains
          real working code with inline comments explaining every decision.
          Built with functional components, hooks, and no magic.
        </p>
        <div className="concept-tags" style={{ marginTop: 20 }}>
          {['Functional Components', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'React Router', 'Axios', 'Custom Hooks'].map(t => (
            <span key={t} className="concept-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Quick start note */}
      <div style={{ marginBottom: 20 }}>
        <div className="page-header-tag"># modules</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Click any module to dive in. Read the comments in the source code to understand each concept.
        </div>
      </div>

      {/* Module cards grid */}
      <div className="module-grid">
        {MODULES.map(({ path, icon, title, description, tags, color }) => (
          <Link key={path} to={path} className="module-card">
            <div className="module-card-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="module-card-tags">
              {tags.map(t => (
                <span key={t} className="module-card-tag">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 32, padding: '16px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)' }}>
        💡 <strong style={{ color: 'var(--text-primary)' }}>Tip:</strong> Open DevTools → Console to see logs from the performance module demonstrating re-render counts.
      </div>
    </div>
  )
}
