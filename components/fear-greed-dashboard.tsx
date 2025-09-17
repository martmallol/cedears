"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, RefreshCw, Activity, BarChart3, AlertCircle } from "lucide-react"
import { FearGreedGauge } from "./fear-greed-gauge"
import { StockList } from "./stock-list"
import { MarketChart } from "./market-chart"
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

export function FearGreedDashboard() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [overallIndex, setOverallIndex] = useState(45)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check environment credentials and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setIsAuthenticated(true);
          await fetchMervalData();
        } else {
          setError('API credentials not found in environment variables. Please check your .env file.');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setError('Failed to connect to API. Please check your environment configuration.');
      }
    };
    
    initializeApp();
  }, []);

  const fetchMervalData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stocks?merval=true&withFearGreed=true');
      const data = await response.json();
      
      if (data.success) {
        setStocks(data.data);
        setOverallIndex(data.overallIndex);
        setLastUpdate(new Date(data.lastUpdate));
      } else {
        setError(data.error || 'Failed to fetch market data');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    if (!isAuthenticated) {
      setError('API credentials not available. Please check your environment configuration.');
      return;
    }
    await fetchMervalData();
  }

  const getIndexLabel = (score: number) => FearGreedCalculator.getSentimentLabel(score);
  const getIndexColor = (score: number) => FearGreedCalculator.getSentimentColor(score);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Merval Fear & Greed Index</h1>
          <p className="text-muted-foreground">Real-time sentiment analysis for Argentine stock market</p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="text-sm text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</div>
              <Button onClick={refreshData} disabled={isLoading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Main Content */}
      {isAuthenticated ? (
        <>
          {/* Main Index Card */}
          <Card className="bg-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Overall Market Sentiment</CardTitle>
              <CardDescription>Composite fear and greed index for Merval stocks</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <FearGreedGauge value={overallIndex} />
              <div className="text-center">
                <div className="text-4xl font-bold">{overallIndex}</div>
                <Badge variant="secondary" className={`text-lg ${getIndexColor(overallIndex)}`}>
                  {getIndexLabel(overallIndex)}
                </Badge>
              </div>
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
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading market data...</span>
                </div>
              ) : (
                <StockList stocks={stocks} />
              )}
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
                        <span>{Math.round((stocks.filter(s => s.fearGreedScore >= 55).length / stocks.length) * 100)}%</span>
                      </div>
                      <Progress value={(stocks.filter(s => s.fearGreedScore >= 55).length / stocks.length) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Bearish Stocks</span>
                        <span>{Math.round((stocks.filter(s => s.fearGreedScore < 45).length / stocks.length) * 100)}%</span>
                      </div>
                      <Progress value={(stocks.filter(s => s.fearGreedScore < 45).length / stocks.length) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <div className="text-muted-foreground">Loading market data...</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
