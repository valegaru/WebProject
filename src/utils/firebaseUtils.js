import { db } from '../services/firebase';
import { collection } from 'firebase/firestore';
import { doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion, query, where, setDoc } from 'firebase/firestore';
import { orderBy, startAt, endAt } from 'firebase/firestore';
export const addNewExpense = async ({ uidUser, name, price }) => {
	const docRef = await addDoc(collection(db, 'expense'), {
		uidUser,
		name,
		price,
	});
	console.log('Document written with ID: ', docRef.id);
};

export const fetchUserData = async (userId) => {
	try {
		const userRef = doc(db, 'users', userId);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			console.log(userSnap.data());
			return userSnap.data();
		} else {
			console.log('Mano, no hay nadie');
			return null;
		}
	} catch (error) {
		console.error('Error fetching user data:', error);
		return null;
	}
};

export const fetchExpensesDayEvents = async (tripID, expenseID, date) => {
	try {
		const tripRef = doc(db, 'trips', tripID);
		const expenseRef = doc(collection(tripRef, 'expenses'), expenseID);
		const dayRef = doc(collection(expenseRef, 'days'), date);
		const eventsCollection = collection(dayRef, 'events');

		const snapshot = await getDocs(eventsCollection);

		const events = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		console.log('evencitos', events);
		return events;
	} catch (error) {
		console.error('fallaste loco:', error);
		return [];
	}
};

export const fetchExpenses = async (tripId) => {
	try {
		const tripRef = doc(db, 'trips', tripId);
		const expensesCollectionRef = collection(tripRef, 'expenses');
		const snapshot = await getDocs(expensesCollectionRef);

		const expenses = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return expenses;
	} catch (error) {
		console.error('Error fetching expenses:', error);
		return [];
	}
};

export const addExpenseEvent = async (tripID, expenseID, date, eventData) => {
	try {
		const dayRef = doc(db, 'trips', tripID, 'expenses', expenseID, 'days', date);
		const daySnap = await getDoc(dayRef);

		if (!daySnap.exists()) {
			await setDoc(dayRef, {});
		}

		const eventRef = doc(collection(dayRef, 'events'));
		await setDoc(eventRef, eventData);

		return eventRef.id;
	} catch (error) {
		console.error('Error adding expense event:', error);
		return null;
	}
};

export const updateExpenseEvent = async (tripID, expenseID, date, eventID, updatedData) => {
	try {
		const eventRef = doc(db, 'trips', tripID, 'expenses', expenseID, 'days', date, 'events', eventID);
		await updateDoc(eventRef, updatedData);
		return true;
	} catch (error) {
		console.error('Error updating expense event:', error);
		return false;
	}
};

export const fetchTripsFromUser = async (userId) => {
	try {
		const userRef = doc(db, 'users', userId);
		const tripsIdCollectionRef = collection(userRef, 'tripsIDs');
		const tripsIdSnapshot = await getDocs(tripsIdCollectionRef);

		const tripDataArray = [];

		for (const docSnap of tripsIdSnapshot.docs) {
			const tripId = docSnap.id;
			const tripDocRef = doc(db, 'trips', tripId);
			const tripDoc = await getDoc(tripDocRef);

			if (tripDoc.exists()) {
				tripDataArray.push({
					id: tripDoc.id,
					...tripDoc.data(),
				});
			}
		}

		return tripDataArray;
	} catch (error) {
		console.error('Error fetching trips from user:', error);
		return [];
	}
};

export const fetchTripById = async (tripId) => {
	try {
		const tripDocRef = doc(db, 'trips', tripId);
		const tripDoc = await getDoc(tripDocRef);

		if (!tripDoc.exists()) {
			console.log('No trip to fetch');
			return null; 
		}

		return tripDoc;
	} catch (error) {
		console.error('Error fetching trip', error);
		return null; 
	}
};

const formatDate = (date) => {
  if (typeof date === 'string') return date.slice(0, 10);
  return date.toISOString().slice(0, 10);
};

export const addTrip = async (userId, description, destination, startDate, endDate, name, participants, tripPic) => {
  try {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const tripRef = doc(collection(db, 'trips'));

    await setDoc(tripRef, {
      userId,
      description,
      destination,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      name,
      participants,
      tripPic,
    });

    await createExpense(tripRef, participants, formattedStartDate);

    const itineraryRef = doc(collection(tripRef, 'itinerary'));
    await setDoc(itineraryRef, {});

    const tripIDRef = doc(db, `users/${userId}/tripsIDs/${tripRef.id}`);
    await setDoc(tripIDRef, {
      id: tripRef.id,
    });

    return tripRef.id;
  } catch (error) {
    console.error('Error adding trip:', error);
    return null;
  }
};

