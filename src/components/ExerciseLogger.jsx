import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, TimerReset, Settings, GripHorizontal, ChevronDown, ChevronUp, Trash, Trophy, Info } from './Icons';
import { useKeypad } from './NumericKeypad';
import PlateCalculatorModal from './PlateCalculatorModal';
import ExerciseDetailModal from './ExerciseDetailModal';
import { ErrorModal } from './WorkoutSafeguards';
import { formatWeight, parseDisplayWeight, validateExerciseSet } from '../utils';
import { exerciseRequiresWeight } from '../data/exerciseDb';
import { useTranslation } from 'react-i18next';
import { calculateProgressiveTargets, detectExercisePlateau, getAlternativeExercises, EXPERIENCE_TIERS } from '../services/ProgressionEngine';

// High end sound for completing sets - using a clean click URL (safeguarded)
const playClickSound = () => {
  try {
    const audio = new Audio('/sounds/button_click.ogg');
    audio.volume = 0.5;
    audio.play().catch(()=>{});
  } catch(e) {}
};

const typeStyles = {
  N: { bg: "#1C1C1E", text: "#e2e2e2", translationKey: 'workout.setNormal', fallback: 'Normal' },
  W: { bg: "#FF9F0A", text: "#121212", translationKey: 'workout.setWarmup', fallback: 'Warmup' },
  D: { bg: "#E81123", text: "#ffffff", translationKey: 'workout.setDrop', fallback: 'Drop Set' },
  F: { bg: "#8A2BE2", text: "#ffffff", translationKey: 'workout.setFailure', fallback: 'Failure' },
};

const SET_TYPE_DETAILS = [
  {
    key: 'N',
    title: 'Normal Working Set',
    description: 'Counts towards progressive overload & hypertrophy volume calculations',
    accentColor: '#3B82F6',
    badgeBg: '#1C1C1E',
    badgeText: '#E5E7EB',
    badgeBorder: 'rgba(255,255,255,0.15)'
  },
  {
    key: 'W',
    title: 'Warm-up Set',
    description: 'Auto-ramped load (50%–90%) to prime nervous system without fatigue',
    accentColor: '#FF9F0A',
    badgeBg: 'rgba(255, 159, 10, 0.2)',
    badgeText: '#FF9F0A',
    badgeBorder: 'rgba(255, 159, 10, 0.45)'
  },
  {
    key: 'D',
    title: 'Drop Set',
    description: 'Immediate load reduction (~20–30%) to recruit fatigued muscle fibers',
    accentColor: '#EF4444',
    badgeBg: 'rgba(239, 68, 68, 0.2)',
    badgeText: '#F87171',
    badgeBorder: 'rgba(239, 68, 68, 0.4)'
  },
  {
    key: 'F',
    title: 'Failure Set',
    description: 'Max-effort set pushed to absolute 0 RIR (concentric failure)',
    accentColor: '#BF5AF2',
    badgeBg: 'rgba(191, 90, 242, 0.2)',
    badgeText: '#BF5AF2',
    badgeBorder: 'rgba(191, 90, 242, 0.45)'
  }
];

const getRpeColor = (rpe) => {
  if (!rpe) return '#6b7080';
  const n = Number(rpe);
  if (n >= 10) return '#FF2D55';
  if (n >= 9) return '#FF6B00';
  if (n >= 8) return '#FFB800';
  if (n >= 7) return '#30D158';
  return '#00A3FF';
};

const SwipeableSetRow = ({ children, onDelete, isCompleted }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      style={{ position: 'relative', marginBottom: 5, overflow: 'hidden', borderRadius: 10 }}
    >
      {!isCompleted && (
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '0 10px 10px 0', zIndex: 0
        }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              border: 'none',
              borderRadius: '0 10px 10px 0',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              cursor: 'pointer',
              boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.15)'
            }}
            title="Confirm deletion"
          >
            <Trash size={15} color="#fff" />
            <span style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Delete</span>
          </button>
        </div>
      )}

      <motion.div
        drag={isCompleted ? false : "x"}
        dragConstraints={{ left: -72, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        animate={{ x: isRevealed ? -72 : 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 35 }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -36 || info.velocity.x < -250) {
            setIsRevealed(true);
          } else {
            setIsRevealed(false);
          }
        }}
        onClick={() => {
          if (isRevealed) setIsRevealed(false);
        }}
        style={{
          display: 'flex', gap: 6, alignItems: 'center', padding: '3px 4px',
          background: isCompleted ? 'rgba(35, 56, 37, 0.45)' : '#141518',
          borderRadius: 10,
          border: isCompleted ? '1px solid rgba(48, 209, 88, 0.25)' : '1px solid transparent',
          position: 'relative', zIndex: 1,
          touchAction: 'pan-y'
        }}
      >
        {children}
        {!isCompleted && !isRevealed && (
          <div 
            title="Swipe left to delete"
            style={{
              position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)',
              width: 3.5, height: 22, borderRadius: 2, background: 'rgba(217, 74, 74, 0.75)',
              pointerEvents: 'none'
            }} 
          />
        )}
      </motion.div>
    </motion.div>
  );
};

