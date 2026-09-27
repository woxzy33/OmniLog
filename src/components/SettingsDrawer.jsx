import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Download, Upload, Trash2, LogOut, Bell, Lock, Eye, EyeOff, AlertTriangle, ShieldAlert, Check, Loader2 } from './Icons';
import { useAppStore } from '../store';
import { useAuth } from '../store/AuthContext';
import { saveUserProfile } from '../store/Database';
import { ConfirmModal } from './WorkoutSafeguards';
import { sendTestNotification, syncTrainingNotifications, requestNotificationPermission } from '../services/NotificationService';
import { EXPERIENCE_TIERS } from '../services/ProgressionEngine';
import { loadPlateauTestScenario, fastForwardDeloadTest, clearPlateauTestScenario, isTestScenarioLoaded } from '../services/PlateauTestLab';

export default function SettingsDrawer({ onClose, onExport, onImport }) {
  const { data, persist, wipeAllData } = useAppStore();
  const { currentUser, userProfile, setUserProfile, logout, changePassword, deleteAccount } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState(null);
  const [testMessage, setTestMessage] = React.useState('');
  const [testLabStatus, setTestLabStatus] = React.useState(null);
  const [testLabMsg, setTestLabMsg] = React.useState('');

  // Change Password state
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [currentPw, setCurrentPw] = React.useState('');
  const [newPw, setNewPw] = React.useState('');
  const [confirmNewPw, setConfirmNewPw] = React.useState('');
  const [showCurrentPw, setShowCurrentPw] = React.useState(false);
  const [showNewPw, setShowNewPw] = React.useState(false);
  const [changePwLoading, setChangePwLoading] = React.useState(false);
  const [changePwError, setChangePwError] = React.useState('');
  const [changePwSuccess, setChangePwSuccess] = React.useState('');

  // Delete Account State (Double Confirmation)
  const [showDeleteStep1, setShowDeleteStep1] = React.useState(false); // Password confirmation
  const [showDeleteStep2, setShowDeleteStep2] = React.useState(false); // Final "DELETE" confirmation
  const [deletePw, setDeletePw] = React.useState('');
  const [showDeletePw, setShowDeletePw] = React.useState(false);
  const [deleteInputWord, setDeleteInputWord] = React.useState('');
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState('');

  const settings = data?.settings || { unit: 'kg' };
  const notificationsEnabled = settings.notificationsEnabled !== false;
  const progressiveOverloadEnabled = settings.progressiveOverloadEnabled !== false;
  const currentExperience = settings.experienceLevel || userProfile?.experienceLevel || 'intermediate';
  
  const updateSettings = (newSettings) => {
    persist({ ...data, settings: { ...settings, ...newSettings } });
  };
  
  const updateProfile = async (updates) => {
    const newProfile = { ...userProfile, ...updates };
    setUserProfile(newProfile);
    if (currentUser) {
      await saveUserProfile(currentUser.uid, newProfile);
    }
  };

  const handleExperienceChange = (newLevel) => {
    updateSettings({ experienceLevel: newLevel });
    updateProfile({ experienceLevel: newLevel });
  };
  
  const wipeData = async () => {
    await wipeAllData();
  };

  const { t, i18n } = useTranslation();
  const [wipeStep, setWipeStep] = React.useState(0);
  const [wipeSuccess, setWipeSuccess] = React.useState(false);

  const handleWipe = async () => {
    if (wipeStep === 0) setWipeStep(1);
    else if (wipeStep === 1) setWipeStep(2);
    else {
      await wipeAllData();
      setWipeStep(0);
      setWipeSuccess(true);
      setTimeout(() => {
        setWipeSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleLang = (lng) => {
    updateSettings({ language: lng });
    i18n.changeLanguage(lng);
  };

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 900
            }}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%',
              background: settings.theme === 'orange' ? '#1c120c' : '#0a0a0c', boxSizing: 'border-box',
              zIndex: 1000, padding: 24, paddingTop: 'calc(20px + env(safe-area-inset-top, 0px))', 
              overflowY: 'auto', display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#fff' }}>{t('settings.title')}</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b90a0', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>{t('settings.sections.display', 'DISPLAY & PROFILE')}</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ color: '#e2e2e2', fontWeight: 600 }}>Gender</span>
                <select value={userProfile?.gender || 'Prefer not to say'} onChange={e => updateProfile({ gender: e.target.value })} style={{ background: '#1C1C1E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ color: '#e2e2e2', fontWeight: 600 }}>{t('settings.theme')}</span>
                <select value={settings.theme} onChange={e => updateSettings({ theme: e.target.value })} style={{ background: '#1C1C1E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>
                  <option value="blue">Blue Liquid</option>
                  <option value="orange">Orange Neon</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ color: '#e2e2e2', fontWeight: 600 }}>{t('settings.language')}</span>
                <select value={settings.language} onChange={e => handleLang(e.target.value)} style={{ background: '#1C1C1E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="tr">Türkçe</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#e2e2e2', fontWeight: 600 }}>{t('settings.unit')}</span>
                <select value={settings.unit} onChange={e => updateSettings({ unit: e.target.value })} style={{ background: '#1C1C1E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>{t('settings.sections.workout')}</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 14 }}>{t('settings.compoundRest')}</span>
                <input type="number" value={settings.compoundRest} onChange={e => updateSettings({ compoundRest: Number(e.target.value) })} style={{ background: '#1C1C1E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, width: 60, textAlign: 'right' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 14 }}>{t('settings.isolationRest')}</span>
                <input type="number" value={settings.isolationRest} onChange={e => updateSettings({ isolationRest: Number(e.target.value) })} style={{ background: '#1C1C1E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, width: 60, textAlign: 'right' }} />
              </div>
            </div>

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>PROGRESSIVE OVERLOAD & HYPERTROPHY</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
              {/* On/Off Switch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ paddingRight: 16 }}>
                  <div style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 14 }}>Progressive Overload Targets</div>
                  <div style={{ color: '#8b90a0', fontSize: 12, marginTop: 4, lineHeight: '1.4' }}>
                    Suggest adaptive weight & rep targets during active sessions using sports science models.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ progressiveOverloadEnabled: !progressiveOverloadEnabled })}
                  style={{
                    width: 48,
                    height: 28,
                    borderRadius: 14,
                    background: progressiveOverloadEnabled ? 'var(--primary, #007AFF)' : '#2c2d35',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      background: '#fff',
                      transform: progressiveOverloadEnabled ? 'translateX(20px)' : 'translateX(0px)',
                      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  />
                </button>
              </div>

              {/* Experience Tier Selector */}
              <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 13 }}>Experience Level</span>
                    <span style={{ color: '#8b90a0', fontSize: 11 }}>Calibrates adaptation pacing</span>
                  </div>
                  <select
                    value={currentExperience}
                    onChange={e => handleExperienceChange(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1C1C1E',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '10px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {Object.values(EXPERIENCE_TIERS).map(tier => (
                      <option key={tier.id} value={tier.id}>
                        {tier.icon} {tier.label} ({tier.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Info Banner */}
                {EXPERIENCE_TIERS[currentExperience] && (
                  <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: `1px solid ${EXPERIENCE_TIERS[currentExperience].color}33`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    marginTop: 8
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{EXPERIENCE_TIERS[currentExperience].icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: EXPERIENCE_TIERS[currentExperience].color }}>
                        {EXPERIENCE_TIERS[currentExperience].shortDesc}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: '1.45' }}>
                      {EXPERIENCE_TIERS[currentExperience].longDesc}
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Plateau Threshold: {settings.customPlateauThreshold != null ? `${settings.customPlateauThreshold} sessions (Custom Override)` : `${EXPERIENCE_TIERS[currentExperience].plateauThreshold} sessions without gain`}
                    </div>
                  </div>
                )}

                {/* Custom Plateau Threshold Customization */}
                <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 13 }}>Plateau Sensitivity</span>
                      <div style={{ color: '#8b90a0', fontSize: 11, marginTop: 2 }}>
                        Stagnant sessions before triggering intervention
                      </div>
                    </div>
                    {settings.customPlateauThreshold != null && (
                      <button
                        type="button"
                        onClick={() => updateSettings({ customPlateauThreshold: null })}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: '#00C6FF',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Reset to Auto
                      </button>
                    )}
                  </div>

                  {(() => {
                    const defaultThresh = EXPERIENCE_TIERS[currentExperience]?.plateauThreshold || 4;
                    const activeThresh = settings.customPlateauThreshold != null ? Number(settings.customPlateauThreshold) : defaultThresh;
                    return (
                      <>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#1C1C1E',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10,
                          padding: '6px 8px',
                          marginTop: 8
                        }}>
                          <button
                            type="button"
                            onClick={() => {
                              const next = Math.max(2, activeThresh - 1);
                              updateSettings({ customPlateauThreshold: next });
                            }}
                            disabled={activeThresh <= 2}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              background: activeThresh <= 2 ? 'transparent' : 'rgba(255,255,255,0.08)',
                              border: 'none',
                              color: activeThresh <= 2 ? '#444' : '#fff',
                              fontSize: 18,
                              fontWeight: 800,
                              cursor: activeThresh <= 2 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            −
                          </button>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                              {activeThresh} Sessions
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: settings.customPlateauThreshold != null ? '#FF9F0A' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {settings.customPlateauThreshold != null ? 'Custom Setting' : `Auto (${EXPERIENCE_TIERS[currentExperience]?.label || 'Tier'})`}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const next = Math.min(10, activeThresh + 1);
                              updateSettings({ customPlateauThreshold: next });
                            }}
                            disabled={activeThresh >= 10}
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              background: activeThresh >= 10 ? 'transparent' : 'rgba(255,255,255,0.08)',
                              border: 'none',
                              color: activeThresh >= 10 ? '#444' : '#fff',
                              fontSize: 18,
                              fontWeight: 800,
                              cursor: activeThresh >= 10 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 6, lineHeight: 1.4 }}>
                          {settings.customPlateauThreshold != null
                            ? `Custom override: Stagnation alert will fire after ${activeThresh} consecutive sessions without volume or 1RM progress.`
                            : `Scientific default: Based on your ${EXPERIENCE_TIERS[currentExperience]?.label} profile (${defaultThresh} sessions).`}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* 🧪 Plateau Testing Lab */}
                <div style={{
                  paddingTop: 16,
                  marginTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 15 }}>🧪</span>
                      <span style={{ color: '#F3F4F6', fontWeight: 700, fontSize: 13 }}>Plateau Testing Lab</span>
                    </div>
                    {isTestScenarioLoaded(data) && (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        color: '#34D399',
                        fontSize: 9.5,
                        fontWeight: 800,
                        padding: '3px 7px',
                        borderRadius: 6,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}>
                        ● Test Live
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: '1.45', marginBottom: 12 }}>
                    Inject a simulated 4-session stagnation scenario on <strong style={{ color: '#E5E7EB' }}>Barbell Bench Press (80kg × 8 reps)</strong> to test plateau badges, diagnostic pathways, deload adaptations, and 7-day expiration.
                  </div>

                  {testLabMsg && (
                    <div style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      marginBottom: 10,
                      fontSize: 11,
                      fontWeight: 600,
                      background: testLabStatus === 'cleared' ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.15)',
                      color: testLabStatus === 'cleared' ? '#F87171' : '#60A5FA',
                      border: `1px solid ${testLabStatus === 'cleared' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`
                    }}>
                      {testLabMsg}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        loadPlateauTestScenario();
                        setTestLabStatus('loaded');
                        setTestLabMsg('🚀 Scenario loaded! Launching workout session...');
                        setTimeout(() => {
                          if (onClose) onClose();
                        }, 750);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #FF9F0A 0%, #D97706 100%)',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: 12,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        boxShadow: '0 2px 8px rgba(255,159,10,0.25)'
                      }}
                    >
                      <span>⚡</span>
                      <span>{isTestScenarioLoaded(data) ? 'Reload Scenario & Open Workout' : 'Load Plateau Scenario & Open Workout'}</span>
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => {
                          fastForwardDeloadTest();
                          setTestLabStatus('fast-forwarded');
                          setTestLabMsg('⏩ Fast-forwarded to Day 8! Deload expired, normal overload targets resumed.');
                          setTimeout(() => setTestLabMsg(''), 4000);
                        }}
                        style={{
                          padding: '9px 10px',
                          borderRadius: 8,
                          background: 'rgba(59, 130, 246, 0.12)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#93C5FD',
                          fontWeight: 600,
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5
                        }}
                      >
                        <span>⏩</span>
                        <span>Fast-Forward (7d)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          clearPlateauTestScenario();
                          setTestLabStatus('cleared');
                          setTestLabMsg('🧹 Test scenario wiped. Real user data intact.');
                          setTimeout(() => {
                            setTestLabMsg('');
                            setTestLabStatus(null);
                          }, 3000);
                        }}
                        style={{
                          padding: '9px 10px',
                          borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#FCA5A5',
                          fontWeight: 600,
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5
                        }}
                      >
                        <span>🧹</span>
                        <span>Clear Test Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>NOTIFICATIONS & MOTIVATION</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: notificationsEnabled ? 12 : 0 }}>
                <div style={{ paddingRight: 16 }}>
                  <div style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 14 }}>Motivational Reminders</div>
                  <div style={{ color: '#8b90a0', fontSize: 12, marginTop: 4, lineHeight: '1.4' }}>
                    Receive daily motivational quotes on rest days and alerts when your 7-day streak is at risk.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const nextVal = !notificationsEnabled;
                    if (nextVal) {
                      const granted = await requestNotificationPermission();
                      if (!granted) {
                        setTestStatus('error');
                        setTestMessage('Please allow notification permission in your system settings.');
                        setTimeout(() => setTestStatus(null), 3500);
                        return;
                      }
                    }
                    updateSettings({ notificationsEnabled: nextVal });
                    syncTrainingNotifications(data.sessions, { ...settings, notificationsEnabled: nextVal });
                  }}
                  style={{
                    width: 48,
                    height: 28,
                    borderRadius: 14,
                    background: notificationsEnabled ? 'var(--primary, #007AFF)' : '#2c2d35',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      background: '#fff',
                      transform: notificationsEnabled ? 'translateX(20px)' : 'translateX(0px)',
                      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  />
                </button>
              </div>

              {notificationsEnabled && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
                    <div>
                      <span style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 13 }}>Reminder Time</span>
                      <div style={{ color: '#8b90a0', fontSize: 11 }}>Time of day for rest-day motivation</div>
                    </div>
                    <select
                      value={settings.reminderHour ?? 19}
                      onChange={e => {
                        const hr = Number(e.target.value);
                        updateSettings({ reminderHour: hr });
                        syncTrainingNotifications(data.sessions, { ...settings, reminderHour: hr });
                      }}
                      style={{ background: '#1C1C1E', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 13 }}
                    >
                      <option value={8}>8:00 AM</option>
                      <option value={12}>12:00 PM</option>
                      <option value={17}>5:00 PM</option>
                      <option value={18}>6:00 PM</option>
                      <option value={19}>7:00 PM</option>
                      <option value={20}>8:00 PM</option>
                      <option value={21}>9:00 PM</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      setTestStatus('sending');
                      const res = await sendTestNotification();
                      if (res.success) {
                        setTestStatus('sent');
                        setTestMessage('Test notification sent! Check your notification panel.');
                        setTimeout(() => {
                          setTestStatus(null);
                          setTestMessage('');
                        }, 4000);
                      } else {
                        setTestStatus('error');
                        setTestMessage(res.message || 'Notification permission required.');
                        setTimeout(() => {
                          setTestStatus(null);
                          setTestMessage('');
                        }, 4000);
                      }
                    }}
                    disabled={testStatus === 'sending'}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      color: testStatus === 'sent' ? '#4ADE80' : testStatus === 'error' ? '#FF5C5C' : '#e2e2e2',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: testStatus === 'sending' ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      marginTop: 14,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Bell size={16} color={testStatus === 'sent' ? '#4ADE80' : testStatus === 'error' ? '#FF5C5C' : 'currentColor'} />
                    {testStatus === 'sending' ? 'Sending...' : testStatus === 'sent' ? 'Notification Sent! 🔥' : testStatus === 'error' ? 'Permission Denied' : 'Send Test Notification'}
                  </button>

                  {testMessage && (
                    <div style={{ fontSize: 11, color: testStatus === 'error' ? '#FF5C5C' : '#4ADE80', marginTop: 6, textAlign: 'center' }}>
                      {testMessage}
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>{t('settings.sections.data')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={onExport} className="dashedBtn" style={{ marginTop: 0, padding: 12, background: 'rgba(255,255,255,0.05)', color: '#e2e2e2', border: 'none'  }}>
                <Download size={18} /> {t('settings.exportData')}
              </button>
              
              <label className="dashedBtn" style={{ marginTop: 0, padding: 12, background: 'rgba(255,255,255,0.05)', color: '#e2e2e2', border: 'none', cursor: 'pointer', textAlign: 'center'  }}>
                <Upload size={18} /> {t('settings.importData')}
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={onImport} />
              </label>

              <button 
                onClick={handleWipe} 
                disabled={wipeSuccess}
                className="dashedBtn" 
                style={{ 
                  marginTop: 0, 
                  padding: 12, 
                  background: wipeSuccess ? 'rgba(48, 209, 88, 0.15)' : wipeStep > 0 ? '#D94A4A' : 'rgba(217, 74, 74, 0.1)', 
                  color: wipeSuccess ? '#30D158' : wipeStep > 0 ? '#fff' : '#D94A4A', 
                  border: 'none', 
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontWeight: 800
                }}
              >
                <Trash2 size={18} /> 
                {wipeSuccess 
                  ? 'Factory Reset Complete!' 
                  : wipeStep === 0 
                    ? t('settings.wipeData') 
                    : wipeStep === 1 
                      ? t('settings.wipeDataConfirm1') 
                      : t('settings.wipeDataConfirm2')}
              </button>
            </div>

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginTop: 24, marginBottom: 16 }}>ACCOUNT</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ color: '#8b90a0', fontSize: 13, fontWeight: 500 }}>Logged in as</span>
                <span style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.email || userProfile?.name || 'Local User'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPw('');
                    setNewPw('');
                    setConfirmNewPw('');
                    setChangePwError('');
                    setChangePwSuccess('');
                    setShowChangePassword(true);
                  }}
                  className="dashedBtn"
                  style={{
                    marginTop: 0,
                    width: '100%',
                    padding: 12,
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#e2e2e2',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  <Lock size={16} /> Change Password
                </button>

                <button 
                  onClick={() => setShowLogoutConfirm(true)} 
                  className="dashedBtn" 
                  style={{ 
                    marginTop: 0, 
                    width: '100%',
                    padding: 12, 
                    background: 'rgba(217, 74, 74, 0.08)', 
                    color: '#FF5C5C', 
                    border: '1px solid rgba(217, 74, 74, 0.25)', 
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} color="#FF5C5C" /> Log Out
                </button>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div style={{ color: '#EF4444', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>DANGER ZONE</div>
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 16, padding: 16, marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>Delete Account</div>
              <div style={{ fontSize: 12, color: '#8B90A0', marginBottom: 14, lineHeight: '1.45' }}>
                Permanently erase your workout history, routines, measurements, and cloud account. This action cannot be reversed.
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeletePw('');
                  setDeleteError('');
                  setShowDeleteStep1(true);
                }}
                style={{
                  width: '100%',
                  padding: 12,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: 12,
                  color: '#FF5C5C',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} color="#FF5C5C" /> Delete Account
              </button>
            </div>
          </motion.div>

        {/* Change Password Modal */}
        <AnimatePresence>
          {showChangePassword && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowChangePassword(false)}
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1100
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'calc(100% - 40px)',
                  maxWidth: 380,
                  background: '#12141C',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 22,
                  padding: '24px 20px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  zIndex: 1200,
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>Change Password</h3>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    style={{ background: 'none', border: 'none', color: '#8B90A0', cursor: 'pointer', padding: 4 }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {changePwError && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 14,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5'
                  }}>
                    {changePwError}
                  </div>
                )}

                {changePwSuccess && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 14,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34D399',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Check size={16} /> {changePwSuccess}
                  </div>
                )}

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setChangePwError('');
                  setChangePwSuccess('');

                  if (!currentPw) {
                    setChangePwError('Please enter your current password.');
                    return;
                  }
                  if (newPw.length < 6) {
                    setChangePwError('New password must be at least 6 characters long.');
                    return;
                  }
                  if (newPw === currentPw) {
                    setChangePwError('New password must be different from your current password.');
                    return;
                  }
                  if (newPw !== confirmNewPw) {
                    setChangePwError('New passwords do not match.');
                    return;
                  }

                  setChangePwLoading(true);
                  try {
                    await changePassword(currentPw, newPw);
                    setChangePwSuccess('Password successfully updated!');
                    setTimeout(() => {
                      setShowChangePassword(false);
                    }, 1800);
                  } catch (err) {
                    const code = err.code || '';
                    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                      setChangePwError('Current password is incorrect.');
                    } else if (code === 'auth/weak-password') {
                      setChangePwError('New password is too weak. Please use numbers and letters.');
                    } else {
                      setChangePwError(err.message || 'Failed to update password.');
                    }
                  } finally {
                    setChangePwLoading(false);
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8B90A0', marginBottom: 4, textTransform: 'uppercase' }}>
                      Current Password
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        placeholder="Current password"
                        value={currentPw}
                        onChange={e => setCurrentPw(e.target.value)}
                        required
                        style={{
                          width: '100%', boxSizing: 'border-box', background: '#0D0E13',
                          border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 10,
                          padding: '11px 40px 11px 12px', color: '#fff', fontSize: 16, outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        style={{ position: 'absolute', right: 10, background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 4 }}
                      >
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8B90A0', marginBottom: 4, textTransform: 'uppercase' }}>
                      New Password (6+ chars)
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        placeholder="New strong password"
                        value={newPw}
                        onChange={e => setNewPw(e.target.value)}
                        required
                        style={{
                          width: '100%', boxSizing: 'border-box', background: '#0D0E13',
                          border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 10,
                          padding: '11px 40px 11px 12px', color: '#fff', fontSize: 16, outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        style={{ position: 'absolute', right: 10, background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 4 }}
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8B90A0', marginBottom: 4, textTransform: 'uppercase' }}>
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      value={confirmNewPw}
                      onChange={e => setConfirmNewPw(e.target.value)}
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box', background: '#0D0E13',
                        border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 10,
                        padding: '11px 12px', color: '#fff', fontSize: 16, outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changePwLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 12,
                      background: 'var(--primary, #007AFF)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: changePwLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      marginTop: 4
                    }}
                  >
                    {changePwLoading ? <Loader2 size={16} className="spin" /> : <Lock size={16} />}
                    {changePwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Account Step 1: Password Verification Modal */}
        <AnimatePresence>
          {showDeleteStep1 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteStep1(false)}
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1100
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'calc(100% - 40px)',
                  maxWidth: 380,
                  background: '#12141C',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 22,
                  padding: '24px 20px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                  zIndex: 1200,
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <ShieldAlert size={24} color="#EF4444" />
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>Verify Identity</h3>
                </div>

                <p style={{ fontSize: 13, color: '#8B90A0', lineHeight: '1.45', margin: '0 0 16px' }}>
                  To proceed with deleting your account, enter your current password to confirm your identity.
                </p>

                {deleteError && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 14,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5'
                  }}>
                    {deleteError}
                  </div>
                )}

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!deletePw) return;
                  setDeleteLoading(true);
                  setDeleteError('');
                  try {
                    // Test re-authentication with password
                    const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
                    const { auth } = await import('../config/firebase');
                    const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePw);
                    await reauthenticateWithCredential(auth.currentUser, credential);

                    // Identity verified! Open Step 2
                    setShowDeleteStep1(false);
                    setDeleteInputWord('');
                    setShowDeleteStep2(true);
                  } catch (err) {
                    console.warn('Re-auth error:', err);
                    setDeleteError('Incorrect password. Identity verification failed.');
                  } finally {
                    setDeleteLoading(false);
                  }
                }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showDeletePw ? 'text' : 'password'}
                      placeholder="Enter account password"
                      value={deletePw}
                      onChange={e => setDeletePw(e.target.value)}
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box', background: '#0D0E13',
                        border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 10,
                        padding: '11px 40px 11px 12px', color: '#fff', fontSize: 16, outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePw(!showDeletePw)}
                      style={{ position: 'absolute', right: 10, background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 4 }}
                    >
                      {showDeletePw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setShowDeleteStep1(false)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 12,
                        background: '#1C1C1E',
                        border: 'none',
                        color: '#8B90A0',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={deleteLoading || !deletePw}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 12,
                        background: '#EF4444',
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: deleteLoading || !deletePw ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      {deleteLoading ? <Loader2 size={16} className="spin" /> : null}
                      {deleteLoading ? 'Verifying...' : 'Next Step'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Account Step 2: Final Double Confirmation Modal */}
        <AnimatePresence>
          {showDeleteStep2 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteStep2(false)}
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1100
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'calc(100% - 40px)',
                  maxWidth: 380,
                  background: '#140D0E',
                  border: '1.5px solid #EF4444',
                  borderRadius: 22,
                  padding: '24px 20px',
                  boxShadow: '0 25px 60px rgba(239, 68, 68, 0.25)',
                  zIndex: 1200,
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <AlertTriangle size={24} color="#EF4444" />
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#FF5C5C' }}>
                    Final Warning
                  </h3>
                </div>

                <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: '1.5', margin: '0 0 12px' }}>
                  This will <strong style={{ color: '#EF4444' }}>permanently delete</strong> all your workouts, routines, measurements, and personal records. This action cannot be reversed.
                </p>

                <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 14px' }}>
                  To confirm permanent erasure, please type <strong style={{ color: '#FFFFFF', letterSpacing: '0.08em' }}>DELETE</strong> below:
                </p>

                {deleteError && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 12,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5'
                  }}>
                    {deleteError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="text"
                    placeholder="Type DELETE to confirm"
                    value={deleteInputWord}
                    onChange={e => setDeleteInputWord(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      background: '#0D0E13',
                      border: deleteInputWord === 'DELETE' ? '1.5px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 10,
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      outline: 'none',
                      textAlign: 'center'
                    }}
                  />

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setShowDeleteStep2(false)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 12,
                        background: '#1C1C1E',
                        border: 'none',
                        color: '#8B90A0',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={deleteInputWord !== 'DELETE' || deleteLoading}
                      onClick={async () => {
                        if (deleteInputWord !== 'DELETE') return;
                        setDeleteLoading(true);
                        setDeleteError('');
                        try {
                          await deleteAccount(deletePw);
                          persist({ exercises: [], templates: [], sessions: [], measurements: [], plannedSessions: [], user: {}, settings: {} });
                          setShowDeleteStep2(false);
                          onClose();
                        } catch (err) {
                          console.error('Account deletion failure:', err);
                          setDeleteError(err.message || 'Failed to delete account. Please try again.');
                          setDeleteLoading(false);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 12,
                        background: deleteInputWord === 'DELETE' ? '#DC2626' : '#27272A',
                        border: 'none',
                        color: deleteInputWord === 'DELETE' ? '#FFFFFF' : '#71717A',
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: deleteInputWord === 'DELETE' && !deleteLoading ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      {deleteLoading ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                      {deleteLoading ? 'Erasing...' : 'Delete Forever'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={async () => {
            try {
              await logout();
            } catch (err) {
              console.error('Logout error:', err);
            }
            setShowLogoutConfirm(false);
            onClose();
          }}
          title="Log Out"
          message="Are you sure you want to log out of your OmniLog account?"
          confirmText="Log Out"
          cancelText="Cancel"
          isDestructive={true}
        />
      </>
    </AnimatePresence>
  );
}
