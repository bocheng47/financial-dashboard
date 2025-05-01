import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getStockData } from './services/stockService';

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getStockData(ticker.toUpperCase());
      setStockData(data);
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Invalid API key. Please check your configuration.');
            break;
          case 429:
            setError('API rate limit exceeded. Please try again later.');
            break;
          case 404:
            setError(`No data found for ticker symbol: ${ticker}`);
            break;
          default:
            setError('Failed to fetch stock data. Please try again.');
        }
      } else if (err.request) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const metricDescriptions = {
    // Company Information
    'Company Name': 'The official registered name of the company',
    'Industry Sector': 'The main industry sector in which the company operates',
    'Description': 'Brief overview of the company\'s business and operations',
    'Stock Exchange': 'The stock exchange where the company\'s shares are traded',
    
    // Financial Metrics
    'Market Cap': 'Total value of all outstanding shares (Price × Shares Outstanding)',
    'P/E Ratio': 'Price to Earnings Ratio - Shows how expensive a stock is relative to its earnings',
    'Dividend Yield': 'Annual dividend payments as a percentage of stock price',
    'Annual Revenue': 'Total money generated from sales over the past year',
    
    // Future Outlook
    'Growth Estimate': 'PEG Ratio - P/E ratio divided by expected growth rate',
    'Profit Margin': 'Percentage of revenue that becomes profit',
    'Target Price': 'Average price target from financial analysts',
    'Earnings Per Share': 'Company\'s profit divided by outstanding shares',
    
    // Risk Metrics
    'Beta Value': 'Measure of stock volatility compared to overall market (>1 more volatile, <1 less volatile)',
    'Price Volatility': 'Percentage of price change over recent period',
    '52-Week High': 'Highest trading price in the last 52 weeks',
    '52-Week Low': 'Lowest trading price in the last 52 weeks'
  };

  const InfoCard = ({ title, data }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
          {title}
        </Typography>
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} my={2} sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 500 }}>
                {key}
              </Typography>
              <Tooltip title={metricDescriptions[key] || 'Information not available'} arrow placement="top">
                <IconButton size="small" sx={{ padding: 0.5 }}>
                  <InfoIcon fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                color: key === 'P/E Ratio' ? 'primary.main' : 'text.primary'
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Financial Dashboard
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Enter Stock Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="e.g., AAPL, MSFT, GOOGL"
          />
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{ mb: 4 }}
            disabled={loading || !ticker}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Information'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {stockData && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoCard title="Company Information" data={stockData.company} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title="Key Financial Metrics" data={stockData.financials} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title="Growth & Future Outlook" data={stockData.future} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title="Risk & Volatility Metrics" data={stockData.risks} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default App;
