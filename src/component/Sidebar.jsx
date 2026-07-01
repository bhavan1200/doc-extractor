import React from 'react';

const NAV = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  { type: 'group', label: 'USE CASES' },
  {
    id: 'uc10', label: 'Email Triage', sub: 'UC-10', badge: '22', color: 'var(--blue)',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>,
  },
  {
    id: 'uc11', label: 'Doc Extraction', sub: 'UC-11', badge: '11', color: 'var(--purple)',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: 'uc19', label: 'Fee Automation', sub: 'UC-19', badge: '4', color: 'var(--amber)',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>,
  },
  { type: 'divider' },
  {
    id: 'pipelines', label: 'Pipelines',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    id: 'exceptions', label: 'Exceptions', badge: '37',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
  {
    id: 'reports', label: 'Reports',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    id: 'knowledgebase', label: 'Knowledge Base',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    id: 'admin', label: 'Administration',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  },
];

export default function Sidebar({ tab, setTab }) {
  return (
    <div style={{ width: 210, background: 'var(--bg2)', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '16px 16px 14px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--green) 0%, #00a878 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d0f12" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>POC</div>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>IMS Operations AI</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        {NAV.map((item, i) => {
          if (item.type === 'divider') return <div key={i} style={{ height: '0.5px', background: 'var(--border)', margin: '6px 8px' }} />;
          if (item.type === 'group') return (
            <div key={i} style={{ fontSize: 9, fontWeight: 600, color: 'var(--text3)', letterSpacing: '.08em', textTransform: 'uppercase', padding: '8px 8px 4px' }}>
              {item.label}
            </div>
          );
          const active = tab === item.id;
          const ac = item.color || 'var(--green)';
          return (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 'var(--radius)', marginBottom: 1, background: active ? `${ac}14` : 'transparent', color: active ? ac : 'var(--text2)', textAlign: 'left', fontSize: 12, fontWeight: active ? 500 : 400, transition: 'all .14s', border: active ? `0.5px solid ${ac}22` : '0.5px solid transparent' }}>
              <span style={{ opacity: active ? 1 : .55, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1, lineHeight: 1.2 }}>
                {item.sub && <span style={{ display: 'block', fontSize: 9, opacity: .6, letterSpacing: '.04em' }}>{item.sub}</span>}
                {item.label}
              </span>
              {item.badge && (
                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 10, background: 'var(--red-bg)', color: 'var(--red)', fontWeight: 600, flexShrink: 0 }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '10px 12px', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--bg)', flexShrink: 0 }}>
            AK
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin User</div>
            <div style={{ fontSize: 9, color: 'var(--text3)' }}>IS Operations</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" style={{ marginLeft: 'auto', flexShrink: 0 }}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        </div>
      </div>
    </div>
  );
}