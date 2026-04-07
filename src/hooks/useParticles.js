import { useState, useEffect, useRef, useCallback } from 'react'

export function useParticles(moodConfig) {
  const [particles, setParticles] = useState([])
  const intervalRef = useRef(null)
  const idRef = useRef(0)

  const spawnParticle = useCallback((x, y) => {
    if (!moodConfig) return
    const id = idRef.current++
    const color = moodConfig.particleColors[Math.floor(Math.random() * moodConfig.particleColors.length)]
    const size = Math.random() * 14 + 6
    const duration = Math.random() * 2500 + 1500
    const delay = 0
    const particle = {
      id,
      x: x ?? Math.random() * window.innerWidth,
      y: y ?? window.innerHeight + 20,
      color,
      size,
      duration,
      delay,
      shape: moodConfig.particleShape,
    }
    setParticles(prev => [...prev, particle])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id))
    }, duration + 200)
  }, [moodConfig])

  useEffect(() => {
    if (!moodConfig) return
    clearInterval(intervalRef.current)
    const baseInterval = Math.max(400, 5000 / (moodConfig.particleCount || 1))
    intervalRef.current = setInterval(() => {
      spawnParticle(null, null)
    }, baseInterval)
    return () => clearInterval(intervalRef.current)
  }, [moodConfig, spawnParticle])

  return { particles, spawnParticle }
}
