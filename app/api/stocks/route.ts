import { NextResponse } from "next/server"

// Mock API endpoint - replace with actual Portfolio Personal API integration
export async function GET() {
  try {
    // This is where you would integrate with the Portfolio Personal API
    // const response = await fetch('https://clientapi_sandbox.portfoliopersonal.com/api/stocks', {
    //   headers: {
    //     'Authorization': 'Bearer YOUR_API_KEY',
    //     'Content-Type': 'application/json'
    //   }
    // })

    // Mock data for demonstration
    const mockData = [
      {
        symbol: "GGAL",
        name: "Grupo Galicia",
        price: 285.5,
        change: 12.3,
        changePercent: 4.5,
        volume: 1250000,
        marketCap: 15600000000,
        pe: 8.5,
        dividend: 2.3,
      },
      {
        symbol: "YPFD",
        name: "YPF",
        price: 18.75,
        change: -0.85,
        changePercent: -4.3,
        volume: 890000,
        marketCap: 7400000000,
        pe: 12.2,
        dividend: 1.8,
      },
      // Add more stocks as needed
    ]

    // Calculate fear and greed scores based on various factors
    const stocksWithFearGreed = mockData.map((stock) => {
      // Simple fear/greed calculation based on price change, volume, and volatility
      let score = 50 // neutral baseline

      // Price change impact (±30 points)
      score += stock.changePercent * 3

      // Volume impact (±10 points)
      const avgVolume = 1000000
      const volumeRatio = stock.volume / avgVolume
      score += (volumeRatio - 1) * 10

      // PE ratio impact (±10 points)
      if (stock.pe < 10)
        score += 10 // undervalued = greed
      else if (stock.pe > 20) score -= 10 // overvalued = fear

      // Clamp between 0 and 100
      score = Math.max(0, Math.min(100, score))

      return {
        ...stock,
        fearGreedScore: Math.round(score),
      }
    })

    return NextResponse.json(stocksWithFearGreed)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}
