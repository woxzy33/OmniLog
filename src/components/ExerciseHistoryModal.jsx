import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { X, Trophy, TrendingUp } from './Icons';
import { formatWeight } from '../utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ExerciseGif from './ExerciseGif';

export default function ExerciseHistoryModal({ exerciseId, data, onClose, settings }) {
  const [chartMode, setChartMode] = useState('1rm'); // '1rm' or 'volume'
  const exObj = data.exercises.find(e => e.id === exerciseId);
  
  const history = useMemo(() => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    let maxWeight = 0;
    let maxRepsForWeight = 0;
    
    const pastSessions = [];
    
    data.sessions.forEach(s => {
      const sDate = new Date(s.date);
      if (sDate >= threeMonthsAgo) {
        const exData = (s.exercises || []).find(e => e.exerciseId === exerciseId);
        if (exData) {
          const completedSets = (exData.sets || []).filter(set => set.completed);
          if (completedSets.length > 0) {
            let sessionMax1RM = 0;
            let sessionVolume = 0;
            
            completedSets.forEach(set => {
              const w = Number(set.weight) || 0;
              const r = Number(set.reps) || 0;
              
              if (w > maxWeight) {
                maxWeight = w;
                maxRepsForWeight = r;
              } else if (w === maxWeight && r > maxRepsForWeight) {
                maxRepsForWeight = r;
              }
              
              const epley1RM = w * (1 + (r / 30));
              if (epley1RM > sessionMax1RM) sessionMax1RM = epley1RM;
              
              sessionVolume += w * r;
            });
            
            pastSessions.push({
              date: sDate,
              dateStr: sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              sessionName: s.name,
              sets: completedSets,
              max1RM: Math.round(sessionMax1RM),
              volume: Math.round(sessionVolume)
            });
          }
        }
      }
    });
    
    return { 
      sessions: pastSessions.sort((a,b) => b.date - a.date), // Descending for list
      chartData: pastSessions.slice().sort((a,b) => a.date - b.date), // Ascending for chart
      pr: maxWeight > 0 ? { weight: maxWeight, reps: maxRepsForWeight } : null
    };
  }, [data.sessions, exerciseId]);

  if (!exObj) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        style={{
          background: '#121212', borderRadius: 20, width: '90%', maxWidth: 400,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}
      >
        <div className="header" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1C1C1E'  }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e2e2' }}>{exObj.name}</div>
          <button style={{ background: 'none', border: 'none', color: '#8b90a0', cursor: 'pointer' }} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {exObj.imageUrl && (
          <div style={{ width: '100%', height: 220, background: '#111', flexShrink: 0 }}>
            <ExerciseGif imageUrl={exObj.imageUrl} alt={exObj.name} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        
        <div style={{ overflowY: 'auto', padding: 16, flex: 1 }}>
          {history.pr && (
            <div style={{ background: 'linear-gradient(135deg, rgba(232,193,44,0.1) 0%, rgba(232,193,44,0.05) 100%)', border: '1px solid rgba(232,193,44,0.2)', borderRadius: 12, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(232,193,44,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={20} color="#E8C12C" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#E8C12C', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>3-Month PR</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e2e2' }}>
                  {formatWeight(history.pr.weight, settings?.unit)} {settings?.unit || 'kg'} <span style={{ fontSize: 14, color: '#8b90a0' }}>x {history.pr.reps}</span>
                </div>
              </div>
            </div>
          )}

          {history.chartData.length > 1 && (
            <div style={{ background: '#1C1C1E', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={16} /> Progress
                </div>
                <div style={{ display: 'flex', background: '#121212', borderRadius: 8, padding: 2 }}>
                  <button 
                    onClick={() => setChartMode('1rm')}
                    style={{ background: chartMode === '1rm' ? '#2c2c2e' : 'transparent', color: chartMode === '1rm' ? '#fff' : '#8b90a0', border: 'none', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Est. 1RM
                  </button>
                  <button 
                    onClick={() => setChartMode('volume')}
                    style={{ background: chartMode === 'volume' ? '#2c2c2e' : 'transparent', color: chartMode === 'volume' ? '#fff' : '#8b90a0', border: 'none', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Volume
                  </button>
                </div>
              </div>
              <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer>
                  <LineChart data={history.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="dateStr" stroke="#6b7080" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7080" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => formatWeight(val, settings?.unit)} />
                    <Tooltip 
                      contentStyle={{ background: '#121212', border: '1px solid #333535', borderRadius: 8, fontSize: 12 }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 800 }}
                      formatter={(value) => [`${formatWeight(value, settings?.unit)} ${settings?.unit || 'kg'}`, chartMode === '1rm' ? 'Est. 1RM' : 'Volume']}
                    />
                    <Line type="monotone" dataKey={chartMode === '1rm' ? 'max1RM' : 'volume'} stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', marginBottom: 12 }}>Past 3 Months</div>
          
          {history.sessions.length === 0 ? (
            <div style={{ color: '#8b90a0', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>No recent history found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.sessions.map((s, i) => (
                <div key={i} style={{ background: '#1C1C1E', borderRadius: 10, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, borderBottom: '1px solid #333535', paddingBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: '#e2e2e2', fontSize: 13 }}>{s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div style={{ fontSize: 12, color: '#8b90a0' }}>{s.sessionName}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {s.sets.map((set, j) => (
                      <div key={j} style={{ fontSize: 13, color: '#e2e2e2', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#8b90a0', fontSize: 11 }}>Set {j+1}</span>
                        <span style={{ fontWeight: 600 }}>{formatWeight(set.weight, settings?.unit)}{settings?.unit || 'kg'} x {set.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
