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
import './landing.css';
import bannerimage from '../../assets/bannerimage.png';
import itinerarymap from '../../assets/itinerarymap.png';
import FeatureCardWithHighlights from '../../components/FeatureCard2/FeatureCardWithHigh';
import greenstar from '../../assets/greenstar.svg';
import star3 from '../../assets/star3.svg';

const Landing = () => {
	return (
		<>
			<Navbar></Navbar>
			<Banner
				title='Postal Trip'
				subtitle='Plan it together, live it better.'
				description='Tired of chaotic trip planning? With Postal Trip, you and your friends can seamlessly organize itineraries, split expenses, and decide on destinations together—all in one place.'
				buttonText='Start planning your trip'
				backgroundImage={bannerimage}
			/>
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
				image={itinerarymap}
				reverse
				decorationLeft={<img src={starburst} alt='Plus icon' style={{ width: 80 }} />}
			/>
			<FeatureCardWithHighlights
				title='Smart Expense Tracking'
				subtitle='Automatically split costs and keep budgets clear.'
				description='Keep track of all shared and individual expenses in real-time. The app calculates who owes what, ensuring fair and hassle-free cost sharing. No more awkward money conversations!'
				highlights={[
					<ItineraryHighlight
						title='TRAIN SAINT DENNIS → ROCHARD'
						price='100,000'
						missing='20,000'
						peopleCount={5}
						isPrimary={true}
					/>,
					<ItineraryHighlight title='LOUVRE' price='250,000' peopleCount={5} boostPercentage={150} isPrimary={false} />,
				]}
				reverse={true}
				decorationRights={<img src={greenstar} alt='Plus icon' style={{ width: 80 }} />}
			/>
			<FeatureCard
				title='Destination Matchmaker'
				subtitle='Vote and agree on the perfect travel spot.'
				description='Undecided on where to go? Take a fun quiz with your friends, set your preferences, and let the app find the best destination for your group!'
				image={itinerarymap}
				reverse
				decorationLeft={<img src={star3} alt='Plus icon' style={{ width: 80 }} />}
			/>
			<TestimonialSection></TestimonialSection>
			<CallToActionFooter></CallToActionFooter>
		</>
	);
};

export default Landing;
