# 📈 cedears

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Alpha Vantage API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stock-price-comparison.git
   cd stock-price-comparison
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Keys Setup

#### Alpha Vantage (Required for US Stocks)
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free API key
3. Add to your `.env.local` file

#### InvertirOnline (IOL) API (Required for Argentine Market Data)
1. Visit [IOL Developers](https://developers.invertironline.com/)
2. Create an account and obtain your API credentials
3. Get your client credentials from the IOL Developer Portal
4. Add to your `.env.local` file

**IOL API Features:**
- Real-time market data for Argentine stocks, CEDEARs, and bonds
- Portfolio management and trading capabilities
- Historical data and market statistics
- Low latency data feed for professional trading

**Authentication Flow:**
1. **Client Credentials**: Obtain from IOL Developer Portal
2. **Access Token**: Use OAuth 2.0 flow to get bearer token
3. **API Calls**: Include bearer token in Authorization header

**Rate Limits:**
- Production: Up to 1000 requests per minute
- Sandbox: Up to 100 requests per minute

#### Environment Variables
```env
# Required
ALPHA_VANTAGE_API_KEY=your_api_key_here

# IOL API Configuration
IOL_CLIENT_ID=your_iol_client_id
IOL_CLIENT_SECRET=your_iol_client_secret
IOL_USERNAME=your_iol_username
IOL_PASSWORD=your_iol_password
IOL_BASE_URL=https://api.invertironline.com

# Optional (for production)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── stocks/            # US stocks API endpoint
│   │   ├── cedears/           # CEDEARs API endpoint
│   │   └── bonds/             # Bonds API endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── stock-comparison.tsx   # Main comparison component
│   ├── theme-toggle.tsx       # Theme switcher
│   └── theme-provider.tsx     # Theme context
├── lib/
│   └── utils.ts               # Utility functions
├── public/                    # Static assets
└── README.md                  # This file
```

## 🔌 API Endpoints

### GET /api/stocks
Fetches real-time US stock data with broker comparisons.

**Parameters:**
- `symbols`: Comma-separated stock symbols (e.g., "AAPL,TSLA,SPY")

**Response:**
```json
{
  "AAPL": {
    "name": "Apple Inc.",
    "symbol": "AAPL",
    "type": "Stock",
    "currentPrice": 192.45,
    "change": 2.34,
    "changePercent": 1.23,
    "brokers": [
      {
        "name": "Fidelity",
        "price": 192.45,
        "commission": 0,
        "spread": 0.02,
        "lastUpdated": "2024-01-15T10:30:00Z"
      }
    ],
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/cedears
Fetches CEDEAR pricing with Argentine broker data.

**Parameters:**
- `symbols`: Comma-separated CEDEAR symbols (e.g., "AAPL.BA,TSLA.BA")

### GET /api/bonds
Fetches government bond pricing data.

**Parameters:**
- `symbols`: Comma-separated bond symbols (e.g., "AL30,GD30")

## 🎨 Customization

### Adding New Brokers

1. **Update API routes** (`app/api/[category]/route.ts`):
   ```typescript
   const brokerConfig = {
     "New Broker": { 
       commissionRate: 0.5, 
       spreadMultiplier: 1.0002 
     },
     // ... existing brokers
   }
   ```

2. **The UI will automatically update** to include the new broker in comparisons.

### Adding New Instruments

1. **Update available instruments** in `components/stock-comparison.tsx`:
   ```typescript
   const availableInstruments = {
     stocks: {
       "NEW": "New Stock Name",
       // ... existing stocks
     }
   }
   ```

2. **Add pricing logic** in the corresponding API route.

### Theme Customization

The app uses Tailwind CSS with CSS variables for theming. Customize colors in `app/globals.css`:

```css
:root {
  --primary: 220 14.3% 95.9%;
  --primary-foreground: 220.9 39.3% 11%;
  /* ... other variables */
}
```

## 🧪 Testing

### Running Tests
```bash
npm run test
# or
yarn test
```

### API Testing
Test API endpoints directly:
```bash
curl "http://localhost:3000/api/stocks?symbols=AAPL,TSLA"
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - automatic deployments on push

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Build for Production
```bash
npm run build
npm start
```

## 📊 Supported Assets

### US Stocks & ETFs
- **SPY** - SPDR S&P 500 ETF Trust
- **AAPL** - Apple Inc.
- **TSLA** - Tesla, Inc.
- **NVDA** - NVIDIA Corporation
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc.
- **AMZN** - Amazon.com Inc.

### CEDEARs (Argentine Market)
- **AAPL.BA** - Apple Inc. CEDEAR (1:10 ratio)
- **TSLA.BA** - Tesla Inc. CEDEAR (1:5 ratio)
- **MSFT.BA** - Microsoft Corp. CEDEAR (1:8 ratio)
- **NVDA.BA** - NVIDIA Corp. CEDEAR (1:20 ratio)

### Government Bonds
- **AL30** - Bonos República Argentina USD 2030
- **GD30** - Bonos República Argentina USD 2030
- **TX26** - Letras del Tesoro USD 2026
- **AE38** - Bonos República Argentina USD 2038

## 🔧 Troubleshooting

### Common Issues

#### API Rate Limits
- **Problem**: "API call frequency exceeded"
- **Solution**: Alpha Vantage free tier has 5 calls/minute limit
- **Fix**: Upgrade to premium or implement caching

#### Missing Environment Variables
- **Problem**: App shows mock data only
- **Solution**: Ensure `ALPHA_VANTAGE_API_KEY` is set correctly

#### CORS Errors
- **Problem**: Direct API calls failing
- **Solution**: Use Next.js API routes (already implemented)

### Debug Mode
Enable debug logging:
```bash
DEBUG=true npm run dev
```

## 🙏 Acknowledgments

- **[Alpha Vantage](https://www.alphavantage.co/)** - Real-time stock data API
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Next.js](https://nextjs.org/)** - React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

---

**Built with ❤️ using Next.js 15 and modern web technologies**

For more information, visit our [documentation](https://github.com/yourusername/stock-price-comparison/wiki) or [live demo](https://stock-comparison-demo.vercel.app).
