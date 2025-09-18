import React, { useRef, useState } from 'react'

export default function SimpleFilePicker({ onChange }) {
  const inputRef = useRef(null)
  const [selectedName, setSelectedName] = useState('')

  const handleClick = () => inputRef.current?.click()

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null
    setSelectedName(file ? file.name : '')
    onChange && onChange(file)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 12,
      padding: '0.65rem 0.75rem',
      height: 56,
      boxSizing: 'border-box',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      backdropFilter: 'blur(14px) saturate(160%)'
    }}>
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <div style={{
        flex: 1,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        color: 'rgba(255,255,255,0.85)'
      }}>
        {selectedName || 'Choose a file or drag & drop'}
      </div>
      <button onClick={handleClick} style={{
        padding: '0.55rem 0.9rem',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, rgba(0,212,255,0.9) 0%, rgba(0,255,136,0.9) 100%)',
        color: '#0b1220',
        border: '1px solid rgba(255,255,255,0.18)',
        fontWeight: 700,
        borderRadius: 10,
        height: 40
      }}>
        Browse
      </button>
    </div>
  )
}


