export function getLastSessionSets(data, exerciseId, excludeSessionId, locationId = 'loc-default') {
  const past = (data.sessions || [])
    .filter((s) => s.id !== excludeSessionId)
    .filter((s) => (s.locationId || 'loc-default') === locationId)
    .filter((s) => (s.exercises || []).some((e) => e.exerciseId === exerciseId));
  return past.length > 0 ? (past[past.length - 1].exercises || []).find((e) => e.exerciseId === exerciseId)?.sets : null;
}

export function parseVolume(weight, reps) {
  return (Number(weight) || 0) * (Number(reps) || 0);
}

export function formatWeight(kgValue, unit) {
  const kg = Number(kgValue) || 0;
  if (!kg) return "0";
  const val = unit === 'lbs' ? kg * 2.20462 : kg;
  return Number(Math.round(val * 1000) / 1000).toString();
}

export function parseDisplayWeight(displayValue, unit) {
  const val = Number(displayValue);
  if (!val) return "";
  if (unit === 'lbs') return (val / 2.20462).toFixed(2).replace(/\.00$/, '');
  return val.toString();
}

export function translateExerciseName(name, t) {
  if (!name) return '';
  let res = name;
  res = res.replace(/Barbell/gi, t('workout.barbell', 'Barbell'));
  res = res.replace(/Dumbbell/gi, t('workout.dumbbell', 'Dumbbell'));
  return res;
}

export function calculate1RM(weight, reps) {
  const w = Number(weight);
  const r = Number(reps);
  if (!w || !r || r < 1) return 0;
  if (r === 1) return Math.round(w);
  return Math.round(w * (1 + r / 30));
}

export function validateExerciseSet(weight, reps, category, equipment, unit) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  
  if (r <= 0) return "Reps must be greater than 0.";
  if (r > 100) return "Reps cannot exceed 100.";
  if (w <= 0) return "Weight must be greater than 0.";
  
  const wKg = unit === 'lbs' ? w * 0.453592 : w;
  
  let maxKg = 600;
  
  if (equipment === 'Cable') {
    maxKg = 200;
  } else if (equipment === 'Dumbbell') {
    maxKg = 150;
  } else if (equipment === 'Machine') {
    if (category === 'Legs') maxKg = 800;
    else maxKg = 300;
  } else {
    if (['Shoulders'].includes(category)) maxKg = 300;
    else if (['Arms', 'Core', 'Cardio'].includes(category)) maxKg = 200;
    else maxKg = 600;
  }
  
  if (wKg > maxKg) {
    const maxVal = unit === 'lbs' ? Math.round(maxKg * 2.20462) : maxKg;
    return `Weight is too high for this exercise. Maximum realistic weight is ${maxVal} ${unit}.`;
  }
  
  return null; // valid
}

export function validateMeasurement(type, value, unit, isImperial = false) {
  const v = Number(value) || 0;
  if (v <= 0) return "Value must be greater than 0.";
  
  const vMetric = type === 'Weight' 
    ? (isImperial ? v * 0.453592 : v) 
    : (isImperial ? v * 2.54 : v);
    
  let minMetric = 10, maxMetric = 200;
  
  switch(type) {
    case 'weight': minMetric = 20; maxMetric = 300; break;
    case 'height': minMetric = 50; maxMetric = 250; break;
    case 'bodyFat': minMetric = 2; maxMetric = 60; break; // percentage is same
    case 'neck': minMetric = 20; maxMetric = 65; break;
    case 'shoulders':
    case 'chest': minMetric = 50; maxMetric = 170; break;
    case 'leftArm':
    case 'rightArm': minMetric = 15; maxMetric = 65; break;
    case 'waist': minMetric = 40; maxMetric = 160; break;
    case 'leftThigh':
    case 'rightThigh': minMetric = 30; maxMetric = 100; break;
    case 'calves': minMetric = 20; maxMetric = 65; break;
  }
  
  if (type === 'bodyFat') {
    if (v < minMetric || v > maxMetric) return `Body Fat must be between ${minMetric}% and ${maxMetric}%.`;
    return null;
  }
  
  if (vMetric < minMetric || vMetric > maxMetric) {
    const minVal = type === 'weight' 
      ? (isImperial ? Math.round(minMetric * 2.20462) : minMetric)
      : (isImperial ? Math.round(minMetric / 2.54) : minMetric);
    const maxVal = type === 'weight' 
      ? (isImperial ? Math.round(maxMetric * 2.20462) : maxMetric)
      : (isImperial ? Math.round(maxMetric / 2.54) : maxMetric);
      
    const displayUnit = type === 'weight' ? (isImperial ? 'lbs' : 'kg') : (isImperial ? 'in' : 'cm');
    return `This measurement must be between ${minVal} and ${maxVal} ${displayUnit}.`;
  }
  
  return null;
}

