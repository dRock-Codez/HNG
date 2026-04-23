import './StatusBadge.css'

const STATUS_LABELS = {
  paid: 'Paid',
  pending: 'Pending',
  draft: 'Draft'
}

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status

  return (
    <span className={`status-badge status-badge--${status}`} role="status">
      <span className="status-badge__dot" aria-hidden="true" />
      {label}
    </span>
  )
}
