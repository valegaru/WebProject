import React, { useState } from 'react';
import './card.css';

const Card = ({ image, label, onClick }) => {
	return (
		<div className='custom-card' onClick={onClick}>
			<img src={image} alt={label} className='card-img' />
			<div className='card-label'>
				<p>{label}</p>
			</div>
		</div>
	);
};

export default Card;
