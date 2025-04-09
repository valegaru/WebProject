import React from 'react';
import TestimonialCard from '../TestimonialCard/TestimonialCard';
import './TestimonialList.css';

const testimonialsData = [
	{
		name: 'Sara V.',
		message: 'Finally, no more messy group chats! Planning my trips has never been easier.',
		image: '/assets/sara.jpg',
	},
	{
		name: 'Carlos R.',
		message: 'I love how everything is in one place. Super intuitive!',
		image: '/assets/carlos.jpg',
	},

	{
		name: 'Emily L.',
		message: 'My friends and I finally agreed on a destination thanks to this tool!',
		image: '/assets/emily.jpg',
	},

	{
		name: 'Emily L.',
		message: 'My friends and I finally agreed on a destination thanks to this tool!',
		image: '/assets/emily.jpg',
	},
];

const TestimonialsList = () => {
	return (
		<div className='testimonials-list'>
			{testimonialsData.map((testimonial, index) => (
				<TestimonialCard key={index} {...testimonial} />
			))}
		</div>
	);
};

export default TestimonialsList;
