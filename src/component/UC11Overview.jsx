// src/component/Overview/UC11Overview.jsx
// UC-11 Document Extraction - Internal Command Center Dashboard

import React, { useState } from 'react';
import { DOCUMENTS, DOC_TYPES } from '../mockData/mockData';
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

function UC11KpiRow({ stats }) {
  if (!stats) return null;
  
  const accuracy = stats.accuracy || 0;
  const gainShareTarget = 150000;
  const accuracyBonus = Math.max(0, (accuracy - 85) * 5000);
  const gainShare = gainShareTarget + accuracyBonus;
  
  const timeSavedHours = stats.timeSavedHours || 0;
  const valueCreated = stats.valueCreated || 0;
  const exceptionRate = stats.exceptionRate || 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
      <KpiCard
        label="Extraction Accuracy"
        value={`${accuracy}%`}
        subValue={accuracy >= 85 ? '✅ Exceeding target' : accuracy >= 75 ? '✅ On track' : '⚠️ Below target'}
        color={accuracy >= 85 ? 'var(--green)' : accuracy >= 75 ? 'var(--amber)' : 'var(--red)'}
        change={Math.round((accuracy - 85) / 85 * 100)}
        changeLabel="vs target"
        target="85%"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
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
        subValue={`${stats.exceptions || 0} documents with exceptions`}
        color={exceptionRate <= 10 ? 'var(--green)' : exceptionRate <= 20 ? 'var(--amber)' : 'var(--red)'}
        change={exceptionRate > 0 ? -Math.min(exceptionRate, 20) : 0}
        changeLabel={exceptionRate <= 10 ? 'Good' : 'Needs review'}
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
      />
    </div>
  );
}

// ─── VOLUME METRICS ─────────────────────────────────────────────────────────

