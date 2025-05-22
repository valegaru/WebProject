import { Heart } from 'lucide-react';
import './LikeButton.css';
import React from 'react';

function LikeButton({ onClick }) {
	return (
		<button id="like-button"
			onClick={onClick}
			className="bg-[#1985A1] hover:bg-[#146B82] text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-200"
		>
			<Heart className="w-7 h-7" strokeWidth={2.5} />
		</button>
	);
}

export default LikeButton;
