import React, { useState } from "react";
import { Plus, TrendingUp, ChevronRight } from "./Icons";
import { motion } from "framer-motion";
import { uid } from "../data/exerciseDb";
import PostWorkoutSummary from "./PostWorkoutSummary";
import ActiveSessionView from "./ActiveSessionView";
import TemplateCreatorModal from "./TemplateCreatorModal";
import TemplateConfirmModal from "./TemplateConfirmModal";
import ProgressionTrackerModal from "./ProgressionTrackerModal";
import { useAppStore, useWorkoutStore } from "../store";

export default function Train({ setShowProfileModal }) {
  const { data, persist } = useAppStore();
  const { 
    activeSession, setActiveSession, 
    summarySession, setSummarySession, 
    startTimer, clearTimer,
    isSessionMinimized, setIsSessionMinimized 
  } = useWorkoutStore();
  const settings = data?.settings || { unit: 'kg' };

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateToConfirm, setTemplateToConfirm] = useState(null);
  const [showProgressionModal, setShowProgressionModal] = useState(false);

  const funFact = React.useMemo(() => {
    if (data.sessions.length === 0) return "Welcome to your training hub! Start your first session today.";
    
    const lastSession = data.sessions[data.sessions.length - 1];
    const diffDays = Math.floor((new Date() - new Date(lastSession.date)) / (1000 * 60 * 60 * 24));
    
    let msg = "";
    if (diffDays === 0) msg = "Great job training today! Keep the momentum going.";
    else if (diffDays === 1) msg = "You trained yesterday! Ready for another round?";
    else if (diffDays < 7) msg = `You last trained ${diffDays} days ago. Time to get back to it!`;
    else msg = "It's been a while. Let's shake off the rust!";

    const exCounts = {};
    data.sessions.forEach(s => (s.exercises || []).forEach(ex => {
      exCounts[ex.exerciseId] = (exCounts[ex.exerciseId] || 0) + 1;
    }));
    let favEx = null;
    let maxCount = 0;
    Object.entries(exCounts).forEach(([id, count]) => {
      if (count > maxCount) { maxCount = count; favEx = id; }
    });

    if (favEx && maxCount > 1) {
      const exName = data.exercises.find(e => e.id === favEx)?.name;
      if (exName) msg += ` Fun fact: Your most frequent move is the ${exName}.`;
    }

    return msg;
  }, [data]);

  const trackedStats = React.useMemo(() => {
    const performedExerciseIds = new Set();
    (data.sessions || []).forEach(s => {
      (s.exercises || []).forEach(ex => {
        if (ex.exerciseId && (ex.sets || []).some(st => Number(st.weight) > 0 || Number(st.reps) > 0)) {
          performedExerciseIds.add(ex.exerciseId);
        }
      });
    });
    const loggedMeasureKeys = new Set();
    (data.measurements || []).forEach(entry => {
      Object.keys(entry).forEach(k => {
        if (k !== 'id' && k !== 'date' && entry[k] !== undefined && entry[k] !== null && entry[k] !== '') {
          loggedMeasureKeys.add(k);
        }
      });
    });
    return {
      exerciseCount: performedExerciseIds.size,
      measureCount: loggedMeasureKeys.size,
      totalSessions: (data.sessions || []).length
    };
  }, [data.sessions, data.measurements]);

  if (summarySession) {
    return (
      <PostWorkoutSummary 
        settings={settings}
        session={summarySession} 
        data={data} 
        persist={persist}
        onClose={() => setSummarySession(null)} 
        onUpdateDuration={(newMins) => {
          const updatedSession = { ...summarySession, durationMins: newMins };
          const idx = data.sessions.findIndex(s => s.id === summarySession.id);
          if (idx !== -1) {
            const nextSessions = [...data.sessions];
            nextSessions[idx] = updatedSession;
            persist({ ...data, sessions: nextSessions });
          }
          setSummarySession(updatedSession);
        }}
      />
    );
  }

  if (activeSession && !isSessionMinimized) {
    return (
      <ActiveSessionView
        settings={settings}
        session={activeSession}
        setSession={setActiveSession}
        onFinish={(finishedSession) => {
          setSummarySession(finishedSession);
          clearTimer();
          setIsSessionMinimized(false);
        }}
        onMinimize={() => setIsSessionMinimized(true)}
        data={data}
        persist={persist}
        startTimer={startTimer}
      />
    );
  }

  const launchTemplate = (template) => {
    setActiveSession({
      id: uid(),
      name: template.name,
      templateId: template.id,
      startTime: Date.now(),
      date: new Date().toISOString(),
      locationId: data.user?.activeLocationId || 'loc-default',
      exercises: template.exercises.map((ex) => ({
        id: uid(),
        exerciseId: ex.exerciseId,
        notes: ex.notes || "",
        sets: ex.sets ? (ex.sets || []).map(s => ({ ...s, completed: false })) : [{ weight: "", reps: "", rpe: "", completed: false, type: "N" }],
      })),
    });
  };

  return (
    <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 100 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            Welcome back, {data.user?.name || "Iron Lifter"}!
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#8b90a0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Gym Profile</div>
            <button 
              onClick={() => setShowProfileModal(true)}
              style={{ background: 'rgba(0, 122, 255, 0.1)', border: '1px solid rgba(0, 122, 255, 0.2)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            >
              {(data.user?.locations || [{ id: 'loc-default', name: 'Default Gym' }]).find(l => l.id === (data.user?.activeLocationId || 'loc-default'))?.name || 'Default Gym'}
            </button>
          </div>
        </div>
        <div style={{ background: '#121212', borderRadius: 20, padding: '20px', border: '1px solid #1c1c1e', color: '#a0a5b5', fontSize: 15, lineHeight: '1.5', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {funFact}
        </div>
      </div>

      <button
        className="bigCta" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0056b3 100%)', border: 'none', boxShadow: '0 12px 24px rgba(0, 122, 255, 0.3)', borderRadius: 24, padding: '20px', fontSize: 18, fontWeight: 800 }}
        onClick={() =>
          setActiveSession({
            id: uid(),
            name: "Workout Session",
            startTime: Date.now(),
            date: new Date().toISOString(),
            locationId: data.user?.activeLocationId || 'loc-default',
            exercises: [],
          })
        }
      >
        <Plus size={24} /> Create New Session
      </button>

      {/* Flagship Progression Tracker Card (Positioned ABOVE Routines for 100% Visibility) */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowProgressionModal(true)}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.16) 0%, rgba(94, 92, 230, 0.22) 100%)',
          border: '1px solid rgba(0, 122, 255, 0.4)',
          borderRadius: 24,
          padding: '22px 20px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(0, 122, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--primary) 0%, #0056b3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 122, 255, 0.4)',
            flexShrink: 0
          }}>
            <TrendingUp size={24} color="#000" strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                Progression Tracker
              </span>
              <span style={{ fontSize: 10, fontWeight: 900, background: 'rgba(255, 214, 10, 0.15)', color: '#FFD60A', padding: '3px 8px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                All-In-One Recap
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#a0a5b5', marginTop: 4, lineHeight: 1.4 }}>
              Deep dive into strength progression rates, 1RM gains & body measurement evolutions across 1M, 3M, and 1Y.
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '12px 16px',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e2e2' }}>
            {trackedStats.exerciseCount > 0 
              ? `${trackedStats.exerciseCount} Exercises • ${trackedStats.measureCount} Measures Tracked`
              : "1M • 3M • 1Y Analytics & Rates"}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 800, fontSize: 13 }}>
            <span>Open Tracker</span>
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#8b90a0', letterSpacing: '0.1em', textTransform: 'uppercase', paddingLeft: 4 }}>
          Your Routines ({data.templates.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.templates.map(t => (
            <button 
              key={t.id} 
              className="exCard" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #1c1c1e", background: "#121212", textAlign: "left", padding: '20px 24px', borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              onClick={() => {
                setTemplateToConfirm(t);
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: '-0.3px' }}>{t.name}</div>
                <div style={{ fontSize: 14, color: "#8b90a0", marginTop: 6, fontWeight: 600 }}>{t.exercises.length} exercises</div>
              </div>
              <div style={{ background: '#1c1c1e', width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="var(--primary)" />
              </div>
            </button>
          ))}
          {data.templates.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 20px', color: '#6b7080', fontSize: 15, background: '#121212', borderRadius: 20, border: '1px dashed #2a2a2e' }}>
              No routines yet. Create a template below to get started.
            </div>
          )}
        </div>
        <button className="dashedBtn" style={{ marginTop: 8, padding: '16px', borderRadius: 20, fontSize: 15, fontWeight: 700 }} onClick={() => setShowTemplateModal(true)}>
          <Plus size={18} /> Create Template
        </button>
      </div>

      {showTemplateModal && (
        <TemplateCreatorModal 
          data={data}
          onClose={() => setShowTemplateModal(false)}
          onSave={(newTemplate) => {
            persist({ ...data, templates: [...data.templates, newTemplate] });
            setShowTemplateModal(false);
          }}
        />
      )}
      
      <TemplateConfirmModal
        isOpen={!!templateToConfirm}
        templateName={templateToConfirm?.name}
        onConfirm={() => {
          launchTemplate(templateToConfirm);
          setTemplateToConfirm(null);
        }}
        onCancel={() => setTemplateToConfirm(null)}
      />

      <ProgressionTrackerModal
        isOpen={showProgressionModal}
        onClose={() => setShowProgressionModal(false)}
        data={data}
      />
    </div>
  );
}
