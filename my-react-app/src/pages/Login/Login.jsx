import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setUserId } from '../../store/auth/AuthSlice';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css'; // 👈 Importa los estilos

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const handleLogin = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			dispatch(setUserId(user.uid));
			navigate('/home');
		} catch (error) {
			setError('Credenciales inválidas');
			console.error(error.code, error.message);
		}
	};

	return (
		<div id='login-container'>
			<input
				className='login-input'
				type='text'
				onChange={(e) => setEmail(e.target.value)}
				placeholder='Correo electrónico'
				value={email}
			/>
			<input
				className='login-input'
				type='password'
				onChange={(e) => setPassword(e.target.value)}
				placeholder='Contraseña'
				value={password}
			/>
			<button id='login-button' onClick={handleLogin}>Iniciar sesión</button>
			{error && <p id='login-error'>{error}</p>}
		</div>
	);
};

export default Login;
