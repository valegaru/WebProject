import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';

import Trip from './pages/tripPlanner/TripPlanner';

import Matchmaker from './pages/Matchmaker/Matchmaker';
import ExpenseTracker from './pages/ExpenseTracker/ExpenseTracker';
import './App.css';

import Landing from './pages/landing/landing';
import MatchmakerQuestions from './pages/Matchmaker/MatchmakerQuestions.jsx';
import MatchmakerRoom from './pages/Matchmaker/MatchmakerRoom.jsx';
import MatchmakerSelection from './pages/Matchmaker/MatchmakerSelection.jsx';
import MatchmakerResults from './pages/Matchmaker/MatchmakerResults.jsx';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				D
				<Route path='/matchmaker' element={<Matchmaker />} />
				<Route path='/room' element={<MatchmakerRoom />} />
				<Route path='/matchselection' element={<MatchmakerSelection />} />
				<Route path='/results' element={<MatchmakerResults />} />
				<Route path='/questions' element={<MatchmakerQuestions />} />
				<Route path='/expenseTracker' element={<ExpenseTracker />} />
				<Route path='/tripPlanner' element={<Trip />} />
				<Route path='/landing' element={<Landing />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
