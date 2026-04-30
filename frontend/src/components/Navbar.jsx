import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Navbar() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;600&display=swap');
      `}</style>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(8,0,0,0.88)',
        backdropFilter: 'blur(6px)',
        flexShrink: 0,
        fontFamily: "'Rajdhani', sans-serif",
        position: 'relative',
        zIndex: 10,
      }}>

        {/* Left: Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            <div style={{ width: 20, height: 2, background: '#cc0000', borderRadius: 2 }} />
            <div style={{ width: 20, height: 2, background: '#cc0000', borderRadius: 2 }} />
            <div style={{ width: 20, height: 2, background: '#cc0000', borderRadius: 2 }} />
          </button>
          <h1
            onClick={() => navigate('/inbox')}
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 18, fontWeight: 900, letterSpacing: 1, margin: 0, cursor: 'pointer',
            }}
          >
            <span style={{ color: '#cc0000', textShadow: '0 0 10px rgba(200,0,0,0.6)' }}>ZEROPHISH </span>
            <span style={{ color: '#fff' }}>IA</span>
          </h1>
        </div>

        {/* Right: Bell + User */}
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

          {/* User icon → Profile */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              border: '1.5px solid rgba(200,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: 'rgba(200,0,0,0.08)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#cc0000'; e.currentTarget.style.background = 'rgba(200,0,0,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,0,0,0.4)'; e.currentTarget.style.background = 'rgba(200,0,0,0.08)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#cc0000" strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#cc0000" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}