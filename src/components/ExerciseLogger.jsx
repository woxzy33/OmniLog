import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, TimerReset, Settings, GripHorizontal, ChevronDown, Trash, Trophy } from './Icons';
import { useKeypad } from './NumericKeypad';
import PlateCalculatorModal from './PlateCalculatorModal';
import { ErrorModal } from './WorkoutSafeguards';
import { formatWeight, parseDisplayWeight, validateExerciseSet } from '../utils';
import { useTranslation } from 'react-i18next';

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

const SwipeableSetRow = ({ children, onDelete, isCompleted }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      style={{ position: 'relative', marginBottom: 2 }}
    >
      {!isCompleted && (
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%',
          background: 'linear-gradient(90deg, transparent 50%, #E81123 100%)', 
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 24,
          borderRadius: 16, zIndex: 0, cursor: 'pointer'
        }} onClick={onDelete}>
          <Trash size={20} color="#fff" />
        </div>
      )}

      <motion.div
        drag={isCompleted ? false : "x"}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.15}
        style={{
          display: 'flex', gap: 6, alignItems: 'center', padding: '2px 4px',
          background: isCompleted ? '#233825' : '#1C1C1E',
          borderRadius: 12,
          border: isCompleted ? '1px solid rgba(48, 209, 88, 0.25)' : '1px solid transparent',
          position: 'relative', zIndex: 1
        }}
      >
        {children}
        {!isCompleted && (
          <div style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
            width: 8, height: 24, borderRadius: '4px 0 0 4px', background: 'rgba(232, 17, 35, 0.4)',
            boxShadow: '-2px 0 8px rgba(232, 17, 35, 0.2)'
          }} />
        )}
      </motion.div>
    </motion.div>
  );
};

