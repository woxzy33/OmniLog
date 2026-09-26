import { create } from 'zustand';
import { Storage } from '../data/storage';
import { DEFAULT_EXERCISES, exerciseRequiresWeight } from '../data/exerciseDb';
import { Preferences } from '@capacitor/preferences';
import { ensureSessionPRs } from '../utils';

const emptyData = () => ({
  exercises: [...DEFAULT_EXERCISES],
  templates: [],
  sessions: [],
  measurements: [],
  plannedSessions: [],
  user: { 
    name: "Iron Lifter",
    locations: [{ id: "loc-default", name: "Default Gym" }],
    activeLocationId: "loc-default"
  },
  settings: { unit: "kg", notificationsEnabled: true, reminderHour: 19 }
});

import { saveAppData, subscribeToAppData, flushSaveAppData } from './Database';

function sanitizeAppData(raw) {
  if (!raw) return emptyData();
  const defaultMap = new Map(DEFAULT_EXERCISES.map(e => [e.name, e]));
  const mergedExercises = (raw.exercises || []).map(ex => {
    if (defaultMap.has(ex.name)) {
      const defEx = defaultMap.get(ex.name);
      const merged = { ...defEx, ...ex };
      if (defEx.bodyPart !== undefined) merged.bodyPart = defEx.bodyPart;
      merged.requiresWeight = defEx.requiresWeight;
      return merged;
    }
    return {
      ...ex,
      requiresWeight: exerciseRequiresWeight(ex)
    };
  });

  const measurements = Array.isArray(raw.measurements) ? raw.measurements : [];
  const sessions = ensureSessionPRs(raw.sessions || [], mergedExercises, measurements);

  return {
    ...raw,
    exercises: mergedExercises,
    settings: { unit: "kg", notificationsEnabled: true, reminderHour: 19, ...(raw.settings || {}) },
    measurements,
    sessions,
    templates: raw.templates || [],
    plannedSessions: raw.plannedSessions || [],
    user: raw.user || { name: "Iron Lifter", locations: [{ id: "loc-default", name: "Default Gym" }], activeLocationId: "loc-default" }
  };
}

export const useAppStore = create((set, get) => ({
  isLoaded: false,
  data: emptyData(),
  userId: null,
  unsubscribeFn: null,

  initCloudSync: async (uid) => {
    if (!uid) return;
    // If already actively syncing this user, do nothing
    if (get().userId === uid && get().unsubscribeFn) return;
    
    // Clear previous subscription if switching users
    if (get().unsubscribeFn) {
      get().unsubscribeFn();
    }

    set({ userId: uid });

    // 1. Instant Local-First Load: Read from persistent IndexedDB cache immediately
    try {
      const cached = await Storage.get(`omnilog_data_${uid}`);
      if (cached && get().userId === uid && !get().isLoaded) {
        set({ data: sanitizeAppData(cached), isLoaded: true });
      }
    } catch (e) {
      console.warn("Local storage cache read error:", e);
    }

    // 2. Realtime Cloud Sync via Firestore
    const unsubscribe = subscribeToAppData(uid, (parsed) => {
      if (get().userId !== uid) return;

      if (parsed) {
        const sanitized = sanitizeAppData(parsed);
        Storage.set(`omnilog_data_${uid}`, sanitized).catch(console.warn);
        set({ data: sanitized, isLoaded: true });
      } else {
        // Document does not exist yet on Firestore (new user or fresh account)
        // Preserve any current local data (such as baseline measurements logged during onboarding)
        const currentData = sanitizeAppData(get().data);
        saveAppData(uid, currentData, true);
        Storage.set(`omnilog_data_${uid}`, currentData).catch(console.warn);
        set({ data: currentData, isLoaded: true });
      }
    });

    set({ unsubscribeFn: unsubscribe });
  },

  resetStore: () => {
    if (get().unsubscribeFn) {
      get().unsubscribeFn();
    }
    set({ userId: null, isLoaded: false, data: emptyData(), unsubscribeFn: null });
  },

  persist: (newDataOrUpdater, immediate = false) => {
    const prev = get().data;
    const computed = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(prev) : newDataOrUpdater;
    const sanitized = sanitizeAppData(computed);
    set({ data: sanitized });

    const uid = get().userId;
    if (uid) {
      Storage.set(`omnilog_data_${uid}`, sanitized).catch(console.warn);
      saveAppData(uid, sanitized, immediate);
    }
  },

  importData: async (importedData) => {
    const sanitizedData = sanitizeAppData(importedData);
    set({ data: sanitizedData });

    const uid = get().userId;
    if (uid) {
      await Storage.set(`omnilog_data_${uid}`, sanitizedData).catch(console.warn);
      await saveAppData(uid, sanitizedData, true);
    }
  }
}));

export const useWorkoutStore = create((set, get) => ({
  activeSession: null,
  summarySession: null,
  activeTimer: null,
  isSessionMinimized: false,

  setActiveSession: (val) => set(state => ({ 
    activeSession: typeof val === 'function' ? val(state.activeSession) : val 
  })),
  setSummarySession: (session) => set({ summarySession: session }),
  setIsSessionMinimized: (val) => set({ isSessionMinimized: val }),
  
  startTimer: (sec) => set({ activeTimer: { endTime: Date.now() + sec * 1000 } }),
  clearTimer: () => set({ activeTimer: null }),
}));
