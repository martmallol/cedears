import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface PortfolioPersonalCredentials {
  authorizedClient: string;
  clientKey: string;
  apiKey: string;
  apiSecret: string;
}

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  lastUpdate: string;
}

export interface MarketDataResponse {
  success: boolean;
  data: StockInfo[];
  error?: string;
}

class PortfolioPersonalAPI {
  private client: AxiosInstance;
  private credentials: PortfolioPersonalCredentials | null = null;
  private baseURL: string;

  constructor(baseURL: string = process.env.PORTFOLIO_PERSONAL_API_URL || 'https://clientapi_sandbox.portfoliopersonal.com') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include authentication headers
    this.client.interceptors.request.use((config) => {
      if (this.credentials) {
        config.headers['AuthorizedClient'] = this.credentials.authorizedClient;
        config.headers['ClientKey'] = this.credentials.clientKey;
        config.headers['ApiKey'] = this.credentials.apiKey;
        config.headers['ApiSecret'] = this.credentials.apiSecret;
      }
      return config;
    });
  }

  /**
   * Set authentication credentials for the API
   */
  setCredentials(credentials: PortfolioPersonalCredentials): void {
    this.credentials = credentials;
  }

  /**
   * Load credentials from environment variables
   */
  loadCredentialsFromEnv(): boolean {
    const authorizedClient = process.env.PORTFOLIO_PERSONAL_AUTHORIZED_CLIENT;
    const clientKey = process.env.PORTFOLIO_PERSONAL_CLIENT_KEY;
    const apiKey = process.env.PORTFOLIO_PERSONAL_API_KEY;
    const apiSecret = process.env.PORTFOLIO_PERSONAL_API_SECRET;

    if (authorizedClient && clientKey && apiKey && apiSecret) {
      this.credentials = {
        authorizedClient,
        clientKey,
        apiKey,
        apiSecret,
      };
      return true;
    }
    return false;
  }

  /**
   * Authenticate with the Portfolio Personal API
   */
  async authenticate(): Promise<boolean> {
    if (!this.credentials) {
      throw new Error('Credentials not set. Please call setCredentials() first.');
    }

    try {
      // Try different possible endpoints to test authentication
      const possibleEndpoints = [
        '/api/1.0/MarketData/Search',
        '/api/1.0/MarketData/SearchInstrument'
      ];

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${this.baseURL}${endpoint}`);
          const response = await this.client.get(endpoint);
          if (response.status === 200) {
            console.log(`✅ Success with endpoint: ${endpoint}`);
            return true;
          }
        } catch (endpointError: any) {
          console.log(`❌ Failed with endpoint ${endpoint}: ${endpointError.response?.status || endpointError.message}`);
        }
      }

      // If all endpoints fail, try a simple health check
      try {
        const healthResponse = await this.client.get('/');
        console.log(`Health check response: ${healthResponse.status}`);
        return healthResponse.status === 200;
      } catch (healthError) {
        console.log(`Health check failed: ${healthError}`);
      }

      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  /**
   * Get stock information for a specific symbol
   */
  async getStockInfo(symbol: string): Promise<StockInfo | null> {
    try {
      const response: AxiosResponse = await this.client.get(
        `/api/v1/MarketData/GetStockInfo/${symbol}`
      );

      if (response.data && response.data.success) {
        return this.transformStockData(response.data.data);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching stock info for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get market data for multiple stocks
   */
  async getMarketData(symbols: string[]): Promise<MarketDataResponse> {
    try {
      const response: AxiosResponse = await this.client.post(
        '/api/v1/MarketData/GetMarketData',
        { symbols }
      );

      if (response.data && response.data.success) {
        const transformedData = response.data.data.map((stock: any) => 
          this.transformStockData(stock)
        );
        return {
          success: true,
          data: transformedData,
        };
      }

      return {
        success: false,
        data: [],
        error: response.data?.error || 'Unknown error',
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get popular Argentine stocks (Merval components)
   */
  async getMervalStocks(): Promise<MarketDataResponse> {
    // Major Merval component stocks
    const mervalSymbols = [
      'GGAL', // Grupo Financiero Galicia
      'PAMP', // Pampa Energía
      'YPFD', // YPF
      'TXAR', // Ternium Argentina
      'MIRG', // Mirgor
      'COME', // Sociedad Comercial del Plata
      'HARG', // Holcim Argentina
      'LOMA', // Loma Negra
      'SUPV', // Supervielle
      'BMA',  // Banco Macro
      'ALUA', // Aluar
      'CRES', // Cresud
      'EDN',  // Edenor
      'GGAL', // Grupo Galicia
      'IRSA', // IRSA
      'LONG', // Longvie
      'MIRG', // Mirgor
      'PAMP', // Pampa Energía
      'SUPV', // Supervielle
      'TXAR', // Ternium Argentina
    ];

    return this.getMarketData(mervalSymbols);
  }

  /**
   * Transform raw API data to our StockInfo interface
   */
  private transformStockData(rawData: any): StockInfo {
    return {
      symbol: rawData.symbol || rawData.Symbol || '',
      name: rawData.name || rawData.Name || rawData.description || '',
      price: parseFloat(rawData.price || rawData.Price || rawData.lastPrice || 0),
      change: parseFloat(rawData.change || rawData.Change || rawData.priceChange || 0),
      changePercent: parseFloat(rawData.changePercent || rawData.ChangePercent || rawData.priceChangePercent || 0),
      volume: parseInt(rawData.volume || rawData.Volume || rawData.tradedVolume || 0),
      marketCap: rawData.marketCap ? parseFloat(rawData.marketCap) : undefined,
      lastUpdate: rawData.lastUpdate || rawData.LastUpdate || new Date().toISOString(),
    };
  }

  /**
   * Get available stock symbols from the API
   */
  async getAvailableSymbols(): Promise<string[]> {
    try {
      const response: AxiosResponse = await this.client.get(
        '/api/v1/MarketData/GetSymbols'
      );

      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching available symbols:', error);
      return [];
    }
  }
}

// Create a singleton instance
export const portfolioPersonalAPI = new PortfolioPersonalAPI();

export default PortfolioPersonalAPI;
