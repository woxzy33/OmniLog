import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Flame, Activity } from './Icons';
import { CARDIO_CATEGORIES, DEFAULT_CARDIO_ACTIVITIES } from '../data/cardioDb';

export default function CardioSelectorModal({ isOpen, onClose, onSelectActivity, customActivities = [], onAddCustomActivity }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Running');
  const [customHasDistance, setCustomHasDistance] = useState(true);

  const allActivities = useMemo(() => {
    return [...DEFAULT_CARDIO_ACTIVITIES, ...customActivities];
  }, [customActivities]);

  const categoryGroups = useMemo(() => {
    const groups = [];
    const validCats = CARDIO_CATEGORIES.filter(c => c !== 'All');
    validCats.forEach(cat => {
      const acts = allActivities.filter(a => a.category === cat);
      if (acts.length > 0) {
        groups.push({ category: cat, activities: acts });
      }
    });
    const customActs = allActivities.filter(a => a.isCustom || !validCats.includes(a.category));
    if (customActs.length > 0 && !groups.some(g => g.category.toLowerCase().includes('custom'))) {
      groups.push({ category: 'Custom Activities', activities: customActs });
    }
    return groups;
  }, [allActivities]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allActivities.filter(act => {
      const matchCat = selectedCategory === 'All' || act.category === selectedCategory;
      const matchQuery = !q || act.name.toLowerCase().includes(q) || act.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [allActivities, search, selectedCategory]);

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newAct = {
      id: `custom_cardio_${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      met: 8.0,
      hasDistance: customHasDistance,
      hasIncline: false,
      hasResistance: false,
      icon: "🔥",
      accentColor: "#FF6B00",
      isCustom: true
    };
    if (onAddCustomActivity) onAddCustomActivity(newAct);
    onSelectActivity(newAct);
    setCustomName('');
    setShowCustomForm(false);
    onClose();
  };

  const renderActivityCard = (act) => (
    <motion.button
      key={act.id}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        onSelectActivity(act);
        onClose();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderRadius: 16,
        background: '#18181c',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1, marginRight: 8 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(255, 107, 0, 0.12)',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0
        }}>
          {act.icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {act.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: act.accentColor || '#FF6B00',
              background: 'rgba(255, 107, 0, 0.12)',
              padding: '2px 7px',
              borderRadius: 6
            }}>
              {act.category}
            </span>
            <span style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600 }}>
              {act.hasDistance ? '⏱ Time • 📍 Distance' : '⏱ Time'}
              {act.hasIncline ? ' • 🏔 Incline' : ''}
              {act.hasResistance ? ' • ⚡ Resistance' : ''}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        background: 'rgba(255, 107, 0, 0.14)',
        border: '1px solid rgba(255, 107, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FF8533',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(255, 107, 0, 0.2)'
      }}>
        <Plus size={16} strokeWidth={2.5} />
      </div>
    </motion.button>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="cardioModalOverlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="cardioModalContainer"
        >
          {/* Subtle Pull Indicator */}
          <div className="cardioPullIndicator">
            <div style={{ width: 44, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
          </div>

          {/* Header */}
          <div style={{ padding: '16px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF2D55 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(255, 107, 0, 0.4)'
                }}>
                  <Flame size={22} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                    Cardio Activities
                  </div>
                  <div style={{ fontSize: 13, color: '#8b90a0', fontWeight: 600, marginTop: 2 }}>
                    Select an activity to integrate into your workout
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cardio selector"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: '#19191d',
              borderRadius: 14,
              padding: '0 16px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)'
            }}>
              <Search size={18} color="#8b90a0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search running, swimming, cycling, rower..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  padding: '14px 12px',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ background: 'transparent', border: 'none', color: '#8b90a0', cursor: 'pointer', padding: 6 }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category horizontal scroll */}
            <div style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              marginTop: 16,
              paddingBottom: 4,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {CARDIO_CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 12,
                      border: isActive ? '1px solid #FF6B00' : '1px solid rgba(255,255,255,0.08)',
                      background: isActive ? 'rgba(255, 107, 0, 0.18)' : 'rgba(255,255,255,0.04)',
                      color: isActive ? '#FF8533' : '#8b90a0',
                      fontSize: 13,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 2px 10px rgba(255, 107, 0, 0.25)' : 'none'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            maxHeight: '62vh'
          }}>
            {selectedCategory === 'All' && !search ? (
              categoryGroups.map(group => (
                <div key={group.category} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 2px 8px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FF8533' }}>
                        {group.category}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#8b90a0', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 8 }}>
                        {group.activities.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(group.category)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#FF9E40',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '2px 4px'
                      }}
                    >
                      Filter category
                    </button>
                  </div>

                  <div className="cardioActivitiesGrid">
                    {group.activities.map(act => renderActivityCard(act))}
                  </div>
                </div>
              ))
            ) : (
              <div className="cardioActivitiesGrid">
                {filtered.map(act => renderActivityCard(act))}
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#6b7080', fontSize: 14 }}>
                No cardio activities found for "{search}".
              </div>
            )}
          </div>

          {/* Bottom Action: Custom Activity Toggle */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  background: 'rgba(255, 107, 0, 0.12)',
                  border: '1.5px dashed rgba(255, 107, 0, 0.45)',
                  color: '#FF8533',
                  fontSize: 14,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Plus size={18} strokeWidth={2.5} /> Create Custom Cardio Activity
              </button>
            ) : (
              <form onSubmit={handleCreateCustom} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Custom Activity Name (e.g. Sled Push, Rollerblading)"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: '#1a1a1e',
                    border: '1.5px solid rgba(255, 107, 0, 0.4)',
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: '#1a1a1e',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#e2e2e2',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  >
                    {CARDIO_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8b90a0', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={customHasDistance}
                      onChange={(e) => setCustomHasDistance(e.target.checked)}
                      style={{ accentColor: '#FF6B00', width: 16, height: 16 }}
                    />
                    Tracks Distance
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#8b90a0',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!customName.trim()}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: 12,
                      background: customName.trim() ? 'linear-gradient(135deg, #FF6B00 0%, #FF2D55 100%)' : '#27272a',
                      border: 'none',
                      color: customName.trim() ? '#fff' : '#71717a',
                      fontWeight: 800,
                      cursor: customName.trim() ? 'pointer' : 'not-allowed',
                      boxShadow: customName.trim() ? '0 4px 14px rgba(255, 107, 0, 0.35)' : 'none'
                    }}
                  >
                    Add & Select
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
