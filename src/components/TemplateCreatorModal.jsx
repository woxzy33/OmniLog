import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { styles } from '../styles';
import { Plus, X, Check, GripHorizontal, Trash } from './Icons';
import useSound from 'use-sound';
import ExerciseLogger from './ExerciseLogger';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import { uid } from '../data/exerciseDb';
import { formatWeight } from '../utils';
import { ConfirmCancelModal, ConfirmDeleteModal, ErrorModal } from './WorkoutSafeguards';

const MAX_TEMPLATE_NAME_LENGTH = 25;

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

export default function TemplateCreatorModal({ data, onClose, onSave, settings }) {
  const [template, setTemplate] = useState({ name: "", exercises: [] });
  const [showAdd, setShowAdd] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [exToDelete, setExToDelete] = useState(null);
  const [templateNameError, setTemplateNameError] = useState(null);

  const isNameTooLong = (template.name || "").trim().length > MAX_TEMPLATE_NAME_LENGTH;
  const isNameEmpty = (template.name || "").trim() === "";

  const [playPop] = useSound('/pop.mp3', { volume: 0.5 });
  const [playDelete] = useSound('/sounds/wood_plank_flick.ogg', { volume: 0.5 });

  const stats = useMemo(() => {
    let vol = 0;
    let setsCount = 0;
    template.exercises.forEach(ex => {
      (ex.sets || []).forEach(s => {
        vol += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        setsCount += 1;
      });
    });
    return { vol, setsCount };
  }, [template.exercises]);

  const addExercise = (exerciseIds) => {
    playPop();
    const newExercises = exerciseIds.map(id => ({
      id: uid(), exerciseId: id, sets: [{ weight: "", reps: "", rpe: "", completed: false, type: "N" }]
    }));
    setTemplate({
      ...template,
      exercises: [...template.exercises, ...newExercises],
    });
    setShowAdd(false);
  };

  const updateExerciseSets = React.useCallback((idx, sets) => {
    setTemplate(prev => {
      const next = [...prev.exercises];
      next[idx] = { ...next[idx], sets };
      return { ...prev, exercises: next };
    });
  }, []);
  
  const updateExerciseNotes = React.useCallback((exIdx, text) => {
    setTemplate(prev => {
      const next = [...prev.exercises];
      next[exIdx] = { ...next[exIdx], notes: text };
      return { ...prev, exercises: next };
    });
  }, []);

  const handleRemoveExercise = React.useCallback((exIdx, name) => {
    setExToDelete({ idx: exIdx, name });
  }, []);

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
    
    // Convert template exercises back to the format needed for starting a workout
    // We basically just store exactly what's here.
    onSave({
      id: uid(),
      name: template.name.trim(),
      exercises: template.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: (ex.sets || []).map(s => ({ ...s, completed: false })),
        notes: ex.notes || ""
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
            setTemplate({ ...template, exercises: next });
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
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                className="premiumInput" 
                style={{ 
                  width: '100%', 
                  fontSize: 22, 
                  fontWeight: 800, 
                  padding: '12px 16px', 
                  letterSpacing: '-0.02em',
                  border: (isNameTooLong || isNameEmpty) ? '1px solid #D94A4A' : '1px solid rgba(255,255,255,0.08)',
                  color: isNameTooLong ? '#D94A4A' : '#fff'
                }}
                placeholder="Template name"
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
            <button style={{ background: 'transparent', border: 'none', color: '#E81123', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: 'pointer' }} onClick={() => setShowCancelModal(true)}>
              <X size={24} />
            </button>
          </div>

          {(isNameTooLong || isNameEmpty) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}>
              <span style={{ color: '#D94A4A', fontSize: 12, fontWeight: 700 }}>
                {isNameEmpty ? "! Template name cannot be empty." : `! Template name cannot exceed ${MAX_TEMPLATE_NAME_LENGTH} characters.`}
              </span>
              <span style={{ color: isNameTooLong ? '#D94A4A' : '#6b7080', fontSize: 11, fontWeight: 700 }}>
                {(template.name || "").trim().length}/{MAX_TEMPLATE_NAME_LENGTH}
              </span>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b90a0', fontSize: 13, fontWeight: 600 }}>
          <div>Volume: <span style={{ color: '#e2e2e2' }}>{formatWeight(stats.vol, settings?.unit)} {settings?.unit || 'kg'}</span></div>
          <div>Sets: <span style={{ color: '#e2e2e2' }}>{stats.setsCount}</span></div>
        </div>
      </div>

      <div style={{ padding: '24px 16px', display: "flex", flexDirection: "column", gap: 14 }}>
        <Reorder.Group axis="y" values={template.exercises.map(e => e.id)} onReorder={(newOrderIds) => {
          const newOrder = newOrderIds.map(id => template.exercises.find(e => e.id === id));
          setTemplate({ ...template, exercises: newOrder });
        }} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {template.exercises.map((ex, exIdx) => {
            const exObj = data.exercises.find((e) => e.id === ex.exerciseId);
            return (
              <DraggableGroup key={ex.id} groupId={ex.id}>
                {(dragControls) => (
                  <ExerciseLogger
                    exIdx={exIdx}
                    exerciseId={ex.exerciseId}
                    name={exObj?.name || 'Unknown'}
                    category={exObj?.category}
                    equipment={exObj?.equipment}
                    imageUrl={exObj?.imageUrl}
                    sets={ex.sets}
                    priorSets={[]}
                    onSetsChange={updateExerciseSets}
                    notes={ex.notes}
                    onNotesChange={updateExerciseNotes}
                    onRemove={handleRemoveExercise}
                    settings={settings}
                    dragControls={dragControls}
                  />
                )}
              </DraggableGroup>
            );
          })}
        </Reorder.Group>

        <button className="dashedBtn" style={{ height: 64, marginTop: 8  }} onClick={() => setShowAdd(true)}>
          <Plus size={20} /> Add Exercise
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

        {template.exercises.length > 0 && (
          <motion.button 
            whileTap={(!isNameTooLong && !isNameEmpty) ? { scale: 0.95 } : {}}
            className="finishBtn" 
            style={{ 
              padding: 16, 
              marginTop: 16,
              opacity: (isNameTooLong || isNameEmpty) ? 0.5 : 1,
              cursor: (isNameTooLong || isNameEmpty) ? 'not-allowed' : 'pointer'
            }} 
            onClick={attemptFinish}
          >
            <Check size={18} strokeWidth={3} /> Save Template
          </motion.button>
        )}
      </div>

      <ErrorModal
        isOpen={!!templateNameError}
        onClose={() => setTemplateNameError(null)}
        message={templateNameError}
        title="Template Error"
      />
    </div>
  );
}
