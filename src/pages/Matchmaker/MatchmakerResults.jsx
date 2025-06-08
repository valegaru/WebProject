import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

import './MatchmakerResults.css';

function MatchmakerResults() {
  const { roomId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const roomRef = doc(db, 'matchLists', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          setErrorMsg('No se encontró la sala');
          setLoading(false);
          return;
        }

        const data = roomSnap.data();
        const votes = data.votes || {};
        const tally = {};

        // Contar votos positivos ("like")
        Object.values(votes).forEach((userVotes) => {
          Object.entries(userVotes).forEach(([destination, vote]) => {
            if (vote === 'like') {
              tally[destination] = (tally[destination] || 0) + 1;
            }
          });
        });

        const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
        setResults(sorted);
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
    <div className="results-container">
      <h2>🌍 Resultado del Match</h2>
      {loading ? (
        <p>Cargando resultados...</p>
      ) : errorMsg ? (
        <p>{errorMsg}</p>
      ) : results.length > 0 ? (
        <ul>
          {results.map(([destination, count], index) => (
            <li key={destination}>
              <strong>{index === 0 ? '🏆 ' : ''}{destination}</strong>: {count} votos
            </li>
          ))}
        </ul>
      ) : (
        <p>Aún no hay votos registrados.</p>
      )}
    </div>
  );
}

export default MatchmakerResults;


// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../services/firebase';

// import './MatchmakerResults.css';

// function MatchmakerResults() {
// 	const { roomId } = useParams();
// 	const [results, setResults] = useState([]);
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		const fetchResults = async () => {
// 			const roomRef = doc(db, 'matchLists', roomId);
// 			const roomSnap = await getDoc(roomRef);

// 			if (!roomSnap.exists()) {
// 				alert('No se encontró la sala');
// 				return;
// 			}

// 			const data = roomSnap.data();
// 			const votes = data.votes || {};
// 			const tally = {};

// 			// contar likes
// 			Object.values(votes).forEach((userVotes) => {
// 				Object.entries(userVotes).forEach(([destination, vote]) => {
// 					if (vote === 'like') {
// 						tally[destination] = (tally[destination] || 0) + 1;
// 					}
// 				});
// 			});

// 			// convertir a array y ordenar
// 			const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
// 			setResults(sorted);
// 			setLoading(false);
// 		};

// 		fetchResults();
// 	}, [roomId]);

// 	return (
// 		<div className='results-container'>
// 			<h2>🌍 Resultado del Match</h2>
// 			{loading ? (
// 				<p>Cargando resultados...</p>
// 			) : results.length > 0 ? (
// 				<ul>
// 					{results.map(([destination, count], index) => (
// 						<li key={destination}>
// 							<strong>
// 								{index === 0 ? '🏆 ' : ''}
// 								{destination}
// 							</strong>
// 							: {count} votos
// 						</li>
// 					))}
// 				</ul>
// 			) : (
// 				<p>Aún no hay votos registrados.</p>
// 			)}
// 		</div>
// 	);
// }

// export default MatchmakerResults;

// import Navbar from '../../components/Navbar/Navbar';
// import WinnerDestination from '../../components/WinnerDestination/WinnerDestination';
// import './MatchmakerResults.css';

// function MatchmakerResults() {
// 	return (
// 		<>
// 			<Navbar />
// 			<div className='matchmaker-results'>
// 				<h1 className='winner-title'>Winner destination!</h1>
// 				<WinnerDestination
// 					city={{
// 						name: 'Barcelona',
// 						image:
// 							'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg',
// 					}}
// 				/>
// 			</div>
// 		</>
// 	);
// }

// export default MatchmakerResults;
