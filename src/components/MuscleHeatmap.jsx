import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Model, HandSvg, FootSvg } from '@plexapro/react-body-highlighter';

const FATIGUE_LEVELS = [
  { max: 0, color: '#1C1C1E', label: 'RESTED' },
  { max: 3, color: '#34C759', label: 'LIGHT' },
  { max: 7, color: '#FFD60A', label: 'ACTIVE' },
  { max: 12, color: '#FF9F0A', label: 'FATIGUED' },
  { max: Infinity, color: '#FF3B30', label: 'EXHAUSTED' }
];

// Highlighted colors for Model mapping (just use the array)
const HIGHLIGHTED_COLORS = ['#34C759', '#FFD60A', '#FF9F0A', '#FF3B30'];

function getSpecificMuscle(exObj) {
  if (!exObj) return null;
  const name = exObj.name.toLowerCase();
  const cat = exObj.category;
  
  if (cat === 'Arms') {
    if (name.includes('tricep') || name.includes('pushdown') || name.includes('extension') || name.includes('skullcrusher') || name.includes('kickback')) return 'triceps';
    if (name.includes('forearm') || name.includes('wrist')) return 'forearm';
    return 'biceps';
  }
  if (cat === 'Legs') {
    if (name.includes('calf') || name.includes('calves') || name.includes('raise')) return 'calves';
    if (name.includes('hamstring') || name.includes('leg curl') || name.includes('romanian') || name.includes('stiff-leg') || name.includes('deadlift')) return 'hamstring';
    if (name.includes('glute') || name.includes('hip thrust') || name.includes('bridge') || name.includes('kickback')) return 'gluteal';
    return 'quadriceps';
  }
  if (cat === 'Back') {
    if (name.includes('shrug') || name.includes('upright row')) return 'trapezius';
    if (name.includes('lower back') || name.includes('hyperextension') || name.includes('good morning')) return 'lower-back';
    return 'upper-back';
  }
  if (cat === 'Shoulders') {
    if (name.includes('rear') || name.includes('face pull') || name.includes('reverse fly')) return 'back-deltoids';
    return 'front-deltoids';
  }
  if (cat === 'Chest') return 'chest';
  if (cat === 'Core') return 'abs';
  
  return null;
}

