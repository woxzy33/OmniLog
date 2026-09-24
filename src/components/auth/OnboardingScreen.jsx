import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { saveUserProfile } from '../../store/Database';
import { styles } from '../../styles';
import WheelPicker from '../ui/WheelPicker';

const weights = Array.from({ length: 150 }, (_, i) => i + 40); // 40kg to 189kg
const heights = Array.from({ length: 100 }, (_, i) => i + 120); // 120cm to 219cm

const MAX_USERNAME_LENGTH = 18;

export default function OnboardingScreen() {
  const { currentUser, setUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [gender, setGender] = useState('Prefer not to say');
  const [loading, setLoading] = useState(false);

  const isTooLong = name.trim().length > MAX_USERNAME_LENGTH;

  const handleComplete = async () => {
    if (!name.trim() || isTooLong) return;
    setLoading(true);
    
    const profile = {
      name: name.trim(),
      weight,
      height,
      gender,
      createdAt: new Date().toISOString()
    };

    try {
      await saveUserProfile(currentUser.uid, profile);
      setUserProfile(profile);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.loadingWrap, flexDirection: 'column', padding: 24 }}>
      <div style={{ ...styles.headerTitle, fontSize: 24, marginBottom: 8 }}>Setup Profile</div>
      <div style={{ ...styles.headerSub, marginBottom: 32, textAlign: 'center' }}>
        Let's personalize your OmniLog experience.<br/>Weight is required to calculate relative strength.
      </div>

      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: isTooLong ? '#D94A4A' : '#8B8680', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              {isTooLong && <span style={{ background: '#D94A4A', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>!</span>}
              NAME (REQUIRED)
            </span>
            <span style={{ fontSize: 11, color: isTooLong ? '#D94A4A' : '#6b7080', fontWeight: 600 }}>
              {name.trim().length}/{MAX_USERNAME_LENGTH}
            </span>
          </div>
          <input 
            type="text" 
            placeholder="Athlete Name" 
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ 
              ...styles.sessionNameInput, 
              borderBottom: isTooLong ? '2px solid #D94A4A' : '1px solid #3A3730', 
              paddingBottom: 8,
              color: isTooLong ? '#D94A4A' : '#e2e2e2'
            }}
          />
          {isTooLong && (
            <div style={{ color: '#D94A4A', fontSize: 12, fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>! Username cannot exceed {MAX_USERNAME_LENGTH} characters.</span>
            </div>
          )}
        </div>

        <div>
          <span style={{ fontSize: 12, color: '#8B8680', marginBottom: 8, display: 'block', fontWeight: 700 }}>GENDER</span>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #3A3730', paddingBottom: 8, color: '#e2e2e2', fontSize: 16, outline: 'none' }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', background: '#1C1A17', borderRadius: 16, padding: '8px 0' }}>
          <WheelPicker 
            items={weights} 
            value={weight} 
            onChange={setWeight} 
            label="Weight (kg)"
          />
          <div style={{ width: 1, background: '#2A2722', margin: '16px 0' }} />
          <WheelPicker 
            items={heights} 
            value={height} 
            onChange={setHeight} 
            label="Height (cm)"
          />
        </div>

        <button 
          onClick={handleComplete} 
          disabled={!name.trim() || loading || isTooLong}
          style={{ ...styles.finishBtn, opacity: (name.trim() && !isTooLong) ? 1 : 0.5 }}
        >
          {loading ? 'Saving...' : 'Complete Setup'}
        </button>

      </div>
    </div>
  );
}
