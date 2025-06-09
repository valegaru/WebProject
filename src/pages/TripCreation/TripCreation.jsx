import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addTrip } from '../../utils/firebaseUtils';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../components/Navbar/Navbar';
import ParticipantManager from '../../components/ParticipantManager/ParticipantManager';
import './TripCreation.css';
import DestinationSearch from '../../components/DestinationSearch/DestinationSearch';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import MapComponent from './../../components/Map/MapComponent/MapComponent';
import { setMapType, setMapMarkers } from '../../store/mapInfo/MapInfo';

const TripCreation = () => {
	const dispatch = useDispatch();
	const { userId } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const location = useLocation();

	const [tripData, setTripData] = useState({
		name: '',
		description: '',
		destination: [],
		startDate: null,
		endDate: null,
		participants: [],
		tripPic: '',
	});

	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');

	const getDestinationName = (destination) => (typeof destination === 'string' ? destination : destination.name);
	const getDestinationCoordinates = (destination) =>
		typeof destination === 'object' && destination.coordinates ? destination.coordinates : null;

	const updateMapMarkers = (destinations) => {
		const markers = destinations
			.filter((dest) => getDestinationCoordinates(dest) !== null)
			.map((dest, index) => {
				const name = getDestinationName(dest);
				const coordinates = getDestinationCoordinates(dest);
				return {
					id: name || `destination-${index}`,
					name,
					position: coordinates,
					type: 'destination',
				};
			});

		dispatch(setMapMarkers(markers));
	};

	const handleDestinationChange = (newDestinations) => {
		setTripData({ ...tripData, destination: newDestinations });
		updateMapMarkers(newDestinations);
	};

	const handleDestinationRemove = (nameToRemove) => {
		const updated = tripData.destination.filter((d) => getDestinationName(d) !== nameToRemove);
		setTripData((prev) => ({ ...prev, destination: updated }));
		updateMapMarkers(updated);
	};

	const handleInputChange = (e) => {
		setTripData({ ...tripData, [e.target.name]: e.target.value });
	};

	const handleParticipantsChange = (newParticipants) => {
		setTripData({ ...tripData, participants: newParticipants });
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setUploading(true);
		setUploadStatus('Uploading image...');
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'ml_default');
		try {
			const res = await fetch('https://api.cloudinary.com/v1_1/dbx6eatsd/image/upload', {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();
			if (data.secure_url) {
				setTripData((prev) => ({ ...prev, tripPic: data.secure_url }));
				setUploadStatus('Image uploaded successfully.');
			} else {
				setUploadStatus('Error uploading image.');
			}
		} catch (err) {
			console.error(err);
			setUploadStatus('Error uploading image.');
		} finally {
			setUploading(false);
			setTimeout(() => setUploadStatus(''), 4000);
		}
	};

	const isValidDates = () => {
		const today = new Date();
		const { startDate, endDate } = tripData;
		if (startDate && startDate < today.setHours(0, 0, 0, 0)) return false;
		if (endDate && startDate && endDate < startDate) return false;
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!userId) return alert('User not logged in.');
		if (!isValidDates()) return alert('Invalid date selection.');

		const { name, description, destination, startDate, endDate, participants, tripPic } = tripData;

		const destinationNames = destination.map(getDestinationName).join(', ');
		const tripID = await addTrip(
			userId,
			description,
			destinationNames,
			startDate?.toISOString() || '',
			endDate?.toISOString() || '',
			name,
			participants.map((p) => p.id),
			tripPic
		);

		if (tripID) {
			alert('Trip created successfully 🎉');
			navigate('/trips');
			setTripData({
				name: '',
				description: '',
				destination: [],
				startDate: null,
				endDate: null,
				participants: [],
				tripPic: '',
			});
			dispatch(setMapMarkers([]));
		} else {
			alert('Error creating trip 😞');
		}
	};

	useEffect(() => {
		dispatch(setMapType('trips'));
		dispatch(setMapMarkers([]));
	}, [dispatch]);

	useEffect(() => {
		updateMapMarkers(tripData.destination);
	}, [tripData.destination]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const name = params.get('name');
		const destination = params.get('destination');
		const participants = params.get('participants');

		if (name || destination || participants) {
			setTripData((prev) => ({
				...prev,
				name: name || prev.name,
				destination: destination ? [destination] : prev.destination,
				participants: participants ? JSON.parse(participants).map((id) => ({ id })) : prev.participants,
			}));
		}
	}, [location.search]);

	return (
		<>
			<Navbar />
			<div className='trip-creation-container'>
				<h2 className='trip-title'>Create a New Trip</h2>
				<form onSubmit={handleSubmit} className='trip-form'>
					<DestinationSearch selectedCountries={tripData.destination} onChange={handleDestinationChange} />

					<MapComponent />

					<div className='destination-card-list'>
						{tripData.destination.map((d, index) => (
							<DestinationCard
								key={getDestinationName(d) || index}
								name={getDestinationName(d)}
								coordinates={getDestinationCoordinates(d)}
								flagUrl={null}
								onRemove={handleDestinationRemove}
							/>
						))}
					</div>

					<div className='form-group'>
						<label>Trip Name:</label>
						<input
							type='text'
							name='name'
							value={tripData.name}
							onChange={handleInputChange}
							required
							className='input'
						/>
					</div>

					<div className='form-group'>
						<label>Description:</label>
						<textarea
							name='description'
							value={tripData.description}
							onChange={handleInputChange}
							required
							className='textarea'
						/>
					</div>

					<div className='form-group date-group'>
						<label>Start Date:</label>
						<DatePicker
							selected={tripData.startDate}
							onChange={(date) => setTripData({ ...tripData, startDate: date })}
							dateFormat='yyyy-MM-dd'
							className='datepicker'
							minDate={new Date()}
						/>
					</div>

					<div className='form-group date-group'>
						<label>End Date:</label>
						<DatePicker
							selected={tripData.endDate}
							onChange={(date) => setTripData({ ...tripData, endDate: date })}
							dateFormat='yyyy-MM-dd'
							className='datepicker'
							minDate={tripData.startDate || new Date()}
						/>
					</div>

					<div className='form-group'>
						<label>Trip Image:</label>
						<input
							type='file'
							accept='image/*'
							onChange={handleImageUpload}
							disabled={uploading}
							className='input-file'
						/>
						{uploadStatus && <p className='upload-status'>{uploadStatus}</p>}
						{tripData.tripPic && (
							<div className='image-preview'>
								<p>Preview:</p>
								<img src={tripData.tripPic} alt='Trip' className='trip-image' />
							</div>
						)}
					</div>

					<ParticipantManager participants={tripData.participants} onParticipantsChange={handleParticipantsChange} />

					<div className='form-group'>
						<button
							type='submit'
							className='submit-button'
							disabled={!isValidDates() || !tripData.name || !tripData.description || !tripData.destination.length}
						>
							Create Trip
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default TripCreation;

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { addTrip } from '../../utils/firebaseUtils';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Navbar from '../../components/Navbar/Navbar';
// import ParticipantManager from '../../components/ParticipantManager/ParticipantManager';
// import DestinationSearch from '../../components/DestinationSearch/DestinationSearch';
// import DestinationCard from '../../components/DestinationCard/DestinationCard';
// import MapComponent from '../../components/Map/MapComponent/MapComponent';
// import { setMapType, setMapMarkers } from '../../store/mapInfo/MapInfo';
// import './TripCreation.css';

// const TripCreation = () => {
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();
// 	const location = useLocation();
// 	const { userId } = useSelector((state) => state.auth);

// 	const [tripData, setTripData] = useState({
// 		name: '',
// 		description: '',
// 		destination: [],
// 		startDate: null,
// 		endDate: null,
// 		participants: [],
// 		tripPic: '',
// 	});

// 	const [uploading, setUploading] = useState(false);
// 	const [uploadStatus, setUploadStatus] = useState('');

// 	useEffect(() => {
// 		const params = new URLSearchParams(location.search);
// 		const destination = params.get('destination');
// 		const participantsRaw = params.get('participants');

// 		if (destination || participantsRaw) {
// 			const participants = participantsRaw ? JSON.parse(participantsRaw) : [];

// 			setTripData((prev) => ({
// 				...prev,
// 				name: destination || '',
// 				destination: destination ? [destination] : [],
// 				participants: participants.map((id) => ({ id })),
// 			}));
// 		}
// 	}, [location.search]);

// 	const handleInputChange = (e) => {
// 		setTripData({ ...tripData, [e.target.name]: e.target.value });
// 	};

// 	const handleParticipantsChange = (newParticipants) => {
// 		setTripData({ ...tripData, participants: newParticipants });
// 	};

// 	const handleImageUpload = async (e) => {
// 		const file = e.target.files[0];
// 		if (!file) return;

// 		setUploading(true);
// 		setUploadStatus('Uploading image...');

// 		const formData = new FormData();
// 		formData.append('file', file);
// 		formData.append('upload_preset', 'ml_default');

// 		try {
// 			const res = await fetch('https://api.cloudinary.com/v1_1/dbx6eatsd/image/upload', {
// 				method: 'POST',
// 				body: formData,
// 			});
// 			const data = await res.json();

// 			if (data.secure_url) {
// 				setTripData((prev) => ({ ...prev, tripPic: data.secure_url }));
// 				setUploadStatus('Image uploaded successfully.');
// 			} else {
// 				setUploadStatus('Error uploading image.');
// 			}
// 		} catch (err) {
// 			console.error('Upload error:', err);
// 			setUploadStatus('Error uploading image.');
// 		} finally {
// 			setUploading(false);
// 			setTimeout(() => setUploadStatus(''), 3000);
// 		}
// 	};

// 	const handleDestinationChange = (destinations) => {
// 		setTripData({ ...tripData, destination: destinations });
// 		const markers = destinations.map((d, i) => ({
// 			id: d.name || `dest-${i}`,
// 			name: d.name || d,
// 			position: d.coordinates || { lat: 0, lng: 0 },
// 			type: 'destination',
// 		}));
// 		dispatch(setMapMarkers(markers));
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (!userId) return alert('User not logged in.');
// 		if (!tripData.name || !tripData.description || tripData.destination.length === 0) {
// 			return alert('Please complete all required fields.');
// 		}

// 		const tripID = await addTrip(
// 			userId,
// 			tripData.description,
// 			tripData.destination.map((d) => d.name || d).join(', '),
// 			tripData.startDate?.toISOString() || '',
// 			tripData.endDate?.toISOString() || '',
// 			tripData.name,
// 			tripData.participants.map((p) => p.id),
// 			tripData.tripPic
// 		);

// 		if (tripID) {
// 			alert('Trip created successfully!');
// 			navigate('/trips');
// 		} else {
// 			alert('Failed to create trip.');
// 		}
// 	};

// 	useEffect(() => {
// 		dispatch(setMapType('trips'));
// 		dispatch(setMapMarkers([]));
// 	}, [dispatch]);

// 	return (
// 		<>
// 			<Navbar />
// 			<div className='trip-creation-container'>
// 				<h2 className='trip-title'>Create a New Trip</h2>
// 				<form onSubmit={handleSubmit} className='trip-form'>
// 					<DestinationSearch selectedCountries={tripData.destination} onChange={handleDestinationChange} />

// 					<MapComponent />

// 					<div className='destination-card-list'>
// 						{tripData.destination.map((d, i) => (
// 							<DestinationCard
// 								key={d.name || d}
// 								name={d.name || d}
// 								flagUrl={null}
// 								onRemove={() => handleDestinationChange(tripData.destination.filter((_, idx) => idx !== i))}
// 							/>
// 						))}
// 					</div>

// 					<div className='form-group'>
// 						<label>Trip Name:</label>
// 						<input
// 							type='text'
// 							name='name'
// 							value={tripData.name}
// 							onChange={handleInputChange}
// 							required
// 							className='input'
// 						/>
// 					</div>

// 					<div className='form-group'>
// 						<label>Description:</label>
// 						<textarea
// 							name='description'
// 							value={tripData.description}
// 							onChange={handleInputChange}
// 							required
// 							className='textarea'
// 						/>
// 					</div>

// 					<div className='form-group date-group'>
// 						<label>Start Date:</label>
// 						<DatePicker
// 							selected={tripData.startDate}
// 							onChange={(date) => setTripData({ ...tripData, startDate: date })}
// 							className='datepicker'
// 							minDate={new Date()}
// 						/>
// 					</div>

// 					<div className='form-group date-group'>
// 						<label>End Date:</label>
// 						<DatePicker
// 							selected={tripData.endDate}
// 							onChange={(date) => setTripData({ ...tripData, endDate: date })}
// 							className='datepicker'
// 							minDate={tripData.startDate || new Date()}
// 						/>
// 					</div>

// 					<div className='form-group'>
// 						<label>Trip Image:</label>
// 						<input
// 							type='file'
// 							accept='image/*'
// 							onChange={handleImageUpload}
// 							disabled={uploading}
// 							className='input-file'
// 						/>
// 						{uploadStatus && <p className='upload-status'>{uploadStatus}</p>}
// 						{tripData.tripPic && (
// 							<div className='image-preview'>
// 								<img src={tripData.tripPic} alt='Preview' className='trip-image' />
// 							</div>
// 						)}
// 					</div>

// 					<ParticipantManager participants={tripData.participants} onParticipantsChange={handleParticipantsChange} />

// 					<button
// 						type='submit'
// 						className='submit-button'
// 						disabled={!tripData.name || !tripData.description || !tripData.destination.length}
// 					>
// 						Create Trip
// 					</button>
// 				</form>
// 			</div>
// 		</>
// 	);
// };

// export default TripCreation;

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { addTrip } from '../../utils/firebaseUtils';
// import LogoutButton from '../../components/LogoutButton/LogoutButton';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Navbar from '../../components/Navbar/Navbar';
// import ParticipantManager from '../../components/ParticipantManager/ParticipantManager';
// import './TripCreation.css';
// import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api';
// import DestinationSearch from '../../components/DestinationSearch/DestinationSearch';
// import DestinationCard from '../../components/DestinationCard/DestinationCard';
// import MapComponent from './../../components/Map/MapComponent/MapComponent';
// import { setMapType, setMapMarkers, addMapMarkers, removeMapMarkers } from '../../store/mapInfo/MapInfo';
// import './TripCreation.css';
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';

// const TripCreation = () => {
// 	const dispatch = useDispatch();
// 	const { userId } = useSelector((state) => state.auth);
// 	const navigate = useNavigate();
// 	const [tripData, setTripData] = useState({
// 		name: '',
// 		description: '',
// 		destination: [],
// 		startDate: null,
// 		endDate: null,
// 		participants: [],
// 		tripPic: '',
// 	});
// 	const [uploading, setUploading] = useState(false);
// 	const [uploadStatus, setUploadStatus] = useState('');
// 	const [searchBoxRef, setSearchBoxRef] = useState(null);

// 	const handleInputChange = (e) => {
// 		setTripData({
// 			...tripData,
// 			[e.target.name]: e.target.value,
// 		});
// 	};

// 	const handleParticipantsChange = (newParticipants) => {
// 		setTripData({
// 			...tripData,
// 			participants: newParticipants,
// 		});
// 	};

// 	const handleImageUpload = async (e) => {
// 		const file = e.target.files[0];
// 		if (!file) return;

// 		setUploading(true);
// 		setUploadStatus('Uploading image...');

// 		const formData = new FormData();
// 		formData.append('file', file);
// 		formData.append('upload_preset', 'ml_default');

// 		try {
// 			const res = await fetch('https://api.cloudinary.com/v1_1/dbx6eatsd/image/upload', {
// 				method: 'POST',
// 				body: formData,
// 			});
// 			const data = await res.json();

// 			if (data.secure_url) {
// 				setTripData((prev) => ({ ...prev, tripPic: data.secure_url }));
// 				setUploadStatus('Image uploaded successfully.');
// 			} else {
// 				setUploadStatus('Error uploading image.');
// 			}
// 		} catch (err) {
// 			console.error('Error uploading to Cloudinary:', err);
// 			setUploadStatus('Error uploading image.');
// 		} finally {
// 			setUploading(false);
// 			setTimeout(() => setUploadStatus(''), 4000);
// 		}
// 	};

// 	// Helper function to get destination name (handles both string and object formats)
// 	const getDestinationName = (destination) => {
// 		return typeof destination === 'string' ? destination : destination.name;
// 	};

// 	// Helper function to get destination coordinates
// 	const getDestinationCoordinates = (destination) => {
// 		return typeof destination === 'object' && destination.coordinates ? destination.coordinates : null;
// 	};

// 	// Function to update map markers based on destinations
// 	const updateMapMarkers = (destinations) => {
// 		const markers = destinations
// 			.filter(dest => getDestinationCoordinates(dest) !== null)
// 			.map((dest, index) => {
// 				const name = getDestinationName(dest);
// 				const coordinates = getDestinationCoordinates(dest);
// 				return {
// 					id: name || `destination-${index}`,
// 					name: name,
// 					position: {
// 						lat: coordinates.lat,
// 						lng: coordinates.lng
// 					},
// 					type: 'destination'
// 				};
// 			});

// 		dispatch(setMapMarkers(markers));
// 	};

// 	// Handle destination changes and update markers
// 	const handleDestinationChange = (newDestinations) => {
// 		setTripData({ ...tripData, destination: newDestinations });
// 		updateMapMarkers(newDestinations);
// 	};

// 	// Handle destination removal and update markers
// 	const handleDestinationRemove = (nameToRemove) => {
// 		const updatedDestinations = tripData.destination.filter((d) => {
// 			const dName = getDestinationName(d);
// 			return dName !== nameToRemove;
// 		});

// 		setTripData((prev) => ({
// 			...prev,
// 			destination: updatedDestinations,
// 		}));

// 		updateMapMarkers(updatedDestinations);
// 	};

// 	const handlePlacesChanged = () => {
// 		const places = searchBoxRef.getPlaces();
// 		if (places?.length) {
// 			const newCountries = places.map((place) => place.formatted_address || place.name);
// 			const updatedDestinations = [...new Set([...tripData.destination, ...newCountries])];
// 			setTripData((prev) => ({
// 				...prev,
// 				destination: updatedDestinations,
// 			}));
// 			updateMapMarkers(updatedDestinations);
// 		}
// 	};

// 	const isValidDates = () => {
// 		const today = new Date();
// 		const { startDate, endDate } = tripData;
// 		if (startDate && startDate < today.setHours(0, 0, 0, 0)) return false;
// 		if (endDate && startDate && endDate < startDate) return false;
// 		return true;
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (!userId) {
// 			alert('User not logged in.');
// 			return;
// 		}
// 		if (!isValidDates()) {
// 			alert('Invalid date selection.');
// 			return;
// 		}

// 		const { name, description, destination, startDate, endDate, participants, tripPic } = tripData;

// 		// Process destinations to extract names and coordinates
// 		const destinationNames = destination.map(dest => getDestinationName(dest)).join(', ');

// 		// Extract coordinates for potential future use or storage
// 		const destinationCoords = destination
// 			.map(dest => ({
// 				name: getDestinationName(dest),
// 				coordinates: getDestinationCoordinates(dest)
// 			}))
// 			.filter(dest => dest.coordinates !== null);

// 		// Log coordinates for debugging (you can remove this later)
// 		console.log('Destination coordinates:', destinationCoords);

// 		const tripID = await addTrip(
// 			userId,
// 			description,
// 			destinationNames, // Send names as string for backward compatibility
// 			startDate?.toISOString() || '',
// 			endDate?.toISOString() || '',
// 			name,
// 			participants.map((p) => p.id),
// 			tripPic
// 			// If you want to store coordinates, you might need to modify addTrip function
// 			// to accept an additional parameter: destinationCoords
// 		);

// 		if (tripID) {
// 			alert('Trip created successfully 🎉');
// 			navigate('/trips');
// 			setTripData({
// 				name: '',
// 				description: '',
// 				destination: [],
// 				startDate: null,
// 				endDate: null,
// 				participants: [],
// 				tripPic: '',
// 			});
// 			// Clear map markers when trip is created
// 			dispatch(setMapMarkers([]));
// 		} else {
// 			alert('Error creating trip 😞');
// 		}
// 	};

// 	useEffect(() => {
// 		dispatch(setMapType("trips"));
// 		// Initialize with empty markers
// 		dispatch(setMapMarkers([]));
// 	}, [dispatch]);

// 	// Update markers whenever destinations change
// 	useEffect(() => {
// 		updateMapMarkers(tripData.destination);
// 	}, [tripData.destination]);

// 	return (
// 		<>
// 			<Navbar />
// 			<div className='trip-creation-container'>
// 				<h2 className='trip-title'>Create a New Trip</h2>
// 				<form onSubmit={handleSubmit} className='trip-form'>
// 					<DestinationSearch
// 						selectedCountries={tripData.destination}
// 						onChange={handleDestinationChange}
// 					/>

// 					<MapComponent></MapComponent>

// 					<div className='destination-card-list'>
// 						{tripData.destination.map((destination, index) => {
// 							const destinationName = getDestinationName(destination);
// 							const coordinates = getDestinationCoordinates(destination);

// 							return (
// 								<DestinationCard
// 									key={destinationName || index}
// 									name={destinationName}
// 									coordinates={coordinates}
// 									flagUrl={null} // Replace this with actual flag URL logic if available
// 									onRemove={handleDestinationRemove}
// 								/>
// 							);
// 						})}
// 					</div>

// 					<div className='form-group'>
// 						<label>Trip Name:</label>
// 						<input
// 							type='text'
// 							name='name'
// 							value={tripData.name}
// 							onChange={handleInputChange}
// 							required
// 							className='input'
// 						/>
// 					</div>

// 					<div className='form-group'>
// 						<label>Description:</label>
// 						<textarea
// 							name='description'
// 							value={tripData.description}
// 							onChange={handleInputChange}
// 							required
// 							className='textarea'
// 						/>
// 					</div>

// 					<div className='form-group date-group'>
// 						<label>Start Date:</label>
// 						<DatePicker
// 							selected={tripData.startDate}
// 							onChange={(date) => setTripData({ ...tripData, startDate: date })}
// 							dateFormat='yyyy-MM-dd'
// 							className='datepicker'
// 							minDate={new Date()}
// 						/>
// 					</div>

// 					<div className='form-group date-group'>
// 						<label>End Date:</label>
// 						<DatePicker
// 							selected={tripData.endDate}
// 							onChange={(date) => setTripData({ ...tripData, endDate: date })}
// 							dateFormat='yyyy-MM-dd'
// 							className='datepicker'
// 							minDate={tripData.startDate || new Date()}
// 						/>
// 					</div>

// 					<div className='form-group'>
// 						<label>Trip Image:</label>
// 						<input
// 							type='file'
// 							accept='image/*'
// 							onChange={handleImageUpload}
// 							disabled={uploading}
// 							className='input-file'
// 						/>
// 						{uploadStatus && <p className='upload-status'>{uploadStatus}</p>}
// 						{tripData.tripPic && (
// 							<div className='image-preview'>
// 								<p>Preview:</p>
// 								<img src={tripData.tripPic} alt='Trip' className='trip-image' />
// 							</div>
// 						)}
// 					</div>

// 					<ParticipantManager participants={tripData.participants} onParticipantsChange={handleParticipantsChange} />

// 					<div className='form-group'>
// 						<button
// 							type='submit'
// 							className='submit-button'
// 							disabled={!isValidDates() || !tripData.name || !tripData.description || !tripData.destination.length}
// 						>
// 							Create Trip
// 						</button>
// 					</div>
// 				</form>
// 			</div>
// 		</>
// 	);
// };

// export default TripCreation;
