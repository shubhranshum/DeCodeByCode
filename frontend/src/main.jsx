import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {UserProvider} from './context/UserContext'
// import Login from './routes/loginPage.jsx'
// import Home from './routes/home.jsx'
// import SignUp from './routes/signUpPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <App />
    </UserProvider>
  </StrictMode>,
)
