import React, { useState, useEffect, useCallback } from 'react';
import { documentApi } from '../mockData';
import { 
  Badge, ConfBar, FilterBar, SectionHeader, DataTable, TR, TD, 
  DetailPanel, InfoGrid, ActionBtn, SubTitle, AlertBox, Pagination, 
  Spinner, EmptyState 
} from './index';

// ─── FIELD ITEM ──────────────────────────────────────────────────────────────

function FieldItem({ field, index }) {
  const statusColors = {
    ok: 'var(--green)',
    review: 'var(--amber)',
    flag: 'var(--red)',
  };
  const statusLabels = {
    ok: '✓ Validated',
    review: '⚠ Under Review',
    flag: '✗ Needs Review',
  };
  const color = statusColors[field.status] || 'var(--text3)';

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: index < 11 ? '0.5px solid var(--border)' : 'none',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--text2)' }}>{field.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 1 }}>{field.value}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <ConfBar val={field.confidence} width={40} />
        <span style={{ 
          fontSize: 9, 
          color: color,
          background: `${color}15`,
          padding: '1px 6px',
          borderRadius: 3,
          whiteSpace: 'nowrap',
        }}>
          {statusLabels[field.status]}
        </span>
      </div>
    </div>
  );
}

// ─── DOCUMENT DETAIL ─────────────────────────────────────────────────────────

function DocumentDetail({ doc, onClose, onAction }) {
  const [loading, setLoading] = useState('');

  async function handleValidate() {
    setLoading('validate');
    await documentApi.validate(doc.id);
    setLoading('');
    onAction?.('validated', doc.id);
  }

  async function handleFlag() {
    setLoading('flag');
    await documentApi.flagReview(doc.id, 'Manual review required');
    setLoading('');
    onAction?.('flagged', doc.id);
  }

  const flaggedFields = doc.fields.filter(f => f.status === 'flag');
  const reviewFields = doc.fields.filter(f => f.status === 'review');

  return (
    <DetailPanel 
      title="Document Extraction Detail" 
      badge={doc.status} 
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          {doc.status === 'Under Review' && (
            <>
              <ActionBtn color="var(--green)" onClick={handleValidate} disabled={loading === 'validate'}>
                {loading === 'validate' ? '…Validating' : '✓ Validate & Approve'}
              </ActionBtn>
              <ActionBtn color="var(--red)" outline onClick={handleFlag} disabled={loading === 'flag'}>
                {loading === 'flag' ? '…Flagging' : 'Flag for Review'}
              </ActionBtn>
            </>
          )}
          {doc.status === 'Validated' && (
            <ActionBtn color="var(--green)" disabled>
              ✓ Validated
            </ActionBtn>
          )}
          {doc.status === 'Extracted' && (
            <ActionBtn color="var(--blue)" onClick={handleValidate} disabled={loading === 'validate'}>
              {loading === 'validate' ? '…Processing' : 'Review & Validate'}
            </ActionBtn>
          )}
          {doc.status === 'Failed' && (
            <ActionBtn color="var(--red)" disabled>
              ✗ Failed — Re-extract required
            </ActionBtn>
          )}
        </div>
      }
    >
      <InfoGrid items={[
        ['Document Type', doc.docType],
        ['Client', doc.client],
        ['Fund', doc.fund],
        ['Status', <Badge size="lg">{doc.status}</Badge>],
        ['Received', doc.receivedAt],
        ['Pages', doc.pages],
        ['Source', doc.source],
        ['OCR Engine', doc.ocrEngine],
        ['Fields Extracted', `${doc.fieldsExtracted} / ${doc.fieldsTotal}`],
        ['Overall Confidence', `${doc.confidence}%`],
      ]} />

      {doc.flagged && (
        <AlertBox type="error" title="Document Flagged">
          This document has been flagged for manual review. Please verify the extracted data against the original document.
        </AlertBox>
      )}

      {flaggedFields.length > 0 && (
        <AlertBox type="error" title={`${flaggedFields.length} field${flaggedFields.length > 1 ? 's' : ''} flagged`}>
          The following fields require manual verification: {flaggedFields.map(f => f.name).join(', ')}
        </AlertBox>
      )}

      {reviewFields.length > 0 && (
        <AlertBox type="warning" title={`${reviewFields.length} field${reviewFields.length > 1 ? 's' : ''} under review`}>
          These fields have confidence below 85% and should be reviewed: {reviewFields.map(f => f.name).join(', ')}
        </AlertBox>
      )}

      <SubTitle right={`${doc.fields.filter(f => f.status === 'ok').length} validated`}>
        Extracted Fields
      </SubTitle>
      
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '2px 12px' }}>
        {doc.fields.map((field, i) => (
          <FieldItem key={i} field={field} index={i} />
        ))}
      </div>
    </DetailPanel>
  );
}

