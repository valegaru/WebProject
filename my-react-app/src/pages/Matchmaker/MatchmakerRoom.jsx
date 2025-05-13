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
	return (
		<>
			<Navbar />
			<div className='matchmaker-room-container'>
				<StepsProgressBar className='progress-bar' currentStep={1} sx={{ order: 1 }}/>
				<div className='main-content'>
					<ParticipantList className='participants' participants={participants} sx={{ order: 3 }} />
					<RoomInfoPanel
						className='qr'
						code='135783'
						qrImage='https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'
						buttonRoute='/questions'
						sx={{ order: 2 }}
					/>
				</div>
			</div>
		</>
	);
}

export default MatchmakerRoom;
