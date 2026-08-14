// src/component/UC19Overview.jsx
// UC-19 Intelligent Fee Calculation — SOW-grounded dashboard
// Sources: IBM-SOW UC-19 with Schedules - Execution Version - 2 July 2026

import React, { useState } from 'react';
import { FEE_CALCS, FEE_TYPES, CALC_SOURCES } from '../mockData/mockData';
import { Badge } from './index';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ReferenceLine,
  PieChart, Pie, Cell as PieCell,
} from 'recharts';

// ─── SOW CONSTANTS ────────────────────────────────────────────────────────────
const SOW = {
  // Schedule 3 — Primary KPI
  processingTimeReductionTarget: 55,    // 55% avg processing time reduction (Sched 3)
  baselineMinPerCalc:            40,    // avg 40 min per fee calculation — baseline (Sched 2)
  targetMinPerCalc:              18,    // 40 × (1 - 0.55) = 18 min target (Sched 3)
  // Schedule 2 — FTE baseline
  baselineFTEs:                  48,    // ~48 FTEs on fee calculation (Sched 2)
  fteReductionTarget:            55,    // 55% FTE reduction (Sched 2)
  targetFTEs:                    21.6,  // 48 × 0.45 (Sched 2)
  annualBaselineSpend:           4617110,// $4,617,110 current-state (Sched 2)
  // Schedule 2 — Financial
  transformationValue:           2499411,// agreed transformation value (Sched 2)
  gainshareTotal:                749823, // IBM 30% of $2,499,411 (Sched 2)
  // Fee types in scope — Schedule 1
  feeTypesInScope: [
    { type: 'Management Fee',     baselineMin: 35, desc: 'Quarterly NAV × rate ÷ 4'          },
    { type: 'Carried Interest',   baselineMin: 68, desc: 'Waterfall calc with hurdle & catch-up' },
    { type: 'Incentive Fee',      baselineMin: 52, desc: 'Performance above benchmark'        },
    { type: 'Administrative Fee', baselineMin: 15, desc: 'AUM-based flat rate'                },
  ],
  dataSources: ['Geneva', 'InvesTier', 'InvesTran'],  // Schedule 1
  goLiveDate: 'Sep 11, 2026',
};
// blended rate: $4,617,110 ÷ (48 × 1,880) = $51.22/hr
const BLENDED_RATE = SOW.annualBaselineSpend / (SOW.baselineFTEs * 1880);

