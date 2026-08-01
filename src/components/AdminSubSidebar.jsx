import React, { useState } from 'react';

/**
 * AdminSubSidebar — Sub-navegación lateral colapsable y responsiva para Tablets de 8"+ (SPEC-CORE-40 / Issue #21).
 */
export default function AdminSubSidebar({ items, activeSubTab, onSubTabChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`admin-sub-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? '64px' : '210px',
        minWidth: isCollapsed ? '64px' : '210px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRight: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '16px 8px',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', padding: '0 8px 12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '8px' }}>
        {!isCollapsed && <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SUB-MÓDULOS</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ background: 'transparent', border: 'none', color: '#00f2fe', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', padding: '4px' }}
          title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar a modo compacto (Tablet)'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map(item => {
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSubTabChange(item.id)}
              title={isCollapsed ? item.label : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '10px',
                padding: isCollapsed ? '12px 0' : '10px 12px',
                minHeight: '44px', // Touch-friendly target >= 44px (ISO 9241 / WCAG 2.1 AAA)
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: isActive ? '#00f2fe' : '#94a3b8',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {!isCollapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span style={{ marginLeft: 'auto', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
