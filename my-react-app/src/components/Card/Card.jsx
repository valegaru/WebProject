import React from 'react';
import './card.css';

import UsersIcon from '../../assets/users.png'; // para trips
import itinerary from '../../assets/itinerary.png';
import expense from '../../assets/expense.png';

const Card = ({ image, label, date, onClick, numberMembers, variant = 'saved' }) => {
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
							<p className='trip-label'>{label}</p>
							<p className='trip-dates'>{date}</p>
						</div>
						<div className='members'>
							<p className='numberMembers'>{numberMembers}</p>
							<img src={UsersIcon} className='trip-icon' alt='trip icon' />
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

export default Card;
