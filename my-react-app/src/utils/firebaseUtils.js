import { db } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore/lite';

export const addNewExpense= async ({ uidUser, name, price }) => {
  const docRef = await addDoc(collection(db, 'expense'), {
    uidUser,
    name,
    price
  });
  console.log('Document written with ID: ', docRef.id);
};