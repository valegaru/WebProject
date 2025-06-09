import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import CardCity from '../../components/CardCity/CardCity';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './MatchmakerSelection.css';

function MatchmakerSelection() {
	const { roomId } = useParams(); // Este es el ID de la sala
	const navigate = useNavigate();
	const [cities, setCities] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [votes, setVotes] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDestinations = async () => {
			try {
				const roomRef = doc(db, 'matchLists', roomId);
				const roomSnap = await getDoc(roomRef);

				if (roomSnap.exists()) {
					const data = roomSnap.data();
					setCities(data.destinations || []);
				} else {
					alert('Sala no encontrada');
					navigate('/');
				}
			} catch (error) {
				console.error('Error al cargar los destinos:', error);
				alert('Error al conectar con la sala.');
				navigate('/');
			} finally {
				setLoading(false);
			}
		};

		fetchDestinations();
	}, [roomId, navigate]);

	const handleVote = (type) => {
		const cityName = cities[currentIndex].name || cities[currentIndex];
		const updatedVotes = { ...votes, [cityName]: type };
		setVotes(updatedVotes);

		if (currentIndex < cities.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			handleSubmitVotes(updatedVotes); // 👈 aseguramos que se guarde el último voto
		}
	};

	const handleLike = () => handleVote('like');
	const handleDislike = () => handleVote('dislike');

	const handleSubmitVotes = async (finalVotes = votes) => {
		const auth = getAuth();
		const user = auth.currentUser;
		const userId = user?.uid;

		if (!userId) {
			alert('Debes iniciar sesión para votar.');
			navigate('/login');
			return;
		}

		const matchRef = doc(db, 'matchLists', roomId);

		try {
			await updateDoc(matchRef, {
				[`votes.${userId}`]: finalVotes,
			});
			navigate(`/results/${roomId}`);
		} catch (error) {
			console.error('Error guardando los votos:', error);
			alert('Hubo un error al guardar tus votos. Intenta de nuevo.');
		}
	};

	const city = cities[currentIndex];

	return (
		<>
			<Navbar />
			{loading ? (
				<p className='loading-message'>Cargando destinos...</p>
			) : cities.length > 0 && city ? (
				<CardCity city={city} onLike={handleLike} onDislike={handleDislike} />
			) : (
				<p className='error-message'>No se encontraron destinos para esta sala.</p>
			)}
		</>
	);
}

export default MatchmakerSelection;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Navbar from '../../components/Navbar/Navbar';
// import CardCity from '../../components/CardCity/CardCity';
// import { db } from '../../services/firebase';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import './MatchmakerSelection.css';

// function MatchmakerSelection() {
// 	const { roomId } = useParams(); // Este es el ID de la sala
// 	const navigate = useNavigate();
// 	const [cities, setCities] = useState([]);
// 	const [currentIndex, setCurrentIndex] = useState(0);
// 	const [votes, setVotes] = useState({});
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		const fetchDestinations = async () => {
// 			try {
// 				const roomRef = doc(db, 'matchLists', roomId);
// 				const roomSnap = await getDoc(roomRef);

// 				if (roomSnap.exists()) {
// 					const data = roomSnap.data();
// 					setCities(data.destinations || []);
// 				} else {
// 					alert('Sala no encontrada');
// 					navigate('/');
// 				}
// 			} catch (error) {
// 				console.error('Error al cargar los destinos:', error);
// 				alert('Error al conectar con la sala.');
// 				navigate('/');
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchDestinations();
// 	}, [roomId, navigate]);

// 	const goToNextCity = () => {
// 		if (currentIndex < cities.length - 1) {
// 			setCurrentIndex(currentIndex + 1);
// 		} else {
// 			handleSubmitVotes();
// 		}
// 	};

// 	const handleLike = () => {
// 		const cityName = cities[currentIndex].name || cities[currentIndex];
// 		setVotes((prev) => ({ ...prev, [cityName]: 'like' }));
// 		goToNextCity();
// 	};

// 	const handleDislike = () => {
// 		const cityName = cities[currentIndex].name || cities[currentIndex];
// 		setVotes((prev) => ({ ...prev, [cityName]: 'dislike' }));
// 		goToNextCity();
// 	};

// 	const handleSubmitVotes = async () => {
// 		const auth = getAuth();
// 		const user = auth.currentUser;
// 		const userId = user?.uid;

// 		if (!userId) {
// 			alert('Debes iniciar sesión para votar.');
// 			navigate('/login');
// 			return;
// 		}

// 		const matchRef = doc(db, 'matchLists', roomId);

// 		try {
// 			await updateDoc(matchRef, {
// 				[`votes.${userId}`]: votes,
// 			});
// 			navigate(`/results/${roomId}`);
// 		} catch (error) {
// 			console.error('Error guardando los votos:', error);
// 			alert('Hubo un error al guardar tus votos. Intenta de nuevo.');
// 		}
// 	};

// 	const city = cities[currentIndex];

// 	return (
// 		<>
// 			<Navbar />
// 			{loading ? (
// 				<p className='loading-message'>Cargando destinos...</p>
// 			) : cities.length > 0 && city ? (
// 				<CardCity city={city} onLike={handleLike} onDislike={handleDislike} />
// 			) : (
// 				<p className='error-message'>No se encontraron destinos para esta sala.</p>
// 			)}
// 		</>
// 	);
// }

// export default MatchmakerSelection;
