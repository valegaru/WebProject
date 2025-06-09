import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-qr-code';
import { fetchLocationData } from '../../utils/googleMapsUtils'; // Import your utility
import './MatchmakerRoom.css';

function MatchmakerRoom() {
	const [roomId, setRoomId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	// Define major cities with their coordinates
	const cityCoordinates = [
		{ name: 'Barcelona', lat: 41.3851, lng: 2.1734, country: 'Spain' },
		{ name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
		{ name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
		{ name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy' },
		{ name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
		{ name: 'Kyoto', lat: 35.0116, lng: 135.7681, country: 'Japan' },
		{ name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
		{ name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' }
	];

	// Fallback data in case Google Maps fails
	const fallbackDestinations = [
		{
			name: 'Barcelona',
			image: 'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg',
			aesthetic: 'Stunning architecture.',
			vibe: 'Beachside relaxation and nightlife.',
			gastronomy: 'Tapas, paella, and fresh seafood.',
			renowned: 'Football, art, history, and Mediterranean sunsets.',
			activities: [],
			attractions: []
		},
		// ... other fallback destinations
	];

	const fetchDestinationsFromGoogleMaps = async () => {
		const destinations = [];
		
		for (const city of cityCoordinates) {
			try {
				console.log(`Fetching data for ${city.name}...`);
				
				// Fetch main city data
				const cityData = await fetchLocationData(city.lat, city.lng);
				
				// Fetch nearby attractions (slightly different coordinates to get variety)
				const attractionPromises = [];
				for (let i = 0; i < 3; i++) {
					const offsetLat = city.lat + (Math.random() - 0.5) * 0.02; // Small random offset
					const offsetLng = city.lng + (Math.random() - 0.5) * 0.02;
					attractionPromises.push(fetchLocationData(offsetLat, offsetLng));
				}
				
				const attractionResults = await Promise.all(attractionPromises);
				
				// Create destination object
				const destination = {
					name: city.name,
					image: cityData.photoUrl || `https://images.unsplash.com/400x300/?${city.name}`,
					aesthetic: `Beautiful ${city.country.toLowerCase()} architecture and culture.`,
					vibe: `Authentic ${city.name} atmosphere.`,
					gastronomy: `Local ${city.country} cuisine and specialties.`,
					renowned: cityData.placeDetails?.name || `Famous ${city.name} landmarks.`,
					activities: attractionResults
						.filter(result => result.placeDetails && result.photoUrl)
						.slice(0, 3)
						.map(result => ({
							image: result.photoUrl,
							label: result.placeDetails.name
						})),
					attractions: attractionResults
						.filter(result => result.placeDetails)
						.slice(0, 3)
						.map(result => ({
							image: result.photoUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(result.placeDetails.name)}`,
							label: result.placeDetails.name
						}))
				};
				
				destinations.push(destination);
				
				// Add delay to avoid rate limiting
				await new Promise(resolve => setTimeout(resolve, 500));
				
			} catch (error) {
				console.error(`Error fetching data for ${city.name}:`, error);
				
				// Use fallback data for this city
				const fallback = fallbackDestinations.find(dest => dest.name === city.name);
				if (fallback) {
					destinations.push(fallback);
				}
			}
		}
		
		return destinations;
	};

	const handleCreateRoom = async () => {
		setIsLoading(true);
		const newRoomId = uuidv4();

		try {
			console.log('Fetching destinations from Google Maps...');
			const destinations = await fetchDestinationsFromGoogleMaps();
			
			// If no destinations were fetched, use fallback
			const finalDestinations = destinations.length > 0 ? destinations : fallbackDestinations;

			await setDoc(doc(db, 'matchLists', newRoomId), {
				destinations: finalDestinations,
				votes: {},
				createdAt: new Date(),
			});

			setRoomId(newRoomId);
		} catch (error) {
			console.error('Error creating room:', error);
			
			// Fallback to static destinations
			await setDoc(doc(db, 'matchLists', newRoomId), {
				destinations: fallbackDestinations,
				votes: {},
				createdAt: new Date(),
			});
			
			setRoomId(newRoomId);
		} finally {
			setIsLoading(false);
		}
	};

	const roomLink = `${window.location.origin}/matchselection/${roomId}`;

	return (
		<div className='room-container'>
			<h2>🧩 Crea tu Sala de Matchmaker</h2>
			<button onClick={handleCreateRoom} disabled={isLoading}>
				{isLoading ? 'Creando Sala...' : 'Crear Sala'}
			</button>

			{isLoading && (
				<div className="loading-message">
					<p>Obteniendo destinos increíbles para ti...</p>
					<p>Esto puede tardar unos segundos ⏳</p>
				</div>
			)}

			{roomId && (
				<div className='qr-wrapper'>
					<h2>Comparte este QR o el link con tus amigos:</h2>
					<QRCode value={roomLink} size={256} />

					<h3>
						<a href={roomLink} target='_blank' rel='noreferrer'>
							{roomLink}
						</a>
					</h3>
					<h3>Despues de compartir, da click al link para empezar</h3>
				</div>
			)}
		</div>
	);
}

export default MatchmakerRoom;