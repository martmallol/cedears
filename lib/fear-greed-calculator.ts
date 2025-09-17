import { StockInfo } from './portfolio-personal-api';

export interface FearGreedData extends StockInfo {
  fearGreedScore: number;
}

/**
 * Calculate Fear & Greed Index for individual stocks and overall market
 */
export class FearGreedCalculator {
  
  /**
   * Calculate fear and greed score for a single stock based on multiple factors
   */
  static calculateStockFearGreed(stock: StockInfo): FearGreedData {
    const factors = this.calculateFactors(stock);
    const score = this.combineFactors(factors);
    
    return {
      ...stock,
      fearGreedScore: Math.max(0, Math.min(100, Math.round(score)))
    };
  }

  /**
   * Calculate various market sentiment factors
   */
  private static calculateFactors(stock: StockInfo) {
    return {
      // Price momentum factor (0-100)
      priceMomentum: this.calculatePriceMomentum(stock.changePercent),
      
      // Volume factor (0-100) - higher volume suggests more conviction
      volumeFactor: this.calculateVolumeFactor(stock.volume),
      
      // Volatility factor (0-100) - extreme moves suggest fear/greed
      volatilityFactor: this.calculateVolatilityFactor(stock.changePercent),
      
      // Market cap factor (0-100) - larger stocks tend to be more stable
      marketCapFactor: this.calculateMarketCapFactor(stock.marketCap || 0)
    };
  }

  /**
   * Calculate price momentum score
   */
  private static calculatePriceMomentum(changePercent: number): number {
    // Normalize change percentage to 0-100 scale
    // Strong positive moves (>5%) = high greed (80-100)
    // Moderate positive moves (1-5%) = moderate greed (60-80)
    // Small moves (-1% to 1%) = neutral (40-60)
    // Moderate negative moves (-5% to -1%) = moderate fear (20-40)
    // Strong negative moves (<-5%) = high fear (0-20)
    
    if (changePercent >= 5) return Math.min(100, 80 + (changePercent - 5) * 2);
    if (changePercent >= 1) return 60 + (changePercent - 1) * 5;
    if (changePercent >= -1) return 50 + changePercent * 10;
    if (changePercent >= -5) return 30 + (changePercent + 5) * 7.5;
    return Math.max(0, 20 + (changePercent + 5) * 4);
  }

  /**
   * Calculate volume factor score
   */
  private static calculateVolumeFactor(volume: number): number {
    // Higher volume suggests more market participation and conviction
    // This is a simplified calculation - in reality, you'd compare to average volume
    
    if (volume >= 2000000) return 80; // Very high volume
    if (volume >= 1000000) return 70; // High volume
    if (volume >= 500000) return 60;  // Above average volume
    if (volume >= 100000) return 50;  // Average volume
    if (volume >= 50000) return 40;   // Below average volume
    return 30; // Low volume
  }

  /**
   * Calculate volatility factor score
   */
  private static calculateVolatilityFactor(changePercent: number): number {
    // Extreme moves in either direction suggest fear or greed
    const absChange = Math.abs(changePercent);
    
    if (absChange >= 10) return 90; // Extreme volatility
    if (absChange >= 7) return 80;  // High volatility
    if (absChange >= 5) return 70;  // Moderate-high volatility
    if (absChange >= 3) return 60;  // Moderate volatility
    if (absChange >= 1) return 50;  // Low volatility
    return 40; // Very low volatility
  }

  /**
   * Calculate market cap factor score
   */
  private static calculateMarketCapFactor(marketCap: number): number {
    // Larger companies tend to be more stable and less prone to extreme sentiment
    if (marketCap >= 10000000000) return 60; // Very large cap (>10B)
    if (marketCap >= 1000000000) return 55;  // Large cap (>1B)
    if (marketCap >= 100000000) return 50;   // Mid cap (>100M)
    if (marketCap >= 10000000) return 45;    // Small cap (>10M)
    return 40; // Micro cap
  }

  /**
   * Combine all factors into a final score
   */
  private static combineFactors(factors: {
    priceMomentum: number;
    volumeFactor: number;
    volatilityFactor: number;
    marketCapFactor: number;
  }): number {
    // Weighted combination of factors
    const weights = {
      priceMomentum: 0.4,    // Most important factor
      volumeFactor: 0.2,     // Volume indicates conviction
      volatilityFactor: 0.25, // Volatility indicates sentiment extremes
      marketCapFactor: 0.15  // Market cap provides stability context
    };

    return (
      factors.priceMomentum * weights.priceMomentum +
      factors.volumeFactor * weights.volumeFactor +
      factors.volatilityFactor * weights.volatilityFactor +
      factors.marketCapFactor * weights.marketCapFactor
    );
  }

  /**
   * Calculate overall market fear and greed index
   */
  static calculateOverallIndex(stocks: FearGreedData[]): number {
    if (stocks.length === 0) return 50; // Neutral if no data
    
    // Calculate weighted average based on market cap and volume
    let totalWeight = 0;
    let weightedSum = 0;

    stocks.forEach(stock => {
      const weight = (stock.marketCap || 0) * (stock.volume || 1);
      weightedSum += stock.fearGreedScore * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 
           Math.round(stocks.reduce((sum, stock) => sum + stock.fearGreedScore, 0) / stocks.length);
  }

  /**
   * Get sentiment label based on score
   */
  static getSentimentLabel(score: number): string {
    if (score >= 75) return "Extreme Greed";
    if (score >= 55) return "Greed";
    if (score >= 45) return "Neutral";
    if (score >= 25) return "Fear";
    return "Extreme Fear";
  }

  /**
   * Get sentiment color class based on score
   */
  static getSentimentColor(score: number): string {
    if (score >= 75) return "text-red-600";
    if (score >= 55) return "text-orange-500";
    if (score >= 45) return "text-yellow-500";
    if (score >= 25) return "text-blue-500";
    return "text-red-700";
  }

  /**
   * Get sentiment background color class based on score
   */
  static getSentimentBgColor(score: number): string {
    if (score >= 75) return "bg-red-500";
    if (score >= 55) return "bg-orange-500";
    if (score >= 45) return "bg-yellow-500";
    if (score >= 25) return "bg-blue-500";
    return "bg-red-600";
  }
}
