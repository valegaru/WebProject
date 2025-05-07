import React from 'react';
import './banner.css';
import { useNavigate } from 'react-router-dom';

const Banner = ({ title, subtitle, description, buttonText, backgroundImage, buttonRoute  }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (buttonRoute) {
			navigate(buttonRoute);
		}
	};

	return (
		<section className='banner' style={{ backgroundImage: `url(${backgroundImage})` }}>
			<div className='banner-text'>
				<h1>{title}</h1>
				<h2>{subtitle}</h2>
				<p>{description}</p>
				<button className='banner-button' onClick={handleClick}>
					{buttonText} <strong>Now</strong>
				</button>
			</div>
			<div className='sticker'>✈️ Postal Trip</div>
		</section>
	);
};
export default Banner;
