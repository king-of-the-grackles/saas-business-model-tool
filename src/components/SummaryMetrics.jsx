import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';

function MetricCard({ label, value, subtext, highlight, warning, success }) {
  let bgColor = 'bg-white';
  let borderColor = 'border-gray-100';
  let textColor = 'text-brand-800';
  let subtextColor = 'text-gray-500';

  if (success) {
    bgColor = 'bg-success-50';
    borderColor = 'border-success-200';
    textColor = 'text-success-700';
    subtextColor = 'text-success-600/70';
  } else if (warning) {
    bgColor = 'bg-warning-50';
    borderColor = 'border-warning-200';
    textColor = 'text-warning-700';
    subtextColor = 'text-warning-600/70';
  } else if (highlight) {
    bgColor = 'bg-accent-50';
    borderColor = 'border-accent-200';
    textColor = 'text-accent-700';
    subtextColor = 'text-accent-600/70';
  }

  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} p-4 transition-all hover:shadow-md`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-2xl font-mono font-bold ${textColor} mt-1 tabular-nums`}>{value}</p>
      {subtext && <p className={`text-xs ${subtextColor} mt-1`}>{subtext}</p>}
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
    totalConversionRate,
    netProfitFY1,
    netProfitFY2,
    netProfitFY3,
    meetsMSC,
  } = summaryMetrics;

  const ltvCacPercent = ltvCacRatio * 100;
  const ltvCacStatus = ltvCacPercent < 200 ? 'low' :
                       ltvCacPercent < 300 ? 'moderate' :
                       ltvCacPercent <= 500 ? 'good' : 'high';

  // CAC Payback status: <6 months = great, <12 months = good, >12 months = warning
  const cacPaybackStatus = cacPayback <= 6 ? 'great' :
                           cacPayback <= 12 ? 'good' : 'warning';

  const endCustomersY1 = yearlySummaries[0]?.endRetained || 0;
  const endCustomersY2 = yearlySummaries[1]?.endRetained || 0;
  const endCustomersY3 = yearlySummaries[2]?.endRetained || 0;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-brand-800 mb-6">Key Metrics</h2>

      {/* Net Profit Section */}
      <div className="mb-6">
        <h3 className="section-header mb-3">Net Profit</h3>
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Year 1"
            value={formatCurrency(netProfitFY1, true)}
            subtext={`${endCustomersY1} customers`}
            warning={netProfitFY1 < 0}
          />
          <MetricCard
            label="Year 2"
            value={formatCurrency(netProfitFY2, true)}
            subtext={`${endCustomersY2} customers`}
            warning={netProfitFY2 < 0}
          />
          <MetricCard
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

      {/* Unit Economics */}
      <div className="mb-6">
        <h3 className="section-header mb-3">Unit Economics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            label="ARPU"
            value={formatCurrency(arpu)}
            subtext={`${inputs.pricingTiers?.length || 1} pricing tier${inputs.pricingTiers?.length !== 1 ? 's' : ''}`}
          />
          <MetricCard
            label="LTV"
            value={formatCurrency(ltv)}
            subtext={`@ ${formatPercent(grossMargin || 0.8)} gross margin`}
          />
          <MetricCard
            label="CAC"
            value={formatCurrency(inputs.estimatedCAC)}
            subtext="Acquisition Cost"
          />
          <MetricCard
            label="LTV:CAC Ratio"
            value={formatNumber(ltvCacRatio, 1) + 'x'}
            subtext={ltvCacStatus === 'low' ? 'Below 3x minimum' :
                     ltvCacStatus === 'moderate' ? 'Approaching 3x' :
                     ltvCacStatus === 'good' ? 'Healthy (3-5x)' : 'Consider more growth spend'}
            warning={ltvCacStatus === 'low'}
            success={ltvCacStatus === 'good'}
            highlight={ltvCacStatus === 'high'}
          />
          <MetricCard
            label="CAC Payback"
            value={formatNumber(cacPayback, 1) + ' mo'}
            subtext={cacPaybackStatus === 'great' ? 'Excellent (<6mo)' :
                     cacPaybackStatus === 'good' ? 'Good (<12mo)' : 'Needs work (>12mo)'}
            success={cacPaybackStatus === 'great'}
            highlight={cacPaybackStatus === 'good'}
            warning={cacPaybackStatus === 'warning'}
          />
          <MetricCard
            label="Avg Customer Lifespan"
            value={formatNumber(acl, 1) + ' mo'}
            subtext={`${formatPercent(inputs.monthlyChurn)} monthly churn`}
          />
        </div>
      </div>

      {/* Growth Metrics */}
      <div>
        <h3 className="section-header mb-3">Growth</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Monthly Growth"
            value={formatPercent(inputs.monthlyGrowthRate)}
            subtext="Traffic growth rate"
          />
          <MetricCard
            label="CAGR"
            value={formatPercent(cagr)}
            subtext="Annual compound rate"
            highlight
          />
          <MetricCard
            label="Total Conversion"
            value={formatPercent(totalConversionRate)}
            subtext="Traffic to customers"
          />
          <MetricCard
            label="Referral Rate"
            value={formatPercent(inputs.customerReferralRate)}
            subtext="Customer referrals"
          />
        </div>
      </div>
    </div>
  );
}
