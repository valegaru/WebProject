import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import Navbar from '../../components/Navbar/Navbar';
import LogoutButton from '../../components/LogoutButton/LogoutButton';

function Profile() {
	const [userData, setUserData] = useState({ username: '', email: '', photoUrl: '' });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				setError('');
				const checkAuth = () =>
					new Promise((resolve) => {
						const unsubscribe = auth.onAuthStateChanged((user) => {
							unsubscribe(); // Detener el listener después de obtener el usuario
							resolve(user);
						});
					});

				const user = await checkAuth();
				if (user) {
					const userRef = doc(db, 'users', user.uid);
					const userSnap = await getDoc(userRef);
					if (userSnap.exists()) {
						const data = userSnap.data();
						setUserData({
							username: data.username || '',
							email: data.email || '',
							photoUrl: data.photoUrl || '',
						});
					} else {
						setError('No se encontró el perfil del usuario.');
					}
				} else {
					setError('Usuario no autenticado.');
				}
			} catch (err) {
				setError('Error al cargar los datos del usuario.');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setUploading(true);
		setUploadStatus('Subiendo imagen...');

		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'ml_default'); // Asegúrate que sea unsigned

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
					setUploadStatus('Imagen subida correctamente.');
				} else {
					setUploadStatus('Error: Usuario no autenticado.');
				}
			} else {
				setUploadStatus('Error al subir la imagen.');
			}
		} catch (err) {
			console.error('Error en Cloudinary:', err);
			setUploadStatus('Error al subir la imagen.');
		} finally {
			setUploading(false);
			setTimeout(() => setUploadStatus(''), 4000); // Borra mensaje después de 4s
		}
	};

	const defaultImage = 'https://res.cloudinary.com/dbx6eatsd/image/upload/v1716075265/default-avatar.png';

	return (
		<>
			<Navbar />
			<div style={{ textAlign: 'center', marginTop: '2rem' }}>
				<h2>Perfil de usuario</h2>

				{loading ? (
					<p>Cargando perfil...</p>
				) : error ? (
					<p style={{ color: 'red' }}>{error}</p>
				) : (
					<>
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

						<input type='file' accept='image/*' onChange={handleImageUpload} disabled={uploading} />
						{uploading && <p>Subiendo imagen...</p>}
						{uploadStatus && <p>{uploadStatus}</p>}

						<p>
							<strong>Nombre de usuario:</strong> {userData.username}
						</p>
						<p>
							<strong>Email:</strong> {userData.email}
						</p>

						<LogoutButton />
					</>
				)}
			</div>
		</>
	);
}

export default Profile;
