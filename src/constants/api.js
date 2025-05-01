/**
 * API related constants
 */
export const API_KEY = 'XQF67C2AU3V58Z62';
export const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * API endpoints and functions
 */
export const ENDPOINTS = {
  OVERVIEW: 'OVERVIEW',
  INCOME: 'INCOME_STATEMENT',
  QUOTE: 'GLOBAL_QUOTE',
  EARNINGS: 'EARNINGS'
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key. Please check your configuration.',
  RATE_LIMIT: 'API rate limit exceeded. Please try again later.',
  NOT_FOUND: 'No data found for the specified stock symbol.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  DEFAULT: 'An error occurred while fetching stock data.'
};
