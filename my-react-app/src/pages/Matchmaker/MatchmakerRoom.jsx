import Navbar from '../../components/Navbar/Navbar';
import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
import ParticipantCard from '../../components/ParticipantCard/ParticipantCard';
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
			<Navbar></Navbar>
			<StepsProgressBar currentStep={1} />
			<ParticipantList participants={participants} />
			<RoomInfoPanel
				code='135783'
				qrImage='https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'
				buttonRoute='/questions'
			/>
		</>
	);
}

export default MatchmakerRoom;
