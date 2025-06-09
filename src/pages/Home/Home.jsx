import React, { useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';

import mapImage from '../../assets/map.png';

import restaurants from '../../assets/restaurants.png';
import activities from '../../assets/activities.png';
import destinations from '../../assets/destinations.png';
import citiesEurope from '../../assets/citiesEurope.png';
import latamTour from '../../assets/latamGroup.png';
import paris from '../../assets/paris.png';
import newYork from '../../assets/newYork.png';
import thailand from '../../assets/thailand.png';

import { useSelector, useDispatch } from 'react-redux';
import { fetchTripsFromUser, getSavedLists } from '../../utils/firebaseUtils';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/Map/MapComponent/MapComponent';
import CardList from '../../components/CardList/CardList';
import { clearMapMarkers, setMapType } from '../../store/mapInfo/MapInfo';


const Home = () => {
	const navigate = useNavigate();
	const reduxState = useSelector((state) => state)
	const uid = useSelector((state) => state.auth.userId);
	const name = useSelector((state) => state.auth.username);
	const dispatch = useDispatch();
	console.log(reduxState, "redux")
	const [savedList, setSavedList] = useState([]);
	const [trips, setTrips] = useState([]);

	useEffect(() => {
	dispatch(clearMapMarkers())
	dispatch(setMapType("places"))
	const loadData = async () => {
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
			onClick: () => navigate(`/TripPlanner/${trip.id}`)
		}));
		setTrips(formattedTrips);

		const fetchedSavedLists = await getSavedLists(uid);
		const formattedSavedLists = fetchedSavedLists.map(list => ({
			id: list.id,
			tripPic: list.tripPic || destinations, 
			name: list.name || 'Untitled List',
			onClick: () => navigate(`/List/${list.id}`)
		}));
		setSavedList(formattedSavedLists);
	};

	loadData();
}, [uid]);

	const matches = [
		{ tripPic: thailand, name: 'Thailand' },
		{ tripPic: destinations, name: 'Rio Janeiro' },
		{ tripPic: paris, name: 'Paris' },
		{ tripPic: newYork, name: 'New York' },
	];

	return (
		<div className='home-container'>
			<Navbar />
			<MapComponent>
			</MapComponent>

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
