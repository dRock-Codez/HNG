import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useInvoices } from '../contexts/InvoiceContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import InvoiceForm from '../components/InvoiceForm.jsx'
import { formatCurrency, formatDate } from '../utils/helpers.js'
import './InvoiceDetail.css'

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, update, remove, markAsPaid } = useInvoices()
  const invoice = getById(id)

  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  if (!invoice) {
    return (
      <div className="detail__missing">
        <h1>Invoice not found</h1>
        <p>We couldn't find an invoice with that ID.</p>
        <Link to="/" className="btn btn-primary">Back to invoices</Link>
      </div>
    )
  }

  const handleDelete = () => {
    remove(invoice.id)
    setShowDelete(false)
    navigate('/')
  }

  const handleMarkAsPaid = () => {
    markAsPaid(invoice.id)
  }

  const handleEditSave = (updated) => {
    update(invoice.id, updated)
    setShowEdit(false)
  }

  const canMarkAsPaid = invoice.status === 'pending'

  return (
    <>
      <Link to="/" className="detail__back">
        <svg width="7" height="10" viewBox="0 0 7 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#9277FF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Go back
      </Link>

      {/* Status bar */}
      <div className="detail__status-bar">
        <div className="detail__status-wrap">
          <span className="detail__status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="detail__status-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setShowEdit(true)}>
            Edit
          </button>
          <button type="button" className="btn btn-danger" onClick={() => setShowDelete(true)}>
            Delete
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleMarkAsPaid}
            disabled={!canMarkAsPaid}
            title={
              invoice.status === 'paid'
                ? 'Already paid'
                : invoice.status === 'draft'
                ? 'Send invoice first to mark as paid'
                : 'Mark this invoice as paid'
            }
          >
            Mark as Paid
          </button>
        </div>
      </div>

      {/* Invoice card */}
      <article className="detail">
        <header className="detail__header">
          <div>
            <h1 className="detail__id">
              <span className="detail__id-hash">#</span>
              {invoice.id}
            </h1>
            <p className="detail__description">{invoice.description}</p>
          </div>
          <address className="detail__sender">
            <span>{invoice.senderAddress.street}</span>
            <span>{invoice.senderAddress.city}</span>
            <span>{invoice.senderAddress.postCode}</span>
            <span>{invoice.senderAddress.country}</span>
          </address>
        </header>

        <section className="detail__meta">
          <div className="detail__meta-group">
            <div>
              <h4 className="detail__meta-label">Invoice Date</h4>
              <p className="detail__meta-value">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <h4 className="detail__meta-label">Payment Due</h4>
              <p className="detail__meta-value">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>

          <div className="detail__client">
            <h4 className="detail__meta-label">Bill To</h4>
            <p className="detail__meta-value">{invoice.clientName}</p>
            <address className="detail__client-address">
              <span>{invoice.clientAddress.street}</span>
              <span>{invoice.clientAddress.city}</span>
              <span>{invoice.clientAddress.postCode}</span>
              <span>{invoice.clientAddress.country}</span>
            </address>
          </div>

          <div className="detail__email">
            <h4 className="detail__meta-label">Sent to</h4>
            <p className="detail__meta-value">
              <a href={`mailto:${invoice.clientEmail}`}>{invoice.clientEmail}</a>
            </p>
          </div>
        </section>

        <section className="detail__items">
          <table className="detail__table" role="table">
            <thead>
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col" className="detail__col-num">QTY.</th>
                <th scope="col" className="detail__col-num">Price</th>
                <th scope="col" className="detail__col-num">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td data-label="Item Name" className="detail__item-name">{item.name}</td>
                  <td data-label="QTY & Price" className="detail__col-num detail__mobile-combined">
                    <span className="detail__mobile-qty">{item.quantity} × {formatCurrency(item.price)}</span>
                    <span className="detail__desktop-qty">{item.quantity}</span>
                  </td>
                  <td className="detail__col-num detail__desktop-only">{formatCurrency(item.price)}</td>
                  <td data-label="Total" className="detail__col-num detail__item-total">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="detail__grand-total">
            <span className="detail__grand-total-label">Amount Due</span>
            <span className="detail__grand-total-value">{formatCurrency(invoice.total)}</span>
          </div>
        </section>
      </article>

      {/* Mobile action bar */}
      <div className="detail__mobile-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setShowEdit(true)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger" onClick={() => setShowDelete(true)}>
          Delete
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleMarkAsPaid}
          disabled={!canMarkAsPaid}
        >
          Mark as Paid
        </button>
      </div>

      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showEdit && (
        <InvoiceForm
          mode="edit"
          initialInvoice={invoice}
          onSave={handleEditSave}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}
