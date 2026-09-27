import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from './Icons';
import InfoTipModal from './InfoTipModal';

export const RPE_OPTIONS = [
  {
    value: "10",
    title: "10 - Maximal Effort",
    rir: "0 RIR",
    desc: "Absolute exhaustion. Could not have done another repetition or added weight.",
    color: "#FF2D55",
    bg: "rgba(255, 45, 85, 0.16)",
    border: "rgba(255, 45, 85, 0.45)"
  },
  {
    value: "9.5",
    title: "9.5 - Near Limit",
    rir: "0-1 RIR",
    desc: "Could not add weight. Maybe 1 repetition remaining with extreme grind.",
    color: "#FF5A26",
    bg: "rgba(255, 90, 38, 0.16)",
    border: "rgba(255, 90, 38, 0.45)"
  },
  {
    value: "9",
    title: "9 - Extremely Hard",
    rir: "1 RIR",
    desc: "Heavy effort. Could do exactly 1 more rep with strenuous effort.",
    color: "#FF6B00",
    bg: "rgba(255, 107, 0, 0.16)",
    border: "rgba(255, 107, 0, 0.45)"
  },
  {
    value: "8.5",
    title: "8.5 - Solid Heavy",
    rir: "1-2 RIR",
    desc: "Tough work. Could definitely do 1, maybe 2 more reps.",
    color: "#FFA700",
    bg: "rgba(255, 167, 0, 0.16)",
    border: "rgba(255, 167, 0, 0.45)"
  },
  {
    value: "8",
    title: "8 - Challenging",
    rir: "2 RIR",
    desc: "Challenging effort. 2 reps left in reserve. Sweet spot for growth & strength.",
    color: "#FFB800",
    bg: "rgba(255, 184, 0, 0.16)",
    border: "rgba(255, 184, 0, 0.45)"
  },
  {
    value: "7.5",
    title: "7.5 - Solid Effort",
    rir: "2-3 RIR",
    desc: "Solid work. Definitely 2, maybe 3 more reps.",
    color: "#78D13F",
    bg: "rgba(120, 209, 63, 0.16)",
    border: "rgba(120, 209, 63, 0.45)"
  },
  {
    value: "7",
    title: "7 - Vigorous / Moderate",
    rir: "3 RIR",
    desc: "Vigorous work. 3 reps in reserve. Good speed and power.",
    color: "#30D158",
    bg: "rgba(48, 209, 88, 0.16)",
    border: "rgba(48, 209, 88, 0.45)"
  },
  {
    value: "6.5",
    title: "6.5 - Moderate Effort",
    rir: "3-4 RIR",
    desc: "Moderate work. 3 to 4 reps left in reserve.",
    color: "#00C6FF",
    bg: "rgba(0, 198, 255, 0.16)",
    border: "rgba(0, 198, 255, 0.45)"
  },
  {
    value: "6",
    title: "6 - Light / Warmup",
    rir: "4+ RIR",
    desc: "Moderate speed work. 4+ reps in reserve. Light effort.",
    color: "#00A3FF",
    bg: "rgba(0, 163, 255, 0.16)",
    border: "rgba(0, 163, 255, 0.45)"
  }
];

