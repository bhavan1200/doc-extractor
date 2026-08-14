// src/component/UC11Overview.jsx
// UC-11 Intelligent Document Extraction — Dashboard
//
// Core story: SEI processes 32,000 Initial Onboarding requests/year at 90 min each.
// IBM's solution targets 36 min/request (60% reduction). This dashboard proves that
// transformation is happening by showing processing time, error rate, and value created.
//
// All KPI targets from SOW Schedule 3. All financial values from SOW Schedule 2.

import React, { useState } from 'react';
import { DOCUMENTS, DOC_TYPES, ONBOARDING_TYPES } from '../mockData/mockData';
import { Badge } from './index';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, LineChart, Line,
} from 'recharts';

// ─── CONSTANTS FROM SOW ──────────────────────────────────────────────────────
// All values sourced from UC11 Schedule document (1339537v5)

const SOW = {
  baselineInitialMin:    90,      // Schedule 3: current state
  targetInitialMin:      36,      // Schedule 3: 60% reduction target
  baselineAdditionalMin: 9,       // Schedule 3: current state
  targetAdditionalMin:   3.6,     // Schedule 3: 60% reduction target
  reductionTarget:       60,      // Schedule 3: 60% processing time reduction
  errorRateTarget:       5,       // Schedule 3: < 5% extraction error rate
  transformationValue:   1135500, // Schedule 2
  gainshareTotal:        340650,  // Schedule 2: 30% of $1,135,500
  annualBaselineSpend:   2017500, // Schedule 2: total FTE cost
  annualValueCreated:    1210500, // Schedule 2: 60% reduction value
  // FIX 1: Schedule 2 FTE table — 31 US + 5 India = 36 total FTEs
  // IS Analyst I: 9.5 US + 5 India; II: 10.5; Supervisor: 2.6; Asst Mgr: 1.9; Mgr: 1.5
  ftesUS:                31,      // Schedule 2
  ftesIndia:             5,       // Schedule 2: IS Analyst I only
  ftesTotal:             36,      // Schedule 2: 31 US + 5 India
  // Hourly rate: $2,017,500 ÷ 36 FTEs ÷ 1,880 working hrs/yr = $29.83/hr
  fteCostPerHr:          29.83,   // Schedule 2: corrected for India FTEs
  // Phase I client volumes from Schedule 2 payment schedule table
  phase1Clients: [
    { name: 'Client J', volume: 7296 },
    { name: 'Client H', volume: 1778 },
    { name: 'Client C', volume: 1364 },
    { name: 'Client I', volume: 794  },
    { name: 'Client A', volume: 526  },
    { name: 'Client D', volume: 841  },
    { name: 'Client E', volume: 312  },
    { name: 'Client F', volume: 307  },
    { name: 'Client K', volume: 496  },
    { name: 'Client G', volume: 211  },
  ],
  phase1TotalVolume:  13825,  // sum of Phase I clients
  allClientsVolume:   31900,  // Phase I 13,825 + Phase II/III 18,075
};

