import { useState } from 'react';

import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Trip from './pages/tripPlanner/TripPlanner';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
        <Route path='/trip' element={<Trip />} />
			</Routes>
		</Router>
	);
};

export default App;
