const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Full validation — required for "Save & Send" (Pending status)
 * Returns an object: { [fieldPath]: errorMessage }
 */
export function validateInvoice(invoice) {
  const errors = {}

  // Sender address — all fields required
  if (!invoice.senderAddress.street.trim()) errors['senderAddress.street'] = "can't be empty"
  if (!invoice.senderAddress.city.trim()) errors['senderAddress.city'] = "can't be empty"
  if (!invoice.senderAddress.postCode.trim()) errors['senderAddress.postCode'] = "can't be empty"
  if (!invoice.senderAddress.country.trim()) errors['senderAddress.country'] = "can't be empty"

  // Client info — all required
  if (!invoice.clientName.trim()) errors.clientName = "can't be empty"
  if (!invoice.clientEmail.trim()) {
    errors.clientEmail = "can't be empty"
  } else if (!emailRegex.test(invoice.clientEmail.trim())) {
    errors.clientEmail = 'invalid email'
  }

  // Client address — all required
  if (!invoice.clientAddress.street.trim()) errors['clientAddress.street'] = "can't be empty"
  if (!invoice.clientAddress.city.trim()) errors['clientAddress.city'] = "can't be empty"
  if (!invoice.clientAddress.postCode.trim()) errors['clientAddress.postCode'] = "can't be empty"
  if (!invoice.clientAddress.country.trim()) errors['clientAddress.country'] = "can't be empty"

  // Date and description
  if (!invoice.createdAt) errors.createdAt = "can't be empty"
  if (!invoice.description.trim()) errors.description = "can't be empty"

  // Items — must have at least one, all valid
  if (!invoice.items || invoice.items.length === 0) {
    errors.items = '— An item must be added'
  } else {
    invoice.items.forEach((item, i) => {
      if (!item.name.trim()) errors[`items.${i}.name`] = "can't be empty"
      if (item.quantity === '' || Number(item.quantity) <= 0) {
        errors[`items.${i}.quantity`] = 'must be > 0'
      }
      if (item.price === '' || Number(item.price) < 0) {
        errors[`items.${i}.price`] = 'must be ≥ 0'
      }
    })
  }

  return errors
}

/**
 * Check if invoice has any errors
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}

/**
 * Get nested error value by path like "senderAddress.street"
 */
export function getError(errors, path) {
  return errors[path]
}
