import React, { useState } from 'react';
import { addEventToDay, searchUsersByName, searchUsersByEmail } from '../../../utils/firebaseUtils';
import './AddExpenseModal.css';
import { useDispatch } from 'react-redux';
import { addEvent } from '../../../store/eventSlice/EventSlice';

const AddEventModal = ({ tripID, expenseID, date, onClose, onEventAdded }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('incomplete');

  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 1) {
      const [nameResults, emailResults] = await Promise.all([
        searchUsersByName(value),
        searchUsersByEmail(value),
      ]);

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
    const alreadyAdded = participants.some((p) => p.userID === user.id);
    if (!alreadyAdded) {
      setParticipants([...participants, { userID: user.id, contribution: '' }]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleParticipantChange = (index, field, value) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const removeParticipant = (index) => {
    const updated = [...participants];
    updated.splice(index, 1);
    setParticipants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
          <input value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start Time (e.g. 12:00)" required />
          <input value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End Time (e.g. 13:00)" required />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>

          <div className="form-group">
            <label>Search Participants:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or email"
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

          {participants.map((p, index) => (
            <div key={index} className="participant-row">
              <input
                type="text"
                placeholder="Contribution"
                value={p.contribution}
                onChange={(e) => handleParticipantChange(index, 'contribution', e.target.value)}
              />
              <span>User ID: {p.userID}</span>
              <button type="button" onClick={() => removeParticipant(index)}>Remove</button>
            </div>
          ))}

          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
