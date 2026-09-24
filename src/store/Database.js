import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export async function loadUserProfile(userId) {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function saveUserProfile(userId, profileData) {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, profileData, { merge: true });
}

export function subscribeToAppData(userId, callback) {
  const docRef = doc(db, 'user_data', userId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
}

export async function saveAppData(userId, data) {
  const docRef = doc(db, 'user_data', userId);
  await setDoc(docRef, data, { merge: true }).catch(err => {
    console.error("FIRESTORE SAVE ERROR:", err);
  });
}
