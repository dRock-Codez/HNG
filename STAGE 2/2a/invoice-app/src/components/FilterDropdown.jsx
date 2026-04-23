import { useEffect, useRef, useState } from 'react'
import './FilterDropdown.css'

const OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' }
]

export default function FilterDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="filter" ref={ref}>
      <button
        type="button"
        className="filter__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="filter__trigger-mobile">Filter</span>
        <span className="filter__trigger-desktop">Filter by status</span>
        <svg
          className={`filter__chevron ${open ? 'filter__chevron--open' : ''}`}
          width="11"
          height="7"
          viewBox="0 0 11 7"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="filter__menu" role="menu">
          {OPTIONS.map((opt) => (
            <label key={opt.value} className="filter__option" role="menuitemcheckbox" aria-checked={selected.includes(opt.value)}>
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="filter__checkbox"
              />
              <span className="filter__checkbox-visual" aria-hidden="true">
                <svg width="11" height="8" viewBox="0 0 11 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 4.5l2.755 2.754L9.256 1" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="filter__label">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
