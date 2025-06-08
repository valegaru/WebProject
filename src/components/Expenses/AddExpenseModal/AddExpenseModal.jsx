import React, { useState } from 'react';
import { addExpenseEvent } from '../../../utils/firebaseUtils';
import './AddExpenseModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent } from '../../../store/eventSlice/EventSlice';
import ParticipantManager from '../../ParticipantManager/ParticipantManager';

const AddExpenseModal = ({ tripID, expenseID, onClose, onEventAdded }) => {
	const dispatch = useDispatch();
	const selectedDate = useSelector((state) => state.date.selectedDate);
	const currency = useSelector((state) => state.currency.currency);

	const [date, setDate] = useState(() => {
		if (selectedDate instanceof Date) {
			return selectedDate.toISOString().split('T')[0];
		}
		if (typeof selectedDate === 'string' && selectedDate.includes('-')) {
			return selectedDate;
		}
		return new Date().toISOString().split('T')[0];
	});

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [location, setLocation] = useState('');
	const [tags, setTags] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');
	const [status, setStatus] = useState('incomplete');
	const [notes, setNotes] = useState('');
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
	const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'];

	const handleParticipantsChange = (newParticipants) => {
		setSelectedParticipants(newParticipants);
		const newContributions = {};
		newParticipants.forEach((p) => {
			newContributions[p.id] = participantContributions[p.id] || '';
		});
		setParticipantContributions(newContributions);
	};

	const handleContributionChange = (participantId, value) => {
		setParticipantContributions({
			...participantContributions,
			[participantId]: value,
		});
	};

	const createDateTime = (dateStr, timeStr) => {
		if (!timeStr) return null;
		const [h, m] = timeStr.split(':');
		const dt = new Date(dateStr);
		dt.setHours(+h, +m, 0, 0);
		return dt;
	};

	const validateForm = () => {
		if (!title.trim()) {
			setError('Title is required');
			return false;
		}
		if (!amount || +amount <= 0) {
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

		const participantsPayload = selectedParticipants.map((p) => ({
			userID: p.id,
			username: p.username,
			email: p.email,
			contribution: participantContributions[p.id] || '',
		}));

		const eventData = {
			title: title.trim(),
			description: description.trim(),
			amount: +amount,
			category,
			start: createDateTime(date, startTime),
			end: endTime ? createDateTime(date, endTime) : createDateTime(date, startTime),
			location: location.trim(),
			tags: tags
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean),
			currency,
			paymentMethod,
			status,
			notes: notes.trim(),
			participants: participantsPayload,
			tripID,
			expenseID,
			date,
		};

		try {
			const eventId = await addExpenseEvent(tripID, expenseID, eventData);
			if (eventId) {
				const calendarEvent = {
					id: eventId,
					...eventData,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				dispatch(addEvent(calendarEvent));
				onEventAdded?.(calendarEvent);
				onClose();
			} else {
				setError('Failed to save event. Please try again.');
			}
		} catch (err) {
			console.error(err);
			setError('An error occurred while saving the event.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='add-expense-modal-overlay'>
			<div className='add-expense-modal'>
				<h3 className='add-expense-modal__title'>Add Expense Event</h3>

				{error && <div className='add-expense-modal__error'>{error}</div>}

				<form className='add-expense-form' onSubmit={handleSubmit}>
					<div className='add-expense-form__row'>
						<input
							className='add-expense-form__input'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Title *'
							required
						/>
						<input
							className='add-expense-form__input'
							type='number'
							min='0'
							step='0.01'
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder='Amount *'
							required
						/>
					</div>

					<div className='add-expense-form__row'>
						<input
							className='add-expense-form__input'
							type='date'
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
						/>
						<select className='add-expense-form__select' value={category} onChange={(e) => setCategory(e.target.value)}>
							<option value=''>Select Category</option>
							{categoryOptions.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					</div>

					<div className='add-expense-form__row'>
						<input
							className='add-expense-form__input'
							type='time'
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
							placeholder='Start Time *'
							required
						/>
						<input
							className='add-expense-form__input'
							type='time'
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
							placeholder='End Time'
						/>
					</div>

					<div className='add-expense-form__row'>
						<select
							className='add-expense-form__select'
							value={currency}
							onChange={(e) => {
								/* no-op, as currency from store */
							}}
							disabled
						>
							<option value={currency}>{currency}</option>
						</select>
						<select
							className='add-expense-form__select'
							value={paymentMethod}
							onChange={(e) => setPaymentMethod(e.target.value)}
						>
							<option value=''>Payment Method</option>
							{paymentMethods.map((m) => (
								<option key={m} value={m}>
									{m}
								</option>
							))}
						</select>
					</div>

					<textarea
						className='add-expense-form__textarea'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Description'
						rows='3'
					/>

					<div className='add-expense-form__row'>
						<input
							className='add-expense-form__input'
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							placeholder='Location'
						/>
						<input
							className='add-expense-form__input'
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder='Tags (comma-separated)'
						/>
					</div>

					<select className='add-expense-form__select' value={status} onChange={(e) => setStatus(e.target.value)}>
						<option value='incomplete'>Incomplete</option>
						<option value='complete'>Complete</option>
						<option value='pending'>Pending</option>
						<option value='cancelled'>Cancelled</option>
					</select>

					<ParticipantManager participants={selectedParticipants} onParticipantsChange={handleParticipantsChange} />

					{selectedParticipants.length > 0 && (
						<div className='add-expense-form__contributions'>
							<h4 className='add-expense-form__contributions-title'>Participant Contributions:</h4>
							{selectedParticipants.map((p) => (
								<div key={p.id} className='participant-contribution'>
									<span className='participant-contribution__name'>
										{p.username} ({p.email})
									</span>
									<input
										className='participant-contribution__input'
										type='text'
										placeholder='Contribution'
										value={participantContributions[p.id] || ''}
										onChange={(e) => handleContributionChange(p.id, e.target.value)}
									/>
								</div>
							))}
						</div>
					)}

					<div className='add-expense-modal__actions'>
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
