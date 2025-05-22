import React, { useState } from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, options, id, onSelect }) => {
	const [selectedOption, setSelectedOption] = useState(null);

	const handleSelect = (option) => {
		setSelectedOption(option);
		onSelect(id, option);
	};

	return (
		<div className='question-card'>
			<p className='question-text'>{question}</p>
			<div className='options-container'>
				{options.map((option, index) => (
					<button
						key={index}
						className={`option-button ${selectedOption === option ? 'selected' : ''}`}
						onClick={() => handleSelect(option)}
					>
						{option}
					</button>
				))}
			</div>
		</div>
	);
};

export default QuestionCard;
