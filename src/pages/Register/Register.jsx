import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../store/auth/AuthSlice';
import './Register.css';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleRegister = async () => {
		setLoading(true);
		setError('');
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const uid = userCredential.user.uid;

			await setDoc(doc(db, 'users', uid), {
				username,
				email,
			});

			dispatch(setUserId({ uid, email, username }));

			localStorage.setItem('userId', uid);
			localStorage.setItem('email', email);
			localStorage.setItem('username', username);

			alert('🎉 Registro exitoso');
			navigate('/home');
		} catch (error) {
			console.error(error.code, error.message);
			setError('❌ ' + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='register-page'>
			<div className='register-card'>
				<h2 className='register-title'>Crear una cuenta</h2>
				<input
					className='register-input'
					type='text'
					placeholder='Nombre de usuario'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					className='register-input'
					type='email'
					placeholder='Correo electrónico'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					className='register-input'
					type='password'
					placeholder='Contraseña'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				{error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
				<button className='register-button' onClick={handleRegister} disabled={loading}>
					{loading ? 'Registrando...' : 'Registrarse'}
				</button>

				{/* ✅ Agregado: Enlace para ir a Login */}
				<p className='login-footer'>
					¿Ya tienes cuenta?{' '}
					<Link to='/login' className='login-link'>
						Inicia sesión aquí
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../../services/firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import './Register.css';

// const Register = () => {
// 	const [email, setEmail] = useState('');
// 	const [password, setPassword] = useState('');
// 	const [username, setUsername] = useState('');
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState('');

// 	const navigate = useNavigate();

// 	const handleRegister = async () => {
// 		setLoading(true);
// 		setError('');
// 		try {
// 			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
// 			const uid = userCredential.user.uid;

// 			await setDoc(doc(db, 'users', uid), {
// 				username,
// 				email,
// 			});

// 			localStorage.setItem('userId', uid); // Guardar el UID para desbloquear rutas

// 			alert('🎉 Registro exitoso');
// 			setEmail('');
// 			setPassword('');
// 			setUsername('');

// 			// navigate('/home'); // redirigir al Home
// 		} catch (error) {
// 			console.error(error.code, error.message);
// 			setError('❌ ' + error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className='register-page'>
// 			<div className='register-card'>
// 				<h2 className='register-title'>Crear una cuenta</h2>
// 				<input
// 					className='register-input'
// 					type='text'
// 					placeholder='Nombre de usuario'
// 					value={username}
// 					onChange={(e) => setUsername(e.target.value)}
// 					required
// 				/>
// 				<input
// 					className='register-input'
// 					type='email'
// 					placeholder='Correo electrónico'
// 					value={email}
// 					onChange={(e) => setEmail(e.target.value)}
// 					required
// 				/>
// 				<input
// 					className='register-input'
// 					type='password'
// 					placeholder='Contraseña'
// 					value={password}
// 					onChange={(e) => setPassword(e.target.value)}
// 					required
// 				/>
// 				{error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
// 				<button className='register-button' onClick={handleRegister} disabled={loading}>
// 					{loading ? 'Registrando...' : 'Registrarse'}
// 				</button>
// 			</div>
// 		</div>
// 	);
// };

// export default Register;
