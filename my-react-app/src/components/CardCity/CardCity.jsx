import React from 'react';
import InfoList from '../InfoList/InfoList';
import LikeButton from '../LikeButton/LikeButton';
import DislikeButton from '../DislikeButton/DislikeButton';
import './CardCity.css';

const CardCity = ({ city, onDislike, onLike }) => {
	return (
		<div className='card-city'>
			<div className='city-image-container'>
				<img src={city.image} alt={city.name} className='city-image' />
				<div className='image-gradient' />
				<h2 className='city-name-overlay'>
					{city.name}{' '}
					{city.flag && <img src={city.flag} alt='flag' className='flag-icon' />}
				</h2>
			</div>

			<div className='card-city-content'>
				<div className='city-sections-row'>
					<div className='section description-section'>
						<h3>Description</h3>
						<p><strong>Aesthetic:</strong> {city.aesthetic}</p>
						<p><strong>Vibe:</strong> {city.vibe}</p>
						<p><strong>Gastronomy:</strong> {city.gastronomy}</p>
						<p><strong>Renowned for:</strong> {city.renowned}</p>
					</div>

					<InfoList title='Activities' items={city.activities} />
					<InfoList title='Top Attractions' items={city.attractions} />
				</div>

				<div className='card-actions'>
					<DislikeButton onClick={onDislike} />
					<LikeButton onClick={onLike} />
				</div>
			</div>
		</div>
	);
};

export default CardCity;
