import stockWebsites from './stocks-websites.json'

export interface StockWebsites {
  [symbol: string]: string
}

const websites: StockWebsites = stockWebsites

/**
 * Get the logo URL for a stock symbol using Clearbit Logo API
 * @param symbol - Stock symbol (e.g., "GGAL", "YPFD")
 * @returns Logo URL or null if not found
 */
export function getStockLogo(symbol: string): string | null {
  const website = websites[symbol]
  if (!website) {
    return null
  }
  
  return `https://logo.clearbit.com/${website}`
}

/**
 * Get all available stock symbols with websites
 * @returns Array of stock symbols
 */
export function getAvailableStockSymbols(): string[] {
  return Object.keys(websites)
}

/**
 * Check if a stock symbol has a logo available
 * @param symbol - Stock symbol
 * @returns Boolean indicating if logo is available
 */
export function hasStockLogo(symbol: string): boolean {
  return symbol in websites
} 