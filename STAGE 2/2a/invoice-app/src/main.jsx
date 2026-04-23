import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { InvoiceProvider } from './contexts/InvoiceContext.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <InvoiceProvider>
          <App />
        </InvoiceProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
