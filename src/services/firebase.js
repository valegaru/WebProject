import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';


const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
	if (user) {
		const uid = user.uid;
		console.log(uid);
	} else {
		// User is signed out
		// ...
	}
});

export const logoutFirebaseUser = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log('Firebase user signed out.');
  } catch (error) {
    console.error('Firebase sign out error:', error);
    throw error;
  }
};


