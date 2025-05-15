import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import Navbar from '../../components/Navbar/Navbar';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import './Profile.css';

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
							unsubscribe();
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
		formData.append('upload_preset', 'ml_default');

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
					await updateDoc(userRef, { photoUrl: data.secure_url });
					setUserData((prev) => ({ ...prev, photoUrl: data.secure_url }));
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
			setTimeout(() => setUploadStatus(''), 4000);
		}
	};

	const defaultImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

	return (
		<>
			<Navbar />
			<div className='profile-page'>
				<div className='profile-card'>
					<h2 className='profile-title'>Tu Perfil</h2>

					{loading ? (
						<p>Cargando perfil...</p>
					) : error ? (
						<p className='profile-error'>{error}</p>
					) : (
						<>
							<div className='profile-avatar'>
								<img src={userData.photoUrl || defaultImage} alt='Foto de perfil' />
							</div>

							<input
								type='file'
								accept='image/*'
								onChange={handleImageUpload}
								disabled={uploading}
								className='profile-input-file'
							/>

							{uploading && <p className='profile-status'>Subiendo imagen...</p>}
							{uploadStatus && <p className='profile-status'>{uploadStatus}</p>}

							<p className='profile-info'>
								<strong>Usuario:</strong> {userData.username}
							</p>
							<p className='profile-info'>
								<strong>Email:</strong> {userData.email}
							</p>

							<div style={{ marginTop: '1.5rem' }}>
								<LogoutButton />
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default Profile;
