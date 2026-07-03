// src/component/Overview/UC19Overview.jsx
// UC-19 Fee Automation - Internal Command Center Dashboard

import React, { useState } from 'react';
import { FEE_CALCS, FEE_TYPES, CALC_SOURCES } from '../mockData/mockData';
import { Badge, Spinner } from './index';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell } from 'recharts';

// ─── KPI CARD ────────────────────────────────────────────────────────────────

function KpiCard({ label, value, subValue, color, icon, change, changeLabel, target }) {
  const [hov, setHov] = useState(false);
  const isPositive = change && change > 0;
  
  return (
    <div 
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg2)',
        border: `0.5px solid ${hov ? color || 'var(--border2)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        cursor: 'default',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: hov ? `0 0 0 1px ${color || 'var(--border2)'}22, 0 8px 24px rgba(0,0,0,.3)` : 'none',
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {label}
        </div>
        {icon && <div style={{ opacity: .4 }}>{icon}</div>}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ 
          fontSize: 22, 
          fontWeight: 600, 
          color: color || 'var(--text)', 
          fontFamily: 'var(--mono)',
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}>
          {value}
        </div>
        {target && (
          <div style={{ 
            fontSize: 9, 
            color: 'var(--text3)', 
            fontFamily: 'var(--mono)',
            padding: '1px 6px',
            background: 'var(--bg4)',
            borderRadius: 3,
          }}>
            Target: {target}
          </div>
        )}
      </div>
      
      {subValue && (
        <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>
          {subValue}
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        {change !== undefined && (
          <span style={{ 
            fontSize: 10, 
            color: isPositive ? 'var(--green)' : 'var(--red)',
            fontWeight: 500,
            fontFamily: 'var(--mono)',
          }}>
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
        {changeLabel && (
          <span style={{ fontSize: 9, color: 'var(--text3)' }}>{changeLabel}</span>
        )}
      </div>
      
      {target && value !== undefined && typeof value === 'string' && value.includes('%') && (
        <div style={{ marginTop: 6 }}>
          <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min(parseFloat(value), 100)}%`, 
              height: '100%', 
              background: color || 'var(--green)', 
              borderRadius: 2,
              transition: 'width .6s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KPI ROW ─────────────────────────────────────────────────────────────────

function UC19KpiRow({ stats }) {
  if (!stats) return null;
  
  const automationRate = stats.automationRate || 0;
  const gainShareTarget = 150000;
  const automationBonus = Math.max(0, (automationRate - 80) * 5000);
  const gainShare = gainShareTarget + automationBonus;
  
  const timeSavedHours = stats.timeSavedHours || 0;
  const valueCreated = stats.valueCreated || 0;
  const exceptionRate = stats.exceptionRate || 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
      <KpiCard
        label="Automation Rate"
        value={`${automationRate}%`}
        subValue={automationRate >= 80 ? '✅ Exceeding target' : automationRate >= 70 ? '✅ On track' : '⚠️ Below target'}
        color={automationRate >= 80 ? 'var(--green)' : automationRate >= 70 ? 'var(--amber)' : 'var(--red)'}
        change={Math.round((automationRate - 80) / 80 * 100)}
        changeLabel="vs target"
        target="80%"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      />
      
      <KpiCard
        label="Gain Share"
        value={`$${(gainShare / 1000).toFixed(0)}K`}
        subValue={`Target: $${(gainShareTarget / 1000).toFixed(0)}K`}
        color={gainShare >= gainShareTarget ? 'var(--green)' : 'var(--amber)'}
        change={Math.round((gainShare - gainShareTarget) / gainShareTarget * 100)}
        changeLabel="vs target"
        target={`$${(gainShareTarget / 1000).toFixed(0)}K`}
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5"><path d="M12 2v20M17 7l-5-5-5 5"/></svg>}
      />
      
      <KpiCard
        label="Time Saved"
        value={`${timeSavedHours}h`}
        subValue={`${Math.round(timeSavedHours * 60)} minutes saved`}
        color="var(--blue)"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      />
      
      <KpiCard
        label="Value Created"
        value={`$${valueCreated.toLocaleString()}`}
        subValue={`Based on $45/hour labor`}
        color="var(--green)"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5"><path d="M12 2v20M17 7l-5-5-5 5"/></svg>}
      />
      
      <KpiCard
        label="Exception Rate"
        value={`${exceptionRate}%`}
        subValue={`${stats.exceptions || 0} calculations with exceptions`}
        color={exceptionRate <= 10 ? 'var(--green)' : exceptionRate <= 20 ? 'var(--amber)' : 'var(--red)'}
        change={exceptionRate > 0 ? -Math.min(exceptionRate, 20) : 0}
        changeLabel={exceptionRate <= 10 ? 'Good' : 'Needs review'}
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
      />
    </div>
  );
}

