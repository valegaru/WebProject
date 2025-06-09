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
