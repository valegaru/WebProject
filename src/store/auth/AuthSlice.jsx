import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	userId: localStorage.getItem('userId') || null,
	email: localStorage.getItem('email') || null,
	username: localStorage.getItem('username') || null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserId: (state, action) => {
			state.userId = action.payload.uid;
			state.email = action.payload.email;
			state.username = action.payload.username;
			localStorage.setItem('username', action.payload.username);
			localStorage.setItem('userId', action.payload.uid);
			localStorage.setItem('email', action.payload.email);
		},
		clearUserId: (state) => {
			state.userId = null;
			state.email = null;
			state.username = null;
			localStorage.removeItem('username');
			localStorage.removeItem('userId');
			localStorage.removeItem('email');
		},
	},
});

export const { setUserId, clearUserId } = authSlice.actions;
export default authSlice.reducer;
