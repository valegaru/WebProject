import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import Card from '../../components/Card/Card';
import bannerimage from '../../assets/bannerimage.png';
import { useNavigate } from 'react-router-dom';
import { getSavedLists } from '../../utils/firebaseUtils';

function SavedLists() {
	const user = useSelector((state) => state.auth);
	const navigate = useNavigate();

	const [userId, setUserId] = useState('');
	const [lists, setLists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (user?.userId) {
			setUserId(user.userId);
		} else {
			setError('No hay datos del usuario.');
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		const fetchSavedLists = async () => {
			if (!userId) return;

			try {
				const savedLists = await getSavedLists(userId);
				setLists(savedLists || []);
			} catch (err) {
				console.error(err);
				setError('Error al cargar las listas guardadas.');
			} finally {
				setLoading(false);
			}
		};

		fetchSavedLists();
	}, [userId]);

	return (
		<>
			<Navbar />
			<Banner image={bannerimage} title="Tus listas guardadas" />

			<div className="lists-container"> 
				{loading ? (
					<p>Cargando tus listas guardadas...</p>
				) : error ? (
					<p>{error}</p>
				) : lists.length === 0 ? (
					<p>No se encontraron listas guardadas.</p>
				) : (
					lists.map((list) => (
						<Card
							key={list.id}
							title={list.title}
							description={list.description}
							onClick={() => navigate(`/savedList/${list.id}`)}
						/>
					))
				)}
			</div>
		</>
	);
}

export default SavedLists;
