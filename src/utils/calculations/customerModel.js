// Customer acquisition, referral, churn, and retention model
// Solves the circular reference: referrals = retained × rate, retained = prev + conv + referrals - churn
// Algebraic solution: retained = (prev - churn + conversions) / (1 - referralRate)

export function calculateMonthlyCustomers(inputs, monthIndex, previousRetained, conversionRate) {
  const paidTraffic = inputs.startingPaidTraffic * Math.pow(1 + inputs.monthlyGrowthRate, monthIndex);
  const paidConversions = Math.round(paidTraffic * conversionRate);

  let totalRetained;
  let referrals;
  const monthlyChurnCount = Math.round(previousRetained * inputs.monthlyChurn);

  if (monthIndex === 0) {
    totalRetained = paidConversions;
    referrals = 0;
  } else {
    const baseRetained = previousRetained + paidConversions - monthlyChurnCount;
    totalRetained = Math.round(baseRetained / (1 - inputs.customerReferralRate));
    referrals = Math.round((totalRetained * inputs.customerReferralRate) * 100) / 100;
  }

  return {
    paidConversions,
    referrals,
    previousRetained,
    monthlyChurn: monthlyChurnCount,
    totalRetained,
  };
}
