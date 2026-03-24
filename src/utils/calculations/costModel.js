// Cost calculation — uses cost registry for extensibility
// Each cost type has a calculation strategy keyed by its `type` field in the registry.

import { COST_CATEGORIES } from '../costRegistry.js';
import { calculateCACFromAdSpend } from './unitEconomics.js';

// Cost calculators by type — add new types here as needed
const costCalculators = {
  revenue_pct: (inputs, inputKey, grossRevenue) => {
    return grossRevenue * (inputs[inputKey] || 0);
  },
  fixed: (inputs, inputKey) => {
    return inputs[inputKey] || 0;
  },
  per_customer: (inputs, _inputKey, grossRevenue, context) => {
    // CAC cost: new paid conversions × CAC
    return (context.paidConversions || 0) * (context.cac || 0);
  },
  per_session: () => {
    // Phase 1: will compute from token/infra/tool model
    // For now, falls back to revenue_pct via inferenceCosts input
    return 0;
  },
};

export function calculateMonthlyCosts(inputs, grossRevenue, context = {}) {
  const costs = {};
  let total = 0;

  // Calculate CAC once for the per_customer cost type
  const cac = context.cac || calculateCACFromAdSpend(
    inputs.monthlyAdSpend, inputs.startingPaidTraffic, inputs.conversionRate
  );
  const enrichedContext = { ...context, cac };

  for (const category of COST_CATEGORIES) {
    const calculator = costCalculators[category.type];
    if (!calculator) continue;

    let value;
    if (category.type === 'per_session' && category.key === 'inference') {
      // Backward compat: use inferenceCosts as % of revenue until Phase 1
      value = grossRevenue * (inputs.inferenceCosts || 0);
    } else {
      value = calculator(inputs, category.inputKey, grossRevenue, enrichedContext);
    }

    costs[category.key] = value;
    total += value;
  }

  return { costs, totalOperatingCosts: total };
}
