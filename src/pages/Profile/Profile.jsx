import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import './Profile.css';

import { fetchUserData, updateUserProfilePicture } from '../../utils/firebaseUtils';
import { useSelector } from 'react-redux';

<<<<<<< HEAD

function Profile() {
  const user = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({ username: '', email: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
  const fetchData = async () => {
    if (user?.userId) {
      const data = await fetchUserData(user.userId);
      if (data) {
        setUserData({
          username: data.username || '',
          email: data.email || '',
          profilePicture: data.profilePicture || '',
        });
      } else {
        setError('No se pudo cargar el perfil.');
      }
    } else {
      setError('No hay datos de usuario.');
    }
    setLoading(false);
  };

  fetchData();
}, [user]);

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
        const success = await updateUserProfilePicture(user.userId, data.secure_url);
        if (success) {
  			const updatedData = await fetchUserData(user.userId);
			
			if (updatedData) {
				setUserData({
					username: updatedData.username || '',
					email: updatedData.email || '',
					profilePicture: updatedData.profilePicture || '',
				});
			}
			setUploadStatus('Imagen subida correctamente.');
		}else {
          setUploadStatus('Error al actualizar la imagen en Firestore.');
        }
		
	} else {
        setUploadStatus('Error al subir la imagen.');}
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
      <div className="profile-page">
        <div className="profile-card">
          <h2 className="profile-title">Tu Perfil</h2>

          {loading ? (
            <p>Cargando perfil...</p>
          ) : error ? (
            <p className="profile-error">{error}</p>
          ) : (
            <>
              <div className="profile-avatar">
                <img src={userData.profilePicture || defaultImage} alt="Foto de perfil" />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="profile-input-file"
              />

              {uploading && <p className="profile-status">Subiendo imagen...</p>}
              {uploadStatus && <p className="profile-status">{uploadStatus}</p>}

              <p className="profile-info"><strong>Usuario:</strong> {userData.username}</p>
              <p className="profile-info"><strong>Email:</strong> {userData.email}</p>

              <div style={{ marginTop: '1.5rem' }}>
                <LogoutButton />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
=======
function Profile() {
	const user = useSelector((state) => state.auth);

	const [userData, setUserData] = useState({ username: '', email: '', profilePicture: '' });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			if (user?.userId) {
				const data = await fetchUserData(user.userId);
				if (data) {
					setUserData({
						username: data.username || '',
						email: data.email || '',
						profilePicture: data.profilePicture || '',
					});
				} else {
					setError('No se pudo cargar el perfil.');
				}
			} else {
				setError('No hay datos de usuario.');
			}
			setLoading(false);
		};

		fetchData();
	}, [user]);

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
				const success = await updateUserProfilePicture(user.userId, data.secure_url);
				if (success) {
					const updatedData = await fetchUserData(user.userId);

					if (updatedData) {
						setUserData({
							username: updatedData.username || '',
							email: updatedData.email || '',
							profilePicture: updatedData.profilePicture || '',
						});
					}
					setUploadStatus('Imagen subida correctamente.');
				} else {
					setUploadStatus('Error al actualizar la imagen en Firestore.');
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
								<img src={userData.profilePicture || defaultImage} alt='Foto de perfil' />
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
>>>>>>> main
}

export default Profile;
