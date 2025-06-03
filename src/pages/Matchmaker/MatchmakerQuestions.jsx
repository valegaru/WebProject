import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import StepsProgressBar from '../../components/StepsProgressBar/StepsProgressBar';
import QuestionList from '../../components/QuestionList/QuestionList';
import './MatchmakerQuestions.css';

function MatchmakerQuestions() {
	const navigate = useNavigate();

	const handleNavigation = () => {
		navigate('/matchselection');
	};

	return (
		<>
			<Navbar />
			<div className='matchmaker-wrapper'>
				<StepsProgressBar currentStep={2} />
				<QuestionList />
				<div className='navigation-button-container'>
					<button className='banner-button' onClick={handleNavigation}>
						Swipe <strong>Now</strong>
					</button>
				</div>
			</div>
		</>
	);
}

export default MatchmakerQuestions;
