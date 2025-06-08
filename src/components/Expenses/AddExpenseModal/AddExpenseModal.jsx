import React, { useState } from 'react';
import { addExpenseEvent } from '../../../utils/firebaseUtils';
import './AddExpenseModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent } from '../../../store/eventSlice/EventSlice';
import ParticipantManager from '../../ParticipantManager/ParticipantManager';

const AddEventModal = ({ tripID, expenseID, onClose, onEventAdded }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.date.selectedDate);
  
  // Initialize date state with selected date from Redux or current date
  const [date, setDate] = useState(() => {
    if (selectedDate) {
      // If selectedDate is a Date object, format it for input
      if (selectedDate instanceof Date) {
        return selectedDate.toISOString().split('T')[0];
      }
      // If selectedDate is already a string in YYYY-MM-DD format
      if (typeof selectedDate === 'string' && selectedDate.includes('-')) {
        return selectedDate;
      }
    }
    // Default to today's date
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
  const currency = useSelector((state) => state.currency.currency)
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
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Digital Wallet',
    'Other'
  ];

  const handleParticipantsChange = (newParticipants) => {
    setSelectedParticipants(newParticipants);
    const newContributions = {};
    newParticipants.forEach(participant => {
      newContributions[participant.id] = participantContributions[participant.id] || '';
    });
    setParticipantContributions(newContributions);
  };

  const handleContributionChange = (participantId, contribution) => {
    setParticipantContributions({
      ...participantContributions,
      [participantId]: contribution
    });
  };

  const createDateTime = (dateString, timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':');
    const dateTime = new Date(dateString);
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return dateTime;
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
      // Convert participants to the format expected by the backend
      const participants = selectedParticipants.map(participant => ({
        userID: participant.id,
        username: participant.username,
        email: participant.email,
        contribution: participantContributions[participant.id] || ''
      }));

      // Create start and end DateTime objects
      const startDateTime = createDateTime(date, startTime);
      const endDateTime = endTime ? createDateTime(date, endTime) : startDateTime;

      // Prepare event data for Firebase
      const eventData = {
        title: title.trim(),
        description: description.trim(),
        amount: parseFloat(amount),
        category: category,
        start: startDateTime,
        end: endDateTime,
        location: location.trim(),
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        currency: currency,
        paymentMethod: paymentMethod,
        status: status,
        notes: notes.trim(),
        participants: participants,
        tripID: tripID,
        expenseID: expenseID,
        date: date // Keep original date for reference
      };

      // Add to Firebase using the new utility function
      const eventId = await addExpenseEvent(tripID, expenseID, eventData);
      
      if (eventId) {
        // Create event object for Redux (compatible with calendar)
        const calendarEvent = {
          id: eventId,
          title: title,
          start: startDateTime,
          end: endDateTime,
          amount: parseFloat(amount),
          category: category,
          status: status,
          participants: participants,
          location: location,
          description: description,
          tags: eventData.tags,
          currency: currency,
          paymentMethod: paymentMethod,
          notes: notes,
          tripID: tripID,
          expenseID: expenseID,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Add to Redux store
        dispatch(addEvent(calendarEvent));
        
        // Call callback if provided
        onEventAdded && onEventAdded(calendarEvent);
        
        // Close modal
        onClose();
      } else {
        setError('Failed to save event. Please try again.');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError('An error occurred while saving the event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Expense Event</h3>
        
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Title *" 
              required 
            />
            <input 
              type="number"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Amount *" 
              min="0"
              step="0.01"
              required 
            />
          </div>

          <div className="form-row">
            <input 
              type="date"
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <input 
              type="time"
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              placeholder="Start Time *" 
              required 
            />
            <input 
              type="time"
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              placeholder="End Time" 
            />
          </div>

          <div className="form-row">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="COP">COP</option>
            </select>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Payment Method</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows="3"
          />

          <div className="form-row">
            <input 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Location" 
            />
            <input 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="Tags (comma-separated)" 
            />
          </div>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <ParticipantManager
            participants={selectedParticipants}
            onParticipantsChange={handleParticipantsChange}
          />

          {selectedParticipants.length > 0 && (
            <div className="contributions-section">
              <h4>Participant Contributions:</h4>
              {selectedParticipants.map((participant) => (
                <div key={participant.id} className="participant-contribution-row">
                  <span className="participant-name">
                    {participant.username} ({participant.email})
                  </span>
                  <input
                    type="text"
                    placeholder="Contribution"
                    value={participantContributions[participant.id] || ''}
                    onChange={(e) => handleContributionChange(participant.id, e.target.value)}
                    className="contribution-input"
                  />
                </div>
              ))}
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows="3"
          />

          <div className="modal-buttons">
            <button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : undefined,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Add Event'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;