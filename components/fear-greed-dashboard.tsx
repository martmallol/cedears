"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, RefreshCw, Activity, BarChart3 } from "lucide-react"
import { FearGreedGauge } from "./fear-greed-gauge"
import { StockList } from "./stock-list"
import { MarketChart } from "./market-chart"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  fearGreedScore: number
}

export function FearGreedDashboard() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [overallIndex, setOverallIndex] = useState(45)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  // Mock data for demonstration - replace with actual API calls
  const mockStocks: StockData[] = [
    {
      symbol: "GGAL",
      name: "Grupo Galicia",
      price: 285.5,
      change: 12.3,
      changePercent: 4.5,
      volume: 1250000,
      fearGreedScore: 65,
    },
    {
      symbol: "YPFD",
      name: "YPF",
      price: 18.75,
      change: -0.85,
      changePercent: -4.3,
      volume: 890000,
      fearGreedScore: 25,
    },
    {
      symbol: "PAMP",
      name: "Pampa Energía",
      price: 45.2,
      change: 2.1,
      changePercent: 4.9,
      volume: 650000,
      fearGreedScore: 72,
    },
    {
      symbol: "TXAR",
      name: "Ternium Argentina",
      price: 52.8,
      change: -1.2,
      changePercent: -2.2,
      volume: 420000,
      fearGreedScore: 38,
    },
    {
      symbol: "ALUA",
      name: "Aluar",
      price: 8.95,
      change: 0.45,
      changePercent: 5.3,
      volume: 780000,
      fearGreedScore: 78,
    },
    {
      symbol: "MIRG",
      name: "Mirgor",
      price: 1850.0,
      change: 75.0,
      changePercent: 4.2,
      volume: 125000,
      fearGreedScore: 68,
    },
  ]

  useEffect(() => {
    // Simulate initial data load
    setStocks(mockStocks)
    calculateOverallIndex(mockStocks)
    setLastUpdate(new Date())
    setMounted(true)
  }, [])

  const calculateOverallIndex = (stockData: StockData[]) => {
    const avgScore = stockData.reduce((sum, stock) => sum + stock.fearGreedScore, 0) / stockData.length
    setOverallIndex(Math.round(avgScore))
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate updated data
    const updatedStocks = mockStocks.map((stock) => ({
      ...stock,
      price: stock.price + (Math.random() - 0.5) * 2,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 8,
      fearGreedScore: Math.max(0, Math.min(100, stock.fearGreedScore + (Math.random() - 0.5) * 20)),
    }))

    setStocks(updatedStocks)
    calculateOverallIndex(updatedStocks)
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const getIndexLabel = (score: number) => {
    if (score >= 75) return "Extreme Greed"
    if (score >= 55) return "Greed"
    if (score >= 45) return "Neutral"
    if (score >= 25) return "Fear"
    return "Extreme Fear"
  }

  const getIndexColor = (score: number) => {
    if (score >= 75) return "text-red-600"
    if (score >= 55) return "text-orange-500"
    if (score >= 45) return "text-yellow-500"
    if (score >= 25) return "text-blue-500"
    return "text-red-700"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Merval Fear & Greed Index</h1>
          <p className="text-muted-foreground">Real-time sentiment analysis for Argentine stock market</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {mounted && lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
          </div>
          <Button onClick={refreshData} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Index Card */}
      <Card className="bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Overall Market Sentiment</CardTitle>
          <CardDescription>Composite fear and greed index for Merval stocks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <FearGreedGauge value={overallIndex} />
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="stocks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stocks" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Stocks
          </TabsTrigger>
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Chart
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <StockList stocks={stocks} />
        </TabsContent>

        <TabsContent value="chart">
          <MarketChart />
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Volatility Index</span>
                  <Badge variant="outline">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Trading Volume</span>
                  <Badge variant="outline">Above Average</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Market Momentum</span>
                  <Badge variant="outline">Bullish</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Bullish Stocks</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Bearish Stocks</span>
                    <span>33%</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
