import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/session.js';

/**
 * TelemetryDashboard: métricas medidas por el core (SPEC-CORE-25, SPEC-CORE-68).
 * No hay valores de ejemplo: si el core no responde, se muestra "sin datos".
 */
const card = { background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' };
const label = { fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' };
const value = (color) => ({ fontSize: '1.6rem', fontWeight: '800', color, marginTop: '6px' });
const note = { fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' };

function Metric({ title, color, main, detail }) {
  return (
    <div style={card}>
      <div style={label}>{title}</div>
      <div style={value(color)}>{main}</div>
      <div style={note}>{detail}</div>
    </div>
  );
}

export default function TelemetryDashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await apiFetch('/api/v1/admin/telemetry');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTelemetry(data.telemetry || null);
        setError('');
      } catch {
        setError('No se pudo leer la telemetría del core.');
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = telemetry;
  const totalCache = t ? t.cache_hits + t.cache_misses : 0;
  const hitRatio = totalCache > 0 ? `${((t.cache_hits / totalCache) * 100).toFixed(1)}%` : 'sin datos';
  const cmmi = t && t.cmmi;

  return (
    <div style={{ padding: '24px', background: '#0f172a', borderRadius: '14px', border: '1px solid rgba(0, 242, 254, 0.15)', color: '#f8fafc', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#00f2fe' }}>
            📊 Telemetría y observabilidad (Prometheus)
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
            Valores medidos por el core desde su último arranque (SPEC-CORE-68).
          </p>
          {error && <p role="alert" style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: '#f87171' }}>{error}</p>}
        </div>
        <a
          href="/metrics"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '0.75rem', fontWeight: '700', padding: '6px 12px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.3)', textDecoration: 'none' }}
        >
          🌐 Abrir /metrics
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Metric
          title="⚡ Latencia promedio"
          color="#34d399"
          main={t && t.pod_requests > 0 ? `${t.avg_latency_ms} ms` : 'sin datos'}
          detail={t ? `${t.pod_requests} consultas a pods` : '—'}
        />
        <Metric
          title="🎯 Caché semántica"
          color="#00f2fe"
          main={hitRatio}
          detail={t ? `${t.cache_hits} aciertos / ${t.cache_misses} fallos` : '—'}
        />
        <Metric
          title="🧹 Purgas por feedback 👎"
          color="#fbbf24"
          main={t ? `${t.cache_purged}` : 'sin datos'}
          detail="Entradas de caché borradas"
        />
        <Metric
          title="🛡️ Rate limit (HTTP 429)"
          color="#60a5fa"
          main={t ? `${t.rate_limit_blocked}` : 'sin datos'}
          detail={t ? `${t.active_pods_count} pods registrados` : '—'}
        />
      </div>

      {/* CMMI nivel 4: calculado del historial git al construir la imagen (SPEC-CORE-68) */}
      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0, 242, 254, 0.15)' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#00f2fe' }}>🎯 Métricas CMMI nivel 4</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: '#94a3b8' }}>
          {cmmi
            ? `Calculadas del historial git del core (commit ${cmmi.commit}, ${cmmi.commits_total} commits${cmmi.shallow ? ', historial parcial' : ''}).`
            : 'Sin reporte: la imagen se construyó sin historial git.'}
        </p>
        {cmmi && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <Metric
              title="📜 Trazabilidad a specs"
              color="#34d399"
              main={`${Math.round(cmmi.spec_traceability_index * 100)}%`}
              detail={`${cmmi.commits_with_reference} de ${cmmi.commits_total} commits citan SPEC, RFC o issue`}
            />
            <Metric
              title="🐛 Densidad de defectos"
              color="#60a5fa"
              main={`${cmmi.defect_density_per_kloc.toFixed(2)} / KLOC`}
              detail={`${cmmi.fix_commits} commits de fix en ${cmmi.go_kloc} KLOC de Go`}
            />
            <Metric
              title="⏱️ Lead time por spec"
              color="#fbbf24"
              main={(cmmi.specs || []).length > 0 ? `${cmmi.avg_spec_lead_time_hours} hs` : 'sin datos'}
              detail={`Promedio de ${(cmmi.specs || []).length} specs con 2 o más commits`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
