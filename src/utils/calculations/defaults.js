// Default model inputs — single source of truth for all initial values

export const DEFAULT_INPUTS = {
  minimumSuccessCriteria: 1000000,
  monthlyGrowthRate: 0.10,
  startingPaidTraffic: 2000,
  conversionRate: 0.02,
  pricingTiers: [
    { id: 'tier-1', name: 'Starter', monthlyPrice: 29, distribution: 0.60, isLocked: false },
    { id: 'tier-2', name: 'Pro', monthlyPrice: 79, distribution: 0.30, isLocked: true },
    { id: 'tier-3', name: 'Business', monthlyPrice: 199, distribution: 0.10, isLocked: false },
  ],
  customerReferralRate: 0.10,
  monthlyAdSpend: 5000,
  monthlyChurn: 0.035,
  ccProcessingFees: 0.025,
  staffingCosts: 0.15,
  officeSupplies: 0.02,
  businessInsurance: 0.01,
  inventoryCosts: 0,
  deliveryCosts: 0,
  inferenceCosts: 0,
  rent: 0,
  organicTraffic: 500,
};
