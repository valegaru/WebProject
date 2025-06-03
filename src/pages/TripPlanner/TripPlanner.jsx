<<<<<<< HEAD
import React from 'react';
import './tripPlanner.css';
import Navbar from '../../components/Navbar/Navbar';
import CardList from '../../components/cardList/cardList';
=======
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './tripPlanner.css';

import Navbar from '../../components/Navbar/Navbar';
import CardList from '../../components/cardList/CardList';
>>>>>>> main

import expenseImg from '../../assets/expense.png';
import itineraryImg from '../../assets/itinerary.png';
import paris2 from '../../assets/paris2.png';
import user1 from '../../assets/user1.png';
import user2 from '../../assets/user2.png';
import user3 from '../../assets/user3.png';
import user4 from '../../assets/user4.png';
import user5 from '../../assets/user5.png';
import editIcon from '../../assets/editIcon.png';
<<<<<<< HEAD

const Trip = () => {
	const itineraries = [
		{ image: itineraryImg, label: 'Day 1 - Option 1', date:'Dec/07/25' },
		{ image: itineraryImg, label: 'Day 1 - Option 1', date:'Dec/07/25' },
		{ image: itineraryImg, label: 'Day 1 - Option 1', date:'Dec/07/25' },
		{ image: itineraryImg, label: 'Day 1 - Option 1', date:'Dec/07/25' },
	];

	const expenses = [
		{ image: expenseImg, label: 'Day 1 - Option 1', date:'Dec/07/25' },
		{ image: expenseImg, label: 'Day 1 - Option 1', date:'Dec/07/25' },
		{ image: expenseImg, label: 'Day 1 - Option 1', date:'Dec/07/25' },
		{ image: expenseImg, label: 'Day 1 - Option 1', date:'Dec/07/25'},
	];
=======
import { fetchExpenses, fetchTripById } from '../../utils/firebaseUtils';


const Trip = () => {
	const { tripId } = useParams(); 
	const [trip, setTrip] = useState(null);
	const [itineraries, setItineraries] = useState([]);
	const [expenses, setExpenses] = useState([]);

	const navigate = useNavigate()

	const handleClick = (expense) => {
		console.log("Clicked on expense:", expense);
		navigate(`/expenseTracker/${tripId}/${expense.id}`);};

	useEffect(() => {
	const fetchData = async () => {
		const tripDoc = await fetchTripById(tripId);
		const expensesData = await fetchExpenses(tripId);

		if (tripDoc) {
			setTrip(tripDoc.data());
		}

		if (expensesData) {
			const expensesWithClick = expensesData.map((expense) => ({
				...expense,
				onClick: () => handleClick(expense), 
			}));

			setExpenses(expensesWithClick);
			console.log(expensesWithClick);
		}
	};

	if (tripId) {
		fetchData();
	}
	}, [tripId]);


	if (!trip) return <p>Loading trip data...</p>;

	
>>>>>>> main

	return (
		<div className='trip-planner-container'>
			<Navbar />
			<section className='trip-header'>
<<<<<<< HEAD
				<img src={paris2} alt='Paris' className='trip-banner' />
        <div className='container'>
        <div className='textContent'>

          <div className='nameDate'>
				<h1>Paris Voyage</h1>

				<button className='edit-icon'>
					<img src={editIcon}></img>
				</button>
				<p>Dec/07/25 - Feb/02/26</p>
        </div>
				<div className='trip-description'>
					<h3>Description:</h3>
					<p>Lorem ipsum dolor sit amet consectetur. Quam pulvinar turpis ipsum id adipiscing pellentesque purus.</p>
				</div>
        </div>
				<div className='trip-members'>
					<h4>Members:</h4>
					<div className='avatars'>
						{/* Puedes mapear imágenes de miembros reales aquí */}
						<img src={user1} alt='You' />
						<img src={user2} alt='Lina' />
						<img src={user3} alt='Marce' />
						<img src={user4} alt='Marce' />
						<img src={user5} alt='Marce' />
            </div>
            </div>
					</div>

			</section>

			{/* Itineraries Section */}
=======
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

>>>>>>> main
			<section className='section'>
				<CardList title='Itineraries' cardsData={itineraries} variantColor='green' />
			</section>

<<<<<<< HEAD
			{/* Expenses Section */}
			<section className='section'>
				<CardList title='Expenses' cardsData={expenses}  variantColor='green' />
=======
			<section className='section'>
				<CardList title='Expenses' cardsData={expenses} variantColor='green' onClick={handleClick} />
>>>>>>> main
			</section>
		</div>
	);
};

export default Trip;
<<<<<<< HEAD


//  cardType='itinerary'

// const itineraries = [
//   { label: 'Day 1 - Option 1', date: 'Dec/07/25' },
//   { label: 'Day 1 - Option 2', date: 'Dec/07/25' },
//   { label: 'Day 2', date: 'Dec/08/25' },
//   { label: 'Day 3', date: 'Dec/09/25' },
// ];

// const expenses = [
//   { label: 'Day 1 - Option 1', date: 'Dec/07/25' },
//   { label: 'Day 1 - Option 2', date: 'Dec/07/25' },
//   { label: 'Day 2', date: 'Dec/08/25' },
//   { label: 'Day 3', date: 'Dec/09/25' },
// ];
=======
>>>>>>> main
