// src/component/Header.jsx - COMPLETE REPLACEMENT

import React, { useState } from 'react';

const PRESET_RANGES = [
  { label: 'Today', value: 'today', days: 0 },
  { label: 'Last 7 Days', value: 'last7', days: 7 },
  { label: 'Last 30 Days', value: 'last30', days: 30 },
  { label: 'This Quarter', value: 'quarter', days: 90 },
];

const TITLES = {
  overview: { title: 'Operations Command Center', sub: 'Monitor and manage document and work processing across all use cases' },
  uc10: { title: 'UC-10 · Email Triage & Response', sub: 'AI-driven email classification, routing, and JIRA integration for Investor Services' },
  uc11: { title: 'UC-11 · Document Data Extraction', sub: 'Intelligent KYC and onboarding document extraction with human-in-the-loop validation' },
  uc19: { title: 'UC-19 · Fee Calculation Automation', sub: 'Automated fee engine for management fees, carried interest, and incentive fees' },
  pipelines: { title: 'Pipelines', sub: 'Monitor active processing pipelines across all use cases' },
  exceptions: { title: 'Exceptions', sub: 'Review and resolve processing exceptions requiring attention' },
  reports: { title: 'Reports & Analytics', sub: 'Operational performance metrics and trend analysis' },
  knowledgebase: { title: 'Knowledge Base', sub: 'Documentation, playbooks, and operational guides' },
  admin: { title: 'Administration', sub: 'System configuration and user management' },
};

function formatDate(date) {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

function getDateRangePreset(value) {
  const end = new Date();
  const start = new Date();
  switch (value) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'last7':
      start.setDate(start.getDate() - 7);
      break;
    case 'last30':
      start.setDate(start.getDate() - 30);
      break;
    case 'quarter':
      start.setDate(start.getDate() - 90);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }
  return { start, end };
}

function getDateRangeLabel(start, end) {
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days <= 1) return 'Yesterday';
  if (days <= 7) return `Last ${days} Days`;
  if (days <= 30) return `Last ${days} Days`;
  if (days <= 90) return `Last ${days} Days`;
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

export default function Header({ tab, dateRange, onDateRangeChange }) {
  const { title, sub } = TITLES[tab] || TITLES.overview;
  
  // Initialize with 'last7' or custom
  const [rangeType, setRangeType] = useState(() => {
    if (dateRange?.custom) return 'custom';
    return 'last7';
  });
  
  const [customStart, setCustomStart] = useState(() => {
    if (dateRange?.start) return formatDate(dateRange.start);
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return formatDate(d);
  });
  
  const [customEnd, setCustomEnd] = useState(() => {
    if (dateRange?.end) return formatDate(dateRange.end);
    return formatDate(new Date());
  });

  const [showCustom, setShowCustom] = useState(rangeType === 'custom');

  const handleRangeChange = (value) => {
    setRangeType(value);
    
    if (value === 'custom') {
      setShowCustom(true);
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      setCustomStart(formatDate(start));
      setCustomEnd(formatDate(end));
      onDateRangeChange({ start, end, custom: true, label: 'Custom Range' });
    } else {
      setShowCustom(false);
      const { start, end } = getDateRangePreset(value);
      const preset = PRESET_RANGES.find(r => r.value === value);
      onDateRangeChange({ start, end, custom: false, label: preset?.label || 'Custom' });
    }
  };

  const handleCustomApply = () => {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (start && end && start <= end) {
      onDateRangeChange({ 
        start, 
        end, 
        custom: true, 
        label: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      });
    }
  };

  const getDateRangeDisplay = () => {
    if (dateRange?.label) return dateRange.label;
    if (dateRange?.start && dateRange?.end) {
      return getDateRangeLabel(dateRange.start, dateRange.end);
    }
    return 'Last 7 Days';
  };

  return (
    <div style={{ 
      padding: '0 20px', 
      height: 52, 
      borderBottom: '0.5px solid var(--border)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      background: 'var(--bg2)', 
      flexShrink: 0 
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.2px' }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
          {sub} {dateRange && (
            <span style={{ marginLeft: 8, padding: '1px 6px', background: 'var(--bg3)', borderRadius: 3, fontSize: 9 }}>
              {getDateRangeDisplay()}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Date Range Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <select 
            value={rangeType} 
            onChange={e => handleRangeChange(e.target.value)}
            style={{ 
              background: 'var(--bg3)', 
              border: '0.5px solid var(--border)', 
              borderRadius: 'var(--radius)', 
              padding: '5px 10px', 
              color: 'var(--text2)', 
              fontSize: 11, 
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {PRESET_RANGES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
            <option value="custom">Custom Range</option>
          </select>
          
          {/* Custom Range Picker */}
          {showCustom && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              padding: '3px 6px',
              background: 'var(--bg3)',
              borderRadius: 'var(--radius)',
              border: '0.5px solid var(--border)',
            }}>
              <input
                type="date"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: 10,
                  outline: 'none',
                  width: 110,
                  padding: '3px 2px',
                }}
              />
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>→</span>
              <input
                type="date"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: 10,
                  outline: 'none',
                  width: 110,
                  padding: '3px 2px',
                }}
              />
              <button
                onClick={handleCustomApply}
                style={{
                  padding: '2px 10px',
                  fontSize: 10,
                  background: 'var(--green)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button 
          onClick={() => {
            // Trigger refresh in parent
            if (dateRange?.start && dateRange?.end) {
              onDateRangeChange({ 
                ...dateRange, 
                refresh: true 
              });
            }
          }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 5, 
            padding: '5px 10px', 
            border: '0.5px solid var(--border)', 
            borderRadius: 'var(--radius)', 
            fontSize: 11, 
            color: 'var(--text2)', 
            background: 'var(--bg3)',
            cursor: 'pointer',
            transition: 'color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        {/* Notification */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div style={{ 
            position: 'absolute', 
            top: -3, 
            right: -3, 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: 'var(--red)', 
            border: '1.5px solid var(--bg2)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: 5, 
            color: '#fff', 
            fontWeight: 700 
          }}>
            5
          </div>
        </div>

        {/* Avatar */}
        <div style={{ 
          width: 28, 
          height: 28, 
          borderRadius: '50%', 
          background: 'var(--green)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: 10, 
          fontWeight: 700, 
          color: 'var(--bg)', 
          cursor: 'pointer' 
        }}>
          AK
        </div>
      </div>
    </div>
  );
}