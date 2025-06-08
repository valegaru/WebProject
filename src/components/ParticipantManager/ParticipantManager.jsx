import { useState } from 'react';
import { searchUsersByName, searchUsersByEmail } from '../../utils/firebaseUtils';
import ParticipantCard from '../ParticipantCard/ParticipantCard';

function ParticipantManager({ participants, onParticipantsChange }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const handleSearchChange = async (e) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (value.length >= 1) {
			const [nameResults, emailResults] = await Promise.all([
				searchUsersByName(value), 
				searchUsersByEmail(value)
			]);

			// Combinar sin duplicados (por id)
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
		const alreadyAdded = participants.some((p) => p.id === user.id);
		if (!alreadyAdded) {
			onParticipantsChange([...participants, user]);
		}
		setSearchTerm('');
		setSearchResults([]);
	};

	const removeParticipant = (id) => {
		onParticipantsChange(participants.filter((p) => p.id !== id));
	};

	return (
		<div className="participant-manager">
			<div className="form-group">
				<label>Buscar participantes:</label>
				<input
					type="text"
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder="Escribe un nombre..."
					className="input"
				/>
				{searchResults.length > 0 && (
					<ul className="search-results">
						{searchResults.map((user) => (
							<li 
								key={user.id} 
								onClick={() => addParticipant(user)} 
								className="search-result-item"
							>
								{user.username} ({user.email})
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="form-group">
				<label>Participantes agregados:</label>
				<div className="participant-list">
					{participants.map((user) => (
						<ParticipantCard
							key={user.id}
							name={user.username}
							avatarUrl={user.photoUrl}
							email={user.email}
							onRemove={() => removeParticipant(user.id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default ParticipantManager;