import React from 'react';

// ─── COLOUR MAP ───────────────────────────────────────────────────────────────

const COLOR_MAP = {
  // Email statuses
  'Assigned':          '#4a9eff',
  'JIRA Created':      '#2dd4bf',
  'Validating':        '#f5a623',
  'Normalized':        '#a78bfa',
  'Resolved':          '#00d4a0',
  'Pending':           '#8b90aa',
  // Doc statuses
  'Extracted':         '#4a9eff',
  'Under Review':      '#f5a623',
  'Validated':         '#00d4a0',
  'Failed':            '#ff5c72',
  'Processing':        '#a78bfa',
  // Fee statuses
  'Automated':         '#00d4a0',
  'Exception':         '#ff5c72',
  'Completed':         '#2dd4bf',
  'Pending Approval':  '#f5a623',
  // Classifications
  'Investor Inquiry':  '#4a9eff',
  'Account Maintenance':'#2dd4bf',
  'Reporting Request': '#f5a623',
  'Onboarding':        '#a78bfa',
  'Document Request':  '#00d4a0',
  'Compliance':        '#ff5c72',
  'Wire Instruction':  '#f5a623',
  'Redemption Request':'#ff5c72',
  // Fee types
  'Management Fee':    '#4a9eff',
  'Carried Interest':  '#a78bfa',
  'Incentive Fee':     '#2dd4bf',
  'Administrative Fee':'#f5a623',
  // Priority
  'High':   '#ff5c72',
  'Medium': '#f5a623',
  'Low':    '#00d4a0',
};

// ─── BADGE ────────────────────────────────────────────────────────────────────

export function Badge({ children, size = 'sm' }) {
  const c = COLOR_MAP[children] || '#8b90aa';
  const pad = size === 'lg' ? '3px 10px' : '2px 8px';
  const fs  = size === 'lg' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
      padding: pad, borderRadius: 20, fontSize: fs, fontWeight: 500, lineHeight: 1.4,
      background: `${c}1a`, color: c, border: `0.5px solid ${c}30`,
    }}>
      {children}
    </span>
  );
}

// ─── CONFIDENCE BAR ──────────────────────────────────────────────────────────

export function ConfBar({ val, width = 52 }) {
  const c = val >= 90 ? 'var(--green)' : val >= 80 ? 'var(--amber)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width, height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: `${val}%`, height: '100%', background: c, borderRadius: 2, transition: 'width .4s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: c, fontFamily: 'var(--mono)', fontWeight: 500, minWidth: 30 }}>{val}%</span>
    </div>
  );
}

// ─── KPI CARD ────────────────────────────────────────────────────────────────

export function KpiCard({ label, value, delta, deltaLabel, color, icon, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg2)', border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '14px 16px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color .2s',
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = color || 'var(--border2)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: color || 'var(--text)', fontFamily: 'var(--mono)', letterSpacing: '-1px', lineHeight: 1 }}>
          {value}
        </div>
        {icon && <div style={{ opacity: .5 }}>{icon}</div>}
      </div>
      {delta != null && (
        <div style={{ fontSize: 10, marginTop: 5, color: delta >= 0 ? 'var(--green)' : 'var(--red)' }}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% {deltaLabel}
        </div>
      )}
    </div>
  );
}

// ─── SLA BAR ─────────────────────────────────────────────────────────────────

export function SlaBar({ pct, color, label }) {
  const c = color || (pct >= 97 ? 'var(--green)' : pct >= 90 ? 'var(--amber)' : 'var(--red)');
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, color: 'var(--text3)' }}>
        <span>{label || 'SLA Compliance'}</span>
        <span style={{ color: c, fontFamily: 'var(--mono)', fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: 2, transition: 'width .6s ease' }} />
      </div>
    </div>
  );
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────

export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" stroke="var(--border2)" strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, padding: 40 }}>
      <div style={{ opacity: .3 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>{sub}</div>}
    </div>
  );
}

// ─── PAGINATION ──────────────────────────────────────────────────────────────

