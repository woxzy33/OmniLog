import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Upload, Trash2 } from './Icons';
import { useAppStore } from '../store';
import { CATEGORIES } from '../data/exerciseDb';

const MUSCLE_OPTIONS = [
  { id: 'chest', label: 'Chest / Pectorals', category: 'Chest' },
  { id: 'upper-back', label: 'Upper Back / Lats', category: 'Back' },
  { id: 'trapezius', label: 'Trapezius / Traps', category: 'Back' },
  { id: 'lower-back', label: 'Lower Back / Erectors', category: 'Back' },
  { id: 'quadriceps', label: 'Quadriceps / Quads', category: 'Legs' },
  { id: 'hamstring', label: 'Hamstrings', category: 'Legs' },
  { id: 'gluteal', label: 'Glutes', category: 'Legs' },
  { id: 'calves', label: 'Calves', category: 'Legs' },
  { id: 'adductor', label: 'Adductors', category: 'Legs' },
  { id: 'front-deltoids', label: 'Front Deltoids', category: 'Shoulders' },
  { id: 'back-deltoids', label: 'Rear Delts / Side Delts', category: 'Shoulders' },
  { id: 'biceps', label: 'Biceps', category: 'Arms' },
  { id: 'triceps', label: 'Triceps', category: 'Arms' },
  { id: 'forearm', label: 'Forearms', category: 'Arms' },
  { id: 'abs', label: 'Abdominals / Core', category: 'Core' },
  { id: 'obliques', label: 'Obliques', category: 'Core' },
];

const DEFAULT_EQUIPMENT_OPTIONS = [
  'Barbell',
  'Dumbbell',
  'Machine',
  'Cable',
  'Bodyweight',
  'Band',
  'Kettlebell',
  'EZ Bar',
  'Other'
];

