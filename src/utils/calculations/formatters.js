// Display formatting utilities

export function formatCurrency(value, compact = false) {
  if (value === Infinity) return '∞';
  if (compact && Math.abs(value) >= 1000000) {
    return '$' + (value / 1000000).toFixed(1) + 'M';
  }
  if (compact && Math.abs(value) >= 1000) {
    return '$' + (value / 1000).toFixed(1) + 'K';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value, decimals = 1) {
  if (value === Infinity) return '∞';
  return (value * 100).toFixed(decimals) + '%';
}

export function formatNumber(value, decimals = 0) {
  if (value === Infinity) return '∞';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
