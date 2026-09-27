import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../../store/AuthContext';
import { useAppStore } from '../../store';
import { saveUserProfile } from '../../store/Database';
import WheelPicker from '../ui/WheelPicker';
import { User, Dumbbell, Trophy, Check, ChevronRight, ChevronLeft, Loader2, Speedometer } from '../Icons';
import { EXPERIENCE_TIERS } from '../../services/ProgressionEngine';

const MAX_NAME_LENGTH = 18;

const GENDER_OPTIONS = [
  { id: 'Male', label: 'Male', symbol: '♂', desc: 'Standard male physiology' },
  { id: 'Female', label: 'Female', symbol: '♀', desc: 'Standard female physiology' },
  { id: 'Other', label: 'Other', symbol: '✦', desc: 'Non-binary / custom' },
  { id: 'Prefer not to say', label: 'Private', symbol: '•', desc: 'Prefer not to say' }
];

const OBJECTIVES = [
  { id: 'hypertrophy', title: 'Hypertrophy & Growth', icon: '🏛', desc: 'Maximize muscle volume, fullness, and aesthetics' },
  { id: 'strength', title: 'Strength & Power', icon: '⚡', desc: 'Drive up 1RM barbell numbers and raw physical power' },
  { id: 'shred', title: 'Fat Loss & Conditioning', icon: '🔥', desc: 'Cut body fat while preserving lean muscle mass' },
  { id: 'athletic', title: 'Athletic Performance', icon: '🎯', desc: 'Functional speed, endurance, and injury resistance' }
];

const METRIC_WEIGHTS = Array.from({ length: 180 }, (_, i) => i + 35); // 35kg to 214kg
const METRIC_HEIGHTS = Array.from({ length: 130 }, (_, i) => i + 110); // 110cm to 239cm

const IMPERIAL_WEIGHTS = Array.from({ length: 350 }, (_, i) => i + 80); // 80lbs to 429lbs
const IMPERIAL_HEIGHTS = Array.from({ length: 50 }, (_, i) => i + 48); // 48in to 97in (4ft to 8ft)

