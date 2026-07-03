// src/component/UC10Updated.jsx
// Internal Command Center Dashboard for UC-10
// Purpose: Track KPIs, gain share, and value creation - NOT for client-facing operations

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Badge, ConfBar, Spinner, Pagination 
} from './index';
import { enhancedEmailApi } from '../data/uc10EnhancedData';

// ─── KPI CARD ────────────────────────────────────────────────────────────────

function KpiCard({ label, value, subValue, color, icon, change, changeLabel, onClick, target }) {
  const [hov, setHov] = useState(false);
  const isPositive = change && change > 0;
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg2)',
        border: `0.5px solid ${hov ? color || 'var(--border2)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: hov ? `0 0 0 1px ${color || 'var(--border2)'}22, 0 8px 24px rgba(0,0,0,.3)` : 'none',
        flex: 1,
        minWidth: 150,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {label}
        </div>
        {icon && <div style={{ opacity: .4 }}>{icon}</div>}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ 
          fontSize: 24, 
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
            fontSize: 10, 
            color: 'var(--text3)', 
            fontFamily: 'var(--mono)',
            padding: '2px 6px',
            background: 'var(--bg4)',
            borderRadius: 4,
          }}>
            Target: {target}
          </div>
        )}
      </div>
      
      {subValue && (
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
          {subValue}
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        {change !== undefined && (
          <span style={{ 
            fontSize: 11, 
            color: isPositive ? 'var(--green)' : 'var(--red)',
            fontWeight: 500,
            fontFamily: 'var(--mono)',
          }}>
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
        {changeLabel && (
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>{changeLabel}</span>
        )}
      </div>
      
      {/* Progress bar for target tracking */}
      {target && value !== undefined && (
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min((parseFloat(value) / parseFloat(target)) * 100, 100)}%`, 
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

// ─── CONFUSION MATRIX ────────────────────────────────────────────────────────

