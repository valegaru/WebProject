import React from 'react';
import './FeatureCardWithHigh.css';

const FeatureCardWithHighlights = ({
	title,
	subtitle,
	description,
	highlights = [],
	decorationLeft,
	decorationRights,
}) => {
	return (
		<section className='feature-card'>
			{decorationLeft && <div className='decoration left'>{decorationLeft}</div>}

			<div className='feature-image highlights-container'>
				{highlights.map((highlight, index) => (
					<div key={index}>{highlight}</div>
				))}
			</div>

			<div className='feature-text'>
				<h2>{title}</h2>
				<h4>{subtitle}</h4>
				<p>{description}</p>
			</div>

			{decorationRights && <div className='decoration rights'>{decorationRights}</div>}
		</section>
	);
};

export default FeatureCardWithHighlights;
