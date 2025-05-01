import axios from 'axios';
import { API_KEY, BASE_URL, ENDPOINTS, ERROR_MESSAGES } from '../constants/api';
import { formatCurrency, formatPercentage, formatLargeNumber } from '../utils/formatters';

// Default values for financial metrics when data is unavailable
const DEFAULT_METRICS = {
  company: {
    name: 'N/A',
    symbol: 'N/A',
    description: 'No company description available',
    sector: 'N/A',
    industry: 'N/A',
    employees: 'N/A'
  },
  financials: {
    'Market Cap': 'N/A',
    'P/E Ratio': 'N/A',
    'EPS': 'N/A',
    'Dividend Yield': 'N/A',
    'Profit Margin': 'N/A',
    '52-Week High': 'N/A',
    '52-Week Low': 'N/A'
  },
  news: []
};

// Financial keywords to filter news
const FINANCIAL_KEYWORDS = [
  'earnings', 'revenue', 'profit', 'growth',
  'market share', 'stock price', 'valuation',
  'analyst', 'investment', 'financial results',
  'merger', 'acquisition', 'dividend',
  'quarterly report', 'guidance', 'forecast'
];

// Helper function to get last week's date
const getLastWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
};

/**
 * Fetch news articles for a given stock symbol
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Array>} Array of news articles
 */
