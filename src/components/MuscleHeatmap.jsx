import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnatomyModel from './anatomy/AnatomyModel';
import { DEFAULT_EXERCISES } from '../data/exerciseDb';
import { EXERCISE_ALIAS_MAP } from '../data/exerciseAliasMap';

// ==========================================
// SPORTS SCIENCE VOLUME & RECOVERY LANDMARKS
// ==========================================

// 1. Single Session Stimulus (Schoenfeld 2017, Krieger 2010)
export const SESSION_LEVELS = [
  { max: 0, color: '#6b7280', label: 'RESTED', desc: 'No stimulus logged in this workout' },
  { max: 3.5, color: '#34C759', label: 'LIGHT STIMULUS', desc: '1-3 sets: Maintenance / priming dose' },
  { max: 8.5, color: '#FFD60A', label: 'OPTIMAL (SWEET SPOT)', desc: '4-8 sets: Maximal hypertrophy stimulus per session' },
  { max: 12.5, color: '#FF9F0A', label: 'HIGH STRAIN', desc: '9-12 sets: Approaching single-session adaptive ceiling' },
  { max: Infinity, color: '#FF3B30', label: 'JUNK VOLUME RISK', desc: '>12 sets: Diminishing returns & excessive tissue damage' }
];
const SESSION_COLORS = ['#34C759', '#FFD60A', '#FF9F0A', '#FF3B30'];

// 2. Weekly Rolling Volume Landmarks (Dr. Mike Israetel / Renaissance Periodization)
export const WEEKLY_LEVELS = [
  { max: 0, color: '#6b7280', label: 'RESTED', desc: 'No sets logged in past 7 days' },
  { max: 5.5, color: '#8b90a0', label: 'MAINTENANCE (MV)', desc: '1-5 sets/wk: Preserves existing muscle mass' },
  { max: 9.5, color: '#0A84FF', label: 'MIN EFFECTIVE (MEV)', desc: '6-9 sets/wk: Minimum threshold to initiate growth' },
  { max: 18.5, color: '#30D158', label: 'OPTIMAL (MAV)', desc: '10-18 sets/wk: Hypertrophy sweet spot for maximal gains' },
  { max: 24.5, color: '#FF9F0A', label: 'OVERREACHING (MRV)', desc: '19-24 sets/wk: Maximum recoverable volume limit' },
  { max: Infinity, color: '#FF3B30', label: 'EXCESSIVE VOLUME', desc: '>24 sets/wk: Overtraining risk & systemic fatigue' }
];
const WEEKLY_COLORS = ['#8b90a0', '#0A84FF', '#30D158', '#FF9F0A', '#FF3B30'];

// 3. Muscle Recovery Kinetics (Hours elapsed since working stimulus)
// Red: Fatigued (0-24h), Orange: Rebuilding (24-48h), Light Orange/Golden: Primed (48-72h), Green: Rested (72h+)
export const RECOVERY_LEVELS = [
  { max: 24, color: '#FF3B30', label: 'FATIGUED (0-24h)', desc: 'Acute microtrauma & highest fatigue. Allow tissue to recover.' },
  { max: 48, color: '#FF9500', label: 'REBUILDING (24-48h)', desc: 'Peak muscle protein synthesis and active cellular remodeling.' },
  { max: 72, color: '#FFB800', label: 'PRIMED (48-72h)', desc: 'Supercompensation window. Highly responsive to new training stimulus.' },
  { max: Infinity, color: '#30D158', label: 'RESTED (72h+)', desc: 'Fully recovered and primed for progressive overload.' }
];
export const RECOVERY_COLORS = ['#FF3B30', '#FF9500', '#FFB800', '#30D158'];

export const ALL_HEATMAP_MUSCLES = [
  'chest',
  'upper-back',
  'trapezius',
  'lower-back',
  'front-deltoids',
  'back-deltoids',
  'biceps',
  'triceps',
  'forearm',
  'quadriceps',
  'hamstring',
  'gluteal',
  'calves',
  'adductor',
  'abs',
  'obliques'
];

