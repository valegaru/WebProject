import { useRef, useEffect } from 'react';
import './DestinationSearch.css';

const DestinationSearch = ({ selectedCountries, onChange }) => {
	const autocompleteRef = useRef(null);

	useEffect(() => {
		const el = autocompleteRef.current;
		if (!el) return;

		const handlePlaceSelect = (event) => {
			const place = event.detail;
			if (!place || !place.formatted_address) return;

			const newCountry = place.formatted_address;
			const updated = [...new Set([...selectedCountries, newCountry])];
			onChange(updated);

			el.value = ''; // limpia el input
		};

		el.addEventListener('gmpx-place-select', handlePlaceSelect);

		return () => {
			el.removeEventListener('gmpx-place-select', handlePlaceSelect);
		};
	}, [selectedCountries, onChange]);

	return (
		<div className='form-group'>
			<label htmlFor='destination-autocomplete'>Destination (country):</label>
			<gmpx-place-autocomplete
				id='destination-autocomplete'
				ref={autocompleteRef}
				class='input'
				placeholder='Start typing a country...'
			/>
		</div>
	);
};

export default DestinationSearch;
