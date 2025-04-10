import Navbar from '../../components/Navbar/Navbar';
import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
import ParticipantCard from '../../components/ParticipantCard/ParticipantCard';
function MatchmakerQuestions() {
	return (
		<>
			<Navbar></Navbar>
			<h1>MatchmakerQuestions</h1>
			<StepsProgressBar currentStep={1} />
			 <ParticipantCard
      name="Sara V."
      avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
    />
		</>
	);
}

export default MatchmakerQuestions;
