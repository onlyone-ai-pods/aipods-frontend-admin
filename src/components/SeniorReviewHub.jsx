import React, { useState } from 'react';

export default function SeniorReviewHub({ activeTenant, onAuditLog }) {
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'dryrun_tok_afip_8899a',
      tenantId: 'tenant_acme_corp',
      podId: 'POD_AFIP_FINANCE',
      podName: 'AI Pod AFIP / ARCA',
      actionName: 'generar_csr_afip',
      summary: 'Simulación de comando OpenSSL para solicitud de certificado digital AFIP/ARCA.',
      generatedCommand: 'openssl req -new -key privada.key -out pedido.csr',
      affectedRecords: 1,
      createdAt: '2026-07-24 23:25:00',
      status: 'PENDING'
    },
    {
      id: 'dryrun_tok_devops_4421b',
      tenantId: 'tenant_globant_partner',
      podId: 'POD_GITHUB_DEVOPS',
      podName: 'AI Pod GitHub API & Odoo.sh',
      actionName: 'crear_repositorio_modulo_github',
      summary: 'Creación de nuevo repositorio en GitHub del cliente e integración de rama staging en Odoo.sh PaaS.',
      generatedCommand: 'gh repo create client-org/odoo-custom-module --private',
      affectedRecords: 2,
      createdAt: '2026-07-24 23:28:15',
      status: 'PENDING'
    }
  ]);

  const filteredApprovals = pendingApprovals.filter(item => 
    activeTenant === 'GLOBAL' || item.tenantId === activeTenant
  );

  const handleAction = (item, isApproved) => {
    const statusText = isApproved ? 'APPROVED' : 'REJECTED';
    setPendingApprovals(prev => prev.filter(a => a.id !== item.id));

    onAuditLog({
      timestamp: new Date().toLocaleTimeString(),
      tenantId: item.tenantId,
      podId: item.podId,
      action: item.actionName,
      approvalToken: item.id,
      status: statusText,
      reviewedBy: 'Senior Consultant (You)'
    });
  };

  return (
    <section className="review-hub-section">
      <div className="section-header">
        <h2>🧑‍⚖️ Senior Consultant Review Hub (Human-in-the-Loop)</h2>
        <p>Cola de revisión de acciones simuladas (`dry_run = true`) pendientes de confirmación humana previa mutación en producción.</p>
      </div>

      {filteredApprovals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <h3>No hay acciones pendientes de aprobación</h3>
          <p>Todas las simulaciones `dry_run` han sido revisadas o no aplican al tenant seleccionado.</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {filteredApprovals.map(item => (
            <div className="approval-card" key={item.id}>
              <div className="card-header">
                <span className="pod-tag">{item.podName}</span>
                <span className="tenant-tag">{item.tenantId}</span>
              </div>

              <h3 className="action-title">Acción: <code>{item.actionName}</code></h3>
              <p className="summary">{item.summary}</p>

              <div className="command-preview">
                <label>Comando Generado:</label>
                <code>{item.generatedCommand}</code>
              </div>

              <div className="card-metadata">
                <span>Registros afectables: <strong>{item.affectedRecords}</strong></span>
                <span>Token: <code>{item.id}</code></span>
              </div>

              <div className="card-actions">
                <button
                  className="btn-reject"
                  onClick={() => handleAction(item, false)}
                >
                  ❌ Rechazar Accion
                </button>
                <button
                  className="btn-approve"
                  onClick={() => handleAction(item, true)}
                >
                  ✅ Aprobar &amp; Ejecutar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
