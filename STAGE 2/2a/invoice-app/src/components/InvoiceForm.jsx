import { useEffect, useMemo, useRef, useState } from 'react'
import { validateInvoice, hasErrors } from '../utils/validation.js'
import {
  generateInvoiceId,
  formatCurrency,
  todayISO,
  calculateItemTotal
} from '../utils/helpers.js'
import './InvoiceForm.css'

const EMPTY_INVOICE = {
  id: '',
  createdAt: todayISO(),
  paymentDue: '',
  description: '',
  paymentTerms: 30,
  clientName: '',
  clientEmail: '',
  status: 'draft',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [],
  total: 0
}

const PAYMENT_TERMS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' }
]

export default function InvoiceForm({ mode, initialInvoice, onSave, onClose }) {
  const [form, setForm] = useState(() => initialInvoice || EMPTY_INVOICE)
  const [errors, setErrors] = useState({})
  const [termsOpen, setTermsOpen] = useState(false)
  const formRef = useRef(null)
  const termsRef = useRef(null)

  const isEdit = mode === 'edit'
  const title = isEdit ? (
    <>
      Edit <span className="form__id-hash">#</span>
      {form.id}
    </>
  ) : (
    'New Invoice'
  )

  // ESC close + body scroll lock + initial focus
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)

    // Focus first input after animation starts
    const firstInput = formRef.current?.querySelector('input, textarea, select, button')
    setTimeout(() => firstInput?.focus(), 100)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  // Close terms dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (termsRef.current && !termsRef.current.contains(e.target)) setTermsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const total = useMemo(
    () => form.items.reduce((sum, i) => sum + calculateItemTotal(i.quantity, i.price), 0),
    [form.items]
  )

  // --- Field updaters ---
  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    clearError(field)
  }

  const updateNested = (parent, field, value) => {
    setForm((f) => ({ ...f, [parent]: { ...f[parent], [field]: value } }))
    clearError(`${parent}.${field}`)
  }

  const updateItem = (index, field, value) => {
    setForm((f) => {
      const items = [...f.items]
      items[index] = { ...items[index], [field]: value }
      return { ...f, items }
    })
    clearError(`items.${index}.${field}`)
    clearError('items')
  }

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { name: '', quantity: 1, price: 0, total: 0 }]
    }))
    clearError('items')
  }

  const removeItem = (index) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }))
  }

  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // --- Submit handlers ---
  const handleSaveDraft = () => {
    // Drafts: no validation required
    const payload = {
      ...form,
      id: form.id || generateInvoiceId(),
      status: isEdit ? form.status : 'draft',
      total
    }
    onSave(payload)
  }

  const handleSaveAndSend = () => {
    const validationErrors = validateInvoice(form)
    setErrors(validationErrors)

    if (hasErrors(validationErrors)) {
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0]
      const el = formRef.current?.querySelector(`[data-field="${firstErrorKey}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const payload = {
      ...form,
      id: form.id || generateInvoiceId(),
      status: form.status === 'paid' ? 'paid' : 'pending',
      total
    }
    onSave(payload)
  }

  const selectedTerm =
    PAYMENT_TERMS.find((t) => t.value === Number(form.paymentTerms)) || PAYMENT_TERMS[3]

  const hasFormErrors = hasErrors(errors)

  return (
    <div
      className="form__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div className="form__drawer" ref={formRef}>
        <button
          type="button"
          className="form__back"
          onClick={onClose}
          aria-label="Close form"
        >
          <svg width="7" height="10" viewBox="0 0 7 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#9277FF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Go back
        </button>

        <h2 id="form-title" className="form__title">{title}</h2>

        <form className="form__body" onSubmit={(e) => e.preventDefault()} noValidate>
          {/* Bill From */}
          <fieldset className="form__section">
            <legend className="form__section-title">Bill From</legend>

            <Field
              label="Street Address"
              value={form.senderAddress.street}
              onChange={(v) => updateNested('senderAddress', 'street', v)}
              error={errors['senderAddress.street']}
              path="senderAddress.street"
              full
            />
            <div className="form__row">
              <Field
                label="City"
                value={form.senderAddress.city}
                onChange={(v) => updateNested('senderAddress', 'city', v)}
                error={errors['senderAddress.city']}
                path="senderAddress.city"
              />
              <Field
                label="Post Code"
                value={form.senderAddress.postCode}
                onChange={(v) => updateNested('senderAddress', 'postCode', v)}
                error={errors['senderAddress.postCode']}
                path="senderAddress.postCode"
              />
              <Field
                label="Country"
                value={form.senderAddress.country}
                onChange={(v) => updateNested('senderAddress', 'country', v)}
                error={errors['senderAddress.country']}
                path="senderAddress.country"
                className="form__field--country"
              />
            </div>
          </fieldset>

          {/* Bill To */}
          <fieldset className="form__section">
            <legend className="form__section-title">Bill To</legend>

            <Field
              label="Client's Name"
              value={form.clientName}
              onChange={(v) => updateField('clientName', v)}
              error={errors.clientName}
              path="clientName"
              full
            />
            <Field
              label="Client's Email"
              type="email"
              placeholder="e.g. email@example.com"
              value={form.clientEmail}
              onChange={(v) => updateField('clientEmail', v)}
              error={errors.clientEmail}
              path="clientEmail"
              full
            />
            <Field
              label="Street Address"
              value={form.clientAddress.street}
              onChange={(v) => updateNested('clientAddress', 'street', v)}
              error={errors['clientAddress.street']}
              path="clientAddress.street"
              full
            />
            <div className="form__row">
              <Field
                label="City"
                value={form.clientAddress.city}
                onChange={(v) => updateNested('clientAddress', 'city', v)}
                error={errors['clientAddress.city']}
                path="clientAddress.city"
              />
              <Field
                label="Post Code"
                value={form.clientAddress.postCode}
                onChange={(v) => updateNested('clientAddress', 'postCode', v)}
                error={errors['clientAddress.postCode']}
                path="clientAddress.postCode"
              />
              <Field
                label="Country"
                value={form.clientAddress.country}
                onChange={(v) => updateNested('clientAddress', 'country', v)}
                error={errors['clientAddress.country']}
                path="clientAddress.country"
                className="form__field--country"
              />
            </div>

            <div className="form__row form__row--2col">
              <Field
                label="Invoice Date"
                type="date"
                value={form.createdAt}
                onChange={(v) => updateField('createdAt', v)}
                error={errors.createdAt}
                path="createdAt"
              />
              <div className="form__field form__terms" ref={termsRef}>
                <label className="form__label" htmlFor="paymentTerms">Payment Terms</label>
                <button
                  id="paymentTerms"
                  type="button"
                  className="form__terms-trigger"
                  onClick={() => setTermsOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={termsOpen}
                >
                  {selectedTerm.label}
                  <svg
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    xmlns="http://www.w3.org/2000/svg"
                    className={termsOpen ? 'form__terms-chevron--open' : ''}
                    aria-hidden="true"
                  >
                    <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {termsOpen && (
                  <ul className="form__terms-menu" role="listbox">
                    {PAYMENT_TERMS.map((t) => (
                      <li key={t.value}>
                        <button
                          type="button"
                          className="form__terms-option"
                          onClick={() => {
                            updateField('paymentTerms', t.value)
                            setTermsOpen(false)
                          }}
                          aria-selected={form.paymentTerms === t.value}
                        >
                          {t.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <Field
              label="Project Description"
              placeholder="e.g. Graphic Design Service"
              value={form.description}
              onChange={(v) => updateField('description', v)}
              error={errors.description}
              path="description"
              full
            />
          </fieldset>

          {/* Item List */}
          <fieldset className="form__section form__section--items">
            <legend className="form__items-title">Item List</legend>

            {form.items.length > 0 && (
              <div className="form__items">
                <div className="form__items-header" aria-hidden="true">
                  <span>Item Name</span>
                  <span className="form__items-qty">Qty.</span>
                  <span className="form__items-price">Price</span>
                  <span className="form__items-total">Total</span>
                </div>

                {form.items.map((item, i) => (
                  <div key={i} className="form__item">
                    <Field
                      label="Item Name"
                      hideLabel
                      value={item.name}
                      onChange={(v) => updateItem(i, 'name', v)}
                      error={errors[`items.${i}.name`]}
                      path={`items.${i}.name`}
                      className="form__item-name"
                    />
                    <Field
                      label="Qty."
                      hideLabel
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(v) => updateItem(i, 'quantity', v)}
                      error={errors[`items.${i}.quantity`]}
                      path={`items.${i}.quantity`}
                      className="form__item-qty"
                    />
                    <Field
                      label="Price"
                      hideLabel
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(v) => updateItem(i, 'price', v)}
                      error={errors[`items.${i}.price`]}
                      path={`items.${i}.price`}
                      className="form__item-price"
                    />
                    <div className="form__item-total">
                      <span className="form__item-total-label">Total</span>
                      <span className="form__item-total-value">
                        {formatCurrency(calculateItemTotal(item.quantity, item.price))}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="form__item-delete"
                      onClick={() => removeItem(i)}
                      aria-label={`Delete item ${i + 1}`}
                    >
                      <svg width="13" height="16" viewBox="0 0 13 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M8.471 1l.9.9h2.857v1.8H.6V1.9h2.857L4.357 1h4.114zm.643 4.5v9H2.814v-9h6.3zm-1.8 1.8h-2.7v5.4h2.7v-5.4z" fill="#888EB0" fillRule="nonzero"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" className="form__add-item" onClick={addItem}>
              <span aria-hidden="true">+</span> Add New Item
            </button>

            {errors.items && (
              <p className="form__items-error" role="alert">{errors.items}</p>
            )}
          </fieldset>

          {hasFormErrors && (
            <div className="form__errors-summary" role="alert">
              <p>- All fields must be added</p>
              {errors.items && <p>{errors.items}</p>}
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="form__actions">
          {isEdit ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveAndSend}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-secondary form__action-discard" onClick={onClose}>
                Discard
              </button>
              <button type="button" className="btn btn-tertiary" onClick={handleSaveDraft}>
                Save as Draft
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveAndSend}>
                Save &amp; Send
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Field subcomponent ---
function Field({ label, value, onChange, error, path, type = 'text', placeholder, hideLabel, className = '', full, ...rest }) {
  const id = `field-${path}`
  return (
    <div className={`form__field ${full ? 'form__field--full' : ''} ${className} ${error ? 'form__field--error' : ''}`}>
      {!hideLabel && (
        <div className="form__label-row">
          <label className="form__label" htmlFor={id}>{label}</label>
          {error && <span className="form__error" role="alert">{error}</span>}
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="form__input"
        data-field={path}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-label={hideLabel ? label : undefined}
        {...rest}
      />
      {hideLabel && error && (
        <span id={`${id}-error`} className="sr-only">{error}</span>
      )}
    </div>
  )
}
