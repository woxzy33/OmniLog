import './i18n';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { KeypadProvider } from './components/NumericKeypad';

import { AuthProvider } from './store/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <KeypadProvider>
        <App />
      </KeypadProvider>
    </AuthProvider>
  </React.StrictMode>,
);
