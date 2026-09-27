import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import PRToast from './PRToast';
import * as confettiModule from 'canvas-confetti';
const confetti = confettiModule.default || confettiModule;
import { styles } from '../styles';
import { Plus, X, Check, TimerReset, Trash, GripHorizontal, ImageIcon, Trophy, ChevronDown, ChevronUp, ArrowUpDown, Flame } from './Icons';
import useSound from 'use-sound';
import ExerciseLogger from './ExerciseLogger';
import ExerciseHistoryModal from './ExerciseHistoryModal';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import ReorderExercisesModal from './ReorderExercisesModal';
import CardioLogger from './CardioLogger';
import CardioSelectorModal from './CardioSelectorModal';
import WheelPicker from './ui/WheelPicker';
import { uid, exerciseRequiresWeight } from '../data/exerciseDb';
import { getLastSessionSets, parseVolume, formatWeight, evaluatePR, getUserWeightAtDate } from '../utils';
import { useTooltip } from './TooltipContext';
import { ConfirmCancelModal, IncompleteSetsWarning, ConfirmDeleteModal, ErrorModal } from './WorkoutSafeguards';

const MAX_SESSION_NAME_LENGTH = 25;

const DraggableGroup = ({ groupId, style, children }) => {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={groupId}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={style}
    >
      {children(dragControls)}
    </Reorder.Item>
  );
};

