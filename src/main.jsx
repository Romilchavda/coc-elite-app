import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// --- SERVICE WORKER REGISTRATION (PWA Setup) ---
// Ye code website ko background me chalne aur notification bhejne me help karega
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW Registered with scope:', registration.scope);
      })
      .catch(err => {
        console.log('SW Registration failed:', err);
      });
  });
}