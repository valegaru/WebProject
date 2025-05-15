import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import bannerimage from '../../assets/bannerimage.png';

function Trips() {
	return (
		<>
			<Navbar></Navbar>
			<Banner
				title='Browse through your trips'
				subtitle='Click on a trip to view the details'
				description='Are you ready to embark on your next adventure? Browse through your trips and get ready to create unforgettable memories with your friends and family.'
				buttonText='Start planning your next trip'
				backgroundImage={bannerimage}
				buttonRoute='/tripcreation'
			/>
		</>
	);
}

export default Trips;
