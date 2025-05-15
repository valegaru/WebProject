import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTrip, searchUsersByName, searchUsersByEmail } from '../../utils/firebaseUtils';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../components/Navbar/Navbar';
import ParticipantCard from '../../components/ParticipantCard/ParticipantCard';
import './TripCreation.css';

function TripCreation() {
	const { userId } = useSelector((state) => state.auth);
	const navigate = useNavigate(); 

	const [tripData, setTripData] = useState({
		name: '',
		description: '',
		destination: '',
		startDate: null,
		endDate: null,
		participants: [],
		tripPic: '',
	});


	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');

	const handleInputChange = (e) => {
		setTripData({
			...tripData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSearchChange = async (e) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (value.length >= 1) {
			const [nameResults, emailResults] = await Promise.all([searchUsersByName(value), searchUsersByEmail(value)]);

			// Combinar sin duplicados (por id)
			const combined = [...nameResults];

			emailResults.forEach((emailUser) => {
				if (!combined.some((user) => user.id === emailUser.id)) {
					combined.push(emailUser);
				}
			});

			setSearchResults(combined);
		} else {
			setSearchResults([]);
		}
	};

	const addParticipant = (user) => {
		const alreadyAdded = tripData.participants.some((p) => p.id === user.id);
		if (!alreadyAdded) {
			setTripData({
				...tripData,
				participants: [...tripData.participants, user],
			});
		}
		setSearchTerm('');
		setSearchResults([]);
	};

	const removeParticipant = (id) => {
		setTripData({
			...tripData,
			participants: tripData.participants.filter((p) => p.id !== id),
		});
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setUploading(true);
		setUploadStatus('Subiendo imagen...');

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
				setUploadStatus('Imagen subida correctamente.');
			} else {
				setUploadStatus('Error al subir la imagen.');
			}
		} catch (err) {
			console.error('Error al subir a Cloudinary:', err);
			setUploadStatus('Error al subir la imagen.');
		} finally {
			setUploading(false);
			setTimeout(() => setUploadStatus(''), 4000);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!userId) {
			alert('Usuario no logueado.');
			return;
		}

		const { name, description, destination, startDate, endDate, participants, tripPic } = tripData;

		const tripID = await addTrip(
			userId,
			description,
			destination,
			startDate?.toISOString() || '',
			endDate?.toISOString() || '',
			name,
			participants.map((p) => p.id),
			tripPic
		);

		if (tripID) {
			alert('Viaje creado con éxito 🎉');

			navigate('/trips');
			// Limpiar formulario
			setTripData({
				name: '',
				description: '',
				destination: '',
				startDate: null,
				endDate: null,
				participants: [],
				tripPic: '',
			});
		} else {
			alert('Error al crear el viaje 😞');
		}
	};

	return (
		<>
	<Navbar />
	<div className="trip-creation-container">
		<h2 className="trip-title">Crear un nuevo viaje</h2>
		<form onSubmit={handleSubmit} className="trip-form">

			<div className="form-group">
				<label>Nombre del viaje:</label>
				<input type="text" name="name" value={tripData.name} onChange={handleInputChange} required className="input" />
			</div>

			<div className="form-group">
				<label>Descripción:</label>
				<textarea name="description" value={tripData.description} onChange={handleInputChange} required className="textarea" />
			</div>

			<div className="form-group">
				<label>Destino (país):</label>
				<input type="text" name="destination" value={tripData.destination} onChange={handleInputChange} required className="input" />
			</div>

			<div className="form-group date-group">
				<label>Fecha de inicio:</label>
				<DatePicker
					selected={tripData.startDate}
					onChange={(date) => setTripData({ ...tripData, startDate: date })}
					dateFormat="yyyy-MM-dd"
					className="datepicker"
				/>
			</div>

			<div className="form-group date-group">
				<label>Fecha de fin:</label>
				<DatePicker
					selected={tripData.endDate}
					onChange={(date) => setTripData({ ...tripData, endDate: date })}
					dateFormat="yyyy-MM-dd"
					className="datepicker"
				/>
			</div>

			<div className="form-group">
				<label>Subir foto del viaje:</label>
				<input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="input-file" />
				{uploadStatus && <p className="upload-status">{uploadStatus}</p>}
				{tripData.tripPic && (
					<div className="image-preview">
						<p>Vista previa:</p>
						<img src={tripData.tripPic} alt="Foto del viaje" className="trip-image" />
					</div>
				)}
			</div>

			<div className="form-group">
				<label>Buscar participantes:</label>
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder="Escribe un nombre..."
					className="input"
				/>
				{searchResults.length > 0 && (
					<ul className="search-results">
						{searchResults.map((user) => (
							<li key={user.id} onClick={() => addParticipant(user)} className="search-result-item">
								{user.username} ({user.email})
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="form-group">
				<label>Participantes agregados:</label>
				<div className="participant-list">
					{tripData.participants.map((user) => (
						<ParticipantCard
							key={user.id}
							name={user.username}
							avatarUrl={user.photoUrl}
							email={user.email}
							onRemove={() => removeParticipant(user.id)}
						/>
					))}
				</div>
			</div>

			<div className="form-group">
				<button type="submit" className="submit-button">Crear viaje</button>
			</div>

		</form>
	</div>
</>

	);
}

export default TripCreation;
