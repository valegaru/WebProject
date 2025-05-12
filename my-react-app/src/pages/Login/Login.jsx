import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setUserId } from '../../store/auth/AuthSlice';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

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

			// Guardamos el ID del usuario en Redux y localStorage
			dispatch(setUserId(user.uid));
			navigate('/home'); // Redirigir al home si todo salió bien
		} catch (error) {
			setError('Credenciales inválidas');
			console.error(error.code, error.message);
		}
	};

	return (
		<div>
			<input type='text' onChange={(e) => setEmail(e.target.value)} placeholder='User email' value={email} />
			<input type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Password' value={password} />
			<button onClick={handleLogin}>Login</button>
			{error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra el error */}
		</div>
	);
};

export default Login;
