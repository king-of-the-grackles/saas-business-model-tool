// Core calculation engine - ports Excel formulas to JavaScript

export const DEFAULT_INPUTS = {
  minimumSuccessCriteria: 1000000,
  monthlyGrowthRate: 0.02,
  startingPaidTraffic: 2000,
  paidConversionRate: 0.02,
  customerReferralRate: 0.05,
  estimatedCAC: 15,
  monthlyRevenuePerCustomer: 15,
  monthlyChurn: 0.05, // Changed from 0.12 - industry benchmark is 3.5-5% monthly
  grossMargin: 0.80, // 80% typical for SaaS (Craft Ventures: 75%+ required)
  ccProcessingFees: 0.025,
  staffingCosts: 0.15,
  officeSupplies: 0.02,
  businessInsurance: 0.01,
  inventoryCosts: 0,
  deliveryCosts: 0,
  rent: 0,
  organicTraffic: 0,
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

// Calculate summary metrics from inputs
export function calculateSummaryMetrics(inputs) {
  const acl = calculateACL(inputs.monthlyChurn);
  const grossMargin = inputs.grossMargin || 0.80;
  const ltv = calculateLTV(inputs.monthlyRevenuePerCustomer, acl, grossMargin);
  const ltvCacRatio = calculateLTVCACRatio(ltv, inputs.estimatedCAC);
  const cagr = calculateCAGR(inputs.monthlyGrowthRate);
  const cacPayback = calculateCACPayback(inputs.monthlyRevenuePerCustomer, grossMargin, inputs.estimatedCAC);

  return {
    cagr,
    acl,
    ltv,
    ltvCacRatio,
    cacPayback,
    grossMargin,
  };
}

// Calculate monthly projections for all 36 months
export function calculateMonthlyProjections(inputs) {
  const months = [];
  let previousRetained = 0;

  for (let i = 0; i < 36; i++) {
    const year = Math.floor(i / 12) + 1;
    const monthInYear = (i % 12) + 1;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    // Traffic: grows by monthly growth rate each month
    const paidTraffic = inputs.startingPaidTraffic * Math.pow(1 + inputs.monthlyGrowthRate, i);
    const organicTraffic = inputs.organicTraffic;
    const totalTraffic = paidTraffic + organicTraffic;

    // Paid conversions from traffic
    const paidConversions = Math.round(paidTraffic * inputs.paidConversionRate);

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

    // Revenue
    const grossRevenue = totalRetained * inputs.monthlyRevenuePerCustomer;

    // Operating costs
    const ccFees = grossRevenue * inputs.ccProcessingFees;
    const cacCost = paidConversions * inputs.estimatedCAC;
    const staffing = grossRevenue * inputs.staffingCosts;
    const office = grossRevenue * inputs.officeSupplies;
    const insurance = grossRevenue * inputs.businessInsurance;
    const inventory = grossRevenue * inputs.inventoryCosts;
    const delivery = grossRevenue * inputs.deliveryCosts;
    const rentCost = inputs.rent;

    const totalOperatingCosts = ccFees + cacCost + staffing + office + insurance + inventory + delivery + rentCost;
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
