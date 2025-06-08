import React from 'react';

const DestinationCard = ({ name, coordinates, flagUrl, onRemove }) => {
  return (
    <div className="destination-card">
      <div className="destination-info">
        {flagUrl && (
          <img src={flagUrl} alt={`${name} flag`} className="destination-flag" />
        )}
        <div className="destination-details">
          <h3 className="destination-name">{name}</h3>
          {coordinates && (
            <p className="destination-coords">
              📍 {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>
      <button 
        onClick={() => onRemove(name)}
        className="remove-button"
        aria-label={`Remove ${name}`}
      >
        ✕
      </button>
    </div>
  );
};

export default DestinationCard;