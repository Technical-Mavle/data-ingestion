import React, { useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [status, setStatus] = useState('')
  const [file, setFile] = useState(null)

  const onLogin = () => {
    if (username === expectedUsername && password === expectedPassword) {
      setLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password.')
    }
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
      setStatus(`Successfully uploaded ${file.name}! Processing will start automatically.`)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f9' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', width: 480 }}>
        {!loggedIn ? (
          <div>
            <h1>CMLRE Portal Login</h1>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '1rem', padding: '0.5rem', width: '80%' }} />
            <br />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '1rem', padding: '0.5rem', width: '80%' }} />
            <br />
            <button onClick={onLogin} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Login</button>
            {loginError && <div style={{ marginTop: '1rem', fontWeight: 'bold', color: 'red' }}>{loginError}</div>}
          </div>
        ) : (
          <div>
            <h1>Upload Dataset to SAGAR</h1>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={{ marginBottom: '1rem' }} />
            <button onClick={onUpload} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Upload</button>
            <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>{status}</div>
          </div>
        )}
      </div>
    </div>
  )
}
