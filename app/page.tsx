import { StockComparison } from "@/components/stock-comparison"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Stock Price Comparison</h1>
          <p className="text-muted-foreground">Find the best broker prices for your favorite stocks</p>
        </div>
        <StockComparison />
      </div>
    </div>
  )
}
