export function getLastSessionSets(data, exerciseId, excludeSessionId, locationId = 'loc-default') {
  const past = (data.sessions || [])
    .filter((s) => s.id !== excludeSessionId)
    .filter((s) => (s.locationId || 'loc-default') === locationId)
    .filter((s) => (s.exercises || []).some((e) => e.exerciseId === exerciseId));
  return past.length > 0 ? (past[past.length - 1].exercises || []).find((e) => e.exerciseId === exerciseId)?.sets : null;
}

export function getUserWeightAtDate(measurements = [], targetDate, fallback = 75) {
  if (!Array.isArray(measurements) || measurements.length === 0) return fallback;
  
  const targetTs = targetDate ? new Date(targetDate).getTime() : Date.now();
  
  const validWeights = measurements
    .filter(m => m && m.date && m.weight !== undefined && m.weight !== null && m.weight !== "")
    .map(m => ({
      weight: Number(m.weight),
      timestamp: new Date(m.date).getTime()
    }))
    .filter(m => !isNaN(m.weight) && m.weight > 0)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (validWeights.length === 0) return fallback;

  const prior = validWeights.filter(m => m.timestamp <= targetTs);
  if (prior.length > 0) {
    return prior[prior.length - 1].weight;
  }

  return validWeights[0].weight;
}

export function parseVolume(weight, reps, bodyweight = 0) {
  const w = (Number(weight) || 0) + (Number(bodyweight) || 0);
  return w * (Number(reps) || 0);
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

export function validateExerciseSet(weight, reps, category, equipment, unit, requiresWeight = true) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  
  if (r <= 0) return "Reps must be greater than 0.";
  if (r > 100) return "Reps cannot exceed 100.";

  if (requiresWeight) {
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
  }
  
  return null; // valid
}

export function validateMeasurement(type, value, unit, isImperial = false) {
  const v = Number(value) || 0;
  if (v <= 0) return "Value must be greater than 0.";
  
  const typeLower = (type || '').toLowerCase();
  const isWeight = typeLower === 'weight';
  
  const vMetric = isWeight 
    ? (isImperial ? v * 0.45359237 : v) 
    : (isImperial ? v * 2.54 : v);
    
  let minMetric = 10, maxMetric = 200;
  
  switch(typeLower) {
    case 'weight': minMetric = 20; maxMetric = 350; break;
    case 'height': minMetric = 50; maxMetric = 260; break;
    case 'bodyfat': minMetric = 2; maxMetric = 60; break; // percentage is same
    case 'neck': minMetric = 20; maxMetric = 75; break;
    case 'shoulders':
    case 'chest': minMetric = 40; maxMetric = 190; break;
    case 'leftarm':
    case 'rightarm': minMetric = 15; maxMetric = 75; break;
    case 'waist': minMetric = 35; maxMetric = 180; break;
    case 'leftthigh':
    case 'rightthigh': minMetric = 25; maxMetric = 110; break;
    case 'calves': minMetric = 18; maxMetric = 75; break;
  }
  
  if (typeLower === 'bodyfat') {
    if (v < minMetric || v > maxMetric) return `Body Fat must be between ${minMetric}% and ${maxMetric}%.`;
    return null;
  }
  
  if (vMetric < minMetric || vMetric > maxMetric) {
    const minVal = isWeight 
      ? (isImperial ? Math.round(minMetric * 2.20462) : minMetric)
      : (isImperial ? Math.round(minMetric / 2.54) : minMetric);
    const maxVal = isWeight 
      ? (isImperial ? Math.round(maxMetric * 2.20462) : maxMetric)
      : (isImperial ? Math.round(maxMetric / 2.54) : maxMetric);
      
    const displayUnit = isWeight ? (isImperial ? 'lbs' : 'kg') : (isImperial ? 'in' : 'cm');
    return `This measurement must be between ${minVal} and ${maxVal} ${displayUnit}.`;
  }
  
  return null;
}

/**
 * Evaluates whether a set is a Personal Record against historical sets.
 * @param {Array} historySets - array of prior completed sets for this exercise
 * @param {Object} currentSet - the current completed set { weight, reps }
 * @param {Boolean} requiresWeight - whether the exercise requires external weight
 * @returns {Object|null} - PR object { isPR: true, type: '1rm' | 'volume' | 'weight' | 'reps', achieved, oldRecord, increase } or null
 */
