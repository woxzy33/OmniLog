import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Check, Play, Loader2 } from './Icons';
import { getExerciseInstructions } from '../services/ExerciseInstructionService';

const formatMuscleName = (muscle) => {
  if (!muscle) return '';
  return muscle
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export default function ExerciseDetailModal({
  exercise,
  isOpen,
  onClose,
  onSelect,
  isSelected = false
}) {
  const [instructions, setInstructions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);

  useEffect(() => {
    if (!isOpen || !exercise) {
      setInstructions(null);
      setGifLoaded(false);
      setGifError(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getExerciseInstructions(exercise.id, exercise.name)
      .then((data) => {
        if (isMounted) {
          setInstructions(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, exercise]);

  if (!isOpen || !exercise) return null;

  const displayMedia = (!gifError && exercise.gifUrl) ? exercise.gifUrl : exercise.imageUrl;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)'
          }}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={{
            position: 'relative',
            background: '#141416',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)'
          }}
        >
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: '#1A1A1E'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'rgba(var(--primary-rgb), 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Dumbbell size={18} color="var(--primary)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {exercise.name}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {exercise.category} • {exercise.equipment || 'Bodyweight'}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#8b90a0',
                width: 32,
                height: 32,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Animated Demo Visual */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: 300,
              height: 260,
              flexShrink: 0,
              margin: '0 auto',
              borderRadius: 18,
              overflow: 'hidden',
              background: '#0D0E10',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {displayMedia ? (
                <>
                  {!gifLoaded && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0E10' }}>
                      <Loader2 size={28} color="var(--primary)" className="animate-spin" />
                    </div>
                  )}
                  <img
                    src={displayMedia}
                    alt={exercise.name}
                    onLoad={() => setGifLoaded(true)}
                    onError={() => {
                      if (!gifError && exercise.imageUrl) {
                        setGifError(true);
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: gifLoaded ? 1 : 0,
                      transition: 'opacity 0.25s ease'
                    }}
                  />
                  {exercise.gifUrl && !gifError && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 8px',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      border: '1px solid rgba(255,255,255,0.15)'
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: '#30D158', boxShadow: '0 0 6px #30D158' }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>DEMO GIF</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#8b90a0', padding: 20 }}>
                  <Dumbbell size={42} color="#555" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 13 }}>No animation available</div>
                </div>
              )}
            </div>

            {/* Target Anatomy Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Anatomy & Equipment
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {exercise.specificMuscle && (
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 12,
                    background: 'rgba(var(--primary-rgb), 0.15)',
                    border: '1px solid rgba(var(--primary-rgb), 0.3)',
                    color: 'var(--primary-light)',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <span>🎯</span>
                    <span>Primary: <b>{formatMuscleName(exercise.specificMuscle)}</b></span>
                  </div>
                )}
                {exercise.secondaryMuscle && (
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 12,
                    background: 'rgba(255, 159, 10, 0.12)',
                    border: '1px solid rgba(255, 159, 10, 0.3)',
                    color: '#FFB800',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <span>⚡</span>
                    <span>Synergist: <b>{formatMuscleName(exercise.secondaryMuscle)}</b></span>
                  </div>
                )}
                {exercise.equipment && (
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e2e2e2',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    🏋️ {exercise.equipment}
                  </div>
                )}
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#8b90a0',
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {exercise.requiresWeight ? '⚖️ Weighted' : '🤸 Bodyweight'}
                </div>
              </div>
            </div>

            {/* Execution Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                How to Perform
              </div>

              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                  <Loader2 size={18} color="var(--primary)" className="animate-spin" />
                  <span style={{ fontSize: 13, color: '#8b90a0' }}>Loading exercise technique guide...</span>
                </div>
              ) : instructions?.steps && instructions.steps.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {instructions.steps.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        background: 'rgba(var(--primary-rgb), 0.2)',
                        color: 'var(--primary-light)',
                        fontSize: 11,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ fontSize: 13, color: '#d0d4dc', lineHeight: 1.45, flex: 1 }}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 13, color: '#8b90a0', lineHeight: 1.5 }}>
                    {instructions?.summary || 'Execute through full range of motion with a controlled tempo (2s eccentric, 1s explosive concentric). Focus on the mind-muscle connection with the primary target.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: '#1A1A1E',
            display: 'flex',
            gap: 12
          }}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => {
                  onSelect(exercise.id);
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 14,
                  background: isSelected ? '#30D158' : 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                {isSelected ? (
                  <>
                    <Check size={18} strokeWidth={3} />
                    <span>Added to Selection</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Select This Exercise</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Got It
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