export default function ActiveSessionView({ session, setSession, onFinish, onMinimize, data, persist, startTimer, clearTimer, settings }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showCardioModal, setShowCardioModal] = useState(false);
  const [historyExerciseId, setHistoryExerciseId] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [eqFilter, setEqFilter] = useState("All");

  const [playPop] = useSound('/pop.mp3', { volume: 0.5 });
  const [playFinish] = useSound('/sounds/magic_chime.ogg', { volume: 0.4 });
  const [playDelete] = useSound('/sounds/wood_plank_flick.ogg', { volume: 0.5 });

  const { showTooltip } = useTooltip();

  const [showEditTime, setShowEditTime] = useState(false);
  const [editHours, setEditHours] = useState(0);
  const [editMins, setEditMins] = useState(0);

  const HOURS_OPTIONS = useMemo(() => Array.from({ length: 13 }, (_, i) => i), []); // 0 to 12
  const MINS_OPTIONS = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []); // 0 to 59

  // Safeguards State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteList, setIncompleteList] = useState([]);
  const [exToDelete, setExToDelete] = useState(null);

  // Superset & Reorder State
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedExIds, setSelectedExIds] = useState(new Set()); // Internal index of exercises to group

  const getStartTime = React.useCallback(() => {
    return session?.startTime ? Number(session.startTime) : (session?.date ? new Date(session.date).getTime() : Date.now());
  }, [session?.startTime, session?.date]);

  const formatDuration = (totalSec) => {
    const diff = Math.max(0, totalSec);
    const hours = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    if (hours > 0) {
      return `${hours}:${m}:${s}`;
    }
    return `${m}:${s}`;
  };

  const [durationStr, setDurationStr] = useState(() => {
    const start = session?.startTime ? Number(session.startTime) : (session?.date ? new Date(session.date).getTime() : Date.now());
    return formatDuration(Math.floor((Date.now() - start) / 1000));
  });

  useEffect(() => {
    const start = getStartTime();
    const update = () => {
      const diff = Math.floor((Date.now() - start) / 1000);
      setDurationStr(formatDuration(diff));
    };

    update();
    const interval = setInterval(update, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        update();
      }
    };
    const handleFocus = () => update();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [getStartTime]);

  const userWeight = useMemo(() => {
    return getUserWeightAtDate(data?.measurements, session?.date);
  }, [data?.measurements, session?.date]);

  const stats = useMemo(() => {
    let vol = 0;
    let sets = 0;
    session.exercises.forEach(ex => {
      const exObj = data.exercises.find(e => e.id === ex.exerciseId);
      const requiresWeight = exerciseRequiresWeight(exObj);
      (ex.sets || []).forEach(s => {
        if (s.completed) {
          vol += parseVolume(s.weight, s.reps, requiresWeight ? 0 : userWeight);
          sets += 1;
        }
      });
    });
    return { vol, sets };
  }, [session.exercises, data.exercises, userWeight]);

  const addExercise = (exerciseIds) => {
    playPop();
    const newExercises = exerciseIds.map(id => ({
      id: uid(), exerciseId: id, sets: [{ weight: "", reps: "", rpe: "", completed: false, type: "N" }]
    }));
    setSession({
      ...session,
      exercises: [...session.exercises, ...newExercises],
    });
    setShowAdd(false);
  };

  const handleAddCardio = (act) => {
    playPop();
    const newCardio = {
      id: uid(),
      activityId: act.id,
      name: act.name,
      category: act.category,
      met: act.met || 8.0,
      icon: act.icon || "🔥",
      hasDistance: !!act.hasDistance,
      hasIncline: !!act.hasIncline,
      hasResistance: !!act.hasResistance,
      durationMinutes: 20,
      durationSeconds: 0,
      distance: act.hasDistance ? 2.5 : null,
      incline: act.hasIncline ? 0 : null,
      resistance: act.hasResistance ? 1 : null,
      calories: 0,
      notes: '',
      completed: false
    };
    setSession(prev => ({
      ...prev,
      cardioActivities: [...(prev.cardioActivities || []), newCardio]
    }));
    setShowCardioModal(false);
  };

  const handleUpdateCardio = React.useCallback((idx, updated) => {
    setSession(prev => {
      if (!prev) return prev;
      const nextCardio = [...(prev.cardioActivities || [])];
      nextCardio[idx] = updated;
      return { ...prev, cardioActivities: nextCardio };
    });
  }, [setSession]);

  const handleRemoveCardio = React.useCallback((idx) => {
    playDelete();
    setSession(prev => {
      if (!prev) return prev;
      const nextCardio = [...(prev.cardioActivities || [])];
      nextCardio.splice(idx, 1);
      return { ...prev, cardioActivities: nextCardio };
    });
  }, [setSession, playDelete]);

  const [prNotification, setPrNotification] = useState(null);
  const [prQueue, setPrQueue] = useState([]);
  const [sessionNameError, setSessionNameError] = useState(null);

  const isSessionNameTooLong = (session?.name || "").trim().length > MAX_SESSION_NAME_LENGTH;
  const isSessionNameEmpty = (session?.name || "").trim() === "";

  const handleClosePR = React.useCallback(() => {
    setPrNotification(null);
  }, []);

  useEffect(() => {
    if (!prNotification && prQueue.length > 0) {
      const nextPr = prQueue[0];
      setPrNotification(nextPr);
      setPrQueue(q => q.slice(1));
      
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.1 },
            colors: ['#E8C12C', '#FFFFFF', '#FFD700'],
            disableForReducedMotion: true,
            gravity: 0.8,
            scalar: 0.8,
            ticks: 200
          });
        }
      } catch(e) { console.warn("Confetti failed", e); }
    }
  }, [prQueue, prNotification]);

  const checkPR = (exerciseId, set, currentExIdx, currentSetIdx) => {
    const exObj = data.exercises.find(e => e.id === exerciseId);
    const requiresWeight = exerciseRequiresWeight(exObj);
    const currentSessionUserWeight = getUserWeightAtDate(data.measurements, session.date);
    const historySets = [];
    (data.sessions || []).forEach(s => {
      const pastSessUserWeight = getUserWeightAtDate(data.measurements, s.date);
      (s.exercises || []).forEach(e => {
        if (e.exerciseId === exerciseId) {
          (e.sets || []).forEach(pastSet => {
            if (pastSet.completed && Number(pastSet.reps) > 0 && (requiresWeight ? Number(pastSet.weight) > 0 : true)) {
              historySets.push({
                ...pastSet,
                bodyweight: pastSet.bodyweight !== undefined ? pastSet.bodyweight : pastSessUserWeight
              });
            }
          });
        }
      });
    });

    if (session && session.exercises) {
      session.exercises.forEach((ex, eIdx) => {
        if (ex.exerciseId === exerciseId) {
          (ex.sets || []).forEach((s, sIdx) => {
            if (eIdx < currentExIdx || (eIdx === currentExIdx && sIdx < currentSetIdx)) {
              if (s.completed && Number(s.reps) > 0 && (requiresWeight ? Number(s.weight) > 0 : true)) {
                historySets.push({
                  ...s,
                  bodyweight: currentSessionUserWeight
                });
              }
            }
          });
        }
      });
    }

    return evaluatePR(historySets, set, requiresWeight, currentSessionUserWeight);
  };

  const updateExerciseNotes = React.useCallback((exIdx, text) => {
    setSession(prev => {
      if (!prev) return prev;
      const next = [...prev.exercises];
      next[exIdx] = { ...next[exIdx], notes: text };
      return { ...prev, exercises: next };
    });
  }, []);

  const handleRemoveExercise = React.useCallback((target, name) => {
    setExToDelete({ target, name });
  }, []);

  const updateExerciseSets = React.useCallback((idx, sets, exerciseId, toggledSetIdx) => {
    setSession(prev => {
      if (!prev) return prev;
      const next = [...prev.exercises];
      const newSets = [...sets];
      
      if (toggledSetIdx !== undefined && newSets[toggledSetIdx]?.completed) {
        const pr = checkPR(exerciseId, newSets[toggledSetIdx], idx, toggledSetIdx);
        if (pr) {
          newSets[toggledSetIdx].isPR = pr;
          
          setPrQueue(q => [...q, {
            exerciseId,
            weight: newSets[toggledSetIdx].weight,
            reps: newSets[toggledSetIdx].reps,
            ...pr
          }]);
        }
      }
      
      next[idx] = { ...next[idx], sets: newSets };
      return { ...prev, exercises: next };
    });
  }, [data.sessions, session]);

  const attemptFinish = () => {
    if ((session?.name || "").trim() === "") {
      setSessionNameError("Session name cannot be empty. Please enter a valid name.");
      return;
    }
    if ((session?.name || "").trim().length > MAX_SESSION_NAME_LENGTH) {
      setSessionNameError(`Session name exceeds maximum limit of ${MAX_SESSION_NAME_LENGTH} characters.`);
      return;
    }

    const incomplete = [];
    (session.exercises || []).forEach((ex) => {
      const hasUnchecked = ex.sets.some(s => !s.completed);
      if (hasUnchecked) {
        const exObj = data.exercises.find(e => e.id === ex.exerciseId);
        incomplete.push(exObj?.name || "Unknown Exercise");
      }
    });
    (session.cardioActivities || []).forEach((act) => {
      if (!act.completed) {
        incomplete.push(act.name || "Cardio Activity");
      }
    });

    if (incomplete.length > 0) {
      setIncompleteList([...new Set(incomplete)]);
      setShowIncompleteModal(true);
    } else {
      executeFinish();
    }
  };

  const executeFinish = () => {
    playFinish();
    setShowIncompleteModal(false);
    if (clearTimer) clearTimer();
    const endTime = Date.now();
    const startTime = session?.startTime ? Number(session.startTime) : (session?.date ? new Date(session.date).getTime() : endTime);
    const durationMins = Math.max(1, Math.round((endTime - startTime) / 60000));

    const currentSessionUserWeight = getUserWeightAtDate(data.measurements, session.date);
    const allPriorHistoryMap = new Map();
    (data.sessions || []).forEach(s => {
      const pastSessUserWeight = getUserWeightAtDate(data.measurements, s.date);
      (s.exercises || []).forEach(e => {
        const list = allPriorHistoryMap.get(e.exerciseId) || [];
        const eObj = data.exercises.find(x => x.id === e.exerciseId);
        const eReqW = exerciseRequiresWeight(eObj);
        (e.sets || []).forEach(ps => {
          if (ps.completed && Number(ps.reps) > 0 && (eReqW ? Number(ps.weight) > 0 : true)) {
            list.push({
              ...ps,
              bodyweight: ps.bodyweight !== undefined ? ps.bodyweight : pastSessUserWeight
            });
          }
        });
        allPriorHistoryMap.set(e.exerciseId, list);
      });
    });

    const evaluatedExercises = session.exercises
      .filter((e) => e.sets.some(s => s.completed))
      .map(ex => {
        const exObj = data.exercises.find(e => e.id === ex.exerciseId);
        const requiresWeight = exerciseRequiresWeight(exObj);
        const priorHistory = allPriorHistoryMap.get(ex.exerciseId) || [];
        const localHistory = [...priorHistory];
        const updatedSets = (ex.sets || []).map(s => {
          if (!s.completed || Number(s.reps) <= 0) return s;
          if (requiresWeight && Number(s.weight) <= 0) return s;
          const pr = evaluatePR(localHistory, s, requiresWeight, currentSessionUserWeight);
          localHistory.push({
            ...s,
            bodyweight: currentSessionUserWeight
          });
          return pr ? { ...s, isPR: pr } : { ...s, isPR: false };
        });
        allPriorHistoryMap.set(ex.exerciseId, localHistory);
        return { ...ex, sets: updatedSets };
      });

    const cleaned = {
      ...session,
      name: (session.name || "Workout Session").trim(),
      startTime,
      date: new Date(startTime).toISOString(),
      durationMins,
      exercises: evaluatedExercises,
      cardioActivities: session.cardioActivities || []
    };
    if (cleaned.exercises.length > 0 || (cleaned.cardioActivities && cleaned.cardioActivities.length > 0)) {
      persist({ ...data, sessions: [...data.sessions, cleaned] }, true);
      onFinish(cleaned);
      setSession(null);
    } else {
      setSession(null);
    }
  };

  const cancelWorkout = () => {
    setShowCancelModal(false);
    if (clearTimer) clearTimer();
    setSession(null);
  };

  const confirmSuperset = () => {
    if (selectedExIds.size < 2) {
      setSelectMode(false);
      return;
    }
    const next = [...session.exercises];
    const newGroupId = uid();
    selectedExIds.forEach(idx => {
      next[idx].groupId = newGroupId;
    });
    setSession({ ...session, exercises: next });
    setSelectMode(false);
    setSelectedExIds(new Set());
  };

  const groupedExercises = [];
  session.exercises.forEach((ex, idx) => {
    const safeEx = { ...ex, id: ex.id || `sess-ex-${idx}-${ex.exerciseId}`, idx };
    if (safeEx.groupId && idx > 0 && session.exercises[idx - 1].groupId === safeEx.groupId) {
      groupedExercises[groupedExercises.length - 1].push(safeEx);
    } else {
      groupedExercises.push([safeEx]);
    }
  });

  const moveGroup = (groupIdx, direction) => {
    const targetIdx = groupIdx + direction;
    if (targetIdx < 0 || targetIdx >= groupedExercises.length) return;

    const newGroups = [...groupedExercises];
    const temp = newGroups[groupIdx];
    newGroups[groupIdx] = newGroups[targetIdx];
    newGroups[targetIdx] = temp;

    const flat = [];
    newGroups.forEach(g => {
      g.forEach(ex => {
        const { idx, ...rest } = ex;
        flat.push(rest);
      });
    });
    setSession({ ...session, exercises: flat });
  };

  const handleReorderGroups = (newGroups) => {
    const flat = [];
    newGroups.forEach(g => {
      g.forEach(ex => {
        const { idx, ...rest } = ex;
        flat.push(rest);
      });
    });
    setSession({ ...session, exercises: flat });
  };

  // Filter Logic
  const getEquipment = (name) => {
    const n = name.toLowerCase();
    if (n.includes('cable')) return 'Cable';
    if (n.includes('dumbbell')) return 'Dumbbell';
    if (n.includes('barbell')) return 'Barbell';
    if (n.includes('machine') || n.includes('smith')) return 'Machine';
    return 'Other';
  };

  const searchResults = useMemo(() => {
    return data.exercises.filter(e => {
      const eq = getEquipment(e.name);
      const matchesSearch = e.name.toLowerCase().includes(searchQ.toLowerCase());
      const matchesEq = eqFilter === "All" || eq === eqFilter;
      return matchesSearch && matchesEq;
    });
  }, [data.exercises, searchQ, eqFilter]);

  return (
    <div style={{ paddingBottom: 24 }}>
      <ConfirmCancelModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirm={cancelWorkout} />
      <IncompleteSetsWarning isOpen={showIncompleteModal} onClose={() => setShowIncompleteModal(false)} onProceed={executeFinish} incompleteExerciseNames={incompleteList} />
      
      <AnimatePresence>
        {showEditTime && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.85)', 
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: 16
            }}
            onClick={() => setShowEditTime(false)}
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                background: '#141518', 
                padding: '24px 20px', 
                borderRadius: 20, 
                width: '100%', 
                maxWidth: 340, 
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: 'rgba(0, 122, 255, 0.15)',
                    border: '1px solid rgba(0, 122, 255, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <TimerReset size={19} color="var(--primary, #007AFF)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>Edit Session Time</div>
                    <div style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600 }}>Adjust elapsed workout time</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditTime(false)}
                  style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#8b90a0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Live Preview Display */}
              <div style={{
                background: '#0D0E12',
                borderRadius: 14,
                padding: '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
                marginBottom: 16
              }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary, #007AFF)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {editHours > 0 ? `${editHours}h ${String(editMins).padStart(2, '0')}m` : `${editMins} mins`}
                </div>
                <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600, marginTop: 4 }}>
                  Started ~{new Date(Date.now() - (editHours * 60 + editMins) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {editHours * 60 + editMins}m elapsed
                </div>
              </div>

              {/* Dual Wheel Pickers */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#0D0E12',
                borderRadius: 18,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '8px 12px',
                marginBottom: 16,
                gap: 8
              }}>
                <WheelPicker
                  items={HOURS_OPTIONS}
                  value={editHours}
                  onChange={setEditHours}
                  label="Hours"
                  highlightColor="var(--primary, #007AFF)"
                  formatItem={h => `${h} h`}
                  width="85px"
                />
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary, #007AFF)', marginTop: 12 }}>:</div>
                <WheelPicker
                  items={MINS_OPTIONS}
                  value={editMins}
                  onChange={setEditMins}
                  label="Minutes"
                  highlightColor="var(--primary, #007AFF)"
                  formatItem={m => `${String(m).padStart(2, '0')} m`}
                  width="85px"
                />
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                {[-15, +15, +30].map(delta => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => {
                      const cur = editHours * 60 + editMins;
                      const next = Math.max(0, Math.min(12 * 60 + 59, cur + delta));
                      setEditHours(Math.floor(next / 60));
                      setEditMins(next % 60);
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#e2e2e2',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {delta > 0 ? `+${delta}m` : `${delta}m`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const start = session?.startTime ? Number(session.startTime) : (session?.date ? new Date(session.date).getTime() : Date.now());
                    const curTotalM = Math.floor(Math.max(0, Date.now() - start) / 60000);
                    setEditHours(Math.floor(curTotalM / 60));
                    setEditMins(curTotalM % 60);
                  }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    background: 'rgba(0, 122, 255, 0.12)',
                    border: '1px solid rgba(0, 122, 255, 0.25)',
                    color: 'var(--primary, #007AFF)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  onClick={() => setShowEditTime(false)} 
                  style={{ 
                    flex: 1, 
                    background: '#1e2025', 
                    color: '#e2e2e2', 
                    padding: '12px 14px', 
                    borderRadius: 12, 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const newTotalMins = editHours * 60 + editMins;
                    const newStart = Date.now() - newTotalMins * 60000;
                    setSession({ 
                      ...session, 
                      startTime: newStart,
                      date: new Date(newStart).toISOString() 
                    });
                    setShowEditTime(false);
                  }} 
                  style={{ 
                    flex: 1, 
                    background: 'var(--primary, #007AFF)', 
                    color: '#000', 
                    padding: '12px 14px', 
                    borderRadius: 12, 
                    border: 'none', 
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Save Time
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal  
        isOpen={!!exToDelete} 
        onClose={() => setExToDelete(null)} 
        onConfirm={() => {
          if (exToDelete) {
            playDelete();
            const next = session.exercises.filter((ex, idx) => {
              if (typeof exToDelete.target === 'string') {
                return ex.id !== exToDelete.target;
              }
              return idx !== exToDelete.target && ex.id !== exToDelete.target;
            });
            setSession({ ...session, exercises: next });
            setExToDelete(null);
          }
        }} 
        itemName={exToDelete?.name} 
      />

      <div style={{ 
        position: 'sticky', 
        top: 0, 
        background: 'rgba(18,20,20,0.85)', 
        backdropFilter: 'blur(12px)', 
        zIndex: 80, 
        padding: '12px 16px 14px', 
        paddingTop: 'calc(14px + env(safe-area-inset-top, 0px))',
        borderBottom: '1px solid transparent', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 12 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={session.name}
                onChange={(e) => setSession({ ...session, name: e.target.value })}
                className="premiumInput" 
                style={{ 
                  width: '100%', 
                  fontSize: 20, 
                  fontWeight: 800, 
                  padding: '12px 16px', 
                  borderRadius: 12,
                  letterSpacing: '-0.02em',
                  background: 'rgba(24, 25, 29, 0.95)',
                  border: (isSessionNameTooLong || isSessionNameEmpty) ? '1.5px solid #D94A4A' : '1.5px solid rgba(255,255,255,0.12)',
                  color: isSessionNameTooLong ? '#D94A4A' : '#fff'
                }}
                placeholder="Session name"
              />
              {(isSessionNameTooLong || isSessionNameEmpty) && (
                <span style={{ 
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: '#D94A4A', color: '#fff', borderRadius: '50%', width: 18, height: 18, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 
                }}>!</span>
              )}
            </div>

            {/* Minimize Button with Outer Layer */}
            <button 
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1.5px solid rgba(255, 255, 255, 0.12)', 
                borderRadius: 12,
                color: '#e2e2e2', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: 44, 
                height: 44, 
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }} 
              onClick={onMinimize}
              title="Minimize workout"
              aria-label="Minimize workout"
            >
              <ChevronDown size={22} strokeWidth={2.5} />
            </button>

            {/* Discard / Close Button with High-Visibility Outer Layer */}
            <button 
              style={{ 
                background: 'rgba(232, 17, 35, 0.12)', 
                border: '1.5px solid rgba(232, 17, 35, 0.45)', 
                borderRadius: 12,
                color: '#FF453A', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: 44, 
                height: 44, 
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: '0 2px 10px rgba(232, 17, 35, 0.25)'
              }} 
              onClick={() => setShowCancelModal(true)}
              title="Discard workout"
              aria-label="Discard workout"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          {(isSessionNameTooLong || isSessionNameEmpty) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}>
              <span style={{ color: '#D94A4A', fontSize: 12, fontWeight: 700 }}>
                {isSessionNameEmpty ? "! Session name cannot be empty." : `! Session name cannot exceed ${MAX_SESSION_NAME_LENGTH} characters.`}
              </span>
              <span style={{ color: isSessionNameTooLong ? '#D94A4A' : '#6b7080', fontSize: 11, fontWeight: 700 }}>
                {(session?.name || "").trim().length}/{MAX_SESSION_NAME_LENGTH}
              </span>
            </div>
          )}
        </div>
        
        {/* Modern HUD Session Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(24, 25, 29, 0.65)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: '8px 12px',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {/* Timer Chip */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 7, 
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.3)',
              padding: '4px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)'
            }} 
            onClick={() => {
              const start = session?.startTime ? Number(session.startTime) : (session?.date ? new Date(session.date).getTime() : Date.now());
              const ms = Math.max(0, Date.now() - start);
              const totalM = Math.floor(ms / 60000);
              setEditHours(Math.floor(totalM / 60));
              setEditMins(totalM % 60);
              setShowEditTime(true);
            }}
            title="Click to edit elapsed time"
          >
            <div style={{ position: 'relative', display: 'flex' }}>
              <TimerReset size={14} color="var(--primary)" />
              <div style={{ position: 'absolute', top: -1, right: -1, width: 5, height: 5, borderRadius: 3, background: '#30D158' }} />
            </div>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{durationStr}</span>
          </div>

          {/* Volume Chip */}
          <div style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Vol:</span>
            <span style={{ color: '#e2e2e2', fontWeight: 800 }}>{formatWeight(stats.vol, settings?.unit)} {settings?.unit || 'kg'}</span>
          </div>

          {/* Sets Chip */}
          <div style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Sets:</span>
            <span style={{ color: '#e2e2e2', fontWeight: 800 }}>{stats.sets}</span>
          </div>

          {/* Cardio Chip (if present) */}
          {session.cardioActivities && session.cardioActivities.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 800,
              color: '#FF8533',
              background: 'rgba(255, 107, 0, 0.12)',
              border: '1px solid rgba(255, 107, 0, 0.25)',
              padding: '3px 8px',
              borderRadius: 6
            }}>
              <Flame size={12} />
              <span>{session.cardioActivities.filter(c => c.completed).length}/{session.cardioActivities.length}</span>
            </div>
          )}

          {/* Location / Gym Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8b90a0', marginLeft: 'auto' }}>
            <select 
              value={session.locationId || 'loc-default'}
              onChange={(e) => setSession({ ...session, locationId: e.target.value })}
              style={{
                background: 'transparent',
                color: 'var(--primary)',
                border: 'none',
                fontWeight: 700,
                fontSize: 12,
                outline: 'none',
                cursor: 'pointer',
                padding: '2px 4px'
              }}
            >
              {(data.user?.locations || [{ id: 'loc-default', name: 'Default Gym' }]).map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pad" style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 'calc(260px + env(safe-area-inset-bottom))' }}>
        
        {session.exercises.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div className="sectionLabel">EXERCISES</div>
            {selectMode ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="miniBtn" style={{ border: 'none' }} onClick={() => { setSelectMode(false); setSelectedExIds(new Set()); }}>Cancel</button>
                <button className="miniBtn" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }} onClick={confirmSuperset}>Group Selected</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className="miniBtn" 
                  onClick={() => setShowReorderModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <ArrowUpDown size={13} /> Reorder
                </button>
                <button className="miniBtn" onClick={() => setSelectMode(true)}>
                  Group Superset
                </button>
              </div>
            )}
          </div>
        )}

        <Reorder.Group axis="y" values={groupedExercises.map(g => g[0].id)} onReorder={(newOrderIds) => {
          const newOrder = [];
          newOrderIds.forEach(id => {
            const group = groupedExercises.find(g => g[0].id === id);
            if (group) newOrder.push(...group);
          });
          const cleaned = newOrder.map(e => {
            const { idx, ...rest } = e;
            return rest;
          });
          setSession({ ...session, exercises: cleaned });
        }} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {groupedExercises.map((group, gIdx) => {
          const isSuperset = group.length > 1;

          return (
            <DraggableGroup
              key={group[0].id}
              groupId={group[0].id}
              className="exCard"
              style={{
                borderLeft: isSuperset ? "4px solid var(--primary)" : "1px solid transparent",
                paddingBottom: isSuperset ? 0 : 12,
                position: 'relative'
              }}
            >
              {(dragControls) => (
                <>
                  {group.map((ex, internalIdx) => {
                    const exObj = data.exercises.find((e) => e.id === ex.exerciseId);
                    const priorSets = getLastSessionSets(data, ex.exerciseId, session.id, session.locationId || 'loc-default');
                    const supersetPrefix = isSuperset ? String.fromCharCode(65 + internalIdx) : "";
                    
                    const isSelected = selectedExIds.has(ex.idx);

                    return (
                      <div 
                        key={ex.id || ex.idx} 
                        style={{ 
                          marginBottom: isSuperset && internalIdx < group.length - 1 ? 16 : (isSuperset ? 12 : 0),
                          paddingBottom: isSuperset && internalIdx < group.length - 1 ? 16 : 0, 
                          borderBottom: isSuperset && internalIdx < group.length - 1 ? "1px dashed #2A2A2A" : "none",
                          display: selectMode ? 'flex' : 'block',
                          alignItems: 'flex-start',
                          gap: 12
                        }}
                      >
                        {selectMode && (
                          <button 
                            style={{ width: 24, height: 24, borderRadius: 12, border: '2px solid var(--primary)', background: isSelected ? 'var(--primary)' : 'transparent', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => {
                              const next = new Set(selectedExIds);
                              if (next.has(ex.idx)) next.delete(ex.idx);
                              else next.add(ex.idx);
                              setSelectedExIds(next);
                            }}
                          >
                            {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                          </button>
                        )}
                        <div style={{ flex: 1 }}>
                          <ExerciseLogger
                            exIdx={ex.idx}
                            exerciseId={ex.exerciseId}
                            name={exObj?.name || "Unknown Move"}
                            category={exObj?.category}
                            equipment={exObj?.equipment}
                            imageUrl={exObj?.imageUrl}
                            sets={ex.sets}
                            priorSets={priorSets}
                            allSessions={data?.sessions || []}
                            allExercises={data?.exercises || []}
                            currentSessionId={session.id}
                            activeIntervention={data?.activeInterventions?.[ex.exerciseId] || null}
                            customPlateauThreshold={settings?.customPlateauThreshold}
                            onSelectIntervention={(intervention) => {
                              useAppStore.getState().setActiveIntervention(ex.exerciseId, intervention);
                            }}
                            onCancelIntervention={() => {
                              useAppStore.getState().removeActiveIntervention(ex.exerciseId);
                            }}
                            onSwapExercise={(newExId) => {
                              setSession(prev => {
                                if (!prev) return prev;
                                const updatedExercises = [...(prev.exercises || [])];
                                updatedExercises[ex.idx] = {
                                  ...updatedExercises[ex.idx],
                                  exerciseId: newExId
                                };
                                return { ...prev, exercises: updatedExercises };
                              });
                            }}
                            supersetPrefix={supersetPrefix}
                            notes={ex.notes}
                            dragControls={dragControls}
                            onTitleClick={() => setHistoryExerciseId(ex.exerciseId)}
                            onNotesChange={updateExerciseNotes}
                            onRemove={() => handleRemoveExercise(ex.id || ex.idx, exObj?.name || "Exercise")}
                            onSetsChange={updateExerciseSets}
                            startTimer={startTimer}
                            settings={settings}
                            requiresWeight={exerciseRequiresWeight(exObj)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </DraggableGroup>
          );
        })}
        </Reorder.Group>

        {/* Integrated Cardio Activities */}
        {session.cardioActivities && session.cardioActivities.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 4 }}>
              <Flame size={16} color="#FF6B00" />
              <span style={{ fontSize: 13, fontWeight: 900, color: '#FF8533', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Cardio Activities ({session.cardioActivities.length})
              </span>
            </div>
            {session.cardioActivities.map((act, cIdx) => (
              <CardioLogger
                key={act.id || `cardio-${cIdx}`}
                activity={act}
                index={cIdx}
                userWeight={userWeight}
                unit={settings?.unit || 'kg'}
                onUpdate={handleUpdateCardio}
                onRemove={handleRemoveCardio}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="dashedBtn" style={{ flex: 1, marginTop: 0 }} onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Exercise
          </button>
          <button 
            className="dashedBtn" 
            style={{ 
              flex: 1, 
              marginTop: 0,
              background: 'rgba(255, 107, 0, 0.08)', 
              borderColor: 'rgba(255, 107, 0, 0.3)', 
              color: '#FF8533',
              boxShadow: '0 4px 14px rgba(255, 107, 0, 0.1)'
            }} 
            onClick={() => setShowCardioModal(true)}
          >
            <Flame size={16} color="#FF8533" /> Add Cardio
          </button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <ExerciseSelectorModal 
              data={data}
              existingExerciseIds={session.exercises.map(e => e.exerciseId)}
              onClose={() => setShowAdd(false)}
              onSelect={addExercise}
            />
          )}
          {showCardioModal && (
            <CardioSelectorModal
              isOpen={showCardioModal}
              onClose={() => setShowCardioModal(false)}
              onSelectActivity={handleAddCardio}
              customActivities={data?.customCardioActivities || []}
              onAddCustomActivity={(newAct) => {
                if (persist) {
                  persist({
                    ...data,
                    customCardioActivities: [...(data?.customCardioActivities || []), newAct]
                  });
                }
              }}
            />
          )}
        </AnimatePresence>

        {(session.exercises.length > 0 || (session.cardioActivities && session.cardioActivities.length > 0)) && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="finishBtn" 
            onClick={attemptFinish}
          >
            <Check size={18} strokeWidth={3} /> Finish Workout
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {historyExerciseId && (
          <ExerciseHistoryModal 
            exerciseId={historyExerciseId}
            data={data}
            settings={settings}
            onClose={() => setHistoryExerciseId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <PRToast 
          notification={prNotification} 
          settings={settings} 
          onClose={handleClosePR} 
        />
      </AnimatePresence>

      <ReorderExercisesModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        groupedExercises={groupedExercises}
        data={data}
        onMoveGroup={moveGroup}
        onReorderGroups={handleReorderGroups}
      />

      <ErrorModal
        isOpen={!!sessionNameError}
        onClose={() => setSessionNameError(null)}
        message={sessionNameError}
      />
    </div>
  );
}
