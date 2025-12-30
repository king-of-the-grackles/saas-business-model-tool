import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { runFullModel, formatCurrency, formatPercent, formatNumber } from '../utils/calculations';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

export default function ScenarioComparison({ scenarios, onClose }) {
  const results = scenarios.map(s => ({
    ...s,
    results: runFullModel(s.inputs),
  }));

  // Prepare chart data
  const chartData = Array.from({ length: 36 }, (_, i) => {
    const data = { month: i + 1, name: `M${i + 1}` };
    results.forEach((r, idx) => {
      data[`customers_${idx}`] = r.results.monthlyProjections[i].totalRetained;
      data[`profit_${idx}`] = r.results.monthlyProjections[i].netProfit;
      data[`revenue_${idx}`] = r.results.monthlyProjections[i].grossRevenue;
    });
    return data;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Scenario Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {results.map((r, idx) => (
              <div key={r.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[idx] }}
                />
                <span className="font-medium text-gray-900">{r.name}</span>
              </div>
            ))}
          </div>

          {/* Summary Comparison Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                    {results.map((r, idx) => (
                      <th
                        key={r.id}
                        className="px-4 py-3 text-right text-xs font-medium uppercase"
                        style={{ color: COLORS[idx] }}
                      >
                        {r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Net Profit FY1</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(r.results.summaryMetrics.netProfitFY1, true)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Net Profit FY2</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(r.results.summaryMetrics.netProfitFY2, true)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">Net Profit FY3</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right font-bold">
                        <span className={r.results.summaryMetrics.meetsMSC ? 'text-green-600' : 'text-yellow-600'}>
                          {formatCurrency(r.results.summaryMetrics.netProfitFY3, true)}
                          {r.results.summaryMetrics.meetsMSC && ' ✓'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">LTV</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(r.results.summaryMetrics.ltv)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">LTV:CAC Ratio</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatNumber(r.results.summaryMetrics.ltvCacRatio, 1)}x
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">CAGR</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatPercent(r.results.summaryMetrics.cagr)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">End Customers (Y3)</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatNumber(r.results.yearlySummaries[2].endRetained)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Input Differences Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Assumption Differences</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Input</th>
                    {results.map((r, idx) => (
                      <th
                        key={r.id}
                        className="px-4 py-3 text-right text-xs font-medium uppercase"
                        style={{ color: COLORS[idx] }}
                      >
                        {r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Monthly Growth Rate</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatPercent(r.inputs.monthlyGrowthRate)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Conversion Rate</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatPercent(r.inputs.paidConversionRate)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Monthly Churn</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatPercent(r.inputs.monthlyChurn)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">Monthly Revenue</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(r.inputs.monthlyRevenuePerCustomer)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">CAC</td>
                    {results.map(r => (
                      <td key={r.id} className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(r.inputs.estimatedCAC)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Growth Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Growth Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={5} />
                <YAxis />
                <Tooltip />
                <Legend />
                {results.map((r, idx) => (
                  <Line
                    key={r.id}
                    type="monotone"
                    dataKey={`customers_${idx}`}
                    name={r.name}
                    stroke={COLORS[idx]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={5} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                {results.map((r, idx) => (
                  <Line
                    key={r.id}
                    type="monotone"
                    dataKey={`revenue_${idx}`}
                    name={r.name}
                    stroke={COLORS[idx]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Monthly Profit Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={5} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                {results.map((r, idx) => (
                  <Line
                    key={r.id}
                    type="monotone"
                    dataKey={`profit_${idx}`}
                    name={r.name}
                    stroke={COLORS[idx]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
