import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  ThemeProvider,
  CssBaseline,
  Tabs,
  Tab
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ArticleIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import { theme } from './theme';
import useStockData from './hooks/useStockData';
import MetricCard from './components/MetricCard';
import NewsCard from './components/NewsCard';
import { ERROR_MESSAGES } from './constants/api';

/**
 * Main application component for the Financial Dashboard
 */
function App() {
  const [ticker, setTicker] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { loading, error, setError, stockData, fetchStockData } = useStockData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker) return;
    
    setError(null);
    await fetchStockData(ticker.toUpperCase());
  };

  const METRIC_DESCRIPTIONS = {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ mb: 4 }}
          >
            Financial Dashboard
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)'
            }}
          >
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ 
                display: 'flex', 
                gap: 2,
                alignItems: 'flex-start'
              }}
            >
              <TextField
                fullWidth
                label="Enter Stock Symbol (e.g., AAPL, MSFT)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  sx: { fontSize: '1.1rem' }
                }}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={loading || !ticker}
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                sx={{ px: 4, py: 1.8 }}
              >
                {loading ? 'Loading...' : 'Search'}
              </Button>
        </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  '& .MuiAlert-message': { fontSize: '1rem' }
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>

          {stockData && (
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    minHeight: 'auto',
                    py: 1.5
                  }
                }}
              >
                <Tab 
                  icon={<ShowChartIcon />} 
                  label="Financial Metrics" 
                  iconPosition="start"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                />
                <Tab 
                  icon={<ArticleIcon />} 
                  label="Latest News" 
                  iconPosition="start"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                />
              </Tabs>

              {activeTab === 0 ? (
                loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid 
                    container 
                    spacing={3} 
                    sx={{ 
                      '& .MuiCard-root': { 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <MetricCard 
                        title="Company Information" 
                        metrics={stockData.company}
                        tooltips={METRIC_DESCRIPTIONS}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MetricCard 
                        title="Key Financial Metrics" 
                        metrics={stockData.financials}
                        tooltips={METRIC_DESCRIPTIONS}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MetricCard 
                        title="Growth & Future Outlook" 
                        metrics={stockData.future || {}}
                        tooltips={METRIC_DESCRIPTIONS} 
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MetricCard 
                        title="Risk & Volatility Metrics" 
                        metrics={stockData.risks || {}}
                        tooltips={METRIC_DESCRIPTIONS} 
                      />
                    </Grid>
                  </Grid>
                )
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <NewsCard news={stockData.news} />
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
