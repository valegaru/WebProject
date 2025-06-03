import React from 'react';
import './StepsProgressBar.css';

const StepsProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Create a room' },
    { number: 2, label: 'Destination test' },
    { number: 3, label: 'Start Matchmaker' }
  ];

  return (
    <div className="steps-container">
      {steps.map(({ number, label }, idx) => (
        <React.Fragment key={number}>
          <div
            className={`step ${
              currentStep === number
                ? 'active-step'
                : currentStep > number
                ? 'completed-step'
                : 'inactive-step'
            }`}
          >
            <span className="step-number">{number}.</span>
            <span className="step-label">{label}</span>
          </div>
          {idx < steps.length - 1 && <div className="step-divider" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepsProgressBar;
