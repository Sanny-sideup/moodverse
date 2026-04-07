import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMood } from '../../context/MoodContext'
import { useIdleDetection } from '../../hooks/useIdleDetection'
import ClickCounter from './ClickCounter'
import BouncingBall from './BouncingBall'
import RandomMessages from './RandomMessages'

const IDLE_MESSAGES = ["you're really bored huh...", "we get it.", "...still here?"]
const TYPED_SEQUENCE = 'bored'

export default function BoredZone() {
  const { moodConfig } = useMood()
  const { isIdle, idleSeconds } = useIdleDetection()
  const [titleClicks, setTitleClicks] = useState(0)
  const [ultraBored, setUltraBored] = useState(false)
  const [typedKeys, setTypedKeys] = useState('')
  const [showWeKnow, setShowWeKnow] = useState(false)
  const [showConcerning, setShowConcerning] = useState(false)
  const [idleMsgIdx, setIdleMsgIdx] = useState(0)
  const concernTimer = useRef(null)
  const entryTime = useRef(Date.now())

  // Easter egg 1: click title 5 times
  const handleTitleClick = useCallback(() => {
    setTitleClicks(c => {
      if (c + 1 >= 5) {
        setUltraBored(true)
        setTimeout(() => setUltraBored(false), 5000)
        return 0
      }
      return c + 1
    })
  }, [])

  // Easter egg 2: type 'bored'
  useEffect(() => {
    const onKey = (e) => {
      setTypedKeys(prev => {
        const next = (prev + e.key.toLowerCase()).slice(-5)
        if (next === TYPED_SEQUENCE) {
          setShowWeKnow(true)
          setTimeout(() => setShowWeKnow(false), 3000)
        }
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Easter egg 3: 2 minutes in bored mode
  useEffect(() => {
    concernTimer.current = setTimeout(() => {
      setShowConcerning(true)
      setTimeout(() => setShowConcerning(false), 4000)
    }, 120000)
    return () => clearTimeout(concernTimer.current)
  }, [])

  // Idle banner message cycling
  useEffect(() => {
    if (!isIdle || idleSeconds < 5) return
    const t = setInterval(() => {
      setIdleMsgIdx(i => (i + 1) % IDLE_MESSAGES.length)
    }, 2500)
    return () => clearInterval(t)
  }, [isIdle, idleSeconds])

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1, y: 0,
      transition: { duration: 1.2, ease: 'easeOut' }
    }
  }

  return (
    <div className={ultraBored ? 'grayscale-mode' : ''} style={{ transition: 'filter 0.5s ease' }}>
      {/* Secret Ultra Bored banner */}
      <AnimatePresence>
        {ultraBored && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 z-50 rounded-xl px-6 py-3 font-mono text-sm text-center"
            style={{
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              color: '#6366f1',
              border: '1px solid #6366f1',
            }}
          >
            ⚫ ULTRA BORED MODE ACTIVATED — grayscale for 5s ⚫
          </motion.div>
        )}
      </AnimatePresence>

      {/* "We know" popup */}
      <AnimatePresence>
        {showWeKnow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 z-50 rounded-2xl px-8 py-6 text-center"
            style={{
              transform: 'translate(-50%, -50%)',
              background: 'rgba(30,27,75,0.95)',
              border: `1px solid ${moodConfig.borderColor}`,
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="font-display text-2xl font-bold" style={{ color: moodConfig.accentColor }}>we know.</p>
            <p className="font-body text-sm mt-1" style={{ color: moodConfig.textSecondary }}>you typed "bored"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2-minute concerning popup */}
      <AnimatePresence>
        {showConcerning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 z-50 rounded-xl px-6 py-3 font-mono text-sm"
            style={{
              transform: 'translateX(-50%)',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            <span style={{ color: moodConfig.textPrimary }}>ok this is concerning 😐</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle banner */}
      <AnimatePresence>
        {isIdle && idleSeconds >= 5 && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed top-[72px] left-0 right-0 z-40 py-2 px-4 text-center font-body text-sm"
            style={{
              background: 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(251,191,36,0.15), rgba(99,102,241,0.2))',
              borderBottom: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={idleMsgIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ color: moodConfig.textPrimary }}
              >
                {IDLE_MESSAGES[idleMsgIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2
            id="bored-zone-title"
            onClick={handleTitleClick}
            className="font-display font-bold text-3xl md:text-4xl mb-2 select-none"
            style={{ color: moodConfig.textPrimary, cursor: 'none' }}
            title={`${5 - titleClicks} more clicks...`}
          >
            The Timepass Zone
          </h2>
          <p className="font-body italic text-sm" style={{ color: moodConfig.textSecondary }}>
            we've been expecting you.
          </p>
          {titleClicks > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs mt-1"
              style={{ color: moodConfig.accentColor, opacity: 0.6 }}
            >
              {5 - titleClicks} more...
            </motion.p>
          )}
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Click Counter - large left */}
          <div
            className="rounded-2xl"
            style={{
              background: moodConfig.cardBg,
              border: `1px solid ${moodConfig.borderColor}`,
              backdropFilter: 'blur(20px)',
              minHeight: 320,
            }}
          >
            <ClickCounter />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Random Messages */}
            <div
              className="rounded-2xl flex-1"
              style={{
                background: moodConfig.cardBg,
                border: `1px solid ${moodConfig.borderColor}`,
                backdropFilter: 'blur(20px)',
                minHeight: 150,
              }}
            >
              <RandomMessages />
            </div>

            {/* Bouncing Ball */}
            <div
              className="rounded-2xl flex-1"
              style={{
                background: moodConfig.cardBg,
                border: `1px solid ${moodConfig.borderColor}`,
                backdropFilter: 'blur(20px)',
                minHeight: 200,
                padding: '1rem',
              }}
            >
              <BouncingBall />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
