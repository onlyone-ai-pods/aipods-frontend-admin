import React, { useState } from 'react';
import { changePassword } from '../services/session.js';

/**
 * ChangePasswordModal — Cambio de la contraseña propia (SPEC-CORE-67.R11).
 */
export default function ChangePasswordModal({ onClose }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (next.length < 12) return setError('La contraseña nueva tiene que tener al menos 12 caracteres.');
    if (next !== confirm) return setError('Las contraseñas nuevas no coinciden.');
    setSaving(true);
    try {
      await changePassword(current, next);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const input = { width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box', marginBottom: '12px' };
  const label = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' };

  return (
    <div role="dialog" aria-modal="true" aria-label="Cambiar contraseña" onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}
        style={{ background: 'rgba(22, 28, 46, 0.98)', border: '1px solid rgba(0, 242, 254, 0.25)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '400px', color: '#f8fafc' }}>
        <h3 style={{ margin: '0 0 16px' }}>🔑 Cambiar contraseña</h3>
        {done ? (
          <>
            <p style={{ color: '#34d399' }}>Listo, la contraseña quedó cambiada.</p>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Cerrar</button>
          </>
        ) : (
          <>
            {error && <div role="alert" style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '12px' }}>⚠️ {error}</div>}
            <label style={label} htmlFor="cp-current">Contraseña actual</label>
            <input id="cp-current" type="password" required autoFocus autoComplete="current-password" style={input} value={current} onChange={(e) => setCurrent(e.target.value)} />
            <label style={label} htmlFor="cp-new">Contraseña nueva (mín. 12)</label>
            <input id="cp-new" type="password" required autoComplete="new-password" style={input} value={next} onChange={(e) => setNext(e.target.value)} />
            <label style={label} htmlFor="cp-confirm">Repetir contraseña nueva</label>
            <input id="cp-confirm" type="password" required autoComplete="new-password" style={input} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Cancelar</button>
              <button type="submit" disabled={saving} style={{ flex: 2, padding: '10px', background: 'linear-gradient(90deg, #00f2fe, #4facfe)', color: '#090d16', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
