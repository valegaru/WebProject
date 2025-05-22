import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import './PrivateRoute.css';

const PrivateRoute = ({ children }) => {
	const userId = useSelector((state) => state.auth.userId);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (!userId) {
			setShowModal(true);
		}
	}, [userId]);

	if (userId) {
		return children;
	}

	return (
		<>
			{showModal && (
				<div className='modal-overlay'>
					<div className='modal-content'>
						<h2>Acceso restringido</h2>
						<p>Para acceder a esta página necesitas iniciar sesión o registrarte.</p>
						<button className='login-btn' onClick={() => (window.location.href = '/login')}>
							Iniciar sesión
						</button>
						<p style={{ marginTop: '1rem' }}>
							¿No tienes cuenta? <a href='/register'>Regístrate aquí</a>
						</p>
					</div>
				</div>
			)}
		</>
	);
};

export default PrivateRoute;
