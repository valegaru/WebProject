import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './List.css';
import Navbar from '../../components/Navbar/Navbar';
import Card from '../../components/Card/Card';
import editIcon from '../../assets/editIcon.png';
import { fetchSavedListById, fetchItemsForSavedList } from '../../utils/firebaseUtils';
import { useDispatch } from 'react-redux';
import { setMapMarkers, setMapType } from '../../store/mapInfo/MapInfo';
import MapComponent from '../../components/Map/MapComponent/MapComponent';


const List = () => {
	const { listId } = useParams();
	const [list, setList] = useState(null);
	const [places, setPlaces] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleItemClick = (placeId) => {
		console.log('Clicked on place id:', placeId);
	};

	useEffect(() => {
		dispatch(setMapType("trips"))

		const fetchData = async () => {
			try {
				const listDoc = await fetchSavedListById(listId);
				const listItems = await fetchItemsForSavedList(listId);

				if (listDoc) {
					setList(listDoc);
				}

				if (listItems) {
					const itemsWithClick = listItems.map((item) => ({
						...item,
						onClick: () => handleItemClick(item.id),
					}));
					setPlaces(itemsWithClick);

					// Set map markers from items with coordinates
					const validMarkers = listItems
						.filter(item => item.coordinates?.lat && item.coordinates?.lng)
						.map(item => ({
							id: item.id,
							position: {
								lat: item.coordinates.lat,
								lng: item.coordinates.lng,
							},
							title: item.name || 'Unnamed Place',
						}));

					dispatch(setMapMarkers(validMarkers));
				}
			} catch (err) {
				console.error('Error loading list data:', err);
			}
		};

		if (listId) {
			fetchData();
		}
	}, [listId, dispatch]);

	if (!list) return <p>Loading list data...</p>;

	return (
		<div className='trip-planner-container'>
			<Navbar />
			<MapComponent></MapComponent>
			<section className='section'>
				<h2>Places</h2>
				{places.length === 0 ? (
					<p>No places added yet.</p>
				) : (
					<div className='places-list'>
						{places.map((place) => (
							<Card
								key={place.id}
								id={place.id}
								name={place.name || 'Untitled Place'}
								tripPic={place.tripPic}
								description={place.address || ''}
								onClick={place.onClick}
								variant='saved'
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
};

export default List;
