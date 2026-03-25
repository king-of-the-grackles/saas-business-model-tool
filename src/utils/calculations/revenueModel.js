// Revenue calculation — strategy pattern for different pricing models

import { calculateARPU } from './unitEconomics.js';

// Helper: estimate how many users exceed their included sessions
// Assumes normal distribution; overagePercent is the % of users who go over
function estimateOverageRevenue(tier, tieredCustomers) {
  const included = tier.creditsIncluded || tier.includedSessions || 0;
  const overageRate = tier.overageRate || 0;
  const sessions = tier.sessionsPerMonth || 0;
  if (sessions <= included || overageRate === 0) return 0;
  // Avg overage per user who exceeds: (sessions - included)
  // Assume ~30% of users exceed their cap (configurable per tier if needed)
  const overagePct = tier.overageUserPct || 0.30;
  const avgOverage = sessions - included;
  return tieredCustomers * overagePct * avgOverage * overageRate;
}

const revenueStrategies = {
  // Flat monthly: customers × tier price (weighted by distribution)
  flat: (inputs, retainedCustomers) => {
    const arpu = calculateARPU(inputs.pricingTiers);
    return retainedCustomers * arpu;
  },

  // Credit-based: base subscription + overage for users exceeding included credits
  credit: (inputs, retainedCustomers) => {
    return inputs.pricingTiers.reduce((total, tier) => {
      const tieredCustomers = Math.round(retainedCustomers * (tier.distribution || 0));
      const baseRevenue = tieredCustomers * tier.monthlyPrice;
      const overage = estimateOverageRevenue(tier, tieredCustomers);
      return total + baseRevenue + overage;
    }, 0);
  },

  // Usage-based: base fee + per-session rate × sessions
  usage: (inputs, retainedCustomers) => {
    return inputs.pricingTiers.reduce((total, tier) => {
      const tieredCustomers = Math.round(retainedCustomers * (tier.distribution || 0));
      const baseFee = tier.baseFee || 0;
      const perSession = tier.perSessionRate || 0;
      const sessions = tier.sessionsPerMonth || 0;
      return total + tieredCustomers * (baseFee + (perSession * sessions));
    }, 0);
  },

  // Hybrid: base price includes N sessions, overage rate for excess
  hybrid: (inputs, retainedCustomers) => {
    return inputs.pricingTiers.reduce((total, tier) => {
      const tieredCustomers = Math.round(retainedCustomers * (tier.distribution || 0));
      const baseRevenue = tieredCustomers * tier.monthlyPrice;
      const overage = estimateOverageRevenue(tier, tieredCustomers);
      return total + baseRevenue + overage;
    }, 0);
  },
};

export const PRICING_MODELS = [
  { key: 'flat', name: 'Flat Monthly', description: 'Fixed monthly subscription per tier' },
  { key: 'credit', name: 'Credit-Based', description: 'Base subscription + overage credits' },
  { key: 'usage', name: 'Usage-Based', description: 'Base fee + per-session rate' },
  { key: 'hybrid', name: 'Hybrid', description: 'Included sessions + overage rate' },
];

export function calculateMonthlyRevenue(inputs, retainedCustomers) {
  const pricingModel = inputs.pricingModel || 'flat';
  const strategy = revenueStrategies[pricingModel] || revenueStrategies.flat;
  return strategy(inputs, retainedCustomers);
}
