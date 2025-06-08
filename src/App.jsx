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
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store.js';
import Register from './pages/Register/Register.jsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import Profile from './pages/Profile/Profile.jsx';
import TripCreation from './pages/TripCreation/TripCreation.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { clearUserId, setUserId } from './store/auth/AuthSlice.jsx';
import Router from './routes/Router.jsx';
import GoogleMapsProvider from './components/GoogleMapsProvider';

const App = () => {
	return (
		<>
			<GoogleMapsProvider />
			<Provider store={store}>
				<Router></Router>
			</Provider>
		</>
	);
};

export default App;
