import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/banner';
import Card from '../../components/Card/Card';
import bannerimage from '../../assets/bannerimage.png';
import { fetchTripsFromUser, fetchUserData } from '../../utils/firebaseUtils';
import { getTripsByUserIdFromFirestore } from '../../utils/firebaseUtils';
import './Trips.css';



function Trips() {
	const user = useSelector((state) => state.auth); // igual que en Profile

	const [userId, setUserId] = useState('');
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			if (user?.userId) {
				const data = await fetchUserData(user.userId);
				if (data) {
					setUserId(user.userId); // Ya confirmado que es válido
				} else {
					setError('No se pudo obtener la información del usuario.');
					setLoading(false);
				}
			} else {
				setError('No hay datos del usuario.');
				setLoading(false);
			}
		};

		fetchData();
	}, [user]);

	useEffect(() => {
		const fetchTrips = async () => {
			if (!userId) return;

			try {
				const userTrips= await fetchTripsFromUser(userId);

				setTrips(userTrips || []);
			} catch (err) {
				console.error(err);
				setError('Error al cargar los viajes.');
			} finally {
				setLoading(false);
			}
		};

		fetchTrips();
	}, [userId]);

	return (
		<>
			<Navbar />
			<Banner
				title='Browse through your trips'
				subtitle='Click on a trip to view the details'
				description='Are you ready to embark on your next adventure? Browse through your trips and get ready to create unforgettable memories with your friends and family.'
				buttonText='Start planning your next trip'
				backgroundImage={bannerimage}
				buttonRoute='/tripcreation'
			/>

			<div className='trips-container'>
				{loading ? (
					<p>Loading your trips...</p>
				) : error ? (
					<p>{error}</p>
				) : trips.length === 0 ? (
					<p>No trips found. Start planning one!</p>
				) : (
					<div className='trips-grid'>
						{trips.map((trip) => (
							<Card
								variant='trips'
								key={trip.id}
								tripPic={trip.tripPic}
								name={trip.name}
								startDate={trip.startDate}
								endDate={trip.endDate}
								description={trip.description}
								participants={trip.participants}
								onClick={() => (window.location.href = `/tripPlanner/${trip.id}`)}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
}

export default Trips;
