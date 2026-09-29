import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, AlertTriangle, Check, X, ChevronRight, Loader2 } from '../Icons';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

function getStoredRateLimit() {
  try {
    const raw = localStorage.getItem('omnilog_auth_attempts');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse rate limit:', e);
  }
  return { failedAttempts: 0, lockedUntil: 0 };
}

function saveRateLimit(data) {
  try {
    localStorage.setItem('omnilog_auth_attempts', JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save rate limit:', e);
  }
}

function clearRateLimit() {
  try {
    localStorage.removeItem('omnilog_auth_attempts');
  } catch (e) {}
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailExistsSuggestion, setEmailExistsSuggestion] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Rate Limiter / Lockout state
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const { login, register, resetPassword, continueAsGuest } = useAuth();

  // Check rate limit timer on mount and interval
  useEffect(() => {
    const checkLockout = () => {
      const { lockedUntil } = getStoredRateLimit();
      const diff = lockedUntil - Date.now();
      if (diff > 0) {
        setSecondsRemaining(Math.ceil(diff / 1000));
      } else {
        setSecondsRemaining(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Password Strength Calculation (for registration)
  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 9) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0 to 4
  }, [password]);

  // Translate Firebase errors into polished human explanations
  const parseAuthError = (err, isLoginAttempt) => {
    const code = err.code || '';
    const message = err.message || '';

    if (code === 'auth/email-already-in-use') {
      setEmailExistsSuggestion(true);
      return 'An account with this email address already exists in OmniLog.';
    }
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Incorrect email or password. Please verify your credentials or reset your password.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address (e.g. athlete@omnilog.app).';
    }
    if (code === 'auth/weak-password') {
      return 'Password is too weak. Please use at least 6 characters with a combination of letters and numbers.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Access temporarily throttled due to multiple attempts. Please try again shortly or reset your password.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection error. Please check your internet connection.';
    }
    return message.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, '').trim() || 'Authentication failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (secondsRemaining > 0) return;

    setErrorMessage('');
    setEmailExistsSuggestion(false);

    // Basic Validation
    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all required credentials.');
      return;
    }

    if (!isLogin) {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter your password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email.trim(), password);
        clearRateLimit();
      } else {
        await register(email.trim(), password);
        clearRateLimit();
      }
    } catch (err) {
      console.warn('Auth Error:', err);
      const friendly = parseAuthError(err, isLogin);

      if (isLogin) {
        // Record failed attempt for rate limiting
        const current = getStoredRateLimit();
        const nextAttempts = (current.failedAttempts || 0) + 1;
        if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION_MS;
          saveRateLimit({ failedAttempts: 0, lockedUntil: lockTime });
          setSecondsRemaining(Math.ceil(LOCKOUT_DURATION_MS / 1000));
          setErrorMessage(`Too many failed attempts. Login locked for 60 seconds to protect your account.`);
        } else {
          saveRateLimit({ failedAttempts: nextAttempts, lockedUntil: 0 });
          const remainingAttempts = MAX_FAILED_ATTEMPTS - nextAttempts;
          setErrorMessage(`${friendly} (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before lockout)`);
        }
      } else {
        setErrorMessage(friendly);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLoginWithEmail = () => {
    setIsLogin(true);
    setEmailExistsSuggestion(false);
    setErrorMessage('');
    setPassword('');
  };

  const handleSendResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotMessage({ type: 'error', text: 'Please enter your account email.' });
      return;
    }

    setForgotLoading(true);
    setForgotMessage(null);

    try {
      await resetPassword(forgotEmail.trim());
      setForgotMessage({
        type: 'success',
        text: `Password reset link sent! Check your inbox (and spam folder) for ${forgotEmail.trim()}.`
      });
    } catch (err) {
      const code = err.code || '';
      let text = 'Failed to send reset link. Please check the email and try again.';
      if (code === 'auth/user-not-found') {
        text = 'No OmniLog account found with this email.';
      } else if (code === 'auth/invalid-email') {
        text = 'Please enter a valid email address.';
      }
      setForgotMessage({ type: 'error', text });
    } finally {
      setForgotLoading(false);
    }
  };

  const isLocked = secondsRemaining > 0;

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      background: 'radial-gradient(circle at 50% 18%, #141721 0%, #08090C 80%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px calc(24px + env(safe-area-inset-bottom))',
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden',
      color: '#e2e2e2'
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: 'rgba(0, 122, 255, 0.14)',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      {/* Hero Header & Brand Insignia */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28, zIndex: 1 }}
      >
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #1C2130 0%, #0E1017 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0, 122, 255, 0.25), inset 0 1px 1px rgba(255,255,255,0.2)',
          marginBottom: 14
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary, #007AFF)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.4 14.4l-4.8-4.8" />
            <path d="M6.9 11.2l-2.4 2.4a2.12 2.12 0 0 0 0 3l2.8 2.8a2.12 2.12 0 0 0 3 0l2.4-2.4" />
            <path d="M12.8 17.1l-2.4 2.4" />
            <path d="M11.2 6.9l2.4-2.4a2.12 2.12 0 0 1 3 0l2.8 2.8a2.12 2.12 0 0 1 0 3l-2.4 2.4" />
            <path d="M17.1 12.8l2.4-2.4" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: "'Anton', 'Outfit', sans-serif",
          fontSize: 36,
          letterSpacing: '0.06em',
          margin: 0,
          background: 'linear-gradient(180deg, #FFFFFF 15%, #9CA3AF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase'
        }}>
          OMNILOG
        </h1>
        <div style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: 'var(--primary, #007AFF)',
          textTransform: 'uppercase',
          marginTop: 4
        }}>
          FORGE YOUR PHYSIQUE
        </div>
      </motion.div>

      {/* Main Auth Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'rgba(18, 20, 28, 0.78)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          padding: '24px 22px',
          boxSizing: 'border-box',
          zIndex: 1
        }}
      >
        {/* Segmented Tab Pill */}
        <div style={{
          display: 'flex',
          background: '#0D0E13',
          borderRadius: 14,
          padding: 4,
          marginBottom: 20,
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMessage('');
              setEmailExistsSuggestion(false);
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 10,
              border: 'none',
              background: isLogin ? 'var(--primary, #007AFF)' : 'transparent',
              color: isLogin ? '#FFFFFF' : '#8B90A0',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isLogin ? '0 2px 10px rgba(0, 122, 255, 0.4)' : 'none'
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMessage('');
              setEmailExistsSuggestion(false);
            }}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 10,
              border: 'none',
              background: !isLogin ? 'var(--primary, #007AFF)' : 'transparent',
              color: !isLogin ? '#FFFFFF' : '#8B90A0',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: !isLogin ? '0 2px 10px rgba(0, 122, 255, 0.4)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {/* Lockout Banner */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.14)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 14,
              padding: '12px 14px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <ShieldAlert size={22} color="#EF4444" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#EF4444', fontWeight: 800, fontSize: 13 }}>
                Security Lockout Active
              </div>
              <div style={{ color: '#FCA5A5', fontSize: 12, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                Too many failed attempts. Try again in {secondsRemaining}s
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {errorMessage && !isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 12,
              padding: '10px 12px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8
            }}
          >
            <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ color: '#FCA5A5', fontSize: 12, lineHeight: '1.45', fontWeight: 600 }}>
              {errorMessage}
            </div>
          </motion.div>
        )}

        {/* Email Already Registered Suggestion Card */}
        {emailExistsSuggestion && !isLogin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(0, 122, 255, 0.12)',
              border: '1px solid rgba(0, 122, 255, 0.3)',
              borderRadius: 14,
              padding: '14px',
              marginBottom: 16,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
              Account Already Exists
            </div>
            <div style={{ fontSize: 12, color: '#A0AEC0', marginBottom: 10 }}>
              We found an account with this email. Would you like to log in instead?
            </div>
            <button
              type="button"
              onClick={handleSwitchToLoginWithEmail}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                background: 'var(--primary, #007AFF)',
                border: 'none',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              Switch to Login with this Email <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Email Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 800,
              color: '#8B90A0',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 6
            }}>
              Email Address
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ position: 'absolute', left: 14, color: '#6B7280', pointerEvents: 'none' }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="athlete@omnilog.app"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLocked || loading}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#0D0E13',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: '12px 14px 12px 42px',
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'border 0.2s, box-shadow 0.2s'
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#8B90A0',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotMessage(null);
                    setShowForgotModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary, #007AFF)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ position: 'absolute', left: 14, color: '#6B7280', pointerEvents: 'none' }}>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? 'Enter password' : 'Create strong password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLocked || loading}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#0D0E13',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: '12px 42px 12px 42px',
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'border 0.2s, box-shadow 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator on Register */}
            {!isLogin && password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, height: 4, marginBottom: 4 }}>
                  <div style={{
                    flex: 1,
                    borderRadius: 2,
                    background: passwordStrength >= 1 ? (passwordStrength === 1 ? '#EF4444' : passwordStrength === 2 ? '#F59E0B' : '#10B981') : '#27272A'
                  }} />
                  <div style={{
                    flex: 1,
                    borderRadius: 2,
                    background: passwordStrength >= 2 ? (passwordStrength === 2 ? '#F59E0B' : '#10B981') : '#27272A'
                  }} />
                  <div style={{
                    flex: 1,
                    borderRadius: 2,
                    background: passwordStrength >= 3 ? '#10B981' : '#27272A'
                  }} />
                  <div style={{
                    flex: 1,
                    borderRadius: 2,
                    background: passwordStrength >= 4 ? '#059669' : '#27272A'
                  }} />
                </div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: passwordStrength <= 1 ? '#EF4444' : passwordStrength === 2 ? '#F59E0B' : '#10B981',
                  textAlign: 'right'
                }}>
                  {passwordStrength <= 1 ? 'Weak (Needs 6+ characters)' : passwordStrength === 2 ? 'Fair' : passwordStrength === 3 ? 'Good' : 'Ironclad 🔒'}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Register Only) */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 800,
                color: '#8B90A0',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 6
              }}>
                Confirm Password
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ position: 'absolute', left: 14, color: '#6B7280', pointerEvents: 'none' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isLocked || loading}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#0D0E13',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    padding: '12px 14px 12px 42px',
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>
              {confirmPassword && (
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  marginTop: 4,
                  color: password === confirmPassword ? '#10B981' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  {password === confirmPassword ? <Check size={12} /> : <X size={12} />}
                  {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </motion.div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLocked || loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              background: isLocked 
                ? '#27272A' 
                : 'linear-gradient(135deg, var(--primary, #007AFF) 0%, var(--primary-light, #00C6FF) 100%)',
              color: isLocked ? '#71717A' : '#FFFFFF',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: isLocked || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 6,
              boxShadow: isLocked ? 'none' : '0 4px 20px rgba(0, 122, 255, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Processing...</span>
              </>
            ) : isLocked ? (
              <span>Locked ({secondsRemaining}s)</span>
            ) : (
              <span>{isLogin ? 'Enter OmniLog' : 'Create Account'}</span>
            )}
          </button>

          {/* Offline / Demo Lifter Bypass */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '18px 0 10px',
            gap: 12
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              OR
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          <button
            type="button"
            onClick={continueAsGuest}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#E2E8F0',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s'
            }}
          >
            <span>⚡ Continue as Guest (Offline Mode)</span>
          </button>
        </form>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                zIndex: 900
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
                maxWidth: 360,
                background: '#12141C',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 22,
                padding: '24px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                zIndex: 1000,
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>Reset Password</h3>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{ background: 'none', border: 'none', color: '#8B90A0', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: 13, color: '#8B90A0', lineHeight: '1.45', margin: '0 0 16px' }}>
                Enter your registered email and we'll dispatch an official recovery link to reset your password.
              </p>

              {forgotMessage && (
                <div style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 14,
                  background: forgotMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${forgotMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  color: forgotMessage.type === 'success' ? '#34D399' : '#FCA5A5'
                }}>
                  {forgotMessage.text}
                </div>
              )}

              <form onSubmit={handleSendResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="email"
                  placeholder="athlete@omnilog.app"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#0D0E13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    color: '#FFFFFF',
                    fontSize: 16,
                    outline: 'none'
                  }}
                />

                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: 'var(--primary, #007AFF)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: forgotLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  {forgotLoading ? 'Sending link...' : 'Send Recovery Link'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
