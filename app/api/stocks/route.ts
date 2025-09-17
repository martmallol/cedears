import { NextRequest, NextResponse } from 'next/server';
import { portfolioPersonalAPI } from '@/lib/portfolio-personal-api';
import { FearGreedCalculator } from '@/lib/fear-greed-calculator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const merval = searchParams.get('merval');
    const withFearGreed = searchParams.get('withFearGreed') === 'true';

    if (symbol) {
      // Get specific stock info
      const stockInfo = await portfolioPersonalAPI.getStockInfo(symbol);
      
      if (stockInfo) {
        const result = withFearGreed 
          ? FearGreedCalculator.calculateStockFearGreed(stockInfo)
          : stockInfo;
        
        return NextResponse.json({ 
          success: true, 
          data: result 
        });
      } else {
        return NextResponse.json(
          { error: 'Stock not found' },
          { status: 404 }
        );
      }
    } else if (merval === 'true') {
      // Get Merval stocks with fear & greed calculation
      const marketData = await portfolioPersonalAPI.getMervalStocks();
      
      if (marketData.success && withFearGreed) {
        const stocksWithFearGreed = marketData.data.map(stock => 
          FearGreedCalculator.calculateStockFearGreed(stock)
        );
        
        const overallIndex = FearGreedCalculator.calculateOverallIndex(stocksWithFearGreed);
        
        return NextResponse.json({
          success: true,
          data: stocksWithFearGreed,
          overallIndex,
          lastUpdate: new Date().toISOString()
        });
      }
      
      return NextResponse.json(marketData);
    } else {
      // Get available symbols
      const symbols = await portfolioPersonalAPI.getAvailableSymbols();
      return NextResponse.json({ 
        success: true, 
        data: symbols 
      });
    }
  } catch (error) {
    console.error('Stocks API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols, withFearGreed = false } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'Symbols array is required' },
        { status: 400 }
      );
    }

    const marketData = await portfolioPersonalAPI.getMarketData(symbols);
    
    if (marketData.success && withFearGreed) {
      const stocksWithFearGreed = marketData.data.map(stock => 
        FearGreedCalculator.calculateStockFearGreed(stock)
      );
      
      const overallIndex = FearGreedCalculator.calculateOverallIndex(stocksWithFearGreed);
      
      return NextResponse.json({
        success: true,
        data: stocksWithFearGreed,
        overallIndex,
        lastUpdate: new Date().toISOString()
      });
    }
    
    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Stocks API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
