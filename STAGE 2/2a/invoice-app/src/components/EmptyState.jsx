import emptyIllustration from '../assets/empty-illustration.svg'
import './EmptyState.css'

export default function EmptyState() {
  return (
    <div className="empty">
      <img
        src={emptyIllustration}
        alt="There is nothing here. Create an invoice by clicking the New Invoice button and get started"
        className="empty__illustration"
      />
    </div>
  )
}