import axios from 'axios';
import { API_KEY, BASE_URL } from '../config';

export const getStockData = async (symbol) => {
  try {
    // Company Overview
    const overviewResponse = await axios.get(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`);
    
    // Global Quote
    const quoteResponse = await axios.get(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    
    // Company Income Statement
    const incomeResponse = await axios.get(`${BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`);

    // Company Earnings
    const earningsResponse = await axios.get(`${BASE_URL}?function=EARNINGS&symbol=${symbol}&apikey=${API_KEY}`);

    const overview = overviewResponse.data;
    const quote = quoteResponse.data['Global Quote'];
    const income = incomeResponse.data.annualReports?.[0] || {};
    const earnings = earningsResponse.data.annualEarnings?.[0] || {};

    return {
      company: {
        'Company Name': overview.Name,
        'Industry Sector': overview.Sector,
        'Description': overview.Description,
        'Stock Exchange': overview.Exchange
      },
      financials: {
        'Market Cap': `$${(parseFloat(overview.MarketCapitalization) / 1e9).toFixed(2)}B`,
        'P/E Ratio': overview.PERatio ? `${parseFloat(overview.PERatio).toFixed(2)}x` : 'N/A',
        'Dividend Yield': overview.DividendYield ? `${parseFloat(overview.DividendYield).toFixed(2)}%` : 'N/A',
        'Annual Revenue': `$${(parseFloat(income.totalRevenue) / 1e9).toFixed(2)}B`
      },
      future: {
        'Growth Estimate': overview.PEGRatio ? `${parseFloat(overview.PEGRatio).toFixed(2)}x` : 'N/A',
        'Profit Margin': `${(parseFloat(overview.ProfitMargin) * 100).toFixed(2)}%`,
        'Target Price': `$${parseFloat(overview.AnalystTargetPrice).toFixed(2)}`,
        'Earnings Per Share': `$${parseFloat(earnings.reportedEPS).toFixed(2)}`
      },
      risks: {
        'Beta Value': overview.Beta ? parseFloat(overview.Beta).toFixed(2) : 'N/A',
        'Price Volatility': quote?.['10. change percent'] ? `${parseFloat(quote['10. change percent']).toFixed(2)}%` : 'N/A',
        '52-Week High': `$${parseFloat(overview['52WeekHigh']).toFixed(2)}`,
        '52-Week Low': `$${parseFloat(overview['52WeekLow']).toFixed(2)}`
      }
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
};
