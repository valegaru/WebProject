// src/pages/Home.jsx
import React from 'react';
import './Home.css';
import Navbar from '../../components/Navbar';
import CardList from '../../components/cardList/cardList';
import mapImage from '../../assets/map.png';
import '../../assets/restaurants.png'

const Home = () => {
	// Ejemplo de datos para distintas secciones
	const savedListCards = [
		{ image: '../../assets/restaurants.png', label: 'Restaurants' },
		{ image: '../../assets/activities.png', label: 'Activities' },
		{ image: '../../assets/destinations.png', label: 'Destinations' },
		{ image: '../../assets/citiesEurope.png', label: 'Cities of Europe' },
	];

	const tripCards = [
		{ image: 'https://via.placeholder.com/160x120', label: 'Latam Tour' },
		{ image: 'https://via.placeholder.com/160x120', label: 'Rio Janeiro' },
		{ image: 'https://via.placeholder.com/160x120', label: 'Paris Voyage' },
		{ image: 'https://via.placeholder.com/160x120', label: 'New York' },
	];

	const matchCards = [
		{ image: 'https://via.placeholder.com/160x120', label: 'Thailand' },
		{ image: 'https://via.placeholder.com/160x120', label: 'Rio Janeiro' },
		{ image: 'https://via.placeholder.com/160x120', label: 'Paris' },
		{ image: 'https://via.placeholder.com/160x120', label: 'New York' },
	];

	return (
		<div className='home-container'>
			<Navbar />

			<div className='map-section'>
				<img src={mapImage} alt='World Map' className='map-image' />
				<input type='text' placeholder='Search for a location' className='search-bar' />
			</div>

			<h2 className='greeting'>Hi, Juan!</h2>

			<CardList title='Saved list' cardsData={savedListCards} />
			<CardList title='Trips' cardsData={tripCards} />
			<CardList title='Destination Matches' cardsData={matchCards} />
		</div>
	);
};

export default Home;

// import React from 'react';
// import './home.css';
// import Navbar from '../../components/Navbar';
// import CardList from '../../components/cardList/cardList';

// // Puedes usar cualquier imagen de mapa temporalmente
// import mapImage from '../../assets/map.png';

// const Home = () => {
// 	return (
// 		<div className='home'>
// 			<Navbar />

// 			{/* Sección del mapa con barra de búsqueda */}
// 			<div className='map-section'>
// 				<img src={mapImage} alt='World Map' className='map-image' />
// 				<input type='text' placeholder='Search for a location...' className='search-bar' />
// 			</div>

// 			<div className='home-content'>
// 				<h2 className='welcome-message'>Hi, Juan!</h2>

// 				{/* Card Lists */}
// 				<CardList
// 					title='Saved list'
// 					cards={[
// 						{ title: 'Restaurants', img: '/restaurants.jpg' },
// 						{ title: 'Activities', img: '/activities.jpg' },
// 						{ title: 'Destinations', img: '/destinations.jpg' },
// 						{ title: 'Cities of Europe', img: '/cities-europe.jpg' },
// 					]}
// 				/>

// 				<CardList
// 					title='Trips'
// 					cards={[
// 						{ title: 'Latam Tour', img: '/latam.jpg', date: 'Jan 12 - Mar 3/25' },
// 						{ title: 'Rio Janeiro', img: '/rio.jpg', date: 'Feb 2025' },
// 						{ title: 'Paris Voyage', img: '/paris.jpg', date: 'Apr 2025' },
// 						{ title: 'New York', img: '/ny.jpg', date: 'Feb 2025' },
// 					]}
// 					color='yellow'
// 				/>

// 				<CardList
// 					title='Destination Matches'
// 					cards={[
// 						{ title: 'Thailand', img: '/thailand.jpg' },
// 						{ title: 'Rio Janeiro', img: '/rio.jpg' },
// 						{ title: 'Paris', img: '/paris.jpg' },
// 						{ title: 'New York', img: '/ny.jpg' },
// 					]}
// 					color='brown'
// 				/>
// 			</div>
// 		</div>
// 	);
// };

// export default Home;