// ─── DOCUMENT ROW ────────────────────────────────────────────────────────────

function DocumentRow({ doc, selected, onClick }) {
  const statusColors = {
    'Processing': 'var(--purple)',
    'Extracted': 'var(--blue)',
    'Under Review': 'var(--amber)',
    'Validated': 'var(--green)',
    'Failed': 'var(--red)',
  };

  return (
    <TR selected={selected} onClick={() => onClick(doc)}>
      <TD first>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{doc.docType}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{doc.client}</div>
      </TD>
      <TD>
        <div style={{ fontSize: 11, color: 'var(--text2)' }}>{doc.fund}</div>
      </TD>
      <TD>
        <ConfBar val={doc.confidence} />
      </TD>
      <TD>
        <Badge>{doc.status}</Badge>
      </TD>
      <TD>
        <span style={{ fontSize: 11, color: 'var(--text2)' }}>
          {doc.fieldsExtracted}/{doc.fieldsTotal}
        </span>
      </TD>
      <TD>
        {doc.flagged ? (
          <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 500 }}>⚠ Flagged</span>
        ) : doc.status === 'Validated' ? (
          <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Clear</span>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>—</span>
        )}
      </TD>
      <TD last>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{doc.receivedAt}</span>
      </TD>
    </TR>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────────────────────

export default function UC11() {
  const [docs, setDocs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const PER = 10;

  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await documentApi.list({ search, status, page, perPage: PER });
    setDocs(res.data);
    setTotal(res.total);
    setTotalPages(res.totalPages);
    if (!selected && res.data.length) setSelected(res.data[0]);
    setLoading(false);
  }, [search, status, page]);

  useEffect(() => { setPage(1); }, [search, status]);
  useEffect(() => { load(); }, [load]);

  const flaggedCount = docs.filter(d => d.flagged).length;
  const processingCount = docs.filter(d => d.status === 'Processing' || d.status === 'Extracted').length;

  return (
    <div className="fade-in" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SectionHeader
          title="Document Extraction Queue"
          count={total} countLabel="documents"
          color="var(--purple)"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {processingCount > 0 && (
                <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: 'var(--blue-bg)', color: 'var(--blue)', border: '0.5px solid var(--blue-bd)' }}>
                  {processingCount} processing
                </div>
              )}
              {flaggedCount > 0 && (
                <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: 'var(--red-bg)', color: 'var(--red)', border: '0.5px solid var(--red-bd)' }}>
                  {flaggedCount} flagged
                </div>
              )}
            </div>
          }
        />

        <FilterBar
          search={search} setSearch={setSearch}
          placeholder="Search by document type, client, or fund…"
          filters={[
            { label: 'All Statuses', value: status, onChange: setStatus, options: ['Processing', 'Extracted', 'Under Review', 'Validated', 'Failed'] },
          ]}
        />

        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>
        ) : docs.length === 0 ? (
          <EmptyState 
            icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
            title="No documents found" 
            sub="Try adjusting your search or filter criteria" 
          />
        ) : (
          <DataTable columns={['Document / Client', 'Fund', 'Confidence', 'Status', 'Fields', 'Flags', 'Received']}>
            {docs.map(d => (
              <DocumentRow 
                key={d.id} 
                doc={d} 
                selected={selected?.id === d.id} 
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
          accentColor="var(--purple)" 
        />
      </div>

      {selected && (
        <DocumentDetail 
          doc={selected} 
          onClose={() => setSelected(null)} 
          onAction={load} 
        />
      )}
    </div>
  );
}