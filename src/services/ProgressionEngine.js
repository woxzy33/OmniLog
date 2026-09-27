/**
 * Progressive Overload & Hypertrophy Recommendation Engine
 * Grounded in sports science (Schoenfeld, Helms, Morton et al., NSCA)
 */

export const EXPERIENCE_TIERS = {
  beginner: {
    id: 'beginner',
    label: 'Novice / Beginner',
    duration: '< 1 Year Experience',
    shortDesc: 'Rapid neuromuscular adaptations & motor unit recruitment.',
    longDesc: 'Session-to-session linear progression. Receptive to frequent rep or small weight increments.',
    color: '#30D158',
    icon: '🌱',
    plateauThreshold: 3, // 3 consecutive sessions without gain
    e1rmPlateauEpsilon: 0.01 // < 1% gain
  },
  intermediate: {
    id: 'intermediate',
    label: 'Early Intermediate',
    duration: '1–2 Years Experience',
    shortDesc: 'Double Progression model. Consolidate volume across sets.',
    longDesc: 'Requires myofibrillar hypertrophy. Lock weight until rep ceiling is achieved across sets, then step up load.',
    color: '#0A84FF',
    icon: '⚡',
    plateauThreshold: 4, // 4 consecutive sessions
    e1rmPlateauEpsilon: 0.01
  },
  advanced: {
    id: 'advanced',
    label: 'Advanced Intermediate',
    duration: '2–5 Years Experience',
    shortDesc: 'Dynamic Double Progression (DDP). Set 1 driver.',
    longDesc: 'High fatigue sensitivity. Prioritize progress on Set 1 while back-off sets maintain volume and avoid failure.',
    color: '#BF5AF2',
    icon: '🔥',
    plateauThreshold: 5, // 5 consecutive sessions
    e1rmPlateauEpsilon: 0.008
  },
  elite: {
    id: 'elite',
    label: 'Elite / Expert',
    duration: '5+ Years Experience',
    shortDesc: 'Near genetic ceiling. Micro-loading & wave cycles.',
    longDesc: 'Progress measured over weeks and months. Fractional micro-loading and single-set nudges.',
    color: '#FF9F0A',
    icon: '👑',
    plateauThreshold: 6, // 6 consecutive sessions
    e1rmPlateauEpsilon: 0.005
  }
};

/**
 * Calculates standard weight increment based on exercise type and equipment
 * in kilograms (or converted for lbs).
 */
export function getStandardLoadIncrement(equipment = '', category = '', experienceLevel = 'intermediate', unit = 'kg') {
  const eq = (equipment || '').toLowerCase();
  const cat = (category || '').toLowerCase();
  const isLbs = unit === 'lbs';

  const isCompoundBarbell = eq.includes('barbell') && 
    (cat.includes('chest') || cat.includes('legs') || cat.includes('back') || cat.includes('shoulders'));
  
  let incrementKg = 2.5;

  if (isCompoundBarbell) {
    if (experienceLevel === 'elite') incrementKg = 1.25;
    else if (experienceLevel === 'advanced') incrementKg = 2.5;
    else incrementKg = 2.5;
  } else if (eq.includes('dumbbell') || eq.includes('cable') || eq.includes('machine') || cat.includes('arms')) {
    // Isolation or dumbbells: smaller steps
    if (experienceLevel === 'elite') incrementKg = 1.0;
    else if (experienceLevel === 'advanced') incrementKg = 1.25;
    else incrementKg = 2.0;
  } else {
    incrementKg = 2.5;
  }

  return isLbs ? Math.round(incrementKg * 2.20462 * 2) / 2 : incrementKg;
}

/**
 * Estimates 1-Rep Max using the Epley formula
 */
export function estimate1RM(weight, reps) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return w;
  return w * (1 + r / 30);
}

/**
 * Infer hypertrophy rep boundaries based on previous performance
 */
export function inferRepBracket(priorReps = 8, category = '', equipment = '') {
  const cat = (category || '').toLowerCase();
  const eq = (equipment || '').toLowerCase();

  // If previous reps are known
  if (priorReps <= 6) {
    return { floor: 4, ceiling: 8 };
  } else if (priorReps <= 9) {
    return { floor: 6, ceiling: 10 };
  } else if (priorReps <= 12) {
    return { floor: 8, ceiling: 12 };
  } else {
    return { floor: 10, ceiling: 15 };
  }
}

