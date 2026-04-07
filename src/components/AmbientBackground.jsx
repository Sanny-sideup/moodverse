import { motion, AnimatePresence } from 'framer-motion'
import { useMood } from '../context/MoodContext'

export default function AmbientBackground() {
  const { moodConfig, currentMood } = useMood()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentMood}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ background: moodConfig.gradient }}
        className="fixed inset-0 -z-10"
      >
        {moodConfig.orbs.map((orb, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 30, -20, 15, 0],
              y: [0, -25, 15, -10, 0],
              scale: [1, 1.05, 0.97, 1.02, 1],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.5,
            }}
            style={{
              position: 'absolute',
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
              transform: 'translate(-50%, -50%)',
              willChange: 'transform',
            }}
          />
        ))}

        {/* Subtle vignette overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
