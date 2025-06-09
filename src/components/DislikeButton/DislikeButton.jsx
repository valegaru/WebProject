import { X } from 'lucide-react';
import './DislikeButton.css';
import React from 'react';

function DislikeButton({ onClick }) {
	return (
		<button id="dislike"
		 type="button"
			onClick={onClick}
			className="bg-[#A44C1F] hover:bg-[#873D18] text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-200"
		>
			<X className="w-7 h-7" strokeWidth={3} />
		</button>
	);
}

export default DislikeButton;