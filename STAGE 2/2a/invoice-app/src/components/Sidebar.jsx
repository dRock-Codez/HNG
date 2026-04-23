import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext.jsx'
import './Sidebar.css'
import avatarImage from '../assets/avatar.jpg'

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sidebar" role="banner">
      <Link to="/" className="sidebar__logo" aria-label="Invoicer — Home">
        <div className="sidebar__logo-inner">
          <svg width="28" height="26" viewBox="0 0 28 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.828 21.732 26 14 26S0 19.828 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9 20.513 0z" fill="#FFF" fillRule="nonzero"/>
          </svg>
        </div>
      </Link>

      <div className="sidebar__actions">
        <button
          type="button"
          className="sidebar__theme"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            // Moon
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M19.5 14.092a8 8 0 1 1-9.592-9.592A7.003 7.003 0 0 0 19.5 14.092z" fill="#7E88C3" stroke="#7E88C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            // Sun
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M10 13.229a3.229 3.229 0 1 0 0-6.458 3.229 3.229 0 0 0 0 6.458zM10 1v2.083M10 16.917V19M3.364 3.364l1.477 1.477M15.159 15.159l1.477 1.477M1 10h2.083M16.917 10H19M3.364 16.636l1.477-1.477M15.159 4.841l1.477-1.477" stroke="#858BB2" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        <div className="sidebar__divider" aria-hidden="true" />

        <img
  src={avatarImage}
  alt="Uzoma"
  className="sidebar__avatar"
/>
      </div>
    </header>
  )
}
