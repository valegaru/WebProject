import React from 'react';
import './banner.css';

const Banner = ({ title, subtitle, description, buttonText, backgroundImage }) => {
	return (
		<section className='banner' style={{ backgroundImage: `url(${backgroundImage})` }}>
			<div className='banner-text'>
				<h1>{title}</h1>
				<h2>{subtitle}</h2>
				<p>{description}</p>
				<button className='banner-button'>
					{buttonText} <strong>Now</strong>
				</button>
			</div>
			<div className='sticker'>✈️ Postal Trip</div>
		</section>
	);
};
export default Banner;
