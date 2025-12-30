import { useState } from 'react';
import {
  conversionRateBenchmarks,
  mscArrGoals,
  ltvCacRatios,
  cacPaybackBenchmarks,
  cacSpendingGuidelines,
  grossMarginBenchmarks,
  churnBenchmarks,
  referralRateBenchmarks,
  growthBenchmarks,
  efficiencyBenchmarks,
  earlyAdopterGuidance,
} from '../data/benchmarks';

function Section({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function BenchmarksPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Industry Benchmarks (2025)</h2>
        <p className="text-sm text-gray-600">Reference data from ChartMogul, Craft Ventures, FirstPageSage</p>
      </div>

      <Section title="LTV:CAC Ratio" defaultOpen={true}>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">Minimum</p>
              <p className="font-bold text-yellow-600">{ltvCacRatios.minimum}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Median</p>
              <p className="font-bold text-blue-600">{ltvCacRatios.median}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">High Performers</p>
              <p className="font-bold text-green-600">{ltvCacRatios.highPerforming}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {ltvCacRatios.guidance.map((g, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{g.range}</p>
              <p className="text-sm text-gray-600 mt-1">{g.advice}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="CAC Payback Period">
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span className="text-sm text-gray-900">Excellent</span>
            <span className="text-sm font-bold text-green-600">{cacPaybackBenchmarks.excellent}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
            <span className="text-sm text-gray-900">Good</span>
            <span className="text-sm font-bold text-blue-600">{cacPaybackBenchmarks.good}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
            <span className="text-sm text-gray-900">Acceptable</span>
            <span className="text-sm font-bold text-yellow-600">{cacPaybackBenchmarks.acceptable}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-red-50 rounded">
            <span className="text-sm text-gray-900">Concerning</span>
            <span className="text-sm font-bold text-red-600">{cacPaybackBenchmarks.concerning}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">{cacPaybackBenchmarks.note}</p>
        </div>
      </Section>

      <Section title="Gross Margin">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">SaaS Minimum</span>
            <span className="text-sm font-bold text-yellow-600">{grossMarginBenchmarks.saasMinimum}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">SaaS Target</span>
            <span className="text-sm font-bold text-green-600">{grossMarginBenchmarks.saasTarget}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">{grossMarginBenchmarks.note}</p>
        </div>
      </Section>

      <Section title="Churn & Retention">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Monthly Churn</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Great</span>
                <span className="font-medium text-green-600">{churnBenchmarks.monthly.great}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Good</span>
                <span className="font-medium text-blue-600">{churnBenchmarks.monthly.good}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">B2B Median</span>
                <span className="font-medium text-gray-900">{churnBenchmarks.monthly.b2bMedian}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Concerning</span>
                <span className="font-medium text-red-600">{churnBenchmarks.monthly.concerning}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Logo Retention</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Enterprise</span>
                <span className="font-medium text-gray-900">{churnBenchmarks.logoRetention.enterprise}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mid-Market</span>
                <span className="font-medium text-gray-900">{churnBenchmarks.logoRetention.midMarket}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SMB</span>
                <span className="font-medium text-gray-900">{churnBenchmarks.logoRetention.smb}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Dollar Retention (NRR)</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Best SaaS</span>
                <span className="font-bold text-green-600">{churnBenchmarks.dollarRetention.best}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Healthy</span>
                <span className="font-medium text-blue-600">{churnBenchmarks.dollarRetention.healthy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Leaky Bucket</span>
                <span className="font-medium text-red-600">{churnBenchmarks.dollarRetention.leakyBucket}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{churnBenchmarks.dollarRetention.note}</p>
          </div>
        </div>
      </Section>

      <Section title="Growth Benchmarks">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">CMGR (Compound Monthly Growth Rate)</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Below $1M ARR</span>
                <span className="font-medium text-green-600">{growthBenchmarks.cmgr.belowOneMillion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Above $1M ARR</span>
                <span className="font-medium text-blue-600">{growthBenchmarks.cmgr.aboveOneMillion}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">ARR Growth</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Under $1M</span>
                <span className="font-medium text-gray-900">{growthBenchmarks.arrGrowth.underOneMillion}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Over $1M</span>
                <span className="font-medium text-gray-900">{growthBenchmarks.arrGrowth.overOneMillion}%</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Conversion Rate Benchmarks">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">Segment</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Range</th>
            </tr>
          </thead>
          <tbody>
            {conversionRateBenchmarks.map((b, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-2 text-sm text-gray-900">{b.segment}</td>
                <td className="py-2 text-sm text-right text-blue-600 font-medium">{b.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="MSC ARR Goals (Year 3)">
        <div className="space-y-2">
          {mscArrGoals.map((goal, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg font-bold text-blue-600 min-w-[60px]">{goal.target}</span>
              <span className="text-sm text-gray-600">{goal.description}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Capital Efficiency">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Burn Multiple</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amazing</span>
                <span className="font-bold text-green-600">{efficiencyBenchmarks.burnMultiple.amazing}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Good</span>
                <span className="font-medium text-blue-600">{efficiencyBenchmarks.burnMultiple.good}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Concerning</span>
                <span className="font-medium text-yellow-600">{efficiencyBenchmarks.burnMultiple.concerning}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{efficiencyBenchmarks.burnMultiple.formula}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Magic Number</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Target</span>
              <span className="font-medium text-green-600">{efficiencyBenchmarks.magicNumber.good}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{efficiencyBenchmarks.magicNumber.formula}</p>
          </div>
        </div>
      </Section>

      <Section title="CAC Spending Guidelines">
        <div className="space-y-3">
          {cacSpendingGuidelines.map((g, i) => (
            <div key={i} className="border-l-2 border-blue-500 pl-3">
              <p className="text-sm font-medium text-gray-900">{g.industry}</p>
              <p className="text-sm text-blue-600 font-medium">{g.range}</p>
              <p className="text-xs text-gray-500 mt-1">{g.notes}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Early Adopter Strategy">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Ideal segment size: <span className="font-semibold text-blue-600">{earlyAdopterGuidance.idealSegmentSize}</span>
          </p>
          <p className="text-sm text-gray-600">{earlyAdopterGuidance.goal}</p>
        </div>
      </Section>
    </div>
  );
}
