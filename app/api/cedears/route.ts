import { NextResponse } from "next/server"

// Mock CEDEAR data with simulated real-time updates
const cedearConfig = {
  "AAPL.BA": {
    name: "Apple Inc. CEDEAR",
    ratio: "1:10",
    basePrice: 19250,
    underlyingSymbol: "AAPL",
  },
  "TSLA.BA": {
    name: "Tesla Inc. CEDEAR",
    ratio: "1:5",
    basePrice: 49750,
    underlyingSymbol: "TSLA",
  },
  "MSFT.BA": {
    name: "Microsoft Corp. CEDEAR",
    ratio: "1:8",
    basePrice: 52400,
    underlyingSymbol: "MSFT",
  },
  "NVDA.BA": {
    name: "NVIDIA Corp. CEDEAR",
    ratio: "1:20",
    basePrice: 43750,
    underlyingSymbol: "NVDA",
  },
}

const argentineBrokers = [
  { name: "Balanz", commissionRate: 0.6, spreadRange: [5, 15] },
  { name: "Bull Market", commissionRate: 0.5, spreadRange: [8, 18] },
  { name: "InvertirOnline", commissionRate: 0.7, spreadRange: [6, 12] },
  { name: "Cocos Capital", commissionRate: 0.4, spreadRange: [10, 20] },
  { name: "Portfolio Personal", commissionRate: 0.8, spreadRange: [7, 16] },
  { name: "Galicia Invest", commissionRate: 0.9, spreadRange: [9, 19] },
]

async function fetchUSDRate(): Promise<number> {
  // Simulate USD/ARS exchange rate - in real implementation, fetch from financial API
  return 350 + (Math.random() - 0.5) * 20 // Mock rate around 350 ARS per USD
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get("symbols")?.split(",") || ["AAPL.BA"]

  try {
    const usdRate = await fetchUSDRate()
    const cedearData: Record<string, any> = {}

    for (const symbol of symbols) {
      const config = cedearConfig[symbol as keyof typeof cedearConfig]
      if (!config) continue

      // Simulate price movement based on time
      const priceVariation = (Math.random() - 0.5) * 200
      const currentPrice = config.basePrice + priceVariation

      const brokers = argentineBrokers.map((broker) => {
        const spreadVariation = broker.spreadRange[0] + Math.random() * (broker.spreadRange[1] - broker.spreadRange[0])

        return {
          name: broker.name,
          price: Number.parseFloat((currentPrice + (Math.random() - 0.5) * 100).toFixed(0)),
          commission: broker.commissionRate,
          spread: Number.parseFloat(spreadVariation.toFixed(0)),
          lastUpdated: new Date().toISOString(),
        }
      })

      cedearData[symbol] = {
        name: config.name,
        symbol,
        type: "CEDEAR",
        ratio: config.ratio,
        underlyingSymbol: config.underlyingSymbol,
        currentPrice,
        usdRate,
        change: priceVariation,
        changePercent: (priceVariation / config.basePrice) * 100,
        brokers,
        lastUpdated: new Date().toISOString(),
      }
    }

    return NextResponse.json(cedearData)
  } catch (error) {
    console.error("CEDEAR API Error:", error)
    return NextResponse.json({ error: "Failed to fetch CEDEAR data" }, { status: 500 })
  }
}
