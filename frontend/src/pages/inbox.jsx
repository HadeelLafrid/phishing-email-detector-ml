import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const mockEmails = [
  {
    id: 1,
    from: 'service@paypal.com',
    sender: 'P',
    senderColor: '#1a73e8',
    subject: 'Receipt for your payment to TechStore',
    preview: 'Thank you for your purchase at TechStore...',
    time: '10:24 AM',
  },
  {
    id: 2,
    from: 'admin@secure-login.com',
    sender: '!',
    senderColor: '#cc0000',
    subject: 'Urgent: Verify your account now',
    preview: 'Dear user, we detected unusual activity...',
    time: '09:11 AM',
  },
  {
    id: 3,
    from: 'no-reply@amazon.com',
    sender: 'a',
    senderColor: '#ff9900',
    subject: 'Your Amazon order has been shipped',
    preview: 'Hello, your order #123-456789-0123...',
    time: 'May 18',
  },
  {
    id: 4,
    from: 'info@linkedin.com',
    sender: 'in',
    senderColor: '#0077b5',
    subject: 'New sign-in on LinkedIn',
    preview: 'We noticed a new sign-in to your account...',
    time: 'May 17',
  },
  {
    id: 5,
    from: 'security@dropbox.com',
    sender: '❑',
    senderColor: '#0061ff',
    subject: 'Dropbox security alert',
    preview: 'A new device was linked to your account...',
    time: 'May 17',
  },
  {
    id: 6,
    from: 'billing@apple.com',
    sender: '',
    senderColor: '#888',
    subject: 'Your invoice from Apple',
    preview: 'Invoice #APPLE-123456 for your purchase...',
    time: 'May 16',
  },
  {
    id: 7,
    from: 'support@bank-secure.com',
    sender: '!',
    senderColor: '#cc0000',
    subject: 'Action required: Update your details',
    preview: 'Your account will be suspended if you do...',
    time: 'May 16',
  },
]

