import React from 'react';

export default function AuditTrailLog({ logs, activeTenant }) {
  const filteredLogs = logs.filter(l =>
    activeTenant === 'GLOBAL' || l.tenantId === activeTenant
  );

  return (
    <section className="audit-log-section">
      <div className="section-header">
        <h2>📜 Log Inmutable de Auditoría &amp; Trazabilidad</h2>
        <p>Registro de eventos e historial de aprobaciones/rechazos de acciones con efectos secundarios.</p>
      </div>

      <div className="table-responsive">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Tenant ID</th>
              <th>AI Pod</th>
              <th>Acción</th>
              <th>Token Aprobación</th>
              <th>Estado</th>
              <th>Revisado Por</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.timestamp}</td>
                <td><code>{log.tenantId}</code></td>
                <td>{log.podId}</td>
                <td><code>{log.action}</code></td>
                <td><code>{log.approvalToken}</code></td>
                <td>
                  <span className={`status-badge ${log.status}`}>
                    {log.status}
                  </span>
                </td>
                <td>{log.reviewedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
