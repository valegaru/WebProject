import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Matchmaker from './pages/Matchmaker/Matchmaker';
import ExpenseTracker from './pages/ExpenseTracker/ExpenseTracker';
import TripPlanner from './pages/TripPlanner/TripPlanner';
import Landing from './pages/landing/landing';
import MatchmakerQuestions from './pages/Matchmaker/MatchmakerQuestions';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/matchmaker' element={<Matchmaker />} />
				<Route path='/questions' element={<MatchmakerQuestions />} />
				<Route path='/expenseTracker' element={<ExpenseTracker />} />
				<Route path='/tripPlanner' element={<TripPlanner />} />
				<Route path='/landing' element={<Landing />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
