import { useEffect, useState } from 'react';

const GoogleMapsProvider = ({ children }) => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const initGoogleMaps = () => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${
				import.meta.env.VITE_GOOGLE_MAPS_API_KEY
			}&libraries=places&loading=async`;
			script.async = true;
			script.defer = true;
			script.id = 'google-maps-script';
			script.onload = () => {
				loadComponentLibrary();
			};
			document.head.appendChild(script);
		};

		const loadComponentLibrary = () => {
			const wc = document.createElement('script');
			wc.src = 'https://unpkg.com/@googlemaps/extended-component-library@0.17.0/dist/index.min.js';
			wc.async = true;
			wc.defer = true;
			wc.id = 'gmpx-component-lib';
			wc.onload = () => setLoaded(true);
			document.head.appendChild(wc);
		};

		if (!window.google && !document.querySelector('#google-maps-script')) {
			initGoogleMaps();
		} else {
			setLoaded(true);
		}
	}, []);

	if (!loaded) return null;

	return children;
};

export default GoogleMapsProvider;
