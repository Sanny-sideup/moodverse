import { MoodProvider } from './context/MoodContext'
import MoodPage from './pages/MoodPage'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <MoodProvider>
      <div className="noise relative">
        <CustomCursor />
        <MoodPage />
      </div>
    </MoodProvider>
  )
}
