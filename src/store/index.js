import { create } from 'zustand';
import { Storage } from '../data/storage';
import { DEFAULT_EXERCISES } from '../data/exerciseDb';
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
  settings: { unit: "kg" }
});

import { saveAppData, subscribeToAppData } from './Database';

export const useAppStore = create((set, get) => ({
  isLoaded: false,
  data: emptyData(),
  userId: null,
  unsubscribeFn: null,

  initCloudSync: (uid) => {
    // If already syncing this user, do nothing
    if (get().userId === uid) return;
    
    // Clear previous subscription if switching users
    if (get().unsubscribeFn) {
      get().unsubscribeFn();
    }

    set({ userId: uid, isLoaded: false });

    const unsubscribe = subscribeToAppData(uid, (parsed) => {
      if (parsed) {
        const defaultMap = new Map(DEFAULT_EXERCISES.map(e => [e.name, e]));
        const mergedExercises = (parsed.exercises || []).map(ex => {
          if (defaultMap.has(ex.name)) {
            const defEx = defaultMap.get(ex.name);
            const merged = { ...defEx, ...ex };
            if (defEx.bodyPart !== undefined) merged.bodyPart = defEx.bodyPart;
            return merged;
          }
          return ex;
        });
        parsed.exercises = mergedExercises;
        parsed.settings = parsed.settings || { unit: "kg" };
        parsed.sessions = ensureSessionPRs(parsed.sessions || []);
        parsed.templates = parsed.templates || [];
        parsed.measurements = parsed.measurements || [];
        parsed.plannedSessions = parsed.plannedSessions || [];
        parsed.user = parsed.user || { name: "Iron Lifter", locations: [{ id: "loc-default", name: "Default Gym" }], activeLocationId: "loc-default" };
        set({ data: parsed, isLoaded: true });
      } else {
        set({ data: emptyData(), isLoaded: true });
      }
    });

    set({ unsubscribeFn: unsubscribe });
  },

  persist: (newDataOrUpdater) => {
    const newData = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(get().data) : newDataOrUpdater;
    set({ data: newData });
    const uid = get().userId;
    if (uid) {
      saveAppData(uid, newData);
    }
  },

  importData: async (importedData) => {
    const defaultMap = new Map(DEFAULT_EXERCISES.map(e => [e.name, e]));
    const mergedExercises = (importedData.exercises || []).map(ex => {
      if (defaultMap.has(ex.name)) {
        const defEx = defaultMap.get(ex.name);
        const merged = { ...defEx, ...ex };
        if (defEx.bodyPart !== undefined) merged.bodyPart = defEx.bodyPart;
        return merged;
      }
      return ex;
    });
    
    const sanitizedData = {
      ...importedData,
      exercises: mergedExercises,
      settings: importedData.settings || { unit: "kg" },
      sessions: ensureSessionPRs(importedData.sessions || []),
      templates: importedData.templates || [],
      measurements: importedData.measurements || [],
      plannedSessions: importedData.plannedSessions || [],
      user: importedData.user || { name: "Iron Lifter", locations: [{ id: "loc-default", name: "Default Gym" }], activeLocationId: "loc-default" }
    };
    
    set({ data: sanitizedData });
    const uid = get().userId;
    if (uid) {
      await saveAppData(uid, sanitizedData);
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
