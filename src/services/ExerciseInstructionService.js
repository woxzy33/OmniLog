import { EXERCISE_ALIAS_MAP } from '../data/exerciseAliasMap.js';
import { DEFAULT_EXERCISES } from '../data/exerciseDb.js';

let instructionsPromise = null;
let instructionsCache = null;

/**
 * Dynamically loads and caches the exercise instructions JSON dataset on demand.
 * This keeps the main application bundle ~1.3MB lighter by lazy-chunking via Vite.
 */
export async function getExerciseInstructions(exerciseId, exerciseName = null) {
  if (!exerciseId && !exerciseName) return null;

  // Resolve canonical ID if a legacy ID was passed
  let canonicalId = EXERCISE_ALIAS_MAP[exerciseId] || exerciseId;

  // If canonicalId doesn't look like a 4-digit ID or wasn't found, try matching by name
  if (!canonicalId && exerciseName) {
    const aliasByName = EXERCISE_ALIAS_MAP[exerciseName];
    if (aliasByName) {
      const match = DEFAULT_EXERCISES.find(e => e.name === aliasByName || e.id === aliasByName);
      if (match) canonicalId = match.id;
    }
  }

  try {
    if (!instructionsCache) {
      if (!instructionsPromise) {
        instructionsPromise = import('../data/exerciseInstructions.js').then(mod => mod.default || mod);
      }
      instructionsCache = await instructionsPromise;
    }

    if (instructionsCache && canonicalId && instructionsCache[canonicalId]) {
      return instructionsCache[canonicalId];
    }
  } catch (err) {
    console.warn('[ExerciseInstructionService] Failed to load instructions:', err);
  }

  return null;
}