function UC11VolumeMetrics({ stats }) {
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
          📊 Document Processing Metrics
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>
          SLA: <span style={{ color: stats.slaCompliance >= 95 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{stats.slaCompliance}%</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--purple)', fontFamily: 'var(--mono)' }}>
            {stats.total.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Documents Processed</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--teal)', fontFamily: 'var(--mono)' }}>
            {stats.autoExtracted.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Auto-Extracted</div>
        </div>
        
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: stats.validationQueue > 20 ? 'var(--amber)' : 'var(--green)', fontFamily: 'var(--mono)' }}>
            {stats.validationQueue}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Validation Queue</div>
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
          <span style={{ fontSize: 9, color: 'var(--text3)' }}>SLA Compliance (24 hours)</span>
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

const DOC_CHART_COLORS = ['#a78bfa', '#4a9eff', '#2dd4bf', '#f5a623', '#ff5c72', '#00d4a0', '#f97316', '#ec4899'];

function DocumentTypesChart() {
  const typeCounts = {};
  DOC_TYPES.forEach(type => {
    typeCounts[type] = DOCUMENTS.filter(d => d.docType === type).length;
  });
  
  const data = Object.entries(typeCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, count], i) => ({
      name: name.length > 15 ? name.substring(0, 12) + '...' : name,
      fullName: name,
      count,
      color: DOC_CHART_COLORS[i % DOC_CHART_COLORS.length],
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 8, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,.03)' }}
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

function AccuracyTrendChart() {
  const data = [
    { day: 'Mon', accuracy: 82 },
    { day: 'Tue', accuracy: 84 },
    { day: 'Wed', accuracy: 86 },
    { day: 'Thu', accuracy: 83 },
    { day: 'Fri', accuracy: 88 },
    { day: 'Sat', accuracy: 87 },
    { day: 'Sun', accuracy: 85 },
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
        <Bar dataKey="accuracy" fill="#a78bfa" fillOpacity={0.8} radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell 
              key={i} 
              fill={entry.accuracy >= 85 ? '#00d4a0' : entry.accuracy >= 75 ? '#f5a623' : '#ff5c72'} 
              fillOpacity={0.8} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ExtractionStatusChart() {
  const statuses = ['Validated', 'Extracted', 'Under Review', 'Processing', 'Failed'];
  const colors = ['var(--green)', 'var(--blue)', 'var(--amber)', 'var(--purple)', 'var(--red)'];
  const data = statuses.map((s, i) => ({
    name: s,
    count: DOCUMENTS.filter(d => d.status === s).length,
    color: colors[i],
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
          formatter={(v, name) => [`${v} documents`, name]}
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
    'Validated': 'var(--green)',
    'Extracted': 'var(--blue)',
    'Under Review': 'var(--amber)',
    'Processing': 'var(--purple)',
    'Failed': 'var(--red)',
  };

  return (
    <div>
      {activities.slice(0, 6).map((doc, i) => (
        <div key={doc.id} style={{ 
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
            background: statusColors[doc.status] || 'var(--text3)', 
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
              {doc.docType}
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              {doc.client} · {doc.fieldsExtracted}/{doc.fieldsTotal} fields · {doc.receivedAt}
            </div>
          </div>
          <Badge size="sm">{doc.status}</Badge>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function UC11Overview({ dateRange }) {
  const [loading, setLoading] = useState(false);
  
  // Calculate statistics from DOCUMENTS data
  const calculateStats = () => {
    const total = DOCUMENTS.length;
    const validated = DOCUMENTS.filter(d => d.status === 'Validated').length;
    const extracted = DOCUMENTS.filter(d => d.status === 'Extracted').length;
    const underReview = DOCUMENTS.filter(d => d.status === 'Under Review').length;
    const processing = DOCUMENTS.filter(d => d.status === 'Processing').length;
    const failed = DOCUMENTS.filter(d => d.status === 'Failed').length;
    const exceptions = failed + underReview;
    
    // Calculate accuracy from confidence scores
    const confidences = DOCUMENTS.map(d => d.confidence || 0);
    const avgConfidence = Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length);
    
    // Calculate field extraction accuracy
    let totalFields = 0;
    let extractedFields = 0;
    DOCUMENTS.forEach(d => {
      totalFields += d.fieldsTotal || 0;
      extractedFields += d.fieldsExtracted || 0;
    });
    const extractionAccuracy = totalFields > 0 ? Math.round((extractedFields / totalFields) * 100) : avgConfidence;
    
    // Time saved: 6 min per document processed
    const timeSavedMinutes = total * 6;
    const timeSavedHours = Math.round(timeSavedMinutes / 60);
    const valueCreated = Math.round((timeSavedMinutes / 60) * 45);
    
    // Exception rate
    const exceptionRate = total > 0 ? Math.round((exceptions / total) * 100) : 0;
    
    // SLA compliance (simulated)
    const slaCompliance = Math.min(98, Math.max(85, 95 - Math.round(exceptions / 10)));
    
    return {
      total,
      validated,
      extracted,
      underReview,
      processing,
      failed,
      exceptions,
      autoExtracted: extracted + validated,
      validationQueue: underReview + processing,
      accuracy: extractionAccuracy,
      timeSavedHours,
      valueCreated,
      exceptionRate,
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
            📄 UC-11 Document Extraction
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Internal tracking · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text3)' }}>
          <span>📄 {stats.total} documents</span>
          <span>🎯 Target: 85% accuracy</span>
        </div>
      </div>

      {/* KPI Row */}
      <UC11KpiRow stats={stats} />

      {/* Volume Metrics */}
      <UC11VolumeMetrics stats={stats} />

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        
        {/* Document Types */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            📊 Document Types Distribution
          </div>
          <DocumentTypesChart />
        </div>

        {/* Accuracy Trend */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              🎯 Accuracy Trend
            </div>
            <div style={{ fontSize: 8, color: 'var(--text3)' }}>
              Target: <span style={{ color: 'var(--red)' }}>85%</span>
            </div>
          </div>
          <AccuracyTrendChart />
        </div>

        {/* Extraction Status */}
        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            🔄 Extraction Status
          </div>
          <ExtractionStatusChart />
          <div style={{ display: 'flex', gap: 8, fontSize: 8, color: 'var(--text3)', marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>🟢 Validated</span>
            <span>🔵 Extracted</span>
            <span>🟡 Under Review</span>
            <span>🟣 Processing</span>
            <span>🔴 Failed</span>
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
        <RecentActivity activities={DOCUMENTS} />
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
        <span>📌 <strong>Target:</strong> 85% extraction accuracy for baseline gain share</span>
        <span>📌 <strong>Gain Share:</strong> $150K baseline + bonus per % above target</span>
        <span>📌 <strong>SLA:</strong> 24 hours for document processing</span>
        <span>📌 <strong>PII:</strong> All client data has been redacted</span>
        <span>📌 <strong>Time Saved:</strong> Avg 6 min per document</span>
      </div>
    </div>
  );
}