// Summary metrics and yearly rollup calculations

import {
  calculateACL, calculateCAGR, calculateLTV, calculateCACPayback,
  calculateLTVCACRatio, calculateARPU,
  calculateCACFromAdSpend,
} from './unitEconomics.js';
import { calculateCostPerSession } from './costModel.js';

export function calculateSummaryMetrics(inputs) {
  const acl = calculateACL(inputs.monthlyChurn);
  const arpu = calculateARPU(inputs.pricingTiers);
  const conversionRate = inputs.conversionRate;
  const cac = calculateCACFromAdSpend(inputs.monthlyAdSpend, inputs.startingPaidTraffic, conversionRate);
  const cagr = calculateCAGR(inputs.monthlyGrowthRate);

  // Gross margin from per-session COGS + CC fees
  const perSession = calculateCostPerSession(inputs);
  const weightedSessions = inputs.pricingTiers.reduce(
    (sum, t) => sum + ((t.sessionsPerMonth || 0) * (t.distribution || 0)), 0
  );
  const weightedCogs = weightedSessions * perSession.total;
  const ccFees = arpu * (inputs.ccProcessingFees || 0);
  const grossMargin = arpu > 0 ? Math.max(0, (arpu - weightedCogs - ccFees) / arpu) : 0;

  const ltv = calculateLTV(arpu, acl, grossMargin);
  const ltvCacRatio = calculateLTVCACRatio(ltv, cac);
  const cacPayback = calculateCACPayback(arpu, grossMargin, cac);

  return { cagr, acl, ltv, ltvCacRatio, cacPayback, grossMargin, arpu, conversionRate, cac };
}

export function calculateYearlySummaries(monthlyData) {
  const years = [
    { year: 1, months: monthlyData.filter(m => m.year === 1) },
    { year: 2, months: monthlyData.filter(m => m.year === 2) },
    { year: 3, months: monthlyData.filter(m => m.year === 3) },
  ];

  return years.map(({ year, months }) => {
    const totalTraffic = months.reduce((sum, m) => sum + m.totalTraffic, 0);
    const totalConversions = months.reduce((sum, m) => sum + m.paidConversions, 0);
    const totalReferrals = months.reduce((sum, m) => sum + m.referrals, 0);
    const totalChurn = months.reduce((sum, m) => sum + m.monthlyChurn, 0);
    const endRetained = months[months.length - 1]?.totalRetained || 0;
    const grossRevenue = months.reduce((sum, m) => sum + m.grossRevenue, 0);
    const totalCosts = months.reduce((sum, m) => sum + m.totalOperatingCosts, 0);
    const netProfit = months.reduce((sum, m) => sum + m.netProfit, 0);
    const netProfitMargin = grossRevenue > 0 ? netProfit / grossRevenue : 0;

    return {
      year,
      totalTraffic: Math.round(totalTraffic * 100) / 100,
      totalConversions,
      totalReferrals: Math.round(totalReferrals * 10) / 10,
      totalChurn,
      endRetained,
      grossRevenue,
      totalCosts,
      netProfit,
      netProfitMargin,
    };
  });
}
