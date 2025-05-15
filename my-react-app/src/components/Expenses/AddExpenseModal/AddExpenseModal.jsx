import React, { useState } from 'react';
import { addEventToDay } from '../../../utils/firebaseUtils'
import './Modal.css'; 

const AddEventModal = ({ tripID, expenseID, date, onClose, onEventAdded }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('incomplete');
  const [participants, setParticipants] = useState([{ contribution: '', userID: '' }]);

  const handleParticipantChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const addParticipant = () => {
    setParticipants([...participants, { contribution: '', userID: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      amount,
      endTime,
      id: Date.now(), // or use a better ID strategy
      participants,
      startTime,
      status,
      title,
    };

    const result = await addEventToDay(tripID, expenseID, date, newEvent);
    if (result) {
      onEventAdded && onEventAdded(result); // notify parent if needed
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Event</h2>
        <form onSubmit={handleSubmit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
          <input value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start Time (e.g. 12:00)" required />
          <input value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End Time (e.g. 13:00)" required />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>

          <h3>Participants</h3>
          {participants.map((p, index) => (
            <div key={index}>
              <input
                value={p.userID}
                onChange={(e) => handleParticipantChange(index, 'userID', e.target.value)}
                placeholder="User ID"
                required
              />
              <input
                value={p.contribution}
                onChange={(e) => handleParticipantChange(index, 'contribution', e.target.value)}
                placeholder="Contribution"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addParticipant}>Add Participant</button>
          <br />
          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
