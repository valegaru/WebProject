import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CardCity from '../../components/CardCity/CardCity';

function MatchmakerSelection() {
	const cities = [
		{
			name: 'Barcelona',
			image:
				'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg',
			aesthetic: 'Stunning architecture.',
			vibe: 'Beachside relaxation and nightlife.',
			gastronomy: 'Tapas, paella, and fresh seafood.',
			renowned: 'Football, art, history, and Mediterranean sunsets.',
			activities: [
				{
					image:
						'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/d7/0b/9c/salon-principal.jpg?w=900&h=500&s=1',
					label: '7 Portes',
				},
				{
					image:
						'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/e6/28/1a/opium-mar-club.jpg?w=1200&h=-1&s=1',
					label: 'Opium',
				},
				{
					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFhHLNIJtwWE48GdslCOHhkmqikXHQrJLf2g&s',
					label: 'National Art Museum of Catalonia',
				},
			],
			attractions: [
				{
					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRX1Aljp-xBwkgIDW5LKS336X9OMYzp5xAjA&s',
					label: 'La Sagrada Familia',
				},
				{
					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz2SqFo8Z2vNKfmqSi4uxzWJkNa65DcGD5fQ&s',
					label: 'Park Güell',
				},
				{
					image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Casa_Mil%C3%A0%2C_general_view.jpg',
					label: 'Casa Milà',
				},
			],
		},
		{
			name: 'Kyoto',
			image: '/assets/kyoto.jpg',
			aesthetic: 'Traditional temples and cherry blossoms.',
			vibe: 'Tranquil, historic, and spiritual.',
			gastronomy: 'Kaiseki, matcha, and ramen.',
			renowned: 'Geishas, bamboo forests, and Zen gardens.',
			activities: [
				{ image: '/assets/kaiseki.jpg', label: 'Kaiseki Dinner' },
				{ image: '/assets/tea.jpg', label: 'Tea Ceremony' },
				{ image: '/assets/geisha.jpg', label: 'Geisha Show' },
			],
			attractions: [
				{ image: '/assets/fushimi.jpg', label: 'Fushimi Inari Shrine' },
				{ image: '/assets/forest.jpg', label: 'Arashiyama Bamboo Grove' },
				{ image: '/assets/golden.jpg', label: 'Kinkaku-ji (Golden Pavilion)' },
			],
		},
		
	];

	const [currentIndex, setCurrentIndex] = useState(0);

	const handleLike = () => {
		console.log('Liked:', cities[currentIndex].name);
		goToNextCity();
	};

	const handleDislike = () => {
		console.log('Disliked:', cities[currentIndex].name);
		goToNextCity();
	};

	const goToNextCity = () => {
		if (currentIndex < cities.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			alert('🏁 ¡Has visto todos los destinos!');
			// Aquí podrías redirigir o mostrar una pantalla de resumen
		}
	};

	return (
		<>
			<Navbar />
			<CardCity city={cities[currentIndex]} onLike={handleLike} onDislike={handleDislike} />
		</>
	);
}

export default MatchmakerSelection;
