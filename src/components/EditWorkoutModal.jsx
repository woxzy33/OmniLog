import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash, Plus, ChevronUp, ChevronDown, Edit2, Calendar, Clock, Dumbbell, Flame } from './Icons';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import CardioSelectorModal from './CardioSelectorModal';
import { ConfirmDeleteModal, ErrorModal } from './WorkoutSafeguards';
import { uid, exerciseRequiresWeight } from '../data/exerciseDb';
import { formatWeight, parseDisplayWeight, translateExerciseName } from '../utils';
import { useTranslation } from 'react-i18next';

const MAX_SESSION_NAME_LENGTH = 25;

const SET_TYPE_DETAILS = [
  {
    key: 'N',
    title: 'Normal Working Set',
    description: 'Primary working stimulus for progressive overload',
    badgeBg: '#1C1C1E',
    badgeText: '#E5E7EB',
    badgeBorder: 'rgba(255,255,255,0.15)'
  },
  {
    key: 'W',
    title: 'Warm-up Set',
    description: 'Ramped load to prime nervous system without fatigue',
    badgeBg: 'rgba(255, 159, 10, 0.2)',
    badgeText: '#FF9F0A',
    badgeBorder: 'rgba(255, 159, 10, 0.45)'
  },
  {
    key: 'D',
    title: 'Drop Set',
    description: 'Immediate load reduction (~20–30%) to extend fatigue',
    badgeBg: 'rgba(239, 68, 68, 0.2)',
    badgeText: '#F87171',
    badgeBorder: 'rgba(239, 68, 68, 0.4)'
  },
  {
    key: 'F',
    title: 'Failure Set',
    description: 'Max-effort set pushed to 0 RIR technical failure',
    badgeBg: 'rgba(138, 43, 226, 0.2)',
    badgeText: '#C084FC',
    badgeBorder: 'rgba(138, 43, 226, 0.45)'
  }
];

const toLocalISOString = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return '';
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localTime = new Date(d.getTime() - tzOffset);
  return localTime.toISOString().slice(0, 16);
};

