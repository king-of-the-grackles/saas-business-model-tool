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
  monthlyGrowthRate: '15%+ MoM excellent for early stage (<$1M ARR). 10%+ good for growth stage (≈3x YoY growth).',
  customerReferralRate: '15-25% = great organic growth. 10-15% = good. <10% = room to improve.',
  monthlyChurn: 'SaaS median: 3.5%. <2.5% = great. 2.5-5% = good. >5% = concerning. Use 100% for one-time purchases.',
  grossMargin: 'SaaS minimum: 75%. Target: 80-85%. Lower margins may indicate operational inefficiency.',
  estimatedCAC: 'Should payback in <12 months. Formula: CAC ÷ (ARPU × Gross Margin).',
  conversionRate: 'B2B Enterprise: 0.6-1%. Mid-Market: 1-2%. eCommerce: 2-4%. B2C SaaS: 2-5%.',
};