const fetchNewsData = async (symbol) => {
  try {
    const newsResponse = await axios.get(`${BASE_URL}/query`, {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: symbol,
        topics: 'earnings,financial_markets,mergers_and_acquisitions',
        time_from: getLastWeek(),
        sort: 'RELEVANCE',
        limit: 10,
        apikey: API_KEY
      }
    });

    if (!newsResponse.data.feed) {
      return [];
    }

    return newsResponse.data.feed
      .filter(article => {
        // Filter for high-relevance financial news
        const isRelevant = article.relevance_score >= 0.6;
        const hasFinancialKeywords = FINANCIAL_KEYWORDS.some(
          keyword => (
            article.title?.toLowerCase().includes(keyword.toLowerCase()) ||
            article.summary?.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        return isRelevant && hasFinancialKeywords;
      })
      .map(article => ({
        title: article.title,
        url: article.url,
        time_published: article.time_published,
        summary: article.summary,
        source: article.source,
        sentiment: article.overall_sentiment_score,
        relevance: Math.round(article.relevance_score * 100)
      }))
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

/**
 * Fetch stock data for a given symbol
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Object>} Formatted stock data
 */
/**
 * Validates and formats company overview data
 * @param {Object} overview - Raw company overview data
 * @returns {Object} Formatted company data
 */
/**
 * Formats company information with proper formatting
 * @param {Object} overview - Raw company overview data
 * @returns {Object} Formatted company information
 */
const formatCompanyData = (overview) => ({
  name: overview.Name || 'N/A',
  symbol: overview.Symbol || 'N/A',
  description: overview.Description || 'No description available',
  sector: overview.Sector || 'N/A',
  industry: overview.Industry || 'N/A',
  employees: overview.FullTimeEmployees ? formatLargeNumber(overview.FullTimeEmployees) : 'N/A'
});

/**
 * Validates and formats financial metrics
 * @param {Object} overview - Raw company overview data
 * @returns {Object} Formatted financial metrics
 */
/**
 * Formats financial metrics with proper units and formatting
 * @param {Object} overview - Raw company overview data
 * @returns {Object} Formatted financial metrics
 */
const formatFinancialData = (overview) => ({
  'Market Cap': overview.MarketCapitalization ? formatLargeNumber(overview.MarketCapitalization) : 'N/A',
  'P/E Ratio': overview.PERatio ? `${Number(overview.PERatio).toFixed(2)}x` : 'N/A',
  'EPS (TTM)': overview.EPS ? formatCurrency(overview.EPS) : 'N/A',
  'Dividend Yield': overview.DividendYield ? formatPercentage(overview.DividendYield) : 'N/A',
  'Profit Margin': overview.ProfitMargin ? formatPercentage(overview.ProfitMargin) : 'N/A',
  'Revenue (TTM)': overview.RevenueTTM ? formatLargeNumber(overview.RevenueTTM) : 'N/A',
  'Operating Margin': overview.OperatingMarginTTM ? formatPercentage(overview.OperatingMarginTTM) : 'N/A'
});

/**
 * Fetches and formats stock data for a given symbol
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Object>} Formatted stock data with company info, financials, and news
 * @throws {Error} When API request fails or returns invalid data
 */
export const getStockData = async (symbol) => {
  if (!symbol) {
    return DEFAULT_METRICS;
  }

  try {
    // Fetch company overview
    const overviewResponse = await axios.get(`${BASE_URL}/query`, {
      params: {
        function: ENDPOINTS.OVERVIEW,
        symbol,
        apikey: API_KEY
      }
    });

    if (!overviewResponse.data || overviewResponse.data['Error Message']) {
      console.warn(`Invalid data received for symbol: ${symbol}`);
      return DEFAULT_METRICS;
    }

    const overview = overviewResponse.data;

    // Fetch news data
    const news = await fetchNewsData(symbol);

    // Format and validate the data
    return {
      company: formatCompanyData(overview),
      financials: formatFinancialData(overview),
      future: {
        'Growth Rate (5Y)': overview.RevenueTTM ? formatPercentage(overview.RevenueTTM) : 'N/A',
        'Forward P/E': overview.ForwardPE ? `${Number(overview.ForwardPE).toFixed(2)}x` : 'N/A',
        'PEG Ratio': overview.PEGRatio ? `${Number(overview.PEGRatio).toFixed(2)}x` : 'N/A',
        'Analyst Target': overview.AnalystTargetPrice ? formatCurrency(overview.AnalystTargetPrice) : 'N/A',
        'EPS Growth (YoY)': overview.EpsGrowthYOY ? formatPercentage(overview.EpsGrowthYOY) : 'N/A',
        'Revenue Growth (YoY)': overview.RevenueGrowthYOY ? formatPercentage(overview.RevenueGrowthYOY) : 'N/A'
      },
      risks: {
        'Beta': overview.Beta ? Number(overview.Beta).toFixed(2) : 'N/A',
        '52-Week High': overview['52WeekHigh'] ? formatCurrency(overview['52WeekHigh']) : 'N/A',
        '52-Week Low': overview['52WeekLow'] ? formatCurrency(overview['52WeekLow']) : 'N/A',
        'Price Range %': overview['52WeekHigh'] && overview['52WeekLow'] ? 
          formatPercentage((overview['52WeekHigh'] - overview['52WeekLow']) / overview['52WeekLow']) : 'N/A',
        'Debt to Equity': overview.DebtToEquityRatio ? `${Number(overview.DebtToEquityRatio).toFixed(2)}x` : 'N/A',
        'Current Ratio': overview.CurrentRatio ? Number(overview.CurrentRatio).toFixed(2) : 'N/A'
      },
      news: news || []
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return DEFAULT_METRICS;
  }
};

/**
 * Fetches data from a specific Alpha Vantage endpoint
 * @param {string} endpoint - API endpoint to fetch from
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Object>} API response data
 */
const fetchEndpoint = async (endpoint, symbol) => {
  const response = await axios.get(BASE_URL, {
    params: {
      function: endpoint,
      symbol,
      apikey: API_KEY
    }
  });
  return response.data;
};

/**
 * Handles API errors and throws appropriate error messages
 * @param {Error} error - Error object from API call
 * @throws {Error} With user-friendly error message
 */
const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
      case 429:
        throw new Error(ERROR_MESSAGES.RATE_LIMIT);
      case 404:
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      default:
        throw new Error(ERROR_MESSAGES.DEFAULT);
    }
  }
  throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
};
