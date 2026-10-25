import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import useLocalStorage from '../hooks/useLocalStorage'

/**
 * TODO PAGE
 * 
 * Concepts covered:
 * - useState: managing list, input, editing state
 * - List rendering: .map() with key prop
 * - CRUD: Create, Read, Update, Delete
 * - Conditional rendering: show edit mode vs view mode
 * - Derived state: computing stats from todos array (no extra state needed)
 * - useLocalStorage: persisting todos across page refreshes
 */

// Unique ID generator — in real apps, use a library like nanoid
let idCounter = Date.now()
const generateId = () => ++idCounter

// Initial sample todos so the page isn't empty
const INITIAL_TODOS = [
  { id: generateId(), text: 'Learn useState hook', completed: true },
  { id: generateId(), text: 'Build a Todo app', completed: true },
  { id: generateId(), text: 'Understand list rendering and keys', completed: false },
  { id: generateId(), text: 'Learn useEffect next', completed: false },
]

export default function TodoPage() {
  // useLocalStorage acts like useState but persists to localStorage
  // Try refreshing the page — your todos will still be there!
  const [todos, setTodos] = useLocalStorage('rld-todos', INITIAL_TODOS)

  // Input field value — controlled input
  const [inputValue, setInputValue] = useState('')

  // Which todo is currently being edited (-1 = none)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Filter: 'all' | 'active' | 'completed'
  const [filter, setFilter] = useState('all')

  // Modal state for delete confirmation
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })

  // ─── DERIVED STATE (computed from todos, no extra useState needed) ───
  const totalCount = todos.length
  const completedCount = todos.filter(t => t.completed).length
  const pendingCount = totalCount - completedCount

  // Filter todos based on active filter tab
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true // 'all'
  })

  // ─── HANDLERS ───

  // CREATE: Add new todo
  const addTodo = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return // Don't add empty todos

    const newTodo = {
      id: generateId(),
      text: trimmed,
      completed: false,
    }

    // Functional update: always use previous state when new state depends on old
    setTodos(prev => [newTodo, ...prev])
    setInputValue('') // Clear input after adding
  }

  // Allow adding via Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTodo()
  }

  // UPDATE: Toggle completed status
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  // UPDATE: Start editing a todo
  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditValue(todo.text)
  }

  // UPDATE: Save edited todo
  const saveEdit = (id) => {
    const trimmed = editValue.trim()
    if (!trimmed) return // Don't save empty text

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    )
    setEditingId(null) // Exit edit mode
  }

  // DELETE: Remove a todo
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    setDeleteModal({ open: false, id: null })
  }

  // BULK: Mark all as complete
  const completeAll = () => {
    setTodos(prev => prev.map(todo => ({ ...todo, completed: true })))
  }

  // BULK: Clear completed todos
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }

  return (
    <div className="page-container">
      <PageHeader
        tag="module 01"
        title="Todo App"
        description="Full CRUD with useState. Notice how all UI derives from a single todos array — no redundant state."
        concepts={['useState', 'list rendering', 'keys', 'CRUD', 'localStorage']}
      />

      {/* Stats row — derived from todos, no separate state */}
      <div className="todo-stats">
        <div className="stat-chip">
          <strong>{totalCount}</strong> Total
        </div>
        <div className="stat-chip">
          <strong style={{ color: 'var(--accent-success)' }}>{completedCount}</strong> Done
        </div>
        <div className="stat-chip">
          <strong style={{ color: 'var(--accent-warning)' }}>{pendingCount}</strong> Pending
        </div>
      </div>

      {/* Input row */}
      <div className="todo-input-row">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done? Press Enter or click Add"
        />
        <Button onClick={addTodo} disabled={!inputValue.trim()}>
          + Add
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="todo-filters">
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={completeAll}>
            Complete All
          </Button>
          <Button variant="ghost" size="sm" onClick={clearCompleted}
            disabled={completedCount === 0}>
            Clear Done
          </Button>
        </div>
      </div>

      {/* Todo list */}
      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {filter === 'completed' ? '🎉' : '📝'}
          </div>
          <p>
            {filter === 'completed'
              ? 'No completed todos yet'
              : filter === 'active'
              ? 'No active todos — great job!'
              : 'No todos yet. Add one above!'}
          </p>
        </div>
      ) : (
        <ul className="todo-list">
          {/* KEY PROP: React needs unique keys to efficiently re-render lists */}
          {filteredTodos.map(todo => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              {/* Checkbox */}
              <div
                className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
                role="checkbox"
                aria-checked={todo.completed}
                tabIndex={0}
              >
                {todo.completed && '✓'}
              </div>

              {/* Text or edit input — conditional rendering */}
              {editingId === todo.id ? (
                <input
                  className="todo-edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(todo.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  autoFocus
                />
              ) : (
                <span className="todo-text">{todo.text}</span>
              )}

              {/* Action buttons */}
              <div className="todo-actions">
                {editingId === todo.id ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => saveEdit(todo.id)}>
                      💾
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                      ✕
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(todo)}>
                      ✏️
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModal({ open: true, id: todo.id })}
                    >
                      🗑️
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Todo"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Are you sure you want to delete this todo?
        </p>
        <div className="flex gap-8">
          <Button
            variant="danger"
            onClick={() => deleteTodo(deleteModal.id)}
            style={{ flex: 1 }}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, id: null })}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
