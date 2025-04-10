import React from 'react';
import Card from '../Card/Card';
import './CardList.css';
import arrowBlue from '../../assets/arrow-watchMore-blue.svg';
import arrowYellow from '../../assets/arrow-watchMore-yellow.svg';
import arrowTerra from '../../assets/arrow-watchMore-red.svg';
import arrowGreen from '../../assets/arrow-watchMore-green.png';

const CardList = ({ title, cardsData, variantColor = 'default' }) => {
	let arrowIcon;

	switch (variantColor) {
		case 'green':
			arrowIcon = arrowGreen;
			break;
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
		<div className={`card-list-container ${variantColor}`}>
			<div className='header-buttons'>
				<h2 className='title'>{title}</h2>
				<button className='circle-btn'>+</button>
			</div>

			<div className='cards-section'>
				{cardsData.map((card, index) => (
					<Card
						key={index}
						image={card.image}
						label={card.label}
						date={card.date}
						variant={variantColor}
						onClick={card.onClick} // opcional
					/>
				))}

				<div className='watch-more'>
					<button className='arrow-btn'>
						<img src={arrowIcon} alt='watch more' className='arrow-image' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CardList;