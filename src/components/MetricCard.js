import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * @component MetricCard
 * @description A card component to display financial metrics with a title and optional tooltip
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {Object} props.metrics - Key-value pairs of metrics to display
 * @param {Object} props.tooltips - Key-value pairs of tooltip content for each metric
 * 
 * @example
 * <MetricCard
 *   title="Financial Metrics"
 *   metrics={{ 'P/E Ratio': '25.4x', 'Market Cap': '$2.5B' }}
 *   tooltips={{ 'P/E Ratio': 'Price to Earnings Ratio' }}
 * />
 */
/**
 * MetricCard component for displaying financial metrics
 * @param {string} title - Card title
 * @param {Object} metrics - Key-value pairs of metrics to display
 * @param {Object} tooltips - Key-value pairs of tooltip content
 */
const MetricCard = ({ title, metrics = {}, tooltips = {} }) => {
  // Format metric key for display (e.g., 'market_cap' -> 'Market Cap')
  const formatMetricKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const hasPositiveValue = (value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue > 0;
  };

  const hasNegativeValue = (value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue < 0;
  };
  return (
    <Card
      sx={{
        height: '100%',
        p: 1,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      }}
    >
      <CardContent sx={{ height: '100%', p: 2 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            borderBottom: '2px solid',
            borderImage: 'linear-gradient(to right, #1976d2, #42a5f5) 1',
            pb: 1,
            mb: 2
          }}
        >
          {title}
        </Typography>
        {Object.entries(metrics).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.5,
              px: 2,
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.04)'
              },
              '&:not(:last-child)': {
                borderBottom: '1px solid',
                borderColor: 'divider'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 500,
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {formatMetricKey(key)}
              </Typography>
              {tooltips[key] && (
                <Tooltip title={tooltips[key]} arrow placement="top">
                  <IconButton 
                  size="small" 
                  sx={{ 
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                >
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: hasPositiveValue(value) ? 'success.main' : 
                       hasNegativeValue(value) ? 'error.main' : 
                       key.includes('Ratio') ? 'primary.main' : 
                       'text.primary',
                transition: 'color 0.2s ease-in-out'
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