export function Pagination({ page, totalPages, total, perPage, onChange, accentColor }) {
  const from = (page - 1) * perPage + 1;
  const to   = Math.min(page * perPage, total);
  const pages = Math.min(totalPages, 5);
  const ac = accentColor || 'var(--blue)';

  return (
    <div style={{ padding: '8px 16px', borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>
      <span>Showing {from}–{to} of {total}</span>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
          style={{ width: 24, height: 24, borderRadius: 4, fontSize: 12, border: '0.5px solid var(--border)', color: page === 1 ? 'var(--text3)' : 'var(--text2)', opacity: page === 1 ? .4 : 1 }}>
          ‹
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            style={{ width: 24, height: 24, borderRadius: 4, fontSize: 11, border: `0.5px solid ${page === p ? ac : 'var(--border)'}`, background: page === p ? ac : 'transparent', color: page === p ? (ac === 'var(--amber)' ? '#000' : '#fff') : 'var(--text2)', fontWeight: page === p ? 600 : 400 }}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
          style={{ width: 24, height: 24, borderRadius: 4, fontSize: 12, border: '0.5px solid var(--border)', color: page === totalPages ? 'var(--text3)' : 'var(--text2)', opacity: page === totalPages ? .4 : 1 }}>
          ›
        </button>
      </div>
    </div>
  );
}

// ─── SEARCH + FILTER BAR ─────────────────────────────────────────────────────

export function FilterBar({ search, setSearch, filters = [], placeholder = 'Search…' }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 16px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', opacity: .35, pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={placeholder}
          style={{ width: '100%', background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 10px 6px 28px', color: 'var(--text)', fontSize: 12, outline: 'none' }} />
      </div>
      {filters.map(({ value, onChange, options, label }) => (
        <select key={label} value={value} onChange={e => onChange(e.target.value)}
          style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 10px', color: value ? 'var(--text)' : 'var(--text2)', fontSize: 12, outline: 'none', flexShrink: 0 }}>
          <option value="">{label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ))}
    </div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

export function SectionHeader({ title, count, countLabel, right, color }) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--bg2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        {count != null && (
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: `${color || 'var(--blue)'}18`, color: color || 'var(--blue)', fontWeight: 500, fontFamily: 'var(--mono)' }}>
            {count} {countLabel || ''}
          </span>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ─── TABLE WRAPPER ────────────────────────────────────────────────────────────

export function DataTable({ columns, children }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 2 }}>
          <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: '7px 8px', textAlign: 'left', fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap', paddingLeft: i === 0 ? 16 : 8, paddingRight: i === columns.length - 1 ? 16 : 8 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

// ─── TABLE ROW ────────────────────────────────────────────────────────────────

export function TR({ selected, onClick, children }) {
  return (
    <tr onClick={onClick} style={{ cursor: 'pointer', borderBottom: '0.5px solid var(--border)', background: selected ? 'var(--bg3)' : 'transparent', transition: 'background .12s' }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,.02)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
      {children}
    </tr>
  );
}

export function TD({ first, last, children, style = {} }) {
  return (
    <td style={{ padding: '10px 8px', paddingLeft: first ? 16 : 8, paddingRight: last ? 16 : 8, verticalAlign: 'middle', ...style }}>
      {children}
    </td>
  );
}

// ─── DETAIL PANEL WRAPPER ────────────────────────────────────────────────────

export function DetailPanel({ title, badge, onClose, children, footer }) {
  return (
    <div className="slide-in" style={{ width: 340, display: 'flex', flexDirection: 'column', borderLeft: '0.5px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {badge && <Badge>{badge}</Badge>}
          <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 18, lineHeight: 1, opacity: .6, padding: '0 2px' }}>×</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>{children}</div>
      {footer && <div style={{ padding: '12px 16px', borderTop: '0.5px solid var(--border)', flexShrink: 0 }}>{footer}</div>}
    </div>
  );
}

// ─── INFO GRID ───────────────────────────────────────────────────────────────

export function InfoGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
      {items.map(([k, v, full]) => (
        <div key={k} style={{ gridColumn: full ? '1/-1' : undefined, background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>{k}</div>
          <div style={{ fontSize: 11, color: 'var(--text)', wordBreak: 'break-word', fontFamily: typeof v === 'string' && v.startsWith('$') ? 'var(--mono)' : 'inherit' }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ─── ACTION BUTTON ───────────────────────────────────────────────────────────

export function ActionBtn({ children, color = 'var(--green)', onClick, disabled, outline }) {
  const bg = outline ? 'transparent' : `${color}18`;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ flex: 1, padding: '8px 10px', borderRadius: 'var(--radius)', border: `0.5px solid ${color}`, background: bg, color, fontSize: 11, fontWeight: 500, transition: 'all .15s', opacity: disabled ? .4 : 1 }}>
      {children}
    </button>
  );
}

// ─── SUBSECTION TITLE ────────────────────────────────────────────────────────

export function SubTitle({ children, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{children}</div>
      {right && <div style={{ fontSize: 10, color: 'var(--text3)' }}>{right}</div>}
    </div>
  );
}

// ─── ALERT BOX ───────────────────────────────────────────────────────────────

export function AlertBox({ type = 'warning', title, children }) {
  const colors = { warning: ['var(--amber)', 'var(--amber-bg)', 'var(--amber-bd)'], error: ['var(--red)', 'var(--red-bg)', 'var(--red-bd)'], success: ['var(--green)', 'var(--green-bg)', 'var(--green-bd)'] };
  const [c, bg, bd] = colors[type];
  return (
    <div style={{ background: bg, border: `0.5px solid ${bd}`, borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: 14 }}>
      {title && <div style={{ fontSize: 11, fontWeight: 500, color: c, marginBottom: 4 }}>{title}</div>}
      <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}