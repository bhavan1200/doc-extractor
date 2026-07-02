// src/component/UC10/AttachmentsList.jsx

import React, { useState } from 'react';
import { Badge, ConfBar } from '../index';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

const STATUS_CONFIG = {
  completed: { label: '✅ Extracted', color: 'var(--green)' },
  processing: { label: '⏳ Processing', color: 'var(--amber)' },
  pending: { label: '⏸ Pending', color: 'var(--text3)' },
  failed: { label: '❌ Failed', color: 'var(--red)' },
};

export default function AttachmentsList({ attachments }) {
  const [expanded, setExpanded] = useState({});

  if (!attachments || attachments.length === 0) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
          📎 Attachments (0)
        </div>
        <div style={{ background: 'var(--bg4)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>
          No attachments
        </div>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = attachments.filter(a => a.extractionStatus === 'completed').length;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          📎 Attachments ({attachments.length})
        </div>
        <div style={{ fontSize: 9, color: 'var(--green)' }}>
          {completedCount}/{attachments.length} extracted
        </div>
      </div>
      
      {attachments.map((att, index) => {
        const config = STATUS_CONFIG[att.extractionStatus] || STATUS_CONFIG.pending;
        const isExpanded = expanded[att.id];
        
        return (
          <div 
            key={att.id}
            style={{
              background: 'var(--bg3)',
              borderRadius: 'var(--radius)',
              padding: '8px 10px',
              marginBottom: index < attachments.length - 1 ? 6 : 0,
              border: '0.5px solid var(--border)',
            }}
          >
            <div 
              onClick={() => toggleExpand(att.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {att.filename}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text3)' }}>
                    {att.pages} pages · {formatSize(att.size)} · {att.documentType}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: config.color }}>
                  {config.label}
                </span>
                {att.extractionConfidence && (
                  <ConfBar val={att.extractionConfidence} width={40} />
                )}
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              </div>
            </div>
            
            {/* Expanded details */}
            {isExpanded && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
                {att.extractionStatus === 'failed' && (
                  <div style={{ fontSize: 10, color: 'var(--red)', marginBottom: 6 }}>
                    ⚠️ {att.error || 'Extraction failed'}
                  </div>
                )}
                
                {att.extractionStatus === 'processing' && (
                  <div style={{ fontSize: 10, color: 'var(--amber)', marginBottom: 6 }}>
                    OCR processing in progress...
                  </div>
                )}
                
                {att.extractedFields && (
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>Extracted Fields:</div>
                    {Object.entries(att.extractedFields).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '1px 0' }}>
                        <span style={{ color: 'var(--text3)' }}>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span style={{ color: 'var(--text)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 9, color: 'var(--text3)' }}>
                    OCR: {att.ocrEngine || 'N/A'}
                  </span>
                  <button 
                    style={{ 
                      fontSize: 9, 
                      color: 'var(--blue)', 
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Download Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}