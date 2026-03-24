// Monthly traffic projection

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

export function calculateMonthlyTraffic(inputs, monthIndex) {
  const year = Math.floor(monthIndex / 12) + 1;
  const monthInYear = (monthIndex % 12) + 1;

  const paidTraffic = inputs.startingPaidTraffic * Math.pow(1 + inputs.monthlyGrowthRate, monthIndex);
  const organicTraffic = inputs.organicTraffic;
  const totalTraffic = paidTraffic + organicTraffic;

  return {
    month: monthIndex + 1,
    year,
    monthInYear,
    monthName: MONTH_NAMES[monthInYear - 1],
    paidTraffic: Math.round(paidTraffic * 100) / 100,
    organicTraffic,
    totalTraffic: Math.round(totalTraffic * 100) / 100,
  };
}
