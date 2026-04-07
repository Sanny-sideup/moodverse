import { motion } from 'framer-motion'
import { useMood } from '../context/MoodContext'

export default function MoodCard({ title, subtitle, children, icon, delay = 0 }) {
  const { moodConfig, currentMood } = useMood()

  const isAngry = currentMood === 'angry'
  const isHappy = currentMood === 'happy'
  const isSad = currentMood === 'sad'
  const isBored = currentMood === 'bored'

  const hoverDelay = isBored ? 0.2 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...moodConfig.motionConfig.transition,
        delay,
      }}
      whileHover={{
        ...moodConfig.motionConfig.cardHover,
        transition: {
          ...moodConfig.motionConfig.transition,
          delay: hoverDelay,
        },
      }}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: moodConfig.cardBg,
        border: `1px solid ${moodConfig.borderColor}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: isAngry
          ? `0 0 30px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.05)`
          : isHappy
          ? `0 8px 32px rgba(240,147,251,0.15), inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Angry glow pulse overlay */}
      {isAngry && (
        <motion.div
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Happy sparkle corner */}
      {isHappy && (
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            fontSize: '2rem',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        >
          ✦
        </motion.div>
      )}

      {/* Sad rain drops decoration */}
      {isSad && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(147,197,253,0.3), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      <div className="relative z-10">
        {(icon || title) && (
          <div className="flex items-center gap-3 mb-3">
            {icon && (
              <span className="text-2xl">{icon}</span>
            )}
            {title && (
              <h3
                className="font-display font-semibold text-lg"
                style={{ color: moodConfig.textPrimary }}
              >
                {title}
              </h3>
            )}
          </div>
        )}
        {subtitle && (
          <p className="text-sm mb-4 font-body" style={{ color: moodConfig.textSecondary }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </motion.div>
  )
}
