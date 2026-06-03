import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './ui/defis/index.js' // enregistre les défis digitaux
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