export const createExpense = async (tripRef, participants, startDate) => {
	try {
		const dateOnly = new Date(startDate).toISOString().split('T')[0]; 

		const existingExpensesSnap = await getDocs(collection(tripRef, 'expenses'));
		const expenseCount = existingExpensesSnap.size + 1;

		const expenseRef = doc(collection(tripRef, 'expenses'));
		await setDoc(expenseRef, {
			name: `Expense ${expenseCount}`,
			participants: participants.map(p => p.id || p)
		});

		const dayRef = doc(collection(expenseRef, 'days'), dateOnly);
		await setDoc(dayRef, {});

		return { expenseRef, dayRef };

	} catch (error) {
		console.error("Error creating expense with day:", error);
		return null;
	}
};

export const searchUsersByName = async (nameToSearch) => {
	const usersRef = collection(db, 'users');
	const q = query(usersRef, where('username', '==', nameToSearch));
	const querySnapshot = await getDocs(q);

	const results = [];
	querySnapshot.forEach((doc) => {
		results.push({ id: doc.id, ...doc.data() });
	});

	return results;
};

export const getUserNameById = async (userId) => {
	if (!userId) return null;

	try {
		const userRef = doc(db, 'users', userId);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			const userData = userSnap.data();
			return userData.username || '';
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};

export const updateUserProfilePicture = async (userId, profilePicture) => {
	try {
		const userRef = doc(db, 'users', userId);
		await updateDoc(userRef, { profilePicture });
		return true;
	} catch (error) {
		console.error('Error updating photo URL:', error);
		return false;
	}
};

export const getUserProfilePicture = async (userId) => {
	try {
		const userRef = doc(db, 'users', userId);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			return userSnap.data().profilePicture || '';
		}
		return '';
	} catch (error) {
		console.error('Error fetching user photo URL:', error);
		return '';
	}
};

export const searchUsersByEmail = async (emailToSearch) => {
	const usersRef = collection(db, 'users');
	const q = query(usersRef, orderBy('email'), startAt(emailToSearch), endAt(emailToSearch + '\uf8ff'));

	const querySnapshot = await getDocs(q);
	const results = [];

	querySnapshot.forEach((doc) => {
		results.push({ id: doc.id, ...doc.data() });
	});

	return results;
};

export const getTripsByUserIdFromFirestore = async (userId) => {
	const q = query(collection(db, 'trips'), where('userId', '==', userId));
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addEventToDay = async (tripID, expenseID, date, eventData) => {
	try {
		const tripRef = doc(db, 'trips', tripID);
		const expenseRef = doc(collection(tripRef, 'expenses'), expenseID);
		const dayRef = doc(collection(expenseRef, 'days'), date);
		const eventsCollection = collection(dayRef, 'events');

		const newDocRef = await addDoc(eventsCollection, eventData);
		console.log('Event added with ID:', newDocRef.id);
		return newDocRef.id;
	} catch (error) {
		console.error('Error adding event:', error);
		return null;
	}
};

export const updateEventInDay = async (tripID, expenseID, date, eventID, updatedData) => {
	try {
		const tripRef = doc(db, 'trips', tripID);
		const expenseRef = doc(collection(tripRef, 'expenses'), expenseID);
		const dayRef = doc(collection(expenseRef, 'days'), date);
		const eventDocRef = doc(collection(dayRef, 'events'), eventID);

		await updateDoc(eventDocRef, updatedData);
		console.log('Event updated:', eventID);
		return true;
	} catch (error) {
		console.error('Error updating event:', error);
		return false;
	}
};

// addTrip() = db -> trips -> (add fields: description, destination, startDate, endDate, name, participants[], add collections: expenses, itineraries, addtripid(()=>(db->users(matchUserId)->addTrip id to tripsIDs collection)))

// updateTrip() =

// fetchExpensesIDs(tripID) = return expensesIDs array
// fetchItinerariesIDs(tripID) = return itinerariesIDs array
// fetchExpense(tripId, expenseID) = db -> trips -> (select trip by tripId) -> expenses -> (select expense by expenseID) -> return expense data
// fetchItinerary(tripId, itineraryID) = db -> trips -> (select trip by tripId -> intinerary -> (select itinerary by itineraryID) -> return itinerary data

// addEvent() =
// updateEvent() =
// deleteEvent() =
