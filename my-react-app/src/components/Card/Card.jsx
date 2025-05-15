import React from 'react';
import './Card.css';

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const Card = ({ tripPic, name, startDate, endDate, description, participants = [], onClick }) => {
  return (
    <div className="simple-card" onClick={onClick}>
      <img src={tripPic} alt={name} className="card-img" />

      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        <p className="card-dates">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
        <p className="card-description">{description}</p>
        <p className="card-participants">{participants.length} participants</p>
      </div>
    </div>
  );
};

export default Card;
