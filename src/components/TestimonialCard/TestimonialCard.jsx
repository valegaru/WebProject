import React from 'react';
import './Testimonial.css';

const TestimonialCard = ({ name, message, image }) => {
	return (
		<div className="testimonial-card">
			<img src={image} alt={name} className="testimonial-avatar" />
			<div className="testimonial-content">
				<h4>{name}</h4>
				<p>“{message}”</p>
			</div>
		</div>
	);
};

export default TestimonialCard;
