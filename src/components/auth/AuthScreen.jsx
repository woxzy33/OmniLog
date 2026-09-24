import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { styles } from '../../styles'; // We will use some existing styles if possible or inline

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ ...styles.loadingWrap, flexDirection: 'column', padding: 24 }}>
      <div style={{ ...styles.headerTitle, fontSize: 32, marginBottom: 8 }}>OMNILOG</div>
      <div style={{ ...styles.headerSub, marginBottom: 48 }}>cloud sync enabled</div>

      <div style={{ ...styles.exCard, width: '100%', maxWidth: 320 }}>
        <h2 style={{ color: '#F5F3EE', marginTop: 0, marginBottom: 16 }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        {error && <div style={{ color: '#E8622C', fontSize: 12, marginBottom: 12 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ ...styles.setInput, width: '100%', padding: '12px' }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...styles.setInput, width: '100%', padding: '12px' }}
            required
          />
          
          <button type="submit" style={{ ...styles.bigCta, marginTop: 8 }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ ...styles.miniBtn, width: '100%', justifyContent: 'center', marginTop: 16, border: 'none' }}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
}
