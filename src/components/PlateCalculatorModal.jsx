import React from 'react';
import { styles } from '../styles';
import { X } from './Icons';

export default function PlateCalculatorModal({ weight, onClose, settings }) {
  const targetWeight = Number(weight) || 0;
  const isLbs = settings?.unit === 'lbs';
  const barWeight = isLbs ? 45 : 20;
  const plateSizes = isLbs ? [45, 35, 25, 10, 5, 2.5] : [20, 15, 10, 5, 2.5, 1.25];
  
  let perSide = (targetWeight - barWeight) / 2;
  const platesNeeded = {};
  
  if (perSide > 0) {
    for (const p of plateSizes) {
      if (perSide >= p) {
        const count = Math.floor(perSide / p);
        platesNeeded[p] = count;
        perSide -= count * p;
      }
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(18, 17, 16, 0.85)', zIndex: 200, 
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#1A1918', padding: 24, borderRadius: 12, width: '85%', maxWidth: 350, border: '1px solid #33302A' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e2e2' }}>Plate Calculator</div>
          <button style={{ background: 'none', border: 'none', color: '#8b90a0', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{targetWeight} {settings?.unit || 'kg'}</div>
          <div style={{ fontSize: 13, color: '#8b90a0', marginTop: 4 }}>Standard {barWeight}{settings?.unit || 'kg'} Barbell</div>
        </div>

        {targetWeight < barWeight ? (
          <div style={{ textAlign: 'center', color: '#8b90a0', fontSize: 14 }}>
            Weight is less than the empty barbell!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#8b90a0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Plates Per Side</div>
            {plateSizes.map(p => {
              if (!platesNeeded[p]) return null;
              return (
                <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2A2722', padding: '12px 16px', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                      {platesNeeded[p]}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>x</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{p} {settings?.unit || 'kg'}</div>
                </div>
              );
            })}
            
            {perSide > 0 && (
              <div style={{ textAlign: 'center', color: '#D94A4A', fontSize: 12, marginTop: 8 }}>
                *Remainder: {(perSide * 2).toFixed(2)} {settings?.unit || 'kg'} cannot be loaded.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
