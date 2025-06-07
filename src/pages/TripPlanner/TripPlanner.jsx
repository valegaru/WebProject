import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './tripPlanner.css';

import Navbar from '../../components/Navbar/Navbar';
import CardList from '../../components/CardList/CardList';

import expenseImg from '../../assets/expense.png';
import itineraryImg from '../../assets/itinerary.png';
import paris2 from '../../assets/paris2.png';
import user1 from '../../assets/user1.png';
import user2 from '../../assets/user2.png';
import user3 from '../../assets/user3.png';
import user4 from '../../assets/user4.png';
import user5 from '../../assets/user5.png';
import editIcon from '../../assets/editIcon.png';
import { fetchExpenses, fetchItineraries, fetchTripById } from '../../utils/firebaseUtils';


const Trip = () => {
	const { tripId } = useParams(); 
	const [trip, setTrip] = useState(null);
	const [itineraries, setItineraries] = useState([]);
	const [expenses, setExpenses] = useState([]);

	const navigate = useNavigate()

	const handleExpenseClick = (expense) => {
		console.log("Clicked on expense:", expense);
		navigate(`/expenseTracker/${tripId}/${expense.id}`);};
	
	const handleItineraryClick = (itinerary) => {
		console.log("Clicked on itinerary:", itinerary);
		navigate(`/itinerary/${tripId}/${itinerary.id}`);};

	useEffect(() => {
	const fetchData = async () => {
		const tripDoc = await fetchTripById(tripId);
		const expensesData = await fetchExpenses(tripId);
		const itinerariesData = await fetchItineraries(tripId)

		if (tripDoc) {
			setTrip(tripDoc.data());
		}

		if (expensesData) {
			const expensesWithClick = expensesData.map((expense) => ({
				...expense,
				onClick: () => handleExpenseClick(expense), 
			}));

			setExpenses(expensesWithClick);
			console.log(expensesWithClick);
		}

		if (itinerariesData) {
			const itineraries = itinerariesData.map((itinerary) => ({
				...itinerary,
				onClick: () => handleItineraryClick(itinerary), 
			}));

			setItineraries(itineraries);
			console.log(itineraries);
		}
	};

	if (tripId) {
		fetchData();
	}
	}, [tripId, handleItineraryClick, handleItineraryClick]);


	if (!trip) return <p>Loading trip data...</p>;

	

	return (
		<div className='trip-planner-container'>
			<Navbar />
			<section className='trip-header'>
				<img src={trip.tripPic} alt='Paris' className='trip-banner' />
				<div className='container'>
					<div className='textContent'>
						<div className='nameDate'>
							<h1>{trip.name || 'Untitled Trip'}</h1>
							<button className='edit-icon'>
								<img src={editIcon} alt="Edit" />
							</button>
							<p>{trip.startDate} - {trip.endDate}</p>
						</div>
						<div className='trip-description'>
							<h3>Description:</h3>
							<p>{trip.description || 'No description provided.'}</p>
						</div>
					</div>

					<div className='trip-members'>
						<h4>Members:</h4>
						<div className='avatars'>
							<img src={user1} alt='User 1' />
							<img src={user2} alt='User 2' />
							<img src={user3} alt='User 3' />
							<img src={user4} alt='User 4' />
							<img src={user5} alt='User 5' />
						</div>
					</div>
				</div>
			</section>

			<section className='section'>
				<CardList title='Itineraries' cardsData={itineraries} variantColor='green' onClick={handleItineraryClick}/>
			</section>

			<section className='section'>
				<CardList title='Expenses' cardsData={expenses} variantColor='green' onClick={handleExpenseClick} />
			</section>
		</div>
	);
};

export default Trip;
