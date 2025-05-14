import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import Navbar from '../../components/Navbar/Navbar';
import LogoutButton from '../../components/LogoutButton/LogoutButton';

function Profile() {
	const [userData, setUserData] = useState({ username: '', email: '', photoUrl: '' });

	useEffect(() => {
		const fetchUserData = async () => {
			const user = auth.currentUser;
			if (user) {
				const userRef = doc(db, 'users', user.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					const data = userSnap.data();
					setUserData({
						username: data.username,
						email: data.email,
						photoUrl: data.photoUrl || '',
					});
				}
			}
		};

		fetchUserData();
	}, []);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'ml_default'); // Reemplaza si usas otro preset

		try {
			const res = await fetch('https://api.cloudinary.com/v1_1/dbx6eatsd/image/upload', {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();

			if (data.secure_url) {
				const user = auth.currentUser;
				if (user) {
					const userRef = doc(db, 'users', user.uid);
					await updateDoc(userRef, {
						photoUrl: data.secure_url,
					});
					setUserData((prev) => ({
						...prev,
						photoUrl: data.secure_url,
					}));
				}
			} else {
				console.error('Error al subir la imagen:', data);
			}
		} catch (error) {
			console.error('Error al subir a Cloudinary:', error);
		}
	};

	const defaultImage =
		'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fes%2Fvectors%2Ffoto-de-perfil-en-blanco-973460%2F&psig=AOvVaw2HgXZU1pr56pHFTUppXANh&ust=1747348180816000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIC6oLCBpI0DFQAAAAAdAAAAABAE';

	return (
		<>
			<Navbar />
			<div style={{ textAlign: 'center', marginTop: '2rem' }}>
				<h2>Perfil de usuario</h2>

				<div
					style={{
						width: '200px',
						height: '200px',
						borderRadius: '50%',
						overflow: 'hidden',
						margin: '1rem auto',
						border: '2px solid #ccc',
					}}
				>
					<img
						src={userData.photoUrl || defaultImage}
						alt='Foto de perfil'
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				</div>

				<input type='file' accept='image/*' onChange={handleImageUpload} />

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
