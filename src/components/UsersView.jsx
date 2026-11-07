import React, { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch, getSession, hasRole } from '../services/session.js';

/**
 * UsersView — Alta, listado, activación y reseteo de contraseña de usuarios
 * contra el core (SPEC-CORE-67.R12-R13). Solo platform_admin modifica;
 * auditor ve el listado en modo lectura.
 */
const ROLES = [
  { id: 'customer', label: 'Cliente' },
  { id: 'tenant_admin', label: 'Admin del tenant' },
  { id: 'auditor', label: 'Auditor' },
  { id: 'platform_admin', label: 'Admin de plataforma' },
];

const card = { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' };
const input = { width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', boxSizing: 'border-box' };
const label = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' };
const btn = (bg, fg = '#fff') => ({ padding: '6px 12px', background: bg, color: fg, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' });
const emptyForm = { tenant_id: '', tenant_name: '', email: '', password: '', roles: ['customer'] };

async function readError(res, fallback) {
  const data = await res.json().catch(() => ({}));
  return data.error || fallback;
}

export default function UsersView({ activeTenant }) {
  const session = getSession();
  const canEdit = hasRole('platform_admin');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [resetFor, setResetFor] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const noticeTimer = useRef(null);

  const load = useCallback(async () => {
    if (!session) return;
    const q = activeTenant && activeTenant !== 'GLOBAL' ? `?tenant_id=${encodeURIComponent(activeTenant)}` : '';
    const res = await apiFetch(`/api/v1/admin/users${q}`);
    if (!res.ok) {
      setError(await readError(res, 'No se pudo cargar la lista de usuarios.'));
      return;
    }
    const data = await res.json();
    setUsers(data.users || []);
    setError('');
  }, [activeTenant, session]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (activeTenant && activeTenant !== 'GLOBAL') setForm((f) => ({ ...f, tenant_id: activeTenant }));
  }, [activeTenant]);

  if (!session) {
    return (
      <div style={card}>
        <h3 style={{ marginTop: 0 }}>👥 Usuarios</h3>
        <p style={{ color: 'var(--text-muted)' }}>La gestión de usuarios necesita que el core corra con login (AUTH_MODE=enforce).</p>
      </div>
    );
  }

  const flash = (msg) => {
    clearTimeout(noticeTimer.current);
    setNotice(msg);
    noticeTimer.current = setTimeout(() => setNotice(''), 4000);
  };

  const toggleRole = (role) => {
    setForm((f) => ({ ...f, roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role] }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 12) return setError('La contraseña inicial tiene que tener al menos 12 caracteres.');
    if (form.roles.length === 0) return setError('Elegí al menos un rol.');
    const res = await apiFetch('/api/v1/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tenant_id: form.tenant_id.trim(), email: form.email.trim() }),
    });
    if (!res.ok) return setError(await readError(res, 'No se pudo crear el usuario.'));
    flash(`Usuario ${form.email.trim()} creado. Pasale la contraseña inicial por un canal seguro.`);
    setForm({ ...emptyForm, tenant_id: form.tenant_id });
    load();
  };

  const handleToggleActive = async (u) => {
    setError('');
    const res = await apiFetch(`/api/v1/admin/users/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !u.active }),
    });
    if (!res.ok) return setError(await readError(res, 'No se pudo actualizar el usuario.'));
    flash(`${u.email} ${u.active ? 'desactivado: ya no puede entrar y sus sesiones abiertas se cortan' : 'activado'}.`);
    load();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (resetPassword.length < 12) return setError('La contraseña nueva tiene que tener al menos 12 caracteres.');
    const res = await apiFetch(`/api/v1/admin/users/${resetFor.id}/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_password: resetPassword }),
    });
    if (!res.ok) return setError(await readError(res, 'No se pudo cambiar la contraseña.'));
    flash(`Contraseña de ${resetFor.email} cambiada.`);
    setResetFor(null);
    setResetPassword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ margin: 0 }}>👥 Usuarios</h2>
        <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Cuentas que pueden entrar a los portales. {canEdit ? '' : 'Tu rol solo permite ver el listado.'}
        </p>
      </div>

      {error && (
        <div role="alert" style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      {notice && (
        <div role="status" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#34d399', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
          {notice}
        </div>
      )}

      {canEdit && (
        <form onSubmit={handleCreate} style={card}>
          <h3 style={{ margin: '0 0 14px', fontSize: '1rem' }}>Nuevo usuario</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={label} htmlFor="nu-tenant">Tenant (ID)</label>
              <input id="nu-tenant" required style={input} value={form.tenant_id} placeholder="tenant_acme" onChange={(e) => setForm({ ...form, tenant_id: e.target.value })} />
            </div>
            <div>
              <label style={label} htmlFor="nu-tenant-name">Nombre del tenant (si es nuevo)</label>
              <input id="nu-tenant-name" style={input} value={form.tenant_name} placeholder="Acme S.A." onChange={(e) => setForm({ ...form, tenant_name: e.target.value })} />
            </div>
            <div>
              <label style={label} htmlFor="nu-email">Email</label>
              <input id="nu-email" type="email" required autoComplete="off" style={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label style={label} htmlFor="nu-password">Contraseña inicial (mín. 12)</label>
              <input id="nu-password" type="password" required autoComplete="new-password" style={input} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px', fontSize: '0.85rem' }}>
            <span style={label}>Roles:</span>
            {ROLES.map((r) => (
              <label key={r.id} style={{ display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.roles.includes(r.id)} onChange={() => toggleRole(r.id)} />
                {r.label}
              </label>
            ))}
          </div>
          <button type="submit" style={btn('linear-gradient(90deg, #00f2fe, #4facfe)', '#090d16')}>Crear usuario</button>
        </form>
      )}

      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-table-header)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 14px' }}>Email</th>
              <th style={{ padding: '10px 14px' }}>Tenant</th>
              <th style={{ padding: '10px 14px' }}>Roles</th>
              <th style={{ padding: '10px 14px' }}>Estado</th>
              <th style={{ padding: '10px 14px' }}>Alta</th>
              {canEdit && <th style={{ padding: '10px 14px', textAlign: 'right' }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '16px', color: 'var(--text-muted)' }}>No hay usuarios para este tenant.</td></tr>
            )}
            {users.map((u) => {
              const isSelf = u.id === session.user.id;
              return (
                <tr key={u.id} style={{ borderTop: '1px solid var(--border-color)', opacity: u.active ? 1 : 0.55 }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{u.email}{isSelf && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (vos)</span>}</td>
                  <td style={{ padding: '10px 14px' }}><code>{u.tenant_id}</code></td>
                  <td style={{ padding: '10px 14px' }}>{(u.roles || []).join(', ')}</td>
                  <td style={{ padding: '10px 14px' }}>{u.active ? '🟢 Activo' : '⚪ Inactivo'}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : ''}</td>
                  {canEdit && (
                    <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {!isSelf && (
                        <>
                          <button type="button" style={{ ...btn('#334155'), marginRight: '6px' }} onClick={() => { setResetFor(u); setResetPassword(''); }}>Cambiar contraseña</button>
                          <button type="button" style={btn(u.active ? 'rgba(239,68,68,0.8)' : 'rgba(16,185,129,0.8)')} onClick={() => handleToggleActive(u)}>
                            {u.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {resetFor && (
        <form onSubmit={handleReset} style={card}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Nueva contraseña para {resetFor.email}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="password" autoFocus required autoComplete="new-password" placeholder="Mínimo 12 caracteres" style={{ ...input, maxWidth: '320px' }} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} />
            <button type="submit" style={btn('linear-gradient(90deg, #00f2fe, #4facfe)', '#090d16')}>Guardar</button>
            <button type="button" style={btn('#334155')} onClick={() => setResetFor(null)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