function ConfusionMatrix({ data, categories }) {
  if (!data || !categories) return null;
  
  // Calculate overall accuracy
  let totalCorrect = 0;
  let totalAll = 0;
  categories.forEach(cat => {
    totalCorrect += data[cat]?.[cat] || 0;
    Object.values(data[cat] || {}).forEach(v => totalAll += v);
  });
  const accuracy = totalAll > 0 ? Math.round((totalCorrect / totalAll) * 100) : 0;
  const misclassification = totalAll > 0 ? Math.round(((totalAll - totalCorrect) / totalAll) * 100) : 0;
  
  return (
    <div style={{ 
      background: 'var(--bg2)', 
      border: '0.5px solid var(--border)', 
      borderRadius: 'var(--radius-lg)', 
      padding: 16 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          📊 Classification Accuracy
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: accuracy >= 85 ? 'var(--green)' : accuracy >= 76 ? 'var(--amber)' : 'var(--red)', fontFamily: 'var(--mono)' }}>
              {accuracy}%
            </div>
            <div style={{ fontSize: 9, color: 'var(--text3)' }}>Accuracy</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: misclassification > 24 ? 'var(--red)' : 'var(--amber)', fontFamily: 'var(--mono)' }}>
              {misclassification}%
            </div>
            <div style={{ fontSize: 9, color: 'var(--text3)' }}>Misclass.</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: accuracy >= 76 ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--mono)' }}>
              {accuracy >= 76 ? '✅' : '⚠️'}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text3)' }}>Target: 76%</div>
          </div>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ padding: '4px 8px', textAlign: 'left', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>
                Actual ↓ / Predicted →
              </th>
              {categories.map(cat => (
                <th key={cat} style={{ padding: '4px 8px', textAlign: 'center', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>
                  {cat.substring(0, 4)}
                </th>
              ))}
              <th style={{ padding: '4px 8px', textAlign: 'center', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map(actualCat => {
              const rowTotal = Object.values(data[actualCat] || {}).reduce((s, v) => s + v, 0);
              return (
                <tr key={actualCat} style={{ borderBottom: '0.5px solid var(--border)' }}>
                  <td style={{ padding: '4px 8px', fontSize: 10, color: 'var(--text2)' }}>
                    {actualCat.substring(0, 8)}
                  </td>
                  {categories.map(predCat => {
                    const val = data[actualCat]?.[predCat] || 0;
                    const pct = rowTotal > 0 ? Math.round((val / rowTotal) * 100) : 0;
                    const isCorrect = actualCat === predCat;
                    return (
                      <td key={predCat} style={{ 
                        padding: '4px 8px', 
                        textAlign: 'center',
                        background: val > 0 ? (isCorrect ? 'rgba(0,212,160,.12)' : 'rgba(255,92,114,.08)') : 'transparent',
                        color: val > 0 ? (isCorrect ? 'var(--green)' : 'var(--red)') : 'var(--text3)',
                        fontWeight: isCorrect ? 600 : 400,
                        borderRadius: 4,
                      }}>
                        {val > 0 ? `${pct}%` : '-'}
                      </td>
                    );
                  })}
                  <td style={{ padding: '4px 8px', textAlign: 'center', fontSize: 10, color: 'var(--text3)' }}>
                    {rowTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 9, color: 'var(--text3)' }}>
        <span>✅ <span style={{ color: 'var(--green)' }}>Green</span> = Correct classification</span>
        <span>❌ <span style={{ color: 'var(--red)' }}>Red</span> = Misclassification</span>
        <span>🎯 Target accuracy: <span style={{ color: 'var(--text)' }}>76%</span></span>
      </div>
    </div>
  );
}

// ─── RECLASSIFICATION TRENDS ─────────────────────────────────────────────────

function ReclassificationTrends({ data, categories }) {
  if (!data || !categories) return null;
  
  // Calculate reclassification rates per category
  const trends = categories.map(cat => {
    const total = Object.values(data[cat] || {}).reduce((s, v) => s + v, 0);
    const correct = data[cat]?.[cat] || 0;
    const rate = total > 0 ? Math.round(((total - correct) / total) * 100) : 0;
    const topMisclass = Object.entries(data[cat] || {})
      .filter(([k]) => k !== cat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    return { category: cat, rate, total, correct, topMisclass };
  });
  
  // Sort by highest reclassification rate
  trends.sort((a, b) => b.rate - a.rate);
  
  const getColor = (rate) => {
    if (rate <= 10) return 'var(--green)';
    if (rate <= 20) return 'var(--amber)';
    return 'var(--red)';
  };
  
  return (
    <div style={{ 
      background: 'var(--bg2)', 
      border: '0.5px solid var(--border)', 
      borderRadius: 'var(--radius-lg)', 
      padding: 16 
    }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
        🔄 Reclassification Trends
      </div>
      
      {trends.map((item, idx) => (
        <div key={item.category} style={{ marginBottom: idx < trends.length - 1 ? 10 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text)' }}>{item.category}</span>
              <Badge size="sm">{item.total} total</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                Correct: {item.correct} ({item.total - item.correct} misclass.)
              </span>
              <span style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                color: getColor(item.rate),
                fontFamily: 'var(--mono)',
                minWidth: 40,
                textAlign: 'right',
              }}>
                {item.rate}%
              </span>
            </div>
          </div>
          <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ 
              width: `${item.rate}%`, 
              height: '100%', 
              background: getColor(item.rate),
              borderRadius: 2,
              transition: 'width .6s ease',
            }} />
          </div>
          {item.topMisclass.length > 0 && item.topMisclass[0][1] > 0 && (
            <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2 }}>
              → Often misclassified as: {item.topMisclass.map(([cat, count]) => `${cat} (${count})`).join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ACTIVITY TABLE (Anonymized) ────────────────────────────────────────────

function ActivityTable({ emails }) {
  if (!emails || emails.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 11 }}>
        No recent activity
      </div>
    );
  }
  
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: '0.5px solid var(--border)' }}>
            <th style={{ padding: '6px 8px', textAlign: 'left', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>ID</th>
            <th style={{ padding: '6px 8px', textAlign: 'left', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>Category</th>
            <th style={{ padding: '6px 8px', textAlign: 'center', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>Confidence</th>
            <th style={{ padding: '6px 8px', textAlign: 'left', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>JIRA</th>
            <th style={{ padding: '6px 8px', textAlign: 'left', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '6px 8px', textAlign: 'center', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>Reclass?</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', fontSize: 9, color: 'var(--text3)', fontWeight: 500 }}>Received</th>
          </tr>
        </thead>
        <tbody>
          {emails.slice(0, 8).map((email, idx) => {
            const hasReclass = email.review?.overriddenClassification || (email.review?.status === 'overridden');
            const isPending = email.status === 'Pending' || email.status === 'Normalized';
            const isResolved = email.status === 'Resolved';
            
            return (
              <tr key={email.id} style={{ borderBottom: idx < 7 ? '0.5px solid var(--border)' : 'none' }}>
                <td style={{ padding: '6px 8px', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                  {email.id}
                </td>
                <td style={{ padding: '6px 8px' }}>
                  <Badge>{email.classification?.primary || 'N/A'}</Badge>
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                  <ConfBar val={email.classification?.confidence || 0} width={50} />
                </td>
                <td style={{ padding: '6px 8px', fontSize: 10, color: 'var(--teal)', fontFamily: 'var(--mono)' }}>
                  {email.jiraTickets?.length > 0 ? email.jiraTickets[0].id : '—'}
                </td>
                <td style={{ padding: '6px 8px' }}>
                  <Badge>{email.status}</Badge>
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                  {hasReclass ? (
                    <span style={{ color: 'var(--amber)', fontSize: 11 }}>🔄</span>
                  ) : isResolved ? (
                    <span style={{ color: 'var(--green)', fontSize: 11 }}>✅</span>
                  ) : isPending ? (
                    <span style={{ color: 'var(--text3)', fontSize: 11 }}>⏳</span>
                  ) : (
                    <span style={{ color: 'var(--text3)', fontSize: 11 }}>—</span>
                  )}
                </td>
                <td style={{ padding: '6px 8px', textAlign: 'right', fontSize: 9, color: 'var(--text3)' }}>
                  {email.receivedAt}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function UC10Updated({ dateRange }) {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PER = 10;
  
  const categories = [
    'Investor Inquiry', 'Account Maintenance', 'Reporting Request',
    'Onboarding', 'Document Request', 'Compliance',
    'Wire Instruction', 'Redemption Request'
  ];
  
  // Calculate confusion matrix from emails
  const calculateConfusionMatrix = useCallback((emailList) => {
    const matrix = {};
    categories.forEach(actual => {
      matrix[actual] = {};
      categories.forEach(pred => {
        matrix[actual][pred] = 0;
      });
    });
    
    emailList.forEach(email => {
      const actual = email.classification?.primary || 'Unknown';
      const predicted = email.classification?.primary || 'Unknown';
      // For now, we assume predicted = actual (since we don't have reclassification data yet)
      // In production, this would come from JIRA reclassification monitoring
      if (matrix[actual] && matrix[actual][predicted] !== undefined) {
        matrix[actual][predicted]++;
      }
    });
    
    return matrix;
  }, [categories]);
  
  // Calculate stats from emails
  const calculateStats = useCallback((emailList) => {
    const total = emailList.length;
    const autoRouted = emailList.filter(e => e.status !== 'Pending' && e.status !== 'Normalized').length;
    const humanReview = emailList.filter(e => e.status === 'Pending' || e.status === 'Normalized').length;
    const resolved = emailList.filter(e => e.status === 'Resolved').length;
    
    // Calculate accuracy (simulated for now)
    // In production, this would come from JIRA reclassification monitoring
    const highConfidence = emailList.filter(e => (e.classification?.confidence || 0) >= 76).length;
    const accuracy = total > 0 ? Math.round((highConfidence / total) * 100) : 0;
    
    // Calculate reclassification rate (simulated)
    // In production, this would come from JIRA monitoring
    const reclassified = emailList.filter(e => e.review?.overriddenClassification).length;
    const reclassRate = total > 0 ? Math.round((reclassified / total) * 100) : 0;
    
    // Calculate time saved (simulated)
    // Assumption: 3.2 minutes saved per email
    const avgTimeSaved = 3.2; // minutes
    const timeSavedMinutes = total * avgTimeSaved;
    const timeSavedHours = Math.round(timeSavedMinutes / 60);
    
    // Value created (simulated)
    // Assumption: $45/hour labor cost
    const laborCostPerHour = 45;
    const valueCreated = Math.round((timeSavedMinutes / 60) * laborCostPerHour);
    
    // Gain share (simulated)
    // Target: 76% accuracy for baseline gain share
    const gainShareTarget = 150000; // $150K baseline
    const accuracyBonus = Math.max(0, (accuracy - 76) * 5000); // $5K per % above target
    const gainShare = gainShareTarget + accuracyBonus;
    
    // SLA metrics (24-48 hour unofficial SLA)
    const pending = emailList.filter(e => e.status === 'Pending' || e.status === 'Normalized').length;
    const inProgress = emailList.filter(e => e.status === 'Assigned' || e.status === 'Validating').length;
    const slaAtRisk = emailList.filter(e => e.status !== 'Resolved' && (e.slaRisk || false)).length;
    
    return {
      total,
      autoRouted,
      humanReview,
      resolved,
      accuracy,
      reclassRate,
      timeSavedHours,
      valueCreated,
      gainShare,
      gainShareTarget,
      pending,
      inProgress,
      slaAtRisk,
      avgTimeSaved,
    };
  }, []);
  
  // Load data
  const load = useCallback(async () => {
    setLoading(true);
    const res = await enhancedEmailApi.list({
      page,
      perPage: 50, // Load more for analytics
      startDate: dateRange?.start,
      endDate: dateRange?.end,
    });
    setEmails(res.data);
    setTotalPages(Math.ceil(res.total / PER));
    const matrix = calculateConfusionMatrix(res.data);
    const statsData = calculateStats(res.data);
    setStats({ ...statsData, matrix });
    setLoading(false);
  }, [page, dateRange, calculateConfusionMatrix, calculateStats]);
  
  useEffect(() => {
    load();
  }, [load]);
  
  // Handle date range change
  useEffect(() => {
    if (dateRange) {
      load();
    }
  }, [dateRange]);
  
  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Spinner size={28} />
      </div>
    );
  }
  
  return (
    <div className="fade-in" style={{ height: '100%', overflowY: 'auto', padding: 20 }}>
      
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              📊 UC-10 Command Center
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              Internal dashboard for tracking gain share, accuracy, and value creation
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 10, color: 'var(--text3)' }}>
            <span>📅 {dateRange?.start?.toLocaleDateString()} - {dateRange?.end?.toLocaleDateString()}</span>
            <span>📧 {stats.total} emails processed</span>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 18 }}>
        <KpiCard
          label="Emails Processed"
          value={stats.total.toLocaleString()}
          subValue={`${stats.resolved} resolved`}
          color="var(--blue)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>}
        />
        
        <KpiCard
          label="Auto-Routed"
          value={stats.autoRouted.toLocaleString()}
          subValue={`${stats.pending} pending review`}
          color="var(--teal)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        
        <KpiCard
          label="Accuracy"
          value={`${stats.accuracy}%`}
          subValue={`${stats.reclassRate}% reclassification rate`}
          color={stats.accuracy >= 85 ? 'var(--green)' : stats.accuracy >= 76 ? 'var(--amber)' : 'var(--red)'}
          change={Math.round((stats.accuracy - 76) / 76 * 100)}
          changeLabel="vs target"
          target="76%"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stats.accuracy >= 85 ? 'var(--green)' : stats.accuracy >= 76 ? 'var(--amber)' : 'var(--red)'} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        
        <KpiCard
          label="Reclassification"
          value={`${stats.reclassRate}%`}
          subValue={`${Math.round(stats.total * stats.reclassRate / 100)} emails`}
          color={stats.reclassRate <= 10 ? 'var(--green)' : stats.reclassRate <= 20 ? 'var(--amber)' : 'var(--red)'}
          change={stats.reclassRate > 0 ? -Math.min(stats.reclassRate, 100) : 0}
          changeLabel={stats.reclassRate <= 10 ? 'Good' : 'Needs review'}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/></svg>}
        />
        
        <KpiCard
          label="Gain Share"
          value={`$${(stats.gainShare / 1000).toFixed(0)}K`}
          subValue={`Target: $${(stats.gainShareTarget / 1000).toFixed(0)}K`}
          color={stats.gainShare >= stats.gainShareTarget ? 'var(--green)' : 'var(--amber)'}
          change={Math.round((stats.gainShare - stats.gainShareTarget) / stats.gainShareTarget * 100)}
          changeLabel="vs target"
          target={`$${(stats.gainShareTarget / 1000).toFixed(0)}K`}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5"><path d="M12 2v20M17 7l-5-5-5 5"/></svg>}
        />
      </div>
      
      {/* Value Creation Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <div style={{ 
          background: 'var(--bg2)', 
          border: '0.5px solid var(--border)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 14 
        }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
            ⏱️ Time Saved
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--mono)' }}>
              {stats.timeSavedHours}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>hours</span>
            <span style={{ fontSize: 10, color: 'var(--text3)' }}>
              ({Math.round(stats.timeSavedHours * 60)} minutes)
            </span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Avg {stats.avgTimeSaved} min saved per email
          </div>
        </div>
        
        <div style={{ 
          background: 'var(--bg2)', 
          border: '0.5px solid var(--border)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 14 
        }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
            💰 Value Created
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--mono)' }}>
              ${stats.valueCreated.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text2)' }}>USD</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Based on ${45}/hour labor cost
          </div>
        </div>
      </div>
      
      {/* Confusion Matrix + Reclassification Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12, marginBottom: 18 }}>
        <ConfusionMatrix 
          data={stats.matrix} 
          categories={categories.slice(0, 6)} 
        />
        <ReclassificationTrends 
          data={stats.matrix} 
          categories={categories.slice(0, 6)} 
        />
      </div>
      
      {/* Recent Activity */}
      <div style={{ 
        background: 'var(--bg2)', 
        border: '0.5px solid var(--border)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 16 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            📋 Recent Activity (Anonymized)
          </div>
          <div style={{ fontSize: 9, color: 'var(--text3)' }}>
            ⚠️ PII data has been redacted
          </div>
        </div>
        <ActivityTable emails={emails} />
        
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>
            Showing {Math.min(8, emails.length)} of {emails.length} entries
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: '4px 10px',
                fontSize: 10,
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                color: page === 1 ? 'var(--text3)' : 'var(--text2)',
                cursor: page === 1 ? 'default' : 'pointer',
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              ‹ Prev
            </button>
            <span style={{ padding: '4px 10px', fontSize: 10, color: 'var(--text3)' }}>
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                padding: '4px 10px',
                fontSize: 10,
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                color: page === totalPages ? 'var(--text3)' : 'var(--text2)',
                cursor: page === totalPages ? 'default' : 'pointer',
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
      
      {/* Legend / Notes */}
      <div style={{ 
        marginTop: 14, 
        padding: '10px 16px', 
        background: 'var(--bg3)', 
        borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        fontSize: 10,
        color: 'var(--text3)',
      }}>
        <span>📌 <strong>Target:</strong> 76% accuracy for baseline gain share</span>
        <span>📌 <strong>Gain Share:</strong> ${(stats.gainShareTarget / 1000).toFixed(0)}K baseline + ${(stats.accuracy > 76 ? (stats.accuracy - 76) * 5 : 0).toFixed(0)}K bonus</span>
        <span>📌 <strong>SLA:</strong> 24-48 hours (unofficial)</span>
        <span>📌 <strong>PII:</strong> All client data has been redacted</span>
        <span>📌 <strong>Data:</strong> {dateRange?.start?.toLocaleDateString()} - {dateRange?.end?.toLocaleDateString()}</span>
      </div>
      
    </div>
  );
}