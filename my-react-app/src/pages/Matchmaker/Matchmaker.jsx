import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import bannerimage from '../../assets/bannerimage.png';
function Matchmaker() {
	return (
		<>
			<Navbar></Navbar>
			<Banner
				title='Destination matchmaker'
				subtitle=''
				description='Where Should We Go? Deciding where to travel has never been easier! PlanIt helps you and your friends choose a destination through a fun and interactive voting system.'
				buttonText='Find Your Perfect Destination!'
				backgroundImage={bannerimage}
				buttonRoute='/questions'
			/>
		</>
	);
}

export default Matchmaker;
