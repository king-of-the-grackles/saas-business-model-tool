// Default model inputs — single source of truth for all initial values

export const DEFAULT_INPUTS = {
  minimumSuccessCriteria: 1000000,
  monthlyGrowthRate: 0.10,
  startingPaidTraffic: 2000,
  conversionRate: 0.02,
  pricingTiers: [
    { id: 'tier-1', name: 'Starter', monthlyPrice: 29, distribution: 0.60, isLocked: false, sessionsPerMonth: 50 },
    { id: 'tier-2', name: 'Pro', monthlyPrice: 79, distribution: 0.30, isLocked: true, sessionsPerMonth: 250 },
    { id: 'tier-3', name: 'Business', monthlyPrice: 199, distribution: 0.10, isLocked: false, sessionsPerMonth: 1000 },
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
  pricingModel: 'flat',             // flat | credit | usage | hybrid

  // ── Agentic Cost Model ──────────────────────────────────────────
  // Enable to switch from % of revenue COGS to per-session cost model
  agenticCostEnabled: false,

  // Layer 0: Token Economics
  modelPreset: 'sonnet4',              // Model selector key
  inputTokenPrice: 3.00,               // $/1M input tokens
  outputTokenPrice: 15.00,             // $/1M output tokens
  cachedInputPrice: 0.30,              // $/1M cached input tokens (typically 10% of input)

  // Layer 1: Per-LLM-Call
  avgInputTokensPerCall: 16250,        // From Braintrust data: ~16.25K avg
  avgOutputTokensPerCall: 80,          // From Braintrust data: very low output
  cacheHitRate: 0.78,                  // 78% of input tokens served from cache
  avgLLMCallsPerSession: 2.8,          // From data: ~243 calls / 87 sessions

  // Layer 2: Infrastructure
  avgSessionDuration: 73,              // Seconds — from Braintrust data
  vCPUsPerVM: 8,
  ramGBPerVM: 8,
  cpuCostPerHour: 0.07,               // $/CPU-hr (Fly.io Sprites)
  memoryCostPerHour: 0.04375,          // $/GB-hr

  // Layer 2: Third-Party Tools
  avgToolCallsPerSession: 3.9,         // From data: all tool invocations per session
  paidToolCallPct: 0.16,               // 16% of calls are paid (Firecrawl)
  avgCostPerPaidToolCall: 0.008,       // ~$0.008 avg Firecrawl call
};

// Model presets — auto-fill token prices when selected
export const MODEL_PRESETS = {
  sonnet4:  { name: 'Claude Sonnet 4',  inputTokenPrice: 3.00,  outputTokenPrice: 15.00, cachedInputPrice: 0.30 },
  haiku4:   { name: 'Claude Haiku 4',   inputTokenPrice: 0.80,  outputTokenPrice: 4.00,  cachedInputPrice: 0.08 },
  opus4:    { name: 'Claude Opus 4',    inputTokenPrice: 15.00, outputTokenPrice: 75.00, cachedInputPrice: 1.50 },
  gpt4o:    { name: 'GPT-4o',           inputTokenPrice: 2.50,  outputTokenPrice: 10.00, cachedInputPrice: 1.25 },
  custom:   { name: 'Custom',           inputTokenPrice: null,  outputTokenPrice: null,  cachedInputPrice: null },
};
