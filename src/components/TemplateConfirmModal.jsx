import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TemplateConfirmModal({ isOpen, templateName, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0.95 }} 
            animate={{ scale: 1 }} 
            exit={{ scale: 0.95 }}
            style={{ background: '#121212', padding: 24, borderRadius: 24, width: '90%', maxWidth: 400, border: '1px solid #2A2A2A', boxShadow: '0 12px 48px rgba(0,0,0,0.6)' }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e2e2', marginBottom: 12, letterSpacing: '-0.02em', fontFamily: '"Inter", sans-serif' }}>
              Start Session?
            </div>
            <div style={{ fontSize: 15, color: '#a0a5b5', marginBottom: 24, lineHeight: '1.5', fontFamily: '"Inter", sans-serif' }}>
              Are you sure you want to start a new workout using the <strong style={{ color: '#fff' }}>{templateName}</strong> template?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                onClick={onConfirm}
                style={{ width: '100%', background: 'var(--primary)', color: '#000', padding: 18, borderRadius: 16, fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer', fontFamily: '"Inter", sans-serif', boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.3)' }}
              >
                Yes, Start Workout
              </button>
              <button 
                onClick={onCancel}
                style={{ width: '100%', background: 'transparent', color: '#8b90a0', border: '1px solid #2A2A2A', padding: 18, borderRadius: 16, fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
