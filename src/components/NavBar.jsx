import { motion, AnimatePresence } from 'framer-motion'
import { useMood } from '../context/MoodContext'

export default function NavBar() {
  const { moodConfig, currentMood, moodHistory, moodMap } = useMood()

  return (
    <motion.nav
      layout
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: `1px solid ${moodConfig.borderColor}` }}
    >
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">

        {/* Logo */}
        <motion.div layout className="flex items-center gap-2 font-display font-bold text-xl"
          style={{ color: moodConfig.textPrimary }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentMood + '-emoji'}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-2xl"
            >
              {moodConfig.emoji}
            </motion.span>
          </AnimatePresence>
          <span style={{ background: moodConfig.buttonGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Moodverse
          </span>
        </motion.div>

        {/* Tagline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMood + '-tag'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="hidden md:block text-sm italic font-body"
            style={{ color: moodConfig.textSecondary }}
          >
            {moodConfig.tagline}
          </motion.p>
        </AnimatePresence>

        {/* Mood history trail */}
        <div className="flex items-center gap-1">
          {moodHistory.slice(-5).map((moodId, i) => (
            <motion.span
              key={i + moodId}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: (i + 1) / moodHistory.length, scale: 1 }}
              className="text-lg"
              style={{ filter: 'grayscale(0.4)' }}
              title={moodMap[moodId]?.label}
            >
              {moodMap[moodId]?.emoji}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
