import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import { formatCurrency, formatDate } from '../utils/helpers.js'
import './InvoiceCard.css'

export default function InvoiceCard({ invoice, index = 0 }) {
  return (
    <Link
      to={`/invoice/${invoice.id}`}
      className="invoice-card"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
      aria-label={`Invoice ${invoice.id}, ${invoice.clientName}, ${formatCurrency(invoice.total)}, ${invoice.status}`}
    >
      <span className="invoice-card__id">
        <span className="invoice-card__hash">#</span>
        {invoice.id}
      </span>

      <span className="invoice-card__due">
        Due {formatDate(invoice.paymentDue)}
      </span>

      <span className="invoice-card__client">{invoice.clientName}</span>

      <span className="invoice-card__total">{formatCurrency(invoice.total)}</span>

      <span className="invoice-card__status">
        <StatusBadge status={invoice.status} />
      </span>

      <svg
        className="invoice-card__arrow"
        width="7"
        height="10"
        viewBox="0 0 7 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1 1l4 4-4 4"
          stroke="#7C5DFA"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
