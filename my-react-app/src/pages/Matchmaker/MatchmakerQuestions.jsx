import Navbar from '../../components/Navbar/Navbar';
import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';

function MatchmakerQuestions() {
	return (
		<>
			<Navbar></Navbar>
			<StepsProgressBar currentStep={2} />
		</>
	);
}

export default MatchmakerQuestions;
