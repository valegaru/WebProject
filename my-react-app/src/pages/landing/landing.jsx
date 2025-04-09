import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import TestimonialsList from '../../components/TestimonialList/TestimonialList';
import CallToActionFooter from '../../components/CallToActionFooter/CallToActionFooter';
const Landing = () => {
	return (
		<>
			<Navbar></Navbar>
			<Banner></Banner>
			<TestimonialsList></TestimonialsList>
			<CallToActionFooter></CallToActionFooter>
			<p>LandingPage</p>
		</>
	);
};

export default Landing;
