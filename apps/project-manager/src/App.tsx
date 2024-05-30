import { useState } from 'react'
import CreateProjectFolder from './components/CreateProjectFolder'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <CreateProjectFolder></CreateProjectFolder>
  )
}

export default App
