"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"
import { getStockLogo } from "@/lib/stock-logos"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  fearGreedScore: number
}

interface StockListProps {
  stocks: StockData[]
}

export function StockList({ stocks }: StockListProps) {
  const getScoreLabel = (score: number) => {
    if (score < 20) return "Extreme Fear"
    if (score < 40) return "Fear"
    if (score < 60) return "Neutral"
    if (score < 80) return "Greed"
    return "Extreme Greed"
  }

  // Get color based on value (same as gauge)
  const getScoreColor = (val: number) => {
    if (val < 20) return "#dc2626" // Red
    if (val < 40) return "#ea580c" // Orange
    if (val < 60) return "#eab308" // Yellow
    if (val < 80) return "#22c55e" // Green
    return "#059669" // Dark Green
  }

  return (
    <div className="grid gap-4">
      {stocks.map((stock) => (
        <Card key={stock.symbol} className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {getStockLogo(stock.symbol) ? (
                    <img
                      src={getStockLogo(stock.symbol)!}
                      alt={`${stock.symbol} logo`}
                      className="w-12 h-12 rounded-full object-contain bg-white border border-gray-200"
                      onError={(e) => {
                        // Fallback to a placeholder if logo fails to load
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-xs font-bold text-gray-500">{stock.symbol.slice(0, 2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                    <span className="text-muted-foreground">{stock.name}</span>
                  </div>

                <div className="flex items-center gap-6 mb-3">
                  <div>
                    <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                  </div>

                  <div className={`flex items-center gap-1 ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)} ({stock.changePercent.toFixed(1)}%)
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">Vol: {stock.volume.toLocaleString()}</div>
                </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div 
                    className="text-4xl font-bold mb-1" 
                    style={{ color: getScoreColor(stock.fearGreedScore) }}
                  >
                    {Math.round(stock.fearGreedScore)}
                  </div>
                  <div 
                    className="text-sm font-medium" 
                    style={{ color: getScoreColor(stock.fearGreedScore), opacity: 0.7 }}
                  >
                    {getScoreLabel(stock.fearGreedScore)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
