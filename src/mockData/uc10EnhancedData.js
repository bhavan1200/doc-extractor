// src/data/uc10EnhancedData.js - COMPLETE REPLACEMENT

import { EMAIL_CLASSIFICATIONS, EMAIL_STATUSES, CLIENTS, OWNERS } from './mockData';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function genId() { return Math.random().toString(36).substr(2, 9); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function conf(min = 72, max = 98) { return rand(min, max); }

// ─── DATE HELPERS ────────────────────────────────────────────────────────────

function randomDateBetween(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  return date.toLocaleString('en-US', {
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true,
  });
}

// ─── CLASSIFICATION ALTERNATIVES ────────────────────────────────────────────

const CLASSIFICATION_ALTERNATIVES = {
  'Investor Inquiry': [
    { category: 'Reporting Request', confidence: 78 },
    { category: 'Account Maintenance', confidence: 65 },
    { category: 'Document Request', confidence: 42 },
  ],
  'Account Maintenance': [
    { category: 'Investor Inquiry', confidence: 72 },
    { category: 'Document Request', confidence: 68 },
    { category: 'Reporting Request', confidence: 55 },
  ],
  'Reporting Request': [
    { category: 'Investor Inquiry', confidence: 82 },
    { category: 'Document Request', confidence: 60 },
    { category: 'Account Maintenance', confidence: 48 },
  ],
  'Onboarding': [
    { category: 'Document Request', confidence: 75 },
    { category: 'Investor Inquiry', confidence: 55 },
    { category: 'Account Maintenance', confidence: 45 },
  ],
  'Document Request': [
    { category: 'Reporting Request', confidence: 70 },
    { category: 'Investor Inquiry', confidence: 62 },
    { category: 'Account Maintenance', confidence: 50 },
  ],
  'Compliance': [
    { category: 'Investor Inquiry', confidence: 60 },
    { category: 'Document Request', confidence: 55 },
    { category: 'Account Maintenance', confidence: 40 },
  ],
  'Wire Instruction': [
    { category: 'Account Maintenance', confidence: 80 },
    { category: 'Investor Inquiry', confidence: 55 },
    { category: 'Document Request', confidence: 45 },
  ],
  'Redemption Request': [
    { category: 'Investor Inquiry', confidence: 85 },
    { category: 'Account Maintenance', confidence: 60 },
    { category: 'Document Request', confidence: 50 },
  ],
};

// ─── GENERATE EMAILS FOR DATE RANGE ─────────────────────────────────────────

function generateEmailsForDateRange(startDate, endDate, count = 35) {
  const emails = [];
  const daysDiff = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  const baseCount = Math.max(count, Math.min(count, daysDiff * 3));
  
  for (let i = 0; i < baseCount; i++) {
    // Generate a random date within the range
    const emailDate = randomDateBetween(startDate, endDate);
    
    // Determine status based on how old the email is
    const now = new Date();
    const ageInHours = (now - emailDate) / (1000 * 60 * 60);
    let status;
    if (ageInHours < 2) status = 'Pending';
    else if (ageInHours < 6) status = 'Normalized';
    else if (ageInHours < 12) status = 'Validating';
    else if (ageInHours < 24) status = 'Assigned';
    else if (ageInHours < 48) status = 'JIRA Created';
    else status = 'Resolved';

    const classification = pick(EMAIL_CLASSIFICATIONS);
    const client = pick(CLIENTS);
    const confidence = conf(68, 98);
    const hasOwner = ['Assigned', 'JIRA Created', 'Resolved'].includes(status);
    const entities = generateEntities(client, classification);
    const alternatives = CLASSIFICATION_ALTERNATIVES[classification] || [];

    emails.push({
      id: `EM-${String(i + 1).padStart(3, '0')}`,
      subject: `${classification}${rand(0, 10) > 3 ? ` - ${entities.fundName}` : ''}`,
      from: `${entities.investorName.toLowerCase().replace(' ', '.')}@client.com`,
      to: 'is-team@ntrs.com',
      client,
      status,
      owner: hasOwner ? pick(OWNERS) : null,
      receivedAt: formatDate(emailDate),
      receivedTimestamp: emailDate.getTime(),
      priority: confidence < 80 ? 'High' : confidence < 90 ? 'Medium' : 'Low',
      slaRisk: confidence < 84 && status !== 'Resolved',
      
      classification: {
        primary: classification,
        confidence,
        alternatives: alternatives.slice(0, 3),
        modelVersion: 'gpt-4-turbo-2026-05',
        modelEndpoint: 'https://azure-openai.azure.com/',
        summary: `${entities.investorName} requests ${entities.requestedAction || 'assistance'} for ${entities.fundName}.${entities.dollarAmount ? ` Amount: ${entities.dollarAmount}` : ''}`,
        extractedEntities: entities,
      },
      
      attachments: generateAttachments(i % 4),
      investorInsight: generateInvestorInsight(client, entities),
      jiraTickets: generateJiraTickets(`EM-${String(i + 1).padStart(3, '0')}`, classification, entities, emailDate),
      review: generateReview(classification, confidence),
      exceptions: generateExceptions(confidence, classification),
      auditTrail: generateAuditTrail(`EM-${String(i + 1).padStart(3, '0')}`, classification, confidence, entities, emailDate),
      acknowledgement: generateAcknowledgement(emailDate),
      
      pipeline: generatePipeline(status, emailDate),
    });
  }
  
  // Sort by date (newest first)
  return emails.sort((a, b) => b.receivedTimestamp - a.receivedTimestamp);
}

// ─── ENTITIES ─────────────────────────────────────────────────────────────────

function generateEntities(client, classification) {
  const firstName = ['John', 'Sarah', 'Michael', 'Lisa', 'David', 'Emily', 'James', 'Anna', 'Robert', 'Maria'][rand(0, 9)];
  const lastName = ['Smith', 'Lee', 'Davis', 'Wong', 'Chen', 'Ross', 'Park', 'Torres', 'Johnson', 'Williams'][rand(0, 9)];
  const fundNames = [
    `${client.split(' ')[0]} Total Return Fund`,
    `${client.split(' ')[0]} Income Fund`,
    `${client.split(' ')[0]} Emerging Markets Fund`,
    `${client.split(' ')[0]} Growth Fund`,
    `${client.split(' ')[0]} Value Fund`,
  ];
  
  const entities = {
    investorName: `${firstName} ${lastName}`,
    investorId: `INV-${String(rand(10000, 99999)).padStart(5, '0')}`,
    accountNumber: String(rand(10000000, 99999999)),
    fundName: pick(fundNames),
    requestedAction: '',
    dollarAmount: null,
    transactionDate: null,
  };

  if (classification === 'Investor Inquiry') {
    entities.requestedAction = 'Provide information';
  } else if (classification === 'Reporting Request') {
    entities.requestedAction = 'Generate report';
    entities.dollarAmount = `$${rand(10000, 1000000).toLocaleString()}`;
  } else if (classification === 'Account Maintenance') {
    entities.requestedAction = 'Update account details';
  } else if (classification === 'Onboarding') {
    entities.requestedAction = 'Onboard new investor';
  } else if (classification === 'Document Request') {
    entities.requestedAction = 'Provide documents';
  } else if (classification === 'Wire Instruction') {
    entities.requestedAction = 'Process wire transfer';
    entities.dollarAmount = `$${rand(50000, 5000000).toLocaleString()}`;
  } else if (classification === 'Redemption Request') {
    entities.requestedAction = 'Process redemption';
    entities.dollarAmount = `$${rand(100000, 2000000).toLocaleString()}`;
  }

  return entities;
}

// ─── ATTACHMENTS ─────────────────────────────────────────────────────────────

const ATTACHMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'text/plain',
];

