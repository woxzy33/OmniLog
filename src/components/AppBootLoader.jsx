import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const MOTIVATIONAL_BOOT_QUOTES = [
  {
    quote: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not a champion.",
    author: "Arnold Schwarzenegger"
  },
  {
    quote: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.",
    author: "Ronnie Coleman"
  },
  {
    quote: "No citizen has a right to be an amateur in physical training. What a disgrace it is for a man to grow old without ever seeing the beauty and strength of which his body is capable.",
    author: "Socrates"
  },
  {
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali"
  },
  {
    quote: "We don't rise to the level of our expectations, we fall to the level of our training.",
    author: "Archilochus"
  },
  {
    quote: "The pain of discipline is nothing like the pain of disappointment.",
    author: "Justin Langer"
  },
  {
    quote: "If something stands between you and your success, move it. Never be denied.",
    author: "Dwayne 'The Rock' Johnson"
  },
  {
    quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
    author: "Dwayne Johnson"
  }
];

export default function AppBootLoader({ status = "Synchronizing training chamber..." }) {
  const [quoteIndex, setQuoteIndex] = useState(() => 
    Math.floor(Math.random() * MOTIVATIONAL_BOOT_QUOTES.length)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_BOOT_QUOTES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentQuote = MOTIVATIONAL_BOOT_QUOTES[quoteIndex];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 50% 35%, #141721 0%, #090A0C 75%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '48px 28px calc(36px + env(safe-area-inset-bottom))',
      boxSizing: 'border-box',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Background ambient glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 280,
        height: 280,
        borderRadius: '50%',
        background: 'rgba(0, 122, 255, 0.12)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Top Spacer */}
      <div style={{ height: 20 }} />

      {/* Central Branding & Emblem */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, marginTop: -20 }}>
        {/* Animated Insignia */}
        <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Pulsing Outer Rings */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.05, 0.35]
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid var(--primary, #007AFF)',
              boxShadow: '0 0 25px rgba(0, 122, 255, 0.4)'
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
            style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              border: '1.5px solid var(--primary-light, #00C6FF)'
            }}
          />

          {/* Central Core Emblem */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: 'linear-gradient(145deg, #1A1D27 0%, #0F1118 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2)'
            }}
          >
            {/* Dumbbell / Flame Icon */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary, #007AFF)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.4 14.4l-4.8-4.8" />
              <path d="M6.9 11.2l-2.4 2.4a2.12 2.12 0 0 0 0 3l2.8 2.8a2.12 2.12 0 0 0 3 0l2.4-2.4" />
              <path d="M12.8 17.1l-2.4 2.4" />
              <path d="M11.2 6.9l2.4-2.4a2.12 2.12 0 0 1 3 0l2.8 2.8a2.12 2.12 0 0 1 0 3l-2.4 2.4" />
              <path d="M17.1 12.8l2.4-2.4" />
            </svg>
          </motion.div>
        </div>

        {/* Wordmark */}
        <h1 style={{
          fontFamily: "'Anton', 'Outfit', sans-serif",
          fontSize: 34,
          letterSpacing: '0.08em',
          margin: 0,
          background: 'linear-gradient(180deg, #FFFFFF 20%, #A0A5B5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase'
        }}>
          OMNILOG
        </h1>

        <div style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.22em',
          color: 'var(--primary, #007AFF)',
          textTransform: 'uppercase',
          marginTop: 6
        }}>
          TITAN FORGED GYM LOGGING
        </div>

        {/* Dynamic Loading Status Line */}
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 140,
            height: 3,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <motion.div
              animate={{
                x: [-140, 140]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 60,
                height: '100%',
                background: 'linear-gradient(90deg, transparent, var(--primary, #007AFF), transparent)',
                borderRadius: 2
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, letterSpacing: '0.04em' }}>
            {status}
          </span>
        </div>
      </div>

      {/* Motivational Quote Carousel at Bottom */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        minHeight: 110,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 18,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        zIndex: 1
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            style={{ width: '100%' }}
          >
            <div style={{
              fontSize: 13,
              lineHeight: '1.55',
              color: '#D1D5DB',
              fontStyle: 'italic',
              fontWeight: 500,
              marginBottom: 8
            }}>
              "{currentQuote.quote}"
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--primary, #007AFF)',
              textTransform: 'uppercase'
            }}>
              — {currentQuote.author}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
