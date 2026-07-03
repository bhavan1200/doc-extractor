// src/App.js - COMPLETE REPLACEMENT

import React, { useState } from 'react';
import Sidebar from './component/Sidebar';
import Header from './component/Header';
import Overview from './component/Overview';
import UC10 from './component/UC10';
import UC11 from './component/UC11';
import UC19 from './component/UC19';

function getDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return { start, end, custom: false, label: 'Last 7 Days' };
}

function App() {
  const [tab, setTab] = useState('overview');
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const renderContent = () => {
    switch (tab) {
      case 'overview':
        return <Overview setTab={setTab} dateRange={dateRange} />;
      case 'uc10':
        return <UC10 dateRange={dateRange} />;
      case 'uc10updated':
      case 'uc11':
        return <UC11 dateRange={dateRange} />;
      case 'uc19':
        return <UC19 dateRange={dateRange} />;
      case 'pipelines':
        return <Placeholder title="Pipelines" />;
      case 'exceptions':
        return <Placeholder title="Exceptions" />;
      case 'reports':
        return <Placeholder title="Reports & Analytics" />;
      case 'knowledgebase':
        return <Placeholder title="Knowledge Base" />;
      case 'admin':
        return <Placeholder title="Administration" />;
      default:
        return <Overview setTab={setTab} dateRange={dateRange} />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font)',
      overflow: 'hidden'
    }}>
      <Sidebar tab={tab} setTab={setTab} />
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        minWidth: 0
      }}>
        <Header 
          tab={tab} 
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange} 
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Placeholder component
const Placeholder = ({ title }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%',
    color: 'var(--text3)',
    fontSize: 13
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🚧</div>
      <div>{title} — Coming Soon</div>
      <div style={{ fontSize: 11, marginTop: 8, opacity: 0.6 }}>
        This module is currently under development
      </div>
    </div>
  </div>
);

export default App;