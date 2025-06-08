import { useEffect, useRef } from 'react';

const DestinationSearch = ({ selectedCountries, onChange }) => {
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;

		const handlePlaceViewed = (event) => {
			const place = event.detail;
			const name = place?.formatted_address || place?.name;
			if (name && !selectedCountries.includes(name)) {
				onChange([...selectedCountries, name]);
			}
		};

		if (el) {
			el.addEventListener('gmpx-placeautocomplete-placeviewed', handlePlaceViewed);
		}

		return () => {
			if (el) {
				el.removeEventListener('gmpx-placeautocomplete-placeviewed', handlePlaceViewed);
			}
		};
	}, [selectedCountries, onChange]);

	return (
		<div className='form-group'>
			<label>Destination (country):</label>
			<gmpx-place-autocomplete ref={ref} class='input' placeholder='Start typing a country...' />
		</div>
	);
};
export default DestinationSearch;
