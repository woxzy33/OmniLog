import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ChevronRight } from './Icons';

export default function MinimizedWorkoutBar({ session, onResume }) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!session?.startTime) {
      setElapsed('00:00');
      return;
    }

    const updateTimer = () => {
      const start = new Date(session.startTime).getTime();
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - start) / 1000));
      
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;

      if (hours > 0) {
        setElapsed(
          `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      } else {
        setElapsed(
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session?.startTime]);

  const totalExercises = session?.exercises?.length || 0;
  let completedSets = 0;
  let totalSets = 0;
  (session?.exercises || []).forEach(ex => {
    (ex.sets || []).forEach(s => {
      totalSets++;
      if (s.completed) completedSets++;
    });
  });

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      onClick={onResume}
      style={{
        position: 'fixed',
        bottom: 'calc(62px + env(safe-area-inset-bottom))',
        left: 12,
        right: 12,
        zIndex: 250,
        background: 'linear-gradient(135deg, #1c1c1e 0%, #141416 100%)',
        border: '1px solid rgba(0, 122, 255, 0.4)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 122, 255, 0.15)',
        borderRadius: 18,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        backdropFilter: 'blur(16px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {/* Pulsing workout indicator */}
        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 12, background: 'rgba(0, 122, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Dumbbell size={18} color="var(--primary)" />
          <span 
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#30D158',
              boxShadow: '0 0 6px #30D158'
            }} 
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session?.name || "Active Workout"}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#30D158', background: 'rgba(48, 209, 88, 0.15)', padding: '2px 6px', borderRadius: 6 }}>
              {elapsed}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600, marginTop: 2 }}>
            {totalExercises} {totalExercises === 1 ? 'exercise' : 'exercises'} • {completedSets}/{totalSets} sets done
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--primary)', color: '#000', padding: '8px 14px', borderRadius: 12, fontWeight: 800, fontSize: 13, flexShrink: 0, boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)' }}>
        <span>Resume</span>
        <ChevronRight size={14} strokeWidth={3} />
      </div>
    </motion.div>
  );
}
