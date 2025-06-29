"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Landmark,
  BarChart3,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Available instruments for each category
const availableInstruments = {
  stocks: {
    SPY: "SPDR S&P 500 ETF Trust",
    AAPL: "Apple Inc.",
    TSLA: "Tesla, Inc.",
    NVDA: "NVIDIA Corporation",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
  },
  cedears: {
    "AAPL.BA": "Apple Inc. CEDEAR",
    "TSLA.BA": "Tesla Inc. CEDEAR",
    "MSFT.BA": "Microsoft Corp. CEDEAR",
    "NVDA.BA": "NVIDIA Corp. CEDEAR",
  },
  bonds: {
    AL30: "Bonos República Argentina USD 2030",
    GD30: "Bonos República Argentina USD 2030",
    TX26: "Letras del Tesoro USD 2026",
    AE38: "Bonos República Argentina USD 2038",
  },
}

type InstrumentCategory = keyof typeof availableInstruments
type InstrumentData = {
  name: string
  symbol: string
  type: string
  currentPrice: number
  change: number
  changePercent: number
  brokers: Array<{
    name: string
    price: number
    commission: number
    spread: number
    lastUpdated: string
  }>
  lastUpdated: string
  ratio?: string
  maturity?: string
  coupon?: string
  usdRate?: number
}

