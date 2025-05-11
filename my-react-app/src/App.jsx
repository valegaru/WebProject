import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Trip from './pages/TripPlanner/TripPlanner';
import Matchmaker from './pages/Matchmaker/Matchmaker';
import ExpenseTracker from './pages/ExpenseTracker/ExpenseTracker';
import './App.css';
import Login from './pages/Login/Login.jsx';
import Landing from './pages/landing/landing';
import MatchmakerQuestions from './pages/Matchmaker/MatchmakerQuestions.jsx';
import MatchmakerRoom from './pages/Matchmaker/MatchmakerRoom.jsx';
import MatchmakerSelection from './pages/Matchmaker/MatchmakerSelection.jsx';
import MatchmakerResults from './pages/Matchmaker/MatchmakerResults.jsx';
import { Provider } from 'react-redux';
import {store} from './store/store.js'
import Register from './pages/Register/Register.jsx';

const App = () => {
	return (
		<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/matchmaker' element={<Matchmaker />} />
				<Route path='/room' element={<MatchmakerRoom />} />
				<Route path='/matchselection' element={<MatchmakerSelection />} />
				<Route path='/results' element={<MatchmakerResults />} />
				<Route path='/questions' element={<MatchmakerQuestions />} />
				<Route path='/expenseTracker' element={<ExpenseTracker />} />
				<Route path='/tripPlanner' element={<Trip />} />
				<Route path='/landing' element={<Landing />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register/>} />
			</Routes>
		</BrowserRouter>
		</Provider>
	);
};

export default App;
