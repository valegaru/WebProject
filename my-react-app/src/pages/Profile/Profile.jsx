import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
function Profile() {
	return (
		<>
			<Navbar></Navbar>
			<p>Profile</p>
      <LogoutButton></LogoutButton>
		</>
	);
}

export default Profile;
