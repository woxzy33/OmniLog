import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { User, Barbell, Calendar as CalendarIcon, List } from './Icons';
import { parseVolume, formatWeight, getUserWeightAtDate } from '../utils';
import { exerciseRequiresWeight } from '../data/exerciseDb';
import PostWorkoutSummary from './PostWorkoutSummary';
import CalendarView from './CalendarView';
import { useAppStore } from '../store';

const formatRelativeTime = (dateStr, durationMins) => {
  const start = new Date(dateStr);
  const end = new Date(start.getTime() + (durationMins || 0) * 60000);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diffDays = Math.round((today - endDate) / (1000 * 60 * 60 * 24));
  const timeStr = end.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});
  if (diffDays === 0) return `Today - ${timeStr}`;
  if (diffDays === 1) return `Yesterday - ${timeStr}`;
  return `${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${timeStr}`;
};

export default function HistoryTab() {
  const { data, persist } = useAppStore();
  const settings = data?.settings || { unit: "kg" };
  const [selectedSession, setSelectedSession] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [viewMode, setViewMode] = useState('feed'); // 'feed' or 'calendar'

  const sortedSessions = [...data.sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const visibleSessions = sortedSessions.slice(0, visibleCount);

  // O(1) Exercise dictionary for rapid lookups
  const exerciseDict = React.useMemo(() => {
    const dict = {};
    data.exercises.forEach(e => dict[e.id] = e);
    return dict;
  }, [data.exercises]);

  if (selectedSession) {
    return (
      <PostWorkoutSummary 
        settings={settings}
        session={selectedSession} 
        data={data} 
        persist={persist}
        isHistoryView={true}
        onClose={() => setSelectedSession(null)} 
      />
    );
  }

  return (
    <div className="pad" style={{ padding: '16px 8px'  }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: '#121212', padding: 4, borderRadius: 12 }}>
        <button 
          onClick={() => setViewMode('feed')}
          style={{ flex: 1, padding: '10px', borderRadius: 8, background: viewMode === 'feed' ? '#2c2c2e' : 'transparent', border: 'none', color: viewMode === 'feed' ? '#fff' : '#8b90a0', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}
        >
          <List size={16} /> Feed
        </button>
        <button 
          onClick={() => setViewMode('calendar')}
          style={{ flex: 1, padding: '10px', borderRadius: 8, background: viewMode === 'calendar' ? '#2c2c2e' : 'transparent', border: 'none', color: viewMode === 'calendar' ? '#fff' : '#8b90a0', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s' }}
        >
          <CalendarIcon size={16} /> Calendar
        </button>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="emptyHint">No sessions logged yet. Complete a session in the Train tab.</div>
      ) : viewMode === 'calendar' ? (
        <CalendarView sessions={sortedSessions} onSessionClick={setSelectedSession} data={data} settings={settings} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {visibleSessions.map((s) => {
            let sessionVolume = 0;
            let prCount = 0;
            const userWeight = getUserWeightAtDate(data?.measurements, s.date);
            (s.exercises || []).forEach(ex => {
              const exObj = exerciseDict[ex.exerciseId];
              const requiresWeight = exerciseRequiresWeight(exObj);
              (ex.sets || []).forEach(set => {
                if (set.completed) {
                  sessionVolume += parseVolume(set.weight, set.reps, requiresWeight ? 0 : userWeight);
                  if (set.isPR) prCount++;
                }
              });
            });

            return (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                key={s.id} 
                style={{ background: "#121212", borderRadius: 16, padding: "20px", cursor: 'pointer' }}
                onClick={() => setSelectedSession(s)}
              >
                <div style={{ fontSize: 13, color: "#8b90a0", marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <User size={14}/> {formatRelativeTime(s.date, s.durationMins)}
                  <span style={{ margin: '0 4px', color: '#333535' }}>|</span>
                  <span style={{ color: 'var(--primary)' }}>{data.user?.locations?.find(l => l.id === (s.locationId || 'loc-default'))?.name || 'Default Gym'}</span>
                </div>
                
                <div className="exCardTitle" style={{ fontSize: 24, color: "#ffffff", marginBottom: 16, textTransform: 'none'  }}>
                  {s.name} {prCount > 0 ? "🏆" : "🔥"}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#8b90a0", marginBottom: 4 }}>Time</div>
                    <div style={{ fontSize: 18, color: "#e2e2e2", fontWeight: 700 }}>
                      {Math.floor(s.durationMins / 60) > 0 ? `${Math.floor(s.durationMins / 60)}h ` : ''}
                      {s.durationMins % 60}m
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "#8b90a0", marginBottom: 4 }}>
                      {sessionVolume > 0 ? "Volume" : "Cardio"}
                    </div>
                    <div style={{ fontSize: 18, color: sessionVolume > 0 ? "#e2e2e2" : "#FF9E40", fontWeight: 700 }}>
                      {sessionVolume > 0 
                        ? `${formatWeight(sessionVolume, settings?.unit)} ${settings?.unit || 'kg'}`
                        : `${(s.cardioActivities || []).reduce((acc, c) => acc + (Number(c.durationMinutes) || 0), 0)}m`
                      }
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "#8b90a0", marginBottom: 4 }}>Records</div>
                    <div style={{ fontSize: 18, color: "#e2e2e2", fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#E8C12C' }}>🏆</span> {prCount}
                    </div>
                  </div>
                </div>

                {s.cardioActivities && s.cardioActivities.length > 0 && sessionVolume > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(255, 107, 0, 0.08)',
                    border: '1px solid rgba(255, 107, 0, 0.2)',
                    padding: '8px 12px',
                    borderRadius: 10,
                    marginBottom: 16
                  }}>
                    <span style={{ fontSize: 15 }}>🔥</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#FF9E40' }}>
                      {s.cardioActivities.map(c => `${c.durationMinutes || 0}m ${c.name}`).join(' • ')}
                    </span>
                  </div>
                )}

                <div style={{ borderTop: "1px solid #333535", paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(s.exercises || []).slice(0, 3).map((ex, exIdx) => {
                    const exObj = exerciseDict[ex.exerciseId];
                    return (
                      <div key={ex.id || exIdx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 22, background: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          {exObj?.imageUrl ? (
                            <img src={exObj.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Barbell size={22} color="#8b90a0" />
                          )}
                        </div>
                        <div style={{ fontSize: 16, color: "#e2e2e2", fontWeight: 600 }}>
                          {ex.sets.length} sets {exObj?.name || "Unknown"}
                        </div>
                      </div>
                    );
                  })}

                  {(!s.exercises || s.exercises.length === 0) && (s.cardioActivities || []).slice(0, 3).map((c, cIdx) => (
                    <div key={c.id || cIdx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                        {c.icon || '🏃'}
                      </div>
                      <div style={{ fontSize: 15, color: "#e2e2e2", fontWeight: 600 }}>
                        <span style={{ color: '#FF9E40', fontWeight: 700 }}>{c.durationMinutes || 0}m</span> {c.name}
                        {c.hasDistance && Number(c.distance) > 0 && <span style={{ color: '#8b90a0', fontSize: 13, marginLeft: 6 }}>({c.distance} km)</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                {((s.exercises?.length || 0) + (!s.exercises?.length ? (s.cardioActivities?.length || 0) : 0)) > 3 && (
                  <div style={{ textAlign: 'center', color: '#8b90a0', fontSize: 14, fontWeight: 600, marginTop: 20 }}>
                    See more activities
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {visibleCount < sortedSessions.length && (
            <button 
              onClick={() => setVisibleCount(c => c + 10)}
              className="bigCta" style={{ background: '#1C1C1E', color: '#e2e2e2', border: '1px solid #333535', marginTop: 12  }}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