export function StockComparison() {
  const [selectedCategory, setSelectedCategory] = useState<InstrumentCategory>("stocks")
  const [selectedInstrument, setSelectedInstrument] = useState<string>("SPY")
  const [instrumentData, setInstrumentData] = useState<Record<string, InstrumentData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const currentInstrument = instrumentData[selectedInstrument]

  const sortedBrokers = useMemo(() => {
    if (!currentInstrument) return []

    return [...currentInstrument.brokers]
      .map((broker) => ({
        ...broker,
        totalCost: broker.price + broker.commission + broker.spread,
      }))
      .sort((a, b) => a.totalCost - b.totalCost)
  }, [currentInstrument])

  const bestPrice = sortedBrokers[0]?.totalCost || 0
  const worstPrice = sortedBrokers[sortedBrokers.length - 1]?.totalCost || 0
  const maxSavings = worstPrice - bestPrice

  const fetchData = async (category: InstrumentCategory, symbols: string[]) => {
    setLoading(true)
    setError(null)

    try {
      const symbolsParam = symbols.join(",")
      const response = await fetch(`/api/${category}?symbols=${symbolsParam}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} data`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setInstrumentData(data)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: InstrumentCategory) => {
    setSelectedCategory(category)
    const firstInstrument = Object.keys(availableInstruments[category])[0]
    setSelectedInstrument(firstInstrument)

    // Fetch data for the new category
    const symbols = Object.keys(availableInstruments[category])
    fetchData(category, symbols)
  }

  const handleRefresh = () => {
    const symbols = Object.keys(availableInstruments[selectedCategory])
    fetchData(selectedCategory, symbols)
  }

  // Initial data fetch
  useEffect(() => {
    const symbols = Object.keys(availableInstruments[selectedCategory])
    fetchData(selectedCategory, symbols)
  }, []) // Only run on mount

  const getCategoryIcon = (category: InstrumentCategory) => {
    switch (category) {
      case "stocks":
        return <BarChart3 className="h-4 w-4" />
      case "cedears":
        return <Building2 className="h-4 w-4" />
      case "bonds":
        return <Landmark className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getCurrencySymbol = (category: InstrumentCategory) => {
    return category === "stocks" ? "$" : category === "cedears" ? "$" : "$"
  }

  const formatPrice = (price: number, category: InstrumentCategory) => {
    if (category === "cedears") {
      return price.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }
    return price.toFixed(2)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Select Investment Type
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastRefresh && (
                <span className="text-sm text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</span>
              )}
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as InstrumentCategory)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stocks" className="flex items-center gap-2">
                {getCategoryIcon("stocks")}
                Stocks & ETFs
              </TabsTrigger>
              <TabsTrigger value="cedears" className="flex items-center gap-2">
                {getCategoryIcon("cedears")}
                CEDEARs
              </TabsTrigger>
              <TabsTrigger value="bonds" className="flex items-center gap-2">
                {getCategoryIcon("bonds")}
                Bonds
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Instrument Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getCategoryIcon(selectedCategory)}
            Select {selectedCategory === "stocks" ? "Stock/ETF" : selectedCategory === "cedears" ? "CEDEAR" : "Bond"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Choose a ${selectedCategory.slice(0, -1)} to compare`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableInstruments[selectedCategory]).map(([symbol, name]) => (
                <SelectItem key={symbol} value={symbol}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{symbol}</span>
                    <span className="text-sm text-muted-foreground ml-2">{name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Fetching live pricing data...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {currentInstrument && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                  <p className="text-2xl font-bold">
                    {getCurrencySymbol(selectedCategory)}
                    {formatPrice(currentInstrument.currentPrice, selectedCategory)}
                  </p>
                  <p className={`text-sm ${currentInstrument.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {currentInstrument.change >= 0 ? "+" : ""}
                    {formatPrice(currentInstrument.change, selectedCategory)} (
                    {currentInstrument.changePercent.toFixed(2)}%)
                  </p>
                </div>
                {currentInstrument.change >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Best Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getCurrencySymbol(selectedCategory)}
                    {formatPrice(bestPrice, selectedCategory)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Worst Price</p>
                  <p className="text-2xl font-bold text-red-600">
                    {getCurrencySymbol(selectedCategory)}
                    {formatPrice(worstPrice, selectedCategory)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Max Savings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getCurrencySymbol(selectedCategory)}
                    {formatPrice(maxSavings, selectedCategory)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Broker Comparison */}
      {currentInstrument && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentInstrument.name} ({currentInstrument.symbol}) - Live Broker Comparison
            </CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>Type: {currentInstrument.type}</span>
              {selectedCategory === "cedears" && currentInstrument.ratio && (
                <span>• Ratio: {currentInstrument.ratio}</span>
              )}
              {selectedCategory === "cedears" && currentInstrument.usdRate && (
                <span>• USD Rate: ${currentInstrument.usdRate.toFixed(2)}</span>
              )}
              {selectedCategory === "bonds" && currentInstrument.maturity && (
                <>
                  <span>• Maturity: {currentInstrument.maturity}</span>
                  <span>• Coupon: {currentInstrument.coupon}</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Live data • Sorted by total cost (price + commission + spread)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedBrokers.map((broker, index) => {
                const savings = broker.totalCost - bestPrice
                const isLowest = index === 0
                const isHighest = index === sortedBrokers.length - 1

                return (
                  <div
                    key={broker.name}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isLowest
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                        : isHighest
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                          : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                        <div>
                          <h3 className="font-semibold">{broker.name}</h3>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>
                              Price: {getCurrencySymbol(selectedCategory)}
                              {formatPrice(broker.price, selectedCategory)}
                            </span>
                            <span>
                              Commission: {getCurrencySymbol(selectedCategory)}
                              {formatPrice(broker.commission, selectedCategory)}
                            </span>
                            <span>
                              Spread: {getCurrencySymbol(selectedCategory)}
                              {formatPrice(broker.spread, selectedCategory)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {getCurrencySymbol(selectedCategory)}
                          {formatPrice(broker.totalCost, selectedCategory)}
                        </p>
                        {savings > 0 && (
                          <p className="text-sm text-red-600">
                            +{getCurrencySymbol(selectedCategory)}
                            {formatPrice(savings, selectedCategory)} vs best
                          </p>
                        )}
                      </div>

                      {isLowest && (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                          Best Price
                        </Badge>
                      )}
                      {isHighest && <Badge variant="destructive">Highest Price</Badge>}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
