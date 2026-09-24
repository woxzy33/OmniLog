import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TooltipContext = createContext();

export function useTooltip() {
  return useContext(TooltipContext);
}

export function TooltipProvider({ children }) {
  const [tooltip, setTooltip] = useState(null); // { id, title, content, onDismiss }
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('omnilog-tooltips')) || JSON.parse(localStorage.getItem('ironlog-tooltips')) || {};
    } catch {
      return {};
    }
  });

  const showTooltip = (id, title, content) => {
    if (dismissed[id]) return;
    setTooltip({ id, title, content });
  };

  const dismiss = () => {
    if (tooltip) {
      const next = { ...dismissed, [tooltip.id]: true };
      setDismissed(next);
      localStorage.setItem('omnilog-tooltips', JSON.stringify(next));
      setTooltip(null);
    }
  };

  return (
    <TooltipContext.Provider value={{ showTooltip }}>
      {children}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 90,
              left: 16,
              right: 16,
              background: '#0A0A0A',
              border: '1.5px solid var(--primary)',
              borderRadius: 16,
              padding: 16,
              zIndex: 9999,
              boxShadow: '0 12px 32px rgba(232, 98, 44, 0.2)'
            }}
          >
            <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: 8, fontSize: 15 }}>{tooltip.title}</div>
            <div style={{ color: '#e2e2e2', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
              {tooltip.content}
            </div>
            <button 
              onClick={dismiss}
              style={{
                width: '100%', padding: 12, background: 'var(--primary)', color: '#fff', 
                border: 'none', borderRadius: 10, fontWeight: 700
              }}
            >
              Got it
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipContext.Provider>
  );
}
