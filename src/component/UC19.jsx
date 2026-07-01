import React, { useState, useEffect, useCallback } from 'react';
import { feeApi } from '../mockData/index';
import { FEE_STATUSES, FEE_TYPES, CALC_SOURCES } from '../mockData/mockData';
import { Badge, ConfBar, FilterBar, SectionHeader, DataTable, TR, TD, DetailPanel, InfoGrid, ActionBtn, SubTitle, AlertBox, Pagination, Spinner, EmptyState } from './index';

// ─── WATERFALL TABLE ──────────────────────────────────────────────────────────

function WaterfallTable({ waterfall }) {
  return (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 14 }}>
      {waterfall.map((row, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '9px 12px',
          borderBottom: i < waterfall.length - 1 ? '0.5px solid var(--border)' : 'none',
          background: row.highlight ? 'rgba(0,212,160,.06)' : 'transparent',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: row.highlight ? 600 : 400, color: row.highlight ? 'var(--green)' : 'var(--text)' }}>
              {row.label}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{row.note}</div>
          </div>
          <div style={{
            fontSize: 12, fontFamily: 'var(--mono)', fontWeight: row.highlight ? 700 : 500,
            color: row.highlight ? 'var(--green)' : row.value.startsWith('-') ? 'var(--red)' : 'var(--text)',
            letterSpacing: '-0.3px',
          }}>
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FEE DETAIL ──────────────────────────────────────────────────────────────

function FeeDetail({ calc, onClose, onAction }) {
  const [loading, setLoading] = useState('');

  async function handleApprove() {
    setLoading('approve');
    await feeApi.approve(calc.id);
    setLoading('');
    onAction?.('approved', calc.id);
  }

  async function handleExport() {
    setLoading('export');
    await feeApi.exportToGeneva(calc.id);
    setLoading('');
    onAction?.('exported', calc.id);
  }

  const netFee = calc.waterfall[calc.waterfall.length - 1];

  return (
    <DetailPanel title="Fee Calculation Detail" badge={calc.status} onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <ActionBtn color="var(--green)" onClick={handleApprove} disabled={loading === 'approve' || calc.status === 'Completed'}>
            {loading === 'approve' ? '…Approving' : calc.status === 'Completed' ? '✓ Approved' : '✓ Approve'}
          </ActionBtn>
          <ActionBtn color="var(--text2)" outline onClick={handleExport} disabled={loading === 'export'}>
            {loading === 'export' ? '…Exporting' : `Export to ${calc.calcSource} ↗`}
          </ActionBtn>
        </div>
      }>

      {calc.exceptions > 0 && (
        <AlertBox type="error" title={`${calc.exceptions} exception${calc.exceptions > 1 ? 's' : ''} detected`}>
          Side letter terms or unusual triggers may affect this calculation. Manual verification required before approval.
        </AlertBox>
      )}

      {calc.reconciled && (
        <AlertBox type="success" title="Reconciled">
          This fee calculation has been reconciled against the source system and approved.
        </AlertBox>
      )}

      <InfoGrid items={[
        ['Fund', calc.fund, true],
        ['Client', calc.client],
        ['Period', calc.period],
        ['Fee Type', <Badge size="lg">{calc.feeType}</Badge>],
        ['AUM', calc.aum],
        ['Applied Rate', calc.rate],
        ['Data Source', calc.calcSource],
        ['Computed At', calc.computedAt, true],
      ]} />

      <SubTitle right={<span style={{ color: netFee?.highlight ? 'var(--green)' : 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{netFee?.value}</span>}>
        Waterfall Calculation
      </SubTitle>
      <WaterfallTable waterfall={calc.waterfall} />

      {/* Automation score */}
      <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
          <span style={{ color: 'var(--text2)' }}>Automation Rate</span>
          <span style={{ color: calc.automationRate >= 90 ? 'var(--green)' : 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
            {calc.automationRate}%
          </span>
        </div>
        <ConfBar val={calc.automationRate} width={200} />
      </div>
    </DetailPanel>
  );
}

// ─── FEE ROW ─────────────────────────────────────────────────────────────────

function FeeRow({ calc, selected, onClick }) {
  return (
    <TR selected={selected} onClick={() => onClick(calc)}>
      <TD first>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{calc.fund}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{calc.client}</div>
      </TD>
      <TD><Badge>{calc.feeType}</Badge></TD>
      <TD><span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{calc.period}</span></TD>
      <TD>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--green)', letterSpacing: '-0.3px' }}>
          {calc.calculatedFee}
        </span>
      </TD>
      <TD><span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{calc.aum}</span></TD>
      <TD><ConfBar val={calc.automationRate} /></TD>
      <TD><Badge>{calc.status}</Badge></TD>
      <TD>
        {calc.exceptions > 0
          ? <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 500 }}>{calc.exceptions} exc.</span>
          : <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Clear</span>}
      </TD>
      <TD last>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{calc.calcSource}</span>
      </TD>
    </TR>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────────────────────

export default function UC19() {
  const [calcs, setCalcs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [feeType, setFeeType] = useState('');
  const [page, setPage] = useState(1);
  const PER = 10;

  const [selected, setSelected] = useState(null);

  const totalFees = calcs.reduce((s, c) => s + c.feeAmtRaw, 0);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await feeApi.list({ search, status, feeType, page, perPage: PER });
    setCalcs(res.data);
    setTotal(res.total);
    setTotalPages(res.totalPages);
    if (!selected && res.data.length) setSelected(res.data[0]);
    setLoading(false);
  }, [search, status, feeType, page]);

  useEffect(() => { setPage(1); }, [search, status, feeType]);
  useEffect(() => { load(); }, [load]);

  const excCount = calcs.filter(c => c.exceptions > 0).length;

  return (
    <div className="fade-in" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SectionHeader
          title="Fee Calculation Queue"
          count={total} countLabel="calculations"
          color="var(--amber)"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {excCount > 0 && (
                <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: 'var(--red-bg)', color: 'var(--red)', border: '0.5px solid var(--red-bd)' }}>
                  {excCount} with exceptions
                </div>
              )}
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                Processed: <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontWeight: 600 }}>${(totalFees / 1000).toFixed(0)}K</span>
              </div>
            </div>
          }
        />

        <FilterBar
          search={search} setSearch={setSearch}
          placeholder="Search by fund, client, or fee type…"
          filters={[
            { label: 'All Statuses', value: status, onChange: setStatus, options: FEE_STATUSES },
            { label: 'All Fee Types', value: feeType, onChange: setFeeType, options: FEE_TYPES },
            { label: 'All Sources', value: '', onChange: () => {}, options: CALC_SOURCES },
          ]}
        />

        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>
        ) : calcs.length === 0 ? (
          <EmptyState icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>} title="No fee calculations found" sub="Try adjusting your search or filter criteria" />
        ) : (
          <DataTable columns={['Fund / Client', 'Fee Type', 'Period', 'Calculated Fee', 'AUM', 'Automation', 'Status', 'Exceptions', 'Source']}>
            {calcs.map(c => <FeeRow key={c.id} calc={c} selected={selected?.id === c.id} onClick={setSelected} />)}
          </DataTable>
        )}

        <Pagination page={page} totalPages={totalPages} total={total} perPage={PER} onChange={setPage} accentColor="var(--amber)" />
      </div>

      {selected && <FeeDetail calc={selected} onClose={() => setSelected(null)} onAction={load} />}
    </div>
  );
}