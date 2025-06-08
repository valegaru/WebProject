// src/components/DestinationCard/DestinationCard.jsx
import React from 'react';
import '../ParticipantCard/ParticipantCard.css'; // reuse styles
import './DestinationCard.css';

const DestinationCard = ({ name, flagUrl, onRemove }) => {
	return (
		<div className='participant-card destination-card'>
			{flagUrl && <img className='avatar' src={flagUrl} alt={`${name} flag`} />}
			<div className='info'>
				<span className='name'>{name}</span>
			</div>
			<button className='remove-button' onClick={() => onRemove(name)}>
				✖
			</button>
		</div>
	);
};

export default DestinationCard;