const DOCUMENT_TYPES = [
  'Request Form',
  'Legal Document',
  'Tax Form',
  'Subscription Agreement',
  'Power of Attorney',
  'Financial Statement',
  'KYC Document',
  'W-8 Form',
];

function generateAttachments(count = rand(0, 3)) {
  const attachments = [];
  for (let i = 0; i < count; i++) {
    const statuses = ['completed', 'processing', 'pending', 'failed'];
    const status = statuses[rand(0, 3)];
    const docType = pick(DOCUMENT_TYPES);
    const extractedFields = status === 'completed' ? {
      investorName: 'John Doe',
      accountNumber: '12345678',
      fundName: 'PIMCO Total Return Fund',
      requestType: docType,
      signature: 'John Doe',
      date: '2026-06-07',
    } : null;

    attachments.push({
      id: `ATT-${String(i + 1).padStart(3, '0')}`,
      filename: `${docType.toLowerCase().replace(/ /g, '_')}_${rand(1, 99)}.${['pdf', 'jpg', 'png', 'docx', 'xlsx'][rand(0, 4)]}`,
      mimeType: pick(ATTACHMENT_TYPES),
      size: rand(50000, 2500000),
      pages: rand(1, 8),
      documentType: docType,
      extractionStatus: status,
      extractionConfidence: status === 'completed' ? conf(78, 97) : null,
      ocrEngine: status !== 'pending' ? 'Azure Document Intelligence v3.1' : null,
      extractedFields,
      previewUrl: '#',
      error: status === 'failed' ? 'OCR processing failed' : null,
    });
  }
  return attachments;
}

