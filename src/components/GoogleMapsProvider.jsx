import { useEffect, useState } from 'react';

const GoogleMapsProvider = ({ children }) => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';
		const COMPONENT_LIB_SCRIPT_ID = 'gmpx-component-lib';

		const loadGoogleMapsScript = () => {
			if (document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) return;

			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${
				import.meta.env.VITE_GOOGLE_MAPS_API_KEY
			}&libraries=places`;
			script.async = true;
			script.defer = true;
			script.id = GOOGLE_MAPS_SCRIPT_ID;
			script.onload = loadComponentLibrary;

			document.head.appendChild(script);
		};

		const loadComponentLibrary = () => {
			if (document.getElementById(COMPONENT_LIB_SCRIPT_ID)) {
				setLoaded(true);
				return;
			}

			const wc = document.createElement('script');
			wc.src = 'https://unpkg.com/@googlemaps/extended-component-library@0.17.0/dist/index.min.js';
			wc.async = true;
			wc.defer = true;
			wc.id = COMPONENT_LIB_SCRIPT_ID;
			wc.onload = () => setLoaded(true);

			document.head.appendChild(wc);
		};

		// Solo cargar si no está cargado aún
		if (!window.google) {
			loadGoogleMapsScript();
		} else if (!document.getElementById(COMPONENT_LIB_SCRIPT_ID)) {
			loadComponentLibrary();
		} else {
			setLoaded(true);
		}
	}, []);

	if (!loaded) return null;

	return children;
};

export default GoogleMapsProvider;
