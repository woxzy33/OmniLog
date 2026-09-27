import { create } from 'zustand';
import { Storage } from '../data/storage';
import { DEFAULT_EXERCISES, exerciseRequiresWeight } from '../data/exerciseDb';
import { Preferences } from '@capacitor/preferences';
import { ensureSessionPRs } from '../utils';

const emptyData = () => ({
  exercises: [...DEFAULT_EXERCISES],
  customCardioActivities: [],
  templates: [],
  sessions: [],
  measurements: [],
  plannedSessions: [],
  activeInterventions: {},
  user: { 
    name: "Iron Lifter",
    locations: [{ id: "loc-default", name: "Default Gym" }],
    activeLocationId: "loc-default"
  },
  settings: { 
    unit: "kg", 
    notificationsEnabled: true, 
    reminderHour: 19,
    progressiveOverloadEnabled: true,
    experienceLevel: "intermediate",
    customPlateauThreshold: null
  }
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
    customCardioActivities: raw.customCardioActivities || [],
    activeInterventions: (raw.activeInterventions && typeof raw.activeInterventions === 'object') ? raw.activeInterventions : {},
    settings: { 
      unit: "kg", 
      notificationsEnabled: true, 
      reminderHour: 19, 
      progressiveOverloadEnabled: true,
      experienceLevel: "intermediate",
      customPlateauThreshold: raw.settings?.customPlateauThreshold !== undefined ? raw.settings.customPlateauThreshold : null,
      ...(raw.settings || {}) 
    },
    measurements,
    sessions,
    templates: raw.templates || [],
    plannedSessions: raw.plannedSessions || [],
    user: raw.user || { name: "Iron Lifter", locations: [{ id: "loc-default", name: "Default Gym" }], activeLocationId: "loc-default" }
  };
}

