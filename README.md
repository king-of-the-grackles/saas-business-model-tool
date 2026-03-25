# Revenue Lab

**Financial modeling for AI products.**

[Live Demo](https://revenue-lab.onrender.com/) | [Report a Bug](https://github.com/king-of-the-grackles/saas-business-model-tool/issues/new)

Revenue Lab is a free, open-source financial modeling tool purpose-built for founders building AI-powered SaaS products. Dial in your assumptions — pricing, traffic, churn, and the actual cost of every agent session — and instantly see whether your business model works before you build it.

Built by the team at [Dialog](https://dialog.tools/).

---

## What it does

Most financial models treat COGS as a percentage and call it a day. That breaks the moment you have LLM inference costs, compute, and third-party tool calls scaling with every user session.

Revenue Lab models that cost structure properly. You set real token prices, cache hit rates, LLM calls per session, and infrastructure specs. The tool calculates your true cost per session, rolls it up through your tier distribution, and shows you a 3-year profit projection — including whether you hit your Minimum Success Criteria.

Change an assumption. The numbers update instantly.

---

## Features

**Projections**
- 3-year net profit projections (Year 1, 2, 3) against a configurable MSC target
- 36-month data table with full monthly breakdowns
- Revenue, cost, and customer growth charts

**Unit Economics**
- ARPU, LTV, CAC, LTV:CAC ratio, CAC Payback, Average Customer Lifespan
- Gross margin calculated from actual session COGS — not an assumed percentage
- Industry benchmarks surfaced inline for every metric

**Agentic Session Economics**
- Per-session cost pipeline: LLM inference + infrastructure compute + third-party tool calls
- LLM model presets with current pricing (Claude Sonnet/Haiku/Opus, GPT-4o/mini, and more)
- Token-level controls: input price, output price, cached input price, cache hit rate
- Per-call controls: avg input/output tokens, LLM calls per session
- Infrastructure controls: session duration, compute cost
- Tool call controls: calls per session, paid tool percentage, cost per paid call
- Live cost breakdown bar (LLM / Infra / Tools) with per-session total

**Pricing**
- Multi-tier pricing with configurable distribution across tiers
- Four pricing model types: Flat Monthly, Credit-Based, Usage-Based, Hybrid
- Per-tier session usage — each tier drives independent COGS

**Traffic & Acquisition**
- Paid traffic with compound monthly growth rate
- Organic traffic offset
- Auto-calculated CAC from ad spend, traffic volume, and conversion rate
- Referral rate modeled as an acquisition multiplier

**Scenarios**
- Save, load, and delete named scenarios (localStorage)
- Side-by-side scenario comparison (up to 3 scenarios)
- Copy all assumptions to clipboard — structured for pasting directly into an LLM

---

## Getting Started

**Prerequisites**

- Node.js 18+
- npm, yarn, or pnpm

**Install and run**

```bash
git clone https://github.com/king-of-the-grackles/saas-business-model-tool.git
cd saas-business-model-tool
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. No environment variables, no backend, no account required.

**Build for production**

```bash
npm run build
```

Output goes to `dist/`. Deploy anywhere that serves static files (Vercel, Netlify, Cloudflare Pages, Render, S3, etc.).

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI framework | React | 18 |
| Build tool | Vite | 5 |
| Styling | Tailwind CSS | 3 |
| Charts | Recharts | 2 |
| Persistence | Browser localStorage | — |

No backend. No database. Everything runs in the browser.

---

## Project Structure

```
src/
├── App.jsx                        # Root layout, tab routing, scenario comparison
├── components/
│   ├── InputPanel.jsx             # All assumption inputs, collapsible sections
│   ├── SummaryMetrics.jsx         # Key metrics: profit, unit economics, session economics, growth
│   ├── ChartsPanel.jsx            # Recharts visualizations
│   ├── MonthlyTable.jsx           # 36-month data table
│   ├── BenchmarksPanel.jsx        # Industry benchmarks reference
│   ├── ScenarioManager.jsx        # Save / load / compare scenarios
│   ├── ScenarioComparison.jsx     # Side-by-side scenario comparison modal
│   ├── TierManager.jsx            # Pricing tier editor
│   └── Tooltip.jsx                # Inline help tooltips
├── hooks/
│   └── useModelCalculations.js    # React state wiring, drives all recalculation
├── utils/
│   ├── calculations/
│   │   ├── index.js               # Public API for the calculation engine
│   │   ├── defaults.js            # Default inputs + LLM model presets
│   │   ├── costModel.js           # Per-session cost pipeline (Layers 0-2)
│   │   ├── revenueModel.js        # Revenue strategies by pricing model type
│   │   ├── customerModel.js       # Customer acquisition, retention, churn
│   │   ├── trafficModel.js        # Monthly traffic projection
│   │   ├── projections.js         # 36-month full model runner
│   │   ├── summaryMetrics.js      # Yearly rollups, summary metric calculations
│   │   ├── unitEconomics.js       # ARPU, LTV, CAC, LTV:CAC, ACL, CAGR
│   │   └── formatters.js          # Currency, percent, number formatters
│   ├── costRegistry.js            # Central cost category definitions
│   ├── benchmarkComparison.js     # Benchmark status functions
│   └── storage.js                 # localStorage CRUD for scenarios
└── data/
    └── benchmarks.js              # Industry benchmark data
```

---

## How the Session Cost Model Works

Session costs are computed in three layers:

**Layer 0 — Token economics**

Effective input price is blended by cache hit rate:

```
effectiveInputPrice = (cacheHitRate x cachedInputPrice) + ((1 - cacheHitRate) x inputTokenPrice)
```

**Layer 1 — Per LLM call**

```
costPerCall = (avgInputTokens x effectiveInputPrice / 1M) + (avgOutputTokens x outputTokenPrice / 1M)
llmCostPerSession = costPerCall x avgLLMCallsPerSession
```

**Layer 2 — Infrastructure and tools**

```
infraCostPerSession = avgSessionDuration x computeCostPerSecond
toolCostPerSession = avgToolCallsPerSession x paidToolCallPct x avgCostPerPaidToolCall
```

**Total**

```
costPerSession = llm + infra + tools
```

This cost is multiplied by sessions per month (from tier distribution and sessions per tier) to produce monthly COGS for the full model.

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes
4. Open a pull request against `main`

For bugs, feature requests, or questions, [open an issue](https://github.com/king-of-the-grackles/saas-business-model-tool/issues/new).

Areas where contributions would be particularly useful:
- Additional LLM model presets as provider pricing changes
- New chart types or dashboard views
- Export to CSV or spreadsheet formats
- Burn rate and runway modeling
- CAC by channel

---

## License

[MIT](LICENSE)
