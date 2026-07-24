import React from 'react'

export default function App() {
  return (
    <div>
      <header className="admin-header">
        <div className="brand-title">AI Pods Admin Console & Senior Review Hub</div>
        <span style={{ color: '#94a3b8' }}>mTLS / OIDC Auth Active</span>
      </header>

      <main className="dashboard-grid">
        <div className="stat-card">
          <h3 style={{ margin: 0, color: '#94a3b8' }}>Tenants Activos</h3>
          <p className="stat-value">204</p>
        </div>
        <div className="stat-card">
          <h3 style={{ margin: 0, color: '#94a3b8' }}>AI Pods En Ejecución</h3>
          <p className="stat-value">1,020</p>
        </div>
        <div className="stat-card">
          <h3 style={{ margin: 0, color: '#94a3b8' }}>Revisiones Senior Pendientes</h3>
          <p className="stat-value">0</p>
        </div>
      </main>
    </div>
  )
}
