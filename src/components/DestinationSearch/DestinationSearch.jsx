import React, { useRef, useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const DestinationSearch = ({ selectedCountries, onChange }) => {
	const autocompleteRef = useRef(null);
	const [inputValue, setInputValue] = useState('');

	const handlePlaceChanged = () => {
		if (autocompleteRef.current) {
			const place = autocompleteRef.current.getPlace();
			if (place && (place.formatted_address || place.name)) {
				const newCountry = place.formatted_address || place.name;
				if (!selectedCountries.includes(newCountry)) {
					onChange([...selectedCountries, newCountry]);
				}
				setInputValue('');
			}
		}
	};

	return (
		<div className='form-group'>
			<label>Destination (country):</label>
			<LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
				<Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
					<input
						type='text'
						placeholder='Start typing a country...'
						className='input'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</Autocomplete>
			</LoadScript>
		</div>
	);
};

export default DestinationSearch;
