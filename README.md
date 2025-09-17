# Merval Fear & Greed Index

A real-time fear and greed index for the Argentine stock market (Merval) built with Next.js and integrated with the Portfolio Personal API.

## Features

- **Real-time Market Data**: Fetches live stock data from Portfolio Personal API
- **Fear & Greed Calculation**: Advanced algorithm that considers price momentum, volume, volatility, and market cap
- **Interactive Dashboard**: Beautiful UI with gauges, charts, and detailed stock information
- **Authentication**: Secure API credential management
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

The Fear & Greed Index calculates market sentiment based on multiple factors:

1. **Price Momentum** (40% weight): Recent price changes indicate market direction
2. **Volume Factor** (20% weight): Trading volume shows market participation and conviction
3. **Volatility Factor** (25% weight): Extreme price movements suggest fear or greed
4. **Market Cap Factor** (15% weight): Larger companies provide stability context

## Getting Started

### Prerequisites

- Node.js 18+ 
- Portfolio Personal account with API access
- API credentials from Portfolio Personal

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cedears
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting Portfolio Personal API Credentials

1. Log in to your Portfolio Personal account
2. Navigate to "Gestiones" → "Gestión de servicio API"
3. Activate the API service if not already activated
4. Copy your credentials:
   - Authorized Client
   - Client Key
   - API Key
   - API Secret

### Using the App

1. **Authentication**: Enter your Portfolio Personal API credentials in the authentication form
2. **View Market Data**: Once authenticated, the app will fetch real-time Merval stock data
3. **Monitor Sentiment**: Watch the overall fear and greed index and individual stock scores
4. **Refresh Data**: Click the refresh button to get the latest market data

## API Integration

The app integrates with the Portfolio Personal API to fetch:

- Real-time stock prices and changes
- Trading volume data
- Market capitalization information
- Historical data for analysis

### API Endpoints Used

- `/api/v1/MarketData/GetStockInfo/{symbol}` - Individual stock data
- `/api/v1/MarketData/GetMarketData` - Multiple stocks data
- `/api/v1/MarketData/GetSymbols` - Available stock symbols

## Stock Coverage

The app focuses on major Merval component stocks including:

- **GGAL** - Grupo Financiero Galicia
- **YPFD** - YPF
- **PAMP** - Pampa Energía
- **TXAR** - Ternium Argentina
- **MIRG** - Mirgor
- **ALUA** - Aluar
- **BMA** - Banco Macro
- **SUPV** - Supervielle
- And more...

## Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Charts**: Recharts
- **API Integration**: Axios
- **State Management**: React hooks

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── stocks/        # Stock data endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # Reusable UI components
│   ├── auth-form.tsx      # Authentication form
│   ├── fear-greed-dashboard.tsx
│   ├── fear-greed-gauge.tsx
│   ├── market-chart.tsx
│   └── stock-list.tsx
├── lib/
│   ├── portfolio-personal-api.ts    # API service
│   ├── fear-greed-calculator.ts     # Sentiment calculation
│   └── utils.ts
└── README.md
```

## Security Notes

- API credentials are stored locally in the browser's localStorage
- Credentials are never shared or transmitted to third parties
- The app uses the Portfolio Personal sandbox environment for testing
- All API calls are made server-side to protect credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and personal use. Please ensure you comply with Portfolio Personal's API terms of service.

## Support

For issues related to:
- **Portfolio Personal API**: Contact Portfolio Personal support
- **App functionality**: Create an issue in this repository

## Disclaimer

This tool is for informational purposes only and should not be considered as financial advice. Always consult with a qualified financial advisor before making investment decisions.
