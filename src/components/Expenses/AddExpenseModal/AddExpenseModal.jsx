import React, { useState } from 'react';
import { addExpenseEvent } from '../../../utils/firebaseUtils';
import './AddExpenseModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent } from '../../../store/eventSlice/EventSlice';
import ParticipantManager from '../../ParticipantManager/ParticipantManager';
import SearchBar from '../../Map/SearchBar/SearchBar';


const AddExpenseModal = ({ tripID, expenseID, onClose, onEventAdded }) => {
	const dispatch = useDispatch();
	const selectedDate = useSelector((state) => state.date.selectedDate);
	const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

	const [date, setDate] = useState(() => {
	if (selectedDate) {
		if (selectedDate instanceof Date) {
			return selectedDate.toISOString().split('T')[0];
		}
		if (typeof selectedDate === 'string' && selectedDate.includes('-')) {
			return selectedDate;
		}
	}
	return new Date().toISOString().split('T')[0];
});

	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [location, setLocation] = useState('');
	const currency = useSelector((state) => state.currency.currency);
	const [status, setStatus] = useState('incomplete');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [selectedParticipants, setSelectedParticipants] = useState([]);
	const [participantContributions, setParticipantContributions] = useState({});

	const categoryOptions = [
		'Food & Dining',
		'Transportation',
		'Accommodation',
		'Entertainment',
		'Shopping',
		'Healthcare',
		'Education',
		'Utilities',
		'Other',
	];

	const handleParticipantsChange = (newParticipants) => {
		setSelectedParticipants(newParticipants);
		const newContributions = {};
		newParticipants.forEach((p) => {
			newContributions[p.id] = participantContributions[p.id] || '';
		});
		setParticipantContributions(newContributions);
	};

	const handleContributionChange = (participantId, contribution) => {
		setParticipantContributions({
			...participantContributions,
			[participantId]: contribution,
		});
	};

	const createDateTime = (dateString, timeString) => {
		if (!timeString) return null;
		const [year, month, day] = dateString.split('-').map(Number);
		const [hours, minutes] = timeString.split(':').map(Number);
		return new Date(year, month - 1, day, hours, minutes, 0); // month is 0-based
	};

	const validateForm = () => {
		if (!title.trim()) {
			setError('Title is required');
			return false;
		}
		if (!amount || parseFloat(amount) <= 0) {
			setError('Valid amount is required');
			return false;
		}
		if (!date) {
			setError('Date is required');
			return false;
		}
		if (!startTime) {
			setError('Start time is required');
			return false;
		}
		if (endTime && startTime >= endTime) {
			setError('End time must be after start time');
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!validateForm()) return;
		setLoading(true);

		try {
			const participants = selectedParticipants.map((p) => ({
				userID: p.id,
				username: p.username,
				email: p.email,
				contribution: participantContributions[p.id] || '',
			}));

			const startDateTime = createDateTime(date, startTime);
			const endDateTime = endTime ? createDateTime(date, endTime) : startDateTime;

			const eventData = {
				title: title.trim(),
				amount: parseFloat(amount),
				category,
				start: startDateTime,
				end: endDateTime,
				location: location.trim(),
                coordinates, 
				currency,
				participants,
				tripID,
				expenseID,
				date,
			};

			const eventId = await addExpenseEvent(tripID, expenseID, eventData);
			if (!eventId) throw new Error('No ID returned');

			const calendarEvent = {
				id: eventId,
				title,
				start: startDateTime,
				end: endDateTime,
				amount: parseFloat(amount),
				category,
				participants,
				location,
				coordinates,
				currency,
				tripID,
				expenseID,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			dispatch(addEvent(calendarEvent));
			onEventAdded && onEventAdded(calendarEvent);
			onClose();
		} catch (err) {
			console.error('Error saving event:', err);
			setError('An error occurred while saving. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='modal-overlay'>
			<div className='add-expense-modal'>
				<h3>Add Expense Event</h3>

				{error && <div className='error-banner'>{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className='form-row'>
						<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title *' required />
						<input
							type='number'
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder='Amount *'
							min='0'
							step='0.01'
							required
						/>
					</div>

					<div className='form-row'>
						<input type='date' value={date} onChange={(e) => setDate(e.target.value)} required />
						<select value={category} onChange={(e) => setCategory(e.target.value)}>
							<option value=''>Select Category</option>
							{categoryOptions.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					</div>

					<div className='form-row'>
						<input type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
						<input type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
					</div>

					<div className='form-row'>
						<SearchBar
 							googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
  							onLocationSelect={(loc) => {
    						setLocation(loc.placeDetails.name); 
    						setCoordinates({ lat: loc.lat, lng: lng });
  							}}
						/>
					</div>

					<ParticipantManager participants={selectedParticipants} onParticipantsChange={handleParticipantsChange} />

					{selectedParticipants.length > 0 && (
						<div className='contributions-section'>
							<h4>Participant Contributions:</h4>
							{selectedParticipants.map((p) => (
								<div key={p.id} className='participant-contribution-row'>
									<span className='participant-name'>
										{p.username} ({p.email})
									</span>
									<input
										type='text'
										placeholder='Contribution'
										value={participantContributions[p.id] || ''}
										onChange={(e) => handleContributionChange(p.id, e.target.value)}
										className='contribution-input'
									/>
								</div>
							))}
						</div>
					)}

					<div className='modal-buttons'>
						<button type='submit' disabled={loading}>
							{loading ? 'Saving...' : 'Add Event'}
						</button>
						<button type='button' onClick={onClose} disabled={loading}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddExpenseModal;