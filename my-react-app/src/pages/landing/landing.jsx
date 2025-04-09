import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import TestimonialsList from '../../components/TestimonialList/TestimonialList';
import CallToActionFooter from '../../components/CallToActionFooter/CallToActionFooter';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import starburst from '../../assets/starburst.svg';
import airplaneBadge from '../../assets/airplane-badge.svg';
import planewindow from '../../assets/planewindow.png';
import ItineraryHighlight from '../../components/ItineraryHighlight/ItineraryHighlight';
import TestimonialSection from '../../components/TestimonialSection/TestimonialSection';

const Landing = () => {
	return (
		<>
			<Navbar></Navbar>
			<Banner></Banner>
			<TestimonialsList></TestimonialsList>
			<CallToActionFooter></CallToActionFooter>
			<FeatureCard
				title='Create Your Trip'
				subtitle='Start by setting up your trip'
				description='Give it a name, select dates, and invite your travel buddies. Whether it’s a weekend getaway or a long adventure, everything starts here!'
				image={planewindow}
				decorationRight={<img src={airplaneBadge} alt='Plane badge' style={{ width: 100 }} />}
			/>

			<FeatureCard
				title='Collaborative Itineraries'
				subtitle='Plan every detail of your trip, day by day, with your group.'
				description='Effortlessly create shared travel schedules where everyone can add places, activities, and restaurants. Say goodbye to endless group chats and last-minute confusion!'
				image='/assets/itinerary-map.jpg'
				reverse
				decorationLeft={<img src={starburst} alt='Plus icon' style={{ width: 80 }} />}
			/>
			<ItineraryHighlight
				title='TRAIN SAINT DENNIS → ROCHARD'
				price='100,000'
				missing='20,000'
				peopleCount={5}
				isPrimary={true}
			/>

			<ItineraryHighlight title='LOUVRE' price='250,000' peopleCount={5} boostPercentage={150} isPrimary={false} />
			<TestimonialSection></TestimonialSection>
			<p>LandingPage</p>
		</>
	);
};

export default Landing;
