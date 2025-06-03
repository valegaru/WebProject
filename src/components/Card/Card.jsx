import React from 'react';
<<<<<<< HEAD
import './card.css';

import UsersIcon from '../../assets/users.png'; // para trips
import itinerary from '../../assets/itinerary.png';

import  expense  from '../../assets/expense.png';




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


=======
import './Card.css';

const formatDate = (dateStr) => {
	if (!dateStr) return null;
	const options = { year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateStr).toLocaleDateString(undefined, options);
};

const Card = ({
	id,
	tripPic,
	name,
	startDate,
	endDate,
	description,
	participants = [],
	onClick,
	variant = 'trips', // 'trips' | 'saved' | 'matches'
}) => {
	const handleClick = () => {
		if (onClick) {
			onClick(id);
		}
	};

	switch (variant) {
		case 'saved':
			return (
				<div className='simple-card saved' onClick={handleClick} data-id={id}>
					{tripPic && (
						<img
							src={
								tripPic ||
								'https://visitvalle.travel/wp-content/uploads/2024/12/banner-interna-res.webp'
							}
							alt={name || 'Saved image'}
							className='card-img'
						/>
					)}
					<div className='card-content'>
						{name && <h2 className='card-title'>{name}</h2>}
					</div>
				</div>
			);

		case 'matches':
			return (
				<div className='simple-card matches' onClick={handleClick} data-id={id}>
					{tripPic && (
						<img
							src={
								tripPic ||
								'https://media.istockphoto.com/id/1497396873/es/foto/listo-para-comenzar-mis-vacaciones-en-la-playa.jpg?s=612x612&w=0&k=20&c=26T_8jyLnZA2XOOMYgMhMTZJzXLjHa1ZsR9YiCivnDg='
							}
							alt={name || 'Match image'}
							className='card-img'
						/>
					)}
					<div className='card-content'>
						{name && <h2 className='card-title'>{name}</h2>}
					</div>
				</div>
			);

		case 'trips':
		default:
			return (
				<div className='simple-card trips' onClick={handleClick} data-id={id}>
					{tripPic && (
						<img
							src={
								tripPic ||
								'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDAQmzG9L1vNwwjk-ObTkfDwE_oUBSSByO8g&s'
							}
							alt={name || 'Trip image'}
							className='card-img'
						/>
					)}
					<div className='card-content'>
						{name && <h2 className='card-title'>{name}</h2>}
						{(startDate || endDate) && (
							<p className='card-dates'>
								{startDate && formatDate(startDate)} {startDate && endDate && ' - '}{' '}
								{endDate && formatDate(endDate)}
							</p>
						)}
						{description && <p className='card-description'>{description}</p>}
						{participants.length > 0 && (
							<p className='card-participants'>
								{participants.length} participant{participants.length > 1 ? 's' : ''}
							</p>
						)}
					</div>
				</div>
			);
	}
};

export default Card;
>>>>>>> main
