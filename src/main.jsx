import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ClerkProvider } from '@clerk/react'
import { dark } from '@clerk/themes'
import App from './App.jsx'
import './index.css'
import { injectFonts } from './fonts.js'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'

injectFonts()

const ClerkWithTheme = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <ClerkProvider 
      afterSignOutUrl="/" 
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#6366f1',
          colorBackground: theme === 'dark' ? '#0b0f1a' : '#ffffff',
          colorText: theme === 'dark' ? '#e8eaf0' : '#0f172a',
          colorInputBackground: theme === 'dark' ? '#04060d' : '#f8fafc',
          colorInputText: theme === 'dark' ? '#e8eaf0' : '#0f172a',
        },
        elements: {
          card: {
            boxShadow: theme === 'dark' ? '0 10px 40px -10px rgba(0,0,0,0.8)' : '0 10px 40px -10px rgba(0,0,0,0.1)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.08)',
            background: theme === 'dark' ? 'rgba(11, 15, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          },
          socialButtonsBlockButton: {
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.13)' : '1px solid rgba(0, 0, 0, 0.15)',
          },
          dividerLine: {
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.13)' : 'rgba(0, 0, 0, 0.15)',
          },
          formFieldInput: {
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.13)' : '1px solid rgba(0, 0, 0, 0.15)',
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkWithTheme>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </ClerkWithTheme>
    </ThemeProvider>
  </React.StrictMode>,
)