export default function Inbox() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [search, setSearch] = useState('')
  const [scanning, setScanning] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  // Matrix rain
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = '01アイウエオカキクケコサシスセソ'
    const fontSize = 13
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.85
          ? 'rgba(200,0,0,0.85)'
          : 'rgba(120,0,0,0.3)'
        ctx.font = `${fontSize}px monospace`
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }

    const interval = setInterval(draw, 45)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const filtered = mockEmails.filter(e =>
    e.from.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  )

  const handleScan = (email) => {
  setScanning(prev => ({ ...prev, [email.id]: 'loading' }))
  setTimeout(() => {
    navigate('/scanning', { state: { email } })
  }, 400)
}

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root {
          width: 100%; height: 100%;
          background: #000;
          overflow: hidden;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a0000; border-radius: 4px; }
        .email-row { transition: background 0.15s; }
        .email-row:hover { background: rgba(180,0,0,0.08) !important; }
        .scan-btn {
          transition: all 0.2s;
          cursor: pointer;
        }
        .scan-btn:hover {
          background: rgba(200,0,0,0.25) !important;
          box-shadow: 0 0 14px rgba(200,0,0,0.5) !important;
          transform: scale(1.05);
        }
        .scan-btn:active { transform: scale(0.96); }
        .page-btn:hover { border-color: rgba(200,0,0,0.4) !important; color: #cc0000 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Root */}
      <div style={{
        position: 'fixed', inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Rajdhani', sans-serif",
        color: '#fff',
      }}>

        {/* Matrix canvas - behind everything */}
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 0,
        }} />

        {/* Dark overlay so card is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* Everything above canvas */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>

          {/* ── NAVBAR ── */}
          {/* <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(8,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ width: 20, height: 2, background: '#cc0000' }} />
                <div style={{ width: 20, height: 2, background: '#cc0000' }} />
                <div style={{ width: 20, height: 2, background: '#cc0000' }} />
              </div>
              <h1 style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 18, fontWeight: 900, letterSpacing: 1, margin: 0,
              }}>
                <span style={{ color: '#cc0000', textShadow: '0 0 10px rgba(200,0,0,0.7)' }}>ZEROPHISH </span>
                <span style={{ color: '#fff' }}>IA</span>
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <div style={{
                  position: 'absolute', top: -4, right: -5,
                  background: '#cc0000', color: '#fff',
                  fontSize: 8, fontWeight: 700,
                  width: 14, height: 14, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>3</div>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '1.5px solid #2a2a2a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: 'rgba(20,0,0,0.6)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#888" strokeWidth="1.8"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#888" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div> */}
          <Navbar />

          {/* ── CARD — 5cm margin each side ── */}
          <div style={{
            flex: 1,
            width: '100%',
            /* ~5cm = ~190px each side on a 1920px screen, use px that works on all screens */
            maxWidth: 'calc(100% - 120px)',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'rgba(10,0,0,0.82)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
          }}>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 0' }}>

              {/* INBOX title */}
              <h2 style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 24, fontWeight: 900,
                color: '#cc0000',
                textShadow: '0 0 16px rgba(200,0,0,0.6)',
                letterSpacing: 3,
                marginBottom: 16,
              }}>INBOX</h2>

              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: '10px 16px',
                marginBottom: 18,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search emails..."
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: '#888', fontSize: 15,
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                />
              </div>

              {/* Email list */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filtered.map((email, idx) => {
                  const isScanning = scanning[email.id] === 'loading'
                  const isLast = idx === filtered.length - 1
                  return (
                    <div key={email.id}>
                      <div
                        className="email-row"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '14px 10px',
                          borderRadius: 8,
                          cursor: 'default',
                        }}
                      >
                        {/* Avatar */}
                        <div style={{
                          width: 40, height: 40,
                          borderRadius: '50%',
                          background: email.senderColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 14, color: '#fff',
                          flexShrink: 0, fontFamily: 'monospace',
                          boxShadow: `0 0 8px ${email.senderColor}66`,
                        }}>
                          {email.sender}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 3,
                          }}>
                            <span style={{ fontSize: 13, color: '#d5d2d2' }}>{email.from}</span>
                            <span style={{ fontSize: 12, color: '#c6c4c4', flexShrink: 0, marginLeft: 8 }}>{email.time}</span>
                          </div>
                          <div style={{
                            fontSize: 14, fontWeight: 600, color: '#ddd',
                            marginBottom: 3,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {email.subject}
                          </div>
                          <div style={{
                            fontSize: 12, color: '#555',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {email.preview}
                          </div>
                        </div>

                        {/* SCAN btn */}
                        <button
                          className="scan-btn"
                          onClick={() => handleScan(email)}
                          disabled={isScanning}
                          style={{
                            flexShrink: 0,
                            padding: '7px 14px',
                            borderRadius: 6,
                            border: '1.5px solid rgba(200,0,0,0.5)',
                            background: 'rgba(200,0,0,0.1)',
                            color: '#ff3333',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '1.5px',
                            fontFamily: "'Orbitron', monospace",
                            display: 'flex', alignItems: 'center', gap: 6,
                            minWidth: 70, justifyContent: 'center',
                          }}
                        >
                          {isScanning ? (
                            <div style={{
                              width: 12, height: 12,
                              border: '2px solid rgba(200,0,0,0.2)',
                              borderTop: '2px solid #cc0000',
                              borderRadius: '50%',
                              animation: 'spin 0.7s linear infinite',
                            }} />
                          ) : (
                            <>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="#ff3333" strokeWidth="2.5"/>
                                <path d="M21 21l-4.35-4.35" stroke="#ff3333" strokeWidth="2.5" strokeLinecap="round"/>
                              </svg>
                              SCAN
                            </>
                          )}
                        </button>
                      </div>

                      {/* Divider */}
                      {!isLast && (
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 10px' }} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{ height: 12 }} />
            </div>

            {/* ── PAGINATION ── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(8,0,0,0.6)',
              flexShrink: 0,
            }}>
              <span style={{ color: '#444', fontSize: 13 }}>1 - 7 of 25 emails</span>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {['‹', 1, 2, 3, 4, '›'].map((n, i) => (
                  <button
                    key={i}
                    className="page-btn"
                    onClick={() => typeof n === 'number' && setCurrentPage(n)}
                    style={{
                      width: 30, height: 30, borderRadius: 6,
                      border: n === currentPage ? '1.5px solid #cc0000' : '1px solid #222',
                      background: 'transparent',
                      color: n === currentPage ? '#cc0000' : '#555',
                      fontSize: 13,
                      fontWeight: n === currentPage ? 700 : 400,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: n === currentPage ? '0 0 8px rgba(200,0,0,0.35)' : 'none',
                      fontFamily: "'Rajdhani', sans-serif",
                      transition: 'all 0.15s',
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}