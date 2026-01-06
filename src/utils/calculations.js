// Core calculation engine - ports Excel formulas to JavaScript

export const DEFAULT_INPUTS = {
  minimumSuccessCriteria: 1000000,
  monthlyGrowthRate: 0.10, // 10% - "good" benchmark for growth stage
  startingPaidTraffic: 2000, // 1-2K typical for early-stage
  conversionRate: 0.02, // 2% - single conversion rate for all traffic
  pricingTiers: [
    { id: 'tier-1', name: 'Starter', monthlyPrice: 29, distribution: 0.60, isLocked: false },
    { id: 'tier-2', name: 'Pro', monthlyPrice: 79, distribution: 0.30, isLocked: true },
    { id: 'tier-3', name: 'Business', monthlyPrice: 199, distribution: 0.10, isLocked: false },
  ],
  customerReferralRate: 0.10, // 10% - at "good" threshold (15-25% is great)
  monthlyAdSpend: 5000, // $5,000/mo marketing budget (CAC calculated from traffic × conversion)
  monthlyChurn: 0.035, // 3.5% - SaaS median (2.5-5% is good range)
  ccProcessingFees: 0.025, // 2.5% - standard Stripe/payment processor
  staffingCosts: 0.15, // 15% - lean early-stage
  officeSupplies: 0.02, // 2% - low end of 2-5% range
  businessInsurance: 0.01, // 1% - middle of 0.5-2% range
  inventoryCosts: 0, // 0% for SaaS/digital
  deliveryCosts: 0, // 0% for SaaS/digital
  inferenceCosts: 0, // 0% default (set 15-40% for AI-powered apps)
  rent: 0, // $0 - remote-first default
  organicTraffic: 500, // Some baseline organic/SEO traffic
};

// Calculate Annual Compound Growth Rate from monthly rate
// Formula: ((1 + monthlyRate) ^ 12) - 1
export function calculateCAGR(monthlyRate) {
  return Math.pow(1 + monthlyRate, 12) - 1;
}

// Calculate Average Customer Lifespan in months
// Formula: 1 / monthlyChurn
export function calculateACL(monthlyChurn) {
  if (monthlyChurn === 0) return Infinity;
  return 1 / monthlyChurn;
}

// Calculate Customer Lifetime Value
// Industry Standard Formula: (ARPA × Gross Margin) / Churn Rate
// Sources: ChartMogul, TheSaasCFO, Craft Ventures
export function calculateLTV(monthlyRevenue, acl, grossMargin = 0.80) {
  if (acl === Infinity) return Infinity;
  return monthlyRevenue * grossMargin * acl;
}

// Calculate CAC Payback Period (in months)
// Formula: CAC / (MRR × Gross Margin)
// Benchmark: <12 months good, 6 months ideal (Craft Ventures)
export function calculateCACPayback(monthlyRevenue, grossMargin, cac) {
  const monthlyContribution = monthlyRevenue * grossMargin;
  if (monthlyContribution === 0) return Infinity;
  return cac / monthlyContribution;
}

// Calculate LTV:CAC Ratio
export function calculateLTVCACRatio(ltv, cac) {
  if (cac === 0) return Infinity;
  if (ltv === Infinity) return Infinity;
  return ltv / cac;
}

// Calculate Gross Margin from COGS inputs
// COGS = CC Fees + Inference + Delivery + Inventory (per SaaS Capital standards)
export function calculateGrossMargin(inputs) {
  const cogs = inputs.ccProcessingFees + inputs.inferenceCosts +
               inputs.deliveryCosts + inputs.inventoryCosts;
  return Math.max(0, 1 - cogs); // Ensure non-negative
}

// Calculate total distribution from all pricing tiers (should sum to 1.0)
export function getTotalDistribution(tiers) {
  if (!tiers || tiers.length === 0) return 0;
  return tiers.reduce((sum, tier) => sum + (tier.distribution || 0), 0);
}

// Calculate ARPU (Average Revenue Per User) - weighted by distribution
export function calculateARPU(tiers) {
  if (!tiers || tiers.length === 0) return 0;
  // ARPU = sum of (price × distribution) for each tier
  return tiers.reduce((sum, tier) => sum + (tier.monthlyPrice * (tier.distribution || 0)), 0);
}