export default function OnboardingScreen() {
  const { currentUser, setUserProfile } = useAuth();
  const { data, persist } = useAppStore();

  const [step, setStep] = useState(1);
  const [unit, setUnit] = useState('kg'); // 'kg' | 'lbs'

  // Step 1: Identity
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');

  // Step 2: Physical Metrics
  const [metricWeight, setMetricWeight] = useState(75);
  const [metricHeight, setMetricHeight] = useState(178);

  const [imperialWeight, setImperialWeight] = useState(165);
  const [imperialHeight, setImperialHeight] = useState(70);

  // Step 3: Objective
  const [objective, setObjective] = useState('hypertrophy');

  // Step 4: Training Experience (Progressive Overload Calibration)
  const [experienceLevel, setExperienceLevel] = useState('intermediate');

  const [loading, setLoading] = useState(false);
  const [completedAnimation, setCompletedAnimation] = useState(false);

  // Effective values in metric for storage
  const effectiveWeightKg = unit === 'kg' ? metricWeight : Math.round(imperialWeight * 0.453592);
  const effectiveHeightCm = unit === 'kg' ? metricHeight : Math.round(imperialHeight * 2.54);

  // Calculate BMI
  const bmi = React.useMemo(() => {
    const hM = effectiveHeightCm / 100;
    if (hM <= 0) return 0;
    return (effectiveWeightKg / (hM * hM)).toFixed(1);
  }, [effectiveWeightKg, effectiveHeightCm]);

  const bmiCategory = React.useMemo(() => {
    const num = Number(bmi);
    if (num < 18.5) return { label: 'Underweight', color: '#60A5FA' };
    if (num < 25) return { label: 'Athletic / Normal', color: '#34D399' };
    if (num < 30) return { label: 'Muscular / Heavy', color: '#FBBF24' };
    return { label: 'Titan', color: '#F87171' };
  }, [bmi]);

  const isNameValid = name.trim().length >= 2 && name.trim().length <= MAX_NAME_LENGTH;

  const handleNextFromStep1 = () => {
    if (!isNameValid) return;
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (effectiveWeightKg <= 0 || effectiveHeightCm <= 0) return;
    setStep(3);
  };

  const handleNextFromStep3 = () => {
    setStep(4);
  };

  const handleCompleteRegistration = async () => {
    if (!isNameValid || loading) return;
    setLoading(true);

    const profile = {
      name: name.trim(),
      weight: effectiveWeightKg,
      height: effectiveHeightCm,
      gender,
      objective,
      experienceLevel,
      progressiveOverloadEnabled: true,
      unit,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save profile to Firebase Auth / Firestore
      await saveUserProfile(currentUser.uid, profile);

      // 2. Automatically record initial body measurement in user history
      const initialMeasurement = {
        id: `meas-initial-${Date.now()}`,
        date: new Date().toISOString(),
        weight: effectiveWeightKg,
        height: effectiveHeightCm,
        note: 'Baseline measurement at account initiation'
      };

      const existingMeasurements = Array.isArray(data?.measurements) ? data.measurements : [];
      persist({
        ...data,
        measurements: [...existingMeasurements, initialMeasurement],
        user: {
          ...(data?.user || {}),
          name: name.trim()
        },
        settings: {
          ...(data?.settings || {}),
          unit,
          experienceLevel,
          progressiveOverloadEnabled: true
        }
      });

      // 3. Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompletedAnimation(true);

      setTimeout(() => {
        setUserProfile(profile);
      }, 1200);
    } catch (e) {
      console.error('Error saving profile:', e);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      background: 'radial-gradient(circle at 50% 12%, #141724 0%, #08090C 85%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '36px 20px calc(24px + env(safe-area-inset-bottom))',
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden',
      color: '#e2e2e2'
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(0, 122, 255, 0.12)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Header & Step Indicator */}
      <div style={{ width: '100%', maxWidth: 400, zIndex: 1, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0, 122, 255, 0.12)',
          border: '1px solid rgba(0, 122, 255, 0.3)',
          padding: '4px 12px',
          borderRadius: 20,
          color: 'var(--primary, #007AFF)',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          Athlete Calibration • Step {step} of 4
        </div>

        {/* 4-Step Progress Bar */}
        <div style={{ display: 'flex', gap: 6, width: '100%', maxWidth: 280, margin: '0 auto 20px' }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step >= 1 ? 'var(--primary, #007AFF)' : '#27272A', transition: 'all 0.3s' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step >= 2 ? 'var(--primary, #007AFF)' : '#27272A', transition: 'all 0.3s' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step >= 3 ? 'var(--primary, #007AFF)' : '#27272A', transition: 'all 0.3s' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step >= 4 ? 'var(--primary, #007AFF)' : '#27272A', transition: 'all 0.3s' }} />
        </div>
      </div>

      {/* Main Content Card with Animated Transitions */}
      <div style={{ width: '100%', maxWidth: 400, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {/* STEP 1: IDENTITY & GENDER */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(18, 20, 28, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              <h2 style={{
                fontFamily: "'Anton', 'Outfit', sans-serif",
                fontSize: 26,
                letterSpacing: '0.04em',
                margin: '0 0 6px',
                textTransform: 'uppercase',
                color: '#fff'
              }}>
                Athlete Moniker
              </h2>
              <p style={{ fontSize: 13, color: '#8B90A0', margin: '0 0 20px', lineHeight: '1.45' }}>
                How should OmniLog address you on personal records and training logs?
              </p>

              {/* Name Input */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#8B90A0', textTransform: 'uppercase' }}>
                    Full Name or Gym Alias
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: name.trim().length > MAX_NAME_LENGTH ? '#EF4444' : '#6B7280' }}>
                    {name.trim().length}/{MAX_NAME_LENGTH}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Marcus Vance"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={MAX_NAME_LENGTH + 2}
                  autoFocus
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#0D0E13',
                    border: isNameValid ? '1px solid var(--primary, #007AFF)' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: isNameValid ? '0 0 15px rgba(0, 122, 255, 0.2)' : 'none'
                  }}
                />
              </div>

              {/* Gender Cards */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#8B90A0', textTransform: 'uppercase', marginBottom: 8 }}>
                  Gender (Required for Volume & Calories)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {GENDER_OPTIONS.map(g => {
                    const isSelected = gender === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGender(g.id)}
                        style={{
                          background: isSelected ? 'rgba(0, 122, 255, 0.15)' : '#0D0E13',
                          border: isSelected ? '1.5px solid var(--primary, #007AFF)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 14,
                          padding: '12px 10px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 15px rgba(0, 122, 255, 0.25)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: isSelected ? '#fff' : '#A0AEC0' }}>
                            {g.symbol} {g.label}
                          </span>
                          {isSelected && <Check size={14} color="var(--primary, #007AFF)" />}
                        </div>
                        <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>
                          {g.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Step 1 Button */}
              <button
                type="button"
                onClick={handleNextFromStep1}
                disabled={!isNameValid}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  border: 'none',
                  background: isNameValid 
                    ? 'linear-gradient(135deg, var(--primary, #007AFF) 0%, var(--primary-light, #00C6FF) 100%)' 
                    : '#27272A',
                  color: isNameValid ? '#fff' : '#71717A',
                  fontWeight: 800,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: isNameValid ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: isNameValid ? '0 4px 20px rgba(0, 122, 255, 0.35)' : 'none'
                }}
              >
                Continue to Physical Metrics <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: PHYSICAL METRICS (WEIGHT & HEIGHT) */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(18, 20, 28, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h2 style={{
                  fontFamily: "'Anton', 'Outfit', sans-serif",
                  fontSize: 26,
                  letterSpacing: '0.04em',
                  margin: 0,
                  textTransform: 'uppercase',
                  color: '#fff'
                }}>
                  Physical Blueprint
                </h2>

                {/* Unit Switcher */}
                <div style={{
                  display: 'flex',
                  background: '#0D0E13',
                  borderRadius: 10,
                  padding: 2,
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <button
                    type="button"
                    onClick={() => setUnit('kg')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: unit === 'kg' ? 'var(--primary, #007AFF)' : 'transparent',
                      color: unit === 'kg' ? '#fff' : '#6B7280',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Metric (kg/cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('lbs')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: unit === 'lbs' ? 'var(--primary, #007AFF)' : 'transparent',
                      color: unit === 'lbs' ? '#fff' : '#6B7280',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Imperial (lbs/in)
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#8B90A0', margin: '0 0 16px', lineHeight: '1.4' }}>
                Used to calculate relative PRs, calisthenics volume, and muscle strain.
              </p>

              {/* Wheel Pickers Container */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                background: '#0D0E13',
                borderRadius: 18,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '12px 6px',
                marginBottom: 16
              }}>
                {unit === 'kg' ? (
                  <>
                    <WheelPicker
                      items={METRIC_WEIGHTS}
                      value={metricWeight}
                      onChange={setMetricWeight}
                      label="Bodyweight (kg)"
                    />
                    <div style={{ width: 1, background: 'rgba(255, 255, 255, 0.08)', margin: '12px 0' }} />
                    <WheelPicker
                      items={METRIC_HEIGHTS}
                      value={metricHeight}
                      onChange={setMetricHeight}
                      label="Height (cm)"
                    />
                  </>
                ) : (
                  <>
                    <WheelPicker
                      items={IMPERIAL_WEIGHTS}
                      value={imperialWeight}
                      onChange={setImperialWeight}
                      label="Bodyweight (lbs)"
                    />
                    <div style={{ width: 1, background: 'rgba(255, 255, 255, 0.08)', margin: '12px 0' }} />
                    <WheelPicker
                      items={IMPERIAL_HEIGHTS}
                      value={imperialHeight}
                      onChange={setImperialHeight}
                      label="Height (in)"
                    />
                  </>
                )}
              </div>

              {/* Calculated BMI / Physiology Pill */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 14,
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#8B90A0', fontWeight: 700, textTransform: 'uppercase' }}>
                    Calculated BMI
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                    {bmi}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${bmiCategory.color}44`,
                  color: bmiCategory.color,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {bmiCategory.label}
                </div>
              </div>

              {/* Nav Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '14px',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0D0E13',
                    color: '#8B90A0',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 14,
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary, #007AFF) 0%, var(--primary-light, #00C6FF) 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 20px rgba(0, 122, 255, 0.35)'
                  }}
                >
                  Confirm Physical Stats <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: TRAINING GOAL & INITIATION */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(18, 20, 28, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              <h2 style={{
                fontFamily: "'Anton', 'Outfit', sans-serif",
                fontSize: 26,
                letterSpacing: '0.04em',
                margin: '0 0 6px',
                textTransform: 'uppercase',
                color: '#fff'
              }}>
                Mission Objective
              </h2>
              <p style={{ fontSize: 13, color: '#8B90A0', margin: '0 0 18px', lineHeight: '1.4' }}>
                Select your primary training focus to calibrate progression charts.
              </p>

              {/* Objectives List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {OBJECTIVES.map(obj => {
                  const isSelected = objective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => setObjective(obj.id)}
                      style={{
                        background: isSelected ? 'rgba(0, 122, 255, 0.16)' : '#0D0E13',
                        border: isSelected ? '1.5px solid var(--primary, #007AFF)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 14,
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 15px rgba(0, 122, 255, 0.25)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{obj.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? '#fff' : '#D1D5DB' }}>
                          {obj.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 2 }}>
                          {obj.desc}
                        </div>
                      </div>
                      {isSelected && <Check size={18} color="var(--primary, #007AFF)" />}
                    </button>
                  );
                })}
              </div>

              {/* Nav & Next to Step 4 Button */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: '14px',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0D0E13',
                    color: '#8B90A0',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 14,
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--primary, #007AFF) 0%, var(--primary-light, #00C6FF) 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 20px rgba(0, 122, 255, 0.35)'
                  }}
                >
                  Experience Level <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: EXPERIENCE & PROGRESSIVE OVERLOAD CALIBRATION */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(18, 20, 28, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>⚡</span>
                <h2 style={{
                  fontFamily: "'Anton', 'Outfit', sans-serif",
                  fontSize: 24,
                  letterSpacing: '0.04em',
                  margin: 0,
                  textTransform: 'uppercase',
                  color: '#fff'
                }}>
                  Training Experience
                </h2>
              </div>
              <p style={{ fontSize: 13, color: '#8B90A0', margin: '0 0 16px', lineHeight: '1.4' }}>
                Calibrates your scientific Progressive Overload pacing and exercise plateau thresholds.
              </p>

              {/* Tiers List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {Object.values(EXPERIENCE_TIERS).map(tier => {
                  const isSelected = experienceLevel === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setExperienceLevel(tier.id)}
                      style={{
                        background: isSelected ? 'rgba(0, 122, 255, 0.16)' : '#0D0E13',
                        border: isSelected ? `1.5px solid ${tier.color || 'var(--primary)'}` : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 14,
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? `0 4px 15px ${tier.color}33` : 'none'
                      }}
                    >
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{tier.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: isSelected ? '#fff' : '#D1D5DB' }}>
                            {tier.label}
                          </span>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: isSelected ? `${tier.color}30` : 'rgba(255,255,255,0.06)',
                            color: isSelected ? tier.color : '#8B90A0'
                          }}>
                            {tier.duration}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#8B90A0', fontWeight: 500, marginTop: 3, lineHeight: 1.35 }}>
                          {tier.shortDesc}
                        </div>
                      </div>
                      {isSelected && <Check size={18} color={tier.color || "var(--primary, #007AFF)"} />}
                    </button>
                  );
                })}
              </div>

              {/* Nav & Complete Registration Button */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={loading}
                  style={{
                    padding: '14px',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0D0E13',
                    color: '#8B90A0',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleCompleteRegistration}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 14,
                    border: 'none',
                    background: completedAnimation 
                      ? '#10B981' 
                      : 'linear-gradient(135deg, var(--primary, #007AFF) 0%, var(--primary-light, #00C6FF) 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 6px 25px rgba(0, 122, 255, 0.4)',
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>{completedAnimation ? 'Welcome, Athlete!' : 'Forging Profile...'}</span>
                    </>
                  ) : (
                    <span>Initiate OmniLog 🚀</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#4B5563', zIndex: 1, letterSpacing: '0.06em' }}>
        OMNILOG ATHLETICS • ZERO BULLSHIT LOGGING
      </div>
    </div>
  );
}