export const normalizeMuscleKey = (key) => {
  if (!key) return null;
  const base = key.replace(/^(left-|right-)/, '');
  if (base === 'shins') return 'calves';
  if (base === 'abductors' || base === 'abductor') return 'gluteal';
  return base;
};

// Deterministic & Scientific Muscle Mapper
export function getExerciseMuscles(exObj) {
  if (!exObj) return null;

  // Custom exercises or explicitly mapped
  if (exObj.specificMuscle) {
    return {
      primary: normalizeMuscleKey(exObj.specificMuscle),
      secondary: exObj.secondaryMuscle ? normalizeMuscleKey(exObj.secondaryMuscle) : null
    };
  }

  const name = (exObj.name || '').toLowerCase();
  const cat = exObj.category;

  if (cat === 'Arms') {
    if (name.includes('tricep') || name.includes('pushdown') || name.includes('skullcrusher') || name.includes('kickback') || name.includes('close-grip') || name.includes('dip')) {
      return { primary: 'triceps', secondary: null };
    }
    if (name.includes('forearm') || name.includes('wrist') || name.includes('grip')) {
      return { primary: 'forearm', secondary: null };
    }
    // Bicep exercises: curls are isolation unless hammer/reverse which recruits forearms
    const isHammer = name.includes('hammer') || name.includes('reverse');
    return { primary: 'biceps', secondary: isHammer ? 'forearm' : null };
  }

  if (cat === 'Legs') {
    if (name.includes('calf') || name.includes('calves') || name.includes('raise') || name.includes('toe')) {
      return { primary: 'calves', secondary: null };
    }
    // Leg extensions are quad isolation: do NOT mark glutes
    if (name.includes('extension')) {
      return { primary: 'quadriceps', secondary: null };
    }
    // Leg curls are hamstring isolation: do NOT mark glutes
    if (name.includes('leg curl') || name.includes('hamstring curl') || name.includes('lying curl') || name.includes('seated curl')) {
      return { primary: 'hamstring', secondary: null };
    }
    if (name.includes('romanian') || name.includes('stiff-leg') || name.includes('rdl')) {
      return { primary: 'hamstring', secondary: 'gluteal' };
    }
    if (name.includes('deadlift')) {
      return { primary: 'lower-back', secondary: 'hamstring' };
    }
    if (name.includes('glute') || name.includes('hip thrust') || name.includes('bridge') || name.includes('kickback') || name.includes('abductor')) {
      return { primary: 'gluteal', secondary: 'hamstring' };
    }
    if (name.includes('adductor') || name.includes('inner thigh')) {
      return { primary: 'adductor', secondary: null };
    }
    // Squat, Leg Press, Lunge, Bulgarian Split Squat: compound quads + glutes
    return { primary: 'quadriceps', secondary: 'gluteal' };
  }

  if (cat === 'Back') {
    if (name.includes('shrug')) {
      return { primary: 'trapezius', secondary: null };
    }
    if (name.includes('upright row')) {
      return { primary: 'trapezius', secondary: 'front-deltoids' };
    }
    if (name.includes('lower back') || name.includes('hyperextension') || name.includes('good morning') || name.includes('back extension')) {
      return { primary: 'lower-back', secondary: 'gluteal' };
    }
    // Compound rows / pulldowns: primary upper back, secondary biceps
    return { primary: 'upper-back', secondary: 'biceps' };
  }

  if (cat === 'Shoulders') {
    if (name.includes('rear') || name.includes('face pull') || name.includes('reverse fly')) {
      return { primary: 'back-deltoids', secondary: 'trapezius' };
    }
    // Lateral raises are isolation for side delts: do NOT mark triceps
    if (name.includes('lateral') || name.includes('side raise')) {
      return { primary: 'front-deltoids', secondary: null };
    }
    if (name.includes('shrug')) {
      return { primary: 'trapezius', secondary: null };
    }
    // Compound shoulder presses: front-deltoids + triceps
    const isPress = name.includes('press') || name.includes('push');
    return { primary: 'front-deltoids', secondary: isPress ? 'triceps' : null };
  }

  if (cat === 'Chest') {
    const isPress = name.includes('press') || name.includes('push') || name.includes('dip');
    const isFly = name.includes('fly') || name.includes('crossover') || name.includes('pec deck');
    return { primary: 'chest', secondary: isPress ? 'triceps' : (isFly ? null : 'front-deltoids') };
  }

  if (cat === 'Core') {
    if (name.includes('oblique') || name.includes('twist') || name.includes('side')) {
      return { primary: 'obliques', secondary: 'abs' };
    }
    return { primary: 'abs', secondary: null };
  }

  return null;
}

