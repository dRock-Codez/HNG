import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import InvoiceList from './pages/InvoiceList.jsx'
import InvoiceDetail from './pages/InvoiceDetail.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
