import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, Footprints, Trash2, Check, Zap, MessageSquare } from './Icons';
import { estimateCardioCalories, calculatePace } from '../data/cardioDb';

export default function CardioLogger({
  activity,
  index,
  userWeight = 75,
  unit = 'kg',
  onUpdate,
  onRemove
}) {
  const isImperial = unit === 'lbs';
  const distUnit = isImperial ? 'mi' : 'km';

  const [durationMins, setDurationMins] = useState(activity.durationMinutes !== undefined ? String(activity.durationMinutes) : '20');
  const [durationSecs, setDurationSecs] = useState(activity.durationSeconds !== undefined ? String(activity.durationSeconds) : '0');
  const [distance, setDistance] = useState(activity.distance !== undefined ? String(activity.distance) : '');
  const [incline, setIncline] = useState(activity.incline !== undefined && activity.incline !== null ? String(activity.incline) : '');
  const [resistance, setResistance] = useState(activity.resistance !== undefined && activity.resistance !== null ? String(activity.resistance) : '');
  const [customCalories, setCustomCalories] = useState(activity.customCalories !== undefined ? String(activity.customCalories) : '');
  const [isEditingCal, setIsEditingCal] = useState(false);
  const [notes, setNotes] = useState(activity.notes || '');
  const [showNotes, setShowNotes] = useState(!!activity.notes);
  const [completed, setCompleted] = useState(!!activity.completed);

  // Sync state if activity prop updates
  useEffect(() => {
    if (activity.durationMinutes !== undefined) setDurationMins(String(activity.durationMinutes));
    if (activity.durationSeconds !== undefined) setDurationSecs(String(activity.durationSeconds));
    if (activity.distance !== undefined) setDistance(String(activity.distance));
    if (activity.incline !== undefined && activity.incline !== null) setIncline(String(activity.incline));
    if (activity.resistance !== undefined && activity.resistance !== null) setResistance(String(activity.resistance));
    if (activity.customCalories !== undefined) setCustomCalories(String(activity.customCalories));
    if (activity.notes !== undefined) setNotes(activity.notes);
    if (activity.completed !== undefined) setCompleted(activity.completed);
  }, [activity]);

  // Total duration in minutes (fractional)
  const totalMins = useMemo(() => {
    const m = parseFloat(durationMins) || 0;
    const s = parseFloat(durationSecs) || 0;
    return m + s / 60;
  }, [durationMins, durationSecs]);

  // User weight in kg for MET calculation
  const weightKg = useMemo(() => {
    const w = parseFloat(userWeight) || 75;
    return isImperial ? w * 0.453592 : w;
  }, [userWeight, isImperial]);

  // Estimated Calories
  const estimatedCalories = useMemo(() => {
    return estimateCardioCalories(activity.met || 8.0, weightKg, totalMins);
  }, [activity.met, weightKg, totalMins]);

  // Active Calories (Custom or Estimated)
  const activeCalories = customCalories !== '' ? Number(customCalories) : estimatedCalories;

  // Calculated Pace
  const calculatedPace = useMemo(() => {
    const d = parseFloat(distance) || 0;
    return calculatePace(totalMins, d, distUnit);
  }, [totalMins, distance, distUnit]);

  // Propagate updates to parent
  const emitUpdate = (changes) => {
    if (!onUpdate) return;
    onUpdate(index, {
      ...activity,
      durationMinutes: parseFloat(durationMins) || 0,
      durationSeconds: parseFloat(durationSecs) || 0,
      distance: distance !== '' ? parseFloat(distance) : null,
      incline: incline !== '' ? parseFloat(incline) : null,
      resistance: resistance !== '' ? parseFloat(resistance) : null,
      calories: activeCalories,
      customCalories: customCalories !== '' ? parseFloat(customCalories) : null,
      pace: calculatedPace,
      notes,
      completed,
      ...changes
    });
  };

  const handleToggleComplete = () => {
    const nextCompleted = !completed;
    setCompleted(nextCompleted);
    emitUpdate({ completed: nextCompleted });
  };

  const addMins = (delta) => {
    const current = parseFloat(durationMins) || 0;
    const next = Math.max(1, current + delta);
    setDurationMins(String(next));
    emitUpdate({ durationMinutes: next });
  };

  const addDistance = (delta) => {
    const current = parseFloat(distance) || 0;
    const next = Math.max(0, +(current + delta).toFixed(2));
    setDistance(String(next));
    emitUpdate({ distance: next });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        borderRadius: 18,
        background: completed 
          ? 'linear-gradient(135deg, rgba(20, 24, 20, 0.95) 0%, rgba(15, 18, 16, 0.98) 100%)' 
          : 'linear-gradient(135deg, rgba(26, 18, 16, 0.95) 0%, rgba(20, 16, 16, 0.98) 100%)',
        border: completed 
          ? '1px solid rgba(48, 209, 88, 0.4)' 
          : '1px solid rgba(255, 107, 0, 0.35)',
        boxShadow: completed 
          ? '0 8px 30px rgba(0,0,0,0.5), 0 0 16px rgba(48, 209, 88, 0.15)' 
          : '0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255, 107, 0, 0.12)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border 0.3s, background 0.3s, box-shadow 0.3s'
      }}
    >
      {/* Top Banner & Header */}
      <div style={{
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: completed ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 107, 0, 0.15)',
            border: completed ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid rgba(255, 107, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0
          }}>
            {activity.icon || "🔥"}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                {activity.name}
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 900,
                color: '#FF6B00',
                background: 'rgba(255, 107, 0, 0.15)',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                padding: '2px 7px',
                borderRadius: 6,
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                CARDIO
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600 }}>
                {activity.category}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FF9500', fontSize: 12, fontWeight: 700 }}>
                <Flame size={12} color="#FF9500" />
                <span>{activeCalories} kcal</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: showNotes ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255,255,255,0.06)',
              border: 'none',
              color: showNotes ? '#FF8533' : '#8b90a0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={16} />
          </button>
          <button
            onClick={() => onRemove && onRemove(index)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'rgba(232, 17, 35, 0.1)',
              border: 'none',
              color: '#FF453A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Metric Logging Area */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Metric Row 1: Duration & Distance */}
        <div style={{ display: 'grid', gridTemplateColumns: activity.hasDistance ? '1.1fr 1fr' : '1fr', gap: 12 }}>
          {/* Duration Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            borderRadius: 16,
            padding: '12px 14px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8b90a0', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} color="#FF6B00" /> Duration
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => addMins(-5)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4, padding: '2px 6px', color: '#e2e2e2', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                >
                  -5m
                </button>
                <button
                  onClick={() => addMins(5)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4, padding: '2px 6px', color: '#e2e2e2', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                >
                  +5m
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={durationMins}
                  onChange={(e) => {
                    setDurationMins(e.target.value);
                    emitUpdate({ durationMinutes: parseFloat(e.target.value) || 0 });
                  }}
                  placeholder="0"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 900,
                    outline: 'none',
                    fontFamily: '"JetBrains Mono", monospace'
                  }}
                />
                <span style={{ color: '#8b90a0', fontSize: 12, fontWeight: 700 }}>min</span>
              </div>
              <span style={{ color: '#444', fontWeight: 900 }}>:</span>
              <div style={{ width: 60, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={durationSecs}
                  onChange={(e) => {
                    setDurationSecs(e.target.value);
                    emitUpdate({ durationSeconds: parseFloat(e.target.value) || 0 });
                  }}
                  placeholder="00"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 900,
                    outline: 'none',
                    fontFamily: '"JetBrains Mono", monospace'
                  }}
                />
                <span style={{ color: '#8b90a0', fontSize: 12, fontWeight: 700 }}>sec</span>
              </div>
            </div>
          </div>

          {/* Distance Card (if applicable) */}
          {activity.hasDistance && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.45)',
              borderRadius: 16,
              padding: '12px 14px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8b90a0', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Footprints size={12} color="#00E5FF" /> Distance
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => addDistance(1)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4, padding: '2px 6px', color: '#e2e2e2', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                  >
                    +1
                  </button>
                  <button
                    onClick={() => addDistance(5)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4, padding: '2px 6px', color: '#e2e2e2', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                  >
                    +5
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={distance}
                  onChange={(e) => {
                    setDistance(e.target.value);
                    emitUpdate({ distance: e.target.value !== '' ? parseFloat(e.target.value) : null });
                  }}
                  placeholder="0.0"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#00E5FF',
                    fontSize: 22,
                    fontWeight: 900,
                    outline: 'none',
                    fontFamily: '"JetBrains Mono", monospace'
                  }}
                />
                <span style={{ color: '#8b90a0', fontSize: 12, fontWeight: 700 }}>{distUnit}</span>
              </div>
            </div>
          )}
        </div>

        {/* Metric Row 2: Secondary / Machine specific fields (Pace, Calories, Incline, Resistance) */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Calculated Pace pill */}
          {calculatedPace && (
            <div style={{
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              padding: '6px 12px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#00E5FF',
              fontWeight: 800
            }}>
              <Zap size={13} color="#00E5FF" />
              <span>Pace: {calculatedPace}</span>
            </div>
          )}

          {/* Calories Pill / Editor */}
          <div style={{
            background: 'rgba(255, 107, 0, 0.08)',
            border: '1px solid rgba(255, 107, 0, 0.25)',
            padding: '6px 12px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#FF8533',
            fontWeight: 800
          }}>
            <Flame size={13} color="#FF8533" />
            {!isEditingCal ? (
              <span onClick={() => setIsEditingCal(true)} style={{ cursor: 'pointer' }} title="Tap to enter exact machine calories">
                {activeCalories} kcal {customCalories !== '' ? '(manual)' : '(est.)'}
              </span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  placeholder={String(estimatedCalories)}
                  autoFocus
                  onBlur={() => {
                    setIsEditingCal(false);
                    emitUpdate({ customCalories: customCalories !== '' ? parseFloat(customCalories) : null });
                  }}
                  style={{
                    width: 54,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid #FF8533',
                    color: '#fff',
                    borderRadius: 4,
                    padding: '2px 4px',
                    fontSize: 12,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => {
                    setIsEditingCal(false);
                    emitUpdate({ customCalories: customCalories !== '' ? parseFloat(customCalories) : null });
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#FF8533', cursor: 'pointer', fontSize: 11, fontWeight: 800 }}
                >
                  OK
                </button>
              </div>
            )}
          </div>

          {/* Incline (e.g. Treadmill) */}
          {activity.hasIncline && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '4px 10px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <span style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700 }}>Incline:</span>
              <input
                type="number"
                step="0.5"
                value={incline}
                onChange={(e) => {
                  setIncline(e.target.value);
                  emitUpdate({ incline: e.target.value !== '' ? parseFloat(e.target.value) : null });
                }}
                placeholder="0"
                style={{
                  width: 36,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 800,
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
              <span style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700 }}>%</span>
            </div>
          )}

          {/* Resistance (e.g. Stationary Bike, Rower) */}
          {activity.hasResistance && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '4px 10px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <span style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700 }}>Level:</span>
              <input
                type="number"
                value={resistance}
                onChange={(e) => {
                  setResistance(e.target.value);
                  emitUpdate({ resistance: e.target.value !== '' ? parseFloat(e.target.value) : null });
                }}
                placeholder="1"
                style={{
                  width: 36,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 800,
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
            </div>
          )}
        </div>

        {/* Optional Notes */}
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                emitUpdate({ notes: e.target.value });
              }}
              placeholder="Add cardio notes (e.g. intervals, heart rate, perceived effort)..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: '8px 12px',
                color: '#e2e2e2',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </motion.div>
        )}

        {/* Completion Action Bar */}
        <div style={{ marginTop: 4 }}>
          <button
            onClick={handleToggleComplete}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 14,
              background: completed
                ? 'linear-gradient(135deg, #30D158 0%, #248A3D 100%)'
                : 'linear-gradient(135deg, #FF6B00 0%, #E65100 100%)',
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: completed
                ? '0 4px 16px rgba(48, 209, 88, 0.35)'
                : '0 4px 16px rgba(255, 107, 0, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <Check size={18} strokeWidth={3} />
            {completed ? 'Cardio Activity Completed ✓' : 'Mark Cardio Complete'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
