import { useEffect, useRef, useState } from 'react'
import { useMood } from '../context/MoodContext'

export default function CustomCursor() {
  const { moodConfig } = useMood()
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [hoverEmoji, setHoverEmoji] = useState(null)

  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    const onDown = () => setIsClicking(true)
    const onUp = () => setIsClicking(false)

    const onEnter = (e) => {
      if (e.target.closest('button, a, [role="button"], input, select')) {
        setIsHovering(true)
        setHoverEmoji(moodConfig.emoji)
      }
    }
    const onLeave = (e) => {
      if (e.target.closest('button, a, [role="button"], input, select')) {
        setIsHovering(false)
        setHoverEmoji(null)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    const animate = () => {
      const lerp = 0.12
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x - 5}px, ${mousePos.current.y - 5}px) scale(${isClicking ? 1.8 : 1})`
      }
      if (ringRef.current) {
        const scale = isHovering ? 2.2 : 1
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${scale})`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isHovering, isClicking, moodConfig.emoji])

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: moodConfig.accentColor,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'background 0.4s ease, transform 0.08s ease',
          boxShadow: `0 0 10px ${moodConfig.accentColor}, 0 0 20px ${moodConfig.glowColor}`,
          willChange: 'transform',
        }}
      />

      {/* Ring cursor */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `2px solid ${moodConfig.accentColor}`,
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'border-color 0.4s ease, transform 0.15s ease',
          opacity: 0.6,
          willChange: 'transform',
        }}
      />

      {/* Hover emoji */}
      {isHovering && hoverEmoji && (
        <div
          style={{
            position: 'fixed',
            top: mousePos.current.y - 40,
            left: mousePos.current.x + 16,
            fontSize: '1.2rem',
            pointerEvents: 'none',
            zIndex: 99997,
            transition: 'opacity 0.2s ease',
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))',
          }}
        >
          {hoverEmoji}
        </div>
      )}
    </>
  )
}
