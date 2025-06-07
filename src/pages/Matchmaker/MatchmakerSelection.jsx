// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../../components/Navbar/Navbar';
// import CardCity from '../../components/CardCity/CardCity';
// import "./MatchmakerSelection.css";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import CardCity from '../../components/CardCity/CardCity';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './MatchmakerSelection.css';

function MatchmakerSelection() {
	const { roomId } = useParams(); // Este es el ID del documento en matchLists
	const navigate = useNavigate();
	const [cities, setCities] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [votes, setVotes] = useState({});

	useEffect(() => {
		const fetchCities = async () => {
			const roomRef = doc(db, 'matchLists', roomId);
			const roomSnap = await getDoc(roomRef);
			if (roomSnap.exists()) {
				setCities(roomSnap.data().destinations || []);
			} else {
				alert('Sala no encontrada');
				navigate('/');
			}
		};
		fetchCities();
	}, [roomId, navigate]);

	const goToNextCity = () => {
		if (currentIndex < cities.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			handleSubmitVotes();
		}
	};

	const handleLike = () => {
		const cityName = cities[currentIndex].name || cities[currentIndex];
		setVotes((prev) => ({ ...prev, [cityName]: 'like' }));
		goToNextCity();
	};

	const handleDislike = () => {
		const cityName = cities[currentIndex].name || cities[currentIndex];
		setVotes((prev) => ({ ...prev, [cityName]: 'dislike' }));
		goToNextCity();
	};

	const handleSubmitVotes = async () => {
		const userId = Date.now().toString(); // Puedes reemplazarlo por user.uid si tienes auth
		const matchRef = doc(db, 'matchLists', roomId);

		try {
			await updateDoc(matchRef, {
				[`votes.${userId}`]: votes,
			});
			navigate(`/results/${roomId}`);
		} catch (error) {
			console.error('Error guardando los votos:', error);
			alert('Hubo un error al guardar tus votos. Intenta de nuevo.');
		}
	};

	return (
		<>
			<Navbar />
			{cities.length > 0 && <CardCity city={cities[currentIndex]} onLike={handleLike} onDislike={handleDislike} />}
		</>
	);
}

export default MatchmakerSelection;

// function MatchmakerSelection() {
// 	const navigate = useNavigate();

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
// 		{
// 			name: 'Kyoto',
// 			image: 'https://boutiquejapan.com/wp-content/uploads/2019/07/yasaka-pagoda-higashiyama-kyoto-japan-1140x761.jpg',
// 			aesthetic: 'Traditional temples and cherry blossoms.',
// 			vibe: 'Tranquil, historic, and spiritual.',
// 			gastronomy: 'Kaiseki, matcha, and ramen.',
// 			renowned: 'Geishas, bamboo forests, and Zen gardens.',
// 			activities: [
// 				{
// 					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2RigRZJ4XGSGf_dAyzvYTabTvDWljhNNZlg&s',
// 					label: 'Kaiseki Dinner',
// 				},
// 				{
// 					image: 'https://d2j57bp7wdztc7.cloudfront.net/pages/images/tea-ceremony/tea-ceremony-gion-01.jpg',
// 					label: 'Tea Ceremony',
// 				},
// 				{ image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/13/bc/d4/bc.jpg',
// label: 'Geisha Show' },
// 			],
// 			attractions: [
// 				{
// 					image:
// 						'//https:es.cloudinary.com/jnto/image/upload/w_750,h_503,fl_lossy,f_auto/v1648523563/kyoto/20201026_fushimi_inari_taisha_shrine_01',
// 					label: 'Fushimi Inari Shrine',
// 				},
// 				{
// 					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGS3pzLfCXr0di0Mrgd_R56tYy4DrwNF-Blw&s',
// 					label: 'Arashiyama Bamboo Grove',
// 				},
// 				{
// 					image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9j4jI_NuLic6fnjcEPZZ-kMzORfL9m9v7A&s',
// 					label: 'Kinkaku-ji (Golden Pavilion)',
// 				},
// 			],
// 		},
// 	];

// 	const [currentIndex, setCurrentIndex] = useState(0);

// 	const handleLike = () => {
// 		console.log('Liked:', cities[currentIndex].name);
// 		goToNextCity();
// 	};

// 	const handleDislike = () => {
// 		console.log('Disliked:', cities[currentIndex].name);
// 		goToNextCity();
// 	};

// 	const goToNextCity = () => {
// 		if (currentIndex < cities.length - 1) {
// 			setCurrentIndex(currentIndex + 1);
// 		} else {
// 			navigate('/results'); // 👈 cambiar a la ruta que vos quieras
// 		}
// 	};

// 	return (
// 		<>
// 			<Navbar />
// 			<CardCity city={cities[currentIndex]} onLike={handleLike} onDislike={handleDislike} />
// 		</>
// 	);
// }

// export default MatchmakerSelection;
