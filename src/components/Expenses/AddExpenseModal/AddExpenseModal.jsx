import React, { useState } from 'react';
import { addEventToDay } from '../../../utils/firebaseUtils';
import './AddExpenseModal.css';
import { useDispatch } from 'react-redux';
import { addEvent } from '../../../store/eventSlice/EventSlice';
import ParticipantManager from '../../ParticipantManager/ParticipantManager';

const AddEventModal = ({ tripID, expenseID, date, onClose, onEventAdded }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('incomplete');

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [participantContributions, setParticipantContributions] = useState({});

  const handleParticipantsChange = (newParticipants) => {
    setSelectedParticipants(newParticipants);
    
    // Remove contributions for participants that are no longer selected
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert participants to the format expected by the backend
    const participants = selectedParticipants.map(participant => ({
      userID: participant.id,
      contribution: participantContributions[participant.id] || ''
    }));

    const newEvent = {
      amount,
      endTime,
      id: Date.now(),
      participants,
      startTime,
      status,
      title,
    };

    const result = await addEventToDay(tripID, expenseID, date, newEvent);
    if (result) {
      dispatch(addEvent(newEvent));
      onEventAdded && onEventAdded(result);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Event</h3>
        <form onSubmit={handleSubmit}>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Title" 
            required 
          />
          <input 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Amount" 
            required 
          />
          <input 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            placeholder="Start Time (e.g. 12:00)" 
            required 
          />
          <input 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            placeholder="End Time (e.g. 13:00)" 
            required 
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
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

          <div className="modal-buttons">
            <button type="submit">Add Event</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;