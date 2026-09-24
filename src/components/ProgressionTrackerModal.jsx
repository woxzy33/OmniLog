import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Trophy, Dumbbell, Calendar, Clock, ChevronRight, Check, Search, Filter } from './Icons';
import { formatWeight, calculate1RM, parseVolume } from '../utils';

const METRIC_LABELS = {
  weight: "Weight", bodyFat: "Body Fat", chest: "Chest", leftArm: "L. Arm", rightArm: "R. Arm",
  leftThigh: "L. Thigh", rightThigh: "R. Thigh", waist: "Waist", calves: "Calves", neck: "Neck",
  shoulders: "Shoulders", height: "Height"
};

export default function ProgressionTrackerModal({ isOpen, onClose, data }) {
  const [timeframe, setTimeframe] = useState('1m'); // '1m' | '3m' | '1y'
  const [activeTab, setActiveTab] = useState('recap'); // 'recap' | 'exercises' | 'measurements'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const settings = data?.settings || { unit: 'kg' };
  const unit = settings.unit || 'kg';

  // Calculate cutoff timestamp based on timeframe
  const { cutoffTime, periodDays, periodLabel } = useMemo(() => {
    const now = Date.now();
    if (timeframe === '1m') return { cutoffTime: now - 30 * 24 * 60 * 60 * 1000, periodDays: 30, periodLabel: 'Past 30 Days' };
    if (timeframe === '3m') return { cutoffTime: now - 90 * 24 * 60 * 60 * 1000, periodDays: 90, periodLabel: 'Past 3 Months' };
    return { cutoffTime: now - 365 * 24 * 60 * 60 * 1000, periodDays: 365, periodLabel: 'Past 1 Year' };
  }, [timeframe]);

  // Filter sessions within period
  const allSessions = useMemo(() => {
    return [...(data?.sessions || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data?.sessions]);

  const periodSessions = useMemo(() => {
    return allSessions.filter(s => new Date(s.date).getTime() >= cutoffTime);
  }, [allSessions, cutoffTime]);

  // Comprehensive Exercise Progression calculation
  const exerciseProgressions = useMemo(() => {
    const exMap = {};

    // Group all user sessions by exercise
    allSessions.forEach(sess => {
      const sessTime = new Date(sess.date).getTime();
      const inPeriod = sessTime >= cutoffTime;

      (sess.exercises || []).forEach(ex => {
        if (!exMap[ex.exerciseId]) {
          exMap[ex.exerciseId] = {
            exerciseId: ex.exerciseId,
            allInstances: [],
            periodInstances: []
          };
        }

        let maxWeight = 0;
        let maxReps = 0;
        let max1RM = 0;
        let vol = 0;
        let prCount = 0;
        let completedSets = 0;

        (ex.sets || []).forEach(s => {
          if (s.completed) {
            completedSets++;
            const w = Number(s.weight) || 0;
            const r = Number(s.reps) || 0;
            if (w > maxWeight) {
              maxWeight = w;
              maxReps = r;
            }
            const cur1RM = calculate1RM(w, r);
            if (cur1RM > max1RM) max1RM = cur1RM;
            vol += parseVolume(w, r);
            if (s.isPR) prCount++;
          }
        });

        if (completedSets > 0) {
          const inst = {
            date: sess.date,
            timestamp: sessTime,
            maxWeight,
            maxReps,
            max1RM,
            vol,
            prCount,
            completedSets
          };
          exMap[ex.exerciseId].allInstances.push(inst);
          if (inPeriod) {
            exMap[ex.exerciseId].periodInstances.push(inst);
          }
        }
      });
    });

    const results = [];

    Object.values(exMap).forEach(item => {
      // "Only exercises that have been done by user should be tracked"
      if (item.periodInstances.length === 0) return;

      const exObj = (data?.exercises || []).find(e => e.id === item.exerciseId);
      const name = exObj?.name || 'Unknown Exercise';
      const category = exObj?.category || 'Other';

      // Determine baseline and current
      let baselineInstance = null;
      let currentInstance = item.periodInstances[item.periodInstances.length - 1];

      if (item.periodInstances.length >= 2) {
        baselineInstance = item.periodInstances[0];
      } else {
        // If only 1 instance in period, check if there is an instance before period
        const priorInstances = item.allInstances.filter(i => i.timestamp < cutoffTime);
        if (priorInstances.length > 0) {
          baselineInstance = priorInstances[priorInstances.length - 1];
        } else {
          // If only 1 session ever, baseline is that session
          baselineInstance = item.periodInstances[0];
        }
      }

      const startWeight = baselineInstance.maxWeight;
      const currentWeight = currentInstance.maxWeight;
      const weightDelta = currentWeight - startWeight;
      const weightPercent = startWeight > 0 ? (weightDelta / startWeight) * 100 : 0;

      const start1RM = baselineInstance.max1RM;
      const current1RM = currentInstance.max1RM;
      const oneRmDelta = current1RM - start1RM;
      const oneRmPercent = start1RM > 0 ? (oneRmDelta / start1RM) * 100 : 0;

      let totalPeriodVol = 0;
      let totalPeriodSets = 0;
      let totalPeriodPRs = 0;

      item.periodInstances.forEach(pi => {
        totalPeriodVol += pi.vol;
        totalPeriodSets += pi.completedSets;
        totalPeriodPRs += pi.prCount;
      });

      results.push({
        id: item.exerciseId,
        name,
        category,
        startWeight,
        currentWeight,
        weightDelta,
        weightPercent,
        start1RM,
        current1RM,
        oneRmDelta,
        oneRmPercent,
        totalPeriodVol,
        totalPeriodSets,
        totalPeriodPRs,
        sessionCount: item.periodInstances.length
      });
    });

    // Sort by highest percentage progression first
    return results.sort((a, b) => b.weightPercent - a.weightPercent);
  }, [allSessions, cutoffTime, data?.exercises]);

  // Measurements Improvement calculation
  const measurementProgressions = useMemo(() => {
    const allMeasures = [...(data?.measurements || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (allMeasures.length === 0) return [];

    // Find which metrics have ever been entered by the user
    const enteredMetrics = Object.keys(METRIC_LABELS).filter(m => {
      return allMeasures.some(entry => entry[m] !== undefined && entry[m] !== null && entry[m] !== '');
    });

    const results = [];

    enteredMetrics.forEach(metricKey => {
      // Filter entries that have this metric
      const entriesForMetric = allMeasures.filter(e => e[metricKey] !== undefined && e[metricKey] !== null && e[metricKey] !== '');
      if (entriesForMetric.length === 0) return;

      const inPeriodEntries = entriesForMetric.filter(e => new Date(e.date).getTime() >= cutoffTime);

      let baselineEntry = null;
      let currentEntry = null;

      if (inPeriodEntries.length >= 2) {
        baselineEntry = inPeriodEntries[0];
        currentEntry = inPeriodEntries[inPeriodEntries.length - 1];
      } else if (inPeriodEntries.length === 1) {
        currentEntry = inPeriodEntries[0];
        const prior = entriesForMetric.filter(e => new Date(e.date).getTime() < cutoffTime);
        baselineEntry = prior.length > 0 ? prior[prior.length - 1] : inPeriodEntries[0];
      } else {
        // No entries in period, show latest available
        baselineEntry = entriesForMetric[0];
        currentEntry = entriesForMetric[entriesForMetric.length - 1];
      }

      const startVal = Number(baselineEntry[metricKey]) || 0;
      const currentVal = Number(currentEntry[metricKey]) || 0;
      const delta = currentVal - startVal;
      const percentDelta = startVal > 0 ? (delta / startVal) * 100 : 0;

      const isImperial = unit === 'lbs';
      let unitLabel = 'cm';
      let displayStart = startVal;
      let displayCurrent = currentVal;
      let displayDelta = delta;

      if (metricKey === 'weight') {
        unitLabel = unit;
        displayStart = isImperial ? startVal * 2.20462 : startVal;
        displayCurrent = isImperial ? currentVal * 2.20462 : currentVal;
        displayDelta = isImperial ? delta * 2.20462 : delta;
      } else if (metricKey === 'bodyFat') {
        unitLabel = '%';
      } else {
        unitLabel = isImperial ? 'in' : 'cm';
        displayStart = isImperial ? startVal / 2.54 : startVal;
        displayCurrent = isImperial ? currentVal / 2.54 : currentVal;
        displayDelta = isImperial ? delta / 2.54 : delta;
      }

      // Progress orientation:
      // Waist and Body Fat: decrease is good
      // Arms, Chest, Thighs, Shoulders, Calves: increase is muscle gain
      let isPositive = false;
      let improvementType = 'neutral';
      if (metricKey === 'waist' || metricKey === 'bodyFat') {
        if (delta < 0) {
          isPositive = true;
          improvementType = 'slimming';
        }
      } else if (['chest', 'leftArm', 'rightArm', 'leftThigh', 'rightThigh', 'shoulders', 'calves'].includes(metricKey)) {
        if (delta > 0) {
          isPositive = true;
          improvementType = 'hypertrophy';
        }
      } else {
        isPositive = delta !== 0;
      }

      results.push({
        metricKey,
        label: METRIC_LABELS[metricKey],
        startVal: displayStart.toFixed(1),
        currentVal: displayCurrent.toFixed(1),
        delta: displayDelta.toFixed(1),
        percentDelta: percentDelta.toFixed(1),
        numericDelta: displayDelta,
        unitLabel,
        isPositive,
        improvementType,
        lastLoggedDate: currentEntry.date
      });
    });

    return results;
  }, [data?.measurements, cutoffTime, unit]);

  // Overall Executive Recap Aggregates
  const recap = useMemo(() => {
    let totalWorkouts = periodSessions.length;
    let totalVol = 0;
    let totalReps = 0;
    let totalPRs = 0;
    let totalDurationMins = 0;

    periodSessions.forEach(s => {
      totalDurationMins += Number(s.durationMins) || 0;
      (s.exercises || []).forEach(ex => {
        (ex.sets || []).forEach(st => {
          if (st.completed) {
            const w = Number(st.weight) || 0;
            const r = Number(st.reps) || 0;
            totalVol += parseVolume(w, r);
            totalReps += r;
            if (st.isPR) totalPRs++;
          }
        });
      });
    });

    // Star exercise (top progression rate)
    const starExercise = exerciseProgressions.find(e => e.weightDelta > 0) || exerciseProgressions[0];

    // Key measurement milestone
    const starMeasurement = measurementProgressions.find(m => m.isPositive && Math.abs(m.numericDelta) > 0) || measurementProgressions[0];

    // Average strength progression %
    const progressedExs = exerciseProgressions.filter(e => e.weightDelta > 0);
    const avgProgressionPct = progressedExs.length > 0 
      ? (progressedExs.reduce((acc, curr) => acc + curr.weightPercent, 0) / progressedExs.length).toFixed(1)
      : '0.0';

    return {
      totalWorkouts,
      totalVol,
      totalReps,
      totalPRs,
      totalDurationMins,
      starExercise,
      starMeasurement,
      avgProgressionPct,
      progressedCount: progressedExs.length,
      totalTrackedExercises: exerciseProgressions.length
    };
  }, [periodSessions, exerciseProgressions, measurementProgressions]);

  // Filtered exercises for search & category
  const filteredExercises = useMemo(() => {
    return exerciseProgressions.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || ex.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [exerciseProgressions, searchQuery, selectedCategory]);

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  return (
    <AnimatePresence>
      {isOpen && (
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
            background: 'rgba(0,0,0,0.92)', 
            zIndex: 900, 
            display: 'flex', 
            flexDirection: 'column',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Top Bar Header */}
          <div style={{ 
            padding: '16px 20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '1px solid #1c1c1e',
            background: '#121214'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(0, 122, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                  Progression Tracker
                </div>
                <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600 }}>
                  {periodLabel} Performance Recap
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              style={{ 
                background: '#1c1c1e', 
                border: 'none', 
                color: '#8b90a0', 
                width: 36, 
                height: 36, 
                borderRadius: 18, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer' 
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Timeframe Controls (1M, 3M, 1Y) */}
          <div style={{ padding: '14px 20px', background: '#121214', borderBottom: '1px solid #1c1c1e', display: 'flex', gap: 8 }}>
            {[
              { id: '1m', label: '1 Month', sub: '30 Days' },
              { id: '3m', label: '3 Months', sub: 'Quarterly' },
              { id: '1y', label: '1 Year', sub: 'Annual' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: 14,
                  background: timeframe === t.id ? 'var(--primary)' : '#18181c',
                  color: timeframe === t.id ? '#000' : '#8b90a0',
                  border: timeframe === t.id ? 'none' : '1px solid #242428',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  boxShadow: timeframe === t.id ? '0 4px 14px rgba(0, 122, 255, 0.35)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 900 }}>{t.label}</span>
                <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>{t.sub}</span>
              </button>
            ))}
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', padding: '10px 20px', gap: 8, background: '#141416', borderBottom: '1px solid #1c1c1e' }}>
            {[
              { id: 'recap', label: 'Recap Overview' },
              { id: 'exercises', label: `Exercises (${exerciseProgressions.length})` },
              { id: 'measurements', label: `Body Stats (${measurementProgressions.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  background: activeTab === tab.id ? '#222328' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#6b7080',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Main Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 80px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* TAB 1: ALL-IN-ONE RECAP OVERVIEW */}
            {activeTab === 'recap' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Executive Summary Hero Card */}
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.18) 0%, rgba(94, 92, 230, 0.22) 100%)', 
                  border: '1px solid rgba(0, 122, 255, 0.35)', 
                  borderRadius: 22, 
                  padding: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {periodLabel} Executive Report
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: 8 }}>
                      {recap.progressedCount} movements progressed
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 14 }}>
                      <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700, textTransform: 'uppercase' }}>Workouts Logged</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginTop: 4 }}>{recap.totalWorkouts}</div>
                      <div style={{ fontSize: 11, color: '#6b7080', marginTop: 2 }}>{Math.round((recap.totalWorkouts / periodDays) * 7 * 10) / 10} / week</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 14 }}>
                      <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700, textTransform: 'uppercase' }}>Total Volume</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginTop: 4 }}>
                        {formatWeight(recap.totalVol, unit)} <span style={{ fontSize: 13, color: '#8b90a0' }}>{unit}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7080', marginTop: 2 }}>Lifted in period</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 14 }}>
                      <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700, textTransform: 'uppercase' }}>PRs Smashed</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#FFD60A', marginTop: 4 }}>
                        {recap.totalPRs} <span style={{ fontSize: 14, color: '#8b90a0' }}>records</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7080', marginTop: 2 }}>New personal bests</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 14 }}>
                      <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700, textTransform: 'uppercase' }}>Avg Progression</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#30D158', marginTop: 4 }}>
                        +{recap.avgProgressionPct}%
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7080', marginTop: 2 }}>Strength growth rate</div>
                    </div>
                  </div>
                </div>

                {/* Star Progression Movement Highlight */}
                {recap.starExercise && (
                  <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 20, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255, 214, 10, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trophy size={16} color="#FFD60A" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#e2e2e2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Top Strength Progression
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181c', padding: 14, borderRadius: 14 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{recap.starExercise.name}</div>
                        <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 4 }}>
                          {recap.starExercise.category} • {recap.starExercise.sessionCount} sessions in period
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#30D158' }}>
                          {recap.starExercise.weightDelta > 0 ? `+${formatWeight(recap.starExercise.weightDelta, unit)}` : formatWeight(recap.starExercise.weightDelta, unit)} {unit}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#30D158' }}>
                          +{recap.starExercise.weightPercent.toFixed(1)}% rate
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, padding: '0 4px', fontSize: 12, color: '#8b90a0' }}>
                      <span>Baseline: <strong>{formatWeight(recap.starExercise.startWeight, unit)} {unit}</strong></span>
                      <span style={{ color: 'var(--primary)' }}>➔</span>
                      <span>Current: <strong>{formatWeight(recap.starExercise.currentWeight, unit)} {unit}</strong></span>
                    </div>
                  </div>
                )}

                {/* Key Measurement Improvement Highlight */}
                {recap.starMeasurement && (
                  <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 20, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(48, 209, 88, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={16} color="#30D158" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#e2e2e2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Physiological Highlight
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181c', padding: 14, borderRadius: 14 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{recap.starMeasurement.label}</div>
                        <div style={{ fontSize: 12, color: '#30D158', marginTop: 4, fontWeight: 700 }}>
                          {recap.starMeasurement.improvementType === 'slimming' ? 'Slimming & Toning Progress' : 'Hypertrophy Muscle Gain'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#30D158' }}>
                          {recap.starMeasurement.numericDelta > 0 ? `+${recap.starMeasurement.delta}` : recap.starMeasurement.delta} {recap.starMeasurement.unitLabel}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#30D158' }}>
                          {recap.starMeasurement.numericDelta > 0 ? `+${recap.starMeasurement.percentDelta}%` : `${recap.starMeasurement.percentDelta}%`}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, padding: '0 4px', fontSize: 12, color: '#8b90a0' }}>
                      <span>Start: <strong>{recap.starMeasurement.startVal} {recap.starMeasurement.unitLabel}</strong></span>
                      <span style={{ color: 'var(--primary)' }}>➔</span>
                      <span>Now: <strong>{recap.starMeasurement.currentVal} {recap.starMeasurement.unitLabel}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DETAILED EXERCISES PROGRESSION */}
            {activeTab === 'exercises' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Search & Category Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 14, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Search size={16} color="#6b7080" />
                    <input 
                      type="text"
                      placeholder="Search performed exercises..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          background: selectedCategory === cat ? 'var(--primary)' : '#18181c',
                          color: selectedCategory === cat ? '#000' : '#8b90a0',
                          border: 'none',
                          borderRadius: 16,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exercise Cards */}
                {filteredExercises.length > 0 ? (
                  filteredExercises.map(ex => {
                    const isPositive = ex.weightDelta > 0;
                    const isDeload = ex.weightDelta < 0;

                    return (
                      <div 
                        key={ex.id}
                        style={{
                          background: '#121214',
                          border: '1px solid #1c1c1e',
                          borderRadius: 18,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{ex.name}</div>
                            <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 2 }}>
                              {ex.category} • {ex.sessionCount} workouts in period
                            </div>
                          </div>

                          {/* Progression Badge */}
                          <div style={{
                            padding: '6px 10px',
                            borderRadius: 10,
                            background: isPositive ? 'rgba(48, 209, 88, 0.15)' : (isDeload ? 'rgba(217, 74, 74, 0.15)' : 'rgba(255,255,255,0.06)'),
                            color: isPositive ? '#30D158' : (isDeload ? '#D94A4A' : '#8b90a0'),
                            fontSize: 13,
                            fontWeight: 900,
                            textAlign: 'right'
                          }}>
                            <div>
                              {isPositive ? `+${formatWeight(ex.weightDelta, unit)}` : formatWeight(ex.weightDelta, unit)} {unit}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 1 }}>
                              {isPositive ? `+${ex.weightPercent.toFixed(1)}%` : `${ex.weightPercent.toFixed(1)}%`}
                            </div>
                          </div>
                        </div>

                        {/* Before / After progression row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#18181c', padding: '10px 14px', borderRadius: 12, fontSize: 12 }}>
                          <div>
                            <span style={{ color: '#8b90a0' }}>Starting: </span>
                            <strong style={{ color: '#e2e2e2' }}>{formatWeight(ex.startWeight, unit)} {unit}</strong>
                          </div>
                          <span style={{ color: 'var(--primary)', fontWeight: 900 }}>➔</span>
                          <div>
                            <span style={{ color: '#8b90a0' }}>Current: </span>
                            <strong style={{ color: '#fff' }}>{formatWeight(ex.currentWeight, unit)} {unit}</strong>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(100, Math.max(10, Math.abs(ex.weightPercent)))}%`,
                            height: '100%',
                            background: isPositive ? '#30D158' : (isDeload ? '#D94A4A' : 'var(--primary)'),
                            borderRadius: 3
                          }} />
                        </div>

                        {/* Extra stats */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8b90a0', paddingTop: 2 }}>
                          <span>1RM: <strong>{formatWeight(ex.start1RM, unit)} ➔ {formatWeight(ex.current1RM, unit)} {unit}</strong></span>
                          <span>Vol: <strong>{formatWeight(ex.totalPeriodVol, unit)} {unit}</strong></span>
                          {ex.totalPeriodPRs > 0 && (
                            <span style={{ color: '#FFD60A', fontWeight: 800 }}>🏆 {ex.totalPeriodPRs} PRs</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: '#121214', borderRadius: 16, border: '1px dashed #242428', color: '#6b7080' }}>
                    No exercise data logged in this timeframe. Complete workouts to see progression!
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BODY MEASUREMENTS IMPROVEMENT */}
            {activeTab === 'measurements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 13, color: '#8b90a0', fontWeight: 600 }}>
                  Tracking all {measurementProgressions.length} physiological metrics previously recorded by you.
                </div>

                {measurementProgressions.length > 0 ? (
                  measurementProgressions.map(m => {
                    const isPositive = m.isPositive;

                    return (
                      <div 
                        key={m.metricKey}
                        style={{
                          background: '#121214',
                          border: '1px solid #1c1c1e',
                          borderRadius: 18,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{m.label}</div>
                            <div style={{ fontSize: 12, color: isPositive ? '#30D158' : '#8b90a0', marginTop: 2, fontWeight: 700 }}>
                              {m.improvementType === 'slimming' && 'Slimming Improvement'}
                              {m.improvementType === 'hypertrophy' && 'Muscle Growth'}
                              {m.improvementType === 'neutral' && 'Measurement Update'}
                            </div>
                          </div>

                          <div style={{
                            padding: '6px 12px',
                            borderRadius: 10,
                            background: isPositive ? 'rgba(48, 209, 88, 0.15)' : 'rgba(0, 122, 255, 0.15)',
                            color: isPositive ? '#30D158' : '#007AFF',
                            textAlign: 'right',
                            fontWeight: 900
                          }}>
                            <div style={{ fontSize: 15 }}>
                              {m.numericDelta > 0 ? `+${m.delta}` : m.delta} {m.unitLabel}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 1 }}>
                              {m.numericDelta > 0 ? `+${m.percentDelta}%` : `${m.percentDelta}%`}
                            </div>
                          </div>
                        </div>

                        {/* Starting vs Current */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#18181c', padding: '10px 14px', borderRadius: 12, fontSize: 13 }}>
                          <div>
                            <span style={{ color: '#8b90a0' }}>Baseline: </span>
                            <strong style={{ color: '#e2e2e2' }}>{m.startVal} {m.unitLabel}</strong>
                          </div>
                          <span style={{ color: 'var(--primary)', fontWeight: 900 }}>➔</span>
                          <div>
                            <span style={{ color: '#8b90a0' }}>Current: </span>
                            <strong style={{ color: '#fff' }}>{m.currentVal} {m.unitLabel}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: '#121214', borderRadius: 16, border: '1px dashed #242428', color: '#6b7080' }}>
                    No body measurements recorded yet. Log measurements in the Profile tab to track your physical transformation!
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
