/**
 * Generate invoice ID — matches Frontend Mentor pattern: 2 uppercase letters + 4 digits
 * Example: RT3080
 */
export function generateInvoiceId() {
  const letters = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('')
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `${letters}${digits}`
}

/**
 * Format number as GBP currency
 */
export function formatCurrency(value) {
  const num = Number(value) || 0
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

/**
 * Format date as "21 Aug 2021"
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Get today's date in YYYY-MM-DD format (for form default)
 */
export function todayISO() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Calculate payment due date from created date + terms in days
 */
export function calculateDueDate(createdAt, paymentTerms) {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + Number(paymentTerms))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Calculate totals for items
 */
export function calculateItemTotal(quantity, price) {
  return Number(quantity || 0) * Number(price || 0)
}

export function calculateInvoiceTotal(items) {
  return items.reduce((sum, item) => sum + calculateItemTotal(item.quantity, item.price), 0)
}
