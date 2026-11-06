import React, { useState } from 'react';
import { login, logout, hasRole } from '../services/session.js';

/**
 * AdminLoginView — Ingreso al portal admin contra el core (SPEC-CORE-67.R10).
 * Solo entran usuarios con rol platform_admin o auditor. El token queda en
 * memoria (services/session.js). El segundo factor (TOTP) queda para otra spec.
 */
export default function AdminLoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      if (!hasRole('platform_admin', 'auditor')) {
        logout();
        setErrorMessage('Tu usuario no tiene acceso al portal admin.');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #0f172a 0%, #090d16 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: '#f8fafc' }}>
      <div style={{ background: 'rgba(22, 28, 46, 0.95)', border: '1px solid rgba(0, 242, 254, 0.25)', borderRadius: '20px', padding: '36px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🛡️</div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#00f2fe', fontWeight: '800' }}>Be OnlyOne Admin Hub</h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Portal de Control & Revisión Senior Consultant (SPEC-CORE-38)
          </p>
        </div>

        {errorMessage && (
          <div style={{ background: 'rgba(248, 113, 113, 0.15)', border: '1px solid rgba(248, 113, 113, 0.3)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '20px', textAlign: 'center' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>Correo Electrónico Administrador</label>
            <input
              type="email"
              autoComplete="username"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@empresa.com"
              style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>Contraseña de Acceso</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #00f2fe, #4facfe)', border: 'none', borderRadius: '10px', color: '#090d16', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' }}
          >
            {loading ? 'Ingresando…' : '🔐 Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
          Be OnlyOne AI Pods SaaS Platform • ISO 27001 Certified
        </div>
      </div>
    </div>
  );
}
