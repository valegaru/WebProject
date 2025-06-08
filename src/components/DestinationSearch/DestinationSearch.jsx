import { useRef, useState } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import './DestinationSearch.css';

const DestinationSearch = ({ selectedCountries, onChange }) => {
	const inputRef = useRef(null);
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
			<label htmlFor='destination'>Destination (country):</label>
			<StandaloneSearchBox onLoad={(ref) => (searchBoxRef.current = ref)} onPlacesChanged={handlePlacesChanged}>
				<input
					type='text'
					ref={inputRef}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className='input'
					placeholder='Start typing a country...'
					id='destination'
				/>
			</StandaloneSearchBox>
		</div>
	);
};

export default DestinationSearch;
