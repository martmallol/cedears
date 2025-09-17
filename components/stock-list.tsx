"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"
import { FearGreedCalculator } from "@/lib/fear-greed-calculator"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  fearGreedScore: number
  marketCap?: number
  lastUpdate: string
}

interface StockListProps {
  stocks: StockData[]
}

export function StockList({ stocks }: StockListProps) {
  const getScoreColor = (score: number) => FearGreedCalculator.getSentimentBgColor(score);
  const getScoreLabel = (score: number) => FearGreedCalculator.getSentimentLabel(score);

  return (
    <div className="grid gap-4">
      {stocks.map((stock) => (
        <Card key={stock.symbol} className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
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

              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary" className="text-sm">
                  {getScoreLabel(stock.fearGreedScore)}
                </Badge>
                <div className="text-right">
                  <div className="text-lg font-bold mb-1">{stock.fearGreedScore}</div>
                  <Progress value={stock.fearGreedScore} className="w-24 h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
