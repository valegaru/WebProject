import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useEffect, useState } from 'react';
import CardCity from '../../components/CardCity/CardCity';
import Navbar from '../../components/Navbar/Navbar';

const DestinationDetail = () => {
  const { destinationId } = useParams();
  const [city, setCity] = useState(null);

  useEffect(() => {
    const fetchCity = async () => {
      const ref = doc(db, 'matches', destinationId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCity(snap.data());
      }
    };
    fetchCity();
  }, [destinationId]);

  return (
    <>
      <Navbar />
      <div className="destination-detail-page">
        {city ? <CardCity city={city} /> : <p>Loading...</p>}
      </div>
    </>
  );
};

export default DestinationDetail;
