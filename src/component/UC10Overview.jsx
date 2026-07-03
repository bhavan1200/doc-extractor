// src/component/Overview/UC10Overview.jsx
// UC-10 Email Triage - Internal Command Center Dashboard

import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../mockData/index';
import { EMAILS, EMAIL_CLASSIFICATIONS } from '../mockData/mockData';
import { Badge, Spinner } from './index';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

function UC10KpiRow({ stats }) {
  if (!stats) return null;
  
  const accuracy = stats.slaCompliance || 0;
  const gainShareTarget = 150000;
  const accuracyBonus = Math.max(0, (accuracy - 76) * 5000);
  const gainShare = gainShareTarget + accuracyBonus;
  
  const totalEmails = stats.received || 0;
  const timeSavedHours = Math.round((totalEmails * 3.2) / 60);
  const valueCreated = Math.round((timeSavedHours / 60) * 45);
  const reclassRate = 11;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
      <KpiCard
        label="Accuracy"
        value={`${accuracy}%`}
        subValue={accuracy >= 85 ? '✅ Exceeding target' : accuracy >= 76 ? '✅ On track' : '⚠️ Below target'}
        color={accuracy >= 85 ? 'var(--green)' : accuracy >= 76 ? 'var(--amber)' : 'var(--red)'}
        change={Math.round((accuracy - 76) / 76 * 100)}
        changeLabel="vs target"
        target="76%"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
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
        label="Reclassification Rate"
        value={`${reclassRate}%`}
        subValue="↓ 3% from last quarter"
        color={reclassRate <= 10 ? 'var(--green)' : reclassRate <= 20 ? 'var(--amber)' : 'var(--red)'}
        change={-3}
        changeLabel="improvement"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/></svg>}
      />
    </div>
  );
}

// ─── VOLUME METRICS ─────────────────────────────────────────────────────────

function UC10VolumeMetrics({ stats }) {
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
          📊 Volume & Processing Metrics
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>
          SLA: <span style={{ color: stats.slaCompliance >= 95 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{stats.slaCompliance}%</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--blue)', fontFamily: 'var(--mono)' }}>
            {stats.received?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Emails Received</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--teal)', fontFamily: 'var(--mono)' }}>
            {stats.autoRouted?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Auto-Routed to JIRA</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: stats.humanReview > 50 ? 'var(--amber)' : 'var(--green)', fontFamily: 'var(--mono)' }}>
            {stats.humanReview || 0}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Human Review Required</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: stats.slaAtRisk > 10 ? 'var(--red)' : 'var(--green)', fontFamily: 'var(--mono)' }}>
            {stats.slaAtRisk || 0}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>SLA At Risk</div>
        </div>
      </div>
      
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--text3)' }}>SLA Compliance (24-48 hours)</span>
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

function ReclassificationChart() {
  const categories = EMAIL_CLASSIFICATIONS.slice(0, 6);
  const reclassData = categories.map((cat, i) => {
    const total = EMAILS.filter(e => e.classification === cat).length;
    const baseRate = [12, 8, 5, 18, 7, 10][i] || 10;
    const reclassified = Math.round(total * (baseRate / 100));
    return {
      name: cat.split(' ')[0],
      fullName: cat,
      total,
      reclassified,
      rate: baseRate,
      color: CHART_COLORS[i],
      correct: total - reclassified,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={reclassData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,.03)' }}
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
          formatter={(v, name, props) => {
            if (name === 'Reclassified') return [`${v} (${props.payload.rate}%)`, 'Reclassified'];
            return [v, 'Correct'];
          }}
        />
        <Bar dataKey="correct" stackId="a" fill="#00d4a0" fillOpacity={0.8} radius={[0, 0, 0, 0]} />
        <Bar dataKey="reclassified" stackId="a" fill="#ff5c72" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function AccuracyTrendChart() {
  const data = [
    { day: 'Mon', accuracy: 82 },
    { day: 'Tue', accuracy: 84 },
    { day: 'Wed', accuracy: 79 },
    { day: 'Thu', accuracy: 86 },
    { day: 'Fri', accuracy: 88 },
    { day: 'Sat', accuracy: 85 },
    { day: 'Sun', accuracy: 87 },
  ];

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[70, 90]} tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,.03)' }}
          contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
          formatter={(v) => [`${v}%`, 'Accuracy']}
        />
        <Bar dataKey="accuracy" fill="#4a9eff" fillOpacity={0.8} radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell 
              key={i} 
              fill={entry.accuracy >= 85 ? '#00d4a0' : entry.accuracy >= 76 ? '#f5a623' : '#ff5c72'} 
              fillOpacity={0.8} 
            />
          ))}
        </Bar>
      </BarChart>
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

  return (
    <div>
      {activities.slice(0, 6).map((e, i) => (
        <div key={e.id} style={{ 
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
            background: e.slaRisk ? 'var(--red)' : 'var(--green)', 
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
              {e.subject}
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              {e.client} · {e.receivedAt}
            </div>
          </div>
          <Badge size="sm">{e.status}</Badge>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function UC10Overview({ dateRange, stats, activity }) {
  const [loading, setLoading] = useState(false);

  const dateRangeDisplay = dateRange?.start && dateRange?.end 
    ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
    : 'Last 7 Days';

  if (!stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
            📧 UC-10 Email Triage
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Internal tracking · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text3)' }}>
          <span>📧 {stats.received} emails</span>
          <span>🎯 Target: 76% accuracy</span>
        </div>
      </div>

      {/* KPI Row */}
      <UC10KpiRow stats={stats} />

      {/* Volume Metrics */}
      <UC10VolumeMetrics stats={stats} />

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        
        {/* Email Classification */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            📊 Email Classification
          </div>
          <ClassificationChart />
        </div>

        {/* Accuracy Trend */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              🎯 Accuracy Trend
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              Target: <span style={{ color: 'var(--red)' }}>76%</span>
            </div>
          </div>
          <AccuracyTrendChart />
        </div>

        {/* Reclassification */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            🔄 Reclassification by Category
          </div>
          <ReclassificationChart />
          <div style={{ display: 'flex', gap: 12, fontSize: 8, color: 'var(--text3)', marginTop: 6 }}>
            <span>🟢 Correct</span>
            <span>🔴 Reclassified</span>
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
        <RecentActivity activities={activity} />
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
        <span>📌 <strong>Target:</strong> 76% accuracy for baseline gain share</span>
        <span>📌 <strong>Gain Share:</strong> $150K baseline + bonus per % above target</span>
        <span>📌 <strong>SLA:</strong> 24-48 hours (unofficial)</span>
        <span>📌 <strong>PII:</strong> All client data has been redacted</span>
        <span>📌 <strong>Reclassification:</strong> Tracks corrections made in JIRA</span>
      </div>
    </div>
  );
}