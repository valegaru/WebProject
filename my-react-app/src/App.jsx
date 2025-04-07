import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Home from './pages/Home/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/matchmaker' element={<Matchmaker/>}/>
        <Route path='/expenseTracker' element={<ExpenseTracker/>}/>
        <Route path='/tripPlanner' element={<TripPlanner/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
