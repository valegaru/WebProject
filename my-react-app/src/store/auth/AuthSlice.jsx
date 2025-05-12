import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	userId: localStorage.getItem('userId') || null, // ← Para mantener la sesión al recargar
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserId: (state, action) => {
			state.userId = action.payload;
			localStorage.setItem('userId', action.payload); // ← Guardar en localStorage
		},
		clearUserId: (state) => {
			state.userId = null;
			localStorage.removeItem('userId'); // ← Eliminar del localStorage
		},
	},
});

export const { setUserId, clearUserId } = authSlice.actions;
export default authSlice.reducer;
