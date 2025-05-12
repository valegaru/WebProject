import { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './Register.css';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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

			alert('🎉 Registro exitoso');
			setEmail('');
			setPassword('');
			setUsername('');
		} catch (error) {
			console.error(error.code, error.message);
			setError('❌ ' + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="register-page">
			<form className="register-form" onSubmit={(e) => e.preventDefault()}>
				<h2>Crear una cuenta</h2>
				<input
					type="text"
					placeholder="Nombre de usuario"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					type="email"
					placeholder="Correo electrónico"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Contraseña"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				{error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
				<button onClick={handleRegister} disabled={loading}>
					{loading ? 'Registrando...' : 'Registrarse'}
				</button>
			</form>
		</div>
	);
};

export default Register;
