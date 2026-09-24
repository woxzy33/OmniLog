import React, { useState, useEffect } from 'react';
import { styles } from '../styles';
import { Clock, X } from './Icons';

export default function FloatingTimer({ endTime: initialEndTime, onClear, onAdd }) {
  const [endTime, setEndTime] = useState(initialEndTime);
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((initialEndTime - Date.now()) / 1000)));

  useEffect(() => {
    setEndTime(initialEndTime);
  }, [initialEndTime]);

  useEffect(() => {
    let audio = null;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      
      setTimeLeft((prev) => {
        if (prev > 0 && remaining === 0) {
          try {
            audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
            audio.play().catch(() => {});
          } catch(e) {}
        }
        return remaining;
      });

      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => {
      clearInterval(interval);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [endTime]);

  const addTime = (seconds) => {
    setEndTime((prev) => prev + seconds * 1000);
    if (onAdd) onAdd(seconds);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div style={{ position: 'relative', width: 'auto', alignSelf: 'center', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{ 
        position: 'fixed', bottom: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '8px 16px', gap: 16, borderRadius: 32,
        background: 'linear-gradient(90deg, rgba(20,20,22,0.1) 0%, rgba(20,20,22,0.95) 20%, rgba(20,20,22,0.95) 80%, rgba(20,20,22,0.1) 100%)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: 'none',
        zIndex: 100 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: 'relative', display: 'flex' }}>
            <Clock size={16} color="var(--primary)" strokeWidth={2.5} />
            {timeLeft > 0 && (
              <div style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: 3, background: '#30D158', boxShadow: '0 0 6px rgba(48,209,88,0.6)' }} />
            )}
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: timeLeft === 0 ? "var(--primary)" : "#e2e2e2", fontFamily: '"JetBrains Mono", monospace' }}>{formatTime(timeLeft)}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button className="miniBtn" style={{ padding: '6px 8px', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#e2e2e2'  }} onClick={() => addTime(-30)}>-30</button>
          <button className="miniBtn" style={{ padding: '6px 8px', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#e2e2e2'  }} onClick={() => addTime(-5)}>-5</button>
          
          <button style={{ background: '#E81123', borderRadius: '50%', width: 28, height: 28, border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 4px', boxShadow: '0 0 10px rgba(232, 17, 35, 0.4)' }} onClick={onClear}>
            <X size={16} strokeWidth={3} />
          </button>
          
          <button className="miniBtn" style={{ padding: '6px 8px', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#e2e2e2'  }} onClick={() => addTime(5)}>+5</button>
          <button className="miniBtn" style={{ padding: '6px 8px', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#e2e2e2'  }} onClick={() => addTime(30)}>+30</button>
        </div>
      </div>
    </div>
  );
}
