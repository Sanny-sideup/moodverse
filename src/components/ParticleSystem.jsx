import { useMood } from '../context/MoodContext'
import { useParticles } from '../hooks/useParticles'

function StarShape({ color, size }) {
  return (
    <span style={{ fontSize: size, color, lineHeight: 1, display: 'block' }}>✦</span>
  )
}

function DropShape({ color, size }) {
  return (
    <div style={{
      width: size * 0.6,
      height: size,
      background: color,
      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      opacity: 0.85,
    }} />
  )
}

function ShardShape({ color, size }) {
  return (
    <div style={{
      width: size * 0.35,
      height: size,
      background: color,
      transform: `skewX(${Math.random() > 0.5 ? 20 : -20}deg)`,
      opacity: 0.9,
    }} />
  )
}

function DotShape({ color, size }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      opacity: 0.7,
    }} />
  )
}

function ParticleShape({ shape, color, size }) {
  switch (shape) {
    case 'star': return <StarShape color={color} size={size} />
    case 'drop': return <DropShape color={color} size={size} />
    case 'shard': return <ShardShape color={color} size={size} />
    case 'dot': default: return <DotShape color={color} size={size} />
  }
}

export default function ParticleSystem({ onClickSpawn }) {
  const { moodConfig } = useMood()
  const { particles, spawnParticle } = useParticles(moodConfig)

  // Expose spawnParticle to parent via callback ref pattern
  if (onClickSpawn) {
    onClickSpawn.current = spawnParticle
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            animationDuration: `${p.duration}ms`,
            animationDelay: `${p.delay}ms`,
          }}
        >
          <ParticleShape shape={p.shape} color={p.color} size={p.size} />
        </div>
      ))}
    </div>
  )
}