// ─── INVESTOR INSIGHT ────────────────────────────────────────────────────────

function generateInvestorInsight(client, entities) {
  const fundHoldings = [
    { fund: `${client.split(' ')[0]} Total Return Fund`, value: rand(1000000, 5000000), percentage: 0 },
    { fund: `${client.split(' ')[0]} Income Fund`, value: rand(500000, 3000000), percentage: 0 },
    { fund: `${client.split(' ')[0]} Emerging Markets Fund`, value: rand(500000, 2000000), percentage: 0 },
  ];
  
  const total = fundHoldings.reduce((s, f) => s + f.value, 0);
  fundHoldings.forEach(f => f.percentage = Math.round((f.value / total) * 100));

  const matchStatuses = ['matched', 'partial', 'not_found'];
  const matchStatus = matchStatuses[rand(0, 2)];

  return {
    lookupStatus: matchStatus,
    matchConfidence: matchStatus === 'matched' ? conf(85, 99) : matchStatus === 'partial' ? conf(50, 75) : 0,
    investorId: entities.investorId,
    investorName: entities.investorName,
    accountNumber: entities.accountNumber,
    accountType: pick(['Individual', 'Joint', 'IRA', 'Trust', 'Entity']),
    totalAUM: total,
    status: pick(['Active', 'Active', 'Active', 'Inactive', 'Pending']),
    advisorName: pick(OWNERS),
    advisorEmail: `${pick(OWNERS).toLowerCase().replace(' ', '.')}@ntrs.com`,
    fundHoldings,
    contactInfo: {
      phone: `+1 (${rand(200, 999)}) ${rand(200, 999)}-${String(rand(1000, 9999))}`,
      email: `${entities.investorName.toLowerCase().replace(' ', '.')}@client.com`,
      address: `${rand(100, 999)} ${['Main St', 'Park Ave', 'Broadway', 'Wall St', '5th Ave'][rand(0, 4)]}, ${pick(['New York', 'Chicago', 'Los Angeles', 'Boston', 'San Francisco'])}, ${pick(['NY', 'IL', 'CA', 'MA', 'CA'])} ${String(rand(10001, 99999))}`,
    },
  };
}

// ─── JIRA TICKETS ────────────────────────────────────────────────────────────

function generateJiraTickets(emailId, classification, entities, emailDate) {
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Pending'];
  const priorities = ['High', 'Medium', 'Low'];
  const numTickets = rand(0, 2);
  const tickets = [];

  for (let i = 0; i < numTickets; i++) {
    const status = pick(statuses);
    const priority = pick(priorities);
    const assignee = pick(OWNERS);
    const jiraId = `IS-${String(rand(45000, 49999))}`;
    const isResolved = status === 'Resolved' || status === 'Closed';
    
    const createdAt = new Date(emailDate);
    createdAt.setMinutes(createdAt.getMinutes() + rand(1, 10));
    
    tickets.push({
      id: jiraId,
      project: 'INVESTOR-SERVICES',
      summary: `${classification} for ${entities.investorName} - ${entities.fundName}`,
      description: `${entities.investorName} (ID: ${entities.investorId}) requests ${entities.requestedAction || 'assistance'} for ${entities.fundName} (Account: ${entities.accountNumber}).${entities.dollarAmount ? ` Amount: ${entities.dollarAmount}` : ''}`,
      status,
      priority,
      issueType: pick(['Service Request', 'Task', 'Incident']),
      assignee,
      reporter: 'System',
      createdAt: formatDate(createdAt),
      updatedAt: isResolved ? formatDate(new Date(createdAt.getTime() + rand(60000, 3600000))) : formatDate(new Date(createdAt.getTime() + rand(60000, 1800000))),
      resolvedAt: isResolved ? formatDate(new Date(createdAt.getTime() + rand(3600000, 86400000))) : null,
      comments: rand(0, 3) > 0 ? [
        {
          id: `C-${String(rand(100, 999))}`,
          user: assignee,
          timestamp: formatDate(new Date(createdAt.getTime() + rand(60000, 1800000))),
          text: pick([
            'Working on this, will update by EOD.',
            'Waiting for additional information from client.',
            'Processing the request now.',
            'Need to verify some details before proceeding.',
            'This has been escalated to the senior team.',
          ]),
          type: pick(['internal', 'public']),
        },
        {
          id: `C-${String(rand(100, 999))}`,
          user: entities.investorName,
          timestamp: formatDate(new Date(createdAt.getTime() + rand(120000, 3600000))),
          text: pick([
            'Please let me know when this is complete.',
            'I need this as soon as possible.',
            'Can you provide an update?',
            'Thank you for your assistance.',
          ]),
          type: 'public',
        },
      ] : [],
      links: rand(0, 1) > 0 ? [{ type: 'related', issueId: `IS-${String(rand(45000, 49999))}` }] : [],
      attachments: rand(0, 1) > 0 ? ['document.pdf'] : [],
    });
  }
  return tickets;
}

