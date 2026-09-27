import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check, Delete } from './Icons';
import useSound from 'use-sound';
import InfoTipModal from './InfoTipModal';
import { RPE_OPTIONS } from './RpePickerModal';

export const KeypadContext = createContext(null);

export function useKeypad() {
  return useContext(KeypadContext);
}

const wholeRpeNumbers = [
  { val: "6", label: "6", color: "#00A3FF", bg: "rgba(0, 163, 255, 0.14)", border: "rgba(0, 163, 255, 0.4)", rir: "4+ RIR" },
  { val: "7", label: "7", color: "#30D158", bg: "rgba(48, 209, 88, 0.14)", border: "rgba(48, 209, 88, 0.4)", rir: "3 RIR" },
  { val: "8", label: "8", color: "#FFB800", bg: "rgba(255, 184, 0, 0.14)", border: "rgba(255, 184, 0, 0.4)", rir: "2 RIR" },
  { val: "9", label: "9", color: "#FF6B00", bg: "rgba(255, 107, 0, 0.14)", border: "rgba(255, 107, 0, 0.4)", rir: "1 RIR" },
  { val: "10", label: "10", color: "#FF2D55", bg: "rgba(255, 45, 85, 0.16)", border: "rgba(255, 45, 85, 0.5)", rir: "MAX / 0" }
];

const halfRpeNumbers = [
  { val: "6.5", label: "6.5", color: "#00C6FF", bg: "rgba(0, 198, 255, 0.1)", border: "rgba(0, 198, 255, 0.25)" },
  { val: "7.5", label: "7.5", color: "#78D13F", bg: "rgba(120, 209, 63, 0.1)", border: "rgba(120, 209, 63, 0.25)" },
  { val: "8.5", label: "8.5", color: "#FFA700", bg: "rgba(255, 167, 0, 0.1)", border: "rgba(255, 167, 0, 0.25)" },
  { val: "9.5", label: "9.5", color: "#FF5A26", bg: "rgba(255, 90, 38, 0.1)", border: "rgba(255, 90, 38, 0.25)" }
];

