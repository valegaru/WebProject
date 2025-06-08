import './App.css';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store.js';

import Router from './routes/Router.jsx';
const App = () => {
	return (
		<Provider store={store}>
			<Router></Router>
		</Provider>
	);
};

export default App;
