import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';
import {
  getLtvCacStatus,
  getCacPaybackStatus,
  getGrossMarginStatus,
  getMonthlyChurnStatus,
  getReferralRateStatus,
  getMonthlyGrowthStatus,
  benchmarkText,
} from '../utils/benchmarkComparison';
import Tooltip, { InfoIcon } from './Tooltip';

// Metric explanations for tooltips
const metricTooltips = {
  // Unit Economics
  arpu: 'Average Revenue Per User — the average monthly revenue generated per paying customer across all pricing tiers.',
  ltv: 'Lifetime Value — total revenue expected from a customer over their entire relationship. Formula: ARPU × Avg Lifespan × Gross Margin.',
  cac: 'Customer Acquisition Cost — the cost to acquire one paying customer through marketing and sales efforts.',
  ltvCac: 'Ratio of customer lifetime value to acquisition cost. 3-5x is healthy; below 3x is unsustainable; above 6x suggests under-investment in growth.',
  cacPayback: 'Months to recover customer acquisition cost from their revenue. Formula: CAC ÷ (ARPU × Gross Margin). Under 12 months is good.',
  avgLifespan: 'Average Customer Lifespan — how long customers stay before churning. Formula: 1 ÷ Monthly Churn Rate.',
  // Growth Metrics
  monthlyGrowth: 'Monthly traffic growth rate — how much your visitor traffic increases each month. 10%+ MoM is strong growth.',
  cagr: 'Compound Annual Growth Rate — your annualized revenue growth rate accounting for compounding. Shows overall growth trajectory.',
  conversion: 'Conversion rate — percentage of visitors who become paying customers. Varies by segment: B2B 1-3%, eCommerce 2-4%.',
  referrals: 'Customer referral rate — percentage of new customers acquired through referrals from existing customers. 15-25% is excellent.',
};