/**
 * Evaluates whether a set is a Personal Record against historical sets.
 * @param {Array} historySets - array of prior completed sets for this exercise
 * @param {Object} currentSet - the current completed set { weight, reps }
 * @returns {Object|null} - PR object { isPR: true, type: '1rm' | 'volume' | 'weight', achieved, oldRecord, increase } or null
 */
export function evaluatePR(historySets, currentSet) {
  const currentWeight = Number(currentSet.weight) || 0;
  const currentReps = Number(currentSet.reps) || 0;
  if (currentWeight <= 0 || currentReps <= 0) return null;

  const current1RM = calculate1RM(currentWeight, currentReps);
  const currentVolume = Math.round(currentWeight * currentReps * 1000) / 1000;

  const validHistory = (historySets || []).filter(s => s && s.completed && (Number(s.weight) > 0 || Number(s.reps) > 0));

  if (validHistory.length === 0) {
    // First time establishing a baseline for this exercise!
    return {
      isPR: true,
      type: '1rm',
      achieved: current1RM,
      oldRecord: 0,
      increase: current1RM,
      isBaseline: true
    };
  }

  const past1RMs = validHistory.map(s => calculate1RM(Number(s.weight), Number(s.reps)));
  const maxPast1RM = Math.max(...past1RMs);

  const pastVolumes = validHistory.map(s => Math.round((Number(s.weight) || 0) * (Number(s.reps) || 0) * 1000) / 1000);
  const maxPastVolume = Math.max(...pastVolumes);

  const pastWeights = validHistory.map(s => Number(s.weight) || 0);
  const maxPastWeight = Math.max(...pastWeights);

  if (current1RM > maxPast1RM) {
    return {
      isPR: true,
      type: '1rm',
      achieved: current1RM,
      oldRecord: maxPast1RM,
      increase: current1RM - maxPast1RM
    };
  }

  if (currentWeight > maxPastWeight) {
    return {
      isPR: true,
      type: 'weight',
      achieved: currentWeight,
      oldRecord: maxPastWeight,
      increase: currentWeight - maxPastWeight
    };
  }

  if (currentVolume > maxPastVolume) {
    return {
      isPR: true,
      type: 'volume',
      achieved: currentVolume,
      oldRecord: maxPastVolume,
      increase: currentVolume - maxPastVolume
    };
  }

  return null;
}

/**
 * Processes a list of sessions chronologically to ensure PRs are correctly computed
 * across the user's entire history.
 */
export function ensureSessionPRs(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return sessions;
  
  // Sort chronological
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Map of exerciseId -> Array of prior completed sets
  const exerciseHistory = new Map();

  const updatedSessions = sorted.map(sess => {
    let sessionHasChanges = false;
    const updatedExercises = (sess.exercises || []).map(ex => {
      const priorSets = exerciseHistory.get(ex.exerciseId) || [];
      const currentExercisePriorSets = [...priorSets];

      const updatedSets = (ex.sets || []).map(set => {
        if (!set.completed || Number(set.weight) <= 0 || Number(set.reps) <= 0) {
          return set;
        }

        const prResult = evaluatePR(currentExercisePriorSets, set);
        currentExercisePriorSets.push(set);

        if (prResult) {
          if (!set.isPR || typeof set.isPR !== 'object') {
            sessionHasChanges = true;
            return { ...set, isPR: prResult };
          }
        }
        return set;
      });

      exerciseHistory.set(ex.exerciseId, currentExercisePriorSets);
      return { ...ex, sets: updatedSets };
    });

    return sessionHasChanges ? { ...sess, exercises: updatedExercises } : sess;
  });

  return updatedSessions;
}

