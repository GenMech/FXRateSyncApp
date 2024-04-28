import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FXConversionDto } from './app.dto';

export type RateResponse = {
  quoteId: string;
  rate: number;
  timestamp: number;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async fetchFXRates(): Promise<string> {
    try {
      await this.appService.fetchFXRates();
      return 'FX rates fetched and stored:';
    } catch (error) {
      console.log(error);
      return 'Oops, There is some problem!';
    }
  }

  @Get('/fx-rates')
  async getFxRates(): Promise<any> {
    const rates: RateResponse = await this.appService.getFXRate('USD-EUR');

    const expiryDate = new Date(rates.timestamp);
    const formattedExpiryDate = expiryDate.toISOString();

    return { quoteId: rates.quoteId, expiry_at: formattedExpiryDate };
  }

  @Post('/fx-conversion')
  async convertFX(@Body() fxConversionDto: FXConversionDto): Promise<any> {
    const { quoteId, fromCurrency, toCurrency, amount } = fxConversionDto;
    const result = await this.appService.convertFX(
      quoteId,
      fromCurrency,
      toCurrency,
      amount,
    );
    return result;
  }
}
