import Navbar from '../../components/Navbar/Navbar';
import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
import QuestionList from '../../components/QuestionList/QuestionList';

function MatchmakerQuestions() {
	return (
		<>
			<Navbar></Navbar>
			<StepsProgressBar currentStep={2} />
			<QuestionList></QuestionList>
		</>
	);
}

export default MatchmakerQuestions;
