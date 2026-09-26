import { db } from '../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export async function loadUserProfile(userId) {
  if (!userId) return null;
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function saveUserProfile(userId, profileData) {
  if (!userId) return;
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, profileData, { merge: true });
}

export function subscribeToAppData(userId, callback) {
  if (!userId) return () => {};
  const docRef = doc(db, 'user_data', userId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.warn("Firestore snapshot subscription error:", error);
  });
}

// Resilient Debounced Sync Queue
let saveTimeout = null;
let pendingData = null;
let pendingUid = null;
let isSaving = false;

export async function flushSaveAppData() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  if (!pendingUid || !pendingData) return;

  const uid = pendingUid;
  const data = pendingData;
  pendingUid = null;
  pendingData = null;

  try {
    isSaving = true;
    const docRef = doc(db, 'user_data', uid);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.error("FIRESTORE SAVE ERROR:", err);
    // If write fails, restore pending so next attempt retries
    if (!pendingData) {
      pendingUid = uid;
      pendingData = data;
    }
  } finally {
    isSaving = false;
  }
}

export function saveAppData(userId, data, immediate = false) {
  if (!userId || !data) return Promise.resolve();
  pendingUid = userId;
  pendingData = data;

  if (immediate) {
    return flushSaveAppData();
  }

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    flushSaveAppData();
  }, 400);

  return Promise.resolve();
}

// Mobile lifecycle safety: automatically flush when app is minimized, tab switched, or screen closed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    flushSaveAppData();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushSaveAppData();
    }
  });
}

export async function deleteUserDataAndProfile(userId) {
  if (!userId) return;
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
  pendingUid = null;
  pendingData = null;

  const userRef = doc(db, 'users', userId);
  const dataRef = doc(db, 'user_data', userId);
  await Promise.all([
    deleteDoc(userRef).catch(err => console.warn('Delete users doc warning:', err)),
    deleteDoc(dataRef).catch(err => console.warn('Delete user_data doc warning:', err))
  ]);
}

