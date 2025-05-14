import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import Navbar from '../../components/Navbar/Navbar';
import LogoutButton from '../../components/LogoutButton/LogoutButton';

function Profile() {
	const [userData, setUserData] = useState({ username: '', email: '' });

	useEffect(() => {
		const fetchUserData = async () => {
			const user = auth.currentUser;
			if (user) {
				const userRef = doc(db, 'users', user.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					const data = userSnap.data();
					setUserData({ username: data.username, email: data.email });
				}
			}
		};

		fetchUserData();
	}, []);

	return (
		<>
			<Navbar />
			<div style={{ textAlign: 'center', marginTop: '2rem' }}>
				<h2>Perfil de usuario</h2>
				<p>
					<strong>Nombre de usuario:</strong> {userData.username}
				</p>
				<p>
					<strong>Email:</strong> {userData.email}
				</p>
				<LogoutButton />
			</div>
		</>
	);
}

export default Profile;
