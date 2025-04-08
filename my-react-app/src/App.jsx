import { BrowserRouter, Routes, Route } from 'react-router-dom'
 import Home from './pages/Home/Home'
 import Matchmaker from './pages/Matchmaker/Matchmaker'
 import ExpenseTracker from './pages/ExpenseTracker/ExpenseTracker'
 import TripPlanner from './pages/TripPlanner/TripPlanner'

const App = () => {
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

export default App;
