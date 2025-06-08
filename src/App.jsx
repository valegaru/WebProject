import './App.css';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store.js';

import Router from './routes/Router.jsx';
import GoogleMapsProvider from './components/GoogleMapsProvider';

const App = () => {
	return (
		<>
			<GoogleMapsProvider />
			<Provider store={store}>
				<Router></Router>
			</Provider>
		</>
	);
};

export default App;
