// src/component/UC10/index.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { enhancedEmailApi } from '../../data/uc10EnhancedData';
import { 
  Badge, ConfBar, FilterBar, SectionHeader, DataTable, TR, TD, 
  Pagination, Spinner, EmptyState 
} from '../index';
import EmailDetail from './EmailDetail';

// ─── EMAIL ROW ────────────────────────────────────────────────────────────────

function EmailRow({ email, selected, onClick }) {
  const { 
    id, 
    subject, 
    from, 
    client, 
    status, 
    owner, 
    receivedAt, 
    priority, 
    slaRisk,
    classification,
    exceptions,
  } = email;

  const priorityColors = {
    High: 'var(--red)',
    Medium: 'var(--amber)',
    Low: 'var(--green)',
  };

  const hasExceptions = exceptions && exceptions.length > 0;

  return (
    <TR selected={selected} onClick={() => onClick(email)}>
      <TD first>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ 
            fontSize: 8, 
            color: priorityColors[priority] || 'var(--text3)',
          }}>
            ●
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {subject}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{from}</div>
          </div>
        </div>
      </TD>
      <TD>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text)' }}>{client}</div>
          <Badge>{classification?.primary || 'N/A'}</Badge>
        </div>
      </TD>
      <TD>
        <ConfBar val={classification?.confidence || 0} />
      </TD>
      <TD>
        <Badge>{status}</Badge>
        {slaRisk && (
          <span style={{ marginLeft: 4, fontSize: 9, color: 'var(--red)', fontWeight: 600 }}>⚠</span>
        )}
        {hasExceptions && (
          <span style={{ marginLeft: 4, fontSize: 9, color: 'var(--red)', fontWeight: 600 }}>
            {exceptions.length}⚡
          </span>
        )}
      </TD>
      <TD>
        {owner ? (
          <span style={{ fontSize: 11, color: 'var(--text2)' }}>{owner}</span>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>—</span>
        )}
      </TD>
      <TD last>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{receivedAt}</span>
      </TD>
    </TR>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────────────────────

export default function UC10() {
  const [emails, setEmails] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [classification, setClassification] = useState('');
  const [page, setPage] = useState(1);
  const PER = 10;

  const [selected, setSelected] = useState(null);

  const classifications = [
    'Investor Inquiry', 'Account Maintenance', 'Reporting Request',
    'Onboarding', 'Document Request', 'Compliance',
    'Wire Instruction', 'Redemption Request'
  ];

  const load = useCallback(async () => {
    setLoading(true);
    const res = await enhancedEmailApi.list({ 
      search, 
      status, 
      classification, 
      page, 
      perPage: PER 
    });
    setEmails(res.data);
    setTotal(res.total);
    setTotalPages(res.totalPages);
    if (!selected && res.data.length) {
      setSelected(res.data[0]);
    } else if (selected && !res.data.find(e => e.id === selected.id)) {
      setSelected(res.data[0] || null);
    }
    setLoading(false);
  }, [search, status, classification, page, selected]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, status, classification]);
  useEffect(() => { load(); }, [load]);

  // Action handlers
  const handleAction = async (action, id, ...args) => {
    let result;
    switch (action) {
      case 'assign':
        result = await enhancedEmailApi.assign(id, args[0]);
        break;
      case 'createJira':
        result = await enhancedEmailApi.createJira(id);
        break;
      case 'resolve':
        result = await enhancedEmailApi.resolve(id);
        break;
      case 'approve':
        result = await enhancedEmailApi.approve(id);
        break;
      case 'reject':
        result = await enhancedEmailApi.reject(id, args[0]);
        break;
      case 'override':
        result = await enhancedEmailApi.overrideClassification(id, args[0], args[1]);
        break;
      case 'markGoldenDataset':
        result = await enhancedEmailApi.markGoldenDataset(id);
        break;
      case 'addComment':
        result = await enhancedEmailApi.addJiraComment(id, args[0]);
        break;
      case 'sendAcknowledgement':
        result = await enhancedEmailApi.sendAcknowledgement(id);
        break;
      default:
        return;
    }
    if (result?.success) {
      load();
    }
  };

  const pendingCount = emails.filter(e => e.status === 'Pending' || e.status === 'Normalized').length;
  const highPriorityCount = emails.filter(e => e.priority === 'High').length;
  const exceptionCount = emails.filter(e => e.exceptions && e.exceptions.length > 0).length;

  return (
    <div className="fade-in" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SectionHeader
          title="Email Triage Queue"
          count={total} countLabel="emails"
          color="var(--blue)"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {pendingCount > 0 && (
                <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: 'var(--amber-bg)', color: 'var(--amber)', border: '0.5px solid var(--amber-bd)' }}>
                  {pendingCount} pending
                </div>
              )}
              {highPriorityCount > 0 && (
                <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: 'var(--red-bg)', color: 'var(--red)', border: '0.5px solid var(--red-bd)' }}>
                  {highPriorityCount} high priority
                </div>
              )}
              {exceptionCount > 0 && (
                <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: 'var(--red-bg)', color: 'var(--red)', border: '0.5px solid var(--red-bd)' }}>
                  {exceptionCount} exceptions
                </div>
              )}
            </div>
          }
        />

        <FilterBar
          search={search} setSearch={setSearch}
          placeholder="Search by subject, sender, or client…"
          filters={[
            { label: 'All Statuses', value: status, onChange: setStatus, options: ['Pending', 'Normalized', 'Validating', 'Assigned', 'JIRA Created', 'Resolved'] },
            { label: 'All Classifications', value: classification, onChange: setClassification, options: classifications },
          ]}
        />

        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>
        ) : emails.length === 0 ? (
          <EmptyState 
            icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>} 
            title="No emails found" 
            sub="Try adjusting your search or filter criteria" 
          />
        ) : (
          <DataTable columns={['Subject / From', 'Client / Category', 'Confidence', 'Status', 'Owner', 'Received']}>
            {emails.map(e => (
              <EmailRow 
                key={e.id} 
                email={e} 
                selected={selected?.id === e.id} 
                onClick={setSelected} 
              />
            ))}
          </DataTable>
        )}

        <Pagination 
          page={page} 
          totalPages={totalPages} 
          total={total} 
          perPage={PER} 
          onChange={setPage} 
          accentColor="var(--blue)" 
        />
      </div>

      {selected && (
        <EmailDetail 
          email={selected} 
          onClose={() => setSelected(null)} 
          onAction={handleAction}
          onApprove={handleAction}
          onReject={handleAction}
          onOverride={handleAction}
          onMarkGoldenDataset={handleAction}
          onCreateTicket={handleAction}
          onAddComment={handleAction}
        />
      )}
    </div>
  );
}