import React from 'react'

/**
 * REUSABLE INPUT COMPONENT
 * 
 * Demonstrates: controlled inputs, error state, prop composition
 * 
 * Props:
 *   label:       field label (optional)
 *   value:       controlled value
 *   onChange:    change handler
 *   error:       error message string (shows red border + message)
 *   placeholder: placeholder text
 *   type:        input type (text, email, tel, etc.)
 *   className:   extra CSS classes for the input element
 */
export default function Input({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  className = '',
  inputRef,
  onKeyDown,
  autoFocus,
}) {
  return (
    <div className="input-group">
      {/* Render label only if provided */}
      {label && <label className="input-label">{label}</label>}

      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`input ${error ? 'error' : ''} ${className}`}
      />

      {/* Show error message only when error exists */}
      {error && <p className="input-error-msg">⚠ {error}</p>}
    </div>
  )
}
