import './i18n';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { KeypadProvider } from './components/NumericKeypad';
import { AuthProvider } from './store/AuthContext';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

import { useAppStore, useWorkoutStore } from './store';
import * as plateauTestLab from './services/PlateauTestLab';

if (typeof window !== 'undefined') {
  window.useAppStore = useAppStore;
  window.useWorkoutStore = useWorkoutStore;
  window.plateauTestLab = plateauTestLab;
}

// Configure Android/iOS status bar for native runtime
if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#090A0C' }).catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <KeypadProvider>
        <App />
      </KeypadProvider>
    </AuthProvider>
  </React.StrictMode>,
);
