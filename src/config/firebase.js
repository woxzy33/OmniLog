import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmQm2bfqQTTdRWvo73Ee8g0C0OTBMs7zw",
  authDomain: "gym-tracker-2f34a.firebaseapp.com",
  projectId: "gym-tracker-2f34a",
  storageBucket: "gym-tracker-2f34a.firebasestorage.app",
  messagingSenderId: "308112825467",
  appId: "1:308112825467:web:8356a24c5ece8c913816de",
  measurementId: "G-QXECLSE46R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with robust multi-tab and offline IndexedDB persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Configure persistent auth across sessions
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.warn("Auth persistence notice:", err);
});

export { auth, db };
