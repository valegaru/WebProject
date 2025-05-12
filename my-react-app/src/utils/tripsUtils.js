import { db } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const fetchTripsFromUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const tripCollectionRef = collection(userRef, "tripsIDs");
    const tripSnapshot = await getDocs(tripCollectionRef);
    console.log("fetCHY", tripSnapshot.docs.map(doc => doc.data()));
    return tripSnapshot;
  } catch (error) {
    console.error("Error fetching trips from user:", error);
    return [];
  }
};

// addTrip() = db -> trips -> (add fields: description, destination, startDate, endDate, name, participants[], add collections: expenses, itineraries)

// updateTrip() =  