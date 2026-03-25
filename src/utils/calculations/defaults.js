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
  rent: 0,
  organicTraffic: 500,
  pricingModel: 'flat',             // flat | credit | usage | hybrid

  // ── Session Cost Model (Token → LLM Call → Session) ─────────────

  // Layer 0: Token Economics
  modelPreset: 'sonnet46',              // Model selector key
  inputTokenPrice: 3.00,               // $/1M input tokens
  outputTokenPrice: 15.00,             // $/1M output tokens
  cachedInputPrice: 0.30,              // $/1M cached input tokens

  // Layer 1: Per-LLM-Call
  avgInputTokensPerCall: 49150,        // From Braintrust data: Mar 2026
  avgOutputTokensPerCall: 1316,         // From API billing data (Braintrust underreports — only counts final text, not tool calls)
  cacheHitRate: 0.63,                  // 63% of input tokens served from cache
  avgLLMCallsPerSession: 3.6,          // From Braintrust data: Mar 2026

  // Layer 2: Infrastructure
  avgSessionDuration: 19,              // Seconds — from Braintrust data
  vCPUsPerVM: 8,
  ramGBPerVM: 8,
  cpuCostPerHour: 0.07,               // $/CPU-hr (Fly.io Sprites)
  memoryCostPerHour: 0.04375,          // $/GB-hr

  // Layer 2: Third-Party Tools
  avgToolCallsPerSession: 2.6,         // From Braintrust data: Mar 2026
  paidToolCallPct: 0.21,               // 21% of calls are paid (Firecrawl, BrightData)
  avgCostPerPaidToolCall: 0.007,       // ~$0.007 avg paid tool call
};

// Model presets — auto-fill token prices when selected
export const MODEL_PRESETS = {
  // Claude 4.6 family (latest)
  sonnet46:   { name: 'Claude Sonnet 4.6',  inputTokenPrice: 3.00,  outputTokenPrice: 15.00,  cachedInputPrice: 0.30 },
  haiku45:    { name: 'Claude Haiku 4.5',    inputTokenPrice: 1.00,  outputTokenPrice: 5.00,   cachedInputPrice: 0.10 },
  opus46:     { name: 'Claude Opus 4.6',     inputTokenPrice: 5.00,  outputTokenPrice: 25.00,  cachedInputPrice: 0.50 },
  // OpenAI GPT-5.4 family (latest)
  gpt54:      { name: 'GPT-5.4',            inputTokenPrice: 2.50,  outputTokenPrice: 15.00,  cachedInputPrice: 0.25 },
  gpt54mini:  { name: 'GPT-5.4 mini',       inputTokenPrice: 0.75,  outputTokenPrice: 4.50,   cachedInputPrice: 0.075 },
  gpt54nano:  { name: 'GPT-5.4 nano',       inputTokenPrice: 0.20,  outputTokenPrice: 1.25,   cachedInputPrice: 0.02 },
  // Custom
  custom:     { name: 'Custom',             inputTokenPrice: null,  outputTokenPrice: null,   cachedInputPrice: null },
};
