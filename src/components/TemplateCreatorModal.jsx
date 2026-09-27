import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { styles } from '../styles';
import { Plus, X, Check, GripHorizontal, Trash, ChevronDown, ChevronUp, Dumbbell, ArrowUpDown } from './Icons';
import useSound from 'use-sound';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import ReorderExercisesModal from './ReorderExercisesModal';
import { uid, exerciseRequiresWeight } from '../data/exerciseDb';
import { ConfirmCancelModal, ConfirmDeleteModal, ErrorModal } from './WorkoutSafeguards';

const MAX_TEMPLATE_NAME_LENGTH = 25;

const typeConfig = {
  N: { label: 'Normal', short: 'N', color: '#e2e2e2', bg: '#242428', desc: 'Standard working set' },
  W: { label: 'Warmup', short: 'W', color: '#FF9F0A', bg: 'rgba(255, 159, 10, 0.15)', desc: 'Light preparatory set' },
  D: { label: 'Drop Set', short: 'D', color: '#E81123', bg: 'rgba(232, 17, 35, 0.15)', desc: 'Immediate reduced-load set' },
  F: { label: 'Failure', short: 'F', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)', desc: 'Take set to muscular failure' }
};

const DraggableGroup = ({ groupId, style, children }) => {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={groupId}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={style}
    >
      {children(dragControls)}
    </Reorder.Item>
  );
};

