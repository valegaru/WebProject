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
import { store } from './store/store.js';
import Register from './pages/Register/Register.jsx';

const App = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					{/* Públicas */}
					<Route path='/' element={<Landing />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />

					{/* Privadas */}
					<Route
						path='/home'
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route
						path='/tripPlanner'
						element={
							<PrivateRoute>
								<Trip />
							</PrivateRoute>
						}
					/>
					<Route
						path='/matchmaker'
						element={
							<PrivateRoute>
								<Matchmaker />
							</PrivateRoute>
						}
					/>
					<Route
						path='/room'
						element={
							<PrivateRoute>
								<MatchmakerRoom />
							</PrivateRoute>
						}
					/>
					<Route
						path='/matchselection'
						element={
							<PrivateRoute>
								<MatchmakerSelection />
							</PrivateRoute>
						}
					/>
					<Route
						path='/results'
						element={
							<PrivateRoute>
								<MatchmakerResults />
							</PrivateRoute>
						}
					/>
					<Route
						path='/questions'
						element={
							<PrivateRoute>
								<MatchmakerQuestions />
							</PrivateRoute>
						}
					/>
					<Route
						path='/expenseTracker'
						element={
							<PrivateRoute>
								<ExpenseTracker />
							</PrivateRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
