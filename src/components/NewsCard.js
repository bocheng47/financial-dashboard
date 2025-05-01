import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * NewsCard component for displaying financial news
 * @param {Array} news - Array of news items
 */
const NewsCard = ({ news = [] }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <TrendingUpIcon color="success" />;
      case 'negative':
        return <TrendingDownIcon color="error" />;
      default:
        return <TrendingFlatIcon color="action" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          mb: 3,
          borderBottom: 2,
          borderColor: 'primary.main',
          pb: 1,
          display: 'inline-block'
        }}>
          Latest News & Analysis
        </Typography>
        <Stack spacing={3}>
          {news.map((article, index) => (
            <Box
              key={index}
              sx={{
                pb: 2,
                borderBottom: index < news.length - 1 ? 1 : 0,
                borderColor: 'divider'
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(article.published_at || new Date())}
                </Typography>
                <Chip
                  label={article.source}
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'white' }}
                />
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                  {article.title}
                  <IconButton
                    size="small"
                    component="a"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ ml: 1, verticalAlign: 'text-bottom' }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Tooltip title={`Market Impact: ${article.sentiment || 'Neutral'}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getSentimentIcon(article.sentiment)}
                  </Box>
                </Tooltip>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {article.summary}
              </Typography>

              {article.impact && (
                <Typography variant="body2" sx={{
                  color: 'info.main',
                  mt: 1,
                  bgcolor: 'info.lighter',
                  p: 1,
                  borderRadius: 1
                }}>
                  Impact: {article.impact}
                </Typography>
              )}
            </Box>
          ))}
          {news.length === 0 && (
            <Typography variant="body1" color="text.secondary" align="center">
              No news available at the moment.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
