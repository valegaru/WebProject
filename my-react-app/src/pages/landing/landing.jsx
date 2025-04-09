import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import TestimonialsList from '../../components/TestimonialList/TestimonialList';
const Landing = () => {
	return (
		<>
			<Navbar></Navbar>
			<Banner></Banner>
			<TestimonialsList></TestimonialsList>
			<p>LandingPage</p>
		</>
	);
};

export default Landing;
