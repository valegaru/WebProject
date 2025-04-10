import Navbar from '../../components/Navbar/Navbar';
import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
import QuestionList from '../../components/QuestionList/QuestionList';

function MatchmakerQuestions() {
	return (
		<>
			<Navbar></Navbar>
			<div style={{ marginTop: '1000px' }}>
	<StepsProgressBar currentStep={2} />
	<QuestionList />
</div>
		</>
	);
}

export default MatchmakerQuestions;
