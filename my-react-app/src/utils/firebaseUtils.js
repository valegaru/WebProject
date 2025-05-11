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

export const fetchExpensesByDate = async (dateString) => {
    const snapshot = await getDocs(query(
      collection(db,  "expenses"),
      where("date", "==", dateString)
    ));

    return snapshot.docs.map(doc => doc.data());
};

// fetchTripsFromUser(userId) = db -> users -> (select user by userId) -> tripIDs -> (MATCH TRIP ID, return its data)
// fetchExpensesIDs(fetchTripsIDs()) = return expensesIDs array
// fetchItinerariesIDs(fetchTripsIDs()) = return itinerariesIDs array
// fetchExpense(tripId, expenseID) = db -> trips -> (select trip by tripId) -> expenses -> (select expense by expenseID) -> return expense data
// fetchItinerary(tripId, itineraryID) = db -> trips -> (select trip by tripId -> intinerary -> (select itinerary by itineraryID) -> return itinerary data
