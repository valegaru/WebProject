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
		const tripCollectionRef = collection(userRef, 'tripsIDs');
		const tripSnapshot = await getDocs(tripCollectionRef);
		console.log(
			'fetCHY',
			tripSnapshot.docs.map((doc) => doc.data())
		);
		return tripSnapshot;
	} catch (error) {
		console.error('Error fetching trips from user:', error);
		return [];
	}
};

export const addTrip = async (userId, description, destination, startDate, endDate, name, participants, tripPic) => {
	try {
		const tripRef = doc(collection(db, 'trips'));

		await setDoc(tripRef, {
			userId,
			description,
			destination,
			startDate,
			endDate,
			name,
			participants,
			tripPic,
		});

		const expensesRef = doc(collection(tripRef, 'expenses'));
		await setDoc(expensesRef, {});

		const itineraryRef = doc(collection(tripRef, 'itinerary'));
		await setDoc(itineraryRef, {});

		const tripIDRef = doc(collection(db, `users/${userId}/tripsIDs`));
		await setDoc(tripIDRef, {
			tripID: tripRef.id,
		});

		return tripRef.id;
	} catch (error) {
		console.error('Error adding trip:', error);
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
// addTrip() = db -> trips -> (add fields: description, destination, startDate, endDate, name, participants[], add collections: expenses, itineraries, addtripid(()=>(db->users(matchUserId)->addTrip id to tripsIDs collection)))

// updateTrip() =

// fetchExpensesIDs(tripID) = return expensesIDs array
// fetchItinerariesIDs(tripID) = return itinerariesIDs array
// fetchExpense(tripId, expenseID) = db -> trips -> (select trip by tripId) -> expenses -> (select expense by expenseID) -> return expense data
// fetchItinerary(tripId, itineraryID) = db -> trips -> (select trip by tripId -> intinerary -> (select itinerary by itineraryID) -> return itinerary data

// addEvent() =
// updateEvent() =
// deleteEvent() =
