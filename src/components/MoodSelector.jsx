import { motion } from 'framer-motion'
import { useMood } from '../context/MoodContext'

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '✨', color: '#f093fb' },
  { id: 'sad',   label: 'Sad',   emoji: '🌧️', color: '#93c5fd' },
  { id: 'angry', label: 'Angry', emoji: '⚡', color: '#ff2222' },
  { id: 'bored', label: 'Bored', emoji: '😑', color: '#6366f1' },
]

export default function MoodSelector() {
  const { currentMood, changeMood, moodConfig } = useMood()

  return (
    <div className="fixed top-16 left-1/2 z-50" style={{ transform: 'translateX(-50%)' }}>
      <div
        className="glass flex items-center gap-1 p-1.5 rounded-full"
        style={{ border: `1px solid ${moodConfig.borderColor}` }}
      >
        {MOODS.map((mood) => {
          const isActive = currentMood === mood.id
          return (
            <div key={mood.id} className="relative">
              {isActive && (
                <motion.div
                  layoutId="mood-active-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: moodConfig.buttonGradient,
                    boxShadow: `0 0 20px ${moodConfig.glowColor}`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.button
                id={`mood-btn-${mood.id}`}
                onClick={() => changeMood(mood.id)}
                whileHover={{ scale: isActive ? 1 : 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full font-display font-medium text-sm transition-colors duration-300"
                style={{
                  color: isActive ? '#fff' : mood.color,
                  zIndex: 1,
                  textShadow: isActive ? `0 0 12px ${mood.color}` : 'none',
                }}
              >
                <motion.span
                  animate={isActive ? {
                    scale: [1, 1.3, 0.9, 1.1, 1],
                    rotate: [0, -10, 10, -5, 0],
                  } : {}}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="text-base"
                >
                  {mood.emoji}
                </motion.span>
                <span className="hidden sm:inline">{mood.label}</span>
              </motion.button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
