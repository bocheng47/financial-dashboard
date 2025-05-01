import axios from 'axios';
import { API_KEY, BASE_URL, ENDPOINTS } from '../constants/api';

/**
 * Analyzes news sentiment based on content
 * @param {string} title - News article title
 * @param {string} summary - News article summary
 * @returns {Object} Sentiment analysis result
 */
const analyzeSentiment = (title = '', summary = '') => {
  const text = (title + ' ' + summary).toLowerCase();
  const positiveWords = ['surge', 'jump', 'gain', 'rise', 'positive', 'growth', 'profit', 'success', 'boost', 'improve'];
  const negativeWords = ['fall', 'drop', 'decline', 'loss', 'negative', 'risk', 'concern', 'weak', 'fail', 'down'];

  const positiveScore = positiveWords.reduce((score, word) => 
    score + (text.includes(word) ? 1 : 0), 0);
  const negativeScore = negativeWords.reduce((score, word) => 
    score + (text.includes(word) ? 1 : 0), 0);

  if (positiveScore > negativeScore) {
    return { sentiment: 'positive', impact: 'Potentially positive impact on stock price' };
  } else if (negativeScore > positiveScore) {
    return { sentiment: 'negative', impact: 'May have negative effect on stock performance' };
  }
  return { sentiment: 'neutral', impact: 'Limited immediate impact expected' };
};

/**
 * Formats a news article with additional analysis
 * @param {Object} article - Raw news article data
 * @returns {Object} Formatted article with sentiment analysis
 */
const formatNewsArticle = (article) => {
  const sentiment = analyzeSentiment(article.title, article.summary);
  return {
    title: article.title,
    summary: article.summary,
    url: article.url,
    source: article.source || 'Financial News',
    published_at: article.timePublished || article.published_at || new Date().toISOString(),
    ...sentiment
  };
};

/**
 * Fetches and analyzes news articles for a given stock symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Array>} Array of analyzed news articles
 */
export const getNewsData = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/query`, {
      params: {
        function: ENDPOINTS.NEWS,
        symbol,
        apikey: API_KEY,
        limit: 10 // Limit to most recent and relevant news
      }
    });

    const articles = response.data.feed || [];
    return articles
      .map(formatNewsArticle)
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  } catch (error) {
    console.error('Error fetching news data:', error);
    return [];
  }
};

/**
 * Get relevant financial news for a stock symbol
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Array>} Filtered and processed news articles
 */
export const getStockNews = async (symbol) => {
  try {
    // Fetch news with better filtering parameters
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: symbol,
        topics: 'financial_markets,earnings,mergers_and_acquisitions,finance,technology',
        time_from: getLastWeek(),
        limit: 10,
        sort: 'RELEVANCE',
        apikey: API_KEY
      }
    });

    if (!response.data.feed) {
      return [];
    }

    // Process and filter news articles
    return response.data.feed
      .filter(article => {
        // Filter for high-relevance financial news
        const isRelevant = (
          article.overall_sentiment_score && // Has sentiment analysis
          article.relevance_score >= 0.6 && // High relevance to the ticker
          isFinancialContent(article.summary) // Contains financial content
        );
        return isRelevant;
      })
      .map(article => ({
        title: article.title,
        url: article.url,
        time_published: article.time_published,
        summary: article.summary,
        source: article.source,
        sentiment: getSentimentLabel(article.overall_sentiment_score),
        relevance: Math.round(article.relevance_score * 100),
        topics: article.topics || []
      }))
      .slice(0, 5); // Get top 5 most relevant articles
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

/**
 * Get the date for last week in ISO format
 */
const getLastWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
};

/**
 * Check if the content is finance-related
 */
const isFinancialContent = (text) => {
  const financialKeywords = [
    'stock', 'market', 'investor', 'trading', 'earnings',
    'revenue', 'profit', 'financial', 'investment', 'dividend',
    'shares', 'analyst', 'price target', 'valuation', 'growth'
  ];
  
  const lowercaseText = text.toLowerCase();
  return financialKeywords.some(keyword => lowercaseText.includes(keyword));
};

/**
 * Convert sentiment score to label
 */
const getSentimentLabel = (score) => {
  if (score >= 0.35) return 'Bullish';
  if (score >= 0.15) return 'Somewhat Bullish';
  if (score >= -0.15) return 'Neutral';
  if (score >= -0.35) return 'Somewhat Bearish';
  return 'Bearish';
};
