import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../../components/Navbar/Navbar';
import CardList from '../../components/CardList/CardList';

import editIcon from '../../assets/editIcon.png';
import { fetchSavedListById, fetchItemsForSavedList } from '../../utils/firebaseUtils';

const List = () => {
	const { listId } = useParams();
	const [list, setList] = useState(null);
	const [places, setItems] = useState([]);

	const navigate = useNavigate();

	const handleItemClick = (item) => {
		console.log('Clicked on item:', item);
	};

	useEffect(() => {
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
						onClick: () => handleItemClick(item),
					}));
					setItems(itemsWithClick);
				}
			} catch (err) {
				console.error('Error loading list data:', err);
			}
		};

		if (listId) {
			fetchData();
		}
	}, [listId]);

	if (!list) return <p>Loading list data...</p>;

	return (
		<div className='trip-planner-container'>
			<Navbar />
			<section className='trip-header'>
				<img src={list.coverImage || '/default-banner.jpg'} alt='List Banner' className='trip-banner' />
				<div className='container'>
					<div className='textContent'>
						<div className='nameDate'>
							<h1>{list.title || 'Untitled List'}</h1>
							<button className='edit-icon'>
								<img src={editIcon} alt="Edit" />
							</button>
						</div>
						<div className='trip-description'>
							<h3>Description:</h3>
							<p>{list.description || 'No description provided.'}</p>
						</div>
					</div>
				</div>
			</section>

			<section className='section'>
				<CardList title='Places' cardsData={places} variantColor='blue' />
			</section>
		</div>
	);
};

export default List;
