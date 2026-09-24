import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MuscleHeatmap from './MuscleHeatmap';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { styles } from '../styles';
import { Check, X, Edit2 } from './Icons';
import { parseVolume, formatWeight, translateExerciseName } from '../utils';
import { CATEGORIES, uid } from '../data/exerciseDb';
import { useTranslation } from 'react-i18next';
import { ErrorModal } from './WorkoutSafeguards';

const MAX_TEMPLATE_NAME_LENGTH = 25;

export default function PostWorkoutSummary({ session, data, persist, onClose, onUpdateDuration, settings, isHistoryView }) {
  const { t } = useTranslation();
  const [showEditTime, setShowEditTime] = useState(false);
  const [activeView, setActiveView] = useState('heatmap');
  const [editMins, setEditMins] = useState(0);
  
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [templateAction, setTemplateAction] = useState('none'); // 'none', 'save_new', 'update_existing'
  const [templateName, setTemplateName] = useState(session.name || "My Workout");
  const [templateError, setTemplateError] = useState(null);

  const isTemplateNameTooLong = (templateName || "").trim().length > MAX_TEMPLATE_NAME_LENGTH;
  const isTemplateNameEmpty = (templateName || "").trim() === "";

  const handleInitialConfirm = () => {
    if (session.templateId && data.templates.find(t => t.id === session.templateId)) {
      setTemplateAction('update_existing');
      setShowTemplatePrompt(true);
    } else {
      setTemplateAction('save_new');
      setShowTemplatePrompt(true);
    }
  };

  const finalizeAndClose = () => {
    if (templateAction === 'save_new' || templateAction === 'update_existing') {
      if (isTemplateNameEmpty) {
        setTemplateError("Template name cannot be empty. Please enter a valid name.");
        return;
      }
      if (isTemplateNameTooLong) {
        setTemplateError(`Template name cannot exceed ${MAX_TEMPLATE_NAME_LENGTH} characters.`);
        return;
      }
    }
    if (templateAction === 'update_existing' && persist && session.templateId) {
      persist(prevData => {
        const nextTemplates = prevData.templates.map(t => {
          if (t.id === session.templateId) {
             return {
               ...t,
               name: templateName.trim(),
               exercises: session.exercises.map(ex => ({
                  exerciseId: ex.exerciseId,
                  notes: ex.notes || "",
                  sets: (ex.sets || []).map(s => ({ weight: s.weight, reps: s.reps, rpe: s.rpe, type: s.type }))
               }))
             };
          }
          return t;
        });
        return { ...prevData, templates: nextTemplates };
      });
    } else if (templateAction === 'save_new' && persist && templateName.trim()) {
      const newTemplate = {
        id: uid(),
        name: templateName.trim(),
        exercises: session.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          notes: ex.notes || "",
          sets: (ex.sets || []).map(s => ({ weight: s.weight, reps: s.reps, rpe: s.rpe, type: s.type }))
        }))
      };
      persist(prevData => ({ ...prevData, templates: [...prevData.templates, newTemplate] }));
    }
    onClose();
  };
  const exerciseDict = useMemo(() => {
    const dict = {};
    data.exercises.forEach(e => dict[e.id] = e);
    return dict;
  }, [data.exercises]);

  const stats = useMemo(() => {
    let vol = 0;
    let setsCount = 0;
    let repsCount = 0;
    let prsCount = 0;
    const muscleMap = {};
    const prDetails = [];
    CATEGORIES.forEach(c => muscleMap[c] = 0);

    session.exercises.forEach(ex => {
      const exObj = exerciseDict[ex.exerciseId];
      (ex.sets || []).forEach(s => {
        if (s.completed) {
          const w = Number(s.weight) || 0;
          const r = Number(s.reps) || 0;
          vol += (w * r);
          setsCount += 1;
          repsCount += r;
          if (s.isPR) {
            prsCount += 1;
            prDetails.push({ 
              exerciseName: exObj?.name || 'Unknown', 
              weight: s.weight, 
              reps: s.reps, 
              ...((typeof s.isPR === 'object') ? s.isPR : {}) 
            });
          }

          if (exObj?.category && muscleMap[exObj.category] !== undefined) {
            muscleMap[exObj.category] += 1;
          }
        }
      });
    });

    const radarData = Object.keys(muscleMap).map(k => ({ subject: k, volume: muscleMap[k] }));
    
    let mainMuscle = "None";
    let maxVol = 0;
    Object.entries(muscleMap).forEach(([k, v]) => {
      if (v > maxVol) { maxVol = v; mainMuscle = k; }
    });

    let durationMins = session.durationMins;
    if (durationMins === undefined || durationMins === null) {
      const endTime = Date.now();
      const startTime = new Date(session.date).getTime();
      durationMins = Math.round((endTime - startTime) / 60000);
    }

    return { vol, setsCount, repsCount, prsCount, prDetails, radarData, mainMuscle, durationMins, muscleMap };
  }, [session, data]);

  const openTimeEditor = () => {
    setEditMins(stats.durationMins);
    setShowEditTime(true);
  };

  const saveTime = () => {
    if (onUpdateDuration) {
      onUpdateDuration(editMins);
    }
    setShowEditTime(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ padding: 16, paddingBottom: 100, minHeight: '100vh', background: '#000000' }}
    >
      <AnimatePresence>
        {showEditTime && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              style={{ background: '#121212', padding: 24, borderRadius: 24, width: '85%', maxWidth: 350, border: '1px solid #2A2A2A', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e2e2', marginBottom: 16, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.02em' }}>Edit Duration</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <button onClick={() => setEditMins(Math.max(0, editMins - 5))} className="miniBtn" style={{ background: '#1c1c1e', padding: '16px 24px', borderRadius: 16, fontSize: 18, color: '#fff', border: 'none'  }}>-5</button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', fontFamily: '"Inter", sans-serif', textShadow: '0 2px 12px rgba(255,255,255,0.1)' }}>{editMins}</div>
                   <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginTop: -4, letterSpacing: '0.05em' }}>MINS</div>
                </div>
                <button onClick={() => setEditMins(editMins + 5)} className="miniBtn" style={{ background: '#1c1c1e', padding: '16px 24px', borderRadius: 16, fontSize: 18, color: '#fff', border: 'none'  }}>+5</button>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ flex: 1, background: 'transparent', color: '#8b90a0', border: '1px solid #2A2A2A', borderRadius: 16, padding: 16, fontWeight: 700, fontSize: 15 }} onClick={() => setShowEditTime(false)}>Cancel</button>
                <button style={{ flex: 1, background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 16, padding: 16, fontWeight: 700, fontSize: 15, boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.3)' }} onClick={saveTime}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ 
            fontFamily: '"Inter", sans-serif', fontSize: 28, fontWeight: 800, 
            background: 'linear-gradient(90deg, #ffffff 0%, #a0a5b5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', 
            letterSpacing: '-0.03em', marginBottom: 4
          }}>
            {isHistoryView ? "Session Log" : "Workout Complete"}
          </div>
          {isHistoryView && (
            <>
              <div style={{ color: '#8b90a0', fontSize: 13, fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div style={{ color: 'var(--primary)', fontSize: 11, marginTop: 6, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"Inter", sans-serif', display: 'inline-flex', alignItems: 'center', background: 'rgba(var(--primary-rgb), 0.1)', padding: '4px 8px', borderRadius: 6 }}>
                <span style={{ marginRight: 4 }}>📍</span> {data.user?.locations?.find(l => l.id === (session.locationId || 'loc-default'))?.name || 'Default Gym'}
              </div>
            </>
          )}
        </div>
        <button style={{ background: '#0a0a0c', border: '1px solid #2A2A2A', color: '#8b90a0', cursor: 'pointer', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 32 }}>
        <StatBox label="Time" value={`${stats.durationMins}m`} onClick={onUpdateDuration ? openTimeEditor : undefined} icon={onUpdateDuration ? <Edit2 size={10} color="#8b90a0" /> : null} />
        <StatBox label="Volume" value={`${formatWeight(stats.vol, settings?.unit)} ${settings?.unit || "kg"}`} />
        <StatBox label="Sets" value={stats.setsCount} />
        <StatBox label="PRs" value={stats.prsCount} highlight={stats.prsCount > 0} />
      </div>
      
      <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)', padding: '16px 0', borderRadius: 24, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 300, marginBottom: 16 }}>
          <button onClick={() => setActiveView(activeView === 'heatmap' ? 'radar' : 'heatmap')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, color: '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center' }}>
            {activeView === 'heatmap' ? 'FATIGUE HEATMAP' : 'MUSCLE VOLUME'}
          </div>
          <button onClick={() => setActiveView(activeView === 'heatmap' ? 'radar' : 'heatmap')} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {activeView === 'heatmap' ? (
              <motion.div key="heatmap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                <div style={{ transform: 'scale(0.95)', transformOrigin: 'center top', filter: 'drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.15))' }}>
                  <MuscleHeatmap sessions={[session]} dataExercises={[...(data.exercises || []), ...(data.customExercises || [])]} ignoreDate={true} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="radar" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.radarData}>
                    <PolarGrid stroke="#2A2A2E" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b90a0', fontSize: 11, fontWeight: 700, fontFamily: '"Inter", sans-serif' }} />
                    <Radar name="Sets" dataKey="volume" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 800, color: '#ffffff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 16, background: 'var(--primary)', borderRadius: 2 }}></div>
        Muscle Split
      </div>
      
      <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.entries(stats.muscleMap)
          .filter(([_, v]) => v > 0)
          .sort((a, b) => b[1] - a[1])
          .map(([muscle, setAmount]) => {
            const pct = Math.round((setAmount / stats.setsCount) * 100) || 0;
            return (
              <div key={muscle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 700, color: '#e2e2e2' }}>{muscle} <span style={{color:"#8b90a0", fontWeight:600, marginLeft:4}}>({setAmount})</span></span>
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: '#121212', borderRadius: 3, overflow: 'hidden', border: '1px solid #1c1c1e' }}>
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                    style={{ height: '100%', background: 'var(--primary)', borderRadius: 3, boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.5)' }}
                  />
                </div>
              </div>
            );
        })}
        {stats.setsCount === 0 && (
          <div style={{ fontSize: 12, color: '#8b90a0', textAlign: 'center', fontWeight: 600 }}>No sets recorded.</div>
        )}
      </div>

      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 800, color: '#ffffff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 16, background: 'var(--primary)', borderRadius: 2 }}></div>
        Workout Details
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {session.exercises.map((ex, idx) => {
          const exObj = exerciseDict[ex.exerciseId];
          const exVol = ex.sets.reduce((acc, set) => set.completed ? acc + parseVolume(set.weight, set.reps) : acc, 0);
          
          return (
            <div key={idx} style={{ paddingBottom: 24, borderBottom: idx < session.exercises.length - 1 ? '1px dashed #2A2A2A' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: 16, color: '#ffffff', letterSpacing: '-0.01em' }}>{exObj ? translateExerciseName(exObj.name, t) : "Unknown Move"}</span>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: "var(--primary)", fontWeight: 800, background: 'rgba(var(--primary-rgb), 0.1)', padding: '2px 8px', borderRadius: 6 }}>{formatWeight(exVol, settings?.unit)} {settings?.unit || 'kg'}</span>
              </div>
              
              {ex.notes && (
                <div style={{ fontSize: 12, color: '#8b90a0', fontStyle: 'italic', marginBottom: 16, fontFamily: '"Inter", sans-serif', background: '#0a0a0c', padding: '10px 14px', borderRadius: 12, borderLeft: '2px solid #2A2A2A' }}>
                  "{ex.notes}"
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(ex.sets || []).filter(s => s.completed).map((set, sIdx) => {
                  const pr = typeof set.isPR === 'object' ? set.isPR : null;
                  return (
                    <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6, background: pr ? 'linear-gradient(135deg, rgba(232, 193, 44, 0.1), rgba(232, 193, 44, 0.02))' : 'transparent', border: pr ? '1px solid rgba(232, 193, 44, 0.3)' : '1px solid transparent', padding: pr ? '10px' : '2px 0', borderRadius: 12 }}>
                      <div style={{ fontSize: 14, color: '#e2e2e2', display: 'flex', alignItems: 'center', gap: 12, fontFamily: '"Inter", sans-serif' }}>
                        <span style={{ width: 24, fontWeight: 800, color: pr ? '#E8C12C' : '#555' }}>{sIdx + 1}.</span>
                        <span style={{ fontWeight: 700 }}>{formatWeight(set.weight || 0, settings?.unit)} {settings?.unit || 'kg'} × {set.reps || 0}</span>
                        {set.effort && <span style={{ color: '#8b90a0', fontSize: 12, fontWeight: 700 }}>RPE {set.effort}</span>}
                        
                        {set.isPR && !pr && (
                          <span style={{ color: '#000', fontSize: 10, fontWeight: 800, background: '#E8C12C', padding: '2px 6px', borderRadius: 4, boxShadow: '0 0 8px rgba(232,193,44,0.4)' }}>PR</span>
                        )}
                      </div>
                      
                      {pr && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginLeft: 36 }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: 9, fontWeight: 800, color: '#000', background: pr.type==='1rm'?'#E8C12C':'#0A84FF', padding: '3px 8px', borderRadius: 6, letterSpacing: '0.05em', boxShadow: `0 0 10px ${pr.type==='1rm'?'rgba(232,193,44,0.5)':'rgba(10,132,255,0.5)'}` }}>
                              {pr.type === '1rm' ? '1RM RECORD' : 'VOLUME RECORD'}
                            </span>
                          </div>
                          {pr.oldRecord !== undefined && (
                            <div style={{ fontSize: 12, color: '#e2e2e2', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                              Prev: <span style={{ color: '#8b90a0' }}>{formatWeight(pr.oldRecord, settings?.unit)}</span>
                              {pr.increase > 0 && <span style={{ color: '#30D158', marginLeft: 8, fontWeight: 800, background: 'rgba(48,209,88,0.1)', padding: '2px 6px', borderRadius: 4 }}>+{formatWeight(pr.increase, settings?.unit)}</span>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
        {isHistoryView && (
          <button style={{ flex: 1, background: '#0a0a0c', border: '1px solid #2A2A2A', color: '#e2e2e2', borderRadius: 16, padding: '18px', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: '"Inter", sans-serif' }} onClick={() => { setTemplateAction('save_new'); setShowTemplatePrompt(true); }}>
            Save Template
          </button>
        )}
        <button style={{ flex: isHistoryView ? 1 : 'none', width: isHistoryView ? 'auto' : '100%', background: 'var(--primary)', color: '#000000', borderRadius: 16, padding: '18px', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: '"Inter", sans-serif', boxShadow: '0 4px 16px rgba(var(--primary-rgb), 0.3)' }} onClick={isHistoryView ? onClose : handleInitialConfirm}>
          {isHistoryView ? "Return" : "Confirm Log"}
        </button>
      </div>

      <AnimatePresence>
        {showTemplatePrompt && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              style={{ background: '#121212', padding: 24, borderRadius: 24, width: '90%', maxWidth: 400, border: '1px solid #2A2A2A', boxShadow: '0 12px 48px rgba(0,0,0,0.6)' }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e2e2', marginBottom: 12, letterSpacing: '-0.02em', fontFamily: '"Inter", sans-serif' }}>
                {templateAction === 'update_existing' ? 'Update Template?' : 'Save as Template?'}
              </div>
              <div style={{ fontSize: 14, color: '#8b90a0', marginBottom: 24, lineHeight: '1.5', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                {templateAction === 'update_existing' 
                  ? 'You started this workout from a template. Do you want to save any changes you made back to the template for future use?'
                  : 'Would you like to save this session as a template so you can easily repeat it in the future?'}
              </div>
              
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: (isTemplateNameTooLong || isTemplateNameEmpty) ? '#D94A4A' : '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {(isTemplateNameTooLong || isTemplateNameEmpty) && (
                      <span style={{ background: '#D94A4A', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>!</span>
                    )}
                    Template Name
                  </div>
                  <div style={{ fontSize: 11, color: isTemplateNameTooLong ? '#D94A4A' : '#6b7080', fontWeight: 600 }}>
                    {(templateName || "").trim().length}/{MAX_TEMPLATE_NAME_LENGTH}
                  </div>
                </div>
                <input 
                  type="text" 
                  value={templateName} 
                  onChange={e => setTemplateName(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    background: '#0a0a0c', 
                    border: (isTemplateNameTooLong || isTemplateNameEmpty) ? '1px solid #D94A4A' : '1px solid #2A2A2A', 
                    padding: '16px', 
                    borderRadius: 12, 
                    color: isTemplateNameTooLong ? '#D94A4A' : '#e2e2e2', 
                    fontSize: 16, 
                    fontWeight: 700, 
                    outline: 'none', 
                    fontFamily: '"Inter", sans-serif' 
                  }}
                />
                {(isTemplateNameTooLong || isTemplateNameEmpty) && (
                  <div style={{ color: '#D94A4A', fontSize: 12, fontWeight: 700, marginTop: 6 }}>
                    {isTemplateNameEmpty ? "! Template name cannot be empty." : `! Template name cannot exceed ${MAX_TEMPLATE_NAME_LENGTH} characters.`}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button 
                  onClick={finalizeAndClose}
                  style={{ 
                    width: '100%', 
                    background: (isTemplateNameTooLong || isTemplateNameEmpty) ? '#333' : 'var(--primary)', 
                    color: (isTemplateNameTooLong || isTemplateNameEmpty) ? '#888' : '#000', 
                    padding: 18, 
                    borderRadius: 16, 
                    fontWeight: 800, 
                    fontSize: 15, 
                    border: 'none', 
                    fontFamily: '"Inter", sans-serif', 
                    boxShadow: (isTemplateNameTooLong || isTemplateNameEmpty) ? 'none' : '0 4px 12px rgba(var(--primary-rgb), 0.3)',
                    cursor: (isTemplateNameTooLong || isTemplateNameEmpty) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {templateAction === 'update_existing' ? 'Update Template' : 'Save Template'}
                </button>
                <button 
                  onClick={() => { setTemplateAction('none'); onClose(); }}
                  style={{ width: '100%', background: 'transparent', color: '#8b90a0', border: '1px solid #2A2A2A', padding: 18, borderRadius: 16, fontWeight: 700, fontSize: 15, fontFamily: '"Inter", sans-serif', cursor: 'pointer' }}
                >
                  No, Just Finish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorModal
        isOpen={!!templateError}
        onClose={() => setTemplateError(null)}
        message={templateError}
        title="Template Error"
      />
    </motion.div>
  );
}

function StatBox({ label, value, highlight, onClick, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 0', background: highlight ? 'linear-gradient(135deg, rgba(232, 193, 44, 0.1), rgba(232, 193, 44, 0.02))' : '#0a0a0c', border: highlight ? '1px solid rgba(232, 193, 44, 0.3)' : '1px solid #2A2A2A', borderRadius: 16, cursor: onClick ? 'pointer' : 'default', position: 'relative', boxShadow: highlight ? '0 4px 12px rgba(232, 193, 44, 0.1)' : '0 2px 8px rgba(0,0,0,0.2)' }} onClick={onClick}>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, color: highlight ? '#E8C12C' : '#8b90a0', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 16, fontWeight: 800, color: highlight ? '#E8C12C' : '#e2e2e2', display: 'flex', alignItems: 'center', gap: 4 }}>
        {value}
        {icon && icon}
      </div>
    </div>
  );
}
