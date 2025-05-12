import { db } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const fetchExpensesDayEvents = async (tripID, expenseID, date) => {
    try {
      const tripRef = doc(db, "trips", tripID);
      const expenseRef = doc(collection(tripRef, "expenses"), expenseID);
      const dayRef = doc(collection(expenseRef, "days"), date);
      const eventsCollection = collection(dayRef, "events");

      const snapshot = await getDocs(eventsCollection);

      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("evencitos",events)
      return events;
    } catch (error) {
      console.error("fallaste loco:", error);
      return [];
    }
};