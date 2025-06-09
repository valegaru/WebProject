import React from 'react';
import Card from '../Card/Card';
import './CardList.css';
import arrowBlue from '../../assets/arrow-watchMore-blue.svg';
import arrowYellow from '../../assets/arrow-watchMore-yellow.svg';
import arrowTerra from '../../assets/arrow-watchMore-red.svg';
import arrowGreen from '../../assets/arrow-watchMore-green.png';
import { createExpense, sharedIdGenerator } from '../../utils/firebaseUtils';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { doc } from 'firebase/firestore';
import { db } from '../../services/firebase';


const CardList = ({ title, cardsData, variantColor = 'default' }) => {

	const date = useSelector((state)=> state.date.selectedDate)
	const {tripId} = useParams()

	const handleClickPlus = () => {
	const tripRef = doc(db, 'trips', tripId); 
	const sharedId = sharedIdGenerator(tripRef);
	createExpense(tripRef, [], date, sharedId); 
};
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
				<button className='circle-btn' onClick={() => handleClickPlus()}>+</button>
			</div>

			<div className='cards-section'>
				{cardsData.map((card, index) => (
					<Card
						key={index}
						id={card.tripId}
						tripPic={card.tripPic}
						name={card.name}
						startDate={card.startDate}
						endDate={card.endDate}
						description={card.description}
						participants={card.participants}
						onClick={card.onClick}
						variant={variantColor}
					/>
				))}

				<div className='watch-more'>
					<button className='arrow-btn'>
						<img src={arrowIcon} alt='watch more' className='arrow-image' onClick={() => console.log("AROW")}/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default CardList;