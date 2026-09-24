import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Edit2, Plus, Trash2 } from './Icons';
import { uid } from '../data/exerciseDb';
import { useAppStore } from '../store';
import { ErrorModal } from './WorkoutSafeguards';

const MAX_GYM_NAME_LENGTH = 20;

export default function GymProfileModal({ onClose }) {
  const { data, persist } = useAppStore();
  const [locations, setLocations] = useState(data.user?.locations || [{ id: 'loc-default', name: 'Default Gym' }]);
  const [activeLocationId, setActiveLocationId] = useState(data.user?.activeLocationId || 'loc-default');
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleSave = (updatedLocs, updatedActiveId) => {
    persist({ 
      ...data, 
      user: { 
        ...data.user, 
        locations: updatedLocs, 
        activeLocationId: updatedActiveId 
      } 
    });
  };

  const handleSelect = (id) => {
    setActiveLocationId(id);
    handleSave(locations, id);
    onClose();
  };

  const startEdit = (loc) => {
    setEditingId(loc.id);
    setEditName(loc.name);
  };

  const [errorMsg, setErrorMsg] = useState(null);

  const saveEdit = (id) => {
    if (!editName.trim()) {
      setErrorMsg("Gym name cannot be empty.");
      return;
    }
    if (editName.trim().length > MAX_GYM_NAME_LENGTH) {
      setErrorMsg(`Gym name cannot exceed ${MAX_GYM_NAME_LENGTH} characters.`);
      return;
    }
    const nextLocs = locations.map(l => l.id === id ? { ...l, name: editName.trim() } : l);
    setLocations(nextLocs);
    setEditingId(null);
    handleSave(nextLocs, activeLocationId);
  };

  const saveNew = () => {
    if (!newName.trim()) {
      setErrorMsg("Gym name cannot be empty.");
      return;
    }
    if (newName.trim().length > MAX_GYM_NAME_LENGTH) {
      setErrorMsg(`Gym name cannot exceed ${MAX_GYM_NAME_LENGTH} characters.`);
      return;
    }
    if (locations.length >= 3) {
      setErrorMsg("Maximum 3 gym profiles allowed.");
      return;
    }
    const newLoc = { id: uid(), name: newName.trim() };
    const nextLocs = [...locations, newLoc];
    setLocations(nextLocs);
    setActiveLocationId(newLoc.id);
    setIsAdding(false);
    setNewName("");
    handleSave(nextLocs, newLoc.id);
  };

  const deleteLoc = (id) => {
    if (locations.length <= 1) {
      setErrorMsg("You must have at least one gym profile.");
      return;
    }
    const nextLocs = locations.filter(l => l.id !== id);
    const nextActive = activeLocationId === id ? nextLocs[0].id : activeLocationId;
    setLocations(nextLocs);
    setActiveLocationId(nextActive);
    handleSave(nextLocs, nextActive);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.8)' }}>
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }} 
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ background: '#1c1c1e', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 24px 48px 24px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Gym Profiles</h2>
          <button onClick={onClose} style={{ background: '#2a2a2e', border: 'none', width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {locations.map(loc => {
            const isActive = loc.id === activeLocationId;
            return (
              <div 
                key={loc.id} 
                style={{ background: isActive ? 'rgba(0, 122, 255, 0.1)' : '#121212', border: isActive ? '1px solid var(--primary)' : '1px solid #2a2a2e', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                {editingId === loc.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <input 
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(loc.id)}
                          style={{ 
                            width: '100%', 
                            background: '#000', 
                            border: (editName.trim().length > MAX_GYM_NAME_LENGTH || !editName.trim()) ? '1px solid #D94A4A' : '1px solid var(--primary)', 
                            color: editName.trim().length > MAX_GYM_NAME_LENGTH ? '#D94A4A' : '#fff', 
                            padding: '8px 12px', 
                            borderRadius: 8, 
                            fontSize: 15, 
                            outline: 'none', 
                            fontFamily: '"Inter", sans-serif' 
                          }}
                        />
                        {(editName.trim().length > MAX_GYM_NAME_LENGTH || !editName.trim()) && (
                          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#D94A4A', fontWeight: 900, fontSize: 14 }}>!</span>
                        )}
                      </div>
                      <button 
                        onClick={() => saveEdit(loc.id)} 
                        disabled={editName.trim().length > MAX_GYM_NAME_LENGTH || !editName.trim()}
                        style={{ 
                          background: (editName.trim().length > MAX_GYM_NAME_LENGTH || !editName.trim()) ? '#333' : 'var(--primary)', 
                          border: 'none', 
                          color: '#fff', 
                          padding: 8, 
                          borderRadius: 8, 
                          cursor: (editName.trim().length > MAX_GYM_NAME_LENGTH || !editName.trim()) ? 'not-allowed' : 'pointer' 
                        }}
                      >
                        <Check size={18} />
                      </button>
                    </div>
                    {(editName.trim().length > MAX_GYM_NAME_LENGTH || !editName.trim()) && (
                      <div style={{ color: '#D94A4A', fontSize: 11, fontWeight: 700 }}>
                        {!editName.trim() ? "! Gym name cannot be empty." : `! Cannot exceed ${MAX_GYM_NAME_LENGTH} chars (${editName.trim().length}/${MAX_GYM_NAME_LENGTH}).`}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: 'pointer' }} onClick={() => handleSelect(loc.id)}>
                      <div style={{ width: 20, height: 20, borderRadius: 10, border: isActive ? '6px solid var(--primary)' : '2px solid #333', background: 'transparent', transition: 'all 0.2s' }} />
                      <span style={{ fontSize: 16, fontWeight: 700, color: isActive ? '#fff' : '#e2e2e2' }}>{loc.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => startEdit(loc)} style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 4 }}><Edit2 size={16} /></button>
                      {locations.length > 1 && (
                        <button onClick={() => deleteLoc(loc.id)} style={{ background: 'transparent', border: 'none', color: '#FF3B30', cursor: 'pointer', padding: 4 }}><Trash2 size={16} /></button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {isAdding ? (
          <div style={{ background: '#121212', border: (newName.trim().length > MAX_GYM_NAME_LENGTH || !newName.trim()) && newName ? '1px solid #D94A4A' : '1px solid var(--primary)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  autoFocus
                  placeholder="e.g. Home Gym"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveNew()}
                  style={{ 
                    width: '100%', 
                    background: '#000', 
                    border: (newName.trim().length > MAX_GYM_NAME_LENGTH) ? '1px solid #D94A4A' : 'none', 
                    color: newName.trim().length > MAX_GYM_NAME_LENGTH ? '#D94A4A' : '#fff', 
                    padding: '8px 12px', 
                    borderRadius: 8, 
                    fontSize: 15, 
                    outline: 'none', 
                    fontFamily: '"Inter", sans-serif' 
                  }}
                />
                {(newName.trim().length > MAX_GYM_NAME_LENGTH || (!newName.trim() && newName.length > 0)) && (
                  <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#D94A4A', fontWeight: 900, fontSize: 14 }}>!</span>
                )}
              </div>
              <button 
                onClick={saveNew} 
                disabled={!newName.trim() || newName.trim().length > MAX_GYM_NAME_LENGTH}
                style={{ 
                  background: (!newName.trim() || newName.trim().length > MAX_GYM_NAME_LENGTH) ? '#333' : 'var(--primary)', 
                  border: 'none', 
                  color: '#fff', 
                  padding: 8, 
                  borderRadius: 8, 
                  cursor: (!newName.trim() || newName.trim().length > MAX_GYM_NAME_LENGTH) ? 'not-allowed' : 'pointer' 
                }}
              >
                <Check size={18} />
              </button>
              <button onClick={() => { setIsAdding(false); setNewName(""); }} style={{ background: '#2a2a2e', border: 'none', color: '#8b90a0', padding: 8, borderRadius: 8, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {newName && (newName.trim().length > MAX_GYM_NAME_LENGTH || !newName.trim()) && (
              <div style={{ color: '#D94A4A', fontSize: 11, fontWeight: 700 }}>
                {!newName.trim() ? "! Gym name cannot be empty." : `! Cannot exceed ${MAX_GYM_NAME_LENGTH} chars (${newName.trim().length}/${MAX_GYM_NAME_LENGTH}).`}
              </div>
            )}
          </div>
        ) : (
          locations.length < 3 && (
            <button onClick={() => setIsAdding(true)} style={{ width: '100%', background: 'rgba(0, 122, 255, 0.1)', border: '1px dashed var(--primary)', color: 'var(--primary)', padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Plus size={18} /> Add Gym Profile
            </button>
          )
        )}
      </motion.div>
      <ErrorModal
        isOpen={!!errorMsg}
        onClose={() => setErrorMsg(null)}
        message={errorMsg}
        title="Gym Profiles"
      />
    </div>
  );
}
