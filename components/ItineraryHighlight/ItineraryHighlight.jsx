import React from 'react';
import './ItineraryHighlight.css';

const ItineraryHighlight = ({ title, price, missing, peopleCount, boostPercentage, isPrimary }) => {
	return (
		<div className={`itinerary-highlight ${isPrimary ? 'primary' : 'secondary'}`}>
			<div className='title-row'>
				<span className={`title ${!isPrimary ? 'text-black' : ''}`}>{title}</span>
				{boostPercentage && <span className='boost'>+{boostPercentage}%</span>}
			</div>
			<div className='info-row'>
				<span className='price'>${price} COP</span>
				{missing && <span className='missing'>${missing} COP MISSING</span>}
				<span className='people'>
					{peopleCount}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='14'
						height='14'
						viewBox='0 0 24 24'
						fill='currentColor'
						style={{ marginLeft: '4px' }}
					>
						<path d='M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.02 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' />
					</svg>
				</span>
			</div>
		</div>
	);
};

export default ItineraryHighlight;
