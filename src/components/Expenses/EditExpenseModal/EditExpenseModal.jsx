import React, { useState, useEffect } from 'react';
import { updateExpenseEvent, deleteExpenseEvent } from '../../../utils/firebaseUtils';
import './EditExpenseModal.css';
import { useDispatch } from 'react-redux';
import { updateEvent, removeEvent } from '../../../store/eventSlice/EventSlice';
import ParticipantManager from '../../ParticipantManager/ParticipantManager';
import SearchBar from '../../Map/SearchBar/SearchBar';

const EditExpenseModal = ({ event, onClose, onEventUpdated, onEventDeleted }) => {
	const dispatch = useDispatch();
	const [coordinates, setCoordinates] = useState({ 
		lat: event.coordinates?.lat || null, 
		lng: event.coordinates?.lng || null 
	});

	const [title, setTitle] = useState(event.title || '');
	const [description, setDescription] = useState(event.description || '');
	const [amount, setAmount] = useState(event.amount?.toString() || '');
	const [category, setCategory] = useState(event.category || '');
	const [date, setDate] = useState(() => {
		if (event.start) {
			const startDate = new Date(event.start);
			return startDate.toISOString().split('T')[0];
		}
		return new Date().toISOString().split('T')[0];
	});
	const [startTime, setStartTime] = useState(() => {
		if (event.start) {
			const startDate = new Date(event.start);
			return startDate.toTimeString().slice(0, 5);
		}
		return '';
	});
	const [endTime, setEndTime] = useState(() => {
		if (event.end) {
			const endDate = new Date(event.end);
			return endDate.toTimeString().slice(0, 5);
		}
		return '';
	});
	const [location, setLocation] = useState(event.location || '');
	const [paymentMethod, setPaymentMethod] = useState(event.paymentMethod || '');
	const [notes, setNotes] = useState(event.notes || '');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

	const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'];

	useEffect(() => {
		// Initialize participants from event data
		if (event.participants && Array.isArray(event.participants)) {
			const participants = event.participants.map(p => ({
				id: p.userID,
				username: p.username,
				email: p.email
			}));
			setSelectedParticipants(participants);
			
			const contributions = {};
			event.participants.forEach(p => {
				contributions[p.userID] = p.contribution?.toString() || '';
			});
			setParticipantContributions(contributions);
		}
	}, [event]);

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
		const [hours, minutes] = timeString.split(':');
		const dt = new Date(dateString);
		dt.setHours(parseInt(hours), parseInt(minutes), 0, 0);
		return dt;
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

	const handleUpdate = async (e) => {
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
				description: description.trim(),
				amount: parseFloat(amount),
				category,
				start: startDateTime,
				end: endDateTime,
				location: location.trim(),
				coordinates,
				paymentMethod,
				notes: notes.trim(),
				participants,
				date,
			};

			await updateExpenseEvent(event.tripID, event.expenseID, event.id, eventData);

			const updatedCalendarEvent = {
				...event,
				...eventData,
				updatedAt: new Date(),
			};

			dispatch(updateEvent(updatedCalendarEvent));
			onEventUpdated && onEventUpdated(updatedCalendarEvent);
		} catch (err) {
			console.error('Error updating event:', err);
			setError('An error occurred while updating. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		setLoading(true);
		try {
			await deleteExpenseEvent(event.tripID, event.expenseID, event.id);
			dispatch(removeEvent(event.id));
			onEventDeleted && onEventDeleted();
		} catch (err) {
			console.error('Error deleting event:', err);
			setError('An error occurred while deleting. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='modal-overlay'>
			<div className='edit-expense-modal'>
				<h3>Edit Expense Event</h3>

				{error && <div className='error-banner'>{error}</div>}

				<form onSubmit={handleUpdate}>
					<div className='form-row'>
						<input 
							value={title} 
							onChange={(e) => setTitle(e.target.value)} 
							placeholder='Title *' 
							required 
						/>
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
						<input 
							type='date' 
							value={date} 
							onChange={(e) => setDate(e.target.value)} 
							required 
						/>
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
						<input 
							type='time' 
							value={startTime} 
							onChange={(e) => setStartTime(e.target.value)} 
							required 
						/>
						<input 
							type='time' 
							value={endTime} 
							onChange={(e) => setEndTime(e.target.value)} 
						/>
					</div>

					<div className='form-row'>
						<select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
							<option value=''>Payment Method</option>
							{paymentMethods.map((m) => (
								<option key={m} value={m}>
									{m}
								</option>
							))}
						</select>
					</div>

					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Description'
						rows='3'
					/>

					<div className='form-row'>
						<SearchBar
							googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
							onLocationSelect={(loc) => {
								setLocation(loc.placeDetails.name);
								setCoordinates({ lat: loc.lat, lng: loc.lng });
							}}
							initialValue={location}
						/>
					</div>

					<ParticipantManager 
						participants={selectedParticipants} 
						onParticipantsChange={handleParticipantsChange} 
					/>

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

					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder='Additional notes...'
						rows='3'
					/>

					<div className='modal-buttons'>
						<button type='submit' disabled={loading}>
							{loading ? 'Updating...' : 'Update Event'}
						</button>
						<button 
							type='button' 
							className='delete-button'
							onClick={() => setShowDeleteConfirm(true)} 
							disabled={loading}
						>
							Delete Event
						</button>
						<button type='button' onClick={onClose} disabled={loading}>
							Cancel
						</button>
					</div>
				</form>

				{showDeleteConfirm && (
					<div className='delete-confirm-overlay'>
						<div className='delete-confirm-modal'>
							<h4>Confirm Delete</h4>
							<p>Are you sure you want to delete this expense event? This action cannot be undone.</p>
							<div className='confirm-buttons'>
								<button 
									className='confirm-delete' 
									onClick={handleDelete}
									disabled={loading}
								>
									{loading ? 'Deleting...' : 'Yes, Delete'}
								</button>
								<button onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EditExpenseModal;