import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Navbar from '../../components/Navbar/Navbar';
import WinnerDestination from '../../components/WinnerDestination/WinnerDestination';
import './MatchmakerResults.css';

function MatchmakerResults() {
	const { roomId } = useParams();
	const navigate = useNavigate();

	const [winnerCity, setWinnerCity] = useState(null);
	const [votes, setVotes] = useState({});
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMsg, setErrorMsg] = useState('');

	const handleCreateTripFromWinner = () => {
		if (results.length === 0 || !roomId) return;

		const winner = results[0][0];
		const allParticipantIds = Object.keys(votes);

		const query = new URLSearchParams({
			roomId,
			destination: winner,
			name: winner,
			participants: JSON.stringify(allParticipantIds),
		});

		navigate(`/tripcreation?${query.toString()}`);
	};

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const roomRef = doc(db, 'matchLists', roomId);
				const roomSnap = await getDoc(roomRef);

				if (!roomSnap.exists()) {
					setErrorMsg('No se encontró la sala.');
					setLoading(false);
					return;
				}

				const data = roomSnap.data();
				const voteData = data.votes || {};
				const destinations = data.destinations || [];

				setVotes(voteData);

				const tally = {};
				Object.values(voteData).forEach((userVotes) => {
					Object.entries(userVotes).forEach(([destination, vote]) => {
						if (vote === 'like') {
							tally[destination] = (tally[destination] || 0) + 1;
						}
					});
				});

				const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
				setResults(sorted);

				if (sorted.length > 0) {
					const winnerName = sorted[0][0];
					const matchedCity = destinations.find((city) => city.name === winnerName);
					if (matchedCity) setWinnerCity(matchedCity);
				}
			} catch (error) {
				console.error('Error al obtener los resultados:', error);
				setErrorMsg('Ocurrió un error al cargar los resultados.');
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [roomId]);

	return (
		<>
			<Navbar />
			<div className='matchmaker-results'>
				<h1 className='winner-title'>🌍 Resultado del Match</h1>

				{loading ? (
					<p>Cargando resultados...</p>
				) : errorMsg ? (
					<p>{errorMsg}</p>
				) : winnerCity ? (
					<>
						<WinnerDestination city={winnerCity} />
						<button className='create-trip-btn' onClick={handleCreateTripFromWinner}>
							Create a trip group with this destination
						</button>
					</>
				) : (
					<p>No se encontró un destino ganador.</p>
				)}
			</div>
		</>
	);
}

export default MatchmakerResults;

// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../services/firebase';
// import Navbar from '../../components/Navbar/Navbar';
// import WinnerDestination from '../../components/WinnerDestination/WinnerDestination';
// import './MatchmakerResults.css';

// function MatchmakerResults() {
// 	const { roomId } = useParams();
// 	const navigate = useNavigate();

// 	const [winnerCity, setWinnerCity] = useState(null);
// 	const [votes, setVotes] = useState({});
// 	const [results, setResults] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [errorMsg, setErrorMsg] = useState('');

// 	const handleCreateTripFromWinner = () => {
// 		if (results.length === 0 || !roomId) return;

// 		const winner = results[0][0]; // nombre del destino
// 		const participantIds = Object.entries(votes)
// 			.filter(([, userVotes]) => userVotes[winner] === 'like')
// 			.map(([userId]) => userId);

// 		const query = new URLSearchParams({
// 			destination: winner,
// 			participants: JSON.stringify(participantIds),
// 		});

// 		navigate(`/tripcreation?${query.toString()}`);
// 	};

// 	useEffect(() => {
// 		const fetchResults = async () => {
// 			try {
// 				const roomRef = doc(db, 'matchLists', roomId);
// 				const roomSnap = await getDoc(roomRef);

// 				if (!roomSnap.exists()) {
// 					setErrorMsg('No se encontró la sala.');
// 					setLoading(false);
// 					return;
// 				}

// 				const data = roomSnap.data();
// 				const voteData = data.votes || {};
// 				const destinations = data.destinations || [];

// 				setVotes(voteData);

// 				const tally = {};
// 				Object.values(voteData).forEach((userVotes) => {
// 					Object.entries(userVotes).forEach(([destination, vote]) => {
// 						if (vote === 'like') {
// 							tally[destination] = (tally[destination] || 0) + 1;
// 						}
// 					});
// 				});

