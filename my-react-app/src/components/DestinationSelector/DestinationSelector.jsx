import React from 'react';
import ParticipantCard from '../ParticipantCard/ParticipantCard';
import './DestinationSelector.css';

const destinations = [
	{
		name: 'Barcelona',
		avatarUrl:
			'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg',
	},
	{
		name: 'Italia',
		avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ46MdKTzgzqrT4xctyvoxbnbZXuT85IMonw&s',
	},
];

const savedLists = ['Destinos en europa', 'Destinos en USA', 'Destinos en LATAM'];

const DestinationSelector = () => {
	return (
		<div className='destination-question-card'>
			<h3 className='destination-question-title'>
				J. ¿Tienes un destino en mente que te gustaría incluir en las opciones?
			</h3>

			<input className='destination-search' type='text' placeholder='Busca un destino' />

			<div className='destination-list'>
				{destinations.map((dest) => (
					<ParticipantCard key={dest.name} name={dest.name} avatarUrl={dest.avatarUrl} />
				))}
			</div>

			<hr className='separator' />

			<p className='saved-text'>Añade una lista de tus destinos guardados</p>

			<div className='saved-destination-list'>
				{savedLists.map((list) => (
					<div key={list} className='saved-destination-button'>
						{list} <span className='plus-icon'>＋</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default DestinationSelector;
