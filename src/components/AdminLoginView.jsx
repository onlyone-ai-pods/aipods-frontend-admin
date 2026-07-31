import React, { useState } from 'react';

/**
 * AdminLoginView — Componente de Inicio de Sesión y Desafío 2FA para Administradores (SPEC-CORE-38 / Issue #19).
 */
export default function AdminLoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin.consultant@acmecorp.com');
  const [password, setPassword] = useState('AdminPods2026!');
  const [step, setStep] = useState(1); // 1: Credenciales, 2: 2FA TOTP
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setErrorMessage('');
      setStep(2); // Avanzar a desafío 2FA TOTP
    } else {
      setErrorMessage('Por favor ingrese su email y contraseña de administrador.');
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      const adminSession = {
        email: email,
        role: 'Senior Consultant Reviewer',
        token: `jwt_admin_${Math.random().toString(36).substring(2, 10)}`,
        loginAt: new Date().toISOString()
      };
      sessionStorage.setItem('aipods_admin_session', JSON.stringify(adminSession));
      onLoginSuccess(adminSession);
    } else {
      setErrorMessage('Ingrese un código OTP válido de 6 dígitos.');
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

        {/* Paso 1: Ingreso de Credenciales */}
        {step === 1 && (
          <form onSubmit={handleCredentialsSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>Correo Electrónico Administrador</label>
              <input
                type="email"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(90deg, #00f2fe, #4facfe)', border: 'none', borderRadius: '10px', color: '#090d16', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' }}
            >
              🔐 Continuar a Validación 2FA
            </button>
          </form>
        )}

        {/* Paso 2: Desafío 2FA TOTP */}
        {step === 2 && (
          <form onSubmit={handleOTPSubmit}>
            <div style={{ background: 'rgba(0, 242, 254, 0.06)', border: '1px solid rgba(0, 242, 254, 0.15)', padding: '14px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: '700', marginBottom: '4px' }}>
                📲 Desafío 2FA Authenticator Requerido
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Ingrese el código de 6 dígitos generado por Google Authenticator / Authy para {email}.
              </div>
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>Código TOTP (6 dígitos)</label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                style={{ width: '180px', textAlign: 'center', padding: '12px', background: '#0f172a', border: '1px solid #00f2fe', borderRadius: '10px', color: '#00f2fe', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ width: '35%', padding: '12px', background: '#334155', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
              >
                Volver
              </button>
              <button
                type="submit"
                style={{ width: '65%', padding: '12px', background: 'linear-gradient(90deg, #10b981, #00f2fe)', border: 'none', borderRadius: '10px', color: '#090d16', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' }}
              >
                ✅ Iniciar Sesión Admin
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
          Be OnlyOne AI Pods SaaS Platform • ISO 27001 Certified
        </div>
      </div>
    </div>
  );
}
