import React from 'react';
import TestimonialsList from '../TestimonialList/TestimonialList';
import './TestimonialSection.css';

const TestimonialSection = () => {
	return (
		<section className='testimonial-section'>
			<h2 className='testimonial-title'>What Our Users Say:</h2>
			<TestimonialsList />
		</section>
	);
};

export default TestimonialSection;
