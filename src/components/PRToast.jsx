import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Dumbbell, X } from './Icons';
import { formatWeight } from '../utils';

export default function PRToast({ notification, settings, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const is1RM = notification.type === '1rm';
  const isReps = notification.type === 'reps';
  const accentColor = is1RM ? '#E8C12C' : (isReps ? '#30D158' : '#0A84FF');
  const shadowGlow = is1RM ? 'rgba(232, 193, 44, 0.4)' : (isReps ? 'rgba(48, 209, 88, 0.4)' : 'rgba(10, 132, 255, 0.4)');
  
  const recordValue = is1RM 
    ? `${formatWeight(notification.achieved, settings?.unit)} ${settings?.unit || 'kg'} (Est. 1RM)` 
    : isReps
    ? `${notification.achieved} Reps`
    : `${formatWeight(notification.achieved, settings?.unit)} ${settings?.unit || 'kg'}`;
    
  const oldRecordText = isReps
    ? `${notification.oldRecord} Reps`
    : `${formatWeight(notification.oldRecord, settings?.unit)} ${settings?.unit || 'kg'}`;
  const increaseText = isReps
    ? `+${notification.increase} reps`
    : `+${formatWeight(notification.increase, settings?.unit)} ${settings?.unit || 'kg'}`;

  return (
    <AnimatePresence>
      <motion.div
        key={notification.id || notification.achieved + notification.type}
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{ y: 20, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.9 }}
        drag="y"
        dragConstraints={{ top: -60, bottom: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.y < -30 && onClose) onClose();
        }}
        onClick={() => onClose && onClose()}
        style={{
          position: 'fixed', top: 'calc(10px + env(safe-area-inset-top))', left: '5%', right: '5%', margin: '0 auto', maxWidth: 400,
          background: '#121212', borderRadius: 20, padding: '18px 20px 22px 20px',
          border: `2px solid ${accentColor}`, boxShadow: `0 0 24px ${shadowGlow}, inset 0 0 12px ${shadowGlow.replace('0.4', '0.1')}`,
          display: 'flex', alignItems: 'center', gap: 14, zIndex: 9999, overflow: 'hidden', cursor: 'pointer'
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -50, width: 100, height: 100, background: accentColor, opacity: 0.12, borderRadius: 50, filter: 'blur(20px)' }} />
        
        <div style={{ width: 46, height: 46, borderRadius: 23, background: `${accentColor}26`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0 }}>
          {is1RM ? <Trophy size={26} color={accentColor} /> : <TrendingUp size={26} color={accentColor} />}
        </div>
        
        <div style={{ flex: 1, zIndex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: 1 }}>
            {is1RM ? 'New 1RM Record!' : (isReps ? 'New Reps Record!' : 'New Set Volume Record!')}
          </div>
          
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e2e2', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span>{recordValue}</span>
            <span style={{ fontSize: 11, padding: '2px 6px', background: 'rgba(48, 209, 88, 0.2)', color: '#30D158', borderRadius: 4, fontWeight: 800 }}>
              {increaseText}
            </span>
          </div>
          
          <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 2 }}>
            Previous best: {oldRecordText}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
          style={{
            background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 12,
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8b90a0', cursor: 'pointer', zIndex: 2, flexShrink: 0
          }}
          aria-label="Dismiss PR notification"
        >
          <X size={14} />
        </button>

        {/* Dynamic 5s countdown progress bar */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, height: 3,
            background: accentColor, boxShadow: `0 0 8px ${accentColor}`,
            borderRadius: '0 0 20px 20px'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
