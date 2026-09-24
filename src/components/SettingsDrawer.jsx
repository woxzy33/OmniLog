import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Download, Upload, Trash2, LogOut } from './Icons';
import { useAppStore } from '../store';
import { useAuth } from '../store/AuthContext';
import { saveUserProfile } from '../store/Database';
import { ConfirmModal } from './WorkoutSafeguards';

export default function SettingsDrawer({ onClose, onExport, onImport }) {
  const { data, persist } = useAppStore();
  const { currentUser, userProfile, setUserProfile, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const settings = data?.settings || { unit: 'kg' };
  
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
  
  const wipeData = () => {
    persist({ ...data, sessions: [], templates: [] });
  };

  const { t, i18n } = useTranslation();
  const [wipeStep, setWipeStep] = React.useState(0);

  const handleWipe = () => {
    if (wipeStep === 0) setWipeStep(1);
    else if (wipeStep === 1) setWipeStep(2);
    else {
      wipeData();
      setWipeStep(0);
      onClose();
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
              zIndex: 1000, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column'
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

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>{t('settings.sections.data')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={onExport} className="dashedBtn" style={{ marginTop: 0, padding: 12, background: 'rgba(255,255,255,0.05)', color: '#e2e2e2', border: 'none'  }}>
                <Download size={18} /> {t('settings.exportData')}
              </button>
              
              <label className="dashedBtn" style={{ marginTop: 0, padding: 12, background: 'rgba(255,255,255,0.05)', color: '#e2e2e2', border: 'none', cursor: 'pointer', textAlign: 'center'  }}>
                <Upload size={18} /> {t('settings.importData')}
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={onImport} />
              </label>

              <button onClick={handleWipe} className="dashedBtn" style={{ marginTop: 0, padding: 12, background: wipeStep > 0 ? '#D94A4A' : 'rgba(217, 74, 74, 0.1)', color: wipeStep > 0 ? '#fff' : '#D94A4A', border: 'none', transition: 'all 0.2s'  }}>
                <Trash2 size={18} /> 
                {wipeStep === 0 ? t('settings.wipeData') : wipeStep === 1 ? t('settings.wipeDataConfirm1') : t('settings.wipeDataConfirm2')}
              </button>
            </div>

            <div style={{ color: '#6b7080', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginTop: 24, marginBottom: 16 }}>ACCOUNT</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ color: '#8b90a0', fontSize: 13, fontWeight: 500 }}>Logged in as</span>
                <span style={{ color: '#e2e2e2', fontWeight: 600, fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.email || userProfile?.name || 'Local User'}
                </span>
              </div>
              <button 
                onClick={() => setShowLogoutConfirm(true)} 
                className="dashedBtn" 
                style={{ 
                  marginTop: 4, 
                  width: '100%',
                  padding: 12, 
                  background: 'rgba(217, 74, 74, 0.12)', 
                  color: '#FF5C5C', 
                  border: '1px solid rgba(217, 74, 74, 0.3)', 
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <LogOut size={18} color="#FF5C5C" />
                Log Out
              </button>
            </div>
          </motion.div>

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