/**
 * Rounds a weight value to the nearest equipment load increment
 */
export function roundToIncrement(val, increment = 2.5) {
  if (!val || Number(val) <= 0) return 0;
  const inc = Number(increment) || 2.5;
  const rounded = Math.round(Number(val) / inc) * inc;
  return Math.round(rounded * 10) / 10;
}

/**
 * Find 3-4 suitable alternative exercises targeting the same muscle group
 * with different implements/equipment or movement patterns.
 */
export function getAlternativeExercises(currentExercise, allExercises = [], limit = 4) {
  if (!currentExercise || !Array.isArray(allExercises) || allExercises.length === 0) return [];

  const currentCat = (currentExercise.category || '').toLowerCase().trim();
  const currentEq = (currentExercise.equipment || '').toLowerCase().trim();
  const currentName = (currentExercise.name || '').toLowerCase().trim();
  const currentId = String(currentExercise.id || currentExercise.exerciseId || '').trim();

  // Normalize category matching
  const matchesCategory = (ex) => {
    const cat = (ex.category || '').toLowerCase().trim();
    if (!cat || !currentCat) return false;
    if (cat === currentCat) return true;
    if (currentCat.includes(cat) || cat.includes(currentCat)) return true;
    return false;
  };

  // Filter candidates matching category
  const candidates = allExercises.filter(ex => {
    if (!ex || !ex.name) return false;
    const exId = String(ex.id || '').trim();
    const exName = ex.name.toLowerCase().trim();
    if (exId === currentId || exName === currentName) return false;
    return matchesCategory(ex);
  });

  // Prioritize different equipment first (e.g. if barbell -> dumbbell, machine, cable)
  const differentEquipment = candidates.filter(ex => {
    const eq = (ex.equipment || '').toLowerCase().trim();
    return eq !== currentEq && eq !== 'other' && eq !== '';
  });

  const sameEquipment = candidates.filter(ex => {
    const eq = (ex.equipment || '').toLowerCase().trim();
    return eq === currentEq;
  });

  const ordered = [...differentEquipment, ...sameEquipment];

  // Unique by name
  const seen = new Set();
  const unique = [];
  for (const ex of ordered) {
    const key = ex.name.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(ex);
    }
    if (unique.length >= limit) break;
  }

  return unique.map(ex => {
    let rationale = 'Bypasses adaptive resistance with a novel resistance profile.';
    const eq = (ex.equipment || '').toLowerCase();
    if (eq.includes('dumbbell')) {
      rationale = 'Unilateral freedom: allows independent wrist/elbow track and deep stretch.';
    } else if (eq.includes('cable')) {
      rationale = 'Continuous tension: constant torque even at peak contraction.';
    } else if (eq.includes('machine')) {
      rationale = 'Locked biomechanical path: eliminates stabilizer fatigue so prime mover works harder.';
    } else if (eq.includes('barbell')) {
      rationale = 'High maximal force production & bilateral overload capacity.';
    } else if (eq.includes('bodyweight')) {
      rationale = 'Closed kinetic chain movement with natural joint tracking.';
    }
    return {
      ...ex,
      rationale
    };
  });
}

/**
 * Generate set-by-set target suggestions for an active exercise
 *
 * @param {Object} options
 * @param {Array} options.currentSets - current sets in the active logger
 * @param {Array} options.priorSets - completed sets from previous session
 * @param {string} options.equipment
 * @param {string} options.category
 * @param {string} options.experienceLevel - 'beginner' | 'intermediate' | 'advanced' | 'elite'
 * @param {string} options.unit - 'kg' | 'lbs'
 * @param {boolean} options.enabled - whether progressive overload suggestions are toggled on
 * @param {boolean} options.requiresWeight - whether this exercise uses external load
 * @param {Object|null} options.activeIntervention - active plateau intervention if selected
 * @returns {Array<{ targetWeight: number|null, targetReps: number|null, rationale: string, isOverload: boolean, isDeload?: boolean }>}
 */