const MUSCLE_DISPLAY_NAMES = {
  'chest': 'Pectorals (Chest)',
  'upper-back': 'Lats & Upper Back',
  'trapezius': 'Trapezius (Traps)',
  'lower-back': 'Lower Back (Erectors)',
  'front-deltoids': 'Front & Side Deltoids',
  'back-deltoids': 'Rear Deltoids',
  'biceps': 'Biceps Brachii',
  'triceps': 'Triceps Brachii',
  'forearm': 'Forearms & Grip',
  'quadriceps': 'Quadriceps (Quads)',
  'hamstring': 'Hamstrings',
  'gluteal': 'Gluteal Muscles (Glutes)',
  'calves': 'Calves (Gastrocnemius)',
  'adductor': 'Adductors (Inner Thigh)',
  'abs': 'Abdominals (Core)',
  'obliques': 'Obliques'
};

const formatMuscleName = (m) => MUSCLE_DISPLAY_NAMES[m] || m.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Precompiled fast lookups for static exercise database
const STATIC_EXERCISE_ID_MAP = new Map();
const STATIC_EXERCISE_NAME_MAP = new Map();
DEFAULT_EXERCISES.forEach(e => {
  if (e && e.id) STATIC_EXERCISE_ID_MAP.set(e.id, e);
  if (e && e.name) STATIC_EXERCISE_NAME_MAP.set(e.name.toLowerCase().trim(), e);
});

