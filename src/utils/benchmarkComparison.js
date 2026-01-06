// Benchmark comparison utilities
// Centralizes threshold logic for consistent status evaluation across components

export const benchmarkThresholds = {
  ltvCac: {
    poor: 3,      // < 3x is unsustainable
    median: 3.5,  // 3-3.5x is median
    good: 6,      // 3.5-6x is healthy
    // > 6x means under-investing in growth
  },
  cacPayback: {
    excellent: 6,   // < 6 months
    good: 12,       // 6-12 months
    acceptable: 18, // 12-18 months
    // > 18 months is concerning
  },
  grossMargin: {
    target: 0.80,   // 80%+ is target
    minimum: 0.75,  // 75%+ is minimum for SaaS
    // < 75% is below standard
  },
  monthlyChurn: {
    great: 0.025,    // < 2.5%
    good: 0.05,      // 2.5-5%
    // > 5% is concerning
  },
  referralRate: {
    great: 0.15,     // 15%+ is great
    good: 0.10,      // 10-15% is good
    // < 10% is low
  },
  monthlyGrowth: {
    excellent: 0.15, // 15%+ for early stage
    good: 0.10,      // 10%+ for growth stage
    // < 5% needs attention
  },
};

// Status evaluators return: 'excellent' | 'good' | 'warning' | 'poor' | 'high'
export function getLtvCacStatus(ratio) {
  if (ratio < benchmarkThresholds.ltvCac.poor) return 'poor';
  if (ratio < benchmarkThresholds.ltvCac.median) return 'warning';
  if (ratio <= benchmarkThresholds.ltvCac.good) return 'good';
  return 'high'; // Over-investing in retention, could spend more on growth
}

export function getCacPaybackStatus(months) {
  if (months <= benchmarkThresholds.cacPayback.excellent) return 'excellent';
  if (months <= benchmarkThresholds.cacPayback.good) return 'good';
  if (months <= benchmarkThresholds.cacPayback.acceptable) return 'warning';
  return 'poor';
}

export function getGrossMarginStatus(margin) {
  if (margin >= benchmarkThresholds.grossMargin.target) return 'excellent';
  if (margin >= benchmarkThresholds.grossMargin.minimum) return 'good';
  return 'warning';
}

export function getMonthlyChurnStatus(churn) {
  if (churn <= benchmarkThresholds.monthlyChurn.great) return 'excellent';
  if (churn <= benchmarkThresholds.monthlyChurn.good) return 'good';
  return 'warning';
}

export function getReferralRateStatus(rate) {
  if (rate >= benchmarkThresholds.referralRate.great) return 'excellent';
  if (rate >= benchmarkThresholds.referralRate.good) return 'good';
  return 'warning';
}

export function getMonthlyGrowthStatus(rate) {
  if (rate >= benchmarkThresholds.monthlyGrowth.excellent) return 'excellent';
  if (rate >= benchmarkThresholds.monthlyGrowth.good) return 'good';
  return 'warning';
}

// Benchmark text for inline display
export const benchmarkText = {
  ltvCac: 'Target: 3-5x',
  cacPayback: 'Target: <12 mo',
  grossMargin: 'SaaS: 75%+',
  monthlyChurn: 'Target: 2-5%',
  referralRate: 'Great: 15-25%',
  monthlyGrowth: 'Strong: 10%+ MoM',
  conversion: 'B2B: 1-3%',
};

// Detailed tooltip content for input guidance
export const inputTooltips = {
  minimumSuccessCriteria: 'Your target net profit by end of Year 3. SaaS companies typically aim for profitability by Y3. Set based on your runway and growth expectations.',
  startingPaidTraffic: 'Visitors/month at launch. Median SaaS: ~4K sessions/month. Early-stage: 1-2K is typical starting point. Depends on CAC budget and channel mix.',
  organicTraffic: 'Non-paid traffic (SEO, direct, referrals). Target: 10% MoM growth. Organic has 702% ROI vs 31% for PPC. Cost per lead: $147 organic vs $280 paid.',
  monthlyGrowthRate: '15%+ MoM excellent for early stage (<$1M ARR). 10%+ good for growth stage (≈3x YoY growth).',
  customerReferralRate: '15-25% = great organic growth. 10-15% = good. <10% = room to improve.',
  monthlyChurn: 'SaaS median: 3.5%. <2.5% = great. 2.5-5% = good. >5% = concerning. Use 100% for one-time purchases.',
  grossMargin: 'Calculated: 100% − COGS. SaaS benchmark: 80-85% (minimum 75%). COGS includes CC fees, inference costs, delivery, and inventory. Lower margin may indicate high API costs or marketplace fees.',
  monthlyAdSpend: 'Your total monthly marketing/advertising budget. CAC is auto-calculated: Ad Spend ÷ Paid Conversions. SMB SaaS typically $1K-10K/mo.',
  conversionRate: 'B2B Enterprise: 0.6-1%. Mid-Market: 1-2%. eCommerce: 2-4%. B2C SaaS: 2-5%.',
  // Operating Costs tooltips
  ccProcessingFees: 'Online/SaaS: 2.25-2.50% typical. <2% = excellent, 2-2.75% = normal, >3% = investigate.',
  staffingCosts: 'SaaS medians (2025): Sales 13%, Support 8%, R&D 22% of ARR. 15-20% is lean for early-stage.',
  officeSupplies: 'SaaS G&A median: 14% total. Office/equipment portion: 2-5% typical.',
  businessInsurance: '0.5-2% of revenue (~$700-$3K/yr for <$1M revenue). Includes liability, E&O, cyber.',
  inventoryCosts: 'SaaS/digital: 0%. E-commerce/physical: 20-30% typical.',
  deliveryCosts: 'Marketplace fees: Amazon 8-15%, Etsy ~9.5%, Shopify ~2.9%. Shipping/fulfillment for physical goods.',
  inferenceCosts: 'AI/LLM API costs: 15-40% of revenue typical. Lowers gross margin from 80% to 40-60%. Model choice matters: GPT-4o ($5/$20/M) vs Haiku ($0.80/$4/M) vs DeepSeek ($0.28/$0.42/M).',
  rent: 'Fixed monthly overhead. Remote-first often $0. Varies by location.',
};
