// src/component/UC10/InvestorInsight.jsx

import React from 'react';
import { Badge } from '../index';

export default function InvestorInsight({ data }) {
  if (!data) return null;

  const statusColors = {
    matched: 'var(--green)',
    partial: 'var(--amber)',
    not_found: 'var(--red)',
  };

  const statusLabels = {
    matched: '✅ Matched',
    partial: '⚠️ Partial Match',
    not_found: '❌ Not Found',
  };

  const accountStatusColors = {
    Active: 'var(--green)',
    Inactive: 'var(--red)',
    Pending: 'var(--amber)',
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          👤 Investor Insight
        </div>
        <span style={{ 
          fontSize: 9, 
          color: statusColors[data.lookupStatus],
          fontWeight: 500,
        }}>
          {statusLabels[data.lookupStatus]} · {data.matchConfidence}%
        </span>
      </div>
      
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              {data.investorName}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)' }}>
              {data.investorId} · {data.accountNumber}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge>{data.accountType}</Badge>
            <div style={{ fontSize: 10, marginTop: 2, color: accountStatusColors[data.status] || 'var(--text3)' }}>
              {data.status}
            </div>
          </div>
        </div>
        
        {/* AUM */}
        <div style={{ background: 'var(--bg4)', borderRadius: 'var(--radius)', padding: '6px 10px', marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'var(--text3)' }}>Total AUM</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--mono)' }}>
              ${(data.totalAUM / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
        
        {/* Advisor */}
        <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 8 }}>
          Advisor: {data.advisorName} · {data.advisorEmail}
        </div>
        
        {/* Fund Holdings */}
        {data.fundHoldings && data.fundHoldings.length > 0 && (
          <div>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>Fund Holdings:</div>
            {data.fundHoldings.map((holding, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 0' }}>
                <span style={{ color: 'var(--text2)' }}>{holding.fund}</span>
                <span style={{ color: 'var(--text)' }}>
                  ${(holding.value / 1000000).toFixed(1)}M · {holding.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Contact Info */}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid var(--border)', display: 'flex', gap: 12, fontSize: 9, color: 'var(--text3)' }}>
          <span>📞 {data.contactInfo?.phone}</span>
          <span>✉️ {data.contactInfo?.email}</span>
        </div>
      </div>
    </div>
  );
}