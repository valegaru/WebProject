<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
>>>>>>> main
import './MatchmakerRoom.css';
import Navbar from '../../components/Navbar/Navbar';
import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
import ParticipantList from '../../components/ParticipantList/ParticipantList';
import RoomInfoPanel from '../../components/RoomInfoPanel/RoomInfoPanel';

const participants = [
	{ name: 'Juanito', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg' },
	{ name: 'Sara V.', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
	{ name: 'Carlos', avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg' },
	{ name: 'María', avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg' },
	{ name: 'Pedro', avatarUrl: 'https://randomuser.me/api/portraits/men/77.jpg' },
	{ name: 'Lucía', avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg' },
];

function MatchmakerRoom() {
<<<<<<< HEAD
	// Estado para manejar la media query
	const [isMobile, setIsMobile] = useState(false);

	// Detectamos el tamaño de la pantalla
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768); // Cambia esto si quieres otro breakpoint
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		// Cleanup del evento
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<>
			<Navbar />
			<div className='matchmaker-room-container'>
				{/* Barra de progreso */}
				<StepsProgressBar className={`progress-bar ${isMobile ? 'order-1' : ''}`} currentStep={1} />

				{/* Contenido Principal */}
				<div className='main-content'>
					{/* QR Section */}
					<RoomInfoPanel
						className={`qr ${isMobile ? 'order-2' : ''}`}
						code='135783'
						qrImage='https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'
						buttonRoute='/questions'
					/>

					{/* Lista de participantes */}
					<ParticipantList className={`participants ${isMobile ? 'order-3' : ''}`} participants={participants} />
=======
	return (
		<>
			<Navbar />
			<div className="matchmaker-room-container">
				<StepsProgressBar currentStep={1} />
				<div className="main-content">
					<ParticipantList participants={participants} />
					<RoomInfoPanel
						code="135783"
						qrImage="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
						buttonRoute="/questions"
					/>
>>>>>>> main
				</div>
			</div>
		</>
	);
}

export default MatchmakerRoom;
<<<<<<< HEAD

// import './MatchmakerRoom.css';
// import Navbar from '../../components/Navbar/Navbar';
// import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
// import ParticipantList from '../../components/ParticipantList/ParticipantList';
// import RoomInfoPanel from '../../components/RoomInfoPanel/RoomInfoPanel';

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
// 			<div className='matchmaker-room-container'>
// 				<StepsProgressBar className='progress-bar' currentStep={1} />
// 				<div className='main-content'>
// 					<ParticipantList className='participants' participants={participants} />
// 					<RoomInfoPanel
// 						className='qr'
// 						code='135783'
// 						qrImage='https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'
// 						buttonRoute='/questions'
// 					/>
// 				</div>
// 			</div>
// 		</>
// 	);
// }

// export default MatchmakerRoom;
=======
>>>>>>> main
