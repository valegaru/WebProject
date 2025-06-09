//, arrayUnion

import { db } from '../services/firebase';
import { collection } from 'firebase/firestore';
import { doc, getDoc, getDocs, addDoc, updateDoc, query, where, setDoc } from 'firebase/firestore';
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

export const fetchItineraries = async (tripId) => {
	try {
		const tripRef = doc(db, 'trips', tripId);
		const itineraryCollectionRef = collection(tripRef, 'itinerary');
		const snapshot = await getDocs(itineraryCollectionRef);

		const itineraries = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return itineraries;
	} catch (error) {
		console.error('Error fetching itineraries:', error);
		return [];
	}
};

export const convertTimestampsToDate = (data) => {
	if (!data || typeof data !== 'object') return data;

	const converted = { ...data };

	const timestampFields = ['createdAt', 'updatedAt', 'start', 'end', 'date', 'timestamp'];

	timestampFields.forEach((field) => {
		if (converted[field] && typeof converted[field].toDate === 'function') {
			converted[field] = converted[field].toDate();
		}
	});

	Object.keys(converted).forEach((key) => {
		if (
			converted[key] &&
			typeof converted[key] === 'object' &&
			!Array.isArray(converted[key]) &&
			!(converted[key] instanceof Date)
		) {
			converted[key] = convertTimestampsToDate(converted[key]);
		}
	});

	return converted;
};

export const fetchExpenseEvents = async (tripID, expenseID) => {
	try {
		console.log('Starting fetchExpenseEvents with:', { tripID, expenseID });

		if (!tripID || !expenseID) {
			console.log('Missing required parameters:', { tripID, expenseID });
			return [];
		}

		const tripRef = doc(db, 'trips', tripID);
		const expenseRef = doc(collection(tripRef, 'expenses'), expenseID);
		const eventsCollection = collection(expenseRef, 'events');

		const snapshot = await getDocs(eventsCollection);


		if (snapshot.empty) {
			console.log('No events found in the collection');
			return [];
		}

		const events = snapshot.docs.map((doc) => {
			const data = doc.data();
			const processedData = convertTimestampsToDate(data);

			return {
				id: doc.id,
				...processedData,
			};
		});
		return events;
	} catch (error) {
		console.error('Error in fetchExpenseEvents:', error);
		return [];
	}
};

export const fetchExpenseEventsByDate = async (tripID, expenseID, date) => {
	try {
		const allEvents = await fetchExpenseEvents(tripID, expenseID);

		const dateEvents = allEvents.filter((event) => {
			return (
				event.date === date || (event.start && new Date(event.start).toDateString() === new Date(date).toDateString())
			);
		});

		console.log(`Events for date ${date}:`, dateEvents);
		return dateEvents;
	} catch (error) {
		console.error('Error fetching events by date:', error);
		return [];
	}
};

export const fetchTripAllEvents = async (tripID) => {
	try {
		const tripRef = doc(db, 'trips', tripID);
		const expensesCollection = collection(tripRef, 'expenses');
		const expensesSnapshot = await getDocs(expensesCollection);

		const allEvents = [];

		await Promise.all(
			expensesSnapshot.docs.map(async (expenseDoc) => {
				const expenseEvents = await fetchExpenseEvents(tripID, expenseDoc.id);
				const eventsWithExpenseInfo = expenseEvents.map((event) => ({
					...event,
					expenseID: expenseDoc.id,
					expenseData: expenseDoc.data(),
				}));
				allEvents.push(...eventsWithExpenseInfo);
			})
		);

		console.log('All trip events:', allEvents);
		return allEvents;
	} catch (error) {
		console.error('Error fetching all trip events:', error);
		return [];
	}
};


export const addExpenseEvent = async (tripID, expenseID, eventData) => {
	try {
		const expenseRef = doc(db, 'trips', tripID, 'expenses', expenseID);
		const eventsCollection = collection(expenseRef, 'events');

		const eventRef = doc(eventsCollection);
		await setDoc(eventRef, {
			...eventData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		console.log('Event added with ID:', eventRef.id);
		return eventRef.id;
	} catch (error) {
		console.error('Error adding expense event:', error);
		return null;
	}
};


export const createList = async (userId, name, description) => {
	try {
		const listRef = doc(collection(db, 'savedLists'));

		await setDoc(listRef, {
			userId,
			name,
			description,
		});

		const placesRef = doc(collection(listRef, 'places'));
		await setDoc(placesRef, {});

		const userListIDRef = doc(db, `users/${userId}/savedLists/${listRef.id}`);
		await setDoc(userListIDRef, {
			id: listRef.id,
		});

		return listRef.id;
	} catch (error) {
		console.error('Error adding list:', error);
		return null;
	}
};

export const getSavedLists = async (userId) => {
    try {
        if (!userId) {
            console.error('User ID is required to fetch lists');
            return [];
        }

        const userListsRef = collection(db, `users/${userId}/savedLists`);
        const userListsSnapshot = await getDocs(userListsRef);
        
        if (userListsSnapshot.empty) {
            return [];
        }

        const listPromises = userListsSnapshot.docs.map(async (listDoc) => {
            const listId = listDoc.data().id;
            const savedListRef = doc(db, 'savedLists', listId);
            const savedListSnapshot = await getDoc(savedListRef);
            
            if (savedListSnapshot.exists()) {
                return {
                    id: listId,
                    ...savedListSnapshot.data()
                };
            }
            return null;
        });

        const lists = await Promise.all(listPromises);
        
        return lists.filter(list => list !== null);
        
    } catch (error) {
        console.error('Error fetching user lists:', error);
        return [];
    }
};

export const addPlace = async (
  listId,
  lat,
  lng,
  tripPic = null,
  name = 'Untitled Place',
  address = ''
) => {
  try {
    const placeRef = doc(collection(db, `savedLists/${listId}/places`));

    await setDoc(placeRef, {
      name,
      address,
      coordinates: {
        lat,
        lng,
      },
      tripPic,
    });

    return placeRef.id;
  } catch (error) {
    console.error('Error adding place:', error);
    return null;
  }
};


export const fetchSavedListById = async (listId) => {
	try {
		const listRef = doc(db, 'savedLists', listId);
		const listSnap = await getDoc(listRef);

		if (listSnap.exists()) {
			return { id: listSnap.id, ...listSnap.data() };
		} else {
			console.warn('No such saved list:', listId);
			return null;
		}
	} catch (error) {
		console.error('Error fetching saved list:', error);
		return null;
	}
};

export const fetchItemsForSavedList = async (listId) => {
	try {
		const placesRef = collection(db, `savedLists/${listId}/places`);
		const placesSnap = await getDocs(placesRef);

		if (placesSnap.empty) return [];

		const places = placesSnap.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}));

		return places;
	} catch (error) {
		console.error('Error fetching places for saved list:', error);
		return [];
	}
};

