import React, { useRef, useEffect, useState } from 'react';

export default function WheelPicker({ items, value, onChange, label }) {
  const containerRef = useRef(null);
  const itemHeight = 44; // Fixed height per item
  const [localVal, setLocalVal] = useState(value);

  // Sync scroll on mount
  useEffect(() => {
    if (containerRef.current) {
      const idx = items.findIndex(i => i === value);
      if (idx !== -1) {
        containerRef.current.scrollTop = idx * itemHeight;
      }
    }
  }, [value, items]);

  const handleScroll = (e) => {
    const el = e.target;
    // Calculate the centered item index based on scroll position
    const idx = Math.round(el.scrollTop / itemHeight);
    if (idx >= 0 && idx < items.length) {
      const newVal = items[idx];
      setLocalVal(newVal);
      // Wait for scrolling to stop before triggering onChange
      if (el.scrollTimeout) clearTimeout(el.scrollTimeout);
      el.scrollTimeout = setTimeout(() => {
        onChange(newVal);
      }, 150);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0' }}>
      {label && <span style={{ fontSize: 12, color: '#8B8680', marginBottom: 8, fontWeight: 700 }}>{label.toUpperCase()}</span>}
      <div 
        style={{
          position: 'relative',
          height: itemHeight * 5, // show 5 items
          width: '100px',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)'
        }}
      >
        {/* Selection indicator styling */}
        <div style={{
          position: 'absolute',
          top: itemHeight * 2,
          left: 0,
          right: 0,
          height: itemHeight,
          borderTop: '2px solid #E8622C',
          borderBottom: '2px solid #E8622C',
          pointerEvents: 'none',
          zIndex: 10
        }} />

        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            height: '100%',
            overflowY: 'auto',
            scrollSnapType: 'y mandatory',
            paddingTop: itemHeight * 2,
            paddingBottom: itemHeight * 2,
            scrollbarWidth: 'none', // hide scrollbar firefox
            msOverflowStyle: 'none', // hide scrollbar IE
          }}
          className="no-scrollbar"
        >
          {items.map((it, i) => (
            <div 
              key={i} 
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                fontSize: 22,
                fontWeight: localVal === it ? 800 : 400,
                color: localVal === it ? '#F5F3EE' : '#5F5C56',
                transition: 'all 0.15s ease'
              }}
            >
              {it}
            </div>
          ))}
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
