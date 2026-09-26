import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Check, Edit2, Trash2 } from './Icons';
import { exerciseRequiresWeight } from '../data/exerciseDb';

const SET_TYPE_LABELS = {
  N: 'Normal',
  W: 'Warmup',
  D: 'Drop',
  F: 'Failure'
};

const SET_TYPE_COLORS = {
  N: '#8b90a0',
  W: '#FF9500',
  D: '#0A84FF',
  F: '#FF453A'
};

export default function TemplateConfirmModal({ isOpen, template, templateName, onConfirm, onCancel, onEdit, onDelete, data }) {
  const activeTemplate = template || null;
  const name = activeTemplate?.name || templateName || "Routine";

  const exerciseDict = useMemo(() => {
    const dict = {};
    (data?.exercises || []).forEach(e => { dict[e.id] = e; });
    return dict;
  }, [data?.exercises]);

  const { totalSets, muscleGroups } = useMemo(() => {
    if (!activeTemplate || !activeTemplate.exercises) return { totalSets: 0, muscleGroups: [] };
    let setsCount = 0;
    const groups = new Set();
    activeTemplate.exercises.forEach(ex => {
      setsCount += (ex.sets || []).length;
      const exObj = exerciseDict[ex.exerciseId];
      if (exObj?.category) groups.add(exObj.category);
    });
    return { totalSets: setsCount, muscleGroups: Array.from(groups) };
  }, [activeTemplate, exerciseDict]);

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
            background: 'rgba(0,0,0,0.85)', 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'center' 
          }}
        >
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            style={{ 
              background: '#121214', 
              borderTopLeftRadius: 28, 
              borderTopRightRadius: 28, 
              width: '100%', 
              maxWidth: 520, 
              border: '1px solid #242428', 
              boxShadow: '0 -12px 48px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '88vh',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(0, 122, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Dumbbell size={22} color="var(--primary)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Routine Overview
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {onEdit && activeTemplate && (
                  <button 
                    onClick={() => onEdit(activeTemplate)}
                    title="Edit Routine"
                    style={{ 
                      background: 'rgba(0, 122, 255, 0.12)', 
                      border: '1px solid rgba(0, 122, 255, 0.25)', 
                      color: 'var(--primary)', 
                      padding: '7px 11px', 
                      borderRadius: 12, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6, 
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 800
                    }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                {onDelete && activeTemplate && (
                  <button 
                    onClick={() => onDelete(activeTemplate)}
                    title="Delete Routine"
                    style={{ 
                      background: 'rgba(217, 74, 74, 0.1)', 
                      border: '1px solid rgba(217, 74, 74, 0.2)', 
                      color: '#D94A4A', 
                      width: 34, 
                      height: 34, 
                      borderRadius: 12, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer' 
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button 
                  onClick={onCancel}
                  style={{ background: '#1c1c20', border: 'none', color: '#8b90a0', width: 34, height: 34, borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Stats Ribbon */}
            <div style={{ padding: '14px 24px', background: '#18181c', borderBottom: '1px solid #222226', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, background: 'rgba(255,255,255,0.06)', color: '#e2e2e2', padding: '4px 10px', borderRadius: 8 }}>
                  {(activeTemplate?.exercises || []).length} Exercises
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, background: 'rgba(255,255,255,0.06)', color: '#e2e2e2', padding: '4px 10px', borderRadius: 8 }}>
                  {totalSets} Target Sets
                </span>
              </div>
              {muscleGroups.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {muscleGroups.slice(0, 3).map(g => (
                    <span key={g} style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', background: 'rgba(0, 122, 255, 0.1)', padding: '3px 8px', borderRadius: 6 }}>
                      {g}
                    </span>
                  ))}
                  {muscleGroups.length > 3 && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#8b90a0', padding: '3px 4px' }}>
                      +{muscleGroups.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Exercise List */}
            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(activeTemplate?.exercises || []).map((ex, idx) => {
                const exObj = exerciseDict[ex.exerciseId];
                const sets = ex.sets || [];
                const reqW = exerciseRequiresWeight(exObj);

                // Group set types
                const typeCounts = {};
                sets.forEach(s => {
                  const t = s.type || 'N';
                  typeCounts[t] = (typeCounts[t] || 0) + 1;
                });

                return (
                  <div 
                    key={idx}
                    style={{ 
                      background: '#18181c', 
                      borderRadius: 16, 
                      padding: '14px 16px', 
                      border: '1px solid #222228',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                        <div style={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: 8, 
                          background: 'rgba(255,255,255,0.06)', 
                          color: '#8b90a0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: 12, 
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
                            {exObj?.name || 'Unknown Exercise'}
                          </div>
                          <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 2, fontWeight: 600 }}>
                            {exObj?.category || 'General'} • {exObj?.equipment || (reqW ? 'Weighted' : 'Bodyweight')}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#e2e2e2' }}>
                          {sets.length} {sets.length === 1 ? 'Set' : 'Sets'}
                        </span>
                      </div>
                    </div>

                    {/* Set type tags */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 40 }}>
                      {Object.entries(typeCounts).map(([typeKey, count]) => (
                        <span 
                          key={typeKey}
                          style={{ 
                            fontSize: 11, 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: 6, 
                            background: 'rgba(255,255,255,0.04)',
                            color: SET_TYPE_COLORS[typeKey] || '#8b90a0',
                            border: `1px solid ${SET_TYPE_COLORS[typeKey]}33`
                          }}
                        >
                          {count} × {SET_TYPE_LABELS[typeKey] || typeKey}
                        </span>
                      ))}
                    </div>

                    {/* Notes if present */}
                    {ex.notes && (
                      <div style={{ 
                        marginLeft: 40, 
                        marginTop: 4, 
                        fontSize: 12, 
                        color: '#a0a5b5', 
                        fontStyle: 'italic',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '6px 10px',
                        borderRadius: 8,
                        borderLeft: '2px solid var(--primary)'
                      }}>
                        "{ex.notes}"
                      </div>
                    )}
                  </div>
                );
              })}

              {(activeTemplate?.exercises || []).length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#6b7080', fontSize: 14 }}>
                  No exercises in this template.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #1c1c20', background: '#121214', display: 'flex', gap: 12 }}>
              <button 
                onClick={onCancel}
                style={{ 
                  flex: 1, 
                  background: 'transparent', 
                  color: '#8b90a0', 
                  border: '1px solid #28282c', 
                  padding: '16px', 
                  borderRadius: 16, 
                  fontWeight: 700, 
                  fontSize: 15, 
                  cursor: 'pointer' 
                }}
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                style={{ 
                  flex: 2, 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #0056b3 100%)', 
                  color: '#000', 
                  padding: '16px', 
                  borderRadius: 16, 
                  fontWeight: 900, 
                  fontSize: 16, 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(0, 122, 255, 0.35)'
                }}
              >
                <Check size={18} strokeWidth={3} /> Start Workout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
