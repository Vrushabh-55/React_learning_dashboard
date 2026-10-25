import React, { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import useFetch from '../hooks/useFetch'

/**
 * API FETCHING PAGE
 * 
 * Concepts covered:
 * - useFetch custom hook: abstracts loading/error/data state
 * - Axios: making HTTP requests
 * - useEffect (inside useFetch): run code after render, on mount
 * - Loading & error states: UI feedback while waiting for data
 * - Client-side search on fetched data
 * - Pagination: slicing data into pages
 */

const ITEMS_PER_PAGE = 6

// Pagination component — receives data via props (no own state)
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {/* Generate page number buttons */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  )
}

// Users view component
function UsersView({ users, searchQuery }) {
  const filtered = useMemo(() => {
    if (!users) return []
    const q = searchQuery.toLowerCase()
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q)
    )
  }, [users, searchQuery])

  return (
    <>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {filtered.length} users found
      </div>
      <div className="user-grid">
        {filtered.map(user => (
          <div key={user.id} className="user-card">
            {/* Generate initials avatar from name */}
            <div className="user-avatar">
              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <h4>{user.name}</h4>
            <p>📧 {user.email}</p>
            <p style={{ marginTop: 4 }}>🏢 {user.company.name}</p>
            <p style={{ marginTop: 4 }}>🌐 {user.website}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// Posts view component with pagination
function PostsView({ posts, searchQuery }) {
  const [currentPage, setCurrentPage] = useState(1)

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!posts) return []
    const q = searchQuery.toLowerCase()
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q)
    )
  }, [posts, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  // Reset to page 1 when search changes
  const handlePageChange = (page) => setCurrentPage(page)

  return (
    <>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
        {filteredPosts.length} posts · Page {currentPage} of {totalPages}
      </div>
      <div className="post-list">
        {currentPosts.map(post => (
          <div key={post.id} className="post-item">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="post-item-meta">Post #{post.id} · User #{post.userId}</div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default function ApiPage() {
  // Control which resource we're fetching
  const [resource, setResource] = useState('users')

  // Search query for client-side filtering of fetched data
  const [searchQuery, setSearchQuery] = useState('')

  // useFetch hook handles: loading state, error state, data, and cleanup
  const { data, loading, error, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/${resource}`
  )

  const handleResourceChange = (newResource) => {
    setResource(newResource)
    setSearchQuery('') // Clear search when switching resources
  }

  return (
    <div className="page-container">
      <PageHeader
        tag="module 04"
        title="API Data Fetching"
        description="Fetch real data from JSONPlaceholder API. The useFetch hook abstracts all loading/error/data state management."
        concepts={['Axios', 'useFetch', 'useEffect', 'loading state', 'error handling', 'pagination']}
      />

      {/* Controls */}
      <div className="api-controls">
        <div className="flex gap-8">
          <button
            className={`filter-btn ${resource === 'users' ? 'active' : ''}`}
            onClick={() => handleResourceChange('users')}
          >
            👤 Users (10)
          </button>
          <button
            className={`filter-btn ${resource === 'posts' ? 'active' : ''}`}
            onClick={() => handleResourceChange('posts')}
          >
            📝 Posts (100)
          </button>
        </div>

        <input
          type="text"
          className="input"
          style={{ flex: 1, maxWidth: 280 }}
          placeholder={`Search ${resource}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button variant="secondary" onClick={refetch} size="sm">
          ↺ Refetch
        </Button>
      </div>

      {/* API URL display */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px 14px',
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 20,
        fontFamily: 'var(--font-mono)',
      }}>
        GET <span style={{ color: 'var(--accent-secondary)' }}>
          https://jsonplaceholder.typicode.com/{resource}
        </span>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Fetching {resource}...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="error-state">
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <strong>Request failed</strong>
            <p style={{ fontSize: 12, marginTop: 4 }}>{error}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={refetch} style={{ marginLeft: 'auto' }}>
            Retry
          </Button>
        </div>
      )}

      {/* Data display */}
      {!loading && !error && data && (
        <>
          {resource === 'users' && (
            <UsersView users={data} searchQuery={searchQuery} />
          )}
          {resource === 'posts' && (
            <PostsView posts={data} searchQuery={searchQuery} />
          )}
        </>
      )}
    </div>
  )
}
