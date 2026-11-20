import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../services/session.js';

/**
 * TenantLLMModelsPanel — Modelo de Claude por tarea y cadena de respaldo de un
 * tenant (SPEC-CORE-74.R17-R18). Lee y guarda contra
 * /api/v1/admin/tenants/:id/llm-models; un valor vacío hereda el de la plataforma.
 */
const TASKS = ['classify', 'expand', 'answer'];
const MAX_FALLBACK = 3;

const control = { width: '100%', minHeight: '44px', padding: '9px 12px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' };
const hint = { fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' };
const btn = (bg, fg, border) => ({ minHeight: '44px', minWidth: '44px', padding: '9px 14px', background: bg, color: fg, border: border || 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' });
const ghost = btn('transparent', '#f8fafc', '1px solid rgba(255, 255, 255, 0.35)');

function toForm(configured) {
  const c = configured || {};
  return {
    classify: c.classify || '',
    expand: c.expand || '',
    answer: c.answer || '',
    inheritFallback: c.fallback === null || c.fallback === undefined,
    fallback: Array.isArray(c.fallback) ? c.fallback : [],
  };
}

export default function TenantLLMModelsPanel({ tenantId, onClose }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [form, setForm] = useState(toForm(null));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [toAdd, setToAdd] = useState('');

  const url = `/api/v1/admin/tenants/${encodeURIComponent(tenantId)}/llm-models`;

  const apply = (body) => {
    setData(body);
    setForm(toForm(body.configured));
    setToAdd('');
  };

  const load = useCallback(async () => {
    setData(null);
    setError('');
    setNotice('');
    try {
      const res = await apiFetch(url);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || t('llm_models_load_error'));
        return;
      }
      apply(body);
    } catch {
      setError(t('llm_models_load_error'));
    }
  }, [url, t]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await apiFetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classify: form.classify || null,
          expand: form.expand || null,
          answer: form.answer || null,
          fallback: form.inheritFallback ? null : form.fallback,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || t('llm_models_save_error'));
        return;
      }
      apply(body);
      setNotice(t('llm_models_saved'));
    } catch {
      setError(t('llm_models_save_error'));
    } finally {
      setBusy(false);
    }
  };

  const allowed = (data && data.allowed) || [];
  const platform = (data && data.platform) || {};
  const effective = (data && data.effective) || {};
  const addable = allowed.filter((m) => !form.fallback.includes(m));

  const move = (i, delta) => {
    setForm((f) => {
      const next = [...f.fallback];
      const j = i + delta;
      if (j < 0 || j >= next.length) return f;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...f, fallback: next };
    });
  };
  const remove = (i) => setForm((f) => ({ ...f, fallback: f.fallback.filter((_, k) => k !== i) }));
  const add = () => {
    if (!toAdd || form.fallback.length >= MAX_FALLBACK) return;
    setForm((f) => ({ ...f, fallback: [...f.fallback, toAdd] }));
    setToAdd('');
  };

  const chainText = (list) => (list && list.length ? list.join(' → ') : t('llm_models_no_chain'));

  return (
    <section
      aria-label={t('llm_models_title')}
      style={{ marginTop: '20px', padding: '20px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 242, 254, 0.35)', borderRadius: '12px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#00f2fe' }}>{t('llm_models_title')}</h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
            {t('llm_models_subtitle', { tenant: tenantId })}
          </p>
        </div>
        <button type="button" onClick={onClose} style={ghost}>{t('llm_models_close')}</button>
      </div>

      {error && (
        <div role="alert" style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(127, 29, 29, 0.6)', border: '1px solid #fca5a5', color: '#fee2e2', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
      {notice && (
        <div role="status" style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(6, 78, 59, 0.6)', border: '1px solid #6ee7b7', color: '#d1fae5', fontSize: '0.85rem' }}>
          {notice}
        </div>
      )}

      {!data && !error && <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{t('llm_models_loading')}</p>}

      {data && (
        <form onSubmit={save} style={{ marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {TASKS.map((task) => (
              <div key={task}>
                <label style={labelStyle} htmlFor={`llm-model-${task}`}>{t(`llm_models_task_${task}`)}</label>
                <select
                  id={`llm-model-${task}`}
                  value={form[task]}
                  onChange={(e) => setForm((f) => ({ ...f, [task]: e.target.value }))}
                  style={control}
                >
                  <option value="">{t('llm_models_inherit', { model: platform[task] || '' })}</option>
                  {allowed.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <div style={hint}>{t('llm_models_effective', { model: effective[task] || '' })}</div>
              </div>
            ))}
          </div>

          <fieldset style={{ marginTop: '20px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px' }}>
            <legend style={{ ...labelStyle, padding: '0 6px', marginBottom: 0 }}>{t('llm_models_fallback')}</legend>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '44px', color: '#f8fafc', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.inheritFallback}
                onChange={(e) => setForm((f) => ({ ...f, inheritFallback: e.target.checked }))}
                style={{ width: '20px', height: '20px' }}
              />
              {t('llm_models_fallback_inherit', { chain: chainText(platform.fallback) })}
            </label>

            {!form.inheritFallback && (
              <div>
                {form.fallback.length === 0 && <p style={{ ...hint, marginTop: '8px' }}>{t('llm_models_fallback_empty')}</p>}
                <ol style={{ margin: '8px 0', paddingLeft: '22px', color: '#f8fafc', fontSize: '0.85rem' }}>
                  {form.fallback.map((m, i) => (
                    <li key={m} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ flex: '1 1 200px', fontWeight: 700 }}>{m}</span>
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={t('llm_models_move_up', { model: m })} style={{ ...ghost, opacity: i === 0 ? 0.5 : 1 }}>↑</button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === form.fallback.length - 1} aria-label={t('llm_models_move_down', { model: m })} style={{ ...ghost, opacity: i === form.fallback.length - 1 ? 0.5 : 1 }}>↓</button>
                        <button type="button" onClick={() => remove(i)} style={ghost}>{t('llm_models_remove')}</button>
                      </div>
                    </li>
                  ))}
                </ol>
                {form.fallback.length < MAX_FALLBACK && addable.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 240px' }}>
                      <label style={labelStyle} htmlFor="llm-model-fallback-add">{t('llm_models_fallback_add_label')}</label>
                      <select id="llm-model-fallback-add" value={toAdd} onChange={(e) => setToAdd(e.target.value)} style={control}>
                        <option value="">{t('llm_models_choose')}</option>
                        {addable.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <button type="button" onClick={add} disabled={!toAdd} style={{ ...ghost, opacity: toAdd ? 1 : 0.5 }}>{t('llm_models_add')}</button>
                  </div>
                )}
                {form.fallback.length >= MAX_FALLBACK && <p style={hint}>{t('llm_models_fallback_max', { max: MAX_FALLBACK })}</p>}
              </div>
            )}
            <div style={hint}>{t('llm_models_fallback_effective', { chain: chainText(effective.fallback) })}</div>
          </fieldset>

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={busy} style={{ ...btn('#00f2fe', '#0f172a'), opacity: busy ? 0.6 : 1 }}>
              {busy ? t('llm_models_saving') : t('llm_models_save')}
            </button>
            <button type="button" onClick={load} disabled={busy} style={ghost}>{t('llm_models_reload')}</button>
          </div>
        </form>
      )}
    </section>
  );
}
