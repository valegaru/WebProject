import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setUserId } from '../../store/auth/AuthSlice';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

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
			navigate('/home');
		} catch (error) {
			setError('Correo o contraseña incorrectos');
			console.error(error);
		}
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<h2 className="login-title">¡Bienvenido de nuevo!</h2>
				<p className="login-subtitle">Inicia sesión para continuar</p>

				<input
					className="login-input"
					type="email"
					placeholder="Correo electrónico"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					className="login-input"
					type="password"
					placeholder="Contraseña"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{error && <p className="login-error">{error}</p>}
				<button className="login-button" onClick={handleLogin}>
					Iniciar sesión
				</button>

				<p className="login-footer">
					¿No tienes cuenta?{' '}
					<Link to="/register" className="login-link">
						Regístrate aquí
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