// 				const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
// 				setResults(sorted);

// 				if (sorted.length > 0) {
// 					const winnerName = sorted[0][0];
// 					const matchedCity = destinations.find((city) => city.name === winnerName);
// 					if (matchedCity) {
// 						setWinnerCity(matchedCity);
// 					}
// 				}
// 			} catch (error) {
// 				console.error('Error al obtener los resultados:', error);
// 				setErrorMsg('Ocurrió un error al cargar los resultados.');
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchResults();
// 	}, [roomId]);

// 	return (
// 		<>
// 			<Navbar />
// 			<div className='matchmaker-results'>
// 				<h1 className='winner-title'>🌍 Resultado del Match</h1>

// 				{loading ? (
// 					<p>Cargando resultados...</p>
// 				) : errorMsg ? (
// 					<p>{errorMsg}</p>
// 				) : winnerCity ? (
// 					<>
// 						<WinnerDestination city={winnerCity} roomId={roomId} />
// 						<button className='create-trip-btn' onClick={handleCreateTripFromWinner}>
// 							Crea un viaje con este destino
// 						</button>
// 					</>
// 				) : (
// 					<p>No se encontró un destino ganador.</p>
// 				)}
// 			</div>
// 		</>
// 	);
// }

// export default MatchmakerResults;

// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../services/firebase';
// import Navbar from '../../components/Navbar/Navbar';
// import WinnerDestination from '../../components/WinnerDestination/WinnerDestination';
// import './MatchmakerResults.css';
// import { useNavigate } from 'react-router-dom';

// function MatchmakerResults() {
// 	const { roomId } = useParams();
// 	const navigate = useNavigate();
// 	const [winnerCity, setWinnerCity] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [errorMsg, setErrorMsg] = useState('');

// 	const handleCreateTripFromWinner = () => {
//   if (results.length === 0 || !roomId) return;

//   const winner = results[0][0]; // nombre del destino
//   const participantIds = Object.entries(votes)
//     .filter(([, userVotes]) => userVotes[winner] === 'like')
//     .map(([userId]) => userId);

//   const query = new URLSearchParams({
//     destination: winner,
//     participants: JSON.stringify(participantIds),
//   });

//   navigate(`/tripcreation?${query.toString()}`);
// };

// 	useEffect(() => {
// 		const fetchResults = async () => {
// 			try {
// 				const roomRef = doc(db, 'matchLists', roomId);
// 				const roomSnap = await getDoc(roomRef);

// 				if (!roomSnap.exists()) {
// 					setErrorMsg('No se encontró la sala.');
// 					setLoading(false);
// 					return;
// 				}

// 				const data = roomSnap.data();
// 				const votes = data.votes || {};
// 				const destinations = data.destinations || [];

// 				const tally = {};
// 				Object.values(votes).forEach((userVotes) => {
// 					Object.entries(userVotes).forEach(([destination, vote]) => {
// 						if (vote === 'like') {
// 							tally[destination] = (tally[destination] || 0) + 1;
// 						}
// 					});
// 				});

// 				const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);

// 				if (sorted.length > 0) {
// 					const winnerName = sorted[0][0];
// 					const matchedCity = destinations.find((city) => city.name === winnerName);
// 					if (matchedCity) {
// 						setWinnerCity(matchedCity);
// 					}
// 				}
// 			} catch (error) {
// 				console.error('Error al obtener los resultados:', error);
// 				setErrorMsg('Ocurrió un error al cargar los resultados.');
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchResults();
// 	}, [roomId]);

// 	return (
// 		<>
// 			<Navbar />
// 			<div className='matchmaker-results'>
// 				<h1 className='winner-title'>🌍 Resultado del Match</h1>

// 				{loading ? (
// 					<p>Cargando resultados...</p>
// 				) : errorMsg ? (
// 					<p>{errorMsg}</p>
// 				) : winnerCity ? (
// 					<WinnerDestination city={winnerCity} />
// 				) : (
// 					<p>No se encontró un destino ganador.</p>
// 				)}
// 			</div>
// 		</>
// 	);
// }

// export default MatchmakerResults;
