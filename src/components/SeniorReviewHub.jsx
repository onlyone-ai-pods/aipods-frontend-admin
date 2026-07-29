import React, { useState, useEffect } from 'react';

export default function SeniorReviewHub({ activeTenant, onAuditLog }) {
  const [approvals, setApprovals] = useState([]);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/admin/approvals');
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.approvals || []).map(item => ({
          id: item.token,
          tenantId: item.tenant_id || 'TENANT_DEMO_001',
          podId: item.pod_id,
          podName: item.pod_id === 'POD_AFIP_FISCAL' ? 'AI Pod AFIP / ARCA Fiscal' : item.pod_id,
          actionName: item.action_name,
          summary: item.summary,
          generatedCommand: item.command,
          affectedRecords: 1,
          status: item.status,
          requestedAt: item.requested_at
        }));
        setApprovals(formatted);
      }
    } catch (err) {
      // Fallback mock if API is offline
      setApprovals([
        {
          id: 'dryrun_token_sha256_mock99120',
          tenantId: 'TENANT_DEMO_001',
          podId: 'POD_AFIP_FISCAL',
          podName: 'AI Pod AFIP / ARCA Fiscal',
          actionName: 'descargar_retenciones_arca',
          summary: 'Simulación de consulta de retenciones/percepciones en ARCA (Mirequa).',
          generatedCommand: 'node scripts/mis_retenciones_arca.js --cuit=20262534538',
          affectedRecords: 1,
          status: 'PENDING',
          requestedAt: new Date().toISOString()
        }
      ]);
    }
  };

  useEffect(() => {
    fetchApprovals();
    const interval = setInterval(fetchApprovals, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (item, isApproved) => {
    const actionStr = isApproved ? 'approve' : 'reject';
    const statusText = isApproved ? 'APPROVED' : 'REJECTED';

    try {
      await fetch('http://localhost:8080/api/v1/admin/approvals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: item.id, action: actionStr })
      });
    } catch (err) {
      // Ignore offline error
    }

    setApprovals(prev => prev.map(a => a.id === item.id ? { ...a, status: statusText } : a));

    if (onAuditLog) {
      onAuditLog({
        timestamp: new Date().toLocaleTimeString(),
        tenantId: item.tenantId,
        podId: item.podId,
        action: item.actionName,
        approvalToken: item.id,
        status: statusText,
        reviewedBy: 'Senior Consultant (You)'
      });
    }
  };

  const filteredApprovals = approvals.filter(item => 
    (activeTenant === 'GLOBAL' || item.tenantId === activeTenant) && item.status === 'PENDING'
  );

  return (
    <section className="review-hub-section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>🧑‍⚖️ Senior Consultant Review Hub (Human-in-the-Loop)</h2>
          <p>Cola de revisión de acciones simuladas (`dry_run = true`) pendientes de confirmación humana previa mutación en producción.</p>
        </div>
        <button className="btn-secondary" onClick={fetchApprovals} style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          🔄 Actualizar Cola
        </button>
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

              {item.generatedCommand && (
                <div className="command-preview">
                  <label>Comando Generado:</label>
                  <code>{item.generatedCommand}</code>
                </div>
              )}

              <div className="card-metadata">
                <span>Estado: <strong style={{ color: '#fbbf24' }}>{item.status}</strong></span>
                <span>Token: <code>{item.id}</code></span>
              </div>

              <div className="card-actions">
                <button
                  className="btn-reject"
                  onClick={() => handleAction(item, false)}
                >
                  ❌ Rechazar Acción
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
