import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import PRToast from './PRToast';
import * as confettiModule from 'canvas-confetti';
const confetti = confettiModule.default || confettiModule;
import { styles } from '../styles';
import { Plus, X, Check, TimerReset, Trash, GripHorizontal, ImageIcon, Trophy, ChevronDown } from './Icons';
import useSound from 'use-sound';
import ExerciseLogger from './ExerciseLogger';
import ExerciseHistoryModal from './ExerciseHistoryModal';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import { uid } from '../data/exerciseDb';
import { getLastSessionSets, parseVolume, formatWeight, evaluatePR } from '../utils';
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

export default function ActiveSessionView({ session, setSession, onFinish, onMinimize, data, persist, startTimer, settings }) {
  const [showAdd, setShowAdd] = useState(false);
  const [historyExerciseId, setHistoryExerciseId] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [eqFilter, setEqFilter] = useState("All");

  const [playPop] = useSound('/pop.mp3', { volume: 0.5 });
  const [playFinish] = useSound('/sounds/magic_chime.ogg', { volume: 0.4 });
  const [playDelete] = useSound('/sounds/wood_plank_flick.ogg', { volume: 0.5 });

  const [durationStr, setDurationStr] = useState("00:00");
  const { showTooltip } = useTooltip();

  const [showEditTime, setShowEditTime] = useState(false);
  const [editMins, setEditMins] = useState("");

  // Safeguards State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteList, setIncompleteList] = useState([]);
  const [exToDelete, setExToDelete] = useState(null);

  // Superset State
  const [selectMode, setSelectMode] = useState(false);
  const [selectedExIds, setSelectedExIds] = useState(new Set()); // Internal index of exercises to group

  useEffect(() => {
    const start = new Date(session.date).getTime();
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const m = Math.floor(diff / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setDurationStr(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [session.date]);

  const stats = useMemo(() => {
    let vol = 0;
    let sets = 0;
    session.exercises.forEach(ex => {
      (ex.sets || []).forEach(s => {
        if (s.completed) {
          vol += parseVolume(s.weight, s.reps);
          sets += 1;
        }
      });
    });
    return { vol, sets };
  }, [session.exercises]);

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

  const [prNotification, setPrNotification] = useState(null);
  const [prQueue, setPrQueue] = useState([]);
  const [sessionNameError, setSessionNameError] = useState(null);

  const isSessionNameTooLong = (session?.name || "").trim().length > MAX_SESSION_NAME_LENGTH;
  const isSessionNameEmpty = (session?.name || "").trim() === "";

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

      const timer = setTimeout(() => setPrNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [prQueue, prNotification]);

  const checkPR = (exerciseId, set, currentExIdx, currentSetIdx) => {
    const historySets = [];
    (data.sessions || []).forEach(s => {
      (s.exercises || []).forEach(e => {
        if (e.exerciseId === exerciseId) {
          (e.sets || []).forEach(pastSet => {
            if (pastSet.completed && (Number(pastSet.weight) > 0 || Number(pastSet.reps) > 0)) {
              historySets.push(pastSet);
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
              if (s.completed && (Number(s.weight) > 0 || Number(s.reps) > 0)) {
                historySets.push(s);
              }
            }
          });
        }
      });
    }

    return evaluatePR(historySets, set);
  };

  const updateExerciseNotes = React.useCallback((exIdx, text) => {
    setSession(prev => {
      if (!prev) return prev;
      const next = [...prev.exercises];
      next[exIdx] = { ...next[exIdx], notes: text };
      return { ...prev, exercises: next };
    });
  }, []);

  const handleRemoveExercise = React.useCallback((exIdx, name) => {
    setExToDelete({ idx: exIdx, name });
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
    session.exercises.forEach((ex) => {
      const hasUnchecked = ex.sets.some(s => !s.completed);
      if (hasUnchecked) {
        const exObj = data.exercises.find(e => e.id === ex.exerciseId);
        incomplete.push(exObj?.name || "Unknown Exercise");
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
    const endTime = Date.now();
    const startTime = new Date(session.date).getTime();
    const durationMins = Math.round((endTime - startTime) / 60000);

    const allPriorHistoryMap = new Map();
    (data.sessions || []).forEach(s => {
      (s.exercises || []).forEach(e => {
        const list = allPriorHistoryMap.get(e.exerciseId) || [];
        (e.sets || []).forEach(ps => {
          if (ps.completed && (Number(ps.weight) > 0 || Number(ps.reps) > 0)) list.push(ps);
        });
        allPriorHistoryMap.set(e.exerciseId, list);
      });
    });

    const evaluatedExercises = session.exercises
      .filter((e) => e.sets.some(s => s.completed))
      .map(ex => {
        const priorHistory = allPriorHistoryMap.get(ex.exerciseId) || [];
        const localHistory = [...priorHistory];
        const updatedSets = (ex.sets || []).map(s => {
          if (!s.completed || Number(s.weight) <= 0 || Number(s.reps) <= 0) return s;
          const pr = evaluatePR(localHistory, s);
          localHistory.push(s);
          return pr ? { ...s, isPR: pr } : { ...s, isPR: false };
        });
        allPriorHistoryMap.set(ex.exerciseId, localHistory);
        return { ...ex, sets: updatedSets };
      });

    const cleaned = {
      ...session,
      name: (session.name || "Workout Session").trim(),
      durationMins,
      exercises: evaluatedExercises,
    };
    if (cleaned.exercises.length > 0) {
      persist({ ...data, sessions: [...data.sessions, cleaned] });
      onFinish(cleaned);
      setSession(null);
    } else {
      setSession(null);
    }
  };

  const cancelWorkout = () => {
    setShowCancelModal(false);
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
    if (ex.groupId && idx > 0 && session.exercises[idx - 1].groupId === ex.groupId) {
      groupedExercises[groupedExercises.length - 1].push({ ...ex, idx });
    } else {
      groupedExercises.push([{ ...ex, idx }]);
    }
  });

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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ background: '#1c1c1e', padding: 24, borderRadius: 16, width: '80%', maxWidth: 320, border: '1px solid #333535' }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e2e2', marginBottom: 16 }}>Edit Session Time</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input 
                    type="number" 
                    value={editMins} 
                    onChange={e => setEditMins(Number(e.target.value) || 0)} 
                    style={{ flex: 1, background: '#121212', border: '1px solid #333535', color: '#e2e2e2', padding: '12px', borderRadius: 8, fontSize: 16, textAlign: 'center' }} 
                  />
                  <span style={{ color: '#8b90a0', fontWeight: 600 }}>minutes</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  step="1" 
                  value={editMins} 
                  onChange={e => setEditMins(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowEditTime(false)} style={{ flex: 1, background: '#333535', color: '#e2e2e2', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700 }}>Cancel</button>
                <button 
                  onClick={() => {
                    const newMins = parseInt(editMins) || 0;
                    setSession({ ...session, date: new Date(Date.now() - newMins * 60000).toISOString() });
                    setShowEditTime(false);
                  }} 
                  style={{ flex: 1, background: 'var(--primary)', color: '#000', padding: 12, borderRadius: 8, border: 'none', fontWeight: 800 }}
                >Save</button>
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
            const next = session.exercises.filter((_, idx) => idx !== exToDelete.idx);
            setSession({ ...session, exercises: next });
            setExToDelete(null);
          }
        }} 
        itemName={exToDelete?.name} 
      />

      <div style={{ position: 'sticky', top: 0, background: 'rgba(18,20,20,0.85)', backdropFilter: 'blur(12px)', zIndex: 80, padding: '16px', borderBottom: '1px solid transparent', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={session.name}
                onChange={(e) => setSession({ ...session, name: e.target.value })}
                className="premiumInput" 
                style={{ 
                  width: '100%', 
                  fontSize: 22, 
                  fontWeight: 800, 
                  padding: '12px 16px', 
                  letterSpacing: '-0.02em',
                  border: (isSessionNameTooLong || isSessionNameEmpty) ? '1px solid #D94A4A' : '1px solid rgba(255,255,255,0.08)',
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
            <button style={{ background: 'transparent', border: 'none', color: '#e2e2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: 'pointer' }} onClick={onMinimize}>
              <ChevronDown size={24} />
            </button>
            <button style={{ background: 'transparent', border: 'none', color: '#E81123', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: 'pointer' }} onClick={() => setShowCancelModal(true)}>
              <X size={24} />
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b90a0', fontSize: 13, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => {
            const ms = Date.now() - new Date(session.date).getTime();
            setEditMins(Math.floor(ms / 60000).toString());
            setShowEditTime(true);
          }}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <TimerReset size={14} color="var(--primary)" />
              <div style={{ position: 'absolute', top: -1, right: -1, width: 6, height: 6, borderRadius: 3, background: '#30D158' }} />
            </div>
            <span style={{ color: '#e2e2e2', borderBottom: '1px dashed #e2e2e2' }}>{durationStr}</span>
          </div>
          <div>Volume: <span style={{ color: '#e2e2e2' }}>{formatWeight(stats.vol, settings?.unit)} {settings?.unit || 'kg'}</span></div>
          <div>Sets: <span style={{ color: '#e2e2e2' }}>{stats.sets}</span></div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#8b90a0', fontSize: 13, fontWeight: 600 }}>
          <span>Gym Profile:</span>
          <select 
            value={session.locationId || 'loc-default'}
            onChange={(e) => setSession({ ...session, locationId: e.target.value })}
            style={{ background: 'transparent', color: 'var(--primary)', border: 'none', fontWeight: 700, fontSize: 14, outline: 'none', cursor: 'pointer', padding: 0 }}
          >
            {(data.user?.locations || [{ id: 'loc-default', name: 'Default Gym' }]).map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pad" style={{ display: "flex", flexDirection: "column", gap: 14  }}>
        
        {session.exercises.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div className="sectionLabel">EXERCISES</div>
            {selectMode ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="miniBtn" style={{ border: 'none'  }} onClick={() => { setSelectMode(false); setSelectedExIds(new Set()); }}>Cancel</button>
                <button className="miniBtn" style={{ background: 'var(--primary)', color: '#fff', border: 'none'  }} onClick={confirmSuperset}>Group Selected</button>
              </div>
            ) : (
              <button className="miniBtn" onClick={() => setSelectMode(true)}>Group Superset</button>
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
                            supersetPrefix={supersetPrefix}
                            notes={ex.notes}
                            dragControls={dragControls}
                            onTitleClick={() => setHistoryExerciseId(ex.exerciseId)}
                            onNotesChange={updateExerciseNotes}
                            onRemove={handleRemoveExercise}
                            onSetsChange={updateExerciseSets}
                            startTimer={startTimer}
                            settings={settings}
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

        <button className="dashedBtn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Exercise
        </button>

        <AnimatePresence>
          {showAdd && (
            <ExerciseSelectorModal 
              data={data}
              existingExerciseIds={session.exercises.map(e => e.exerciseId)}
              onClose={() => setShowAdd(false)}
              onSelect={addExercise}
            />
          )}
        </AnimatePresence>

        {session.exercises.length > 0 && (
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
          onClose={() => setPrNotification(null)} 
        />
      </AnimatePresence>

      <ErrorModal
        isOpen={!!sessionNameError}
        onClose={() => setSessionNameError(null)}
        message={sessionNameError}
      />
    </div>
  );
}
