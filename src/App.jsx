import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import AdminTabNavigation from './components/AdminTabNavigation.jsx';
import AdminLoginView from './components/AdminLoginView.jsx';
import AdminOnboardingWizard from './components/AdminOnboardingWizard.jsx';
import SeniorReviewHub from './components/SeniorReviewHub.jsx';
import TenantManagementView from './components/TenantManagementView.jsx';
import TelemetryDashboard from './components/TelemetryDashboard.jsx';
import DynamicPodsManager from './components/DynamicPodsManager.jsx';
import FinOpsMetrics from './components/FinOpsMetrics.jsx';
import AuditTrailLog from './components/AuditTrailLog.jsx';
import './index.css';

export default function App() {
  const [adminSession, setAdminSession] = useState(null);
  const [activeTab, setActiveTab] = useState('tab-review'); // 'tab-review' | 'tab-tenants' | 'tab-telemetry' | 'tab-onboarding'
  const [activeTenant, setActiveTenant] = useState('GLOBAL');
  const pendingApprovalsCount = 1;

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

  useEffect(() => {
    const stored = sessionStorage.getItem('aipods_admin_session');
    if (stored) {
      try {
        setAdminSession(JSON.parse(stored));
      } catch (err) {
        sessionStorage.removeItem('aipods_admin_session');
      }
    }
  }, []);

  const handleAddAuditLog = (newLog) => {
    setAuditLogs(prev => [newLog, ...prev]);
  };

  if (!adminSession) {
    return <AdminLoginView onLoginSuccess={(sess) => setAdminSession(sess)} />;
  }

  const alertState = {
    pendingApprovals: pendingApprovalsCount,
    auditLogsCount: auditLogs.length,
    highUsageTenants: 1,
    setupProgress: 100
  };

  return (
    <div className="admin-app">
      <Header
        currentRole="Senior Consultant Reviewer"
        activeTenant={activeTenant}
        onTenantChange={setActiveTenant}
      />

      {/* NAVEGACIÓN POR PESTAÑAS Y SEVERIDAD DE ALERTAS (SPEC-CORE-39 / Issue #20) */}
      <AdminTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alerts={alertState}
      />

      <main className="admin-main">
        {/* PESTAÑA 1 (PRINCIPAL): REVIEW HUB HUMAN-IN-THE-LOOP */}
        {activeTab === 'tab-review' && (
          <SeniorReviewHub
            activeTenant={activeTenant}
            onAuditLog={handleAddAuditLog}
          />
        )}

        {/* PESTAÑA 2: TRAZABILIDAD & LOG INMUTABLE DE AUDITORÍA (ISO 9001 / SOC 2) */}
        {activeTab === 'tab-audit' && (
          <AuditTrailLog
            logs={auditLogs}
            activeTenant={activeTenant}
          />
        )}

        {/* PESTAÑA 3: GESTIÓN MULTI-TENANT & ODOO BILLING */}
        {activeTab === 'tab-tenants' && (
          <TenantManagementView />
        )}

        {/* PESTAÑA 4: OBSERVABILIDAD & TELEMETRÍA OPENTELEMETRY */}
        {activeTab === 'tab-telemetry' && (
          <>
            <TelemetryDashboard />
            <DynamicPodsManager activeTenant={activeTenant} />
            <FinOpsMetrics activeTenant={activeTenant} />
          </>
        )}

        {/* PESTAÑA 5: CHECKLIST DE SETUP & ONBOARDING WIZARD */}
        {activeTab === 'tab-onboarding' && (
          <AdminOnboardingWizard />
        )}
      </main>

      <footer className="admin-footer">
        <p>© 2026 Martin Llanos. AI Pods Enterprise SaaS Platform — Admin Portal &amp; Senior Review Hub v66.0.0</p>
      </footer>
    </div>
  );
}
