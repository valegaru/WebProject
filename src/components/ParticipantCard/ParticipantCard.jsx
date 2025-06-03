import React from 'react';
import './ParticipantCard.css';

const ParticipantCard = ({ name, avatarUrl }) => {
  return (
    <div className="participant-card">
      <img className="avatar" src={avatarUrl} alt={name} />
      <span className="name">{name}</span>
    </div>
  );
};

export default ParticipantCard;
