import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dumbbell, Calendar, Trophy, Clock, TrendingUp, User } from './Icons';
import { parseVolume, formatWeight } from '../utils';

export default function CalendarView({ sessions = [], onSessionClick, data, settings }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState(null);

  const unit = settings?.unit || 'kg';

  const { daysInMonth, firstDayOfMonth, monthName, year, month } = useMemo(() => {
    const yr = currentDate.getFullYear();
    const mo = currentDate.getMonth();
    
    // Number of days in month
    const dim = new Date(yr, mo + 1, 0).getDate();
    
    // First day of month (0 = Sun, 1 = Mon...)
    const fd = new Date(yr, mo, 1).getDay();
    // Monday is 0, Sunday is 6
    const fdom = fd === 0 ? 6 : fd - 1;
    
    const mName = currentDate.toLocaleString('default', { month: 'long' });
    
    return { daysInMonth: dim, firstDayOfMonth: fdom, monthName: mName, year: yr, month: mo };
  }, [currentDate]);

  // Create a map of local YYYY-MM-DD to sessions
  const sessionMap = useMemo(() => {
    const map = {};
    sessions.forEach(s => {
      const d = new Date(s.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(s);
    });
    return map;
  }, [sessions]);

  // Sessions specifically in this calendar month
  const monthSessions = useMemo(() => {
    return sessions.filter(s => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [sessions, year, month]);

  // Comprehensive monthly statistics calculation
  const stats = useMemo(() => {
    const trainedDaysSet = new Set();
    let totalReps = 0;
    let totalVolume = 0;
    let totalPRs = 0;
    let totalDurationMins = 0;
    let totalCompletedSets = 0;
    const categoryCounts = {};

    monthSessions.forEach(s => {
      const d = new Date(s.date);
      const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      trainedDaysSet.add(dateStr);

      totalDurationMins += Number(s.durationMins) || 0;

      (s.exercises || []).forEach(ex => {
        const exObj = data?.exercises?.find(e => e.id === ex.exerciseId);
        const cat = exObj?.category || 'Other';

        (ex.sets || []).forEach(set => {
          if (set.completed) {
            totalCompletedSets++;
            const r = Number(set.reps) || 0;
            const w = Number(set.weight) || 0;
            totalReps += r;
            totalVolume += parseVolume(w, r);
            if (set.isPR) totalPRs++;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          }
        });
      });
    });

    const daysTrained = trainedDaysSet.size;
    const workoutCount = monthSessions.length;
    const avgDuration = workoutCount > 0 ? Math.round(totalDurationMins / workoutCount) : 0;
    const avgVolume = workoutCount > 0 ? Math.round(totalVolume / workoutCount) : 0;
    const weeklyFreq = Number((workoutCount / (daysInMonth / 7)).toFixed(1));

    // Top muscle group
    let topMuscle = { category: 'None', count: 0, percent: 0 };
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > topMuscle.count) {
        topMuscle = { category: cat, count, percent: totalCompletedSets > 0 ? Math.round((count / totalCompletedSets) * 100) : 0 };
      }
    });

    return {
      daysTrained,
      workoutCount,
      totalReps,
      totalVolume,
      totalPRs,
      totalDurationMins,
      totalCompletedSets,
      avgDuration,
      avgVolume,
      weeklyFreq,
      topMuscle
    };
  }, [monthSessions, data?.exercises, daysInMonth]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayStr(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayStr(null);
  };

  const renderDays = () => {
    const days = [];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Weekday headers
    weekDays.forEach(day => {
      days.push(
        <div key={`header-${day}`} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          {day}
        </div>
      );
    });

    // Empty slots before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} style={{ aspectRatio: '1 / 1' }} />);
    }

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const daySessions = sessionMap[dateStr];
      const hasSession = daySessions && daySessions.length > 0;
      const isToday = isCurrentMonth && d === today.getDate();
      const isSelected = selectedDayStr === dateStr;

      let locName = "";
      if (hasSession && data) {
        const lastSess = daySessions[daySessions.length - 1];
        locName = data.user?.locations?.find(l => l.id === (lastSess.locationId || 'loc-default'))?.name || 'Default Gym';
      }

      days.push(
        <motion.div 
          key={`day-${d}`} 
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            if (isSelected) {
              setSelectedDayStr(null);
            } else {
              setSelectedDayStr(dateStr);
            }
          }}
          style={{ 
            aspectRatio: '1 / 1', 
            background: isSelected 
              ? (hasSession ? 'var(--primary)' : 'rgba(255,255,255,0.2)')
              : (hasSession ? 'var(--primary)' : (isToday ? 'rgba(255,255,255,0.08)' : '#141416')),
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            border: isSelected 
              ? '2px solid #fff' 
              : (isToday && !hasSession ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.03)'),
            boxShadow: hasSession ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ fontSize: 13, fontWeight: hasSession || isToday || isSelected ? 800 : 600, color: hasSession || isSelected ? '#fff' : (isToday ? '#fff' : '#6b7080') }}>
            {d}
          </span>
          {hasSession && (
             <div style={{ position: 'absolute', bottom: 3, fontSize: 8, fontWeight: 900, color: '#fff', background: 'rgba(0,0,0,0.35)', padding: '1px 4px', borderRadius: 4 }}>
               {daySessions.length > 1 ? `${daySessions.length}x` : locName.substring(0, 1).toUpperCase()}
             </div>
          )}
        </motion.div>
      );
    }

    return days;
  };

  const selectedSessions = selectedDayStr ? (sessionMap[selectedDayStr] || []) : [];

  return (
    <div style={{ padding: '8px 4px 40px 4px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Month Navigation Card */}
      <div style={{ background: '#121214', borderRadius: 20, padding: 18, border: '1px solid #1c1c1e', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={prevMonth} style={{ background: '#1c1c1e', border: 'none', color: '#e2e2e2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 12 }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', textTransform: 'capitalize' }}>
            {monthName} {year}
          </div>
          <button onClick={nextMonth} style={{ background: '#1c1c1e', border: 'none', color: '#e2e2e2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 12 }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 7 }}>
          {renderDays()}
        </div>
      </div>

      {/* Selected Day View */}
      <AnimatePresence>
        {selectedDayStr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: '#18181c', border: '1px solid #28282c', borderRadius: 18, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#8b90a0', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Workouts on {new Date(selectedDayStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>

              {selectedSessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedSessions.map(s => {
                    let sessVol = 0;
                    let sessSets = 0;
                    let prCount = 0;
                    (s.exercises || []).forEach(ex => {
                      (ex.sets || []).forEach(st => {
                        if (st.completed) {
                          sessSets++;
                          sessVol += parseVolume(st.weight, st.reps);
                          if (st.isPR) prCount++;
                        }
                      });
                    });

                    return (
                      <div
                        key={s.id}
                        onClick={() => onSessionClick && onSessionClick(s)}
                        style={{
                          background: '#121214',
                          border: '1px solid #222226',
                          borderRadius: 14,
                          padding: '14px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{s.name || "Workout Session"}</div>
                          <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span>{s.durationMins || 0} min</span>
                            <span>•</span>
                            <span>{sessSets} sets</span>
                            <span>•</span>
                            <span>{formatWeight(sessVol, unit)} {unit}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {prCount > 0 && (
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#FFD60A', background: 'rgba(255,214,10,0.15)', padding: '3px 7px', borderRadius: 8 }}>
                              🏆 {prCount} PR
                            </span>
                          )}
                          <ChevronRight size={16} color="var(--primary)" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#6b7080', padding: '8px 0' }}>
                  No workouts recorded on this day.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly Statistics Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.2px' }}>
            {monthName} Training Statistics
          </div>
          <div style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600 }}>
            {stats.workoutCount} {stats.workoutCount === 1 ? 'session' : 'sessions'} completed
          </div>
        </div>

        {/* 4 Primary Highlight Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* Days Trained */}
          <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 16, padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Days Trained</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,122,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={15} color="var(--primary)" />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              {stats.daysTrained} <span style={{ fontSize: 14, fontWeight: 600, color: '#8b90a0' }}>/ {daysInMonth}d</span>
            </div>
            <div style={{ fontSize: 11, color: '#30D158', fontWeight: 700, marginTop: 4 }}>
              {Math.round((stats.daysTrained / daysInMonth) * 100)}% consistency
            </div>
          </div>

          {/* Total Weight/Volume */}
          <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 16, padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volume Lifted</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(48,209,88,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell size={15} color="#30D158" />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              {formatWeight(stats.totalVolume, unit)} <span style={{ fontSize: 13, fontWeight: 700, color: '#8b90a0' }}>{unit}</span>
            </div>
            <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600, marginTop: 4 }}>
              {stats.workoutCount > 0 ? `${formatWeight(stats.avgVolume, unit)} ${unit} avg` : 'No volume'}
            </div>
          </div>

          {/* Total Reps */}
          <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 16, padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Reps</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,159,10,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="#FF9F0A" />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              {stats.totalReps.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600, marginTop: 4 }}>
              Across {stats.totalCompletedSets} completed sets
            </div>
          </div>

          {/* PRs Broken */}
          <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 16, padding: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRs Smashed</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,214,10,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={15} color="#FFD60A" />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: stats.totalPRs > 0 ? '#FFD60A' : '#fff', letterSpacing: '-0.5px' }}>
              {stats.totalPRs} <span style={{ fontSize: 14, fontWeight: 600, color: '#8b90a0' }}>PRs</span>
            </div>
            <div style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600, marginTop: 4 }}>
              New records set
            </div>
          </div>
        </div>

        {/* Detailed Insights List */}
        <div style={{ background: '#121214', border: '1px solid #1c1c1e', borderRadius: 18, padding: '6px 18px', display: 'flex', flexDirection: 'column' }}>
          {/* Time Invested */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #1c1c1e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(94,92,230,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} color="#5E5CE6" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e2e2' }}>Time Invested</div>
                <div style={{ fontSize: 11, color: '#8b90a0' }}>Avg {stats.avgDuration}m per session</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
              {Math.floor(stats.totalDurationMins / 60)}h {stats.totalDurationMins % 60}m
            </div>
          </div>

          {/* Top Muscle Group */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #1c1c1e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,55,95,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell size={16} color="#FF375F" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e2e2' }}>Top Targeted Muscle</div>
                <div style={{ fontSize: 11, color: '#8b90a0' }}>{stats.topMuscle.count} sets ({stats.topMuscle.percent}% of monthly volume)</div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>
              {stats.topMuscle.category}
            </div>
          </div>

          {/* Weekly Frequency */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(100,210,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={16} color="#64D2FF" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e2e2' }}>Weekly Pace</div>
                <div style={{ fontSize: 11, color: '#8b90a0' }}>Average workouts per 7 days</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
              {stats.weeklyFreq} / week
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
