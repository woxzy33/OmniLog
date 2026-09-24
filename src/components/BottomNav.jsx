import React from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from '../styles';
import { Dumbbell, History, User } from './Icons';

export default function BottomNav({ tab, setTab, hasActive }) {
  const { t } = useTranslation();
  const items = [
    { id: "train", label: t('nav.train'), icon: Dumbbell },
    { id: "history", label: t('nav.history'), icon: History },
    { id: "profile", label: t('nav.profile'), icon: User },
  ];
  return (
    <div className="nav">
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="navBtn" style={{ color: active ? "var(--primary)" : "#8b90a0"  }}
          >
            <div style={{ position: "relative" }}>
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {it.id === "train" && hasActive && <span className="navDot" />}
            </div>
            <span style={{ fontSize: 11, marginTop: 3 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
