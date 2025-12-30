import { useState } from 'react';
import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';

function YearSection({ year, months, yearlySummary }) {
  const [isOpen, setIsOpen] = useState(year === 1);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-900">Year {year}</span>
          <span className="text-sm text-gray-600">
            Revenue: {formatCurrency(yearlySummary.grossRevenue, true)} |
            Profit: {formatCurrency(yearlySummary.netProfit, true)} |
            Customers: {formatNumber(yearlySummary.endRetained)}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Traffic</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Conv.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Refs</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Churn</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Retained</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Costs</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {months.map((m) => (
                <tr key={m.month} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{m.monthName}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-600">{formatNumber(m.totalTraffic)}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-600">{m.paidConversions}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-600">{formatNumber(m.referrals, 1)}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-600">{m.monthlyChurn}</td>
                  <td className="px-3 py-2 text-sm text-right font-medium text-gray-900">{m.totalRetained}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-600">{formatCurrency(m.grossRevenue)}</td>
                  <td className="px-3 py-2 text-sm text-right text-gray-600">{formatCurrency(m.totalOperatingCosts)}</td>
                  <td className={`px-3 py-2 text-sm text-right font-medium ${m.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(m.netProfit)}
                  </td>
                  <td className={`px-3 py-2 text-sm text-right ${m.netProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(m.netProfitMargin)}
                  </td>
                </tr>
              ))}
              {/* Year Total Row */}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-3 py-2 text-sm text-gray-900">Total</td>
                <td className="px-3 py-2 text-sm text-right text-gray-900">{formatNumber(yearlySummary.totalTraffic)}</td>
                <td className="px-3 py-2 text-sm text-right text-gray-900">{yearlySummary.totalConversions}</td>
                <td className="px-3 py-2 text-sm text-right text-gray-900">{formatNumber(yearlySummary.totalReferrals, 1)}</td>
                <td className="px-3 py-2 text-sm text-right text-gray-900">{yearlySummary.totalChurn}</td>
                <td className="px-3 py-2 text-sm text-right text-gray-900">{yearlySummary.endRetained}</td>
                <td className="px-3 py-2 text-sm text-right text-gray-900">{formatCurrency(yearlySummary.grossRevenue)}</td>
                <td className="px-3 py-2 text-sm text-right text-gray-900">{formatCurrency(yearlySummary.totalCosts)}</td>
                <td className={`px-3 py-2 text-sm text-right ${yearlySummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(yearlySummary.netProfit)}
                </td>
                <td className={`px-3 py-2 text-sm text-right ${yearlySummary.netProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(yearlySummary.netProfitMargin)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MonthlyTable({ results }) {
  const { monthlyProjections, yearlySummaries } = results;

  const year1Months = monthlyProjections.filter(m => m.year === 1);
  const year2Months = monthlyProjections.filter(m => m.year === 2);
  const year3Months = monthlyProjections.filter(m => m.year === 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Projections</h2>
      <p className="text-sm text-gray-600 mb-4">Click a year to expand and view monthly details.</p>

      <YearSection year={1} months={year1Months} yearlySummary={yearlySummaries[0]} />
      <YearSection year={2} months={year2Months} yearlySummary={yearlySummaries[1]} />
      <YearSection year={3} months={year3Months} yearlySummary={yearlySummaries[2]} />
    </div>
  );
}
