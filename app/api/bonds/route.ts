import { NextResponse } from "next/server"

const bondConfig = {
  AL30: {
    name: "Bonos República Argentina USD 2030",
    type: "Government Bond",
    maturity: "2030-07-09",
    coupon: "1.00%",
    basePrice: 32.5,
  },
  GD30: {
    name: "Bonos República Argentina USD 2030",
    type: "Government Bond",
    maturity: "2030-07-09",
    coupon: "1.00%",
    basePrice: 32.75,
  },
  TX26: {
    name: "Letras del Tesoro USD 2026",
    type: "Treasury Bill",
    maturity: "2026-01-15",
    coupon: "0.00%",
    basePrice: 85.2,
  },
  AE38: {
    name: "Bonos República Argentina USD 2038",
    type: "Government Bond",
    maturity: "2038-01-09",
    coupon: "8.75%",
    basePrice: 45.8,
  },
}

const bondBrokers = [
  { name: "Balanz", commissionRate: 0.25, spreadRange: [0.04, 0.1] },
  { name: "Bull Market", commissionRate: 0.2, spreadRange: [0.07, 0.12] },
  { name: "InvertirOnline", commissionRate: 0.3, spreadRange: [0.05, 0.08] },
  { name: "Cocos Capital", commissionRate: 0.15, spreadRange: [0.09, 0.15] },
  { name: "Portfolio Personal", commissionRate: 0.35, spreadRange: [0.06, 0.11] },
  { name: "Galicia Invest", commissionRate: 0.4, spreadRange: [0.08, 0.13] },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get("symbols")?.split(",") || ["AL30"]

  try {
    const bondData: Record<string, any> = {}

    for (const symbol of symbols) {
      const config = bondConfig[symbol as keyof typeof bondConfig]
      if (!config) continue

      // Simulate bond price movement (typically less volatile)
      const priceVariation = (Math.random() - 0.5) * 2
      const currentPrice = config.basePrice + priceVariation

      const brokers = bondBrokers.map((broker) => {
        const spreadVariation = broker.spreadRange[0] + Math.random() * (broker.spreadRange[1] - broker.spreadRange[0])

        return {
          name: broker.name,
          price: Number.parseFloat((currentPrice + (Math.random() - 0.5) * 0.5).toFixed(2)),
          commission: broker.commissionRate,
          spread: Number.parseFloat(spreadVariation.toFixed(3)),
          lastUpdated: new Date().toISOString(),
        }
      })

      bondData[symbol] = {
        name: config.name,
        symbol,
        type: config.type,
        maturity: config.maturity,
        coupon: config.coupon,
        currentPrice,
        change: priceVariation,
        changePercent: (priceVariation / config.basePrice) * 100,
        brokers,
        lastUpdated: new Date().toISOString(),
      }
    }

    return NextResponse.json(bondData)
  } catch (error) {
    console.error("Bond API Error:", error)
    return NextResponse.json({ error: "Failed to fetch bond data" }, { status: 500 })
  }
}
