import React, { useState } from 'react';
import QuestionCard from '../QuestionCard/QuestionCard';
import './QuestionList.css';
import DestinationSelector from '../DestinationSelector/DestinationSelector';
const questionsData = [
	{
		id: 'A',
		question: '¿Cuál es tu presupuesto estimado por persona?',
		options: ['Bajo $', 'Medio $$', 'Alto $$$'],
	},
	{
		id: 'B',
		question: '¿Qué tipo de alojamiento prefieres?',
		options: ['Hostales', 'Hotel estándar', 'Resort', 'Airbnb'],
	},
	{
		id: 'C',
		question: '¿Cómo te gustaría moverte en el destino?',
		options: ['Transporte público', 'Rentar un auto', 'Caminatas y bicicletas', 'Taxi/Uber'],
	},
	{
		id: 'D',
		question: '¿Qué tipo de destino prefieres?',
		options: ['Playa y sol', 'Ciudades vibrantes', 'Naturaleza y aventura', 'Cultura e historia', 'Nieve y deportes de invierno'],
	},
	{
		id: 'E',
		question: '¿Qué clima prefieres?',
		options: ['Cálido', 'Templado', 'Frío', 'No tengo preferencia'],
	},
	{
		id: 'F',
		question: '¿Qué tipo de destino prefieres?',
		options: ['Playa y sol', 'Ciudades vibrantes', 'Naturaleza y aventura', 'Cultura e historia', 'Nieve y deportes de invierno'],
	},
	{
		id: 'G',
		question: '¿Prefieres un viaje internacional o dentro del país?',
		options: ['Internacional', 'Nacional', 'Cualquiera'],
	},
	{
		id: 'H',
		question: '¿Cuánto tiempo planeas viajar?',
		options: ['Fin de semana (2–3 días)', 'Corta duración (4–7 días)', 'Viaje largo (más de una semana)'],
	},
	{
		id: 'I',
		question: '¿Qué actividades te gustaría hacer?',
		options: [
			'Rejolación y spa',
			'Exploración cultural y museos',
			'Vida nocturna y bares',
			'Aventuras extremas (senderismo, buceo, etc.)',
			'Compras',
			'Gastronomía',
			'Festivales y eventos',
		],
	},
];

const QuestionList = () => {
	const [answers, setAnswers] = useState({});

	const handleSelect = (id, option) => {
		setAnswers((prev) => ({ ...prev, [id]: option }));
	};

	return (
		<div className="question-list-container">
			<h2>Preguntas</h2>
			<hr />
			<div className="questions-grid">
				{questionsData.map((q) => (
					<QuestionCard
						key={q.id}
						id={q.id}
						question={q.question}
						options={q.options}
						onSelect={handleSelect}
						selectedOption={answers[q.id]}
					/>
				))}
			</div>
      <DestinationSelector />
		</div>
	);
};

export default QuestionList;
