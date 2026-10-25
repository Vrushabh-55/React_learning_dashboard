import React, { useState, useMemo, useCallback, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'

/**
 * PERFORMANCE PAGE — useMemo & useCallback
 * 
 * Concepts covered:
 * - useMemo: cache the result of an expensive calculation
 * - useCallback: cache a function reference so it doesn't change every render
 * - Re-renders: when do components re-render? How to prevent unnecessary ones
 * - React.memo: prevent child component re-renders when props haven't changed
 * 
 * The demo shows two panels side by side:
 * - LEFT: No optimization — re-renders on every state change
 * - RIGHT: With useMemo/useCallback — only recalculates when inputs change
 */

// Simulate an expensive calculation (e.g., filtering 10k items)
// Without useMemo, this runs on every render — even unrelated state changes
function expensiveCalculation(n) {
  console.log(`%c⚙️ Running expensive calculation with n=${n}`, 'color: #ffa502')
  let result = 0
  for (let i = 0; i < 100000; i++) {
    result += Math.sqrt(i) * n
  }
  return Math.round(result)
}

// ─────────────────────────────────────────────
// UNOPTIMIZED child component
// No React.memo → re-renders whenever parent renders
// ─────────────────────────────────────────────
function UnoptimizedChild({ onIncrement, renderCount }) {
  // Track renders via ref (using ref so logging doesn't itself cause re-render)
  console.log(`%c🔴 UnoptimizedChild rendered (total: ${renderCount})`, 'color: #ff4757')

  return (
    <div>
      <div className="render-count bad">{renderCount}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        total renders
      </div>
      <Button variant="danger" size="sm" onClick={onIncrement} style={{ width: '100%' }}>
        Increment Counter
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────
// OPTIMIZED child component
// React.memo → only re-renders if props change
// ─────────────────────────────────────────────
const OptimizedChild = React.memo(function OptimizedChild({ onIncrement, renderCount }) {
  console.log(`%c🟢 OptimizedChild rendered (total: ${renderCount})`, 'color: #2ed573')

  return (
    <div>
      <div className="render-count good">{renderCount}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        total renders
      </div>
      <Button variant="secondary" size="sm" onClick={onIncrement} style={{ width: '100%' }}>
        Increment Counter
      </Button>
    </div>
  )
})

export default function PerformancePage() {
  // Main calculation input — changing this should trigger recalculation
  const [calcInput, setCalcInput] = useState(5)

  // This state is UNRELATED to the expensive calculation
  // Changing it should NOT re-run the calculation (with useMemo it won't)
  const [unrelatedCount, setUnrelatedCount] = useState(0)

  // Track render counts for each child (using refs to avoid causing renders)
  const unoptimizedRenderCount = useRef(0)
  const optimizedRenderCount = useRef(0)

  // Log render count for display (these refs increment on each parent render too)
  unoptimizedRenderCount.current += 1

  // ─── WITHOUT useMemo ───
  // This runs EVERY TIME the component renders — even when unrelatedCount changes
  // Comment out the useMemo version to see this run more often
  const resultWithout = expensiveCalculation(calcInput) // ← runs on every render!

  // ─── WITH useMemo ───
  // This only re-runs when calcInput changes
  // Unrelated state changes (unrelatedCount) do NOT trigger recalculation
  const resultWith = useMemo(() => {
    return expensiveCalculation(calcInput)
  }, [calcInput]) // ← only recalculates when calcInput changes

  // ─── WITHOUT useCallback ───
  // Creates a NEW function reference on every render
  // Even if the function logic hasn't changed, it's a new object
  // React.memo won't help because props technically "changed"
  const handleIncrementWithout = () => {
    unoptimizedRenderCount.current += 1
    // Force a re-render to see the count
    setUnrelatedCount(c => c + 1)
  }

  // ─── WITH useCallback ───
  // Memoizes the function — same reference across renders
  // Now React.memo on OptimizedChild can actually skip re-renders
  const handleIncrementWith = useCallback(() => {
    optimizedRenderCount.current += 1
    // Force a re-render to see the count
    setUnrelatedCount(c => c + 1)
  }, []) // ← empty deps: function never changes

  const [logs, setLogs] = useState([
    { msg: 'Open DevTools Console to see detailed render logs', type: 'muted' },
    { msg: 'Change the calculation input to trigger expensive recalculation', type: 'muted' },
    { msg: 'Click "Trigger Unrelated Re-render" to see optimization difference', type: 'muted' },
  ])

  const addLog = (msg, type = 'normal') => {
    setLogs(prev => [{ msg, type }, ...prev.slice(0, 9)])
  }

  const triggerUnrelatedRerender = () => {
    setUnrelatedCount(c => c + 1)
    addLog(`Unrelated re-render triggered — useMemo skips recalculation ✓`, 'good')
  }

  const changeInput = (val) => {
    setCalcInput(val)
    addLog(`Input changed to ${val} — expensive calculation WILL run`, 'warn')
  }

  return (
    <div className="page-container">
      <PageHeader
        tag="module 05"
        title="useMemo & useCallback"
        description="Watch render counters and console logs to understand when React re-runs expensive operations."
        concepts={['useMemo', 'useCallback', 'React.memo', 're-renders', 'optimization']}
      />

      {/* Controls */}
      <div className="perf-controls">
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Calculation input (n):
        </div>
        {[2, 5, 10, 20].map(n => (
          <button
            key={n}
            className={`filter-btn ${calcInput === n ? 'active' : ''}`}
            onClick={() => changeInput(n)}
          >
            n = {n}
          </button>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={triggerUnrelatedRerender}
          style={{ marginLeft: 'auto' }}
        >
          Trigger Unrelated Re-render
        </Button>
      </div>

      {/* Side-by-side comparison panels */}
      <div className="perf-demo-grid">
        {/* LEFT: No optimization */}
        <div className="perf-panel">
          <div className="perf-panel-title bad">
            <span>🔴</span> Without Optimization
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            No <code className="code-highlight">useMemo</code> or{' '}
            <code className="code-highlight">useCallback</code>. Re-renders on every
            state change, even unrelated ones.
          </p>

          <UnoptimizedChild
            onIncrement={handleIncrementWithout}
            renderCount={unoptimizedRenderCount.current}
          />

          <div className="calc-result">
            <strong>{resultWithout.toLocaleString()}</strong>
            Calculated result (runs every render)
          </div>
        </div>

        {/* RIGHT: With optimization */}
        <div className="perf-panel">
          <div className="perf-panel-title good">
            <span>🟢</span> With Optimization
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Uses <code className="code-highlight">useMemo</code> and{' '}
            <code className="code-highlight">useCallback</code>.
            Wrapped in <code className="code-highlight">React.memo</code>.
          </p>

          <OptimizedChild
            onIncrement={handleIncrementWith}
            renderCount={optimizedRenderCount.current}
          />

          <div className="calc-result">
            <strong>{resultWith.toLocaleString()}</strong>
            Memoized result (only recalculates when n changes)
          </div>
        </div>
      </div>

      {/* Activity log panel */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
          Activity Log (most recent first):
        </div>
        <div className="console-log-panel">
          {logs.map((log, i) => (
            <p key={i} className={`log-${log.type}`}>
              {log.msg}
            </p>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 14 }}>
            🧠 When to use these hooks:
          </strong>
          <br /><br />
          <code className="code-highlight">useMemo</code> — Cache expensive computations.
          Only recalculate when dependencies change. Don't use for simple calculations —
          the memoization itself has a cost.
          <br /><br />
          <code className="code-highlight">useCallback</code> — Cache function references.
          Useful when passing callbacks to child components wrapped in{' '}
          <code className="code-highlight">React.memo</code>, or as dependencies in
          other hooks.
          <br /><br />
          <strong style={{ color: 'var(--accent-warning)' }}>⚠️ Rule of thumb:</strong>{' '}
          Don't over-optimize. Measure first, then optimize. Premature optimization
          adds complexity without meaningful benefit.
        </div>
      </div>
    </div>
  )
}
