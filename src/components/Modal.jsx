import React, { useEffect } from 'react'
import Button from './Button'

/**
 * REUSABLE MODAL COMPONENT
 * 
 * Demonstrates: portal-like overlay, useEffect for side effects (key listener),
 * conditional rendering, event propagation (stopPropagation)
 * 
 * Props:
 *   isOpen:   boolean — whether modal is visible
 *   onClose:  called when user dismisses modal
 *   title:    modal header title
 *   children: modal body content
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // Close modal when Escape key is pressed
  // useEffect registers + cleans up the listener properly
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup: remove listener when modal closes or component unmounts
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Don't render anything to the DOM if modal is closed
  if (!isOpen) return null

  return (
    // Clicking the dark overlay closes the modal
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents clicks inside from closing the modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <Button variant="ghost" onClick={onClose} size="sm">✕</Button>
        </div>
        {children}
      </div>
    </div>
  )
}