// ─── REVIEW WORKFLOW ─────────────────────────────────────────────────────────

function generateReview(classification, confidence) {
  const needsReview = confidence < 85 || rand(0, 10) > 7;
  let status = 'pending_review';
  
  if (!needsReview && rand(0, 10) > 4) {
    status = pick(['approved', 'golden_dataset']);
  }

  return {
    status,
    reviewedBy: status !== 'pending_review' ? pick(OWNERS) : null,
    reviewedAt: status !== 'pending_review' ? formatDate(new Date(Date.now() - rand(60000, 86400000))) : null,
    originalClassification: classification,
    overriddenClassification: null,
    overrideReason: null,
    isGoldenDataset: status === 'golden_dataset',
    notes: null,
    reviewHistory: [],
  };
}

// ─── AUDIT TRAIL ─────────────────────────────────────────────────────────────

function generateAuditTrail(emailId, classification, confidence, entities, emailDate) {
  const actions = [
    { 
      action: 'Email Received', 
      details: 'Ingested from mailbox is-team@ntrs.com', 
      user: 'System (Graph API)' 
    },
    { 
      action: 'Email Normalized', 
      details: 'Content cleaned and metadata extracted', 
      user: 'System (Normalization)' 
    },
    { 
      action: 'AI Classification', 
      details: `Classified as ${classification} (${confidence}% confidence)`, 
      user: 'System (Azure OpenAI)' 
    },
    { 
      action: 'Extracted Entities', 
      details: `Extracted investor: ${entities.investorName}, Fund: ${entities.fundName}`, 
      user: 'System (Extraction)' 
    },
    { 
      action: 'Investor Lookup', 
      details: `Matched to ${entities.investorId}`, 
      user: 'System (Investor Insight)' 
    },
  ];

  if (confidence > 75 && rand(0, 10) > 2) {
    actions.push({
      action: 'JIRA Ticket Created',
      details: `Created ticket for ${entities.investorName}`,
      user: 'System (JIRA)',
    });
  }

  if (confidence < 85 || rand(0, 10) > 7) {
    actions.push({
      action: 'Review Required',
      details: 'Sent to human review queue',
      user: 'System (Workflow)',
    });
  }

  const baseTime = new Date(emailDate);
  return actions.map((a, i) => {
    const time = new Date(baseTime);
    time.setMinutes(time.getMinutes() + i * 2 + rand(0, 3));
    return {
      timestamp: formatDate(time),
      user: a.user,
      action: a.action,
      details: a.details,
      traceId: `TRACE-${String(rand(100, 999))}`,
      status: rand(0, 10) > 1 ? 'success' : pick(['success', 'warning', 'error']),
    };
  });
}

// ─── OUTLOOK ACKNOWLEDGEMENT ─────────────────────────────────────────────────

