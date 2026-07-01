// ─── MASTER LISTS ────────────────────────────────────────────────────────────

export const CLIENTS = [
  'ABC Capital', 'XYZ Partners', 'Global Fund LP', 'PQR Holdings',
  'LMN Advisors', 'Alpha Family Office', 'Beta Asset Mgmt', 'Gamma Capital',
  'Delta Investments', 'Omega Fund', 'Apex Ventures', 'Meridian Capital',
  'Nexus Partners', 'Vega Asset Mgmt', 'Titan Global', 'Crestwood LP',
  'Ironwood Capital', 'Pinnacle Fund', 'Summit Partners', 'Harbor Investments',
];

export const FUNDS = [
  'Fund I', 'Fund II', 'Fund III', 'Master Fund', 'Offshore LP',
  'Onshore LP', 'PE Fund III', 'Hedge Fund A', 'CIT Fund', 'Alternative Fund',
];

export const OWNERS = [
  'John Smith', 'Sarah Lee', 'Michael Davis', 'Lisa Wong',
  'David Chen', 'Emily Ross', 'James Park', 'Anna Torres',
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function genId() { return Math.random().toString(36).substr(2, 9); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function conf(min = 72, max = 98) { return rand(min, max); }

const BASE = new Date('2026-05-27T09:14:00');
function ts(minsAgo) {
  const d = new Date(BASE - minsAgo * 60000);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// ─── EMAILS ──────────────────────────────────────────────────────────────────

export const EMAIL_CLASSIFICATIONS = [
  'Investor Inquiry', 'Account Maintenance', 'Reporting Request',
  'Onboarding', 'Document Request', 'Compliance',
  'Wire Instruction', 'Redemption Request',
];

export const EMAIL_STATUSES = [
  'Assigned', 'JIRA Created', 'Validating', 'Normalized', 'Resolved', 'Pending',
];

const EMAIL_SUBJECTS = {
  'Investor Inquiry':    'Inquiry on account statement',
  'Account Maintenance': 'Wire instruction change request',
  'Reporting Request':   'Monthly report request',
  'Onboarding':          'Onboarding new investor',
  'Document Request':    'Tax document request',
  'Compliance':          'Compliance clarification',
  'Wire Instruction':    'Wire transfer authorization',
  'Redemption Request':  'Redemption request',
};

const PIPELINE_STEPS = [
  { key: 'Received',    note: 'Email received in Investor Services mailbox' },
  { key: 'Normalized',  note: 'Email content and attachments normalized' },
  { key: 'Classified',  note: 'AI classification completed with confidence score' },
  { key: 'Validated',   note: 'Validation rules passed successfully' },
  { key: 'JIRA Created',note: 'Ticket created in project management system' },
  { key: 'Assigned',    note: 'Assigned to team member for action' },
  { key: 'Resolved',    note: 'Issue resolved and closed' },
];

function buildPipeline(status, minsAgo) {
  const idx = PIPELINE_STEPS.findIndex(s => s.key === status);
  const doneUntil = idx === -1 ? PIPELINE_STEPS.length : idx + 1;
  return PIPELINE_STEPS.map((s, i) => ({
    ...s,
    done:    i < doneUntil,
    current: i === doneUntil - 1 && status !== 'Resolved',
    time:    i < doneUntil ? ts(minsAgo - i * 2) : null,
  }));
}

export const EMAILS = Array.from({ length: 52 }, (_, i) => {
  const status = i < 4 ? 'Pending'
    : i < 12 ? 'Normalized'
    : i < 20 ? 'Validating'
    : i < 32 ? 'Assigned'
    : i < 44 ? 'JIRA Created'
    : 'Resolved';

  const cls      = pick(EMAIL_CLASSIFICATIONS);
  const client   = pick(CLIENTS);
  const minsAgo  = i * 7 + rand(0, 6);
  const confidence = conf(76, 98);
  const hasOwner = ['Assigned', 'JIRA Created', 'Resolved'].includes(status);

  return {
    id:             genId(),
    subject:        EMAIL_SUBJECTS[cls] + (i > 3 ? ` - ${client}` : ''),
    client,
    classification: cls,
    confidence,
    status,
    owner:          hasOwner ? pick(OWNERS) : null,
    receivedAt:     ts(minsAgo),
    from:           `${client.split(' ')[0].toLowerCase()}@investor.com`,
    to:             'is-team@ntrs.com',
    jiraId:         ['JIRA Created', 'Resolved'].includes(status) ? `IS-${45000 + i}` : null,
    slaRisk:        confidence < 84 && status !== 'Resolved',
    pipeline:       buildPipeline(status, minsAgo),
    priority:       confidence < 80 ? 'High' : confidence < 90 ? 'Medium' : 'Low',
  };
});

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

export const DOC_TYPES = [
  'Subscription Document', 'KYC Form', 'Tax Document (W-8BEN)',
  'Wire Instruction', 'Investor Agreement', 'FATCA Form',
  'AML Questionnaire', 'Accredited Investor Cert',
];

export const DOC_STATUSES = [
  'Processing', 'Extracted', 'Under Review', 'Validated', 'Failed',
];

export const DOC_SOURCES = [
  'Email Attachment', 'FTP Upload', 'Portal Submission', 'Secure Email',
];

const BASE_FIELDS = [
  { name: 'Legal Entity Name',      value: 'Alpha Capital Partners LLC',      baseConf: 96 },
  { name: 'Tax ID (EIN)',            value: '84-2934871',                       baseConf: 92 },
  { name: 'Entity Type',             value: 'Limited Liability Company',        baseConf: 88 },
  { name: 'Jurisdiction',            value: 'Delaware, United States',          baseConf: 94 },
  { name: 'Commitment Amount',       value: '$5,000,000',                       baseConf: 85 },
  { name: 'Contact Name',            value: 'James Whitfield',                  baseConf: 91 },
  { name: 'Contact Email',           value: 'j.whitfield@alphacapital.com',     baseConf: 97 },
  { name: 'Authorized Signatory',    value: 'James Whitfield, Managing Director',baseConf: 79 },
  { name: 'Date of Incorporation',   value: 'March 15, 2018',                   baseConf: 88 },
  { name: 'Beneficial Owner >25%',   value: '[FLAGGED – Requires Manual Review]',baseConf: 71 },
  { name: 'Bank Account Number',     value: 'XXXX-XXXX-4821',                   baseConf: 93 },
  { name: 'ABA Routing Number',      value: '021000021',                        baseConf: 95 },
];

function buildFields(seed) {
  return BASE_FIELDS.map(f => {
    const c = Math.max(60, Math.min(99, f.baseConf + rand(-8, 6)));
    return {
      ...f,
      confidence: c,
      status: c < 75 ? 'flag' : c < 85 ? 'review' : 'ok',
    };
  });
}

export const DOCUMENTS = Array.from({ length: 36 }, (_, i) => {
  const status = i < 4 ? 'Processing'
    : i < 10 ? 'Failed'
    : i < 18 ? 'Under Review'
    : i < 28 ? 'Extracted'
    : 'Validated';

  const client = pick(CLIENTS);
  const total  = rand(18, 32);
  const extracted = status === 'Processing' ? rand(2, 8)
    : status === 'Failed' ? rand(4, 10)
    : rand(Math.floor(total * 0.7), total);

  return {
    id:              genId(),
    docType:         pick(DOC_TYPES),
    client,
    fund:            `${client.split(' ')[0]} ${pick(FUNDS)}`,
    status,
    confidence:      conf(68, 97),
    receivedAt:      ts(i * 17 + rand(0, 10)),
    pages:           rand(2, 22),
    fieldsExtracted: extracted,
    fieldsTotal:     total,
    source:          pick(DOC_SOURCES),
    flagged:         status === 'Under Review' || status === 'Failed',
    fields:          buildFields(i),
    ocrEngine:       pick(['Azure Document Intelligence', 'Mistral OCR', 'Docling']),
  };
});

// ─── FEE CALCULATIONS ────────────────────────────────────────────────────────

export const FEE_TYPES = [
  'Management Fee', 'Carried Interest', 'Incentive Fee', 'Administrative Fee',
];

export const FEE_STATUSES = [
  'Automated', 'Under Review', 'Exception', 'Pending Approval', 'Completed',
];

export const CALC_PERIODS = ['Q1 2026', 'Q2 2026', 'Q4 2025', 'Q3 2025'];
export const CALC_SOURCES = ['Geneva', 'InvesTier', 'InvesTran'];

function buildWaterfall(feeType, aumRaw, rate) {
  const aum = aumRaw;
  const hurdle    = +(aum * 0.08 / 4).toFixed(0);
  const catchup   = +(aum * 0.02 / 4).toFixed(0);
  const gpShare   = +(aum * (rate / 100) / 4 * 0.2).toFixed(0);
  const lpShare   = +(aum * (rate / 100) / 4 * 0.8).toFixed(0);
  const netFee    = gpShare + lpShare;
  const fmt = n => n < 0
    ? `-$${Math.abs(n / 1000).toFixed(0)}K`
    : `$${(n / 1000).toFixed(0)}K`;

  if (feeType === 'Carried Interest') {
    return [
      { label: 'Gross AUM',            value: `$${(aum / 1e6).toFixed(1)}M`, note: 'NAV as of period end' },
      { label: 'Preferred Return (8%)',value: fmt(-hurdle),                  note: 'Hurdle threshold deducted' },
      { label: 'GP Catch-up (20%)',     value: fmt(catchup),                  note: '20% catch-up tier applied' },
      { label: 'LP Share (80%)',        value: fmt(lpShare),                  note: 'Pro-rata LP distribution' },
      { label: 'GP Carried Interest',  value: fmt(gpShare),                   note: '20% carry on profits' },
      { label: 'Net Fee',              value: fmt(netFee),                    note: 'Final calculated amount', highlight: true },
    ];
  }
  if (feeType === 'Management Fee') {
    const fee = +(aum * (rate / 100) / 4).toFixed(0);
    return [
      { label: 'AUM at Period End',    value: `$${(aum / 1e6).toFixed(1)}M`, note: 'Verified against Geneva NAV' },
      { label: `Annual Rate (${rate}%)`,value: `${rate}%`,                   note: 'Per Investment Management Agreement' },
      { label: 'Quarterly Pro-ration', value: '÷ 4',                         note: 'Calendar quarter adjustment' },
      { label: 'Fee Before Adjustments',value: fmt(fee),                     note: 'Base management fee' },
      { label: 'Side Letter Adjustment',value: '$0K',                        note: 'No applicable adjustments' },
      { label: 'Net Management Fee',   value: fmt(fee),                      note: 'Final payable amount', highlight: true },
    ];
  }
  const fee = +(aum * (rate / 100) / 4).toFixed(0);
  return [
    { label: 'Gross AUM',   value: `$${(aum / 1e6).toFixed(1)}M`, note: 'Period end valuation' },
    { label: 'Fee Rate',    value: `${rate}%`,                    note: 'Agreed rate per IMA' },
    { label: 'Calculated Fee', value: fmt(fee),                   note: 'Gross fee amount' },
    { label: 'Net Fee',     value: fmt(fee),                      note: 'Final payable', highlight: true },
  ];
}

export const FEE_CALCS = Array.from({ length: 28 }, (_, i) => {
  const feeType = pick(FEE_TYPES);
  const client  = pick(CLIENTS);
  const status  = i < 3 ? 'Exception'
    : i < 8  ? 'Under Review'
    : i < 16 ? 'Automated'
    : i < 23 ? 'Completed'
    : 'Pending Approval';

  const aum    = rand(50, 850) * 1_000_000;
  const rateMap = { 'Management Fee': 1.5, 'Carried Interest': 20, 'Incentive Fee': 20, 'Administrative Fee': 0.15 };
  const rate   = rateMap[feeType];
  const fee    = +(aum * (rate / 100) / 4).toFixed(0);
  const excCnt = status === 'Exception' ? rand(1, 4) : status === 'Under Review' ? rand(0, 2) : 0;

  return {
    id:             genId(),
    feeType,
    client,
    fund:           `${client.split(' ')[0]} ${pick(FUNDS)}`,
    status,
    period:         pick(CALC_PERIODS),
    aum:            `$${(aum / 1e6).toFixed(0)}M`,
    aumRaw:         aum,
    calculatedFee:  `$${(fee / 1000).toFixed(0)}K`,
    feeAmtRaw:      fee,
    rate:           `${rate}%`,
    automationRate: rand(72, 99),
    exceptions:     excCnt,
    reconciled:     ['Completed', 'Automated'].includes(status),
    computedAt:     ts(i * 48 + rand(0, 20)),
    calcSource:     pick(CALC_SOURCES),
    waterfall:      buildWaterfall(feeType, aum, rate),
    priority:       excCnt > 2 ? 'High' : excCnt > 0 ? 'Medium' : 'Low',
  };
});

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export const DASHBOARD = {
  uc10: {
    received:      3241,
    autoRouted:    2949,
    humanReview:   143,
    slaAtRisk:     17,
    slaCompliance: 98,
    exceptions:    22,
    avgConfidence: 91,
  },
  uc11: {
    processed:       412,
    extractionAccuracy: 84,
    validationQueue: 58,
    exceptions:      11,
    slaCompliance:   95,
    docsToday:       47,
    avgConfidence:   87,
  },
  uc19: {
    runs:            89,
    automationRate:  87,
    exceptions:      9,
    reconciliations: 4,
    slaCompliance:   97,
    feesProcessed:   '$2.4M',
    avgAccuracy:     94,
  },
};