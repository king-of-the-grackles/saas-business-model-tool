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

// Color palette for pricing tiers
const tierColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-md font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' ?
              (entry.dataKey.includes('Revenue') || entry.dataKey.includes('Profit') || entry.dataKey.includes('Cost') ?
                formatCurrency(entry.value) : formatNumber(entry.value)) :
              entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={5}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="customers"
              name="Total Customers"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="newCustomers"
              name="New This Month"
              stroke="#10b981"
              fill="#34d399"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Customer Acquisition Funnel */}
      <ChartCard title="Customer Acquisition Funnel">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={5}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="traffic"
              name="Total Traffic"
              stroke="#6366f1"
              fill="#818cf8"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="newCustomers"
              name="New Customers"
              stroke="#10b981"
              fill="#34d399"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="customers"
              name="Total Retained"
              stroke="#3b82f6"
              fill="#60a5fa"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Revenue & Profit Chart */}
      <ChartCard title="Revenue & Profit Trends">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Monthly Revenue"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="netProfit"
              name="Monthly Profit"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cumulativeProfit"
              name="Cumulative Profit"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={5}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
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
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
            <Bar dataKey="costs" name="Costs" fill="#f87171" />
            <Bar dataKey="profit" name="Profit" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Cost Breakdown */}
      <ChartCard title="Cost Breakdown Over Time">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="cac"
              name="CAC"
              stackId="1"
              stroke="#f97316"
              fill="#fb923c"
            />
            <Area
              type="monotone"
              dataKey="staffing"
              name="Staffing"
              stackId="1"
              stroke="#8b5cf6"
              fill="#a78bfa"
            />
            <Area
              type="monotone"
              dataKey="ccFees"
              name="CC Fees"
              stackId="1"
              stroke="#06b6d4"
              fill="#22d3ee"
            />
            <Area
              type="monotone"
              dataKey="other"
              name="Other"
              stackId="1"
              stroke="#6b7280"
              fill="#9ca3af"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
