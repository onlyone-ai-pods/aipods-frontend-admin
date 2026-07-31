import React, { useState } from 'react';

/**
 * TenantManagementView — Panel de Gestión Multi-Tenant & Estado de Pods (SPEC-CORE-30).
 */
export default function TenantManagementView() {
  const [tenants, setTenants] = useState([
    {
      id: 'TENANT_DEMO_001',
      name: 'Acme Corporation S.A.',
      cuit: '30-71123456-8',
      plan: 'Enterprise Multi-Pod',
      tokensUsed: 142500,
      tokensLimit: 1000000,
      status: 'PROD_ACTIVE'
    },
    {
      id: 'TENANT_GLOBEX_002',
      name: 'Globex Logistics & SCM',
      cuit: '30-65432109-2',
      plan: 'Professional Pod Plan',
      tokensUsed: 890000,
      tokensLimit: 900000,
      status: 'PENDING_PAYMENT'
    },
    {
      id: 'TENANT_INITECH_003',
      name: 'Initech Software Systems',
      cuit: '30-99887766-1',
      plan: 'Starter AI Pod Plan',
      tokensUsed: 50000,
      tokensLimit: 100000,
      status: 'SUSPENDED'
    }
  ]);

  const toggleTenantStatus = (tenantId) => {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const nextStatus = t.status === 'PROD_ACTIVE' ? 'SUSPENDED' : 'PROD_ACTIVE';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div style={{ padding: '24px', background: '#0f172a', borderRadius: '14px', border: '1px solid rgba(0, 242, 254, 0.15)', color: '#f8fafc', marginTop: '24px' }}>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '10px' }}>
        🏢 Gestión Multi-Tenant & Control de Suscripciones (Odoo Billing)
      </h3>
      <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: '#94a3b8' }}>
        Administración global de empresas clientes, control de estado de Pods y cuotas de consumo de tokens (SPEC-CORE-30).
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0, 242, 254, 0.08)', color: '#00f2fe', textTransform: 'uppercase', fontSize: '0.72rem' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tenant ID</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Razón Social / CUIT</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Plan Activo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tokens Consumidos</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Estado Pods</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => {
              const pct = Math.round((t.tokensUsed / t.tokensLimit) * 100);
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#38bdf8' }}>{t.id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700' }}>{t.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CUIT: {t.cuit}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#e2e8f0' }}>{t.plan}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700', color: pct > 90 ? '#f87171' : '#34d399' }}>
                      {t.tokensUsed.toLocaleString()} / {t.tokensLimit.toLocaleString()} ({pct}%)
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700',
                      background: t.status === 'PROD_ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : t.status === 'PENDING_PAYMENT' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                      color: t.status === 'PROD_ACTIVE' ? '#34d399' : t.status === 'PENDING_PAYMENT' ? '#fbbf24' : '#f87171',
                      border: `1px solid ${t.status === 'PROD_ACTIVE' ? 'rgba(16, 185, 129, 0.3)' : t.status === 'PENDING_PAYMENT' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
                    }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => toggleTenantStatus(t.id)}
                      style={{
                        padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                        background: t.status === 'PROD_ACTIVE' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: t.status === 'PROD_ACTIVE' ? '#f87171' : '#34d399',
                        border: `1px solid ${t.status === 'PROD_ACTIVE' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                      }}
                    >
                      {t.status === 'PROD_ACTIVE' ? '🛑 Suspender Service' : '🟢 Activar PROD_ACTIVE'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
