import React from 'react';
import './InfoList.css';

const InfoList = ({ title, items }) => {
	const safeItems = Array.isArray(items) ? items.slice(0, 3) : [];

	if (safeItems.length === 0) return null; // Opcional: puedes mostrar un mensaje como "No items"

	return (
		<div className='info-list-container'>
			<h3 className='info-title'>{title}</h3>
			<div className='info-cards'>
				{safeItems.map((item, index) => (
					<div className='info-cardss' key={index}>
						<img
							src={item.image || 'https://via.placeholder.com/100'}
							alt={item.label || 'Item'}
							className='info-image'
						/>
						<p className='info-label'>{item.label || 'Sin etiqueta'}</p>
						{item.badge && <img src={item.badge} alt='badge' className='badge-icon' />}
					</div>
				))}
			</div>
		</div>
	);
};

export default InfoList;

// import React from 'react';
// import './InfoList.css';

// const InfoList = ({ title, items }) => {
// 	const topThree = items.slice(0, 3);

// 	return (
// 		<div className='info-list-container'>
// 			<h3 className='info-title'>{title}</h3>
// 			<div className='info-cards'>
// 				{topThree.map((item, index) => (
// 					<div className='info-cardss' key={index}>
// 						<img src={item.image} alt={item.label} className='info-image' />
// 						<p className='info-label'>{item.label}</p>
// 						{item.badge && <img src={item.badge} alt="badge" className='badge-icon' />}
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default InfoList;