const ExerciseLogger = React.memo(({ exIdx, exerciseId, name, category, equipment, imageUrl, sets, priorSets, supersetPrefix = "", onSetsChange, startTimer, footer, notes, onNotesChange, onRemove, settings, onTitleClick, dragControls }) => {
  const { t } = useTranslation();
  const { openKeypad } = useKeypad();
  const [calcWeight, setCalcWeight] = useState(null);

  const handleInputClick = (type, setIndex) => {
    const currentSet = sets[setIndex];
    let val = currentSet[type] || "";
    
    // For weight, we might want to display in lb if settings demand, but store in kg.
    // However, the keypad allows decimal entry so parseDisplayWeight is tricky mid-typing.
    // We will just let them edit the string directly and format it on save.
    if (type === 'weight' && val && settings?.unit === 'lbs') {
      val = (Number(val) * 2.20462).toFixed(2).replace(/\.00$/, '');
    }
    
    const nextFn = () => {
       if (type === 'weight') handleInputClick('reps', setIndex);
       else if (type === 'reps') handleInputClick('rpe', setIndex);
       else if (type === 'rpe' && setIndex < sets.length - 1) handleInputClick('weight', setIndex + 1);
    };
    
    openKeypad({
      type,
      title: type === 'weight' ? `Set ${setIndex+1} Weight` : type === 'reps' ? `Set ${setIndex+1} Reps` : `Set ${setIndex+1} RPE`,
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
      weight: prev ? prev.weight : "",
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

  const handleUsePrior = (i) => {
    if (!priorSets?.[i]) return;
    const n = [...sets];
    n[i].weight = priorSets[i].weight;
    n[i].reps = priorSets[i].reps;
    onSetsChange(exIdx, n, exerciseId);
  };

  // We use standard rest
  const defaultRest = 90;

  return (
    <motion.div 
      layout
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="card"
      style={{
        padding: 0,
        marginBottom: 10,
        background: allSetsCompleted ? 'linear-gradient(180deg, #1C1C1E 0%, #151617 100%)' : '#1C1C1E',
        border: allSetsCompleted ? '2px solid rgba(48,209,88,0.6)' : '1px solid transparent',
        boxShadow: allSetsCompleted ? '0 0 24px rgba(48,209,88,0.2), inset 0 0 12px rgba(48,209,88,0.1)' : 'none',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', gap: 10 }}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', background: '#121212' }} />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: 6, background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, color: '#333535', fontWeight: 800 }}>{name.charAt(0)}</span>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div 
              style={{ cursor: 'pointer' }}
              onClick={onTitleClick}
            >
              <div style={{ fontSize: 10, color: "var(--primary)", fontWeight: 700, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {supersetPrefix ? `Superset ${supersetPrefix}` : (category ? t(`categories.${category.toLowerCase()}`, category) : 'Exercise')}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#e2e2e2', lineHeight: 1.2 }}>{name}</div>
            </div>
            
            {!allSetsCompleted && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div 
                  onPointerDown={(e) => dragControls && dragControls.start(e)}
                  style={{ cursor: 'grab', padding: 4, display: 'flex', alignItems: 'center', color: '#8b90a0', touchAction: 'none' }}
                >
                  <GripHorizontal size={18} />
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 4 }} onClick={onRemove}>
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
          {(true || notes) && (
            <input 
              value={notes}
              onChange={e => onNotesChange(exIdx, e.target.value)}
              placeholder="Add notes..."
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #333535', color: '#8b90a0', fontSize: 12, padding: '4px 0', marginTop: 4, outline: 'none' }}
            />
          )}
        </div>
      </div>

      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        style={{ padding: '0 12px 12px' }}
      >
        {sets.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, padding: '0 4px', alignItems: 'center' }}>
              <span style={{ width: 44, textAlign: 'center', fontFamily: "Outfit", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6b7080' }}>Set</span>
              <span style={{ flex: 1.5, textAlign: 'left', fontFamily: "Outfit", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6b7080', paddingLeft: 4 }}>Previous</span>
              <span style={{ flex: 1.2, textAlign: 'center', fontFamily: "Outfit", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6b7080' }}>Weight</span>
              <span style={{ flex: 1, textAlign: 'center', fontFamily: "Outfit", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6b7080' }}>Reps</span>
              <span style={{ flex: 1, textAlign: 'center', fontFamily: "Outfit", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6b7080' }}>RPE</span>
              <span style={{ width: 44, textAlign: 'center' }}><Check size={14} color="#6b7080" /></span>
            </div>
          )}

          <AnimatePresence>
            {sets.map((s, i) => (
              <SwipeableSetRow 
                key={i}
                isCompleted={s.completed}
                onDelete={() => {
                  const n = sets.filter((_, idx) => idx !== i);
                  onSetsChange(exIdx, n, exerciseId);
                }}
              >
                <div style={{ width: 44, display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="setIndex" style={{ width: 14  }}>{supersetPrefix}{i + 1}</span>
                  <button
                    style={{
                      background: (typeStyles[s.type] || typeStyles["N"]).bg,
                      color: (typeStyles[s.type] || typeStyles["N"]).text,
                      border: "none",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 4px",
                      width: 22,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      fontFamily: "'JetBrains Mono', monospace"
                    }}
                    onClick={() => setEditingSetType(i)}
                  >
                    {s.type || "N"}
                  </button>
                </div>

                <div style={{ flex: 1.5, textAlign: 'left', paddingLeft: 4 }}>
                  {s.isPR && s.completed ? (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(232, 193, 44, 0.16)',
                      border: '1px solid rgba(232, 193, 44, 0.45)',
                      padding: '2px 6px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 900,
                      color: '#E8C12C',
                      boxShadow: '0 0 10px rgba(232, 193, 44, 0.25)'
                    }}>
                      <Trophy size={11} color="#E8C12C" />
                      <span>PR</span>
                    </div>
                  ) : priorSets?.[i] ? (
                    <div 
                      onClick={() => handleUsePrior(i)}
                      style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {formatWeight(priorSets[i].weight, settings?.unit)}{settings?.unit||'kg'} x {priorSets[i].reps}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: '#444' }}>-</div>
                  )}
                </div>
                
                <div style={{ flex: 1.2 }}>
                  <div
                    onClick={() => {
                      if (s.completed) return;
                      handleInputClick('weight', i);
                    }}
                    onDoubleClick={() => {
                      if (s.completed) return;
                      setCalcWeight(s.weight || priorSets?.[i]?.weight || "0")
                    }}
                    className="setInput" style={{ background: s.completed ? 'transparent' : '#000000', width: '100%', padding: '6px 0px', fontSize: 15, color: s.weight ? '#fff' : '#6b7080'  }}
                  >
                    {s.weight ? formatWeight(s.weight, settings?.unit) : (formatWeight(priorSets?.[i]?.weight, settings?.unit) || "0")}
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div
                    onClick={() => {
                      if (s.completed) return;
                      handleInputClick('reps', i);
                    }}
                    className="setInput" style={{ background: s.completed ? 'transparent' : '#000000', width: '100%', padding: '6px 0px', fontSize: 15, color: s.reps ? '#fff' : '#6b7080'  }}
                  >
                    {s.reps || (priorSets?.[i]?.reps ?? "0")}
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div
                    onClick={() => {
                      if (s.completed) return;
                      handleInputClick('rpe', i);
                    }}
                    className="setInput" style={{ background: s.completed ? 'transparent' : '#000000', width: '100%', padding: '6px 0px', fontSize: 15, color: s.rpe ? '#fff' : '#6b7080'  }}
                  >
                    {s.rpe || "-"}
                  </div>
                </div>
                
                <button
                  className="checkBtn"
                  style={{
                    width: 44,
                    height: 34,
                    borderRadius: 10,
                    background: s.completed ? "#30D158" : "#1C1C1E",
                    color: s.completed ? "#121212" : "#8b90a0",
                  }}
                  onClick={() => {
                    const n = [...sets];
                    const completing = !n[i].completed;
                    
                    if (completing) {
                      const errorMsg = validateExerciseSet(n[i].weight, n[i].reps, category, equipment || 'Other', settings?.unit || 'kg');
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
                  {s.error ? <span style={{ color: '#E81123', fontWeight: 800, fontSize: 16 }}>!</span> : <Check size={18} strokeWidth={s.completed ? 3 : 2} />}
                </button>
              </SwipeableSetRow>
            ))}
          </AnimatePresence>

          <ErrorModal 
            isOpen={!!validationError} 
            onClose={() => setValidationError(null)} 
            message={validationError} 
          />

          <button className="addSetBtn" style={{ padding: '10px', marginTop: 10, fontSize: 13, borderRadius: 12  }} onClick={addSet}>
            <Plus size={16} /> Add Set
          </button>

          {footer}
        </motion.div>

      {calcWeight !== null && (
        <PlateCalculatorModal weight={calcWeight} onClose={() => setCalcWeight(null)} settings={settings} />
      )}

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
              style={{ background: '#121212', width: '100%', maxWidth: 480, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 20px', paddingBottom: 40 }}
            >
              <div style={{ width: 40, height: 4, background: '#333535', borderRadius: 2, margin: '0 auto 20px' }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e2e2', textAlign: 'center', marginBottom: 24 }}>Select Set Type</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(typeStyles).map(([key, info]) => (
                  <button 
                    key={key} 
                    style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 12px', cursor: 'pointer', borderRadius: 12, transition: 'background 0.2s' }}
                    onClick={() => updateSetType(key)}
                  >
                    <span style={{ color: info.bg === '#1C1C1E' ? '#e2e2e2' : info.bg, fontWeight: 700, fontSize: 16, width: 24, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{key}</span>
                    <span style={{ color: '#e2e2e2', fontSize: 16, fontWeight: 600 }}>{t(info.translationKey, info.fallback)}</span>
                  </button>
                ))}
                
                <div style={{ height: 1, background: '#1C1C1E', margin: '8px 0' }} />
                
                <button 
                  style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 12px', cursor: 'pointer', borderRadius: 12 }}
                  onClick={removeSet}
                >
                  <span style={{ color: '#E81123', fontWeight: 700, fontSize: 16, width: 24, textAlign: 'center' }}><X size={18} /></span>
                  <span style={{ color: '#e2e2e2', fontSize: 16, fontWeight: 600 }}>Remove Set</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ExerciseLogger;
