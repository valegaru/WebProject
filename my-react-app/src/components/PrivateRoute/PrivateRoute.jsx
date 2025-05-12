import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
	const userId = useSelector((state) => state.auth.userId);
	const [showModal, setShowModal] = useState(false);
	//const location = useLocation();

	useEffect(() => {
		if (!userId) {
			setShowModal(true);
		}
	}, [userId]);

	if (userId) {
		return children; // Usuario autorizado
	}

	return (
		<>
			{showModal && (
				<div style={modalOverlay}>
					<div style={modalContent}>
						<h2>Acceso restringido</h2>
						<p>Para acceder a esta página necesitas iniciar sesión o registrarte.</p>
						<button style={loginBtn} onClick={() => (window.location.href = '/login')}>
							Iniciar sesión
						</button>
						<p style={{ marginTop: '1rem' }}>
							¿No tienes cuenta?{' '}
							<a href='/register' style={{ color: '#007bff' }}>
								Regístrate aquí
							</a>
						</p>
					</div>
				</div>
			)}
		</>
	);
};

export default PrivateRoute;


const modalOverlay = {
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100vw',
	height: '100vh',
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 9999,
};

const modalContent = {
	backgroundColor: '#fff',
	padding: '2rem',
	borderRadius: '10px',
	width: '90%',
	maxWidth: '400px',
	textAlign: 'center',
	boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
};

const loginBtn = {
	marginTop: '1rem',
	padding: '0.5rem 1rem',
	backgroundColor: '#007bff',
	color: '#fff',
	border: 'none',
	borderRadius: '5px',
	cursor: 'pointer',
};
