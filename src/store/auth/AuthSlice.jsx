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
			const { uid, email, username } = action.payload;

			state.userId = uid;
			state.email = email;
			state.username = username || null;

			localStorage.setItem('userId', uid);
			localStorage.setItem('email', email);
			if (username) {
				localStorage.setItem('username', username);
			}

			console.log('[authSlice] Usuario autenticado:', { uid, email });
		},
		clearUserId: (state) => {
			state.userId = null;
			state.email = null;
			state.username = null;

			localStorage.removeItem('userId');
			localStorage.removeItem('email');
			localStorage.removeItem('username');

			console.log('[authSlice] Sesión cerrada');
		},
	},
});

export const { setUserId, clearUserId } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
// 	userId: localStorage.getItem('userId') || null,
// 	email: localStorage.getItem('email') || null,
// 	username: localStorage.getItem('username') || null,
// };

// const authSlice = createSlice({
// 	name: 'auth',
// 	initialState,
// 	reducers: {
// 		setUserId: (state, action) => {
// 			state.userId = action.payload.uid;
// 			state.email = action.payload.email;
// 			state.username = action.payload.username;
// 			localStorage.setItem('username', action.payload.username);
// 			localStorage.setItem('userId', action.payload.uid);
// 			localStorage.setItem('email', action.payload.email);
// 		},
// 		clearUserId: (state) => {
// 			state.userId = null;
// 			state.email = null;
// 			state.username = null;
// 			localStorage.removeItem('username');
// 			localStorage.removeItem('userId');
// 			localStorage.removeItem('email');
// 		},
// 	},
// });

// export const { setUserId, clearUserId } = authSlice.actions;
// export default authSlice.reducer;
