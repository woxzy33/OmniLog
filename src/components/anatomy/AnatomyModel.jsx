import React from 'react';
import {
  MALE_FRONT_VIEWBOX,
  MALE_BACK_VIEWBOX,
  FEMALE_FRONT_VIEWBOX,
  FEMALE_BACK_VIEWBOX,
  MALE_FRONT_DATA,
  MALE_BACK_DATA,
  FEMALE_FRONT_DATA,
  FEMALE_BACK_DATA
} from './realisticAnatomyData';

export default function AnatomyModel({
  gender = 'male',
  type = 'anterior', // 'anterior' | 'posterior'
  dataArr = [],
  metaMap = {},
  highlightedColors = [],
  activeMode = 'weekly',
  selectedMuscle = null,
  onClick = () => {},
  className = '',
  width = 175,
  height = 350,
  style = {}
}) {
  const isFemale = String(gender).toLowerCase() === 'female';
  const isAnterior = type === 'anterior';

  const modelData = isFemale
    ? (isAnterior ? FEMALE_FRONT_DATA : FEMALE_BACK_DATA)
    : (isAnterior ? MALE_FRONT_DATA : MALE_BACK_DATA);

  const viewBox = isFemale
    ? (isAnterior ? FEMALE_FRONT_VIEWBOX : FEMALE_BACK_VIEWBOX)
    : (isAnterior ? MALE_FRONT_VIEWBOX : MALE_BACK_VIEWBOX);

  // Default color for non-stimulated muscles
  const defaultMuscleFill = activeMode === 'recovery' ? '#30D158' : 'rgba(255, 255, 255, 0.05)';
  const defaultMuscleStroke = 'rgba(255, 255, 255, 0.12)';

  // Resolve fill color for each muscle group based on sports science engine
  const getMuscleColor = (muscleKey) => {
    const meta = metaMap[muscleKey];
    if (meta && meta.level && meta.level.color) {
      if (activeMode === 'recovery') {
        return meta.level.color;
      }
      if (meta.sets > 0) {
        return meta.level.color;
      }
    }
    return defaultMuscleFill;
  };

  const isMuscleSelected = (muscleKey) => {
    return selectedMuscle && selectedMuscle.name === muscleKey;
  };

  return (
    <div 
      className={`anatomy-model-container ${className}`} 
      style={{ 
        position: 'relative', 
        width, 
        height, 
        aspectRatio: '1 / 2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        ...style 
      }}
    >
      <svg
        viewBox={viewBox}
        width="100%"
        height="100%"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          overflow: 'visible',
          filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))'
        }}
      >
        {/* Glow filter definition for selected muscles */}
        <defs>
          <filter id={`selected-glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 1. Body Components (Extremities & Muscles) */}
        {modelData.map((item, idx) => {
          if (item.isExtremity) {
            return (
              <g key={`ext-${idx}`} style={{ pointerEvents: 'none' }}>
                {item.paths.map((p, pIdx) => (
                  <path
                    key={pIdx}
                    d={p}
                    fill="#181A22"
                    stroke="#262A38"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    style={{ pointerEvents: 'none' }}
                  />
                ))}
              </g>
            );
          }

          const muscleKey = item.canonicalSlug;
          const fill = getMuscleColor(muscleKey);
          const isSelected = isMuscleSelected(muscleKey);
          const hasStimulus = fill !== defaultMuscleFill;

          return (
            <g
              key={`${muscleKey}-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                onClick({ muscle: muscleKey });
              }}
              style={{ cursor: 'pointer' }}
              className="anatomy-muscle-group"
            >
              {item.paths.map((p, pIdx) => (
                <path
                  key={pIdx}
                  d={p}
                  fill={fill}
                  stroke={isSelected ? '#FFFFFF' : (hasStimulus ? 'rgba(255,255,255,0.25)' : defaultMuscleStroke)}
                  strokeWidth={isSelected ? 2.5 : 1}
                  strokeLinejoin="round"
                  filter={isSelected ? `url(#selected-glow-${type})` : undefined}
                  style={{
                    transition: 'fill 0.25s ease, stroke 0.2s ease, filter 0.2s ease',
                    opacity: hasStimulus ? 0.95 : 0.7
                  }}
                />
              ))}
            </g>
          );
        })}
      </svg>

      <style dangerouslySetInnerHTML={{__html: `
        .anatomy-muscle-group:hover path {
          filter: brightness(1.25) drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
          stroke: rgba(255, 255, 255, 0.5) !important;
        }
      `}} />
    </div>
  );
}
