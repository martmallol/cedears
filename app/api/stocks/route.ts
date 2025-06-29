import { NextResponse } from "next/server"

// Mock API for demonstration - replace with real API keys
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo"

interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
}

// Simulate different broker spreads and commissions
const brokerConfig = {
  Fidelity: { commissionRate: 0, spreadMultiplier: 1.0001 },
  "Charles Schwab": { commissionRate: 0, spreadMultiplier: 1.0002 },
  "E*TRADE": { commissionRate: 0, spreadMultiplier: 1.0003 },
  "TD Ameritrade": { commissionRate: 0, spreadMultiplier: 1.0002 },
  "Interactive Brokers": { commissionRate: 1, spreadMultiplier: 1.0001 },
  Robinhood: { commissionRate: 0, spreadMultiplier: 1.0005 },
  Webull: { commissionRate: 0, spreadMultiplier: 1.0003 },
}

async function fetchStockPrice(symbol: string): Promise<StockQuote> {
  try {
    // Using Alpha Vantage API for real stock data
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch stock data")
    }

    const data = await response.json()
    const quote = data["Global Quote"]

    if (!quote || Object.keys(quote).length === 0) {
      // Fallback to mock data if API limit reached or demo key
      return getMockStockData(symbol)
    }

    return {
      symbol: quote["01. symbol"],
      price: Number.parseFloat(quote["05. price"]),
      change: Number.parseFloat(quote["09. change"]),
      changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
    }
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return getMockStockData(symbol)
  }
}

function getMockStockData(symbol: string): StockQuote {
  const mockPrices: Record<string, number> = {
    SPY: 445.23,
    AAPL: 192.45,
    TSLA: 248.75,
    NVDA: 875.32,
    MSFT: 419.65,
    GOOGL: 138.21,
    AMZN: 155.89,
  }

  const basePrice = mockPrices[symbol] || 100
  const randomChange = (Math.random() - 0.5) * 10

  return {
    symbol,
    price: basePrice + randomChange,
    change: randomChange,
    changePercent: (randomChange / basePrice) * 100,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get("symbols")?.split(",") || ["SPY"]

  try {
    const stockData: Record<string, any> = {}

    for (const symbol of symbols) {
      const quote = await fetchStockPrice(symbol)

      // Generate broker prices based on the real price
      const brokers = Object.entries(brokerConfig).map(([name, config]) => {
        const adjustedPrice = quote.price * config.spreadMultiplier
        const spread = adjustedPrice - quote.price

        return {
          name,
          price: Number.parseFloat(adjustedPrice.toFixed(2)),
          commission: config.commissionRate,
          spread: Number.parseFloat(spread.toFixed(3)),
          lastUpdated: new Date().toISOString(),
        }
      })

      stockData[symbol] = {
        name: getStockName(symbol),
        symbol: quote.symbol,
        type: symbol.includes("ETF") || ["SPY", "QQQ", "IWM"].includes(symbol) ? "ETF" : "Stock",
        currentPrice: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        brokers,
        lastUpdated: new Date().toISOString(),
      }
    }

    return NextResponse.json(stockData)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}

function getStockName(symbol: string): string {
  const names: Record<string, string> = {
    SPY: "SPDR S&P 500 ETF Trust",
    AAPL: "Apple Inc.",
    TSLA: "Tesla, Inc.",
    NVDA: "NVIDIA Corporation",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
  }
  return names[symbol] || `${symbol} Corporation`
}