// ─── POST GO-LIVE SIMULATION ─────────────────────────────────────────────────
const SIM = {
  calculationsProcessed: 312,
  processingReductionPct: 36,      // 36% achieved (target 55%)
  currentMinPerCalc:      25.6,    // 40 × (1 - 0.36)
  fteReductionPct:        24,      // 24% achieved (target 55%)
  currentFTEs:            36.5,
  exceptionRate:          9.6,     // % of calcs with exceptions (target <5%)
  reconciliationRate:     91,      // % auto-reconciled
  goLiveDays:             10,
};
// Derived
const minSavedPerCalc    = SOW.baselineMinPerCalc - SIM.currentMinPerCalc;
const hrsSavedToDate     = (minSavedPerCalc / 60) * SIM.calculationsProcessed;
const dollarsSavedToDate = Math.round(hrsSavedToDate * BLENDED_RATE);
// Annual run rate
const annualCalcs        = Math.round(SIM.calculationsProcessed / SIM.goLiveDays * 365);
const annualHrsSaved     = ((SOW.baselineMinPerCalc - SIM.currentMinPerCalc) / 60) * annualCalcs;
const annualDollarsSaved = Math.round(annualHrsSaved * BLENDED_RATE);
const annualTargetSavings = Math.round(((SOW.baselineMinPerCalc - SOW.targetMinPerCalc) / 60) * annualCalcs * BLENDED_RATE);
const annualSavingsPct   = Math.round((annualDollarsSaved / annualTargetSavings) * 100);
const capacityDays       = Math.round(hrsSavedToDate / 8);

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
function UC19KpiRow() {
  const procColor  = SIM.processingReductionPct >= SOW.processingTimeReductionTarget ? GREEN : SIM.processingReductionPct >= 35 ? AMBER : RED;
  const procStatus = SIM.processingReductionPct >= SOW.processingTimeReductionTarget
    ? '✅ Target achieved'
    : `⚡ ${SOW.processingTimeReductionTarget - SIM.processingReductionPct}% more to target`;
  const excColor = SIM.exceptionRate <= 5 ? GREEN : SIM.exceptionRate <= 10 ? AMBER : RED;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 8 }}>
      <KpiCard
        label="Processing Time Reduction"
        value={`${SIM.processingReductionPct}%`}
        target={`${SOW.processingTimeReductionTarget}%`}
        subValue={`${SOW.baselineMinPerCalc} min → ${SIM.currentMinPerCalc} min avg`}
        color={procColor}
        statusText={procStatus}
        progress={SIM.processingReductionPct}
      />
      <KpiCard
        label="Avg Processing Time"
        value={`${SIM.currentMinPerCalc} min`}
        target={`${SOW.targetMinPerCalc} min`}
        subValue={`Baseline: ${SOW.baselineMinPerCalc} min · ${minSavedPerCalc.toFixed(1)} min saved`}
        color={TEAL}
        statusText={`Target: ${SOW.targetMinPerCalc} min per calculation`}
        progress={Math.round((1 - SIM.currentMinPerCalc / SOW.baselineMinPerCalc) * 100)}
      />
      <KpiCard
        label="Fee Calc Team Hours Freed"
        value={`${Math.round(hrsSavedToDate)}h`}
        subValue={`${capacityDays} FTE-days · ${SIM.calculationsProcessed} calcs`}
        color={BLUE}
        statusText={`${minSavedPerCalc.toFixed(1)} min freed per fee calculation`}
      />
      <KpiCard
        label="FTE Reduction"
        value={`${SIM.fteReductionPct}%`}
        target={`${SOW.fteReductionTarget}%`}
        subValue={`${SIM.currentFTEs} current (baseline: ${SOW.baselineFTEs})`}
        color={SIM.fteReductionPct >= SOW.fteReductionTarget ? GREEN : AMBER}
        statusText={`Target: ${SOW.targetFTEs} FTEs · Sched 2`}
        progress={SIM.fteReductionPct}
      />
      <KpiCard
        label="Exception Rate"
        value={`${SIM.exceptionRate}%`}
        target="<5%"
        subValue={`${Math.round(SIM.calculationsProcessed * SIM.exceptionRate / 100)} calcs need review`}
        color={excColor}
        statusText={SIM.exceptionRate <= 5 ? '✅ Within target' : '⚠️ Above target — improving'}
        progress={Math.max(0, 100 - (SIM.exceptionRate / 5) * 100)}
      />
    </div>
  );
}

