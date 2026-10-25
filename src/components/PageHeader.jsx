import React from 'react'

/**
 * PAGE HEADER COMPONENT
 * Consistent header for every module page.
 */
export default function PageHeader({ tag, title, description, concepts = [] }) {
  return (
    <div className="page-header">
      {tag && <div className="page-header-tag"># {tag}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {concepts.length > 0 && (
        <div className="concept-tags">
          {concepts.map(c => (
            <span key={c} className="concept-tag">{c}</span>
          ))}
        </div>
      )}
    </div>
  )
}
