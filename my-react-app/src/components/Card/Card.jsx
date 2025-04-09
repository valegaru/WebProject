import React from 'react';
import './card.css';

const Card = ({ image, label, onClick, variant = 'default' }) => {
	return (
		<div className={`custom-card ${variant}`} onClick={onClick}>
			<img src={image} alt={label} className='card-img' />
			<div className='card-label'>
				<p>{label}</p>
			</div>
		</div>
	);
};

export default Card;



// import React, { useState } from 'react';
// import './card.css';

// const Card = ({ image, label, onClick, variant = 'default' }) => {
// 	return (
// 		<div className={`custom-card ${variant}`} onClick={onClick}>
// 			<img src={image} alt={label} className='card-img' />
// 			<div className='card-label'>
// 				<p>{label}</p>
// 			</div>
// 		</div>
// 	);
// };

// export default Card;

