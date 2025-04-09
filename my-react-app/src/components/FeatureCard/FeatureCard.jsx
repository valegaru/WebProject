import React from 'react';
import './FeatureCard.css';

const FeatureCard = ({ title, subtitle, description, image, reverse, decorationLeft, decorationRight }) => {
	return (
		<section className={`feature-card ${reverse ? 'reverse' : ''}`}>
			{decorationLeft && <div className="decoration left">{decorationLeft}</div>}

			<div className="feature-image">
				<img src={image} alt={title} />
			</div>

			<div className="feature-text">
				<h2>{title}</h2>
				<h4>{subtitle}</h4>
				<p>{description}</p>
			</div>

			{decorationRight && <div className="decoration right">{decorationRight}</div>}
		</section>
	);
};

export default FeatureCard;