export default function RpePickerModal({ isOpen, onClose, currentValue, onSelect, exerciseName, setNumber }) {
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handlePick = (val) => {
    try {
      const audio = new Audio('/sounds/button_click.ogg');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}

    onSelect(val);
    onClose();
  };

  const wholeNumbers = [
    { val: "6", label: "6", color: "#00A3FF", bg: "rgba(0, 163, 255, 0.12)", border: "rgba(0, 163, 255, 0.35)", rir: "4+ RIR" },
    { val: "7", label: "7", color: "#30D158", bg: "rgba(48, 209, 88, 0.12)", border: "rgba(48, 209, 88, 0.35)", rir: "3 RIR" },
    { val: "8", label: "8", color: "#FFB800", bg: "rgba(255, 184, 0, 0.12)", border: "rgba(255, 184, 0, 0.35)", rir: "2 RIR" },
    { val: "9", label: "9", color: "#FF6B00", bg: "rgba(255, 107, 0, 0.12)", border: "rgba(255, 107, 0, 0.35)", rir: "1 RIR" },
    { val: "10", label: "10", color: "#FF2D55", bg: "rgba(255, 45, 85, 0.15)", border: "rgba(255, 45, 85, 0.45)", rir: "MAX / 0" }
  ];

  const halfNumbers = [
    { val: "6.5", label: "6.5", color: "#00C6FF", bg: "rgba(0, 198, 255, 0.08)", border: "rgba(0, 198, 255, 0.25)" },
    { val: "7.5", label: "7.5", color: "#78D13F", bg: "rgba(120, 209, 63, 0.08)", border: "rgba(120, 209, 63, 0.25)" },
    { val: "8.5", label: "8.5", color: "#FFA700", bg: "rgba(255, 167, 0, 0.08)", border: "rgba(255, 167, 0, 0.25)" },
    { val: "9.5", label: "9.5", color: "#FF5A26", bg: "rgba(255, 90, 38, 0.08)", border: "rgba(255, 90, 38, 0.25)" }
  ];

  return (
    <>
      <AnimatePresence>
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 360 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 520,
              background: '#121214', borderTopLeftRadius: 24, borderTopRightRadius: 24,
              border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.85)',
              paddingBottom: 'calc(14px + env(safe-area-inset-bottom))'
            }}
          >
            {/* DRAG HANDLE & TOP BAR */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, paddingBottom: 8 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', marginBottom: 8 }} />
              
              <div style={{ width: '100%', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>Rate of Perceived Exertion</span>
                    <button
                      type="button"
                      onClick={() => setShowHelp(true)}
                      style={{
                        background: 'rgba(0, 122, 255, 0.15)', border: '1px solid rgba(0, 122, 255, 0.3)',
                        color: 'var(--primary)', borderRadius: '50%', width: 22, height: 22,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 900, cursor: 'pointer', padding: 0
                      }}
                      title="What is RPE? (Help & Guide)"
                      aria-label="What is RPE?"
                    >
                      ?
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: '#8b90a0', marginTop: 2 }}>
                    {exerciseName ? `${exerciseName} • ` : ""}Set {setNumber || 1}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button 
                    onClick={onClose}
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 16,
                      width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#8b90a0', cursor: 'pointer'
                    }}
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* HORIZONTAL NUMPAD (5 Columns: 6 to 10) */}
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* PRIMARY WHOLE NUMBERS ROW (6 -> 10) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {wholeNumbers.map((item) => {
                  const isSelected = String(currentValue) === item.val;
                  return (
                    <motion.button
                      key={item.val}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handlePick(item.val)}
                      style={{
                        background: isSelected ? item.color : item.bg,
                        border: isSelected ? `2px solid #fff` : `1px solid ${item.border}`,
                        borderRadius: 14,
                        padding: '12px 2px',
                        minHeight: 56,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        boxShadow: isSelected ? `0 0 16px ${item.color}88` : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: isSelected ? '#121214' : item.color,
                        lineHeight: 1
                      }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontSize: 8,
                        fontWeight: 800,
                        color: isSelected ? 'rgba(0,0,0,0.85)' : item.color,
                        opacity: 0.9,
                        letterSpacing: '-0.2px'
                      }}>
                        {item.rir}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* SECONDARY ROW (Half steps: 6.5, 7.5, 8.5, 9.5 and Clear button) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {halfNumbers.map((item) => {
                  const isSelected = String(currentValue) === item.val;
                  return (
                    <motion.button
                      key={item.val}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handlePick(item.val)}
                      style={{
                        background: isSelected ? item.color : item.bg,
                        border: isSelected ? `2px solid #fff` : `1px solid ${item.border}`,
                        borderRadius: 12,
                        padding: '8px 2px',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: isSelected ? `0 0 12px ${item.color}88` : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: isSelected ? '#121214' : item.color
                      }}>
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}

                {/* CLEAR / NO RPE BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handlePick("")}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                    borderRadius: 12,
                    padding: '8px 2px',
                    minHeight: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    cursor: 'pointer',
                    color: '#8b90a0'
                  }}
                  title="Clear RPE rating"
                >
                  <X size={12} strokeWidth={2.5} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>Clear</span>
                </motion.button>
              </div>

              {/* HARDNESS SPECTRUM BAR */}
              <div style={{
                marginTop: 4,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '2px 4px',
                fontSize: 10,
                fontWeight: 700,
                color: '#6b7080'
              }}>
                <span style={{ color: '#00A3FF' }}>← Moderate</span>
                <span style={{ color: '#FFB800' }}>Challenging</span>
                <span style={{ color: '#FF2D55' }}>Exhaustion →</span>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* REUSABLE EDUCATIONAL TIP MODAL (OPENS ON ?) */}
      <InfoTipModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Rate of Perceived Exertion"
        subtitle="RPE & Reps In Reserve (RIR) Guide"
        description="RPE is a scale from 6 to 10 measuring how close you were to muscular failure during a set. It auto-regulates your training so you can adjust weights based on your daily energy and recovery."
        items={RPE_OPTIONS.map(opt => ({
          badge: opt.value,
          badgeColor: opt.color,
          badgeBg: opt.bg,
          rir: opt.rir,
          title: opt.title,
          desc: opt.desc
        }))}
        tip="Most strength and hypertrophy gains happen between RPE 7.5 and 9. Training to RPE 10 (absolute muscular failure) on every set can cause excessive central nervous system fatigue."
        actionText="Got it, back to workout"
      />
    </>
  );
}
