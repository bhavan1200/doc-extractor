// src/component/UC10Overview.jsx
// UC-10 Intelligent Email Triage — SOW-grounded dashboard
// Sources: IBM - Triage Email SOW (1335933.11) + Services Schedule (1335948.8)

import React, { useState } from 'react';
import { EMAILS, EMAIL_CLASSIFICATIONS } from '../mockData/mockData';
import { Badge } from './index';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ReferenceLine,
} from 'recharts';

// ─── SOW CONSTANTS ────────────────────────────────────────────────────────────
const SOW = {
  // Schedule 3 — KPIs
  baselineHrsPer2500:       4.4,      // 4.4 hrs to triage 2,500 emails (Sched 3)
  targetHrsPer2500:         1.1,      // 75% reduction target (Sched 3)
  triageReductionTarget:    75,       // % triage time reduction (Sched 3)
  accuracyFloor:            76,       // contractual AI accuracy floor (Sched 3)
  baselineMinPerEmail:      0.5,      // 30 sec = 0.5 min (Sched 3)
  // Schedule 2 — FTEs
  baselineFTEsResponse:     18.6,     // response-handling FTE baseline (Sched 2)
  targetFTEsResponse:       7.4,      // 60% reduction target (Sched 2)
  fteReductionTarget:       60,       // % FTE reduction (Sched 2)
  annualBaselineSpend:      1916480,  // 18.6 FTEs × 1,880 hrs × $54.76/hr (Sched 2)
  transformationValue:      1149512,  // agreed SOW transformation value (Sched 2)
  gainshareTotal:           344853,   // IBM 30% of $1,149,512 (Sched 2)
  goLiveDate:               'Sep 11, 2026',
};
// blended rate: $1,149,512 ÷ (18.6 × 1,880) = $32.90/hr
const BLENDED_RATE = SOW.transformationValue / (SOW.baselineFTEsResponse * 1880);

// ─── POST GO-LIVE SIMULATION ─────────────────────────────────────────────────
const SIM = {
  emailsProcessed:         3241,
  currentHrsPer2500:       1.85,   // 58% reduction achieved (target 75%)
  triageReductionPct:      58,
  currentMinPerEmail:      0.215,
  accuracyPct:             87,
  reclassRate:             10,
  fteReductionPct:         38,
  currentFTEs:             11.5,
  goLiveDays:              10,
};
// Derived
const baselineHrsAnnual     = SOW.baselineHrsPer2500 * 52;         // 228.8
const currentHrsAnnual      = SIM.currentHrsPer2500 * 52;          // 96.2
const hrsSavedAnnualRunRate = baselineHrsAnnual - currentHrsAnnual; // 132.6
const hrsSavedToDate        = (SOW.baselineMinPerEmail - SIM.currentMinPerEmail) / 60 * SIM.emailsProcessed;
const dollarsSavedToDate    = Math.round(hrsSavedToDate * BLENDED_RATE);
const annualDollarsSaved    = Math.round(hrsSavedAnnualRunRate * BLENDED_RATE);
const annualTargetSavings   = Math.round((baselineHrsAnnual - SOW.targetHrsPer2500 * 52) * BLENDED_RATE);
const annualSavingsPct      = Math.round((annualDollarsSaved / annualTargetSavings) * 100);
// FTE-days of capacity freed (8-hr day)
const capacityDays          = Math.round(hrsSavedToDate / 8);

const BLUE   = '#4a9eff';
const TEAL   = '#2dd4bf';
const GREEN  = '#00d4a0';
const AMBER  = '#f5a623';
const RED    = '#ff5c72';
const PURPLE = '#a78bfa';

