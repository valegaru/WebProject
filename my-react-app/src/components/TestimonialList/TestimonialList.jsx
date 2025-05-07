import React from 'react';
import TestimonialCard from '../TestimonialCard/TestimonialCard';
import './TestimonialList.css';

const testimonialsData = [
	{
		name: 'Sara V.',
		message: 'Finally, no more messy group chats! Planning my trips has never been easier.',
		image: 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
	},
	{
		name: 'Carlos R.',
		message: 'I love how everything is in one place. Super intuitive!',
		image:
			'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg',
	},

	{
		name: 'Emily L.',
		message: 'My friends and I finally agreed on a destination thanks to this tool!',
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&s',
	},

	{
		name: 'Emily L.',
		message: 'My friends and I finally agreed on a destination thanks to this tool!',
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&s',
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
