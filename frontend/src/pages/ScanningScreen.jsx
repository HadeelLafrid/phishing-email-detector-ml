import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { label: 'Loading Model...', icon: 'cpu' },
  { label: 'Analyzing Patterns...', icon: 'scan' },
  { label: 'Detecting Threats...', icon: 'shield' },
  { label: 'Generating Results...', icon: 'file' },
]

export default function ScanningScreen({ onComplete }) {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const neuralRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [seconds, setSeconds] = useState(60)
  const [dots, setDots] = useState(0)

  // Matrix rain
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const chars = '01アイウエオカキクケコサシスセソタチツ'
    const fontSize = 13
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.85 ? 'rgba(200,0,0,0.9)' : 'rgba(100,0,0,0.25)'
        ctx.font = fontSize + 'px monospace'
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    const interval = setInterval(draw, 45)
    return () => clearInterval(interval)
  }, [])

  // Neural network canvas
  useEffect(() => {
    const canvas = neuralRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const nodes = []
    // Center chip node
    nodes.push({ x: cx, y: cy, r: 28, center: true })
    // Surrounding nodes
    const count = 14
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const dist = 80 + Math.random() * 40
      nodes.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, r: 3 + Math.random() * 3 })
    }
    // Outer nodes
    const outer = 10
    for (let i = 0; i < outer; i++) {
      const angle = (i / outer) * Math.PI * 2 + 0.3
      const dist = 140 + Math.random() * 30
      nodes.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, r: 2 + Math.random() * 2 })
    }

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Draw connections
      nodes.forEach((n, i) => {
        if (n.center) return
        const pulse = Math.sin(frame * 0.04 + i * 0.5) * 0.5 + 0.5
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(n.x, n.y)
        ctx.strokeStyle = `rgba(180,0,0,${0.15 + pulse * 0.35})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Moving dot along line
        const t = (frame * 0.015 + i * 0.1) % 1
        const dx = cx + (n.x - cx) * t
        const dy = cy + (n.y - cy) * t
        ctx.beginPath()
        ctx.arc(dx, dy, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,0,0,${pulse * 0.9})`
        ctx.fill()
      })

      // Outer ring connections
      for (let i = nodes.length - 10; i < nodes.length; i++) {
        const next = nodes[i + 1] || nodes[nodes.length - 10]
        const pulse = Math.sin(frame * 0.03 + i * 0.4) * 0.5 + 0.5
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(next.x, next.y)
        ctx.strokeStyle = `rgba(150,0,0,${0.1 + pulse * 0.2})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // Draw nodes
      nodes.forEach((n, i) => {
        const pulse = Math.sin(frame * 0.05 + i * 0.4) * 0.5 + 0.5
        if (n.center) {
          // Center chip
          ctx.shadowColor = 'rgba(200,0,0,0.8)'
          ctx.shadowBlur = 20
          ctx.fillStyle = 'rgba(120,0,0,0.9)'
          ctx.fillRect(cx - 28, cy - 28, 56, 56)
          ctx.strokeStyle = 'rgba(220,0,0,0.9)'
          ctx.lineWidth = 1.5
          ctx.strokeRect(cx - 28, cy - 28, 56, 56)
          // Chip pins
          for (let p = 0; p < 4; p++) {
            ctx.fillStyle = 'rgba(200,0,0,0.7)'
            ctx.fillRect(cx - 28 + p * 16 + 4, cy - 32, 4, 4)
            ctx.fillRect(cx - 28 + p * 16 + 4, cy + 28, 4, 4)
          }
          // IA text
          ctx.shadowBlur = 0
          ctx.fillStyle = '#fff'
          ctx.font = 'bold 16px "Orbitron", monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('IA', cx, cy)
        } else {
          ctx.shadowColor = 'rgba(200,0,0,0.6)'
          ctx.shadowBlur = 8 * pulse
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,0,0,${0.4 + pulse * 0.5})`
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Rotating outer circle
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(frame * 0.005)
      ctx.beginPath()
      ctx.arc(0, 0, 155, 0, Math.PI * 1.5)
      ctx.strokeStyle = 'rgba(150,0,0,0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 8])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      requestAnimationFrame(animate)
    }
    const rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Progress bar + steps
  useEffect(() => {
    const totalDuration = 4000
    const stepDuration = totalDuration / STEPS.length
    let elapsed = 0
    const tick = 50

    const interval = setInterval(() => {
      elapsed += tick
      const pct = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(pct)

      const step = Math.min(Math.floor(elapsed / stepDuration), STEPS.length - 1)
      setCurrentStep(step)

      const done = []
      for (let i = 0; i < step; i++) done.push(i)
      setCompletedSteps(done)

      if (elapsed >= totalDuration) {
        clearInterval(interval)
        setTimeout(() => {
          if (onComplete) onComplete()
          else navigate('/results')
        }, 400)
      }
    }, tick)
    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 400)
    return () => clearInterval(t)
  }, [])

  const fmt = (s) => `00:${String(s).padStart(2, '0')}:00`

  const StepIcon = ({ type, done, active }) => {
    const color = done ? '#cc0000' : active ? '#ff4444' : '#333'
    const icons = {
      cpu: <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h6m-6 0v18m6-18h4a2 2 0 0 1 2 2v4m0 0H3m18 0v10a2 2 0 0 1-2 2h-4m0 0H9m6 0v-6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>,
      scan: <><circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.5"/><path d="M21 21l-4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M8 11h6M11 8v6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
      shield: <path d="M12 2L4 6v6c0 5 4 9 8 10 4-1 8-5 8-10V6l-8-4z" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>,
      file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="1.5"/><polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="1.5"/></>,
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        {icons[type]}
      </svg>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; background: #000; overflow: hidden; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes scanline {
          0% { top: 0; opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes progress-glow {
          0%,100% { box-shadow: 0 0 8px rgba(200,0,0,0.6), 0 0 20px rgba(200,0,0,0.3); }
          50% { box-shadow: 0 0 16px rgba(220,0,0,1), 0 0 35px rgba(200,0,0,0.6); }
        }
        @keyframes processing-text {
          0%,100% { letter-spacing: 0.3em; opacity:1; }
          50% { letter-spacing: 0.5em; opacity:0.7; }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes corner-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .corner { position:absolute; width:14px; height:14px; border-color: rgba(200,0,0,0.7); border-style:solid; }
        .corner-tl { top:0; left:0; border-width:2px 0 0 2px; }
        .corner-tr { top:0; right:0; border-width:2px 2px 0 0; }
        .corner-bl { bottom:0; left:0; border-width:0 0 2px 2px; }
        .corner-br { bottom:0; right:0; border-width:0 2px 2px 0; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: "'Share Tech Mono', monospace", color: '#cc0000', display: 'flex', overflow: 'hidden' }}>

        {/* Matrix rain */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1, pointerEvents: 'none' }} />

        {/* Scanline effect */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(transparent, rgba(200,0,0,0.15), transparent)',
          zIndex: 5, pointerEvents: 'none',
          animation: 'scanline 4s linear infinite',
        }} />

        {/* MAIN LAYOUT */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', width: '100%', height: '100%' }}>

          {/* ═══ LEFT PANEL ═══ */}
          <div style={{
            width: '42%', height: '100%',
            borderRight: '1px solid rgba(200,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            padding: '24px',
            background: 'rgba(5,0,0,0.5)',
          }}>

            {/* Timer */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: '#880000', marginBottom: 6 }}>TIME</div>
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 44, fontWeight: 900,
                color: '#cc0000',
                textShadow: '0 0 20px rgba(200,0,0,0.8), 0 0 40px rgba(200,0,0,0.4)',
                animation: 'blink 1s ease-in-out infinite',
                letterSpacing: 4,
              }}>
                {fmt(seconds)}
              </div>
            </div>

            {/* Neural network visualization */}
            <div style={{
              position: 'relative',
              border: '1px solid rgba(200,0,0,0.2)',
              borderRadius: 4,
              padding: '12px',
              marginBottom: 24,
              flex: 1,
              background: 'rgba(8,0,0,0.6)',
            }}>
              <div className="corner corner-tl" />
              <div className="corner corner-tr" />
              <div className="corner corner-bl" />
              <div className="corner corner-br" />

              <div style={{ fontSize: 10, letterSpacing: 3, color: '#880000', marginBottom: 10, textAlign: 'center' }}>
                AI MODEL INITIALIZATION
              </div>

              <canvas ref={neuralRef} style={{ width: '100%', height: 'calc(100% - 30px)', display: 'block' }} />
            </div>

            {/* Model status steps */}
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#880000', marginBottom: 12 }}>MODEL STATUS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STEPS.map((step, i) => {
                  const done = completedSteps.includes(i)
                  const active = currentStep === i
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: active ? 'rgba(200,0,0,0.08)' : done ? 'rgba(200,0,0,0.04)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${active ? 'rgba(200,0,0,0.35)' : done ? 'rgba(200,0,0,0.15)' : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: 4,
                      transition: 'all 0.3s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <StepIcon type={step.icon} done={done} active={active} />
                        <span style={{
                          fontSize: 12, letterSpacing: 1,
                          color: done ? '#cc0000' : active ? '#ff4444' : '#333',
                          transition: 'color 0.3s',
                        }}>
                          {step.label}
                        </span>
                      </div>
                      {/* Spinner or check */}
                      {active && (
                        <div style={{
                          width: 14, height: 14,
                          border: '1.5px solid rgba(200,0,0,0.2)',
                          borderTop: '1.5px solid #cc0000',
                          borderRadius: '50%',
                          animation: 'spin-slow 0.8s linear infinite',
                        }} />
                      )}
                      {done && (
                        <div style={{ color: '#cc0000', fontSize: 14 }}>✓</div>
                      )}
                      {!active && !done && (
                        <div style={{
                          width: 14, height: 14,
                          border: '1.5px solid #222',
                          borderTop: '1.5px solid #333',
                          borderRadius: '50%',
                        }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ═══ RIGHT PANEL ═══ */}
          <div style={{
            flex: 1, height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
            padding: '24px',
            position: 'relative',
          }}>

            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: 16, left: 16, width: 20, height: 20, borderTop: '2px solid rgba(200,0,0,0.5)', borderLeft: '2px solid rgba(200,0,0,0.5)' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, width: 20, height: 20, borderTop: '2px solid rgba(200,0,0,0.5)', borderRight: '2px solid rgba(200,0,0,0.5)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, width: 20, height: 20, borderBottom: '2px solid rgba(200,0,0,0.5)', borderLeft: '2px solid rgba(200,0,0,0.5)' }} />
            <div style={{ position: 'absolute', bottom: 16, right: 16, width: 20, height: 20, borderBottom: '2px solid rgba(200,0,0,0.5)', borderRight: '2px solid rgba(200,0,0,0.5)' }} />

            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 22, fontWeight: 900,
                color: '#cc0000',
                letterSpacing: 4,
                textShadow: '0 0 16px rgba(200,0,0,0.7)',
                marginBottom: 6,
              }}>
                ZEROPHISH IA MODEL
              </div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: '#550000' }}>
                AI POWERED PHISHING DETECTION
              </div>
            </div>

            {/* Big neural visual (right side, larger) */}
            <div style={{ position: 'relative', width: '80%', maxWidth: 340, aspectRatio: '1' }}>
              {/* Outer rotating ring */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: '1px solid rgba(150,0,0,0.3)',
                animation: 'spin-slow 12s linear infinite',
              }} />
              <div style={{
                position: 'absolute', inset: '8%',
                borderRadius: '50%',
                border: '1px solid rgba(150,0,0,0.2)',
              }} />
              {/* Neural pattern SVG */}
              <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, opacity: 0.7 }}>
                {/* Branch lines */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const angle = (i / 20) * Math.PI * 2
                  const x1 = 150, y1 = 150
                  const x2 = 150 + Math.cos(angle) * 110
                  const y2 = 150 + Math.sin(angle) * 110
                  const mx = 150 + Math.cos(angle + 0.3) * 60
                  const my = 150 + Math.sin(angle + 0.3) * 60
                  return (
                    <g key={i}>
                      <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                        stroke="rgba(160,0,0,0.4)" strokeWidth="0.8" fill="none"/>
                      <circle cx={x2} cy={y2} r="3" fill="rgba(180,0,0,0.6)"/>
                    </g>
                  )
                })}
                {/* Center chip */}
                <rect x="122" y="122" width="56" height="56" rx="4" fill="rgba(100,0,0,0.9)" stroke="rgba(200,0,0,0.8)" strokeWidth="1.5"/>
                {/* Chip pins */}
                {[0,1,2].map(p => (
                  <g key={p}>
                    <rect x={130 + p * 16} y="118" width="5" height="5" fill="rgba(180,0,0,0.7)"/>
                    <rect x={130 + p * 16} y="177" width="5" height="5" fill="rgba(180,0,0,0.7)"/>
                    <rect x="118" y={130 + p * 16} width="5" height="5" fill="rgba(180,0,0,0.7)"/>
                    <rect x="177" y={130 + p * 16} width="5" height="5" fill="rgba(180,0,0,0.7)"/>
                  </g>
                ))}
                <text x="150" y="155" textAnchor="middle" fill="white" style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 900 }}>IA</text>
              </svg>
            </div>

            {/* Processing modal */}
            <div style={{
              width: '90%', maxWidth: 500,
              border: '1.5px solid rgba(200,0,0,0.6)',
              borderRadius: 4,
              background: 'rgba(4,0,0,0.92)',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(200,0,0,0.2), inset 0 0 30px rgba(200,0,0,0.05)',
            }}>
              {/* Modal header */}
              <div style={{
                background: 'rgba(120,0,0,0.5)',
                borderBottom: '1px solid rgba(200,0,0,0.4)',
                padding: '8px 16px',
                textAlign: 'center',
                fontSize: 11, letterSpacing: 3, color: '#ff4444',
              }}>
                IA MODEL PROCESSING
              </div>

              <div style={{ padding: '24px 24px 20px' }}>
                {/* PROCESSING text */}
                <div style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 26, fontWeight: 900,
                  color: '#cc0000',
                  textAlign: 'center',
                  marginBottom: 20,
                  textShadow: '0 0 20px rgba(200,0,0,0.8)',
                  animation: 'processing-text 1.5s ease-in-out infinite',
                  letterSpacing: '0.3em',
                }}>
                  PROCESSING{'.'.repeat(dots)}
                </div>

                {/* Progress bar */}
                <div style={{
                  height: 20,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,0,0,0.35)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  marginBottom: 14,
                  position: 'relative',
                }}>
                  <div style={{
                    height: '100%',
                    width: progress + '%',
                    background: 'linear-gradient(90deg, #7a0000, #cc0000)',
                    borderRadius: 2,
                    transition: 'width 0.1s linear',
                    animation: 'progress-glow 1.5s ease-in-out infinite',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Shine sweep */}
                    <div style={{
                      position: 'absolute', top: 0, right: 0,
                      width: 30, height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,100,100,0.4))',
                    }} />
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 13, color: '#666', letterSpacing: 1,
                }}>
                  Please wait while our IA model analyzes the email...
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ fontSize: 10, letterSpacing: 3, color: '#440000', alignSelf: 'flex-end' }}>
              POWERED BY ADVANCED IA
            </div>

          </div>
        </div>
      </div>
    </>
  )
}