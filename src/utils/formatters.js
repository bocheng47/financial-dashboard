/**
 * Format number as currency
 * @param {number} value - Number to format
 * @param {string} [currency='USD'] - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (!value || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format number as percentage
 * @param {number} value - Number to format
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  if (!value || isNaN(value)) return 'N/A';
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Format large numbers with suffix (K, M, B, T)
 * @param {number} value - Number to format
 * @returns {string} Formatted number with suffix
 */
export const formatLargeNumber = (value) => {
  if (!value || isNaN(value)) return 'N/A';
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const order = Math.floor(Math.log10(Math.abs(value)) / 3);
  
  if (order < 0 || order >= suffixes.length) return value.toFixed(2);
  
  const suffix = suffixes[order];
  const scaled = value / Math.pow(10, order * 3);
  
  return `${scaled.toFixed(2)}${suffix}`;
};
