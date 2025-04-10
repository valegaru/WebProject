import Navbar from '../../components/Navbar/Navbar';
import WinnerDestination from '../../components/WinnerDestination/WinnerDestination';
import './MatchmakerResults.css';

function MatchmakerResults() {
	return (
		<>
			<Navbar />
			<div className='matchmaker-results'>
				<h1 className='winner-title'>Winner destination!</h1>
				<WinnerDestination
					city={{
						name: 'Barcelona',
						image:
							'https://www.spain.info/export/sites/segtur/.content/imagenes/cabeceras-grandes/cataluna/park-guell-barcelona-s-305364611.jpg',
					}}
				/>
			</div>
		</>
	);
}

export default MatchmakerResults;
