import React, { useState } from 'react';
import Header from './components/Header.jsx';
import SeniorReviewHub from './components/SeniorReviewHub.jsx';
import FinOpsMetrics from './components/FinOpsMetrics.jsx';
import AuditTrailLog from './components/AuditTrailLog.jsx';
import './index.css';

export default function App() {
  const [activeTenant, setActiveTenant] = useState('GLOBAL');
  const [auditLogs, setAuditLogs] = useState([
    {
      timestamp: '23:15:02',
      tenantId: 'tenant_acme_corp',
      podId: 'POD_AFIP_FINANCE',
      action: 'generar_csr_afip',
      approvalToken: 'dryrun_tok_afip_7710a',
      status: 'APPROVED',
      reviewedBy: 'Senior Consultant (System)'
    },
    {
      timestamp: '22:40:11',
      tenantId: 'tenant_globant_partner',
      podId: 'POD_SAP_ENTERPRISE',
      action: 'consultar_pedidos_s4hana',
      approvalToken: 'dryrun_tok_sap_0012c',
      status: 'SIMULATED',
      reviewedBy: 'Auto-Simulated (DryRun)'
    }
  ]);

  const handleAddAuditLog = (newLog) => {
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="admin-app">
      <Header
        currentRole="Senior Consultant Reviewer"
        activeTenant={activeTenant}
        onTenantChange={setActiveTenant}
      />

      <main className="admin-main">
        <SeniorReviewHub
          activeTenant={activeTenant}
          onAuditLog={handleAddAuditLog}
        />

        <FinOpsMetrics activeTenant={activeTenant} />

        <AuditTrailLog
          logs={auditLogs}
          activeTenant={activeTenant}
        />
      </main>

      <footer className="admin-footer">
        <p>© 2026 Martin Llanos. AI Pods Enterprise SaaS Platform — Admin Portal &amp; Senior Review Hub v6.3.0</p>
      </footer>
    </div>
  );
}
