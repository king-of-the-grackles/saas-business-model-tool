// 36-month projection orchestrator — composes traffic, customer, revenue, and cost modules

import { calculateMonthlyTraffic } from './trafficModel.js';
import { calculateMonthlyCustomers } from './customerModel.js';
import { calculateMonthlyRevenue } from './revenueModel.js';
import { calculateMonthlyCosts } from './costModel.js';
import { calculateCACFromAdSpend } from './unitEconomics.js';

export function calculateMonthlyProjections(inputs) {
  const months = [];
  let previousRetained = 0;

  const conversionRate = inputs.conversionRate;
  const cac = calculateCACFromAdSpend(inputs.monthlyAdSpend, inputs.startingPaidTraffic, conversionRate);

  for (let i = 0; i < 36; i++) {
    const traffic = calculateMonthlyTraffic(inputs, i);
    const customers = calculateMonthlyCustomers(inputs, i, previousRetained, conversionRate);
    const grossRevenue = calculateMonthlyRevenue(inputs, customers.totalRetained);
    const { costs, totalOperatingCosts } = calculateMonthlyCosts(inputs, grossRevenue, {
      paidConversions: customers.paidConversions,
      cac,
    });

    const netProfit = grossRevenue - totalOperatingCosts;
    const netProfitMargin = grossRevenue > 0 ? netProfit / grossRevenue : 0;

    months.push({
      ...traffic,
      ...customers,
      grossRevenue,
      costs,
      totalOperatingCosts,
      netProfit,
      netProfitMargin,
    });

    previousRetained = customers.totalRetained;
  }

  return months;
}
