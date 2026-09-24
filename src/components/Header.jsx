import React from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { Settings } from './Icons';

export default function Header({ onOpenSettings }) {
  const { t } = useTranslation();
  return (
    <div className="header" style={{ justifyContent: 'space-between'  }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="headerTitle" style={{ display: 'flex', alignItems: 'center', gap: 8  }}>
          <div>{t('app.headerTitle')}<span style={{ color: 'var(--primary)' }}>{t('app.headerSub')}</span></div>
          <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--beta-color)', background: 'var(--beta-bg)', border: '1px solid var(--beta-border)', padding: '2px 6px', borderRadius: 6, letterSpacing: '0.05em', transform: 'translateY(-2px)' }}>BETA</div>
        </div>
      </div>
      <button onClick={onOpenSettings} style={{ background: 'none', border: 'none', color: '#8b90a0', cursor: 'pointer' }}>
        <Settings size={24} />
      </button>
    </div>
  );
}
