import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9EvmicJXAJpy6ylsg6d0IaD8R-zaPno0",
  authDomain: "webprogramfinal.firebaseapp.com",
  projectId: "webprogramfinal",
  storageBucket: "webprogramfinal.firebasestorage.app",
  messagingSenderId: "562432451959",
  appId: "1:562432451959:web:a7e2082461ffc4672ded72",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
  }
});