export default function CreateCustomExerciseModal({ isOpen, onClose, onCreated, initialName = '' }) {
  const persist = useAppStore(s => s.persist);
  const data = useAppStore(s => s.data);

  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState('Chest');
  const [specificMuscle, setSpecificMuscle] = useState('chest');
  const [secondaryMuscle, setSecondaryMuscle] = useState('');
  const [equipment, setEquipment] = useState('Barbell');
  const [requiresWeight, setRequiresWeight] = useState(true);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imageSizeKb, setImageSizeKb] = useState(0);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Sync specific muscle when category changes if current doesn't match
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const available = MUSCLE_OPTIONS.filter(m => m.category === newCat);
    if (available.length > 0) {
      setSpecificMuscle(available[0].id);
    }
  };

  // Image upload and client-side canvas downscaling (max 320x320 JPEG @ 0.82)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_SIZE = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        setImageDataUrl(compressed);
        const approxKb = Math.round((compressed.length * 3) / 4 / 1024);
        setImageSizeKb(approxKb);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageDataUrl(null);
    setImageSizeKb(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please provide an exercise name.');
      return;
    }

    // Check duplicate
    const allExercises = data?.exercises || [];
    const isDup = allExercises.some(e => e.name.toLowerCase() === trimmedName.toLowerCase());
    if (isDup) {
      setError(`An exercise named "${trimmedName}" already exists.`);
      return;
    }

    const customId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newExercise = {
      id: customId,
      name: trimmedName,
      category,
      specificMuscle,
      secondaryMuscle: secondaryMuscle || null,
      equipment,
      requiresWeight,
      imageUrl: imageDataUrl || null,
      isCustom: true,
      createdAt: Date.now()
    };

    // Persist to store
    persist(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise]
    }), true);

    if (onCreated) {
      onCreated(newExercise);
    }
    onClose();
  };

  if (!isOpen) return null;

  const relevantMuscles = MUSCLE_OPTIONS.filter(m => m.category === category);
  const otherMuscles = MUSCLE_OPTIONS.filter(m => m.category !== category);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 520,
            maxHeight: '92vh',
            background: '#121214',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            background: '#18181C',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#8b90a0',
                width: 36,
                height: 36,
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>
              Create Custom Exercise
            </div>
            <button
              onClick={handleSave}
              style={{
                background: 'var(--primary)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                padding: '8px 16px',
                borderRadius: 18,
                boxShadow: '0 2px 10px rgba(var(--primary-rgb), 0.4)'
              }}
            >
              Save
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            {error && (
              <div style={{
                background: 'rgba(255, 59, 48, 0.15)',
                border: '1px solid #FF3B30',
                borderRadius: 12,
                padding: '10px 14px',
                color: '#FF453A',
                fontSize: 13,
                fontWeight: 600
              }}>
                {error}
              </div>
            )}

            {/* Photo Upload & Avatar Preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: '#1A1A1E',
              padding: '14px 16px',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  background: imageDataUrl ? '#000' : 'rgba(255,255,255,0.04)',
                  border: '2px dashed rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                {imageDataUrl ? (
                  <img
                    src={imageDataUrl}
                    alt="Custom preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#8b90a0' }}>
                    <Upload size={22} color="var(--primary)" />
                    <span style={{ fontSize: 9, fontWeight: 700 }}>ADD PHOTO</span>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                  Exercise Photo (Optional)
                </div>
                <div style={{ fontSize: 12, color: '#8b90a0', lineHeight: 1.4 }}>
                  {imageDataUrl
                    ? `Optimized canvas JPEG (${imageSizeKb} KB)`
                    : 'Auto-compressed (<35KB) for instant cloud sync.'}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: 12
                    }}
                  >
                    {imageDataUrl ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {imageDataUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        background: 'rgba(255,59,48,0.15)',
                        border: 'none',
                        color: '#FF453A',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '5px 10px',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Exercise Name */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                Exercise Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Bulgarian Split Squat"
                maxLength={45}
                style={{
                  width: '100%',
                  background: '#1A1A1E',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600
                }}
              />
            </div>

            {/* Exercise Type Segmented Control */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                Tracking Mode
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#1A1A1E',
                padding: 4,
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <button
                  type="button"
                  onClick={() => setRequiresWeight(true)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: 'none',
                    background: requiresWeight ? 'var(--primary)' : 'transparent',
                    color: requiresWeight ? '#fff' : '#8b90a0',
                    fontSize: 13,
                    fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                >
                  Weight & Reps
                </button>
                <button
                  type="button"
                  onClick={() => setRequiresWeight(false)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: 'none',
                    background: !requiresWeight ? 'var(--primary)' : 'transparent',
                    color: !requiresWeight ? '#fff' : '#8b90a0',
                    fontSize: 13,
                    fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                >
                  Bodyweight / Reps Only
                </button>
              </div>
            </div>

            {/* Category / Muscle Group */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                Primary Muscle Category
              </label>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 20,
                        border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(var(--primary-rgb), 0.15)' : '#1A1A1E',
                        color: isSelected ? '#fff' : '#8b90a0',
                        fontSize: 13,
                        fontWeight: isSelected ? 700 : 500,
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Muscle for Heatmap */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Target Anatomy (Heatmap 100%)
                </label>
                <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>Scientific Heatmap Mapped</span>
              </div>
              <select
                value={specificMuscle}
                onChange={e => setSpecificMuscle(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1A1A1E',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                <optgroup label={`${category} Muscles`}>
                  {relevantMuscles.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Other Anatomy">
                  {otherMuscles.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Secondary Muscle (Optional Synergist) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Secondary Synergist (Optional 50% Stimulus)
                </label>
                <span style={{ fontSize: 11, color: '#8b90a0' }}>e.g. Triceps on Bench</span>
              </div>
              <select
                value={secondaryMuscle}
                onChange={e => setSecondaryMuscle(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1A1A1E',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '12px 16px',
                  color: secondaryMuscle ? '#fff' : '#8b90a0',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                <option value="">None (Single-target isolation)</option>
                {MUSCLE_OPTIONS.filter(m => m.id !== specificMuscle).map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Equipment Selection */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b90a0', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                Equipment Required
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DEFAULT_EQUIPMENT_OPTIONS.map(eq => {
                  const isSelected = equipment === eq;
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => setEquipment(eq)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 12,
                        border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(var(--primary-rgb), 0.15)' : '#1A1A1E',
                        color: isSelected ? '#fff' : '#8b90a0',
                        fontSize: 13,
                        fontWeight: isSelected ? 700 : 500,
                        transition: 'all 0.2s'
                      }}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div style={{
            padding: '16px 20px',
            background: '#18181C',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <button
              onClick={handleSave}
              className="bigCta"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 18,
                fontSize: 16,
                fontWeight: 800
              }}
            >
              <Check size={18} /> Save & Add Exercise
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
