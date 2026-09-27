import { useAppStore, useWorkoutStore } from '../store';

export const TEST_EXERCISE_ID = 'Barbell_Bench_Press_-_Medium_Grip';
export const TEST_EXERCISE_NAME = 'Barbell Bench Press - Medium Grip';

/**
 * Injects 4 consecutive stagnant sessions for Barbell Bench Press (80kg x 8 reps)
 * and starts an active workout session with this exercise.
 */
export function loadPlateauTestScenario() {
  const appStore = useAppStore.getState();
  const workoutStore = useWorkoutStore.getState();

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  // 4 past sessions at 80kg x 8 reps
  const testSessions = [
    {
      id: 'test-sess-1',
      isTestSession: true,
      date: new Date(now - 12 * DAY_MS).toISOString(),
      name: 'Push Day 1',
      locationId: 'loc-default',
      exercises: [{
        id: 'test-ex-1',
        exerciseId: TEST_EXERCISE_ID,
        name: TEST_EXERCISE_NAME,
        sets: [
          { completed: true, weight: 80, reps: 8, rpe: 8.5, type: 'N' },
          { completed: true, weight: 80, reps: 8, rpe: 9.0, type: 'N' }
        ]
      }]
    },
    {
      id: 'test-sess-2',
      isTestSession: true,
      date: new Date(now - 9 * DAY_MS).toISOString(),
      name: 'Push Day 2',
      locationId: 'loc-default',
      exercises: [{
        id: 'test-ex-2',
        exerciseId: TEST_EXERCISE_ID,
        name: TEST_EXERCISE_NAME,
        sets: [
          { completed: true, weight: 80, reps: 8, rpe: 9.0, type: 'N' },
          { completed: true, weight: 80, reps: 8, rpe: 9.5, type: 'N' }
        ]
      }]
    },
    {
      id: 'test-sess-3',
      isTestSession: true,
      date: new Date(now - 6 * DAY_MS).toISOString(),
      name: 'Push Day 3',
      locationId: 'loc-default',
      exercises: [{
        id: 'test-ex-3',
        exerciseId: TEST_EXERCISE_ID,
        name: TEST_EXERCISE_NAME,
        sets: [
          { completed: true, weight: 80, reps: 8, rpe: 9.5, type: 'N' },
          { completed: true, weight: 80, reps: 8, rpe: 9.5, type: 'N' }
        ]
      }]
    },
    {
      id: 'test-sess-4',
      isTestSession: true,
      date: new Date(now - 3 * DAY_MS).toISOString(),
      name: 'Push Day 4',
      locationId: 'loc-default',
      exercises: [{
        id: 'test-ex-4',
        exerciseId: TEST_EXERCISE_ID,
        name: TEST_EXERCISE_NAME,
        sets: [
          { completed: true, weight: 80, reps: 8, rpe: 9.5, type: 'N' },
          { completed: true, weight: 80, reps: 8, rpe: 10.0, type: 'N' }
        ]
      }]
    }
  ];

  // Filter out any previous test sessions so we don't duplicate
  const cleanExisting = (appStore.data.sessions || []).filter(s => !s.isTestSession && !s.id?.startsWith('test-sess-'));
  const updatedSessions = [...cleanExisting, ...testSessions];

  // Clean activeInterventions for the test exercise so user can pick from scratch
  const updatedInterventions = { ...(appStore.data.activeInterventions || {}) };
  delete updatedInterventions[TEST_EXERCISE_ID];

  // Persist updated app data
  appStore.persist({
    ...appStore.data,
    sessions: updatedSessions,
    activeInterventions: updatedInterventions,
    settings: {
      ...appStore.data.settings,
      progressiveOverloadEnabled: true,
      experienceLevel: appStore.data.settings.experienceLevel || 'intermediate'
    }
  });

  // Launch live active workout session with Barbell Bench Press (3 sets)
  workoutStore.setActiveSession({
    id: 'test-active-session',
    name: 'Plateau Test Session',
    date: new Date().toISOString(),
    startTime: Date.now(),
    isTestSession: true,
    exercises: [
      {
        id: 'active-bench',
        exerciseId: TEST_EXERCISE_ID,
        idx: 0,
        notes: 'Test scenario: 4 consecutive sessions stagnant at 80kg x 8 reps.',
        sets: [
          { weight: '', reps: '', rpe: '', completed: false, type: 'N' },
          { weight: '', reps: '', rpe: '', completed: false, type: 'N' },
          { weight: '', reps: '', rpe: '', completed: false, type: 'N' }
        ]
      }
    ]
  });

  workoutStore.setIsSessionMinimized(false);
}

/**
 * Fast forwards the intervention to 8 days ago (simulating 7-day expiration).
 */
export function fastForwardDeloadTest() {
  const appStore = useAppStore.getState();
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();

  appStore.setActiveIntervention(TEST_EXERCISE_ID, {
    id: 'deload',
    title: 'Implement a Strategic Deload',
    activatedAt: eightDaysAgo,
    durationDays: 7,
    baselineWeight: 80,
    baselineReps: 8
  });
}

/**
 * Removes test sessions and active test intervention.
 */
export function clearPlateauTestScenario() {
  const appStore = useAppStore.getState();
  const workoutStore = useWorkoutStore.getState();

  const cleanedSessions = (appStore.data.sessions || []).filter(s => !s.isTestSession && !s.id?.startsWith('test-sess-'));

  const cleanedInterventions = { ...(appStore.data.activeInterventions || {}) };
  delete cleanedInterventions[TEST_EXERCISE_ID];

  appStore.persist({
    ...appStore.data,
    sessions: cleanedSessions,
    activeInterventions: cleanedInterventions
  });

  if (workoutStore.activeSession?.isTestSession || workoutStore.activeSession?.id === 'test-active-session') {
    workoutStore.setActiveSession(null);
  }
}

/**
 * Check if the test scenario is currently active.
 */
export function isTestScenarioLoaded(data) {
  if (!data || !Array.isArray(data.sessions)) return false;
  return data.sessions.some(s => s && (s.isTestSession || s.id?.startsWith('test-sess-')));
}
