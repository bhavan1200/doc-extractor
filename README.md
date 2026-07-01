# Operations Command Center

## DIP

A comprehensive React-based operational dashboard for monitoring and managing AI-driven document and work processing across three core use cases at SEI Investment Manager Services.

---

## 📋 Overview

The **Operations Command Center** is a unified dashboard that provides real-time visibility into SEI IMS's AI transformation initiatives. It consolidates three high-priority use cases:

| Use Case | ID | Description |
|----------|-----|-------------|
| **Email Triage & Response** | UC-10 | AI-driven email classification, routing, and JIRA integration for Investor Services |
| **Document Data Extraction** | UC-11 | Intelligent KYC and onboarding document extraction with human-in-the-loop validation |
| **Fee Calculation Automation** | UC-19 | Automated fee engine for management fees, carried interest, and incentive fees |

---

## 🏗️ Architecture

### Frontend Stack
- **React 18** - UI framework
- **Recharts** - Data visualization and charts
- **CSS Variables** - Theming and dark/light mode support
- **Mock API Layer** - Simulated backend with realistic async behavior

### Project Structure

ps-command-center/
├── src/
│ ├── App.js # Main application entry
│ ├── index.js # React DOM render
│ ├── index.css # Global styles & design system
│ ├── component/
│ │ ├── Header.jsx # Top navigation bar
│ │ ├── Sidebar.jsx # Sidebar navigation with UC badges
│ │ ├── Overview.jsx # Dashboard overview with KPI cards
│ │ ├── UC10.jsx # Email Triage queue + pipeline drawer
│ │ ├── UC11.jsx # Document Extraction queue + field details
│ │ ├── UC19.jsx # Fee Automation + waterfall calculations
│ │ └── index.jsx # Shared UI components library
│ ├── mockData/
│ │ ├── index.js # Mock API with simulated delay
│ │ └── mockData.js # Dummy data for all three use cases
│ └── assets/
│ └── logo.svg # Application logo
├── public/
│ └── index.html # HTML template
├── package.json # Dependencies and scripts
└── README.md



---

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ops-command-center

# Install dependencies
npm install

# Install recharts for charts
npm install recharts

# Start development server
npm start