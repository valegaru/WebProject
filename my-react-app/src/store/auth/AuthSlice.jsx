import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	userId: localStorage.getItem('userId') || null,
	email: localStorage.getItem('email') || null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserId: (state, action) => {
			state.userId = action.payload.uid;
			state.email = action.payload.email;
			localStorage.setItem('userId', action.payload.uid);
			localStorage.setItem('email', action.payload.email);
		},
		clearUserId: (state) => {
			state.userId = null;
			state.email = null;
			localStorage.removeItem('userId');
			localStorage.removeItem('email');
		},
	},
});

export const { setUserId, clearUserId } = authSlice.actions;
export default authSlice.reducer;
