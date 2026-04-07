import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { happy, sad, angry, bored } from '../moods/index.js'

const moodMap = { happy, sad, angry, bored }

const MoodContext = createContext(null)

export function MoodProvider({ children }) {
  const [currentMood, setCurrentMood] = useState(() => {
    return localStorage.getItem('moodverse-mood') || 'happy'
  })
  const [prevMood, setPrevMood] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [moodHistory, setMoodHistory] = useState([])

  const moodConfig = moodMap[currentMood]

  const changeMood = useCallback((newMood) => {
    if (newMood === currentMood || isTransitioning) return
    setIsTransitioning(true)
    setPrevMood(currentMood)
    setMoodHistory(prev => [...prev.slice(-4), currentMood])
    setTimeout(() => {
      setCurrentMood(newMood)
      localStorage.setItem('moodverse-mood', newMood)
      setIsTransitioning(false)
    }, 350)
  }, [currentMood, isTransitioning])

  useEffect(() => {
    document.title = `Moodverse — ${moodConfig.label}`
  }, [moodConfig])

  return (
    <MoodContext.Provider value={{
      currentMood,
      prevMood,
      isTransitioning,
      moodConfig,
      moodMap,
      moodHistory,
      changeMood,
    }}>
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const ctx = useContext(MoodContext)
  if (!ctx) throw new Error('useMood must be used within MoodProvider')
  return ctx
}
