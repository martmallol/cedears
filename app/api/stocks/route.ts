import { NextResponse } from "next/server"

export async function GET() {
  try {
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
    ]
    const stocksWithFearGreed = mockData.map((stock) => {
      let score = 50

      score += stock.changePercent * 3

      const avgVolume = 1000000
      const volumeRatio = stock.volume / avgVolume
      score += (volumeRatio - 1) * 10

      if (stock.pe < 10)
        score += 10
      else if (stock.pe > 20) score -= 10

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