const ExerciseLogger = React.memo(({ 
  exIdx, exerciseId, name, category, equipment, imageUrl, gifUrl, specificMuscle, secondaryMuscle, exerciseObj, sets, priorSets, 
  allSessions = [], allExercises = [], currentSessionId = null,
  activeIntervention = null, customPlateauThreshold = null,
  onSelectIntervention, onCancelIntervention, onSwapExercise,
  supersetPrefix = "", onSetsChange, startTimer, footer, notes, onNotesChange, 
  onRemove, settings, onTitleClick, dragControls, requiresWeight: requiresWeightProp
}) => {
  const { t } = useTranslation();
  const { openKeypad } = useKeypad();
  const [calcWeight, setCalcWeight] = useState(null);
  const [showPlateauModal, setShowPlateauModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const requiresWeight = typeof requiresWeightProp === 'boolean'
    ? requiresWeightProp
    : exerciseRequiresWeight({ name, category, equipment, requiresWeight: requiresWeightProp });

  const experienceLevel = settings?.experienceLevel || 'intermediate';
  const progressiveOverloadEnabled = settings?.progressiveOverloadEnabled !== false;

  // Active intervention duration & 7-day expiration status
  const { isInterventionActive, isInterventionExpired, daysRemaining, interventionDayNumber } = useMemo(() => {
    if (!activeIntervention || !activeIntervention.id) {
      return { isInterventionActive: false, isInterventionExpired: false, daysRemaining: 0, interventionDayNumber: 0 };
    }
    const activatedTime = new Date(activeIntervention.activatedAt).getTime();
    const durationDays = Number(activeIntervention.durationDays) || 7;
    const elapsedDays = (Date.now() - activatedTime) / (1000 * 60 * 60 * 24);
    const active = elapsedDays >= 0 && elapsedDays < durationDays;
    return {
      isInterventionActive: active,
      isInterventionExpired: elapsedDays >= durationDays,
      daysRemaining: Math.max(1, Math.ceil(durationDays - elapsedDays)),
      interventionDayNumber: Math.min(durationDays, Math.floor(elapsedDays) + 1)
    };
  }, [activeIntervention]);

  // Progressive Overload Targets (Adapts if activeIntervention is active)
  const progressiveTargets = useMemo(() => {
    return calculateProgressiveTargets({
      currentSets: sets,
      priorSets,
      equipment,
      category,
      experienceLevel,
      unit: settings?.unit || 'kg',
      enabled: progressiveOverloadEnabled,
      requiresWeight,
      activeIntervention
    });
  }, [sets, priorSets, equipment, category, experienceLevel, settings?.unit, progressiveOverloadEnabled, requiresWeight, activeIntervention]);

  // Plateau Detection (Strictly counting sessions of this specific exercise)
  const plateauInfo = useMemo(() => {
    return detectExercisePlateau({
      exerciseId,
      exerciseName: name,
      allSessions,
      experienceLevel,
      currentSessionId,
      customThreshold: customPlateauThreshold
    });
  }, [exerciseId, name, allSessions, experienceLevel, currentSessionId, customPlateauThreshold]);

  // Alternative exercises for implement rotation
  const alternativeExercises = useMemo(() => {
    return getAlternativeExercises({ id: exerciseId, name, category, equipment }, allExercises, 4);
  }, [exerciseId, name, category, equipment, allExercises]);

  const handleInputClick = (type, setIndex) => {
    const currentSet = sets[setIndex];
    let val = currentSet[type] || "";
    
    // For weight, we might want to display in lb if settings demand, but store in kg.
    if (type === 'weight' && val && settings?.unit === 'lbs') {
      val = (Number(val) * 2.20462).toFixed(2).replace(/\.00$/, '');
    }
    
    const nextFn = () => {
       if (type === 'weight') handleInputClick('reps', setIndex);
       else if (type === 'reps') handleInputClick('rpe', setIndex);
       else if (type === 'rpe' && setIndex < sets.length - 1) {
         if (requiresWeight) {
           handleInputClick('weight', setIndex + 1);
         } else {
           handleInputClick('reps', setIndex + 1);
         }
       }
    };
    
    openKeypad({
      type,
      title: type === 'weight' ? `Set ${setIndex+1} Weight` : type === 'reps' ? `Set ${setIndex+1} Reps` : `${name} • Set ${setIndex+1} RPE`,
      exerciseName: name,
      setNumber: setIndex + 1,
      value: String(val),
      onChange: (newVal) => {
        const n = [...sets];
        if (type === 'weight') {
           n[setIndex].weight = parseDisplayWeight(newVal, settings?.unit);
        } else {
           n[setIndex][type] = newVal;
        }
        onSetsChange(exIdx, n, exerciseId);
      },
      onNext: nextFn
    });
  };
  const [editingSetType, setEditingSetType] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const allSetsCompleted = sets.length > 0 && sets.every(s => s.completed);

  const addSet = () => {
    const n = [...sets];
    const prev = n.length > 0 ? n[n.length - 1] : (priorSets && priorSets.length > 0 ? priorSets[0] : null);
    n.push({
      weight: requiresWeight ? (prev ? prev.weight : "") : "",
      reps: prev ? prev.reps : "",
      rpe: prev ? prev.rpe : "",
      type: "N",
      completed: false
    });
    onSetsChange(exIdx, n, exerciseId);
  };

  const removeSet = () => {
    if (editingSetType !== null) {
      const n = [...sets];
      n.splice(editingSetType, 1);
      onSetsChange(exIdx, n, exerciseId);
      setEditingSetType(null);
    }
  };

  const updateSetType = (typeKey) => {
    if (editingSetType !== null) {
      const n = [...sets];
      n[editingSetType].type = typeKey;
      onSetsChange(exIdx, n, exerciseId);
      setEditingSetType(null);
    }
  };

  const handleUseTarget = (i) => {
    const target = progressiveTargets[i];
    const effectivePrior = priorSets?.[i] || (priorSets?.length > 0 ? priorSets[priorSets.length - 1] : null);
    if (!target && !effectivePrior) return;
    const n = [...sets];
    if (requiresWeight) {
      if (target?.targetWeight != null) {
        n[i].weight = target.targetWeight;
      } else if (effectivePrior?.weight != null) {
        n[i].weight = effectivePrior.weight;
      }
    }
    if (target?.targetReps != null) {
      n[i].reps = target.targetReps;
    } else if (effectivePrior?.reps != null) {
      n[i].reps = effectivePrior.reps;
    }
    onSetsChange(exIdx, n, exerciseId);
  };

  const handleUsePrior = handleUseTarget;

  // We use standard rest
  const defaultRest = 90;

  return (
    <motion.div 
      layout
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="card"
      style={{
        padding: 0,
        marginBottom: 14,
        borderRadius: 18,
        background: allSetsCompleted 
          ? 'linear-gradient(180deg, #18191D 0%, #121316 100%)' 
          : '#141518',
        border: allSetsCompleted 
          ? '1.5px solid rgba(48,209,88,0.5)' 
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: allSetsCompleted 
          ? '0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(48,209,88,0.12)' 
          : '0 4px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 14px 10px', gap: 12 }}>
        {imageUrl ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailModal(true);
            }}
            style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
            title="Tap to preview demo GIF & instructions"
          >
            <img src={imageUrl} alt={name} style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', background: '#0D0E10', border: '1px solid rgba(255,255,255,0.08)' }} />
            {gifUrl && (
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, background: '#30D158', border: '2px solid #141518', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 7, fontWeight: 900, color: '#000' }}>▶</span>
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailModal(true);
            }}
            style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            title="Tap to view instructions"
          >
            <span style={{ fontSize: 16, color: '#8b90a0', fontWeight: 800 }}>{name.charAt(0)}</span>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div 
              style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
              onClick={onTitleClick}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                <span style={{ 
                  fontSize: 10, 
                  color: "var(--primary)", 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em',
                  background: 'rgba(0,122,255,0.1)',
                  padding: '2px 7px',
                  borderRadius: 6
                }}>
                  {supersetPrefix ? `Superset ${supersetPrefix}` : (category ? t(`categories.${category.toLowerCase()}`, category) : 'Exercise')}
                </span>
                {!requiresWeight && (
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: '#8b90a0', padding: '2px 6px', borderRadius: 6, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em' }}>
                    BODYWEIGHT
                  </span>
                )}
                {plateauInfo?.isPlateau && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPlateauModal(true);
                    }}
                    style={{
                      background: 'rgba(255, 159, 10, 0.16)',
                      border: '1px solid rgba(255, 159, 10, 0.45)',
                      color: '#FF9F0A',
                      padding: '2px 7px',
                      borderRadius: 6,
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}
                    title="Plateau Detected • Tap for scientific advice"
                  >
                    <span>⚠️</span>
                    <span>Plateau ({plateauInfo.sessionCount}x)</span>
                  </button>
                )}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
            </div>
            
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
              <button 
                type="button"
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: 'none', 
                  color: '#8b90a0', 
                  cursor: 'pointer', 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }} 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailModal(true);
                }}
                title="View form guide & demo GIF"
                aria-label="View form guide & demo GIF"
              >
                <Info size={16} />
              </button>
              <div 
                onPointerDown={(e) => {
                  e.preventDefault();
                  dragControls && dragControls.start(e);
                }}
                style={{ 
                  cursor: 'grab', 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#8b90a0', 
                  touchAction: 'none',
                  background: 'rgba(255,255,255,0.03)'
                }}
                title="Drag to reorder"
                aria-label="Drag to reorder"
              >
                <GripHorizontal size={18} />
              </div>
              <button 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: 'none', 
                  color: '#8b90a0', 
                  cursor: 'pointer', 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }} 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemove) onRemove();
                }}
                title="Remove exercise"
                aria-label="Remove exercise"
              >
                <X size={17} />
              </button>
            </div>
          </div>
          <input 
            value={notes}
            onChange={e => onNotesChange(exIdx, e.target.value)}
            placeholder="Add notes..."
            style={{ 
              width: '100%', 
              background: 'rgba(0,0,0,0.25)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: 8,
              color: '#a0a5b5', 
              fontSize: 12, 
              padding: '6px 10px', 
              marginTop: 6, 
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        style={{ padding: '0 8px 14px' }}
      >
        {/* Active Move-Specific Intervention Banner */}
        {isInterventionActive && (
          <div style={{
            margin: '0 2px 10px',
            padding: '8px 12px',
            borderRadius: 10,
            background: 'rgba(255, 159, 10, 0.12)',
            border: '1px solid rgba(255, 159, 10, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#FF9F0A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activeIntervention.id === 'deload' ? 'Strategic Deload (-10%) Active' :
                   activeIntervention.id === 'rep_switch' ? 'Rep Bracket Shift Active' :
                   activeIntervention.id === 'variation' ? 'Implement Variation Active' : 'Fatigue Audit Active'}
                </div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>
                  Day {interventionDayNumber} of 7 • {daysRemaining} days remaining for this move
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setShowPlateauModal(true)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: '#fff',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Manage
            </button>
          </div>
        )}

        {/* Expired Intervention Notification */}
        {isInterventionExpired && (
          <div style={{
            margin: '0 2px 10px',
            padding: '8px 12px',
            borderRadius: 10,
            background: 'rgba(48, 209, 88, 0.1)',
            border: '1px solid rgba(48, 209, 88, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 14 }}>💪</span>
              <span style={{ fontSize: 10.5, color: '#30D158', fontWeight: 700 }}>
                7-Day Deload Window Concluded. Normal progressive targets restored—break the plateau!
              </span>
            </div>
            {onCancelIntervention && (
              <button 
                type="button"
                onClick={onCancelIntervention}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8b90a0',
                  cursor: 'pointer',
                  padding: 2
                }}
                title="Dismiss"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {progressiveOverloadEnabled && progressiveTargets.some(t => t.isOverload || t.isDeload || t.isRepShift) && (
          <div style={{
            margin: '0 2px 10px',
            fontSize: 11,
            color: progressiveTargets.some(t => t.isDeload) ? '#FF9F0A' : '#00C6FF',
            background: progressiveTargets.some(t => t.isDeload) ? 'rgba(255, 159, 10, 0.08)' : 'rgba(0, 198, 255, 0.08)',
            border: progressiveTargets.some(t => t.isDeload) ? '1px solid rgba(255, 159, 10, 0.25)' : '1px solid rgba(0, 198, 255, 0.2)',
            borderRadius: 8,
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ fontSize: 13 }}>{progressiveTargets.some(t => t.isDeload) ? '🌿' : '🎯'}</span>
            <span style={{ fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {(progressiveTargets.find(t => t.isDeload || t.isOverload || t.isRepShift))?.rationale || 'Adaptive overload target active'}
            </span>
          </div>
        )}
        {sets.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, padding: '0 2px', alignItems: 'center' }}>
              <span style={{ width: 34, textAlign: 'center', fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7080' }}>Set</span>
              <span style={{ width: 48, textAlign: 'left', fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7080', paddingLeft: 2 }}>Prev</span>
              {requiresWeight && (
                <span style={{ flex: 1.4, minWidth: 54, textAlign: 'center', fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7080' }}>
                  {settings?.unit === 'lbs' ? 'Lbs' : 'Kg'}
                </span>
              )}
              <span style={{ flex: requiresWeight ? 1.25 : 1.7, minWidth: 50, textAlign: 'center', fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7080' }}>Reps</span>
              <span style={{ flex: requiresWeight ? 1.05 : 1.3, minWidth: 46, textAlign: 'center', fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7080' }}>RPE</span>
              <span style={{ width: 40, textAlign: 'center' }}><Check size={14} color="#6b7080" /></span>
            </div>
          )}

          <AnimatePresence>
            {sets.map((s, i) => {
              const effectivePrior = priorSets?.[i] || (priorSets?.length > 0 ? priorSets[priorSets.length - 1] : null);
              return (
                <SwipeableSetRow 
                  key={i}
                  isCompleted={s.completed}
                  onDelete={() => {
                    const n = sets.filter((_, idx) => idx !== i);
                    onSetsChange(exIdx, n, exerciseId);
                  }}
                >
                  <div style={{ width: 34, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    <span className="setIndex" style={{ width: 12, fontSize: 12, fontWeight: 800, color: '#8b90a0' }}>{supersetPrefix}{i + 1}</span>
                    <button
                      style={{
                        background: (typeStyles[s.type] || typeStyles["N"]).bg,
                        color: (typeStyles[s.type] || typeStyles["N"]).text,
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 5,
                        fontSize: 10,
                        fontWeight: 900,
                        padding: "2px 0",
                        width: 19,
                        height: 22,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                      onClick={() => setEditingSetType(i)}
                    >
                      {s.type || "N"}
                    </button>
                  </div>

                  <div style={{ width: 48, textAlign: 'left', paddingLeft: 2, flexShrink: 0 }}>
                    {s.isPR && s.completed ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                        background: 'rgba(232, 193, 44, 0.16)',
                        border: '1px solid rgba(232, 193, 44, 0.45)',
                        padding: '2px 4px',
                        borderRadius: 6,
                        fontSize: 9,
                        fontWeight: 900,
                        color: '#E8C12C',
                        boxShadow: '0 0 10px rgba(232, 193, 44, 0.25)'
                      }}>
                        <Trophy size={9} color="#E8C12C" />
                        <span>PR</span>
                      </div>
                    ) : (effectivePrior || progressiveTargets[i]?.targetReps != null) ? (
                      <div 
                        onClick={() => handleUseTarget(i)}
                        title={progressiveTargets[i]?.rationale || "Tap to apply target"}
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 1 }}
                      >
                        <div style={{ fontSize: 10.5, color: '#8b90a0', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {effectivePrior 
                            ? (requiresWeight ? `${formatWeight(effectivePrior.weight, settings?.unit)}×${effectivePrior.reps}` : `${effectivePrior.reps}r`)
                            : '-'
                          }
                        </div>
                        {progressiveTargets[i]?.isWarmup && !s.completed ? (
                          <span style={{ 
                            fontSize: 8.5, 
                            fontWeight: 800, 
                            color: '#FF9F0A', 
                            background: 'rgba(255, 159, 10, 0.16)', 
                            border: '1px solid rgba(255, 159, 10, 0.4)', 
                            padding: '1px 4px', 
                            borderRadius: 4, 
                            alignSelf: 'flex-start',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2
                          }}>
                            🔥 {progressiveTargets[i].targetWeight ? `${formatWeight(progressiveTargets[i].targetWeight, settings?.unit)}×` : ''}{progressiveTargets[i].targetReps}r
                          </span>
                        ) : progressiveTargets[i]?.isDeload && !s.completed ? (
                          <span style={{ 
                            fontSize: 8.5, 
                            fontWeight: 800, 
                            color: '#FF9F0A', 
                            background: 'rgba(255, 159, 10, 0.15)', 
                            border: '1px solid rgba(255, 159, 10, 0.3)', 
                            padding: '1px 3px', 
                            borderRadius: 4, 
                            alignSelf: 'flex-start',
                            whiteSpace: 'nowrap'
                          }}>
                            🌿 -10%
                          </span>
                        ) : progressiveTargets[i]?.isOverload && !s.completed ? (
                          <span style={{ 
                            fontSize: 8.5, 
                            fontWeight: 800, 
                            color: '#00C6FF', 
                            background: 'rgba(0, 198, 255, 0.12)', 
                            border: '1px solid rgba(0, 198, 255, 0.25)', 
                            padding: '1px 3px', 
                            borderRadius: 4, 
                            alignSelf: 'flex-start',
                            whiteSpace: 'nowrap'
                          }}>
                            🎯 {progressiveTargets[i].targetReps}r
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#444' }}>-</div>
                    )}
                  </div>
                  
                  {requiresWeight && (
                    <div style={{ flex: 1.4, minWidth: 54 }}>
                      <div
                        onClick={() => {
                          if (s.completed) return;
                          handleInputClick('weight', i);
                        }}
                        onDoubleClick={() => {
                          if (s.completed) return;
                          setCalcWeight(s.weight || progressiveTargets[i]?.targetWeight || effectivePrior?.weight || "0");
                        }}
                        className="setInput" 
                        style={{ 
                          width: '100%', 
                          height: 38,
                          minHeight: 38,
                          borderRadius: 8,
                          padding: '0 4px', 
                          fontSize: 15, 
                          fontWeight: 800,
                          background: s.completed ? 'rgba(48, 209, 88, 0.08)' : '#101114',
                          border: s.completed ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid rgba(255,255,255,0.14)',
                          color: s.weight 
                            ? '#ffffff' 
                            : (progressiveTargets[i]?.isWarmup ? '#FF9F0A' : (progressiveTargets[i]?.isDeload ? 'rgba(255, 159, 10, 0.75)' : (progressiveTargets[i]?.isOverload ? 'rgba(0, 198, 255, 0.65)' : '#6b7080'))),
                          boxShadow: s.completed ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.4)'
                        }}
                      >
                        {s.weight 
                          ? formatWeight(s.weight, settings?.unit) 
                          : (progressiveTargets[i]?.targetWeight != null 
                              ? formatWeight(progressiveTargets[i].targetWeight, settings?.unit)
                              : (formatWeight(effectivePrior?.weight, settings?.unit) || "-")
                            )
                        }
                      </div>
                    </div>
                  )}
                  
                  <div style={{ flex: requiresWeight ? 1.25 : 1.7, minWidth: 50 }}>
                    <div
                      onClick={() => {
                        if (s.completed) return;
                        handleInputClick('reps', i);
                      }}
                      className="setInput" 
                      style={{ 
                        width: '100%', 
                        height: 38,
                        minHeight: 38,
                        borderRadius: 8,
                        padding: '0 4px', 
                        fontSize: 15, 
                        fontWeight: 800,
                        background: s.completed ? 'rgba(48, 209, 88, 0.08)' : '#101114',
                        border: s.completed ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid rgba(255,255,255,0.14)',
                        color: s.reps 
                          ? '#ffffff' 
                          : (progressiveTargets[i]?.isWarmup ? '#FF9F0A' : (progressiveTargets[i]?.isDeload ? 'rgba(255, 159, 10, 0.75)' : (progressiveTargets[i]?.isOverload ? 'rgba(0, 198, 255, 0.65)' : '#6b7080'))),
                        boxShadow: s.completed ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.4)'
                      }}
                    >
                      {s.reps || (progressiveTargets[i]?.targetReps ?? effectivePrior?.reps ?? "-")}
                    </div>
                  </div>
                
                <div style={{ flex: requiresWeight ? 1.05 : 1.3, minWidth: 46 }}>
                  <div
                    onClick={() => {
                      if (s.completed) return;
                      handleInputClick('rpe', i);
                    }}
                    className="setInput" 
                    style={{ 
                      width: '100%', 
                      height: 38,
                      minHeight: 38,
                      borderRadius: 8,
                      padding: '0 4px', 
                      fontSize: 15, 
                      fontWeight: 800,
                      background: s.completed ? 'rgba(48, 209, 88, 0.08)' : (s.rpe ? `${getRpeColor(s.rpe)}15` : '#101114'),
                      border: s.completed ? '1px solid rgba(48, 209, 88, 0.3)' : (s.rpe ? `1px solid ${getRpeColor(s.rpe)}55` : '1px solid rgba(255,255,255,0.14)'),
                      color: getRpeColor(s.rpe),
                      boxShadow: s.completed ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.4)'
                    }}
                  >
                    {s.rpe || "-"}
                  </div>
                </div>
                
                <button
                  className="checkBtn completeSetBtn"
                  style={{
                    width: 40,
                    height: 38,
                    borderRadius: 8,
                    background: s.completed ? "#30D158" : "#141518",
                    border: s.completed ? "1px solid #30D158" : "1px solid rgba(255,255,255,0.14)",
                    color: s.completed ? "#000000" : "#6b7080",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                    boxShadow: s.completed ? '0 2px 10px rgba(48, 209, 88, 0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  data-testid="complete-set-btn"
                  onClick={() => {
                    const n = [...sets];
                    const completing = !n[i].completed;
                    
                    if (completing) {
                      const errorMsg = validateExerciseSet(
                        requiresWeight ? n[i].weight : 0, 
                        n[i].reps, 
                        category, 
                        equipment || 'Other', 
                        settings?.unit || 'kg',
                        requiresWeight
                      );
                      if (errorMsg) {
                        n[i] = { ...n[i], error: errorMsg, completed: false };
                        onSetsChange(exIdx, n, exerciseId, i);
                        setValidationError(errorMsg);
                        return;
                      }
                      
                      playClickSound();
                      if (startTimer) startTimer(defaultRest);
                    }
                    n[i] = { ...n[i], completed: completing, error: null };
                    onSetsChange(exIdx, n, exerciseId, i);
                  }}
                >
                  {s.error ? <span style={{ color: '#E81123', fontWeight: 900, fontSize: 16 }}>!</span> : <Check size={18} strokeWidth={s.completed ? 3 : 2} />}
                </button>
              </SwipeableSetRow>
            );
          })}
          </AnimatePresence>

          <ErrorModal 
            isOpen={!!validationError} 
            onClose={() => setValidationError(null)} 
            message={validationError} 
          />

          <button 
            className="addSetBtn" 
            style={{ 
              padding: '11px', 
              marginTop: 10, 
              fontSize: 13, 
              fontWeight: 700,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1.5px dashed rgba(255,255,255,0.14)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }} 
            onClick={addSet}
          >
            <Plus size={16} strokeWidth={2.5} /> Add Set
          </button>

          {footer}
        </motion.div>

      {calcWeight !== null && (
        <PlateCalculatorModal weight={calcWeight} onClose={() => setCalcWeight(null)} settings={settings} />
      )}

      {/* Set Type Selection Bottom Sheet */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {editingSetType !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'rgba(0,0,0,0.75)', 
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 9999, 
                display: 'flex', 
                alignItems: 'flex-end', 
                justifyContent: 'center' 
              }}
              onClick={() => setEditingSetType(null)}
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                onClick={e => e.stopPropagation()}
                style={{ 
                  background: '#16171B', 
                  width: '100%', 
                  maxWidth: 500, 
                  borderTopLeftRadius: 24, 
                  borderTopRightRadius: 24, 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderBottom: 'none',
                  padding: '16px 20px', 
                  paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
                  boxShadow: '0 -10px 40px rgba(0,0,0,0.6)'
                }}
              >
                {/* Drag Handle Indicator */}
                <div style={{ width: 38, height: 4, background: 'rgba(255,255,255,0.22)', borderRadius: 2, margin: '0 auto 16px' }} />
                
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#F3F4F6' }}>
                      Set {editingSetType + 1} Type
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingSetType(null)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: 'none',
                        color: '#9CA3AF',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 3 }}>
                    {name} • Calibrate progression & recovery role
                  </div>
                </div>
                
                {/* Set Types List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {SET_TYPE_DETAILS.map((info) => {
                    const isSelected = (sets[editingSetType]?.type || 'N') === info.key;
                    return (
                      <button 
                        key={info.key} 
                        type="button"
                        style={{ 
                          background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', 
                          border: isSelected ? `1.5px solid ${info.accentColor}` : '1px solid rgba(255,255,255,0.07)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '12px 14px', 
                          cursor: 'pointer', 
                          borderRadius: 14, 
                          transition: 'all 0.18s ease',
                          textAlign: 'left'
                        }}
                        onClick={() => updateSetType(info.key)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                          <span style={{ 
                            background: info.badgeBg, 
                            color: info.badgeText, 
                            border: `1px solid ${info.badgeBorder || 'rgba(255,255,255,0.1)'}`,
                            fontWeight: 900, 
                            fontSize: 12, 
                            width: 26, 
                            height: 26, 
                            borderRadius: 7,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: "'JetBrains Mono', monospace",
                            flexShrink: 0
                          }}>
                            {info.key}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: '#F3F4F6', fontSize: 14, fontWeight: 700 }}>
                              {info.title}
                            </div>
                            <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>
                              {info.description}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: info.accentColor,
                            color: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginLeft: 8
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                  
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />
                  
                  <button 
                    type="button"
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.08)', 
                      border: '1px solid rgba(239, 68, 68, 0.22)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: 8, 
                      padding: '12px', 
                      cursor: 'pointer', 
                      borderRadius: 12,
                      color: '#F87171',
                      fontWeight: 700,
                      fontSize: 13
                    }}
                    onClick={removeSet}
                  >
                    <Trash size={16} />
                    <span>Delete Set {editingSetType + 1}</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {/* Plateau Intervention & Strategy Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showPlateauModal && plateauInfo?.isPlateau && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPlateauModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#12141A',
                border: '1.5px solid rgba(255, 159, 10, 0.45)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 35px rgba(255, 159, 10, 0.15)',
                borderRadius: 22,
                padding: '22px 18px',
                width: '100%',
                maxWidth: 440,
                maxHeight: '88vh',
                overflowY: 'auto',
                boxSizing: 'border-box'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(255, 159, 10, 0.15)',
                    border: '1px solid rgba(255, 159, 10, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20
                  }}>
                    ⚠️
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#FF9F0A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Adaptation Stagnation
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '2px 0 0' }}>
                      Plateau Detected
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlateauModal(false)}
                  style={{ background: 'none', border: 'none', color: '#8B90A0', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status summary pill */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 16
              }}>
                <div style={{ fontSize: 14, color: '#E2E8F0', fontWeight: 800, marginBottom: 4 }}>
                  {name}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.45 }}>
                  No volume or estimated 1RM increase across <strong style={{ color: '#FF9F0A' }}>{plateauInfo.sessionCount} sessions</strong> of this exercise (Baseline: {plateauInfo.stagnantWeight ? `${formatWeight(plateauInfo.stagnantWeight, settings?.unit)} ${settings?.unit || 'kg'} × ` : ''}{plateauInfo.stagnantReps} reps).
                </div>
                <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600, marginTop: 6 }}>
                  Calibrated for: {EXPERIENCE_TIERS[experienceLevel]?.label} ({plateauInfo.threshold}-session threshold)
                </div>
              </div>

              {/* Motivational science text */}
              <div style={{
                fontSize: 12,
                color: '#CBD5E1',
                lineHeight: 1.5,
                background: 'rgba(0, 122, 255, 0.08)',
                border: '1px solid rgba(0, 122, 255, 0.2)',
                borderRadius: 12,
                padding: '10px 14px',
                marginBottom: 18
              }}>
                💡 <strong style={{ color: '#38BDF8' }}>The Science:</strong> Plateaus are not failure—they indicate that your neuromuscular system has fully adapted to the current stimulus. Progress requires altering fatigue or mechanical vectors.
              </div>

              {/* Interventions (Selectable Paths) */}
              <div style={{ fontSize: 11, fontWeight: 800, color: '#8B90A0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Recommended Interventions (Selectable Paths)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {plateauInfo.interventions?.map(item => {
                  const isThisActive = activeIntervention?.id === item.id && isInterventionActive;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: isThisActive ? 'rgba(48, 209, 88, 0.08)' : '#1A1C24',
                        border: isThisActive ? '1.5px solid #30D158' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 14,
                        padding: '14px',
                        boxShadow: isThisActive ? '0 0 15px rgba(48, 209, 88, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>{item.title}</span>
                        {isThisActive ? (
                          <span style={{ fontSize: 9.5, fontWeight: 800, color: '#30D158', background: 'rgba(48, 209, 88, 0.15)', padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase' }}>
                            ✓ Active Path (Day {interventionDayNumber}/7)
                          </span>
                        ) : (
                          <span style={{ fontSize: 9.5, fontWeight: 800, color: '#FF9F0A', background: 'rgba(255, 159, 10, 0.12)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.45, marginBottom: 10 }}>
                        {item.description}
                      </div>

                      {/* Preview Action Formula / Specific Calculation */}
                      {item.previewAction && (
                        <div style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 8,
                          padding: '6px 10px',
                          fontSize: 11,
                          color: '#38BDF8',
                          fontWeight: 600,
                          marginBottom: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}>
                          <span>🎯</span>
                          <span>{item.previewAction}</span>
                        </div>
                      )}

                      {/* Implement Rotation: Suggest 3-4 Alternative Exercises */}
                      {item.id === 'variation' && alternativeExercises.length > 0 && (
                        <div style={{ marginTop: 8, marginBottom: 10 }}>
                          <div style={{ fontSize: 10.5, fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                            Recommended Variations ({category || 'Same Group'}):
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {alternativeExercises.map(altEx => (
                              <div
                                key={altEx.id || altEx.name}
                                style={{
                                  background: 'rgba(0,0,0,0.4)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  borderRadius: 8,
                                  padding: '8px 10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 8
                                }}
                              >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {altEx.name}
                                    </span>
                                    <span style={{ fontSize: 8.5, background: 'rgba(255,255,255,0.08)', color: '#A0AEC0', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
                                      {altEx.equipment || 'Other'}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: 10, color: '#718096', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {altEx.rationale}
                                  </div>
                                </div>
                                {onSwapExercise && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onSwapExercise(altEx.id);
                                      if (onSelectIntervention) {
                                        onSelectIntervention({
                                          id: 'variation',
                                          title: `Implement Rotation: ${altEx.name}`,
                                          activatedAt: new Date().toISOString(),
                                          durationDays: 7
                                        });
                                      }
                                      setShowPlateauModal(false);
                                    }}
                                    style={{
                                      background: 'rgba(0, 122, 255, 0.15)',
                                      border: '1px solid rgba(0, 122, 255, 0.35)',
                                      color: '#007AFF',
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      fontSize: 10,
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    Swap Move
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons for path selection */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        {isThisActive ? (
                          <button
                            type="button"
                            onClick={() => onCancelIntervention && onCancelIntervention()}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 8,
                              background: 'rgba(232, 17, 35, 0.15)',
                              border: '1px solid rgba(232, 17, 35, 0.4)',
                              color: '#FF453A',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Cancel Active Strategy
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectIntervention) {
                                onSelectIntervention({
                                  id: item.id,
                                  title: item.title,
                                  activatedAt: new Date().toISOString(),
                                  durationDays: 7,
                                  baselineWeight: plateauInfo.stagnantWeight,
                                  baselineReps: plateauInfo.stagnantReps
                                });
                              }
                              setShowPlateauModal(false);
                            }}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: 10,
                              background: item.id === 'deload' 
                                ? 'linear-gradient(135deg, rgba(48, 209, 88, 0.25) 0%, rgba(48, 209, 88, 0.1) 100%)' 
                                : 'rgba(255, 255, 255, 0.08)',
                              border: item.id === 'deload' 
                                ? '1px solid rgba(48, 209, 88, 0.4)' 
                                : '1px solid rgba(255, 255, 255, 0.14)',
                              color: item.id === 'deload' ? '#30D158' : '#fff',
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6
                            }}
                          >
                            <span>
                              {item.id === 'deload' ? 'Select Strategic Deload (-10%)' :
                               item.id === 'rep_switch' ? 'Select Rep Bracket Shift' :
                               item.id === 'variation' ? 'Select Movement Variation' :
                               'Select Fatigue Audit'}
                            </span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setShowPlateauModal(false)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #FF9F0A 0%, #FF6B00 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(255, 159, 10, 0.35)'
                }}
              >
                Got It, Let's Overcome This 💪
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

    {/* Exercise Detail & Demonstration GIF Modal */}
    {createPortal(
      <ExerciseDetailModal
        isOpen={showDetailModal}
        exercise={exerciseObj || {
          id: exerciseId,
          name,
          category,
          equipment,
          imageUrl,
          gifUrl,
          specificMuscle,
          secondaryMuscle,
          requiresWeight
        }}
        onClose={() => setShowDetailModal(false)}
      />,
      document.body
    )}
    </motion.div>
  );
});

export default ExerciseLogger;
