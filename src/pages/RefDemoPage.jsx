import React, { useState, useRef, useEffect, useCallback } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Input from '../components/Input'

/**
 * useRef DEMO PAGE
 * 
 * Concepts covered:
 * - useRef for DOM access: focus, measure, scroll
 * - useRef as instance variable: track values WITHOUT causing re-renders
 * - Previous value pattern: store last render's value
 * - Timer refs: store setInterval/setTimeout IDs for cleanup
 * 
 * KEY INSIGHT: useRef returns a mutable object { current: value }
 * Changing ref.current does NOT cause a re-render — unlike useState.
 */

// ─────────────────────────────────────────────
// DEMO 1: Focus management
// ─────────────────────────────────────────────
function FocusDemo() {
  // Create a ref to attach to the input DOM element
  const inputRef = useRef(null)
  const [focusCount, setFocusCount] = useState(0)

  const focusInput = () => {
    // inputRef.current is the actual DOM element
    inputRef.current?.focus()
    setFocusCount(c => c + 1)
  }

  const selectAll = () => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  const clearInput = () => {
    inputRef.current?.focus()
    // You can directly read/write DOM properties via the ref
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  return (
    <div className="ref-section">
      <h3>1. DOM Access & Focus Management</h3>
      <p>
        Attach a ref to an element to get direct DOM access.
        Click the buttons to programmatically focus, select, or manipulate the input.
      </p>

      {/* ref={inputRef} attaches the DOM node to our ref object */}
      <input
        ref={inputRef}
        type="text"
        className="input"
        defaultValue="Click a button to interact with me!"
        onFocus={() => setFocusCount(c => c + 1)}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <Button variant="secondary" size="sm" onClick={focusInput}>
          🎯 Focus
        </Button>
        <Button variant="secondary" size="sm" onClick={selectAll}>
          📋 Select All
        </Button>
        <Button variant="ghost" size="sm" onClick={clearInput}>
          ✕ Clear
        </Button>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
        Focus count (from both button + tab): <strong style={{ color: 'var(--accent-primary)' }}>{focusCount}</strong>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// DEMO 2: Previous value tracker
// ─────────────────────────────────────────────

// Custom hook: usePrevious
// Returns the value from the PREVIOUS render
function usePrevious(value) {
  const prevRef = useRef()

  // useEffect runs AFTER render — so prevRef.current still holds
  // the old value when we read it during the current render,
  // then gets updated for the NEXT render
  useEffect(() => {
    prevRef.current = value
  })

  return prevRef.current
}

function PreviousValueDemo() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div className="ref-section">
      <h3>2. Track Previous Value</h3>
      <p>
        useRef stores a value across renders without causing re-renders.
        This is how we can "remember" what a value was on the last render.
      </p>

      <div className="prev-value-display">
        <div className="value-box">
          <label>Previous</label>
          <span>{previousCount ?? '—'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 20 }}>
          →
        </div>
        <div className="value-box">
          <label>Current</label>
          <span style={{ color: 'var(--accent-primary)' }}>{count}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="secondary" size="sm" onClick={() => setCount(c => c - 1)}>
          − Decrement
        </Button>
        <Button size="sm" onClick={() => setCount(c => c + 1)}>
          + Increment
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
          Reset
        </Button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// DEMO 3: Timer ref (store interval ID)
// ─────────────────────────────────────────────
function TimerDemo() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Store the interval ID in a ref so we can clear it later
  // We use a ref (not state) because changing it shouldn't cause a re-render
  const intervalRef = useRef(null)

  const start = () => {
    if (isRunning) return
    setIsRunning(true)
    // Store the interval ID in the ref
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current) // Use the stored ID to clear
    intervalRef.current = null
    setIsRunning(false)
  }

  const reset = () => {
    stop()
    setSeconds(0)
  }

  // Cleanup on unmount — prevents memory leaks
  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0')
    const secs = (s % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  return (
    <div className="ref-section">
      <h3>3. Storing Timer IDs in Refs</h3>
      <p>
        The interval ID is stored in a ref — not state — because we don't need the
        UI to re-render when the ID changes. We just need to remember it for cleanup.
      </p>

      <div style={{
        fontSize: 48,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        color: isRunning ? 'var(--accent-success)' : 'var(--text-primary)',
        marginBottom: 16,
        letterSpacing: '0.1em',
      }}>
        {formatTime(seconds)}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={start} disabled={isRunning}>
          ▶ Start
        </Button>
        <Button variant="secondary" size="sm" onClick={stop} disabled={!isRunning}>
          ⏸ Stop
        </Button>
        <Button variant="ghost" size="sm" onClick={reset}>
          ↺ Reset
        </Button>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
        <code className="code-highlight">intervalRef.current</code> = {intervalRef.current ?? 'null'}
        {' '}(the setInterval ID)
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// DEMO 4: Render count WITHOUT re-rendering
// ─────────────────────────────────────────────
function RenderCountDemo() {
  const [stateValue, setStateValue] = useState('')

  // Count renders via ref — incrementing it doesn't cause more renders
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="ref-section">
      <h3>4. Count Renders Without Re-rendering</h3>
      <p>
        A ref increments on every render. Unlike useState, changing a ref's value
        doesn't trigger a re-render — it just stores the new value quietly.
      </p>

      <Input
        value={stateValue}
        onChange={(e) => setStateValue(e.target.value)}
        placeholder="Type to trigger re-renders..."
      />

      <div className="prev-value-display" style={{ marginTop: 0 }}>
        <div className="value-box">
          <label>Render Count (via ref)</label>
          <span style={{ color: 'var(--accent-secondary)' }}>{renderCount.current}</span>
        </div>
        <div className="value-box">
          <label>Current Input Length</label>
          <span>{stateValue.length}</span>
        </div>
      </div>
    </div>
  )
}

export default function RefDemoPage() {
  return (
    <div className="page-container">
      <PageHeader
        tag="module 06"
        title="useRef Demo"
        description="useRef gives you a mutable box that persists across renders — changing it never causes a re-render."
        concepts={['useRef', 'DOM access', 'previous value', 'timer cleanup', 'mutable values']}
      />

      <div className="ref-demo-grid">
        <FocusDemo />
        <PreviousValueDemo />
        <TimerDemo />
        <RenderCountDemo />
      </div>

      {/* Key concept summary */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 14 }}>
            🎯 useRef vs useState — when to use which:
          </strong>
          <br /><br />
          Use <code className="code-highlight">useState</code> when the value change should update the UI.
          <br />
          Use <code className="code-highlight">useRef</code> when you need to store something but UI shouldn't re-render when it changes.
          <br /><br />
          Common useRef use cases:
          <br />
          • DOM element references (focus, measure, animate)
          <br />
          • Storing timer IDs for cleanup
          <br />
          • Tracking previous values
          <br />
          • Counting renders without causing more renders
          <br />
          • Storing mutable values that callbacks need access to
        </div>
      </div>
    </div>
  )
}
