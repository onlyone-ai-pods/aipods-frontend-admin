import React from 'react';

/**
 * AdminTabNavigation — Barra de Navegación por 5 Pestañas Modulares con Indicadores de Severidad (SPEC-CORE-39 / Issue #20).
 */
export default function AdminTabNavigation({ activeTab, onTabChange, alerts }) {
  const tabs = [
    {
      id: 'tab-review',
      label: 'Review Hub (Dry-Run)',
      icon: '🧑‍⚖️',
      badgeCount: alerts.pendingApprovals,
      severity: alerts.pendingApprovals > 0 ? 'critical' : 'normal',
      isPrimary: true
    },
    {
      id: 'tab-audit',
      label: 'Trazabilidad & Auditoría',
      icon: '📜',
      badgeCount: alerts.auditLogsCount ? `${alerts.auditLogsCount} logs` : 'SHA-256',
      severity: 'success'
    },
    {
      id: 'tab-tenants',
      label: 'Gestión Multi-Tenant',
      icon: '🏢',
      badgeCount: alerts.highUsageTenants > 0 ? `${alerts.highUsageTenants} alerta` : null,
      severity: alerts.highUsageTenants > 0 ? 'warning' : 'normal'
    },
    {
      id: 'tab-telemetry',
      label: 'Observabilidad & Telemetría',
      icon: '📊',
      badgeCount: 'OK',
      severity: 'success'
    },
    {
      id: 'tab-onboarding',
      label: 'Checklist de Setup',
      icon: '🧙',
      badgeCount: alerts.setupProgress < 100 ? `${alerts.setupProgress}%` : '✓ 100%',
      severity: alerts.setupProgress < 100 ? 'warning' : 'success'
    }
  ];

  const getBadgeStyle = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          background: '#ef4444',
          color: '#ffffff',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
          animation: 'pulse 2s infinite'
        };
      case 'warning':
        return {
          background: 'rgba(251, 191, 36, 0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(251, 191, 36, 0.4)'
        };
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#cbd5e1'
        };
    }
  };

  return (
    <div style={{ background: '#0b0f19', borderBottom: '1px solid rgba(0, 242, 254, 0.2)', padding: '0 24px', marginBottom: '24px' }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', padding: '0 8px' }}>
        {tabs.map(t => {
          const isActive = activeTab === t.id;
          const badgeStyle = getBadgeStyle(t.severity);

          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: isActive ? 'linear-gradient(180deg, rgba(0, 242, 254, 0.12), rgba(0, 242, 254, 0.02))' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #00f2fe' : '3px solid transparent',
                color: isActive ? '#00f2fe' : '#94a3b8',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <span style={{ fontSize: '1.05rem' }}>{t.icon}</span>
              <span>{t.label}</span>
              {t.badgeCount !== null && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    marginLeft: '4px',
                    ...badgeStyle
                  }}
                >
                  {t.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
