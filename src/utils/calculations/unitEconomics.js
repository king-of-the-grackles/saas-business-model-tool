// Pure unit economics functions — no side effects, no state

// CAGR: ((1 + monthlyRate) ^ 12) - 1
export function calculateCAGR(monthlyRate) {
  return Math.pow(1 + monthlyRate, 12) - 1;
}

// Average Customer Lifespan: 1 / monthlyChurn
export function calculateACL(monthlyChurn) {
  if (monthlyChurn === 0) return Infinity;
  return 1 / monthlyChurn;
}

// LTV: (ARPA × Gross Margin) / Churn Rate = ARPA × Gross Margin × ACL
export function calculateLTV(monthlyRevenue, acl, grossMargin = 0.80) {
  if (acl === Infinity) return Infinity;
  return monthlyRevenue * grossMargin * acl;
}

// CAC Payback: CAC / (MRR × Gross Margin)
export function calculateCACPayback(monthlyRevenue, grossMargin, cac) {
  const monthlyContribution = monthlyRevenue * grossMargin;
  if (monthlyContribution === 0) return Infinity;
  return cac / monthlyContribution;
}

// LTV:CAC Ratio
export function calculateLTVCACRatio(ltv, cac) {
  if (cac === 0) return Infinity;
  if (ltv === Infinity) return Infinity;
  return ltv / cac;
}

// Gross Margin from COGS inputs (as percentages of revenue)
export function calculateGrossMargin(inputs) {
  const cogs = inputs.ccProcessingFees + inputs.inferenceCosts +
               inputs.deliveryCosts + inputs.inventoryCosts;
  return Math.max(0, 1 - cogs);
}

// ARPU weighted by tier distribution
export function calculateARPU(tiers) {
  if (!tiers || tiers.length === 0) return 0;
  return tiers.reduce((sum, tier) => sum + (tier.monthlyPrice * (tier.distribution || 0)), 0);
}

// Total distribution (should sum to 1.0)
export function getTotalDistribution(tiers) {
  if (!tiers || tiers.length === 0) return 0;
  return tiers.reduce((sum, tier) => sum + (tier.distribution || 0), 0);
}

// CAC from ad spend: Ad Spend ÷ (Traffic × Conversion Rate)
export function calculateCACFromAdSpend(adSpend, paidTraffic, conversionRate) {
  const paidConversions = paidTraffic * conversionRate;
  if (paidConversions === 0) return Infinity;
  return adSpend / paidConversions;
}

// Unique tier ID generator
export function generateTierId() {
  return 'tier-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// Tier validation
export function validateTiers(tiers) {
  if (!tiers || tiers.length === 0) {
    return { valid: false, error: 'At least one pricing tier is required' };
  }
  const totalDistribution = getTotalDistribution(tiers);
  if (totalDistribution < 0.99 || totalDistribution > 1.01) {
    return { valid: false, error: 'Distribution must sum to 100%', totalDistribution };
  }
  return { valid: true, totalDistribution };
}