// Primary metric card - large, prominent (Net Profit)
function PrimaryMetricCard({ label, value, subtext, warning, success }) {
  let bgColor = 'bg-white';
  let borderColor = 'border-gray-100';
  let textColor = 'text-brand-800';
  let subtextColor = 'text-gray-500';
  let gradientOverlay = '';

  if (success) {
    bgColor = 'bg-gradient-to-br from-success-50 to-success-100/50';
    borderColor = 'border-success-200';
    textColor = 'text-success-700';
    subtextColor = 'text-success-600/70';
    gradientOverlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-success-500/5 before:to-transparent before:rounded-xl';
  } else if (warning) {
    bgColor = 'bg-gradient-to-br from-warning-50 to-warning-100/50';
    borderColor = 'border-warning-200';
    textColor = 'text-warning-700';
    subtextColor = 'text-warning-600/70';
    gradientOverlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-warning-500/5 before:to-transparent before:rounded-xl';
  }

  return (
    <div className={`relative ${bgColor} rounded-xl border ${borderColor} p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${gradientOverlay}`}>
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-mono font-bold ${textColor} mt-1.5 tabular-nums`}>{value}</p>
      {subtext && <p className={`text-xs ${subtextColor} mt-1.5 font-medium`}>{subtext}</p>}
    </div>
  );
}

// Secondary metric card - medium, supporting metrics (Unit Economics)
function SecondaryMetricCard({ label, value, subtext, highlight, warning, success, tooltip }) {
  let bgColor = 'bg-white';
  let borderColor = 'border-gray-100';
  let textColor = 'text-brand-800';
  let subtextColor = 'text-gray-500';
  let accentBar = 'bg-brand-200';

  if (success) {
    bgColor = 'bg-success-50/50';
    borderColor = 'border-success-100';
    textColor = 'text-success-700';
    subtextColor = 'text-success-600/70';
    accentBar = 'bg-success-400';
  } else if (warning) {
    bgColor = 'bg-warning-50/50';
    borderColor = 'border-warning-100';
    textColor = 'text-warning-700';
    subtextColor = 'text-warning-600/70';
    accentBar = 'bg-warning-400';
  } else if (highlight) {
    bgColor = 'bg-accent-50/50';
    borderColor = 'border-accent-100';
    textColor = 'text-accent-700';
    subtextColor = 'text-accent-600/70';
    accentBar = 'bg-accent-400';
  }

  return (
    <div className={`${bgColor} rounded-lg border ${borderColor} p-3 transition-all duration-200 hover:shadow-md relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-0.5 h-full ${accentBar}`} />
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </p>
      <p className={`text-lg font-mono font-bold ${textColor} mt-0.5 tabular-nums`}>{value}</p>
      {subtext && <p className={`text-xs ${subtextColor} mt-0.5`}>{subtext}</p>}
    </div>
  );
}

// Tertiary metric card - compact, supplementary (Growth)
function TertiaryMetricCard({ label, value, subtext, highlight, tooltip }) {
  let textColor = 'text-brand-700';
  let bgHover = 'hover:bg-brand-50/50';

  if (highlight) {
    textColor = 'text-accent-700';
    bgHover = 'hover:bg-accent-50/50';
  }

  return (
    <div className={`bg-white/50 rounded-lg border border-gray-100 p-3 transition-all duration-200 ${bgHover}`}>
      <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </p>
      <p className={`text-lg font-mono font-semibold ${textColor} mt-0.5 tabular-nums`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  );
}

export default function SummaryMetrics({ results }) {
  const { summaryMetrics, yearlySummaries, inputs } = results;
  const {
    cagr,
    acl,
    ltv,
    ltvCacRatio,
    cacPayback,
    grossMargin,
    arpu,
    conversionRate,
    cac,
    netProfitFY1,
    netProfitFY2,
    netProfitFY3,
    meetsMSC,
  } = summaryMetrics;

  // Use centralized benchmark status functions
  const ltvCacStatus = getLtvCacStatus(ltvCacRatio);
  const cacPaybackStatus = getCacPaybackStatus(cacPayback);
  const grossMarginStatus = getGrossMarginStatus(grossMargin);
  const churnStatus = getMonthlyChurnStatus(inputs.monthlyChurn);
  const referralStatus = getReferralRateStatus(inputs.customerReferralRate);
  const growthStatus = getMonthlyGrowthStatus(inputs.monthlyGrowthRate);

  const endCustomersY1 = yearlySummaries[0]?.endRetained || 0;
  const endCustomersY2 = yearlySummaries[1]?.endRetained || 0;
  const endCustomersY3 = yearlySummaries[2]?.endRetained || 0;

  return (
    <div className="card p-5">
      <h2 className="text-base font-bold text-brand-800 mb-5">Key Metrics</h2>

      {/* Net Profit Section - Primary Tier */}
      <div className="mb-6">
        <h3 className="section-header mb-3">Net Profit</h3>
        <div className="grid grid-cols-3 gap-3">
          <PrimaryMetricCard
            label="Year 1"
            value={formatCurrency(netProfitFY1, true)}
            subtext={`${formatNumber(endCustomersY1)} customers`}
            warning={netProfitFY1 < 0}
          />
          <PrimaryMetricCard
            label="Year 2"
            value={formatCurrency(netProfitFY2, true)}
            subtext={`${formatNumber(endCustomersY2)} customers`}
            warning={netProfitFY2 < 0}
          />
          <PrimaryMetricCard
            label="Year 3"
            value={formatCurrency(netProfitFY3, true)}
            subtext={`Target: ${formatCurrency(inputs.minimumSuccessCriteria, true)}`}
            success={meetsMSC}
            warning={!meetsMSC}
          />
        </div>
        {!meetsMSC && (
          <div className="mt-4 p-4 bg-warning-50 border-l-4 border-warning-500 rounded-r-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-warning-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-semibold text-warning-800">Below MSC Target</p>
                <p className="text-sm text-warning-700 mt-0.5">
                  Your projected FY3 net profit of <span className="font-mono font-medium">{formatCurrency(netProfitFY3)}</span> is {formatPercent((inputs.minimumSuccessCriteria - netProfitFY3) / inputs.minimumSuccessCriteria)} below your target of <span className="font-mono font-medium">{formatCurrency(inputs.minimumSuccessCriteria)}</span>.
                </p>
              </div>
            </div>
          </div>
        )}
        {meetsMSC && (
          <div className="mt-4 p-4 bg-success-50 border-l-4 border-success-500 rounded-r-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-success-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-semibold text-success-800">MSC Target Met!</p>
                <p className="text-sm text-success-700 mt-0.5">Your projected FY3 net profit exceeds your minimum success criteria.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unit Economics - Secondary Tier */}
      <div className="mb-6">
        <h3 className="section-header mb-3">Unit Economics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <SecondaryMetricCard
            label="ARPU"
            value={formatCurrency(arpu)}
            subtext={`${inputs.pricingTiers?.length || 1} tier${inputs.pricingTiers?.length !== 1 ? 's' : ''}`}
            tooltip={metricTooltips.arpu}
          />
          <SecondaryMetricCard
            label="LTV"
            value={formatCurrency(ltv)}
            subtext={`@ ${formatPercent(grossMargin || 0.8)} margin`}
            success={grossMarginStatus === 'excellent'}
            highlight={grossMarginStatus === 'good'}
            warning={grossMarginStatus === 'warning'}
            tooltip={metricTooltips.ltv}
          />
          <SecondaryMetricCard
            label="CAC"
            value={formatCurrency(cac)}
            subtext={benchmarkText.cacPayback}
            tooltip={metricTooltips.cac}
          />
          <SecondaryMetricCard
            label="LTV:CAC"
            value={formatNumber(ltvCacRatio, 1) + 'x'}
            subtext={ltvCacStatus === 'poor' ? 'Below 3x min' :
                     ltvCacStatus === 'warning' ? 'Near 3x median' :
                     ltvCacStatus === 'good' ? 'Healthy (3-5x)' : 'High - invest more'}
            warning={ltvCacStatus === 'poor' || ltvCacStatus === 'warning'}
            success={ltvCacStatus === 'good'}
            highlight={ltvCacStatus === 'high'}
            tooltip={metricTooltips.ltvCac}
          />
          <SecondaryMetricCard
            label="CAC Payback"
            value={formatNumber(cacPayback, 1) + ' mo'}
            subtext={cacPaybackStatus === 'excellent' ? 'Excellent (<6mo)' :
                     cacPaybackStatus === 'good' ? 'Good (6-12mo)' :
                     cacPaybackStatus === 'warning' ? 'Acceptable (12-18mo)' : 'Concerning (>18mo)'}
            success={cacPaybackStatus === 'excellent'}
            highlight={cacPaybackStatus === 'good'}
            warning={cacPaybackStatus === 'warning' || cacPaybackStatus === 'poor'}
            tooltip={metricTooltips.cacPayback}
          />
          <SecondaryMetricCard
            label="Avg Lifespan"
            value={formatNumber(acl, 1) + ' mo'}
            subtext={`Churn: ${formatPercent(inputs.monthlyChurn)} ${churnStatus === 'excellent' ? '(great)' : churnStatus === 'good' ? '(ok)' : '(high)'}`}
            success={churnStatus === 'excellent'}
            highlight={churnStatus === 'good'}
            warning={churnStatus === 'warning'}
            tooltip={metricTooltips.avgLifespan}
          />
        </div>
      </div>

      {/* Growth Metrics - Tertiary Tier */}
      <div>
        <h3 className="section-header mb-2">Growth</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          <TertiaryMetricCard
            label="Monthly Growth"
            value={formatPercent(inputs.monthlyGrowthRate)}
            subtext={growthStatus === 'excellent' ? 'Strong (15%+)' :
                     growthStatus === 'good' ? 'Good (10%+)' : 'Modest'}
            highlight={growthStatus === 'excellent' || growthStatus === 'good'}
            tooltip={metricTooltips.monthlyGrowth}
          />
          <TertiaryMetricCard
            label="CAGR"
            value={formatPercent(cagr)}
            subtext="Annual compound"
            highlight
            tooltip={metricTooltips.cagr}
          />
          <TertiaryMetricCard
            label="Conversion"
            value={formatPercent(conversionRate)}
            subtext={benchmarkText.conversion}
            tooltip={metricTooltips.conversion}
          />
          <TertiaryMetricCard
            label="Referrals"
            value={formatPercent(inputs.customerReferralRate)}
            subtext={referralStatus === 'excellent' ? 'Great (15%+)' :
                     referralStatus === 'good' ? 'Good (10-15%)' : 'Room to grow'}
            highlight={referralStatus === 'excellent' || referralStatus === 'good'}
            tooltip={metricTooltips.referrals}
          />
        </div>
      </div>
    </div>
  );
}
