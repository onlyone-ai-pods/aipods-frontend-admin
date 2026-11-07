import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/session.js';

/**
 * FinOpsMetrics: tokens de Claude por tenant medidos por el core y su costo
 * estimado con precios de lista (SPEC-CORE-69). Sin datos de ejemplo.
 */
const PERIODS = [7, 30, 90];
const fmt = (n) => Number(n || 0).toLocaleString('es-AR');
const usd = (n) => `US$ ${Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

export default function FinOpsMetrics({ activeTenant }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const q = new URLSearchParams({ days: String(days) });
      if (activeTenant && activeTenant !== 'GLOBAL') q.set('tenant_id', activeTenant);
      try {
        const res = await apiFetch(`/api/v1/admin/finops/usage?${q}`);
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
        if (!cancelled) {
          setData(body);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(`No se pudo leer el consumo: ${err.message}`);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [days, activeTenant]);

  const tenants = data ? data.tenants : [];

  return (
    <section className="finops-section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>💰 FinOps &amp; Consumo de Tokens por Tenant</h2>
          <p>
            Tokens de Claude registrados por el core en cada consulta (clasificación y respuesta).
            {data && ` Costo estimado con precios de lista al ${data.prices_as_of}; la factura de Anthropic es la referencia.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PERIODS.map((d) => (
            <button key={d} type="button" onClick={() => setDays(d)}
              style={{ padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                border: '1px solid rgba(0,242,254,0.3)', background: d === days ? 'rgba(0,242,254,0.2)' : 'transparent', color: '#00f2fe' }}>
              {d} días
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" style={{ color: '#f87171' }}>{error}</p>}

      {data && (
        <p style={{ fontSize: '0.9rem', margin: '0 0 16px' }}>
          Total del período: <b>{usd(data.estimated_cost_usd)}</b> en {fmt(tenants.reduce((s, t) => s + t.requests, 0))} llamadas a Claude.
        </p>
      )}

      {data && tenants.length === 0 && (
        <p style={{ color: '#94a3b8' }}>Sin consumo registrado en los últimos {days} días.</p>
      )}

      <div className="finops-grid">
        {tenants.map((t) => (
          <div className="finops-card" key={t.tenant_id}>
            <div className="finops-header">
              <h3>{t.tenant_id === 'SIN_TENANT' ? 'Sin tenant asignado' : t.tenant_id}</h3>
              <span className="plan-badge">{fmt(t.requests)} llamadas</span>
            </div>

            <div className="token-stats">
              <div className="stat">
                <span className="label">Tokens entrada:</span>
                <span className="val">{fmt(t.input_tokens)}</span>
              </div>
              <div className="stat">
                <span className="label">Tokens salida:</span>
                <span className="val">{fmt(t.output_tokens)}</span>
              </div>
              {(t.cache_read_tokens > 0 || t.cache_write_tokens > 0) && (
                <div className="stat">
                  <span className="label">Caché (lectura / escritura):</span>
                  <span className="val">{fmt(t.cache_read_tokens)} / {fmt(t.cache_write_tokens)}</span>
                </div>
              )}
              <div className="stat total">
                <span className="label">Modelos:</span>
                <span className="val">{t.models.map((m) => m.model).join(', ')}</span>
              </div>
            </div>

            <div className="cost-footer">
              <span>Costo estimado:</span>
              <span className="cost-num">{usd(t.estimated_cost_usd)}</span>
            </div>
            {t.unpriced_models.length > 0 && (
              <p style={{ fontSize: '0.72rem', color: '#fbbf24', margin: '8px 0 0' }}>
                Sin precio conocido para {t.unpriced_models.join(', ')}: no suma al costo.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
