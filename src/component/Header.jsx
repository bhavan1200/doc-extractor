import React, { useState } from 'react';

const TITLES = {
  overview:     { title: 'Operations Command Center', sub: 'Monitor and manage document and work processing across all use cases' },
  uc10:         { title: 'UC-10 · Email Triage & Response', sub: 'AI-driven email classification, routing, and JIRA integration for Investor Services' },
  uc11:         { title: 'UC-11 · Document Data Extraction', sub: 'Intelligent KYC and onboarding document extraction with human-in-the-loop validation' },
  uc19:         { title: 'UC-19 · Fee Calculation Automation', sub: 'Automated fee engine for management fees, carried interest, and incentive fees' },
  pipelines:    { title: 'Pipelines', sub: 'Monitor active processing pipelines across all use cases' },
  exceptions:   { title: 'Exceptions', sub: 'Review and resolve processing exceptions requiring attention' },
  reports:      { title: 'Reports & Analytics', sub: 'Operational performance metrics and trend analysis' },
  knowledgebase:{ title: 'Knowledge Base', sub: 'Documentation, playbooks, and operational guides' },
  admin:        { title: 'Administration', sub: 'System configuration and user management' },
};

export default function Header({ tab }) {
  const { title, sub } = TITLES[tab] || TITLES.overview;
  const [dateRange, setDateRange] = useState('Last 7 Days');

  return (
    <div style={{ padding: '0 20px', height: 52, borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)', flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.2px' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{sub}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Date range */}
        <select value={dateRange} onChange={e => setDateRange(e.target.value)}
          style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '5px 10px', color: 'var(--text2)', fontSize: 11, outline: 'none' }}>
          {['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter'].map(o => <option key={o}>{o}</option>)}
        </select>

        {/* Refresh */}
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 11, color: 'var(--text2)', background: 'var(--bg3)', transition: 'color .15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        {/* Notification */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', border: '1.5px solid var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#fff', fontWeight: 700 }}>5</div>
        </div>

        {/* Avatar */}
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--bg)', cursor: 'pointer' }}>
          AK
        </div>
      </div>
    </div>
  );
}