export function calculateProgressiveTargets({
  currentSets = [],
  priorSets = [],
  equipment = '',
  category = '',
  experienceLevel = 'intermediate',
  unit = 'kg',
  enabled = true,
  requiresWeight = true,
  activeIntervention = null
}) {
  if (!Array.isArray(currentSets) || currentSets.length === 0) return [];

  // If disabled or no prior sets available, fallback to priorSets or defaults
  if (!enabled || !Array.isArray(priorSets) || priorSets.length === 0) {
    return currentSets.map((s, idx) => {
      const p = priorSets?.[idx] || priorSets?.[priorSets.length - 1];
      return {
        targetWeight: p?.weight != null ? Number(p.weight) : null,
        targetReps: p?.reps != null ? Number(p.reps) : null,
        rationale: p ? 'Repeat prior session' : 'Baseline set',
        isOverload: false
      };
    });
  }

  const validPrior = priorSets.filter(s => s && (Number(s.reps) > 0 || (requiresWeight && Number(s.weight) > 0)));
  if (validPrior.length === 0) {
    return currentSets.map(() => ({ targetWeight: null, targetReps: null, rationale: 'Baseline set', isOverload: false }));
  }

  const loadStep = getStandardLoadIncrement(equipment, category, experienceLevel, unit);
  const repBracket = inferRepBracket(Number(validPrior[0]?.reps) || 8, category, equipment);

  // Check active intervention and its 7-day expiration
  let isInterventionActive = false;
  let interventionType = null;
  let interventionDayNumber = 1;

  if (activeIntervention && activeIntervention.id) {
    const activatedTime = new Date(activeIntervention.activatedAt).getTime();
    const durationDays = Number(activeIntervention.durationDays) || 7;
    const elapsedDays = (Date.now() - activatedTime) / (1000 * 60 * 60 * 24);
    if (elapsedDays >= 0 && elapsedDays < durationDays) {
      isInterventionActive = true;
      interventionType = activeIntervention.id;
      interventionDayNumber = Math.min(durationDays, Math.floor(elapsedDays) + 1);
    }
  }

  // 1. ACTIVE INTERVENTION ADAPTATIONS (Move-specific, 7-day window)
  if (isInterventionActive) {
    return currentSets.map((currentSet, i) => {
      const priorSet = validPrior[i] || validPrior[validPrior.length - 1];
      const prevWeight = Number(priorSet?.weight) || 0;
      const prevReps = Number(priorSet?.reps) || repBracket.floor;

      if (interventionType === 'deload') {
        // Strategic Deload: 10% load reduction
        if (!requiresWeight) {
          const deloadReps = Math.max(1, Math.round(prevReps * 0.8));
          return {
            targetWeight: null,
            targetReps: deloadReps,
            rationale: `Strategic Deload: -20% volume for joint & tendon recovery (Day ${interventionDayNumber}/7)`,
            isOverload: false,
            isDeload: true
          };
        }
        const deloadWeight = prevWeight > 0 ? roundToIncrement(prevWeight * 0.9, loadStep) : 0;
        return {
          targetWeight: deloadWeight,
          targetReps: prevReps,
          rationale: `Strategic Deload (-10%): ${deloadWeight} ${unit} for CNS recovery (Day ${interventionDayNumber}/7)`,
          isOverload: false,
          isDeload: true
        };
      }

      if (interventionType === 'rep_switch') {
        // Rep Bracket Shift: 1RM equivalent calculation
        const isCurrentLowRep = prevReps <= 8;
        const newTargetReps = isCurrentLowRep ? 12 : 6;
        if (!requiresWeight) {
          return {
            targetWeight: null,
            targetReps: newTargetReps,
            rationale: `Rep Bracket Shift: ${newTargetReps} reps to stimulate alternative motor units`,
            isOverload: true,
            isRepShift: true
          };
        }
        const e1rm = estimate1RM(prevWeight, prevReps);
        const equivWeight = e1rm > 0 ? roundToIncrement(e1rm / (1 + newTargetReps / 30), loadStep) : prevWeight;
        return {
          targetWeight: equivWeight,
          targetReps: newTargetReps,
          rationale: `Rep Bracket Shift: ${newTargetReps} reps @ ${equivWeight} ${unit} (Equivalent 1RM stimulus)`,
          isOverload: true,
          isRepShift: true
        };
      }

      if (interventionType === 'variation') {
        return {
          targetWeight: prevWeight,
          targetReps: prevReps,
          rationale: `Implement / Angle Variation: Focus on 3s eccentric tempo & deep stretch`,
          isOverload: true,
          isVariation: true
        };
      }

      if (interventionType === 'volume') {
        // Fatigue audit
        return {
          targetWeight: prevWeight,
          targetReps: Math.max(1, prevReps - 1),
          rationale: `Fatigue Audit: Stop at RIR 2 (leave 2 reps in reserve) to restore systemic recovery`,
          isOverload: false,
          isFatigueAudit: true
        };
      }

      return {
        targetWeight: prevWeight,
        targetReps: prevReps,
        rationale: 'Active Intervention path in progress',
        isOverload: false
      };
    });
  }

  // 2. STANDARD PROGRESSIVE OVERLOAD CALCULATIONS (Also runs after 7-day expiration)
  const allHitCeiling = validPrior.every(s => Number(s.reps) >= repBracket.ceiling);
  const set1HitCeiling = Number(validPrior[0]?.reps) >= repBracket.ceiling;

  return currentSets.map((currentSet, i) => {
    const priorSet = validPrior[i] || validPrior[validPrior.length - 1];
    const prevWeight = Number(priorSet.weight) || 0;
    const prevReps = Number(priorSet.reps) || repBracket.floor;

    // A. BODYWEIGHT EXERCISES
    if (!requiresWeight) {
      if (experienceLevel === 'beginner') {
        return {
          targetWeight: null,
          targetReps: prevReps + 1,
          rationale: '+1 rep progressive overload',
          isOverload: true
        };
      } else if (experienceLevel === 'intermediate') {
        const lowestRepPrior = Math.min(...validPrior.map(p => Number(p.reps) || 0));
        const shouldBumpThisSet = (Number(priorSet.reps) === lowestRepPrior) || (validPrior.length === 2 && i === 1);
        return {
          targetWeight: null,
          targetReps: shouldBumpThisSet ? prevReps + 1 : prevReps,
          rationale: shouldBumpThisSet ? '+1 rep to match volume' : 'Hold solid reps',
          isOverload: shouldBumpThisSet
        };
      } else {
        const isSet1 = i === 0;
        return {
          targetWeight: null,
          targetReps: isSet1 ? prevReps + 1 : prevReps,
          rationale: isSet1 ? 'Set 1 peak volume drive' : 'Maintain quality reps',
          isOverload: isSet1
        };
      }
    }

    // B. WEIGHTED EXERCISES - TIERED MODELS
    switch (experienceLevel) {
      case 'beginner': {
        if (prevReps >= repBracket.ceiling) {
          const newWeight = roundToIncrement(prevWeight + loadStep, loadStep);
          return {
            targetWeight: newWeight,
            targetReps: repBracket.floor,
            rationale: `Rep ceiling hit! Step up +${loadStep} ${unit}`,
            isOverload: true
          };
        } else {
          return {
            targetWeight: prevWeight,
            targetReps: prevReps + 1,
            rationale: '+1 rep overload at current load',
            isOverload: true
          };
        }
      }

      case 'intermediate': {
        if (allHitCeiling) {
          const newWeight = roundToIncrement(prevWeight + loadStep, loadStep);
          return {
            targetWeight: newWeight,
            targetReps: repBracket.floor,
            rationale: `Double Progression: All sets capped! +${loadStep} ${unit}`,
            isOverload: true
          };
        }

        let targetReps = prevReps;
        let isOverload = false;
        let rationale = 'Hold clean form and tempo';

        if (validPrior.length === 2) {
          if (i === 1) {
            targetReps = prevReps + 1;
            isOverload = true;
            rationale = 'Set 2 volume progression (+1 rep)';
          } else if (i === 0 && prevReps < repBracket.ceiling) {
            targetReps = prevReps + 1;
            isOverload = true;
            rationale = 'Set 1 rep push';
          }
        } else {
          const lowestRep = Math.min(...validPrior.map(p => Number(p.reps) || 0));
          if (prevReps === lowestRep && prevReps < repBracket.ceiling) {
            targetReps = prevReps + 1;
            isOverload = true;
            rationale = `Set ${i + 1} volume catch-up (+1 rep)`;
          } else if (i === 0 && prevReps < repBracket.ceiling) {
            targetReps = prevReps + 1;
            isOverload = true;
            rationale = 'Set 1 rep drive';
          }
        }

        return {
          targetWeight: prevWeight,
          targetReps,
          rationale,
          isOverload
        };
      }

      case 'advanced': {
        if (i === 0) {
          if (set1HitCeiling) {
            const newWeight = roundToIncrement(prevWeight + loadStep, loadStep);
            return {
              targetWeight: newWeight,
              targetReps: repBracket.floor,
              rationale: `DDP: Top Set load increase +${loadStep} ${unit}`,
              isOverload: true
            };
          } else {
            return {
              targetWeight: prevWeight,
              targetReps: prevReps + 1,
              rationale: 'Top Set +1 rep focus (DDP)',
              isOverload: true
            };
          }
        } else {
          return {
            targetWeight: prevWeight,
            targetReps: prevReps,
            rationale: 'Back-off volume consolidation',
            isOverload: false
          };
        }
      }

      case 'elite':
      default: {
        if (i === 0 && prevReps >= repBracket.ceiling) {
          const microLoad = unit === 'lbs' ? 2.5 : 1.0;
          const newWeight = roundToIncrement(prevWeight + microLoad, microLoad);
          return {
            targetWeight: newWeight,
            targetReps: repBracket.floor,
            rationale: `Elite fractional micro-load (+${microLoad} ${unit})`,
            isOverload: true
          };
        } else if (i === 1 && prevReps < repBracket.ceiling) {
          return {
            targetWeight: prevWeight,
            targetReps: prevReps + 1,
            rationale: 'Micro rep wave on supporting set',
            isOverload: true
          };
        } else {
          return {
            targetWeight: prevWeight,
            targetReps: prevReps,
            rationale: 'Consolidate baseline adaptation',
            isOverload: false
          };
        }
      }
    }
  });
}