export const updateExpenseEvent = async (tripID, expenseID, eventID, eventData) => {
	try {
		const tripRef = doc(db, 'trips', tripID);
		const expenseRef = doc(collection(tripRef, 'expenses'), expenseID);
		const eventRef = doc(collection(expenseRef, 'events'), eventID);

		await updateDoc(eventRef, {
			...eventData,
			updatedAt: new Date(),
		});

		console.log('Event updated successfully');
	} catch (error) {
		console.error('Error updating event:', error);
		throw error;
	}
};

export const deleteExpenseEvent = async (tripID, expenseID, eventID) => {
	try {
		const tripRef = doc(db, 'trips', tripID);
		const expenseRef = doc(collection(tripRef, 'expenses'), expenseID);
		const eventRef = doc(collection(expenseRef, 'events'), eventID);

		await deleteDoc(eventRef);
		console.log('Event deleted successfully');
	} catch (error) {
		console.error('Error deleting event:', error);
		throw error;
	}
};

const fetchTripIds = async (userId) => {
	try {
		const userRef = doc(db, 'users', userId);
		const tripsIdCollectionRef = collection(userRef, 'tripsIDs');
		const tripsIdSnapshot = await getDocs(tripsIdCollectionRef);

		return tripsIdSnapshot;
	} catch (error) {
		console.error(error);
	}
};

export const fetchTripsFromUser = async (userId) => {
	try {
		const tripsIDs = await fetchTripIds(userId);
		const tripDataArray = [];

		for (const docSnap of tripsIDs.docs) {
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

		const creatorTripIDRef = doc(db, `users/${userId}/tripsIDs/${tripRef.id}`);
		await setDoc(creatorTripIDRef, {
			id: tripRef.id,
		});

		const participantPromises = participants.map(async (participantId) => {
			const participantTripIDRef = doc(db, `users/${participantId}/tripsIDs/${tripRef.id}`);
			await setDoc(participantTripIDRef, {
				id: tripRef.id,
			});
		});

		await Promise.all(participantPromises);

		return tripRef.id;
	} catch (error) {
		console.error('Error adding trip:', error);
		return null;
	}
};

export const createExpense = async (tripRef, participants, startDate, sharedId) => {
	try {
		const dateOnly = new Date(startDate).toISOString().split('T')[0];

		const existingExpensesSnap = await getDocs(collection(tripRef, 'expenses'));
		const expenseCount = existingExpensesSnap.size + 1;

		const expenseRef = doc(tripRef, 'expenses', sharedId);
		await setDoc(expenseRef, {
			name: `Expense ${expenseCount}`,
			participants: participants.map((p) => p.id || p),
		});

		const dayRef = doc(collection(expenseRef, 'days'), dateOnly);
		await setDoc(dayRef, {});

		return { expenseRef, dayRef };
	} catch (error) {
		console.error('Error creating expense with day:', error);
		return null;
	}
};

export const createItinerary = async (tripRef, participants, startDate, sharedId) => {
	try {
		const dateOnly = new Date(startDate).toISOString().split('T')[0];

		const existingItinerariesSnap = await getDocs(collection(tripRef, 'itinerary'));
		const itineraryCount = existingItinerariesSnap.size + 1;

		const itineraryRef = doc(tripRef, 'itinerary', sharedId);
		await setDoc(itineraryRef, {
			name: `Itinerary ${itineraryCount}`,
			participants: participants.map((p) => p.id || p),
		});

		const dayRef = doc(collection(itineraryRef, 'days'), dateOnly);
		await setDoc(dayRef, {});

		return { itineraryRef, dayRef };
	} catch (error) {
		console.error('Error creating itinerary with day:', error);
		return null;
	}
};

export const sharedIdGenerator = (tripRef) => {
	const sharedId = doc(collection(tripRef, 'expenses')).id;
	return sharedId;
};

export const searchUsersByName = async (nameToSearch) => {
	const usersRef = collection(db, 'users');
	const q = query(
		usersRef,
		orderBy('username'), 
		startAt(nameToSearch),
		endAt(nameToSearch + '\uf8ff')
	);

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
