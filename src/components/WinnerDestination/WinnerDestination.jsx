import React from 'react';
import './WinnerDestination.css';
import { useNavigate } from 'react-router-dom';

const WinnerDestination = ({ city }) => {
	const navigate = useNavigate();

	const handleCreateTrip = () => {
		navigate('/tripcreation');
	};

	const handleBackHome = () => {
		navigate('/home');
	};

	return (
		<div className='card-city winner-card'>
			<div className='city-image-container'>
				<img src={city.image} alt={city.name} className='city-image' />
				<div className='image-gradient' />
				<h2 className='city-name-overlay'>
					{city.name} {city.flag && <img src={city.flag} alt='flag' className='flag-icon' />}
				</h2>
			</div>

			<div className='card-city-content winner-content'>
				<button className='banner-button' onClick={handleCreateTrip}>
					Create a trip <strong>group</strong>
				</button>
				<button className='banner-button' onClick={handleBackHome}>
					Go to Home
				</button>
			</div>
		</div>
	);
};

export default WinnerDestination;
