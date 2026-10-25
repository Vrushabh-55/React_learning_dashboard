import React, { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import useDebounce from '../hooks/useDebounce'

/**
 * SEARCH & DEBOUNCING PAGE
 * 
 * Concepts covered:
 * - useDebounce custom hook: delay state updates until user stops typing
 * - useMemo: memoize filtered results so we don't re-filter on every render
 * - Filtering arrays: .filter() with multiple conditions
 * - Controlled search input
 */

// Sample dataset — in real apps this would come from an API
const SAMPLE_DATA = [
  { id: 1, name: 'React', category: 'Frontend', type: 'Library', stars: 218000 },
  { id: 2, name: 'Vue.js', category: 'Frontend', type: 'Framework', stars: 206000 },
  { id: 3, name: 'Angular', category: 'Frontend', type: 'Framework', stars: 90000 },
  { id: 4, name: 'Svelte', category: 'Frontend', type: 'Compiler', stars: 77000 },
  { id: 5, name: 'Node.js', category: 'Backend', type: 'Runtime', stars: 103000 },
  { id: 6, name: 'Express', category: 'Backend', type: 'Framework', stars: 62000 },
  { id: 7, name: 'Fastify', category: 'Backend', type: 'Framework', stars: 31000 },
  { id: 8, name: 'Next.js', category: 'Fullstack', type: 'Framework', stars: 124000 },
  { id: 9, name: 'Remix', category: 'Fullstack', type: 'Framework', stars: 29000 },
  { id: 10, name: 'Vite', category: 'Tooling', type: 'Build Tool', stars: 66000 },
  { id: 11, name: 'Webpack', category: 'Tooling', type: 'Bundler', stars: 64000 },
  { id: 12, name: 'Tailwind CSS', category: 'Styling', type: 'Utility CSS', stars: 81000 },
  { id: 13, name: 'Styled Components', category: 'Styling', type: 'CSS-in-JS', stars: 40000 },
  { id: 14, name: 'Redux', category: 'State', type: 'State Management', stars: 60000 },
  { id: 15, name: 'Zustand', category: 'State', type: 'State Management', stars: 44000 },
  { id: 16, name: 'TanStack Query', category: 'Data', type: 'Data Fetching', stars: 40000 },
  { id: 17, name: 'Axios', category: 'Data', type: 'HTTP Client', stars: 104000 },
  { id: 18, name: 'TypeScript', category: 'Language', type: 'Superset', stars: 99000 },
  { id: 19, name: 'Jest', category: 'Testing', type: 'Test Runner', stars: 43000 },
  { id: 20, name: 'Vitest', category: 'Testing', type: 'Test Runner', stars: 12000 },
]

const ALL_CATEGORIES = ['All', ...new Set(SAMPLE_DATA.map(d => d.category))]

// Format star count nicely (e.g., 218000 → "218k")
const formatStars = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n

export default function SearchPage() {
  // Raw input value — updates on every keystroke
  const [query, setQuery] = useState('')

  // Active category filter
  const [activeCategory, setActiveCategory] = useState('All')

  // useDebounce: only updates after user stops typing for 400ms
  // This is the KEY optimization — we use debouncedQuery for actual filtering
  const debouncedQuery = useDebounce(query, 400)

  // isDebouncing: true when user is typing but debounce hasn't settled yet
  const isDebouncing = query !== debouncedQuery

  // useMemo: only re-filter when debouncedQuery or activeCategory changes
  // Without this, filtering would run on EVERY render (even unrelated state changes)
  const filteredResults = useMemo(() => {
    const lowerQuery = debouncedQuery.toLowerCase()

    return SAMPLE_DATA.filter(item => {
      // Check category filter
      const categoryMatch = activeCategory === 'All' || item.category === activeCategory

      // Check search query against name and type
      const searchMatch =
        !lowerQuery ||
        item.name.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)

      return categoryMatch && searchMatch
    })
  }, [debouncedQuery, activeCategory])

  return (
    <div className="page-container">
      <PageHeader
        tag="module 03"
        title="Search with Debouncing"
        description="Type in the search box — notice the debounce indicator. Filtering only runs 400ms after you stop typing."
        concepts={['useDebounce', 'useMemo', 'filtering', 'custom hook', 'performance']}
      />

      {/* Search input */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="input search-input"
          placeholder="Search frameworks, tools, languages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Debounce visual indicator */}
      <div className="debounce-indicator">
        <div className={`debounce-dot ${isDebouncing ? 'active' : 'resolved'}`} />
        {isDebouncing ? (
          <span>Waiting for you to stop typing... (debouncing)</span>
        ) : (
          <span>
            Debounce resolved — showing results for{' '}
            <strong style={{ color: 'var(--accent-secondary)' }}>
              "{debouncedQuery || 'all'}"
            </strong>
          </span>
        )}
      </div>

      {/* Category filters */}
      <div className="filter-row">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count */}
      <div className="search-status">
        Showing <strong>{filteredResults.length}</strong> of {SAMPLE_DATA.length} items
      </div>

      {/* Results grid */}
      {filteredResults.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔎</div>
          <p>No results found for "{debouncedQuery}"</p>
        </div>
      ) : (
        <div className="search-results">
          {filteredResults.map(item => (
            <div key={item.id} className="result-card">
              <div className="result-card-label">{item.type}</div>
              <h4>{item.name}</h4>
              <div className="result-card-meta">
                📁 {item.category} · ⭐ {formatStars(item.stars)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Educational note */}
      <div className="card" style={{ marginTop: 32 }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            🧠 How debouncing works:
          </strong>
          <br />
          Every keystroke resets a 400ms timer. Only when you stop typing does the timer fire
          and update <code className="code-highlight">debouncedQuery</code>. This prevents
          expensive operations (API calls, complex filters) from running on every single
          character you type.
          <br /><br />
          <strong style={{ color: 'var(--text-primary)' }}>Without debounce:</strong> 10 keystrokes = 10 filter operations
          <br />
          <strong style={{ color: 'var(--text-primary)' }}>With debounce:</strong> 10 keystrokes = 1 filter operation (when you pause)
        </div>
      </div>
    </div>
  )
}
