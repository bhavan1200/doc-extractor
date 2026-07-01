// src/App.js
import React, { useState } from 'react';
import Sidebar from './component/Sidebar';
import Header from './component/Header';
import UC10 from './component/UC10';
import UC11 from './component/UC11';
import UC19 from './component/UC19';
import Overview from './component/Overview';


// Simple placeholder components for other tabs
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

function App() {
  const [tab, setTab] = useState('overview');

  const renderContent = () => {
    switch (tab) {
      case 'overview':
        return <Overview setTab={setTab} />;
      case 'uc10':
        return <UC10 />;
      case 'uc11':
        return <UC11 />;
      case 'uc19':
        return <UC19 />;
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
        return <Overview setTab={setTab} />;
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
        <Header tab={tab} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;