import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const defaultEmail = {
  from: 'admin@secure-login.com',
  to: 'user@example.com',
  subject: 'Urgent: Verify your account now',
  date: 'May 18, 2024 09:11 AM',
  headers: `Return-Path: <admin@secure-login.com>
Received: from mail.secure-login.com (188.166.XX.XXX)
      by mx.example.com with ESMTPS id ab12345
      for <user@example.com>; Sat, 18 May 2024 09:11:03 +0000
Subject: Urgent: Verify your account now
From: admin@secure-login.com
To: user@example.com
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8`,
  links: [
    { url: 'http://secure-login.com/verify-account', status: 'Suspicious' },
    { url: 'http://secure-login.com/', status: 'Suspicious' },
  ],
  body: `Dear user,

We detected unusual activity in your account.
Please verify your account by clicking the link below:

http://secure-login.com/verify-account

If you do not verify within 24 hours, your account will be suspended.

Thank you,
Secure Login Team`,
  suspicious: [
    'verify your account',
    'unusual activity',
    'suspended',
    'secure-login.com',
    '24 hours',
  ],
}

const result = {
  label: 'PHISHING',
  score: 92,
  reasons: [
    'Suspicious domain detected',
    'Urgent language used',
    'Link redirects to suspicious site',
    'Domain recently registered',
    'No SPF record found',
  ],
}

const NAV_ITEMS = ['Headers', 'Links', 'Body', 'Suspicious']

