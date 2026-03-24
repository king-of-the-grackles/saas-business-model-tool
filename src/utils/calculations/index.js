// Backward-compatible re-exports
// All existing imports from '../utils/calculations' continue to work unchanged.

export { DEFAULT_INPUTS } from './defaults.js';
export { formatCurrency, formatPercent, formatNumber } from './formatters.js';
export {
  calculateCAGR, calculateACL, calculateLTV, calculateCACPayback,
  calculateLTVCACRatio, calculateGrossMargin, calculateARPU,
  getTotalDistribution, calculateCACFromAdSpend, generateTierId, validateTiers,
} from './unitEconomics.js';
export { calculateSummaryMetrics, calculateYearlySummaries } from './summaryMetrics.js';
export { calculateMonthlyProjections } from './projections.js';
export { calculateMonthlyCosts } from './costModel.js';
export { calculateMonthlyRevenue } from './revenueModel.js';
export { calculateMonthlyTraffic } from './trafficModel.js';
export { calculateMonthlyCustomers } from './customerModel.js';

// Main orchestrator
import { DEFAULT_INPUTS } from './defaults.js';
import { calculateSummaryMetrics, calculateYearlySummaries } from './summaryMetrics.js';
import { calculateMonthlyProjections } from './projections.js';

export function runFullModel(inputs = DEFAULT_INPUTS) {
  const mergedInputs = { ...DEFAULT_INPUTS, ...inputs };
  const summaryMetrics = calculateSummaryMetrics(mergedInputs);
  const monthlyProjections = calculateMonthlyProjections(mergedInputs);
  const yearlySummaries = calculateYearlySummaries(monthlyProjections);

  const netProfitFY1 = yearlySummaries[0]?.netProfit || 0;
  const netProfitFY2 = yearlySummaries[1]?.netProfit || 0;
  const netProfitFY3 = yearlySummaries[2]?.netProfit || 0;
  const meetsMSC = netProfitFY3 >= mergedInputs.minimumSuccessCriteria;

  return {
    inputs: mergedInputs,
    summaryMetrics: {
      ...summaryMetrics,
      netProfitFY1,
      netProfitFY2,
      netProfitFY3,
      meetsMSC,
    },
    monthlyProjections,
    yearlySummaries,
  };
}
