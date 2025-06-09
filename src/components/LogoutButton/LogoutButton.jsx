import { useDispatch } from 'react-redux';
import { clearUserId } from '../../store/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';
import { logoutFirebaseUser } from '../../services/firebase';

export default function LogoutButton() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logoutFirebaseUser(); 
			dispatch(clearUserId());   
			navigate('/');             
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<button id='logoutbutton' onClick={handleLogout}>
			Cerrar sesión
		</button>
	);
}
