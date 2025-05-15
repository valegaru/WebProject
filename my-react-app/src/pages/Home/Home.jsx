import React, { useEffect, useState } from 'react';
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

import { useSelector } from 'react-redux';
import { fetchTripsFromUser } from '../../utils/firebaseUtils';

const Home = () => {
	const uid = useSelector((state) => state.auth.userId);
	const name = useSelector((state) => state.auth.username);

	const [trips, setTrips] = useState([]);

	useEffect(() => {
		const loadTrips = async () => {
			if (!uid) return;
			const fetchedTrips = await fetchTripsFromUser(uid);
			const formattedTrips = fetchedTrips.map(trip => ({
				id: trip.id,
				tripPic: trip.tripPic || destinations,
				name: trip.name || 'Unnamed Trip',
				startDate: trip.startDate,
				endDate: trip.endDate,
				description: trip.description || '',
				participants: trip.participants || [],
				onClick: () => console.log(`Clicked on trip: ${trip.id}`)
			}));
			setTrips(formattedTrips);
		};

		loadTrips();
	}, [uid]);

	const savedList = [
		{ tripPic: restaurants, name: 'Restaurants' },
		{ tripPic: activities, name: 'Activities' },
		{ tripPic: destinations, name: 'Destinations' },
		{ tripPic: citiesEurope, name: 'Cities of Europe' },
	];

	const matches = [
		{ tripPic: thailand, name: 'Thailand' },
		{ tripPic: destinations, name: 'Rio Janeiro' },
		{ tripPic: paris, name: 'Paris' },
		{ tripPic: newYork, name: 'New York' },
	];

	return (
		<div className='home-container'>
			<Navbar />
			<div className='map-section'>
				<img src={mapImage} alt='World Map' className='map-image' />
				<input type='text' placeholder='Search for a location' className='search-bar' />
			</div>

			<h2 className='home-title'>Hi, {name}</h2>

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