export default function TemplateCreatorModal({ data, onClose, onSave, settings, initialTemplate = null }) {
  const [template, setTemplate] = useState(() => {
    if (initialTemplate) {
      const copy = JSON.parse(JSON.stringify(initialTemplate));
      copy.exercises = (copy.exercises || []).map(ex => ({
        ...ex,
        id: ex.id || uid()
      }));
      return copy;
    }
    return { name: "", exercises: [] };
  });
  const [showAdd, setShowAdd] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [exToDelete, setExToDelete] = useState(null);
  const [templateNameError, setTemplateNameError] = useState(null);
  const [editingSetType, setEditingSetType] = useState(null); // { exIdx, setIdx }

  const isNameTooLong = (template.name || "").trim().length > MAX_TEMPLATE_NAME_LENGTH;
  const isNameEmpty = (template.name || "").trim() === "";

  const [playPop] = useSound('/pop.mp3', { volume: 0.5 });
  const [playDelete] = useSound('/sounds/wood_plank_flick.ogg', { volume: 0.5 });

  const exerciseDict = useMemo(() => {
    const dict = {};
    (data?.exercises || []).forEach(e => { dict[e.id] = e; });
    return dict;
  }, [data?.exercises]);

  const { totalSets, targetMuscleGroups } = useMemo(() => {
    let sets = 0;
    const categories = new Set();
    template.exercises.forEach(ex => {
      sets += (ex.sets || []).length;
      const exObj = exerciseDict[ex.exerciseId];
      if (exObj?.category) categories.add(exObj.category);
    });
    return { totalSets: sets, targetMuscleGroups: Array.from(categories) };
  }, [template.exercises, exerciseDict]);

  const addExercise = (exerciseIds) => {
    playPop();
    const newExercises = exerciseIds.map(id => ({
      id: uid(),
      exerciseId: id,
      sets: [
        { type: "N" },
        { type: "N" },
        { type: "N" }
      ],
      notes: ""
    }));
    setTemplate(prev => ({
      ...prev,
      exercises: [...prev.exercises, ...newExercises],
    }));
    setShowAdd(false);
  };

  const handleSetCountChange = (exIdx, delta) => {
    setTemplate(prev => {
      const next = [...prev.exercises];
      const curSets = next[exIdx].sets || [];
      if (delta > 0) {
        next[exIdx] = {
          ...next[exIdx],
          sets: [...curSets, { type: "N" }]
        };
      } else if (delta < 0 && curSets.length > 1) {
        next[exIdx] = {
          ...next[exIdx],
          sets: curSets.slice(0, -1)
        };
      }
      return { ...prev, exercises: next };
    });
  };

  const removeIndividualSet = (exIdx, setIdx) => {
    setTemplate(prev => {
      const next = [...prev.exercises];
      const curSets = next[exIdx].sets || [];
      if (curSets.length <= 1) return prev;
      next[exIdx] = {
        ...next[exIdx],
        sets: curSets.filter((_, idx) => idx !== setIdx)
      };
      return { ...prev, exercises: next };
    });
  };

  const moveTemplateExercise = (fromIdx, direction) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= template.exercises.length) return;
    const next = [...template.exercises];
    const temp = next[fromIdx];
    next[fromIdx] = next[toIdx];
    next[toIdx] = temp;
    setTemplate(prev => ({ ...prev, exercises: next }));
  };

  const updateSetType = (typeKey) => {
    if (!editingSetType) return;
    const { exIdx, setIdx } = editingSetType;
    setTemplate(prev => {
      const next = [...prev.exercises];
      const curSets = [...(next[exIdx].sets || [])];
      if (curSets[setIdx]) {
        curSets[setIdx] = { ...curSets[setIdx], type: typeKey };
      }
      next[exIdx] = { ...next[exIdx], sets: curSets };
      return { ...prev, exercises: next };
    });
    setEditingSetType(null);
  };

  const updateAllSetsType = (typeKey) => {
    if (!editingSetType) return;
    const { exIdx } = editingSetType;
    setTemplate(prev => {
      const next = [...prev.exercises];
      const curSets = (next[exIdx].sets || []).map(s => ({ ...s, type: typeKey }));
      next[exIdx] = { ...next[exIdx], sets: curSets };
      return { ...prev, exercises: next };
    });
    setEditingSetType(null);
  };

  const updateExerciseNotes = (exIdx, text) => {
    setTemplate(prev => {
      const next = [...prev.exercises];
      next[exIdx] = { ...next[exIdx], notes: text };
      return { ...prev, exercises: next };
    });
  };

  const handleCloseRequest = () => {
    if (template.name.trim() !== "" || template.exercises.length > 0) {
      setShowCancelModal(true);
    } else {
      onClose();
    }
  };

  const attemptFinish = () => {
    if ((template.name || "").trim() === "") {
      setTemplateNameError("Template name cannot be empty. Please enter a valid name.");
      return;
    }
    if ((template.name || "").trim().length > MAX_TEMPLATE_NAME_LENGTH) {
      setTemplateNameError(`Template name cannot exceed ${MAX_TEMPLATE_NAME_LENGTH} characters.`);
      return;
    }
    if (template.exercises.length === 0) {
      setTemplateNameError("Please add at least one exercise to save the template.");
      return;
    }

    onSave({
      id: initialTemplate?.id || template.id || uid(),
      name: template.name.trim(),
      exercises: template.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        notes: (ex.notes || "").trim(),
        sets: (ex.sets || []).map(s => ({
          weight: "",
          reps: "",
          rpe: "",
          type: s.type || "N",
          completed: false
        }))
      }))
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-main)', zIndex: 100, overflowY: 'auto' }}>
      <ConfirmCancelModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirm={onClose} />
      
      <ConfirmDeleteModal 
        isOpen={!!exToDelete} 
        onClose={() => setExToDelete(null)} 
        onConfirm={() => {
          if (exToDelete) {
            playDelete();
            const next = template.exercises.filter((_, idx) => idx !== exToDelete.idx);
            setTemplate(prev => ({ ...prev, exercises: next }));
            setExToDelete(null);
          }
        }} 
        itemName={exToDelete?.name} 
      />

      {/* STICKY HEADER */}
      <div style={{ 
        position: 'sticky', top: 0, background: 'rgba(18,20,20,0.92)', backdropFilter: 'blur(16px)', 
        zIndex: 80, padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #0056b3 100%)', 
              color: '#fff', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.08em' 
            }}>
              {initialTemplate ? "EDIT ROUTINE" : "ROUTINE BLUEPRINT"}
            </span>
          </div>
          <button 
            style={{ background: 'transparent', border: 'none', color: '#E81123', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: 'pointer' }} 
            onClick={handleCloseRequest}
          >
            <X size={24} />
          </button>
        </div>

        {/* TEMPLATE NAME INPUT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <input
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              className="premiumInput" 
              style={{ 
                width: '100%', 
                fontSize: 20, 
                fontWeight: 800, 
                padding: '12px 16px', 
                letterSpacing: '-0.02em',
                border: (isNameTooLong || isNameEmpty) ? '1px solid #D94A4A' : '1px solid rgba(255,255,255,0.08)',
                color: isNameTooLong ? '#D94A4A' : '#fff'
              }}
              placeholder="e.g. Upper Body Hypertrophy"
              autoFocus
            />
            {(isNameTooLong || isNameEmpty) && (
              <span style={{ 
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: '#D94A4A', color: '#fff', borderRadius: '50%', width: 18, height: 18, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 
              }}>!</span>
            )}
          </div>

          {(isNameTooLong || isNameEmpty) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}>
              <span style={{ color: '#D94A4A', fontSize: 12, fontWeight: 700 }}>
                {isNameEmpty ? "! Routine name cannot be empty." : `! Name cannot exceed ${MAX_TEMPLATE_NAME_LENGTH} characters.`}
              </span>
              <span style={{ color: isNameTooLong ? '#D94A4A' : '#6b7080', fontSize: 11, fontWeight: 700 }}>
                {(template.name || "").trim().length}/{MAX_TEMPLATE_NAME_LENGTH}
              </span>
            </div>
          )}
        </div>
        
        {/* STATS & TARGET MUSCLES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#121214', padding: '10px 14px', borderRadius: 12, border: '1px solid #1c1c1e' }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 700, color: '#8b90a0' }}>
            <span>Exercises: <strong style={{ color: '#fff' }}>{template.exercises.length}</strong></span>
            <span>Target Sets: <strong style={{ color: 'var(--primary)' }}>{totalSets}</strong></span>
          </div>
          {targetMuscleGroups.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {targetMuscleGroups.slice(0, 3).map((grp, i) => (
                <span key={i} style={{ background: '#1C1C1E', color: '#8b90a0', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                  {grp}
                </span>
              ))}
              {targetMuscleGroups.length > 3 && (
                <span style={{ color: '#6b7080', fontSize: 10, fontWeight: 800 }}>+{targetMuscleGroups.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EXERCISES LIST */}
      <div style={{ padding: '20px 16px', display: "flex", flexDirection: "column", gap: 14 }}>
        {template.exercises.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#8b90a0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Exercises ({template.exercises.length})
            </div>
            <button 
              type="button"
              onClick={() => setShowReorderModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', borderRadius: 8, padding: '5px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer'
              }}
            >
              <ArrowUpDown size={13} /> Reorder
            </button>
          </div>
        )}

        {template.exercises.length === 0 ? (
          <div style={{ 
            textAlign: 'center', padding: '48px 20px', background: '#121214', borderRadius: 20, 
            border: '1px dashed #242428', color: '#8b90a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e2e2e2' }}>No exercises in routine yet</div>
              <div style={{ fontSize: 13, color: '#6b7080', marginTop: 4 }}>Add exercises below to build your custom workout blueprint.</div>
            </div>
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={template.exercises.map(e => e.id)} 
            onReorder={(newOrderIds) => {
              const newOrder = newOrderIds.map(id => template.exercises.find(e => e.id === id));
              setTemplate(prev => ({ ...prev, exercises: newOrder }));
            }} 
            style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {template.exercises.map((ex, exIdx) => {
              const exObj = exerciseDict[ex.exerciseId];
              const name = exObj?.name || 'Unknown Exercise';
              const category = exObj?.category || 'Other';
              const equipment = exObj?.equipment || '';
              const requiresWeight = exerciseRequiresWeight(exObj);
              const setsCount = (ex.sets || []).length;

              return (
                <DraggableGroup key={ex.id} groupId={ex.id}>
                  {(dragControls) => (
                    <div style={{
                      background: '#161618',
                      borderRadius: 18,
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: 16,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14
                    }}>
                      {/* CARD HEADER */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div 
                          onPointerDown={(e) => {
                            e.preventDefault();
                            dragControls && dragControls.start(e);
                          }}
                          style={{ cursor: 'grab', padding: '6px 8px', display: 'flex', alignItems: 'center', color: '#8b90a0', touchAction: 'none' }}
                          title="Drag to reorder"
                          aria-label="Drag to reorder"
                        >
                          <GripHorizontal size={20} />
                        </div>

                        {exObj?.imageUrl ? (
                          <img src={exObj.imageUrl} alt={name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', background: '#121212' }} />
                        ) : (
                          <div style={{ width: 38, height: 38, borderRadius: 8, background: '#242428', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 16, color: '#8b90a0', fontWeight: 900 }}>{name.charAt(0)}</span>
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', background: 'rgba(0,122,255,0.12)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                              {category}
                            </span>
                            {equipment && (
                              <span style={{ fontSize: 10, fontWeight: 600, color: '#8b90a0', background: '#242428', padding: '2px 6px', borderRadius: 4 }}>
                                {equipment}
                              </span>
                            )}
                            {!requiresWeight && (
                              <span style={{ fontSize: 9, fontWeight: 800, color: '#30D158', background: 'rgba(48,209,88,0.12)', padding: '2px 5px', borderRadius: 4 }}>
                                BODYWEIGHT
                              </span>
                            )}
                          </div>
                        </div>

                        <button 
                          style={{ background: 'transparent', border: 'none', color: '#6b7080', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => setExToDelete({ idx: exIdx, name })}
                        >
                          <Trash size={18} />
                        </button>
                      </div>

                      {/* TARGET SETS STEPPER HEADER */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e1e22', padding: '10px 14px', borderRadius: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#e2e2e2' }}>
                          Target Sets
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button
                            type="button"
                            disabled={setsCount <= 1}
                            onClick={() => handleSetCountChange(exIdx, -1)}
                            style={{
                              width: 28, height: 28, borderRadius: 14, background: setsCount <= 1 ? '#242428' : 'rgba(255,255,255,0.1)',
                              border: 'none', color: setsCount <= 1 ? '#555' : '#fff', fontSize: 18, fontWeight: 900,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: setsCount <= 1 ? 'not-allowed' : 'pointer'
                            }}
                          >
                            –
                          </button>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', minWidth: 44, textAlign: 'center' }}>
                            {setsCount} {setsCount === 1 ? 'Set' : 'Sets'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSetCountChange(exIdx, 1)}
                            style={{
                              width: 28, height: 28, borderRadius: 14, background: 'var(--primary)',
                              border: 'none', color: '#fff', fontSize: 18, fontWeight: 900,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* INDIVIDUAL SET BLUEPRINT ROWS */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(ex.sets || []).map((s, sIdx) => {
                          const conf = typeConfig[s.type || 'N'] || typeConfig['N'];
                          return (
                            <div 
                              key={sIdx}
                              style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                background: '#121214', padding: '8px 12px', borderRadius: 10, border: '1px solid #1f1f23' 
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#6b7080', width: 44 }}>
                                  Set {sIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEditingSetType({ exIdx, setIdx: sIdx })}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: conf.bg, color: conf.color, border: 'none',
                                    padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <span>{conf.label}</span>
                                  <ChevronDown size={14} />
                                </button>
                              </div>

                              {setsCount > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeIndividualSet(exIdx, sIdx)}
                                  style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}
                                >
                                  <X size={15} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* INSTRUCTIONS / NOTES */}
                      <div>
                        <input
                          value={ex.notes || ""}
                          onChange={(e) => updateExerciseNotes(exIdx, e.target.value)}
                          placeholder="Instructions or target notes (e.g., 8-12 reps, 2s pause)..."
                          style={{
                            width: '100%',
                            background: '#121214',
                            border: '1px solid #1f1f23',
                            borderRadius: 10,
                            color: '#e2e2e2',
                            fontSize: 12,
                            padding: '10px 12px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </DraggableGroup>
              );
            })}
          </Reorder.Group>
        )}

        {/* ADD EXERCISE BUTTON */}
        <button 
          className="dashedBtn" 
          style={{ height: 60, marginTop: 4, borderRadius: 16 }} 
          onClick={() => setShowAdd(true)}
        >
          <Plus size={20} /> Add Exercise to Routine
        </button>

        <AnimatePresence>
          {showAdd && (
            <ExerciseSelectorModal 
              data={data}
              existingExerciseIds={template.exercises.map(e => e.exerciseId)}
              onClose={() => setShowAdd(false)}
              onSelect={addExercise}
            />
          )}
        </AnimatePresence>

        {/* SAVE TEMPLATE BUTTON */}
        {template.exercises.length > 0 && (
          <motion.button 
            whileTap={(!isNameTooLong && !isNameEmpty) ? { scale: 0.96 } : {}}
            className="finishBtn" 
            style={{ 
              padding: 16, 
              marginTop: 12,
              opacity: (isNameTooLong || isNameEmpty) ? 0.5 : 1,
              cursor: (isNameTooLong || isNameEmpty) ? 'not-allowed' : 'pointer'
            }} 
            onClick={attemptFinish}
          >
            <Check size={18} strokeWidth={3} /> {initialTemplate ? "Update Routine Template" : "Save Routine Template"}
          </motion.button>
        )}
      </div>

      {/* SET TYPE PICKER MODAL */}
      <AnimatePresence>
        {editingSetType !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={() => setEditingSetType(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#161618', width: '100%', maxWidth: 480, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 20px', paddingBottom: 40 }}
            >
              <div style={{ width: 40, height: 4, background: '#333535', borderRadius: 2, margin: '0 auto 16px' }} />
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 6 }}>
                Set {editingSetType.setIdx + 1} Target Type
              </div>
              <div style={{ fontSize: 12, color: '#8b90a0', textAlign: 'center', marginBottom: 20 }}>
                Choose the intended intensity or set strategy for this routine
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(typeConfig).map(([key, info]) => (
                  <button 
                    key={key} 
                    style={{ 
                      background: '#1e1e22', border: '1px solid #28282c', display: 'flex', alignItems: 'center', 
                      justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer', borderRadius: 14 
                    }}
                    onClick={() => updateSetType(key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ 
                        background: info.bg, color: info.color, fontWeight: 900, fontSize: 13, 
                        width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                        {info.short}
                      </span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{info.label}</div>
                        <div style={{ color: '#8b90a0', fontSize: 11, marginTop: 2 }}>{info.desc}</div>
                      </div>
                    </div>
                    <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>Select</span>
                  </button>
                ))}
                
                <div style={{ height: 1, background: '#242428', margin: '6px 0' }} />
                
                <button 
                  style={{ 
                    background: 'transparent', border: '1px dashed #333535', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', padding: '12px', cursor: 'pointer', borderRadius: 12, color: 'var(--primary)',
                    fontSize: 13, fontWeight: 700
                  }}
                  onClick={() => updateAllSetsType(template.exercises[editingSetType.exIdx]?.sets[editingSetType.setIdx]?.type || 'N')}
                >
                  Apply this type to all sets of this exercise
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReorderExercisesModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        groupedExercises={template.exercises.map(ex => [ex])}
        data={data}
        onMoveGroup={(gIdx, dir) => moveTemplateExercise(gIdx, dir)}
        onReorderGroups={(newGroups) => {
          setTemplate(prev => ({
            ...prev,
            exercises: newGroups.map(g => g[0])
          }));
        }}
      />

      <ErrorModal
        isOpen={!!templateNameError}
        onClose={() => setTemplateNameError(null)}
        message={templateNameError}
        title="Template Error"
      />
    </div>
  );
}
