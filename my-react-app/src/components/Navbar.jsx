import React, { useState } from 'react';

const Navbar = ({ image, label,  }) => {
	return (
		<div className='.'>
			<img src={image} alt={label} className='card-img' />
		</div>
	);
};

export default Navbar;