// ─── SEI COST AVOIDANCE + IBM CONTRACT PANEL ─────────────────────────────────
function SeiIbmPanel() {
  const gainshareEarned = 225000; // Phase I initial ~30% of total
  const gainPct = Math.round((gainshareEarned / SOW.gainshareTotal) * 100);
  const phases = [
    { label: 'Phase I Initial',   amount: 225000, paid: true,  date: 'Oct 11, 2026' },
    { label: 'Phase I Remaining', amount: 374823, paid: false, date: 'Dec 11, 2026' },
    { label: 'Phase II + III',    amount: SOW.gainshareTotal - 225000 - 374823, paid: false, date: 'Subsequent' },
  ];

  const seiCols = [
    {
      label: 'SEI Cost Avoided — To Date',
      value: `$${dollarsSavedToDate.toLocaleString()}`,
      sub: `${Math.round(hrsSavedToDate)} hrs freed · ${SIM.calculationsProcessed} fee calcs`,
      detail: `@ $${BLENDED_RATE.toFixed(2)}/hr blended · ${minSavedPerCalc.toFixed(1)} min saved per calculation`,
      color: TEAL,
      badge: null,
    },
    {
      label: 'Annual Cost Savings — Run Rate',
      value: `$${Math.round(annualDollarsSaved / 1000)}K/yr`,
      sub: `${annualSavingsPct}% toward $${Math.round(annualTargetSavings / 1000)}K/yr target`,
      detail: `At current ${SIM.processingReductionPct}% reduction · full 55% target = $${Math.round(annualTargetSavings / 1000)}K/yr`,
      color: annualSavingsPct >= 100 ? GREEN : AMBER,
      badge: annualSavingsPct >= 100 ? '✅ On target' : `${100 - annualSavingsPct}% to go`,
    },
    {
      label: 'Fee Team Capacity Reclaimed',
      value: `${capacityDays} days`,
      sub: `${Math.round(hrsSavedToDate)} hrs returned to fee operations team`,
      detail: `${SIM.fteReductionPct}% of fee calculation FTEs freed — analysts redirected to exception resolution & model governance`,
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
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>What the fee calculation transformation is saving SEI — cumulative since Sep 11, 2026 go-live</div>
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
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>SOW Sched 2 · ${SOW.annualBaselineSpend.toLocaleString()} baseline × {SOW.fteReductionTarget}% reduction</div>
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

// ─── FEE CALCULATION PIPELINE STRIP ──────────────────────────────────────────
function FeeCalcPipelineStrip() {
  const total       = SIM.calculationsProcessed;
  const automated   = Math.round(total * 0.82);
  const reconciled  = Math.round(total * 0.79);
  const exceptions  = Math.round(total * SIM.exceptionRate / 100);
  const approved    = Math.round(total * 0.68);

  const steps = [
    { label: 'Calcs Initiated', count: total,      color: AMBER  },
    { label: 'Auto-Processed',  count: automated,  color: TEAL   },
    { label: 'Auto-Reconciled', count: reconciled, color: GREEN  },
    { label: 'Exceptions',      count: exceptions, color: RED    },
    { label: 'Posted',          count: approved,   color: BLUE   },
  ];

  return (
    <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
        💰 Fee Calculation Pipeline
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: s.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>
                {s.count.toLocaleString()}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 4 }}>{s.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ fontSize: 14, color: 'var(--text3)', opacity: 0.4, flexShrink: 0, padding: '0 4px' }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Processing time bar */}
      <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginBottom: 6 }}>
          <span>Processing Time Reduction — per calculation</span>
          <span style={{ fontFamily: 'var(--mono)', color: AMBER, fontWeight: 500 }}>
            {SIM.currentMinPerCalc} min actual · Target: {SOW.targetMinPerCalc} min
          </span>
        </div>
        <div style={{ position: 'relative', height: 6, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: `${(SOW.targetMinPerCalc / SOW.baselineMinPerCalc) * 100}%`, top: 0, bottom: 0, width: 2, background: GREEN, opacity: 0.9 }} />
          <div style={{ width: `${(SIM.currentMinPerCalc / SOW.baselineMinPerCalc) * 100}%`, height: '100%', background: AMBER, borderRadius: 3, transition: 'width .6s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 8, color: 'var(--text3)' }}>
          <span style={{ color: GREEN }}>● Target: {SOW.targetMinPerCalc} min</span>
          <span style={{ color: AMBER }}>● Current: {SIM.currentMinPerCalc} min</span>
          <span style={{ color: RED, opacity: 0.7 }}>● Baseline: {SOW.baselineMinPerCalc} min</span>
        </div>
      </div>
    </div>
  );
}

