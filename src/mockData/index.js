import { EMAILS, DOCUMENTS, FEE_CALCS, DASHBOARD, PORTFOLIO } from './mockData';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// ─── EMAIL API ───────────────────────────────────────────────────────────────

export const emailApi = {
  async list({ search = '', status = '', classification = '', page = 1, perPage = 10 } = {}) {
    await delay(300);
    let results = [...EMAILS];
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(e =>
        e.subject.toLowerCase().includes(s) ||
        e.client.toLowerCase().includes(s) ||
        e.classification.toLowerCase().includes(s)
      );
    }
    if (status) results = results.filter(e => e.status === status);
    if (classification) results = results.filter(e => e.classification === classification);
    const total = results.length;
    const data  = results.slice((page - 1) * perPage, page * perPage);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  },

  async get(id) {
    await delay(150);
    return EMAILS.find(e => e.id === id) || null;
  },

  async assign(id, owner) {
    await delay(250);
    return { success: true, id, owner };
  },

  async createJira(id) {
    await delay(500);
    return { success: true, id, jiraId: `IS-${Math.floor(Math.random() * 5000) + 46000}` };
  },
};

// ─── DOCUMENT API ────────────────────────────────────────────────────────────

export const documentApi = {
  async list({ search = '', status = '', page = 1, perPage = 10 } = {}) {
    await delay(350);
    let results = [...DOCUMENTS];
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(d =>
        d.docType.toLowerCase().includes(s) ||
        d.client.toLowerCase().includes(s) ||
        d.fund.toLowerCase().includes(s)
      );
    }
    if (status) results = results.filter(d => d.status === status);
    const total = results.length;
    const data  = results.slice((page - 1) * perPage, page * perPage);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  },

  async get(id) {
    await delay(150);
    return DOCUMENTS.find(d => d.id === id) || null;
  },

  async validate(id) {
    await delay(400);
    return { success: true, id, status: 'Validated' };
  },

  async flagReview(id, reason) {
    await delay(250);
    return { success: true, id, status: 'Under Review', reason };
  },
};

// ─── FEE CALCULATION API ─────────────────────────────────────────────────────

export const feeApi = {
  async list({ search = '', status = '', feeType = '', page = 1, perPage = 10 } = {}) {
    await delay(380);
    let results = [...FEE_CALCS];
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(c =>
        c.fund.toLowerCase().includes(s) ||
        c.client.toLowerCase().includes(s) ||
        c.feeType.toLowerCase().includes(s)
      );
    }
    if (status)  results = results.filter(c => c.status === status);
    if (feeType) results = results.filter(c => c.feeType === feeType);
    const total = results.length;
    const data  = results.slice((page - 1) * perPage, page * perPage);
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  },

  async get(id) {
    await delay(150);
    return FEE_CALCS.find(c => c.id === id) || null;
  },

  async approve(id) {
    await delay(500);
    return { success: true, id, status: 'Completed' };
  },

  async exportToGeneva(id) {
    await delay(600);
    return { success: true, id, exportedAt: new Date().toISOString() };
  },
};

// ─── DASHBOARD API ───────────────────────────────────────────────────────────

export const dashboardApi = {
  async getStats() {
    await delay(250);
    return DASHBOARD;
  },

  async getRecentActivity(limit = 8) {
    await delay(200);
    return EMAILS.slice(0, limit);
  },

  async getPortfolio() {
    await delay(150);
    return PORTFOLIO;
  },
};