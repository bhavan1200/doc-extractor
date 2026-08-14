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

// ─── DOCUMENTS (UC-11) ───────────────────────────────────────────────────────
// SOW-accurate: doc types are Sub Docs, SIF Docs, Tax Docs (W-8/W-9 family)
// Sources: Email, FTP, Kiteworks (shared repos)
// Onboarding types: Initial (90 min baseline) and Additional (9 min baseline)

export const DOC_TYPES = [
  'Subscription Document',
  'SIF Document',
  'Tax Form – W-8BEN',
  'Tax Form – W-8BEN-E',
  'Tax Form – W-9',
  'Tax Form – W-8ECI',
  'Tax Form – W-8IMY',
  'CRS Self-Certification',
];

// Initial Onboarding = full packet (Sub Doc + SIF + Tax) — 90 min baseline
// Additional Onboarding = incremental update — 9 min baseline
export const ONBOARDING_TYPES = ['Initial Onboarding', 'Additional Onboarding'];

export const DOC_STATUSES = [
  'Processing', 'Extracted', 'Under Review', 'Validated', 'Failed',
];

// SOW Schedule 1 — input channels
export const DOC_SOURCES = [
  'Email Attachment', 'FTP Upload', 'Kiteworks', 'Shared Repository',
];

// Fields actually extracted during subscription onboarding
const BASE_FIELDS = [
  { name: 'Legal Entity Name',        value: 'Crestwood LP',                      baseConf: 96 },
  { name: 'Entity Type',              value: 'Limited Partnership',                baseConf: 92 },
  { name: 'Tax ID / EIN',             value: '47-3821904',                         baseConf: 91 },
  { name: 'Jurisdiction',             value: 'Delaware, United States',            baseConf: 94 },
  { name: 'Commitment Amount',        value: '$2,500,000',                         baseConf: 87 },
  { name: 'Authorized Signatory',     value: 'Patricia Holloway, Managing Partner',baseConf: 82 },
  { name: 'Signatory Email',          value: 'p.holloway@crestwoodlp.com',         baseConf: 97 },
  { name: 'Date of Incorporation',    value: 'June 4, 2015',                       baseConf: 88 },
  { name: 'Beneficial Owner >25%',    value: '[FLAGGED – Requires Manual Review]', baseConf: 69 },
  { name: 'Tax Classification',       value: 'Partnership',                        baseConf: 93 },
  { name: 'Bank Account (Last 4)',    value: 'XXXX-7203',                          baseConf: 95 },
  { name: 'ABA Routing Number',       value: '021000021',                          baseConf: 94 },
  { name: 'FATCA Status',             value: 'Exempt Payee',                       baseConf: 85 },
  { name: 'Country of Formation',     value: 'United States',                      baseConf: 96 },
];

function buildFields() {
  return BASE_FIELDS.map(f => {
    const c = Math.max(58, Math.min(99, f.baseConf + rand(-10, 5)));
    return {
      ...f,
      confidence: c,
      status: c < 75 ? 'flag' : c < 85 ? 'review' : 'ok',
    };
  });
}

