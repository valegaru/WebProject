import React from 'react';
import './tripPlanner.css';
import Navbar from '../../components/Navbar/Navbar';
import CardList from '../../components/cardList/cardList';

import expenseImg from '../../assets/expense.png';
import itineraryImg from '../../assets/itinerary.png';
import paris2 from '../../assets/paris2.png';
import user1 from '../../assets/user1.png';
import user2 from '../../assets/user2.png';
import user3 from '../../assets/user3.png';
import user4 from '../../assets/user4.png';
import user5 from '../../assets/user5.png';
import editIcon from '../../assets/editIcon.png';

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

	return (
		<div className='trip-planner-container'>
			<Navbar />
			<section className='trip-header'>
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
			<section className='section'>
				<CardList title='Itineraries' cardsData={itineraries} variantColor='green' />
			</section>

			{/* Expenses Section */}
			<section className='section'>
				<CardList title='Expenses' cardsData={expenses}  variantColor='green' />
			</section>
		</div>
	);
};

export default Trip;


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