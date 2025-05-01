import { useState, useCallback } from 'react';
import { getStockData } from '../services/stockService';

/**
 * Custom hook for fetching and managing stock data
 * @returns {Object} Stock data state and functions
 */
const useStockData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState({
    company: {
      name: '',
      symbol: '',
      description: '',
      sector: '',
      industry: '',
      employees: ''
    },
    financials: {
      'Market Cap': '',
      'P/E Ratio': '',
      'EPS': '',
      'Dividend Yield': '',
      'Profit Margin': '',
      '52-Week High': '',
      '52-Week Low': ''
    },
    news: []
  });

  /**
   * Fetch stock data for a given symbol
   * @param {string} symbol - Stock ticker symbol
   */
  const fetchStockData = useCallback(async (symbol) => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getStockData(symbol.toUpperCase());
      if (data) {
        setStockData(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setError,
    stockData,
    fetchStockData
  };
};

export default useStockData;
