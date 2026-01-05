import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency, formatNumber, calculateARPU, getTotalConversionRate } from '../utils/calculations';

// Brand-aligned color palette
const chartColors = {
  primary: '#486581',      // brand-600
  secondary: '#0d9488',    // accent-600
  tertiary: '#627d98',     // brand-500
  success: '#10b981',      // success-500
  warning: '#f59e0b',      // warning-500
  danger: '#ef4444',       // danger-500
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

// Color palette for pricing tiers
const tierColors = ['#486581', '#0d9488', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

function ChartCard({ title, children }) {
  return (
    <div className="card p-6 card-hover">
      <h3 className="text-sm font-semibold text-brand-800 mb-5 flex items-center gap-2">
        <span className="w-1 h-4 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4">
        <p className="font-semibold text-brand-800 text-sm mb-2 pb-2 border-b border-gray-100">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-mono font-medium text-sm" style={{ color: entry.color }}>
                {typeof entry.value === 'number' ?
                  (entry.dataKey.includes('Revenue') || entry.dataKey.includes('Profit') || entry.dataKey.includes('Cost') || entry.dataKey.includes('revenue') || entry.dataKey.includes('profit') || entry.dataKey.includes('costs') || entry.dataKey.includes('tier_') ?
                    formatCurrency(entry.value) : formatNumber(entry.value)) :
                  entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// Custom legend component
function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ChartsPanel({ results }) {
  const { monthlyProjections, inputs } = results;

  // Calculate ARPU and tier data
  const tiers = inputs.pricingTiers || [];
  const arpu = calculateARPU(tiers);
  const totalConversionRate = getTotalConversionRate(tiers);

  // Prepare data for charts
  const chartData = monthlyProjections.map((m, i) => {
    const baseData = {
      name: `M${i + 1}`,
      fullName: `${m.monthName} Y${m.year}`,
      month: i + 1,
      year: m.year,
      traffic: Math.round(m.totalTraffic),
      customers: m.totalRetained,
      newCustomers: m.paidConversions + Math.round(m.referrals),
      churned: m.monthlyChurn,
      revenue: m.grossRevenue,
      netProfit: m.netProfit,
      cumulativeProfit: monthlyProjections.slice(0, i + 1).reduce((sum, x) => sum + x.netProfit, 0),
      totalCosts: m.totalOperatingCosts,
      cac: m.costs.cac,
      staffing: m.costs.staffing,
      ccFees: m.costs.ccFees,
      other: m.costs.office + m.costs.insurance + m.costs.inventory + m.costs.delivery + m.costs.rent,
      arpu: arpu,
    };

    // Add per-tier revenue breakdown
    if (tiers.length > 0 && totalConversionRate > 0) {
      tiers.forEach((tier) => {
        const tierWeight = tier.conversionRate / totalConversionRate;
        baseData[`tier_${tier.id}`] = m.totalRetained * tier.monthlyPrice * tierWeight;
      });
    }

    return baseData;
  });

  // Yearly summary for bar chart
  const yearlyData = [1, 2, 3].map(year => {
    const yearMonths = monthlyProjections.filter(m => m.year === year);
    return {
      name: `Year ${year}`,
      revenue: yearMonths.reduce((sum, m) => sum + m.grossRevenue, 0),
      costs: yearMonths.reduce((sum, m) => sum + m.totalOperatingCosts, 0),
      profit: yearMonths.reduce((sum, m) => sum + m.netProfit, 0),
    };
  });

  return (
    <div className="space-y-6">
      {/* Customer Growth Chart */}
      <ChartCard title="Customer Growth Over Time">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="newCustomerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="customers"
              name="Total Customers"
              stroke={chartColors.primary}
              strokeWidth={2}
              fill="url(#customerGradient)"
            />
            <Area
              type="monotone"
              dataKey="newCustomers"
              name="New This Month"
              stroke={chartColors.secondary}
              strokeWidth={2}
              fill="url(#newCustomerGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Customer Acquisition Funnel */}
      <ChartCard title="Customer Acquisition Funnel">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.tertiary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.tertiary} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="traffic"
              name="Total Traffic"
              stroke={chartColors.tertiary}
              strokeWidth={2}
              fill="url(#trafficGradient)"
            />
            <Area
              type="monotone"
              dataKey="newCustomers"
              name="New Customers"
              stroke={chartColors.secondary}
              strokeWidth={2}
              fill="url(#newCustomerGradient)"
            />
            <Area
              type="monotone"
              dataKey="customers"
              name="Total Retained"
              stroke={chartColors.primary}
              strokeWidth={2}
              fill="url(#customerGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Revenue & Profit Chart */}
      <ChartCard title="Revenue & Profit Trends">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <ReferenceLine y={0} stroke="#d1d5db" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Monthly Revenue"
              stroke={chartColors.primary}
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="netProfit"
              name="Monthly Profit"
              stroke={chartColors.success}
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cumulativeProfit"
              name="Cumulative Profit"
              stroke={chartColors.purple}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Revenue by Tier Chart */}
      {tiers.length > 0 && (
        <ChartCard title="Revenue by Pricing Tier">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval={5}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              {tiers.map((tier, index) => (
                <Area
                  key={tier.id}
                  type="monotone"
                  dataKey={`tier_${tier.id}`}
                  name={tier.name}
                  stackId="tiers"
                  stroke={tierColors[index % tierColors.length]}
                  fill={tierColors[index % tierColors.length]}
                  fillOpacity={0.7}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Yearly Summary Bar Chart */}
      <ChartCard title="Annual Revenue vs Costs">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={yearlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="revenue" name="Revenue" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="costs" name="Costs" fill={chartColors.danger} radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Profit" fill={chartColors.success} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Cost Breakdown */}
      <ChartCard title="Cost Breakdown Over Time">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cacGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.warning} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.warning} stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="staffingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.purple} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.purple} stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="ccGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.cyan} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.cyan} stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="otherGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="cac"
              name="CAC"
              stackId="1"
              stroke={chartColors.warning}
              fill="url(#cacGradient)"
            />
            <Area
              type="monotone"
              dataKey="staffing"
              name="Staffing"
              stackId="1"
              stroke={chartColors.purple}
              fill="url(#staffingGradient)"
            />
            <Area
              type="monotone"
              dataKey="ccFees"
              name="CC Fees"
              stackId="1"
              stroke={chartColors.cyan}
              fill="url(#ccGradient)"
            />
            <Area
              type="monotone"
              dataKey="other"
              name="Other"
              stackId="1"
              stroke="#6b7280"
              fill="url(#otherGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
