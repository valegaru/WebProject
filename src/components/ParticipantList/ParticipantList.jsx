import React from 'react';
import ParticipantCard from '../ParticipantCard/ParticipantCard';
import './ParticipantList.css';

const ParticipantList = ({ participants }) => {
  return (
    <div className="participant-list">
      <h2>Participantes conectados</h2>
      <hr className="divider" />
      <div className="grid-container">
        {participants.map((participant, index) => (
          <ParticipantCard
            key={index}
            name={participant.name}
            avatarUrl={participant.avatarUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
