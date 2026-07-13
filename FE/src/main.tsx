import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { JobProvider } from './context/JobContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <JobProvider>
        <App />
      </JobProvider>
    </HashRouter>
  </StrictMode>,
)
