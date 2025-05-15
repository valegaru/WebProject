import React from 'react';
import './Card.css';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const Card = ({ tripPic, name, startDate, endDate, description, participants = [], onClick }) => {
  return (
    <div className="simple-card" onClick={onClick}>
      {tripPic && <img src={tripPic} alt={name || 'Trip image'} className="card-img" />}

      <div className="card-content">
        {name && <h2 className="card-title">{name}</h2>}

        {(startDate || endDate) && (
          <p className="card-dates">
            {startDate && formatDate(startDate)} {startDate && endDate && ' - '} {endDate && formatDate(endDate)}
          </p>
        )}

        {description && <p className="card-description">{description}</p>}

        {participants.length > 0 && (
          <p className="card-participants">{participants.length} participant{participants.length > 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
