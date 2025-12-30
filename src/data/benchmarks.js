// Benchmark data updated with 2025 industry research
// Sources: ChartMogul, FirstPageSage, TheSaasCFO, Craft Ventures, Recurly, Benchmarkit.ai

export const conversionRateBenchmarks = [
  { segment: 'B2B Enterprise Sales', range: '0.78% to 1%' },
  { segment: 'Mid-Market SaaS', range: '0.6% to 1.2%' },
  { segment: 'eCommerce', range: '1% to 3%' },
  { segment: 'Visitor to Lead (SaaS avg)', range: '1.9%' },
];

export const mscArrGoals = [
  { target: '$100K', description: 'IndieHacker - quit your day job' },
  { target: '$500K', description: 'Series A threshold (2025)' },
  { target: '$1M', description: 'Enough for a small company (2 to 3 employees)' },
  { target: '$10M', description: 'Enough for a VC-backed business' },
];

export const ltvCacRatios = {
  minimum: '3:1 (300%)',
  median: '3.5:1 (350%)',
  highPerforming: '6:1 (600%)',
  guidance: [
    {
      range: 'Below 3:1 (e.g., 2:1)',
      advice: 'Your unit economics are unsustainable. You need to either reduce CAC, increase prices, improve retention, or increase gross margin.',
    },
    {
      range: 'Around 3:1 to 3.5:1',
      advice: 'You are at the industry median. This is a sustainable place, but there may be room for optimization.',
    },
    {
      range: 'Between 3.5:1 and 6:1',
      advice: 'Healthy unit economics. You have a solid balance between growth investment and profitability.',
    },
    {
      range: 'Above 6:1',
      advice: 'You might be under-investing in growth. Consider increasing customer acquisition spend to accelerate.',
    },
  ],
  industryBenchmarks: [
    { industry: 'Business Consulting', ratio: '4:1' },
    { industry: 'eCommerce', ratio: '3:1' },
    { industry: 'SaaS B2C', ratio: '2.5:1' },
    { industry: 'SaaS B2B', ratio: '4:1' },
  ],
};

export const cacPaybackBenchmarks = {
  excellent: '< 6 months',
  good: '6-12 months',
  acceptable: '12-18 months',
  concerning: '> 18 months',
  note: 'CAC Payback = CAC / (MRR × Gross Margin). Measures months to recoup acquisition cost.',
};

export const cacSpendingGuidelines = [
  {
    industry: 'SaaS and Subscription Models',
    range: '15% to 25% of revenue',
    notes: 'Especially if they have high gross margins and a strong focus on growth.',
  },
  {
    industry: 'E-commerce',
    range: '10% to 30% of revenue',
    notes: 'Given the typically lower margins compared to SaaS and the need for volume sales.',
  },
  {
    industry: 'Service Industries',
    range: '5% to 15% of revenue',
    notes: 'Where repeat business and referrals are common.',
  },
];

export const grossMarginBenchmarks = {
  saasMinimum: '75%+',
  saasTarget: '80-85%',
  note: 'SaaS companies should have at least 75% gross margin. Lower margins may indicate a "Mechanical Turk problem" - using humans instead of pure software.',
  source: 'Craft Ventures',
};

export const churnBenchmarks = {
  monthly: {
    great: '< 2.5%',
    good: '2.5% to 5%',
    b2bMedian: '3.5%',
    concerning: '> 5%',
  },
  annual: {
    topTier: '5.2%',
    healthy: '< 35%',
    b2bMedian: '~35%',
  },
  logoRetention: {
    enterprise: '90-95%',
    midMarket: '85%',
    smb: '70-80%',
  },
  dollarRetention: {
    best: '120%+',
    healthy: '100-120%',
    leakyBucket: '< 100%',
    note: 'Dollar Retention (NRR) > 100% means expansion exceeds churn',
  },
  oneTimePurchase: 'Use 100% monthly churn for one-time purchase products',
};

export const referralRateBenchmarks = {
  great: '15% to 25%',
  good: '10% to 15%',
  low: '< 10%',
};

export const growthBenchmarks = {
  cmgr: {
    belowOneMillion: '15%+ (excellent)',
    aboveOneMillion: '10%+ (equals ~3x YoY)',
    note: 'CMGR = Compound Monthly Growth Rate',
  },
  arrGrowth: {
    underOneMillion: '68%',
    overOneMillion: '45%',
  },
};

export const efficiencyBenchmarks = {
  burnMultiple: {
    amazing: '< 1.0',
    good: '< 2.0',
    concerning: '> 2.0',
    formula: 'Net Burn / Net New ARR',
    note: 'Lower is better. Shows how efficiently you convert burn into growth.',
  },
  magicNumber: {
    good: '> 1.0',
    formula: 'Net New ARR / Prior Period S&M Expense',
  },
};

export const earlyAdopterGuidance = {
  idealSegmentSize: '16% of overall customer segment',
  goal: 'Aim to get as close as possible to your MSC using your early adopter segment alone.',
};

export const customerConcentration = {
  healthy: 'Largest customer < 10% of revenue',
  warning: 'Top 2-3 customers > 50% of revenue',
  note: 'High concentration is a significant business risk that investors will scrutinize.',
};
