import React, { useMemo, useState, useEffect } from 'react'
import GlobeBackground from './components/GlobeBackground.jsx'
import { createClient } from '@supabase/supabase-js'
import SimpleFilePicker from './components/SimpleFilePicker.jsx'

export default function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const expectedUsername = import.meta.env.VITE_LOGIN_USERNAME
  const expectedPassword = import.meta.env.VITE_LOGIN_PASSWORD

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
    }
    return createClient(supabaseUrl, supabaseAnonKey)
  }, [supabaseUrl, supabaseAnonKey])

  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('loggedIn') === 'true'
    if (saved) setLoggedIn(true)
  }, [])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [status, setStatus] = useState('')
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  const onLogin = () => {
    if (username === expectedUsername && password === expectedPassword) {
      setLoggedIn(true)
      try { localStorage.setItem('loggedIn', 'true') } catch {}
      setLoginError('')
    } else {
      setLoginError('Invalid username or password.')
    }
  }

  const onLogout = () => {
    setLoggedIn(false)
    try { localStorage.removeItem('loggedIn') } catch {}
    setUsername('')
    setPassword('')
    setStatus('')
    setFile(null)
  }

  const onUpload = async () => {
    if (!file) {
      setStatus('Please select a file to upload.')
      return
    }
    setStatus(`Uploading ${file.name}...`)
    const { data, error } = await supabase
      .storage
      .from('raw-uploads')
      .upload(file.name, file, { cacheControl: '3600', upsert: true })

    if (error) {
      console.error(error)
      setStatus(`Upload failed: ${error.message}`)
    } else {
      console.log('Upload successful:', data)
      setStatus(`Successfully uploaded ${file.name}!`)
      setIsProcessing(true)
      
      // Simulate processing for 15 seconds
      setTimeout(() => {
        setIsProcessing(false)
        setShowComplete(true)
        
        // Show completion for 2 seconds then reset
        setTimeout(() => {
          setShowComplete(false)
          setStatus('')
          setFile(null)
        }, 2000)
      }, 15000)
    }
  }

  return (
    <div style={{ position: 'relative', fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: 'white', padding: '1rem' }}>
      <GlobeBackground />
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(17, 25, 40, 0.55)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', backdropFilter: 'blur(16px) saturate(180%)', padding: '2.5rem 2.25rem 2rem', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.45)', width: '100%', maxWidth: 720, border: '1px solid rgba(255,255,255,0.18)' }}>
        {!loggedIn ? (
          <div>
            <h1 style={{ marginBottom: '0.25rem', fontSize: 28, letterSpacing: 0.3 }}>CMLRE Portal Login</h1>
            <p style={{ marginTop: 0, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.65)' }}>Sign in to upload datasets to SAGAR</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'stretch', textAlign: 'left' }}>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                style={{
                  padding: '0.85rem 1rem',
                  width: '100%',
                  display: 'block',
                  boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 12,
                  color: 'white',
                  outline: 'none',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset'
                }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{
                  padding: '0.85rem 1rem',
                  width: '100%',
                  display: 'block',
                  boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 12,
                  color: 'white',
                  outline: 'none',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset'
                }}
              />
              <button 
                onClick={onLogin} 
                style={{ 
                  padding: '0.9rem 1.25rem', 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.9) 0%, rgba(0,255,136,0.9) 100%)',
                  color: '#0b1220',
                  border: '1px solid rgba(255,255,255,0.18)',
                  fontWeight: 700,
                  borderRadius: 12,
                  width: '100%',
                  display: 'block',
                  boxSizing: 'border-box'
                }}
              >
                Login
              </button>
            </div>
            {loginError && <div style={{ marginTop: '1rem', fontWeight: 'bold', color: '#ff6b6b' }}>{loginError}</div>}
            
            {/* Temporary Credentials Display */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: 12,
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 600
              }}>
                Login Credentials:
              </p>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.25rem',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.9)'
              }}>
                <div>Username: <span style={{ color: '#00ff88', fontWeight: 700 }}>admin</span></div>
                <div>Password: <span style={{ color: '#00ff88', fontWeight: 700 }}>admin123</span></div>
              </div>
            </div>
          </div>
        ) : isProcessing ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              border: '4px solid rgba(255,255,255,0.2)', 
              borderTop: '4px solid #00ff88', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem'
            }}></div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: 24, color: '#00ff88' }}>Processing Data</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>Raw data is being processed and stored to data lakehouse...</p>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: 8, 
              padding: '0.5rem 1rem',
              display: 'inline-block'
            }}>
              <div style={{ 
                background: 'linear-gradient(90deg, #00ff88, #00d4ff)', 
                height: 4, 
                borderRadius: 2,
                animation: 'progress 15s linear forwards'
              }}></div>
            </div>
          </div>
        ) : showComplete ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              background: 'linear-gradient(135deg, #00ff88, #00d4ff)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              animation: 'pulse 0.6s ease-in-out'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0b1220" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: 24, color: '#00ff88' }}>Processing Complete!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Data successfully stored to lakehouse</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={onLogout}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '0.5rem 0.9rem',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.85)',
                borderRadius: 12,
                WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                backdropFilter: 'blur(12px) saturate(160%)'
              }}
            >
              Logout
            </button>
            <h1 style={{ marginBottom: '0.5rem', fontSize: 32, letterSpacing: 0.3, textAlign: 'center' }}>Upload Dataset to SAGAR</h1>
            <p style={{ marginTop: 0, marginBottom: '1.25rem', color: 'rgba(255,255,255,0.70)', textAlign: 'center' }}>Choose a file and start ingestion. Processing triggers automatically.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch', justifyContent: 'center', marginBottom: '1rem' }}>
              <div className="w-full max-w-xl mx-auto">
                <SimpleFilePicker onChange={(selected) => setFile(selected)} />
              </div>
              <button 
                onClick={onUpload} 
                style={{ 
                  padding: '1rem 1.1rem', 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.92) 0%, rgba(255,107,53,0.92) 100%)',
                  color: '#0b1220',
                  border: '1px solid rgba(255,255,255,0.18)',
                  fontWeight: 700,
                  borderRadius: 14,
                  width: '100%',
                  height: 56,
                  display: 'block',
                  boxSizing: 'border-box'
                }}
              >
                Upload
              </button>
            </div>
            <div style={{ marginTop: '0.5rem', fontWeight: 'bold', minHeight: 24, color: status.startsWith('Upload failed') ? '#ff6b6b' : '#00ff88', textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>{status}</div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
