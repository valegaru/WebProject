import React, { useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import CardList from '../../components/cardList/CardList';
import mapImage from '../../assets/map.png';

import restaurants from '../../assets/restaurants.png';
import activities from '../../assets/activities.png';
import destinations from '../../assets/destinations.png';
import citiesEurope from '../../assets/citiesEurope.png';
import latamTour from '../../assets/latamGroup.png';
import paris from '../../assets/paris.png';
import newYork from '../../assets/newYork.png';
import thailand from '../../assets/thailand.png';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {

	useEffect(()=>{

	},[])

	const savedList = [
		{ image: restaurants, label: 'Restaurants' },
		{ image: activities, label: 'Activities' },
		{ image: destinations, label: 'Destinations' },
		{ image: citiesEurope, label: 'Cities of Europe' },
	];

	const tripsBURN = [
		{ image: latamTour, label: 'Latam Tour', date: 'Jan 16 - May 24/25', numberMembers: 'hola' },
		{ image: destinations, label: 'Rio Janeiro', date: 'Jan 16 - May 24/25', numberMembers: 'hi' },
		{ image: paris, label: 'Paris Voyage', date: 'Jan 16 - May 24/25', numberMembers: 'hi' },
		{ image: newYork, label: 'New York', date: 'Jan 16 - May 24/25', numberMembers: 'hi' },
	];

	const matches = [
		{ image: thailand, label: 'Thailand' },
		{ image: destinations, label: 'Rio Janeiro' },
		{ image: paris, label: 'Paris' },
		{ image: newYork, label: 'New York' },
	];

	const storeState = useSelector((state) => state);
	useEffect(() => {
		console.log('Redux Store:', JSON.stringify(storeState, null, 2));
	}, []);

	return (
		<div className='home-container'>
			<Navbar />
			<div className='map-section'>
				<img src={mapImage} alt='World Map' className='map-image' />
				<input type='text' placeholder='Search for a location' className='search-bar' />
			</div>

			<h2 className='home-title'>Hi, Juan!</h2>

			<div className='section'>
				<CardList title='Saved list' cardsData={savedList} variantColor='saved' />
			</div>

			<div className='section'>
				<CardList title='Trips' cardsData={trips} variantColor='trips' />
			</div>

			<div className='section'>
				<CardList title='Destination Matches' cardsData={matches} variantColor='matches' />
			</div>
		</div>
	);
};

export default Home;
