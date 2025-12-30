import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';

function MetricCard({ label, value, subtext, highlight, warning, success }) {
  let bgColor = 'bg-white';
  let borderColor = 'border-gray-200';
  let textColor = 'text-gray-900';

  if (success) {
    bgColor = 'bg-green-50';
    borderColor = 'border-green-300';
    textColor = 'text-green-700';
  } else if (warning) {
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-300';
    textColor = 'text-yellow-700';
  } else if (highlight) {
    bgColor = 'bg-blue-50';
    borderColor = 'border-blue-300';
    textColor = 'text-blue-700';
  }

  return (
    <div className={`${bgColor} rounded-lg border ${borderColor} p-4`}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Key Metrics</h2>

      {/* Net Profit Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Net Profit</h3>
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
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Below MSC Target:</span> Your projected FY3 net profit of {formatCurrency(netProfitFY3)} is {formatPercent((inputs.minimumSuccessCriteria - netProfitFY3) / inputs.minimumSuccessCriteria)} below your target of {formatCurrency(inputs.minimumSuccessCriteria)}.
            </p>
          </div>
        )}
        {meetsMSC && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <span className="font-semibold">MSC Target Met!</span> Your projected FY3 net profit exceeds your minimum success criteria.
            </p>
          </div>
        )}
      </div>

      {/* Unit Economics */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Unit Economics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Growth</h3>
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
            label="Conversion Rate"
            value={formatPercent(inputs.paidConversionRate)}
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
