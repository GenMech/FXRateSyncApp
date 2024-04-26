import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private fxRates: Record<string, number> = {}; // Object to store FX rates

  async fetchFXRates(): Promise<void> {
    try {
      // Make HTTP request to Alpha Vantage API
      const response = await axios.get(
        `https://www.alphavantage.co/query`, // API endpoint
        {
          params: {
            function: 'CURRENCY_EXCHANGE_RATE', // Function to get exchange rate
            from_currency: 'USD', // Base currency
            to_currency: 'EUR', // Target currency
            apikey: process.env.ALPHA_VANTAGE_API_KEY, // Your Alpha Vantage API key
          },
        },
      );

      // Parse response and store FX rate in memory
      const { data } = response;
      console.log('data:', data);
      const exchangeRate =
        data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
      this.fxRates['USD-EUR'] = parseFloat(exchangeRate);
    } catch (error) {
      console.error('Error fetching FX rates:', error);
    }
  }

  // Method to get FX rate for a given currency pair
  getFXRate(currencyPair: string): number {
    return this.fxRates[currencyPair] || 0; // Return 0 if rate not found
  }
}
