import React from 'react';
import './card.css';

import UsersIcon from '../../assets/users.png'; // para trips
import itinerary from '../../assets/itinerary.png';
<<<<<<< HEAD:my-react-app/src/components/card/Card.jsx
import  expense  from '../../assets/expense.png';

 const Card = ({ image, label, date, onClick,numberMembers, variant = 'saved' }) => {
=======
import expense from '../../assets/expense.png';

const Card = ({ image, label, date, onClick, numberMembers, variant = 'saved' }) => {
>>>>>>> main:my-react-app/src/components/Card/Card.jsx
	return (
		<div className={`custom-card ${variant}`} onClick={onClick}>
			{variant === 'saved' || variant === 'matches' ? (
				<>
					<img src={image} alt={label} className='card-img' />
					<div className='card-label'>
						<p>{label}</p>
					</div>
				</>
			) : variant === 'trips' ? (
				<>
					<img src={image} alt={label} className='card-img' />
					<div className='trip-info'>
						<div className='text-info'>
<<<<<<< HEAD:my-react-app/src/components/card/Card.jsx
						<p className='trip-label'>{label}</p>
						<p className='trip-dates'>{date}</p>
						</div>
						<div className='members'>
						<p className='numberMembers'>{numberMembers}</p>
						<img src={UsersIcon} className='trip-icon' alt="trip icon" />
=======
							<p className='trip-label'>{label}</p>
							<p className='trip-dates'>{date}</p>
						</div>
						<div className='members'>
							<p className='numberMembers'>{numberMembers}</p>
							<img src={UsersIcon} className='trip-icon' alt='trip icon' />
>>>>>>> main:my-react-app/src/components/Card/Card.jsx
						</div>
					</div>
				</>
			) : (
				<div className='info-card'>
					<img
						src={variant === 'expenses' ? expense : itinerary}
						// className='trip-icon'
						alt='info icon'
					/>
					<div className='info-label'>
						<p className='trip-label'>{label}</p>
						<p className='info-date'>{date}</p>
					</div>
				</div>
			)}
		</div>
	);
};

<<<<<<< HEAD:my-react-app/src/components/card/Card.jsx
export default Card;
=======
export default Card;
>>>>>>> main:my-react-app/src/components/Card/Card.jsx
