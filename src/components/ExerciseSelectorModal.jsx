import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../styles';
import { X, Search, Check, Filter } from './Icons';
import { CATEGORIES, MACHINES } from '../data/exerciseDb';

const HighlightText = ({ text = "", highlight = "" }) => {
  if (!text) return null;
  if (!highlight.trim()) return <span>{text}</span>;
  const terms = highlight.toLowerCase().split(/\s+/).filter(Boolean);
  
  // A simple way is to match any term
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        terms.includes(part.toLowerCase()) ? (
          <span key={i} style={{ color: '#E8C12C', fontWeight: 800 }}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function ExerciseSelectorModal({ data, onClose, onSelect, existingExerciseIds = [] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Determine recent exercises
  const recentExerciseIds = useMemo(() => {
    const recent = new Set();
    // last 20 sessions
    const recentSessions = [...data.sessions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    recentSessions.forEach(s => {
      (s.exercises || []).forEach(e => recent.add(e.exerciseId));
    });
    return recent;
  }, [data.sessions]);

  const filteredExercises = useMemo(() => {
    const searchTerms = search.toLowerCase().split(/\s+/).filter(Boolean);
    
    let list = data.exercises.filter(ex => {
      const exName = (ex.name || "").toLowerCase();
      // match all terms (AND logic)
      const matchSearch = searchTerms.length === 0 || searchTerms.every(term => exName.includes(term));
      const matchCat = categoryFilter === "All" || ex.category === categoryFilter;
      const matchEq = equipmentFilter === "All" || ex.equipment === equipmentFilter; 
      return matchSearch && matchCat && matchEq;
    });

    // Sort by recent first, then alphabetical
    list.sort((a, b) => {
      const aRec = recentExerciseIds.has(a.id);
      const bRec = recentExerciseIds.has(b.id);
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [data.exercises, search, categoryFilter, equipmentFilter, recentExerciseIds]);

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const handleConfirm = () => {
    const duplicates = Array.from(selectedIds).filter(id => existingExerciseIds.includes(id));
    if (duplicates.length > 0) {
      const names = duplicates.map(id => data.exercises.find(e => e.id === id)?.name).join(", ");
      setDuplicateWarning(names);
      return;
    }
    onSelect(Array.from(selectedIds));
    onClose();
  };
  
  const proceedAnyway = () => {
    onSelect(Array.from(selectedIds));
    onClose();
  };
  const categories = ["All", ...CATEGORIES];
  const equipment = ["All", ...MACHINES];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }}
      />
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed', top: 40, left: 0, right: 0, bottom: 0,
          background: '#121212', zIndex: 1000, display: 'flex', flexDirection: 'column',
          borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden'
        }}
      >
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px', background: '#1C1C1E', borderBottom: '1px solid #333535'  }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>Add Exercises</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b90a0' }}><X size={24} /></button>
      </div>

      <div style={{ padding: 20, background: '#121212' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#8b90a0" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              placeholder="Search exercise..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="premiumInput" style={{ width: '100%', paddingLeft: 44, background: 'rgba(255,255,255,0.05)', fontSize: 16  }}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={{ width: 52, height: 52, borderRadius: 26, background: showFilters ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: showFilters ? '#fff' : '#8b90a0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          >
            <Filter size={20} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', marginBottom: 8 }}>Muscle Group</div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                  {categories.map(c => (
                    <button 
                      key={c}
                      onClick={() => setCategoryFilter(c)}
                      style={{ 
                        padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', border: 'none',
                        background: categoryFilter === c ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: categoryFilter === c ? '#fff' : '#8b90a0'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', marginBottom: 8 }}>Equipment</div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                  {equipment.map(e => (
                    <button 
                      key={e}
                      onClick={() => setEquipmentFilter(e)}
                      style={{ 
                        padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', border: 'none',
                        background: equipmentFilter === e ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: equipmentFilter === e ? '#fff' : '#8b90a0'
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingBottom: 100 }}>
        {filteredExercises.map(ex => {
          const selected = selectedIds.has(ex.id);
          const isRecent = recentExerciseIds.has(ex.id);
          return (
            <div 
              key={ex.id}
              onClick={() => toggleSelect(ex.id)}
              style={{ 
                display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #1C1C1E',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: 24, height: 24, borderRadius: 12, border: selected ? 'none' : '2px solid #333535',
                background: selected ? 'var(--primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16,
                flexShrink: 0
              }}>
                {selected && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>
              {ex.imageUrl ? (
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#1C1C1E', marginRight: 12, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={ex.imageUrl} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#1C1C1E', marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#8b90a0', fontSize: 10, fontWeight: 700 }}>N/A</span>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e2e2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <HighlightText text={ex.name} highlight={search} />
                </div>
                <div style={{ fontSize: 13, color: '#8b90a0', marginTop: 4, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ background: '#1C1C1E', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{ex.category}</span>
                  {ex.equipment && <span style={{ background: '#1C1C1E', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{ex.equipment}</span>}
                  {isRecent && (
                    <span style={{ background: 'rgba(232, 193, 44, 0.1)', color: '#E8C12C', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>RECENT</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedIds.size > 0 && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}
        >
          <button 
            onClick={handleConfirm}
            className="bigCta" style={{ width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.8)'  }}
          >
            Add {selectedIds.size} Exercise{selectedIds.size > 1 ? 's' : ''}
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {duplicateWarning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ background: '#1C1C1E', padding: 24, borderRadius: 24, maxWidth: 400, width: '100%', border: '1px solid #333535' }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: 20, color: '#e2e2e2' }}>Already Added</h3>
              <p style={{ margin: '0 0 24px 0', color: '#8b90a0', lineHeight: 1.5 }}>
                You have already added <b>{duplicateWarning}</b> to this session. Do you want to add it again?
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setDuplicateWarning(null)} style={{ flex: 1, padding: 16, borderRadius: 16, background: '#333535', color: '#e2e2e2', border: 'none', fontWeight: 700, fontSize: 16 }}>Cancel</button>
                <button onClick={proceedAnyway} style={{ flex: 1, padding: 16, borderRadius: 16, background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16 }}>Add Anyway</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
}
