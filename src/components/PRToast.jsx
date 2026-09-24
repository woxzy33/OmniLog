import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Dumbbell } from './Icons';
import { formatWeight } from '../utils';

export default function PRToast({ notification, settings, onClose }) {
  if (!notification) return null;

  const is1RM = notification.type === '1rm';
  const accentColor = is1RM ? '#E8C12C' : '#0A84FF';
  const shadowGlow = is1RM ? 'rgba(232, 193, 44, 0.4)' : 'rgba(10, 132, 255, 0.4)';
  
  const recordValue = is1RM 
    ? `${formatWeight(notification.achieved, settings?.unit)} ${settings?.unit || 'kg'} (Est. 1RM)` 
    : `${formatWeight(notification.achieved, settings?.unit)} ${settings?.unit || 'kg'}`;
    
  const oldRecordText = `${formatWeight(notification.oldRecord, settings?.unit)} ${settings?.unit || 'kg'}`;
  const increaseText = `+${formatWeight(notification.increase, settings?.unit)} ${settings?.unit || 'kg'}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{ y: 20, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.9 }}
        style={{
          position: 'fixed', top: 10, left: '5%', right: '5%', margin: '0 auto', maxWidth: 400,
          background: '#121212', borderRadius: 20, padding: 20,
          border: `2px solid ${accentColor}`, boxShadow: `0 0 20px ${shadowGlow}, inset 0 0 10px ${shadowGlow.replace('0.4', '0.1')}`,
          display: 'flex', alignItems: 'center', gap: 16, zIndex: 9999, overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -50, width: 100, height: 100, background: accentColor, opacity: 0.1, borderRadius: 50, filter: 'blur(20px)' }} />
        
        <div style={{ width: 48, height: 48, borderRadius: 24, background: `${accentColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          {is1RM ? <Trophy size={28} color={accentColor} /> : <TrendingUp size={28} color={accentColor} />}
        </div>
        
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: 1 }}>
            {is1RM ? 'New 1RM Record!' : 'New Set Volume Record!'}
          </div>
          
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e2e2', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            {recordValue}
            <span style={{ fontSize: 12, padding: '2px 6px', background: 'rgba(48, 209, 88, 0.2)', color: '#30D158', borderRadius: 4, fontWeight: 800 }}>
              {increaseText}
            </span>
          </div>
          
          <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 4 }}>
            Previous best: {oldRecordText}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
