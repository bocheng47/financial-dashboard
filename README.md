# Financial Dashboard

A modern React-based financial dashboard that provides real-time stock information and metrics using the Alpha Vantage API.

## Features

- 🔍 Real-time stock data lookup
- 📊 Comprehensive financial metrics
- 💡 Informative tooltips for each metric
- 📱 Responsive Material-UI design

## Key Information Displayed

### Company Information
- Company Name and Description
- Industry Sector
- Stock Exchange

### Financial Metrics
- Market Cap
- P/E Ratio
- Dividend Yield
- Annual Revenue

### Growth & Future Outlook
- Growth Estimate (PEG Ratio)
- Profit Margin
- Target Price
- Earnings Per Share

### Risk & Volatility Metrics
- Beta Value
- Price Volatility
- 52-Week High/Low

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Alpha Vantage API key (get it from [Alpha Vantage](https://www.alphavantage.co/support/#api-key))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bocheng47/financial-dashboard.git
cd financial-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Alpha Vantage API key:
```
REACT_APP_ALPHA_VANTAGE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Material-UI](https://mui.com/) - UI components
- [Alpha Vantage API](https://www.alphavantage.co/) - Financial data provider

## Deployment

The project is configured for deployment on Netlify. Simply connect your GitHub repository to Netlify and it will automatically build and deploy your site.

Remember to add your Alpha Vantage API key to your Netlify environment variables:
- Key: `REACT_APP_ALPHA_VANTAGE_API_KEY`
- Value: Your API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
