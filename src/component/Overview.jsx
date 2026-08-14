// src/component/Overview.jsx
// Main Overview Page with Portfolio + Three UC Tabbed Dashboards

import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../mockData/index';
import { Spinner } from './index';
import UC10Overview from './UC10Overview';
import UC11Overview from './UC11Overview';
import UC19Overview from './UC19Overview';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

function TabButton({ label, isActive, onClick, count, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 20px',
        fontSize: 12,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? 'var(--text)' : 'var(--text3)',
        background: isActive ? 'var(--bg3)' : 'transparent',
        border: isActive ? `0.5px solid ${color || 'var(--border)'}` : '0.5px solid transparent',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        transition: 'all .15s',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: isActive ? `2px solid ${color || 'var(--blue)'}` : '2px solid transparent',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--text2)';
          e.currentTarget.style.background = 'var(--bg4)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--text3)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {label}
      {count !== undefined && (
        <span style={{
          fontSize: 9,
          padding: '1px 6px',
          background: isActive ? 'var(--bg4)' : 'var(--bg3)',
          borderRadius: 10,
          color: isActive ? 'var(--text2)' : 'var(--text3)',
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── PORTFOLIO OVERVIEW ───────────────────────────────────────────────────────
const PORTFOLIO_UCS = [
  {
    id: 'uc10', name: 'UC-10 Email Triage', icon: '📧',
    transformationValue: 1149512, gainshareTotal: 344853, gainshareEarned: 104853,
    reductionTarget: 75, reductionAchieved: 58, goLiveDate: 'Sep 11, 2026', color: '#4a9eff',
    primaryKpi: '4.4h → 1.1h per 2,500 emails', baselineFTEs: 18.6, targetFTEs: 7.4,
  },
  {
    id: 'uc11', name: 'UC-11 Document Extraction', icon: '📄',
    transformationValue: 1135500, gainshareTotal: 340650, gainshareEarned: 104920,
    reductionTarget: 60, reductionAchieved: 42, goLiveDate: 'Sep 11, 2026', color: '#a78bfa',
    primaryKpi: '90 min → 36 min per onboarding', baselineFTEs: 36, targetFTEs: 36,
  },
  {
    id: 'uc19', name: 'UC-19 Fee Calculation', icon: '💰',
    transformationValue: 2499411, gainshareTotal: 749823, gainshareEarned: 225000,
    reductionTarget: 55, reductionAchieved: 36, goLiveDate: 'Sep 11, 2026', color: '#f5a623',
    primaryKpi: '40 min → 18 min per fee calc', baselineFTEs: 48, targetFTEs: 21.6,
  },
];
const COMBINED_TV    = 4784423;
const COMBINED_GS    = 1435326;
const COMBINED_EARNED= 434773;
const BLUE_P  = '#4a9eff';
const TEAL_P  = '#2dd4bf';
const GREEN_P = '#00d4a0';
const AMBER_P = '#f5a623';
const RED_P   = '#ff5c72';
const PURPLE_P= '#a78bfa';

function PortfolioOverview({ onSelectUC }) {
  const gainPct = Math.round((COMBINED_EARNED / COMBINED_GS) * 100);

  return (
    <div>
      {/* IBM Portfolio Header Banner */}
      <div style={{
        background: 'var(--bg2)', border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
            IBM × SEI · Automation Portfolio
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>
            3 active Use Cases · All go-live Sep 11, 2026 · IBM gainshare model: 30% of agreed transformation value
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 10, color: 'var(--text3)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>Combined Transformation Value</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: BLUE_P, fontFamily: 'var(--mono)' }}>
              ${(COMBINED_TV / 1e6).toFixed(2)}M
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>SOW Schedule 2 — all 3 UCs</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>IBM Total Gainshare (30%)</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: PURPLE_P, fontFamily: 'var(--mono)' }}>
              ${(COMBINED_GS / 1e6).toFixed(2)}M
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>${(COMBINED_EARNED / 1000).toFixed(0)}K earned · {gainPct}% of total</div>
          </div>
        </div>
      </div>

      {/* SEI + IBM Combined Two-Row Panel */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          background: 'var(--bg2)', border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          borderBottom: 'none', padding: '8px 0',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        }}>
          <div style={{ gridColumn: '1 / -1', padding: '0 16px 6px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '0.5px solid var(--border)', marginBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: TEAL_P, textTransform: 'uppercase', letterSpacing: '.06em' }}>SEI · Portfolio Cost Avoidance</div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>Combined value creation across all 3 automation Use Cases — since Sep 11, 2026 go-live</div>
          </div>
          {[
            { label: 'Combined Transformation Value', value: `$${(COMBINED_TV / 1e6).toFixed(2)}M`, sub: 'Agreed value across UC-10, UC-11, UC-19', detail: '$1.15M (UC-10) + $1.14M (UC-11) + $2.50M (UC-19)', color: TEAL_P },
            { label: 'SEI Annual Baseline Spend', value: '$8.55M/yr', sub: '18.6 + 36 + 48 FTEs across all UCs', detail: '$1.92M (email) + $2.02M (onboarding) + $4.62M (fees)', color: AMBER_P },
            { label: 'Portfolio Reduction Progress', value: '45% avg', sub: 'Weighted average of 58% / 42% / 36% achieved', detail: 'Targets: 75% (UC-10) · 60% (UC-11) · 55% (UC-19)', color: PURPLE_P, badge: '3 UCs live' },
          ].map((col, i, arr) => (
            <div key={col.label} style={{ padding: '8px 16px', borderRight: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{col.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: col.color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{col.value}</div>
                {col.badge && <div style={{ fontSize: 8, padding: '1px 6px', background: col.color + '22', color: col.color, borderRadius: 10, fontWeight: 500 }}>{col.badge}</div>}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text2)', marginBottom: 2 }}>{col.sub}</div>
              <div style={{ fontSize: 8, color: 'var(--text3)', lineHeight: 1.4 }}>{col.detail}</div>
            </div>
          ))}
        </div>
        <div style={{
          background: 'var(--bg3)', border: '0.5px solid var(--border)',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          padding: '8px 0', display: 'grid',
          gridTemplateColumns: 'auto 1fr 1fr 1fr', alignItems: 'stretch',
        }}>
          <div style={{ padding: '6px 14px', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: BLUE_P, textTransform: 'uppercase', letterSpacing: '.06em' }}>IBM</div>
            <div style={{ fontSize: 8, color: 'var(--text3)', maxWidth: 72, lineHeight: 1.4 }}>Contract financials</div>
          </div>
          <div style={{ padding: '6px 16px', borderRight: '0.5px solid var(--border)' }}>
            <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>Total Agreed Transformation Value</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: BLUE_P, fontFamily: 'var(--mono)', lineHeight: 1, marginBottom: 2 }}>${(COMBINED_TV / 1e6).toFixed(2)}M</div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>$1,149,512 + $1,135,500 + $2,499,411 — SOW Schedule 2</div>
          </div>
          <div style={{ padding: '6px 16px', borderRight: '0.5px solid var(--border)' }}>
            <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>IBM Total Gainshare (30%)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: BLUE_P, fontFamily: 'var(--mono)', lineHeight: 1 }}>${(COMBINED_EARNED / 1000).toFixed(0)}K</div>
              <div style={{ fontSize: 9, color: 'var(--text3)' }}>of ${(COMBINED_GS / 1000).toFixed(0)}K total</div>
            </div>
            <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', marginBottom: 2 }}>
              <div style={{ width: `${gainPct}%`, height: '100%', background: BLUE_P, borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>{gainPct}% earned · Phase I initial payments made</div>
          </div>
          <div style={{ padding: '6px 16px' }}>
            <div style={{ fontSize: 8, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>Per-UC Gainshare Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {PORTFOLIO_UCS.map(uc => {
                const pct = Math.round((uc.gainshareEarned / uc.gainshareTotal) * 100);
                return (
                  <div key={uc.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: uc.color }} />
                    <div style={{ fontSize: 8, color: 'var(--text2)', flex: 1 }}>{uc.icon} {uc.name.replace('UC-', '').split(' ')[0]} {uc.name.split(' ')[1]}</div>
                    <div style={{ fontSize: 8, fontFamily: 'var(--mono)', color: uc.color, fontWeight: 600 }}>${(uc.gainshareEarned / 1000).toFixed(0)}K / ${(uc.gainshareTotal / 1000).toFixed(0)}K</div>
                    <div style={{ fontSize: 7, color: 'var(--text3)' }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3 UC Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {PORTFOLIO_UCS.map(uc => {
          const gainPct = Math.round((uc.gainshareEarned / uc.gainshareTotal) * 100);
          const toGo   = uc.reductionTarget - uc.reductionAchieved;
          return (
            <div
              key={uc.id}
              onClick={() => onSelectUC(uc.id)}
              style={{
                background: 'var(--bg2)', border: `0.5px solid ${uc.color}44`,
                borderRadius: 'var(--radius-lg)', padding: 14,
                borderTop: `3px solid ${uc.color}`, cursor: 'pointer',
                transition: 'border-color .15s, box-shadow .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 1px ${uc.color}44, 0 4px 16px rgba(0,0,0,.25)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{uc.icon} {uc.name}</div>
                  <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 2 }}>{uc.primaryKpi}</div>
                </div>
                <div style={{ fontSize: 8, padding: '2px 7px', background: uc.color + '22', color: uc.color, borderRadius: 8, fontWeight: 500, whiteSpace: 'nowrap' }}>
                  Live {uc.goLiveDate}
                </div>
              </div>

              {/* Transformation Value */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text3)', marginBottom: 3 }}>
                  <span>Transformation Value</span>
                  <span style={{ color: 'var(--text2)', fontWeight: 500 }}>${(uc.transformationValue / 1000).toFixed(0)}K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text3)', marginBottom: 3 }}>
                  <span>IBM Gainshare (30%)</span>
                  <span style={{ color: uc.color, fontWeight: 500, fontFamily: 'var(--mono)' }}>${(uc.gainshareEarned / 1000).toFixed(0)}K of ${(uc.gainshareTotal / 1000).toFixed(0)}K</span>
                </div>
                <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${gainPct}%`, height: '100%', background: uc.color, borderRadius: 2 }} />
                </div>
              </div>

              {/* Reduction progress */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text3)', marginBottom: 3 }}>
                  <span>Reduction: {uc.reductionAchieved}% achieved</span>
                  <span style={{ color: toGo > 0 ? AMBER_P : GREEN_P }}>{toGo > 0 ? `${toGo}% to target` : '✅ Target met'}</span>
                </div>
                <div style={{ position: 'relative', height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: `${uc.reductionTarget}%`, top: 0, bottom: 0, width: 1.5, background: GREEN_P, opacity: 0.8 }} />
                  <div style={{ width: `${uc.reductionAchieved}%`, height: '100%', background: uc.color, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 3, fontSize: 7, color: 'var(--text3)' }}>
                  <span style={{ color: uc.color }}>● {uc.reductionAchieved}% now</span>
                  <span style={{ color: GREEN_P }}>● {uc.reductionTarget}% target</span>
                </div>
              </div>

              <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 6, borderTop: '0.5px solid var(--border)', paddingTop: 5 }}>
                FTEs: {uc.baselineFTEs} baseline → {uc.targetFTEs} target · Click to drill down →
              </div>
            </div>
          );
        })}
      </div>

      {/* Transformation Value Comparison Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* TV bar chart */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            📊 Transformation Value by Use Case
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={PORTFOLIO_UCS.map(u => ({ name: u.id.toUpperCase(), value: u.transformationValue, color: u.color }))} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
                formatter={v => [`$${(v / 1000).toFixed(0)}K`, 'Transformation Value']} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {PORTFOLIO_UCS.map((u, i) => <Cell key={i} fill={u.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gainshare bar chart */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            💼 IBM Gainshare Progress by Use Case
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={PORTFOLIO_UCS.map(u => ({ name: u.id.toUpperCase(), total: u.gainshareTotal, earned: u.gainshareEarned, color: u.color }))} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
                formatter={(v, name) => [`$${(v / 1000).toFixed(0)}K`, name === 'earned' ? 'Earned' : 'Total']} />
              <Bar dataKey="total" radius={[3, 3, 0, 0]} fillOpacity={0.25}>
                {PORTFOLIO_UCS.map((u, i) => <Cell key={i} fill={u.color} />)}
              </Bar>
              <Bar dataKey="earned" radius={[3, 3, 0, 0]}>
                {PORTFOLIO_UCS.map((u, i) => <Cell key={i} fill={u.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 4, display: 'flex', gap: 12 }}>
            <span>■ Total gainshare (dim)</span><span>■ Earned to date (solid)</span>
          </div>
        </div>
      </div>

      {/* SOW Reference Footer */}
      <div style={{ padding: '8px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 9, color: 'var(--text3)' }}>
        <span>📌 <strong>UC-10:</strong> $1,149,512 transformation · $344,853 gainshare — SOW 1335933.11 / Sched 1335948.8</span>
        <span>📌 <strong>UC-11:</strong> $1,135,500 transformation · $340,650 gainshare — SOW 1339539.5 / Sched 1339537.5</span>
        <span>📌 <strong>UC-19:</strong> $2,499,411 transformation · $749,823 gainshare — IBM-SOW UC-19 Jul 2, 2026</span>
        <span>📌 <strong>Portfolio total:</strong> $4,784,423 transformation · $1,435,326 IBM gainshare</span>
      </div>
    </div>
  );
}

export default function Overview({ setTab, dateRange }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [selectedUseCase, setSelectedUseCase] = useState('portfolio');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      dashboardApi.getRecentActivity(7)
    ]).then(([statsData, activityData]) => {
      setStats(statsData);
      setActivity(activityData);
      setLoading(false);
    });
  }, [dateRange]);

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Spinner size={28} />
      </div>
    );
  }

  const dateRangeDisplay = dateRange?.start && dateRange?.end
    ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
    : 'Last 7 Days';

  return (
    <div className="fade-in" style={{ height: '100%', overflowY: 'auto', padding: 20 }}>
      
      {/* Header */}
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
            📊 IBM × SEI Automation Portfolio
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
            3 active Use Cases · Go-live Sep 11, 2026 · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text3)' }}>
          <span style={{ color: '#4a9eff' }}>📧 UC-10</span>
          <span style={{ color: '#a78bfa' }}>📄 UC-11</span>
          <span style={{ color: '#f5a623' }}>💰 UC-19</span>
          <span style={{ fontWeight: 500, color: 'var(--text2)' }}>$4.78M combined value</span>
        </div>
      </div> */}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 20,
        padding: '4px',
        background: 'var(--bg2)',
        borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--border)',
        width: 'fit-content',
      }}>
        <TabButton
          label="📊 Portfolio Overview"
          isActive={selectedUseCase === 'portfolio'}
          onClick={() => setSelectedUseCase('portfolio')}
          color="#2dd4bf"
        />
        <TabButton
          label="📧 UC-10 Email Triage"
          isActive={selectedUseCase === 'uc10'}
          onClick={() => setSelectedUseCase('uc10')}
          color="#4a9eff"
        />
        <TabButton
          label="📄 UC-11 Document Extraction"
          isActive={selectedUseCase === 'uc11'}
          onClick={() => setSelectedUseCase('uc11')}
          color="#a78bfa"
        />
        <TabButton
          label="💰 UC-19 Fee Automation"
          isActive={selectedUseCase === 'uc19'}
          onClick={() => setSelectedUseCase('uc19')}
          color="#f5a623"
        />
      </div>

      {/* Content based on selected tab */}
      {selectedUseCase === 'portfolio' && (
        <PortfolioOverview onSelectUC={setSelectedUseCase} />
      )}

      {selectedUseCase === 'uc10' && (
        <UC10Overview
          dateRange={dateRange}
          stats={stats?.uc10}
          activity={activity}
        />
      )}
      
      {selectedUseCase === 'uc11' && (
        <UC11Overview dateRange={dateRange} />
      )}
      
      {selectedUseCase === 'uc19' && (
        <UC19Overview dateRange={dateRange} />
      )}

    </div>
  );
}