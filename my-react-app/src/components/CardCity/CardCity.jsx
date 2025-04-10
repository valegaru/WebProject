import React from 'react';
import InfoList from '../InfoList/InfoList';
import LikeButton from '../LikeButton/LikeButton';
import DislikeButton from '../DislikeButton/DislikeButton';
import './CardCity.css';

const CardCity = ({ city, onDislike, onLike }) => {
	return (
		<div className='card-city'>
			<img src={city.image} alt={city.name} className='city-image' />
			<div className='card-city-content'>
				<h2 className='city-name'>
					{city.name} {city.flag && <img src={city.flag} alt='flag' className='flag-icon' />}
				</h2>

				<div className='section'>
					<h3>Description</h3>
					<p>
						<strong>Aesthetic:</strong> {city.aesthetic}
					</p>
					<p>
						<strong>Vibe:</strong> {city.vibe}
					</p>
					<p>
						<strong>Gastronomy:</strong> {city.gastronomy}
					</p>
					<p>
						<strong>Renowned for:</strong> {city.renowned}
					</p>
				</div>

				<div className='city-info-lists'>
					<InfoList title='Activities' items={city.activities} />
					<InfoList title='Top Attractions' items={city.attractions} />
				</div>

				{/* Botones personalizados */}
				<div className='action-buttons flex justify-center gap-6 mt-6'>
					<DislikeButton onClick={onDislike} />
					<LikeButton onClick={onLike} />
				</div>
			</div>
		</div>
	);
};

export default CardCity;
