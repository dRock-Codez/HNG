const KEY = 'invoicer:invoices'

export const storage = {
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : null
    } catch (err) {
      console.warn('Storage load failed:', err)
      return null
    }
  },

  save(invoices) {
    try {
      localStorage.setItem(KEY, JSON.stringify(invoices))
    } catch (err) {
      console.warn('Storage save failed:', err)
    }
  },

  clear() {
    try {
      localStorage.removeItem(KEY)
    } catch (err) {
      console.warn('Storage clear failed:', err)
    }
  }
}
