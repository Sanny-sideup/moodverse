import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMood } from '../context/MoodContext'
import NavBar from '../components/NavBar'
import MoodSelector from '../components/MoodSelector'
import MoodCard from '../components/MoodCard'
import ParticleSystem from '../components/ParticleSystem'
import AmbientBackground from '../components/AmbientBackground'
import BoredZone from '../components/bored/BoredZone'

const moodQuotes = {
  happy: "The world is full of magic. You're one of those magic things. ✨",
  sad: "Even the darkest night will end and the sun will rise. Hold on.",
  angry: "BURN BRIGHT. BREAK THINGS. BUILD BETTER. THE FIRE IS THE POINT.",
  bored: "In the middle of boredom lies the seed of creativity. (but like... probably not right now)",
}

const moodStats = {
  happy: { label: 'Vibe Level', value: 94, color: '#ffd200', sub: 'Dangerously wholesome' },
  sad:   { label: 'Rain Probability', value: 78, color: '#93c5fd', sub: 'Grab a blanket' },
  angry: { label: 'Rage Meter', value: 99, color: '#ff2222', sub: 'Do NOT poke the bear' },
  bored: { label: 'Interest Level', value: 3, color: '#6366f1', sub: 'Barely conscious' },
}

const pageVariants = {
  happy: {
    initial: { opacity: 0, scale: 0.92, y: 30 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  sad: {
    initial: { opacity: 0, scale: 0.97, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -8 },
    transition: { type: 'tween', duration: 1.6, ease: 'easeInOut' },
  },
  angry: {
    initial: { opacity: 0, scale: 1.05, x: -20 },
    animate: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { type: 'spring', stiffness: 600, damping: 15 },
  },
  bored: {
    initial: { opacity: 0, scale: 0.99, y: 5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { type: 'tween', duration: 2.5, ease: 'easeOut' },
  },
}

function StatBar({ value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 8, overflow: 'hidden', marginTop: 8 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 12px ${color}` }}
      />
    </div>
  )
}

export default function MoodPage() {
  const { currentMood, moodConfig } = useMood()
  const spawnRef = useRef(null)
  const angryShakeRef = useRef(false)
  const pageRef = useRef(null)

  const stat = moodStats[currentMood]
  const pv = pageVariants[currentMood]

  // Click-to-spawn particles
  useEffect(() => {
    const handle = (e) => {
      if (spawnRef.current) spawnRef.current(e.clientX, e.clientY)
    }
    window.addEventListener('click', handle)
    return () => window.removeEventListener('click', handle)
  }, [])

  // Angry screen shake on mood change
  useEffect(() => {
    if (currentMood === 'angry' && pageRef.current) {
      pageRef.current.classList.add('animate-screen-shake')
      setTimeout(() => pageRef.current?.classList.remove('animate-screen-shake'), 700)
    }
  }, [currentMood])

  const isAngry = currentMood === 'angry'
  const isHappy = currentMood === 'happy'
  const isBored = currentMood === 'bored'

  return (
    <div ref={pageRef} className="relative min-h-screen w-full" style={{ color: moodConfig.textPrimary }}>
      <AmbientBackground />
      <ParticleSystem onClickSpawn={spawnRef} />
      <NavBar />
      <MoodSelector />

      <main className="relative z-10 px-4 md:px-8 pt-36 pb-16 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMood}
            initial={pv.initial}
            animate={pv.animate}
            exit={pv.exit}
            transition={pv.transition}
          >
            {/* Hero emoji + tagline */}
            <div className="text-center mb-10">
              <motion.div
                className={isHappy ? 'animate-float' : ''}
                animate={isAngry ? { rotate: [0, -5, 5, -3, 3, 0], scale: [1, 1.1, 0.95, 1] } : {}}
                transition={{ duration: 0.5 }}
                style={{ fontSize: '5rem', lineHeight: 1, display: 'inline-block', marginBottom: '1rem' }}
              >
                {moodConfig.emoji}
              </motion.div>

              <motion.h1
                key={currentMood + '-title'}
                className={`font-display font-bold text-4xl md:text-6xl mb-3 ${isAngry ? 'animate-glitch' : ''}`}
                style={{
                  background: moodConfig.buttonGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: isAngry ? `drop-shadow(0 0 20px ${moodConfig.glowColor})` : 'none',
                }}
              >
                {moodConfig.label} Mode
              </motion.h1>

              <motion.p
                className="font-body text-lg italic max-w-lg mx-auto"
                style={{ color: moodConfig.textSecondary }}
              >
                {moodConfig.tagline}
              </motion.p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              {/* Current Vibe card */}
              <MoodCard
                title="Current Vibe"
                icon={moodConfig.emoji}
                delay={0}
              >
                <p className="font-body text-sm leading-relaxed" style={{ color: moodConfig.textSecondary }}>
                  {moodConfig.tagline}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: moodConfig.accentColor, boxShadow: `0 0 8px ${moodConfig.accentColor}` }}
                  />
                  <span className="font-mono text-xs font-bold" style={{ color: moodConfig.textPrimary, textShadow: `0 0 10px ${moodConfig.glowColor}` }}>
                    {moodConfig.label.toUpperCase()} ACTIVE
                  </span>
                </div>
              </MoodCard>

              {/* Mood Stats card */}
              <MoodCard
                title="Mood Stats"
                icon="📊"
                delay={0.1}
              >
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-display font-semibold text-sm" style={{ color: moodConfig.textPrimary }}>
                      {stat.label}
                    </span>
                    <span className="font-mono text-2xl font-bold" style={{ color: stat.color }}>
                      {stat.value}%
                    </span>
                  </div>
                  <StatBar value={stat.value} color={stat.color} />
                  <p className="font-body text-xs mt-2" style={{ color: moodConfig.textSecondary }}>
                    {stat.sub}
                  </p>
                </div>
              </MoodCard>

              {/* Mood Quote card */}
              <MoodCard
                title="Mood Quote"
                icon="💬"
                delay={0.2}
              >
                <blockquote
                  className="font-body text-sm leading-relaxed italic"
                  style={{ color: moodConfig.textSecondary, borderLeft: `3px solid ${moodConfig.accentColor}`, paddingLeft: '1rem' }}
                >
                  {moodQuotes[currentMood]}
                </blockquote>
              </MoodCard>

              {/* Mood Feel card (not bored) */}
              {!isBored && (
                <MoodCard
                  title="Right Now"
                  icon="🌐"
                  delay={0.3}
                >
                  <div className="flex flex-wrap gap-2">
                    {['feeling it', moodConfig.label.toLowerCase(), 'in my feels', 'no notes'].map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-3 py-1 rounded-full font-bold shadow-md"
                        style={{
                          background: currentMood === 'happy' ? 'rgba(0,0,0,0.8)' : moodConfig.accentColor,
                          color: currentMood === 'happy' ? moodConfig.accentColor : '#fff',
                          border: `1px solid ${moodConfig.borderColor}`,
                          boxShadow: `0 4px 12px ${moodConfig.glowColor}`,
                        }}
                      >
                        #{tag.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </MoodCard>
              )}
            </div>

            {/* Bored Zone */}
            {isBored && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
              >
                <BoredZone />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
