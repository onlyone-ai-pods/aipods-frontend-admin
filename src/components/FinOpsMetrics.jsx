import React from 'react';

export default function FinOpsMetrics({ activeTenant }) {
  const metricsData = [
    {
      tenantId: 'tenant_acme_corp',
      tenantName: 'Acme Corp',
      plan: 'PROD_ACTIVE',
      inputTokens: 142000,
      outputTokens: 58000,
      totalTokens: 200000,
      estimatedCost: '$0.60',
      status: 'NORMAL'
    },
    {
      tenantId: 'tenant_globant_partner',
      tenantName: 'Globant Partner',
      plan: 'PROD_ENTERPRISE',
      inputTokens: 890000,
      outputTokens: 310000,
      totalTokens: 1200000,
      estimatedCost: '$3.60',
      status: 'HIGH_USAGE'
    },
    {
      tenantId: 'sandbox_session_demo',
      tenantName: 'Sandbox Demo User',
      plan: 'TRIAL_FREE',
      inputTokens: 2100,
      outputTokens: 900,
      totalTokens: 3000,
      estimatedCost: '$0.00',
      status: 'TRIAL'
    }
  ];

  const filteredMetrics = metricsData.filter(m =>
    activeTenant === 'GLOBAL' || m.tenantId === activeTenant
  );

  return (
    <section className="finops-section">
      <div className="section-header">
        <h2>💰 FinOps &amp; Consumo de Tokens por Tenant</h2>
        <p>Métricas en tiempo real de presupuesto, consumo de tokens y estimación de costos por cuenta.</p>
      </div>

      <div className="finops-grid">
        {filteredMetrics.map(m => (
          <div className="finops-card" key={m.tenantId}>
            <div className="finops-header">
              <h3>{m.tenantName}</h3>
              <span className={`plan-badge ${m.plan}`}>{m.plan}</span>
            </div>

            <div className="token-stats">
              <div className="stat">
                <span className="label">Tokens Entrada:</span>
                <span className="val">{m.inputTokens.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="label">Tokens Salida:</span>
                <span className="val">{m.outputTokens.toLocaleString()}</span>
              </div>
              <div className="stat total">
                <span className="label">Tokens Totales:</span>
                <span className="val">{m.totalTokens.toLocaleString()}</span>
              </div>
            </div>

            <div className="cost-footer">
              <span>Costo Estimado Acumulado:</span>
              <span className="cost-num">{m.estimatedCost}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