export function evaluatePR(historySets, currentSet, requiresWeight = true, currentBodyweight = 75) {
  const currentWeight = Number(currentSet.weight) || 0;
  const currentReps = Number(currentSet.reps) || 0;
  if (currentReps <= 0) return null;
  if (requiresWeight && currentWeight <= 0) return null;

  if (!requiresWeight) {
    const validHistory = (historySets || []).filter(s => s && s.completed && Number(s.reps) > 0);
    const effCurrentWeight = (Number(currentSet.weight) || 0) + currentBodyweight;
    const currentVolume = Math.round(effCurrentWeight * currentReps * 1000) / 1000;

    if (validHistory.length === 0) {
      return {
        isPR: true,
        type: 'reps',
        achieved: currentReps,
        oldRecord: 0,
        increase: currentReps,
        volume: currentVolume,
        isBaseline: true
      };
    }

    const pastReps = validHistory.map(s => Number(s.reps) || 0);
    const maxPastReps = Math.max(...pastReps);

    const pastVolumes = validHistory.map(s => {
      const pastBw = s.bodyweight !== undefined ? Number(s.bodyweight) : currentBodyweight;
      const pastEffW = (Number(s.weight) || 0) + pastBw;
      return Math.round(pastEffW * (Number(s.reps) || 0) * 1000) / 1000;
    });
    const maxPastVolume = Math.max(...pastVolumes);

    if (currentReps > maxPastReps) {
      return {
        isPR: true,
        type: 'reps',
        achieved: currentReps,
        oldRecord: maxPastReps,
        increase: currentReps - maxPastReps,
        volume: currentVolume,
        oldVolume: maxPastVolume
      };
    }

    if (currentVolume > maxPastVolume) {
      return {
        isPR: true,
        type: 'volume',
        achieved: Math.round(currentVolume),
        oldRecord: Math.round(maxPastVolume),
        increase: Math.round(currentVolume - maxPastVolume),
        reps: currentReps
      };
    }

    return null;
  }

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
export function ensureSessionPRs(sessions, exercises = [], measurements = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) return sessions;
  
  const exMap = new Map((exercises || []).map(e => [e.id, e]));

  // Sort chronological
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Map of exerciseId -> Array of prior completed sets
  const exerciseHistory = new Map();

  const updatedSessions = sorted.map(sess => {
    let sessionHasChanges = false;
    const sessUserWeight = getUserWeightAtDate(measurements, sess.date);

    const updatedExercises = (sess.exercises || []).map(ex => {
      const exObj = exMap.get(ex.exerciseId);
      const requiresWeight = exObj ? exObj.requiresWeight !== false : true;
      const priorSets = exerciseHistory.get(ex.exerciseId) || [];
      const currentExercisePriorSets = [...priorSets];

      const updatedSets = (ex.sets || []).map(set => {
        if (!set.completed || Number(set.reps) <= 0) {
          return set;
        }
        if (requiresWeight && Number(set.weight) <= 0) {
          return set;
        }

        const prResult = evaluatePR(currentExercisePriorSets, set, requiresWeight, sessUserWeight);
        currentExercisePriorSets.push({
          ...set,
          bodyweight: sessUserWeight
        });

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

/**
 * Calculates user's workout streak based on a 7-day period / weekly cycle.
 * Training at least once within every 7-day period maintains the streak.
 * If >7 days have elapsed since the latest session, streak resets to 0.
 * @param {Array} sessions - array of user workout sessions
 * @returns {number} - count of consecutive weeks / 7-day periods
 */
export function calculateStreak(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return 0;

  // Filter completed sessions with a valid date
  const validDates = sessions
    .filter(s => s && s.date)
    .map(s => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
    .filter(t => !isNaN(t));

  if (validDates.length === 0) return 0;

  const uniqueTimestamps = [...new Set(validDates)].sort((a, b) => b - a);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const latestDate = new Date(uniqueTimestamps[0]);

  // Difference in calendar days between today and latest session
  const diffDays = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));

  // If user hasn't trained in more than 7 days, streak is broken
  if (diffDays > 7) {
    return 0;
  }

  // Helper to get ISO week key (e.g. "2026-W38")
  const getWeekKey = (timestamp) => {
    const d = new Date(timestamp);
    d.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year (ISO-8601)
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  };

  const weekSet = new Set(uniqueTimestamps.map(t => getWeekKey(t)));

  const currentWeekKey = getWeekKey(today.getTime());
  let checkTime = today.getTime();

  // If current week has no workout yet, but diffDays <= 7:
  // The streak from last week is still active!
  if (!weekSet.has(currentWeekKey)) {
    checkTime -= 7 * 24 * 60 * 60 * 1000;
  }

  let streak = 0;
  while (weekSet.has(getWeekKey(checkTime))) {
    streak++;
    checkTime -= 7 * 24 * 60 * 60 * 1000;
  }

  return streak;
}
