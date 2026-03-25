// Central cost category definitions — single source of truth
// Used by: costModel.js (calculations), ChartsPanel (charts), MonthlyTable (columns)
//
// To add a new cost category:
// 1. Add a row here
// 2. If new `type`, add the calculator in costModel.js
// 3. Charts and tables pick it up automatically
//
// sessionCostKey: maps to calculateCostPerSession() breakdown keys (llm, infra, tools)

export const COST_CATEGORIES = [
  // COGS (Cost of Goods Sold)
  { key: 'ccFees',    name: 'CC Fees',           group: 'cogs', type: 'revenue_pct',  color: '#06b6d4', inputKey: 'ccProcessingFees' },
  { key: 'inference', name: 'LLM Inference',     group: 'cogs', type: 'per_session',  color: '#ef4444', inputKey: null, sessionCostKey: 'llm' },
  { key: 'infra',     name: 'Infrastructure',    group: 'cogs', type: 'per_session',  color: '#0d9488', inputKey: null, sessionCostKey: 'infra' },
  { key: 'tools',     name: 'Third-Party Tools', group: 'cogs', type: 'per_session',  color: '#8b5cf6', inputKey: null, sessionCostKey: 'tools' },

  // Operating Expenses
  { key: 'cac',       name: 'CAC',               group: 'opex', type: 'per_customer', color: '#f59e0b', inputKey: null },
  { key: 'staffing',  name: 'Staffing',          group: 'opex', type: 'revenue_pct',  color: '#8b5cf6', inputKey: 'staffingCosts' },
  { key: 'office',    name: 'Office',            group: 'opex', type: 'revenue_pct',  color: '#64748b', inputKey: 'officeSupplies' },
  { key: 'insurance', name: 'Insurance',         group: 'opex', type: 'revenue_pct',  color: '#10b981', inputKey: 'businessInsurance' },
  { key: 'rent',      name: 'Rent',              group: 'opex', type: 'fixed',        color: '#d97706', inputKey: 'rent' },
];

// Helpers
export const getCOGSCategories = () => COST_CATEGORIES.filter(c => c.group === 'cogs');
export const getOpExCategories = () => COST_CATEGORIES.filter(c => c.group === 'opex');
export const getAllCostColors = () => Object.fromEntries(COST_CATEGORIES.map(c => [c.key, c.color]));
export const getCostByKey = (key) => COST_CATEGORIES.find(c => c.key === key);
