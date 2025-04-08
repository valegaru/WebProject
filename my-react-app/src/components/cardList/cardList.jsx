import React from 'react';
import Card from '../card/Card';
import './CardList.css';
// import { ReactComponent as WatchMoreIcon } from '../../assets/arrow-watchMore.svg?react';
import arrowBlue from '../../assets/arrow-watchMore-blue.svg';
import arrowYellow from '../../assets/arrow-watchMore-yellow.svg';
import arrowTerra from '../../assets/arrow-watchMore-red.svg';

const CardList = ({ title, cardsData, variant = 'default' }) => {
	let arrowIcon;

	switch (variant) {
		case 'trips':
			arrowIcon = arrowYellow;
			break;
		case 'matches':
			arrowIcon = arrowTerra;
			break;
		default:
			arrowIcon = arrowBlue;
	}
	return (
		<div className={`card-list-container ${variant}`}>
			<div className='header-buttons'>
				<h2 className='title'>{title}</h2>
				<button className='circle-btn'>+</button>
			</div>

			<div className='cards-section'>
				{cardsData.map((card, index) => (
					<Card key={index} image={card.image} label={card.label} variant={variant} />
				))}

				<div className='watch-more'>
					<button className='arrow-btn'>
						<img src={arrowIcon} alt='watch more' className='arrow-image' />
					</button>
				</div>

				{/* <div className='watch-more'>
					<button className='arrow-btn'>
						<WatchMoreIcon className='arrow-icon' />
					</button>
				</div> */}

				{/* <div className='watch-more'>
					<button className={`arrow-btn ${variant}`}>
						<img src={WatchMore} className='arrow-icon' />
					</button>
				</div> */}
			</div>
		</div>
	);
};

export default CardList;

// import React, { useState } from 'react';
// import Card from '../card/Card';
// import './CardList.css';
// import watchMore from '../../assets/arrow-watchMore.svg';

// // const cardsData = [
// //   { title: 'Saved List' },
// //   {
// //     image: 'https://via.placeholder.com/160x120',
// //     label: 'Restaurants',
// //   },
// //   {
// //     image: 'https://via.placeholder.com/160x120',
// //     label: 'Activities',
// //   },
// //   {
// //     image: 'https://via.placeholder.com/160x120',
// //     label: 'Destinations',
// //   },
// //   {
// //     image: 'https://via.placeholder.com/160x120',
// //     label: 'Cities of Europe',
// //   },
// // ];

// const CardList = ({ title, cardsData }) => {
// 	return (
// 		<div className='card-list-container'>
// 			<div className='header-buttons'>
// 				<h2 className='title'>{title}</h2>
// 				<button className='circle-btn'>+</button>
// 			</div>

// 			<div className='cards-section'>
// 				{cardsData.map((card, index) => (
// 					<Card key={index} image={card.image} label={card.label} />
// 				))}

// 				<div className='watch-more'>
// 					<button className='arrow-btn'>
// 						<img src={watchMore} className='arrow-image' />
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CardList;

// const CardList = () => {
// 	const cardsData = [
// 		{ title: 'Saved List' },
// 		{
// 			image: 'https://via.placeholder.com/160x120',
// 			label: 'Restaurants',
// 		},
// 		{
// 			image: 'https://via.placeholder.com/160x120',
// 			label: 'Activities',
// 		},
// 		{
// 			image: 'https://via.placeholder.com/160x120',
// 			label: 'Destinations',
// 		},
// 		{
// 			image: 'https://via.placeholder.com/160x120',
// 			label: 'Cities of Europe',
// 		},
// 	];

// 	return (
// 		<div className='card-list-container'>
// 			<div className='header-buttons'>
// 				<h2 className='title'>{}</h2>
// 				<button className='circle-btn'>+</button>
// 			</div>

// 			<div className='cards-section'>
// 				{cardsData.map((card, index) => (
// 					<Card key={index} image={card.image} label={card.label} />
// 				))}

// 				<div className='watch-more'>
// 					<button className='arrow-btn'>
// 						<img src='../../assets/arrow-watchMore.svg' alt='Watch more' className='arrow-icon' />
// 					</button>
// 					<p>Watch more</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CardList;
