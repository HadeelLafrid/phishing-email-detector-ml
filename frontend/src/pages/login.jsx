import { useEffect, useRef } from 'react'

export default function Login() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = '01アイウエオカキクケコサシスセソ'
    const fontSize = 14
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const bright = Math.random() > 0.85
        ctx.fillStyle = bright ? 'rgba(210, 0, 0, 0.95)' : 'rgba(120, 0, 0, 0.35)'
        ctx.font = `${fontSize}px monospace`
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 45)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Barlow+Condensed:wght@400;600&display=swap');
        html, body, #root {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          background: #000;
          overflow: hidden;
        }
        .login-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 40px rgba(220,0,0,0.9), inset 0 0 30px rgba(220,0,0,0.25) !important;
        }
      `}</style>

      {/* Full screen fixed container */}
      <div style={{
        position: 'fixed', inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}>

        {/* Matrix rain canvas - behind everything */}
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 0,
        }} />

        {/* Dark center overlay to make content readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 80% at 50% 40%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* Red spotlight glow behind silhouette */}
        <div style={{
          position: 'absolute',
          top: '-5%', left: '50%',
          transform: 'translateX(-50%)',
          width: '420px', height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(140,0,0,0.6) 0%, rgba(80,0,0,0.25) 45%, transparent 72%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Silhouette + crosshair centered */}
        <div style={{
          position: 'absolute',
          top: '0', left: '50%',
          transform: 'translateX(-50%)',
          width: '340px', height: '340px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3,
        }}>
          {/* Outer circle */}
          <div style={{
            position: 'absolute',
            width: '310px', height: '310px',
            borderRadius: '50%',
            border: '1.5px solid rgba(180,0,0,0.5)',
            animation: 'pulse 3s ease-in-out infinite',
          }} />

          {/* Inner circle */}
          <div style={{
            position: 'absolute',
            width: '220px', height: '220px',
            borderRadius: '50%',
            border: '1px solid rgba(160,0,0,0.3)',
          }} />

          {/* Crosshair lines - top */}
          <div style={{ position:'absolute', top:'-2px', left:'50%', width:'1.5px', height:'44px', background:'rgba(200,0,0,0.7)' }} />
          {/* bottom */}
          <div style={{ position:'absolute', bottom:'-2px', left:'50%', width:'1.5px', height:'44px', background:'rgba(200,0,0,0.7)' }} />
          {/* left */}
          <div style={{ position:'absolute', left:'-2px', top:'50%', height:'1.5px', width:'44px', background:'rgba(200,0,0,0.7)' }} />
          {/* right */}
          <div style={{ position:'absolute', right:'-2px', top:'50%', height:'1.5px', width:'44px', background:'rgba(200,0,0,0.7)' }} />

          {/* Hood shape */}
          <div style={{
            position: 'absolute',
            top: '18px',
            width: '170px', height: '135px',
            borderRadius: '55% 55% 0 0',
            background: 'rgba(4,0,0,0.94)',
            border: '1px solid rgba(110,0,0,0.5)',
            boxShadow: '0 0 40px rgba(160,0,0,0.4)',
            zIndex: 4,
          }} />

          {/* Head */}
          <div style={{
            position: 'absolute',
            top: '52px',
            width: '76px', height: '90px',
            borderRadius: '50% 50% 44% 44%',
            background: 'rgba(6,0,0,0.97)',
            border: '1px solid rgba(100,0,0,0.4)',
            boxShadow: '0 0 24px rgba(150,0,0,0.45)',
            zIndex: 5,
          }} />

          {/* Shoulders / body */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            width: '230px', height: '135px',
            borderRadius: '38% 38% 0 0',
            background: 'rgba(4,0,0,0.93)',
            border: '1px solid rgba(90,0,0,0.35)',
            boxShadow: '0 0 24px rgba(120,0,0,0.3)',
            zIndex: 4,
          }} />
        </div>

        {/* Main content - sits below silhouette */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          marginTop: '310px',
          width: '100%',
          maxWidth: '460px',
          padding: '0 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>

          {/* Logo - LEFT aligned like the design */}
          <div style={{ marginBottom: '10px' }}>
            <h1 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(34px, 6vw, 48px)',
              fontWeight: 900,
              letterSpacing: '2px',
              lineHeight: 1,
              margin: 0,
            }}>
              <span style={{
                color: '#CC0000',
                textShadow: '0 0 18px rgba(220,0,0,1), 0 0 40px rgba(200,0,0,0.55)',
              }}>ZEROPHISH </span>
              <span style={{
                color: '#FFFFFF',
                textShadow: '0 0 12px rgba(255,255,255,0.3)',
              }}>IA</span>
            </h1>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: '#666',
              fontSize: '12px',
              letterSpacing: '3.5px',
              marginTop: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              AI Powered Phishing Detection
            </p>
          </div>

          {/* Spacer */}
          <div style={{ height: '48px' }} />

          {/* Login Button - full width */}
          <button
            className="login-btn"
            onClick={() => window.location.href = '/inbox'}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              padding: '20px 28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7a0000 0%, #c80000 50%, #7a0000 100%)',
              border: '1.5px solid rgba(220,0,0,0.6)',
              boxShadow: '0 0 28px rgba(200,0,0,0.65), inset 0 0 20px rgba(200,0,0,0.18)',
              color: '#fff',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
            {/* Envelope icon */}
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
              <rect x="1" y="1" width="20" height="16" rx="2" stroke="white" strokeWidth="1.8"/>
              <path d="M1 4L11 11L21 4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Log In With Email
          </button>

          <p style={{
            color: '#444',
            fontSize: '13px',
            marginTop: '18px',
            letterSpacing: '0.4px',
            width: '100%',
            textAlign: 'center',
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>
            We never share your data with anyone.
          </p>
        </div>

        {/* Bottom scatter glow */}
        <div style={{
          position: 'absolute',
          bottom: '80px', left: '50%',
          transform: 'translateX(-50%)',
          width: '280px', height: '60px',
          background: 'radial-gradient(ellipse, rgba(110,0,0,0.4) 0%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Footer */}
        <p style={{
          position: 'absolute',
          bottom: '18px',
          color: '#333',
          fontSize: '11.5px',
          zIndex: 10,
          letterSpacing: '0.5px',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>
          © 2026 Zerophish IA. All rights reserved.
        </p>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.025); }
        }
      `}</style>
    </>
  )
}