import React from 'react';
import { AlertTriangle, RefreshCw } from './Icons';

export class FatalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Fatal Error Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center', color: '#e2e2e2' }}>
          <AlertTriangle size={48} color="#E81123" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Critical Component Failure</h2>
          <p style={{ color: '#8b90a0', fontSize: 14, marginBottom: 24 }}>
            A core system component crashed. Your workout data is safe.
          </p>
          {this.state.error && (
            <div style={{ background: '#1C1C1E', padding: 16, borderRadius: 8, marginBottom: 24, color: '#e2e2e2', fontFamily: 'monospace', fontSize: 12, overflowX: 'auto', textAlign: 'left', maxWidth: '100%' }}>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          >
            <RefreshCw size={18} /> Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Widget Error Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, border: '1px dashed #E81123', borderRadius: 12, background: 'rgba(232, 17, 35, 0.1)', color: '#E81123', textAlign: 'center', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={24} />
          <span style={{ fontWeight: 800 }}>Widget Failed to Load</span>
          {this.state.error && (
            <div style={{ color: '#fff', fontSize: 11, fontFamily: 'monospace', textAlign: 'left', wordBreak: 'break-all', background: '#1c1c1e', padding: 10, borderRadius: 8, maxWidth: '100%', overflowX: 'auto' }}>
              {this.state.error.toString()}
            </div>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{ marginTop: 8, background: '#E81123', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
