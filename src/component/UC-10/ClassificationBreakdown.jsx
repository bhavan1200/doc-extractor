// src/component/UC10/ClassificationBreakdown.jsx

import React from 'react';
import { ConfBar } from '../index';

export default function ClassificationBreakdown({ classification }) {
  if (!classification) return null;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
        🎯 Classification & AI Insights
      </div>
      
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
        {/* Primary classification */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>
            Primary: {classification.primary}
          </span>
          <span style={{ fontSize: 10, color: classification.confidence >= 90 ? 'var(--green)' : 'var(--amber)', fontWeight: 600 }}>
            {classification.confidence}%
          </span>
        </div>
        <ConfBar val={classification.confidence} width={200} />
        
        {/* Alternative classifications */}
        {classification.alternatives && classification.alternatives.length > 0 && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
            {classification.alternatives.map((alt, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                  Alt {i + 1}: {alt.category}
                </span>
                <span style={{ fontSize: 9, color: alt.confidence >= 80 ? 'var(--green)' : alt.confidence >= 60 ? 'var(--amber)' : 'var(--red)', fontWeight: 500 }}>
                  {alt.confidence}%
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Model metadata */}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
            Model: {classification.modelVersion} · {classification.modelEndpoint}
          </div>
        </div>
      </div>
      
      {/* AI Summary */}
      {classification.summary && (
        <div style={{ marginTop: 8, background: 'var(--bg4)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>📝 AI Summary</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>
            {classification.summary}
          </div>
        </div>
      )}
      
      {/* Extracted Entities */}
      {classification.extractedEntities && (
        <div style={{ marginTop: 8, background: 'var(--bg4)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>🧩 Extracted Entities</div>
          {Object.entries(classification.extractedEntities).map(([key, value]) => {
            if (!value) return null;
            const label = key.replace(/([A-Z])/g, ' $1').trim();
            return (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0' }}>
                <span style={{ color: 'var(--text3)' }}>{label}:</span>
                <span style={{ color: 'var(--text)' }}>{value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}