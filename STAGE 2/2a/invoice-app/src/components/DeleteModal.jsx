import { useEffect, useRef } from 'react'
import './DeleteModal.css'

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const modalRef = useRef(null)
  const cancelBtnRef = useRef(null)

  // ESC to close + body scroll lock
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Tab') trapFocus(e)
    }

    document.addEventListener('keydown', handleKey)

    // Autofocus cancel button (safer default)
    cancelBtnRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [onCancel])

  const trapFocus = (e) => {
    if (!modalRef.current) return
    const focusables = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // Close on overlay click (but not on modal click)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel()
  }

  return (
    <div
      className="delete-modal__overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      <div className="delete-modal" ref={modalRef}>
        <h2 id="delete-modal-title" className="delete-modal__title">
          Confirm Deletion
        </h2>
        <p id="delete-modal-desc" className="delete-modal__description">
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>? This action
          cannot be undone.
        </p>
        <div className="delete-modal__actions">
          <button
            type="button"
            ref={cancelBtnRef}
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
