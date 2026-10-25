import React from 'react'

/**
 * REUSABLE CARD COMPONENT
 * 
 * A simple wrapper that applies card styling.
 * Children are rendered inside.
 */
export default function Card({ children, style, className = '' }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  )
}
