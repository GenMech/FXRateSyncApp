import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Post('/topup') // Route to top up user account
  async topUpAccount(
    @Body() requestBody: { currency: string; amount: number },
  ): Promise<string> {
    const { currency, amount } = requestBody;
    const result = await this.accountService.topUpAccount(currency, amount);
    return result;
  }

  @Get('/balance') // Route to check balance
  async accountBalance(): Promise<{ balances: Record<string, number> }> {
    const result = await this.accountService.getAccountBalance();
    return result;
  }
}
