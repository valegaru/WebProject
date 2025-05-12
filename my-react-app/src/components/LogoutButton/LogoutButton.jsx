import { useDispatch } from 'react-redux';
import { clearUserId } from '../../store/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

export default function LogoutButton() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(clearUserId()); // Limpiar Redux y localStorage
		navigate('/'); // Redirigir al landing
	};

	return (
		<button id='logoutbutton' onClick={handleLogout}>
			Cerrar sesión
		</button>
	);
}
