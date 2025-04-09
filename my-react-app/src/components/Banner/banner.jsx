import React from 'react';
import './banner.css';

const Banner = () => {
	return (
		<section className='banner'>
			<div className='banner-text'>
				<h1>Postal Trip</h1>
				<h2>Plan it together, live it better.</h2>
				<p>
					Tired of chaotic trip planning? With Postal Trip, you and your friends can
					seamlessly organize itineraries, split expenses, and decide on destinations
					together—all in one place.
				</p>
				<button className='banner-button'>Start planing your trip <strong>Now</strong></button>
			</div>
			<div className='sticker'>✈️ Postal Trip</div>
		</section>
	);
};

export default Banner;
