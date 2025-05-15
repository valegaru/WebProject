import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { addTrip, searchUsersByName } from '../../utils/firebaseUtils';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../components/Navbar/Navbar';

function TripCreation() {
  const { userId } = useSelector((state) => state.auth);

  const [tripData, setTripData] = useState({
    name: '',
    description: '',
    destination: '',
    startDate: null,
    endDate: null,
    participants: [],
    tripPic: '', // puedes adaptar esto si luego implementas upload de imágenes
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      const results = await searchUsersByName(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addParticipant = (user) => {
    if (!tripData.participants.includes(user.id)) {
      setTripData({
        ...tripData,
        participants: [...tripData.participants, user.id],
      });
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Usuario no logueado.");
      return;
    }

    const {
      name,
      description,
      destination,
      startDate,
      endDate,
      participants,
      tripPic,
    } = tripData;

    const tripID = await addTrip(
      userId,
      description,
      destination,
      startDate?.toISOString() || '',
      endDate?.toISOString() || '',
      name,
      participants,
      tripPic
    );

    if (tripID) {
      alert("Viaje creado con éxito 🎉");
      // Redirigir o limpiar formulario si deseas
    } else {
      alert("Error al crear el viaje 😞");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Crear un nuevo viaje</h2>
        <form onSubmit={handleSubmit}>

          <label>Nombre del viaje:</label>
          <input
            type="text"
            name="name"
            value={tripData.name}
            onChange={handleInputChange}
            required
          />

          <label>Descripción:</label>
          <textarea
            name="description"
            value={tripData.description}
            onChange={handleInputChange}
            required
          />

          <label>Destino (país):</label>
          <input
            type="text"
            name="destination"
            value={tripData.destination}
            onChange={handleInputChange}
            required
          />

          <label>Fecha de inicio:</label>
          <DatePicker
            selected={tripData.startDate}
            onChange={(date) =>
              setTripData({ ...tripData, startDate: date })
            }
            dateFormat="yyyy-MM-dd"
          />

          <label>Fecha de fin:</label>
          <DatePicker
            selected={tripData.endDate}
            onChange={(date) =>
              setTripData({ ...tripData, endDate: date })
            }
            dateFormat="yyyy-MM-dd"
          />

          <label>Buscar participantes por username:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Escribe un nombre..."
          />
          {searchResults.length > 0 && (
            <ul style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => addParticipant(user)}
                  style={{ cursor: 'pointer' }}
                >
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}

          <label>Participantes agregados:</label>
          <ul>
            {tripData.participants.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>

          <button type="submit">Crear viaje</button>
        </form>
      </div>
    </>
  );
}

export default TripCreation;