// Generate unique tier ID
export function generateTierId() {
  return 'tier-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// Calculate CAC from Monthly Ad Spend
// CAC = Ad Spend ÷ Paid Conversions, where Paid Conversions = Traffic × Conversion Rate
export function calculateCACFromAdSpend(adSpend, paidTraffic, conversionRate) {
  const paidConversions = paidTraffic * conversionRate;
  if (paidConversions === 0) return Infinity;
  return adSpend / paidConversions;
}

// Validate tier configuration
export function validateTiers(tiers) {
  if (!tiers || tiers.length === 0) {
    return { valid: false, error: 'At least one pricing tier is required' };
  }
  const totalDistribution = getTotalDistribution(tiers);
  // Allow small floating point tolerance
  if (totalDistribution < 0.99 || totalDistribution > 1.01) {
    return { valid: false, error: 'Distribution must sum to 100%', totalDistribution };
  }
  return { valid: true, totalDistribution };
}

// Calculate summary metrics from inputs
export function calculateSummaryMetrics(inputs) {
  const acl = calculateACL(inputs.monthlyChurn);
  const grossMargin = calculateGrossMargin(inputs);

  // Calculate ARPU from pricing tiers (weighted by distribution)
  const arpu = calculateARPU(inputs.pricingTiers);
  const conversionRate = inputs.conversionRate; // Now a top-level input

  // Calculate CAC from monthly ad spend
  const cac = calculateCACFromAdSpend(inputs.monthlyAdSpend, inputs.startingPaidTraffic, conversionRate);

  // LTV and CAC payback use ARPU instead of single price
  const ltv = calculateLTV(arpu, acl, grossMargin);
  const ltvCacRatio = calculateLTVCACRatio(ltv, cac);
  const cagr = calculateCAGR(inputs.monthlyGrowthRate);
  const cacPayback = calculateCACPayback(arpu, grossMargin, cac);

  return {
    cagr,
    acl,
    ltv,
    ltvCacRatio,
    cacPayback,
    grossMargin,
    arpu,
    conversionRate,
    cac, // Include calculated CAC in metrics
  };
}

// Calculate monthly projections for all 36 months
export function calculateMonthlyProjections(inputs) {
  const months = [];
  let previousRetained = 0;

  // Calculate ARPU from pricing tiers (weighted by distribution)
  const arpu = calculateARPU(inputs.pricingTiers);
  const conversionRate = inputs.conversionRate; // Now a top-level input

  // Calculate CAC from ad spend (stays constant as you scale)
  const cac = calculateCACFromAdSpend(inputs.monthlyAdSpend, inputs.startingPaidTraffic, conversionRate);

  for (let i = 0; i < 36; i++) {
    const year = Math.floor(i / 12) + 1;
    const monthInYear = (i % 12) + 1;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    // Traffic: grows by monthly growth rate each month
    const paidTraffic = inputs.startingPaidTraffic * Math.pow(1 + inputs.monthlyGrowthRate, i);
    const organicTraffic = inputs.organicTraffic;
    const totalTraffic = paidTraffic + organicTraffic;

    // Paid conversions from traffic (using single conversion rate input)
    const paidConversions = Math.round(paidTraffic * conversionRate);

    // Previous month retained customers
    const prevRetainedForChurn = previousRetained;

    // Monthly churn from existing customers (based on previous retained)
    const monthlyChurnCount = Math.round(prevRetainedForChurn * inputs.monthlyChurn);

    // Excel uses circular reference: referrals = retained × rate, retained = prev + conv + referrals - churn
    // Solving algebraically: retained = (prev - churn + conversions) / (1 - referralRate)
    // Then: referrals = retained × referralRate
    let totalRetained;
    let referrals;

    if (i === 0) {
      // First month: no previous customers, so no referrals
      totalRetained = paidConversions;
      referrals = 0;
    } else {
      // Solve the circular reference algebraically (matching Excel behavior)
      const baseRetained = prevRetainedForChurn + paidConversions - monthlyChurnCount;
      totalRetained = Math.round(baseRetained / (1 - inputs.customerReferralRate));
      referrals = Math.round((totalRetained * inputs.customerReferralRate) * 100) / 100;
    }

    // Revenue (using ARPU from pricing tiers)
    const grossRevenue = totalRetained * arpu;

    // Operating costs
    const ccFees = grossRevenue * inputs.ccProcessingFees;
    const cacCost = paidConversions * cac;
    const staffing = grossRevenue * inputs.staffingCosts;
    const office = grossRevenue * inputs.officeSupplies;
    const insurance = grossRevenue * inputs.businessInsurance;
    const inventory = grossRevenue * inputs.inventoryCosts;
    const delivery = grossRevenue * inputs.deliveryCosts;
    const inference = grossRevenue * inputs.inferenceCosts;
    const rentCost = inputs.rent;

    const totalOperatingCosts = ccFees + cacCost + staffing + office + insurance + inventory + delivery + inference + rentCost;
    const netProfit = grossRevenue - totalOperatingCosts;
    const netProfitMargin = grossRevenue > 0 ? netProfit / grossRevenue : 0;

    months.push({
      month: i + 1,
      year,
      monthInYear,
      monthName: monthNames[monthInYear - 1],
      paidTraffic: Math.round(paidTraffic * 100) / 100,
      organicTraffic,
      totalTraffic: Math.round(totalTraffic * 100) / 100,
      referrals,
      paidConversions,
      previousRetained: prevRetainedForChurn,
      monthlyChurn: monthlyChurnCount,
      totalRetained,
      grossRevenue,
      costs: {
        ccFees,
        cac: cacCost,
        staffing,
        office,
        insurance,
        inventory,
        delivery,
        inference,
        rent: rentCost,
      },
      totalOperatingCosts,
      netProfit,
      netProfitMargin,
    });

    // Update for next iteration
    previousRetained = totalRetained;
  }

  return months;
}

// Calculate yearly summaries
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

// Main function to run all calculations
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

// Format currency for display
export function formatCurrency(value, compact = false) {
  if (value === Infinity) return '∞';
  if (compact && Math.abs(value) >= 1000000) {
    return '$' + (value / 1000000).toFixed(1) + 'M';
  }
  if (compact && Math.abs(value) >= 1000) {
    return '$' + (value / 1000).toFixed(1) + 'K';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format percentage for display
export function formatPercent(value, decimals = 1) {
  if (value === Infinity) return '∞';
  return (value * 100).toFixed(decimals) + '%';
}

// Format number with commas
export function formatNumber(value, decimals = 0) {
  if (value === Infinity) return '∞';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
