import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../mockData/index';
import { EMAILS, DOCUMENTS, FEE_CALCS, EMAIL_CLASSIFICATIONS } from '../mockData/mockData';
import { Badge, SlaBar, Spinner } from './index';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function UcCard({ ucId, label, color, icon, stats, sla, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ flex: 1, minWidth: 220, background: 'var(--bg2)', border: `0.5px solid ${hov ? color : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: 16, cursor: 'pointer', transition: 'border-color .2s, box-shadow .2s', boxShadow: hov ? `0 0 0 1px ${color}22, 0 8px 24px rgba(0,0,0,.3)` : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, border: `0.5px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: '.05em' }}>{ucId}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginTop: 1 }}>{label}</div>
          </div>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text3)', padding: '2px 7px', border: '0.5px solid var(--border)', borderRadius: 4, transition: 'color .2s', ...(hov ? { color: color } : {}) }}>
          View →
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 6, marginBottom: 2 }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 17, fontWeight: 600, color: s.alert ? 'var(--red)' : color, fontFamily: 'var(--mono)', letterSpacing: '-0.5px', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <SlaBar pct={sla} color={color} />
    </div>
  );
}

const CHART_COLORS = ['#4a9eff', '#2dd4bf', '#f5a623', '#a78bfa', '#ff5c72', '#00d4a0', '#f97316', '#ec4899'];

function ClassificationChart() {
  const data = EMAIL_CLASSIFICATIONS.map((cls, i) => ({
    name: cls.split(' ')[0],
    fullName: cls,
    count: EMAILS.filter(e => e.classification === cls).length,
    color: CHART_COLORS[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,.03)' }}
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
          formatter={(v) => [v, 'Emails']}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function DocStatusChart() {
  const statuses = ['Processing', 'Extracted', 'Under Review', 'Validated', 'Failed'];
  const colors   = ['var(--purple)', 'var(--blue)', 'var(--amber)', 'var(--green)', 'var(--red)'];
  const data = statuses.map((s, i) => ({
    name: s.split(' ')[0],
    count: DOCUMENTS.filter(d => d.status === s).length,
    color: colors[i],
  }));
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,.03)' }} contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }} formatter={v => [v, 'Documents']} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.8} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Overview({ setTab }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    dashboardApi.getStats().then(setStats);
    dashboardApi.getRecentActivity(7).then(setActivity);
  }, []);

  if (!stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Spinner size={28} />
    </div>
  );

  const UC_CARDS = [
    {
      ucId: 'UC-10', label: 'Email Triage & Response', color: 'var(--blue)', tab: 'uc10',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>,
      stats: [
        { value: stats.uc10.received.toLocaleString(), label: 'Received' },
        { value: stats.uc10.autoRouted.toLocaleString(), label: 'Auto Routed' },
        { value: stats.uc10.humanReview, label: 'Human Review' },
        { value: stats.uc10.slaAtRisk, label: 'SLA At Risk', alert: true },
      ],
      sla: stats.uc10.slaCompliance,
    },
    {
      ucId: 'UC-11', label: 'Document Data Extraction', color: 'var(--purple)', tab: 'uc11',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      stats: [
        { value: stats.uc11.processed, label: 'Processed' },
        { value: `${stats.uc11.extractionAccuracy}%`, label: 'Accuracy' },
        { value: stats.uc11.validationQueue, label: 'In Queue' },
        { value: stats.uc11.exceptions, label: 'Exceptions', alert: true },
      ],
      sla: stats.uc11.slaCompliance,
    },
    {
      ucId: 'UC-19', label: 'Fee Calculation Automation', color: 'var(--amber)', tab: 'uc19',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>,
      stats: [
        { value: stats.uc19.runs, label: 'Calc Runs' },
        { value: `${stats.uc19.automationRate}%`, label: 'Automated' },
        { value: stats.uc19.exceptions, label: 'Exceptions', alert: true },
        { value: stats.uc19.reconciliations, label: 'Reconcil.', alert: true },
      ],
      sla: stats.uc19.slaCompliance,
    },
  ];

  return (
    <div className="fade-in" style={{ height: '100%', overflowY: 'auto', padding: 20 }}>

      {/* UC Cards */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Use Case Overview</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {UC_CARDS.map(c => <UcCard key={c.ucId} {...c} onClick={() => setTab(c.tab)} />)}
        </div>
      </div>

      {/* Charts + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

        {/* Email Classification Breakdown */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Email Classification</div>
          <ClassificationChart />
        </div>

        {/* Document Status Distribution */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Document Status</div>
          <DocStatusChart />
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Recent Activity</div>
          {activity.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < activity.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: e.slaRisk ? 'var(--red)' : 'var(--green)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.subject}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{e.client}</div>
              </div>
              <Badge>{e.status}</Badge>
            </div>
          ))}
        </div>

      </div>

      {/* Fee Type Summary */}
      <div style={{ marginTop: 14, background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Fee Calculation Summary — This Quarter</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {['Management Fee', 'Carried Interest', 'Incentive Fee', 'Administrative Fee'].map((ft, i) => {
            const items = FEE_CALCS.filter(c => c.feeType === ft);
            const total = items.reduce((s, c) => s + c.feeAmtRaw, 0);
            const colors = ['var(--blue)', 'var(--purple)', 'var(--teal)', 'var(--amber)'];
            const exc = items.filter(c => c.exceptions > 0).length;
            return (
              <div key={ft} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', borderLeft: `3px solid ${colors[i]}` }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5 }}>{ft}</div>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--mono)', color: colors[i], letterSpacing: '-0.5px' }}>
                  ${(total / 1000).toFixed(0)}K
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{items.length} calcs · {exc} exceptions</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}