export default function EditWorkoutModal({ session, data, onSave, onDelete, onClose, settings }) {
  const { t } = useTranslation();
  const unit = settings?.unit || 'kg';

  // Deep clone session to isolate edits in local state
  const [sessionData, setSessionData] = useState(() => {
    const clone = JSON.parse(JSON.stringify(session));
    return {
      ...clone,
      name: clone.name || 'Workout',
      date: clone.date || new Date().toISOString(),
      durationMins: clone.durationMins !== undefined ? Number(clone.durationMins) : 45,
      exercises: (clone.exercises || []).map(ex => ({
        ...ex,
        id: ex.id || uid(),
        notes: ex.notes || '',
        sets: (ex.sets || []).map(s => ({
          weight: s.weight !== undefined && s.weight !== null ? s.weight : '',
          reps: s.reps !== undefined && s.reps !== null ? s.reps : '',
          rpe: s.rpe || s.effort || '',
          type: s.type || 'N',
          completed: s.completed !== undefined ? !!s.completed : true
        }))
      })),
      cardioActivities: (clone.cardioActivities || []).map(c => ({
        ...c,
        id: c.id || uid(),
        completed: c.completed !== undefined ? !!c.completed : true
      }))
    };
  });

  const [initialJson] = useState(() => JSON.stringify(sessionData));
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showAddCardio, setShowAddCardio] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null); // { type: 'workout'|'exercise', index, name }
  const [activeSetTypePicker, setActiveSetTypePicker] = useState(null); // { exIndex, setIndex }
  const [validationError, setValidationError] = useState(null);

  // Exercise lookup dictionary
  const exerciseDict = useMemo(() => {
    const dict = {};
    (data?.exercises || []).forEach(e => { dict[e.id] = e; });
    return dict;
  }, [data?.exercises]);

  const isNameEmpty = !sessionData.name || sessionData.name.trim() === '';
  const isNameTooLong = (sessionData.name || '').trim().length > MAX_SESSION_NAME_LENGTH;

  // Handle Date Time change
  const handleDateChange = (e) => {
    const localVal = e.target.value;
    if (!localVal) return;
    const d = new Date(localVal);
    if (!isNaN(d.getTime())) {
      setSessionData(prev => ({ ...prev, date: d.toISOString() }));
    }
  };

  // Exercise manipulation handlers
  const handleMoveExercise = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sessionData.exercises.length) return;
    setSessionData(prev => {
      const nextExercises = [...prev.exercises];
      const temp = nextExercises[index];
      nextExercises[index] = nextExercises[targetIndex];
      nextExercises[targetIndex] = temp;
      return { ...prev, exercises: nextExercises };
    });
  };

  const handleDeleteExercise = (index) => {
    setSessionData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
    setDeleteConfirmTarget(null);
  };

  const handleAddExercise = (selectedEx) => {
    const newEx = {
      id: uid(),
      exerciseId: selectedEx.id,
      notes: '',
      sets: [
        { weight: '', reps: '', rpe: '', type: 'N', completed: true }
      ]
    };
    setSessionData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newEx]
    }));
    setShowAddExercise(false);
  };

  // Set manipulation handlers
  const handleAddSet = (exIndex) => {
    setSessionData(prev => {
      const nextExercises = [...prev.exercises];
      const ex = nextExercises[exIndex];
      const lastSet = ex.sets && ex.sets.length > 0 ? ex.sets[ex.sets.length - 1] : null;
      const newSet = {
        weight: lastSet ? lastSet.weight : '',
        reps: lastSet ? lastSet.reps : '',
        rpe: lastSet ? lastSet.rpe : '',
        type: lastSet ? lastSet.type : 'N',
        completed: true
      };
      nextExercises[exIndex] = {
        ...ex,
        sets: [...(ex.sets || []), newSet]
      };
      return { ...prev, exercises: nextExercises };
    });
  };

  const handleDeleteSet = (exIndex, setIndex) => {
    setSessionData(prev => {
      const nextExercises = [...prev.exercises];
      const ex = nextExercises[exIndex];
      const nextSets = ex.sets.filter((_, i) => i !== setIndex);
      nextExercises[exIndex] = { ...ex, sets: nextSets };
      return { ...prev, exercises: nextExercises };
    });
  };

  const handleUpdateSet = (exIndex, setIndex, field, value) => {
    setSessionData(prev => {
      const nextExercises = [...prev.exercises];
      const ex = nextExercises[exIndex];
      const nextSets = [...ex.sets];
      nextSets[setIndex] = { ...nextSets[setIndex], [field]: value };
      nextExercises[exIndex] = { ...ex, sets: nextSets };
      return { ...prev, exercises: nextExercises };
    });
  };

  // Cardio handlers
  const handleAddCardio = (cardioName) => {
    const newCardio = {
      id: uid(),
      type: cardioName,
      durationMinutes: 15,
      durationSeconds: 0,
      distance: 2.0,
      calories: 120,
      completed: true
    };
    setSessionData(prev => ({
      ...prev,
      cardioActivities: [...(prev.cardioActivities || []), newCardio]
    }));
    setShowAddCardio(false);
  };

  const handleUpdateCardio = (cardioIndex, field, value) => {
    setSessionData(prev => {
      const nextCardio = [...(prev.cardioActivities || [])];
      nextCardio[cardioIndex] = { ...nextCardio[cardioIndex], [field]: value };
      return { ...prev, cardioActivities: nextCardio };
    });
  };

  const handleDeleteCardio = (cardioIndex) => {
    setSessionData(prev => ({
      ...prev,
      cardioActivities: (prev.cardioActivities || []).filter((_, i) => i !== cardioIndex)
    }));
  };

  // Save handler with validation
  const handleSave = () => {
    if (isNameEmpty) {
      setValidationError("Session name cannot be empty.");
      return;
    }
    if (isNameTooLong) {
      setValidationError(`Session name cannot exceed ${MAX_SESSION_NAME_LENGTH} characters.`);
      return;
    }
    if ((sessionData.exercises || []).length === 0 && (sessionData.cardioActivities || []).length === 0) {
      setValidationError("Workout must contain at least one exercise or cardio activity.");
      return;
    }

    // Clean and sanitize numbers
    const sanitizedExercises = (sessionData.exercises || []).map(ex => ({
      ...ex,
      notes: (ex.notes || '').trim(),
      sets: (ex.sets || []).map(s => {
        let cleanWeight = s.weight === '' || s.weight === null ? '' : Number(s.weight);
        if (isNaN(cleanWeight)) cleanWeight = '';
        let cleanReps = s.reps === '' || s.reps === null ? '' : Math.max(0, parseInt(s.reps, 10));
        if (isNaN(cleanReps)) cleanReps = '';

        return {
          weight: cleanWeight,
          reps: cleanReps,
          rpe: s.rpe !== '' && !isNaN(Number(s.rpe)) ? Number(s.rpe) : '',
          type: s.type || 'N',
          completed: !!s.completed
        };
      })
    }));

    const sanitizedCardio = (sessionData.cardioActivities || []).map(c => ({
      ...c,
      durationMinutes: Math.max(0, Number(c.durationMinutes) || 0),
      durationSeconds: Math.max(0, Math.min(59, Number(c.durationSeconds) || 0)),
      distance: Math.max(0, Number(c.distance) || 0),
      calories: Math.max(0, Number(c.calories) || 0),
      completed: !!c.completed
    }));

    const finalSession = {
      ...sessionData,
      name: sessionData.name.trim(),
      durationMins: Math.max(1, Number(sessionData.durationMins) || 1),
      exercises: sanitizedExercises,
      cardioActivities: sanitizedCardio,
      updatedAt: Date.now()
    };

    onSave(finalSession);
  };

  const handleCancel = () => {
    const isDirty = JSON.stringify(sessionData) !== initialJson;
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Discard them?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 550,
        background: '#0d0e12',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))'
      }}
    >
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        background: 'rgba(13, 14, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        padding: '14px 16px',
        paddingTop: 'calc(14px + env(safe-area-inset-top, 0px))',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={handleCancel}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            color: '#e2e2e2',
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
            Edit Workout
          </div>
          <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600 }}>
            Historical Corrections
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isNameEmpty || isNameTooLong}
          style={{
            background: isNameEmpty || isNameTooLong ? '#2c2c2e' : 'var(--primary)',
            color: isNameEmpty || isNameTooLong ? '#6b7080' : '#000',
            border: 'none',
            borderRadius: 10,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 800,
            cursor: isNameEmpty || isNameTooLong ? 'not-allowed' : 'pointer',
            boxShadow: isNameEmpty || isNameTooLong ? 'none' : '0 2px 10px rgba(var(--primary-rgb), 0.3)',
            transition: 'all 0.2s'
          }}
        >
          Save
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640, width: '100%', margin: '0 auto' }}>
        {/* Workout Metadata Card */}
        <div style={{
          background: 'rgba(24, 25, 29, 0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          {/* Name Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Session Name
              </label>
              <span style={{ fontSize: 11, fontWeight: 600, color: isNameTooLong ? '#D94A4A' : '#6b7080' }}>
                {(sessionData.name || '').trim().length}/{MAX_SESSION_NAME_LENGTH}
              </span>
            </div>
            <input
              type="text"
              value={sessionData.name}
              onChange={e => setSessionData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Push Day Heavy"
              style={{
                width: '100%',
                background: '#121316',
                border: isNameEmpty || isNameTooLong ? '1.5px solid #D94A4A' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                padding: '10px 14px',
                color: isNameTooLong ? '#D94A4A' : '#fff',
                fontSize: 15,
                fontWeight: 700,
                outline: 'none'
              }}
            />
            {(isNameEmpty || isNameTooLong) && (
              <div style={{ color: '#D94A4A', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                {isNameEmpty ? '! Session name cannot be empty.' : `! Exceeds ${MAX_SESSION_NAME_LENGTH} characters.`}
              </div>
            )}
          </div>

          {/* Date & Duration Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Date Time Picker */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <Calendar size={13} /> Date & Time
              </label>
              <input
                type="datetime-local"
                value={toLocalISOString(sessionData.date)}
                onChange={handleDateChange}
                style={{
                  width: '100%',
                  background: '#121316',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  padding: '9px 10px',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
            </div>

            {/* Duration Minutes */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <Clock size={13} /> Duration (mins)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setSessionData(prev => ({ ...prev, durationMins: Math.max(1, (Number(prev.durationMins) || 45) - 5) }))}
                  style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  -5
                </button>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={sessionData.durationMins}
                  onChange={e => setSessionData(prev => ({ ...prev, durationMins: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                  style={{
                    width: '100%',
                    background: '#121316',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                    padding: '9px 8px',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSessionData(prev => ({ ...prev, durationMins: (Number(prev.durationMins) || 45) + 5 }))}
                  style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '8px 10px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                >
                  +5
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.02em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 16, background: 'var(--primary)', borderRadius: 2 }} />
              Exercises ({sessionData.exercises.length})
            </div>
          </div>

          {sessionData.exercises.map((ex, exIdx) => {
            const exMeta = exerciseDict[ex.exerciseId] || { name: 'Custom Exercise', category: 'Chest', equipment: 'Barbell' };
            const requiresWeight = exerciseRequiresWeight(exMeta);

            return (
              <div
                key={ex.id || exIdx}
                style={{
                  background: 'rgba(24, 25, 29, 0.9)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                {/* Exercise Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                      {translateExerciseName(exMeta.name, t)}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      {exMeta.category && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', background: 'rgba(var(--primary-rgb), 0.12)', padding: '2px 8px', borderRadius: 6 }}>
                          {exMeta.category}
                        </span>
                      )}
                      {exMeta.equipment && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#8b90a0', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>
                          {exMeta.equipment}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Reorder & Delete Exercise */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      type="button"
                      disabled={exIdx === 0}
                      onClick={() => handleMoveExercise(exIdx, -1)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: exIdx === 0 ? '#444' : '#8b90a0',
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: exIdx === 0 ? 'default' : 'pointer'
                      }}
                      title="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={exIdx === sessionData.exercises.length - 1}
                      onClick={() => handleMoveExercise(exIdx, 1)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: exIdx === sessionData.exercises.length - 1 ? '#444' : '#8b90a0',
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: exIdx === sessionData.exercises.length - 1 ? 'default' : 'pointer'
                      }}
                      title="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmTarget({ type: 'exercise', index: exIdx, name: exMeta.name })}
                      style={{
                        background: 'rgba(232, 17, 35, 0.1)',
                        border: 'none',
                        color: '#FF453A',
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginLeft: 4
                      }}
                      title="Remove exercise"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                </div>

                {/* Notes Input */}
                <input
                  type="text"
                  placeholder="Notes for this exercise (optional)..."
                  value={ex.notes || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setSessionData(prev => {
                      const nextExercises = [...prev.exercises];
                      nextExercises[exIdx] = { ...nextExercises[exIdx], notes: val };
                      return { ...prev, exercises: nextExercises };
                    });
                  }}
                  style={{
                    width: '100%',
                    background: '#121316',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#e2e2e2',
                    outline: 'none'
                  }}
                />

                {/* Sets Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: requiresWeight ? '32px 48px 1fr 1fr 44px 34px 28px' : '32px 48px 1fr 44px 34px 28px',
                    gap: 6,
                    alignItems: 'center',
                    padding: '4px 6px',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#8b90a0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    <div style={{ textAlign: 'center' }}>#</div>
                    <div style={{ textAlign: 'center' }}>Type</div>
                    {requiresWeight && <div>{unit.toUpperCase()}</div>}
                    <div>Reps</div>
                    <div style={{ textAlign: 'center' }}>RPE</div>
                    <div style={{ textAlign: 'center' }}>✓</div>
                    <div />
                  </div>

                  {/* Sets Rows */}
                  {(ex.sets || []).map((set, sIdx) => {
                    const typeConfig = SET_TYPE_DETAILS.find(t => t.key === (set.type || 'N')) || SET_TYPE_DETAILS[0];

                    return (
                      <div
                        key={sIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: requiresWeight ? '32px 48px 1fr 1fr 44px 34px 28px' : '32px 48px 1fr 44px 34px 28px',
                          gap: 6,
                          alignItems: 'center',
                          background: set.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.005)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 8,
                          padding: '6px'
                        }}
                      >
                        {/* Set Number */}
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#8b90a0', textAlign: 'center' }}>
                          {sIdx + 1}
                        </div>

                        {/* Set Type Pill Button */}
                        <button
                          type="button"
                          onClick={() => setActiveSetTypePicker({ exIndex: exIdx, setIndex: sIdx })}
                          style={{
                            background: typeConfig.badgeBg,
                            color: typeConfig.badgeText,
                            border: `1px solid ${typeConfig.badgeBorder}`,
                            borderRadius: 6,
                            padding: '4px 0',
                            fontSize: 11,
                            fontWeight: 900,
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                          title={`Type: ${typeConfig.title}`}
                        >
                          {set.type || 'N'}
                        </button>

                        {/* Weight Input (if applicable) */}
                        {requiresWeight && (
                          <input
                            type="number"
                            step="any"
                            placeholder="0"
                            value={set.weight}
                            onChange={e => handleUpdateSet(exIdx, sIdx, 'weight', e.target.value)}
                            style={{
                              width: '100%',
                              background: '#121316',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 6,
                              padding: '6px 8px',
                              fontSize: 14,
                              fontWeight: 700,
                              color: '#fff',
                              textAlign: 'center',
                              outline: 'none'
                            }}
                          />
                        )}

                        {/* Reps Input */}
                        <input
                          type="number"
                          step="1"
                          placeholder="0"
                          value={set.reps}
                          onChange={e => handleUpdateSet(exIdx, sIdx, 'reps', e.target.value)}
                          style={{
                            width: '100%',
                            background: '#121316',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 6,
                            padding: '6px 8px',
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#fff',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />

                        {/* RPE Input */}
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="10"
                          placeholder="-"
                          value={set.rpe}
                          onChange={e => handleUpdateSet(exIdx, sIdx, 'rpe', e.target.value)}
                          style={{
                            width: '100%',
                            background: '#121316',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 6,
                            padding: '6px 4px',
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#e2e2e2',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />

                        {/* Completed Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleUpdateSet(exIdx, sIdx, 'completed', !set.completed)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: set.completed ? '#30D158' : 'rgba(255,255,255,0.06)',
                            border: set.completed ? 'none' : '1px solid rgba(255,255,255,0.15)',
                            color: set.completed ? '#000' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            margin: '0 auto'
                          }}
                          title={set.completed ? "Mark incomplete" : "Mark completed"}
                        >
                          <Check size={16} strokeWidth={3} />
                        </button>

                        {/* Delete Set Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSet(exIdx, sIdx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#6b7080',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 4
                          }}
                          title="Delete set"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Set Button */}
                <button
                  type="button"
                  onClick={() => handleAddSet(exIdx)}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    padding: '8px',
                    color: '#e2e2e2',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    marginTop: 4
                  }}
                >
                  <Plus size={14} /> Add Set
                </button>
              </div>
            );
          })}

          {/* Add Exercise CTA */}
          <button
            type="button"
            onClick={() => setShowAddExercise(true)}
            style={{
              background: 'rgba(var(--primary-rgb), 0.08)',
              border: '1.5px dashed rgba(var(--primary-rgb), 0.35)',
              borderRadius: 14,
              padding: '14px',
              color: 'var(--primary)',
              fontSize: 14,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              marginTop: 4
            }}
          >
            <Plus size={18} /> Add Exercise
          </button>
        </div>

        {/* Cardio Activities Section */}
        {((sessionData.cardioActivities && sessionData.cardioActivities.length > 0) || showAddCardio) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.02em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 16, background: '#FF9F0A', borderRadius: 2 }} />
              Cardio Activities ({sessionData.cardioActivities?.length || 0})
            </div>

            {(sessionData.cardioActivities || []).map((cardio, cIdx) => (
              <div
                key={cardio.id || cIdx}
                style={{
                  background: 'rgba(24, 25, 29, 0.9)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Flame size={16} color="#FF9F0A" /> {cardio.type || 'Cardio'}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCardio(cIdx)}
                    style={{ background: 'rgba(232, 17, 35, 0.1)', border: 'none', color: '#FF453A', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
                  >
                    <Trash size={14} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#8b90a0' }}>Mins</label>
                    <input
                      type="number"
                      value={cardio.durationMinutes}
                      onChange={e => handleUpdateCardio(cIdx, 'durationMinutes', e.target.value)}
                      style={{ width: '100%', background: '#121316', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 8px', color: '#fff', fontSize: 13, fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#8b90a0' }}>Distance (km/mi)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cardio.distance}
                      onChange={e => handleUpdateCardio(cIdx, 'distance', e.target.value)}
                      style={{ width: '100%', background: '#121316', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 8px', color: '#fff', fontSize: 13, fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#8b90a0' }}>Calories</label>
                    <input
                      type="number"
                      value={cardio.calories}
                      onChange={e => handleUpdateCardio(cIdx, 'calories', e.target.value)}
                      style={{ width: '100%', background: '#121316', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 8px', color: '#fff', fontSize: 13, fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cardio Add Button */}
        {(!sessionData.cardioActivities || sessionData.cardioActivities.length === 0) && (
          <button
            type="button"
            onClick={() => setShowAddCardio(true)}
            style={{
              background: 'rgba(255, 159, 10, 0.08)',
              border: '1.5px dashed rgba(255, 159, 10, 0.35)',
              borderRadius: 14,
              padding: '12px',
              color: '#FF9F0A',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Flame size={16} /> Add Cardio Activity
          </button>
        )}

        {/* Danger Zone: Delete Entire Workout */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Danger Zone
          </div>
          <button
            type="button"
            onClick={() => setDeleteConfirmTarget({ type: 'workout', name: sessionData.name || 'this workout' })}
            style={{
              background: 'rgba(232, 17, 35, 0.08)',
              border: '1.5px solid rgba(232, 17, 35, 0.3)',
              borderRadius: 12,
              padding: '14px',
              color: '#FF453A',
              fontSize: 14,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Trash size={16} /> Delete Entire Workout
          </button>
        </div>
      </div>

      {/* Set Type Bottom Sheet Modal */}
      {activeSetTypePicker && createPortal(
        <div 
          id="edit-set-type-bottom-sheet"
          className="fixed inset-0 z-[9999] flex flex-col justify-end"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSetTypePicker(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-lg mx-auto bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-5 shadow-2xl"
            style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Select Set Type</h3>
                <p className="text-xs text-slate-400">Classify set category for volume & load targets</p>
              </div>
              <button 
                onClick={() => setActiveSetTypePicker(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {SET_TYPE_DETAILS.map((typeObj) => {
                const currentSet = sessionData.exercises[activeSetTypePicker.exIndex]?.sets[activeSetTypePicker.setIndex];
                const isSelected = currentSet?.type === typeObj.key;

                return (
                  <button
                    key={typeObj.key}
                    type="button"
                    onClick={() => {
                      handleUpdateSet(activeSetTypePicker.exIndex, activeSetTypePicker.setIndex, 'type', typeObj.key);
                      setActiveSetTypePicker(null);
                    }}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50' 
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                      style={{ 
                        background: typeObj.badgeBg, 
                        color: typeObj.badgeText, 
                        border: `1px solid ${typeObj.badgeBorder}` 
                      }}
                    >
                      {typeObj.key}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{typeObj.title}</span>
                        {isSelected && (
                          <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{typeObj.description}</p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500 text-black' : 'border-slate-600'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3.5} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Exercise Selector Modal */}
      {showAddExercise && (
        <ExerciseSelectorModal
          data={data}
          onClose={() => setShowAddExercise(false)}
          onSelect={handleAddExercise}
          existingExerciseIds={sessionData.exercises.map(e => e.exerciseId)}
        />
      )}

      {/* Cardio Selector Modal */}
      {showAddCardio && (
        <CardioSelectorModal
          isOpen={showAddCardio}
          onClose={() => setShowAddCardio(false)}
          onSelectActivity={handleAddCardio}
          customActivities={data?.customCardioActivities || []}
        />
      )}

      {/* Confirm Deletion Safeguard */}
      {deleteConfirmTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteConfirmTarget}
          onClose={() => setDeleteConfirmTarget(null)}
          onConfirm={() => {
            if (deleteConfirmTarget.type === 'workout') {
              onDelete(session.id);
            } else if (deleteConfirmTarget.type === 'exercise') {
              handleDeleteExercise(deleteConfirmTarget.index);
            }
          }}
          itemName={deleteConfirmTarget.name}
        />
      )}

      {/* Validation Error Modal */}
      <ErrorModal
        isOpen={!!validationError}
        onClose={() => setValidationError(null)}
        message={validationError}
        title="Validation Error"
      />
    </motion.div>
  );
}
