import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './tripPlanner.css';

import Navbar from '../../components/Navbar/Navbar';
import CardList from '../../components/cardList/CardList';

import expenseImg from '../../assets/expense.png';
import itineraryImg from '../../assets/itinerary.png';
import paris2 from '../../assets/paris2.png';
import user1 from '../../assets/user1.png';
import user2 from '../../assets/user2.png';
import user3 from '../../assets/user3.png';
import user4 from '../../assets/user4.png';
import user5 from '../../assets/user5.png';
import editIcon from '../../assets/editIcon.png';
import { fetchTripById } from '../../utils/firebaseUtils';


const Trip = () => {
	const { tripId } = useParams(); 
	const [trip, setTrip] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const tripDoc = await fetchTripById(tripId);
			if (tripDoc) {
				setTrip(tripDoc.data());
			}
		};

		if (tripId) {
			fetchData();
		}
	}, [tripId]);

	if (!trip) return <p>Loading trip data...</p>;

	const itineraries = trip.itineraries || [];
	const expenses = trip.expenses || [];

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
				<CardList title='Itineraries' cardsData={itineraries} variantColor='green' />
			</section>

			<section className='section'>
				<CardList title='Expenses' cardsData={expenses} variantColor='green' />
			</section>
		</div>
	);
};

export default Trip;
