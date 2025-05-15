import React from 'react';
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

	// === TRIPS VARIANT ===
	if (variant === 'trips') {
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

	// === SAVED VARIANT ===
	if (variant === 'saved') {
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
				<div className='card-content'>{name && <h2 className='card-title'>{name}</h2>}</div>
			</div>
		);
	}

	// === MATCHES VARIANT ===
	if (variant === 'matches') {
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
				<div className='card-content'>{name && <h2 className='card-title'>{name}</h2>}</div>
			</div>
		);
	}

	return null;
};


export default Card;
