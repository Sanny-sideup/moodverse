import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMood } from '../../context/MoodContext'

const BALL_EMOJIS = ['🎱', '💫', '🌀', '⚽', '🎾']

export default function BouncingBall() {
  const { moodConfig } = useMood()
  const containerRef = useRef(null)
  const ballRef = useRef({
    x: 150, y: 150,
    vx: 2.5, vy: 2,
    emoji: null,
    glowing: false,
    speed: 1,
  })
  const [ballState, setBallState] = useState({ x: 150, y: 150, emoji: null, glowing: false })
  const [trail, setTrail] = useState([])
  const [velocity, setVelocity] = useState(0)
  const rafRef = useRef(null)
  const trailTimerRef = useRef(null)

  const BALL_SIZE = 52

  const reset = useCallback(() => {
    const b = ballRef.current
    b.x = 150; b.y = 150
    b.vx = 2.5; b.vy = 2
    b.speed = 1; b.emoji = null; b.glowing = false
    setTrail([])
  }, [])

  useEffect(() => {
    const B = ballRef.current

    const tick = () => {
      const container = containerRef.current
      if (!container) { rafRef.current = requestAnimationFrame(tick); return }
      const { width, height } = container.getBoundingClientRect()
      const maxX = width - BALL_SIZE
      const maxY = height - BALL_SIZE

      B.speed = Math.min(B.speed + 0.0002, 2.5)
      B.x += B.vx * B.speed
      B.y += B.vy * B.speed

      if (B.x <= 0) { B.x = 0; B.vx = Math.abs(B.vx) }
      if (B.x >= maxX) { B.x = maxX; B.vx = -Math.abs(B.vx) }
      if (B.y <= 0) { B.y = 0; B.vy = Math.abs(B.vy) }
      if (B.y >= maxY) { B.y = maxY; B.vy = -Math.abs(B.vy) }

      const vel = Math.round(Math.sqrt(B.vx ** 2 + B.vy ** 2) * B.speed * 10) / 10

      setBallState({ x: B.x, y: B.y, emoji: B.emoji, glowing: B.glowing })
      setVelocity(vel)

      setTrail(prev => [
        { x: B.x, y: B.y, id: Date.now() + Math.random() },
        ...prev.slice(0, 5),
      ])

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleBallClick = () => {
    const B = ballRef.current
    const sign = (v) => (v < 0 ? -1 : 1)
    B.vx = sign(B.vx) * (Math.random() * 4 + 3)
    B.vy = sign(B.vy) * (Math.random() * 4 + 3)
    B.emoji = BALL_EMOJIS[Math.floor(Math.random() * BALL_EMOJIS.length)]
    B.glowing = true
    setTimeout(() => { B.emoji = null; B.glowing = false }, 2000)
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs" style={{ color: moodConfig.textSecondary }}>
          vel: {velocity}
        </span>
        <button
          id="bounce-reset-btn"
          onClick={reset}
          className="font-mono text-xs px-3 py-1 rounded-full glass"
          style={{ color: moodConfig.accentColor, border: `1px solid ${moodConfig.borderColor}` }}
        >
          reset
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 rounded-xl overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.2)',
          border: `1px solid ${moodConfig.borderColor}`,
          minHeight: 180,
        }}
      >
        {/* Trail */}
        {trail.map((t, i) => (
          <div
            key={t.id}
            style={{
              position: 'absolute',
              left: t.x + BALL_SIZE / 2 - 8,
              top: t.y + BALL_SIZE / 2 - 8,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: moodConfig.accentColor,
              opacity: (1 - i / trail.length) * 0.25,
              pointerEvents: 'none',
              transform: 'translate(-50%,-50%)',
              transition: 'opacity 0.3s',
            }}
          />
        ))}

        {/* Ball */}
        <motion.div
          onClick={handleBallClick}
          style={{
            position: 'absolute',
            left: ballState.x,
            top: ballState.y,
            width: BALL_SIZE,
            height: BALL_SIZE,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #818cf8, #a5b4fc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            userSelect: 'none',
            boxShadow: ballState.glowing
              ? `0 0 30px ${moodConfig.accentColor}, 0 0 60px ${moodConfig.glowColor}`
              : `0 4px 20px rgba(99,102,241,0.4)`,
            transition: 'box-shadow 0.3s ease',
            cursor: 'none',
          }}
          whileTap={{ scale: 1.2 }}
        >
          {ballState.emoji || ''}
        </motion.div>
      </div>
    </div>
  )
}