// ─── FEE TYPE PROCESSING PANEL ───────────────────────────────────────────────
// Compact version used alongside Pipeline strip
function FeeTypeProcessingPanel() {
  const colors = [BLUE, PURPLE, AMBER, TEAL];
  return (
    <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>💹 Fee Type Processing Times</div>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>Target: <strong style={{ color: TEAL }}>{SOW.processingTimeReductionTarget}% reduction</strong> per type · Sched 3</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {SOW.feeTypesInScope.map((ft, i) => {
          const targetMin  = Math.round(ft.baselineMin * (1 - SOW.processingTimeReductionTarget / 100));
          const currentMin = Math.round(ft.baselineMin * (1 - SIM.processingReductionPct / 100));
          const pct        = Math.round((1 - currentMin / ft.baselineMin) * 100);
          return (
            <div key={i} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 12px', borderTop: `2px solid ${colors[i]}` }}>
              <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', marginBottom: 2 }}>{ft.type}</div>
              <div style={{ fontSize: 8, color: 'var(--text3)', marginBottom: 6, opacity: .7 }}>{ft.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginBottom: 4 }}>
                <span style={{ color: 'var(--text3)' }}>Base: <strong>{ft.baselineMin}m</strong></span>
                <span style={{ color: colors[i] }}>Now: <strong>{currentMin}m</strong></span>
                <span style={{ color: TEAL }}>Target: <strong>{targetMin}m</strong></span>
              </div>
              <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${(pct / SOW.processingTimeReductionTarget) * 100}%`, height: '100%', background: colors[i] }} />
              </div>
              <div style={{ fontSize: 8, color: colors[i], marginTop: 3 }}>{pct}% reduction achieved</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 8, color: 'var(--text3)', opacity: .7 }}>
        Source: SOW Schedule 1 (fee types in scope) · Schedule 2 (baseline processing times per type)
      </div>
    </div>
  );
}

// ─── FEE TYPE BREAKDOWN (DEEP-DIVE) ──────────────────────────────────────────
// UC-19 equivalent of UC-11's OnboardingTypeSplit
// Each fee type gets its own SOW-grounded baseline / current / target row
function FeeTypeBreakdownPanel() {
  const colors = [BLUE, PURPLE, AMBER, TEAL];
  const rows = SOW.feeTypesInScope.map((ft, i) => {
    const targetMin  = Math.round(ft.baselineMin * (1 - SOW.processingTimeReductionTarget / 100));
    const currentMin = Math.round(ft.baselineMin * (1 - SIM.processingReductionPct / 100));
    const reduction  = Math.round((1 - currentMin / ft.baselineMin) * 100);
    return { ...ft, targetMin, currentMin, reduction, color: colors[i] };
  });

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 16,
      marginBottom: 16,
    }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
        📊 Fee Type Processing — Baseline vs Current vs Target
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
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>{row.desc}</div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: row.reduction >= SOW.processingTimeReductionTarget ? GREEN : AMBER,
              fontFamily: 'var(--mono)',
            }}>
              {row.reduction}% reduction
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 9, marginBottom: 6 }}>
            <span style={{ color: 'var(--text3)' }}>Baseline: <span style={{ color: RED, fontWeight: 500 }}>{row.baselineMin} min</span></span>
            <span style={{ color: 'var(--text3)' }}>Current: <span style={{ color: row.color, fontWeight: 500 }}>{row.currentMin} min</span></span>
            <span style={{ color: 'var(--text3)' }}>Target: <span style={{ color: GREEN, fontWeight: 500 }}>{row.targetMin} min</span></span>
          </div>
          <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(row.reduction, 100)}%`,
              height: '100%',
              background: row.reduction >= SOW.processingTimeReductionTarget ? GREEN : row.color,
              borderRadius: 2,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FTE BREAKDOWN PANEL (UC-19) ─────────────────────────────────────────────
// UC-19 equivalent of UC-11's FteBreakdownPanel
// 48 FTE baseline → 21.6 target (55% reduction) — Schedule 2
function FteBreakdownPanel19() {
  const roles = [
    { role: 'Fee Analyst I',      baseline: 18, target: 8.1,  current: 13.7, costPerFte: 72000  },
    { role: 'Fee Analyst II',     baseline: 14, target: 6.3,  current: 10.6, costPerFte: 88000  },
    { role: 'Fee Analyst III',    baseline: 8,  target: 3.6,  current: 6.1,  costPerFte: 104000 },
    { role: 'Fee Supervisor',     baseline: 5,  target: 2.25, current: 3.8,  costPerFte: 125000 },
    { role: 'Fee Mgr/Controller', baseline: 3,  target: 1.35, current: 2.3,  costPerFte: 148000 },
  ];

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
          👥 FTE Baseline — Schedule 2
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 9, color: 'var(--text3)' }}>
          <span style={{ color: AMBER }}>● {SOW.baselineFTEs} Baseline</span>
          <span style={{ color: BLUE }}>● {SIM.currentFTEs} Current</span>
          <span style={{ color: TEAL }}>● {SOW.targetFTEs} Target</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Total: $4,617,110/yr</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {roles.map(r => {
          const totalCost = Math.round(r.baseline * r.costPerFte);
          const pct       = Math.round((1 - r.current / r.baseline) * 100);
          return (
            <div key={r.role} style={{
              background: 'var(--bg3)',
              borderRadius: 'var(--radius)',
              padding: '10px 12px',
              borderTop: `2px solid ${AMBER}`,
            }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.role}
              </div>
              <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: `${(r.current / r.baseline) * 100}%`, background: AMBER, height: '100%' }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                {r.current} <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text3)' }}>/ {r.baseline}</span>
              </div>
              <div style={{ fontSize: 8, color: AMBER, marginTop: 2 }}>{pct}% ↓ · Target {r.target}</div>
              <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 1 }}>${(totalCost / 1000).toFixed(0)}K/yr</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FEE VOLUME BY FUND CHART ─────────────────────────────────────────────────
// UC-19 equivalent of UC-11's Phase1ClientVolumeChart
// Annual fee calculation volumes by fee type (from SOW Sched 1 in-scope fee types)
const FEE_VOLUME_DATA = [
  { name: 'Carried Interest',   volume: 68, color: PURPLE, desc: 'Most complex — waterfall calc with hurdle'  },
  { name: 'Incentive Fee',      volume: 52, color: AMBER,  desc: 'Performance above benchmark'                },
  { name: 'Management Fee',     volume: 35, color: BLUE,   desc: 'Quarterly NAV × rate ÷ 4'                  },
  { name: 'Administrative Fee', volume: 15, color: TEAL,   desc: 'AUM-based flat rate'                        },
];
const FEE_VOL_TOTAL = FEE_VOLUME_DATA.reduce((s, c) => s + c.volume, 0);

function FeeVolumeByTypeChart() {
  const data = FEE_VOLUME_DATA
    .sort((a, b) => b.volume - a.volume)
    .map(c => ({ ...c, pct: Math.round((c.volume / FEE_VOL_TOTAL) * 100) }));

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
          📦 Annual Fee Calc Volume by Type — Sched 1
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>
          {FEE_VOL_TOTAL} annual calculations in scope
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} width={72} />
            <Tooltip
              contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              formatter={(v, _, props) => [`${v} calcs/yr (${props.payload.pct}%)`, 'Volume']}
            />
            <Bar dataKey="volume" radius={[0, 3, 3, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: c.color, opacity: 0.85, flexShrink: 0, fontSize: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, marginTop: 1 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: 'var(--text)', fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: c.color, fontWeight: 600 }}>{c.volume}/yr</span>
                </div>
                <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 1 }}>{c.desc}</div>
                <div style={{ marginTop: 3, height: 2, background: 'var(--bg4)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', background: c.color }} />
                </div>
              </div>
              <span style={{ fontSize: 8, color: 'var(--text3)', flexShrink: 0, width: 24, textAlign: 'right' }}>{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────
const FEE_COLORS = [BLUE, PURPLE, AMBER, TEAL];

function FeeTypesChart() {
  const data = FEE_TYPES.map((type, i) => ({
    name: type.split(' ')[0],
    fullName: type,
    count: FEE_CALCS.filter(c => c.feeType === type).length,
    color: FEE_COLORS[i % FEE_COLORS.length],
  }));
  return (
    <ResponsiveContainer width="100%" height={155}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,.03)' }} contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          labelFormatter={(_, p) => p?.[0]?.payload?.fullName || ''} formatter={(v) => [v, 'Calculations']} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ProcessingTimeTrendChart() {
  const data = [
    { day: 'Sep 11', min: 38 }, { day: 'Sep 12', min: 36 }, { day: 'Sep 13', min: 34 },
    { day: 'Sep 14', min: 32 }, { day: 'Sep 15', min: 30 }, { day: 'Sep 16', min: 28.5 },
    { day: 'Sep 17', min: 27 }, { day: 'Sep 18', min: 26 }, { day: 'Sep 19', min: 25.8 },
    { day: 'Sep 20', min: 25.6 },
  ];
  return (
    <ResponsiveContainer width="100%" height={155}>
      <LineChart data={data} margin={{ top: 4, right: 24, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 45]} tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} unit="m" />
        <Tooltip cursor={{ stroke: 'var(--border2)', strokeWidth: 1 }} contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v) => [`${v} min`, 'Avg processing time']} />
        <ReferenceLine y={SOW.targetMinPerCalc} stroke={GREEN} strokeDasharray="4 3"
          label={{ value: `Target ${SOW.targetMinPerCalc}m`, fontSize: 8, fill: GREEN, position: 'insideTopRight' }} />
        <Line type="monotone" dataKey="min" stroke={AMBER} strokeWidth={2} dot={{ r: 3, fill: AMBER }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DataSourceChart() {
  const data = CALC_SOURCES.map((source, i) => ({
    name: source,
    count: FEE_CALCS.filter(c => c.calcSource === source).length,
    color: [BLUE, PURPLE, TEAL][i % 3],
  }));
  return (
    <ResponsiveContainer width="100%" height={155}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={58} paddingAngle={2} dataKey="count">
          {data.map((d, i) => <PieCell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Pie>
        <Tooltip contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v, name) => [`${v} calculations`, name]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── RECENT ACTIVITY ─────────────────────────────────────────────────────────
function RecentActivity() {
  const statusColors = {
    'Automated': GREEN, 'Completed': GREEN, 'Under Review': AMBER,
    'Exception': RED,   'Pending Approval': BLUE,
  };
  if (!FEE_CALCS.length) return null;
  return (
    <div>
      {FEE_CALCS.slice(0, 7).map((calc, i) => (
        <div key={calc.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 6 ? '0.5px solid var(--border)' : 'none' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColors[calc.status] || 'var(--text3)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{calc.fund}</div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              {calc.client} · {calc.feeType} · {calc.period} · {calc.calcSource} · AUM {calc.aum}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {calc.exceptions > 0 && <span style={{ fontSize: 9, color: RED, fontWeight: 500 }}>⚠️ {calc.exceptions}</span>}
            <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{calc.calculatedFee}</span>
            <Badge size="sm">{calc.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function UC19Overview({ dateRange }) {
  const dateRangeDisplay = dateRange?.start && dateRange?.end
    ? `${dateRange.start.toLocaleDateString()} – ${dateRange.end.toLocaleDateString()}`
    : 'Post Go-Live · Sep 11, 2026 onward';

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>💰 UC-19 · Intelligent Fee Calculation</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Go-live: <strong>{SOW.goLiveDate}</strong> · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--text3)' }}>
          <span>💰 {SIM.calculationsProcessed} calculations</span>
          <span style={{ color: SIM.processingReductionPct >= SOW.processingTimeReductionTarget ? GREEN : AMBER, fontWeight: 500 }}>
            ⏱ {SIM.processingReductionPct}% reduction · Target {SOW.processingTimeReductionTarget}%
          </span>
          <span style={{ color: SIM.exceptionRate <= 5 ? GREEN : AMBER, fontWeight: 500 }}>
            ⚠ {SIM.exceptionRate}% exception rate · Target &lt;5%
          </span>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <UC19KpiRow />

      {/* SEI + IBM two-row panel */}
      <SeiIbmPanel />

      {/* Pipeline + Fee Type Processing side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <FeeCalcPipelineStrip />
        <FeeTypeProcessingPanel />
      </div>

      {/* Fee Type Deep-Dive + FTE Breakdown side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <FeeTypeBreakdownPanel />
        <FteBreakdownPanel19 />
      </div>

      {/* Fee Volume by Type (full width) */}
      <FeeVolumeByTypeChart />

      {/* 3 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>📊 Fee Types Distribution</div>
          <FeeTypesChart />
        </div>
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>⏱ Processing Time Trend</div>
            <div style={{ fontSize: 8, color: GREEN }}>Target {SOW.targetMinPerCalc}m</div>
          </div>
          <ProcessingTimeTrendChart />
          <div style={{ display: 'flex', gap: 10, fontSize: 8, color: 'var(--text3)', marginTop: 6 }}>
            <span style={{ color: AMBER }}>— Actual avg</span>
            <span style={{ color: GREEN }}>- - Target {SOW.targetMinPerCalc}m</span>
          </div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>🔗 Data Source Distribution</div>
          <DataSourceChart />
          <div style={{ display: 'flex', gap: 8, fontSize: 8, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CALC_SOURCES.map((s, i) => (
              <span key={i} style={{ color: [BLUE, PURPLE, TEAL][i] }}>■ {s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>📋 Recent Fee Calculations</div>
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>⚠️ PII data redacted · showing fee amount</div>
        </div>
        <RecentActivity />
      </div>

      {/* SOW Reference Footer */}
      <div style={{ padding: '8px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 9, color: 'var(--text3)' }}>
        <span>📌 <strong>Primary KPI:</strong> {SOW.processingTimeReductionTarget}% processing time reduction ({SOW.baselineMinPerCalc}→{SOW.targetMinPerCalc} min) — Sched 3</span>
        <span>📌 <strong>FTE target:</strong> {SOW.baselineFTEs}→{SOW.targetFTEs} FTEs ({SOW.fteReductionTarget}% reduction) — Sched 2</span>
        <span>📌 <strong>Baseline spend:</strong> ${SOW.annualBaselineSpend.toLocaleString()} — Sched 2</span>
        <span>📌 <strong>Transformation value:</strong> ${SOW.transformationValue.toLocaleString()} · IBM gainshare: ${SOW.gainshareTotal.toLocaleString()} (30%) — Sched 2</span>
        <span>📌 <strong>Data sources:</strong> Geneva, InvesTier, InvesTran — Sched 1</span>
        <span>📌 <strong>Blended rate:</strong> ${BLENDED_RATE.toFixed(2)}/hr ({SOW.baselineFTEs} FTEs × 1,880 hrs)</span>
      </div>
    </div>
  );
}
