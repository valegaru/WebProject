// import './MatchmakerRoom.css';
// import Navbar from '../../components/Navbar/Navbar';
// import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
// import ParticipantList from '../../components/ParticipantList/ParticipantList';
// import RoomInfoPanel from '../../components/RoomInfoPanel/RoomInfoPanel';
// import QRCode from 'react-qr-code';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';

function MatchmakerRoom() {
	const [roomId, setRoomId] = useState('');
	const navigate = useNavigate();

	const handleCreateRoom = async () => {
		const newRoom = await addDoc(collection(db, 'rooms'), {
			destinations: ['París', 'Tokio', 'Roma', 'Nueva York'],
			createdAt: new Date(),
		});
		setRoomId(newRoom.id);
	};

	const roomLink = `${window.location.origin}/matchselection/${roomId}`;

	return (
		<div className='room-container'>
			<h2>Matchmaker</h2>
			<button onClick={handleCreateRoom}>Crear Sala</button>
			{roomId && (
				<div style={{ background: 'white', padding: '16px', marginTop: '20px' }}>
					<p>Comparte este código QR con los participantes:</p>
					<QRCode value={roomLink} size={256} />
					<p>
						O comparte este enlace: <a href={roomLink}>{roomLink}</a>
					</p>
				</div>
			)}
		</div>
	);
}

export default MatchmakerRoom;

// const participants = [
// 	{ name: 'Juanito', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg' },
// 	{ name: 'Sara V.', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
// 	{ name: 'Carlos', avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg' },
// 	{ name: 'María', avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg' },
// 	{ name: 'Pedro', avatarUrl: 'https://randomuser.me/api/portraits/men/77.jpg' },
// 	{ name: 'Lucía', avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg' },
// ];

// function MatchmakerRoom() {
// 	return (
// 		<>
// 			<Navbar />
// 			<div className="matchmaker-room-container">
// 				<StepsProgressBar currentStep={1} />
// 				<div className="main-content">
// 					<ParticipantList participants={participants} />
// 					<RoomInfoPanel
// 						code="135783"
// 						qrImage="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
// 						buttonRoute="//matchselection"
// 					/>
// 				</div>
// 			</div>
// 		</>
// 	);
// }

// export default MatchmakerRoom;
