import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ResumeProvider } from './context/ResumeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <App />
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
