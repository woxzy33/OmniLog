import React from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { X, ChevronUp, ChevronDown, GripHorizontal, Check } from './Icons';

const ReorderListItem = ({ group, gIdx, isFirst, isLast, data, onMoveUp, onMoveDown }) => {
  const dragControls = useDragControls();
  const isSuperset = group.length > 1;

  return (
    <Reorder.Item
      value={group[0].id}
      dragListener={false}
      dragControls={dragControls}
      style={{
        background: '#1A1A1E',
        borderRadius: 16,
        padding: '12px 14px',
        border: isSuperset ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
      }}
    >
      {/* POSITION BADGE */}
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: isSuperset ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.06)',
        color: isSuperset ? 'var(--primary)' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 14, flexShrink: 0
      }}>
        {gIdx + 1}
      </div>

      {/* EXERCISE INFO */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {group.map((ex, internalIdx) => {
          const exObj = data?.exercises?.find(e => e.id === ex.exerciseId);
          const name = exObj?.name || "Exercise";
          const setsCount = (ex.sets || []).length;
          return (
            <div key={ex.id || internalIdx} style={{ marginTop: internalIdx > 0 ? 4 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isSuperset && (
                  <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--primary)' }}>
                    {String.fromCharCode(65 + internalIdx)}.
                  </span>
                )}
                <span style={{
                  fontSize: 14, fontWeight: 800, color: '#fff',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {name}
                </span>
                <span style={{ fontSize: 11, color: '#8b90a0', fontWeight: 600 }}>
                  ({setsCount} {setsCount === 1 ? 'set' : 'sets'})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* UP / DOWN QUICK ARROWS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={isFirst}
          style={{
            background: isFirst ? 'transparent' : 'rgba(255,255,255,0.08)',
            border: 'none', borderRadius: 8, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isFirst ? '#444' : '#fff',
            cursor: isFirst ? 'default' : 'pointer'
          }}
          title="Move up"
          aria-label="Move up"
        >
          <ChevronUp size={18} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={isLast}
          style={{
            background: isLast ? 'transparent' : 'rgba(255,255,255,0.08)',
            border: 'none', borderRadius: 8, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isLast ? '#444' : '#fff',
            cursor: isLast ? 'default' : 'pointer'
          }}
          title="Move down"
          aria-label="Move down"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* DRAG HANDLE */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        style={{
          cursor: 'grab', padding: '6px 4px',
          display: 'flex', alignItems: 'center', color: '#8b90a0',
          touchAction: 'none'
        }}
        title="Drag to reorder"
      >
        <GripHorizontal size={20} />
      </div>
    </Reorder.Item>
  );
};

export default function ReorderExercisesModal({ isOpen, onClose, groupedExercises, data, onMoveGroup, onReorderGroups }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.78)', backdropFilter: 'blur(10px)',
          zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 520, maxHeight: '85vh',
            background: '#141416', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
            paddingBottom: 'calc(20px + env(safe-area-inset-bottom))'
          }}
        >
          {/* HEADER */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />
            <div style={{ width: '100%', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                  Reorder Exercises
                </div>
                <div style={{ fontSize: 13, color: '#8b90a0', marginTop: 2 }}>
                  Use arrows or drag handles to reorder
                </div>
              </div>
              <button 
                onClick={onClose}
                style={{
                  background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 12, padding: '8px 16px', fontWeight: 800, fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Check size={16} strokeWidth={3} /> Done
              </button>
            </div>
          </div>

          {/* REORDERABLE LIST */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Reorder.Group 
              axis="y" 
              values={groupedExercises.map(g => g[0].id)} 
              onReorder={(newOrderIds) => {
                const newGroups = [];
                newOrderIds.forEach(id => {
                  const found = groupedExercises.find(g => g[0].id === id);
                  if (found) newGroups.push(found);
                });
                onReorderGroups(newGroups);
              }}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {groupedExercises.map((group, gIdx) => (
                <ReorderListItem
                  key={group[0].id}
                  group={group}
                  gIdx={gIdx}
                  isFirst={gIdx === 0}
                  isLast={gIdx === groupedExercises.length - 1}
                  data={data}
                  onMoveUp={() => onMoveGroup(gIdx, -1)}
                  onMoveDown={() => onMoveGroup(gIdx, 1)}
                />
              ))}
            </Reorder.Group>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
