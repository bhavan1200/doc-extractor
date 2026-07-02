// src/component/UC10/AuditTrail.jsx

import React, { useState } from 'react';

const STATUS_COLORS = {
  success: 'var(--green)',
  warning: 'var(--amber)',
  error: 'var(--red)',
};

const STATUS_DOTS = {
  success: '●',
  warning: '◉',
  error: '○',
};

export default function AuditTrail({ entries, limit = 5 }) {
  const [expanded, setExpanded] = useState(false);

  if (!entries || entries.length === 0) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
          📜 Audit Trail (0 events)
        </div>
        <div style={{ background: 'var(--bg4)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>
          No audit events
        </div>
      </div>
    );
  }

  const displayEntries = expanded ? entries : entries.slice(-limit);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          📜 Audit Trail ({entries.length} events)
        </div>
        {entries.length > limit && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              fontSize: 9,
              color: 'var(--blue)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {expanded ? 'Show less' : `Show all (${entries.length})`}
          </button>
        )}
      </div>
      
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '8px 10px', maxHeight: expanded ? 400 : 200, overflowY: 'auto' }}>
        {displayEntries.map((entry, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              gap: 10,
              padding: '5px 0',
              borderBottom: index < displayEntries.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}
          >
            {/* Dot */}
            <div style={{ 
              color: STATUS_COLORS[entry.status] || 'var(--text3)',
              fontSize: 10,
              flexShrink: 0,
              paddingTop: 1,
            }}>
              {STATUS_DOTS[entry.status] || '●'}
            </div>
            
            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text)' }}>
                  {entry.action}
                </span>
                <span style={{ fontSize: 8, color: 'var(--text3)' }}>
                  {entry.timestamp}
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text2)' }}>
                {entry.details}
              </div>
              <div style={{ fontSize: 8, color: 'var(--text4)', marginTop: 1 }}>
                {entry.user} · {entry.traceId}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}