export default function Results() {
  const navigate = useNavigate()
  const location = useLocation()
  const canvasRef = useRef(null)
  const [activeTab, setActiveTab] = useState('Headers')
  const [showAllHeaders, setShowAllHeaders] = useState(false)

  const email = location.state?.email || defaultEmail

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (result.score / 100) * circumference

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const chars = '01アイウエオカキクケコ'
    const fontSize = 13
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.85 ? 'rgba(200,0,0,0.85)' : 'rgba(120,0,0,0.28)'
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; background: #000; overflow: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a0000; border-radius: 4px; }
        .nav-tab:hover { background: rgba(200,0,0,0.1) !important; color: #ff4444 !important; }
        .back-btn:hover { color: #ff4444 !important; }
        @keyframes pulse-skull {
          0%,100% { filter: drop-shadow(0 0 10px rgba(200,0,0,0.6)); }
          50% { filter: drop-shadow(0 0 24px rgba(200,0,0,1)); }
        }
        .score-ring {
          stroke-dasharray: ${circumference};
          stroke-dashoffset: ${circumference};
          animation: draw-circle 1.4s ease forwards;
          animation-delay: 0.3s;
        }
        @keyframes draw-circle {
          to { stroke-dashoffset: ${offset}; }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: "'Rajdhani', sans-serif", color: '#fff', display: 'flex', flexDirection: 'column' }}>

        {/* Matrix canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* TOP BAR */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '13px 24px',
            background: 'rgba(8,0,0,0.88)',
            backdropFilter: 'blur(6px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
          }}>
            <button className="back-btn" onClick={() => navigate('/inbox')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', color: '#888',
              fontSize: 13, fontWeight: 600, letterSpacing: 1.5,
              fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer', transition: 'color 0.2s',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              BACK TO INBOX
            </button>

            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #7a0000, #cc0000)',
              border: '1.5px solid rgba(220,0,0,0.6)',
              borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 700,
              letterSpacing: 2, fontFamily: "'Orbitron', monospace", cursor: 'pointer',
              boxShadow: '0 0 18px rgba(200,0,0,0.5)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="1.8"/>
                <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="1.8"/>
                <line x1="9" y1="13" x2="15" y2="13" stroke="white" strokeWidth="1.8"/>
              </svg>
              ANALYSE EMAIL
            </button>
          </div>

          {/* MAIN */}
          <div style={{ flex: 1, display: 'flex', gap: 14, overflow: 'hidden', padding: 16 }}>

            {/* LEFT COLUMN */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>

              {/* Email Overview */}
              <div style={{
                background: 'rgba(12,2,2,0.88)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '16px 18px', flexShrink: 0,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#cc0000', letterSpacing: 2, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>EMAIL OVERVIEW</div>
                {[
                  ['FROM:', email.from || defaultEmail.from],
                  ['TO:', email.to || defaultEmail.to],
                  ['SUBJECT:', email.subject || defaultEmail.subject],
                  ['DATE:', email.date || defaultEmail.date],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, letterSpacing: 1, minWidth: 68, fontFamily: "'Orbitron', monospace" }}>{label}</span>
                    <span style={{ color: '#bbb', fontSize: 13, flex: 1 }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar nav + tab content */}
              <div style={{
                flex: 1, display: 'flex',
                background: 'rgba(12,2,2,0.88)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, overflow: 'hidden',
              }}>

                {/* Left nav tabs */}
                <div style={{
                  width: 110, flexShrink: 0,
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', flexDirection: 'column',
                  paddingTop: 12,
                }}>
                  {NAV_ITEMS.map(tab => (
                    <button key={tab} className="nav-tab" onClick={() => setActiveTab(tab)} style={{
                      background: activeTab === tab ? 'rgba(200,0,0,0.15)' : 'transparent',
                      border: 'none',
                      borderLeft: activeTab === tab ? '3px solid #cc0000' : '3px solid transparent',
                      color: activeTab === tab ? '#ff4444' : '#555',
                      fontSize: 13, fontWeight: 600, letterSpacing: 1,
                      padding: '13px 14px', textAlign: 'left',
                      fontFamily: "'Rajdhani', sans-serif", cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

                  {activeTab === 'Headers' && (
                    <div>
                      <div style={{ fontSize: 11, color: '#cc0000', fontWeight: 700, letterSpacing: 2, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>HEADERS</div>
                      <pre style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#777', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {showAllHeaders ? defaultEmail.headers : defaultEmail.headers.split('\n').slice(0, 5).join('\n')}
                      </pre>
                      <button onClick={() => setShowAllHeaders(p => !p)} style={{
                        background: 'none', border: 'none', color: '#cc0000',
                        fontSize: 13, cursor: 'pointer', marginTop: 8,
                        fontFamily: "'Rajdhani', sans-serif",
                      }}>
                        {showAllHeaders ? 'Show less' : 'Show more'}
                      </button>
                    </div>
                  )}

                  {activeTab === 'Links' && (
                    <div>
                      <div style={{ fontSize: 11, color: '#cc0000', fontWeight: 700, letterSpacing: 2, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>
                        LINKS FOUND ({defaultEmail.links.length})
                      </div>
                      {defaultEmail.links.map((link, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 6, padding: '10px 14px', marginBottom: 8,
                        }}>
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#777', wordBreak: 'break-all', flex: 1 }}>{link.url}</span>
                          <span style={{ color: '#ff4444', fontSize: 12, fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>⚠ {link.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Body' && (
                    <div>
                      <div style={{ fontSize: 11, color: '#cc0000', fontWeight: 700, letterSpacing: 2, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>EMAIL BODY (PREVIEW)</div>
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 6, padding: '14px 16px',
                        fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#888',
                        lineHeight: 1.9, whiteSpace: 'pre-wrap',
                      }}>
                        {defaultEmail.body.split('http://secure-login.com/verify-account').map((part, i, arr) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && <span style={{ color: '#cc0000' }}>http://secure-login.com/verify-account</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'Suspicious' && (
                    <div>
                      <div style={{ fontSize: 11, color: '#cc0000', fontWeight: 700, letterSpacing: 2, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>SUSPICIOUS WORDS</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                        {defaultEmail.suspicious.map((word, i) => (
                          <div key={i} style={{
                            padding: '6px 14px',
                            background: 'rgba(200,0,0,0.12)', border: '1px solid rgba(200,0,0,0.4)',
                            borderRadius: 20, color: '#ff4444', fontSize: 13, fontWeight: 600,
                          }}>
                            ⚠ {word}
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '12px 14px', background: 'rgba(200,0,0,0.07)', borderRadius: 8, border: '1px solid rgba(200,0,0,0.2)' }}>
                        <div style={{ color: '#cc0000', fontSize: 11, fontWeight: 700, marginBottom: 6, fontFamily: "'Orbitron', monospace" }}>WHY SUSPICIOUS:</div>
                        <div style={{ color: '#777', fontSize: 13, lineHeight: 1.7 }}>
                          These words are commonly used in phishing emails to create urgency and trick users into acting without thinking.
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ width: 270, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

              {/* Analysis Result */}
              <div style={{ background: 'rgba(12,2,2,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#cc0000', letterSpacing: 2, marginBottom: 14, fontFamily: "'Orbitron', monospace" }}>ANALYSIS RESULT</div>

                {/* Skull */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {[120, 92, 64].map((s, i) => (
                      <div key={i} style={{ position: 'absolute', width: s, height: s, borderRadius: '50%', border: `1px solid rgba(200,0,0,${0.45 - i * 0.1})` }} />
                    ))}
                    <div style={{ position: 'absolute', width: 1, height: '100%', background: 'rgba(200,0,0,0.2)' }} />
                    <div style={{ position: 'absolute', height: 1, width: '100%', background: 'rgba(200,0,0,0.2)' }} />
                    <svg width="54" height="54" viewBox="0 0 100 100" style={{ animation: 'pulse-skull 2.5s ease-in-out infinite', zIndex: 2 }}>
                      <ellipse cx="50" cy="42" rx="32" ry="30" fill="#cc0000"/>
                      <rect x="28" y="60" width="44" height="18" rx="4" fill="#cc0000"/>
                      <rect x="34" y="64" width="10" height="10" rx="2" fill="#0a0000"/>
                      <rect x="56" y="64" width="10" height="10" rx="2" fill="#0a0000"/>
                      <rect x="44" y="64" width="6" height="14" rx="1" fill="#0a0000"/>
                      <ellipse cx="38" cy="40" rx="10" ry="11" fill="#0a0000"/>
                      <ellipse cx="62" cy="40" rx="10" ry="11" fill="#0a0000"/>
                    </svg>
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: '#cc0000', textShadow: '0 0 20px rgba(200,0,0,0.8)', marginBottom: 12 }}>
                  {result.label}
                </div>

                <div style={{ color: '#777', fontSize: 13, marginBottom: 6 }}>Risk Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 900, color: '#fff' }}>
                    {result.score}<span style={{ fontSize: 13, color: '#444' }}>/100</span>
                  </span>
                  <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
                    {[...Array(7)].map((_, i) => (
                      <div key={i} style={{ width: 5, height: 6 + i * 3, borderRadius: 2, background: i < 6 ? '#cc0000' : 'rgba(200,0,0,0.2)', boxShadow: i < 6 ? '0 0 4px rgba(200,0,0,0.5)' : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div style={{ background: 'rgba(12,2,2,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#cc0000', letterSpacing: 2, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>REASONS</div>
                {result.reasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#cc0000', flexShrink: 0, marginTop: 7, boxShadow: '0 0 5px rgba(200,0,0,0.8)' }} />
                    <span style={{ color: '#bbb', fontSize: 13, lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>

              {/* Confidence Score */}
              <div style={{ background: 'rgba(12,2,2,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#cc0000', letterSpacing: 2, marginBottom: 14, fontFamily: "'Orbitron', monospace", alignSelf: 'flex-start' }}>CONFIDENCE SCORE</div>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(200,0,0,0.12)" strokeWidth="10"/>
                  <circle cx="65" cy="65" r={radius} fill="none" stroke="#cc0000" strokeWidth="10"
                    strokeLinecap="round" className="score-ring"
                    transform="rotate(-90 65 65)"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(200,0,0,0.8))' }}
                  />
                  <text x="65" y="60" textAnchor="middle" fill="#fff" style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 900 }}>{result.score}%</text>
                  <text x="65" y="78" textAnchor="middle" fill="#555" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11 }}>confidence</text>
                </svg>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}