const formatMuscleName = (m) => m.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const UnifiedAnatomy = ({ type, dataArr, metaMap, handleTap }) => {
  const isFront = type === 'anterior';
  const handColor = metaMap['forearm']?.level?.color || '#1C1C1E';
  const footColor = metaMap['calves']?.level?.color || '#1C1C1E';

  // For anterior: right hand is on the left of screen.
  // For posterior: left hand is on the left of screen.
  const leftScreenHand = isFront ? 'right' : 'left';
  const rightScreenHand = isFront ? 'left' : 'right';
  
  const leftScreenFoot = isFront ? 'right' : 'left';
  const rightScreenFoot = isFront ? 'left' : 'right';

  return (
    <div style={{ position: 'relative', width: 140, height: 280, margin: '10px 20px 40px 20px', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}>
      
      {/* Body Model */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
        <Model 
          data={dataArr}
          type={type}
          bodyColor="#1C1C1E"
          highlightedColors={HIGHLIGHTED_COLORS}
          onClick={handleTap}
        />
      </div>

      {/* Hands */}
      <div style={{ position: 'absolute', top: '48.5%', left: '-9%', width: '15%', zIndex: 1 }} onClick={() => handleTap({ muscle: 'forearm' })}>
        <HandSvg position={leftScreenHand} color={handColor} />
      </div>
      <div style={{ position: 'absolute', top: '48.5%', right: '-9%', width: '15%', zIndex: 1 }} onClick={() => handleTap({ muscle: 'forearm' })}>
        <HandSvg position={rightScreenHand} color={handColor} />
      </div>

      {/* Feet */}
      <div style={{ position: 'absolute', top: '95%', left: '18%', width: '22%', zIndex: 1 }} onClick={() => handleTap({ muscle: 'calves' })}>
        <FootSvg position={leftScreenFoot} color={footColor} />
      </div>
      <div style={{ position: 'absolute', top: '95%', right: '18%', width: '22%', zIndex: 1 }} onClick={() => handleTap({ muscle: 'calves' })}>
        <FootSvg position={rightScreenFoot} color={footColor} />
      </div>
    </div>
  );
};

export default function MuscleHeatmap({ sessions, days = 3, dataExercises, ignoreDate = false }) {
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const parsedData = useMemo(() => {
    const now = new Date();
    const map = {};

    const dict = {};
    if (dataExercises) {
      dataExercises.forEach(e => dict[e.id] = e);
    }

    if (sessions) {
      sessions.forEach(s => {
        const diffDays = Math.abs(now - new Date(s.date)) / (1000 * 60 * 60 * 24);
        if (ignoreDate || diffDays <= days) {
          (s.exercises || []).forEach(ex => {
            const exObj = dict[ex.exerciseId];
            if (exObj) {
              const specific = getSpecificMuscle(exObj);
              if (specific) {
                let sets = 0;
                (ex.sets || []).forEach(set => { 
                  if (set.completed || set.completed === undefined) sets += 1; 
                });
                
                if (sets > 0) {
                  if (!map[specific]) map[specific] = 0;
                  map[specific] += sets;
                }
              }
            }
          });
        }
      });
    }

    const dataArr = [];
    const metaMap = {};

    Object.keys(map).forEach(muscle => {
      const sets = map[muscle];
      if (sets > 0) {
        let levelIdx = FATIGUE_LEVELS.findIndex(l => sets <= l.max);
        if (levelIdx === -1) levelIdx = FATIGUE_LEVELS.length - 1;
        
        // Model component uses frequency mapping 1 = index 0 in HIGHLIGHTED_COLORS
        // We have 4 colors, map levelIdx to 1-4
        let freq = levelIdx; // level 1 -> freq 1, level 2 -> freq 2, etc.
        if (freq < 1) freq = 1;
        if (freq > 4) freq = 4;

        dataArr.push({
          name: muscle,
          muscles: [muscle, `left-${muscle}`, `right-${muscle}`],
          frequency: freq
        });

        metaMap[muscle] = { sets, level: FATIGUE_LEVELS[levelIdx] };
      }
    });

    return { dataArr, metaMap };
  }, [sessions, days, dataExercises, ignoreDate]);

  const handleTap = (data) => {
    if (!data || !data.muscle) {
      setSelectedMuscle(null);
      return;
    }
    const m = data.muscle.replace(/^(left-|right-)/, '');
    const meta = parsedData.metaMap[m] || { sets: 0, level: FATIGUE_LEVELS[0] };
    setSelectedMuscle({ name: m, ...meta });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
      
      {/* Invisible overlay to close tooltip */}
      {selectedMuscle && (
        <div 
          onClick={() => setSelectedMuscle(null)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }} 
        />
      )}

      <AnimatePresence>
        {selectedMuscle && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'absolute', top: -40, zIndex: 10, background: '#1c1c1e', padding: '12px 24px', borderRadius: 16, border: `1px solid ${selectedMuscle.level.color}`, boxShadow: `0 12px 40px rgba(0,0,0,0.9), 0 0 20px ${selectedMuscle.level.color}44`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            onClick={(e) => { e.stopPropagation(); setSelectedMuscle(null); }}
          >
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 18, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{formatMuscleName(selectedMuscle.name)}</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 700, color: '#8b90a0' }}>{selectedMuscle.sets} Sets</div>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 900, color: selectedMuscle.level.color, marginTop: 2, background: `${selectedMuscle.level.color}22`, padding: '4px 12px', borderRadius: 8 }}>{selectedMuscle.level.label}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, width: '100%', flexWrap: 'wrap' }}>
        
        {/* FRONT VIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 900, color: '#8b90a0', letterSpacing: '0.2em', marginBottom: 12 }}>FRONT</div>
          <UnifiedAnatomy 
            type="anterior" 
            dataArr={parsedData.dataArr} 
            metaMap={parsedData.metaMap}
            handleTap={handleTap} 
          />
        </div>

        {/* BACK VIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, fontWeight: 900, color: '#8b90a0', letterSpacing: '0.2em', marginBottom: 12 }}>BACK</div>
          <UnifiedAnatomy 
            type="posterior" 
            dataArr={parsedData.dataArr} 
            metaMap={parsedData.metaMap}
            handleTap={handleTap} 
          />
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, maxWidth: '100%' }}>
          {FATIGUE_LEVELS.slice(1).map((lvl, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: lvl.color, boxShadow: `0 0 10px ${lvl.color}80` }}/>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#8b90a0', letterSpacing: '0.05em', fontFamily: '"Inter", sans-serif' }}>{lvl.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .rbh polygon, .rbh path { transition: all 0.3s ease; cursor: pointer; }
        .rbh polygon:hover, .rbh path:hover { filter: brightness(1.3); }
        ${selectedMuscle ? `
          .rbh polygon[data-muscle="${selectedMuscle.name}"],
          .rbh polygon[data-muscle="left-${selectedMuscle.name}"],
          .rbh polygon[data-muscle="right-${selectedMuscle.name}"],
          .rbh path[data-muscle="${selectedMuscle.name}"],
          .rbh path[data-muscle="left-${selectedMuscle.name}"],
          .rbh path[data-muscle="right-${selectedMuscle.name}"] {
            stroke: #ffffff !important;
            stroke-width: 2 !important;
            filter: drop-shadow(0 0 8px rgba(255,255,255,1)) !important;
          }
        ` : ''}
      `}} />
    </div>
  );
}
