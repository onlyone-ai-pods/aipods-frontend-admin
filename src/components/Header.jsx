import React from 'react';

export default function Header({ currentRole, activeTenant, onTenantChange }) {
  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="brand">
          <span className="brand-logo">🛡️</span>
          <div className="brand-titles">
            <span className="title">AI Pods Admin</span>
            <span className="subtitle">Senior Review Hub &amp; FinOps</span>
          </div>
        </div>

        <div className="header-controls">
          <div className="tenant-selector-box">
            <label htmlFor="tenant-select">Tenant Activo:</label>
            <select
              id="tenant-select"
              value={activeTenant}
              onChange={(e) => onTenantChange(e.target.value)}
              className="tenant-select"
            >
              <option value="GLOBAL">GLOBAL (Todos los Tenants)</option>
              <option value="tenant_acme_corp">Acme Corp (ID: tenant_acme_corp)</option>
              <option value="tenant_globant_partner">Globant Partner (ID: tenant_globant_partner)</option>
              <option value="sandbox_session_demo">Sandbox Demo Session</option>
            </select>
          </div>

          <div className="user-badge">
            <span className="role-dot"></span>
            <span className="role-text">{currentRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