function generateAcknowledgement(emailDate) {
  const statuses = ['pending', 'sent', 'failed'];
  const status = statuses[rand(0, 2)];
  const sentAt = status === 'sent' ? new Date(emailDate.getTime() + rand(60000, 3600000)) : null;
  return {
    required: true,
    sent: status === 'sent',
    sentAt: sentAt ? formatDate(sentAt) : null,
    draftBody: `Dear Investor,\n\nThank you for your recent inquiry. Your request has been received and is being processed. We will provide an update shortly.\n\nBest regards,\nInvestor Services Team`,
    status,
    error: status === 'failed' ? 'Failed to send acknowledgement' : null,
    threadId: `AAMkADFhY2Y4MTUyLTMwYzYtNDUzZC1hODVlLWNlZjRlZjA5YzY5ZgBGAAAAAAB${String(rand(1000, 9999))}`,
  };
}

// ─── EXCEPTIONS ──────────────────────────────────────────────────────────────

function generateExceptions(confidence, classification) {
  const exceptions = [];
  if (confidence < 80) {
    exceptions.push({
      id: `EXC-${String(rand(100, 999))}`,
      type: 'low_confidence',
      severity: confidence < 70 ? 'high' : 'medium',
      description: `Low confidence (${confidence}%) for classification`,
      status: 'open',
      assignedTo: null,
      resolution: null,
      createdAt: formatDate(new Date()),
    });
  }
  if (rand(0, 10) > 8) {
    exceptions.push({
      id: `EXC-${String(rand(100, 999))}`,
      type: 'missing_data',
      severity: 'medium',
      description: 'Missing investor ID in extracted data',
      status: 'in_progress',
      assignedTo: pick(OWNERS),
      resolution: null,
      createdAt: formatDate(new Date()),
    });
  }
  return exceptions;
}

// ─── PIPELINE ─────────────────────────────────────────────────────────────────

function generatePipeline(status, emailDate) {
  const steps = [
    { key: 'Received', note: 'Email received in Investor Services mailbox' },
    { key: 'Normalized', note: 'Email content and attachments normalized' },
    { key: 'Classified', note: 'AI classification completed with confidence score' },
    { key: 'Validated', note: 'Validation rules passed successfully' },
    { key: 'JIRA Created', note: 'Ticket created in project management system' },
    { key: 'Assigned', note: 'Assigned to team member for action' },
    { key: 'Resolved', note: 'Issue resolved and closed' },
  ];

  const statusIndex = steps.findIndex(s => s.key === status);
  const doneUntil = statusIndex === -1 ? steps.length : statusIndex + 1;

  return steps.map((s, i) => {
    const time = new Date(emailDate);
    time.setMinutes(time.getMinutes() + i * 2);
    return {
      ...s,
      done: i < doneUntil,
      current: i === doneUntil - 1 && status !== 'Resolved',
      time: i < doneUntil ? formatDate(time) : null,
    };
  });
}

// ─── MAIN API ─────────────────────────────────────────────────────────────────