export default function MuscleHeatmap({
  sessions,
  days = 7,
  dataExercises,
  ignoreDate = false,
  mode = 'weekly', // 'session' | 'weekly' | 'recovery'
  gender = 'Male'
}) {
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  // Determine active mode if not explicitly set: ignoreDate implies single session
  const activeMode = (ignoreDate && mode !== 'recovery') ? 'session' : mode;

  const { parsedData, activeLevels, activeColors } = useMemo(() => {
    const now = new Date();
    const map = {};
    const lastTrainedMap = {};

    const customIdMap = new Map();
    const customNameMap = new Map();
    if (dataExercises) {
      dataExercises.forEach(e => {
        if (e && e.id) customIdMap.set(e.id, e);
        if (e && e.name) customNameMap.set(e.name.toLowerCase().trim(), e);
      });
    }

    let levels = WEEKLY_LEVELS;
    let colors = WEEKLY_COLORS;

    if (activeMode === 'session') {
      levels = SESSION_LEVELS;
      colors = SESSION_COLORS;
    } else if (activeMode === 'recovery') {
      levels = RECOVERY_LEVELS;
      colors = RECOVERY_COLORS;
    }

    if (sessions) {
      sessions.forEach(s => {
        const sessionDate = new Date(s.date);
        const diffDays = Math.abs(now - sessionDate) / (1000 * 60 * 60 * 24);
        const diffHours = Math.abs(now - sessionDate) / (1000 * 60 * 60);

        if (ignoreDate || activeMode === 'session' || diffDays <= days || activeMode === 'recovery') {
          (s.exercises || []).forEach(ex => {
            const canonicalId = EXERCISE_ALIAS_MAP[ex.exerciseId] || ex.exerciseId;
            const lowerName = ex.name ? ex.name.toLowerCase().trim() : '';
            const exObj = customIdMap.get(canonicalId)
              || customIdMap.get(ex.exerciseId)
              || STATIC_EXERCISE_ID_MAP.get(canonicalId)
              || STATIC_EXERCISE_ID_MAP.get(ex.exerciseId)
              || (lowerName ? (customNameMap.get(lowerName) || STATIC_EXERCISE_NAME_MAP.get(lowerName)) : null);
            if (exObj) {
              const muscles = getExerciseMuscles(exObj);
              if (muscles && muscles.primary) {
                // Strict sports science: filter out warm-up sets (W)
                const workingSets = (ex.sets || []).filter(set => 
                  (set.completed || set.completed === undefined) && set.type !== 'W'
                );

                const count = workingSets.length;
                if (count > 0) {
                  // Primary muscle gets 1.0x set credit
                  map[muscles.primary] = (map[muscles.primary] || 0) + count;
                  if (lastTrainedMap[muscles.primary] === undefined || diffHours < lastTrainedMap[muscles.primary]) {
                    lastTrainedMap[muscles.primary] = diffHours;
                  }

                  // Secondary synergist gets 0.5x set credit
                  if (muscles.secondary) {
                    map[muscles.secondary] = (map[muscles.secondary] || 0) + (count * 0.5);
                    if (lastTrainedMap[muscles.secondary] === undefined || diffHours < lastTrainedMap[muscles.secondary]) {
                      lastTrainedMap[muscles.secondary] = diffHours;
                    }
                  }
                }
              }
            }
          });
        }
      });
    }

    const dataArr = [];
    const metaMap = {};

    if (activeMode === 'recovery') {
      // In recovery mode, evaluate EVERY muscle region across the body
      ALL_HEATMAP_MUSCLES.forEach(muscle => {
        const hours = lastTrainedMap[muscle];
        const isTrained = hours !== undefined && hours !== null;
        
        let levelIdx;
        if (!isTrained || hours > 72) {
          // Untrained or trained more than 72 hours ago -> RESTED (Green)
          levelIdx = 3;
        } else if (hours <= 24) {
          // 0-24h -> FATIGUED (Red)
          levelIdx = 0;
        } else if (hours <= 48) {
          // 24-48h -> REBUILDING (Orange)
          levelIdx = 1;
        } else {
          // 48-72h -> PRIMED (Light Orange / Golden)
          levelIdx = 2;
        }

        const lvl = levels[levelIdx];
        const freq = levelIdx + 1; // 1 = Red, 2 = Orange, 3 = Light Orange/Gold, 4 = Green

        dataArr.push({
          name: muscle,
          muscles: [muscle, `left-${muscle}`, `right-${muscle}`],
          frequency: freq
        });

        metaMap[muscle] = {
          hours: isTrained ? Math.round(hours) : null,
          sets: map[muscle] || 0,
          level: lvl,
          isTrained
        };
      });
    } else {
      // For session or weekly volume mode
      Object.keys(map).forEach(muscle => {
        const sets = map[muscle];
        if (sets > 0) {
          let levelIdx = levels.findIndex(l => sets <= l.max);
          if (levelIdx === -1) levelIdx = levels.length - 1;

          // Frequency 1-based index into activeColors
          let freq = levelIdx; // level 1 -> index 0 (frequency 1)
          if (freq < 1) freq = 1;
          if (freq > colors.length) freq = colors.length;

          dataArr.push({
            name: muscle,
            muscles: [muscle, `left-${muscle}`, `right-${muscle}`],
            frequency: freq
          });

          metaMap[muscle] = {
            sets: Math.round(sets * 10) / 10,
            hours: lastTrainedMap[muscle] ? Math.round(lastTrainedMap[muscle]) : null,
            level: levels[levelIdx],
            isTrained: true
          };
        }
      });
    }

    return { parsedData: { dataArr, metaMap }, activeLevels: levels, activeColors: colors };
  }, [sessions, days, dataExercises, ignoreDate, activeMode]);

  const handleTap = (data) => {
    if (!data || !data.muscle) {
      setSelectedMuscle(null);
      return;
    }
    const m = normalizeMuscleKey(data.muscle);
    if (selectedMuscle && selectedMuscle.name === m) {
      setSelectedMuscle(null);
      return;
    }
    const meta = parsedData.metaMap[m] || (
      activeMode === 'recovery'
        ? {
            sets: 0,
            hours: null,
            level: activeLevels[3], // RESTED (Green)
            isTrained: false
          }
        : {
            sets: 0,
            hours: null,
            level: activeLevels[0], // RESTED (0 sets)
            isTrained: false
          }
    );
    setSelectedMuscle({ name: m, ...meta });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
      
      {/* Invisible overlay to close tooltip */}
      {selectedMuscle && (
        <div 
          onClick={() => setSelectedMuscle(null)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }} 
        />
      )}

      {/* Muscle Anatomy Detail Card */}
      <AnimatePresence>
        {selectedMuscle && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              position: 'absolute', 
              top: -50, 
              zIndex: 10, 
              background: '#1A1A1E', 
              padding: '14px 20px', 
              borderRadius: 20, 
              border: `1.5px solid ${selectedMuscle.level.color}`, 
              boxShadow: `0 14px 40px rgba(0,0,0,0.9), 0 0 25px ${selectedMuscle.level.color}33`, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 4,
              maxWidth: 320,
              textAlign: 'center'
            }}
            onClick={(e) => { e.stopPropagation(); setSelectedMuscle(null); }}
          >
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 800, color: '#fff' }}>
              {formatMuscleName(selectedMuscle.name)}
            </div>

            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 700, color: '#8b90a0' }}>
              {activeMode === 'recovery' ? (
                selectedMuscle.hours !== null 
                  ? `Last trained ${selectedMuscle.hours}h ago`
                  : 'No recent training recorded • Fully Rested'
              ) : (
                `${selectedMuscle.sets} Effective Sets`
              )}
            </div>

            <div style={{ 
              fontFamily: '"Inter", sans-serif', 
              fontSize: 11, 
              fontWeight: 900, 
              color: selectedMuscle.level.color, 
              marginTop: 4, 
              background: `${selectedMuscle.level.color}22`, 
              padding: '4px 12px', 
              borderRadius: 8,
              letterSpacing: '0.04em'
            }}>
              {selectedMuscle.level.label}
            </div>

            <div style={{ fontSize: 11, color: '#a0a5b5', marginTop: 4, lineHeight: 1.3 }}>
              {selectedMuscle.level.desc}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anatomy Visualizer (Front & Back) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        gap: 10, 
        width: '100%', 
        maxWidth: 460,
        margin: '0 auto',
        padding: '0 2px',
        boxSizing: 'border-box'
      }}>
        
        {/* FRONT VIEW */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          flex: '1 1 0px',
          minWidth: 0,
          maxWidth: 215
        }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 900, color: '#8b90a0', letterSpacing: '0.15em', marginBottom: 8 }}>FRONT</div>
          <AnatomyModel 
            gender={gender}
            type="anterior" 
            dataArr={parsedData.dataArr} 
            metaMap={parsedData.metaMap}
            highlightedColors={activeColors}
            activeMode={activeMode}
            selectedMuscle={selectedMuscle}
            onClick={handleTap}
            style={{ width: '100%', maxWidth: 210, height: 'auto', aspectRatio: '1 / 2' }}
          />
        </div>

        {/* BACK VIEW */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          flex: '1 1 0px',
          minWidth: 0,
          maxWidth: 215
        }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 900, color: '#8b90a0', letterSpacing: '0.15em', marginBottom: 8 }}>BACK</div>
          <AnatomyModel 
            gender={gender}
            type="posterior" 
            dataArr={parsedData.dataArr} 
            metaMap={parsedData.metaMap}
            highlightedColors={activeColors}
            activeMode={activeMode}
            selectedMuscle={selectedMuscle}
            onClick={handleTap}
            style={{ width: '100%', maxWidth: 210, height: 'auto', aspectRatio: '1 / 2' }}
          />
        </div>

      </div>

      {/* Scientific Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: 12, padding: '0 12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, maxWidth: '100%' }}>
          {(activeMode === 'recovery' ? activeLevels : activeLevels.slice(1)).map((lvl, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: lvl.color, boxShadow: `0 0 10px ${lvl.color}80` }}/>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#8b90a0', letterSpacing: '0.04em', fontFamily: '"Inter", sans-serif' }}>
                {lvl.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