// ─── VOLUME METRICS ─────────────────────────────────────────────────────────

function UC19VolumeMetrics({ stats }) {
  if (!stats) return null;
  
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
          💰 Calculation Processing Metrics
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>
          SLA: <span style={{ color: stats.slaCompliance >= 95 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{stats.slaCompliance}%</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>
            {stats.total.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Calculations Run</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--teal)', fontFamily: 'var(--mono)' }}>
            {stats.autoProcessed.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Automated</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: stats.reconciliations > 2 ? 'var(--green)' : 'var(--amber)', fontFamily: 'var(--mono)' }}>
            {stats.reconciliations}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Reconciled</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: stats.exceptions > 5 ? 'var(--red)' : 'var(--green)', fontFamily: 'var(--mono)' }}>
            {stats.exceptions}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Exceptions</div>
        </div>
      </div>
      
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--text3)' }}>SLA Compliance (48 hours)</span>
          <span style={{ fontSize: 9, color: stats.slaCompliance >= 95 ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
            {stats.slaCompliance}%
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ 
            width: `${stats.slaCompliance}%`, 
            height: '100%', 
            background: stats.slaCompliance >= 95 ? 'var(--green)' : stats.slaCompliance >= 85 ? 'var(--amber)' : 'var(--red)',
            borderRadius: 2,
            transition: 'width .6s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────

const FEE_CHART_COLORS = ['#4a9eff', '#a78bfa', '#2dd4bf', '#f5a623'];

function FeeTypesChart() {
  const data = FEE_TYPES.map((type, i) => ({
    name: type,
    count: FEE_CALCS.filter(c => c.feeType === type).length,
    color: FEE_CHART_COLORS[i % FEE_CHART_COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,.03)' }}
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v) => [v, 'Calculations']}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function AutomationTrendChart() {
  const data = [
    { day: 'Mon', rate: 82 },
    { day: 'Tue', rate: 84 },
    { day: 'Wed', rate: 86 },
    { day: 'Thu', rate: 88 },
    { day: 'Fri', rate: 87 },
    { day: 'Sat', rate: 85 },
    { day: 'Sun', rate: 83 },
  ];

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[70, 90]} tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,.03)' }}
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v) => [`${v}%`, 'Automation Rate']}
        />
        <Bar dataKey="rate" fill="#f5a623" fillOpacity={0.8} radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell 
              key={i} 
              fill={entry.rate >= 80 ? '#00d4a0' : entry.rate >= 70 ? '#f5a623' : '#ff5c72'} 
              fillOpacity={0.8} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function DataSourceChart() {
  const data = CALC_SOURCES.map((source, i) => ({
    name: source,
    count: FEE_CALCS.filter(c => c.calcSource === source).length,
    color: ['#4a9eff', '#a78bfa', '#2dd4bf'][i % 3],
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <PieChart margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={60}
          paddingAngle={2}
          dataKey="count"
        >
          {data.map((entry, index) => (
            <PieCell key={index} fill={entry.color} fillOpacity={0.8} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v, name) => [`${v} calculations`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── RECENT ACTIVITY ──────────────────────────────────────────────────────

function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 11 }}>
        No recent activity
      </div>
    );
  }

  const statusColors = {
    'Automated': 'var(--green)',
    'Completed': 'var(--green)',
    'Under Review': 'var(--amber)',
    'Exception': 'var(--red)',
    'Pending Approval': 'var(--blue)',
  };

  return (
    <div>
      {activities.slice(0, 6).map((calc, i) => (
        <div key={calc.id} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '5px 0', 
          borderBottom: i < 5 ? '0.5px solid var(--border)' : 'none' 
        }}>
          <div style={{ 
            width: 5, 
            height: 5, 
            borderRadius: '50%', 
            background: statusColors[calc.status] || 'var(--text3)', 
            flexShrink: 0 
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: 10, 
              color: 'var(--text)', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {calc.fund}
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              {calc.client} · {calc.feeType} · {calc.period} · {calc.calcSource}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {calc.exceptions > 0 && (
              <span style={{ fontSize: 9, color: 'var(--red)', fontWeight: 500 }}>⚠️ {calc.exceptions}</span>
            )}
            <Badge size="sm">{calc.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function UC19Overview({ dateRange }) {
  const [loading, setLoading] = useState(false);
  
  // Calculate statistics from FEE_CALCS data
  const calculateStats = () => {
    const total = FEE_CALCS.length;
    const automated = FEE_CALCS.filter(c => c.status === 'Automated' || c.status === 'Completed').length;
    const underReview = FEE_CALCS.filter(c => c.status === 'Under Review').length;
    const exceptions = FEE_CALCS.filter(c => c.status === 'Exception').length;
    const pendingApproval = FEE_CALCS.filter(c => c.status === 'Pending Approval').length;
    const reconciled = FEE_CALCS.filter(c => c.reconciled === true).length;
    
    // Calculate automation rate
    const automationRate = total > 0 ? Math.round((automated / total) * 100) : 0;
    
    // Calculate exception rate
    const exceptionRate = total > 0 ? Math.round((exceptions / total) * 100) : 0;
    
    // Time saved: 20 min per calculation
    const timeSavedMinutes = total * 20;
    const timeSavedHours = Math.round(timeSavedMinutes / 60);
    const valueCreated = Math.round((timeSavedMinutes / 60) * 45);
    
    // Calculate average fee amount
    const totalFees = FEE_CALCS.reduce((sum, c) => sum + (c.feeAmtRaw || 0), 0);
    const avgFee = total > 0 ? Math.round(totalFees / total / 1000) : 0;
    
    // SLA compliance (simulated)
    const slaCompliance = Math.min(98, Math.max(85, 95 - Math.round(exceptions / 5)));
    
    return {
      total,
      automated,
      underReview,
      exceptions,
      pendingApproval,
      reconciled,
      autoProcessed: automated,
      automationRate,
      exceptionRate,
      timeSavedHours,
      valueCreated,
      avgFee,
      slaCompliance,
    };
  };

  const stats = calculateStats();
  const dateRangeDisplay = dateRange?.start && dateRange?.end 
    ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
    : 'Last 7 Days';

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
            💰 UC-19 Fee Automation
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Internal tracking · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text3)' }}>
          <span>💰 {stats.total} calculations</span>
          <span>🎯 Target: 80% automation</span>
          <span>📊 Avg Fee: ${stats.avgFee}K</span>
        </div>
      </div>

      {/* KPI Row */}
      <UC19KpiRow stats={stats} />

      {/* Volume Metrics */}
      <UC19VolumeMetrics stats={stats} />

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        
        {/* Fee Types */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            📊 Fee Types Distribution
          </div>
          <FeeTypesChart />
        </div>

        {/* Automation Trend */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              🎯 Automation Trend
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              Target: <span style={{ color: 'var(--red)' }}>80%</span>
            </div>
          </div>
          <AutomationTrendChart />
        </div>

        {/* Data Sources */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            🔗 Data Source Distribution
          </div>
          <DataSourceChart />
          <div style={{ display: 'flex', gap: 8, fontSize: 8, color: 'var(--text3)', marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>🔵 Geneva</span>
            <span>🟣 InvesTran</span>
            <span>🟢 InvesTier</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        background: 'var(--bg2)', 
        border: '0.5px solid var(--border)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 16 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            📋 Recent Activity
          </div>
          <div style={{ fontSize: 8, color: 'var(--text3)' }}>
            ⚠️ PII data redacted
          </div>
        </div>
        <RecentActivity activities={FEE_CALCS} />
      </div>

      {/* Legend / Notes */}
      <div style={{ 
        marginTop: 14, 
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
        <span>📌 <strong>Target:</strong> 80% automation rate for baseline gain share</span>
        <span>📌 <strong>Gain Share:</strong> $150K baseline + bonus per % above target</span>
        <span>📌 <strong>SLA:</strong> 48 hours for calculation completion</span>
        <span>📌 <strong>PII:</strong> All client data has been redacted</span>
        <span>📌 <strong>Time Saved:</strong> Avg 20 min per calculation</span>
        <span>📌 <strong>Data Sources:</strong> Geneva, InvesTran, InvesTier</span>
      </div>
    </div>
  );
}