import { useDispatch } from "react-redux";
import { clearUserId } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUserId()); // Limpiar Redux y localStorage
    navigate("/landing"); // Redirigir al landing
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
}
