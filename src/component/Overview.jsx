// src/component/Overview.jsx
// Main Overview Page with Three Tabbed Dashboards

import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../mockData/index';
import { Spinner } from './index';
import UC10Overview from './UC10Overview';
import UC11Overview from './UC11Overview';
import UC19Overview from './UC19Overview';

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

export default function Overview({ setTab, dateRange }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [selectedUseCase, setSelectedUseCase] = useState('uc10');
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

  // Use case counts
  const ucCounts = {
    uc10: stats.uc10?.received || 0,
    uc11: stats.uc11?.processed || 0,
    uc19: stats.uc19?.runs || 0,
  };

  const dateRangeDisplay = dateRange?.start && dateRange?.end 
    ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
    : 'Last 7 Days';

  return (
    <div className="fade-in" style={{ height: '100%', overflowY: 'auto', padding: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
            📊 Operations Command Center
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
            Internal tracking dashboard · Data: <strong>{dateRangeDisplay}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text3)' }}>
          <span>📧 {ucCounts.uc10} emails</span>
          <span>📄 {ucCounts.uc11} documents</span>
          <span>💰 {ucCounts.uc19} calculations</span>
        </div>
      </div>

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
          label="UC-10 Email Triage" 
          isActive={selectedUseCase === 'uc10'} 
          onClick={() => setSelectedUseCase('uc10')}
          count={ucCounts.uc10}
          color="var(--blue)"
        />
        <TabButton 
          label="UC-11 Document Extraction" 
          isActive={selectedUseCase === 'uc11'} 
          onClick={() => setSelectedUseCase('uc11')}
          count={ucCounts.uc11}
          color="var(--purple)"
        />
        <TabButton 
          label="UC-19 Fee Automation" 
          isActive={selectedUseCase === 'uc19'} 
          onClick={() => setSelectedUseCase('uc19')}
          count={ucCounts.uc19}
          color="var(--amber)"
        />
      </div>

      {/* Content based on selected tab */}
      {selectedUseCase === 'uc10' && (
        <UC10Overview 
          dateRange={dateRange} 
          stats={stats.uc10} 
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