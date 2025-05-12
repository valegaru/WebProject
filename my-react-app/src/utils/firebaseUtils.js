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

export const fetchUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
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

export const fetchTripsFromUser = async (userId) => {
  try {
    const userData = await fetchUserData(userId);
    if (!userData || !userData.tripIDs) {
      console.log("No trip IDs found");
      return [];
    }

    return userData.tripIDs;
  } catch (error) {
    console.error("Error fetching trips from user:", error);
    return [];
  }
};

// fetchUserData(userId) = db -> users -> (select user by userId) -> retunr data
// fetchTripsFromUser(fetchUserDate(userId)) = db -> users -> (select user by userId) -> tripIDs -> (return all tripsIDs)
// fetchExpensesIDs(fetchTripsIDs()) = return expensesIDs array
// fetchItinerariesIDs(fetchTripsIDs()) = return itinerariesIDs array
// fetchExpense(tripId, expenseID) = db -> trips -> (select trip by tripId) -> expenses -> (select expense by expenseID) -> return expense data
// fetchItinerary(tripId, itineraryID) = db -> trips -> (select trip by tripId -> intinerary -> (select itinerary by itineraryID) -> return itinerary data
