import React, { useRef, useState } from 'react';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];

const DestinationSearch = ({ selectedCountries, onChange }) => {
	const searchBoxRef = useRef(null);
	const [inputValue, setInputValue] = useState('');

	const handlePlacesChanged = () => {
		const places = searchBoxRef.current.getPlaces();
		if (places?.length) {
			const newSelections = places.map((place) => place.formatted_address || place.name);
			const uniqueCountries = [...new Set([...selectedCountries, ...newSelections])];
			onChange(uniqueCountries);
			setInputValue('');
		}
	};

	return (
		<div className='form-group'>
			<label>Destination (country):</label>
			<LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
				<StandaloneSearchBox onLoad={(ref) => (searchBoxRef.current = ref)} onPlacesChanged={handlePlacesChanged}>
					<input
						type='text'
						placeholder='Start typing a country...'
						className='input'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</StandaloneSearchBox>
			</LoadScript>

			{selectedCountries.length > 0 && (
				<ul className='selected-destinations'>
					{selectedCountries.map((country, index) => (
						<li key={index}>{country}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DestinationSearch;