const PURPLE = '#a78bfa';
const GREEN  = 'var(--green)';
const AMBER  = 'var(--amber)';
const RED    = 'var(--red)';
const BLUE   = '#4a9eff';
const TEAL   = '#2dd4bf';

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
        flex: 1,
        minWidth: 0,
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
          <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)', padding: '1px 6px', background: 'var(--bg4)', borderRadius: 3, whiteSpace: 'nowrap' }}>
            Target: {target}
          </div>
        )}
      </div>
      {subValue && (
        <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 3 }}>{subValue}</div>
      )}
      {statusText && (
        <div style={{ fontSize: 10, color, marginTop: 3, fontWeight: 500 }}>{statusText}</div>
      )}
      {progress !== undefined && (
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(progress, 100)}%`,
              height: '100%',
              background: color,
              borderRadius: 2,
              transition: 'width .6s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KPI ROW — SEI-perspective: what has SEI saved, not what IBM earned ──────

function UC11KpiRow({ stats }) {
  if (!stats) return null;

  // Shared base calculations
  const currentMin         = stats.avgProcessingTimeMin || 52;
  const reductionPct       = Math.round(((SOW.baselineInitialMin - currentMin) / SOW.baselineInitialMin) * 100);
  const initialRequests    = stats.initialOnboardingCount || 330;
  const additionalRequests = stats.additionalOnboardingCount || 82;
  const requestsProcessed  = stats.totalRequestsProcessed || 412;
  const today              = stats.requestsToday || 47;

  // 1. Processing time — primary contractual KPI (Schedule 3)
  const timeColor  = reductionPct >= SOW.reductionTarget ? GREEN : reductionPct >= 40 ? AMBER : RED;
  const timeStatus = reductionPct >= SOW.reductionTarget ? '✅ Target achieved'
    : reductionPct >= 40 ? `⚡ ${SOW.reductionTarget - reductionPct}% to target`
    : '⚠️ Below target';

  // 2. Extraction error rate (Schedule 3: < 5%)
  const errorRate   = stats.extractionErrorRate || 5.8;
  const errorColor  = errorRate <= SOW.errorRateTarget ? GREEN : errorRate <= 7 ? AMBER : RED;
  const errorStatus = errorRate <= SOW.errorRateTarget ? '✅ Within target'
    : `⚠️ ${(errorRate - SOW.errorRateTarget).toFixed(1)}% above target`;

  // Shared time calculations (used by cards 3, 4 and the summary bar)
  const reductionRatio  = (SOW.baselineInitialMin - currentMin) / SOW.baselineInitialMin;
  const addCurrentMin   = SOW.baselineAdditionalMin * (1 - reductionRatio);
  const initSavedHrs   = ((SOW.baselineInitialMin - currentMin) / 60) * initialRequests;
  const addSavedHrs    = ((SOW.baselineAdditionalMin - addCurrentMin) / 60) * additionalRequests;

  // 3. Cumulative time saved for SEI since go-live (time, not dollars)
  const totalMinSaved  = Math.round((initSavedHrs + addSavedHrs) * 60);  // total minutes
  const totalHrsSaved  = Math.round(initSavedHrs + addSavedHrs);          // total hours
  // Express as days so the number is human-readable (8-hr working day)
  const totalDaysSaved = (initSavedHrs + addSavedHrs) / 8;
  const timeSavedDisplay = totalHrsSaved >= 8
    ? `${totalDaysSaved.toFixed(1)} days`
    : `${totalHrsSaved} hrs`;

  // 4. Annual time saving run rate (time, not dollars)
  const annualInitHrsSaved = ((SOW.baselineInitialMin - currentMin) / 60) * 32000;
  const annualAddHrsSaved  = ((SOW.baselineAdditionalMin - addCurrentMin) / 60) * 8000;
  const annualTotalHrsSaved = Math.round(annualInitHrsSaved + annualAddHrsSaved);
  // Target at full 60% reduction: (90-36)/60 * 32000 + (9-3.6)/60 * 8000 = 29,600 hrs/yr
  const annualTargetHrs    = Math.round(
    ((SOW.baselineInitialMin - SOW.targetInitialMin) / 60) * 32000 +
    ((SOW.baselineAdditionalMin - SOW.targetAdditionalMin) / 60) * 8000
  );
  const annualTimePct      = Math.round((annualTotalHrsSaved / annualTargetHrs) * 100);
  const annualTimeColor    = annualTimePct >= 100 ? GREEN : annualTimePct >= 70 ? AMBER : RED;

  // 5. IBM gainshare — secondary reference only
  const gainshareEarned = stats.gainshareEarned || 104920;
  const gainPct = Math.round((gainshareEarned / SOW.gainshareTotal) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 8 }}>

      {/* Card 1 — Processing time: primary contractual KPI */}
      <KpiCard
        label="Avg Processing Time"
        value={`${currentMin} min`}
        target={`${SOW.targetInitialMin} min`}
        subValue={`Baseline: ${SOW.baselineInitialMin} min · ${reductionPct}% reduced`}
        color={timeColor}
        statusText={timeStatus}
        progress={reductionPct}
      />

      {/* Card 2 — Extraction error rate */}
      <KpiCard
        label="Extraction Error Rate"
        value={`${errorRate}%`}
        target={`<${SOW.errorRateTarget}%`}
        subValue={`Avg confidence: ${stats.avgConfidence}%`}
        color={errorColor}
        statusText={errorStatus}
        progress={100 - errorRate}
      />

      {/* Card 3 — Cumulative TIME saved for SEI since go-live */}
      <KpiCard
        label="Labor Hours Saved — Since Go-Live"
        value={timeSavedDisplay}
        subValue={`${totalMinSaved.toLocaleString()} min · ${requestsProcessed} requests`}
        color={TEAL}
        statusText={`${SOW.baselineInitialMin - currentMin} min saved per Initial request`}
      />

      {/* Card 4 — Annual TIME saving run rate */}
      <KpiCard
        label="Annual Time Saving — Run Rate"
        value={`${annualTotalHrsSaved.toLocaleString()} hrs/yr`}
        target={`${annualTargetHrs.toLocaleString()} hrs/yr`}
        subValue={`${annualTimePct}% of ${annualTargetHrs.toLocaleString()} hr annual target`}
        color={annualTimeColor}
        statusText={`Target at 60% reduction: ${annualTargetHrs.toLocaleString()} hrs/yr`}
        progress={annualTimePct}
      />

      {/* Card 5 — Requests today + IBM gainshare as secondary reference */}
      <KpiCard
        label="Requests Today"
        value={today}
        subValue={`${requestsProcessed} since go-live`}
        color={BLUE}
        statusText={`IBM gainshare: $${Math.round(gainshareEarned / 1000)}K of $${Math.round(SOW.gainshareTotal / 1000)}K (${gainPct}%)`}
      />

    </div>
  );
}

// ─── PIPELINE STRIP ──────────────────────────────────────────────────────────

function PipelineStrip({ stats }) {
  if (!stats) return null;

  const steps = [
    { label: 'Received',     count: stats.totalRequestsProcessed || 412, color: BLUE },
    { label: 'AI Extracted', count: stats.autoExtracted || 389,           color: TEAL },
    { label: 'Human Review', count: stats.validationQueue || 17,          color: AMBER },
    { label: 'Validated',    count: stats.validated || 372,               color: '#00d4a0' },
    { label: 'Failed',       count: stats.failed || 9,                    color: RED },
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
        📋 Onboarding Pipeline
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: 20, fontWeight: 600, color: step.color,
                fontFamily: 'var(--mono)', lineHeight: 1,
              }}>
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

      {/* Processing time progress bar */}
      <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginBottom: 6 }}>
          <span>Processing Time Reduction — Initial Onboarding</span>
          <span style={{ fontFamily: 'var(--mono)', color: AMBER, fontWeight: 500 }}>
            {stats.avgProcessingTimeMin} min actual · Target: {SOW.targetInitialMin} min
          </span>
        </div>
        <div style={{ position: 'relative', height: 6, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
          {/* Baseline marker */}
          <div style={{ position: 'absolute', left: '100%', top: 0, bottom: 0, width: 2, background: RED, opacity: 0.5 }} />
          {/* Target marker */}
          <div style={{ position: 'absolute', left: `${(SOW.targetInitialMin / SOW.baselineInitialMin) * 100}%`, top: 0, bottom: 0, width: 2, background: '#00d4a0', opacity: 0.8 }} />
          {/* Current bar — width as fraction of baseline remaining */}
          <div style={{
            width: `${(stats.avgProcessingTimeMin / SOW.baselineInitialMin) * 100}%`,
            height: '100%',
            background: PURPLE,
            borderRadius: 3,
            transition: 'width .6s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 8, color: 'var(--text3)' }}>
          <span style={{ color: '#00d4a0' }}>● Target: {SOW.targetInitialMin} min</span>
          <span style={{ color: PURPLE }}>● Current: {stats.avgProcessingTimeMin} min</span>
          <span style={{ color: RED, opacity: 0.6 }}>● Baseline: {SOW.baselineInitialMin} min</span>
        </div>
      </div>
    </div>
  );
}

// ─── SPLIT PANEL — Initial vs Additional ─────────────────────────────────────

function OnboardingTypeSplit({ stats }) {
  const initial    = stats?.initialOnboardingCount    || 330;
  const additional = stats?.additionalOnboardingCount || 82;
  const total      = initial + additional;

  // Processing time per type
  const initMin  = stats?.avgProcessingTimeMin || 52;
  // Additional onboarding scales proportionally with the same improvement
  const reductionRatio = (SOW.baselineInitialMin - initMin) / SOW.baselineInitialMin;
  const addMin   = Math.round(SOW.baselineAdditionalMin * (1 - reductionRatio));

  const rows = [
    {
      type:       'Initial Onboarding',
      count:      initial,
      pct:        Math.round((initial / total) * 100),
      baseline:   `${SOW.baselineInitialMin} min`,
      current:    `${initMin} min`,
      target:     `${SOW.targetInitialMin} min`,
      reduction:  Math.round(((SOW.baselineInitialMin - initMin) / SOW.baselineInitialMin) * 100),
      annualVol:  '32,000/yr',
      color:      PURPLE,
    },
    {
      type:       'Additional Onboarding',
      count:      additional,
      pct:        Math.round((additional / total) * 100),
      baseline:   `${SOW.baselineAdditionalMin} min`,
      current:    `${addMin} min`,
      target:     `${SOW.targetAdditionalMin} min`,
      reduction:  Math.round(((SOW.baselineAdditionalMin - addMin) / SOW.baselineAdditionalMin) * 100),
      annualVol:  '8,000/yr',
      color:      TEAL,
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
        📊 Initial vs Additional Onboarding
      </div>
      {rows.map(row => (
        <div key={row.type} style={{
          background: 'var(--bg3)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          marginBottom: 8,
          borderLeft: `3px solid ${row.color}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{row.type}</div>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>
                {row.count} processed · {row.pct}% of requests · {row.annualVol} annual volume
              </div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: row.reduction >= 60 ? GREEN : AMBER,
              fontFamily: 'var(--mono)',
            }}>
              {row.reduction}% reduction
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 9 }}>
            <span style={{ color: 'var(--text3)' }}>Baseline: <span style={{ color: RED, fontWeight: 500 }}>{row.baseline}</span></span>
            <span style={{ color: 'var(--text3)' }}>Current: <span style={{ color: row.color, fontWeight: 500 }}>{row.current}</span></span>
            <span style={{ color: 'var(--text3)' }}>Target: <span style={{ color: '#00d4a0', fontWeight: 500 }}>{row.target}</span></span>
          </div>
          <div style={{ marginTop: 8, height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${row.reduction}%`,
              height: '100%',
              background: row.reduction >= 60 ? GREEN : row.color,
              borderRadius: 2,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FTE BREAKDOWN PANEL ─────────────────────────────────────────────────────
// Fix 5: Show India FTE breakdown — 31 US + 5 India from SOW Schedule 2

function FteBreakdownPanel() {
  const roles = [
    { role: 'IS Analyst I',       us: 9.5,  india: 5,   costUS: 62000, costIndia: 25000 },
    { role: 'IS Analyst II',      us: 10.5, india: 0,   costUS: 68000, costIndia: 0     },
    { role: 'IS Supervisor',      us: 2.6,  india: 0,   costUS: 85000, costIndia: 0     },
    { role: 'IS Asst. Manager',   us: 1.9,  india: 0,   costUS: 100000,costIndia: 0     },
    { role: 'IS Manager',         us: 1.5,  india: 0,   costUS: 119000,costIndia: 0     },
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
          <span style={{ color: BLUE }}>● {SOW.ftesUS} US FTEs</span>
          <span style={{ color: TEAL }}>● {SOW.ftesIndia} India FTEs</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>Total: {SOW.ftesTotal} FTEs · $2,017,500/yr</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {roles.map(r => {
          const totalFte  = r.us + r.india;
          const totalCost = Math.round(r.us * r.costUS + r.india * r.costIndia);
          const maxFte    = 16;
          return (
            <div key={r.role} style={{
              background: 'var(--bg3)',
              borderRadius: 'var(--radius)',
              padding: '10px 12px',
              borderTop: `2px solid ${r.india > 0 ? TEAL : BLUE}`,
            }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.role}
              </div>
              {/* FTE bar — US vs India */}
              <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', display: 'flex', marginBottom: 6 }}>
                <div style={{ width: `${(r.us / maxFte) * 100}%`, background: BLUE, height: '100%' }} />
                {r.india > 0 && (
                  <div style={{ width: `${(r.india / maxFte) * 100}%`, background: TEAL, height: '100%' }} />
                )}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                {totalFte} FTE{totalFte !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 2 }}>
                {r.us > 0 && <span style={{ color: BLUE }}>{r.us} US</span>}
                {r.india > 0 && <span style={{ color: TEAL }}> + {r.india} India</span>}
              </div>
              <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 1 }}>
                ${(totalCost / 1000).toFixed(0)}K/yr
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PHASE I CLIENT VOLUME CHART ─────────────────────────────────────────────
// Fix 4: Client volumes directly from SOW Schedule 2 client table

function Phase1ClientVolumeChart() {
  // Sorted descending by volume — exactly as in the SOW table
  const data = [...SOW.phase1Clients]
    .sort((a, b) => b.volume - a.volume)
    .map((c, i) => ({
      ...c,
      pct:   Math.round((c.volume / SOW.phase1TotalVolume) * 100),
      color: [PURPLE, BLUE, TEAL, AMBER, '#00d4a0', '#f97316', '#ec4899', '#8b90aa', '#f5a623', '#a78bfa'][i % 10],
    }));

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
          📦 Phase I Client Volume — Schedule 2
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>
          {SOW.phase1TotalVolume.toLocaleString()} subscriptions · ~44% of total annual volume
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} width={52} />
            <Tooltip
              contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              formatter={(v, _, props) => [`${v.toLocaleString()} subs (${props.payload.pct}%)`, 'Volume']}
            />
            <Bar dataKey="volume" radius={[0, 3, 3, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Ranked list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: c.color, opacity: 0.85, flexShrink: 0, fontSize: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: c.color, fontWeight: 600 }}>
                    {c.volume.toLocaleString()}
                  </span>
                </div>
                <div style={{ marginTop: 2, height: 2, background: 'var(--bg4)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', background: c.color }} />
                </div>
              </div>
              <span style={{ fontSize: 8, color: 'var(--text3)', flexShrink: 0, width: 26, textAlign: 'right' }}>
                {c.pct}%
              </span>
            </div>
          ))}
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
            <span style={{ color: 'var(--text3)' }}>Phase II + III (other clients)</span>
            <span style={{ color: 'var(--text2)', fontFamily: 'var(--mono)' }}>18,075</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────

// Processing time trend over last 10 days — shows ramp toward 36 min target
function ProcessingTimeTrendChart() {
  const data = [
    { day: 'D-9', initial: 71, additional: 7.1 },
    { day: 'D-8', initial: 67, additional: 6.7 },
    { day: 'D-7', initial: 64, additional: 6.4 },
    { day: 'D-6', initial: 61, additional: 6.1 },
    { day: 'D-5', initial: 59, additional: 5.9 },
    { day: 'D-4', initial: 56, additional: 5.6 },
    { day: 'D-3', initial: 55, additional: 5.5 },
    { day: 'D-2', initial: 53, additional: 5.3 },
    { day: 'D-1', initial: 52, additional: 5.2 },
    { day: 'Today', initial: 52, additional: 5.2 },
  ];

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} domain={[0, 95]} />
        <Tooltip
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v, name) => [`${v} min`, name === 'initial' ? 'Initial Onboarding' : 'Additional Onboarding']}
        />
        {/* Target lines */}
        <ReferenceLine y={36}  stroke="#00d4a0" strokeDasharray="4 3" strokeWidth={1} label={{ value: 'Target 36m', position: 'right', fontSize: 8, fill: '#00d4a0' }} />
        <ReferenceLine y={3.6} stroke="#2dd4bf" strokeDasharray="4 3" strokeWidth={1} />
        <Line type="monotone" dataKey="initial"    stroke={PURPLE} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="additional" stroke={TEAL}   strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Error rate trend — showing ramp toward <5% target
function ErrorRateTrendChart() {
  const data = [
    { day: 'D-9', rate: 8.2 },
    { day: 'D-8', rate: 7.8 },
    { day: 'D-7', rate: 7.4 },
    { day: 'D-6', rate: 7.1 },
    { day: 'D-5', rate: 6.8 },
    { day: 'D-4', rate: 6.5 },
    { day: 'D-3', rate: 6.2 },
    { day: 'D-2', rate: 6.0 },
    { day: 'D-1', rate: 5.8 },
    { day: 'Today', rate: 5.8 },
  ];

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} domain={[0, 10]} />
        <Tooltip
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v) => [`${v}%`, 'Error Rate']}
        />
        <ReferenceLine y={5} stroke="#00d4a0" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: 'Target <5%', position: 'right', fontSize: 8, fill: '#00d4a0' }} />
        <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.rate <= 5 ? '#00d4a0' : entry.rate <= 7 ? AMBER : RED} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Document type distribution — SOW-accurate types only
function DocumentTypesChart() {
  const counts = {};
  DOC_TYPES.forEach(t => { counts[t] = 0; });
  DOCUMENTS.forEach(d => { if (counts[d.docType] !== undefined) counts[d.docType]++; });

  const colors = [PURPLE, TEAL, BLUE, AMBER, '#00d4a0', '#f97316', '#ec4899', '#8b90aa'];
  const data = Object.entries(counts)
    .map(([name, count], i) => ({
      name: name.replace('Tax Form – ', '').replace('CRS Self-Certification', 'CRS'),
      fullName: name,
      count,
      color: colors[i % colors.length],
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
          formatter={(v) => [v, 'Documents']}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── RECENT ACTIVITY ─────────────────────────────────────────────────────────

function RecentActivity() {
  const statusColors = {
    'Validated':    '#00d4a0',
    'Extracted':    BLUE,
    'Under Review': AMBER,
    'Processing':   PURPLE,
    'Failed':       RED,
  };

  const recent = [...DOCUMENTS]
    .sort((a, b) => a.receivedAt < b.receivedAt ? 1 : -1)
    .slice(0, 7);

  return (
    <div>
      {recent.map((doc, i) => {
        const color = statusColors[doc.status] || 'var(--text3)';
        const timeSaved = doc.onboardingType === 'Initial Onboarding'
          ? SOW.baselineInitialMin - doc.processingTimeMin
          : SOW.baselineAdditionalMin - doc.processingTimeMin;
        return (
          <div key={doc.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 0',
            borderBottom: i < recent.length - 1 ? '0.5px solid var(--border)' : 'none',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.docType} — {doc.onboardingType}
              </div>
              <div style={{ fontSize: 8, color: 'var(--text3)' }}>
                {doc.client} · {doc.processingTimeMin} min actual
                {timeSaved > 0 && ` · ${timeSaved} min saved`}
                · {doc.source} · {doc.receivedAt}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              {doc.flagged && <span style={{ fontSize: 8, color: AMBER }}>⚠ Flagged</span>}
              <Badge size="sm">{doc.status}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SEI SAVINGS & IBM CONTRACT PANEL ────────────────────────────────────────
// Two-row panel:
//   Row 1 — SEI perspective: what SEI has actually saved (costs avoided, capacity freed, trajectory)
//   Row 2 — IBM contract view: transformation value, gainshare earned, phase payment status

function SeiSavingsSummaryBar({ stats, reductionPct }) {
  const currentMin      = stats?.avgProcessingTimeMin || 52;
  const initialReqs     = stats?.initialOnboardingCount || 330;
  const additionalReqs  = stats?.additionalOnboardingCount || 82;
  const reductionRatio  = (SOW.baselineInitialMin - currentMin) / SOW.baselineInitialMin;
  const addCurrentMin   = SOW.baselineAdditionalMin * (1 - reductionRatio);

  // Cumulative hours freed since go-live
  const initHrsSaved   = ((SOW.baselineInitialMin - currentMin) / 60) * initialReqs;
  const addHrsSaved    = ((SOW.baselineAdditionalMin - addCurrentMin) / 60) * additionalReqs;
  const totalHrsSaved  = initHrsSaved + addHrsSaved;
  const totalSaved     = Math.round(totalHrsSaved * SOW.fteCostPerHr);

  // Annual run rate
  const annualHrsSaved    = ((SOW.baselineInitialMin - currentMin) / 60) * 32000
    + ((SOW.baselineAdditionalMin - addCurrentMin) / 60) * 8000;
  const annualRunRate     = Math.round(annualHrsSaved * SOW.fteCostPerHr);
  const annualTargetSavings = 1210500; // SOW Schedule 2: 60% reduction on $2,017,500
  const annualPct         = Math.round((annualRunRate / annualTargetSavings) * 100);

  // Capacity freed — expressed as FTE-equivalent days returned to team
  // One FTE-equivalent day = 8 hrs of capacity
  const fteEquivDays      = Math.round(totalHrsSaved / 8);
  // At 40K annual volume target, what % of the team's annual onboarding hours is now automated?
  const automatedHrsFraction = Math.min(reductionRatio, 1);

  // IBM gainshare progress
  const gainshareEarned = stats?.gainshareEarned || 104920;  // Phase I initial payment
  const gainPct         = Math.round((gainshareEarned / SOW.gainshareTotal) * 100);
  // Phase payments from SOW Schedule 2
  const phases = [
    { label: 'Phase I Initial',   amount: 104920, paid: true,  date: 'Sep 4, 2026' },
    { label: 'Phase I Remaining', amount: 235730, paid: false, date: 'Nov 5, 2026' },
    { label: 'Phase II + III',    amount: SOW.gainshareTotal - 104920 - 235730, paid: false, date: 'Subsequent phases' },
  ];

  // ── Row 1: SEI's three cost-avoidance metrics ─────────────────────────────
  const seiCols = [
    {
      label: 'SEI Cost Avoided — To Date',
      value: `$${totalSaved.toLocaleString()}`,
      sub: `${Math.round(totalHrsSaved).toLocaleString()} hrs freed · ${initialReqs + additionalReqs} requests`,
      detail: `@ $${SOW.fteCostPerHr}/hr blended · ${initialReqs} initial + ${additionalReqs} additional`,
      color: TEAL,
      badge: null,
    },
    {
      label: 'Annual Cost Savings — Run Rate',
      value: `$${Math.round(annualRunRate / 1000)}K / yr`,
      sub: `${annualPct}% toward $1,210K/yr target`,
      detail: `Full-year projection at current ${Math.round(reductionRatio * 100)}% processing reduction`,
      color: annualPct >= 100 ? '#00d4a0' : annualPct >= 70 ? AMBER : PURPLE,
      badge: annualPct >= 100 ? '✅ On target' : `${100 - annualPct}% to go`,
    },
    {
      label: 'Team Capacity Reclaimed',
      value: `${fteEquivDays} days`,
      sub: `${Math.round(totalHrsSaved)} hrs returned to IS team`,
      detail: `${Math.round(automatedHrsFraction * 100)}% of onboarding time now automated — freeing staff for higher-value work`,
      color: PURPLE,
      badge: null,
    },
  ];

  return (
    <div style={{ marginBottom: 16 }}>

      {/* ── Row 1: SEI Cost Avoidance ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--bg2)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        borderBottom: 'none',
        padding: '8px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {/* Row label */}
        <div style={{
          gridColumn: '1 / -1',
          padding: '0 16px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '0.5px solid var(--border)',
          marginBottom: 4,
        }}>
          <div style={{
            fontSize: 9, fontWeight: 600, color: TEAL,
            textTransform: 'uppercase', letterSpacing: '.06em',
          }}>
            SEI · Cost Avoidance
          </div>
          {/* <div style={{ fontSize: 8, color: 'var(--text3)' }}>
            What the transformation is saving SEI — cumulative since Sep 11, 2026 go-live
          </div> */}
        </div>

        {seiCols.map((col, i) => (
          <div key={col.label} style={{
            padding: '8px 16px',
            borderRight: i < seiCols.length - 1 ? '0.5px solid var(--border)' : 'none',
          }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>
              {col.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: col.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>
                {col.value}
              </div>
              {col.badge && (
                <div style={{
                  fontSize: 8, padding: '1px 6px',
                  background: col.color + '22', color: col.color,
                  borderRadius: 10, fontWeight: 500, whiteSpace: 'nowrap',
                }}>
                  {col.badge}
                </div>
              )}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text2)', marginBottom: 2 }}>{col.sub}</div>
            <div style={{ fontSize: 8, color: 'var(--text3)', lineHeight: 1.4 }}>{col.detail}</div>
          </div>
        ))}
      </div>

      {/* ── Row 2: IBM Contract View ──────────────────────────────────────── */}
      <div style={{
        background: 'var(--bg3)',
        border: '0.5px solid var(--border)',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        padding: '8px 0',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 1fr 1fr',
        alignItems: 'stretch',
      }}>
        {/* IBM label tab */}
        <div style={{
          padding: '6px 14px',
          borderRight: '0.5px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
        }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            IBM
          </div>
          <div style={{ fontSize: 8, color: 'var(--text3)', maxWidth: 72, lineHeight: 1.4 }}>
            Contract financials
          </div>
        </div>

        {/* IBM col 1 — Transformation Value */}
        <div style={{ padding: '6px 16px', borderRight: '0.5px solid var(--border)' }}>
          <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>
            Agreed Transformation Value
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: BLUE, fontFamily: 'var(--mono)', lineHeight: 1, marginBottom: 2 }}>
            ${(SOW.transformationValue / 1000).toFixed(0)}K
          </div>
          {/* <div style={{ fontSize: 8, color: 'var(--text3)' }}>
            SOW Schedule 2 · ${SOW.annualBaselineSpend.toLocaleString()} baseline × 60% target reduction
          </div> */}
        </div>

        {/* IBM col 2 — Gainshare */}
        <div style={{ padding: '6px 16px', borderRight: '0.5px solid var(--border)' }}>
          <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>
            IBM Gainshare (30%)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: BLUE, fontFamily: 'var(--mono)', lineHeight: 1 }}>
              ${(gainshareEarned / 1000).toFixed(0)}K
            </div>
            <div style={{ fontSize: 9, color: 'var(--text3)' }}>
              of ${(SOW.gainshareTotal / 1000).toFixed(0)}K total
            </div>
          </div>
          {/* Gainshare progress bar */}
          <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', marginBottom: 2 }}>
            <div style={{ width: `${gainPct}%`, height: '100%', background: BLUE, borderRadius: 2 }} />
          </div>
          {/* <div style={{ fontSize: 8, color: 'var(--text3)' }}>
            {gainPct}% earned · Phase I initial payment made Sep 4, 2026
          </div> */}
        </div>

        {/* IBM col 3 — Phase payment status */}
        {/* <div style={{ padding: '6px 16px' }}>
          <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>
            Phase Payment Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {phases.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: p.paid ? '#00d4a0' : 'var(--bg4)',
                  border: p.paid ? 'none' : '1px solid var(--border2)',
                }} />
                <div style={{ fontSize: 8, color: p.paid ? 'var(--text2)' : 'var(--text3)', flex: 1 }}>
                  {p.label}
                </div>
                <div style={{
                  fontSize: 8, fontFamily: 'var(--mono)',
                  color: p.paid ? '#00d4a0' : 'var(--text3)',
                  fontWeight: p.paid ? 600 : 400,
                }}>
                  ${(p.amount / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function UC11Overview({ dateRange, stats: externalStats }) {
  // Derive stats from DOCUMENTS if not passed from parent
  const computeStats = () => {
    const total       = DOCUMENTS.length;
    const validated   = DOCUMENTS.filter(d => d.status === 'Validated').length;
    const extracted   = DOCUMENTS.filter(d => d.status === 'Extracted').length;
    const underReview = DOCUMENTS.filter(d => d.status === 'Under Review').length;
    const processing  = DOCUMENTS.filter(d => d.status === 'Processing').length;
    const failed      = DOCUMENTS.filter(d => d.status === 'Failed').length;
    const initial     = DOCUMENTS.filter(d => d.onboardingType === 'Initial Onboarding').length;
    const additional  = DOCUMENTS.filter(d => d.onboardingType === 'Additional Onboarding').length;

    // Avg processing time — only from completed (validated + extracted) Initial Onboarding
    const completedInitial = DOCUMENTS.filter(d =>
      d.onboardingType === 'Initial Onboarding' &&
      (d.status === 'Validated' || d.status === 'Extracted')
    );
    const avgMin = completedInitial.length > 0
      ? Math.round(completedInitial.reduce((s, d) => s + d.processingTimeMin, 0) / completedInitial.length)
      : 52;

    // Error rate: errorFields / totalFields across validated docs
    const validatedDocs = DOCUMENTS.filter(d => d.status === 'Validated');
    const totalFieldsValidated = validatedDocs.reduce((s, d) => s + d.fieldsTotal, 0);
    const totalErrorFields     = validatedDocs.reduce((s, d) => s + (d.errorFields || 0), 0);
    const errorRate = totalFieldsValidated > 0
      ? Math.round((totalErrorFields / totalFieldsValidated) * 1000) / 10
      : 5.8;

    const confidences = DOCUMENTS.map(d => d.confidence);
    const avgConfidence = Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length);

    return {
      totalRequestsProcessed:    total,
      initialOnboardingCount:    initial,
      additionalOnboardingCount: additional,
      validated,
      extracted,
      underReview,
      processing,
      failed,
      autoExtracted:             extracted + validated,
      validationQueue:           underReview,
      avgProcessingTimeMin:      avgMin,
      extractionErrorRate:       errorRate,
      avgConfidence,
      gainshareEarned:           104920,
      requestsToday:             47,
    };
  };

  const stats = externalStats || computeStats();

  const dateRangeDisplay = dateRange?.start && dateRange?.end
    ? `${dateRange.start.toLocaleDateString()} – ${dateRange.end.toLocaleDateString()}`
    : 'Last 7 Days';

  const reductionPct = Math.round(
    ((SOW.baselineInitialMin - stats.avgProcessingTimeMin) / SOW.baselineInitialMin) * 100
  );

  return (
    <div className="fade-in">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
            📄 UC-11 · Intelligent Document Extraction
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Subscription Onboarding · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 10, color: 'var(--text3)' }}>
          <span>📄 {stats.totalRequestsProcessed} requests processed</span>
          <span style={{ color: reductionPct >= 60 ? '#00d4a0' : AMBER, fontWeight: 500 }}>
            ⏱ {reductionPct}% reduction · Target: 60%
          </span>
          <span style={{ color: stats.extractionErrorRate <= 5 ? '#00d4a0' : AMBER, fontWeight: 500 }}>
            ⚠ {stats.extractionErrorRate}% error rate · Target: &lt;5%
          </span>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <UC11KpiRow stats={stats} />

      {/* SEI Savings Summary Bar — sits between KPIs and pipeline */}
      <SeiSavingsSummaryBar stats={stats} reductionPct={reductionPct} />

      {/* Pipeline + Onboarding Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <PipelineStrip stats={stats} />
        <OnboardingTypeSplit stats={stats} />
      </div>

      {/* FTE Breakdown + Phase I Client Volumes — Fix 4 & 5 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <FteBreakdownPanel />
        <Phase1ClientVolumeChart />
      </div>

      {/* 3 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>

        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              ⏱ Processing Time Trend
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              Target: <span style={{ color: '#00d4a0' }}>36 min</span>
            </div>
          </div>
          <ProcessingTimeTrendChart />
          <div style={{ display: 'flex', gap: 10, fontSize: 8, color: 'var(--text3)', marginTop: 6 }}>
            <span style={{ color: PURPLE }}>— Initial</span>
            <span style={{ color: TEAL }}>- - Additional</span>
            <span style={{ color: '#00d4a0' }}>— Target</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              📉 Extraction Error Rate
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              Target: <span style={{ color: '#00d4a0' }}>&lt;5%</span>
            </div>
          </div>
          <ErrorRateTrendChart />
        </div>

        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            📂 Document Type Mix
          </div>
          <DocumentTypesChart />
        </div>

      </div>

      {/* Recent Activity */}
      <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            📋 Recent Activity
          </div>
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>⚠️ PII redacted</div>
        </div>
        <RecentActivity />
      </div>

      {/* SOW Reference Footer */}
      <div style={{
        padding: '8px 14px',
        background: 'var(--bg3)',
        borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        fontSize: 9,
        color: 'var(--text3)',
      }}>
        <span>📌 <strong>Baseline:</strong> 90 min/Initial · 9 min/Additional (SOW Schedule 3)</span>
        <span>📌 <strong>Target:</strong> 36 min / 3.6 min — 60% reduction</span>
        <span>📌 <strong>Error Rate Target:</strong> &lt;5% (SOW Schedule 3)</span>
        <span>📌 <strong>Gainshare:</strong> $340,650 total (30% of $1,135,500)</span>
        <span>📌 <strong>FTE Baseline:</strong> 31 US + 5 India = 36 FTEs · $2,017,500/yr · $29.83/hr avg</span>
        <span>📌 <strong>Go-Live:</strong> Sep 11, 2026 (Phase I)</span>
      </div>

    </div>
  );
}
