import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTrip } from '../../utils/firebaseUtils';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../components/Navbar/Navbar';
import ParticipantManager from '../../components/ParticipantManager/ParticipantManager';
import DestinationSearch from '../../components/DestinationSearch/DestinationSearch';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import MapComponent from '../../components/Map/MapComponent/MapComponent';
import './TripCreation.css';

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
			console.error('Cloudinary upload error:', err);
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

					<DestinationSearch
						selectedCountries={tripData.destination}
						onChange={(newDestinations) => setTripData({ ...tripData, destination: newDestinations })}
					/>

					<div className='destination-card-list'>
						{tripData.destination.map((country, index) => (
							<DestinationCard
								key={index}
								name={country}
								onRemove={() => {
									setTripData((prev) => ({
										...prev,
										destination: prev.destination.filter((c) => c !== country),
									}));
								}}
							/>
						))}
					</div>

					<MapComponent destinations={tripData.destination} searchbar={false} />

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