export function KeypadProvider({ children }) {
  const [keypadConfig, setKeypadConfig] = useState(null);
  // config: { value, title, onChange, onNext, onClose, type (weight/reps/rpe), exerciseName, setNumber }
  const [showTip, setShowTip] = useState(false);
  const keypadRef = useRef(null);

  const [playClick] = useSound('/pop.mp3', { volume: 0.1 });

  const close = () => {
    if (keypadConfig?.onClose) keypadConfig.onClose();
    setKeypadConfig(null);
  };

  // Click outside to dismiss the keypad
  useEffect(() => {
    if (!keypadConfig) return;

    const handlePointerDownOutside = (e) => {
      // If tapped inside keypad, do nothing
      if (keypadRef.current && keypadRef.current.contains(e.target)) {
        return;
      }

      // If user tapped on another set input, let that input switch the keypad without closing
      if (e.target && e.target.closest && (e.target.closest('.setInput') || e.target.closest('.keypadTrigger'))) {
        return;
      }

      // If clicked inside a dialog or modal (e.g. InfoTipModal), do not close
      if (e.target && e.target.closest && (e.target.closest('[role="dialog"]') || e.target.closest('.infoModal') || e.target.closest('button[title*="What is RPE"]'))) {
        return;
      }

      close();
    };

    const timer = setTimeout(() => {
      window.addEventListener('pointerdown', handlePointerDownOutside);
    }, 60);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handlePointerDownOutside);
    };
  }, [keypadConfig]);

  const handleKeyPress = (key) => {
    playClick();
    if (!keypadConfig) return;
    
    let current = keypadConfig.value || "";
    let nextValue = current;

    const incVal = keypadConfig.type === 'reps' ? 1 : 2.5;

    if (key === 'backspace') {
      nextValue = current.slice(0, -1);
    } else if (key === '+inc') {
      const num = parseFloat(current) || 0;
      nextValue = String(num + incVal);
    } else if (key === '-inc') {
      const num = parseFloat(current) || 0;
      nextValue = String(Math.max(0, num - incVal));
    } else if (key === '.') {
      if (!current.includes('.')) nextValue = current === "" ? '0.' : current + '.';
    } else if (key === '+/-') {
      // reserved for future
    } else if (key === 'next' || key === 'hide') {
      let finalVal = current;
      const num = parseFloat(current);
      if (!isNaN(num)) {
        if (keypadConfig.type === 'reps') {
          finalVal = String(Math.round(num * 2) / 2);
        } else if (keypadConfig.type === 'weight') {
          finalVal = String(Math.round(num * 1000) / 1000);
        }
      }
      if (keypadConfig.onChange) keypadConfig.onChange(finalVal);
      if (key === 'next' && keypadConfig.onNext) keypadConfig.onNext();
      if (key === 'hide') close();
      return;
    } else {
      if (current === "0" && key !== '.') nextValue = key;
      else nextValue = current + key;
    }

    if (keypadConfig.onChange) {
      keypadConfig.onChange(nextValue);
    }
    setKeypadConfig({ ...keypadConfig, value: nextValue });
  };

  const handleRpeSelect = (val) => {
    playClick();
    if (keypadConfig?.onChange) {
      keypadConfig.onChange(val);
    }
    if (val === "") {
      close();
    } else if (keypadConfig?.onNext) {
      keypadConfig.onNext();
    } else {
      close();
    }
  };

  const isRpe = keypadConfig?.type === 'rpe';
  const incVal = keypadConfig?.type === 'reps' ? 1 : 2.5;

  return (
    <KeypadContext.Provider value={{ openKeypad: setKeypadConfig, closeKeypad: close, isOpen: !!keypadConfig }}>
      {children}
      <AnimatePresence>
        {keypadConfig && (
          <motion.div
            ref={keypadRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, 
              background: '#151617', borderTopLeftRadius: 18, borderTopRightRadius: 18,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.7)',
              zIndex: 9999,
              paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
              maxWidth: 500, margin: '0 auto',
              width: '100%',
              touchAction: 'manipulation'
            }}
          >
            {/* KEYPAD HEADER */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: isRpe ? '#1c1c1f' : 'var(--primary-light)',
              padding: '12px 18px',
              color: isRpe ? '#fff' : '#000',
              borderTopLeftRadius: 18, borderTopRightRadius: 18,
              borderBottom: isRpe ? '1px solid rgba(255,255,255,0.08)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>
                  {keypadConfig.title || (isRpe ? "Rate of Perceived Exertion" : "Enter Value")}
                </span>
                {isRpe && (
                  <button
                    type="button"
                    onClick={() => setShowTip(true)}
                    style={{
                      background: 'rgba(0, 122, 255, 0.2)',
                      border: '1px solid rgba(0, 122, 255, 0.4)',
                      color: '#007AFF',
                      borderRadius: '50%',
                      width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 900,
                      cursor: 'pointer', padding: 0
                    }}
                    title="What is RPE? (Help & Guide)"
                    aria-label="What is RPE?"
                  >
                    ?
                  </button>
                )}
              </div>

              <button 
                onClick={close} 
                style={{
                  background: 'none', border: 'none',
                  color: isRpe ? '#8b90a0' : '#000',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 4
                }}
                aria-label="Close Keypad"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* KEYPAD CONTENT */}
            {isRpe ? (
              /* HORIZONTAL NUMPAD FOR RPE (Docks at bottom) */
              <div style={{ padding: '12px 14px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Row 1: 6 -> 10 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {wholeRpeNumbers.map(item => {
                    const isSelected = String(keypadConfig.value) === item.val;
                    return (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => handleRpeSelect(item.val)}
                        style={{
                          background: isSelected ? item.color : item.bg,
                          border: isSelected ? '2px solid #fff' : `1px solid ${item.border}`,
                          borderRadius: 12,
                          padding: '10px 2px',
                          minHeight: 52,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2,
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 0 16px ${item.color}88` : 'none',
                          transition: 'all 0.15s ease',
                          touchAction: 'manipulation'
                        }}
                      >
                        <span style={{ fontSize: 19, fontWeight: 900, color: isSelected ? '#121214' : item.color, lineHeight: 1 }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: 8, fontWeight: 800, color: isSelected ? 'rgba(0,0,0,0.85)' : item.color, opacity: 0.9 }}>
                          {item.rir}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Row 2: Half steps & Clear */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {halfRpeNumbers.map(item => {
                    const isSelected = String(keypadConfig.value) === item.val;
                    return (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => handleRpeSelect(item.val)}
                        style={{
                          background: isSelected ? item.color : item.bg,
                          border: isSelected ? '2px solid #fff' : `1px solid ${item.border}`,
                          borderRadius: 10,
                          padding: '8px 2px',
                          minHeight: 38,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 0 12px ${item.color}88` : 'none',
                          transition: 'all 0.15s ease',
                          touchAction: 'manipulation'
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#121214' : item.color }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}

                  {/* Clear button */}
                  <button
                    type="button"
                    onClick={() => handleRpeSelect("")}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed rgba(255, 255, 255, 0.15)',
                      borderRadius: 10,
                      padding: '8px 2px',
                      minHeight: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      cursor: 'pointer',
                      color: '#8b90a0',
                      touchAction: 'manipulation'
                    }}
                    title="Clear RPE"
                  >
                    <X size={12} strokeWidth={2.5} />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Clear</span>
                  </button>
                </div>

                {/* Hardness Spectrum Indicator */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 4px', fontSize: 10, fontWeight: 700 }}>
                  <span style={{ color: '#00A3FF' }}>← Moderate</span>
                  <span style={{ color: '#FFB800' }}>Challenging</span>
                  <span style={{ color: '#FF2D55' }}>Exhaustion →</span>
                </div>
              </div>
            ) : (
              /* STANDARD WEIGHT & REPS NUMPAD */
              <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(4, 46px)', gap: 8 }}>
                {/* Row 1 */}
                <KeyButton onClick={() => handleKeyPress('+inc')}>+{incVal}</KeyButton>
                <KeyButton onClick={() => handleKeyPress('1')}>1</KeyButton>
                <KeyButton onClick={() => handleKeyPress('2')}>2</KeyButton>
                <KeyButton onClick={() => handleKeyPress('3')}>3</KeyButton>
                <KeyButton onClick={() => handleKeyPress('next')} style={{ gridRow: 'span 2', background: 'var(--primary)', color: '#fff', fontWeight: 800 }}>NEXT</KeyButton>
                
                {/* Row 2 */}
                <KeyButton onClick={() => handleKeyPress('-inc')}>-{incVal}</KeyButton>
                <KeyButton onClick={() => handleKeyPress('4')}>4</KeyButton>
                <KeyButton onClick={() => handleKeyPress('5')}>5</KeyButton>
                <KeyButton onClick={() => handleKeyPress('6')}>6</KeyButton>
                
                {/* Row 3 */}
                <KeyButton style={{ gridRow: 'span 2' }}>+/-</KeyButton>
                <KeyButton onClick={() => handleKeyPress('7')}>7</KeyButton>
                <KeyButton onClick={() => handleKeyPress('8')}>8</KeyButton>
                <KeyButton onClick={() => handleKeyPress('9')}>9</KeyButton>
                <KeyButton onClick={() => handleKeyPress('hide')} style={{ color: '#8b90a0' }} title="Hide Keypad">
                  <ChevronDown size={24} />
                </KeyButton>
                
                {/* Row 4 */}
                <KeyButton onClick={() => handleKeyPress('.')}>
                  <span style={{ fontSize: 24, fontWeight: 900 }}>.</span>
                </KeyButton>
                <KeyButton onClick={() => handleKeyPress('0')}>0</KeyButton>
                {/* CLASSIC DELETE BUTTON WITH VIBRANT RED COLOR */}
                <KeyButton 
                  onClick={() => handleKeyPress('backspace')}
                  style={{
                    background: 'rgba(232, 17, 35, 0.16)',
                    border: '1px solid rgba(232, 17, 35, 0.35)',
                    color: '#FF453A'
                  }}
                  title="Delete"
                  aria-label="Delete"
                >
                  <Delete size={22} color="#FF453A" strokeWidth={2.2} />
                </KeyButton>
                {/* CHECK BUTTON WITH VIBRANT SUCCESS GREEN COLOR */}
                <KeyButton 
                  onClick={() => handleKeyPress('hide')} 
                  style={{ 
                    background: '#30D158',
                    border: '1px solid rgba(48, 209, 88, 0.5)',
                    color: '#121214',
                    boxShadow: '0 2px 10px rgba(48, 209, 88, 0.3)'
                  }}
                  title="Confirm"
                  aria-label="Confirm"
                >
                  <Check size={22} color="#121214" strokeWidth={3} />
                </KeyButton>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RPE EDUCATIONAL PROPER POP-UP */}
      <InfoTipModal
        isOpen={showTip}
        onClose={() => setShowTip(false)}
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
    </KeypadContext.Provider>
  );
}

function KeyButton({ children, onClick, style, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: '#242526', color: '#fff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
        fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', touchAction: 'manipulation',
        userSelect: 'none', WebkitUserSelect: 'none',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}
