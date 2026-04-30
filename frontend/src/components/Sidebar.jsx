import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8"/>
          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Inbox',
      path: '/inbox',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Scan History',
      path: '/history',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Profile',
      path: '/profile',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Logout',
      path: '/login',
      danger: true,
    },
  ]

  const go = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;600&display=swap');
        @keyframes slide-in  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slide-out { from { transform: translateX(0); }    to { transform: translateX(-100%); } }
        @keyframes fade-in   { from { opacity: 0; } to { opacity: 1; } }
        .sidebar-drawer {
          animation: ${isOpen ? 'slide-in' : 'slide-out'} 0.28s cubic-bezier(.4,0,.2,1) forwards;
        }
        .nav-item { transition: all 0.18s ease; cursor: pointer; }
        .nav-item:hover { background: rgba(200,0,0,0.1) !important; color: #ff4444 !important; }
        .nav-item:hover svg { color: #ff4444 !important; }
      `}</style>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 100,
            animation: 'fade-in 0.25s ease',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div
        className="sidebar-drawer"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 260,
          height: '100vh',
          background: 'rgba(6,0,0,0.97)',
          borderRight: '1px solid rgba(200,0,0,0.2)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Rajdhani', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(200,0,0,0.15)',
        }}>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 15, fontWeight: 900, margin: 0,
          }}>
            <span style={{ color: '#cc0000', textShadow: '0 0 10px rgba(200,0,0,0.6)' }}>ZEROPHISH </span>
            <span style={{ color: '#fff' }}>IA</span>
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#555', padding: 4, display: 'flex', alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#cc0000'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const isDanger = item.danger
            return (
              <div
                key={item.path}
                className="nav-item"
                onClick={() => go(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px',
                  borderRadius: 8,
                  color: isDanger ? '#663333' : isActive ? '#ff4444' : '#888',
                  background: isActive ? 'rgba(200,0,0,0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #cc0000' : '3px solid transparent',
                  marginTop: isDanger ? 'auto' : 0,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                <span style={{ color: 'inherit', display: 'flex' }}>{item.icon}</span>
                {item.label}
              </div>
            )
          })}
        </nav>

        {/* Version footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(200,0,0,0.1)',
          fontSize: 11,
          color: '#2a2a2a',
          letterSpacing: 1,
          fontFamily: "'Orbitron', monospace",
        }}>
          v1.0.0 · ZEROPHISH IA
        </div>
      </div>
    </>
  )
}