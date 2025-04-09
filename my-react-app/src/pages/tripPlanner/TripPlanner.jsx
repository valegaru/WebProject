import React from 'react';
import './tripPlanner.css';
import Navbar from '../../components/Navbar';
import CardList from '../../components/cardList/cardList';

import expenseImg from '../../assets/expense.png';
import itineraryImg from '../../assets/itinerary.png';
import paris2 from '../../assets/paris2.png';

const Trip = () => {
	const itineraries = [
		{ image: itineraryImg, label: 'Restaurants' },
		{ image: itineraryImg, label: 'Activities' },
		{ image: itineraryImg, label: 'Destinations' },
		{ image: itineraryImg, label: 'Cities of Europe' },
	];

	const expenses = [
		{ image: expenseImg, label: 'Latam Tour' },
		{ image: expenseImg, label: 'Rio Janeiro' },
		{ image: expenseImg, label: 'Paris Voyage' },
		{ image: expenseImg, label: 'New York' },
	];

	return (
		<div className='trip-planner-container'>
			<Navbar />
			<section className='trip-header'>
				<img src={paris2} alt='Paris' className='trip-banner' />
				<h1>
					Paris Voyage <span className='edit-icon'>✏️</span>
				</h1>
        <button>edit</button>
				<p>Dec/07/25 - Feb/02/26</p>
				<div className='trip-description'>
					<h3>Description:</h3>
					<p>Lorem ipsum dolor sit amet consectetur. Quam pulvinar turpis ipsum id adipiscing pellentesque purus.</p>
				</div>
				<div className='trip-members'>
					<h4>Members:</h4>
					<div className='avatars'>
						{/* Puedes mapear imágenes de miembros reales aquí */}
						<img src='/avatars/you.png' alt='You' />
						<img src='/avatars/lina.png' alt='Lina' />
						<img src='/avatars/marce.png' alt='Marce' />
						{/* ... */}
					</div>
				</div>
			</section>

			{/* Itineraries Section */}
			<section className='trip-section'>
				<div className='section-title'>
					<h2>Itineraries</h2>
					<button className='add-btn'>+</button>
				</div>
				<CardList cardsData={itineraries} cardType='itinerary' />
			</section>

			{/* Expenses Section */}
			<section className='trip-section'>
				<div className='section-title'>
					<h2>Expenses tracker</h2>
					<button className='add-btn'>+</button>
				</div>
				<CardList cardsData={expenses} cardType='expense' />
			</section>
		</div>
	);
};

export default Trip;


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