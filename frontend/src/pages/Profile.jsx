import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const mockUser = {
  name: 'Hadil Bensalem',
  email: 'hadil@example.com',
  joined: 'January 2024',
  totalScans: 47,
  phishingFound: 12,
  safeEmails: 35,
  lastScan: '2 hours ago',
}

const mockHistory = [
  { id: 1, from: 'admin@secure-login.com',   subject: 'Urgent: Verify your account now',       date: 'May 18, 2024', result: 'PHISHING', score: 92 },
  { id: 2, from: 'support@bank-secure.com',  subject: 'Action required: Update your details',  date: 'May 16, 2024', result: 'PHISHING', score: 88 },
  { id: 3, from: 'service@paypal.com',        subject: 'Receipt for your payment to TechStore', date: 'May 18, 2024', result: 'SAFE',     score: 4  },
  { id: 4, from: 'no-reply@amazon.com',       subject: 'Your Amazon order has been shipped',    date: 'May 18, 2024', result: 'SAFE',     score: 6  },
  { id: 5, from: 'info@linkedin.com',         subject: 'New sign-in on LinkedIn',               date: 'May 17, 2024', result: 'SAFE',     score: 8  },
  { id: 6, from: 'security@dropbox.com',      subject: 'Dropbox security alert',                date: 'May 17, 2024', result: 'SAFE',     score: 11 },
]

export default function Profile() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const chars = '01アイウエオカキクケコ'
    const fontSize = 13
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.85 ? 'rgba(200,0,0,0.85)' : 'rgba(100,0,0,0.25)'
        ctx.font = fontSize + 'px monospace'
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    const interval = setInterval(draw, 45)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; background: #000; overflow: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a0000; border-radius: 4px; }
        .history-row { transition: background 0.15s; cursor: pointer; }
        .history-row:hover { background: rgba(200,0,0,0.07) !important; }
        .logout-btn:hover { background: rgba(200,0,0,0.2) !important; border-color: #cc0000 !important; color: #ff4444 !important; }
        .stat-card:hover { border-color: rgba(200,0,0,0.4) !important; }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Rajdhani', sans-serif",
        color: '#fff',
      }}>
        {/* Matrix */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Navbar */}
          <Navbar />

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* ── Profile card ── */}
              <div style={{
                background: 'rgba(10,0,0,0.85)',
                border: '1px solid rgba(200,0,0,0.2)',
                borderRadius: 14,
                padding: '28px 28px',
                display: 'flex', alignItems: 'center', gap: 28,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 84, height: 84, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(200,0,0,0.15)',
                  border: '2px solid rgba(200,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(200,0,0,0.3)',
                }}>
                  <span style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 26, fontWeight: 900, color: '#cc0000',
                    textShadow: '0 0 12px rgba(200,0,0,0.8)',
                  }}>
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 20, fontWeight: 900, color: '#fff',
                    marginBottom: 6, letterSpacing: 1,
                  }}>{mockUser.name}</h2>
                  <p style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>{mockUser.email}</p>
                  <p style={{ color: '#444', fontSize: 12, letterSpacing: 1 }}>
                    Member since {mockUser.joined} · Last scan: {mockUser.lastScan}
                  </p>
                </div>

                {/* Logout */}
                <button
                  className="logout-btn"
                  onClick={() => navigate('/login')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 8,
                    background: 'rgba(200,0,0,0.08)',
                    border: '1.5px solid rgba(200,0,0,0.3)',
                    color: '#883333', fontSize: 13, fontWeight: 600,
                    letterSpacing: 1.5, cursor: 'pointer',
                    fontFamily: "'Orbitron', monospace",
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  LOGOUT
                </button>
              </div>

              {/* ── Stats row ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { label: 'Total Scanned', value: mockUser.totalScans, color: '#fff' },
                  { label: 'Phishing Found', value: mockUser.phishingFound, color: '#cc0000' },
                  { label: 'Safe Emails', value: mockUser.safeEmails, color: '#22aa55' },
                ].map((s, i) => (
                  <div key={i} className="stat-card" style={{
                    background: 'rgba(10,0,0,0.85)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '20px 22px',
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ fontSize: 12, color: '#555', letterSpacing: 2, marginBottom: 10, fontFamily: "'Orbitron', monospace" }}>
                      {s.label.toUpperCase()}
                    </div>
                    <div style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: 36, fontWeight: 900, color: s.color,
                      textShadow: s.color !== '#fff' ? `0 0 16px ${s.color}88` : 'none',
                    }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* ── Scan History ── */}
              <div style={{
                background: 'rgba(10,0,0,0.85)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 22px',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <h3 style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 13, fontWeight: 700, color: '#cc0000',
                    letterSpacing: 2,
                    textShadow: '0 0 10px rgba(200,0,0,0.5)',
                  }}>SCAN HISTORY</h3>
                  <span style={{ color: '#444', fontSize: 12 }}>{mockHistory.length} scans</span>
                </div>

                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto auto',
                  gap: 12,
                  padding: '10px 22px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  fontSize: 11, color: '#444', letterSpacing: 2,
                  fontFamily: "'Orbitron', monospace",
                }}>
                  <span>SENDER</span>
                  <span>SUBJECT</span>
                  <span>DATE</span>
                  <span>RESULT</span>
                </div>

                {/* Rows */}
                {mockHistory.map((item, idx) => (
                  <div key={item.id}>
                    <div
                      className="history-row"
                      onClick={() => navigate('/results', { state: { email: item } })}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr auto auto',
                        gap: 12, alignItems: 'center',
                        padding: '14px 22px',
                        background: 'transparent',
                      }}
                    >
                      <span style={{ fontSize: 13, color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.from}
                      </span>
                      <span style={{ fontSize: 13, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.subject}
                      </span>
                      <span style={{ fontSize: 12, color: '#555', whiteSpace: 'nowrap' }}>{item.date}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1,
                        padding: '4px 10px', borderRadius: 5,
                        fontFamily: "'Orbitron', monospace",
                        background: item.result === 'PHISHING' ? 'rgba(200,0,0,0.15)' : 'rgba(30,160,70,0.12)',
                        border: `1px solid ${item.result === 'PHISHING' ? 'rgba(200,0,0,0.4)' : 'rgba(30,160,70,0.3)'}`,
                        color: item.result === 'PHISHING' ? '#ff4444' : '#33cc66',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.result}
                      </span>
                    </div>
                    {idx < mockHistory.length - 1 && (
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '0 22px' }} />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ height: 20 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}