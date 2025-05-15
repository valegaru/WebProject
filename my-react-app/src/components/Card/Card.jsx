import React from 'react';
import './Card.css';

const formatDate = (dateStr) => {
	if (!dateStr) return null;
	const options = { year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateStr).toLocaleDateString(undefined, options);
};

const Card = ({
	tripPic,
	name,
	startDate,
	endDate,
	description,
	participants = [],
	onClick,
	variant = 'trips', // 'trips' | 'saved' | 'matches'
}) => {
	// === TRIPS VARIANT ===
	if (variant === 'trips') {
		return (
			<div className='simple-card trips' onClick={onClick}>
				{tripPic && (
					<img
						src={
							tripPic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDAQmzG9L1vNwwjk-ObTkfDwE_oUBSSByO8g&s'
						}
						alt={name || 'Trip image'}
						className='card-img'
					/>
				)}
				<div className='card-content'>
					{name && <h2 className='card-title'>{name}</h2>}
					{(startDate || endDate) && (
						<p className='card-dates'>
							{startDate && formatDate(startDate)} {startDate && endDate && ' - '} {endDate && formatDate(endDate)}
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
			<div className='simple-card saved' onClick={onClick}>
				{tripPic && <img src={tripPic} alt={name || 'Saved image'} className='card-img' />}
				<div className='card-content'>{name && <h2 className='card-title'>{name}</h2>}</div>
			</div>
		);
	}

	// === MATCHES VARIANT ===
	if (variant === 'matches') {
		return (
			<div className='simple-card matches' onClick={onClick}>
				{tripPic && <img src={tripPic} alt={name || 'Match image'} className='card-img' />}
				<div className='card-content'>{name && <h2 className='card-title'>{name}</h2>}</div>
			</div>
		);
	}

	return null; // fallback por si no hay variante válida
};

export default Card;
