import React from 'react';
import './Home.css';
import Navbar from '../../components/Navbar';
import CardList from '../../components/cardList/cardList';
import mapImage from '../../assets/map.png';

import restaurants from '../../assets/restaurants.png';
import activities from '../../assets/activities.png';
import destinations from '../../assets/destinations.png';
import citiesEurope from '../../assets/citiesEurope.png';
import latamTour from '../../assets/latamGroup.png';
import paris from '../../assets/paris.png';
import newYork from '../../assets/newYork.png';
import thailand from '../../assets/thailand.png';

const Home = () => {
	const savedList = [
		{ image: restaurants, label: 'Restaurants' },
		{ image: activities, label: 'Activities' },
		{ image: destinations, label: 'Destinations' },
		{ image: citiesEurope, label: 'Cities of Europe' },
	];

	const trips = [
		{ image: latamTour, label: 'Latam Tour', date:'Jan 16 - May 24/25', numberMembers:'hola' },
		{ image: destinations, label: 'Rio Janeiro', date:'Jan 16 - May 24/25', numberMembers:'hi' },
		{ image: paris, label: 'Paris Voyage', date:'Jan 16 - May 24/25', numberMembers:'hi' },
		{ image: newYork, label: 'New York', date:'Jan 16 - May 24/25', numberMembers:'hi' },
	];

	const matches = [
		{ image: thailand, label: 'Thailand' },
		{ image: destinations, label: 'Rio Janeiro' },
		{ image: paris, label: 'Paris' },
		{ image: newYork, label: 'New York' },
	];

	return (
		<div className='home-container'>
			<Navbar />

			<div className='map-section'>
				<img src={mapImage} alt='World Map' className='map-image' />
				<input type='text' placeholder='Search for a location' className='search-bar' />
			</div>

			<h2 className='home-title'>Hi, Juan!</h2>

			{/* Saved List */}
			<div className='section'>
      <CardList title='Saved list' cardsData={savedList} variantColor='saved' />

			</div>

			{/* Trips */}
			<div className='section'>
      <CardList title='Trips' cardsData={trips} variantColor='trips' />

			</div>

			{/* Destination Matches */}
			<div className='section'>
      <CardList title='Destination Matches' cardsData={matches} variantColor='matches' />

			</div>
		</div>
	);
};

export default Home;

// // src/pages/Home.jsx
// import React from 'react';
// import './Home.css';
// import Navbar from '../../components/Navbar';
// import CardList from '../../components/cardList/cardList';
// import mapImage from '../../assets/map.png';
// import '../../assets/restaurants.png';

// const Home = () => {
// 	// Ejemplo de datos para distintas secciones
// 	const savedList = [
// 		{ image: '../../assets/restaurants.png', label: 'Restaurants' },
// 		{ image: '../../assets/activities.png', label: 'Activities' },
// 		{ image: '../../assets/destinations.png', label: 'Destinations' },
// 		{ image: '../../assets/citiesEurope.png', label: 'Cities of Europe' },
// 	];

// 	const trips = [
// 		{ image: 'https://via.placeholder.com/160x120', label: 'Latam Tour' },
// 		{ image: 'https://via.placeholder.com/160x120', label: 'Rio Janeiro' },
// 		{ image: 'https://via.placeholder.com/160x120', label: 'Paris Voyage' },
// 		{ image: 'https://via.placeholder.com/160x120', label: 'New York' },
// 	];

// 	const destinationMatches = [
// 		{ image: 'https://via.placeholder.com/160x120', label: 'Thailand' },
// 		{ image: 'https://via.placeholder.com/160x120', label: 'Rio Janeiro' },
// 		{ image: 'https://via.placeholder.com/160x120', label: 'Paris' },
// 		{ image: 'https://via.placeholder.com/160x120', label: 'New York' },
// 	];

// 	return (
// 		<div className='home-container'>
// 			<h1 className='home-title'>Hi, Juan!</h1>

// 			{/* Saved List Section */}
// 			<section className='section'>
// 				<div className='section-title saved'>Saved list</div>
// 				<span className='add-button'>+</span>
// 				<div className='card-list'>
// 					{savedList.map((item, index) => (
// 						<div className='card saved' key={index}>
// 							<img src={item.image} alt={item.title} />
// 							<div className='card-title'>{item.title}</div>
// 						</div>
// 					))}
// 				</div>
// 			</section>

// 			{/* Trips Section */}
// 			<section className='section'>
// 				<div className='section-title trips'>
// 					Trips <span className='add-button'>+</span>
// 				</div>
// 				<div className='card-list'>
// 					{trips.map((item, index) => (
// 						<div className='card trips' key={index}>
// 							<img src={item.image} alt={item.title} />
// 							<div className='card-title'>
// 								{item.title}
// 								<br />
// 								<small>{item.date}</small>
// 							</div>
// 						</div>
// 					))}
// 				</div>
// 				<div className='watch-more'>Watch more →</div>
// 			</section>

// 			{/* Destination Matches Section */}
// 			<section className='section'>
// 				<div className='section-title matches'>
// 					Destination Matches <span className='add-button'>+</span>
// 				</div>
// 				<div className='card-list'>
// 					{destinationMatches.map((item, index) => (
// 						<div className='card matches' key={index}>
// 							<img src={item.image} alt={item.title} />
// 							<div className='card-title'>{item.title}</div>
// 						</div>
// 					))}
// 				</div>
// 				<div className='watch-more'>Watch more →</div>
// 			</section>
// 		</div>
// 	);
// };

// 		<div className='home-container'>
// 			<Navbar />

// 			<div className='map-section'>
// 				<img src={mapImage} alt='World Map' className='map-image' />
// 				<input type='text' placeholder='Search for a location' className='search-bar' />
// 			</div>

// 			<h2 className='greeting'>Hi, Juan!</h2>

// 			<CardList title='Saved list' cardsData={savedListCards} />
// 			<CardList title='Trips' cardsData={tripCards} />
// 			<CardList title='Destination Matches' cardsData={matchCards} />
// 		</div>
// 	);
// };

// export default Home;

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
