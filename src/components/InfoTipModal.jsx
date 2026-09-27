import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from './Icons';

/**
 * Reusable InfoTipModal
 * A proper, spacious centered pop-up modal used across the app whenever users
 * need contextual guidance, definitions, or educational tips.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - title: string
 * - subtitle: string (optional)
 * - icon: React node or icon (optional)
 * - description: string (optional)
 * - items: Array<{ badge?: string, badgeColor?: string, badgeBg?: string, title: string, desc: string, rir?: string }>
 * - tip: string (optional pro-tip callout)
 * - actionText: string (default "Got it")
 */
export default function InfoTipModal({
  isOpen,
  onClose,
  title = "Help & Guide",
  subtitle,
  icon,
  description,
  items = [],
  tip,
  actionText = "Got it"
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 11000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px 16px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 12 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 580, maxHeight: '86vh',
            background: '#161619', borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 64px rgba(0,0,0,0.92)',
            overflow: 'hidden'
          }}
        >
          {/* POP-UP HEADER */}
          <div style={{
            padding: '18px 22px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {icon ? (
                <div style={{
                  width: 42, height: 42, borderRadius: 14,
                  background: 'rgba(0, 122, 255, 0.15)', border: '1px solid rgba(0, 122, 255, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                }}>
                  {icon}
                </div>
              ) : (
                <div style={{
                  width: 42, height: 42, borderRadius: 14,
                  background: 'rgba(0, 122, 255, 0.15)', border: '1px solid rgba(0, 122, 255, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                  fontSize: 20, fontWeight: 900
                }}>
                  ?
                </div>
              )}
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                  {title}
                </div>
                {subtitle && (
                  <div style={{ fontSize: 13, color: '#8b90a0', fontWeight: 600, marginTop: 2 }}>
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 16,
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8b90a0', cursor: 'pointer', flexShrink: 0
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* POP-UP BODY (SCROLLABLE) */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '20px 22px',
            display: 'flex', flexDirection: 'column', gap: 16
          }}>
            {description && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                padding: '14px 16px',
                color: '#d0d4e0',
                fontSize: 14,
                lineHeight: 1.55
              }}>
                {description}
              </div>
            )}

            {/* ITEMS LIST */}
            {items.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#1A1A1E',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 16,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14
                    }}
                  >
                    {item.badge && (
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: item.badgeBg || 'rgba(255, 255, 255, 0.08)',
                        border: item.badgeColor ? `1.5px solid ${item.badgeColor}55` : '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 900, color: item.badgeColor || '#fff', lineHeight: 1 }}>
                          {item.badge}
                        </span>
                        {item.rir && (
                          <span style={{ fontSize: 9, fontWeight: 800, color: item.badgeColor || '#8b90a0', opacity: 0.95, marginTop: 2 }}>
                            {item.rir}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: item.badgeColor || '#fff' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: '#9fa3b2', marginTop: 4, lineHeight: 1.4 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PRO-TIP CALLOUT */}
            {tip && (
              <div style={{
                background: 'rgba(0, 122, 255, 0.08)',
                border: '1px solid rgba(0, 122, 255, 0.25)',
                borderRadius: 16,
                padding: '14px 16px',
                color: '#e2e2e2',
                fontSize: 13,
                lineHeight: 1.5,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: 18, lineHeight: 1.2 }}>💡</span>
                <span style={{ flex: 1 }}>{tip}</span>
              </div>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div style={{
            padding: '14px 22px 18px 22px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '15px',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0, 122, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Check size={18} strokeWidth={3} /> {actionText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
