// Cost calculation — uses cost registry for extensibility
// Each cost type has a calculation strategy keyed by its `type` field in the registry.
// Phase 1: Adds per-session cost pipeline (token → LLM call → session)

import { COST_CATEGORIES } from '../costRegistry.js';
import { calculateCACFromAdSpend } from './unitEconomics.js';

// ── Layer 0-1: LLM cost per session ─────────────────────────────

function calculateLLMCostPerSession(inputs) {
  const effectiveInputPrice =
    (inputs.cacheHitRate * inputs.cachedInputPrice) +
    ((1 - inputs.cacheHitRate) * inputs.inputTokenPrice);

  const costPerCall =
    (inputs.avgInputTokensPerCall * effectiveInputPrice / 1_000_000) +
    (inputs.avgOutputTokensPerCall * inputs.outputTokenPrice / 1_000_000);

  return costPerCall * inputs.avgLLMCallsPerSession;
}

// ── Layer 2: Infrastructure cost per session ─────────────────────

function calculateInfraCostPerSession(inputs) {
  const cpuCostPerSec = (inputs.vCPUsPerVM * inputs.cpuCostPerHour) / 3600;
  const memCostPerSec = (inputs.ramGBPerVM * inputs.memoryCostPerHour) / 3600;
  return inputs.avgSessionDuration * (cpuCostPerSec + memCostPerSec);
}

// ── Layer 2: Third-party tool cost per session ───────────────────

function calculateToolCostPerSession(inputs) {
  return inputs.avgToolCallsPerSession * inputs.paidToolCallPct * inputs.avgCostPerPaidToolCall;
}

// ── Public: full per-session cost breakdown ──────────────────────

export function calculateCostPerSession(inputs) {
  const llm = calculateLLMCostPerSession(inputs);
  const infra = calculateInfraCostPerSession(inputs);
  const tools = calculateToolCostPerSession(inputs);
  return { llm, infra, tools, total: llm + infra + tools };
}

// ── Cost calculators by registry type ────────────────────────────

const costCalculators = {
  revenue_pct: (inputs, inputKey, grossRevenue) => {
    return grossRevenue * (inputs[inputKey] || 0);
  },
  fixed: (inputs, inputKey) => {
    return inputs[inputKey] || 0;
  },
  per_customer: (inputs, _inputKey, grossRevenue, context) => {
    return (context.paidConversions || 0) * (context.cac || 0);
  },
  per_session: (inputs, _inputKey, _grossRevenue, context) => {
    // Uses the pre-computed per-session cost component from context
    return (context.sessionCost || 0) * (context.totalSessions || 0);
  },
};

// ── Main: calculate all monthly costs ────────────────────────────

export function calculateMonthlyCosts(inputs, grossRevenue, context = {}) {
  const costs = {};
  let total = 0;

  const cac = context.cac || calculateCACFromAdSpend(
    inputs.monthlyAdSpend, inputs.startingPaidTraffic, inputs.conversionRate
  );

  // Compute per-session costs and total monthly sessions from tier usage
  let perSessionCost = { llm: 0, infra: 0, tools: 0, total: 0 };
  let totalSessions = 0;

  if (inputs.agenticCostEnabled) {
    perSessionCost = calculateCostPerSession(inputs);

    // Estimate total sessions this month from retained customers × tier usage
    const retainedCustomers = context.totalRetained || 0;
    if (inputs.pricingTiers && inputs.pricingTiers.length > 0) {
      for (const tier of inputs.pricingTiers) {
        const tieredCustomers = Math.round(retainedCustomers * (tier.distribution || 0));
        totalSessions += tieredCustomers * (tier.sessionsPerMonth || 0);
      }
    }
  }

  const enrichedContext = {
    ...context,
    cac,
    sessionCost: perSessionCost.total,
    totalSessions,
    perSessionCost,
  };

  for (const category of COST_CATEGORIES) {
    const calculator = costCalculators[category.type];
    if (!calculator) continue;

    let value;
    if (category.type === 'per_session') {
      if (inputs.agenticCostEnabled) {
        // Use the specific component (llm, infra, or tools) for this category
        const componentKey = category.sessionCostKey;
        const componentCost = componentKey ? perSessionCost[componentKey] : perSessionCost.total;
        value = componentCost * totalSessions;
      } else {
        // Backward compat: fall back to % of revenue
        value = grossRevenue * (inputs[category.inputKey] || 0);
      }
    } else {
      value = calculator(inputs, category.inputKey, grossRevenue, enrichedContext);
    }

    costs[category.key] = value;
    total += value;
  }

  return { costs, totalOperatingCosts: total, perSessionCost, totalSessions };
}
