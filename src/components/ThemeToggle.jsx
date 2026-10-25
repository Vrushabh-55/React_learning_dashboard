import React from 'react'

/**
 * THEME TOGGLE COMPONENT
 * 
 * Demonstrates: prop passing, conditional class styling
 * Theme state lives in App.jsx (lifted state)
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <div className="theme-toggle" onClick={onToggle} role="button" tabIndex={0}>
      <div className={`toggle-track ${isDark ? 'on' : ''}`}>
        <div className="toggle-thumb" />
      </div>
      <span>{isDark ? '🌙 Dark' : '☀️ Light'}</span>
    </div>
  )
}
