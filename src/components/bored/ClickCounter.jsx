import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMood } from '../../context/MoodContext'

const MILESTONES = {
  0: 'dare you to click',
  1: 'okay you clicked',
  5: 'again?',
  10: '...seriously?',
  25: 'are you okay?',
  50: 'you need help lmao',
  100: 'ACHIEVEMENT UNLOCKED: TRULY BORED',
}

function getMilestone(count) {
  const keys = Object.keys(MILESTONES).map(Number).sort((a, b) => b - a)
  for (const key of keys) {
    if (count >= key) return MILESTONES[key]
  }
  return MILESTONES[0]
}

function ConfettiDot({ i }) {
  const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#ffd200', '#f093fb']
  const color = colors[i % colors.length]
  const angle = (i / 30) * 360
  const distance = 80 + Math.random() * 80
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        top: '50%',
        left: '50%',
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.02 }}
    />
  )
}

export default function ClickCounter() {
  const { moodConfig } = useMood()
  const [count, setCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [personalBest, setPersonalBest] = useState(() => Number(localStorage.getItem('moodverse-best-clicks') || 0))
  const [isDelayed, setIsDelayed] = useState(false)

  const handleClick = () => {
    if (isDelayed) return
    setIsDelayed(true)
    setTimeout(() => {
      setCount(c => {
        const next = c + 1
        if (next > personalBest) {
          setPersonalBest(next)
          localStorage.setItem('moodverse-best-clicks', next)
        }
        if (next === 100) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 1800)
        }
        return next
      })
      setIsDelayed(false)
    }, 150)
  }

  const milestone = getMilestone(count)

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full py-6">
      <motion.p
        className="font-mono text-sm"
        style={{ color: moodConfig.textSecondary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        personal best: {personalBest}
      </motion.p>

      <AnimatePresence mode="wait">
        <motion.p
          key={milestone}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="font-display font-medium text-center text-base px-4"
          style={{ color: moodConfig.textSecondary }}
        >
          {milestone}
        </motion.p>
      </AnimatePresence>

      <div className="relative flex items-center justify-center">
        {showConfetti && Array.from({ length: 30 }).map((_, i) => <ConfettiDot key={i} i={i} />)}
        <motion.button
          id="click-counter-btn"
          onClick={handleClick}
          whileTap={{ scale: 0.92 }}
          animate={count === 100 ? { rotate: [0, -3, 3, -2, 2, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative rounded-full font-display font-bold select-none"
          style={{
            width: 140,
            height: 140,
            background: moodConfig.buttonGradient,
            boxShadow: `0 0 40px ${moodConfig.glowColor}, 0 8px 32px rgba(0,0,0,0.3)`,
            color: '#fff',
            fontSize: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${moodConfig.borderColor}`,
          }}
        >
          {count}
        </motion.button>
      </div>

      <motion.p
        className="font-mono text-xs"
        style={{ color: moodConfig.textSecondary, opacity: 0.5 }}
      >
        click the circle
      </motion.p>
    </div>
  )
}
