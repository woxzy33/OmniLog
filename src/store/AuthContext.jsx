import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { loadUserProfile, deleteUserDataAndProfile } from './Database';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('omnilog_dev_auth') === 'true') {
      setCurrentUser({ uid: 'dev-athlete-1', email: 'athlete@omnilog.dev' });
      setUserProfile({
        name: 'Marcus Vance',
        weight: 80,
        height: 180,
        gender: 'male',
        experienceLevel: 'intermediate',
        progressiveOverloadEnabled: true
      });
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profilePromise = loadUserProfile(user.uid);
          const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3000));
          const profile = await Promise.race([profilePromise, timeoutPromise]);
          setUserProfile(profile || {
            name: user.displayName || user.email?.split('@')[0] || 'Athlete',
            experienceLevel: 'intermediate',
            progressiveOverloadEnabled: true
          });
        } catch (e) {
          console.warn("Failed loading user profile:", e);
          setUserProfile({
            name: user.displayName || user.email?.split('@')[0] || 'Athlete',
            experienceLevel: 'intermediate',
            progressiveOverloadEnabled: true
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const continueAsGuest = () => {
    localStorage.setItem('omnilog_dev_auth', 'true');
    setCurrentUser({ uid: 'dev-athlete-1', email: 'athlete@omnilog.dev' });
    setUserProfile({
      name: 'Marcus Vance',
      weight: 80,
      height: 180,
      gender: 'male',
      experienceLevel: 'intermediate',
      progressiveOverloadEnabled: true
    });
    setLoading(false);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    localStorage.removeItem('omnilog_dev_auth');
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    setUserProfile(null);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error("No active athlete account found.");
    }
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  };

  const deleteAccount = async (password) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error("No active athlete account found.");
    }
    const uid = auth.currentUser.uid;
    // 1. Re-authenticate to verify identity
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);

    // 2. Erase Firestore user documents
    await deleteUserDataAndProfile(uid);

    // 3. Delete user in Firebase Auth
    await deleteUser(auth.currentUser);

    // 4. Clear local cache
    try {
      localStorage.clear();
    } catch (e) {}
  };

  const value = {
    currentUser,
    userProfile,
    setUserProfile,
    login,
    register,
    logout,
    continueAsGuest,
    resetPassword,
    changePassword,
    deleteAccount,
    authLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