let CACHED_EMAILS = [];
let CACHED_RANGE = null;

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const enhancedEmailApi = {
  async list({ search = '', status = '', classification = '', page = 1, perPage = 10, startDate = null, endDate = null } = {}) {
    await delay(300);
    
    // Generate fresh data based on date range
    let allEmails = [];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Check if we have cached data for this range
      const cacheKey = start.getTime() + '-' + end.getTime();
      if (CACHED_RANGE === cacheKey && CACHED_EMAILS.length > 0) {
        allEmails = CACHED_EMAILS;
      } else {
        allEmails = generateEmailsForDateRange(start, end, 45);
        CACHED_EMAILS = allEmails;
        CACHED_RANGE = cacheKey;
      }
    } else {
      // Default: last 30 days
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      allEmails = generateEmailsForDateRange(start, end, 45);
    }
    
    // Apply filters
    let results = [...allEmails];
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(e =>
        e.subject.toLowerCase().includes(s) ||
        e.client.toLowerCase().includes(s) ||
        e.classification.primary.toLowerCase().includes(s) ||
        e.from.toLowerCase().includes(s)
      );
    }
    if (status) results = results.filter(e => e.status === status);
    if (classification) results = results.filter(e => e.classification.primary === classification);
    
    // Sort by date (newest first)
    results.sort((a, b) => b.receivedTimestamp - a.receivedTimestamp);
    
    const total = results.length;
    const data = results.slice((page - 1) * perPage, page * perPage);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  },

  async get(id) {
    await delay(150);
    return CACHED_EMAILS.find(e => e.id === id) || null;
  },

  async assign(id, owner) {
    await delay(250);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      email.owner = owner;
      email.status = 'Assigned';
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'System',
        action: 'Assigned',
        details: `Assigned to ${owner}`,
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'success',
      });
    }
    return { success: true, id, owner };
  },

  async createJira(id) {
    await delay(500);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      const jiraId = `IS-${String(rand(45000, 49999))}`;
      email.jiraTickets.push({
        id: jiraId,
        project: 'INVESTOR-SERVICES',
        summary: `${email.classification.primary} for ${email.classification.extractedEntities.investorName}`,
        description: `Request from ${email.classification.extractedEntities.investorName}`,
        status: 'Open',
        priority: email.priority,
        issueType: 'Service Request',
        assignee: email.owner || 'Unassigned',
        reporter: 'System',
        createdAt: formatDate(new Date()),
        updatedAt: formatDate(new Date()),
        resolvedAt: null,
        comments: [],
        links: [],
        attachments: [],
      });
      email.status = 'JIRA Created';
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'System',
        action: 'JIRA Created',
        details: `Created ticket ${jiraId}`,
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'success',
      });
    }
    return { success: true, id, jiraId: `IS-${String(rand(45000, 49999))}` };
  },

  async approve(id) {
    await delay(300);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      email.review.status = 'approved';
      email.review.reviewedBy = 'Admin User';
      email.review.reviewedAt = formatDate(new Date());
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'Admin User',
        action: 'Approved',
        details: 'Classification approved by human reviewer',
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'success',
      });
    }
    return { success: true, id };
  },

  async reject(id, reason) {
    await delay(300);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      email.review.status = 'rejected';
      email.review.reviewedBy = 'Admin User';
      email.review.reviewedAt = formatDate(new Date());
      email.review.notes = reason;
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'Admin User',
        action: 'Rejected',
        details: `Classification rejected: ${reason}`,
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'warning',
      });
    }
    return { success: true, id };
  },

  async overrideClassification(id, newClassification, reason) {
    await delay(300);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      email.review.status = 'overridden';
      email.review.overriddenClassification = newClassification;
      email.review.overrideReason = reason;
      email.review.reviewedBy = 'Admin User';
      email.review.reviewedAt = formatDate(new Date());
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'Admin User',
        action: 'Classification Overridden',
        details: `Changed from ${email.classification.primary} to ${newClassification}`,
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'success',
      });
    }
    return { success: true, id };
  },

  async markGoldenDataset(id) {
    await delay(300);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      email.review.isGoldenDataset = true;
      email.review.status = 'golden_dataset';
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'Admin User',
        action: 'Golden Dataset',
        details: 'Marked as golden dataset for training',
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'success',
      });
    }
    return { success: true, id };
  },

  async addJiraComment(id, comment) {
    await delay(300);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email && email.jiraTickets.length > 0) {
      const ticket = email.jiraTickets[0];
      ticket.comments.push({
        id: `C-${String(rand(100, 999))}`,
        user: 'Admin User',
        timestamp: formatDate(new Date()),
        text: comment,
        type: 'internal',
      });
      ticket.updatedAt = formatDate(new Date());
    }
    return { success: true, id };
  },

  async sendAcknowledgement(id) {
    await delay(400);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      email.acknowledgement.status = 'sent';
      email.acknowledgement.sent = true;
      email.acknowledgement.sentAt = formatDate(new Date());
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'System',
        action: 'Acknowledgement Sent',
        details: 'Email acknowledgement sent to client',
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'success',
      });
    }
    return { success: true, id };
  },

  async resolve(id) {
    await delay(300);
    const email = CACHED_EMAILS.find(e => e.id === id);
    if (email) {
      email.status = 'Resolved';
      email.pipeline = email.pipeline.map(p => ({
        ...p,
        done: true,
        current: false,
        time: p.time || formatDate(new Date()),
      }));
      email.auditTrail.push({
        timestamp: formatDate(new Date()),
        user: 'Admin User',
        action: 'Resolved',
        details: 'Email processing completed',
        traceId: `TRACE-${String(rand(100, 999))}`,
        status: 'success',
      });
    }
    return { success: true, id };
  },

  // Clear cache to force regeneration
  clearCache() {
    CACHED_EMAILS = [];
    CACHED_RANGE = null;
  },
};

// Export for use in other components
export { generateEmailsForDateRange };