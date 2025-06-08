import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTrip } from '../../utils/firebaseUtils';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../components/Navbar/Navbar';
import ParticipantManager from '../../components/ParticipantManager/ParticipantManager';
import './TripCreation.css';
import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api';
import DestinationSearch from '../../components/DestinationSearch/DestinationSearch';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import MapComponent from './../../components/Map/MapComponent/MapComponent';
import { setMapType, setMapMarkers } from '../../store/mapInfo/MapInfo';
import './TripCreation.css';

const TripCreation = () => {
	const dispatch = useDispatch()
	const { userId } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const [tripData, setTripData] = useState({
		name: '',
		description: '',
		destination: [],
		startDate: null,
		endDate: null,
		participants: [],
		tripPic: '',
	});
	// Store destination objects with both name and coordinates
	const [destinationObjects, setDestinationObjects] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');
	const [searchBoxRef, setSearchBoxRef] = useState(null);

	const handleInputChange = (e) => {
		setTripData({
			...tripData,
			[e.target.name]: e.target.value,
		});
	};

	const handleParticipantsChange = (newParticipants) => {
		setTripData({
			...tripData,
			participants: newParticipants,
		});
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
			console.error('Error uploading to Cloudinary:', err);
			setUploadStatus('Error uploading image.');
		} finally {
			setUploading(false);
			setTimeout(() => setUploadStatus(''), 4000);
		}
	};

	const handlePlacesChanged = () => {
		const places = searchBoxRef.getPlaces();
		if (places?.length) {
			const newDestinationObjects = places.map((place) => ({
				name: place.formatted_address || place.name,
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng()
			}));

			// Update destination objects array
			setDestinationObjects(prev => {
				const existingNames = prev.map(dest => dest.name);
				const filteredNew = newDestinationObjects.filter(dest => !existingNames.includes(dest.name));
				return [...prev, ...filteredNew];
			});

			// Update trip data with destination names
			const newCountries = newDestinationObjects.map(dest => dest.name);
			setTripData((prev) => ({
				...prev,
				destination: [...new Set([...prev.destination, ...newCountries])],
			}));
		}
	};

	// Update map markers whenever destinations change
	useEffect(() => {
		const markers = destinationObjects.map(dest => ({
			lat: dest.lat,
			lng: dest.lng
		}));
		dispatch(setMapMarkers(markers));
	}, [destinationObjects, dispatch]);

	const handleDestinationRemove = (nameToRemove) => {
		// Remove from destination objects
		setDestinationObjects(prev => prev.filter(dest => dest.name !== nameToRemove));
		
		// Remove from trip data
		setTripData((prev) => ({
			...prev,
			destination: prev.destination.filter((d) => d !== nameToRemove),
		}));
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
		if (!userId) {
			alert('User not logged in.');
			return;
		}
		if (!isValidDates()) {
			alert('Invalid date selection.');
			return;
		}

		const { name, description, destination, startDate, endDate, participants, tripPic } = tripData;

		const tripID = await addTrip(
			userId,
			description,
			destination.join(', '),
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
			setDestinationObjects([]);
			dispatch(setMapMarkers([])); // Clear markers
		} else {
			alert('Error creating trip 😞');
		}
	};

	useEffect(() => {
		dispatch(setMapType("trips"))
	},[])

	return (
		<>
			<Navbar />
			<div className='trip-creation-container'>
				<h2 className='trip-title'>Create a New Trip</h2>
				<form onSubmit={handleSubmit} className='trip-form'>
					<DestinationSearch
						selectedCountries={tripData.destination}
						onChange={(newDestinations) => setTripData({ ...tripData, destination: newDestinations })}
					/>

					<MapComponent></MapComponent>
					
					<div className='destination-card-list'>
						{tripData.destination.map((country) => (
							<DestinationCard
								key={country}
								name={country}
								flagUrl={null} // Replace this with actual flag URL logic if available
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