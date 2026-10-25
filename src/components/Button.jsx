import React from 'react'

/**
 * REUSABLE BUTTON COMPONENT
 * 
 * Demonstrates: component reusability, prop-based customization
 * 
 * Props:
 *   variant: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
 *   size:    'sm' | 'md' (default: 'md')
 *   onClick: click handler
 *   disabled: boolean
 *   children: button label / content
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  children,
  type = 'button',
  style,
}) {
  // Build class string from variant + size
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}
