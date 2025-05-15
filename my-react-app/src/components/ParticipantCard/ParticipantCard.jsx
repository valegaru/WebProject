// ParticipantCard.js
import React from 'react';
import './ParticipantCard.css';

const ParticipantCard = ({ name, avatarUrl, email, onRemove }) => {
  return (
    <div className="participant-card">
      <img className="avatar" src={avatarUrl} alt={name} />
      <div className="info">
        <span className="name">{name}</span>
        <span className="email">{email}</span>
      </div>
      <button className="remove-button" onClick={onRemove}>✖</button>
    </div>
  );
};

export default ParticipantCard;
