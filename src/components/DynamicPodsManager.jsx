import React, { useState } from 'react';

export default function DynamicPodsManager({ activeTenant }) {
  const [podsList, setPodsList] = useState([
    {
      pod_id: 'POD_CUSTOM_SUPPLY_CHAIN',
      name: 'Custom WMS Sidecar Pod',
      tenant_id: 'tenant_acme_corp',
      endpoint_url: 'http://localhost:9090/api/v1/wms-sidecar',
      keywords: ['wms', 'almacen', 'inventario'],
      status: 'ACTIVE'
    },
    {
      pod_id: 'POD_CUSTOM_SALESFORCE',
      name: 'Salesforce CRM Connector Pod',
      tenant_id: 'GLOBAL',
      endpoint_url: 'http://localhost:9091/api/v1/salesforce',
      keywords: ['salesforce', 'opportunity', 'lead'],
      status: 'ACTIVE'
    }
  ]);

  const [formData, setFormData] = useState({
    pod_id: '',
    name: '',
    endpoint_url: '',
    keywords: ''
  });

  const [statusMsg, setStatusMsg] = useState('');

  const handleRegisterPod = async (e) => {
    e.preventDefault();
    if (!formData.pod_id || !formData.endpoint_url) return;

    const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    const newPodConfig = {
      pod_id: formData.pod_id,
      name: formData.name || formData.pod_id,
      tenant_id: activeTenant,
      endpoint_url: formData.endpoint_url,
      keywords: keywordsArray,
      status: 'ACTIVE'
    };

    try {
      const res = await fetch('http://localhost:8080/api/v1/pods/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPodConfig)
      });

      if (res.ok) {
        setStatusMsg(`✅ AI Pod Dinámico "${newPodConfig.name}" registrado exitosamente en el router en caliente.`);
        setPodsList(prev => [...prev, newPodConfig]);
      } else {
        setStatusMsg(`⚠️ Error al registrar en backend. Añadido en modo cliente.`);
        setPodsList(prev => [...prev, newPodConfig]);
      }
    } catch (err) {
      setStatusMsg(`⚡ Pod Dinámico "${newPodConfig.name}" registrado localmente (Motor Backend en Standby).`);
      setPodsList(prev => [...prev, newPodConfig]);
    }

    setFormData({ pod_id: '', name: '', endpoint_url: '', keywords: '' });
  };

  const filteredPods = podsList.filter(p => activeTenant === 'GLOBAL' || p.tenant_id === 'GLOBAL' || p.tenant_id === activeTenant);

  return (
    <section className="admin-section" style={{ marginTop: '2rem' }}>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h2>🔌 Registro de AI Pods Dinámicos en Tiempo de Ejecución (Sidecars)</h2>
        <p>Añada o desactive microservicios AI Pods dinámicos para los clientes sin recompilar ni reiniciar el motor Go.</p>
      </div>

      {statusMsg && (
        <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
          {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <form onSubmit={handleRegisterPod} style={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#f3f4f6' }}>Nuevo AI Pod Dinámico</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '6px', fontSize: '0.875rem' }}>Pod ID (Único):</label>
            <input
              type="text"
              placeholder="ej: POD_CUSTOM_ERP"
              value={formData.pod_id}
              onChange={e => setFormData({ ...formData, pod_id: e.target.value })}
              style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '6px', fontSize: '0.875rem' }}>Nombre Descriptivo:</label>
            <input
              type="text"
              placeholder="ej: Custom Odoo ERP Pod"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '6px', fontSize: '0.875rem' }}>Endpoint HTTP (Sidecar URL):</label>
            <input
              type="url"
              placeholder="http://localhost:9092/api/v1/sidecar"
              value={formData.endpoint_url}
              onChange={e => setFormData({ ...formData, endpoint_url: e.target.value })}
              style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '6px', fontSize: '0.875rem' }}>Keywords Enrutamiento (separadas por coma):</label>
            <input
              type="text"
              placeholder="odoo, erp, presupuesto"
              value={formData.keywords}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            ⚡ Registrar AI Pod en Caliente
          </button>
        </form>

        <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#f3f4f6' }}>Pods Dinámicos Activos ({filteredPods.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredPods.map((p, idx) => (
              <div key={idx} style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 600, color: '#60a5fa' }}>{p.name}</span>
                    <span style={{ fontSize: '0.75rem', background: '#374151', color: '#9ca3af', padding: '2px 8px', borderRadius: '4px' }}>{p.pod_id}</span>
                    <span style={{ fontSize: '0.75rem', background: p.tenant_id === 'GLOBAL' ? '#1e3a8a' : '#065f46', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>{p.tenant_id}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '6px' }}>
                    🌐 Endpoint: <code>{p.endpoint_url}</code>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                    🏷️ Keywords: {p.keywords.join(', ')}
                  </div>
                </div>
                <span style={{ background: '#064e3b', color: '#34d399', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                  ● {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
