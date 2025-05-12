import { db } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const addNewExpense= async ({ uidUser, name, price }) => {
    const docRef = await addDoc(collection(db, 'expense'), {
      uidUser,
      name,
      price
    });
    console.log('Document written with ID: ', docRef.id);
};

export const fetchUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log(userSnap.data())
      return userSnap.data();
    } else {
      console.log("Mano, no hay nadie");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// fetchExpensesIDs(tripID) = return expensesIDs array
// fetchItinerariesIDs(tripID) = return itinerariesIDs array
// fetchExpense(tripId, expenseID) = db -> trips -> (select trip by tripId) -> expenses -> (select expense by expenseID) -> return expense data
// fetchItinerary(tripId, itineraryID) = db -> trips -> (select trip by tripId -> intinerary -> (select itinerary by itineraryID) -> return itinerary data

// addEvent() =
// updateEvent() =
// deleteEvent() =

