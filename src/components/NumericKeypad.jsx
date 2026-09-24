import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from './Icons';
import { styles } from '../styles';
import useSound from 'use-sound';

export const KeypadContext = createContext(null);

export function useKeypad() {
  return useContext(KeypadContext);
}

export function KeypadProvider({ children }) {
  const [keypadConfig, setKeypadConfig] = useState(null);
  // config: { value, title, onChange, onNext, onClose, type (weight/reps) }
  
  const [playClick] = useSound('/pop.mp3', { volume: 0.1 });

  const close = () => {
    if (keypadConfig?.onClose) keypadConfig.onClose();
    setKeypadConfig(null);
  };

  const handleKeyPress = (key) => {
    playClick();
    if (!keypadConfig) return;
    
    let current = keypadConfig.value || "";
    let nextValue = current;

    const incVal = keypadConfig.type === 'reps' ? 1 : keypadConfig.type === 'rpe' ? 0.5 : 2.5;

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
      // not essential for most gym apps, skip or implement later
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

  const incVal = keypadConfig?.type === 'reps' ? 1 : keypadConfig?.type === 'rpe' ? 0.5 : 2.5;

  return (
    <KeypadContext.Provider value={{ openKeypad: setKeypadConfig, closeKeypad: close, isOpen: !!keypadConfig }}>
      {children}
      <AnimatePresence>
        {keypadConfig && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, 
              background: '#151617', borderTopLeftRadius: 16, borderTopRightRadius: 16,
              zIndex: 9999, paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-light)', padding: '12px 20px', color: '#000', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{keypadConfig.title || "Enter Value"}</span>
              <button onClick={close} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(4, 46px)', gap: 8 }}>
              {/* Row 1 */}
              <KeyButton onClick={() => handleKeyPress('+inc')}>+{incVal}</KeyButton>
              <KeyButton onClick={() => handleKeyPress('1')}>1</KeyButton>
              <KeyButton onClick={() => handleKeyPress('2')}>2</KeyButton>
              <KeyButton onClick={() => handleKeyPress('3')}>3</KeyButton>
              <KeyButton onClick={() => handleKeyPress('next')} style={{ gridRow: 'span 2', background: 'var(--primary-light)', color: '#000', fontWeight: 800 }}>NEXT</KeyButton>
              
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
              <KeyButton onClick={() => handleKeyPress('hide')}><ChevronDown size={24} /></KeyButton>
              
              {/* Row 4 */}
              <KeyButton onClick={() => handleKeyPress('.')}><span style={{fontSize: 22}}>.</span></KeyButton>
              <KeyButton onClick={() => handleKeyPress('0')}>0</KeyButton>
              <KeyButton onClick={() => handleKeyPress('backspace')}><X size={20} /></KeyButton>
              <KeyButton onClick={() => handleKeyPress('hide')} style={{ background: '#333535' }}><Check size={20} /></KeyButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </KeypadContext.Provider>
  );
}

function KeyButton({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#242526', color: '#fff', border: 'none', borderRadius: 8,
        fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', ...style
      }}
    >
      {children}
    </button>
  );
}
