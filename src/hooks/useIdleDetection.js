import { useState, useEffect, useRef, useCallback } from 'react'

export function useIdleDetection() {
  const [isIdle, setIsIdle] = useState(false)
  const [idleSeconds, setIdleSeconds] = useState(0)
  const timerRef = useRef(null)
  const idleIntervalRef = useRef(null)
  const IDLE_THRESHOLD = 8000

  const resetIdle = useCallback(() => {
    setIsIdle(false)
    setIdleSeconds(0)
    clearTimeout(timerRef.current)
    clearInterval(idleIntervalRef.current)
    timerRef.current = setTimeout(() => {
      setIsIdle(true)
      idleIntervalRef.current = setInterval(() => {
        setIdleSeconds(s => s + 1)
      }, 1000)
    }, IDLE_THRESHOLD)
  }, [])

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel']
    events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }))
    resetIdle()
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdle))
      clearTimeout(timerRef.current)
      clearInterval(idleIntervalRef.current)
    }
  }, [resetIdle])

  return { isIdle, idleSeconds }
}
