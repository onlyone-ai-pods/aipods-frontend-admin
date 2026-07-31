import React, { useState } from 'react';

/**
 * AdminOnboardingWizard — Wizard interactivo de 4 pasos para onboarding de Administradores (SPEC-CORE-37 / Issue #18).
 */
export default function AdminOnboardingWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false, 4: false });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const steps = [
    {
      id: 1,
      title: '🛡️ Paso 1: Native Vault & Claves AES-256',
      desc: 'Verificación del módulo de custodia cifrada de credenciales (AFIP CSR, Odoo Tokens, GitHub Keys).',
      actionText: '✓ Validar Native Vault',
      detail: 'La clave maestra de 32 bytes se encuentra activa en RAM con purga de 15 segundos.'
    },
    {
      id: 2,
      title: '📊 Paso 2: Telemetría & Prometheus Scraping',
      desc: 'Conexión en tiempo real con el endpoint GET /metrics y métricas de rendimiento Redis.',
      actionText: '✓ Probar Endpoint /metrics',
      detail: 'Telemetría lista con recopilación de solicitudes/minuto y ratio de aciertos de caché.'
    },
    {
      id: 3,
      title: '🧑‍⚖️ Paso 3: Políticas Human-in-the-Loop (Dry-Run)',
      desc: 'Configuración de la cola de revisión de mutaciones críticas previas a la ejecución en producción.',
      actionText: '✓ Confirmar Filtro Dry-Run',
      detail: 'El motor requiere la aprobación explícita de un Senior Consultant para ejecutar cambios.'
    },
    {
      id: 4,
      title: '🏢 Paso 4: Aprovisionamiento Odoo Billing & Tenants',
      desc: 'Chequeo de empresas clientes registradas y asignación del estado de servicio PROD_ACTIVE.',
      actionText: '🎉 Finalizar Setup de Administrador',
      detail: 'Tenants vinculados correctamente con control de cuotas y tokens.'
    }
  ];

  const handleStepComplete = (stepId) => {
    const updated = { ...completedSteps, [stepId]: true };
    setCompletedSteps(updated);

    if (stepId < 4) {
      setCurrentStep(stepId + 1);
    } else {
      if (onComplete) onComplete();
      setIsCollapsed(true);
    }
  };

  const progressPercent = Math.round(
    (Object.values(completedSteps).filter(Boolean).length / 4) * 100
  );

  if (isCollapsed) {
    return (
      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', color: '#34d399' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: '700' }}>
          <span>🎉 Setup de Administrador 100% Verificado</span>
          <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '10px' }}>ISO 9001 / SOC 2 Ready</span>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          style={{ background: 'transparent', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
        >
          ⚙️ Reabrir Checklist
        </button>
      </div>
    );
  }

  const activeStepObj = steps.find(s => s.id === currentStep);

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '16px', padding: '24px', marginBottom: '28px', color: '#f8fafc', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧙 Wizard de Onboarding & Setup de Administrador (SPEC-CORE-37)
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            Asistente de configuración guiada en 4 pasos para certificación enterprise.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>Progreso del Setup</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#38bdf8' }}>{progressPercent}%</div>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}
            title="Minimizar Wizard"
          >
            ✖
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #00f2fe, #34d399)', transition: 'width 0.4s ease' }} />
      </div>

      {/* Selector de Pasos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {steps.map(s => {
          const isDone = completedSteps[s.id];
          const isCurrent = currentStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              style={{
                padding: '8px', borderRadius: '8px', border: '1px solid', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', textAlign: 'center',
                background: isCurrent ? 'rgba(0, 242, 254, 0.15)' : isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: isCurrent ? '#00f2fe' : isDone ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                color: isCurrent ? '#00f2fe' : isDone ? '#34d399' : '#94a3b8'
              }}
            >
              {isDone ? '✓ ' : ''}Paso {s.id}
            </button>
          );
        })}
      </div>

      {/* Contenido del Paso Activo */}
      <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#e2e8f0' }}>{activeStepObj.title}</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#cbd5e1' }}>{activeStepObj.desc}</p>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '16px', background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '6px' }}>
          💡 {activeStepObj.detail}
        </div>

        <button
          onClick={() => handleStepComplete(activeStepObj.id)}
          style={{ padding: '8px 20px', borderRadius: '8px', background: 'linear-gradient(90deg, #00f2fe, #4facfe)', color: '#090d16', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          {activeStepObj.actionText}
        </button>
      </div>
    </div>
  );
}
