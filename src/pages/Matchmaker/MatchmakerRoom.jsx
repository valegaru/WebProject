import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-qr-code';
import './MatchmakerRoom.css';

function MatchmakerRoom() {
	const [roomId, setRoomId] = useState('');
	const navigate = useNavigate();

	const handleCreateRoom = async () => {
		const newRoomId = uuidv4();

		const destinations = [
			{
				name: 'Barcelona',
				image:
					'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg',
				aesthetic: 'Stunning architecture.',
				vibe: 'Beachside relaxation and nightlife.',
				gastronomy: 'Tapas, paella, and fresh seafood.',
				renowned: 'Football, art, history, and Mediterranean sunsets.',
				activities: [
					{
						image:
							'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/d7/0b/9c/salon-principal.jpg?w=900&h=500&s=1',
						label: '7 Portes',
					},
					{
						image:
							'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/e6/28/1a/opium-mar-club.jpg?w=1200&h=-1&s=1',
						label: 'Opium',
					},
					{
						image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFhHLNIJtwWE48GdslCOHhkmqikXHQrJLf2g&s',
						label: 'National Art Museum of Catalonia',
					},
				],
				attractions: [
					{
						image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRX1Aljp-xBwkgIDW5LKS336X9OMYzp5xAjA&s',
						label: 'La Sagrada Familia',
					},
					{
						image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz2SqFo8Z2vNKfmqSi4uxzWJkNa65DcGD5fQ&s',
						label: 'Park Güell',
					},
					{
						image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Casa_Mil%C3%A0%2C_general_view.jpg',
						label: 'Casa Milà',
					},
				],
			},
			{
				name: 'Kyoto',
				image:
					'https://boutiquejapan.com/wp-content/uploads/2019/07/yasaka-pagoda-higashiyama-kyoto-japan-1140x761.jpg',
				aesthetic: 'Traditional temples and cherry blossoms.',
				vibe: 'Tranquil, historic, and spiritual.',
				gastronomy: 'Kaiseki, matcha, and ramen.',
				renowned: 'Geishas, bamboo forests, and Zen gardens.',
				activities: [
					{
						image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2RigRZJ4XGSGf_dAyzvYTabTvDWljhNNZlg&s',
						label: 'Kaiseki Dinner',
					},
					{
						image: 'https://d2j57bp7wdztc7.cloudfront.net/pages/images/tea-ceremony/tea-ceremony-gion-01.jpg',
						label: 'Tea Ceremony',
					},
					{
						image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/13/bc/d4/bc.jpg',
						label: 'Geisha Show',
					},
				],
				attractions: [
					{
						image:
							'//https:es.cloudinary.com/jnto/image/upload/w_750,h_503,fl_lossy,f_auto/v1648523563/kyoto/20201026_fushimi_inari_taisha_shrine_01',
						label: 'Fushimi Inari Shrine',
					},
					{
						image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGS3pzLfCXr0di0Mrgd_R56tYy4DrwNF-Blw&s',
						label: 'Arashiyama Bamboo Grove',
					},
					{
						image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9j4jI_NuLic6fnjcEPZZ-kMzORfL9m9v7A&s',
						label: 'Kinkaku-ji (Golden Pavilion)',
					},
				],
			},
		];

		await setDoc(doc(db, 'matchLists', newRoomId), {
			destinations,
			votes: {},
			createdAt: new Date(),
		});

		setRoomId(newRoomId);
	};

	const roomLink = `${window.location.origin}/matchselection/${roomId}`;

	return (
		<div className='room-container'>
			<h2>🧩 Crea tu Sala de Matchmaker</h2>
			<button onClick={handleCreateRoom}>Crear Sala</button>

			{roomId && (
				<div style={{ marginTop: '2rem', backgroundColor: 'white', padding: '1rem' }}>
					<p>Escanea este QR o comparte el link:</p>
					<QRCode value={roomLink} size={256} />
					<p>
						<a href={roomLink} target='_blank' rel='noreferrer'>
							{roomLink}
						</a>
					</p>
				</div>
			)}
		</div>
	);
}

export default MatchmakerRoom;

// import { useState } from 'react';
// import QRCode from 'react-qr-code';
// import './MatchmakerRoom.css';

// function MatchmakerRoom() {
// 	const [roomId, setRoomId] = useState('');
// 	const [linkReady, setLinkReady] = useState(false);

// 	const handleGenerateLink = () => {
// 		if (!roomId) return alert('Ingresa un ID válido');
// 		setLinkReady(true);
// 	};

// 	const roomLink = `${window.location.origin}/matchselection/${roomId}`;

// 	return (
// 		<div className='room-container'>
// 			<h2>🔗 Generar QR de una Sala Existente</h2>
// 			<input type='text' placeholder='Pega aquí el roomId' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
// 			<button onClick={handleGenerateLink}>Generar QR</button>

// 			{linkReady && (
// 				<div style={{ background: 'white', padding: '16px', marginTop: '20px' }}>
// 					<p>Escanea este código o comparte el link:</p>
// 					<QRCode value={roomLink} size={256} />
// 					<p>
// 						<a href={roomLink} target='_blank' rel='noreferrer'>
// 							{roomLink}
// 						</a>
// 					</p>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

// export default MatchmakerRoom;

// import './MatchmakerRoom.css';
// import Navbar from '../../components/Navbar/Navbar';
// import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
// import ParticipantList from '../../components/ParticipantList/ParticipantList';
// import RoomInfoPanel from '../../components/RoomInfoPanel/RoomInfoPanel';
// import QRCode from 'react-qr-code';

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { db } from '../../services/firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import QRCode from 'react-qr-code';

// function MatchmakerRoom() {
// 	const [roomId, setRoomId] = useState('');
// 	const navigate = useNavigate();

// 	const handleCreateRoom = async () => {
// 		const newRoom = await addDoc(collection(db, 'rooms'), {
// 			destinations: ['París', 'Tokio', 'Roma', 'Nueva York'],
// 			createdAt: new Date(),
// 		});
// 		setRoomId(newRoom.id);
// 	};

// 	const roomLink = `${window.location.origin}/matchselection/${roomId}`;

// 	return (
// 		<div className='room-container'>
// 			<h2>Matchmaker</h2>
// 			<button onClick={handleCreateRoom}>Crear Sala</button>
// 			{roomId && (
// 				<div style={{ background: 'white', padding: '16px', marginTop: '20px' }}>
// 					<p>Comparte este código QR con los participantes:</p>
// 					<QRCode value={roomLink} size={256} />
// 					<p>
// 						O comparte este enlace: <a href={roomLink}>{roomLink}</a>
// 					</p>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

// export default MatchmakerRoom;

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
