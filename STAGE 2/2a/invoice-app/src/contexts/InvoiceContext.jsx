import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../utils/storage.js'
import { seedInvoices } from '../data/initialData.js'
import { calculateInvoiceTotal, calculateDueDate } from '../utils/helpers.js'

const InvoiceContext = createContext(null)

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => {
    const stored = storage.load()
    return stored ?? seedInvoices
  })

  // Persist on every change
  useEffect(() => {
    storage.save(invoices)
  }, [invoices])

  // Ensure totals and due dates stay consistent
  const normalize = (invoice) => {
    const items = (invoice.items || []).map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
      total: (Number(item.quantity) || 0) * (Number(item.price) || 0)
    }))
    return {
      ...invoice,
      items,
      total: calculateInvoiceTotal(items),
      paymentDue: calculateDueDate(invoice.createdAt, invoice.paymentTerms)
    }
  }

  const actions = useMemo(
    () => ({
      create: (invoice) => {
        const normalized = normalize(invoice)
        setInvoices((prev) => [normalized, ...prev])
        return normalized
      },

      update: (id, updates) => {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === id ? normalize({ ...inv, ...updates }) : inv))
        )
      },

      remove: (id) => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id))
      },

      markAsPaid: (id) => {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === id && inv.status === 'pending' ? { ...inv, status: 'paid' } : inv
          )
        )
      },

      getById: (id) => invoices.find((inv) => inv.id === id),

      resetToSeed: () => setInvoices(seedInvoices)
    }),
    [invoices]
  )

  return (
    <InvoiceContext.Provider value={{ invoices, ...actions }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext)
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider')
  return ctx
}
