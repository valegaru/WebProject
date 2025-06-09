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
				name: 'Paris',
				image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', // Torre Eiffel
				aesthetic: 'Romantic boulevards and world-class art.',
				vibe: 'Chic cafés, river strolls, elegant and historic.',
				gastronomy: 'Croissants, cheese, wine and haute cuisine.',
				renowned: 'Iconic landmarks like the Eiffel Tower and Louvre.',
				activities: [
					{
						image:
							'https://images.unsplash.com/photo-1567187155374-cd9135b1f247?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Seine River Cruise',
					},
					{
						image:
							'https://images.unsplash.com/photo-1587648415693-4a5362b2ce41?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Louvre Tour',
					},
					{
						image:
							'https://plus.unsplash.com/premium_photo-1718285549233-42414e1c16f9?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Montmartre Walk',
					},
				],
				attractions: [
					{ image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', label: 'Eiffel Tower' },
					{
						image:
							'https://images.unsplash.com/photo-1581211653431-310ba15ff9bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Notre-Dame Cathedral',
					},
					{
						image:
							'https://images.unsplash.com/photo-1621610212025-da775e84bea9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Sacré‑Cœur',
					},
				],
			},
			{
				name: 'Sydney',
				image:
					'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Opera House
				aesthetic: 'Modern architecture meeting ocean vistas.',
				vibe: 'Vibrant, open-air lifestyle by the harbour.',
				gastronomy: 'Fresh seafood, multicultural cafés, Aussie BBQ.',
				renowned: 'Sydney Opera House and Harbour Bridge views.',
				activities: [
					{
						image:
							'hhttps://images.unsplash.com/photo-1732354235412-637ab1fccdfc?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Sydney Harbour Cruise',
					},
					{
						image:
							'https://images.unsplash.com/photo-1719412371473-653b89a26fb9?q=80&w=1329&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Bridge Climb',
					},
					{
						image:
							'https://images.unsplash.com/photo-1726311189805-e986e481e916?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Bondi Beach Surfing',
					},
				],
				attractions: [
					{
						image:
							'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?q=80&w=1132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Sydney Opera House',
					},
					{
						image:
							'https://images.unsplash.com/photo-1734237690805-13b339a085dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Harbour Bridge Pylon Lookout',
					},
					{
						image:
							'https://plus.unsplash.com/premium_photo-1678655852256-5fc5670b83eb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Royal Botanic Garden',
					},
				],
			},
			{
				name: 'Rome',
				image:
					'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Colosseum
				aesthetic: 'Ancient ruins with Renaissance elegance.',
				vibe: 'Bustling piazzas, gelato, timeless art.',
				gastronomy: 'Pasta, pizza al taglio, espresso and gelato.',
				renowned: 'The Colosseum, Vatican City and Baroque fountains.',
				activities: [
					{
						image:
							'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Colosseum Tour',
					},
					{
						image:
							'https://images.unsplash.com/photo-1586884542514-f6bef0283446?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Vatican Museums',
					},
					{
						image:
							'https://images.unsplash.com/photo-1711287178549-dc9def408d94?q=80&w=1269&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Treví Fountain Visit',
					},
				],
				attractions: [
					{
						image:
							'https://images.unsplash.com/photo-1684275507407-28032196faeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Pantheon',
					},
					{
						image:
							'https://images.unsplash.com/photo-1636804907035-8ae6360f1d4f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Spanish Steps',
					},
					{
						image:
							'https://images.unsplash.com/photo-1594328253710-3f7067cedbe8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'St. Peter’s Basilica',
					},
				],
			},
			{
				name: 'New York',
				image:
					'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Manhattan skyline
				aesthetic: 'Iconic skyline of skyscrapers.',
				vibe: 'Energetic, artistic, 24/7 city life.',
				gastronomy: 'Bagels, street food, diverse cuisines.',
				renowned: 'Statue of Liberty, Broadway and Central Park.',
				activities: [
					{
						image:
							'https://images.unsplash.com/photo-1568650436496-a2a288c7be3f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Broadway Show',
					},
					{
						image:
							'https://images.unsplash.com/photo-1544267462-069800cd7cd1?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Central Park Boat Ride',
					},
					{
						image:
							'https://images.unsplash.com/photo-1665399319491-e3f198e8e60a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Metropolitan Museum',
					},
				],
				attractions: [
					{
						image:
							'https://images.unsplash.com/photo-1565475783696-96001eff1b45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Statue of Liberty',
					},
					{
						image:
							'https://images.unsplash.com/photo-1548182880-8b7b2af2caa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Times Square',
					},
					{
						image:
							'https://images.unsplash.com/photo-1452796651103-7c07fca7a2c1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
						label: 'Brooklyn Bridge',
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
			<h2>Create your Matchmaker room </h2>
			<button onClick={handleCreateRoom}>Create Room</button>

			{roomId && (
				<div className='qr-wrapper'>
					<h2>Share this QR or link with your friends:</h2>
					<QRCode value={roomLink} size={256} />

					<h3>
						<a href={roomLink} target='_blank' rel='noreferrer'>
							{roomLink}
						</a>
					</h3>
					<h3> and then, click on the link to start </h3>
				</div>
			)}
		</div>
	);
}

export default MatchmakerRoom;

// const destinations = [
// 	{
// 		name: 'Barcelona',
// 		image:
// 			'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg',
// 		aesthetic: 'Stunning architecture.',
// 		vibe: 'Beachside relaxation and nightlife.',
// 		gastronomy: 'Tapas, paella, and fresh seafood.',
// 		renowned: 'Football, art, history, and Mediterranean sunsets.',
// 		activities: [
// 			{
// 				image:
// 					'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/d7/0b/9c/salon-principal.jpg?w=900&h=500&s=1',
// 				label: '7 Portes',
// 			},
// 			{
// 				image:
// 					'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/e6/28/1a/opium-mar-club.jpg?w=1200&h=-1&s=1',
// 				label: 'Opium',
// 			},
// 			{
// 				image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFhHLNIJtwWE48GdslCOHhkmqikXHQrJLf2g&s',
// 				label: 'National Art Museum of Catalonia',
// 			},
// 		],
// 		attractions: [
// 			{
// 				image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRX1Aljp-xBwkgIDW5LKS336X9OMYzp5xAjA&s',
// 				label: 'La Sagrada Familia',
// 			},
// 			{
// 				image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz2SqFo8Z2vNKfmqSi4uxzWJkNa65DcGD5fQ&s',
// 				label: 'Park Güell',
// 			},
// 			{
// 				image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Casa_Mil%C3%A0%2C_general_view.jpg',
// 				label: 'Casa Milà',
// 			},
// 		],
// 	},
// 	{
// 		name: 'Paris',
// 		image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', // Torre Eiffel
// 		aesthetic: 'Romantic boulevards and world-class art.',
// 		vibe: 'Chic cafés, river strolls, elegant and historic.',
// 		gastronomy: 'Croissants, cheese, wine and haute cuisine.',
// 		renowned: 'Iconic landmarks like the Eiffel Tower and Louvre.',
// 		activities: [
// 			{ image: 'https://images.unsplash.com/photo-1567187155374-cd9135b1f247?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Seine River Cruise' },
// 			{ image: 'https://images.unsplash.com/photo-1587648415693-4a5362b2ce41?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Louvre Tour' },
// 			{ image: 'https://plus.unsplash.com/premium_photo-1718285549233-42414e1c16f9?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Montmartre Walk' },
// 		],
// 		attractions: [
// 			{ image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', label: 'Eiffel Tower' },
// 			{ image: 'https://images.unsplash.com/photo-1581211653431-310ba15ff9bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Notre-Dame Cathedral' },
// 			{ image: 'https://images.unsplash.com/photo-1621610212025-da775e84bea9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Sacré‑Cœur' },
// 		],
// 	},
// 	{
// 		name: 'Sydney',
// 		image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Opera House
// 		aesthetic: 'Modern architecture meeting ocean vistas.',
// 		vibe: 'Vibrant, open-air lifestyle by the harbour.',
// 		gastronomy: 'Fresh seafood, multicultural cafés, Aussie BBQ.',
// 		renowned: 'Sydney Opera House and Harbour Bridge views.',
// 		activities: [
// 			{ image: 'hhttps://images.unsplash.com/photo-1732354235412-637ab1fccdfc?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Sydney Harbour Cruise' },
// 			{ image: 'https://images.unsplash.com/photo-1719412371473-653b89a26fb9?q=80&w=1329&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Bridge Climb' },
// 			{ image: 'https://images.unsplash.com/photo-1726311189805-e986e481e916?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Bondi Beach Surfing' },
// 		],
// 		attractions: [
// 			{ image: 'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?q=80&w=1132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Sydney Opera House' },
// 			{
// 				image: 'https://images.unsplash.com/photo-1734237690805-13b339a085dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
// 				label: 'Harbour Bridge Pylon Lookout',
// 			},
// 			{ image: 'https://plus.unsplash.com/premium_photo-1678655852256-5fc5670b83eb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Royal Botanic Garden' },
// 		],
// 	},
// 	{
// 		name: 'Rome',
// 		image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Colosseum
// 		aesthetic: 'Ancient ruins with Renaissance elegance.',
// 		vibe: 'Bustling piazzas, gelato, timeless art.',
// 		gastronomy: 'Pasta, pizza al taglio, espresso and gelato.',
// 		renowned: 'The Colosseum, Vatican City and Baroque fountains.',
// 		activities: [
// 			{ image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Colosseum Tour' },
// 			{ image: 'https://images.unsplash.com/photo-1586884542514-f6bef0283446?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Vatican Museums' },
// 			{ image: 'https://images.unsplash.com/photo-1711287178549-dc9def408d94?q=80&w=1269&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Treví Fountain Visit' },
// 		],
// 		attractions: [
// 			{ image: 'https://images.unsplash.com/photo-1684275507407-28032196faeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Pantheon' },
// 			{ image: 'https://images.unsplash.com/photo-1636804907035-8ae6360f1d4f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Spanish Steps' },
// 			{ image: 'https://images.unsplash.com/photo-1594328253710-3f7067cedbe8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'St. Peter’s Basilica' },
// 		],
// 	},
// 	{
// 		name: 'New York',
// 		image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Manhattan skyline
// 		aesthetic: 'Iconic skyline of skyscrapers.',
// 		vibe: 'Energetic, artistic, 24/7 city life.',
// 		gastronomy: 'Bagels, street food, diverse cuisines.',
// 		renowned: 'Statue of Liberty, Broadway and Central Park.',
// 		activities: [
// 			{ image: 'https://images.unsplash.com/photo-1568650436496-a2a288c7be3f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Broadway Show' },
// 			{ image: 'https://images.unsplash.com/photo-1544267462-069800cd7cd1?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Central Park Boat Ride' },
// 			{ image: 'https://images.unsplash.com/photo-1665399319491-e3f198e8e60a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Metropolitan Museum' },
// 		],
// 		attractions: [
// 			{ image: 'https://images.unsplash.com/photo-1565475783696-96001eff1b45?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Statue of Liberty' },
// 			{ image: 'https://images.unsplash.com/photo-1548182880-8b7b2af2caa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Times Square' },
// 			{ image: 'https://images.unsplash.com/photo-1452796651103-7c07fca7a2c1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', label: 'Brooklyn Bridge' },
// 		],
// 	},

// 	{
// 		name: 'Kyoto',
// 		image:
// 			'https://boutiquejapan.com/wp-content/uploads/2019/07/yasaka-pagoda-higashiyama-kyoto-japan-1140x761.jpg',
// 		aesthetic: 'Traditional temples and cherry blossoms.',
// 		vibe: 'Tranquil, historic, and spiritual.',
// 		gastronomy: 'Kaiseki, matcha, and ramen.',
// 		renowned: 'Geishas, bamboo forests, and Zen gardens.',
// 		activities: [
// 			{
// 				image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2RigRZJ4XGSGf_dAyzvYTabTvDWljhNNZlg&s',
// 				label: 'Kaiseki Dinner',
// 			},
// 			{
// 				image: 'https://d2j57bp7wdztc7.cloudfront.net/pages/images/tea-ceremony/tea-ceremony-gion-01.jpg',
// 				label: 'Tea Ceremony',
// 			},
// 			{
// 				image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/13/bc/d4/bc.jpg',
// 				label: 'Geisha Show',
// 			},
// 		],
// 		attractions: [
// 			{
// 				image:
// 					'//https:es.cloudinary.com/jnto/image/upload/w_750,h_503,fl_lossy,f_auto/v1648523563/kyoto/20201026_fushimi_inari_taisha_shrine_01',
// 				label: 'Fushimi Inari Shrine',
// 			},
// 			{
// 				image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGS3pzLfCXr0di0Mrgd_R56tYy4DrwNF-Blw&s',
// 				label: 'Arashiyama Bamboo Grove',
// 			},
// 			{
// 				image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9j4jI_NuLic6fnjcEPZZ-kMzORfL9m9v7A&s',
// 				label: 'Kinkaku-ji (Golden Pavilion)',
// 			},
// 		],
// 	},
// ];