// ─── KPI CARD ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, target, subValue, color, statusText, progress }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg2)',
        border: `0.5px solid ${hov ? color : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: hov ? `0 0 0 1px ${color}22, 0 8px 24px rgba(0,0,0,.3)` : 'none',
        flex: 1, minWidth: 0,
      }}
    >
      <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 22, fontWeight: 600, color, fontFamily: 'var(--mono)', letterSpacing: '-0.5px', lineHeight: 1 }}>
          {value}
        </div>
        {target && (
          <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)', padding: '1px 6px', background: 'var(--bg4)', borderRadius: 3 }}>
            Target: {target}
          </div>
        )}
      </div>
      {subValue && <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 3 }}>{subValue}</div>}
      {statusText && <div style={{ fontSize: 10, color, marginTop: 3, fontWeight: 500 }}>{statusText}</div>}
      {progress !== undefined && (
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', background: color, borderRadius: 2, transition: 'width .6s ease' }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KPI ROW ─────────────────────────────────────────────────────────────────
function UC10KpiRow() {
  const reductionColor  = SIM.triageReductionPct >= SOW.triageReductionTarget ? GREEN : SIM.triageReductionPct >= 50 ? AMBER : RED;
  const reductionStatus = SIM.triageReductionPct >= SOW.triageReductionTarget
    ? '✅ Target achieved'
    : `⚡ ${SOW.triageReductionTarget - SIM.triageReductionPct}% more to target`;
  const accuracyColor  = SIM.accuracyPct >= SOW.accuracyFloor ? GREEN : RED;
  const fteColor       = SIM.fteReductionPct >= SOW.fteReductionTarget ? GREEN : AMBER;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 8 }}>
      <KpiCard
        label="Triage Time / 2,500 Emails"
        value={`${SIM.currentHrsPer2500}h`}
        target={`${SOW.targetHrsPer2500}h`}
        subValue={`Baseline: ${SOW.baselineHrsPer2500}h · ${SIM.triageReductionPct}% reduced`}
        color={reductionColor}
        statusText={reductionStatus}
        progress={SIM.triageReductionPct}
      />
      <KpiCard
        label="AI Classification Accuracy"
        value={`${SIM.accuracyPct}%`}
        target={`${SOW.accuracyFloor}%`}
        subValue={`${SIM.emailsProcessed.toLocaleString()} emails classified`}
        color={accuracyColor}
        statusText={SIM.accuracyPct >= SOW.accuracyFloor ? '✅ Above floor' : '⚠️ Below floor'}
        progress={SIM.accuracyPct}
      />
      <KpiCard
        label="Team Time Freed — Since Go-Live"
        value={`${Math.round(hrsSavedToDate)}h`}
        subValue={`${capacityDays} FTE-days · ${SIM.goLiveDays} days running`}
        color={TEAL}
        statusText={`${(SOW.baselineMinPerEmail - SIM.currentMinPerEmail).toFixed(2)} min saved per email`}
      />
      <KpiCard
        label="Annual Time Saving — Run Rate"
        value={`${Math.round(hrsSavedAnnualRunRate)}h/yr`}
        target={`${Math.round(baselineHrsAnnual - SOW.targetHrsPer2500 * 52)}h/yr`}
        subValue={`${annualSavingsPct}% of annual target`}
        color={annualSavingsPct >= 100 ? GREEN : AMBER}
        statusText={`Target at 75% reduction: ${Math.round(baselineHrsAnnual - SOW.targetHrsPer2500 * 52)}h/yr`}
        progress={annualSavingsPct}
      />
      <KpiCard
        label="FTE Reduction"
        value={`${SIM.fteReductionPct}%`}
        target={`${SOW.fteReductionTarget}%`}
        subValue={`${SIM.currentFTEs} current (baseline: ${SOW.baselineFTEsResponse})`}
        color={fteColor}
        statusText={`Target: ${SOW.targetFTEsResponse} FTEs · Sched 2`}
        progress={SIM.fteReductionPct}
      />
    </div>
  );
}

// ─── SEI COST AVOIDANCE + IBM CONTRACT PANEL ─────────────────────────────────
function SeiIbmPanel() {
  const gainshareEarned = 104853; // Phase I initial (30 days × daily accrual)
  const gainPct = Math.round((gainshareEarned / SOW.gainshareTotal) * 100);
  const phases = [
    { label: 'Phase I Initial',   amount: 86213,  paid: true,  date: 'Oct 11, 2026' },
    { label: 'Phase I Remaining', amount: 172426, paid: false, date: 'Dec 11, 2026' },
    { label: 'Phase II + III',    amount: SOW.gainshareTotal - 86213 - 172426, paid: false, date: 'Subsequent' },
  ];

  const seiCols = [
    {
      label: 'SEI Cost Avoided — To Date',
      value: `$${dollarsSavedToDate.toLocaleString()}`,
      sub: `${Math.round(hrsSavedToDate)} hrs freed · ${SIM.emailsProcessed.toLocaleString()} emails`,
      detail: `@ $${BLENDED_RATE.toFixed(2)}/hr blended · ${(SOW.baselineMinPerEmail - SIM.currentMinPerEmail).toFixed(2)} min saved/email`,
      color: TEAL,
      badge: null,
    },
    {
      label: 'Annual Cost Savings — Run Rate',
      value: `$${Math.round(annualDollarsSaved / 1000)}K/yr`,
      sub: `${annualSavingsPct}% toward $${Math.round(annualTargetSavings / 1000)}K/yr target`,
      detail: `Projection at current ${SIM.triageReductionPct}% triage reduction · full 75% target = $${Math.round(annualTargetSavings / 1000)}K/yr`,
      color: annualSavingsPct >= 100 ? GREEN : AMBER,
      badge: annualSavingsPct >= 100 ? '✅ On target' : `${100 - annualSavingsPct}% to go`,
    },
    {
      label: 'Response Team Capacity Reclaimed',
      value: `${capacityDays} days`,
      sub: `${Math.round(hrsSavedToDate)} hrs returned to IS response team`,
      detail: `${SIM.fteReductionPct}% of response FTEs freed — staff redirected to investor relations & exception handling`,
      color: PURPLE,
      badge: null,
    },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Row 1 — SEI Cost Avoidance */}
      <div style={{
        background: 'var(--bg2)', border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        borderBottom: 'none', padding: '8px 0',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        <div style={{ gridColumn: '1 / -1', padding: '0 16px 6px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '0.5px solid var(--border)', marginBottom: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: TEAL, textTransform: 'uppercase', letterSpacing: '.06em' }}>SEI · Cost Avoidance</div>
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>What the triage transformation is saving SEI — cumulative since Sep 11, 2026 go-live</div>
        </div>
        {seiCols.map((col, i) => (
          <div key={col.label} style={{ padding: '8px 16px', borderRight: i < seiCols.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{col.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: col.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{col.value}</div>
              {col.badge && (
                <div style={{ fontSize: 8, padding: '1px 6px', background: col.color + '22', color: col.color, borderRadius: 10, fontWeight: 500 }}>{col.badge}</div>
              )}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text2)', marginBottom: 2 }}>{col.sub}</div>
            <div style={{ fontSize: 8, color: 'var(--text3)', lineHeight: 1.4 }}>{col.detail}</div>
          </div>
        ))}
      </div>

      {/* Row 2 — IBM Contract */}
      <div style={{
        background: 'var(--bg3)', border: '0.5px solid var(--border)',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        padding: '8px 0', display: 'grid',
        gridTemplateColumns: 'auto 1fr 1fr 1fr', alignItems: 'stretch',
      }}>
        <div style={{ padding: '6px 14px', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: '.06em' }}>IBM</div>
          <div style={{ fontSize: 8, color: 'var(--text3)', maxWidth: 72, lineHeight: 1.4 }}>Contract financials</div>
        </div>
        <div style={{ padding: '6px 16px', borderRight: '0.5px solid var(--border)' }}>
          <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Agreed Transformation Value</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: BLUE, fontFamily: 'var(--mono)', lineHeight: 1, marginBottom: 2 }}>${(SOW.transformationValue / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>SOW Schedule 2 · ${SOW.annualBaselineSpend.toLocaleString()} baseline × {SOW.fteReductionTarget}% FTE reduction</div>
        </div>
        <div style={{ padding: '6px 16px', borderRight: '0.5px solid var(--border)' }}>
          <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>IBM Gainshare (30%)</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: BLUE, fontFamily: 'var(--mono)', lineHeight: 1 }}>${(gainshareEarned / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 9, color: 'var(--text3)' }}>of ${(SOW.gainshareTotal / 1000).toFixed(0)}K total</div>
          </div>
          <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', marginBottom: 2 }}>
            <div style={{ width: `${gainPct}%`, height: '100%', background: BLUE, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>{gainPct}% earned · Phase I initial payment Oct 11, 2026</div>
        </div>
        <div style={{ padding: '6px 16px' }}>
          <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>Phase Payment Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {phases.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: p.paid ? GREEN : 'var(--bg4)', border: p.paid ? 'none' : '1px solid var(--border2)' }} />
                <div style={{ fontSize: 8, color: p.paid ? 'var(--text2)' : 'var(--text3)', flex: 1 }}>{p.label}</div>
                <div style={{ fontSize: 8, fontFamily: 'var(--mono)', color: p.paid ? GREEN : 'var(--text3)', fontWeight: p.paid ? 600 : 400 }}>${(p.amount / 1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL PIPELINE STRIP ────────────────────────────────────────────────────
function PipelineStrip() {
  const total     = SIM.emailsProcessed;
  const autoRoute = Math.round(total * 0.91);
  const humanRev  = Math.round(total * 0.044);
  const resolved  = Math.round(total * 0.86);
  const slaRisk   = Math.round(total * 0.005);

  const steps = [
    { label: 'Received',       count: total,     color: BLUE   },
    { label: 'AI Classified',  count: total,     color: TEAL   },
    { label: 'Auto-Routed',    count: autoRoute, color: GREEN  },
    { label: 'Human Review',   count: humanRev,  color: AMBER  },
    { label: 'Resolved',       count: resolved,  color: '#00d4a0' },
    { label: 'SLA At Risk',    count: slaRisk,   color: RED    },
  ];

  return (
    <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
        📋 Email Triage Pipeline
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: step.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>
                {step.count.toLocaleString()}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 4 }}>{step.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ fontSize: 14, color: 'var(--text3)', opacity: 0.4, flexShrink: 0, padding: '0 4px' }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Triage time progress bar */}
      <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginBottom: 6 }}>
          <span>Triage Time Reduction — per 2,500 email batch</span>
          <span style={{ fontFamily: 'var(--mono)', color: AMBER, fontWeight: 500 }}>
            {SIM.currentHrsPer2500}h actual · Target: {SOW.targetHrsPer2500}h
          </span>
        </div>
        <div style={{ position: 'relative', height: 6, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: `${(SOW.targetHrsPer2500 / SOW.baselineHrsPer2500) * 100}%`, top: 0, bottom: 0, width: 2, background: GREEN, opacity: 0.9 }} />
          <div style={{ width: `${(SIM.currentHrsPer2500 / SOW.baselineHrsPer2500) * 100}%`, height: '100%', background: BLUE, borderRadius: 3, transition: 'width .6s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 8, color: 'var(--text3)' }}>
          <span style={{ color: GREEN }}>● Target: {SOW.targetHrsPer2500}h</span>
          <span style={{ color: BLUE }}>● Current: {SIM.currentHrsPer2500}h</span>
          <span style={{ color: RED, opacity: 0.7 }}>● Baseline: {SOW.baselineHrsPer2500}h</span>
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL CATEGORY BREAKDOWN ─────────────────────────────────────────────────
// UC-10 equivalent of UC-11's OnboardingTypeSplit
// Two types: Auto-Routed (AI handles end-to-end) vs Human-Review (AI classifies, human acts)
function EmailCategoryBreakdown() {
  const total      = SIM.emailsProcessed;
  const autoRouted = Math.round(total * 0.91);
  const humanRev   = total - autoRouted;

  const rows = [
    {
      type:      'Auto-Routed',
      count:     autoRouted,
      pct:       91,
      baseline:  `${SOW.baselineMinPerEmail} min/email`,
      current:   `${SIM.currentMinPerEmail.toFixed(2)} min/email`,
      target:    '0.125 min/email',
      reduction: Math.round((1 - SIM.currentMinPerEmail / SOW.baselineMinPerEmail) * 100),
      annualVol: '~118K/yr at current pace',
      color:     TEAL,
      desc:      'AI classifies + routes with no human touch — JIRA ticket auto-created',
    },
    {
      type:      'Human Review',
      count:     humanRev,
      pct:       9,
      baseline:  `${SOW.baselineMinPerEmail} min/email`,
      current:   '0.38 min',
      target:    '0.18 min',
      reduction: Math.round((1 - 0.38 / SOW.baselineMinPerEmail) * 100),
      annualVol: '~11.7K/yr requiring analyst',
      color:     AMBER,
      desc:      'AI classifies with <76% confidence — routed to IS analyst for validation',
    },
  ];

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 16,
      marginBottom: 16,
    }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
        📊 Auto-Routed vs Human-Review Split
      </div>
      {rows.map(row => (
        <div key={row.type} style={{
          background: 'var(--bg3)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          marginBottom: 8,
          borderLeft: `3px solid ${row.color}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{row.type}</div>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>
                {row.count.toLocaleString()} emails · {row.pct}% of volume · {row.annualVol}
              </div>
              <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 2, opacity: .8 }}>{row.desc}</div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: row.reduction >= SOW.triageReductionTarget ? GREEN : AMBER,
              fontFamily: 'var(--mono)',
            }}>
              {row.reduction}% reduction
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 9, marginBottom: 6 }}>
            <span style={{ color: 'var(--text3)' }}>Baseline: <span style={{ color: RED, fontWeight: 500 }}>{row.baseline}</span></span>
            <span style={{ color: 'var(--text3)' }}>Current: <span style={{ color: row.color, fontWeight: 500 }}>{row.current}</span></span>
            <span style={{ color: 'var(--text3)' }}>Target: <span style={{ color: GREEN, fontWeight: 500 }}>{row.target}</span></span>
          </div>
          <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(row.reduction, 100)}%`,
              height: '100%',
              background: row.reduction >= SOW.triageReductionTarget ? GREEN : row.color,
              borderRadius: 2,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── EMAIL CLASSIFICATION VOLUME CHART ───────────────────────────────────────
// UC-10 equivalent of UC-11's Phase1ClientVolumeChart
// Shows email volumes by classification type — derived from EMAILS mock data (reflects SOW categories)
const EMAIL_CATEGORY_VOLUMES = [
  { name: 'Investor Inquiry',    volume: 845, color: PURPLE },
  { name: 'Account Maintenance', volume: 612, color: BLUE   },
  { name: 'Reporting Request',   volume: 498, color: TEAL   },
  { name: 'Redemption Request',  volume: 387, color: AMBER  },
  { name: 'Document Request',    volume: 329, color: '#00d4a0' },
  { name: 'Wire Instruction',    volume: 285, color: '#f97316' },
  { name: 'Onboarding',          volume: 198, color: '#ec4899' },
  { name: 'Compliance',          volume: 87,  color: '#8b90aa' },
];
const EMAIL_CAT_TOTAL = EMAIL_CATEGORY_VOLUMES.reduce((s, c) => s + c.volume, 0);

function EmailCategoryVolumeChart() {
  const data = EMAIL_CATEGORY_VOLUMES
    .sort((a, b) => b.volume - a.volume)
    .map(c => ({ ...c, pct: Math.round((c.volume / EMAIL_CAT_TOTAL) * 100) }));

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 16,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          📦 Email Volume by Classification — Sched 2
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>
          {EMAIL_CAT_TOTAL.toLocaleString()} emails · {SIM.emailsProcessed.toLocaleString()} since go-live
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              formatter={(v, _, props) => [`${v.toLocaleString()} emails (${props.payload.pct}%)`, 'Volume']}
            />
            <Bar dataKey="volume" radius={[0, 3, 3, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: c.color, opacity: 0.85, flexShrink: 0, fontSize: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: c.color, fontWeight: 600 }}>{c.volume.toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 2, height: 2, background: 'var(--bg4)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', background: c.color }} />
                </div>
              </div>
              <span style={{ fontSize: 8, color: 'var(--text3)', flexShrink: 0, width: 26, textAlign: 'right' }}>{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FTE RESPONSE TEAM PANEL ─────────────────────────────────────────────────
// SOW Schedule 2 — actual response-team roles: IS Analyst I-III + Supervisor + Mgr
function FteResponsePanel() {
  // Actual SOW Sched 2 breakdown: 18.6 FTE baseline → 7.4 target (60% reduction)
  const roles = [
    { role: 'IS Analyst I',   baseline: 7.2, target: 2.9, current: 4.4, costUS: 52000, costIndia: 0 },
    { role: 'IS Analyst II',  baseline: 5.4, target: 2.2, current: 3.4, costUS: 62000, costIndia: 0 },
    { role: 'IS Analyst III', baseline: 3.2, target: 1.3, current: 2.1, costUS: 72000, costIndia: 0 },
    { role: 'IS Supervisor',  baseline: 2.8, target: 1.0, current: 1.6, costUS: 88000, costIndia: 0 },
  ];
  const totalBase    = roles.reduce((s, r) => s + r.baseline, 0);
  const totalCurrent = roles.reduce((s, r) => s + r.current, 0);
  const totalTarget  = roles.reduce((s, r) => s + r.target, 0);

  return (
    <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>👥 Response Team FTE — Schedule 2</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 9, color: 'var(--text3)' }}>
          <span style={{ color: BLUE }}>● {totalBase.toFixed(1)} Baseline</span>
          <span style={{ color: AMBER }}>● {totalCurrent.toFixed(1)} Current</span>
          <span style={{ color: TEAL }}>● {totalTarget.toFixed(1)} Target</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Total: ${SOW.annualBaselineSpend.toLocaleString()}/yr</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {roles.map((r, i) => {
          const pct       = Math.round((1 - r.current / r.baseline) * 100);
          const totalCost = Math.round(r.baseline * r.costUS);
          return (
            <div key={i} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px', borderTop: `2px solid ${BLUE}` }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 6, fontWeight: 500 }}>{r.role}</div>
              <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', display: 'flex', marginBottom: 6 }}>
                <div style={{ width: `${(r.current / r.baseline) * 100}%`, background: BLUE, height: '100%' }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                {r.current} <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text3)' }}>/ {r.baseline}</span>
              </div>
              <div style={{ fontSize: 8, color: BLUE, marginTop: 2 }}>{pct}% ↓ · Target {r.target}</div>
              <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 1 }}>${(totalCost / 1000).toFixed(0)}K/yr baseline</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 8, color: 'var(--text3)', opacity: .7 }}>
        Source: SOW Schedule 2 — Response team FTE model · {SOW.baselineFTEsResponse} FTE baseline → {SOW.targetFTEsResponse} target ({SOW.fteReductionTarget}% reduction) · Transformation value = ${SOW.transformationValue.toLocaleString()}
      </div>
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────
const CHART_COLORS = [BLUE, TEAL, AMBER, PURPLE, RED, GREEN, '#f97316', '#ec4899'];

function ClassificationChart() {
  const data = EMAIL_CLASSIFICATIONS.map((cls, i) => ({
    name: cls.split(' ')[0],
    fullName: cls,
    count: EMAILS.filter(e => e.classification === cls).length,
    color: CHART_COLORS[i],
  }));
  return (
    <ResponsiveContainer width="100%" height={155}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,.03)' }} contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          labelFormatter={(_, p) => p?.[0]?.payload?.fullName || ''} formatter={(v) => [v, 'Emails']} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function TriageTimeTrendChart() {
  const data = [
    { day: 'Sep 11', hrs: 3.8 }, { day: 'Sep 12', hrs: 3.4 }, { day: 'Sep 13', hrs: 3.1 },
    { day: 'Sep 14', hrs: 2.8 }, { day: 'Sep 15', hrs: 2.6 }, { day: 'Sep 16', hrs: 2.4 },
    { day: 'Sep 17', hrs: 2.2 }, { day: 'Sep 18', hrs: 2.0 }, { day: 'Sep 19', hrs: 1.9 },
    { day: 'Sep 20', hrs: 1.85 },
  ];
  return (
    <ResponsiveContainer width="100%" height={155}>
      <LineChart data={data} margin={{ top: 4, right: 24, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 4.8]} tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} unit="h" />
        <Tooltip cursor={{ stroke: 'var(--border2)', strokeWidth: 1 }} contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v) => [`${v}h`, 'Hrs / 2,500 emails']} />
        <ReferenceLine y={SOW.targetHrsPer2500} stroke={GREEN} strokeDasharray="4 3"
          label={{ value: `Target ${SOW.targetHrsPer2500}h`, fontSize: 8, fill: GREEN, position: 'insideTopRight' }} />
        <Line type="monotone" dataKey="hrs" stroke={BLUE} strokeWidth={2} dot={{ r: 3, fill: BLUE }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function AccuracyTrendChart() {
  const data = [
    { day: 'Sep 11', acc: 82 }, { day: 'Sep 12', acc: 84 }, { day: 'Sep 13', acc: 85 },
    { day: 'Sep 14', acc: 86 }, { day: 'Sep 15', acc: 87 }, { day: 'Sep 16', acc: 86 },
    { day: 'Sep 17', acc: 88 }, { day: 'Sep 18', acc: 87 }, { day: 'Sep 19', acc: 88 },
    { day: 'Sep 20', acc: 87 },
  ];
  return (
    <ResponsiveContainer width="100%" height={155}>
      <BarChart data={data} margin={{ top: 4, right: 24, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[70, 95]} tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,.03)' }} contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v) => [`${v}%`, 'Accuracy']} />
        <ReferenceLine y={SOW.accuracyFloor} stroke={RED} strokeDasharray="4 3"
          label={{ value: `Floor ${SOW.accuracyFloor}%`, fontSize: 8, fill: RED, position: 'insideTopRight' }} />
        <Bar dataKey="acc" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.acc >= SOW.accuracyFloor ? GREEN : RED} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── RECENT ACTIVITY ─────────────────────────────────────────────────────────
function RecentActivity({ emails }) {
  const items = emails || EMAILS;
  if (!items.length) return <div style={{ padding: 20, textAlign: 'center', color: 'var(--text3)', fontSize: 11 }}>No recent activity</div>;
  return (
    <div>
      {items.slice(0, 7).map((e, i) => (
        <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 6 ? '0.5px solid var(--border)' : 'none' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: e.slaRisk ? RED : GREEN, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.subject}</div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              {e.client} · {e.classification} · {e.receivedAt}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{e.confidence}%</span>
            <Badge size="sm">{e.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function UC10Overview({ dateRange, stats, activity }) {
  const dateRangeDisplay = dateRange?.start && dateRange?.end
    ? `${dateRange.start.toLocaleDateString()} – ${dateRange.end.toLocaleDateString()}`
    : 'Post Go-Live · Sep 11, 2026 onward';

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>📧 UC-10 · Intelligent Email Triage</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Go-live: <strong>{SOW.goLiveDate}</strong> · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--text3)' }}>
          <span>📧 {SIM.emailsProcessed.toLocaleString()} emails</span>
          <span style={{ color: SIM.triageReductionPct >= SOW.triageReductionTarget ? GREEN : AMBER, fontWeight: 500 }}>
            ⏱ {SIM.triageReductionPct}% reduction · Target {SOW.triageReductionTarget}%
          </span>
          <span style={{ color: SIM.accuracyPct >= SOW.accuracyFloor ? GREEN : RED, fontWeight: 500 }}>
            🎯 {SIM.accuracyPct}% accuracy · Floor {SOW.accuracyFloor}%
          </span>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <UC10KpiRow />

      {/* SEI + IBM two-row panel */}
      <SeiIbmPanel />

      {/* Pipeline + Category Breakdown side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <PipelineStrip />
        <EmailCategoryBreakdown />
      </div>

      {/* Email Category Volume + FTE side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <EmailCategoryVolumeChart />
        <FteResponsePanel />
      </div>

      {/* 3 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>📊 Email Classification Mix</div>
          <ClassificationChart />
        </div>
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>⏱ Triage Time Trend (hrs/2,500)</div>
            <div style={{ fontSize: 8, color: GREEN }}>Target {SOW.targetHrsPer2500}h</div>
          </div>
          <TriageTimeTrendChart />
          <div style={{ display: 'flex', gap: 10, fontSize: 8, color: 'var(--text3)', marginTop: 6 }}>
            <span style={{ color: BLUE }}>— Actual</span>
            <span style={{ color: GREEN }}>- - Target</span>
            <span style={{ color: 'var(--text3)' }}>Baseline: {SOW.baselineHrsPer2500}h</span>
          </div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>🎯 AI Accuracy Trend</div>
            <div style={{ fontSize: 8, color: RED }}>Floor {SOW.accuracyFloor}%</div>
          </div>
          <AccuracyTrendChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>📋 Recent Email Activity</div>
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>⚠️ PII data redacted · showing confidence score</div>
        </div>
        <RecentActivity emails={activity} />
      </div>

      {/* SOW Reference Footer */}
      <div style={{ padding: '8px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 9, color: 'var(--text3)' }}>
        <span>📌 <strong>Triage target:</strong> {SOW.baselineHrsPer2500}h→{SOW.targetHrsPer2500}h per 2,500 emails ({SOW.triageReductionTarget}% reduction) — Sched 3</span>
        <span>📌 <strong>Accuracy floor:</strong> {SOW.accuracyFloor}% — Sched 3</span>
        <span>📌 <strong>FTE target:</strong> {SOW.baselineFTEsResponse}→{SOW.targetFTEsResponse} response FTEs ({SOW.fteReductionTarget}% reduction) — Sched 2</span>
        <span>📌 <strong>Transformation value:</strong> ${SOW.transformationValue.toLocaleString()} · IBM gainshare: ${SOW.gainshareTotal.toLocaleString()} (30%) — Sched 2</span>
        <span>📌 <strong>Blended rate:</strong> ${BLENDED_RATE.toFixed(2)}/hr</span>
      </div>
    </div>
  );
}
