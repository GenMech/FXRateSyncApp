import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RateResponse } from './app.controller';
import { v4 as uuidv4 } from 'uuid';
import { UtilsService } from './utils/utils.service';

@Injectable()
export class AppService {
  constructor(private readonly utilityService: UtilsService) {}
  getHello(): string {
    return 'Hello World!';
  }

  private fxRates: Record<
    string,
    { quoteId: string; rate: number; lastRefreshed: Date }
  > = {};

  // Method to fetch Rates from Alphavantage
  async fetchFXRates(): Promise<void> {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: 'USD',
          to_currency: 'EUR',
          apikey: process.env.ALPHA_VANTAGE_API_KEY,
        },
      });

      const { data } = response;
      const exchangeRate =
        data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];
      const lastRefreshed = new Date(
        data['Realtime Currency Exchange Rate']?.['6. Last Refreshed'],
      );

      if (!exchangeRate) {
        throw new Error('Not able to fetch rate');
      }

      this.fxRates['USD-EUR'] = {
        quoteId: '',
        rate: exchangeRate,
        lastRefreshed,
      };
    } catch (error) {
      console.error('Error fetching FX rates:', error);
      throw error;
    }
  }

  // Method to get FX conversion rate
  async getFXRate(currencyPair: string): Promise<RateResponse> {
    const id = uuidv4();
    this.fxRates['USD-EUR'].quoteId = id;

    const storedRate = this.fxRates[currencyPair];
    if (!storedRate) await this.fetchFXRates();

    if (!this.utilityService.isRateValid(storedRate?.lastRefreshed)) {
      await this.fetchFXRates();
    }

    return {
      quoteId: storedRate?.quoteId,
      rate: storedRate?.rate,
      timestamp: storedRate?.lastRefreshed.getTime() + 30 * 1000,
    };
  }

  // Mehtod to convert currency uning FX rate
  async convertFX(
    quoteId: string,
    fromCurrency: string,
    toCurrency: string,
    amount: number,
  ): Promise<any> {
    const fxRate = await this.fetchFXRateUsingQuoteId(
      quoteId,
      fromCurrency,
      toCurrency,
    );
    const convertedAmount = amount * fxRate;
    return { convertedAmount: convertedAmount, currency: toCurrency };
  }

  async fetchFXRateUsingQuoteId(
    quoteId: string,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    const currencyPair = `${fromCurrency}-${toCurrency}`;
    const fxRateData = this.fxRates[currencyPair];

    if (fxRateData?.quoteId !== quoteId) {
      throw new Error('Not Found');
    }

    if (!this.utilityService.isRateValid(fxRateData?.lastRefreshed)) {
      await this.fetchFXRates();
    }

    return fxRateData.rate;
  }
}
