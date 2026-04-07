import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMood } from '../../context/MoodContext'

const MESSAGES = [
  "still here?",
  "try blinking",
  "wanna count ceiling tiles?",
  "you could call your mom",
  "remember when time moved?",
  "this is your villain origin story",
  "you've been staring for a while",
  "fun fact: you're made of stardust. still bored?",
  "what if you just... went outside?",
  "the cursor misses you",
  "click something. anything.",
  "have you tried turning yourself off and on?",
  "boredom is just creativity looking for an outlet (you have zero outlets)",
  "time is a flat circle and you're stuck on the boring part",
  "you've unlocked: existential boredom",
  "technically you're having fun. sort of.",
  "we're all just waiting for something",
  "the wifi is judging you",
  "your plants are probably fine",
  "congrats on finding the boring corner of the internet",
  "did you know yawning is contagious?",
  "somewhere someone is having the time of their life. wild.",
  "maybe refresh? no that won't help.",
  "this message brought to you by nothing",
  "you okay buddy?",
  "counting sheep is also an option",
  "the developers are also bored writing these",
  "existence is a mystery. you're in the middle of it.",
  "ok but like... why are you still here",
  "three dots of nothing: . . .",
]

function TypingText({ text }) {
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setDisplayed('')
    setIdx(0)
  }, [text])

  useEffect(() => {
    if (idx >= text.length) return
    const t = setTimeout(() => {
      setDisplayed(prev => prev + text[idx])
      setIdx(i => i + 1)
    }, 40 + Math.random() * 30)
    return () => clearTimeout(t)
  }, [idx, text])

  return (
    <span>
      {displayed}
      {idx < text.length && <span className="typing-cursor">|</span>}
    </span>
  )
}

export default function RandomMessages() {
  const { moodConfig } = useMood()
  const [msgIndex, setMsgIndex] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const intervalRef = useRef(null)

  const nextMessage = useCallback(() => {
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
    setMsgIndex(i => (i + 1) % MESSAGES.length)
    setOffsetX((Math.random() - 0.5) * 30)
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(nextMessage, 3500)
    return () => clearInterval(intervalRef.current)
  }, [nextMessage])

  return (
    <div
      className="flex flex-col items-center justify-center h-full py-4 px-2"
      onClick={() => {
        clearInterval(intervalRef.current)
        nextMessage()
        intervalRef.current = setInterval(nextMessage, 3500)
      }}
      style={{ cursor: 'none' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={msgIndex}
          initial={{ opacity: 0, y: 12, x: offsetX }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
            rotate: shaking ? [0, -3, 3, -2, 2, 0] : 0,
          }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center font-body text-sm md:text-base px-4"
          style={{
            color: moodConfig.textPrimary,
            lineHeight: 1.6,
            maxWidth: 260,
          }}
        >
          <TypingText text={MESSAGES[msgIndex]} />
        </motion.div>
      </AnimatePresence>
      <motion.p
        className="font-mono text-xs mt-4 opacity-40"
        style={{ color: moodConfig.textSecondary }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        click to skip
      </motion.p>
    </div>
  )
}
