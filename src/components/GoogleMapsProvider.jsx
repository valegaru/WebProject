import { useEffect } from 'react';

const GoogleMapsProvider = ({ children }) => {
	useEffect(() => {
		// Cargar el script de la API de Google Maps si no existe
		if (!window.google && !document.querySelector('#google-maps-script')) {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
			script.async = true;
			script.defer = true;
			script.id = 'google-maps-script';
			document.head.appendChild(script);
		}

		// Cargar Web Components (autocomplete) si no existe
		if (!window.customElements.get('gmpx-place-autocomplete') && !document.querySelector('#gmpx-component-lib')) {
			const wc = document.createElement('script');
			wc.src = 'https://unpkg.com/@googlemaps/extended-component-library@0.17.0/dist/index.min.js';
			wc.async = true;
			wc.defer = true;
			wc.id = 'gmpx-component-lib';
			document.head.appendChild(wc);
		}
	}, []);

	return children;
};

export default GoogleMapsProvider;