// Post-go-live simulation:
// ~87% of requests complete within 36–52 min (trending toward 36 min target)
// ~6% error rate (trending toward <5% target)
// Volume: ~136 initial + ~34 additional onboarding requests per day
export const DOCUMENTS = Array.from({ length: 48 }, (_, i) => {
  // Status distribution simulating post-go-live ramp:
  // 60% validated, 20% extracted, 10% under review, 6% processing, 4% failed
  const status = i < 2  ? 'Failed'
    : i < 7  ? 'Processing'
    : i < 17 ? 'Under Review'
    : i < 27 ? 'Extracted'
    : 'Validated';

  // ~80% Initial Onboarding (32K/40K annual), ~20% Additional (8K/40K)
  const onboardingType = i % 5 === 0 ? 'Additional Onboarding' : 'Initial Onboarding';

  // Processing time simulation: trending from 90 min baseline toward 36 min target
  // Earlier docs (higher i) are more recent and show more improvement
  const baselineMin  = onboardingType === 'Initial Onboarding' ? 90 : 9;
  const targetMin    = onboardingType === 'Initial Onboarding' ? 36 : 3.6;
  const improvement  = Math.min(0.58, 0.30 + (i / 48) * 0.28); // 30%→58% reduction ramp
  const actualMin    = Math.round(baselineMin * (1 - improvement) + rand(-4, 4));

  const client = pick(CLIENTS);
  const total  = rand(10, 16);
  const extracted = status === 'Processing' ? rand(2, 6)
    : status === 'Failed'      ? rand(3, 7)
    : rand(Math.floor(total * 0.75), total);

  // Error rate: ~6% of fields are wrong (target <5%)
  const errorFields = status === 'Validated' ? Math.round(total * rand(3, 8) / 100) : 0;

  return {
    id:              genId(),
    docType:         pick(DOC_TYPES),
    onboardingType,
    client,
    fund:            `${client.split(' ')[0]} ${pick(FUNDS)}`,
    status,
    confidence:      conf(72, 97),
    receivedAt:      ts(i * 14 + rand(0, 8)),
    pages:           rand(2, 18),
    fieldsExtracted: extracted,
    fieldsTotal:     total,
    errorFields,
    source:          pick(DOC_SOURCES),
    flagged:         status === 'Under Review' || status === 'Failed',
    fields:          buildFields(),
    processingTimeMin: actualMin,
    baselineTimeMin:   baselineMin,
    targetTimeMin:     targetMin,
    ocrEngine:       'Azure Document Intelligence',
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
  // ── UC-10 Email Triage ─────────────────────────────────────────────────────
  // SOW: 1335933.11 + Schedule 1335948.8
  // Baseline: 4.4 hrs / 2,500 emails → Target: 1.1 hrs (75% reduction) — Sched 3
  // 18.6 FTE baseline → 7.4 target (60% FTE reduction) — Sched 2
  // Transformation value: $1,149,512 · IBM gainshare: $344,853 (30%) — Sched 2
  uc10: {
    received:               3241,
    autoRouted:             2948,
    humanReview:            293,
    slaAtRisk:              17,
    slaCompliance:          97,
    exceptions:             22,
    avgConfidence:          87,
    baselineHrsPer2500:     4.4,
    targetHrsPer2500:       1.1,
    currentHrsPer2500:      1.85,
    triageReductionPct:     58,
    accuracyFloor:          76,
    accuracyPct:            87,
    baselineFTEs:           18.6,
    targetFTEs:             7.4,
    currentFTEs:            11.5,
    fteReductionPct:        38,
    transformationValue:    1149512,
    gainshareTotal:         344853,
    gainshareEarned:        104853,
    annualBaselineSpend:    1916480,
  },
  uc11: {
    // SOW Schedule 3 — contractual measurement metrics
    // Baseline: 90 min/Initial, 9 min/Additional — Target: 36 min / 3.6 min (60% reduction)
    totalRequestsProcessed:   412,
    initialOnboardingCount:   330,
    additionalOnboardingCount: 82,
    avgProcessingTimeMin:     52,
    baselineTimeMin:          90,
    targetTimeMin:            36,
    processingTimeReductionPct: 42,
    extractionErrorRate:      5.8,
    errorRateTarget:          5,
    avgConfidence:            88,
    transformationValue:      1135500,
    gainshareTotal:           340650,
    gainshareEarned:          104920,
    annualBaselineSpend:      2017500,
    annualValueCreated:       1210500,
    validationQueue:          17,
    exceptions:               9,
    requestsToday:            47,
    processed:                412,
  },
  // ── UC-19 Fee Calculation ──────────────────────────────────────────────────
  // SOW: IBM-SOW UC-19 with Schedules - Execution Version - 2 July 2026
  // Baseline: 40 min/calc → Target: 18 min (55% reduction) — Sched 3
  // 48 FTE baseline → 21.6 target (55% FTE reduction) — Sched 2
  // Transformation value: $2,499,411 · IBM gainshare: $749,823 (30%) — Sched 2
  uc19: {
    calculationsProcessed:  312,
    processingReductionPct: 36,
    baselineMinPerCalc:     40,
    targetMinPerCalc:       18,
    currentMinPerCalc:      25.6,
    exceptionRate:          9.6,
    reconciliationRate:     91,
    automationRate:         82,
    fteReductionPct:        24,
    baselineFTEs:           48,
    targetFTEs:             21.6,
    currentFTEs:            36.5,
    transformationValue:    2499411,
    gainshareTotal:         749823,
    gainshareEarned:        225000,
    annualBaselineSpend:    4617110,
    runs:                   312,
  },
};

// ── PORTFOLIO TOTALS (cross-UC, all values from SOW Schedules 2) ──────────────
export const PORTFOLIO = {
  combinedTransformationValue: 4784423,
  combinedGainshareTotal:      1435326,
  combinedGainshareEarned:     434773,
  combinedBaselineSpend:       8551090,
  useCases: [
    {
      id:                  'uc10',
      name:                'UC-10 Email Triage',
      icon:                '📧',
      transformationValue: 1149512,
      gainshareTotal:      344853,
      gainshareEarned:     104853,
      reductionTarget:     75,
      reductionAchieved:   58,
      goLiveDate:          'Sep 11, 2026',
      color:               '#4a9eff',
    },
    {
      id:                  'uc11',
      name:                'UC-11 Document Extraction',
      icon:                '📄',
      transformationValue: 1135500,
      gainshareTotal:      340650,
      gainshareEarned:     104920,
      reductionTarget:     60,
      reductionAchieved:   42,
      goLiveDate:          'Sep 11, 2026',
      color:               '#a78bfa',
    },
    {
      id:                  'uc19',
      name:                'UC-19 Fee Calculation',
      icon:                '💰',
      transformationValue: 2499411,
      gainshareTotal:      749823,
      gainshareEarned:     225000,
      reductionTarget:     55,
      reductionAchieved:   36,
      goLiveDate:          'Sep 11, 2026',
      color:               '#f5a623',
    },
  ],
};