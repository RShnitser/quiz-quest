import './App.css'
import QuizApp from './components/QuizApp'
import { QuizProvider } from './providers/QuizProvider'

function App() {
 
  return (
    <QuizProvider>
      <QuizApp/>
    </QuizProvider>
  )
}

export default App
