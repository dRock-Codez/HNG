import { useMemo, useState } from 'react'
import { useInvoices } from '../contexts/InvoiceContext.jsx'
import InvoiceCard from '../components/InvoiceCard.jsx'
import FilterDropdown from '../components/FilterDropdown.jsx'
import EmptyState from '../components/EmptyState.jsx'
import InvoiceForm from '../components/InvoiceForm.jsx'
import './InvoiceList.css'

export default function InvoiceList() {
  const { invoices, create } = useInvoices()
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filtered = useMemo(() => {
    if (selectedStatuses.length === 0) return invoices
    return invoices.filter((inv) => selectedStatuses.includes(inv.status))
  }, [invoices, selectedStatuses])

  const countLabel = (() => {
    const n = filtered.length
    if (selectedStatuses.length === 0) {
      return n === 0
        ? 'No invoices'
        : `There ${n === 1 ? 'is' : 'are'} ${n} total invoice${n === 1 ? '' : 's'}`
    }
    return n === 0
      ? 'No matching invoices'
      : `There ${n === 1 ? 'is' : 'are'} ${n} ${selectedStatuses.join(' / ')} invoice${n === 1 ? '' : 's'}`
  })()

  const handleSave = (invoice) => {
    create(invoice)
    setIsFormOpen(false)
  }

  return (
    <>
      <header className="list__header">
        <div className="list__heading">
          <h1 className="list__title">Invoices</h1>
          <p className="list__count">{countLabel}</p>
        </div>

        <div className="list__controls">
          <FilterDropdown selected={selectedStatuses} onChange={setSelectedStatuses} />

          <button
            type="button"
            className="btn btn-primary list__new"
            onClick={() => setIsFormOpen(true)}
            aria-label="Create new invoice"
          >
            <span className="list__new-icon" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.313 10l-.016-4.287h4.266v-1.82H6.297V0H4.227v3.893H0v1.82h4.227V10z" fill="#7C5DFA" fillRule="nonzero"/>
              </svg>
            </span>
            <span className="list__new-label-mobile">New</span>
            <span className="list__new-label-desktop">New Invoice</span>
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
  <EmptyState />
) : (
  <ul className="list__items" aria-label="Invoice list">
          {filtered.map((invoice, i) => (
            <li key={invoice.id}>
              <InvoiceCard invoice={invoice} index={i} />
            </li>
          ))}
        </ul>
      )}

      {isFormOpen && (
        <InvoiceForm
          mode="create"
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  )
}
