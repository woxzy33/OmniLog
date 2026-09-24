import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import MuscleHeatmap from './MuscleHeatmap';
import { styles } from '../styles';
import { useAppStore } from '../store';
import { Plus, X, Check, ChevronLeft, ChevronRight, Search, TrendingUp, Dumbbell, User, Calendar as CalendarIcon, Edit2, Share, Settings, Download, Upload, Filter, Trash2 } from './Icons';
import { formatWeight, translateExerciseName, calculate1RM, validateMeasurement } from '../utils';
import { useTranslation } from 'react-i18next';
import { uid, CATEGORIES, MACHINES } from '../data/exerciseDb';
import { ErrorModal, ConfirmModal } from './WorkoutSafeguards';

const RADAR_AXES = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];
const METRICS = ["weight", "bodyFat", "chest", "leftArm", "rightArm", "leftThigh", "rightThigh", "waist", "calves", "neck", "shoulders", "height"];

const METRIC_LABELS = {
  weight: "Weight", bodyFat: "Body Fat (%)", chest: "Chest (cm)", leftArm: "L. Arm (cm)", rightArm: "R. Arm (cm)",
  leftThigh: "L. Thigh (cm)", rightThigh: "R. Thigh (cm)", waist: "Waist (cm)", calves: "Calves (cm)", neck: "Neck (cm)",
  shoulders: "Shoulders (cm)", height: "Height (cm)"
};

function calculateStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const dates = [...new Set(sessions.map(s => new Date(s.date).toLocaleDateString('en-US')))]
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);

  let checkDate = new Date(dates[0]);
  checkDate.setHours(0,0,0,0);
  
  const diffDays = Math.floor((currentDate - checkDate) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  let expectedDate = checkDate;
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i]);
    d.setHours(0,0,0,0);
    if (d.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

const STATS_RANGES = {
  "This Week": 7,
  "This Month": 30,
  "Last 3 Months": 90,
  "Last Year": 365,
  "All Time": 99999
};

function SubViewHeader({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', padding: 0, cursor: 'pointer' }}>
        <ChevronLeft size={32} />
      </button>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#e2e2e2' }}>{title}</div>
    </div>
  );
}

function DashboardBtn({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ background: '#121212', border: '1px solid transparent', borderRadius: 16, padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12, color: '#e2e2e2', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
      <div style={{ background: 'rgba(0, 122, 255, 0.1)', padding: 8, borderRadius: 10 }}>
        <Icon size={20} color="var(--primary)" />
      </div>
      <span style={{ fontSize: 15, fontWeight: 700 }}>{label}</span>
    </button>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ background: '#121212', padding: 16, borderRadius: 16, flex: 1 }}>
      <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, color: color, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function StatisticsView({ data, onBack, settings }) {
  const [range, setRange] = useState("All Time");

  const filteredSessions = useMemo(() => {
    const days = STATS_RANGES[range];
    const now = new Date();
    return data.sessions.filter(s => Math.abs(now - new Date(s.date)) / (1000 * 60 * 60 * 24) <= days);
  }, [data.sessions, range]);

  const stats = useMemo(() => {
    let vol = 0, reps = 0, sets = 0, duration = 0;
    filteredSessions.forEach(s => {
      duration += (s.durationMins || 0);
      (s.exercises || []).forEach(ex => (ex.sets || []).forEach(set => {
        if (set.completed) {
          vol += (Number(set.weight) || 0) * (Number(set.reps) || 0);
          reps += (Number(set.reps) || 0);
          sets += 1;
        }
      }));
    });
    return { vol, reps, sets, duration, workouts: filteredSessions.length };
  }, [filteredSessions]);

  const radarData = useMemo(() => {
    const dict = {};
    data.exercises.forEach(e => dict[e.id] = e);
    const volumes = {};
    RADAR_AXES.forEach(cat => volumes[cat] = 0);
    filteredSessions.forEach(session => {
      session.exercises.forEach(ex => {
        const exObj = dict[ex.exerciseId];
        if (exObj && volumes[exObj.category] !== undefined) {
          const vol = ex.sets.reduce((acc, s) => acc + (s.completed ? ((Number(s.weight)||0)*(Number(s.reps)||0)) : 0), 0);
          volumes[exObj.category] += vol;
        }
      });
    });
    return RADAR_AXES.map(cat => ({ subject: cat, Volume: volumes[cat] }));
  }, [filteredSessions, data.exercises]);

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}>
      <SubViewHeader title="Statistics" onBack={onBack} />
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {Object.keys(STATS_RANGES).map(r => (
          <button key={r} onClick={() => setRange(r)} style={{ background: range === r ? '#e2e2e2' : '#121212', color: range === r ? '#121212' : '#8b90a0', border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer' }}>{r}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        <StatBox label="Volume" value={`${formatWeight(stats.vol, settings?.unit)} ${settings?.unit || 'kg'}`} color="var(--primary)" />
        <StatBox label="Total Reps" value={stats.reps} color="#E8C12C" />
        <StatBox label="Total Sets" value={stats.sets} color="#e2e2e2" />
        <StatBox label="Time Trained" value={stats.duration < 60 ? `${Math.round(stats.duration)} min` : `${Math.floor(stats.duration/60)}h ${Math.round(stats.duration%60)}m`} color="#e2e2e2" />
        <div style={{ gridColumn: '1 / -1' }}>
          <StatBox label="Total Workouts" value={stats.workouts} color="var(--primary)" />
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>MUSCLE DISTRIBUTION</div>
      <div style={{ background: '#121212', padding: 16, borderRadius: 16, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
            <defs>
              <radialGradient id="radarGradient2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.1} />
              </radialGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7080", fontSize: 11 }} />
            <Radar name="Volume" dataKey="Volume" stroke="var(--primary)" strokeWidth={2} fill="url(#radarGradient2)" fillOpacity={0.6} />
            <Tooltip content={<CustomTooltip unit={settings?.unit} />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label, unit, metricMode }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    let displayVal = val;
    let displayLabel = label;
    
    if (metricMode === 'duration' || payload[0].name === 'duration') {
       const h = Math.floor(val / 60);
       const m = Math.floor(val % 60);
       displayVal = h > 0 ? `${h}h ${m}m` : `${m}m`;
    } else if (metricMode === 'volume' || metricMode === 'weight' || payload[0].name === 'Volume' || payload[0].name === 'maxWeight') {
       const finalWeight = unit === 'lbs' ? Math.round(val * 2.20462) : Math.round(val);
       displayVal = `${finalWeight.toLocaleString()} ${unit || 'kg'}`;
    } else if (metricMode === 'sets' || payload[0].name === 'sets') {
       displayVal = `${val} sets`;
    } else if (metricMode === 'bodyFat') {
       displayVal = `${val}%`;
    } else if (METRIC_LABELS[metricMode] && metricMode !== 'weight') {
       displayVal = `${val} cm`; // fallback for all other measurements
    }
    
    return (
      <div style={{ background: '#121212', border: '1px solid #2A2A2A', borderRadius: 8, padding: '8px 12px', color: '#e2e2e2', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <div style={{ color: '#8b90a0', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase' }}>{displayLabel}</div>
        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 14 }}>{displayVal}</div>
      </div>
    );
  }
  return null;
};

export default function ProfileTab() {
  const { data, persist } = useAppStore();
  const settings = data?.settings || { unit: "kg" };
  const [activeView, setActiveView] = useState("main");
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const handleViewEx = (id) => {
    setSelectedExerciseId(id);
    setActiveView("exerciseDetail");
  };

  return (
    <div style={{ padding: '24px 20px', paddingBottom: 100, overflowY: 'auto', height: '100%' }}>
      <AnimatePresence mode="wait">
        {activeView === "main" && (
          <MainProfileView key="main" data={data} persist={persist} onNavigate={setActiveView} settings={settings} />
        )}
        {activeView === "statistics" && (
          <StatisticsView key="stats" data={data} onBack={() => setActiveView("main")} settings={settings} />
        )}
        {activeView === "exercises" && (
          <ExercisesView key="exercises" data={data} onBack={() => setActiveView("main")} onViewDetail={handleViewEx} settings={settings} />
        )}
        {activeView === "exerciseDetail" && (
          <ExerciseDetailView key="exDetail" data={data} exerciseId={selectedExerciseId} onBack={() => setActiveView("exercises")} settings={settings} />
        )}
        {activeView === "measures" && (
          <MeasuresView key="measures" data={data} persist={persist} onBack={() => setActiveView("main")} settings={settings} />
        )}
        {activeView === "calendar" && (
          <CalendarView key="calendar" data={data} persist={persist} onBack={() => setActiveView("main")} settings={settings} />
        )}
      </AnimatePresence>
    </div>
  );
}

function MainProfileView({ data, persist, onNavigate, settings }) {
  const [activeGraph, setActiveGraph] = useState('chart');
  const [chartMetric, setChartMetric] = useState("duration");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(data.user?.name || "Iron Lifter");
  const [activityPeriod, setActivityPeriod] = useState("weekly");
  const fileInputRef = React.useRef(null);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 150;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          persist({ ...data, user: { ...data.user, avatar: dataUrl } });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const streak = useMemo(() => calculateStreak(data.sessions), [data.sessions]);
  const lifetimeVolume = useMemo(() => {
    let vol = 0;
    data.sessions.forEach(s => (s.exercises || []).forEach(ex => (ex.sets || []).forEach(set => {
      if (set.completed) vol += (Number(set.weight) || 0) * (Number(set.reps) || 0);
    })));
    return vol;
  }, [data.sessions]);

  const activityData = useMemo(() => {
    const bins = [];
    const now = new Date();
    
    if (activityPeriod === "daily") {
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        bins.push({
          date: d,
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          duration: 0, volume: 0, reps: 0
        });
      }
    } else if (activityPeriod === "weekly") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        bins.push({
          date: d,
          label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          duration: 0, volume: 0, reps: 0
        });
      }
    } else {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        bins.push({
          date: d,
          label: d.toLocaleDateString('en-US', { month: 'short' }),
          duration: 0, volume: 0, reps: 0,
          monthStr: `${d.getFullYear()}-${d.getMonth()}`
        });
      }
    }

    data.sessions.forEach(session => {
      const sDate = new Date(session.date);
      let matchIdx = -1;
      
      if (activityPeriod === "daily") {
        const diffDays = Math.floor((now - sDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 13 && diffDays >= 0) matchIdx = 13 - diffDays;
      } else if (activityPeriod === "weekly") {
        const diffDays = Math.floor((now - sDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 83 && diffDays >= 0) matchIdx = 11 - Math.floor(diffDays / 7);
      } else {
        const mStr = `${sDate.getFullYear()}-${sDate.getMonth()}`;
        matchIdx = bins.findIndex(b => b.monthStr === mStr);
      }

      if (matchIdx !== -1 && bins[matchIdx]) {
        bins[matchIdx].duration += session.durationMins || 0;
        session.exercises.forEach(ex => {
          (ex.sets || []).forEach(s => {
            if (s.completed) {
              const w = Number(s.weight) || 0;
              const r = Number(s.reps) || 0;
              bins[matchIdx].volume += (w * r);
              bins[matchIdx].reps += r;
            }
          });
        });
      }
    });

    return bins.map(b => ({
      ...b,
      duration: Math.round(b.duration),
      volume: Math.round(b.volume),
    }));
  }, [data.sessions, activityPeriod]);

  const MAX_USERNAME_LEN = 18;
  const isNameTooLong = tempName.trim().length > MAX_USERNAME_LEN;
  const isNameEmpty = tempName.trim().length === 0;
  const hasNameError = isNameTooLong || isNameEmpty;

  const saveName = () => {
    if (hasNameError) return;
    persist({ ...data, user: { ...data.user, name: tempName.trim() } });
    setIsEditingName(false);
  };

  const cancelEditName = () => {
    setTempName(data.user?.name || "Iron Lifter");
    setIsEditingName(false);
  };

  return (
    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        {isEditingName ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  autoFocus
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveName();
                    if (e.key === 'Escape') cancelEditName();
                  }}
                  className="premiumInput" 
                  style={{ 
                    width: '100%', 
                    fontSize: 22, 
                    textAlign: 'left', 
                    padding: '10px 42px 10px 16px', 
                    background: hasNameError ? 'rgba(217, 74, 74, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: hasNameError ? '1.5px solid #D94A4A' : '1px solid rgba(255,255,255,0.15)',
                    color: hasNameError ? '#D94A4A' : '#e2e2e2'
                  }}
                />
                {hasNameError && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: '#D94A4A', 
                      color: '#fff', 
                      borderRadius: '50%', 
                      width: 20, 
                      height: 20, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 13, 
                      fontWeight: 900 
                    }}
                  >
                    !
                  </span>
                )}
              </div>

              <button
                onClick={saveName}
                disabled={hasNameError}
                title="Save Name"
                style={{
                  background: hasNameError ? '#242428' : 'var(--primary)',
                  color: hasNameError ? '#6b7080' : '#000',
                  border: 'none',
                  borderRadius: 12,
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: hasNameError ? 'not-allowed' : 'pointer',
                  flexShrink: 0
                }}
              >
                <Check size={20} strokeWidth={3} />
              </button>

              <button
                onClick={cancelEditName}
                title="Cancel"
                style={{
                  background: '#1c1c1e',
                  color: '#8b90a0',
                  border: '1px solid #28282c',
                  borderRadius: 12,
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <X size={20} />
              </button>
            </div>

            {isNameTooLong && (
              <div style={{ color: '#D94A4A', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4 }}>
                <span>Username exceeds limit of {MAX_USERNAME_LEN} characters ({tempName.trim().length}/{MAX_USERNAME_LEN})</span>
              </div>
            )}
            {isNameEmpty && (
              <div style={{ color: '#D94A4A', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4 }}>
                <span>Username cannot be empty</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 24, fontWeight: 800, color: '#e2e2e2', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setIsEditingName(true)}>
              {data.user?.name || "Iron Lifter"} <Edit2 size={16} color="#8b90a0" />
            </div>
          </div>
        )}
      </div>

      {/* Premium Profile Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, background: '#121212', padding: 20, borderRadius: 20 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: 'linear-gradient(135deg, var(--primary) 0%, #004D99 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0, 122, 255, 0.25)', overflow: 'hidden' }}>
            {data.user?.avatar ? (
              <img src={data.user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={36} color="#fff" />
            )}
          </div>
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: 13, background: 'var(--primary-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.8)', border: '3px solid #121212' }}>
            <span style={{ color: '#000', fontSize: 16, fontWeight: 900 }}>+</span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
        </div>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#8b90a0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Workouts</div>
            <div style={{ color: '#e2e2e2', fontSize: 24, fontWeight: 800 }}>{data.sessions.length}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#8b90a0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Streak</div>
            <div style={{ color: '#E8C12C', fontSize: 24, fontWeight: 800 }}>{streak} <span style={{ fontSize: 14 }}>🔥</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#8b90a0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Volume</div>
            <div style={{ color: 'var(--primary)', fontSize: 24, fontWeight: 800 }}>{Math.round(lifetimeVolume / 1000)}k</div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card" style={{ padding: '24px 20px', marginBottom: 24  }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => setActiveGraph(activeGraph === 'chart' ? 'heatmap' : 'chart')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {activeGraph === 'chart' ? 'Activity Volume' : '3-Day Fatigue'}
            </div>
            <div style={{ fontSize: 10, color: '#8b90a0', fontWeight: 600, marginTop: 4 }}>
              {activeGraph === 'chart' ? 'Past 6 Months' : 'Current System Load'}
            </div>
          </div>
          <button onClick={() => setActiveGraph(activeGraph === 'chart' ? 'heatmap' : 'chart')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {activeGraph === 'chart' ? (
              <motion.div key="chart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, background: '#121212', padding: 4, borderRadius: 16, marginBottom: 16, maxWidth: 200, margin: '0 auto 16px auto' }}>
                  {['daily', 'weekly', 'monthly'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setActivityPeriod(p)}
                      style={{ 
                        flex: 1,
                        background: activityPeriod === p ? '#333535' : 'transparent',
                        color: activityPeriod === p ? '#e2e2e2' : '#8b90a0',
                        border: 'none', borderRadius: 12, padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div style={{ height: 180, marginBottom: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2722" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: "#8b90a0", fontSize: 10 }} tickLine={false} axisLine={false} dy={10} minTickGap={15} />
                      <YAxis tick={{ fill: "#8b90a0", fontSize: 10 }} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip cursor={{ fill: '#1C1C1E' }} content={<CustomTooltip unit={settings?.unit} metricMode={chartMetric} />} />
                      <Bar dataKey={chartMetric} fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="#003366" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {["duration", "volume", "reps"].map(m => (
                    <button
                      key={m}
                      onClick={() => setChartMetric(m)}
                      style={{
                        flex: 1,
                        background: chartMetric === m ? '#e2e2e2' : '#1C1C1E',
                        color: chartMetric === m ? '#121212' : '#8b90a0',
                        border: 'none', borderRadius: 20, padding: '8px 0', fontSize: 13, fontWeight: 800, textTransform: 'capitalize', transition: 'all 0.2s', cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="heatmap" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ width: '100%', minHeight: 400, paddingTop: 16 }}>
                <MuscleHeatmap sessions={data.sessions} dataExercises={[...(data.exercises || []), ...(data.customExercises || [])]} days={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="sectionLabel" style={{ marginBottom: 12  }}>Dashboard</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <DashboardBtn icon={TrendingUp} label="Statistics" onClick={() => onNavigate("statistics")} />
        <DashboardBtn icon={Dumbbell} label="Exercises" onClick={() => onNavigate("exercises")} />
        <DashboardBtn icon={User} label="Measures" onClick={() => onNavigate("measures")} />
        <DashboardBtn icon={CalendarIcon} label="Calendar" onClick={() => onNavigate("calendar")} />
      </div>
    </motion.div>
  );
}

function ExercisesView({ data, onBack, onViewDetail, settings }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("recent"); // "recent", "1rm", "maxWeight"
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const enrichedExercises = useMemo(() => {
    return data.exercises.map(ex => {
      let prWeight = 0;
      let prWeightReps = 0;
      let best1RM = 0;
      let best1RMReps = 0;
      let best1RMWeight = 0;
      let usageCount = 0;
      let lastDoneDate = 0;

      data.sessions.forEach(s => {
        if (locationFilter !== "All" && (s.locationId || 'loc-default') !== locationFilter) return;

        const matchingExs = (s.exercises || []).filter(se => se.exerciseId === ex.id);
        if (matchingExs.length > 0) {
          usageCount += matchingExs.length;
          const sDate = new Date(s.date).getTime();
          if (sDate > lastDoneDate) lastDoneDate = sDate;
          
          matchingExs.forEach(me => me.sets.forEach(set => {
            if (set.completed) {
              const w = Number(set.weight) || 0;
              const r = Number(set.reps) || 0;
              const rm = calculate1RM(w, r);
              
              if (w > prWeight) {
                prWeight = w;
                prWeightReps = r;
              }
              if (rm > best1RM) {
                best1RM = rm;
                best1RMWeight = w;
                best1RMReps = r;
              }
            }
          }));
        }
      });
      return { ...ex, prWeight, prWeightReps, best1RM, best1RMWeight, best1RMReps, usageCount, lastDoneDate };
    });
  }, [data.exercises, data.sessions, locationFilter]);

  const filteredAndSorted = useMemo(() => {
    const s = search.toLowerCase();
    const matched = enrichedExercises.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(s) || (e.category && e.category.toLowerCase().includes(s));
      const matchCat = categoryFilter === "All" || e.category === categoryFilter;
      const matchEq = equipmentFilter === "All" || e.equipment === equipmentFilter;
      return matchSearch && matchCat && matchEq;
    });
    return matched.sort((a, b) => {
      if (sortMode === "1rm") {
        return b.best1RM - a.best1RM;
      } else if (sortMode === "maxWeight") {
        return b.prWeight - a.prWeight;
      }
      
      // Default: recent
      if (a.usageCount > 0 && b.usageCount === 0) return -1;
      if (b.usageCount > 0 && a.usageCount === 0) return 1;
      if (a.usageCount > 0) return b.lastDoneDate - a.lastDoneDate;
      return a.name.localeCompare(b.name);
    });
  }, [enrichedExercises, search, sortMode, categoryFilter, equipmentFilter]);

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}>
      <SubViewHeader title="Exercises & PRs" onBack={onBack} />
      
      <div style={{ display: 'flex', gap: 12, marginBottom: showFilters ? 12 : 20 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#121212', borderRadius: 12, padding: '14px 16px', border: '1px solid #2A2722' }}>
          <Search size={18} color="#8b90a0" style={{ marginRight: 12 }} />
          <input 
            placeholder="Search exercises..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#e2e2e2', flex: 1, outline: 'none', fontSize: 16, fontWeight: 600 }}
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{ background: showFilters ? 'var(--primary)' : '#121212', color: showFilters ? '#000' : '#8b90a0', border: showFilters ? 'none' : '1px solid #2A2722', borderRadius: 12, width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Filter size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <select 
                value={categoryFilter} 
                onChange={e => setCategoryFilter(e.target.value)} 
                style={{ background: '#121212', border: '1px solid #2A2A2A', color: '#e2e2e2', padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, outline: 'none' }}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select 
                value={equipmentFilter} 
                onChange={e => setEquipmentFilter(e.target.value)} 
                style={{ background: '#121212', border: '1px solid #2A2A2A', color: '#e2e2e2', padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, outline: 'none' }}
              >
                <option value="All">All Equipment</option>
                {MACHINES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <select 
                value={locationFilter} 
                onChange={e => setLocationFilter(e.target.value)} 
                style={{ width: '100%', background: '#121212', border: '1px solid #2A2A2A', color: '#e2e2e2', padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600, outline: 'none' }}
              >
                <option value="All">All Gyms (Global PRs)</option>
                {(data.user?.locations || [{ id: 'loc-default', name: 'Default Gym' }]).map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <button onClick={() => setSortMode('recent')} style={{ background: sortMode === 'recent' ? '#e2e2e2' : '#121212', color: sortMode === 'recent' ? '#121212' : '#8b90a0', border: 'none', borderRadius: 16, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Recent</button>
        <button onClick={() => setSortMode('1rm')} style={{ background: sortMode === '1rm' ? '#e2e2e2' : '#121212', color: sortMode === '1rm' ? '#121212' : '#8b90a0', border: 'none', borderRadius: 16, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Est. 1RM</button>
        <button onClick={() => setSortMode('maxWeight')} style={{ background: sortMode === 'maxWeight' ? '#e2e2e2' : '#121212', color: sortMode === 'maxWeight' ? '#121212' : '#8b90a0', border: 'none', borderRadius: 16, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Max Weight</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredAndSorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#8b90a0', fontSize: 16, fontWeight: 600 }}>No exercises found.</div>
        ) : (
          filteredAndSorted.map(e => (
            <div 
              key={e.id} 
              onClick={() => onViewDetail(e.id)}
              className="exCard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 16, background: '#121212', cursor: 'pointer'  }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 800, color: '#e2e2e2', fontSize: 16 }}>{e.name}</span>
                <span style={{ fontSize: 13, color: '#8b90a0', marginTop: 4, fontWeight: 600 }}>{e.category ? t(`categories.${e.category.toLowerCase()}`, e.category) : ''} {e.usageCount > 0 && `• Done ${e.usageCount}x`}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 700, textTransform: 'uppercase' }}>
                  {sortMode === '1rm' ? 'Est. 1RM' : 'Max Wt'}
                </div>
                <div style={{ fontSize: 18, color: e.best1RM > 0 ? '#E8C12C' : '#333535', fontWeight: 800 }}>
                  {e.best1RM > 0 ? (
                    sortMode === '1rm' 
                      ? `${formatWeight(e.best1RM, settings?.unit)} ${settings?.unit || 'kg'}`
                      : `${formatWeight(e.prWeight, settings?.unit)} ${settings?.unit || 'kg'}`
                  ) : '-'}
                </div>
                {e.best1RM > 0 && (
                  <div style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600, marginTop: 2 }}>
                    {sortMode === '1rm' 
                      ? `(${formatWeight(e.best1RMWeight, settings?.unit)}x${e.best1RMReps})`
                      : `(${e.prWeightReps} reps)`}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function ExerciseDetailView({ data, exerciseId, onBack, settings }) {
  const [range, setRange] = useState("All Time");
  const exercise = data.exercises.find(e => e.id === exerciseId);

  const history = useMemo(() => {
     const points = [];
     data.sessions.forEach(s => {
        const matches = (s.exercises || []).filter(e => e.exerciseId === exerciseId);
        if (matches.length > 0) {
           let maxW = 0;
           let maxReps = 0;
           let max1RM = 0;
           matches.forEach(m => m.sets.forEach(set => {
             if (set.completed) {
                const w = Number(set.weight) || 0;
                const r = Number(set.reps) || 0;
                if (w > maxW) { maxW = w; maxReps = r; }
                const rm = calculate1RM(w, r);
                if (rm > max1RM) max1RM = rm;
             }
           }));
           if (maxW > 0) {
             points.push({ date: new Date(s.date), label: new Date(s.date).toLocaleDateString('en-US', {month:'short', day:'numeric'}), maxWeight: maxW, max1RM, maxReps });
           }
        }
     });
     return points.sort((a,b) => a.date - b.date);
  }, [data.sessions, exerciseId]);

  const filteredHistory = useMemo(() => {
    const days = STATS_RANGES[range];
    const now = new Date();
    return history.filter(h => {
      const diffDays = Math.abs(now - h.date) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });
  }, [history, range]);

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}>
      <SubViewHeader title={exercise?.name || "Exercise"} onBack={onBack} />
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {Object.keys(STATS_RANGES).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              background: range === r ? '#e2e2e2' : '#121212',
              color: range === r ? '#121212' : '#8b90a0',
              border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', transition: 'all 0.2s', cursor: 'pointer'
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <StatBox label="Max Weight" value={history.length > 0 ? `${formatWeight(history.map(h => h.maxWeight).reduce((a,b)=>Math.max(a,b),0), settings?.unit)} ${settings?.unit || 'kg'}` : '-'} color="#E8C12C" />
        <StatBox label="Est. 1RM" value={history.length > 0 ? `${formatWeight(history.map(h => h.max1RM).reduce((a,b)=>Math.max(a,b),0), settings?.unit)} ${settings?.unit || 'kg'}` : '-'} color="var(--primary)" />
      </div>

      <div className="sectionLabel" style={{ marginTop: 24, marginBottom: 16  }}>PROGRESS CHART</div>
      <div className="chartCard" style={{ padding: '16px 0', height: 260  }}>
        {filteredHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={filteredHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMaxWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8C12C" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E8C12C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#6b7080", fontSize: 11 }} stroke="transparent" />
              <YAxis tick={{ fill: "#6b7080", fontSize: 11 }} stroke="transparent" />
              <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeDasharray: '3 3' }} content={<CustomTooltip unit={settings?.unit} />} />
              <Area type="monotone" dataKey="maxWeight" stroke="#E8C12C" strokeWidth={3} fillOpacity={1} fill="url(#colorMaxWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8b90a0', fontSize: 14 }}>
            No data for this range.
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MeasuresView({ data, persist, onBack, settings }) {
  const [selectedMetric, setSelectedMetric] = useState("weight");
  const [showLogModal, setShowLogModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const sliderRef = React.useRef(null);
  const metricBtnRefs = React.useRef({});

  const measurements = data.measurements || [];

  // Chronological sort (oldest to newest) for chart and delta comparison
  const chronological = useMemo(() => {
    return [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [measurements]);

  // Chart data for selected metric
  const chartData = useMemo(() => {
    return chronological
      .map(m => ({
        date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Number(m[selectedMetric]) || 0
      }))
      .filter(m => m.value > 0);
  }, [chronological, selectedMetric]);

  // Reverse chronological (newest to oldest) list for the selected metric
  const historyList = useMemo(() => {
    return [...measurements]
      .filter(m => m[selectedMetric] !== undefined && m[selectedMetric] !== null && m[selectedMetric] !== "")
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [measurements, selectedMetric]);

  const handleSelectMetric = (m) => {
    setSelectedMetric(m);
    if (metricBtnRefs.current[m]) {
      metricBtnRefs.current[m].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction * 160, behavior: 'smooth' });
    }
  };

  // Format value with metric unit
  const formatMetricVal = (val, key) => {
    if (val === undefined || val === null || val === "") return null;
    const num = Number(val);
    if (key === 'weight') {
      const displayVal = settings?.unit === 'lbs' ? (num * 2.20462).toFixed(1) : num.toFixed(1);
      return `${displayVal} ${settings?.unit || 'kg'}`;
    }
    if (key === 'bodyFat') {
      return `${num.toFixed(1)}%`;
    }
    const isImperial = settings?.unit === 'lbs';
    const displayVal = isImperial ? (num / 2.54).toFixed(1) : num.toFixed(1);
    const unit = isImperial ? 'in' : 'cm';
    return `${displayVal} ${unit}`;
  };

  // Calculate delta compared to the previous recorded value for this metric
  const getMetricDelta = (entry, key) => {
    const currentVal = Number(entry[key]);
    if (!currentVal) return null;
    const entryIndex = chronological.findIndex(m => m.id === entry.id || m.date === entry.date);
    if (entryIndex <= 0) return null;

    for (let i = entryIndex - 1; i >= 0; i--) {
      const prevVal = Number(chronological[i][key]);
      if (prevVal) {
        const diff = currentVal - prevVal;
        const isImperial = settings?.unit === 'lbs';
        const displayDiff = key === 'weight'
          ? (isImperial ? diff * 2.20462 : diff)
          : (key === 'bodyFat' ? diff : (isImperial ? diff / 2.54 : diff));
        return {
          diff: displayDiff,
          formatted: (displayDiff > 0 ? `+${displayDiff.toFixed(1)}` : displayDiff.toFixed(1))
        };
      }
    }
    return null;
  };

  const currentMetricIndex = METRICS.indexOf(selectedMetric);

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}>
      <SubViewHeader title="Measurements" onBack={onBack} />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="sectionLabel" style={{ marginBottom: 0 }}>PHYSIOLOGICAL TRACKING</div>
        <button 
          onClick={() => setShowLogModal(true)}
          style={{ background: 'var(--primary)', border: 'none', color: '#fff', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,122,255,0.3)' }}
        >
          <Plus size={16} strokeWidth={3} /> Log
        </button>
      </div>

      {/* Slider Controls for Physiological Measures */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => scrollSlider(-1)}
            aria-label="Scroll left"
            style={{
              background: '#161618',
              border: '1px solid #28282c',
              color: '#e2e2e2',
              width: 36,
              height: 36,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              padding: '6px 2px',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              flex: 1,
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {METRICS.map(m => (
              <button
                key={m}
                ref={el => metricBtnRefs.current[m] = el}
                onClick={() => handleSelectMetric(m)}
                style={{
                  background: selectedMetric === m ? 'var(--primary)' : '#141416',
                  color: selectedMetric === m ? '#fff' : '#8b90a0',
                  border: selectedMetric === m ? '1px solid transparent' : '1px solid #242428',
                  borderRadius: 20,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: selectedMetric === m ? '0 4px 12px rgba(0, 122, 255, 0.35)' : 'none'
                }}
              >
                {METRIC_LABELS[m].split(' (')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollSlider(1)}
            aria-label="Scroll right"
            style={{
              background: '#161618',
              border: '1px solid #28282c',
              color: '#e2e2e2',
              width: 36,
              height: 36,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Modern Stylish Slider Track without numbers */}
        <div style={{ padding: '12px 6px 0 6px', position: 'relative' }}>
          <div style={{
            position: 'relative',
            height: 6,
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            {/* Active glowing indicator pill */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${(Math.max(0, currentMetricIndex) / (METRICS.length - 1)) * 82}%`,
              width: `${(1 / METRICS.length) * 100 + 10}%`,
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-alt) 100%)',
              borderRadius: 3,
              boxShadow: '0 0 10px rgba(0, 122, 255, 0.6)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>

          {/* Interactive range overlay for touch/mouse dragging */}
          <input
            type="range"
            min={0}
            max={METRICS.length - 1}
            value={currentMetricIndex >= 0 ? currentMetricIndex : 0}
            onChange={(e) => {
              const idx = Number(e.target.value);
              const m = METRICS[idx];
              if (m) handleSelectMetric(m);
            }}
            style={{
              position: 'absolute',
              top: 6,
              left: 4,
              right: 4,
              width: 'calc(100% - 8px)',
              height: 18,
              opacity: 0,
              cursor: 'pointer',
              margin: 0,
              zIndex: 2
            }}
          />
        </div>
      </div>

      {/* Progress Chart */}
      <div className="chartCard" style={{ padding: '16px 0', height: 260, marginBottom: 24 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-alt)" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#6b7080", fontSize: 11, fontFamily: "'Inter', sans-serif" }} stroke="transparent" axisLine={false} tickLine={false} dy={10} minTickGap={15} />
              <YAxis tick={{ fill: "#6b7080", fontSize: 11, fontFamily: "'Inter', sans-serif" }} stroke="transparent" axisLine={false} tickLine={false} dx={-10} />
              <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }} content={<CustomTooltip unit={settings?.unit} metricMode={selectedMetric} />} />
              <Area type="basis" dataKey="value" stroke="url(#areaGradient)" strokeWidth={4} fillOpacity={1} fill="url(#areaGradient)" activeDot={{ r: 6, fill: "var(--primary-alt)", stroke: "#000", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b90a0', fontSize: 14 }}>
            No chart data logged for {METRIC_LABELS[selectedMetric]?.split(' (')[0]}.
          </div>
        )}
      </div>

      {/* Measurement List From Top To Bottom */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#8b90a0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {METRIC_LABELS[selectedMetric]?.split(' (')[0]} History
          </div>
          <div style={{ fontSize: 12, color: '#555865', marginTop: 2, fontWeight: 600 }}>
            {historyList.length} {historyList.length === 1 ? 'record' : 'records'} logged
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {historyList.length > 0 ? (
          historyList.map((entry) => {
            const dateObj = new Date(entry.date);
            const dateFormatted = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const timeFormatted = dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });

            const delta = getMetricDelta(entry, selectedMetric);
            const mainVal = formatMetricVal(entry[selectedMetric], selectedMetric);

            // Collect all other metrics present in this entry
            const otherMetrics = METRICS.filter(m => m !== selectedMetric && entry[m] !== undefined && entry[m] !== null && entry[m] !== "");

            return (
              <motion.div
                key={entry.id || entry.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#121214',
                  borderRadius: 16,
                  padding: '16px 18px',
                  border: '1px solid #1c1c1e',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e2e2' }}>
                      {dateFormatted}
                    </span>
                    <span style={{ fontSize: 12, color: '#6b7080' }}>
                      • {timeFormatted}
                    </span>
                  </div>

                  <button
                    onClick={() => setDeleteTargetId(entry.id)}
                    title="Delete record"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#6b7080',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 6,
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E81123'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6b7080'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Primary metric row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', background: '#18181c', padding: '12px 14px', borderRadius: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {METRIC_LABELS[selectedMetric]?.split(' (')[0]}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: mainVal ? '#fff' : '#6b7080', marginTop: 2 }}>
                      {mainVal || "Not recorded"}
                    </div>
                  </div>

                  {delta && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 8px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      background: delta.diff > 0 ? 'rgba(48, 209, 88, 0.15)' : (delta.diff < 0 ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255,255,255,0.05)'),
                      color: delta.diff > 0 ? '#30D158' : (delta.diff < 0 ? '#007AFF' : '#8b90a0')
                    }}>
                      <span>{delta.diff > 0 ? '▲' : (delta.diff < 0 ? '▼' : '•')}</span>
                      <span>{delta.formatted} {selectedMetric === 'weight' ? (settings?.unit || 'kg') : (selectedMetric === 'bodyFat' ? '%' : (settings?.unit === 'lbs' ? 'in' : 'cm'))}</span>
                    </div>
                  )}
                </div>

                {/* Other metrics in this entry */}
                {otherMetrics.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
                    {otherMetrics.map(om => (
                      <span
                        key={om}
                        style={{
                          background: '#1c1c1e',
                          color: '#a0a5b5',
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 600,
                          border: '1px solid #28282c'
                        }}
                      >
                        <strong style={{ color: '#e2e2e2' }}>{METRIC_LABELS[om]?.split(' (')[0]}:</strong> {formatMetricVal(entry[om], om)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 20px', background: '#121214', borderRadius: 16, border: '1px dashed #242428', color: '#6b7080' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#a0a5b5', marginBottom: 4 }}>No records found</div>
            <div style={{ fontSize: 13 }}>Tap the "+ Log" button above to record your {METRIC_LABELS[selectedMetric]?.split(' (')[0]} measurement.</div>
          </div>
        )}
      </div>

      <LogMeasurementModal 
        isOpen={showLogModal} 
        onClose={() => setShowLogModal(false)} 
        onSave={(newEntry) => {
          const nextData = { ...data, measurements: [...(data.measurements || []), newEntry] };
          persist(nextData);
          setShowLogModal(false);
        }} 
        settings={settings}
      />

      {/* Proper in-app Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            const updated = (data.measurements || []).filter(m => m.id !== deleteTargetId);
            persist({ ...data, measurements: updated });
            setDeleteTargetId(null);
          }
        }}
        title="Delete Measurement?"
        message="Are you sure you want to permanently delete this logged measurement? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </motion.div>
  );
}


function CalendarView({ data, persist, onBack, settings }) {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0,0,0,0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  });
  
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planName, setPlanName] = useState("");

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrev = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
    setSelectedDate(null);
  };
  
  const handleNext = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
    setSelectedDate(null);
  };

  const toDateStr = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  };

  const isSameDay = (d1, d2) => toDateStr(d1) === toDateStr(d2);

  const handleDayClick = (day) => {
    const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    newSelected.setHours(0,0,0,0);
    setSelectedDate(newSelected);
  };

  const planned = data.plannedSessions || [];

  const workoutDays = useMemo(() => {
    const map = new Map();
    data.sessions.forEach(s => {
      const dateKey = toDateStr(s.date);
      const locName = data.user?.locations?.find(l => l.id === (s.locationId || 'loc-default'))?.name || 'Default Gym';
      map.set(dateKey, locName);
    });
    return map;
  }, [data.sessions, data.user?.locations]);

  const plannedDays = useMemo(() => {
    const set = new Set();
    planned.forEach(p => set.add(toDateStr(p.date)));
    return set;
  }, [planned]);

  const selectedStr = toDateStr(selectedDate);
  const selectedPastSessions = selectedStr ? data.sessions.filter(s => toDateStr(s.date) === selectedStr) : [];
  const selectedPlannedSessions = selectedStr ? planned.filter(p => toDateStr(p.date) === selectedStr) : [];
  
  const actualToday = new Date();
  actualToday.setHours(0,0,0,0);
  const isFuture = selectedDate && (selectedDate >= actualToday);

  const MAX_PLAN_NAME_LEN = 25;
  const isPlanNameTooLong = planName.trim().length > MAX_PLAN_NAME_LEN;
  const isPlanNameEmpty = planName.trim().length === 0;
  const [planError, setPlanError] = useState(null);

  const handleSavePlan = () => {
    if (isPlanNameEmpty) {
      setPlanError("Please provide a name for the planned workout.");
      return;
    }
    if (isPlanNameTooLong) {
      setPlanError(`Workout name cannot exceed ${MAX_PLAN_NAME_LEN} characters.`);
      return;
    }
    const newPlan = { id: uid(), date: selectedDate.toISOString(), name: planName.trim() };
    persist({ ...data, plannedSessions: [...planned, newPlan] });
    setPlanName("");
    setShowPlanModal(false);
  };

  return (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}>
      <SubViewHeader title="Calendar" onBack={onBack} />

      <div style={{ background: '#121212', borderRadius: 20, padding: 20, marginBottom: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={handlePrev} style={{ background: 'none', border: 'none', color: '#8b90a0', cursor: 'pointer' }}><ChevronLeft size={24} /></button>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e2e2' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
          <button onClick={handleNext} style={{ background: 'none', border: 'none', color: '#8b90a0', cursor: 'pointer' }}><ChevronRight size={24} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#8b90a0' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            thisDate.setHours(0,0,0,0);
            
            const isSelected = isSameDay(selectedDate, thisDate);
            const isTodayActual = isSameDay(actualToday, thisDate);
            
            const dateKey = toDateStr(thisDate);
            const locName = workoutDays.get(dateKey);
            const hasPlan = plannedDays.has(dateKey);

            return (
              <div 
                key={day} 
                onClick={() => handleDayClick(day)}
                style={{
                  aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? '#333535' : (isTodayActual ? 'rgba(232,193,44,0.1)' : 'transparent'),
                  border: isTodayActual ? '1px solid #E8C12C' : '1px solid transparent',
                  borderRadius: 12, cursor: 'pointer', position: 'relative'
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: (isSelected || isTodayActual) ? '#e2e2e2' : '#8b90a0' }}>{day}</span>
                <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                  {locName && <div style={{ fontSize: 8, fontWeight: 900, color: '#000', background: '#FF9500', padding: '1px 3px', borderRadius: 4 }}>{locName.substring(0,1).toUpperCase()}</div>}
                  {!locName && hasPlan && <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--primary)' }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sectionLabel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
        <span>{selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select a date'}</span>
        {isFuture && (
          <button onClick={() => setShowPlanModal(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <Plus size={16} /> Plan
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {selectedPastSessions.map(s => {
          const locName = data.user?.locations?.find(l => l.id === (s.locationId || 'loc-default'))?.name || 'Default Gym';
          return (
            <div key={s.id} className="exCard" style={{ background: '#121212', borderLeft: '4px solid #FF9500', padding: '16px'  }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#e2e2e2', display: 'flex', justifyContent: 'space-between' }}>
                {s.name}
                <span style={{ fontSize: 12, color: '#FF9500', fontWeight: 900 }}>{locName}</span>
              </div>
              <div style={{ fontSize: 13, color: '#8b90a0', marginTop: 4, fontWeight: 600 }}>🏋️ {s.exercises.length} exercises</div>
            </div>
          );
        })}
        {selectedPlannedSessions.map(p => (
          <div key={p.id} className="exCard" style={{ background: '#121212', borderLeft: '4px solid var(--primary)', padding: '16px'  }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#e2e2e2' }}>{p.name}</div>
            <div style={{ fontSize: 13, color: '#8b90a0', marginTop: 4, fontWeight: 600 }}>Planned</div>
          </div>
        ))}
        {selectedPastSessions.length === 0 && selectedPlannedSessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: 24, color: '#8b90a0', fontWeight: 600 }}>No activities found.</div>
        )}
      </div>

      <AnimatePresence>
        {showPlanModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              style={{ background: '#121212', padding: 24, borderRadius: 16, width: '85%', maxWidth: 350 }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e2e2', marginBottom: 16 }}>Plan Workout</div>
              
              {data.templates && data.templates.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#8b90a0', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>From Template</div>
                  <select 
                    onChange={e => setPlanName(e.target.value)} 
                    className="premiumInput" style={{ width: '100%', fontSize: 16, textAlign: 'left', appearance: 'none'  }}
                  >
                    <option value="">-- Select Template --</option>
                    {data.templates.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div style={{ fontSize: 12, color: '#8b90a0', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Or Custom Name</div>
              <div style={{ position: 'relative', width: '100%', marginBottom: isPlanNameTooLong || (planName.length > 0 && isPlanNameEmpty) ? 8 : 20 }}>
                <input 
                  type="text" 
                  value={planName} 
                  onChange={e => setPlanName(e.target.value)} 
                  placeholder="e.g. Heavy Legs"
                  className="premiumInput" 
                  style={{ 
                    width: '100%', 
                    fontSize: 16, 
                    textAlign: 'left',
                    paddingRight: isPlanNameTooLong ? 36 : 14,
                    border: isPlanNameTooLong ? '1.5px solid #D94A4A' : '1px solid rgba(255,255,255,0.15)',
                    background: isPlanNameTooLong ? 'rgba(217, 74, 74, 0.1)' : 'rgba(255,255,255,0.05)'
                  }}
                />
                {isPlanNameTooLong && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      right: 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: '#D94A4A', 
                      color: '#fff', 
                      borderRadius: '50%', 
                      width: 20, 
                      height: 20, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 13, 
                      fontWeight: 900 
                    }}
                  >
                    !
                  </span>
                )}
              </div>

              {isPlanNameTooLong && (
                <div style={{ color: '#D94A4A', fontSize: 12, fontWeight: 700, marginBottom: 16, paddingLeft: 2 }}>
                  Name exceeds maximum length of {MAX_PLAN_NAME_LEN} characters ({planName.trim().length}/{MAX_PLAN_NAME_LEN})
                </div>
              )}
              {planName.length > 0 && isPlanNameEmpty && (
                <div style={{ color: '#D94A4A', fontSize: 12, fontWeight: 700, marginBottom: 16, paddingLeft: 2 }}>
                  Name cannot be empty
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="bigCta" style={{ flex: 1, background: 'transparent', color: '#8b90a0', border: '1px solid #333535' }} onClick={() => setShowPlanModal(false)}>Cancel</button>
                <button 
                  className="bigCta" 
                  style={{ 
                    flex: 1, 
                    background: isPlanNameTooLong || isPlanNameEmpty ? '#242428' : 'var(--primary)', 
                    color: isPlanNameTooLong || isPlanNameEmpty ? '#6b7080' : '#fff',
                    cursor: isPlanNameTooLong || isPlanNameEmpty ? 'not-allowed' : 'pointer'
                  }} 
                  disabled={isPlanNameTooLong || isPlanNameEmpty}
                  onClick={handleSavePlan}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ErrorModal 
        isOpen={!!planError} 
        onClose={() => setPlanError(null)} 
        message={planError} 
      />
    </motion.div>
  );
}

function LogMeasurementModal({ isOpen, onClose, onSave, settings }) {
  const [entry, setEntry] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [modalError, setModalError] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const isImperial = settings?.unit === 'lbs';
    const errors = {};
    for (const [key, value] of Object.entries(entry)) {
      if (value !== "" && value != null) {
        const err = validateMeasurement(key, value, settings?.unit, isImperial);
        if (err) {
          errors[key] = err;
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setModalError("Please fix the highlighted measurements before saving.");
      return;
    }
    setValidationErrors({});
    onSave({ id: uid(), date: new Date().toISOString(), ...entry });
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}
      >
        <motion.div 
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{ background: '#121212', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e2e2' }}>Log Body Stats</div>
            <button style={{ background: 'none', border: 'none', color: '#8b90a0' }} onClick={onClose}><X size={24} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {METRICS.map(m => (
              <div key={m} style={{ background: validationErrors[m] ? 'rgba(217, 74, 74, 0.1)' : '#1C1C1E', border: validationErrors[m] ? '1px solid #D94A4A' : '1px solid transparent', borderRadius: 12, padding: '12px 16px', position: 'relative' }}>
                <div style={{ fontSize: 12, color: validationErrors[m] ? '#D94A4A' : '#8b90a0', fontWeight: 700, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  {m === 'weight' ? `Weight (${settings?.unit || 'kg'})` : METRIC_LABELS[m]}
                  {validationErrors[m] && <span style={{ color: '#D94A4A', fontWeight: 900 }}>!</span>}
                </div>
                <input 
                  type="number" 
                  value={entry[m] || ""} 
                  onChange={e => {
                    setEntry({ ...entry, [m]: e.target.value });
                    if (validationErrors[m]) setValidationErrors({ ...validationErrors, [m]: null });
                  }} 
                  placeholder="0.0"
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#e2e2e2', fontSize: 24, fontWeight: 800, outline: 'none' }}
                />
              </div>
            ))}
          </div>

          <button className="finishBtn" style={{ marginTop: 24  }} onClick={handleSave}>
            <Check size={18} strokeWidth={3} /> Save Log
          </button>
        </motion.div>
      </motion.div>
      <ErrorModal isOpen={!!modalError} onClose={() => setModalError(null)} message={modalError} />
    </AnimatePresence>
  );
}


