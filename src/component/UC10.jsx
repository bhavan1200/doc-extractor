import React, { useState, useEffect, useCallback } from 'react';
import { emailApi } from '../mockData';
import { 
  Badge, ConfBar, FilterBar, SectionHeader, DataTable, TR, TD, 
  DetailPanel, InfoGrid, ActionBtn, SubTitle, AlertBox, Pagination, 
  Spinner, EmptyState 
} from './index';

// ─── PIPELINE STEP COMPONENT ────────────────────────────────────────────────

function PipelineStep({ step, index, total }) {
  const { key, note, done, current, time } = step;
  
  return (
    <div style={{ display: 'flex', gap: 12, padding: '6px 0', position: 'relative' }}>
      {/* Vertical line connector */}
      {index < total - 1 && (
        <div style={{
          position: 'absolute',
          left: 8,
          top: 24,
          bottom: 0,
          width: 1.5,
          background: done ? 'var(--green)' : 'var(--border)',
          transition: 'background .3s',
        }} />
      )}
      
      {/* Status dot */}
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: done ? (current ? 'var(--green)' : 'var(--green-bg)') : 'var(--bg4)',
        border: `2px solid ${done ? (current ? 'var(--green)' : 'var(--green-bg)') : 'var(--border)'}`,
        marginTop: 2,
        zIndex: 1,
      }}>
        {done && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={current ? '#fff' : 'var(--green)'} strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: 12, 
          fontWeight: current ? 600 : 400,
          color: current ? 'var(--green)' : (done ? 'var(--text2)' : 'var(--text3)'),
        }}>
          {key}
          {current && <span style={{ marginLeft: 8, fontSize: 9, color: 'var(--green)', fontWeight: 500 }}>● Processing</span>}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{note}</div>
        {time && <div style={{ fontSize: 9, color: 'var(--text4)', marginTop: 2 }}>{time}</div>}
      </div>
    </div>
  );
}

// ─── EMAIL DETAIL ─────────────────────────────────────────────────────────────

function EmailDetail({ email, onClose, onAction }) {
  const [loading, setLoading] = useState('');

  async function handleAssign() {
    setLoading('assign');
    const owner = 'John Smith';
    await emailApi.assign(email.id, owner);
    setLoading('');
    onAction?.('assigned', email.id);
  }

  async function handleCreateJira() {
    setLoading('jira');
    await emailApi.createJira(email.id);
    setLoading('');
    onAction?.('jiraCreated', email.id);
  }

  const canAssign = email.status === 'Pending' || email.status === 'Normalized' || email.status === 'Validating';
  const canCreateJira = email.status === 'Assigned' && !email.jiraId;

  return (
    <DetailPanel 
      title="Email Processing Pipeline" 
      badge={email.status} 
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          {canAssign && (
            <ActionBtn color="var(--blue)" onClick={handleAssign} disabled={loading === 'assign'}>
              {loading === 'assign' ? '…Assigning' : `↳ Assign to ${email.owner || 'Team'}`}
            </ActionBtn>
          )}
          {canCreateJira && (
            <ActionBtn color="var(--teal)" onClick={handleCreateJira} disabled={loading === 'jira'}>
              {loading === 'jira' ? '…Creating' : 'Create JIRA Ticket ↗'}
            </ActionBtn>
          )}
          {email.status === 'Resolved' && (
            <ActionBtn color="var(--green)" disabled>
              ✓ Resolved
            </ActionBtn>
          )}
        </div>
      }
    >
      <InfoGrid items={[
        ['Subject', email.subject, true],
        ['From', email.from],
        ['Client', email.client],
        ['Classification', <Badge size="lg">{email.classification}</Badge>],
        ['Priority', <Badge>{email.priority}</Badge>],
        ['Received', email.receivedAt],
        ['Confidence', <span style={{ color: email.confidence >= 90 ? 'var(--green)' : 'var(--amber)', fontWeight: 600 }}>{email.confidence}%</span>],
        ['Owner', email.owner || 'Unassigned'],
        ['JIRA ID', email.jiraId || 'Not created'],
      ]} />

      {email.slaRisk && (
        <AlertBox type="warning" title="SLA Risk Detected">
          This email has a confidence score below 84% and requires human review. 
          It has been flagged for immediate attention.
        </AlertBox>
      )}

      <SubTitle right={<span style={{ fontSize: 10, color: 'var(--text3)' }}>{email.pipeline.filter(s => s.done).length} of {email.pipeline.length} steps</span>}>
        Processing Pipeline
      </SubTitle>
      
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '8px 12px' }}>
        {email.pipeline.map((step, i) => (
          <PipelineStep key={step.key} step={step} index={i} total={email.pipeline.length} />
        ))}
      </div>

      {/* Confidence bar */}
      <div style={{ marginTop: 14, background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
          <span style={{ color: 'var(--text2)' }}>AI Classification Confidence</span>
          <span style={{ color: email.confidence >= 90 ? 'var(--green)' : 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
            {email.confidence}%
          </span>
        </div>
        <ConfBar val={email.confidence} width={200} />
      </div>
    </DetailPanel>
  );
}

// ─── EMAIL ROW ────────────────────────────────────────────────────────────────

function EmailRow({ email, selected, onClick }) {
  return (
    <TR selected={selected} onClick={() => onClick(email)}>
      <TD first>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
          {email.subject}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{email.from}</div>
      </TD>
      <TD><Badge>{email.classification}</Badge></TD>
      <TD><ConfBar val={email.confidence} /></TD>
      <TD>
        <Badge>{email.status}</Badge>
        {email.slaRisk && (
          <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--red)', fontWeight: 600 }}>⚠</span>
        )}
      </TD>
      <TD>
        {email.owner ? (
          <span style={{ fontSize: 11, color: 'var(--text2)' }}>{email.owner}</span>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>—</span>
        )}
      </TD>
      <TD>
        {email.jiraId ? (
          <span style={{ fontSize: 11, color: 'var(--teal)', fontFamily: 'var(--mono)' }}>{email.jiraId}</span>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>—</span>
        )}
      </TD>
      <TD last>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{email.receivedAt}</span>
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

  const load = useCallback(async () => {
    setLoading(true);
    const res = await emailApi.list({ search, status, classification, page, perPage: PER });
    setEmails(res.data);
    setTotal(res.total);
    setTotalPages(res.totalPages);
    // Auto-select first email if available
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

  const pendingCount = emails.filter(e => e.status === 'Pending' || e.status === 'Normalized').length;
  const highPriorityCount = emails.filter(e => e.priority === 'High').length;

  const classifications = [
    'Investor Inquiry', 'Account Maintenance', 'Reporting Request',
    'Onboarding', 'Document Request', 'Compliance',
    'Wire Instruction', 'Redemption Request'
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SectionHeader
          title="Email Triage Queue"
          count={total} countLabel="emails"
          color="var(--blue)"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <DataTable columns={['Subject / From', 'Classification', 'Confidence', 'Status', 'Owner', 'JIRA', 'Received']}>
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
          onAction={load} 
        />
      )}
    </div>
  );
}