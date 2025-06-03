import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '../pages/landing/landing';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import Home from '../pages/Home/Home';
import Trip from '../pages/TripPlanner/TripPlanner';
import Matchmaker from '../pages/Matchmaker/Matchmaker';
import MatchmakerResults from '../pages/Matchmaker/MatchmakerResults';
import MatchmakerQuestions from '../pages/Matchmaker/MatchmakerQuestions';
import MatchmakerRoom from '../pages/Matchmaker/MatchmakerRoom';
import MatchmakerSelection from '../pages/Matchmaker/MatchmakerSelection';
import ExpenseTracker from '../pages/ExpenseTracker/ExpenseTracker';
import Profile from '../pages/Profile/Profile';
import TripCreation from '../pages/TripCreation/TripCreation';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../services/firebase';
import { clearUserId, setUserId } from '../store/auth/AuthSlice';
import { useEffect } from 'react';
import { getUserNameById } from '../utils/firebaseUtils';



const Router = () => {

    const dispatch = useDispatch();

	useEffect(() => {
  		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const username = await getUserNameById(user.uid);
				dispatch(setUserId({ uid: user.uid, email: user.email, username }));
			} else {
				dispatch(clearUserId());
			}
		});

  return () => unsubscribe();
}, [dispatch]);


    return(
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
					<Route
						path='/profile'
						element={
							<PrivateRoute>
								< Profile />
							</PrivateRoute>
						}
					/>
					<Route
						path='/tripcreation'
						element={
							<PrivateRoute>
								< TripCreation />
							</PrivateRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
)}

export default Router;