// Revenue calculation — strategy pattern for different pricing models
// Currently supports 'flat' (original model). Credit, usage, hybrid added in Phase 2.

import { calculateARPU } from './unitEconomics.js';

const revenueStrategies = {
  flat: (inputs, retainedCustomers) => {
    const arpu = calculateARPU(inputs.pricingTiers);
    return retainedCustomers * arpu;
  },
  // Phase 2: credit, usage, hybrid strategies will be added here
};

export function calculateMonthlyRevenue(inputs, retainedCustomers) {
  const pricingModel = inputs.pricingModel || 'flat';
  const strategy = revenueStrategies[pricingModel] || revenueStrategies.flat;
  return strategy(inputs, retainedCustomers);
}
