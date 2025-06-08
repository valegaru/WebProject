import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTrip } from '../../utils/firebaseUtils';
import Navbar from '../../components/Navbar/Navbar';
import ParticipantManager from '../../components/ParticipantManager/ParticipantManager';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TripCreation.css';

import DestinationSearch from '../../components/DestinationSearch/DestinationSearch';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import PoiMarkers from '../../components/Map/PoiMarker/PoiMarkers';

const TripCreation = () => {
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

	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');
	const [destinationLocations, setDestinationLocations] = useState([]);

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
			console.error('Error uploading to Cloudinary:', err);
			setUploadStatus('Error uploading image.');
		} finally {
			setUploading(false);
			setTimeout(() => setUploadStatus(''), 4000);
		}
	};

	const geocodeCountry = (countryName) => {
		return new Promise((resolve, reject) => {
			const geocoder = new window.google.maps.Geocoder();
			geocoder.geocode({ address: countryName }, (results, status) => {
				if (status === 'OK' && results[0]) {
					const loc = results[0].geometry.location;
					resolve({ lat: loc.lat(), lng: loc.lng() });
				} else {
					reject(status);
				}
			});
		});
	};

	const handleDestinationChange = (newDestinations) => {
		setTripData((prev) => ({ ...prev, destination: newDestinations }));

		// Remove old destinations
		setDestinationLocations((locations) => locations.filter((loc) => newDestinations.includes(loc.name)));

		// Add new geocoded ones
		newDestinations.forEach((name) => {
			if (!destinationLocations.find((loc) => loc.name === name)) {
				geocodeCountry(name)
					.then(({ lat, lng }) => {
						setDestinationLocations((locations) => [...locations, { name, lat, lng }]);
					})
					.catch((err) => console.warn('Geocode failed:', name, err));
			}
		});
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
			setDestinationLocations([]);
		} else {
			alert('Error creating trip 😞');
		}
	};

	return (
		<>
			<Navbar />
			<div className='trip-creation-container'>
				<h2 className='trip-title'>Create a New Trip</h2>
				<form onSubmit={handleSubmit} className='trip-form'>
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

					<DestinationSearch selectedCountries={tripData.destination} onChange={handleDestinationChange} />

					<div className='map-wrapper' style={{ height: '300px', marginBottom: '1rem' }}>
						<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
							<Map defaultCenter={{ lat: 20, lng: 0 }} defaultZoom={2} style={{ width: '100%', height: '100%' }}>
								{destinationLocations.map((loc, i) => (
									<PoiMarkers key={i} locationInfo={{ lat: loc.lat, lng: loc.lng }} />
								))}
							</Map>
						</APIProvider>
					</div>

					{destinationLocations.length > 0 && (
						<div className='destination-cards-container'>
							{destinationLocations.map((loc) => (
								<DestinationCard
									key={loc.name}
									name={loc.name}
									onRemove={(name) => {
										const filtered = tripData.destination.filter((c) => c !== name);
										handleDestinationChange(filtered);
									}}
								/>
							))}
						</div>
					)}

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
