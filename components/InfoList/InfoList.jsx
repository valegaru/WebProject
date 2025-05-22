import React from 'react';
import './InfoList.css';

const InfoList = ({ title, items }) => {
	const topThree = items.slice(0, 3);

	return (
		<div className='info-list-container'>
			<h3 className='info-title'>{title}</h3>
			<div className='info-cards'>
				{topThree.map((item, index) => (
					<div className='info-cardss' key={index}>
						<img src={item.image} alt={item.label} className='info-image' />
						<p className='info-label'>{item.label}</p>
						{item.badge && <img src={item.badge} alt="badge" className='badge-icon' />}
					</div>
				))}
			</div>
		</div>
	);
};

export default InfoList;
