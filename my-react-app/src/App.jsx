import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';


import Trip from './pages/tripPlanner/TripPlanner';

import Matchmaker from './pages/Matchmaker/Matchmaker';
import ExpenseTracker from './pages/ExpenseTracker/ExpenseTracker';
import './App.css';

import Landing from './pages/landing/landing';


const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
D


				<Route path='/matchmaker' element={<Matchmaker />} />
				<Route path='/expenseTracker' element={<ExpenseTracker />} />
				<Route path='/tripPlanner' element={<Trip />} />
				<Route path='/landing' element={<Landing />} />

			</Routes>
		</BrowserRouter>
	);
};

export default App;
