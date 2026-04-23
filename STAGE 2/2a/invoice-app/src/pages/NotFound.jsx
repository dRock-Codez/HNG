import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)' }}>We lost this page somewhere.</p>
      <Link to="/" className="btn btn-primary">Back to invoices</Link>
    </div>
  )
}
