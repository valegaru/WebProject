import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
//  apiKey: 'AIzaSyA9EvmicJXAJpy6ylsg6d0IaD8R-zaPno0',
// authDomain:'webprogramfinal.firebaseapp.com',
// projectId:' webprogramfinal',
// storageBucket:' webprogramfinal.firebasestorage.app',
// messagingSenderId:' 562432451959',
//  appId:'1:562432451959:web:a7e2082461ffc4672ded72',
// VITE_GOOGLE_MAPS_API_KEY = AIzaSyA8wjtD6c_eD23lNn-LbSha3yInVeThWbI,

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