/**
 * Detect training plateau based on session count of this specific exercise.
 * NOTE: Counts actual exercise occurrences, NOT calendar days.
 *
 * @param {Object} options
 * @param {string} options.exerciseId
 * @param {string} options.exerciseName
 * @param {Array} options.allSessions - all historical sessions from data.sessions
 * @param {string} options.experienceLevel - 'beginner' | 'intermediate' | 'advanced' | 'elite'
 * @param {string} options.currentSessionId - active session ID to exclude from past history
 * @param {number|null} options.customThreshold - optional user-defined plateau threshold
 * @returns {Object} Plateau diagnosis details
 */
export function detectExercisePlateau({
  exerciseId,
  exerciseName = '',
  allSessions = [],
  experienceLevel = 'intermediate',
  currentSessionId = null,
  customThreshold = null
}) {
  if ((!exerciseId && !exerciseName) || !Array.isArray(allSessions)) {
    return { isPlateau: false, sessionCount: 0 };
  }

  const tier = EXPERIENCE_TIERS[experienceLevel] || EXPERIENCE_TIERS.intermediate;
  const threshold = (customThreshold != null && Number(customThreshold) >= 2 && Number(customThreshold) <= 10)
    ? Number(customThreshold)
    : tier.plateauThreshold;

  const targetId = String(exerciseId || '').trim();
  const targetName = String(exerciseName || '').trim().toLowerCase();

  // Filter completed sessions that included this exercise, excluding current active session
  const relevantSessions = allSessions
    .filter(s => s && s.id !== currentSessionId)
    .filter(s => (s.exercises || []).some(e => {
      const matchId = targetId && (e.exerciseId === targetId || e.id === targetId);
      const matchName = targetName && e.name && e.name.toLowerCase() === targetName;
      return matchId || matchName;
    }))
    .sort((a, b) => new Date(b.date || b.completedAt || 0) - new Date(a.date || a.completedAt || 0)); // Newest first

  if (relevantSessions.length < threshold) {
    return {
      isPlateau: false,
      sessionCount: relevantSessions.length,
      threshold,
      isCustomThreshold: customThreshold != null && Number(customThreshold) === threshold
    };
  }

  // Extract performance metric for the last `threshold` sessions
  const windowSessions = relevantSessions.slice(0, threshold);
  const sessionMetrics = windowSessions.map(session => {
    const ex = (session.exercises || []).find(e => {
      const matchId = targetId && (e.exerciseId === targetId || e.id === targetId);
      const matchName = targetName && e.name && e.name.toLowerCase() === targetName;
      return matchId || matchName;
    });
    const validSets = (ex?.sets || []).filter(s => s.completed && (Number(s.reps) > 0 || Number(s.weight) > 0));

    let maxE1rm = 0;
    let totalVolume = 0;
    let bestSet = null;

    validSets.forEach(s => {
      const e1rm = estimate1RM(s.weight, s.reps);
      const vol = (Number(s.weight) || 0) * (Number(s.reps) || 0);
      totalVolume += vol;
      if (e1rm > maxE1rm) {
        maxE1rm = e1rm;
        bestSet = s;
      }
    });

    return {
      sessionId: session.id,
      date: session.date,
      maxE1rm,
      totalVolume,
      bestSet
    };
  });

  // Most recent session is index 0; oldest in window is index threshold - 1
  const mostRecent = sessionMetrics[0];
  const baseline = sessionMetrics[threshold - 1];

  // If no valid sets recorded
  if (!mostRecent.bestSet || mostRecent.maxE1rm === 0) {
    return { 
      isPlateau: false, 
      sessionCount: relevantSessions.length, 
      threshold, 
      isCustomThreshold: customThreshold != null && Number(customThreshold) === threshold 
    };
  }

  // Check peak E1RM across the entire window
  const maxE1rmInWindow = Math.max(...sessionMetrics.map(m => m.maxE1rm));
  const baselineE1rm = baseline.maxE1rm;

  // Stagnation evaluation:
  // Peak performance in the entire window has not surpassed the baseline by more than epsilon
  const hasE1rmGrown = maxE1rmInWindow > baselineE1rm * (1 + tier.e1rmPlateauEpsilon);
  const hasVolumeGrown = mostRecent.totalVolume > baseline.totalVolume * 1.03; // >3% volume growth

  const isPlateau = !hasE1rmGrown && !hasVolumeGrown;

  if (isPlateau) {
    const stagnantWeight = mostRecent.bestSet?.weight || 0;
    const stagnantReps = mostRecent.bestSet?.reps || 0;
    const e1rm = Math.round(mostRecent.maxE1rm);

    const deloadTargetWeight = stagnantWeight > 0 ? roundToIncrement(stagnantWeight * 0.9, 2.5) : 0;
    const isCurrentLowRep = stagnantReps <= 8;
    const repShiftTargetReps = isCurrentLowRep ? 12 : 6;
    const repShiftTargetWeight = e1rm > 0 ? roundToIncrement(e1rm / (1 + repShiftTargetReps / 30), 2.5) : stagnantWeight;

    return {
      isPlateau: true,
      sessionCount: threshold,
      threshold,
      isCustomThreshold: customThreshold != null && Number(customThreshold) === threshold,
      exerciseId,
      stagnantWeight,
      stagnantReps,
      bestE1rm: e1rm,
      baselineDate: baseline.date,
      interventions: [
        {
          id: 'deload',
          tag: 'Recovery',
          title: 'Implement a Strategic Deload',
          description: 'Reduce working loads by 10% for 1 week. This dissipates cumulative central nervous system fatigue without losing muscle mass.',
          previewAction: stagnantWeight > 0 
            ? `Next workout: ~${deloadTargetWeight} kg × ${stagnantReps} reps (-10%)`
            : 'Reduce volume by 20% for 1 week'
        },
        {
          id: 'rep_switch',
          tag: 'Stimulus Shift',
          title: 'Shift Hypertrophy Rep Bracket',
          description: isCurrentLowRep
            ? 'Transition from heavy 6–8 reps to moderate 10–12 reps for 3–4 weeks to stimulate alternative motor unit pools.'
            : 'Drop into a heavier 6–8 strength bracket to condition tendons and recruit high-threshold motor units.',
          previewAction: isCurrentLowRep
            ? `Shift to 10–12 reps @ ~${repShiftTargetWeight} kg (1RM equivalent)`
            : `Shift to 5–7 reps @ ~${repShiftTargetWeight} kg (1RM equivalent)`
        },
        {
          id: 'variation',
          tag: 'Biomechanical Angle',
          title: 'Rotate Implement or Grip Angle',
          description: 'Subtle shifts (e.g. dumbbell swap, neutral grip, or incline) bypass adaptive resistance and activate fresh muscle fibers.',
          previewAction: 'Rotate to alternative exercise or grip angle'
        },
        {
          id: 'volume',
          tag: 'Fatigue Audit',
          title: 'Check Systemic Recovery & Junk Volume',
          description: 'Plateaus often occur from overreaching rather than underworking. Leave 2 reps in reserve (RIR 2) and ensure 48–72 hours of recovery.',
          previewAction: 'Cap sets at RIR 2 for systemic fatigue clearance'
        }
      ]
    };
  }

  return {
    isPlateau: false,
    sessionCount: relevantSessions.length,
    threshold,
    isCustomThreshold: customThreshold != null && Number(customThreshold) === threshold
  };
}
