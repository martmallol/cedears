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
