import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../styles';
import { X } from './Icons';

export function ConfirmCancelModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            style={{ background: '#121212', padding: 24, borderRadius: 16, width: '85%', maxWidth: 350, border: '1px solid #D94A4A' }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: '#D94A4A', marginBottom: 12 }}>Cancel Workout?</div>
            <div style={{ fontSize: 14, color: '#e2e2e2', lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to cancel this workout? All progress will be lost.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="bigCta" style={{ flex: 1, background: '#333535', color: '#e2e2e2'  }} onClick={onClose}>Back</button>
              <button className="bigCta" style={{ flex: 1, background: '#D94A4A', color: '#fff'  }} onClick={onConfirm}>Discard</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function IncompleteSetsWarning({ isOpen, onClose, onProceed, incompleteExerciseNames }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            style={{ background: '#121212', padding: 24, borderRadius: 16, width: '85%', maxWidth: 350, border: '1px solid #E8C12C' }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: '#E8C12C', marginBottom: 12 }}>Incomplete Sets</div>
            <div style={{ fontSize: 14, color: '#e2e2e2', lineHeight: 1.5, marginBottom: 12 }}>
              You have uncompleted sets in the following exercises:
            </div>
            <ul style={{ color: '#8b90a0', fontSize: 13, marginBottom: 24, paddingLeft: 20 }}>
              {incompleteExerciseNames.map((name, i) => <li key={i} style={{ marginBottom: 4 }}>{name}</li>)}
            </ul>
            <div style={{ fontSize: 13, color: '#8b90a0', marginBottom: 24 }}>
              Unchecked sets will not be saved. Finish anyway?
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="bigCta" style={{ flex: 1, background: '#333535', color: '#e2e2e2'  }} onClick={onClose}>Resume</button>
              <button className="bigCta" style={{ flex: 1, background: '#E8C12C', color: '#121212'  }} onClick={onProceed}>Finish</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            style={{ background: '#121212', padding: 24, borderRadius: 16, width: '85%', maxWidth: 350, border: '1px solid #D94A4A' }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: '#D94A4A', marginBottom: 12 }}>Remove item?</div>
            <div style={{ fontSize: 14, color: '#e2e2e2', lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to remove <strong style={{ color: '#fff' }}>{itemName}</strong>?
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="bigCta" style={{ flex: 1, background: '#333535', color: '#e2e2e2'  }} onClick={onClose}>Cancel</button>
              <button className="bigCta" style={{ flex: 1, background: '#D94A4A', color: '#fff'  }} onClick={onConfirm}>Remove</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ErrorModal({ isOpen, onClose, message, title = "Validation Error" }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            style={{ background: '#121212', padding: 24, borderRadius: 16, width: '85%', maxWidth: 350, border: '1px solid #D94A4A' }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: '#D94A4A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#D94A4A', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>!</span>
              {title}
            </div>
            <div style={{ fontSize: 14, color: '#e2e2e2', lineHeight: 1.5, marginBottom: 24 }}>
              {message}
            </div>
            <div style={{ display: 'flex' }}>
              <button className="bigCta" style={{ flex: 1, background: '#333535', color: '#e2e2e2', border: 'none', padding: 16, borderRadius: 12, fontWeight: 700, cursor: 'pointer' }} onClick={onClose}>Understood</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  isDestructive = false 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            style={{ background: '#121212', padding: 24, borderRadius: 20, width: '85%', maxWidth: 360, border: isDestructive ? '1px solid #D94A4A' : '1px solid #28282c', boxShadow: '0 12px 48px rgba(0,0,0,0.6)' }}
          >
            <div style={{ fontSize: 19, fontWeight: 800, color: isDestructive ? '#D94A4A' : '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              {isDestructive && (
                <span style={{ background: '#D94A4A', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>!</span>
              )}
              {title}
            </div>
            <div style={{ fontSize: 14, color: '#a0a5b5', lineHeight: 1.5, marginBottom: 24 }}>
              {message}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                style={{ flex: 1, background: '#222328', color: '#e2e2e2', border: '1px solid #2c2c30', padding: 14, borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer' }} 
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button 
                style={{ 
                  flex: 1, 
                  background: isDestructive ? '#D94A4A' : 'var(--primary)', 
                  color: isDestructive ? '#fff' : '#000', 
                  border: 'none', 
                  padding: 14, 
                  borderRadius: 14, 
                  fontWeight: 800, 
                  fontSize: 15, 
                  cursor: 'pointer', 
                  boxShadow: isDestructive ? '0 4px 12px rgba(217, 74, 74, 0.3)' : '0 4px 12px rgba(0, 122, 255, 0.3)' 
                }} 
                onClick={() => { onConfirm(); onClose(); }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