export function mergeAppData(local, remote) {
  if (!local && !remote) return emptyData();
  if (!local) return sanitizeAppData(remote);
  if (!remote) return sanitizeAppData(local);

  // 1. Merge sessions by id - local sessions are NEVER discarded
  const sessionMap = new Map();
  (remote.sessions || []).forEach(s => {
    if (s && s.id) sessionMap.set(s.id, s);
  });
  (local.sessions || []).forEach(s => {
    if (s && s.id) {
      if (!sessionMap.has(s.id)) {
        sessionMap.set(s.id, s);
      } else {
        const rem = sessionMap.get(s.id);
        const localSets = (s.exercises || []).reduce((acc, e) => acc + (e.sets || []).length, 0);
        const remSets = (rem.exercises || []).reduce((acc, e) => acc + (e.sets || []).length, 0);
        const localCardio = (s.cardioActivities || []).length;
        const remCardio = (rem.cardioActivities || []).length;
        const localScore = localSets + localCardio;
        const remScore = remSets + remCardio;
        if (localScore >= remScore) {
          sessionMap.set(s.id, { ...rem, ...s, cardioActivities: s.cardioActivities || rem.cardioActivities || [] });
        } else {
          sessionMap.set(s.id, { ...s, ...rem, cardioActivities: rem.cardioActivities || s.cardioActivities || [] });
        }
      }
    }
  });
  const mergedSessions = Array.from(sessionMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

  // 2. Merge templates by id
  const templateMap = new Map();
  (remote.templates || []).forEach(t => {
    if (t && t.id) templateMap.set(t.id, t);
  });
  (local.templates || []).forEach(t => {
    if (t && t.id) {
      templateMap.set(t.id, { ...(templateMap.get(t.id) || {}), ...t });
    }
  });

  // 3. Merge measurements by id or date
  const measureMap = new Map();
  (remote.measurements || []).forEach(m => {
    const k = m.id || m.date;
    if (k) measureMap.set(k, m);
  });
  (local.measurements || []).forEach(m => {
    const k = m.id || m.date;
    if (k) measureMap.set(k, { ...(measureMap.get(k) || {}), ...m });
  });
  const mergedMeasurements = Array.from(measureMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

  // 4. Merge plannedSessions
  const planMap = new Map();
  (remote.plannedSessions || []).forEach(p => { if (p && p.id) planMap.set(p.id, p); });
  (local.plannedSessions || []).forEach(p => { if (p && p.id) planMap.set(p.id, p); });

  // 5. Merge custom exercises
  const defaultExIds = new Set(DEFAULT_EXERCISES.map(e => e.id));
  const customExMap = new Map();
  (remote.exercises || []).filter(e => !defaultExIds.has(e.id)).forEach(e => customExMap.set(e.id, e));
  (local.exercises || []).filter(e => !defaultExIds.has(e.id)).forEach(e => customExMap.set(e.id, e));

  // 6. Merge custom cardio activities
  const customCardioMap = new Map();
  (remote.customCardioActivities || []).forEach(c => { if (c && c.id) customCardioMap.set(c.id, c); });
  (local.customCardioActivities || []).forEach(c => { if (c && c.id) customCardioMap.set(c.id, c); });

  return sanitizeAppData({
    ...remote,
    user: { ...(remote.user || {}), ...(local.user || {}) },
    settings: { ...(remote.settings || {}), ...(local.settings || {}) },
    sessions: mergedSessions,
    templates: Array.from(templateMap.values()),
    measurements: mergedMeasurements,
    plannedSessions: Array.from(planMap.values()),
    exercises: [...DEFAULT_EXERCISES, ...Array.from(customExMap.values())],
    customCardioActivities: Array.from(customCardioMap.values()),
    activeInterventions: { ...(remote.activeInterventions || {}), ...(local.activeInterventions || {}) }
  });
}

export const useAppStore = create((set, get) => ({
  isLoaded: false,
  data: emptyData(),
  userId: null,
  unsubscribeFn: null,

  setActiveIntervention: (exerciseId, intervention) => {
    if (!exerciseId) return;
    get().persist(prev => ({
      ...prev,
      activeInterventions: {
        ...(prev.activeInterventions || {}),
        [exerciseId]: intervention
      }
    }));
  },

  removeActiveIntervention: (exerciseId) => {
    if (!exerciseId) return;
    get().persist(prev => {
      const copy = { ...(prev.activeInterventions || {}) };
      delete copy[exerciseId];
      return {
        ...prev,
        activeInterventions: copy
      };
    });
  },

  initCloudSync: async (uid) => {
    if (!uid) return;
    if (get().userId === uid && get().unsubscribeFn) return;
    
    if (get().unsubscribeFn) {
      get().unsubscribeFn();
    }

    set({ userId: uid });

    // 1. Instant Local-First Load: Read from persistent IndexedDB cache immediately
    let localData = null;
    try {
      const cached = await Storage.get(`omnilog_data_${uid}`);
      if (cached && get().userId === uid) {
        localData = sanitizeAppData(cached);
        set({ data: localData, isLoaded: true });
      }
    } catch (e) {
      console.warn("Local storage cache read error:", e);
    }

    // Restore in-progress active workout if user quit app while working out
    useWorkoutStore.getState().restoreActiveSession(uid);

    // 2. Realtime Cloud Sync via Firestore with Smart Local Merge
    const unsubscribe = subscribeToAppData(uid, (parsed) => {
      if (get().userId !== uid) return;

      if (parsed) {
        const localBeforeSync = get().data;
        const merged = mergeAppData(localBeforeSync, parsed);
        Storage.set(`omnilog_data_${uid}`, merged).catch(console.warn);
        set({ data: merged, isLoaded: true });

        // If local had sessions that were missing on cloud (e.g. quit before cloud sync finished), push merged back to cloud
        const localCount = (localBeforeSync?.sessions || []).length;
        const cloudCount = (parsed?.sessions || []).length;
        if (localCount > cloudCount) {
          saveAppData(uid, merged, true);
        }
      } else {
        // Document does not exist yet on Firestore (new user or fresh account)
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
    useWorkoutStore.getState().setActiveSession(null);
    set({ userId: null, isLoaded: false, data: emptyData(), unsubscribeFn: null });
  },

  persist: async (newDataOrUpdater, immediate = false) => {
    const prev = get().data;
    const computed = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(prev) : newDataOrUpdater;
    const sanitized = sanitizeAppData(computed);
    set({ data: sanitized });

    const uid = get().userId;
    if (uid) {
      await Storage.set(`omnilog_data_${uid}`, sanitized).catch(console.warn);
      await saveAppData(uid, sanitized, immediate);
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
  },

  wipeAllData: async () => {
    const clean = emptyData();
    set({ data: clean });

    // Clear active workout session & active floating timer
    useWorkoutStore.getState().setActiveSession(null);
    useWorkoutStore.getState().clearTimer();

    const uid = get().userId;
    if (uid) {
      await Storage.set(`omnilog_data_${uid}`, clean).catch(console.warn);
      await Storage.remove(`omnilog_active_session_${uid}`).catch(console.warn);
      await saveAppData(uid, clean, true, true);
    }
    await Storage.remove('omnilog_active_session').catch(console.warn);
  }
}));

export const useWorkoutStore = create((set, get) => ({
  activeSession: null,
  summarySession: null,
  activeTimer: null,
  isSessionMinimized: false,
  hasRestoredSession: false,

  restoreActiveSession: async (uid) => {
    try {
      const key = uid ? `omnilog_active_session_${uid}` : 'omnilog_active_session';
      const stored = await Storage.get(key);
      if (stored && (stored.exercises?.length > 0 || stored.startTime || stored.date)) {
        const startTime = stored.startTime ? Number(stored.startTime) : (stored.date ? new Date(stored.date).getTime() : Date.now());
        const date = stored.date || new Date(startTime).toISOString();
        const validSession = { ...stored, startTime, date };
        set({ activeSession: validSession, isSessionMinimized: true, hasRestoredSession: true });
      }
    } catch (e) {
      console.warn("Failed to restore active session:", e);
    }
  },

  setActiveSession: (val) => {
    const prevSession = get().activeSession;
    const nextSession = typeof val === 'function' ? val(prevSession) : val;
    set({ 
      activeSession: nextSession,
      ...(nextSession ? {} : { activeTimer: null, isSessionMinimized: false })
    });

    const uid = useAppStore.getState().userId;
    const key = uid ? `omnilog_active_session_${uid}` : 'omnilog_active_session';
    if (nextSession) {
      Storage.set(key, nextSession).catch(console.warn);
    } else {
      Storage.remove(key).catch(console.warn);
      Storage.remove('omnilog_active_session').catch(console.warn);
    }
  },

  setSummarySession: (session) => set({ summarySession: session }),
  setIsSessionMinimized: (val) => set({ isSessionMinimized: val }),
  
  startTimer: (sec) => set({ activeTimer: { endTime: Date.now() + sec * 1000 } }),
  clearTimer: () => set({ activeTimer: null }),
}));
